/**
 * Seed "How It Works" steps into service records in content.json
 * Run: node scripts/seed-service-steps.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentPath = join(__dirname, '../data/content.json');
const content = JSON.parse(readFileSync(contentPath, 'utf8'));

// ── Per-service steps ───────────────────────────────────────────────────────
const BY_ID = {
  'gst-registration': [
    'Complete application preparation',
    'Instant TRN (Temporary Reference Number) generation',
    'ARN (Application Reference Number) generation',
    'GST Certificate delivery',
  ],
  'professional-tax-registration': [
    'PT applicability check for your state',
    'PT registration application filing',
    'Challan setup & payment guidance',
    'PT certificate delivery',
  ],
  'tan-registration': [
    'TAN application preparation (Form 49B)',
    'NSDL portal submission',
    'TAN allotment tracking',
    'TAN number delivery with usage guide',
  ],
  'pf-registration': [
    'PF applicability assessment',
    'EPFO employer registration filing',
    'Employee UAN generation & onboarding',
    'PF code delivery with compliance guide',
  ],
  'esi-registration': [
    'ESI applicability check',
    'ESIC employer registration filing',
    'Employee IP (Insurance Number) generation',
    'ESI code delivery with compliance calendar',
  ],
  'import-export-code': [
    'Document checklist & preparation',
    'DGFT portal IEC application filing',
    'Application tracking & follow-up',
    'IEC certificate delivery',
  ],
  'fssai-registration': [
    'License category determination (Basic/State/Central)',
    'FSSAI application preparation & filing',
    'Government portal follow-up',
    'FSSAI certificate & FoSCoS ID delivery',
  ],
  'trade-license': [
    'Requirement check for your business type',
    'Municipal/local body application preparation',
    'Document submission & follow-up',
    'Trade License delivery',
  ],
  'digital-signature': [
    'DSC application & video KYC',
    'Identity & address verification',
    'USB token dispatch & tracking',
    'DSC activation & installation guidance',
  ],
  'health-license': [
    'Health license applicability assessment',
    'Application preparation & documentation',
    'Filing with local health authority',
    'License certificate delivery',
  ],
  'proprietorship': [
    'Business name & structure advisory',
    'Udyam (MSME) registration',
    'GST registration (if required)',
    'Business setup & compliance guide',
  ],
  'partnership': [
    'Partnership deed drafting & review',
    'Deed notarisation guidance',
    'Firm PAN application',
    'Firm registration & bank account guide',
  ],
  'one-person-company': [
    'DSC & DIN for director',
    'Name reservation on MCA portal',
    'SPICe+ filing & Certificate of Incorporation',
    'PAN/TAN & bank account opening support',
  ],
  'llp': [
    'DSC & DPIN for partners',
    'LLP name reservation on MCA',
    'FiLLiP form filing & Certificate of Incorporation',
    'LLP Agreement (Form 3) filing & PAN/TAN',
  ],
  'private-limited-company': [
    'Name availability check on MCA',
    'DSC & DIN for all directors',
    'SPICe+ form filing & name approval',
    'Certificate of Incorporation + PAN/TAN',
  ],
  'public-limited-company': [
    'DSC & DIN for directors',
    'Name approval via SPICe+',
    'MOA, AOA drafting & CIN allotment',
    'Commencement of Business filing',
  ],
  'trademark-registration': [
    'Trademark search & class selection',
    'Application filing with Trade Marks Registry',
    'Objection / opposition response if needed',
    'Registration certificate delivery',
  ],
  'copyright-registration': [
    'Work identification & category selection',
    'Copyright application preparation',
    'Filing on Copyright Office portal',
    'Diary number & registration certificate',
  ],
  'patent-registration': [
    'Patentability search & prior art review',
    'Provisional/complete application drafting',
    'IPO portal filing & acknowledgement',
    'Examination request & prosecution support',
  ],
  'itr-filing': [
    'Document & income data collection',
    'Income computation & ITR form selection',
    'ITR filing on Income Tax portal',
    'ITR-V acknowledgement & e-verification',
  ],
  'tds-return-filing': [
    'TDS data & challan compilation',
    'FVU file preparation & validation',
    'TRACES portal return filing',
    'Form 16/16A generation & distribution',
  ],
  'gst-return-filing': [
    'Sales & purchase data compilation',
    'GSTR-1 & GSTR-3B preparation',
    'GST portal filing & tax payment',
    'Acknowledgement & ITC reconciliation',
  ],
};

// ── Per-category fallbacks ──────────────────────────────────────────────────
const BY_CATEGORY = {
  'registration': [
    'Requirement check & document collection',
    'Application preparation & filing',
    'Government portal tracking & follow-up',
    'Registration certificate delivery',
  ],
  'new-business': [
    'Structure & name advisory',
    'Document preparation & DSC/DIN',
    'MCA/ROC filing & name approval',
    'Certificate of Incorporation + PAN/TAN',
  ],
  'gst-services': [
    'Document checklist shared',
    'Data validation & preparation',
    'GST portal filing & submission',
    'Acknowledgement & follow-up',
  ],
  'trademark-ip': [
    'Search & class selection',
    'Application filing with registry',
    'Objection handling (if any)',
    'Registration tracking & certificate',
  ],
  'international-incorporations': [
    'Structure & jurisdiction advisory',
    'Name reservation & incorporation filing',
    'Bank account / EIN / tax registrations',
    'Compliance handover & post-setup guide',
  ],
  'hr-compliance': [
    'Applicability assessment',
    'Registration application setup',
    'Employee mapping & onboarding',
    'Ongoing compliance support',
  ],
  'return-filing': [
    'Document & data collection',
    'Computation & verification',
    'Filing on income tax / GST portal',
    'Acknowledgement & ITR-V / ARN delivery',
  ],
  'income-tax': [
    'Income & TDS data collection',
    'Tax computation & form selection',
    'Portal filing & payment',
    'Acknowledgement & ITR-V',
  ],
  'ngo-registrations': [
    'Trust deed / MOA drafting',
    'Registration with Sub-Registrar / ROC',
    '12A & 80G application filing',
    'Registration certificate delivery',
  ],
  'legal-compliance': [
    'Requirement discussion & advisory',
    'Document & form preparation',
    'Filing with appropriate authority',
    'Follow-up until completion',
  ],
  'liquor-licenses': [
    'License type & eligibility check',
    'Application & documents preparation',
    'State excise authority submission',
    'License certificate delivery',
  ],
  'mandatory-licenses': [
    'Applicability & requirement assessment',
    'Application preparation & filing',
    'Government follow-up & tracking',
    'License / certificate delivery',
  ],
};

const DEFAULT_STEPS = [
  'Consultation & requirement capture',
  'Document checklist & collection',
  'Application filing with authority',
  'Follow-ups until completion',
];

function stepsFor(service) {
  if (BY_ID[service.id]) return BY_ID[service.id];
  if (BY_CATEGORY[service.categoryId]) return BY_CATEGORY[service.categoryId];
  return DEFAULT_STEPS;
}

let seeded = 0;
for (const service of content.services) {
  if (!service.steps || service.steps.length === 0) {
    service.steps = stepsFor(service);
    seeded++;
  }
}

writeFileSync(contentPath, JSON.stringify(content, null, 2), 'utf8');
console.log(`Done. Seeded steps for ${seeded} services.`);
