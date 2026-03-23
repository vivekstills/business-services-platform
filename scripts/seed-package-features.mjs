/**
 * Seed "What's included" features into service packages in content.json
 * Run: node scripts/seed-package-features.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentPath = join(__dirname, '../data/content.json');
const content = JSON.parse(readFileSync(contentPath, 'utf8'));

// ── Feature definitions by service ID ──────────────────────────────────────
const SERVICE_FEATURES = {
  'gst-registration': {
    Standard: ['GST application preparation & filing', 'GSTIN (GST Number) delivery', 'ARN generation', 'GST certificate on approval', 'Email & phone support'],
    Deluxe:   ['Everything in Standard', 'TRN (Temporary Reference Number) assistance', 'Business activity & HSN/SAC code advisory', 'Government portal follow-up', 'Priority support'],
    Premium:  ['Everything in Deluxe', 'GST impact analysis for your business', 'GST filing advisory (3 months)', 'Dedicated CA support', 'Compliance calendar setup'],
  },
  'professional-tax-registration': {
    Standard: ['PT applicability check', 'Registration application filing', 'PT certificate delivery', 'Email support'],
    Deluxe:   ['Everything in Standard', 'State-specific rate advisory', 'Employee slab mapping', 'Priority email & phone support'],
    Premium:  ['Everything in Deluxe', 'Monthly PT return filing (3 months)', 'Payroll PT deduction advisory', 'Dedicated CA support'],
  },
  'tan-registration': {
    Standard: ['TAN application preparation', 'NSDL portal filing', 'TAN number delivery', 'Email support'],
    Deluxe:   ['Everything in Standard', 'TDS applicability guidance', 'TAN activation & verification', 'Priority support'],
    Premium:  ['Everything in Deluxe', 'TDS rate advisory & calendar', 'First TDS return guidance', 'Dedicated CA support'],
  },
  'pf-registration': {
    Standard: ['PF applicability check', 'EPFO registration filing', 'PF code delivery', 'Basic compliance guidance'],
    Deluxe:   ['Everything in Standard', 'UAN generation for employees (up to 10)', 'Monthly ECR filing (1 month)', 'Priority support'],
    Premium:  ['Everything in Deluxe', 'UAN generation (unlimited)', 'Monthly ECR filing (3 months)', 'Dedicated HR compliance expert'],
  },
  'esi-registration': {
    Standard: ['ESI applicability check', 'ESIC registration filing', 'ESI code delivery', 'Basic compliance guidance'],
    Deluxe:   ['Everything in Standard', 'Employee mapping & IP generation (up to 10)', 'Monthly return filing (1 month)', 'Priority support'],
    Premium:  ['Everything in Deluxe', 'Employee mapping (unlimited)', 'Monthly returns (3 months)', 'Dedicated HR compliance expert'],
  },
  'import-export-code': {
    Standard: ['IEC application preparation', 'DGFT portal filing', 'IEC certificate delivery', 'Email support'],
    Deluxe:   ['Everything in Standard', 'Modification/update assistance', 'Import/export regime advisory', 'Priority support'],
    Premium:  ['Everything in Deluxe', 'AD code registration guidance', 'SEIS/FTP benefit advisory', 'Dedicated expert support'],
  },
  'fssai-registration': {
    Standard: ['FSSAI application preparation', 'State/Central license determination', 'FSSAI certificate delivery', 'Basic compliance guide'],
    Deluxe:   ['Everything in Standard', 'Food category advisory', 'Government portal follow-up', 'Priority support'],
    Premium:  ['Everything in Deluxe', 'FSSAI renewal advisory', 'Annual return guidance', 'Dedicated food compliance expert'],
  },
  'trade-license': {
    Standard: ['Trade license application preparation', 'Municipal/local body filing', 'License delivery on approval', 'Email support'],
    Deluxe:   ['Everything in Standard', 'Document checklist & verification', 'Government office follow-up', 'Priority support'],
    Premium:  ['Everything in Deluxe', 'Renewal reminder & assistance', 'Compliance calendar', 'Dedicated support'],
  },
  'digital-signature': {
    Standard: ['DSC application preparation', 'Video KYC assistance', 'Class 3 DSC token delivery (2-year validity)', 'Email support'],
    Deluxe:   ['Everything in Standard', 'USB token with DSC', 'Driver software installation guide', 'Priority support'],
    Premium:  ['Everything in Deluxe', 'Organisation DSC option', 'DGFT DSC (if required)', 'Dedicated support & renewal reminder'],
  },
  'health-license': {
    Standard: ['Health license application', 'Local authority filing', 'License certificate delivery', 'Email support'],
    Deluxe:   ['Everything in Standard', 'Document verification & checklist', 'Government follow-up', 'Priority support'],
    Premium:  ['Everything in Deluxe', 'Annual renewal assistance', 'Health & safety advisory', 'Dedicated expert support'],
  },
  'proprietorship': {
    Standard: ['Udyam/MSME registration', 'GST registration (optional)', 'Current account opening guide', 'Email support'],
    Deluxe:   ['Everything in Standard', 'Trade name advisory', 'Basic compliance calendar', 'Priority support'],
    Premium:  ['Everything in Deluxe', 'GST registration included', 'Business PAN advisory', 'Dedicated CA support'],
  },
  'partnership': {
    Standard: ['Partnership deed drafting', 'Deed notarisation guidance', 'PAN application for firm', 'Email support'],
    Deluxe:   ['Everything in Standard', 'Firm registration with Registrar', 'GST registration (optional)', 'Priority support'],
    Premium:  ['Everything in Deluxe', 'GST registration included', 'Bank account opening support', 'Dedicated CA support'],
  },
  'one-person-company': {
    Standard: ['DSC & DIN for director', 'Name reservation on MCA', 'SPICe+ filing', 'Certificate of Incorporation + PAN/TAN'],
    Deluxe:   ['Everything in Standard', 'Nominee agreement drafting', 'Bank account opening support', 'Priority CA support'],
    Premium:  ['Everything in Deluxe', 'GST registration', 'Accounting software setup', 'Dedicated CA for 1 year'],
  },
  'llp': {
    Standard: ['DSC & DPIN for partners', 'LLP name reservation', 'FiLLiP filing', 'Certificate of Incorporation + PAN/TAN'],
    Deluxe:   ['Everything in Standard', 'LLP agreement drafting & filing (Form 3)', 'Bank account opening support', 'Priority support'],
    Premium:  ['Everything in Deluxe', 'GST registration', 'Annual return filing (1 year)', 'Dedicated CA support'],
  },
  'private-limited-company': {
    Standard: ['DSC & DIN for 2 directors', 'Name approval via SPICe+', 'MOA & AOA drafting', 'Certificate of Incorporation + PAN/TAN'],
    Deluxe:   ['Everything in Standard', 'Commencement of business (INC-20A)', 'Bank account opening support', 'Priority CA support'],
    Premium:  ['Everything in Deluxe', 'GST registration', 'Accounting software setup', 'Dedicated CA for 1 year'],
  },
  'public-limited-company': {
    Standard: ['DSC & DIN for 3 directors', 'Name approval', 'MOA & AOA drafting', 'Certificate of Incorporation + PAN/TAN'],
    Deluxe:   ['Everything in Standard', 'Commencement of business filing', 'SEBI compliance advisory', 'Priority CA support'],
    Premium:  ['Everything in Deluxe', 'GST & other registrations', 'Secretarial compliance advisory', 'Dedicated CA & CS support'],
  },
  'nidhi-company': {
    Standard: ['DSC & DIN for directors', 'Name approval', 'MOA & AOA drafting', 'Certificate of Incorporation + PAN/TAN'],
    Deluxe:   ['Everything in Standard', 'Nidhi Company RBI compliances advisory', 'Bank account opening support', 'Priority support'],
    Premium:  ['Everything in Deluxe', 'NDH-1 annual return guidance', 'Compliance calendar', 'Dedicated CA support'],
  },
  'section-8-company': {
    Standard: ['DSC & DIN for directors', 'Name approval', 'MOA & AOA drafting', 'Section 8 licence application'],
    Deluxe:   ['Everything in Standard', 'Certificate of Incorporation', '12A/80G registration advisory', 'Priority support'],
    Premium:  ['Everything in Deluxe', '12A & 80G registration filing', 'FCRA advisory', 'Dedicated CA support'],
  },
  'trademark-registration': {
    Standard: ['Trademark search & class selection', 'TM application filing (1 class)', 'Application acknowledgement', 'Email support'],
    Deluxe:   ['Everything in Standard', 'Objection reply drafting (if required)', 'Trademark journal watch', 'Priority support'],
    Premium:  ['Everything in Deluxe', 'Opposition hearing assistance', 'Trademark registration certificate', 'Dedicated IP expert'],
  },
  'copyright-registration': {
    Standard: ['Copyright application preparation', 'Portal filing', 'Diary number on filing', 'Email support'],
    Deluxe:   ['Everything in Standard', 'Work description advisory', 'Government follow-up', 'Priority support'],
    Premium:  ['Everything in Deluxe', 'Registration certificate delivery', 'Copyright enforcement advisory', 'Dedicated IP expert'],
  },
  'patent-registration': {
    Standard: ['Patentability search', 'Provisional patent application', 'Filing acknowledgement', 'Email support'],
    Deluxe:   ['Everything in Standard', 'Complete specification filing', 'IPO examination advisory', 'Priority support'],
    Premium:  ['Everything in Deluxe', 'Patent prosecution support', 'Response to examination report', 'Dedicated patent attorney support'],
  },
  'gst-return-filing': {
    Standard: ['GSTR-1 filing (monthly/quarterly)', 'GSTR-3B filing', 'Tax liability computation', 'Email support'],
    Deluxe:   ['Everything in Standard', 'GSTR-2A/2B reconciliation', 'ITC mismatch resolution', 'Priority support'],
    Premium:  ['Everything in Deluxe', 'Annual GSTR-9 filing', 'GST audit support (GSTR-9C)', 'Dedicated GST expert'],
  },
  'gst-annual-return': {
    Standard: ['GSTR-9 filing', 'Annual turnover reconciliation', 'Tax liability summary', 'Email support'],
    Deluxe:   ['Everything in Standard', 'GSTR-9C (reconciliation statement)', 'ITC reconciliation', 'Priority support'],
    Premium:  ['Everything in Deluxe', 'GST audit support', 'Penalty mitigation advisory', 'Dedicated CA support'],
  },
  'itr-filing': {
    Standard: ['Income computation', 'ITR form selection & filing', 'ITR-V acknowledgement', 'Email support'],
    Deluxe:   ['Everything in Standard', 'Capital gains computation (basic)', 'Form 26AS reconciliation', 'Priority support'],
    Premium:  ['Everything in Deluxe', 'Tax optimisation advisory', 'Advance tax computation', 'Dedicated CA support'],
  },
  'tds-return-filing': {
    Standard: ['TDS data compilation', 'Form 24Q/26Q filing', 'Challan reconciliation', 'Email support'],
    Deluxe:   ['Everything in Standard', 'TDS certificate (Form 16/16A) generation', 'Lower deduction advisory', 'Priority support'],
    Premium:  ['Everything in Deluxe', 'TDS audit support', 'Demand & notice handling', 'Dedicated CA support'],
  },
};

// Fallback feature templates by package tier
const TIER_FEATURES = {
  Standard: [
    'Expert consultation & requirement capture',
    'Document checklist & preparation',
    'Application filing with relevant authority',
    'Status tracking & follow-up',
    'Email support',
  ],
  Deluxe: [
    'Everything in Standard',
    'Dedicated account manager',
    'Faster turnaround time',
    'Priority phone & email support',
    'Post-registration compliance guidance',
  ],
  Premium: [
    'Everything in Deluxe',
    'End-to-end expert handling',
    'Annual compliance advisory',
    'Dedicated CA/CS support',
    'On-call support for 90 days',
  ],
};

function getFeaturesForPackage(serviceId, pkgName) {
  const svcFeatures = SERVICE_FEATURES[serviceId];
  if (svcFeatures) {
    // Try exact match first, then contains match
    if (svcFeatures[pkgName]) return svcFeatures[pkgName];
    for (const [tier, feats] of Object.entries(svcFeatures)) {
      if (pkgName.toLowerCase().includes(tier.toLowerCase())) return feats;
    }
  }
  // Fallback by tier name
  for (const [tier, feats] of Object.entries(TIER_FEATURES)) {
    if (pkgName.toLowerCase().includes(tier.toLowerCase())) return feats;
  }
  return TIER_FEATURES.Standard;
}

// ── Apply features to all services ─────────────────────────────────────────
let updated = 0;
for (const service of content.services) {
  if (!service.packages) continue;
  for (const pkg of service.packages) {
    if (!pkg.features || pkg.features.length === 0) {
      pkg.features = getFeaturesForPackage(service.id, pkg.name);
      updated++;
    }
  }
}

writeFileSync(contentPath, JSON.stringify(content, null, 2), 'utf8');
console.log(`Done. Updated features for ${updated} packages across ${content.services.length} services.`);
