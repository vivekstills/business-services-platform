/**
 * Syncs Batch 1 Tax articles from scripts/batch1-sources/*.md into data/content.json
 * Run from business-services-platform root: node scripts/sync-batch1-to-content.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcDir = path.join(__dirname, 'batch1-sources');
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
    matchId: 'how-make-tax-payment-income-tax-portal-without-logging',
    slug: 'how-make-tax-payment-income-tax-portal-without-logging',
    title: 'How to Make Tax Payment on the Income Tax Portal Without Logging In',
    category: 'Income Tax & ITR',
    tags: ['Income Tax', 'e-Pay Tax', 'Challan 280', 'Advance tax', 'self-assessment'],
    date: '2026-05-02',
  },
  {
    matchId: 'tcs-rates-payment-exemption',
    slug: 'tcs-rates-payment-exemption',
    title: 'Tax Collected at Source (TCS): Rates, Payment and Exemption',
    category: 'Income Tax & ITR',
    tags: ['TCS', 'Section 206C', 'Form 27EQ', 'LRS', 'Income Tax'],
    date: '2026-05-02',
  },
  {
    matchId: 'taxation-of-cooperative-society',
    slug: 'taxation-of-cooperative-society',
    title: 'Taxation of Co-operative Society in India',
    category: 'Income Tax & ITR',
    tags: ['Co-operative Society', 'Section 80P', '115BAD', 'AMT', 'ITR-5'],
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

const dupTcs = data.articles.find((a) => a.id === 'tax-collected-at-source-rates-payment-exemption');
if (dupTcs) {
  dupTcs.published = false;
  console.log('Unpublished duplicate:', dupTcs.slug);
}

const metalSlug = 'gst-tds-metal-scrap-industry';
let metal = data.articles.find((a) => a.slug === metalSlug);
const metalBody = readBody(metalSlug);
const metalMeta = {
  id: metalSlug,
  title: 'TDS Under GST for the Metal Scrap Industry',
  slug: metalSlug,
  category: 'GST & Indirect Tax',
  excerpt: excerptFrom(metalBody),
  content: metalBody,
  author: 'Mridhuv Associates',
  date: '2026-05-02',
  published: true,
  tags: ['GST TDS', 'GSTR-7', 'metal scrap', 'Section 51 CGST', 'CBIC'],
  readingTime: readingTime(metalBody),
};

if (metal) {
  Object.assign(metal, metalMeta);
  console.log('Replaced existing', metalSlug);
} else {
  const idx = data.articles.findIndex((a) => a.id === 'tcs-rates-payment-exemption');
  data.articles.splice(idx >= 0 ? idx : 0, 0, metalMeta);
  console.log('Inserted', metalSlug, 'before tcs-rates index', idx);
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'public', 'content.json'), JSON.stringify(data, null, 2) + '\n');
console.log('Wrote data/content.json and public/content.json');
