# GST Return Filing

## Overview

GST Return Filing is the periodic submission of transaction data by GST-registered taxpayers to the GST portal, declaring their outward supplies (sales), inward supplies (purchases), Input Tax Credit claimed, and tax paid for each return period. GST returns form the backbone of the GST compliance system — they are the primary mechanism through which the government tracks tax liability, ITC claims, and tax payments across the entire economy.
The GST return filing ecosystem comprises multiple forms, each serving a specific purpose:

| Return Form | Purpose | Filed By | Frequency |
| --- | --- | --- | --- |
| GSTR-1 | Outward supply details | Regular taxpayers | Monthly (if turnover > ₹5 crore or opted out of QRMP) / Quarterly (QRMP scheme) |
| GSTR-3B | Summary return — tax payment | Regular taxpayers | Monthly / Quarterly (QRMP) |
| GSTR-2B | Auto-populated ITC statement | System-generated | Monthly |
| GSTR-4 | Annual return (composition) | Composition scheme dealers | Annually |
| GSTR-5 | Return for NRTP | Non-resident taxable persons | Monthly |
| GSTR-5A | Return for OIDAR providers | Foreign OIDAR suppliers | Monthly |
| GSTR-6 | ISD return | Input Service Distributors | Monthly |
| GSTR-7 | TDS return | TDS deductors | Monthly |
| GSTR-8 | TCS return | E-commerce operators | Monthly |
| GSTR-9 | Annual return | Regular taxpayers | Annually |
| GSTR-10 | Final return | Cancelled registrations | Within 3 months of cancellation |
| GSTR-11 | Return for UIN holders | Entities with Unique Identity Number | Monthly (on purchase) |
| IFF | Invoice Furnishing Facility | QRMP quarterly filers | Optional, monthly |

## Applicability

| Taxpayer Type | Applicable Returns |
| --- | --- |
| Regular taxpayer (monthly) | GSTR-1 (monthly) + GSTR-3B (monthly) |
| Regular taxpayer (QRMP scheme) | GSTR-1 (quarterly) + GSTR-3B (quarterly) + IFF (optional monthly) |
| Composition scheme dealer | CMP-08 (quarterly payment) + GSTR-4 (annual) |
| Non-resident taxable person | GSTR-5 (monthly) |
| OIDAR provider | GSTR-5A (monthly) |
| Input Service Distributor | GSTR-6 (monthly) |
| TDS deductor | GSTR-7 (monthly) |
| E-commerce operator (TCS) | GSTR-8 (monthly) |
| All regular taxpayers (turnover above ₹2 crore) | GSTR-9 (annual) |

NIL Return Filing: Even if there is no business activity in a month, NIL returns must be filed for GSTR-1 and GSTR-3B — failure to file NIL returns attracts the same late fee as non-filing of regular returns.

## Features

- QRMP scheme: Quarterly Return Monthly Payment — eligible taxpayers with turnover up to ₹5 crore can file GSTR-1 and GSTR-3B quarterly while making monthly tax payments
- GSTR-2B auto-population: ITC available to the taxpayer is auto-populated in GSTR-3B based on GSTR-2B — reducing manual data entry
- Invoice matching: The GST system automatically reconciles GSTR-1 filed by suppliers with GSTR-2B of recipients — mismatches flag potential ITC discrepancies
- E-invoicing integration: For businesses under e-invoicing mandate, invoice data flows directly from the IRP (Invoice Registration Portal) to GSTR-1 — reducing errors
- Late fee structure: Late filing attracts ₹50/day for regular returns (₹20/day for NIL returns), subject to caps based on turnover
- Interest on late payment: Interest at 18% p.a. is levied on the net tax liability unpaid by the due date — applies automatically
- Blocked ITC under Rule 86B: Taxpayers with taxable turnover above ₹50 lakh in a month cannot use more than 99% of ITC for tax payment — 1% must be paid in cash
- HSN summary mandatory in GSTR-1: HSN-wise summary of outward supplies is mandatory in GSTR-1 based on turnover-linked thresholds

## Benefits

