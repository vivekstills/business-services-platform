/**
 * Converts scripts/batch6-raw/article-{1..9}.txt into scripts/batch6-sources/{slug}.md
 * Run: node scripts/build-batch6-sources.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function nd(s) {
  return s
    .replace(/\u2014/g, '-')
    .replace(/\u2013/g, '-')
    .replace(/—/g, '-')
    .replace(/–/g, '-');
}

/** Join broken PDF lines into paragraphs; preserve blank-line boundaries. */
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

function stripMetaFirstLines(body, titleLines) {
  let b = body;
  for (const line of titleLines) {
    b = b.replace(new RegExp('^' + escapeRe(line) + '\\s*\\n\\n?', 'm'), '');
  }
  b = b.replace(/^Updated:[^\n]+\n\n?/m, '');
  b = b.replace(/^ARTICLE SUMMARY\s*\n\n?/m, '');
  return b.trim();
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function h1Title(...parts) {
  return '# ' + parts.join(' ').replace(/\s+/g, ' ').trim();
}

/** Build FAQ pairs: Qn. ... then answer paragraphs until next Q or end */
function formatFAQsection(text) {
  const m = text.match(/Frequently Asked Questions\s*\n\n([\s\S]*)$/i);
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

/** Turn inline PDF bullets (•) into markdown list lines after sentence boundaries. */
function bulletsToMarkdown(text) {
  return text.replace(/([.!?:])\s+•\s+/g, '$1\n\n- ').replace(/^\s*•\s+/gm, '- ');
}

function fixGluedHeading(text) {
  return text
    .replace(/\. ###/g, '.\n\n###')
    .replace(/([^\n])\s+## Important\b/g, '$1\n\n## Important\n\n')
    .replace(/^\s+## /gm, '## ')
    .replace(/^(##[^\n]+)\s{2,}(?=[A-Za-z])/gm, '$1\n\n')
    .replace(/([^\n])\n(## )/g, '$1\n\n$2');
}

function bulletifyKeyTakeaways(block) {
  if (!/^KEY TAKEAWAYS/i.test(block)) return block;
  const lines = block.split('\n\n');
  const head = lines[0];
  const rest = lines.slice(1).join('\n\n');
  const items = [...rest.matchAll(/^\s*(\d+)\.\s+(.+?)(?=\n\s*\d+\.|$)/gms)];
  let md = '## Key takeaways\n\n';
  for (const it of items) {
    md += `${it[1]}. ${it[2].replace(/\s+/g, ' ').trim()}\n`;
  }
  return md.trim();
}

const articles = [
  {
    slug: 'section-44ab-income-tax-audit-due-date-criteria-audit-report-penalty',
    build(raw0) {
      const raw = nd(raw0);
      const title = h1Title(
        'Section 44AB Income Tax Audit: Applicability,',
        'Due Date and Penalty'
      );
      let body = stripMetaFirstLines(
        raw.replace(/^ARTICLE 1 OF 9 \| TAX AUDIT\s*\n/m, ''),
        ['Section 44AB Income Tax Audit: Applicability,', 'Due Date and Penalty']
      );
      let ixWho = body.search(/\n\s*\nWho Must Get a Tax Audit/);
      if (ixWho < 0) ixWho = body.indexOf('Who Must Get a Tax Audit');
      const summary = ixWho >= 0 ? body.slice(0, ixWho).trim() : '';
      let fromWho =
        ixWho >= 0 ? body.slice(body.indexOf('Who Must Get a Tax Audit', ixWho)) : body;
      const ix10 = fromWho.indexOf('\n\nThe Rs. 10 Crore Cash Threshold Benefit');
      let rest =
        ix10 >= 0 ? fromWho.slice(ix10 + 2) : fromWho.replace(/^[\s\S]*?The Rs\. 10 Crore Cash Threshold Benefit\s*\n/m, 'The Rs. 10 Crore Cash Threshold Benefit\n');

      const applicabilityTable = `| Category | Threshold for mandatory audit | Condition |
| --- | --- | --- |
| Business (general) | Turnover or gross receipts exceed Rs. 1 crore | Standard rule |
| Business (cash threshold benefit) | Turnover exceeds Rs. 10 crore | Applies only if aggregate cash receipts are at most 5% of total receipts AND aggregate cash payments are at most 5% of total payments during the year |
| Profession | Gross receipts exceed Rs. 50 lakh | Applies to specified professionals not covered by Section 44ADA |
| Business or profession opting out of presumptive scheme (44AD or 44ADA) | Income declared below the prescribed presumptive rate | Audit mandatory even if turnover is within the normal threshold, if the taxpayer declares lower income and total income exceeds the basic exemption limit |
| Business under Section 44AE (goods vehicles) claiming lower income | Any turnover | Audit required if income declared is lower than the Section 44AE prescribed amount |`;

      rest = reflow(rest)
        .replace('The Rs. 10 Crore Cash Threshold Benefit', '## The Rs. 10 crore cash threshold benefit\n\n')
        .replace('Digital Receipts Incentive', '## Digital receipts incentive\n\n')
        .replace(
          'Presumptive Scheme Opt-Out and Audit Requirement',
          '## Presumptive scheme opt-out and audit requirement\n\n'
        )
        .replace('Example: Presumptive Opt-Out Audit Trigger', '### Example: Presumptive opt-out audit trigger\n\n')
        .replace('Forms Used in Tax Audit', '## Forms used in tax audit\n\n');

      const formsTable = `| Form | When used | Who signs |
| --- | --- | --- |
| Form 3CA | When accounts are already audited under another law (e.g., Companies Act, Co-operative Societies Act) | Chartered Accountant |
| Form 3CB | When accounts are NOT audited under any other law (most businesses and professionals) | Chartered Accountant |
| Form 3CD | Statement of particulars required under Section 44AB, filed along with Form 3CA or 3CB | Chartered Accountant (with taxpayer confirmation for specific clauses) |`;

      rest = rest.replace(
        '## Forms used in tax audit\n\n',
        '## Forms used in tax audit\n\n' + formsTable + '\n\n'
      );
      rest = rest.replace(/Form When Used Who Signs Form 3CA[\s\S]*?specific clauses\) ?/m, '').trim();

      const dueTable = `| Category | Tax audit due date | ITR due date |
| --- | --- | --- |
| Business or professional requiring tax audit (non-TP case) | September 30 of the assessment year (September 30, 2026 for AY 2026-27) | October 31 of the assessment year |
| Cases involving international or specified domestic transactions (Transfer Pricing) | October 31 of the assessment year | November 30 of the assessment year |
| Partner of a firm requiring tax audit | Same as the firm's audit due date (October 31) | October 31 |`;

       rest = rest
        .replace(
          'Due Dates for Tax Audit Report Submission',
          '## Due dates for tax audit report submission\n\n' + dueTable + '\n\n'
        )
        .replace(
          /Category Tax Audit Due Date ITR Due Date[\s\S]*?October 31 ?\n\n/gm,
          ''
        );

      rest = rest
        .replace(/\s+Important\s+The\s+/m, '\n\n## Important\n\nThe ')
        .replace(/^Penalty for Non-Compliance\s+/m, '## Penalty for non-compliance\n\n')
        .replace(/^Pro Tip\s+/m, '## Pro tip\n\n');

      rest = bulletsToMarkdown(rest);
      rest = rest.replace(/(total payments\.)\s+(If either condition)/, '$1\n\n$2');
      rest = fixGluedHeading(rest);

      const faq = formatFAQsection(rest);
      rest = faq.before;
      const kt = rest.match(/KEY TAKEAWAYS[\s\S]+?(?=\n\nFrequently Asked Questions)/i);
      let mid = kt ? rest.slice(0, kt.index).trim() : rest;
      let ktMd = kt ? bulletifyKeyTakeaways(kt[0]) : '';

      const parts = [
        title,
        '',
        '## Article summary',
        '',
        reflow(summary),
        '',
        '## Who must get a tax audit under Section 44AB?',
        '',
        'A tax audit is mandatory for the following categories of taxpayers:',
        '',
        applicabilityTable,
        '',
        mid,
        '',
        ktMd,
        '',
        faq.faq,
      ];
      return nd(parts.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n');
    },
  },
];

articles.push({
  slug: 'section-44ada-presumptive-tax-scheme-professionals',
  build(raw0) {
    const raw = nd(raw0).replace(/^ARTICLE 2 OF 9 \| PRESUMPTIVE TAXATION\s*\n/m, '');
    const title = h1Title('Section 44ADA: Presumptive Tax Scheme for', 'Professionals');
    let body = stripMetaFirstLines(raw, [
      'Section 44ADA: Presumptive Tax Scheme for',
      'Professionals',
    ]);
    const ixEl = body.indexOf('\n\nEligible Professions Under Section 44ADA');
    const summary = ixEl >= 0 ? reflow(body.slice(0, ixEl).trim()) : '';
    let rest = ixEl >= 0 ? body.slice(ixEl + 2) : body;

    const profTable = `| Profession | Category examples |
| --- | --- |
| Legal | Advocates, barristers, solicitors, notaries |
| Medical | Doctors, dentists, physiotherapists, anaesthetists, radiologists, pathologists |
| Engineering | Civil engineers, structural engineers, mechanical engineers in consulting practice |
| Architectural | Architects, town planners, landscape designers |
| Accountancy | Chartered Accountants, Cost Accountants, Company Secretaries in practice |
| Technical consultancy | IT consultants, management consultants, software development consultants |
| Interior decoration | Interior designers, space planners |
| Other notified professions | Any profession notified by CBDT under the relevant rule |`;

    rest = rest.replace(
      /^Eligible Professions Under Section 44ADA\s*\n\nSection 44ADA applies[\s\S]*?relevant rule\s*/m,
      ''
    );
    rest = rest.replace(/^Who Is NOT Eligible\s*\n\n/, '## Who is not eligible\n\n');
    rest = reflow(rest)
      .replace(
        'The Gross Receipts Threshold for FY 2025-26',
        '## The gross receipts threshold for FY 2025-26'
      )
      .replace('How the Income Computation Works', '## How the income computation works')
      .replace('Example: Section 44ADA Computation', '### Example: Section 44ADA computation')
      .replace('Interaction With New Tax Regime', '## Interaction with new tax regime')
      .replace('Advance Tax Under Section 44ADA', '## Advance tax under Section 44ADA')
      .replace('Opting Out and the 5-Year Restriction', '## Opting out and audit requirement')
      .replace('Pro Tip', '## Pro tip');

    const threshTable = `| Cash receipt condition | Applicable gross receipts limit |
| --- | --- |
| Cash receipts are at most 5% of total gross professional receipts | Rs. 75 lakh (enhanced limit) |
| Cash receipts exceed 5% of total gross professional receipts | Rs. 50 lakh (standard limit) |`;

    const regimeTable = `| Aspect | Old tax regime | New tax regime |
| --- | --- | --- |
| 80C, 80D, 80G deductions | Available | Not available |
| 80CCD(2) employer NPS | Available (if applicable) | Available (one of few deductions permitted) |
| Standard deduction | Not applicable to professionals | Not applicable to professionals under 44ADA |
| Tax slabs | Old slabs with higher rates | New slabs with lower rates and Rs. 12L rebate |
| Overall verdict | Better if deductions exceed roughly Rs. 3-4 lakh | Better for those with few deductions |`;

    rest = rest.replace(
      '## The gross receipts threshold for FY 2025-26',
      '## The gross receipts threshold for FY 2025-26\n\n' + threshTable + '\n\n'
    );
    rest = rest.replace(
      /Cash Receipt Condition Applicable Gross Receipts Limit[\s\S]*?Rs\. 50 lakh \(standard limit\) ?/m,
      ''
    );
    rest = rest.replace(
      '## Interaction with new tax regime\n\n',
      '## Interaction with new tax regime\n\n' + regimeTable + '\n\n'
    );
    rest = rest.replace(
      /Aspect Old Tax Regime New Tax Regime[\s\S]*?few deductions ?\n\n/gm,
      ''
    );

    const faq = formatFAQsection(rest);
    rest = faq.before;
    const kt = rest.match(/KEY TAKEAWAYS[\s\S]+?(?=\n\nFrequently Asked Questions)/i);
    let mid = kt ? rest.slice(0, kt.index).trim() : rest;
    let ktMd = kt ? bulletifyKeyTakeaways(kt[0]) : '';

    mid = reflow(mid)
      .replace(/^## Who is not eligible\n\n/, '## Who is not eligible\n\n')
      .replace(/^## Interaction/, '## Interaction');

    const out = [
      title,
      '',
      '## Article summary',
      '',
      summary,
      '',
      '## Eligible professions under Section 44ADA',
      '',
      'Section 44ADA applies to resident individuals carrying on any of the following professions as specified under Section 44AA(1):',
      '',
      profTable,
      '',
      mid,
      '',
      ktMd,
      '',
      faq.faq,
    ];
    return nd(out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n');
  },
});

// Remaining articles: simpler generic pass + manual table injections via dedicated builders
function matArticle(raw0) {
  let raw = nd(raw0).replace(/^ARTICLE 3 OF 9 \| CORPORATE TAXATION\s*\n/m, '');
  const title = h1Title('Minimum Alternate Tax (MAT): Eligibility,', 'Calculation and Credit');
  raw = stripMetaFirstLines(raw, [
    'Minimum Alternate Tax (MAT): Eligibility,',
    'Calculation and Credit',
  ]);
  const summaryPart = raw.match(/^([\s\S]*?)\n\nWhat is MAT and Why Does It Exist\?/);
  const summary = summaryPart ? reflow(summaryPart[1].trim()) : '';
  let rest = raw.slice(summaryPart ? summaryPart[0].length - 'What is MAT'.length : 0);

  const rateTable = `| Component | Rate |
| --- | --- |
| Base MAT rate | 15% of book profit |
| Surcharge (if book profit tax base > Rs. 1 crore) | 7% on MAT (for net income > Rs. 1 crore to Rs. 10 crore) |
| Surcharge (if book profit tax base > Rs. 10 crore) | 12% on MAT (for net income above Rs. 10 crore) |
| Health and Education Cess | 4% on (MAT + Surcharge) |
| Effective MAT rate (no surcharge) | 15% + 4% cess = 15.6% |
| Effective MAT rate (with 12% surcharge) | 15% + 12% surcharge + 4% cess = 17.47% approximately |`;

  rest = reflow(rest)
    .replace('What is MAT and Why Does It Exist?', '## What is MAT and why does it exist?')
    .replace('MAT Rate and Its Components', '## MAT rate and its components\n\n' + rateTable + '\n')
    .replace(/Component Rate Base MAT rate[\s\S]*?approximately ?/m, '')
    .replace('Book Profit Computation Under Section 115JB', '## Book profit computation under Section 115JB')
    .replace('MAT vs Regular Tax: Which is Payable?', '## MAT vs regular tax: which is payable?')
    .replace('Example: MAT vs Regular Tax Decision', '### Example: MAT vs regular tax decision')
    .replace('MAT Credit Entitlement Under Section 115JAA', '## MAT credit entitlement under Section 115JAA')
    .replace('Who is Exempt from MAT?', '## Who is exempt from MAT?')
    .replace('Pro Tip', '## Pro tip');

  const creditTable = `| MAT credit rule | Detail |
| --- | --- |
| Carry forward period | 15 assessment years from the year of credit |
| Utilisation condition | Regular tax in future year must exceed MAT in that year |
| Amount utilisable | Regular tax minus MAT in the utilisation year (not the full credit at once) |
| Interest on MAT credit | No interest is paid on MAT credit carried forward |
| MAT credit on amalgamation | The transferee company can carry forward the transferor's MAT credit (subject to conditions) |`;

  rest = rest.replace(
    '## MAT credit entitlement under Section 115JAA\n\n',
    '## MAT credit entitlement under Section 115JAA\n\n' + creditTable + '\n\n'
  );
  rest = rest.replace(
    /MAT Credit Rule Detail Carry forward period[\s\S]*?conditions\) ?\n\n/m,
    ''
  );

  const faq = formatFAQsection(rest);
  rest = faq.before;
  const kt = rest.match(/KEY TAKEAWAYS[\s\S]+?(?=\n\nFrequently Asked Questions)/i);
  let ktMd = kt ? bulletifyKeyTakeaways(kt[0]) : '';
  let mid = kt ? rest.slice(0, kt.index).trim() : rest;

  const out = [title, '', '## Article summary', '', summary, '', mid, '', ktMd, '', faq.faq];
  return nd(out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n');
}

articles.push({ slug: 'minimum-alternate-tax-mat-eligibility-calculation', build: matArticle });

function surchargeArticle(raw0) {
  let raw = nd(raw0).replace(/^ARTICLE 4 OF 9 \| TAX COMPUTATION\s*\n/m, '');
  const title = h1Title('Income Tax Surcharge Rates and Marginal Relief', 'for AY 2026-27');
  raw = stripMetaFirstLines(raw, [
    'Income Tax Surcharge Rates and Marginal Relief',
    'for AY 2026-27',
  ]);
  const summaryPart = raw.match(/^([\s\S]*?)\n\nSurcharge Rates for Individuals and HUFs/s);
  const summary = summaryPart ? reflow(summaryPart[1].trim()) : '';
  let rest = raw.slice(summaryPart ? summaryPart[0].length - 'Surcharge Ra'.length : 0);

  const indTable = `| Total income range | Surcharge rate - Old regime | Surcharge rate - New regime (115BAC) |
| --- | --- | --- |
| Up to Rs. 50 lakh | Nil | Nil |
| Above Rs. 50 lakh to Rs. 1 crore | 10% on income tax | 10% on income tax |
| Above Rs. 1 crore to Rs. 2 crore | 15% on income tax | 15% on income tax |
| Above Rs. 2 crore to Rs. 5 crore | 25% on income tax | 25% on income tax |
| Above Rs. 5 crore | 37% on income tax (old regime) | 25% on income tax (new regime cap - Budget 2023) |`;

  const otherTable = `| Taxpayer category | Income range | Surcharge rate |
| --- | --- | --- |
| Domestic companies (regular) | Income up to Rs. 1 crore | Nil |
| Domestic companies (regular) | Income Rs. 1 crore to Rs. 10 crore | 7% |
| Domestic companies (regular) | Income above Rs. 10 crore | 12% |
| Domestic companies under 115BAA/115BAB | Any income | 10% flat (regardless of income level) |
| Foreign companies | Income up to Rs. 1 crore | Nil |
| Foreign companies | Income Rs. 1 crore to Rs. 10 crore | 2% |
| Foreign companies | Income above Rs. 10 crore | 5% |
| Partnership firms and LLPs | Any income | 12% flat (no income threshold) |
| Co-operative societies (new regime 115BAD) | Any income | 10% flat |`;

  rest = reflow(rest)
    .replace(
      'Surcharge Rates for Individuals and HUFs (AY 2026-27)',
      '## Surcharge rates for individuals and HUFs (AY 2026-27)\n\n' + indTable + '\n'
    )
    .replace(
      /Total Income Range Surcharge Rate - Old[\s\S]*?Budget 2023\) ?/m,
      ''
    )
    .replace('New Regime Surcharge Cap at 25%', '## New regime surcharge cap at 25%')
    .replace(
      'Surcharge Rates for Other Taxpayer Categories',
      '## Surcharge rates for other taxpayer categories\n\n' + otherTable + '\n'
    )
    .replace(
      /Taxpayer Category Income Range Surcharge Rate Domestic companies[\s\S]*?10% flat ?\n\n/m,
      ''
    )
    .replace(
      'Marginal Relief: What It Is and How It Works',
      '## Marginal relief: what it is and how it works'
    )
    .replace('Example: Marginal Relief Worked Example', '### Example: Marginal relief worked example')
    .replace(
      'Surcharge on Capital Gains with Special Tax Rates',
      '## Surcharge on capital gains with special tax rates'
    )
    .replace('Pro Tip', '## Pro tip');

  const faq = formatFAQsection(rest);
  rest = faq.before;
  const kt = rest.match(/KEY TAKEAWAYS[\s\S]+?(?=\n\nFrequently Asked Questions)/i);
  let ktMd = kt ? bulletifyKeyTakeaways(kt[0]) : '';
  let mid = kt ? rest.slice(0, kt.index).trim() : rest;

  const out = [title, '', '## Article summary', '', summary, '', mid, '', ktMd, '', faq.faq];
  return nd(out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n');
}

articles.push({ slug: 'income-tax-surcharge-marginal-relief-ay-2026-27', build: surchargeArticle });

function section36Article(raw0) {
  let raw = nd(raw0).replace(/^ARTICLE 5 OF 9 \| BUSINESS DEDUCTIONS\s*\n/m, '');
  const title = h1Title('Section 36 of Income Tax Act: Expenses Allowed', 'as Deductions');
  raw = stripMetaFirstLines(raw, [
    'Section 36 of Income Tax Act: Expenses Allowed',
    'as Deductions',
  ]);
  const summaryPart = raw.match(/^([\s\S]*?)\n\nOverview of Section 36 Deductions/s);
  const summary = summaryPart ? reflow(summaryPart[1].trim()) : '';
  let rest = raw.slice(summaryPart ? summaryPart[0].length - 'Overview of'.length : 0);

  const clauseTable = `| Section 36 clause | Deduction allowed | Key condition or limit |
| --- | --- | --- |
| 36(1)(i) | Insurance premium against risk of damage or destruction of stocks in trade | Premium must be paid for insurance of trading stock only |
| 36(1)(ia) | Insurance premium paid for health of employees under a scheme framed by the General Insurance Corporation or approved insurers | Paid on health of employees, not partners or proprietors |
| 36(1)(ib) | Insurance premium paid under a Keyman Insurance Policy | Deductible when premium is paid; but maturity proceeds are taxable as business income |
| 36(1)(ii) | Bonus or commission paid to employees | Must be paid for services rendered; cannot be in lieu of dividends; Section 43B conditions apply (payment before ITR filing date) |
| 36(1)(iii) | Interest on borrowed capital | Capital must be borrowed for business purposes; interest must actually be paid or payable |
| 36(1)(iiia) | Discount on zero coupon bonds | Pro-rated over the life of the bond |
| 36(1)(iv) | Employer's contribution to a Recognised Provident Fund or an approved Superannuation Fund | Subject to overall limits under the relevant fund rules and Section 43B (payment timing) |
| 36(1)(iva) | Employer's contribution to NPS for employees | Up to 10% of employee's salary (Basic + DA); deductible in the year of payment |
| 36(1)(v) | Employer's contribution to an approved Gratuity Fund | Deductible in year of payment; actuarially determined contributions allowed |
| 36(1)(vi) | Allowance in respect of animals used for business that die or become useless | Based on actual cost minus scrap or carcass value |
| 36(1)(vii) | Bad debts written off | Debt must have been taken into account in computing income of prior years; must be actually written off in books |
| 36(1)(viia) | Provision for bad and doubtful debts (banks and financial institutions only) | Scheduled banks: 8.5% of rural advances + 10% of other advances; other specified institutions: 5% of income |
| 36(1)(viii) | Special reserve created by certain financial institutions (housing finance, NBFC) | Deduction for amount transferred to special reserve, subject to limits |
| 36(1)(xv) | Securities Transaction Tax (STT) paid | Deductible only where the securities transaction is treated as business income (F&O traders, not for capital gains) |
| 36(1)(xvi) | Commodities Transaction Tax (CTT) paid | Same condition as STT - deductible only if underlying transaction is business income |`;

  rest = rest.replace(
    /^Overview of Section 36 Deductions\s*\n\nSection 36 is a list[\s\S]*?Income Tax Act, 1961\.\s*\n\n/s,
    ''
  );
  rest = rest.replace(
    /^Section 36 Clause Deduction Allowed Key Condition or Limit[\s\S]*?36\(1\)\(xvi\)[\s\S]*?business income\s*/m,
    ''
  );
  rest = reflow(rest)
    .replace(
      'Bad Debts Under Section 36(1)(vii) - Key Rules',
      '## Bad debts under Section 36(1)(vii): key rules'
    )
    .replace(
      /^Important\s+/m,
      '## Important\n\nPrior to Amendment in AY 2014-15:'
    )
    .replace(
      'Interest on Borrowed Capital - Section 36(1)(iii)',
      '## Interest on borrowed capital: Section 36(1)(iii)'
    )
    .replace(
      'Section 43B - Payment Timing Rule for Several Section 36 Items',
      '## Section 43B: payment timing rule for several Section 36 items'
    )
    .replace('Pro Tip', '## Pro tip');

  const faq = formatFAQsection(rest);
  rest = faq.before;
  const kt = rest.match(/KEY TAKEAWAYS[\s\S]+?(?=\n\nFrequently Asked Questions)/i);
  let ktMd = kt ? bulletifyKeyTakeaways(kt[0]) : '';
  let mid = kt ? rest.slice(0, kt.index).trim() : rest;

  const out = [
    title,
    '',
    '## Article summary',
    '',
    summary,
    '',
    '## Overview of Section 36 deductions',
    '',
    'Section 36 is a list of specific allowable deductions from business income that supplement the general deduction under Section 37 (which allows any expenditure wholly and exclusively for business purposes). While Section 37 has a residual catch-all character, Section 36 provides explicit statutory authority for specific categories of expenditure. Understanding Section 36 is important because some of these deductions have specific conditions, limits, or computational rules that differ from the general principles under Section 37.',
    '',
    '## Section 36 clause reference',
    '',
    clauseTable,
    '',
    mid,
    '',
    ktMd,
    '',
    faq.faq,
  ];
  return nd(out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n');
}

articles.push({ slug: 'section-36-expenses-allowed-for-deduction', build: section36Article });

function shippingArticle(raw0) {
  let raw = nd(raw0).replace(/^ARTICLE 6 OF 9 \| INTERNATIONAL TAXATION\s*\n/m, '');
  const title = h1Title('Section 44B and Section 172: Income Tax on', 'Shipping Business');
  raw = stripMetaFirstLines(raw, [
    'Section 44B and Section 172: Income Tax on',
    'Shipping Business',
  ]);
  const summaryPart = raw.match(/^([\s\S]*?)\n\nSection 44B: Presumptive/s);
  const summary = summaryPart ? reflow(summaryPart[1].trim()) : '';
  let rest = raw.slice(summaryPart ? summaryPart[0].length - 'Section 44B'.length : 0);

  const s44Table = `| Component | Detail |
| --- | --- |
| Applicable to | Non-resident persons and foreign companies operating ships |
| Presumed income rate | 7.5% of specified receipts from Indian voyages |
| Tax rate on deemed income | 40% (foreign company rate) plus surcharge and cess |
| Effective rate as percentage of receipts | Approximately 3% of gross shipping receipts (7.5% x 40%) |
| Deductions allowed from 7.5% | No deductions are permitted from the deemed income |`;

  rest = reflow(rest)
    .replace(
      'Section 44B: Presumptive Taxation for Non-Resident Shipping',
      '## Section 44B: Presumptive taxation for non-resident shipping\n\n' + s44Table + '\n'
    )
    .replace(
      /Component Amount Applicable to Non-resident[\s\S]*?deemed income ?/m,
      ''
    )
    .replace("Section 172: Voyage-by-Voyage Tax Collection", '## Section 172: Voyage-by-voyage tax collection')
    .replace('Section 172 vs Section 44B Relationship', '## Section 172 vs Section 44B relationship')
    .replace('Tax Treaty Override', '## Tax treaty override')
    .replace(
      'Tonnage Tax Scheme: Alternative for Indian Shipping Companies',
      '## Tonnage Tax Scheme: alternative for Indian shipping companies'
    )
    .replace('Pro Tip', '## Pro tip');

  const faq = formatFAQsection(rest);
  rest = faq.before;
  const kt = rest.match(/KEY TAKEAWAYS[\s\S]+?(?=\n\nFrequently Asked Questions)/i);
  let ktMd = kt ? bulletifyKeyTakeaways(kt[0]) : '';
  let mid = kt ? rest.slice(0, kt.index).trim() : rest;

  const out = [title, '', '## Article summary', '', summary, '', mid, '', ktMd, '', faq.faq];
  return nd(out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n');
}

articles.push({ slug: 'section-44b-section-172-income-tax-act', build: shippingArticle });

function form67Article(raw0) {
  let raw = nd(raw0).replace(/^ARTICLE 7 OF 9 \| INTERNATIONAL TAXATION\s*\n/m, '');
  const title = h1Title('Form 67 and Foreign Tax Credit: How to Claim', 'Relief on Taxes Paid Abroad');
  raw = stripMetaFirstLines(raw, [
    'Form 67 and Foreign Tax Credit: How to Claim',
    'Relief on Taxes Paid Abroad',
  ]);
  const ixLegal = raw.indexOf('\n\nLegal Basis for Foreign Tax Credit');
  const summary = ixLegal >= 0 ? reflow(raw.slice(0, ixLegal).trim()) : '';
  let rest = ixLegal >= 0 ? raw.slice(ixLegal + 2) : raw;

  rest = rest.replace(
    /Form 67 is filed separately from the ITR itself\.\s*\n6\. Log in to the IT portal at incometax\.gov\.in\.\s*\n7\. Navigate to:[\s\S]*?11\. Then proceed to file the ITR, which will reference the Form 67 claim\.\s*/m,
    `Form 67 is filed separately from the ITR itself.

### Steps

1. Log in to the IT portal at incometax.gov.in.

2. Navigate to: e-File > Income Tax Forms > File Income Tax Forms > Form 67.

3. Select the relevant Assessment Year and fill in: the country where tax was paid, the nature of income (salary, dividends, interest, etc.), the amount of foreign income in the foreign currency and INR, the amount of foreign tax paid in foreign currency and INR, and the exchange rate used.

4. Upload supporting documents: Tax assessment order or withholding tax certificate from the foreign country showing the tax paid (must be in the foreign country's official language; if not in English, attach a certified translation).

5. Submit and e-verify Form 67 using Aadhaar OTP or digital signature.

6. Then proceed to file the ITR, which will reference the Form 67 claim.

`
  );

  const whoTable = `| Condition | Details |
| --- | --- |
| Eligible claimant | Resident and Ordinarily Resident (ROR) individuals, companies, and other entities in India |
| RNOR and NRI | Not eligible for FTC since their foreign income is generally not taxable in India |
| Income type | Foreign income that is included in the Indian tax computation and also taxed abroad |
| Foreign tax eligible | Tax paid in a foreign country on income that is also taxed in India; must be an income tax (not sales tax, VAT, customs, or other non-income taxes) |
| DTAA countries | Credit under Section 90; generally limited to the lower of Indian tax or foreign tax on the same income |
| Non-DTAA countries | Credit under Section 91; limited to the lower of Indian tax rate or foreign tax rate on the doubly taxed income |`;

  rest = reflow(rest)
    .replace('Legal Basis for Foreign Tax Credit', '## Legal basis for foreign tax credit\n\n')
    .replace('Who Can Claim Foreign Tax Credit?', '## Who can claim foreign tax credit?\n\n' + whoTable + '\n')
    .replace(
      /Condition Details Eligible claimant Resident[\s\S]*?doubly taxed income ?/m,
      ''
    )
    .replace('Foreign Tax Credit Computation', '## Foreign tax credit computation\n\n')
    .replace('Example: Foreign Tax Credit Calculation', '### Example: Foreign tax credit calculation\n\n')
    .replace('Form 67: Filing Requirement and Procedure', '## Form 67: Filing requirement and procedure\n\n');

  rest = rest
    .replace(/^Important\s+/m, '## Important\n\n')
    .replace('Documents Required for Form 67', '## Documents required for Form 67\n\n')
    .replace('Pro Tip', '## Pro tip\n\n');

  rest = bulletsToMarkdown(rest);
  rest = fixGluedHeading(rest);

  const faq = formatFAQsection(rest);
  rest = faq.before;
  const kt = rest.match(/KEY TAKEAWAYS[\s\S]+?(?=\n\nFrequently Asked Questions)/i);
  let ktMd = kt ? bulletifyKeyTakeaways(kt[0]) : '';
  let mid = kt ? rest.slice(0, kt.index).trim() : rest;

  const out = [title, '', '## Article summary', '', summary, '', mid, '', ktMd, '', faq.faq];
  return nd(out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n');
}

articles.push({ slug: 'form-67-claim-foreign-tax-credit', build: form67Article });

function helplineArticle(raw0) {
  let raw = nd(raw0).replace(/^ARTICLE 8 OF 9 \| TAX COMPLIANCE\s*\n/m, '');
  const title = h1Title(
    'Income Tax Customer Care Number and',
    'Helpline: All Contact Details'
  );
  raw = stripMetaFirstLines(raw, [
    'Income Tax Customer Care Number and',
    'Helpline: All Contact Details',
  ]);
  const ixPri = raw.indexOf('\n\nPrimary Helpline Numbers');
  const summary = ixPri >= 0 ? reflow(raw.slice(0, ixPri).trim()) : '';
  let rest = ixPri >= 0 ? raw.slice(ixPri + 2) : raw;

  rest = rest.replace(
    /grievance on the IT portal:\s*\n12\. Log in at incometax\.gov\.in using your PAN and password\.\s*\n13\. Navigate to:[\s\S]*?17\. Grievances are typically resolved within 30 to 45 days\. Escalation is possible if not\s*\n?resolved within the timeframe\.\s*\n/m,
    `grievance on the IT portal:

### Steps

1. Log in at incometax.gov.in using your PAN and password.

2. Navigate to: e-Nivaran (Grievance) or the Helpdesk option in the top menu.

3. Select the grievance category (Refund, ITR Processing, PAN, TDS, Demand, etc.).

4. Describe the issue, attach supporting documents (acknowledgement number, Form 26AS, bank statement for refund issues), and submit.

5. A grievance reference number (GRN) is generated. Track the status using this GRN.

6. Grievances are typically resolved within 30 to 45 days. Escalation is possible if not resolved within the timeframe.

`
  );

  const phoneTable = `| Helpline | Availability | Best for |
| --- | --- | --- |
| Aaykar Sampark Kendra (ASK) 1800 180 1961 | Monday to Saturday, 8 AM to 8 PM | General tax queries, PAN/TAN issues, e-filing help, refund status |
| Income Tax Portal Helpdesk 1800 103 0025 | Monday to Saturday, 8 AM to 8 PM | Technical issues with IT portal, e-filing errors, login problems |
| Income Tax Portal Helpdesk (alternate) 1800 419 0025 | Monday to Saturday, 8 AM to 8 PM | Same as above |
| CPC Bengaluru (ITR Processing) 1800 103 4455 | Monday to Saturday, 8 AM to 8 PM | ITR processing status, CPC intimation under Section 143(1), refund delay |
| Aadhaar-linked PAN queries: contact UIDAI 1947 | All days | Aadhaar-PAN linking, Aadhaar updates |`;

  const emailTable = `| Purpose | Email address |
| --- | --- |
| General income tax queries and grievances | ask@incometax.gov.in |
| IT portal technical issues (login, e-filing, digital signature) | helpdesk@incometax.gov.in |
| Centralized Processing Centre (CPC) ITR processing queries | cpc.bng@incometax.gov.in |
| PAN card related issues (NSDL) | tininfo@nsdl.co.in |
| PAN card (UTITSL) | utiitsl.gsd@utiitsl.com |`;

  const cpcTable = `| CPC query type | Resolution channel |
| --- | --- |
| ITR still showing as 'Processing' after 90 days | Call 1800 103 4455 or email cpc.bng@incometax.gov.in with PAN and acknowledgement number |
| Refund not credited despite intimation showing 'Refund Determined' | Call CPC helpline; also check that bank account is correctly linked and pre-validated on portal |
| Section 143(1) intimation shows additional demand | File online response through 'Pending Actions > Response to Outstanding Demand' on portal |
| ITR returns to 'Defective Return' status | File a revised return correcting the defect within the time allowed in the notice |
| Received Notice under Section 139(9) for defective return | Respond on portal within 15 days or file a revised return |`;

  rest = reflow(rest)
    .replace('Primary Helpline Numbers', '## Primary helpline numbers\n\n' + phoneTable + '\n')
    .replace(
      /Helpline Number Availability Best For Aaykar Sampark Kendra[\s\S]*?Aadhaar updates ?/m,
      ''
    )
    .replace(
      'Email Support Channels',
      '## Email support channels\n\n' + emailTable + '\n'
    )
    .replace(/Purpose Email Address[\s\S]*?utiitsl\.gsd@utiitsl\.com ?/m, '')
    .replace('How to Raise a Grievance on the IT Portal', '## How to raise a grievance on the IT portal\n\n');

  rest = rest
    .replace(
      'CPC Bengaluru: For ITR Processing and Refund Issues',
      '## CPC Bengaluru: for ITR processing and refund issues\n\n' + cpcTable + '\n'
    )
    .replace(
      /CPC Query Type Resolution Channel ITR still showing[\s\S]*?revised return ?\n\n/m,
      ''
    )
    .replace(
      'Aaykar Seva Kendra: In-Person Assistance',
      '## Aaykar Seva Kendra: in-person assistance\n\n'
    )
    .replace('Pro Tip', '## Pro tip\n\n');

  rest = bulletsToMarkdown(rest);
  rest = fixGluedHeading(rest);

  const faq = formatFAQsection(rest);
  rest = faq.before;
  const kt = rest.match(/KEY TAKEAWAYS[\s\S]+?(?=\n\nFrequently Asked Questions)/i);
  let ktMd = kt ? bulletifyKeyTakeaways(kt[0]) : '';
  let mid = kt ? rest.slice(0, kt.index).trim() : rest;

  const out = [title, '', '## Article summary', '', summary, '', mid, '', ktMd, '', faq.faq];
  return nd(out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n');
}

articles.push({ slug: 'income-tax-customer-care-number-helpline-toll-free-number-email-id', build: helplineArticle });

function form3cdArticle(raw0) {
  let raw = nd(raw0).replace(/^ARTICLE 9 OF 9 \| TAX AUDIT\s*\n/m, '');
  const title = h1Title('Tax Audit Report Form 3CD:', 'Key Clauses Explained');
  raw = stripMetaFirstLines(raw, ['Tax Audit Report Form 3CD:', 'Key Clauses Explained']);
  const summaryPart = raw.match(/^([\s\S]*?)\n\nWhat is Form 3CD and How It Fits/s);
  const summary = summaryPart ? reflow(summaryPart[1].trim()) : '';
  let rest = raw.slice(summaryPart ? summaryPart[0].length - 'What is For'.length : 0);

  const c18 = `| Clause | Disclosure required |
| --- | --- |
| 1 and 2 | Name, PAN, and address of the taxpayer; nature of business or profession |
| 3 | Whether accounts are maintained on mercantile (accrual) or cash basis; any change in method from prior year must be disclosed and the effect quantified |
| 4 | Whether there is any change in the method of valuation of closing stock from the prior year; if yes, the impact on profit or loss |
| 5 | Name and address of the firm, address of principal place of business |
| 6 | Whether the report relates to a partnership firm; if yes, whether the partnership deed authorises remuneration and interest to partners (critical for Section 40(b) deductibility) |`;

  const cDup = `| Clause | Disclosure required |
| --- | --- |
| 19 | Amounts not credited to the P&L account: items of a capital nature, items exempt under Section 10, items covered under Sections 28 to 43D, and other items - full details required |
| 21 | Amounts debited to P&L but disallowable under Sections 40, 40A, 43B, etc. - each disallowance must be separately listed with the applicable section and amount |
| 22 | Amount of interest inadmissible under Section 23 of the Micro, Small and Medium Enterprises Development Act 2006 (interest on delayed payments to MSMEs) |
| 23 | Whether any payment to related persons (Section 40A(2)(b)) exceeds the fair market value; excess amount to be disclosed |
| 24 | Amounts covered by Section 43B: PF, ESI, bonus, interest on government loans, leave encashment, etc. - both the amount payable and the amount actually paid before the ITR due date must be disclosed separately |`;

  const riskTable = `| Form 3CD clause | What triggers scrutiny risk |
| --- | --- |
| Clause 3 (change in accounting method) | Change from cash to mercantile or vice versa without disclosure can lead to income escaping tax |
| Clause 18 (depreciation) | Incorrect block rates, additions claimed without invoice support, WDV mismatch with prior year return |
| Clause 21 (disallowances) | Large amounts disallowable under 40A(3) (cash payments above Rs. 10,000), or 43B non-compliance |
| Clause 34 (TDS) | Non-deduction of TDS on large contractor or professional fee payments leads to 30% disallowance under Section 40(a)(ia) |
| Clause 40 (SFT reporting) | Non-reporting of specified financial transactions (SFT) above threshold amounts |`;

  rest = reflow(rest)
    .replace(
      'What is Form 3CD and How It Fits Into the Tax Audit',
      '## What is Form 3CD and how it fits into the tax audit'
    )
    .replace(
      'Key Clauses Grouped by Category',
      '## Key clauses grouped by category'
    )
    .replace('Business Information and Accounting Method (Clauses 1-8)', '### Business information and accounting method (Clauses 1-8)\n\n' + c18 + '\n')
    .replace(
      /Clause Disclosure Required 1 and 2 Name, PAN[\s\S]*?Section 40\(b\) deductibility\) ?/m,
      ''
    )
    .replace('Related Party and Loan Transactions (Clauses 19-23)', '### Related party and loan transactions (Clauses 19-24)\n\n' + cDup + '\n')
    .replace(
      /Clause Disclosure Required 19 Amounts not credited[\s\S]*?ITR due date must be disclosed separately ?/m,
      ''
    )
    .replace('Depreciation (Clause 18)', '## Depreciation (Clause 18)')
    .replace('TDS Compliance (Clause 34)', '## TDS compliance (Clause 34)')
    .replace(
      'GAAR and International Transactions (Clauses 30C and 30D)',
      '## GAAR and international transactions (Clauses 30C and 30D)'
    )
    .replace('GST Reconciliation (Clause 44)', '## GST reconciliation (Clause 44)')
    .replace(
      'Form 3CD Clause What Triggers Scrutiny Risk',
      '## Scrutiny risk indicators\n\n' + riskTable
    )
    .replace(
      /Clause 3 \(change in[\s\S]*?threshold amounts ?/m,
      ''
    )
    .replace('Pro Tip', '## Pro tip');

  const faq = formatFAQsection(rest);
  rest = faq.before;
  const kt = rest.match(/KEY TAKEAWAYS[\s\S]+?(?=\n\nFrequently Asked Questions)/i);
  let ktMd = kt ? bulletifyKeyTakeaways(kt[0]) : '';
  let mid = kt ? rest.slice(0, kt.index).trim() : rest;

  const out = [title, '', '## Article summary', '', summary, '', mid, '', ktMd, '', faq.faq];
  return nd(out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n');
}

articles.push({ slug: 'form-3cd-tax-audit-key-clauses-explained', build: form3cdArticle });

// --- run ---
const rawDir = path.join(__dirname, 'batch6-raw');
const outDir = path.join(__dirname, 'batch6-sources');
fs.mkdirSync(outDir, { recursive: true });

for (let i = 0; i < articles.length; i++) {
  const raw = fs.readFileSync(path.join(rawDir, `article-${i + 1}.txt`), 'utf8');
  const md = articles[i].build(raw);
  fs.writeFileSync(path.join(outDir, `${articles[i].slug}.md`), md);
  console.log('wrote', articles[i].slug, md.length);
}
