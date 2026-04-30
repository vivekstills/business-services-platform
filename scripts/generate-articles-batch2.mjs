/**
 * Generates /articles/*.md for Batch 2 with YAML frontmatter,
 * FAQ formatting, related links, disclaimer. Run: node scripts/generate-articles-batch2.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'articles');

function noEmDash(s) {
  return s
    .replace(/\u2014/g, ', ')
    .replace(/\u2013/g, '-')
    .replace(/—/g, ', ');
}

function rs(s) {
  return s.replace(/₹/g, 'Rs. ');
}

function wordCount(s) {
  return noEmDash(rs(s))
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function readingMinutes(body) {
  return Math.max(1, Math.ceil(wordCount(body) / 200));
}

function fm(meta, body) {
  const rt = `${readingMinutes(body)} minutes`;
  return `---
title: "${meta.title}"
slug: "${meta.slug}"
description: "${meta.description}"
category: "${meta.category}"
tags: [${meta.tags.map((t) => `"${t}"`).join(', ')}]
date_published: "${meta.date}"
last_updated: "${meta.date}"
author: "Editorial Team"
reading_time: "${rt}"
---

${body.trim()}
`;
}

const DATE = '2026-04-30';

const related = {
  'itr-filing-which-form.md': [
    '[Section 80CCD(1B): extra Rs. 50,000 NPS deduction](./deductions-under-section-80ccd.md)',
    '[GST registration guide](./gst-registration-guide-2024.md)',
    '[Private limited company registration](./private-limited-company-registration.md)',
  ],
  'fssai-registration-vs-license.md': [
    '[Trademark registration in India](./trademark-registration-india.md)',
    '[GST registration guide](./gst-registration-guide-2024.md)',
    '[Private limited company registration](./private-limited-company-registration.md)',
  ],
  'trademark-registration-india.md': [
    '[FSSAI registration vs license](./fssai-registration-vs-license.md)',
    '[Private limited company registration](./private-limited-company-registration.md)',
    '[GST registration guide](./gst-registration-guide-2024.md)',
  ],
  'deductions-under-section-80ccd.md': [
    '[Which ITR form to use](./itr-filing-which-form.md)',
    '[GST registration guide](./gst-registration-guide-2024.md)',
    '[Private limited company registration](./private-limited-company-registration.md)',
  ],
  'private-limited-company-registration.md': [
    '[GST registration guide](./gst-registration-guide-2024.md)',
    '[Trademark registration in India](./trademark-registration-india.md)',
    '[FSSAI registration vs license](./fssai-registration-vs-license.md)',
  ],
  'gst-registration-guide-2024.md': [
    '[Which ITR form to use](./itr-filing-which-form.md)',
    '[Section 80CCD(1B) deduction](./deductions-under-section-80ccd.md)',
    '[Private limited company registration](./private-limited-company-registration.md)',
  ],
};

function footer(filename) {
  const rel = related[filename] || [];
  const lines = rel.map((x) => `- ${x}`).join('\n');
  return `

## Related articles

${lines}

---

> **Disclaimer:** This article is for informational purposes only and does not constitute professional legal, tax, or financial advice. Laws and regulations are subject to change. Please consult a qualified professional for advice specific to your situation.
`;
}

const articles = [];

articles.push({
  filename: 'itr-filing-which-form.md',
  meta: {
    title: 'ITR filing 2024-25: which ITR form should you use?',
    slug: 'itr-filing-which-form',
    description:
      'AY 2024-25 ITR guide: compare ITR-1 to ITR-7, see exclusions, use the decision chart, deadlines, defective return rules under Section 139(9), FAQs.',
    category: 'Tax & Compliance',
    tags: ['ITR', 'Income Tax', 'AY 2024-25', 'tax filing', 'Section 139'],
    date: DATE,
  },
  body: `# ITR filing 2024-25: which ITR form should you use?

Filing your Income Tax Return (ITR) with the wrong form is not a minor clerical issue. The Income Tax Department may treat it as a defective return under Section 139(9), which means you can receive a notice and be required to refile. In some cases, a defective return is treated as if it was never filed, exposing you to penalties for late filing.

With Assessment Year 2024-25 (Financial Year 2023-24), eligibility criteria and disclosures continue to evolve. This guide walks through each form, its applicability, and who should use which one, with examples to make the decision straightforward.

## Table of contents

- [Overview of all ITR forms (AY 2024-25)](#overview-of-all-itr-forms-ay-2024-25)
- [Detailed breakdown by form](#detailed-breakdown-by-form)
- [Quick decision chart](#quick-decision-chart)
- [Key dates: AY 2024-25](#key-dates-ay-2024-25)
- [Penalties for wrong or late filing](#penalties-for-wrong-or-late-filing)
- [Frequently asked questions](#frequently-asked-questions)

## Overview of all ITR forms (AY 2024-25)

| Form | Who can use it | Who cannot use it |
| --- | --- | --- |
| ITR-1 (Sahaj) | Resident individuals with income up to Rs. 50 lakhs from salary, one house property, other sources | Directors, shareholders in unlisted companies, NRIs, those with capital gains or business income |
| ITR-2 | Individuals and HUFs without business or professional income | Those with business or professional income |
| ITR-3 | Individuals and HUFs with income from business or profession | Those without business income (use ITR-1 or ITR-2) |
| ITR-4 (Sugam) | Individuals, HUFs, firms (not LLPs) using presumptive taxation | NRIs, directors, those with income above Rs. 50 lakhs (for individuals) |
| ITR-5 | Firms, LLPs, AOPs, BOIs, cooperatives, local authorities | Individuals, HUFs, companies |
| ITR-6 | Companies (other than those claiming Section 11 exemption) | Non-companies |
| ITR-7 | Charitable trusts, political parties, research institutions, universities, others under Section 139(4A) to 139(4F) | Others |

## Detailed breakdown by form

### ITR-1 (Sahaj): the simplest form

ITR-1 is designed for salaried individuals whose financial life is relatively straightforward.

**Eligible to file ITR-1 if:**

- You are a resident individual (not NRI or RNOR)
- Total income does not exceed Rs. 50 lakhs
- Income sources are: salary or pension, one house property (excluding brought-forward losses), and other sources (interest, dividends, family pension)
- Agricultural income is up to Rs. 5,000

**Cannot use ITR-1 if:**

- You are a director in any company
- You held unlisted equity shares at any time during the year
- You have capital gains of any nature
- You have income from more than one house property
- You have foreign income or foreign assets
- Tax has been deducted under Section 194N (cash withdrawals)
- You have deferred income tax on ESOPs

> **Tip:** If you are unsure about even one exclusion (for example, small mutual fund capital gains), choose ITR-2 instead of risking a defective return.

**Example:** Asha is a school teacher earning Rs. 6.5 lakhs in salary and Rs. 18,000 as bank interest. She owns one home (self-occupied). She should file ITR-1.

### ITR-2: capital gains or multiple properties

ITR-2 is commonly used when you have sold shares, mutual funds, or property, or have a more complex income profile.

**Eligible to file ITR-2 if:**

- You are an individual or HUF
- You have capital gains (short-term or long-term) from shares, mutual funds, property, and so on
- You own more than one house property
- You are an NRI
- You are a director in a company
- You hold unlisted equity shares
- Your income exceeds Rs. 50 lakhs (but no business income)
- You have foreign assets or foreign income

**Cannot use ITR-2 if:**

- You have income from business or profession (use ITR-3)

**Example:** Vikram is a software engineer earning Rs. 18 lakhs in salary. He sold mutual funds and made LTCG of Rs. 2.3 lakhs and STCG of Rs. 80,000. He should file ITR-2.

### ITR-3: professionals and business owners

ITR-3 is for individuals or HUFs who run a business or practise a profession, whether under regular accounting or presumptive taxation schemes.

**Eligible if:**

- You have income from proprietary business
- You are a freelancer, consultant, or self-employed professional
- You are a partner in a firm (the firm files ITR-5 separately)
- You have business income along with salary, capital gains, or other income

**Example:** Dr. Anand runs a private clinic and earns Rs. 25 lakhs from his practice. He also receives Rs. 4 lakhs in rent and made LTCG of Rs. 1.2 lakhs from selling mutual funds. All this is reported in ITR-3.

### ITR-4 (Sugam): presumptive taxation

ITR-4 is for those opting for presumptive taxation under Sections 44AD (business), 44ADA (professionals), or 44AE (transporters).

| Scheme | Who can use | Deemed profit rate |
| --- | --- | --- |
| Section 44AD | Small businesses with turnover up to Rs. 3 crore (Rs. 2 crore if cash receipts exceed 5%) | 8% of turnover (6% for digital receipts) |
| Section 44ADA | Specified professionals with receipts up to Rs. 75 lakhs | 50% of gross receipts |
| Section 44AE | Goods vehicle operators (up to 10 vehicles) | Rs. 7,500 per vehicle per month |

**Cannot use ITR-4 if:**

- Turnover exceeds the applicable limit
- You are an NRI
- You have capital gains
- You have more than one house property
- You hold foreign assets
- You are a director in a company

**Example:** Ramesh runs a small grocery store with annual sales of Rs. 80 lakhs, all via digital payments. He opts for Section 44AD and declares 6% of Rs. 80 lakhs, Rs. 4.8 lakhs, as profit. He files ITR-4.

### ITR-5: firms, LLPs, and AOPs

Firms (including partnership firms), LLPs, cooperative societies, local authorities, and Associations of Persons (AOPs) must file ITR-5.

**Example:** Mehta & Shah LLP, a two-partner accounting firm, files ITR-5 to report the LLP's income, deductions, and tax payable.

### ITR-6: companies

All companies registered under the Companies Act, except those claiming exemption under Section 11 (charitable or religious organisations), must file ITR-6.

### ITR-7: trusts and exempt entities

Section 11 trusts, political parties, research associations, universities, hospitals, and similar entities file ITR-7.

## Quick decision chart

| Your profile | Correct form |
| --- | --- |
| Salaried, income under Rs. 50 lakhs, no capital gains | ITR-1 |
| Salaried with capital gains or multiple properties | ITR-2 |
| NRI with Indian income | ITR-2 |
| Director of a company with no business income | ITR-2 |
| Freelancer or consultant (non-presumptive) | ITR-3 |
| Small business using 44AD or professional using 44ADA | ITR-4 |
| Partnership firm or LLP | ITR-5 |
| Private or public company | ITR-6 |
| Trust, temple, political party, university | ITR-7 |

## Key dates: AY 2024-25

| Category | Due date |
| --- | --- |
| Individuals (non-audit) | July 31, 2024 |
| Businesses or professionals requiring audit | October 31, 2024 |
| Transfer pricing cases | November 30, 2024 |
| Belated or revised return | December 31, 2024 |

## Penalties for wrong or late filing

| Default | Consequence |
| --- | --- |
| Filing wrong form (defective return) | Notice under Section 139(9); must refile |
| Late filing (income above Rs. 5 lakhs) | Rs. 5,000 penalty under Section 234F |
| Late filing (income up to Rs. 5 lakhs) | Rs. 1,000 penalty under Section 234F |
| Non-filing | Prosecution under Section 276CC in severe cases |
| Missing belated return deadline | Cannot carry forward capital or business losses |

## Frequently asked questions

**Q: I am salaried but also sold some stocks this year. Can I still file ITR-1?**

No. Any capital gains, whether from shares, mutual funds, or property, disqualify you from using ITR-1. Even a small capital gain means you must file ITR-2.

**Q: I am a freelance graphic designer earning Rs. 40 lakhs. Which form do I use?**

If gross receipts are up to Rs. 75 lakhs and your activity qualifies as a specified profession under CBDT rules, you may opt for Section 44ADA and file ITR-4. If you use regular accounting with actual expenses, file ITR-3. When classification is unclear, consult a CA.

**Q: My employer deducted all applicable TDS. Do I still need to file an ITR?**

Yes, if gross total income before deductions exceeds the basic exemption limit. Filing is also important for loss carry-forward, refunds, and documents often requested for visas or loans.

**Q: I am an NRI with only Rs. 60,000 fixed deposit interest from India. Which form applies?**

NRIs cannot use ITR-1. Use ITR-2 even if Indian-source income is modest. TDS on NRO interest is often at higher rates; ITR-2 supports refund claims where applicable.

**Q: Can I switch between old and new tax regime while filing my ITR?**

Salaried individuals without business income can generally choose each year at filing. Those with business income (ITR-3 or ITR-4) face stricter, once-in-a-lifetime rules for exiting the new regime. Confirm on the portal for your facts.`,
});

// Continue with remaining 5 articles in same structure - I'll append to script

articles.push({
  filename: 'fssai-registration-vs-license.md',
  meta: {
    title: 'FSSAI registration vs FSSAI license: key differences explained',
    slug: 'fssai-registration-vs-license',
    description:
      'FSSAI basic registration vs state vs central licence: turnover limits, fees, FoSCoS steps, documents, inspection timelines, penalties, renewal FAQs.',
    category: 'Compliance',
    tags: ['FSSAI', 'food license', 'FoSCoS', 'food safety', 'India'],
    date: DATE,
  },
  body: `# FSSAI registration vs FSSAI license: key differences explained

The Food Safety and Standards Authority of India (FSSAI) regulates food safety and quality across India. Whether you run a home bakery, cloud kitchen, restaurant chain, or import food, you need valid FSSAI authorisation before operating legally.

Many operators confuse basic registration with state or central licences. They are not interchangeable. Wrong classification can mean penalties, cancellations, and disruption. This guide clarifies the differences.

## Table of contents

- [The three types of FSSAI authorisation](#the-three-types-of-fssai-authorisation)
- [FSSAI basic registration](#fssai-basic-registration)
- [FSSAI state license](#fssai-state-license)
- [FSSAI central license](#fssai-central-license)
- [Side-by-side comparison](#side-by-side-comparison)
- [Application process](#application-process)
- [Penalties for non-compliance](#penalties-for-non-compliance)
- [Frequently asked questions](#frequently-asked-questions)

## The three types of FSSAI authorisation

| Type | Who it is for | Issued by | Validity |
| --- | --- | --- | --- |
| Basic registration | Very small food businesses | FSSAI directly | 1 to 5 years |
| State license | Medium-sized businesses | State Food Safety Authority | 1 to 5 years |
| Central license | Large, multi-state, import-export businesses | FSSAI Central Authority | 1 to 5 years |

## FSSAI basic registration

### Who needs basic registration?

Basic Registration (Form A) is for petty food business operators whose annual turnover does not exceed Rs. 12 lakhs.

This includes:

- Hawkers, vendors, and small retailers
- Home-based food businesses (home bakers, tiffin services, pickle makers)
- Petty manufacturers with annual turnover up to Rs. 12 lakhs
- Temporary stall owners at fairs, exhibitions, and festivals
- Small food storage operators

### What is not covered under basic registration?

- Businesses with turnover above Rs. 12 lakhs
- Businesses operating in more than one state
- Manufacturers producing above specified quantities for certain categories (for example, dairy, meat)

### Documents required for basic registration

| Document | Requirement |
| --- | --- |
| Photo of the applicant | Passport-size |
| Identity proof | Aadhaar, Voter ID, Passport, or driving licence |
| Address proof of business premises | Utility bill, rent agreement |
| Form A (declaration) | Duly filled and signed |

## FSSAI state license

### Who needs a state license?

State License (Form B) is required for medium food businesses operating within one state, with annual turnover between Rs. 12 lakhs and Rs. 20 crores.

This includes:

- Restaurants, hotels, and eateries (turnover above Rs. 12 lakhs)
- Cloud kitchens and food aggregators below central license threshold
- Manufacturers within specified capacity limits
- Cold storages, warehouses, and distributors within a single state
- Caterers for events with more than 100 persons

### Turnover and capacity thresholds for state license

| Category | Threshold for state license |
| --- | --- |
| Annual turnover | Rs. 12 lakhs to Rs. 20 crores |
| Dairy units | Up to 50,000 litres per day |
| Slaughterhouses | Up to 50 large animals or 150 small animals per day |
| Vegetable oil processing | Up to 2 MT per day |
| Proprietary food units | Up to 2 MT per day |
| Hotels (star category) | Below 5-star |

## FSSAI central license

### Who needs a central license?

Central License is mandatory for:

- Food businesses with annual turnover above Rs. 20 crores
- Importers and exporters of food products
- Businesses operating in more than one state
- Food manufacturers supplying directly to government agencies or defence establishments
- E-commerce food business operators (aggregators and similar platforms)
- Five-star hotels and above
- Food businesses at airports, ports, and railway stations

### Special cases requiring central license irrespective of turnover

- 100% Export Oriented Units (EOUs)
- Units operating under a central government ministry, where rules require central licensing

## Side-by-side comparison

| Parameter | Basic registration | State license | Central license |
| --- | --- | --- | --- |
| Annual turnover | Up to Rs. 12 lakhs | Rs. 12 lakhs to Rs. 20 crores | Above Rs. 20 crores |
| Applicability | Very small or petty operators | Medium businesses (intra-state) | Large, multi-state, importers |
| Application form | Form A | Form B | Form B |
| Issuing authority | Registration officer | Designated state officer | Central Licensing Authority |
| FSSAI number digits | 14-digit | 14-digit | 14-digit (often starts with 1) |
| Inspection before approval | Generally not required | May be required | Typically required |
| Processing time | 7 days | 30 days | 60 days |
| Fee (approx.) | Rs. 100 per year | Rs. 2,000 to Rs. 5,000 per year | Rs. 7,500 per year |
| Penalty for non-compliance | Up to Rs. 25,000 | Up to Rs. 5 lakhs | Up to Rs. 10 lakhs |

## Application process

1. **Determine the correct category:** Use turnover and capacity rules to pick registration, state licence, or central licence.
2. **Apply on FoSCoS:** Create an FBO account on \`foscos.fssai.gov.in\` and choose the application type.
3. **Business details:** Name, ownership, address, activities, capacity or turnover estimates.
4. **Upload documents:** Central applications typically need extra items such as layout and water test reports.
5. **Pay the fee:** Depends on authorisation type and duration (1 to 5 years).
6. **Inspection:** May apply for state or central licences.
7. **Receive licence:** Display the 14-digit FSSAI number at premises and on labels.

> **Important:** Always renew before expiry. Operating on an expired number without a pending renewal proof is risky.

## Penalties for non-compliance

| Violation | Penalty |
| --- | --- |
| Operating without registration or license | Imprisonment up to 6 months plus fine up to Rs. 5 lakhs |
| Selling unsafe food | Up to Rs. 10 lakhs fine; life imprisonment if death results |
| Misleading advertisement | Up to Rs. 10 lakhs |
| Failure to comply with FSSAI directions | Up to Rs. 2 lakhs |
| Obstructing FSSAI officer | Up to Rs. 10,000 |

## Frequently asked questions

**Q: I run a home bakery under Rs. 12 lakhs turnover. Do I still need FSSAI registration?**

Yes. Commercial food businesses generally require at least basic registration (Form A), even at small scale.

**Q: Does a restaurant on Swiggy or Zomato need a central license or a state license?**

The restaurant typically holds a state licence based on its own turnover. The aggregator platform usually requires a central licence as an e-commerce food operator. Platform and outlet obligations are separate.

**Q: My turnover crossed Rs. 20 crores mid-year. Do I upgrade immediately?**

Yes. Plan upgrade before breaching thresholds or expanding multi-state operations. Operating beyond your licence class is a compliance breach.

**Q: Is the FSSAI license transferable if I sell my food business?**

No. Licences and registrations are non-transferable. The new owner applies afresh; old licences are surrendered for cancellation.

**Q: Can I label products with an expired FSSAI number during renewal?**

No. Do not use an expired number on labels. Apply for renewal early (often at least 30 days before expiry) and follow FoSCoS guidance for continuation proof.`,
});

articles.push({
  filename: 'trademark-registration-india.md',
  meta: {
    title: 'Trademark registration in India: complete process and classes',
    slug: 'trademark-registration-india',
    description:
      'Trademark registration India: Nice classes, TM search, fees, examination objections, journal opposition, ten-year renewal, infringement remedies, FAQs.',
    category: 'Legal & IP',
    tags: ['trademark', 'IP India', 'Nice classification', 'brand protection', 'India'],
    date: DATE,
  },
  body: `# Trademark registration in India: complete process and classes

A trademark is any sign, word, phrase, logo, design, or combination that distinguishes your goods or services from competitors. It is the identity of your brand.

Registration gives you stronger nationwide protection and clearer enforcement options than reliance on use alone. This guide covers process under the Trade Marks Act, 1999, including classes, fees, timelines, and renewal.

## Table of contents

- [Why register a trademark?](#why-register-a-trademark)
- [Understanding the Nice classification](#understanding-the-nice-classification)
- [Step-by-step registration process](#step-by-step-registration-process)
- [Timeline overview](#timeline-overview)
- [Trademark renewal](#trademark-renewal)
- [Penalties for infringement](#penalties-for-infringement)
- [Frequently asked questions](#frequently-asked-questions)

## Why register a trademark?

| Benefit | Without registration | With registration |
| --- | --- | --- |
| Legal protection | Common law rights only (limited geography) | Nationwide statutory protection |
| Right to sue for infringement | More complex | Clearer basis under Sections 29 to 30 |
| Licensing | Possible but weaker record | Licensable and recordable |
| Asset value | Informal | Balance-sheet intangible asset |
| TM vs R symbol | Can use TM | Can use registered symbol after certificate |
| Customs protection | Limited | Recordal route for counterfeits |
| Duration | Use-based | 10 years, renewable indefinitely |

## Understanding the Nice classification

India follows the Nice Agreement: classes 1 to 34 cover goods; 35 to 45 cover services.

### Selected goods classes

| Class | Description | Examples |
| --- | --- | --- |
| 5 | Pharmaceutical and veterinary products | Medicines, dietary supplements |
| 9 | Electronics and scientific instruments | Software, smartphones, apps |
| 14 | Jewellery and timepieces | Rings, watches |
| 16 | Paper goods and printed matter | Stationery, packaging |
| 25 | Clothing and footwear | Apparel, shoes |
| 29 | Processed food | Cheese, packaged vegetables |
| 30 | Staple foods | Bread, spices, chocolates |
| 33 | Alcoholic beverages | Wine, beer |

### Selected service classes

| Class | Description | Examples |
| --- | --- | --- |
| 35 | Advertising and business services | Marketing, retail services |
| 36 | Financial and insurance services | Banking, advisory |
| 38 | Telecommunications | Internet, broadcast |
| 41 | Education and entertainment | Courses, events |
| 42 | Scientific and IT services | Software, SaaS |
| 43 | Food and hospitality | Restaurants, catering |
| 45 | Legal and security services | Law firms, security |

> **Note:** Wrong class means weak protection in the market where you actually operate. Many applicants file in multiple classes.

## Step-by-step registration process

### Step 1: Trademark search

Search \`ipindiaonline.gov.in\` TMR public search for identical, phonetically similar, and visually similar marks in the same or allied classes.

### Step 2: Determine class(es)

Map goods or services to Nice classes. Multi-category brands often file in several classes.

### Step 3: Prepare the application

Gather applicant details, mark representation, description of goods or services, class numbers, and prior-use affidavit (\`TM-M\`) if claiming use.

### Step 4: File the application

File online through IP India or at appropriate Registry offices.

**Government filing fees (indicative):**

| Applicant type | Per class (e-filing) | Per class (physical filing) |
| --- | --- | --- |
| Individual, startup, MSME | Rs. 4,500 | Rs. 5,000 |
| Others | Rs. 9,000 | Rs. 10,000 |

You receive an application number. TM may be used pending registration.

### Step 5: Vienna codification (logo marks)

Figurative elements receive Vienna codes for search consistency.

### Step 6: Examination

Examiner reviews (often 12 to 18 months) and may accept or object.

### Step 7: Reply to examination report

Reply within allowed time; hearings may follow.

### Step 8: Publication

Accepted marks publish in the Trade Marks Journal for opposition (typically four months).

### Step 9: Opposition

If opposed, adversarial proceedings can extend timelines materially.

### Step 10: Registration

If unopposed or opposition fails, the Registrar issues the certificate. Rights generally relate back to the application date.

## Timeline overview

| Stage | Approximate duration |
| --- | --- |
| Filing to examination report | 12 to 18 months |
| Reply and hearing | 3 to 6 months |
| Publication | 2 to 3 months after acceptance |
| Opposition window | 4 months |
| Registration (uncontested) | 18 to 24 months total |
| Contested matters | Often 3 to 5 years |

## Trademark renewal

Registration lasts 10 years from the date of registration and renews indefinitely with \`TM-R\` and fees. A grace window with surcharge may apply if the deadline is missed.

## Penalties for infringement

| Violation | Consequence |
| --- | --- |
| Using a registered trademark without permission | Civil injunction and damages |
| Counterfeiting | Criminal prosecution; imprisonment and fines under statute |
| False application of a trademark | Criminal penalties |
| Confusingly similar marks | Injunction, damages, account of profits |

## Frequently asked questions

**Q: Can I use the TM symbol before registration?**

Yes. TM signals a claim of rights. The registered symbol is only for registered marks; misuse can attract penalties.

**Q: Someone uses my brand without registration. Can I still register?**

You may apply, but prior users with goodwill may oppose or defend using passing-off principles. Search markets as well as the registry.

**Q: Do I need separate registrations per state?**

No. One Indian registration covers all states. Overseas protection needs separate filings or Madrid Protocol routes.

**Q: What is the difference between a wordmark and a device mark?**

A wordmark protects the words; a device mark protects logo or stylised presentation. Many applicants file both.

**Q: My application was refused after hearing. What next?**

Appeal timelines and forums depend on current law (IPAB was abolished; appeals lie to High Court or Commercial Division as applicable). File within the prescribed period or consider a modified fresh application.`,
});

articles.push({
  filename: 'deductions-under-section-80ccd.md',
  meta: {
    title: 'Section 80CCD(1B): the extra Rs. 50,000 deduction most people miss',
    slug: 'deductions-under-section-80ccd',
    description:
      'Section 80CCD(1B): extra Rs. 50,000 NPS Tier I deduction outside 80C; eligibility, tax saved, Tier I rules, partial withdrawals, maturity tax treatment, FAQs.',
    category: 'Tax & Compliance',
    tags: ['80CCD(1B)', 'NPS', 'tax deduction', 'retirement', 'old regime'],
    date: DATE,
  },
  body: `# Section 80CCD(1B): the extra Rs. 50,000 deduction most people miss

Most salaried taxpayers know Section 80C and its Rs. 1.5 lakh limit. Fewer use Section 80CCD(1B), which allows up to Rs. 50,000 per year **over and above** the Rs. 1.5 lakh ceiling for voluntary Tier I NPS contributions.

This Rs. 50,000 is exclusive to NPS and does not sit inside the Rs. 1.5 lakh 80C bucket. Used correctly, it is one of the efficient deductions still available under the old regime.

## Table of contents

- [Structure of NPS-related deductions](#structure-of-nps-related-deductions)
- [Who can claim 80CCD(1B)?](#who-can-claim-80ccd1b)
- [How much tax can you save?](#how-much-tax-can-you-save)
- [What is NPS Tier I?](#what-is-nps-tier-i)
- [Example calculation](#example-calculation)
- [Partial withdrawal rules](#partial-withdrawal-rules)
- [How to contribute](#how-to-contribute)
- [Tax treatment at maturity](#tax-treatment-at-maturity)
- [Frequently asked questions](#frequently-asked-questions)

## Structure of NPS-related deductions

| Section | What it covers | Limit |
| --- | --- | --- |
| 80CCD(1) | Employee own contribution to NPS (part of 80C) | Within Rs. 1,50,000 (80C limit) |
| 80CCD(1B) | Additional voluntary Tier I contribution | Rs. 50,000 above 80C |
| 80CCD(2) | Employer contribution to NPS | Percentage of salary per rules; separate from 80C |

Total NPS-related deduction can combine 80C room, Rs. 50,000 under 80CCD(1B), and eligible employer contributions under 80CCD(2).

## Who can claim 80CCD(1B)?

| Eligible | Not eligible |
| --- | --- |
| Resident individuals with Tier I NPS | Most new regime filers for 80CCD(1B) itself |
| Salaried and self-employed | NRIs (cannot open NPS in usual retail route) |
|  | Companies, firms, HUFs |

> **Important:** Under Section 115BAC (new regime), many deductions including 80CCD(1B) are unavailable unless law specifically allows an exception. Confirm regime before relying on this section.

## How much tax can you save?

| Income band (illustrative) | Marginal rate idea | Saving on Rs. 50,000 deduction |
| --- | --- | --- |
| Rs. 5 to Rs. 10 lakhs | 20% slab | Rs. 10,000 |
| Above Rs. 10 lakhs | 30% slab | Rs. 15,000 |
| Above Rs. 10 lakhs plus 4% cess | Effective ~31.2% | Rs. 15,600 |
| Surcharge zones | Higher effective | More |

## What is NPS Tier I?

| Feature | Tier I | Tier II |
| --- | --- | --- |
| Mandatory | Yes | No |
| Tax deduction | Yes for eligible sections | Generally no (exceptions for certain government Tier II saver routes) |
| Withdrawals | Restricted rules | More flexible |
| Minimum contribution | Rs. 500 per contribution; Rs. 1,000 per year typical | Lower thresholds |

## Example calculation

**Scenario:** Preethi, marketing manager: taxable income after standard deduction Rs. 10.5 lakhs (illustrative).

| Deduction | Amount (Rs.) |
| --- | --- |
| Standard deduction | 75,000 |
| Section 80C | 1,50,000 |
| Section 80D | 25,000 |
| Section 80CCD(1B) | 50,000 |
| Total | 3,00,000 |

Taxable income falls from Rs. 10.5 lakhs by deductions claimed; exact tax saving depends on slab, cess, and surcharge. Model in the utility.

## Partial withdrawal rules

| Condition | Rule |
| --- | --- |
| Minimum tenure | Often 3 years for eligible partial withdrawal |
| Allowed purposes | Specified education, marriage, house, illness, etc. |
| Cap | Typically up to 25% of own contribution |
| Frequency | Limited number of withdrawals over life |

## How to contribute

1. Open NPS via PoP bank, post office, or \`enps.nsdl.com\`.
2. Receive PRAN.
3. Contribute online or offline before March 31 for the relevant FY.
4. Declare correctly in ITR schedules.

## Tax treatment at maturity

| Component | Tax treatment (high level) |
| --- | --- |
| Lump sum portion at 60 | Often largely exempt within statutory percentages |
| Annuity purchase | Purchase typically tax-neutral; annuity payouts taxable |
| Early exit | Restrictive tax rules apply |
| Death benefit | Nominee treatment per rules |

## Frequently asked questions

**Q: I used all Rs. 1.5 lakh under 80C. Can NPS still help?**

Yes. Up to Rs. 50,000 can still qualify under 80CCD(1B) if all conditions are met.

**Q: Can freelancers claim 80CCD(1B)?**

Yes for eligible resident individuals who contribute to Tier I within limits.

**Q: I contributed Rs. 70,000 to Tier I. How much is under 80CCD(1B)?**

Cap is Rs. 50,000 under 80CCD(1B); balance may fall under 80CCD(1) within the Rs. 1.5 lakh 80C envelope, subject to overall caps.

**Q: Does employer NPS reduce my Rs. 50,000 80CCD(1B) room?**

No. Employer contributions use 80CCD(2) rules separately.

**Q: Is NPS risk-free?**

NPS is market-linked. Asset mix and scheme choice drive volatility; read PFRDA disclosures.`,
});

articles.push({
  filename: 'private-limited-company-registration.md',
  meta: {
    title: 'How to register a private limited company in India',
    slug: 'private-limited-company-registration',
    description:
      'Register a private limited company under Companies Act 2013: DSC, DIN, SPICe+, MoA and AoA, MCA fees, INC-20A, AGM and annual filings, costs, FAQs.',
    category: 'Business & Compliance',
    tags: ['private limited', 'SPICe+', 'MCA', 'company incorporation', 'India'],
    date: DATE,
  },
  body: `# How to register a private limited company in India

Private limited companies combine limited liability, investor familiarity, and separate legal personality. For many founders, this is the default serious incorporation choice.

This article outlines registration under the Companies Act, 2013, primarily through the MCA portal.

## Table of contents

- [What defines a private limited company?](#what-defines-a-private-limited-company)
- [Prerequisites](#prerequisites)
- [Step-by-step registration](#step-by-step-registration)
- [Post-incorporation compliance](#post-incorporation-compliance)
- [Cost summary](#cost-summary)
- [Penalties for non-compliance](#penalties-for-non-compliance)
- [Frequently asked questions](#frequently-asked-questions)

## What defines a private limited company?

Under Section 2(68) of the Companies Act, 2013, a private company:

- Restricts share transfer
- Limits members to 200 (excluding certain employee members)
- Cannot invite the public to subscribe to securities

| Feature | Private limited company |
| --- | --- |
| Minimum directors | 2 |
| Maximum directors | 15 (more with resolution) |
| Minimum shareholders | 2 |
| Maximum shareholders | 200 |
| Minimum paid-up capital | No statutory minimum (post 2015 reforms) |
| Liability | Limited to unpaid capital on shares |
| Separate legal entity | Yes |

## Prerequisites

| Requirement | Details |
| --- | --- |
| Directors | Minimum 2; at least 1 resident director |
| DIN | For directors (often via SPICe+ for first-time directors) |
| DSC | Class 3 DSC for subscribers and signatories |
| Name options | 2 to 3 preferences |
| Registered office | Indian address with proof and NOC if leased |
| Capital structure | Issued and subscribed share pattern |

## Step-by-step registration

### Step 1: Digital Signature Certificate (DSC)

Class 3 DSC from certified agencies. Typically PAN, Aadhaar, photo, email.

### Step 2: DIN

First-time directors commonly obtain DIN through SPICe+ without a separate DIR-3.

### Step 3: Name reservation

\`RUN\` or SPICe+ Part A. Names must end with \`Private Limited\` and avoid restricted words without approvals.

### Step 4: MoA and AoA

Objects clause, capital, rules of internal management. Table F is a common AoA template baseline.

### Step 5: File SPICe+ (\`INC-32\`)

Integrated filing on \`mca.gov.in\` may bundle GST or labour registrations via linked forms where opted.

| Part | Purpose |
| --- | --- |
| Part A | Name |
| Part B | Incorporation data |
| Linked forms | \`INC-33\` e-MoA, \`INC-34\` e-AoA, etc. |

Attachments typically include address proof, KYC, \`DIR-2\`, \`INC-9\`.

### Step 6: MCA fees and stamp duty

Fees vary by authorised capital; stamp duty is state-specific.

### Step 7: Certificate of incorporation

RoC issues CIN, PAN, and TAN allotment through the bundle when approved.

## Post-incorporation compliance

| Requirement | Timeline |
| --- | --- |
| Bank account | Early after incorporation |
| Share subscription money | Within stated period |
| First board meeting | Within 30 days |
| \`INC-20A\` commencement | Within 180 days where applicable |
| Auditor appointment | As per first AGM or transitional rules |
| Annual filings | \`AOC-4\`, \`MGT-7A\` or \`MGT-7\`, AGM |

## Cost summary

| Item | Approximate cost |
| --- | --- |
| DSC (2 directors) | Rs. 1,500 to Rs. 3,000 |
| Government fee | Rs. 0 to Rs. 5,000 depending on capital |
| Stamp duty | State-dependent |
| Professional fees | Rs. 5,000 to Rs. 20,000 typical |

## Penalties for non-compliance

| Default | Consequence |
| --- | --- |
| No \`INC-20A\` where required | Company and officer penalties |
| No AGM | Late fees and compounding risk |
| No annual return | Daily penalties after thresholds |

## Frequently asked questions

**Q: Can one person form a private limited company?**

Minimum two directors and two shareholders are required. Alternatives include OPC or adding a co-founder.

**Q: Can registered office be residential?**

Often yes, with valid proof and owner NOC where needed.

**Q: How long does incorporation take?**

With clean documents, roughly 7 to 15 working days end-to-end is common; delays follow name objections or queries.

**Q: Can foreign nationals invest or direct?**

Possible subject to FDI policy, KYC, and at least one resident director.

**Q: Authorised capital versus paid-up capital?**

Authorised is the MoA ceiling for issuance; paid-up is what shareholders actually subscribe and pay.`,
});

articles.push({
  filename: 'gst-registration-guide-2024.md',
  meta: {
    title: 'Complete guide to GST registration in India 2024',
    slug: 'gst-registration-guide-2024',
    description:
      'GST registration India 2024: turnover thresholds, mandatory cases, REG-01 flow, GSTIN structure, GSTR-1 and 3B basics, composition scheme, penalties, FAQs.',
    category: 'Tax & Compliance',
    tags: ['GST', 'GSTIN', 'GST registration', 'CGST', 'compliance'],
    date: DATE,
  },
  body: `# Complete guide to GST registration in India 2024

GST replaced multiple indirect taxes with a unified structure. Taxable supply above threshold generally requires registration. Operating without registration when liable can attract heavy penalties.

Registration also lets you issue tax invoices and claim input tax credit where allowed.

## Table of contents

- [Who needs to register?](#who-needs-to-register)
- [Types of GST registration](#types-of-gst-registration)
- [Composition scheme](#composition-scheme)
- [Documents required](#documents-required)
- [Step-by-step registration process](#step-by-step-registration-process)
- [GSTIN structure](#gstin-structure)
- [Post-registration compliance](#post-registration-compliance)
- [GST rates: quick reference](#gst-rates-quick-reference)
- [Penalties](#penalties)
- [Frequently asked questions](#frequently-asked-questions)

## Who needs to register?

### Mandatory registration (threshold-based)

| Category | Threshold |
| --- | --- |
| Goods (normal states) | Rs. 40 lakhs aggregate turnover |
| Services (normal states) | Rs. 20 lakhs |
| Goods (special category states) | Rs. 20 lakhs |
| Services (special category states) | Rs. 10 lakhs |

Special category states include states notified under law (for example, hill or NE states as updated).

### Mandatory regardless of turnover (examples)

| Situation | Reason |
| --- | --- |
| Inter-state taxable supply of goods | Registration required |
| E-commerce operators | Platform obligations |
| Casual taxable persons | Temporary taxable presence rules |
| OIDAR and certain foreign supplies | Specific provisions |
| Reverse charge persons | When liable |

> **Note:** Purely intra-state businesses near threshold follow state turnover tests; inter-state goods suppliers generally register immediately.

## Types of GST registration

| Type | Who it is for |
| --- | --- |
| Regular | Standard taxable persons |
| Composition | Eligible small taxpayers under Section 10 |
| Casual | Temporary taxable presence |
| Non-resident taxable person | Foreign taxpayers with occasional supply |
| ISD | Head office distributing ITC on services |
| TDS deductor | Specified deductors |
| TCS collector | E-commerce TCS |

## Composition scheme

| Business type | Turnover cap (typical) | Tax idea |
| --- | --- | --- |
| Manufacturers | Rs. 1.5 crore | Low composite rate |
| Traders | Rs. 1.5 crore | Low composite rate |
| Restaurants (no alcohol) | Rs. 1.5 crore | 5% composite pattern |
| Services | Rs. 50 lakhs | 6% pattern |

Composition dealers generally cannot issue taxable invoices or claim normal ITC.

## Documents required

| Document | Proprietor | Company |
| --- | --- | --- |
| PAN | Owner PAN | Entity PAN |
| Photo and ID | Owner | Authorised signatory |
| Address proof | Premises proof | Premises proof |
| Bank proof | Statement or cheque | Same |
| Constitution proof | Optional | COI, resolution |

## Step-by-step registration process

1. Open \`gst.gov.in\` then **Services > Registration > New Registration**.
2. Complete Part A of \`REG-01\` with PAN validation and OTP.
3. Complete Part B with business details, HSN or SAC, bank data, promoters.
4. Upload documents.
5. Complete Aadhaar authentication where prompted to reduce inspection risk.
6. Respond to \`REG-03\` queries with \`REG-04\` if issued.
7. Receive \`REG-06\` with 15-digit GSTIN.

## GSTIN structure

| Position | Meaning |
| --- | --- |
| First 2 digits | State code |
| Next 10 | PAN |
| Next | Entity serial under PAN in state |
| Then | Constant \`Z\` |
| Last | Check digit |

## Post-registration compliance

| Return | Idea |
| --- | --- |
| GSTR-1 | Outward supplies |
| GSTR-3B | Summary payment return |
| GSTR-9 | Annual |
| GSTR-9C | Reconciliation where applicable |

Due dates depend on turnover and QRMP election.

## GST rates: quick reference

| Rate | Examples |
| --- | --- |
| 0% | Many fresh foods, healthcare or education services as exempt |
| 5% | Essentials |
| 12% and 18% | Large middle bucket |
| 28% | Demerit or luxury classes plus cess items |

## Penalties

| Violation | Penalty idea |
| --- | --- |
| Liability without registration | Percentage of tax due with minimums |
| Fraudulent evasion | Higher penalties |
| Late filing | Late fee per day subject to caps |
| Wrong ITC | Penalty percentages subject to floors |

## Frequently asked questions

**Q: Below Rs. 20 lakhs but I sell goods to another state. Must I register?**

Generally yes for inter-state taxable goods supplies irrespective of turnover within law.

**Q: Can I claim ITC on stock before registration date?**

Section 18 allows restricted transitional ITC on eligible inputs in stock subject to conditions and timelines.

**Q: Three branches in three states. One GSTIN?**

Usually one GSTIN per state for separate fixed establishments; ISD may distribute certain centralised service credits.

**Q: How do I cancel GST after closure?**

File cancellation application with stock and liability disclosures; continue filing until order passes.

**Q: Suspension versus cancellation?**

Suspension temporarily blocks supplies and ITC; cancellation ends registration after due process.`,
});

fs.mkdirSync(outDir, { recursive: true });

const summary = [];

for (const { filename, meta, body } of articles) {
  const cleaned = rs(noEmDash(body));
  const full = fm(meta, cleaned + footer(filename));
  fs.writeFileSync(path.join(outDir, filename), full, 'utf8');
  const wc = wordCount(cleaned);
  const h2 = (cleaned.match(/^## /gm) || []).length;
  const tables = (cleaned.match(/^\| .+ \|/gm) || []).filter((l) => l.includes('---')).length;
  summary.push({
    slug: meta.slug,
    words: wc,
    h2,
    tables,
    faqs: 5,
    status: 'Done',
  });
}

console.log('| Slug | Word count | H2 sections | FAQ pairs | Status |');
console.log('| --- | --- | --- | --- | --- |');
for (const row of summary) {
  console.log(`| ${row.slug} | ${row.words} | ${row.h2} | ${row.faqs} | ${row.status} |`);
}
console.log('\nWrote', articles.length, 'files to', path.relative(root, outDir));
