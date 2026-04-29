/**
 * Merge scripts/pdf-export/article-02.md … article-08.md into existing CMS articles (PDF batch).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const mdDir = path.join(__dirname, 'pdf-export');

const UPDATES = [
  {
    id: 'difference-between-assessment-year-financial-year',
    file: 'article-02.md',
    excerpt:
      'A Confusion That Trips Up Almost Every First-Time Filer — learn how Financial Year and Assessment Year differ, when to select which on ITR and challans, and common mistakes to avoid.',
    tags: ['Assessment Year', 'Financial Year', 'ITR', 'Income Tax'],
  },
  {
    id: 'what-is-nil-return-who-needs-file-why',
    file: 'article-03.md',
    excerpt:
      'When You Owe Zero Tax, You Might Still Need to File — nil returns, mandatory vs voluntary filing, Section 139(1) triggers, and why filing can still help.',
    tags: ['Nil Return', 'ITR', 'Income Tax', 'Section 139'],
  },
  {
    id: 'income-from-other-sources-residual-head-explained',
    file: 'article-04.md',
    excerpt:
      'Income from Other Sources — the residual head explained: interest, dividends, gifts, gaming winnings, Section 56(2)(x), deductions, and FAQs.',
    tags: ['Income from Other Sources', 'IFOS', 'Section 56', 'Income Tax'],
  },
  {
    id: 'what-is-itr-income-tax-return-guide-beginners',
    file: 'article-05.md',
    excerpt:
      'Your Annual Report Card to the Government — what an ITR is, why it matters, forms ITR-1 to ITR-7, schedules, filing steps, and after-you-file timelines.',
    tags: ['ITR', 'Income Tax Return', 'Tax Filing', 'Section 139'],
  },
  {
    id: 'income-tax-slabs-fy-2025-26-new-regime-vs-old-regime',
    file: 'article-06.md',
    excerpt:
      'Income Tax Slabs for FY 2025-26 — new regime vs old regime: rates, surcharge, Section 87A, regime comparison, and when switching saves tax.',
    tags: ['Tax Slabs', 'New Tax Regime', 'Old Tax Regime', 'FY 2025-26'],
  },
  {
    id: 'standard-deduction-salaried-individuals',
    file: 'article-07.md',
    excerpt:
      'Standard Deduction — what it is, who gets Rs. 75,000 vs Rs. 50,000, how it replaced medical and transport allowances, and ITR tips for job changers.',
    tags: ['Standard Deduction', 'Salary', 'Income Tax', 'New Regime'],
  },
  {
    id: 'income-tax-rebate-under-section-87a',
    file: 'article-08.md',
    excerpt:
      'Section 87A Rebate — zero tax up to Rs. 12 lakh under the new regime (FY 2025-26), marginal relief, exclusions for special-rate income, and FAQs.',
    tags: ['Section 87A', 'Tax Rebate', 'Income Tax', 'New Regime'],
  },
];

function mergeTags(existing, add) {
  return [...new Set([...(existing ?? []), ...add])];
}

function applyFile(rel) {
  const fp = path.join(root, rel);
  const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const articles = data.articles ?? [];
  let n = 0;
  for (const u of UPDATES) {
    const content = fs.readFileSync(path.join(mdDir, u.file), 'utf8').replace(/\r\n/g, '\n').trim();
    const idx = articles.findIndex((a) => a.id === u.id);
    if (idx < 0) {
      console.warn('Skip — no article id:', u.id);
      continue;
    }
    articles[idx] = {
      ...articles[idx],
      content,
      excerpt: u.excerpt,
      date: '2026-04-29',
      published: true,
      tags: mergeTags(articles[idx].tags, u.tags),
    };
    n++;
  }
  fs.writeFileSync(fp, JSON.stringify({ ...data, articles }, null, 2) + '\n', 'utf8');
  console.log(rel, 'updated', n, 'articles');
}

applyFile('data/content.json');
applyFile('public/content.json');
