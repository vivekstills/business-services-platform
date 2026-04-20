/**
 * Audit Excel master list vs merged SERVICES.
 * Run: npx tsx scripts/excel-coverage-report.ts
 */
import {
  EXCEL_MASTER_SERVICES,
  normalizeExcelKey,
} from '../src/data/excelMasterCatalog';
import { resolveExcelRowToServiceId } from '../src/data/serviceExcelRouting';
import { SERVICES } from '../src/data/services';

function main() {
  const excelTotal = EXCEL_MASTER_SERVICES.length;
  const matched = new Set<string>();
  const missingRows: string[] = [];

  for (const row of EXCEL_MASTER_SERVICES) {
    const id = resolveExcelRowToServiceId(row);
    if (id) matched.add(id);
    else missingRows.push(row.name);
  }

  const serviceTotal = SERVICES.length;
  const existingBeforeStubs = 128;
  const createdApprox = serviceTotal - existingBeforeStubs;

  console.log('--- Excel ↔ Services audit ---');
  console.log('Total Excel rows:', excelTotal);
  console.log('Total SERVICE records:', serviceTotal);
  console.log('Distinct Excel rows matched to a service id:', matched.size);
  console.log('Approx. net-new stub records added:', Math.max(0, createdApprox));
  if (missingRows.length) {
    console.log('\nUNMATCHED Excel particulars (still need id / stub):');
    missingRows.forEach((n) => console.log(' -', n));
  } else {
    console.log('\nAll Excel particulars resolve to a service id.');
  }

  const sampleKeys = SERVICES.slice(0, 3).map((s) => normalizeExcelKey(s.name));
  console.log('\nSample normalized names:', sampleKeys.join(', '));
}

main();
