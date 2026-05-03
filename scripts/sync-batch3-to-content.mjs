/**
 * Syncs Batch 3 Tax articles from scripts/batch3-sources/*.md into data/content.json
 * Run from business-services-platform root: node scripts/sync-batch3-to-content.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcDir = path.join(__dirname, 'batch3-sources');
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
    matchId: 'dearness-allowance-meaning-types-calculation-taxation',
    slug: 'dearness-allowance-meaning-types-calculation-taxation',
    title: 'Dearness Allowance (DA): Meaning, Types, DA Calculation and Tax Treatment',
    category: 'Income Tax & ITR',
    tags: ['Dearness Allowance', 'DA', 'CDA', 'IDA', 'salary', '7th CPC'],
    date: '2026-05-02',
  },
  {
    matchId: 'is-interest-free-loan-from-employer-taxable',
    slug: 'is-interest-free-loan-from-employer-taxable',
    title: 'Is an Interest-Free Loan from Employer Taxable?',
    category: 'Income Tax & ITR',
    tags: ['Perquisite', 'Employer loan', 'Form 12BA', 'SBI benchmark', 'Salary'],
    date: '2026-05-02',
  },
  {
    matchId: 'employer-contribution-nps-taxable-salary',
    slug: 'employer-contribution-nps-taxable-salary',
    title: "Employer's Contribution to NPS in Taxable Salary - Section 80CCD(2)",
    category: 'Income Tax & ITR',
    tags: ['80CCD(2)', 'NPS', 'employer contribution', 'new tax regime', 'Form 16'],
    date: '2026-05-02',
  },
  {
    matchId: 'claiming-relief-under-section-89-salary-arrears',
    slug: 'claiming-relief-under-section-89-salary-arrears',
    title: 'Claiming Relief Under Section 89(1) on Salary Arrears: Complete Guide',
    category: 'Income Tax & ITR',
    tags: ['Section 89(1)', 'Form 10E', 'salary arrears', 'relief', 'ITR'],
    date: '2026-05-02',
  },
  {
    matchId: 'joint-declaration-form-epf',
    slug: 'joint-declaration-form-epf',
    title: 'Joint Declaration Form EPF: Complete Guide to Corrections and Process',
    category: 'Income Tax & ITR',
    tags: ['EPF', 'EPFO', 'UAN', 'Joint Declaration', 'correction'],
    date: '2026-05-02',
  },
  {
    matchId: 'partner-remuneration-calculation',
    slug: 'partner-remuneration-calculation',
    title: "Partner's Remuneration and How It Is Calculated - Section 40(b)",
    category: 'Income Tax & ITR',
    tags: ['Section 40(b)', 'Partnership', 'book profit', 'LLP', 'remuneration'],
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

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'public', 'content.json'), JSON.stringify(data, null, 2) + '\n');
console.log('Wrote data/content.json and public/content.json');
