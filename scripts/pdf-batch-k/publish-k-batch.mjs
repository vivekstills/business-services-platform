/**
 * Builds Markdown articles from scripts/pdf-batch-k/k-clean.txt (PyMuPDF extract).
 * Source PDF: scripts/pdf-batch-k/k.pdf — regenerate text via `python scripts/pdf-batch-k/extract-k-clean.py`.
 * Merges into data/content.json + public/content.json (same ArticlePage / RichContent as other posts).
 * Run from repo root: node scripts/pdf-batch-k/publish-k-batch.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { applyTablePatches } from './applyTablePatches.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', '..');

const SOURCE = path.join(__dirname, 'k-clean.txt');
const AUTHOR = 'Mridhuv Associates';
const DATE = '2026-04-29';

/** First paragraph sentence — inclusive slice start per article. */
const START_MARKERS = [
  'The Union Budget 2026 introduced',
  'In the logistics and warehousing sector',
  'When the GST Council reduces the tax rate',
  'The Indian financial markets involve trillions',
  'When applying for GST registration',
];

/** CMS metadata (slug = id). */
const BATCH = [
  {
    id: 'health-security-national-security-cess-act-2026',
    slug: 'health-security-national-security-cess-act-2026',
    title: 'Health Security to National Security Cess Act 2026: Everything You Need to Know',
    category: 'Income Tax & ITR',
    excerpt:
      'Union Budget 2026 HSNSC cess: rates for individuals and corporates, calculation, TDS and advance tax, exemptions, policy impact, and FAQs.',
    tags: ['HSNSC', 'Cess', 'Income Tax', 'Budget 2026', 'AY 2026-27'],
  },
  {
    id: 'gst-handling-rain-fees-taxability-compliance',
    slug: 'gst-handling-rain-fees-taxability-compliance',
    title: 'GST on Handling & Rain Fees: Taxability, Rate, and Compliance Guide',
    category: 'GST & Indirect Tax',
    excerpt:
      'GST on handling and rain fees: SAC rates, GTA vs port trust, composite supply, RCM, ITC, port examples, and FAQs.',
    tags: ['GST', 'Handling Fee', 'Rain Fee', 'RCM', 'Logistics'],
  },
  {
    id: 'gst-rate-cut-itc-reversal-section-18-4',
    slug: 'gst-rate-cut-itc-reversal-section-18-4',
    title: 'GST Rate Cut from 18% to 5%: Understanding ITC Reversal Under Section 18(4)',
    category: 'GST & Indirect Tax',
    excerpt:
      'Section 18(4) ITC reversal when GST rates drop: Rule 44, ITC-03, stock examples, multi-GSTIN, services, and FAQs.',
    tags: ['GST', 'Section 18(4)', 'ITC Reversal', 'Rule 44', 'Rate Cut'],
  },
  {
    id: 'gst-exemption-sale-purchase-securities',
    slug: 'gst-exemption-sale-purchase-securities',
    title: 'GST Exemption on Sale and Purchase of Securities: A Complete Analysis',
    category: 'GST & Indirect Tax',
    excerpt:
      'Securities and GST: Schedule III, taxable ancillary services, STT vs GST, brokerage ITC, sector notes, and FAQs.',
    tags: ['GST', 'Securities', 'Stock Exchange', 'Brokerage', 'SCRA'],
  },
  {
    id: 'rent-agreement-gst-registration-requirements',
    slug: 'rent-agreement-gst-registration-requirements',
    title: 'Rent Agreement for GST Registration: Requirements, Pitfalls, and Best Practices',
    category: 'GST & Indirect Tax',
    excerpt:
      'Rent proof for GST registration: mandatory clauses, registered vs notarized, co-working and home-based cases, virtual offices, and FAQs.',
    tags: ['GST Registration', 'Rent Agreement', 'Principal Place of Business', 'CGST Rules'],
  },
];

function stripZW(text) {
  return text.replace(/\u200b/g, '');
}

/** Merge wrapped prose lines; keep bullets as separate pseudo-paragrahs starting ● */
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

