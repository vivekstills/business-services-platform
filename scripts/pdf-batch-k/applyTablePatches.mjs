/**
 * Replace flattened PDF table blobs with GFM pipe tables (same wording as PDF).
 * Applied after applyHeadingRules() so ## / ### anchors exist first.
 */

/** @param {number} articleIndex @param {string} md @returns {string} */
export function applyTablePatches(articleIndex, md) {
  const fn = PATCHERS[articleIndex];
  return fn ? fn(md) : md;
}

/** Escape | inside a cell for GFM */
function cell(s) {
  return String(s).replace(/\|/g, '\\|');
}

function row(cols) {
  return `| ${cols.map(cell).join(' | ')} |`;
}

const PATCHERS = [
  /** Article 1 — HSNSC cess */
  function patchHsns(md) {
    const kpNew = `## Key Provisions at a Glance

${row(['Provision', 'Details'])}
| --- | --- |
${row(['Name of Cess', 'Health Security to National Security Cess'])}
${row(['Applicable On', 'Net income tax liability (before rebates u/s 87A)'])}
${row(['Rate of Cess', '1% (for individuals), 2% (for corporates and LLPs)'])}
${row(['Effective From', 'April 1, 2026 (AY 2026–27 onwards)'])}
${row(['Applicability', 'All taxpayers liable to pay income tax'])}
${row(['Exemptions', 'Persons with total income below the basic exemption limit'])}
${row(['Fund Created', 'National Health-Security Fund (NHSF)'])}
${row(['Administration', 'Central Board of Direct Taxes (CBDT)'])}
${row(['TDS Impact', 'Yes — applicable on TDS calculations'])}
${row(['Advance Tax', 'Included in advance tax installment calculations'])}

`;

    const kpOld =
      /## Key Provisions at a Glance\n\nProvision Details Name of Cess Health Security to National Security Cess Applicable On Net income tax liability \(before rebates u\/s 87A\) Rate of Cess 1% \(for individuals\), 2% \(for corporates and LLPs\) Effective From April 1, 2026 \(AY 2026–27 onwards\) Applicability All taxpayers liable to pay income tax Exemptions Persons with total income below the basic exemption limit Fund Created National Health-Security Fund \(NHSF\) Administration Central Board of Direct Taxes \(CBDT\) TDS Impact Yes — applicable on TDS calculations\n\nAdvance Tax Included in advance tax installment calculations\n\n/;
    md = md.replace(kpOld, kpNew);

    const indOld =
      /## Practical Example: Individual Taxpayer\n\nRahul, a salaried employee in Mumbai, has a taxable income of ₹12,00,000 in AY 2026–27\. Component Amount \(₹\) Taxable Income 12,00,000 Income Tax \(as per slab\) 1,00,000 Health & Education Cess \(4%\) 4,000 HSNSC \(1% on ₹1,00,000\) 1,000 Total Tax Liability 1,05,000\n\n/;
    const indNew = `## Practical Example: Individual Taxpayer

Rahul, a salaried employee in Mumbai, has a taxable income of ₹12,00,000 in AY 2026–27.

${row(['Component', 'Amount (₹)'])}
| --- | --- |
${row(['Taxable Income', '12,00,000'])}
${row(['Income Tax (as per slab)', '1,00,000'])}
${row(['Health & Education Cess (4%)', '4,000'])}
${row(['HSNSC (1% on ₹1,00,000)', '1,000'])}
${row(['Total Tax Liability', '1,05,000'])}

`;
    md = md.replace(indOld, indNew);

    const corpOld =
      /## Practical Example: Corporate Taxpayer\n\nXYZ Pvt\. Ltd\. has a taxable income of ₹1 crore\. It opts for the 22% tax rate under Section 115BAA\. Component Amount \(₹\) Taxable Income 1,00,00,000 Income Tax @ 22% 22,00,000 Surcharge \(if applicable\) 2,20,000\n\nHealth & Education Cess \(4%\) 88,800 HSNSC \(2% on ₹22,00,000\) 44,000 Total Tax 25,52,800\n\n/;
    const corpNew = `## Practical Example: Corporate Taxpayer

XYZ Pvt. Ltd. has a taxable income of ₹1 crore. It opts for the 22% tax rate under Section 115BAA.

${row(['Component', 'Amount (₹)'])}
| --- | --- |
${row(['Taxable Income', '1,00,00,000'])}
${row(['Income Tax @ 22%', '22,00,000'])}
${row(['Surcharge (if applicable)', '2,20,000'])}
${row(['Health & Education Cess (4%)', '88,800'])}
${row(['HSNSC (2% on ₹22,00,000)', '44,000'])}
${row(['Total Tax', '25,52,800'])}

`;
    md = md.replace(corpOld, corpNew);

    const excOld =
      /## Exceptions and Exemptions\n\nCategory HSNSC Applicable\? Income below basic exemption limit No Agricultural income \(purely\) No Incomes exempt u\/s 10 \(PF, gratuity, etc\.\) No — exempted income doesn't form part of tax base Cooperative societies under special regime Subject to CBDT clarification\n\nSection 10\(23C\) institutions \(educational\) No, if income is fully exempt Political parties u\/s 13A No\n\n/;
    const excNew = `## Exceptions and Exemptions

${row(['Category', 'HSNSC Applicable?'])}
| --- | --- |
${row(['Income below basic exemption limit', 'No'])}
${row(['Agricultural income (purely)', 'No'])}
${row(["Incomes exempt u/s 10 (PF, gratuity, etc.)", "No — exempted income doesn't form part of tax base"])}
${row(['Cooperative societies under special regime', 'Subject to CBDT clarification'])}
${row(['Section 10(23C) institutions (educational)', 'No, if income is fully exempt'])}
${row(['Political parties u/s 13A', 'No'])}

`;
    md = md.replace(excOld, excNew);

    return md;
  },

  /** Article 2 — Handling & rain fees */
  function patchHandling(md) {
    const rateOld =
      /## GST Rate Applicability\n\nType of Charge HSN\/SAC Code GST Rate Remarks Cargo handling services 9967 18% Standard rate; no exemption Port handling \(by port trusts\/major ports\) 9967 18% Major ports are GST registered entities Rain fee \(by logistics company\) 9967 18% Treated as ancillary\/incidental to handling Rain fee \(by GTA\) 9965 5% \(RCM\) or 12% Depends on GTA vs\. ancillary charge classification Stevedoring charges 9967 18% Loading\/unloading at port Wharfage fees 9967 18% Levied by port authorities Key Point: If the rain fee is billed as a separate line item on an invoice distinct from freight, it is independently taxed at 18%\. If bundled with freight in a GTA invoice, the character of the principal supply \(freight at 5%\) may apply — but this requires careful documentation\.\n\n/;
    const rateNew = `## GST Rate Applicability

${row(['Type of Charge', 'HSN/SAC Code', 'GST Rate', 'Remarks'])}
| --- | --- | --- | --- |
${row(['Cargo handling services', '9967', '18%', 'Standard rate; no exemption'])}
${row(['Port handling (by port trusts/major ports)', '9967', '18%', 'Major ports are GST registered entities'])}
${row(['Rain fee (by logistics company)', '9967', '18%', 'Treated as ancillary/incidental to handling'])}
${row(['Rain fee (by GTA)', '9965', '5% (RCM) or 12%', 'Depends on GTA vs. ancillary charge classification'])}
${row(['Stevedoring charges', '9967', '18%', 'Loading/unloading at port'])}
${row(['Wharfage fees', '9967', '18%', 'Levied by port authorities'])}

Key Point: If the rain fee is billed as a separate line item on an invoice distinct from freight, it is independently taxed at 18%. If bundled with freight in a GTA invoice, the character of the principal supply (freight at 5%) may apply — but this requires careful documentation.

`;
    md = md.replace(rateOld, rateNew);

    const whoOld =
      /## Who Pays\? Forward Charge vs\. Reverse Charge\n\nSupplier Category Mechanism Who Pays GST Registered logistics company Forward Charge Supplier collects and deposits GTA \(freight \+ ancillary\) Reverse Charge \(RCM\) Recipient \(registered business\) pays Port trust \/ major port authority Forward Charge Port trust collects and deposits Unregistered small logistics operator RCM \(if applicable\) Recipient registered under GST Under Notification No\. 13\/2017-CT \(Rate\), services by a GTA to a registered person attract RCM\. If the rain fee is part of the GTA's composite charge, the recipient handles the GST under RCM\.\n\n/;
    const whoNew = `## Who Pays? Forward Charge vs. Reverse Charge

${row(['Supplier Category', 'Mechanism', 'Who Pays GST'])}
| --- | --- | --- |
${row(['Registered logistics company', 'Forward Charge', 'Supplier collects and deposits'])}
${row(['GTA (freight + ancillary)', 'Reverse Charge (RCM)', 'Recipient (registered business) pays'])}
${row(['Port trust / major port authority', 'Forward Charge', 'Port trust collects and deposits'])}
${row(['Unregistered small logistics operator', 'RCM (if applicable)', 'Recipient registered under GST'])}

Under Notification No. 13/2017-CT (Rate), services by a GTA to a registered person attract RCM. If the rain fee is part of the GTA's composite charge, the recipient handles the GST under RCM.

`;
    md = md.replace(whoOld, whoNew);

    const exOld =
      /## Practical Example 1: Importer at Mumbai Port\n\nSteelCorp India Ltd\. imports a shipment of stainless steel coils at JNPT\. The charges breakdown: Charge Amount \(₹\) GST Rate GST \(₹\) Freight \(GTA, ocean leg\) 3,00,000 5% \(RCM\) 15,000 Port handling\/stevedoring 40,000 18% 7,200 Rain fee \(separate invoice\) 5,000 18% 900 CHA professional fee 15,000 18% 2,700 Total GST 25,800 SteelCorp pays the port handling and rain fee GST directly to the service providers\. For the GTA freight, it self-assesses and deposits under RCM\. All of this is eligible for ITC \(being used in furtherance of business\)\.\n\n/;
    const exNew = `## Practical Example 1: Importer at Mumbai Port

SteelCorp India Ltd. imports a shipment of stainless steel coils at JNPT. The charges breakdown:

${row(['Charge', 'Amount (₹)', 'GST Rate', 'GST (₹)'])}
| --- | --- | --- | --- |
${row(['Freight (GTA, ocean leg)', '3,00,000', '5% (RCM)', '15,000'])}
${row(['Port handling/stevedoring', '40,000', '18%', '7,200'])}
${row(['Rain fee (separate invoice)', '5,000', '18%', '900'])}
${row(['CHA professional fee', '15,000', '18%', '2,700'])}
${row(['Total GST', '25,800', '—', '—'])}

SteelCorp pays the port handling and rain fee GST directly to the service providers. For the GTA freight, it self-assesses and deposits under RCM. All of this is eligible for ITC (being used in furtherance of business).

`;
    md = md.replace(exOld, exNew);

    return md;
  },

  /** Article 3 — Section 18(4) */
  function patch184(md) {
    const whenOld =
      /## When Does Section 18\(4\) Apply\?\n\nTrigger Event Section 18\(4\) Applies\? Goods become fully exempt from GST Yes — full ITC reversal\n\nGST rate reduced from 18% to 5% Yes — proportionate\/specific reversal required Business switches to Composition Scheme Yes — full ITC reversal of stock on hand Rate reduced only on specific variants \(not all goods\) Partial — only on the goods affected Rate increased from 5% to 12% No — ITC reversal not triggered; rate increase doesn't require reversal Business cancels GST registration Yes — full ITC reversal on closing stock\n\n/;
    const whenNew = `## When Does Section 18(4) Apply?

${row(['Trigger Event', 'Section 18(4) Applies?'])}
| --- | --- |
${row(['Goods become fully exempt from GST', 'Yes — full ITC reversal'])}
${row(['GST rate reduced from 18% to 5%', 'Yes — proportionate/specific reversal required'])}
${row(['Business switches to Composition Scheme', 'Yes — full ITC reversal of stock on hand'])}
${row(['Rate reduced only on specific variants (not all goods)', 'Partial — only on the goods affected'])}
${row(["Rate increased from 5% to 12%", "No — ITC reversal not triggered; rate increase doesn't require reversal"])}
${row(['Business cancels GST registration', 'Yes — full ITC reversal on closing stock'])}

`;
    md = md.replace(whenOld, whenNew);

    return md;
  },

  /** Article 4 — Securities */
  function patchSec(md) {
    const secOld =
      /## What Qualifies as "Securities" for GST Exemption\?\n\nUnder Section 2\(h\) of SCRA, securities include: Type of Security GST on Transaction\? Listed equity shares \(NSE\/BSE\) Exempt Unlisted equity shares Exempt Government securities \(G-Secs, T-Bills\) Exempt Corporate bonds and debentures Exempt Mutual fund units Exempt \(transaction; but management fees taxable\) Exchange-traded funds \(ETFs\) Exempt\n\nDerivatives \(futures and options\) Exempt on underlying; services taxable Rights and warrants Exempt Preference shares Exempt Commercial paper \/ certificate of deposit Exempt The exemption covers the transaction value \(the consideration for the security itself\)\. It does NOT cover service charges, brokerage, advisory fees, or management fees that accompany these transactions\.\n\n/;
    const secNew = `## What Qualifies as "Securities" for GST Exemption?

Under Section 2(h) of SCRA, securities include:

${row(['Type of Security', 'GST on Transaction?'])}
| --- | --- |
${row(['Listed equity shares (NSE/BSE)', 'Exempt'])}
${row(['Unlisted equity shares', 'Exempt'])}
${row(['Government securities (G-Secs, T-Bills)', 'Exempt'])}
${row(['Corporate bonds and debentures', 'Exempt'])}
${row(['Mutual fund units', 'Exempt (transaction; but management fees taxable)'])}
${row(['Exchange-traded funds (ETFs)', 'Exempt'])}
${row(['Derivatives (futures and options)', 'Exempt on underlying; services taxable'])}
${row(['Rights and warrants', 'Exempt'])}
${row(['Preference shares', 'Exempt'])}
${row(['Commercial paper / certificate of deposit', 'Exempt'])}

The exemption covers the transaction value (the consideration for the security itself). It does NOT cover service charges, brokerage, advisory fees, or management fees that accompany these transactions.

`;
    md = md.replace(secOld, secNew);

    const svcOld =
      /## What IS Taxable: Services Around Securities\n\nThis is where many investors and businesses get confused\. While the sale\/purchase of securities is outside GST, the services facilitating these transactions are very much taxable\. Service GST Rate Provider Stock brokerage 18% Broker Demat account maintenance charges 18% Depository participant Portfolio management fee 18% PMS manager Mutual fund management fee \(expense ratio\) 18% AMC\n\nInvestment advisory fee 18% SEBI-registered IA Custodian services 18% Custodian Clearing charges 18% Clearing corporation Exchange transaction charges 18% Stock exchange Research report subscription 18% Research analyst Underwriting fees 18% Investment bank\/merchant banker\n\n/;
    const svcNew = `## What IS Taxable: Services Around Securities

This is where many investors and businesses get confused. While the sale/purchase of securities is outside GST, the services facilitating these transactions are very much taxable.

${row(['Service', 'GST Rate', 'Provider'])}
| --- | --- | --- |
${row(['Stock brokerage', '18%', 'Broker'])}
${row(['Demat account maintenance charges', '18%', 'Depository participant'])}
${row(['Portfolio management fee', '18%', 'PMS manager'])}
${row(['Mutual fund management fee (expense ratio)', '18%', 'AMC'])}
${row(['Investment advisory fee', '18%', 'SEBI-registered IA'])}
${row(['Custodian services', '18%', 'Custodian'])}
${row(['Clearing charges', '18%', 'Clearing corporation'])}
${row(['Exchange transaction charges', '18%', 'Stock exchange'])}
${row(['Research report subscription', '18%', 'Research analyst'])}
${row(['Underwriting fees', '18%', 'Investment bank/merchant banker'])}

`;
    md = md.replace(svcOld, svcNew);

    const sttOld =
      /## The Subtle GST on STT vs\. GST Distinction\n\nMany retail investors confuse Securities Transaction Tax \(STT\) with GST\. They are entirely separate: Feature STT GST Nature Direct tax on transaction Indirect tax on services Levied on Value of securities traded Value of services \(brokerage, etc\.\) Rate 0\.025% to 0\.1% depending on transaction 18% on service fees Who pays Buyer\/seller on transaction Service recipient\n\nDeductible against tax\? Yes \(for active traders\) Yes, if used in business GST is charged on the brokerage, not on the securities transaction itself\.\n\n/;
    const sttNew = `## The Subtle GST on STT vs. GST Distinction

Many retail investors confuse Securities Transaction Tax (STT) with GST. They are entirely separate:

${row(['Feature', 'STT', 'GST'])}
| --- | --- | --- |
${row(['Nature', 'Direct tax on transaction', 'Indirect tax on services'])}
${row(['Levied on', 'Value of securities traded', 'Value of services (brokerage, etc.)'])}
${row(['Rate', '0.025% to 0.1% depending on transaction', '18% on service fees'])}
${row(['Who pays', 'Buyer/seller on transaction', 'Service recipient'])}
${row(['Deductible against tax?', 'Yes (for active traders)', 'Yes, if used in business'])}

GST is charged on the brokerage, not on the securities transaction itself.

`;
    md = md.replace(sttOld, sttNew);

    const priyaOld =
      /## Detailed Example: Equity Trade by Retail Investor\n\nPriya buys 100 shares of Infosys at ₹1,500 per share through her broker\. Component Amount \(₹\) GST\? Purchase value of shares \(100 × ₹1,500\) 1,50,000 No \(exempt\) STT \(0\.1% on buy\) 150 No \(direct tax\) Brokerage @ 0\.3% 450 Yes — 18% GST = ₹81 Exchange transaction charge 45 Yes — 18% GST = ₹8\.10 Demat\/clearing charge 15 Yes — 18% GST = ₹2\.70 GST actually paid by Priya\n\n₹91\.80 The actual securities cost \(₹1,50,000\) is GST-free\. Only the service fees attract GST\.\n\n/;
    const priyaNew = `## Detailed Example: Equity Trade by Retail Investor

Priya buys 100 shares of Infosys at ₹1,500 per share through her broker.

${row(['Component', 'Amount (₹)', 'GST?'])}
| --- | --- | --- |
${row(['Purchase value of shares (100 × ₹1,500)', '1,50,000', 'No (exempt)'])}
${row(['STT (0.1% on buy)', '150', 'No (direct tax)'])}
${row(['Brokerage @ 0.3%', '450', 'Yes — 18% GST = ₹81'])}
${row(['Exchange transaction charge', '45', 'Yes — 18% GST = ₹8.10'])}
${row(['Demat/clearing charge', '15', 'Yes — 18% GST = ₹2.70'])}
${row(['GST actually paid by Priya', '₹91.80', '—'])}

The actual securities cost (₹1,50,000) is GST-free. Only the service fees attract GST.

`;
    md = md.replace(priyaOld, priyaNew);

    const fundOld =
      /## Detailed Example: Fund House \(Mutual Fund AMC\)\n\nWealth Asset Management runs equity mutual funds\. Its fee structure:\n\nRevenue Source GST Applicable\? Management fee \(TER — expense ratio\) charged to investors Yes — 18% \(AMC is providing portfolio management service\) Exit load charged to investors Partially debated — most AMCs treat this as outside GST Sale\/redemption of units by investors No — mutual fund unit transactions are exempt Dividend distributed to unitholders No The AMC pays GST on its management fee income\. Investors see this embedded in the expense ratio but cannot claim ITC unless investing through a corporate treasury \(B2B\)\.\n\n/;
    const fundNew = `## Detailed Example: Fund House (Mutual Fund AMC)

Wealth Asset Management runs equity mutual funds. Its fee structure:

${row(['Revenue Source', 'GST Applicable?'])}
| --- | --- |
${row(['Management fee (TER — expense ratio) charged to investors', 'Yes — 18% (AMC is providing portfolio management service)'])}
${row(['Exit load charged to investors', 'Partially debated — most AMCs treat this as outside GST'])}
${row(['Sale/redemption of units by investors', 'No — mutual fund unit transactions are exempt'])}
${row(['Dividend distributed to unitholders', 'No'])}

The AMC pays GST on its management fee income. Investors see this embedded in the expense ratio but cannot claim ITC unless investing through a corporate treasury (B2B).

`;
    md = md.replace(fundOld, fundNew);

    const edgeOld =
      /## Exceptions and Edge Cases\n\nSituation GST Treatment Slump sale of a business \(including securities\) Exempt \(treated as transfer of going concern\) Transfer of securities as consideration for merger Exempt \(securities transaction\) Repo transactions in G-Secs Exempt on the securities leg; interest may attract GST debate Option premium \(F&O\) Exempt on the derivative itself; brokerage taxable Foreign exchange securities \(offshore funds\) Import of service; intermediary service may attract IGST\n\n/;
    const edgeNew = `## Exceptions and Edge Cases

${row(['Situation', 'GST Treatment'])}
| --- | --- |
${row(['Slump sale of a business (including securities)', 'Exempt (treated as transfer of going concern)'])}
${row(['Transfer of securities as consideration for merger', 'Exempt (securities transaction)'])}
${row(['Repo transactions in G-Secs', 'Exempt on the securities leg; interest may attract GST debate'])}
${row(['Option premium (F&O)', 'Exempt on the derivative itself; brokerage taxable'])}
${row(['Foreign exchange securities (offshore funds)', 'Import of service; intermediary service may attract IGST'])}

`;
    md = md.replace(edgeOld, edgeNew);

    return md;
  },

  /** Article 5 — Rent agreement */
  function patchRent(md) {
    const docOld =
      /## Documents Required: A Comprehensive Table\n\nDocument Category Specific Document Mandatory\? Rent\/lease agreement Registered or notarized agreement Mandatory for rented premises Identity of landlord Landlord's PAN, Aadhaar \(where applicable\) May be required in scrutiny Utility bill of premises Electricity\/water\/gas bill \(last 2 months\) Mandatory \(landlord's name is fine\) No Objection Certificate \(NOC\) From landlord if agreement is unregistered Highly recommended Self-declaration If using owner's property \(family property\) Required for informal arrangements Consent letter From co-owner or partner \(if shared premises\) Required if multiple parties co-own\n\n/;
    const docNew = `## Documents Required: A Comprehensive Table

${row(['Document Category', 'Specific Document', 'Mandatory?'])}
| --- | --- | --- |
${row(['Rent/lease agreement', 'Registered or notarized agreement', 'Mandatory for rented premises'])}
${row(["Identity of landlord", "Landlord's PAN, Aadhaar (where applicable)", 'May be required in scrutiny'])}
${row(['Utility bill of premises', 'Electricity/water/gas bill (last 2 months)', "Mandatory (landlord's name is fine)"])}
${row(['No Objection Certificate (NOC)', 'From landlord if agreement is unregistered', 'Highly recommended'])}
${row(["Self-declaration", "If using owner's property (family property)", 'Required for informal arrangements'])}
${row(['Consent letter', 'From co-owner or partner (if shared premises)', 'Required if multiple parties co-own'])}

`;
    md = md.replace(docOld, docNew);

    const regOld =
      /## Registered vs\. Notarized vs\. Unregistered Agreement — What Works\?\n\nType Validity for GST Risk Level Notes Registered rent agreement \(sub-registrar\) Strongest — almost always accepted Low Required for leases > 11 months in many states Notarized agreement Generally accepted Low-Medi um Notary stamp adds credibility Unregistered agreement \(plain paper, notarized\) Usually accepted with NOC Medium May invite additional scrutiny\n\nUnregistered, not notarized Riskiest — may be rejected High Always supplement with NOC Verbal arrangement \(no document\) Not acceptable Very High Must create written agreement Key Rule: Under the Registration Act, 1908, any lease for more than 11 months must be compulsorily registered with the Sub-Registrar\. For GST registration, even 11-month notarized agreements work — but if your operations require a longer lease, get it registered\.\n\n/;
    const regNew = `## Registered vs. Notarized vs. Unregistered Agreement — What Works?

${row(['Type', 'Validity for GST', 'Risk Level', 'Notes'])}
| --- | --- | --- | --- |
${row(['Registered rent agreement (sub-registrar)', 'Strongest — almost always accepted', 'Low', 'Required for leases > 11 months in many states'])}
${row(['Notarized agreement', 'Generally accepted', 'Low-Medium', 'Notary stamp adds credibility'])}
${row(['Unregistered agreement (plain paper, notarized)', 'Usually accepted with NOC', 'Medium', 'May invite additional scrutiny'])}
${row(['Unregistered, not notarized', 'Riskiest — may be rejected', 'High', 'Always supplement with NOC'])}
${row(['Verbal arrangement (no document)', 'Not acceptable', 'Very High', 'Must create written agreement'])}

Key Rule: Under the Registration Act, 1908, any lease for more than 11 months must be compulsorily registered with the Sub-Registrar. For GST registration, even 11-month notarized agreements work — but if your operations require a longer lease, get it registered.

`;
    md = md.replace(regOld, regNew);

    const rejOld =
      /## Common Rejection Reasons and How to Avoid Them\n\nRejection Reason How to Avoid Rent agreement in landlord's name only Ensure tenant's name \(applicant\) is clearly on the agreement Residential use clause in agreement Get a commercial use\/NOC amendment or separate commercial agreement Expired rent agreement Submit current, valid agreement; renew or extend before applying Signature mismatch with other documents Ensure signatures are consistent Address mismatch with utility bill Pin code, building name must match exactly Co-living or PG agreement submitted Not acceptable; must have formal commercial proof Foreign-owned property without Indian document Ensure property tax records or electricity account exists in India\n\n/;
    const rejNew = `## Common Rejection Reasons and How to Avoid Them

${row(['Rejection Reason', 'How to Avoid'])}
| --- | --- |
${row(["Rent agreement in landlord's name only", "Ensure tenant's name (applicant) is clearly on the agreement"])}
${row(['Residential use clause in agreement', 'Get a commercial use/NOC amendment or separate commercial agreement'])}
${row(['Expired rent agreement', 'Submit current, valid agreement; renew or extend before applying'])}
${row(['Signature mismatch with other documents', 'Ensure signatures are consistent'])}
${row(['Address mismatch with utility bill', 'Pin code, building name must match exactly'])}
${row(['Co-living or PG agreement submitted', 'Not acceptable; must have formal commercial proof'])}
${row(['Foreign-owned property without Indian document', 'Ensure property tax records or electricity account exists in India'])}

`;
    md = md.replace(rejOld, rejNew);

    const specOld =
      /## Special Situations\n\nSituation GST Registration Approach Lease in company's name, director is individual applicant Provide company lease \+ board resolution authorizing director Agricultural land used as business warehouse Registered lease \+ conversion certificate if required by state Government premises \(rented from municipal body\) Allotment letter from government body serves as proof Embassy or diplomatic mission address Special cases; CBIC has provided separate guidance Newly constructed building \(no utility bill yet\) Completion certificate \+ builder's allotment letter acceptable\n\n/;
    const specNew = `## Special Situations

${row(['Situation', 'GST Registration Approach'])}
| --- | --- |
${row(["Lease in company's name, director is individual applicant", 'Provide company lease + board resolution authorizing director'])}
${row(['Agricultural land used as business warehouse', 'Registered lease + conversion certificate if required by state'])}
${row(['Government premises (rented from municipal body)', 'Allotment letter from government body serves as proof'])}
${row(['Embassy or diplomatic mission address', 'Special cases; CBIC has provided separate guidance'])}
${row(['Newly constructed building (no utility bill yet)', "Completion certificate + builder's allotment letter acceptable"])}

`;
    md = md.replace(specOld, specNew);

    return md;
  },
];
