/**
 * One-shot patcher: dedupe articles (remove deleted IDs), apply markdown bodies,
 * refresh excerpts/titles. Run from repo root:
 *   node scripts/apply-tax-article-patches.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CONTENT = path.join(ROOT, 'data', 'content.json');
const PATCH_DIR = path.join(__dirname, 'tax-article-patches');

const REMOVE_IDS = new Set([
  'section-80c-cornerstone-tax-planning-india',
  'deductions-under-section-80ccd',
  'save-tax-every-income-level-india-10l-to-1cr',
  'home-loan-tax-benefit-how-save-income-tax-your-home-loan',
  'tax-benefits-children-education-allowance-tuition-fees-school-fees',
  'section-80ggc-income-tax-act-deduction-limit-exceptions',
  'itr-filing-which-form',
]);

function readPatch(filename) {
  return fs.readFileSync(path.join(PATCH_DIR, filename), 'utf8').trimEnd().replace(/\r\n/g, '\n');
}

const PATCHES = [
  {
    id: 'section-80c-complete-guide-india-popular-tax-deduction',
    file: 'section-80c-complete-guide-india-popular-tax-deduction.md',
    excerpt:
      'Complete guide to Section 80C deductions in India — the Rs. 1.5 lakh limit, eligible instruments (EPF, PPF, ELSS, LIC, tuition fees, home loan principal), slab-wise savings, optimization tips, mistakes to avoid, and FAQs.',
  },
  {
    id: 'how-save-tax-different-income-levels-complete-strategy-guide',
    file: 'how-save-tax-different-income-levels-complete-strategy-guide.md',
    title:
      'How to Save Tax at Different Income Levels: Complete Strategy Guide for Rs. 10L to Rs. 1 Crore+',
    excerpt:
      'Income-level-specific tax saving strategies for Rs. 10L, 20L, 30L, 50L, and 1 Crore+ — old vs new regime comparison, surcharge notes, deduction stacking, and actionable tips for every bracket.',
  },
  {
    id: 'which-itr-file-types-itr-forms-applicability',
    file: 'which-itr-file-types-itr-forms-applicability.md',
    title: 'Which ITR Form to File: A Complete Guide to Choosing the Right Form',
    excerpt:
      'A complete guide to all 7 ITR forms — ITR-1 through ITR-7 — with eligibility criteria, who should file which, worked examples for salaried employees, freelancers, NRIs, and business owners, plus an elimination checklist.',
  },
  { id: 'how-save-tax-salary-above-7-lakhs', file: 'how-save-tax-salary-above-7-lakhs.md' },
  { id: 'how-save-tax-salary-above-10-lakhs', file: 'how-save-tax-salary-above-10-lakhs.md' },
  { id: 'how-save-tax-salary-above-12-lakhs', file: 'how-save-tax-salary-above-12-lakhs.md' },
  { id: 'how-save-tax-salary-above-15-lakhs', file: 'how-save-tax-salary-above-15-lakhs.md' },
  { id: 'how-save-tax-salary-above-30-lakhs', file: 'how-save-tax-salary-above-30-lakhs.md' },
  { id: 'how-save-tax-salary-above-50-lakhs', file: 'how-save-tax-salary-above-50-lakhs.md' },
  { id: 'how-save-tax-salary-above-1-crore', file: 'how-save-tax-salary-above-1-crore.md' },
];

const raw = fs.readFileSync(CONTENT, 'utf8');
const data = JSON.parse(raw);

if (!Array.isArray(data.articles)) {
  console.error('content.json missing articles array');
  process.exit(1);
}

const before = data.articles.length;
const removedIds = data.articles.filter((a) => REMOVE_IDS.has(a.id)).map((a) => a.id);
data.articles = data.articles.filter((a) => !REMOVE_IDS.has(a.id));
const removed = before - data.articles.length;
if (removedIds.length > 0 && removedIds.length !== REMOVE_IDS.size) {
  console.warn(
    `Removed ${removed} articles; expected IDs missing from JSON: ${[...REMOVE_IDS].filter((id) => !removedIds.includes(id)).join(', ')}`,
  );
}

for (const p of PATCHES) {
  const body = readPatch(p.file);
  const art = data.articles.find((a) => a.id === p.id);
  if (!art) {
    console.error(`Missing article id: ${p.id}`);
    process.exit(1);
  }
  art.content = body;
  if (p.excerpt) art.excerpt = p.excerpt;
  if (p.title) art.title = p.title;
}

fs.writeFileSync(CONTENT, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`Updated ${CONTENT}`);
console.log(`Removed ${removed} duplicate articles; patched ${PATCHES.length} keepers.`);
