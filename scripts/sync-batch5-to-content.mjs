/**
 * Syncs Batch 5 tax articles from scripts/batch5-sources/*.md into data/content.json
 * Run from business-services-platform: node scripts/sync-batch5-to-content.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcDir = path.join(__dirname, 'batch5-sources');
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
    matchId: 'taxation-cryptocurrency',
    slug: 'taxation-cryptocurrency',
    title:
      'Taxation of Cryptocurrency & Virtual Digital Assets in India (FY 2025-26)',
    category: 'Income Tax & ITR',
    tags: ['VDA', 'cryptocurrency', 'Section 115BBH', 'Section 194S', 'Schedule VDA', 'FY 2025-26'],
    date: '2026-05-02',
  },
  {
    matchId: 'taxation-income-earned-from-selling-shares',
    slug: 'taxation-income-earned-from-selling-shares',
    title: 'Taxation of Income from Selling Shares: Complete Guide for FY 2025-26',
    category: 'Income Tax & ITR',
    tags: ['LTCG', 'STCG', 'equity shares', 'Budget 2024', 'STT', 'AY 2026-27'],
    date: '2026-05-02',
  },
  {
    matchId: 'tax-diwali-new-year-gifts',
    slug: 'tax-diwali-new-year-gifts',
    title:
      'Tax on Diwali and New Year Gifts: Employer, Business & Personal Gifts',
    category: 'Income Tax & ITR',
    tags: ['Diwali gifts', 'perquisites', 'Section 56(2)(x)', 'employer gifts'],
    date: '2026-05-02',
  },
  {
    matchId: 'how-are-gifts-taxed-gift-tax-exemption-relatives-list',
    slug: 'how-are-gifts-taxed-gift-tax-exemption-relatives-list',
    title:
      'How Are Gifts Taxed in India: Gift Tax Exemption & Complete Relatives List',
    category: 'Income Tax & ITR',
    tags: ['Section 56(2)(x)', 'gift tax', 'specified relatives', 'HUF'],
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

const sttSlug = 'securities-transaction-tax-stt-latest-rates-fno-updates';
const sttBody = readBody(sttSlug);
const sttArticle = {
  id: sttSlug,
  title: 'Securities Transaction Tax (STT): Latest Rates, F&O Hike & Updates',
  slug: sttSlug,
  category: 'Income Tax & ITR',
  excerpt: excerptFrom(sttBody),
  content: sttBody,
  author: 'Mridhuv Associates',
  date: '2026-05-02',
  published: true,
  tags: ['STT', 'F&O', 'Budget 2024', 'stock exchange', 'equity', 'options'],
  readingTime: readingTime(sttBody),
};

const existingStt = data.articles.find((a) => a.id === sttArticle.id);
if (existingStt) {
  Object.assign(existingStt, sttArticle);
  console.log('Replaced', sttSlug);
} else {
  const anchor = data.articles.findIndex(
    (a) => a.id === 'taxation-income-earned-from-selling-shares'
  );
  const insertAt = anchor >= 0 ? anchor + 1 : data.articles.length;
  data.articles.splice(insertAt, 0, sttArticle);
  console.log('Inserted', sttSlug, 'at', insertAt);
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n');
fs.writeFileSync(
  path.join(root, 'public', 'content.json'),
  JSON.stringify(data, null, 2) + '\n'
);
console.log('Wrote data/content.json and public/content.json');
