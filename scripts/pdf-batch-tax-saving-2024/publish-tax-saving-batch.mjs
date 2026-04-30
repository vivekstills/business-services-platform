/**
 * India Tax Saving Articles (2024-25) — builds Markdown from PyMuPDF extract,
 * merges into data/content.json + public/content.json.
 *
 * Extract text: python scripts/pdf-batch-tax-saving-2024/extract-from-pdf.py
 * Publish: node scripts/pdf-batch-tax-saving-2024/publish-tax-saving-batch.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', '..');

const SOURCE = path.join(__dirname, 'tax-saving-clean.txt');
const AUTHOR = 'Mridhuv Associates';
const DATE = '2026-04-29';

/** First distinctive sentence of body (after title block) — inclusive slice start per article. */
const START_MARKERS = [
  'If there is one section of the Income Tax Act that every salaried',
  'Most taxpayers exhaust their Section 80C limit of Rs. 1.5 lakh and',
  'Caring for a family member with a disability is emotionally',
  'Most taxpayers are unaware that contributions made to registered',
  'A home loan is not just a financial commitment; it is also one of the',
  'Personal loans do not come with automatic tax benefits.',
  'Education is among the highest expenses a family bears, and the tax',
  'Tax planning is not one-size-fits-all. A person earning Rs. 10 lakh',
];

/** CMS metadata (slug = id). */
const BATCH = [
  {
    id: 'section-80c-complete-guide-india-popular-tax-deduction',
    slug: 'section-80c-complete-guide-india-popular-tax-deduction',
    title: "Section 80C: The Complete Guide to India's Most Popular Tax Deduction",
    category: 'Income Tax & ITR',
    excerpt:
      'Complete guide to Section 80C deductions in India — the Rs. 1.5 lakh limit, eligible instruments (EPF, PPF, ELSS, LIC, tuition fees, home loan principal), slab-wise savings, optimization tips, mistakes to avoid, and FAQs.',
    tags: ['Section 80C', 'Tax Saving', 'FY 2024-25', 'Old Tax Regime', 'Deduction'],
  },
  {
    id: 'section-80ccd-1b-nps-extra-50000-deduction',
    slug: 'section-80ccd-1b-nps-extra-50000-deduction',
    title: 'Section 80CCD(1B): Save an Extra Rs. 50,000 in Tax With NPS',
    category: 'Income Tax & ITR',
    excerpt:
      'Additional Rs. 50,000 NPS Tier I deduction over 80C, 80CCD(1) vs (1B) vs (2), eligibility, limits, examples, tips, and FAQs.',
    tags: ['80CCD(1B)', 'NPS', 'Tax Saving', 'FY 2024-25', 'Retirement'],
  },
  {
    id: 'section-80dd-disabled-dependent-tax-relief',
    slug: 'section-80dd-disabled-dependent-tax-relief',
    title: 'Section 80DD: Tax Relief for Families Supporting Disabled Dependents',
    category: 'Income Tax & ITR',
    excerpt:
      'Flat deductions for disability-dependent care, eligibility, Rs. 75,000 / Rs. 1,25,000 limits, certificate rules, example, and FAQs.',
    tags: ['Section 80DD', 'Disability', 'Tax Saving', 'FY 2024-25'],
  },
  {
    id: 'section-80ggc-political-party-donation-deduction',
    slug: 'section-80ggc-political-party-donation-deduction',
    title: 'Section 80GGC: Tax Deduction for Political Party Donations',
    category: 'Income Tax & ITR',
    excerpt:
      '100% deduction for qualifying political donations via banking channels, eligibility, limits, example, compliance tips, and FAQs.',
    tags: ['Section 80GGC', 'Political Donation', 'Tax Saving', 'FY 2024-25'],
  },
  {
    id: 'home-loan-tax-benefits-claim-2024-25',
    slug: 'home-loan-tax-benefits-claim-2024-25',
    title: 'Home Loan Tax Benefits: Everything You Need to Claim in 2024-25',
    category: 'Income Tax & ITR',
    excerpt:
      '80C principal, Section 24(b) interest, 80EE/80EEA, eligibility, deduction caps, joint loans, optimization, mistakes, and FAQs.',
    tags: ['Home Loan', 'Section 24(b)', '80EEA', 'Tax Saving', 'FY 2024-25'],
  },
  {
    id: 'personal-loan-tax-benefits-when-save-tax',
    slug: 'personal-loan-tax-benefits-when-save-tax',
    title: 'Personal Loan Tax Benefits: When and How You Can Actually Save Tax',
    category: 'Income Tax & ITR',
    excerpt:
      'End-use based deductibility: business, renovation, education (80E), documentation, scenarios, perquisites, and FAQs.',
    tags: ['Personal Loan', 'Tax Saving', 'FY 2024-25', 'Section 80E', 'Business'],
  },
  {
    id: 'children-education-allowance-tax-benefits-parents-india',
    slug: 'children-education-allowance-tax-benefits-parents-india',
    title: 'Children Education Allowance: Tax Benefits for Parents in India',
    category: 'Income Tax & ITR',
    excerpt:
      'CEA & hostel allowance under 10(14), tuition fees under 80C, education loan interest under 80E, limits, example couple, tips, and FAQs.',
    tags: ['Education Allowance', 'Section 80C', 'Section 80E', 'Tax Saving', 'Parents'],
  },
  {
    id: 'how-save-tax-different-income-levels-complete-strategy-guide',
    slug: 'how-save-tax-different-income-levels-complete-strategy-guide',
    title:
      'How to Save Tax at Different Income Levels: Complete Strategy Guide for Rs. 10L to Rs. 1 Crore+',
    category: 'Income Tax & ITR',
    excerpt:
      'Income-level-specific tax saving strategies for Rs. 10L, 20L, 30L, 50L, and 1 Crore+ — old vs new regime comparison, surcharge notes, deduction stacking, and actionable tips for every bracket.',
    tags: ['Tax Planning', 'Income Tax Slabs', 'Old vs New Regime', 'FY 2024-25', 'Rebate 87A'],
  },
];

