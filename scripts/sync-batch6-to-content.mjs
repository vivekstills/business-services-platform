/**
 * Syncs Batch 6 Tax articles from scripts/batch6-sources/*.md into data/content.json
 * Run from business-services-platform root: node scripts/sync-batch6-to-content.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcDir = path.join(__dirname, 'batch6-sources');
const dataPath = path.join(root, 'data', 'content.json');

function readBody(slug) {
  return fs.readFileSync(path.join(srcDir, `${slug}.md`), 'utf8').trim();
}

function wordCount(md) {
  return md
    .replace(/#{1,6}\s+/g, ' ')
    .replace(/\|/g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

function readingTime(md) {
  const m = Math.max(3, Math.ceil(wordCount(md) / 200));
  return `${m} min read`;
}

function excerptFrom(md, max = 220) {
  const plain = md
    .replace(/^#[^\n]+\n+/m, '')
    .replace(/#{2,}[^\n]+\n/g, ' ')
    .replace(/\|[^|]+\|/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length <= max ? plain : plain.slice(0, max - 1).trim() + '…';
}

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const updates = [
  {
    matchId: 'section-44ab-income-tax-audit-due-date-criteria-audit-report-penalty',
    slug: 'section-44ab-income-tax-audit-due-date-criteria-audit-report-penalty',
    title: 'Section 44AB Income Tax Audit: Applicability, Due Date and Penalty',
    category: 'Income Tax & ITR',
    tags: ['Section 44AB', 'tax audit', 'Form 3CD', 'AY 2026-27'],
    date: '2026-05-02',
  },
  {
    matchId: 'minimum-alternate-tax-mat-eligibility-calculation',
    slug: 'minimum-alternate-tax-mat-eligibility-calculation',
    title: 'Minimum Alternate Tax (MAT): Eligibility, Calculation and Credit',
    category: 'Income Tax & ITR',
    tags: ['MAT', 'Section 115JB', 'corporate tax', 'book profit'],
    date: '2026-05-02',
  },
  {
    matchId: 'income-tax-surcharge-marginal-relief-ay-2026-27',
    slug: 'income-tax-surcharge-marginal-relief-ay-2026-27',
    title: 'Income Tax Surcharge Rates and Marginal Relief for AY 2026-27',
    category: 'Income Tax & ITR',
    tags: ['Surcharge', 'marginal relief', 'AY 2026-27', '115BAC'],
    date: '2026-05-02',
  },
  {
    matchId: 'section-36-expenses-allowed-for-deduction',
    slug: 'section-36-expenses-allowed-for-deduction',
    title: 'Section 36 of Income Tax Act: Expenses Allowed as Deductions',
    category: 'Income Tax & ITR',
    tags: ['Section 36', 'business deductions', 'PGBP', 'Section 43B'],
    date: '2026-05-02',
  },
  {
    matchId: 'section-44b-section-172-income-tax-act',
    slug: 'section-44b-section-172-income-tax-act',
    title: 'Section 44B and Section 172: Income Tax on Shipping Business',
    category: 'Income Tax & ITR',
    tags: ['Section 44B', 'Section 172', 'non-resident', 'shipping', 'DTAA'],
    date: '2026-05-02',
  },
  {
    matchId: 'form-67-claim-foreign-tax-credit',
    slug: 'form-67-claim-foreign-tax-credit',
    title: 'Form 67 and Foreign Tax Credit: How to Claim Relief on Taxes Paid Abroad',
    category: 'Income Tax & ITR',
    tags: ['Form 67', 'foreign tax credit', 'Section 90', 'Section 91', 'Rule 128'],
    date: '2026-05-02',
  },
  {
    matchId: 'income-tax-customer-care-number-helpline-toll-free-number-email-id',
    slug: 'income-tax-customer-care-number-helpline-toll-free-number-email-id',
    title: 'Income Tax Customer Care Number and Helpline: All Contact Details',
    category: 'Income Tax & ITR',
    tags: ['Income Tax helpline', 'CPC', 'e-Nivaran', 'Aaykar Sampark'],
    date: '2026-05-02',
  },
];

for (const u of updates) {
  const art = data.articles.find((a) => a.id === u.matchId);
  if (!art) {
    console.error('Missing article id:', u.matchId);
    process.exit(1);
  }
  const body = readBody(u.slug);
  art.slug = u.slug;
  art.title = u.title;
  art.category = u.category;
  art.tags = u.tags;
  art.date = u.date;
  art.content = body;
  art.excerpt = excerptFrom(body);
  art.readingTime = readingTime(body);
  console.log('Updated', u.slug, art.readingTime);
}

const anchor = data.articles.findIndex(
  (a) => a.id === 'section-44ab-income-tax-audit-due-date-criteria-audit-report-penalty'
);
let insertAt = anchor >= 0 ? anchor + 1 : data.articles.length;

const body44ada = readBody('section-44ada-presumptive-tax-scheme-professionals');
const art44ada = {
  id: 'section-44ada-presumptive-tax-scheme-professionals',
  title: 'Section 44ADA: Presumptive Tax Scheme for Professionals',
  slug: 'section-44ada-presumptive-tax-scheme-professionals',
  category: 'Income Tax & ITR',
  excerpt: excerptFrom(body44ada),
  content: body44ada,
  author: 'Mridhuv Associates',
  date: '2026-05-02',
  published: true,
  tags: ['Section 44ADA', 'presumptive taxation', 'professionals', 'ITR-4'],
  readingTime: readingTime(body44ada),
};
const ex44 = data.articles.find((a) => a.id === art44ada.id);
if (ex44) {
  Object.assign(ex44, art44ada);
  console.log('Replaced', art44ada.slug);
} else {
  data.articles.splice(insertAt, 0, art44ada);
  insertAt++;
  console.log('Inserted', art44ada.slug);
}

const body3cd = readBody('form-3cd-tax-audit-key-clauses-explained');
const art3cd = {
  id: 'form-3cd-tax-audit-key-clauses-explained',
  title: 'Tax Audit Report Form 3CD: Key Clauses Explained',
  slug: 'form-3cd-tax-audit-key-clauses-explained',
  category: 'Income Tax & ITR',
  excerpt: excerptFrom(body3cd),
  content: body3cd,
  author: 'Mridhuv Associates',
  date: '2026-05-02',
  published: true,
  tags: ['Form 3CD', 'Section 44AB', 'tax audit', 'TDS', 'GST reconciliation', 'Clause 44'],
  readingTime: readingTime(body3cd),
};
const ex3 = data.articles.find((a) => a.id === art3cd.id);
if (ex3) {
  Object.assign(ex3, art3cd);
  console.log('Replaced', art3cd.slug);
} else {
  data.articles.splice(insertAt, 0, art3cd);
  console.log('Inserted', art3cd.slug);
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'public', 'content.json'), JSON.stringify(data, null, 2) + '\n');
console.log('Wrote data/content.json and public/content.json');
