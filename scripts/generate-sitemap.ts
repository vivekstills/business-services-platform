/**
 * Regenerates public/sitemap.xml from data/content.json.
 * Uses scripts/service-route-slugs.json only (no src/ imports) so Vercel
 * builds do not load serviceAboutContent (~1MB) during the sitemap step.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const SITE =
  (typeof process !== 'undefined' && process.env.SITEMAP_BASE_URL?.replace(/\/$/, '')) ||
  'https://mridhuvassociates.com';

/** Fallback when a service id is only in content.json (not yet in SERVICES). */
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

type ServiceRow = {
  id: string;
  categoryId?: string;
  routeMainCategorySlug?: string;
};

function loadRouteMap(): Record<string, string> {
  const p = path.join(__dirname, 'service-route-slugs.json');
  const raw = fs.readFileSync(p, 'utf8');
  return JSON.parse(raw) as Record<string, string>;
}

function mainSlug(s: ServiceRow, routeMap: Record<string, string>): string {
  if (s.routeMainCategorySlug?.trim()) return s.routeMainCategorySlug.trim();
  if (routeMap[s.id]) return routeMap[s.id];
  if (s.categoryId && DEFAULT_ROUTE_SLUG_BY_CATEGORY[s.categoryId]) {
    return DEFAULT_ROUTE_SLUG_BY_CATEGORY[s.categoryId];
  }
  return 'miscellaneous';
}

type UrlRow = { loc: string; changefreq: string; priority: string };
const seen = new Set<string>();
const rows: UrlRow[] = [];

function add(locPath: string, changefreq: string, priority: string) {
  const loc = `${SITE}${locPath.startsWith('/') ? locPath : `/${locPath}`}`;
  if (seen.has(loc)) return;
  seen.add(loc);
  rows.push({ loc, changefreq, priority });
}

const content = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'data', 'content.json'), 'utf8')
) as {
  services?: ServiceRow[];
  categories?: { id: string }[];
  articles?: { slug: string; published?: boolean }[];
};

const routeMap = loadRouteMap();
const lastmod = new Date().toISOString().slice(0, 10);

for (const [p, cf, pr] of [
  ['/', 'daily', '1.0'],
  ['/about-us', 'monthly', '0.8'],
  ['/contact-us', 'monthly', '0.8'],
  ['/reviews', 'monthly', '0.7'],
  ['/articles', 'weekly', '0.8'],
  ['/business-search', 'monthly', '0.6'],
  ['/trademark-search', 'monthly', '0.6'],
  ['/privacy-policy', 'yearly', '0.3'],
  ['/refund-policy', 'yearly', '0.3'],
  ['/confidentiality-policy', 'yearly', '0.3'],
  ['/disclaimer-policy', 'yearly', '0.3'],
  ['/terms-conditions', 'yearly', '0.3'],
] as const) {
  add(p, cf, pr);
}

for (const c of content.categories ?? []) {
  if (c?.id) add(`/category/${c.id}`, 'weekly', '0.8');
}

const services = content.services ?? [];
for (const s of services) {
  if (!s?.id) continue;
  const main = mainSlug(s, routeMap);
  add(`/services/${main}/${s.id}`, 'weekly', '0.7');
  add(`/service/${s.id}`, 'weekly', '0.6');
}

for (const a of content.articles ?? []) {
  if (!a?.slug) continue;
  if (a.published === false) continue;
  add(`/articles/${a.slug}`, 'monthly', '0.6');
}

const esc = (u: string) =>
  u.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const body = rows
  .map(
    (r) => `  <url>
    <loc>${esc(r.loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

const outPath = path.join(ROOT, 'public', 'sitemap.xml');
fs.writeFileSync(outPath, xml, 'utf8');
console.log('Wrote', outPath, `(${rows.length} URLs, lastmod ${lastmod})`);
