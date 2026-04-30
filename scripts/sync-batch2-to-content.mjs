/**
 * Syncs Batch 2 full bodies from scripts/batch2-sources/*.md into data/content.json
 * Run from repo root: node scripts/sync-batch2-to-content.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcDir = path.join(__dirname, 'batch2-sources');
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
    matchId: 'gst-registration-guide-2024',
    slug: 'gst-registration-guide-2024',
    title: 'Complete Guide to GST Registration in India 2024',
    category: 'GST & Indirect Tax',
    tags: ['GST', 'GST registration', 'GSTIN', 'CGST', 'compliance'],
    date: '2026-04-30',
  },
  {
    matchId: 'private-limited-company-registration',
    slug: 'private-limited-company-registration',
    title: 'How to Register a Private Limited Company in India',
    category: 'Business Registration & MCA',
    tags: ['Private Limited', 'SPICe+', 'MCA', 'incorporation', 'India'],
    date: '2026-04-30',
  },
  {
    matchId: 'trademark-registration-india',
    slug: 'trademark-registration-india',
    title: 'Trademark Registration in India: Complete Process & Classes',
    category: 'Trademark & Intellectual Property',
    tags: ['Trademark', 'Nice classification', 'IP India', 'brand protection'],
    date: '2026-04-30',
  },
  {
    matchId: 'fssai-registration-vs-license',
    slug: 'fssai-registration-vs-license',
    title: 'FSSAI Registration vs FSSAI License: Key Differences Explained',
    category: 'FSSAI & Food Compliance',
    tags: ['FSSAI', 'FoSCoS', 'food license', 'food safety'],
    date: '2026-04-30',
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
  console.log('Updated', u.slug, art.readingTime, 'words ~', wordCount(body));
}

const nps = data.articles.find((a) => a.id === 'section-80ccd-1b-nps-extra-50000-deduction');
if (!nps) {
  console.error('Missing NPS article');
  process.exit(1);
}
const npsBody = readBody('deductions-under-section-80ccd');
nps.slug = 'deductions-under-section-80ccd';
nps.title = 'Section 80CCD(1B): The Extra Rs. 50,000 Deduction Most People Miss';
nps.category = 'Income Tax & ITR';
nps.tags = ['80CCD(1B)', 'NPS', 'tax deduction', 'Tier I', 'old regime'];
nps.date = '2026-04-30';
nps.content = npsBody;
nps.excerpt = excerptFrom(npsBody);
nps.readingTime = readingTime(npsBody);
console.log('Updated deductions-under-section-80ccd (was section-80ccd id)', nps.readingTime);

const itrSlug = 'itr-filing-which-form';
let itr = data.articles.find((a) => a.slug === itrSlug);
const itrBody = readBody(itrSlug);
const itrMeta = {
  id: itrSlug,
  title: 'ITR filing 2024-25: Which ITR Form Should You Use?',
  slug: itrSlug,
  category: 'Income Tax & ITR',
  excerpt: excerptFrom(itrBody),
  content: itrBody,
  author: 'Mridhuv Associates',
  date: '2026-04-30',
  published: true,
  tags: ['ITR', 'AY 2024-25', 'FY 2023-24', 'ITR-1', 'ITR-2', 'Section 139'],
  readingTime: readingTime(itrBody),
};
if (itr) {
  Object.assign(itr, itrMeta);
  console.log('Replaced existing', itrSlug);
} else {
  const idx = data.articles.findIndex((a) => a.slug === 'which-itr-file-types-itr-forms-applicability');
  data.articles.splice(idx >= 0 ? idx : 0, 0, itrMeta);
  console.log('Inserted', itrSlug, 'at index', idx >= 0 ? idx : 0);
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'public', 'content.json'), JSON.stringify(data, null, 2) + '\n');
console.log('Wrote data/content.json and public/content.json');

const mdExport = [
  {
    slug: 'itr-filing-which-form',
    title: 'ITR filing 2024-25: Which ITR Form Should You Use?',
    description:
      'AY 2024-25 ITR guide: compare ITR-1 to ITR-7, exclusions, decision chart, key deadlines, defective return Section 139(9), penalties, FAQs.',
    category: 'Tax & Compliance',
    tags: ['ITR', 'Income Tax', 'AY 2024-25', 'tax filing', 'Section 139'],
  },
  {
    slug: 'fssai-registration-vs-license',
    title: 'FSSAI Registration vs FSSAI License: Key Differences Explained',
    description:
      'FSSAI basic registration vs state vs central licence: turnover limits, FoSCoS steps, fees, documents, penalties, renewal FAQs for food businesses.',
    category: 'Compliance',
    tags: ['FSSAI', 'FoSCoS', 'food license', 'food safety', 'India'],
  },
  {
    slug: 'trademark-registration-india',
    title: 'Trademark Registration in India: Complete Process & Classes',
    description:
      'Trademark registration India: Nice classes, TM search, fees, examination, journal opposition, renewal every ten years, infringement remedies, FAQs.',
    category: 'Legal & IP',
    tags: ['Trademark', 'IP India', 'Nice classification', 'brand protection'],
  },
  {
    slug: 'deductions-under-section-80ccd',
    title: 'Section 80CCD(1B): The Extra Rs. 50,000 Deduction Most People Miss',
    description:
      'Section 80CCD(1B): extra Rs. 50,000 NPS Tier I deduction outside 80C; eligibility, tax saved, withdrawals, maturity tax treatment, FAQs.',
    category: 'Tax & Compliance',
    tags: ['80CCD(1B)', 'NPS', 'tax deduction', 'retirement', 'old regime'],
  },
  {
    slug: 'private-limited-company-registration',
    title: 'How to Register a Private Limited Company in India',
    description:
      'Register a private limited company under Companies Act 2013: DSC, DIN, SPICe+, MoA and AoA, MCA fees, INC-20A, annual filings, costs, FAQs.',
    category: 'Business & Compliance',
    tags: ['Private Limited', 'SPICe+', 'MCA', 'company incorporation'],
  },
  {
    slug: 'gst-registration-guide-2024',
    title: 'Complete Guide to GST Registration in India 2024',
    description:
      'GST registration India 2024: turnover thresholds, mandatory cases, REG-01 flow, GSTIN structure, GSTR-1 and 3B basics, composition scheme, penalties, FAQs.',
    category: 'Tax & Compliance',
    tags: ['GST', 'GST registration', 'GSTIN', 'CGST', 'compliance'],
  },
];

function yamlQuote(s) {
  return `'${String(s).replace(/'/g, "''")}'`;
}

const articlesDir = path.join(root, 'articles');
fs.mkdirSync(articlesDir, { recursive: true });
for (const m of mdExport) {
  const body = readBody(m.slug);
  const rt = `${Math.max(1, Math.ceil(wordCount(body) / 200))} minutes`;
  const fm = `---
title: ${yamlQuote(m.title)}
slug: ${yamlQuote(m.slug)}
description: ${yamlQuote(m.description)}
category: ${yamlQuote(m.category)}
tags: [${m.tags.map((t) => yamlQuote(t)).join(', ')}]
date_published: '2026-04-30'
last_updated: '2026-04-30'
author: 'Editorial Team'
reading_time: ${yamlQuote(rt)}
---

`;
  fs.writeFileSync(path.join(articlesDir, `${m.slug}.md`), fm + body + '\n', 'utf8');
}
console.log('Exported', mdExport.length, 'files to articles/');