- ITC claim mechanism: GSTR-3B is the vehicle through which ITC is claimed — accurate and timely filing ensures ITC is accessed and utilized for tax payment
- Clean compliance record: Regular, timely GST return filing builds a clean compliance rating — important for bank loans, government tenders, and large enterprise contracts
- Avoid late fees and interest: Returns filed by due dates avoid late fees (₹50/day) and the significant interest burden (18% p.a.) on unpaid tax
- Supplier relationship management: GSTR-1 filed by suppliers directly impacts recipients' GSTR-2B — timely filing helps recipients' ITC and business relationships
- GST portal-based reconciliation tools: The portal's ITC comparison between GSTR-2B and GSTR-3B helps identify supplier non-compliance early
- Audit readiness: Consistent, accurate GST return filing creates a clean audit trail that simplifies statutory audits, bank audits, and GST department audits

## Documents

| Document | Details |
| --- | --- |
| Sales invoices / tax invoices | All outward supply invoices for the period |
| Purchase invoices | All inward supply invoices for ITC claim |
| GSTR-2B (auto-populated) | ITC available as per supplier filings |
| Credit notes and debit notes | Adjustments to supply values |
| RCM invoices | For reverse charge mechanism payments |
| Export documents | Shipping bills, FIRC (for services) |
| E-Way Bill data | Cross-reference with invoice data |
| Advance receipts | GST on advances received must be declared |
| ITC register | Running ledger of ITC claimed and utilized |
| Previous month GSTR-3B | For reference and continuity |

## Process

1. Step 1 — Data Compilation Compile all sales and purchase invoices for the return period. Reconcile with GSTR-2B for ITC verification.
1. Step 2 — Prepare GSTR-1 Enter all outward supply details in GSTR-1 — B2B invoices, B2C invoices, exports, credit notes, debit notes, and HSN summary. File GSTR-1 by the due date (11th of following month for monthly; 13th of following quarter for QRMP).
1. Step 3 — Reconcile ITC with GSTR-2B Compare ITC available in GSTR-2B with actual purchase invoices. Chase up suppliers whose invoices are missing from GSTR-2B. Claim only GSTR-2B-reflected ITC in GSTR-3B (to avoid notices under Rule 36(4)).
1. Step 4 — Prepare GSTR-3B Summarise all outward supplies (Table 3.1), eligible ITC (Table 4), and ineligible/reversed ITC (Table 4D). Compute net tax liability.
1. Step 5 — Pay Tax Pay the net tax liability (after setting off ITC) through the Electronic Cash Ledger — CGST, SGST/IGST, and cess separately. Pay any interest on late payment.
1. Step 6 — File GSTR-3B Submit GSTR-3B on the GST portal using DSC or EVC. GSTR-3B is due by the 20th of the following month (for monthly filers); 22nd/24th for quarterly QRMP filers.
1. Step 7 — Download Filed Returns Download the ARN-confirmed copies of filed GSTR-1 and GSTR-3B. Archive for compliance records.

## Fees

| Professional Service | Estimated Fee |
| --- | --- |
| GSTR-1 + GSTR-3B (monthly, small business) | ₹1,500 – ₹3,000/month |
| GSTR-1 + GSTR-3B (monthly, medium business) | ₹3,000 – ₹8,000/month |
| GSTR-1 + GSTR-3B (monthly, large business) | ₹8,000 – ₹25,000/month |
| QRMP scheme filing (quarterly) | ₹3,000 – ₹10,000/quarter |
| NIL return filing | ₹500 – ₹1,000/month |
| Annual GST compliance retainer | ₹20,000 – ₹2,00,000 p.a. |

| Government Late Fees | Amount |
| --- | --- |
| GSTR-1 late fee | ₹50/day (₹20/day for NIL) — max varies by turnover |
| GSTR-3B late fee | ₹50/day (₹20/day for NIL) — max varies by turnover |

Professional fees exclusive of GST @18%.

## Compliance

