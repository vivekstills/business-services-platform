import type { ServicePackage } from './services';
import type { FAQ } from './faqs';

// ─── Complete list of Indian States & UTs ────────────────────────────────────
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  // Union Territories
  'Andaman & Nicobar Islands',
  'Chandigarh',
  'Dadra & Nagar Haveli and Daman & Diu',
  'Delhi (NCT)',
  'Jammu & Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
] as const;

export type IndianState = typeof INDIAN_STATES[number];

// ─── State classification groups ─────────────────────────────────────────────

/** NE + Hilly states — GST threshold is ₹10 Lakhs (not ₹20 Lakhs) */
export const NE_HILLY_STATES: IndianState[] = [
  'Arunachal Pradesh', 'Assam', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Sikkim', 'Tripura', 'Himachal Pradesh', 'Uttarakhand',
  'Jammu & Kashmir', 'Ladakh',
];

/** States that levy Professional Tax */
export const PT_STATES: IndianState[] = [
  'Maharashtra', 'Karnataka', 'West Bengal', 'Andhra Pradesh',
  'Telangana', 'Tamil Nadu', 'Gujarat', 'Assam', 'Chhattisgarh',
  'Kerala', 'Meghalaya', 'Odisha', 'Tripura', 'Madhya Pradesh',
];

/** Tier-1 metro/high-stamp-duty states — company registration has higher govt fees */
export const TIER1_STATES: IndianState[] = [
  'Maharashtra', 'Delhi (NCT)', 'Karnataka', 'Tamil Nadu',
  'Telangana', 'Gujarat', 'West Bengal',
];

/** Tier-3 NE/hilly states — lower govt fees in some registrations */
export const TIER3_STATES: IndianState[] = NE_HILLY_STATES;

export function getStateTier(state: IndianState | ''): 1 | 2 | 3 {
  if (!state) return 2;
  if (TIER1_STATES.includes(state as IndianState)) return 1;
  if (TIER3_STATES.includes(state as IndianState)) return 3;
  return 2;
}

export function hasProfessionalTax(state: IndianState | ''): boolean {
  return !!state && PT_STATES.includes(state as IndianState);
}

export function isNEHillyState(state: IndianState | ''): boolean {
  return !!state && NE_HILLY_STATES.includes(state as IndianState);
}

// ─── State-specific FAQ overrides ────────────────────────────────────────────
// Keyed by serviceId → stateId → FAQ[]
// These FAQs are APPENDED to / replace relevant ones when a state is selected.

export type StateSpecificFAQs = Record<string, Partial<Record<IndianState, FAQ[]>>>;

