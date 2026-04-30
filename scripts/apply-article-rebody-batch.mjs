/**
 * Apply markdown bodies from scripts/article-rebody-batch/*.md to articles in data/content.json by slug.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const contentPath = path.join(root, 'data', 'content.json');
const batchDir = path.join(__dirname, 'article-rebody-batch');

const SLUGS = [
  'difference-between-assessment-year-financial-year',
  'itr-filing-last-date-fy-2025-26',
  'income-from-house-property-taxes',
  'income-tax-surcharge-marginal-relief-ay-2026-27',
  'section-44ad-presumptive-scheme-businesses',
  'minimum-alternate-tax-mat-eligibility-calculation',
  'income-tax-slab-women-fy-2025-26-tax-limit-exemptions',
  'section-44bbd-presumptive-taxation-non-residents',
];

const data = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
let n = 0;
for (const slug of SLUGS) {
  const mdPath = path.join(batchDir, `${slug}.md`);
  if (!fs.existsSync(mdPath)) {
    console.error('Missing:', mdPath);
    process.exit(1);
  }
  const body = fs.readFileSync(mdPath, 'utf8').trimEnd().replace(/\r\n/g, '\n');
  const art = data.articles?.find((a) => a.slug === slug);
  if (!art) {
    console.error('No article:', slug);
    process.exit(1);
  }
  art.content = body;
  n++;
}
fs.writeFileSync(contentPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`Updated ${n} articles in`, contentPath);