- GSTR-1 must be filed before GSTR-3B for the same period — GSTR-3B without corresponding GSTR-1 creates data mismatches
- ITC in GSTR-3B must not exceed ITC in GSTR-2B as a rule — excess claims attract notices
- File NIL returns for inactive months — non-filing blocks GSTR-1 filing for subsequent periods
- E-invoicing compliance is mandatory above prescribed thresholds — e-invoice IRN must be generated before the invoice is issued
- RCM liability must be self-assessed and paid in GSTR-3B — RCM ITC is available only after payment

## Common Mistakes

- Claiming ITC without GSTR-2B reflection: Claiming ITC for invoices not reflected in GSTR-2B — creates discrepancy notices under Rule 36(4) and possible ITC reversal demand
- Not declaring all outward supplies in GSTR-1: Missing invoices in GSTR-1 — recipients cannot claim ITC, damaging business relationships and potentially attracting GST audit
- Incorrectly applying IGST vs. CGST+SGST: Wrong tax head applied — e.g., inter-state supply taxed as intra-state — requires rectification in subsequent returns
- Treating advance receipts as not taxable: GST is payable on advances received for goods (where applicable) — not declaring advances is a common compliance gap
- Filing GSTR-3B before paying tax: GSTR-3B should be filed only after the cash balance in the Electronic Cash Ledger is sufficient to cover the net tax liability

## Frequently Asked Questions

- **We are under the QRMP scheme. Do we still need to pay GST monthly?** Yes. Under the QRMP (Quarterly Return Monthly Payment) scheme, GSTR-1 and GSTR-3B are filed quarterly — but tax must be paid monthly for the first two months of each quarter (using the Fixed Sum Method — 35% of the previous quarter's tax — or the Self-Assessment Method based on actual transactions). In the third month of the quarter, the full GSTR-3B is filed with the balance tax paid. Monthly payment is mandatory regardless of quarterly filing — delaying payment until the quarterly filing attracts interest at 18% p.a.
- **Our vendor hasn't filed their GSTR-1 for 3 months. Can we still claim ITC on their invoices?** As per Rule 36(4) of the CGST Rules, ITC can only be claimed on invoices reflected in GSTR-2B — which depends on the supplier filing their GSTR-1. If the supplier hasn't filed GSTR-1, their invoices won't appear in your GSTR-2B, and you cannot claim the ITC (without risk of reversal). You should follow up with the supplier to file their GSTR-1 and reflect your invoices. If the supplier consistently fails to file, consider it a significant vendor compliance risk — such suppliers create ITC exposure for their buyers. Switching to compliant vendors is the most effective long-term solution.
- **We accidentally filed GSTR-3B with incorrect figures for last month. Can we revise it?** GSTR-3B cannot be revised once filed. However, corrections can be made in the next month's GSTR-3B — by adjusting the figures in the relevant tables to account for the correction. For example, if you over-claimed ITC last month, reduce the ITC claim in the current month's GSTR-3B by the excess amount and pay interest on the over-claimed ITC from the date of the incorrect filing. For material errors, it is advisable to use DRC-03 to voluntarily pay any additional tax liability — demonstrating good faith compliance before any notice is received.
- **Is GST return filing required even if we have no sales for the month?** Yes. Every GST-registered taxpayer must file all applicable returns — GSTR-1 and GSTR-3B — even if there is zero business activity for the month. These are called NIL returns. Non-filing of NIL returns attracts late fees (₹20/day for NIL returns — ₹10 CGST + ₹10 SGST). Additionally, not filing GSTR-1 blocks the filing of the next GSTR-3B. Persistent non-filing leads to system-generated notices and can trigger compulsory cancellation of GST registration by the officer.
- **How do we handle a credit note issued to a B2C customer? Where is it reported?** Credit notes issued to unregistered (B2C) customers are reported in GSTR-1 in Table 9B (Credit and Debit Notes for Unregistered Persons). The credit note reduces the taxable value and the GST previously declared for the relevant invoice period. Note that unlike B2B credit notes (where the recipient reverses ITC), B2C credit notes don't trigger ITC reversal on the recipient's end (since they are unregistered). However, the supplier can reduce the output tax liability by the GST amount on the credit note — this adjustment is reflected in GSTR-3B for the month in which the credit note is issued.