function stripZW(text) {
  return text.replace(/\u200b/g, '');
}

/** Merge wrapped prose lines; flush on blank lines. */
function linesToParagraphChunks(lines) {
  const chunks = [];
  let cur = [];

  const flush = () => {
    if (!cur.length) return;
    const joined = cur.join(' ').replace(/\s+/g, ' ').trim();
    chunks.push(joined);
    cur = [];
  };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/u, '').trimEnd();
    if (!line.trim()) {
      flush();
      continue;
    }
    const tr = line.trim();
    if (/^●/u.test(tr)) {
      flush();
      chunks.push(tr);
      continue;
    }
    cur.push(tr);
  }
  flush();
  return chunks;
}

function chunksToMarkdown(chunks) {
  const out = [];
  for (const c of chunks) {
    if (/^●/u.test(c)) {
      out.push(`- ${c.replace(/^●\s*/u, '').trim()}`);
    } else {
      out.push(c);
      out.push('');
    }
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

/** FAQ section title → H2 for accordions; handles PDF merge where "Q1." follows on same line. */
function applyTaxSavingFormatting(md) {
  let out = md;
  out = out.replace(/\s*7\. Frequently Asked Questions\s+(Q\d+\.)/gi, '\n\n## FAQs\n\n$1');
  return out.replace(/\n{3,}/g, '\n\n').trim();
}

function extractArticleBodies(fullText) {
  const bodies = [];
  for (let i = 0; i < START_MARKERS.length; i++) {
    const start = fullText.indexOf(START_MARKERS[i]);
    if (start < 0) throw new Error('Missing marker: ' + START_MARKERS[i]);
    let end = fullText.length;
    if (i < START_MARKERS.length - 1) {
      const next = fullText.indexOf(START_MARKERS[i + 1], start + START_MARKERS[i].length);
      if (next >= 0) end = next;
    }
    bodies.push(fullText.slice(start, end).trim());
  }
  return bodies;
}

/** Merge batch into canonical articles list once; write same array to both CMS paths. */
function upsertArticlesBoth(markdownBodies) {
  const fpData = path.join(root, 'data/content.json');
  const fpPublic = path.join(root, 'public/content.json');
  const data = JSON.parse(fs.readFileSync(fpData, 'utf8'));
  let merged = [...(data.articles ?? [])];
  const fresh = [];

  for (let i = 0; i < BATCH.length; i++) {
    const b = BATCH[i];
    const content = markdownBodies[i];
    const idx = merged.findIndex((x) => x.slug === b.slug);
    const base = {
      title: b.title,
      slug: b.slug,
      category: b.category,
      excerpt: b.excerpt,
      content,
      author: AUTHOR,
      date: DATE,
      published: true,
      tags: b.tags,
      readingTime: '14 min read',
    };
    if (idx >= 0) {
      merged[idx] = { ...merged[idx], ...base, id: merged[idx].id };
      console.log('Updated', b.slug);
    } else {
      fresh.push({ ...base, id: b.id });
      console.log('Queue prepend', b.slug);
    }
  }

  const articles = [...fresh, ...merged];

  fs.writeFileSync(fpData, JSON.stringify({ ...data, articles }, null, 2) + '\n', 'utf8');
  const pub = fs.existsSync(fpPublic)
    ? JSON.parse(fs.readFileSync(fpPublic, 'utf8'))
    : {};
  fs.writeFileSync(fpPublic, JSON.stringify({ ...pub, articles }, null, 2) + '\n', 'utf8');
}

function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error('Missing', SOURCE, '— run: python scripts/pdf-batch-tax-saving-2024/extract-from-pdf.py');
    process.exit(1);
  }
  let fullText = stripZW(fs.readFileSync(SOURCE, 'utf8')).replace(/\r\n/g, '\n');

  const bodies = extractArticleBodies(fullText);
  const markdownBodies = bodies.map((body) => {
    const lines = body.split('\n');
    const chunks = linesToParagraphChunks(lines);
    let md = chunksToMarkdown(chunks);
    md = applyTaxSavingFormatting(md);
    return md;
  });

  upsertArticlesBoth(markdownBodies);
  console.log('Done.');
}

main();
