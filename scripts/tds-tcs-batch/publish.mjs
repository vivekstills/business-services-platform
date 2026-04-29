/**
 * Upserts TDS/TCS batch articles from sibling .md files into data + public content.json
 * Run from repo root: node scripts/tds-tcs-batch/publish.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', '..');

/** @type {{ slug: string; file: string; title: string; excerpt: string; tags: string[]; newArticle?: boolean }[]} */
const BATCH = [
  {
    slug: 'difference-between-tds-and-tcs',
    file: 'article-01.md',
    title: 'Difference Between TDS and TCS',
    excerpt:
      'Tax Deducted at Source (TDS) vs Tax Collected at Source (TCS): who deducts or collects, sections, forms, thresholds, examples, and FAQs.',
    tags: ['TDS', 'TCS', 'Tax Compliance', 'Income Tax'],
    newArticle: true,
  },
  {
    slug: 'section-194ia-tds-sale-property',
    file: 'article-02.md',
    title: 'Section 194IA — TDS on Purchase of Immovable Property',
    excerpt:
      'Buyer obligations under Section 194IA: 1% TDS, Rs. 50 lakh threshold, stamp duty value, Form 26QB, Form 16B, penalties, and FAQs.',
    tags: ['Section 194IA', 'TDS', 'Property', 'Form 26QB'],
  },
  {
    slug: 'how-download-fill-form-26qb-tds-property-transactions',
    file: 'article-03.md',
    title: 'Form 26QB — TDS Return for Property Purchase',
    excerpt:
      'Form 26QB challan-cum-statement for Section 194IA: filing steps, instalments, corrections, penalties, and FAQs.',
    tags: ['Form 26QB', 'TDS', 'Property', 'Section 194IA'],
  },
  {
    slug: 'form-26q-tds-return-filing-non-salary-deductions',
    file: 'article-04.md',
    title: 'Form 26Q — TDS Return for Non-Salary Payments to Residents',
    excerpt:
      'Quarterly Form 26Q for resident non-salary TDS: sections covered, due dates, structure, RPU/FVU, penalties, and FAQs.',
    tags: ['Form 26Q', 'TDS', 'TRACES'],
  },
  {
    slug: 'form-24q-tds-return-salary-payment',
    file: 'article-05.md',
    title: 'Form 24Q — TDS Return for Salary Payments',
    excerpt:
      'Employer compliance under Section 192: Form 24Q quarters, Annexure I and II, slabs, Form 16, penalties, and FAQs.',
    tags: ['Form 24Q', 'TDS', 'Salary', 'Section 192'],
  },
  {
    slug: 'section-194c-tds-payment-contractor',
    file: 'article-06.md',
    title: 'Section 194C — TDS on Payments to Contractors',
    excerpt:
      'TDS on contractors and sub-contractors: rates, thresholds, transporter exemption, GST base, penalties, and FAQs.',
    tags: ['Section 194C', 'TDS', 'Contractors'],
  },
  {
    slug: 'section-194j-tds-professional-fees-technical-services',
    file: 'article-07.md',
    title: 'Section 194J — TDS on Professional and Technical Fees',
    excerpt:
      'Professional vs technical services rates (10% / 2%), thresholds, royalty, compliance, and FAQs under Section 194J.',
    tags: ['Section 194J', 'TDS', 'Professional Fees'],
  },
  {
    slug: 'section-194a-tds-interest-other-than-interest-securities',
    file: 'article-08.md',
    title: 'Section 194A — TDS on Interest (Other Than on Securities)',
    excerpt:
      'TDS on bank and other interest: rates, thresholds, 15G/15H, senior citizens, PAN–Aadhaar, penalties, and FAQs.',
    tags: ['Section 194A', 'TDS', 'Interest', 'Form 15G'],
  },
  {
    slug: 'section-194h-tds-commission-brokerage',
    file: 'article-09.md',
    title: 'Section 194H — TDS on Commission and Brokerage',
    excerpt:
      'Commission and brokerage under Section 194H: 5% rate, Rs. 15,000 threshold, exclusions vs 194D, penalties, and FAQs.',
    tags: ['Section 194H', 'TDS', 'Commission'],
  },
  {
    slug: 'section-194t-tds-payment-by-partnership-firm-partners',
    file: 'article-10.md',
    title: 'Section 194T — TDS on Payments to Partners of a Firm',
    excerpt:
      'Finance Act 2024: TDS on partner salary, remuneration, bonus, commission, and interest on capital — rates, threshold, compliance.',
    tags: ['Section 194T', 'TDS', 'Partnership', 'LLP'],
  },
  {
    slug: 'section-194i-tds-rent',
    file: 'article-11.md',
    title: 'Section 194I — TDS on Rent',
    excerpt:
      'Rent for land, building, plant, machinery: rates 10%/2%, thresholds, Section 194IB, GST on rent, penalties, and FAQs.',
    tags: ['Section 194I', 'TDS', 'Rent'],
  },
  {
    slug: 'tds-compliance-enterprises-checklist-forms-penalties',
    file: 'article-12.md',
    title: 'TDS Compliance for Enterprises — A Complete Framework',
    excerpt:
      'Enterprise TDS scope, calendar, ERP controls, Section 195, disputes, penalties, and FAQs for finance teams.',
    tags: ['TDS', 'Compliance', 'Enterprises', 'TRACES'],
  },
];

const CATEGORY = 'TDS & TCS';
const DATE = '2026-04-29';
const AUTHOR = 'Mridhuv Associates';

function mergeTags(existing, add) {
  return [...new Set([...(existing ?? []), ...add])];
}

function publish(rel) {
  const fp = path.join(root, rel);
  const raw = fs.readFileSync(fp, 'utf8');
  const data = JSON.parse(raw);
  let articles = Array.isArray(data.articles) ? [...data.articles] : [];

  for (const b of BATCH) {
    const mdPath = path.join(__dirname, b.file);
    if (!fs.existsSync(mdPath)) {
      console.error('Missing file:', mdPath);
      process.exit(1);
    }
    const content = fs.readFileSync(mdPath, 'utf8').replace(/\r\n/g, '\n').trim();
    const idx = articles.findIndex((a) => a.slug === b.slug);

    const base = {
      title: b.title,
      slug: b.slug,
      category: CATEGORY,
      excerpt: b.excerpt,
      content,
      author: AUTHOR,
      date: DATE,
      published: true,
      tags: [],
      readingTime: '12 min read',
    };

    if (idx >= 0) {
      articles[idx] = {
        ...articles[idx],
        ...base,
        id: articles[idx].id,
        tags: mergeTags(articles[idx].tags, b.tags),
      };
      console.log('Updated', b.slug);
    } else if (b.newArticle) {
      articles.unshift({
        ...base,
        id: b.slug,
        tags: b.tags,
      });
      console.log('Prepended', b.slug);
    } else {
      console.warn('No existing article for slug (skipped):', b.slug);
    }
  }

  fs.writeFileSync(fp, JSON.stringify({ ...data, articles }, null, 2) + '\n', 'utf8');
}

publish('data/content.json');
publish('public/content.json');
console.log('Done.');
