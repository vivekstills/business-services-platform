import type { Service } from './services';
import { SERVICES } from './services';
import {
  EXCEL_MASTER_SERVICES,
  EXCEL_NAME_TO_SERVICE_ID,
  excelParticularsSlug,
  mainCategoryMenuToSlug,
  normalizeExcelKey,
} from './excelMasterCatalog';

const serviceById = new Map(SERVICES.map((s) => [s.id, s]));

/**
 * Map an Excel particulars row to an existing `Service.id` when possible.
 */
export function resolveExcelRowToServiceId(row: { name: string }): string | undefined {
  const n = normalizeExcelKey(row.name);
  if (EXCEL_NAME_TO_SERVICE_ID[n]) return EXCEL_NAME_TO_SERVICE_ID[n];
  const slugId = excelParticularsSlug(row.name);
  if (serviceById.has(slugId)) return slugId;
  const byExactName = SERVICES.find((s) => normalizeExcelKey(s.name) === n);
  if (byExactName) return byExactName.id;
  return undefined;
}

const DEFAULT_ROUTE_SLUG_BY_CATEGORY: Record<string, string> = {
  registration: 'starts-new-business',
  'new-business': 'starts-new-business',
  'return-filing': 'income-tax',
  'hr-compliance': 'legal-compliance',
  'gst-services': 'goods-services-tax',
  'income-tax': 'income-tax',
  'ngo-registrations': 'starts-new-business',
  'international-incorporations': 'starts-new-business',
  'trademark-ip': 'trademark-ip',
  'legal-compliance': 'legal-compliance',
  'liquor-licenses': 'miscellaneous',
  'mandatory-licenses': 'miscellaneous',
  'web-digital': 'miscellaneous',
  'fema-compliance': 'fema-compliance',
  'food-business-compliance': 'food-business-compliance',
  'import-export-business': 'import-export-business',
  'roc-compliance': 'roc-compliance',
  'professional-tax-compliance': 'professional-tax-compliance',
};

export const SERVICE_ROUTE_SLUG_BY_ID: Record<string, string> = (() => {
  const out: Record<string, string> = {};
  for (const row of EXCEL_MASTER_SERVICES) {
    const sid = resolveExcelRowToServiceId(row);
    if (!sid || out[sid]) continue;
    out[sid] = mainCategoryMenuToSlug(row.mainCategory);
  }
  for (const s of SERVICES) {
    if (!out[s.id]) {
      out[s.id] = s.routeMainCategorySlug ?? DEFAULT_ROUTE_SLUG_BY_CATEGORY[s.categoryId] ?? 'miscellaneous';
    }
  }
  return out;
})();

export function getRouteMainCategorySlug(service: Service): string {
  return service.routeMainCategorySlug ?? SERVICE_ROUTE_SLUG_BY_ID[service.id] ?? 'miscellaneous';
}

export function getServicesByRouteMainSlug(slug: string): Service[] {
  return SERVICES.filter((s) => getRouteMainCategorySlug(s) === slug);
}

export function getExcelMainCategoryTitles(): { slug: string; title: string }[] {
  const seen = new Set<string>();
  const list: { slug: string; title: string }[] = [];
  for (const row of EXCEL_MASTER_SERVICES) {
    const slug = mainCategoryMenuToSlug(row.mainCategory);
    if (seen.has(slug)) continue;
    seen.add(slug);
    list.push({ slug, title: row.mainCategory });
  }
  return list;
}

/** Excel rows that still do not resolve to any `Service.id` (should be empty once stubs are merged). */
export function listUnmatchedExcelParticulars(): string[] {
  const missing: string[] = [];
  for (const row of EXCEL_MASTER_SERVICES) {
    if (!resolveExcelRowToServiceId(row)) missing.push(row.name);
  }
  return missing;
}