/** Preserve PDF wording; only bullets → markdown lists (no guessed ## — avoids wrong headings). */
function chunksToMarkdown(chunks) {
  const out = [];
  for (const c of chunks) {
    if (/^●/u.test(c)) {
      out.push(`- ${stripBullet(c)}`);
    } else {
      out.push(c);
      out.push('');
    }
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function stripBullet(s) {
  return s.replace(/^●\s*/u, '').trim();
}

/**
 * Insert markdown ## / ### at PDF section boundaries only (verbatim wording).
 * Rules are applied in order per article index.
 */
const HEADING_RULES = [
  // Article 1 — HSNSC cess
  [
    [/(What Is the Health Security to National Security Cess\?)\s+(A cess in Indian taxation)/u, '## $1\n\n$2'],
    [/(Legal Framework and Enactment)\s+(The Act was passed by Parliament)/u, '## $1\n\n$2'],
    [/(Key Provisions at a Glance)\s+(Provision Details)/u, '## $1\n\n$2'],
    [/(Who Is Affected\?)\s+(The cess touches virtually)/u, '## $1\n\n$2'],
    [/(Individuals and HUFs)\s+(Resident individuals)/u, '\n\n### $1\n\n$2'],
    [/(Corporates and LLPs)\s+(All domestic companies)/u, '\n\n### $1\n\n$2'],
    [/(Partnership Firms)\s+(Firms \(other than LLPs\) pay)/u, '\n\n### $1\n\n$2'],
    [/(Non-Resident Indians \(NRIs\))\s+(NRIs earning income)/u, '\n\n### $1\n\n$2'],
    [/(How Is the Cess Calculated\?)\s+(The cess is applied on the net income tax payable)/u, '## $1\n\n$2'],
    [/(Practical Example: Individual Taxpayer)\s+(Rahul,)/u, '## $1\n\n$2'],
    [/(Practical Example: Corporate Taxpayer)\s+(XYZ Pvt\. Ltd\.)/u, '## $1\n\n$2'],
    [/(Impact on TDS and Advance Tax)\s+(The cess is factored into:)/u, '## $1\n\n$2'],
    [/(Exceptions and Exemptions)\s+(Category HSNSC Applicable\?)/u, '## $1\n\n$2'],
    [/(Policy Implications and Concerns)\s+(Revenue Potential:)/u, '## $1\n\n$2'],
    [/(5 Unique FAQs)\s+(Q1\.)/u, '## FAQs\n\n$2'],
  ],
  // Article 2 — Handling & rain fees
  [
    [/(Understanding Handling Fees and Rain Fees)\s+(Before diving into GST)/u, '## $1\n\n$2'],
    [/(The GST Framework Applicable)\s+(Under GST, both handling fees)/u, '## $1\n\n$2'],
    [/(GST Rate Applicability)\s+(Type of Charge HSN\/SAC)/u, '## $1\n\n$2'],
    [/(The Composite Supply vs\. Mixed Supply Question)\s+(This is where most disputes arise\.)/u, '## $1\n\n$2'],
    [
      /(Who Pays\? Forward Charge vs\. Reverse Charge)\s+(Supplier Category Mechanism)/u,
      '## $1\n\n$2',
    ],
    [/(Practical Example 1: Importer at Mumbai Port)\s*\n+(SteelCorp India Ltd\.)/u, '## $1\n\n$2'],
    [/(Practical Example 2: Agricultural Commodity Warehouse)\s+(FreshGrain Pvt\. Ltd\.)/u, '## $1\n\n$2'],
    [/(ITC Eligibility)\s*\n+(For businesses receiving handling)/u, '## $1\n\n$2'],
    [/(Common Errors and Compliance Issues)\s+(Wrong SAC Code:)/u, '## $1\n\n$2'],
    [/(Exceptions)\s*\n+(- Pure labor supply contracts)/u, '## $1\n\n$2'],
    [/(5 Unique FAQs)\s+(Q1\.)/u, '## FAQs\n\n$2'],
  ],
  // Article 3 — Section 18(4)
  [
    [/(Why Does a Rate Cut Trigger ITC Reversal\?)\s+(The logic is straightforward)/u, '## $1\n\n$2'],
    [
      /(The Legal Provision: Section 18\(4\) Explained)\s+(Section 18\(4\) of the CGST Act provides:)/u,
      '## $1\n\n$2',
    ],
    [/(When Does Section 18\(4\) Apply\?)\s+(Trigger Event Section 18\(4\) Applies\?)/u, '## $1\n\n$2'],
    [
      /(Computing the Reversal: Rule 44 Methodology)\s+(For Inputs \(Raw Materials, Components\):)/u,
      '## $1\n\n$2',
    ],
    [/(Step-by-Step Example)\s+(Situation:)/u, '## $1\n\n$2'],
    [/(Form and Compliance Procedure)\s+(Step Action Required)/u, '## $1\n\n$2'],
    [/(Who Is Affected\?)\s+(Manufacturers:)/u, '## $1\n\n$2'],
    [/(Practical Challenges)\s+(FIFO vs\. Weighted Average:)/u, '## $1\n\n$2'],
    [
      /(Exceptions — When Reversal May Be Reduced or Avoided)\s*\n+(- Where goods were purchased under Bill of Supply)/u,
      '## $1\n\n$2',
    ],
    [/(5 Unique FAQs)\s+(Q1\.)/u, '## FAQs\n\n$2'],
  ],
  // Article 4 — Securities
  [
    [
      /(The Statutory Exemption: Where Does It Come From\?)\s+(Under the CGST Act, 2017, the definition)/u,
      '## $1\n\n$2',
    ],
    [
      /(What Qualifies as "Securities" for GST Exemption\?)\s+(Under Section 2\(h\) of SCRA)/u,
      '## $1\n\n$2',
    ],
    [
      /(What IS Taxable: Services Around Securities)\s+(This is where many investors and businesses get confused\.)/u,
      '## $1\n\n$2',
    ],
    [
      /(The Subtle GST on STT vs\. GST Distinction)\s+(Many retail investors confuse Securities Transaction Tax)/u,
      '## $1\n\n$2',
    ],
    [/(Detailed Example: Equity Trade by Retail Investor)\s+(Priya buys)/u, '## $1\n\n$2'],
    [
      /(Detailed Example: Fund House \(Mutual Fund AMC\))\s+(Wealth Asset Management runs equity mutual funds\.)/u,
      '## $1\n\n$2',
    ],
    [
      /(ITC on Securities-Related Services)\s+(For a business investing its surplus funds in securities:)/u,
      '## $1\n\n$2',
    ],
    [/(Impact on Specific Sectors)\s+(Banks:)/u, '## $1\n\n$2'],
    [/(Exceptions and Edge Cases)\s+(Situation GST Treatment)/u, '## $1\n\n$2'],
    [/(5 Unique FAQs)\s+(Q1\.)/u, '## FAQs\n\n$2'],
  ],
  // Article 5 — Rent agreement
  [
    [
      /(Why Is a Rent Agreement Required for GST Registration\?)\s+(Under Rule 8 of the CGST Rules)/u,
      '## $1\n\n$2',
    ],
    [
      /(Documents Required: A Comprehensive Table)\s+(Document Category Specific Document Mandatory\?)/u,
      '## $1\n\n$2',
    ],
    [
      /(What Must the Rent Agreement Contain\?)\s+(Not every rent agreement passes GSTN scrutiny\.)/u,
      '## $1\n\n$2',
    ],
    [
      /(Strongly Recommended Elements:)\s*\n+(- Landlord's PAN \(GSTN officers increasingly ask for this\))/u,
      '### $1\n\n$2',
    ],
    [
      /(Registered vs\. Notarized vs\. Unregistered Agreement — What Works\?)\s+(Type Validity for GST Risk Level)/u,
      '## $1\n\n$2',
    ],
    [
      /(Practical Scenario 1: E-Commerce Seller in a Shared Office)\s+(Vikram runs an e-commerce business)/u,
      '## $1\n\n$2',
    ],
    [
      /(Practical Scenario 2: Home-Based Business)\s+(Meena runs a boutique from her residence)/u,
      '## $1\n\n$2',
    ],
    [
      /(Practical Scenario 3: Multi-State Business with Branch Offices)\s+(TechServe Pvt\. Ltd\.)/u,
      '## $1\n\n$2',
    ],
    [
      /(Common Rejection Reasons and How to Avoid Them)\s+(Rejection Reason How to Avoid)/u,
      '## $1\n\n$2',
    ],
    [
      /(GST Registration for Rented Virtual Offices)\s+(Virtual offices — where a business pays for an address)/u,
      '## $1\n\n$2',
    ],
    [
      /(After GST Registration: Ongoing Compliance with the Rent Agreement)\s+(The rent agreement's role doesn't end at registration:)/u,
      '## $1\n\n$2',
    ],
    [/(Special Situations)\s+(Situation GST Registration Approach)/u, '## $1\n\n$2'],
    [/(5 Unique FAQs)\s+(Q1\.)/u, '## FAQs\n\n$2'],
  ],
];

function applyHeadingRules(markdown, articleIndex) {
  const rules = HEADING_RULES[articleIndex];
  if (!rules) return markdown;
  let out = markdown;
  for (const [pattern, replacement] of rules) {
    out = out.replace(pattern, replacement);
  }
  return out.replace(/\n{3,}/g, '\n\n').trim();
}

function extractArticleBodies(fullText) {
  const bodies = [];
  for (let i = 0; i < START_MARKERS.length; i++) {
    const start = fullText.indexOf(START_MARKERS[i]);
    if (start < 0) throw new Error('Missing marker: ' + START_MARKERS[i]);
    let end = fullText.length;
    if (i < START_MARKERS.length - 1) {
      const nextHdr = `\nArticle ${i + 2}:`;
      const cut = fullText.indexOf(nextHdr, start + START_MARKERS[i].length);
      if (cut >= 0) end = cut;
      else {
        const fallback = fullText.indexOf(START_MARKERS[i + 1], start + START_MARKERS[i].length);
        if (fallback >= 0) end = fallback;
      }
    }
    bodies.push(fullText.slice(start, end).trim());
  }
  return bodies;
}

function upsertArticles(rel, markdownBodies) {
  const fp = path.join(root, rel);
  const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
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
      readingTime: '12 min read',
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

  fs.writeFileSync(fp, JSON.stringify({ ...data, articles }, null, 2) + '\n', 'utf8');
}

function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error('Missing', SOURCE);
    process.exit(1);
  }
  let fullText = stripZW(fs.readFileSync(SOURCE, 'utf8')).replace(/\r\n/g, '\n');

  const bodies = extractArticleBodies(fullText);
  const markdownBodies = bodies.map((body, i) => {
    const lines = body.split('\n');
    const chunks = linesToParagraphChunks(lines);
    let md = chunksToMarkdown(chunks);
    md = applyHeadingRules(md, i);
    md = applyTablePatches(i, md);
    return md;
  });

  upsertArticles('data/content.json', markdownBodies);
  upsertArticles('public/content.json', markdownBodies);
  console.log('Done.');
}

main();
