/**
 * Regenerates scripts/service-route-slugs.json from app route rules.
 * Run after adding/changing services in src/data/services.ts:
 *   npx tsx scripts/generate-route-slugs.ts
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SERVICES } from '../src/data/services';
import { getRouteMainCategorySlug } from '../src/data/serviceExcelRouting';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, 'service-route-slugs.json');

const map = Object.fromEntries(SERVICES.map((s) => [s.id, getRouteMainCategorySlug(s)]));
writeFileSync(out, JSON.stringify(map) + '\n', 'utf8');
console.log('Wrote', out, Object.keys(map).length, 'ids');
