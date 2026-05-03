/**
 * Converts scripts/batch5-raw/article-{1..5}.txt into scripts/batch5-sources/{slug}.md
 * Run: node scripts/build-batch5-sources.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function nd(s) {
  return s
    .replace(/\r\n/g, '\n')
    .replace(/\n[ \t]+\n/g, '\n\n')
    .replace(/\u2014/g, '-')
    .replace(/\u2013/g, '-')
    .replace(/—/g, '-')
    .replace(/–/g, '-')
    .replace(/⚠️/g, '')
    .replace(/⏱/g, '')
    .replace(/📋/g, '')
    .replace(/💡/g, '')
    /* Horizontal whitespace only: \\s would eat newlines and glue title lines to 📅 lines. */
    .replace(/[ \t]*📅[ \t]*/g, ' ')
    .replace(/^📅[ \t]*/gm, '');
}

function reflow(text) {
  const chunks = text.split(/\n\s*\n/);
  return chunks
    .map((c) =>
      c
        .split('\n')
        .map((l) => l.trimEnd())
        .join(' ')
        .replace(/ +/g, ' ')
        .trim()
    )
    .filter(Boolean)
    .join('\n\n');
}

/** Reflow prose only; keep markdown table rows (lines starting with |) intact. */
function reflowPreserveTables(text) {
  if (!text || !String(text).trim()) return text;
  const lines = String(text).split('\n');
  const chunks = [];
  let prose = [];
  let table = [];
  const flushProse = () => {
    if (prose.length) {
      chunks.push({ kind: 'prose', text: prose.join('\n') });
      prose = [];
    }
  };
  const flushTable = () => {
    if (table.length) {
      chunks.push({ kind: 'table', text: table.join('\n') });
      table = [];
    }
  };
  for (const line of lines) {
    if (/^\s*\|/.test(line)) {
      flushProse();
      table.push(line);
    } else {
      flushTable();
      prose.push(line);
    }
  }
  flushTable();
  flushProse();
  return chunks
    .map((c) => (c.kind === 'table' ? c.text : reflow(c.text)))
    .filter(Boolean)
    .join('\n\n');
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function h1Title(line) {
  return '# ' + line.replace(/\s+/g, ' ').trim();
}

function formatFAQsection(text) {
  /* After reflow, "Frequently Asked Questions" may be followed by space + Q1 on same line. */
  const m = text.match(
    /Frequently Asked Questions\s*(?:\n+|\s+)([\s\S]*)$/i
  );
  if (!m) return { before: text, faq: '' };
  const before = text.slice(0, m.index).trim();
  const raw = m[1].trim();
  const qs = [...raw.matchAll(/Q(\d+)\.\s*([^]+?)(?=Q\d+\.|$)/gis)];
  let out = '## Frequently asked questions\n\n';
  for (const x of qs) {
    const q = x[2].trim();
    const lines = q.split('\n\n');
    const qtext = lines[0].replace(/\s+/g, ' ').trim();
    const ans = lines.slice(1).join('\n\n').trim();
    out += `**Q${x[1]}.** ${qtext}\n\n`;
    if (ans) out += ans + '\n\n';
  }
  return { before, faq: out.trim() + '\n' };
}

function bulletifyKeyTakeaways(block) {
  if (!/^KEY TAKEAWAYS/i.test(block)) return block;
  /* Reflow may glue "KEY TAKEAWAYS 1. foo 2. bar" on one line; do not require newline after header. */
  const rest = block.replace(/^KEY TAKEAWAYS\s+/i, '').trim();
  const items = [...rest.matchAll(/(\d+)\.\s+(.+?)(?=\s+\d+\.\s+|$)/gs)];
  let md = '## Key takeaways\n\n';
  for (const it of items) {
    md += `${it[1]}. ${it[2].replace(/\s+/g, ' ').trim()}\n`;
  }
  return md.trim();
}

/** Split KEY TAKEAWAYS + FAQ; run FAQ parse only on the tail so the KT regex can still see "Frequently Asked Questions". */
function splitKeyTakeawaysAndFaq(rest) {
  const kt = rest.match(
    /KEY TAKEAWAYS[\s\S]+?(?=\n+\s*Frequently Asked Questions)/i
  );
  if (!kt) {
    const faq = formatFAQsection(rest);
    return { mid: faq.before, ktMd: '', faq: faq.faq };
  }
  const mid = rest.slice(0, kt.index).trim();
  const ktMd = bulletifyKeyTakeaways(kt[0]);
  const faqRaw = rest.slice(kt.index + kt[0].length).trim();
  const faq = formatFAQsection(faqRaw);
  return { mid, ktMd, faq: faq.faq };
}

function bulletsToMarkdown(text) {
  return text.replace(/([.!?:])\s+•\s+/g, '$1\n\n- ').replace(/^\s*•\s+/gm, '- ');
}

function fixGluedHeading(text) {
  return text
    .replace(/\. ###/g, '.\n\n###')
    .replace(/([^\n])\n(## )/g, '$1\n\n$2')
    .replace(/([.!?])\s+(## )/g, '$1\n\n$2')
    .replace(/([.!?])\s+Pro Tip\b/g, '$1\n\nPro Tip')
    .replace(/([.!?])\n\s*(Pro Tip)\b/gim, '$1\n\n$2')
    .replace(/([^\n])\s+KEY TAKEAWAYS\b/gim, '$1\n\nKEY TAKEAWAYS')
    .replace(/([.!?])\n\s*(KEY TAKEAWAYS)\b/gim, '$1\n\n$2')
    .replace(/([^\n])\s+Frequently Asked Questions\b/gim, '$1\n\nFrequently Asked Questions')
    .replace(/([.!?])\n\s*(Frequently Asked Questions)\b/gim, '$1\n\n$2');
}

function stripHeader(raw, multilineTitle) {
  let b = raw.replace(/^ARTICLE \d+ OF 5[^\n]*\n/m, '');
  for (const line of multilineTitle) {
    b = b.replace(new RegExp('^' + escapeRe(line) + '\\s*\\n', 'm'), '');
  }
  b = b.replace(/^📅[^\n]*\n\n?/m, '');
  /* After 📅 emoji removal, meta may appear as "Updated: May 2026 ..." without 📅 */
  b = b.replace(/^\s*Updated:[^\n]*\n\s*/m, '');
  b = b.replace(/^ARTICLE SUMMARY\s*\n\n?/m, '');
  return b.trim();
}

/* ---------- Article 1: Crypto ---------- */
function formatCryptoTail(s0) {
  const s = String(s0).replace(/\u2014/g, '-');
  const co = s.indexOf('Cost of Acquisition');
  let calcH = s.indexOf('📊 Crypto Tax Calculation');
  if (calcH < 0) calcH = s.indexOf('Crypto Tax Calculation');
  const eth = s.indexOf('Ethereum loss of Rs.');
  const gifts = s.indexOf('Gifts of Crypto');
  if (co < 0) return reflowPreserveTables(s);

  const coBlock = s
    .slice(co, calcH > 0 ? calcH : s.length)
    .replace(
      /^Cost of Acquisition - The Only Deductible Expense\s*\n/m,
      '## Cost of acquisition: the only deductible expense\n\n'
    )
    .trim();
  if (calcH < 0 || eth < 0 || gifts < 0) {
    return reflowPreserveTables(
      s
        .replace(
          /^Cost of Acquisition - The Only Deductible Expense\s*\n/m,
          '## Cost of acquisition: the only deductible expense\n\n'
        )
        .replace(/^📊 Crypto Tax Calculation[^\n]*\n/m, '## Crypto tax calculation: FY 2025-26\n\n')
        .replace(/^\s*Crypto Tax Calculation[^\n]*\n/m, '## Crypto tax calculation: FY 2025-26\n\n')
        .replace(/^Gifts of Crypto[^\n]*\n/m, '## Gifts of crypto: tax in giver\'s and receiver\'s hands\n\n')
        .replace(/^VDA Reporting in ITR[^\n]*\n/m, '## VDA reporting in ITR: Schedule VDA\n\n')
        .replace(/^📅 Pro Tip\s*\n/m, '## Pro tip\n\n')
        .replace(/^\s*Pro Tip\s+/m, '## Pro tip\n\n')
    );
  }
  const calcBody = s
    .slice(calcH, eth)
    .replace(/^\s*📊 Crypto Tax Calculation[^\n]*\n/m, '')
    .replace(/^\s*Crypto Tax Calculation[^\n]*\n/m, '')
    .trim();
  const ethPara = s.slice(eth, gifts).trim();
  let tail = s
    .slice(gifts)
    .replace(
      /^Gifts of Crypto - Tax in Giver's and Receiver's Hands\s*\n/m,
      '## Gifts of crypto: tax in giver\'s and receiver\'s hands\n\n'
    )
    .replace(/^VDA Reporting in ITR - Schedule VDA\s*\n/m, '## VDA reporting in ITR: Schedule VDA\n\n')
    .replace(/^📅 Pro Tip\s*\n/m, '## Pro tip\n\n')
    .replace(/^\s*Pro Tip\s+/m, '## Pro tip\n\n')
    .trim();

  const calcMd =
    '## Crypto tax calculation: FY 2025-26\n\n```\n' +
    calcBody +
    '\n```\n\n' +
    reflow(ethPara);

  return (
    reflowPreserveTables(coBlock) +
    '\n\n' +
    calcMd +
    '\n\n' +
    reflowPreserveTables(tail)
  );
}

function build1Safe(raw0) {
  const title = h1Title('Taxation of Cryptocurrency & Virtual Digital Assets in India (FY 2025-26)');
  let body = stripHeader(nd(raw0), [
    'Taxation of Cryptocurrency & Virtual Digital',
    'Assets in India (FY 2025-26)',
  ]);
  const wa = body.indexOf('What are Virtual Digital Assets (VDAs)?');
  const summary = wa >= 0 ? reflow(body.slice(0, wa).trim()) : '';
  const main = wa >= 0 ? body.slice(wa) : body;

  const t115 = `| Feature | Rule under Section 115BBH |
| --- | --- |
| Tax rate on VDA income | 30% flat rate - regardless of the investor's income tax slab or total income |
| Surcharge applicable | Yes - at normal rates (10% if income > Rs. 50L; 15% if > Rs. 1 crore; etc.) |
| Health & Education Cess | 4% on tax + surcharge |
| Holding period matters? | No - whether held for 1 day or 10 years, tax is always 30% |
| New tax regime vs old? | No difference - 30% flat rate applies regardless of regime chosen |
| Set-off of VDA loss against other income | PROHIBITED - VDA losses cannot reduce salary, business, or other income |
| Set-off of loss from one VDA against gain from another | PROHIBITED - even within VDAs, inter-asset loss set-off is not allowed |
| Carry forward of VDA losses | NOT PERMITTED - VDA losses lapse in the same year; cannot be carried forward |`;

  const tEvents = `| Transaction type | Taxable? | Taxable amount |
| --- | --- | --- |
| Sale of crypto for INR (fiat currency) | Yes | Sale price minus cost of acquisition |
| Sale of crypto for USDT or other stablecoin | Yes | INR value of USDT received minus cost of acquisition |
| Crypto-to-crypto swap (BTC to ETH) | Yes | Fair market value of received crypto in INR minus cost of sold crypto |
| Purchase of goods/services using crypto | Yes | Fair market value of goods/services received minus cost of crypto used |
| Mining income (receiving crypto as mining reward) | Yes, at receipt | Fair market value on date of receipt - taxed as income |
| Staking rewards received | Yes, at receipt | Fair market value on date of receipt |
| Airdrop of free tokens | Yes, at receipt | Fair market value on date of receipt |
| Gifting crypto to another person | Yes, for giver | FMV on date of gift minus acquisition cost |
| Holding crypto (no sale/transfer) | No | Unrealised gains are NOT taxable |
| Transfer between own wallets | No | Not a transfer to another person - not taxable |`;

  const tTds = `| Buyer category | TDS threshold | TDS rate |
| --- | --- | --- |
| Individual/HUF whose business/professional income exceeds Rs. 1 crore / Rs. 50 lakh | Rs. 10,000 per year per seller | 1% TDS on the transaction value |
| Any other buyer (including exchanges) | Rs. 50,000 per year per seller | 1% TDS |
| Crypto exchanges (acting as intermediary) | Per transaction as platform deductor | 1% TDS on gross transaction value; buyer responsible if exchange fails to deduct |`;

  const whatM = main.match(
    /^What are Virtual Digital Assets \(VDAs\)\?[\s\S]*?under Section 115BBH\.\s*/m
  );
  const importantM = main.match(
    /\s*Important\s*\n+\s*The complete loss[\s\S]*?Each VDA transaction is effectively taxed in isolation\.\s*/m
  );
  const tdsIntroM = main.match(
    /Section 194S requires any person paying consideration[\s\S]*?This applies to:\s*/m
  );
  const tdsNoteM = main.match(
    /TDS deducted under Section 194S is visible[\s\S]*?(?=\n\nCost of Acquisition)/m
  );
  const tailM = main.match(/Cost of Acquisition[\s\S]*/m);

  const parts = [
    whatM
      ? '## What are Virtual Digital Assets (VDAs)?\n\n' +
          reflow(whatM[0].replace(/^What are Virtual Digital Assets \(VDAs\)\?\s*/m, ''))
      : '',
    '## The flat 30% tax rate: Section 115BBH\n\n' + t115,
    importantM
      ? '## Important\n\n' +
          reflow(importantM[0].replace(/^\s*Important\s*\n+\s*/m, ''))
      : '',
    '## What counts as a taxable VDA event?\n\n' + tEvents,
    '## TDS under Section 194S: 1% on VDA transactions\n\n' +
      (tdsIntroM ? reflow(tdsIntroM[0]) : '') +
      '\n\n' +
      tTds +
      (tdsNoteM ? '\n\n' + reflow(tdsNoteM[0]) : ''),
    tailM ? formatCryptoTail(tailM[0]) : '',
  ].filter(Boolean);

  let rest = bulletsToMarkdown(fixGluedHeading(parts.join('\n\n')));
  const { mid, ktMd, faq } = splitKeyTakeawaysAndFaq(rest);

  return nd(
    [title, '', '## Article summary', '', summary, '', mid, '', ktMd, '', faq]
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim() + '\n'
  );
}

/* Simpler path for 2-5: strip + section replacements + hand tables in replace blocks */
function buildGeneric(
  raw0,
  h1,
  titleStrip,
  firstSectionAnchor,
  tableReplacements
) {
  let body = stripHeader(nd(raw0), titleStrip);
  const ix = body.indexOf('\n\n' + firstSectionAnchor);
  const summary = ix >= 0 ? reflow(body.slice(0, ix).trim()) : '';
  let rest = ix >= 0 ? body.slice(ix + 2) : body;
  for (const { from, to } of tableReplacements) {
    rest = rest.replace(from, to);
  }
  rest = reflow(rest);
  for (const { re, rep } of tableReplacements) {
    if (re && rep && rest.includes('__SECOND_PASS__')) {
      /* no-op */
    }
  }
  return { h1, summary, rest: fixGluedHeading(bulletsToMarkdown(rest)) };
}

/* Article 2 */
function build2(raw0) {
  const title = h1Title('Taxation of Income from Selling Shares: Complete Guide for FY 2025-26');
  let body = stripHeader(nd(raw0), [
    'Taxation of Income from Selling Shares -',
    'Complete Guide for FY 2025-26',
  ]);
  const anchor = body.indexOf('Classification of Share Gains');
  const summary = anchor >= 0 ? reflow(body.slice(0, anchor).trim()) : '';
  let rest = anchor >= 0 ? body.slice(anchor) : body;

  const tClass = `| Share type | Holding for LTCG | LTCG tax rate | STCG tax rate |
| --- | --- | --- | --- |
| Listed equity shares (BSE/NSE) | More than 12 months | 12.5% above Rs. 1.25L annual exemption | 20% (Budget 2024 increase from 15%) |
| Equity mutual funds (equity-oriented) | More than 12 months | 12.5% above Rs. 1.25L annual exemption | 20% |
| Unlisted equity shares | More than 24 months | 12.5% without indexation (post Budget 2024) | Slab rate |
| Preference shares (listed) | More than 12 months | 12.5% | 20% |
| Debt mutual funds (post April 1, 2023) | Any period | Slab rate - no LTCG benefit | Slab rate |
| Foreign shares / ADRs / GDRs | More than 24 months | 12.5% without indexation | Slab rate |`;

  const tBudget = `| Tax head | Rate before Budget 2024 | Rate after Budget 2024 (July 23, 2024) | Annual exemption |
| --- | --- | --- | --- |
| Equity LTCG | 10% (above Rs. 1L exemption) | 12.5% (above Rs. 1.25L exemption) | Rs. 1.25L (enhanced from Rs. 1L) |
| Equity STCG | 15% | 20% | No exemption - full amount taxable |
| Unlisted share LTCG | 20% with indexation | 12.5% without indexation | None |
| Equity fund LTCG | 10% | 12.5% | Rs. 1.25L (shared with equity shares) |`;

  rest = rest
    .replace(
      /Classification of Share Gains - LTCG vs STCG\s*\nShare Type Holding[\s\S]*?(?=\n\nBudget 2024 Rate Changes - Before vs After)/m,
      '## Classification of share gains: LTCG vs STCG\n\n' + tClass + '\n\n'
    )
    .replace(
      /Budget 2024 Rate Changes - Before vs After\s*\nTax Head Rate[\s\S]*?(?=\n\nRs\. 1\.25 Lakh Annual Exemption)/m,
      '## Budget 2024 rate changes: before vs after\n\n' + tBudget + '\n\n'
    );

  rest = reflowPreserveTables(rest)
    .replace('Rs. 1.25 Lakh Annual Exemption - How It Works', '## Rs. 1.25 lakh annual exemption: how it works\n\n')
    .replace('📅 Pro Tip', '## Pro tip\n\n');

  const { mid, ktMd, faq } = splitKeyTakeawaysAndFaq(rest);

  return nd(
    [title, '', '## Article summary', '', summary, '', mid, '', ktMd, '', faq]
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim() + '\n'
  );
}

/* Article 3 STT */
function build3(raw0) {
  const title = h1Title('Securities Transaction Tax (STT): Latest Rates, F&O Hike & Updates');
  let body = stripHeader(nd(raw0), [
    'Securities Transaction Tax (STT) - Latest Rates,',
    'F&O Hike & Updates',
  ]);
  const anchor = body.indexOf('What is STT and Why Does It Exist?');
  const summary = anchor >= 0 ? reflow(body.slice(0, anchor).trim()) : '';
  let rest = anchor >= 0 ? body.slice(anchor) : body;

  const tRates = `| Security type | Transaction | STT rate | Paid by |
| --- | --- | --- | --- |
| Equity shares (delivery) | Purchase | 0.1% of transaction value | Buyer |
| Equity shares (delivery) | Sale | 0.1% of transaction value | Seller |
| Equity shares (intraday - no delivery) | Sale only | 0.025% of transaction value | Seller |
| Equity futures | Sale | 0.02% of price x lot size (Budget 2024 hike) | Seller |
| Equity options (on premium) | Sale | 0.1% of option premium | Seller |
| Index futures (e.g., Nifty/Sensex futures) | Sale | 0.02% of price x lot size (Budget 2024: doubled from 0.01%) | Seller |
| Index options (on premium) | Sale | 0.1% of option premium (Budget 2024: increased from 0.0625%) | Seller |
| Equity mutual fund units (buy) | Purchase (through exchange) | 0.001% of transaction value | Buyer |
| Equity mutual fund units (sell/redemption) | Sale | 0.001% of transaction value | Seller |
| Unlisted securities, bonds, debentures | Not applicable | NIL - STT not levied | N/A |`;

  const tFo = `| Instrument | Old STT rate | New STT rate (from Oct 1, 2024) | Change |
| --- | --- | --- | --- |
| Index Futures (Nifty, Sensex) | 0.01% of price x quantity | 0.02% of price x quantity | Doubled (+100%) |
| Index Options (Nifty, Sensex) | 0.0625% of premium | 0.1% of premium | +60% increase |
| Equity Futures | 0.01% of price x quantity | 0.02% of price x quantity | Doubled (+100%) |
| Equity Options | 0.0625% of premium | 0.1% of premium | +60% increase |`;

  rest = rest
    .replace(
      /Current STT Rates - All Securities \(FY 2025-26\)\s*\nSecurity Type Transaction[\s\S]*?(?=\n\nBudget 2024 - F&O STT Hike)/m,
      '## Current STT rates: all securities (FY 2025-26)\n\n' + tRates + '\n\n'
    )
    .replace(
      /Budget 2024 - F&O STT Hike\s*\n(Budget 2024 \(Finance Act 2024\)[\s\S]*?individual F&O traders\.)\s*\nInstrument Old STT Rate[\s\S]*?(?=\n\n📊 STT Impact on a Nifty Options Trade)/m,
      '## Budget 2024 F&O STT hike\n\n$1\n\n' + tFo + '\n\n'
    );

  rest = reflowPreserveTables(rest)
    .replace('What is STT and Why Does It Exist?', '## What is STT and why does it exist?\n\n')
    .replace('📊 STT Impact on a Nifty Options Trade', '## STT impact on a Nifty options trade\n\n')
    .replace('Is STT Deductible as an Expense?', '## Is STT deductible as an expense?\n\n')
    .replace('📅 Pro Tip', '## Pro tip\n\n');

  const { mid, ktMd, faq } = splitKeyTakeawaysAndFaq(rest);

  return nd(
    [title, '', '## Article summary', '', summary, '', mid, '', ktMd, '', faq]
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim() + '\n'
  );
}

/* Article 4 Diwali */
function build4(raw0) {
  const title = h1Title('Tax on Diwali and New Year Gifts: Employer, Business & Personal Gifts');
  let body = stripHeader(nd(raw0), [
    'Tax on Diwali and New Year Gifts - Employer,',
    'Business & Personal Gifts',
  ]);
  const anchor = body.indexOf('Category 1:');
  const summary = anchor >= 0 ? reflow(body.slice(0, anchor).trim()) : '';
  let rest = anchor >= 0 ? body.slice(anchor) : body;

  const tEmp = `| Employer gift scenario | Tax treatment |
| --- | --- |
| Gift vouchers/hampers worth Rs. 4,000 in total for the year | Fully exempt - below Rs. 5,000 threshold |
| Diwali gift worth Rs. 3,000 + New Year gift worth Rs. 3,500 = Rs. 6,500 total | Fully taxable - entire Rs. 6,500 is a perquisite (not just the Rs. 1,500 excess) |
| Gift in cash (any amount) | Fully taxable as salary - cash gifts have no exemption threshold |
| Gift in kind (non-cash) up to Rs. 5,000 annually | Fully exempt |
| Gift in kind above Rs. 5,000 - excess portion | Taxable as perquisite at employee's slab rate |`;

  const tBiz = `| Gift type | Threshold | Tax treatment if above Rs. 50,000 |
| --- | --- | --- |
| Cash received | Rs. 50,000 aggregate per year | Full amount taxable at slab rate (not just the excess) |
| Immovable property (land, flat) | Stamp duty value > Rs. 50,000 | Stamp duty value taxable as Other Sources income |
| Movable property (jewellery, shares, artwork, vehicles) | FMV > Rs. 50,000 | FMV taxable as Other Sources income |
| Gift vouchers / hampers from business parties | Aggregate FMV > Rs. 50,000 | Entire FMV taxable at slab rate |
| Gifts from specified relatives (parent, spouse, sibling, etc.) | No limit | ALWAYS EXEMPT - no cap on amount |`;

  rest = rest
    .replace(
      /Category 1: Gifts from Employer - Perquisite Taxation\s*\nAny gift, voucher[\s\S]*?(?=\n\nCash Gifts From Employer Have No Exemption)/m,
      '## Category 1: Gifts from employer - perquisite taxation\n\n' +
        reflow(
          rest.match(
            /Any gift, voucher, or token received from an employer[\s\S]*?taxable perquisite\./m
          )[0]
        ) +
        '\n\n' +
        tEmp +
        '\n\n'
    )
    .replace(
      /Category 2: Gifts from Business Counterparts - Section 56\(2\)\(x\)\s*\nGifts or freebies[\s\S]*?(?=\n\nCategory 3: Gifts Received in Consideration)/m,
      '## Category 2: Gifts from business counterparts - Section 56(2)(x)\n\n' +
        reflow(
          rest.match(/Gifts or freebies received from business associates[\s\S]*?exceeds Rs\. 50,000\./m)[0]
        ) +
        '\n\n' +
        tBiz +
        '\n\n'
    );

  rest = reflowPreserveTables(rest)
    .replace('Cash Gifts From Employer Have No Exemption', '## Cash gifts from employer have no exemption\n\n')
    .replace('Category 3: Gifts Received in Consideration - Business Income', '## Category 3: Gifts received in consideration - business income\n\n')
    .replace('Corporate Diwali Gifts - Tax for the Giver (Business)', '## Corporate Diwali gifts: tax for the giver (business)\n\n')
    .replace('📅 Pro Tip', '## Pro tip\n\n');

  const { mid, ktMd, faq } = splitKeyTakeawaysAndFaq(rest);

  return nd(
    [title, '', '## Article summary', '', summary, '', mid, '', ktMd, '', faq]
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim() + '\n'
  );
}

/* Article 5 gifts list */
function build5(raw0) {
  const title = h1Title('How Are Gifts Taxed in India: Gift Tax Exemption & Complete Relatives List');
  let body = stripHeader(nd(raw0), [
    'How Are Gifts Taxed in India - Gift Tax',
    'Exemption & Complete Relatives List',
  ]);
  const anchor = body.indexOf('The Legal Framework');
  const summary = anchor >= 0 ? reflow(body.slice(0, anchor).trim()) : '';
  let rest = anchor >= 0 ? body.slice(anchor) : body;

  const tOcc = `| Occasion / source | Exempt? | Condition |
| --- | --- | --- |
| Gift on occasion of marriage of the recipient | Yes, FULLY EXEMPT | Gift must be received on the occasion of the recipient's own marriage - before or after (within reasonable time) |
| Gift received from specified relative | Yes, FULLY EXEMPT | No upper limit - even Rs. 1 crore is exempt if from a specified relative |
| Gift received under a Will or inheritance | Yes, FULLY EXEMPT | Property inherited from a deceased person |
| Gift in contemplation of death of the donor | Yes, FULLY EXEMPT | Gift made by a donor who is ill and in expectation of death |
| Gift from local authority (municipality, etc.) | Yes, FULLY EXEMPT | As per Section 56(2)(x) proviso |
| Gift from any fund, foundation, educational institution, hospital, other trust as per Section 10(23C) | Yes, FULLY EXEMPT | Institutional givers covered under Section 10(23C) |`;

  const tRel = `| Relative category | Specific relatives included |
| --- | --- |
| Spouse | Husband or wife of the recipient |
| Siblings of the recipient | Brother and Sister (including half-siblings by some interpretations) |
| Siblings of the spouse | Spouse's brother and spouse's sister |
| Lineal ascendants and descendants | Parents, Grandparents, Great-grandparents (ascending); Children, Grandchildren (descending) |
| Spouses of lineal ascendants/descendants | Parents' spouses (step-parents included), children's spouses (son-in-law, daughter-in-law) |
| Spouses of siblings | Brother-in-law (sibling's spouse), Sister-in-law (sibling's spouse) |
| Spouses of spouse's siblings | Spouse's siblings' spouses |`;

  const tVal = `| Type of gift received | How it is valued | Threshold |
| --- | --- | --- |
| Cash / money | Actual amount received | Rs. 50,000 aggregate from all non-relatives in a year |
| Immovable property (land, house) - received without consideration | Stamp Duty Value (SDV) of the property | SDV > Rs. 50,000 |
| Immovable property - received at below market price | SDV minus actual consideration paid - if this difference > 10% of consideration or Rs. 50,000 (whichever higher) | Difference taxable as Other Sources |
| Movable property (shares, jewellery, artwork, bullion) - without consideration | Fair Market Value (FMV) of the property | FMV > Rs. 50,000 |
| Movable property - at below market price | FMV minus actual consideration - if difference > Rs. 50,000 | Difference taxable |`;

  rest = rest
    .replace(
      /Gifts That Are ALWAYS Exempt - Special Occasions\s*\nOccasion \/ Source Exempt\?[\s\S]*?(?=\n\nComplete Specified Relatives List - Individual Taxpayers)/m,
      '## Gifts that are always exempt: special occasions\n\n' + tOcc + '\n\n'
    )
    .replace(
      /Complete Specified Relatives List - Individual Taxpayers\s*\n(For an individual recipient, gifts from the following[\s\S]*?\(no limit\):\s*)[\s\S]*?(?=\n\n\s*Important\s*\n\s*Relatives NOT on the List)/m,
      (_, intro) =>
        '## Complete specified relatives list: individual taxpayers\n\n' +
        reflow(intro) +
        '\n\n' +
        tRel +
        '\n\n'
    )
    .replace(
      /Types of Taxable Gifts - Valuation Rules\s*\nType of Gift Received[\s\S]*?(?=\n\nMarriage Gift Exemption)/m,
      '## Types of taxable gifts: valuation rules\n\n' + tVal + '\n\n'
    );

  rest = reflowPreserveTables(rest)
    .replace(
      /\n\nImportant Relatives NOT on the List - Common Mistakes:/,
      '\n\n## Important\n\nImportant Relatives NOT on the List - Common Mistakes:'
    )
    .replace('Specified Relatives for HUF', '## Specified relatives for HUF\n\n')
    .replace(
      /^Marriage Gift Exemption - Important Details\s*/m,
      '## Marriage gift exemption: important details\n\n'
    )
    .replace(
      /^Capital Gains When Gifted Property Is Later Sold\s*/m,
      '## Capital gains when gifted property is later sold\n\n'
    )
    .replace(/^Pro Tip\s+/m, '## Pro tip\n\n');

  rest = bulletsToMarkdown(rest);
  rest = fixGluedHeading(rest);

  const { mid, ktMd, faq } = splitKeyTakeawaysAndFaq(rest);

  return nd(
    [title, '', '## Article summary', '', summary, '', mid, '', ktMd, '', faq]
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim() + '\n'
  );
}

const jobs = [
  { slug: 'taxation-cryptocurrency', build: build1Safe },
  { slug: 'taxation-income-earned-from-selling-shares', build: build2 },
  { slug: 'securities-transaction-tax-stt-latest-rates-fno-updates', build: build3 },
  { slug: 'tax-diwali-new-year-gifts', build: build4 },
  { slug: 'how-are-gifts-taxed-gift-tax-exemption-relatives-list', build: build5 },
];

const rawDir = path.join(__dirname, process.env.BATCH_RAW_DIR || 'batch5-raw');
const outDir = path.join(__dirname, process.env.BATCH_OUT_DIR || 'batch5-sources');
fs.mkdirSync(outDir, { recursive: true });

for (let i = 0; i < jobs.length; i++) {
  const raw = fs.readFileSync(path.join(rawDir, `article-${i + 1}.txt`), 'utf8');
  const md = jobs[i].build(raw);
  fs.writeFileSync(path.join(outDir, `${jobs[i].slug}.md`), md);
  console.log('wrote', jobs[i].slug, md.length);
}