export const STATE_FAQS: StateSpecificFAQs = {

  'gst-registration': {
    'Maharashtra': [
      {
        q: 'What is the GST registration threshold in Maharashtra?',
        a: 'In Maharashtra, the mandatory GST registration threshold is ₹20 Lakhs for supply of goods and services. However, if you sell only exempt goods, you are not required to register unless you make inter-state supplies.',
      },
      {
        q: 'Does a Maharashtra business also need Professional Tax (PT) registration after GST?',
        a: 'Yes. In Maharashtra, any business entity — including those registered for GST — is required to obtain a PTEC (Professional Tax Enrolment Certificate) and a PTRC (Professional Tax Registration Certificate) if it employs any person. Both are separate from GST.',
      },
      {
        q: 'What is the HSN/SAC code requirement for Maharashtra suppliers?',
        a: 'Businesses with annual turnover above ₹5 Crore must mention 6-digit HSN codes on all B2B invoices in Maharashtra. Turnover between ₹1.5 Cr and ₹5 Cr must mention 4-digit HSN codes.',
      },
    ],
    'Karnataka': [
      {
        q: 'What is the GST threshold in Karnataka?',
        a: 'The mandatory GST registration threshold for businesses in Karnataka is ₹20 Lakhs for goods/services. E-commerce operators, regardless of turnover, must register mandatorily.',
      },
      {
        q: 'Are IT/software companies in Karnataka subject to GST?',
        a: 'Yes. Software and IT services (including SaaS, BPO, IT consulting) are classified as services under GST. The applicable rate is typically 18% under SAC code 998313 or 998314 depending on the nature of service. Bangalore-based IT firms are the largest contributor to Karnataka\'s GST pool.',
      },
    ],
    'Tamil Nadu': [
      {
        q: 'What is the GST registration threshold in Tamil Nadu?',
        a: 'The mandatory threshold is ₹20 Lakhs for Tamil Nadu businesses. The state has a high density of manufacturing and textile businesses, which are subject to GST at varying rates (5% to 18% depending on the category of goods).',
      },
      {
        q: 'Do textile businesses in Tamil Nadu need separate state-level licences alongside GST?',
        a: 'Yes. Textile manufacturing units in Tamil Nadu need a Factory Licence under the Factories Act, TNPCB (Tamil Nadu Pollution Control Board) consent for manufacturing, and in some cases MSME registration. GST registration alone is not sufficient for operating a textile unit.',
      },
    ],
    'Arunachal Pradesh': [
      {
        q: 'What is the GST registration threshold in Arunachal Pradesh?',
        a: 'Being a special category North-Eastern state, the mandatory GST registration threshold for Arunachal Pradesh is ₹10 Lakhs — half the standard ₹20 Lakh threshold. This applies to both goods and services suppliers.',
      },
      {
        q: 'Are there any GST exemptions specific to Arunachal Pradesh?',
        a: 'Agricultural produce sold directly by farmers and certain tribal handicrafts may qualify for GST exemptions. However, any business involved in inter-state trade must register regardless of turnover.',
      },
    ],
    'Manipur': [
      {
        q: 'What is the GST threshold in Manipur?',
        a: 'Manipur, as a North-Eastern special category state, has a reduced mandatory GST registration threshold of ₹10 Lakhs. This is applicable to both goods and service providers.',
      },
      {
        q: 'Are there GSTIN-related incentives for Manipur-based businesses?',
        a: 'The Government of Manipur periodically offers state-level incentives for new businesses including subsidies, interest subvention schemes and investment promotion. GST registration is a prerequisite to avail most of these schemes.',
      },
    ],
    'Mizoram': [
      {
        q: 'What is the GST threshold in Mizoram?',
        a: 'Mizoram is a North-Eastern special category state. The mandatory GST threshold here is ₹10 Lakhs, not the standard ₹20 Lakhs. Service providers with turnover above ₹10 Lakhs must register compulsorily.',
      },
    ],
    'Meghalaya': [
      {
        q: 'What is the GST registration threshold in Meghalaya?',
        a: 'Meghalaya falls under the special category North-Eastern states. The mandatory GST registration threshold is ₹10 Lakhs. Additionally, Meghalaya also levies Professional Tax, unlike most NE states.',
      },
    ],
    'Nagaland': [
      {
        q: 'Is GST registration threshold lower in Nagaland?',
        a: 'Yes. Being a North-Eastern special category state, the mandatory GST threshold in Nagaland is ₹10 Lakhs. Suppliers of goods or services crossing this threshold must register and collect GST.',
      },
    ],
    'Sikkim': [
      {
        q: 'What is the GST threshold in Sikkim?',
        a: 'Sikkim, classified as a special category hilly state, has a GST registration threshold of ₹10 Lakhs for both goods and service suppliers. Sikkim also has a special status regarding income tax for its original residents (sikkimese income tax exemption), though GST applies uniformly.',
      },
    ],
    'Tripura': [
      {
        q: 'What is the GST threshold in Tripura?',
        a: 'Tripura is a special category North-Eastern state with a GST registration threshold of ₹10 Lakhs. The state also levies Professional Tax on employees and self-employed persons.',
      },
    ],
    'Himachal Pradesh': [
      {
        q: 'What is the GST registration threshold in Himachal Pradesh?',
        a: 'Himachal Pradesh is classified as a special category hilly state. The mandatory GST registration threshold is ₹10 Lakhs, lower than the standard ₹20 Lakh threshold applicable to plains states.',
      },
      {
        q: 'Are hotel/tourism businesses in Himachal Pradesh subject to any special GST rules?',
        a: 'Yes. Hotel accommodation above ₹7,500 per day attracts 18% GST, and restaurants in hotels charging above ₹7,500 per day also attract 18%. Regular restaurants levy 5% GST. Tourism businesses must ensure correct HSN/SAC classification to avoid penalties.',
      },
    ],
    'Uttarakhand': [
      {
        q: 'What is the GST threshold in Uttarakhand?',
        a: 'Uttarakhand is a special category hilly/NE state. Its mandatory GST registration threshold is ₹10 Lakhs, not the standard ₹20 Lakhs. Businesses in Dehradun, Haridwar, Rishikesh and other commercial centres must register once turnover crosses ₹10 Lakhs.',
      },
    ],
    'Delhi (NCT)': [
      {
        q: 'What is the GST threshold for Delhi businesses?',
        a: 'Delhi follows the standard GST threshold of ₹20 Lakhs. However, given the high commercial density, most Delhi businesses surpass this threshold quickly. Delhi also has no Professional Tax, which is a compliance advantage.',
      },
      {
        q: 'Does Delhi have its own GST department?',
        a: 'Yes. Delhi has its own GST department (DSGST) that handles state GST registrations, audits and enforcement within its jurisdiction. Dual administration by CGST and SGST applies — approximately half the taxpayers are administered by Centre and half by state, based on turnover.',
      },
    ],
    'Gujarat': [
      {
        q: 'What is the GST threshold in Gujarat?',
        a: 'The standard ₹20 Lakh threshold applies in Gujarat. Gujarat is India\'s most GST-compliant state, consistently ranking among the top in GST collections. Diamond, textile, pharmaceutical and petrochemical industries are major contributors.',
      },
      {
        q: 'Are diamond traders in Gujarat exempt from GST?',
        a: 'Raw diamonds attract 0.25% GST. Processed diamonds (polished) attract 1.5% GST under the composition scheme for diamond traders. Surat-based diamond businesses should specifically opt into the composition scheme for diamonds if eligible.',
      },
    ],
    'West Bengal': [
      {
        q: 'What is the GST threshold in West Bengal?',
        a: 'The standard ₹20 Lakh threshold applies in West Bengal. The state also levies Professional Tax at rates varying by income slab, up to ₹2,500 per year. Businesses in Kolkata, Durgapur and other industrial centres are heavily monitored for GST compliance.',
      },
    ],
    'Rajasthan': [
      {
        q: 'What is the GST threshold in Rajasthan?',
        a: 'The standard ₹20 Lakh threshold applies in Rajasthan. The state is prominent for tourism, textile, gems & jewellery, and marble industries. GST rates on gems and jewellery range from 3% (gold/silver jewellery) to 18% (synthetic gems).',
      },
    ],
    'Uttar Pradesh': [
      {
        q: 'What is the GST threshold in Uttar Pradesh?',
        a: 'The standard ₹20 Lakh threshold applies in Uttar Pradesh. UP is one of India\'s largest states by GST registrations. Agra leather goods, Varanasi silk, and Noida IT/manufacturing are major sectors.',
      },
    ],
  },

  'professional-tax-registration': {
    'Maharashtra': [
      {
        q: 'What are the Professional Tax slabs in Maharashtra for 2024-25?',
        a: 'In Maharashtra, the PT slab for employees is: ₹0 for monthly salary up to ₹7,500; ₹175/month for salary ₹7,501–₹10,000; ₹200/month (February: ₹300) for salary above ₹10,000. Maximum annual PT is ₹2,500 per employee.',
      },
      {
        q: 'What is the due date for PT return filing in Maharashtra?',
        a: 'In Maharashtra, if your annual PTRC liability exceeds ₹50,000, you must file returns and make payment monthly by the last day of each month. If annual liability is ₹50,000 or less, annual return and payment is due by 31st March. PTEC is paid annually.',
      },
      {
        q: 'Can a proprietorship in Maharashtra claim PT paid as a business deduction?',
        a: 'Yes. Professional Tax paid by a proprietor on their own account (PTEC) is allowed as a deduction from business income under Section 16(iii) of the Income Tax Act. Similarly, PT deducted from employee salaries is allowed as salary expense.',
      },
    ],
    'Karnataka': [
      {
        q: 'What are the Professional Tax slabs in Karnataka?',
        a: 'Karnataka PT slabs (half-yearly): ₹0 for gross salary up to ₹15,000/half-year; ₹60 for ₹15,001–₹25,000; ₹80 for ₹25,001–₹35,000; ₹100 for ₹35,001–₹45,000; ₹125 for ₹45,001–₹60,000; ₹150 for ₹60,001–₹75,000; ₹175 for ₹75,001–₹1,00,000; ₹200 for ₹1,00,001–₹1,25,000; ₹2,500/year for above ₹1,25,000.',
      },
      {
        q: 'When must PT returns be filed in Karnataka?',
        a: 'Karnataka PT returns are filed half-yearly. For the April–September period, the return and payment are due by 20th September. For the October–March period, they are due by 20th March.',
      },
    ],
    'West Bengal': [
      {
        q: 'What are the Professional Tax slabs in West Bengal?',
        a: 'West Bengal PT slabs (monthly): No tax for gross salary up to ₹10,000; ₹110/month for ₹10,001–₹15,000; ₹130/month for ₹15,001–₹25,000; ₹150/month for ₹25,001–₹40,000; ₹200/month for above ₹40,000. Maximum annual PT is ₹2,500.',
      },
      {
        q: 'When are PT returns due in West Bengal?',
        a: 'In West Bengal, PT returns are filed annually. The employer must file the annual return and make payment by 31st March. Monthly challans are made by the 21st of the following month.',
      },
    ],
    'Tamil Nadu': [
      {
        q: 'What are the Professional Tax rates in Tamil Nadu?',
        a: 'Tamil Nadu PT rates (half-yearly): ₹0 for gross income up to ₹21,000; ₹135 for ₹21,001–₹30,000; ₹315 for ₹30,001–₹45,000; ₹690 for ₹45,001–₹60,000; ₹1,025 for ₹60,001–₹75,000; ₹1,250 for above ₹75,000. Maximum annual PT is ₹2,500.',
      },
    ],
    'Gujarat': [
      {
        q: 'What are the Professional Tax slabs in Gujarat?',
        a: 'Gujarat PT slabs (monthly): ₹0 for salary up to ₹12,000; ₹80/month for ₹12,001–₹15,000; ₹150/month for ₹15,001–₹20,000; ₹200/month for above ₹20,000. Maximum PT is ₹2,500 annually.',
      },
    ],
    'Andhra Pradesh': [
      {
        q: 'What are the PT slabs in Andhra Pradesh?',
        a: 'Andhra Pradesh PT (half-yearly): ₹0 for gross salary up to ₹15,000; ₹60 for ₹15,001–₹20,000; ₹80 for ₹20,001–₹30,000; ₹100 for ₹30,001–₹40,000; ₹120 for ₹40,001–₹60,000; ₹1,250 for above ₹60,000. Maximum annual is ₹2,500.',
      },
    ],
    'Telangana': [
      {
        q: 'What are the PT slabs in Telangana?',
        a: 'Telangana PT (half-yearly): ₹0 for gross salary up to ₹15,000; ₹60 for ₹15,001–₹20,000; ₹80 for ₹20,001–₹30,000; ₹100 for ₹30,001–₹40,000; ₹125 for ₹40,001–₹60,000; ₹1,250 for above ₹60,000.',
      },
    ],
    'Kerala': [
      {
        q: 'What are the Professional Tax rates in Kerala?',
        a: 'Kerala PT (half-yearly): ₹0 for half-yearly income up to ₹11,999; ₹120 for ₹12,000–₹17,999; ₹180 for ₹18,000–₹29,999; ₹300 for ₹30,000–₹44,999; ₹450 for ₹45,000–₹59,999; ₹600 for ₹60,000–₹74,999; ₹750 for ₹75,000–₹99,999; ₹1,000 for above ₹1,00,000.',
      },
    ],
    'Delhi (NCT)': [
      {
        q: 'Is Professional Tax applicable in Delhi?',
        a: 'No. Delhi does not levy Professional Tax. Both employers and employees in Delhi are exempt from Professional Tax. This is a notable compliance advantage for Delhi-based businesses compared to states like Maharashtra, Karnataka and West Bengal.',
      },
    ],
    'Haryana': [
      {
        q: 'Is Professional Tax applicable in Haryana?',
        a: 'No. Haryana does not levy Professional Tax. Employees and employers in Haryana have no Professional Tax obligation, unlike neighbouring states.',
      },
    ],
    'Rajasthan': [
      {
        q: 'Is Professional Tax applicable in Rajasthan?',
        a: 'No. Rajasthan does not currently levy Professional Tax on employees or self-employed professionals. Businesses in Rajasthan do not need to obtain PTEC or PTRC.',
      },
    ],
    'Uttar Pradesh': [
      {
        q: 'Is Professional Tax applicable in Uttar Pradesh?',
        a: 'No. Uttar Pradesh does not levy Professional Tax. This is a compliance advantage for businesses and employees in UP.',
      },
    ],
    'Punjab': [
      {
        q: 'Is Professional Tax applicable in Punjab?',
        a: 'No. Punjab does not levy Professional Tax. Employers in Punjab are not required to deduct PT from employee salaries.',
      },
    ],
    'Bihar': [
      {
        q: 'Is Professional Tax applicable in Bihar?',
        a: 'No. Bihar does not currently levy Professional Tax. Businesses operating in Bihar are not required to register for PT.',
      },
    ],
  },

  'private-limited-company': {
    'Maharashtra': [
      {
        q: 'What is the stamp duty on MOA & AOA for a Maharashtra company?',
        a: 'Maharashtra levies stamp duty on Memorandum of Association (MOA) and Articles of Association (AOA). For MOA: ₹1,000 for authorised capital up to ₹5 Lakhs, and ₹500 for every additional ₹5 Lakhs. AOA stamp duty ranges from ₹500 to ₹5,000 depending on authorised capital. This increases the government cost of incorporation compared to most states.',
      },
      {
        q: 'Does a Private Limited Company in Maharashtra also need PT registration?',
        a: 'Yes. A Private Limited Company incorporated in Maharashtra must obtain PTEC (for the company as an entity) and PTRC (for deducting PT from employees\' salaries). Both registrations must be obtained within 30 days of commencing business.',
      },
      {
        q: 'Does a Mumbai-based company need a Gumasta Licence (Shop Act)?',
        a: 'Yes. Private Limited Companies operating from Mumbai, Pune or any other Maharashtra city must obtain a Gumasta Licence under the Maharashtra Shops and Establishments (Regulation of Employment and Conditions of Service) Act, 2017. This is required within 60 days of commencement of business.',
      },
    ],
    'Karnataka': [
      {
        q: 'What is the stamp duty for incorporating a company in Karnataka?',
        a: 'Karnataka uses e-Stamp paper for MOA and AOA. Stamp duty is levied under the Karnataka Stamp Act. For MOA, the duty ranges from ₹1,000 for authorised capital up to ₹10 Lakhs, with an incremental slab thereafter. Bangalore-based companies face one of India\'s highest post-incorporation compliance costs due to PT, Shops Act, BBMP licence, and KCSR requirements.',
      },
      {
        q: 'Does a Bangalore company need a Shops & Establishments Registration?',
        a: 'Yes. Under the Karnataka Shops and Commercial Establishments Act, 1961, every establishment in Karnataka must register within 30 days of starting business. This applies to all Private Limited Companies operating from Karnataka.',
      },
    ],
    'Delhi (NCT)': [
      {
        q: 'Is incorporating in Delhi cheaper in terms of stamp duty?',
        a: 'Yes. Delhi has relatively lower stamp duty on MOA/AOA — typically ₹100 to ₹2,000 depending on authorised capital. Delhi also has no Professional Tax, making it one of the more cost-effective states for incorporation from a government fee perspective.',
      },
      {
        q: 'Does a Delhi company need a Shop & Establishment registration?',
        a: 'Yes. Private Limited Companies in Delhi must register under the Delhi Shops and Establishments Act, 1954 within 30 days of commencement. This is managed by the Delhi Labour Department.',
      },
    ],
    'Rajasthan': [
      {
        q: 'What is the stamp duty for company incorporation in Rajasthan?',
        a: 'Rajasthan has relatively low stamp duty on MOA and AOA, with a flat rate based on authorised capital. The overall government cost of incorporation in Rajasthan is lower than Tier-1 states like Maharashtra and Karnataka.',
      },
    ],
    'Gujarat': [
      {
        q: 'What is the stamp duty for incorporating a company in Gujarat?',
        a: 'Gujarat levies stamp duty on MOA and AOA. The MOA stamp duty is ₹500 for authorised capital up to ₹1 Lakh, and escalates in slabs. Being a business-friendly state, Gujarat has an efficient ROC office (Ahmedabad) that typically processes incorporation forms quickly.',
      },
      {
        q: 'Does Gujarat have Professional Tax for company employees?',
        a: 'Yes. Gujarat levies Professional Tax on employees\' salaries. A Gujarat-incorporated company must obtain PT Registration and deduct PT monthly from employee salaries as per the applicable slabs.',
      },
    ],
  },

  'trade-license': {
    'Maharashtra': [
      {
        q: 'What is a Gumasta Licence in Maharashtra?',
        a: 'The Gumasta Licence is a registration under the Maharashtra Shops and Establishments Act, 2017. It is required for any commercial establishment in Maharashtra, including shops, offices, restaurants, and factories. It must be obtained from the local municipal authority within 60 days of commencing business.',
      },
      {
        q: 'Who issues Trade Licences in Mumbai?',
        a: 'In Mumbai, the Brihanmumbai Municipal Corporation (BMC) issues Trade Licences and Health Licences. In Pune it is PMC, in Thane it is TMC, and so on. Each municipal corporation has its own fee structure, application portal and process.',
      },
      {
        q: 'What is the validity of a Gumasta Licence in Maharashtra?',
        a: 'A Gumasta Licence under the new Maharashtra Shops Act (2017) is valid for 10 years and requires renewal thereafter. This is a significant improvement from the old annual renewal requirement.',
      },
    ],
    'Karnataka': [
      {
        q: 'Who issues Trade Licences for Bangalore establishments?',
        a: 'In Bangalore, Trade Licences are issued by the BBMP (Bruhat Bengaluru Mahanagara Palike) for establishments within the BBMP jurisdiction. For establishments outside BBMP (e.g., in BIAAPA or BMRDA zones), the respective local authority issues the licence.',
      },
      {
        q: 'What is the Shops and Establishments registration in Karnataka?',
        a: 'Under the Karnataka Shops and Commercial Establishments Act, 1961, all shops and commercial establishments must register with the Labour Department. This registration is separate from the BBMP Trade Licence and must be obtained within 30 days of starting business.',
      },
    ],
    'Delhi (NCT)': [
      {
        q: 'Who issues Trade Licences in Delhi?',
        a: 'In Delhi, Trade Licences are issued by the Municipal Corporation of Delhi (MCD) for most areas. NDMC issues licences for New Delhi Municipal Council areas, and Delhi Cantonment Board covers its area. The licence is mandatory for shops, commercial establishments and food businesses.',
      },
      {
        q: 'What is the validity of a Delhi Trade Licence?',
        a: 'Delhi Trade Licences are valid for one financial year and must be renewed annually before 31st March. Late renewal attracts a penalty.',
      },
    ],
    'Tamil Nadu': [
      {
        q: 'Who issues Trade Licences in Tamil Nadu?',
        a: 'In Chennai, the Greater Chennai Corporation (GCC) issues Trade Licences. For other cities and towns, the respective Municipal Corporation, Municipality or Town Panchayat issues the licence. The process is now partially online through the Tamil Nadu Business Facilitation Portal.',
      },
    ],
    'Gujarat': [
      {
        q: 'Who issues Trade Licences in Gujarat?',
        a: 'In Ahmedabad, the Ahmedabad Municipal Corporation (AMC) issues Trade and Health Licences. In Surat it is SMC, in Vadodara it is VMC. Gujarat has a relatively streamlined licensing process with online applications available for most municipalities.',
      },
    ],
    'West Bengal': [
      {
        q: 'Who issues Trade Licences in Kolkata?',
        a: 'In Kolkata, Trade Licences are issued by the Kolkata Municipal Corporation (KMC). For areas under other municipalities in West Bengal, the respective ULB (Urban Local Body) issues the licence. The KMC Trade Licence must be renewed annually.',
      },
    ],
  },

  'itr-1-filing': {
    'Maharashtra': [
      {
        q: 'Are there any Maharashtra-specific deductions available in ITR-1?',
        a: 'While ITR-1 is governed by central income tax law, Maharashtra residents who own property in the state may claim house property deductions. Additionally, if you have paid Professional Tax (up to ₹2,500/year) in Maharashtra, it is deductible under Section 16(iii).',
      },
      {
        q: 'Can I claim Mumbai rent as HRA while filing ITR-1 from Maharashtra?',
        a: 'Yes. HRA exemption is available if you live in rented accommodation in Mumbai or any other city. Metro cities (Mumbai, Delhi, Chennai, Kolkata) get 50% of basic salary as the HRA exemption ceiling, whereas non-metro cities get 40%. If you pay rent in Mumbai, the 50% metro rate applies.',
      },
    ],
    'Delhi (NCT)': [
      {
        q: 'Are Delhi salaried employees exempt from any state-level taxes when filing ITR-1?',
        a: 'Yes. Delhi does not have Professional Tax. Salaried employees in Delhi do not have any PT deduction, which means slightly higher take-home compared to PT-applicable states. There is no state-specific deduction in ITR-1 itself, as it is a central tax return.',
      },
    ],
  },

  'llp': {
    'Maharashtra': [
      {
        q: 'What is the stamp duty for an LLP Agreement in Maharashtra?',
        a: 'The LLP Agreement in Maharashtra attracts stamp duty at the rate of ₹1,000 for total capital contribution up to ₹1 Lakh, and 0.5% of the capital above ₹1 Lakh (subject to maximum as per Maharashtra Stamp Act). This is one of the higher stamp duties in India, making Maharashtra more expensive than Delhi or Rajasthan for LLP registration.',
      },
      {
        q: 'Does an LLP in Maharashtra need Professional Tax registration?',
        a: 'In Maharashtra, LLPs are exempt from PTEC (the entity itself does not pay PT). However, if the LLP has employees, it must obtain PTRC and deduct Professional Tax from employee salaries.',
      },
    ],
    'Delhi (NCT)': [
      {
        q: 'What is the stamp duty for an LLP Agreement in Delhi?',
        a: 'Delhi has a flat stamp duty of ₹500 on LLP Agreements, regardless of capital contribution. This makes Delhi one of the most cost-effective states for LLP registration, significantly cheaper than Maharashtra or Karnataka.',
      },
    ],
    'Karnataka': [
      {
        q: 'What is the stamp duty for LLP registration in Karnataka?',
        a: 'Under the Karnataka Stamp Act, LLP Agreements are stamped at ₹1,000 for capital up to ₹1 Lakh, with additional duty for higher capital contributions. Karnataka also requires the LLP to register under the Shops & Establishments Act within 30 days of commencing business.',
      },
    ],
  },

  'tds-return-filing': {
    'Maharashtra': [
      {
        q: 'Is there any state-level TDS in Maharashtra beyond the standard Income Tax TDS?',
        a: 'No. TDS under the Income Tax Act is a central levy and applies uniformly across all states. However, Maharashtra has its own state-level tax on specific transactions (like TDS on rent under Maharashtra Rent Control and stamp duty for property registrations) separate from Income Tax TDS.',
      },
      {
        q: 'What is the TDS rate on rent for properties in Mumbai or Pune?',
        a: 'TDS under Section 194I on rent for land, building, furniture and fittings is 10% (if annual rent exceeds ₹2,40,000). This applies uniformly across all states including Maharashtra. Additionally, for rent paid to NRIs for Mumbai/Pune properties, TDS under Section 195 applies at higher rates.',
      },
    ],
    'Delhi (NCT)': [
      {
        q: 'Is the TDS rate on property transactions in Delhi different from other states?',
        a: 'No. TDS under Section 194IA on purchase of immovable property (above ₹50 Lakhs) is 1% of the consideration — this rate is uniform across all states including Delhi. However, stamp duty rates for property registration in Delhi are state-governed and separate from TDS.',
      },
    ],
  },
};

