import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outPath = path.join(root, 'data', '_tax_article_markdown_generated.json');
const patchDir = path.join(__dirname, 'tax-article-patches');

const j = JSON.parse(fs.readFileSync(outPath, 'utf8'));
delete j['section-80c-cornerstone-tax-planning-india'];
delete j['save-tax-every-income-level-india-10l-to-1cr'];

const b80 = fs
  .readFileSync(path.join(patchDir, 'section-80c-complete-guide-india-popular-tax-deduction.md'), 'utf8')
  .trimEnd();
const bgl = fs
  .readFileSync(path.join(patchDir, 'how-save-tax-different-income-levels-complete-strategy-guide.md'), 'utf8')
  .trimEnd();

j['section-80c-complete-guide-india-popular-tax-deduction'] =
  "# Section 80C: The Complete Guide to India's Most Popular Tax Deduction\n\n" + b80;
j['how-save-tax-different-income-levels-complete-strategy-guide'] =
  '# How to Save Tax at Different Income Levels: Complete Strategy Guide for Rs. 10L to Rs. 1 Crore+\n\n' +
  bgl;

fs.writeFileSync(outPath, JSON.stringify(j, null, 2) + '\n');
console.log('Synced', outPath);