// ─── State-specific package pricing ──────────────────────────────────────────

export type StatePackages = Record<string, Partial<Record<IndianState, ServicePackage[]>>>;

export const STATE_PACKAGES: StatePackages = {

  'gst-registration': {
    'Maharashtra': [
      { name: 'Standard', price: '₹1,299', description: 'GST Registration + GSTIN certificate. Includes PTEC/PTRC guidance.' },
      { name: 'Professional', price: '₹2,999', description: 'GST Registration + 3 months GSTR-3B filing + PTEC/PTRC registration.' },
      { name: 'Complete', price: '₹5,499', description: 'GST + PTEC/PTRC + Gumasta Licence + 6 months GSTR filing. All-in-one compliance.' },
    ],
    'Karnataka': [
      { name: 'Standard', price: '₹1,299', description: 'GST Registration + GSTIN certificate. Includes Shop & Establishment guidance.' },
      { name: 'Professional', price: '₹2,999', description: 'GST Registration + 3 months GSTR-3B filing + PT registration.' },
      { name: 'Complete', price: '₹5,499', description: 'GST + PT + Shops Act + BBMP Trade Licence + 6 months GSTR filing.' },
    ],
    'Delhi (NCT)': [
      { name: 'Standard', price: '₹999', description: 'GST Registration + GSTIN certificate. No PT required in Delhi.' },
      { name: 'Professional', price: '₹2,499', description: 'GST Registration + 3 months GSTR-3B filing.' },
      { name: 'Complete', price: '₹4,499', description: 'GST + Shop & Establishment Registration + 6 months GSTR filing.' },
    ],
    'Gujarat': [
      { name: 'Standard', price: '₹1,199', description: 'GST Registration + GSTIN certificate.' },
      { name: 'Professional', price: '₹2,699', description: 'GST Registration + 3 months GSTR filing + PT registration.' },
      { name: 'Complete', price: '₹4,999', description: 'GST + PT + Trade Licence + 6 months GSTR filing.' },
    ],
    'Tamil Nadu': [
      { name: 'Standard', price: '₹1,199', description: 'GST Registration + GSTIN certificate.' },
      { name: 'Professional', price: '₹2,699', description: 'GST Registration + 3 months GSTR filing + PT registration.' },
      { name: 'Complete', price: '₹5,199', description: 'GST + PT + GCC Trade Licence + 6 months GSTR filing.' },
    ],
    'Arunachal Pradesh': [
      { name: 'Standard', price: '₹899', description: 'GST Registration + GSTIN certificate. NE state — ₹10L threshold applies.' },
      { name: 'Professional', price: '₹1,999', description: 'GST Registration + 3 months GSTR-3B filing.' },
    ],
    'Manipur': [
      { name: 'Standard', price: '₹899', description: 'GST Registration + GSTIN certificate. NE state — ₹10L threshold applies.' },
      { name: 'Professional', price: '₹1,999', description: 'GST Registration + 3 months GSTR-3B filing.' },
    ],
    'Mizoram': [
      { name: 'Standard', price: '₹899', description: 'GST Registration + GSTIN certificate. NE state — ₹10L threshold applies.' },
      { name: 'Professional', price: '₹1,999', description: 'GST Registration + 3 months GSTR-3B filing.' },
    ],
    'Nagaland': [
      { name: 'Standard', price: '₹899', description: 'GST Registration + GSTIN certificate. NE state — ₹10L threshold applies.' },
      { name: 'Professional', price: '₹1,999', description: 'GST Registration + 3 months GSTR-3B filing.' },
    ],
    'Sikkim': [
      { name: 'Standard', price: '₹899', description: 'GST Registration + GSTIN certificate. Hilly state — ₹10L threshold applies.' },
      { name: 'Professional', price: '₹1,999', description: 'GST Registration + 3 months GSTR-3B filing.' },
    ],
    'Himachal Pradesh': [
      { name: 'Standard', price: '₹999', description: 'GST Registration + GSTIN certificate. Hilly state — ₹10L threshold applies.' },
      { name: 'Professional', price: '₹2,199', description: 'GST Registration + 3 months GSTR filing.' },
      { name: 'Complete', price: '₹3,999', description: 'GST + Trade Licence + 6 months GSTR filing.' },
    ],
    'Uttarakhand': [
      { name: 'Standard', price: '₹999', description: 'GST Registration + GSTIN certificate. Hilly state — ₹10L threshold applies.' },
      { name: 'Professional', price: '₹2,199', description: 'GST Registration + 3 months GSTR filing.' },
      { name: 'Complete', price: '₹3,999', description: 'GST + Trade Licence + 6 months GSTR filing.' },
    ],
    'West Bengal': [
      { name: 'Standard', price: '₹1,199', description: 'GST Registration + GSTIN certificate.' },
      { name: 'Professional', price: '₹2,699', description: 'GST Registration + 3 months GSTR filing + PT registration.' },
      { name: 'Complete', price: '₹4,999', description: 'GST + PT + KMC Trade Licence + 6 months GSTR filing.' },
    ],
    'Rajasthan': [
      { name: 'Standard', price: '₹999', description: 'GST Registration + GSTIN certificate. No PT in Rajasthan.' },
      { name: 'Professional', price: '₹2,299', description: 'GST Registration + 3 months GSTR-3B filing.' },
      { name: 'Complete', price: '₹4,299', description: 'GST + Trade Licence + 6 months GSTR filing.' },
    ],
    'Uttar Pradesh': [
      { name: 'Standard', price: '₹999', description: 'GST Registration + GSTIN certificate. No PT in UP.' },
      { name: 'Professional', price: '₹2,299', description: 'GST Registration + 3 months GSTR-3B filing.' },
      { name: 'Complete', price: '₹4,299', description: 'GST + Shop Act Registration + 6 months GSTR filing.' },
    ],
    'Goa': [
      { name: 'Standard', price: '₹999', description: 'GST Registration + GSTIN certificate.' },
      { name: 'Professional', price: '₹2,499', description: 'GST Registration + 3 months GSTR filing.' },
      { name: 'Complete', price: '₹4,499', description: 'GST + Trade Licence + 6 months GSTR filing.' },
    ],
  },

  'professional-tax-registration': {
    'Maharashtra': [
      { name: 'PTEC Only', price: '₹1,499', description: 'Professional Tax Enrolment Certificate (PTEC) for the business entity. Includes annual PT payment setup.' },
      { name: 'PTRC Only', price: '₹1,499', description: 'Professional Tax Registration Certificate (PTRC) for employer deducting PT from employees.' },
      { name: 'PTEC + PTRC', price: '₹2,499', description: 'Both PTEC and PTRC registration — required by most Maharashtra businesses. Includes 1 year of PT return filing.' },
    ],
    'Karnataka': [
      { name: 'PT Registration', price: '₹1,299', description: 'Professional Tax Registration in Karnataka (PTRC equivalent). Includes first half-yearly return filing.' },
      { name: 'PT Registration + 1 Year Compliance', price: '₹2,299', description: 'PT Registration + both half-yearly return filings for the first year.' },
    ],
    'West Bengal': [
      { name: 'PT Registration', price: '₹1,299', description: 'Professional Tax Registration in West Bengal. Includes annual return filing for year 1.' },
      { name: 'PT Registration + 1 Year Compliance', price: '₹2,199', description: 'PT Registration + annual return filing + monthly challan support for 1 year.' },
    ],
    'Tamil Nadu': [
      { name: 'PT Registration', price: '₹1,199', description: 'Professional Tax Registration for Tamil Nadu. Includes 1st half-yearly return.' },
      { name: 'PT + Annual Compliance', price: '₹2,199', description: 'PT Registration + 2 half-yearly returns (full year).' },
    ],
    'Gujarat': [
      { name: 'PT Registration', price: '₹1,199', description: 'Professional Tax Registration in Gujarat.' },
      { name: 'PT + Annual Compliance', price: '₹2,199', description: 'PT Registration + 12 monthly return filings.' },
    ],
    'Delhi (NCT)': [
      { name: 'Not Applicable', price: 'N/A', description: 'Professional Tax is NOT levied in Delhi. No PT registration is required for Delhi businesses or employees.' },
    ],
    'Haryana': [
      { name: 'Not Applicable', price: 'N/A', description: 'Professional Tax is NOT levied in Haryana. No PT registration is required.' },
    ],
    'Rajasthan': [
      { name: 'Not Applicable', price: 'N/A', description: 'Professional Tax is NOT levied in Rajasthan. No PT registration is required.' },
    ],
    'Uttar Pradesh': [
      { name: 'Not Applicable', price: 'N/A', description: 'Professional Tax is NOT levied in Uttar Pradesh. No PT registration is required.' },
    ],
    'Punjab': [
      { name: 'Not Applicable', price: 'N/A', description: 'Professional Tax is NOT levied in Punjab. No PT registration is required.' },
    ],
    'Bihar': [
      { name: 'Not Applicable', price: 'N/A', description: 'Professional Tax is NOT levied in Bihar. No PT registration is required.' },
    ],
  },

  'private-limited-company': {
    'Maharashtra': [
      { name: 'Standard', price: '₹7,999', description: 'Incorporation + DSC + DIN + SPICe+ + MOA/AOA. Includes Maharashtra stamp duty on MOA/AOA (₹5L authorised capital).' },
      { name: 'Complete', price: '₹12,999', description: 'Standard + GST Registration + PTEC/PTRC + Gumasta Licence. All mandatory Maharashtra registrations.' },
      { name: 'Premium', price: '₹19,999', description: 'Complete + Trademark + 1 year annual compliance filing + dedicated CA support.' },
    ],
    'Karnataka': [
      { name: 'Standard', price: '₹7,499', description: 'Incorporation + DSC + DIN + SPICe+ + MOA/AOA. Includes Karnataka e-stamp duty.' },
      { name: 'Complete', price: '₹12,499', description: 'Standard + GST Registration + PT Registration + Shops Act + BBMP licence guidance.' },
      { name: 'Premium', price: '₹18,999', description: 'Complete + Trademark + 1 year annual compliance.' },
    ],
    'Delhi (NCT)': [
      { name: 'Standard', price: '₹5,999', description: 'Incorporation + DSC + DIN + SPICe+ + MOA/AOA. Low Delhi stamp duty. No PT.' },
      { name: 'Complete', price: '₹9,999', description: 'Standard + GST Registration + Shop & Establishment Registration. All mandatory Delhi registrations.' },
      { name: 'Premium', price: '₹16,499', description: 'Complete + Trademark + 1 year annual compliance.' },
    ],
    'Gujarat': [
      { name: 'Standard', price: '₹6,499', description: 'Incorporation + DSC + DIN + SPICe+ + MOA/AOA. Includes Gujarat stamp duty.' },
      { name: 'Complete', price: '₹10,999', description: 'Standard + GST + PT Registration + Trade Licence.' },
      { name: 'Premium', price: '₹17,499', description: 'Complete + Trademark + 1 year annual compliance.' },
    ],
    'Rajasthan': [
      { name: 'Standard', price: '₹5,799', description: 'Incorporation + DSC + DIN + SPICe+. Low Rajasthan stamp duty. No PT.' },
      { name: 'Complete', price: '₹9,499', description: 'Standard + GST + Shop Act Registration + Trade Licence.' },
      { name: 'Premium', price: '₹15,999', description: 'Complete + Trademark + 1 year annual compliance.' },
    ],
    'Tamil Nadu': [
      { name: 'Standard', price: '₹6,999', description: 'Incorporation + DSC + DIN + SPICe+. Includes Tamil Nadu stamp duty.' },
      { name: 'Complete', price: '₹11,999', description: 'Standard + GST + PT + GCC Trade Licence.' },
      { name: 'Premium', price: '₹18,499', description: 'Complete + Trademark + 1 year annual compliance.' },
    ],
    'Uttar Pradesh': [
      { name: 'Standard', price: '₹5,799', description: 'Incorporation + DSC + DIN + SPICe+. Low UP stamp duty. No PT.' },
      { name: 'Complete', price: '₹9,499', description: 'Standard + GST + Shop Act Registration.' },
      { name: 'Premium', price: '₹15,999', description: 'Complete + Trademark + 1 year annual compliance.' },
    ],
  },

  'llp': {
    'Maharashtra': [
      { name: 'Standard', price: '₹6,999', description: 'LLP incorporation + LLP Agreement (with Maharashtra stamp duty on agreement) + DPIN + DSC.' },
      { name: 'Complete', price: '₹10,999', description: 'Standard + GST Registration + PTRC (if employing staff) + 1 year Form 8 & 11 filing.' },
    ],
    'Delhi (NCT)': [
      { name: 'Standard', price: '₹4,999', description: 'LLP incorporation + LLP Agreement (flat ₹500 Delhi stamp duty) + DPIN + DSC.' },
      { name: 'Complete', price: '₹8,499', description: 'Standard + GST Registration + 1 year Form 8 & 11 filing.' },
    ],
    'Karnataka': [
      { name: 'Standard', price: '₹6,499', description: 'LLP incorporation + LLP Agreement (Karnataka e-stamp) + DPIN + DSC.' },
      { name: 'Complete', price: '₹10,499', description: 'Standard + GST + PT Registration + 1 year Form 8 & 11 filing.' },
    ],
    'Gujarat': [
      { name: 'Standard', price: '₹5,499', description: 'LLP incorporation + LLP Agreement + DPIN + DSC.' },
      { name: 'Complete', price: '₹9,499', description: 'Standard + GST + PT Registration + 1 year Form 8 & 11 filing.' },
    ],
    'Rajasthan': [
      { name: 'Standard', price: '₹4,799', description: 'LLP incorporation + LLP Agreement (low Rajasthan stamp duty) + DPIN + DSC.' },
      { name: 'Complete', price: '₹8,299', description: 'Standard + GST Registration + 1 year Form 8 & 11 filing.' },
    ],
  },

  'trade-license': {
    'Maharashtra': [
      { name: 'Gumasta Licence (Mumbai/MMR)', price: '₹2,999', description: 'Shops & Establishments registration under Maharashtra Shops Act. Covers Mumbai/MMR. Valid for 10 years.' },
      { name: 'Gumasta Licence (Pune)', price: '₹2,499', description: 'Shops Act registration for Pune (PMC area). Valid for 10 years.' },
      { name: 'Gumasta + Health Licence', price: '₹4,999', description: 'Shops Act + BMC/PMC Health Licence. Required for restaurants, food businesses.' },
    ],
    'Karnataka': [
      { name: 'Shops Act Registration', price: '₹1,999', description: 'Karnataka Shops & Commercial Establishments Act registration. Valid 5 years.' },
      { name: 'BBMP Trade Licence (Bangalore)', price: '₹2,999', description: 'BBMP Trade Licence for Bangalore city. Annual renewal required.' },
      { name: 'Shops Act + BBMP Trade Licence', price: '₹4,499', description: 'Both registrations for Bangalore businesses.' },
    ],
    'Delhi (NCT)': [
      { name: 'MCD Trade Licence', price: '₹2,499', description: 'Municipal Corporation of Delhi Trade Licence. Annual renewal required.' },
      { name: 'Shop & Establishment', price: '₹1,499', description: 'Delhi Shops and Establishments Act registration (Labour Dept.).' },
      { name: 'MCD + Shop Act', price: '₹3,499', description: 'Both MCD Trade Licence + Shop & Establishment registration.' },
    ],
    'Tamil Nadu': [
      { name: 'GCC Trade Licence (Chennai)', price: '₹2,499', description: 'Greater Chennai Corporation Trade Licence. Annual renewal.' },
      { name: 'Shops Act Registration', price: '₹1,499', description: 'Tamil Nadu Shops and Establishments Act registration.' },
      { name: 'Trade Licence + Shops Act', price: '₹3,499', description: 'Both registrations for Chennai businesses.' },
    ],
    'Gujarat': [
      { name: 'AMC Trade Licence (Ahmedabad)', price: '₹2,299', description: 'Ahmedabad Municipal Corporation Trade Licence. Annual renewal.' },
      { name: 'Shops Act Registration', price: '₹1,499', description: 'Gujarat Shops and Establishments Act registration.' },
      { name: 'Trade Licence + Shops Act', price: '₹3,299', description: 'Both registrations for Ahmedabad/Surat/Vadodara businesses.' },
    ],
    'West Bengal': [
      { name: 'KMC Trade Licence (Kolkata)', price: '₹2,499', description: 'Kolkata Municipal Corporation Trade Licence. Annual renewal.' },
      { name: 'Shops Act Registration', price: '₹1,499', description: 'West Bengal Shops and Establishments Act registration.' },
      { name: 'KMC + Shops Act', price: '₹3,499', description: 'Both registrations for Kolkata businesses.' },
    ],
    'Rajasthan': [
      { name: 'Municipal Trade Licence', price: '₹1,999', description: 'Trade Licence from local municipal body (Jaipur/Jodhpur/Udaipur municipal corporation).' },
      { name: 'Shops Act Registration', price: '₹1,299', description: 'Rajasthan Shops and Commercial Establishments Act registration.' },
      { name: 'Trade Licence + Shops Act', price: '₹2,999', description: 'Both registrations.' },
    ],
    'Uttar Pradesh': [
      { name: 'Municipal Trade Licence', price: '₹1,999', description: 'Trade Licence from Nagar Nigam/Nagar Palika (Lucknow/Noida/Agra/Varanasi).' },
      { name: 'Shops Act Registration', price: '₹1,299', description: 'UP Shops and Commercial Establishments Act registration.' },
      { name: 'Trade Licence + Shops Act', price: '₹2,999', description: 'Both registrations.' },
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

type ServiceStateFaqs = {
  mode: 'all-states' | 'per-state';
  allStateFaqs: FAQ[];
  perStateFaqs: Record<string, FAQ[]>;
};

type StateFaqConfig = Record<string, ServiceStateFaqs> & {
  mode?: string;
  globalFaqs?: Record<string, FAQ[]>;
  serviceFaqs?: Record<string, Record<string, FAQ[]>>;
};

export function getStateFAQs(
  serviceId: string,
  state: IndianState | '',
  contentConfig?: StateFaqConfig,
): FAQ[] {
  if (!state) return [];
  if (contentConfig) {
    const svcConfig = contentConfig[serviceId] as ServiceStateFaqs | undefined;
    if (svcConfig) {
      if (svcConfig.mode === 'all-states' && svcConfig.allStateFaqs?.length) {
        return svcConfig.allStateFaqs;
      }
      if (svcConfig.mode === 'per-state') {
        const fromState = svcConfig.perStateFaqs?.[state];
        if (fromState) return fromState;
      }
    }
    // Legacy format fallback
    if (contentConfig.serviceFaqs) {
      const fromContent = contentConfig.serviceFaqs[serviceId]?.[state];
      if (fromContent) return fromContent;
    }
  }
  return STATE_FAQS[serviceId]?.[state as IndianState] ?? [];
}

export function getStatePackages(
  serviceId: string,
  state: IndianState | '',
  contentPackages?: Record<string, Record<string, ServicePackage[]>>,
): ServicePackage[] | null {
  if (!state) return null;
  if (contentPackages) {
    const fromContent = contentPackages[serviceId]?.[state];
    if (fromContent) return fromContent;
  }
  return STATE_PACKAGES[serviceId]?.[state as IndianState] ?? null;
}
