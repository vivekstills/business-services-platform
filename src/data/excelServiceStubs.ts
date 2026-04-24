import type { Service, ServicePackage } from './services';

const TIERED: ServicePackage[] = [
  {
    name: 'Standard',
    price: 'On request',
    description: 'Consultation, checklist and filing support sized to a typical case.',
  },
  {
    name: 'Priority',
    price: 'On request',
    description: 'Tighter timelines with daily status checkpoints.',
  },
  {
    name: 'Retainer',
    price: 'On request',
    description: 'Ongoing coordination for multi-step or recurring filings.',
  },
];

function body(name: string, head: string): string {
  return [
    `${name} — Overview`,
    `Our consultants support ${name} under ${head}, from applicability review through filings, department queries and final acknowledgement.`,
    `Applicability`,
    `This service is intended for clients who need structured, compliant handling with clear documentation and realistic timelines.`,
    `Benefits`,
    `Fewer rejections from incomplete paperwork, coordinated submissions, and a single point of contact for follow-ups.`,
    `Process`,
    `Requirement capture → document checklist → preparation and validation → submission to authority → tracking and query handling → closure.`,
    `Documents required`,
    `Entity KYC, address proof, category-specific forms and annexures. A tailored checklist is shared after the first consultation.`,
  ].join('\n\n');
}

function stub(p: {
  id: string;
  name: string;
  mainHead: string;
  categoryId: string;
  routeMainCategorySlug: string;
}): Service {
  return {
    id: p.id,
    name: p.name,
    mainHead: p.mainHead,
    categoryId: p.categoryId,
    routeMainCategorySlug: p.routeMainCategorySlug,
    shortDescription: `Expert assistance for ${p.name} — documentation, filings and follow-ups.`,
    content: body(p.name, p.mainHead),
    packages: TIERED,
    steps: ['Consultation & checklist', 'Document preparation', 'Filing / submission', 'Follow-up & closure'],
  };
}

/**
 * Services required for 100% Excel workbook coverage (not previously present in `SERVICES`).
 */
export const EXCEL_STUB_SERVICES: Service[] = [
  // FEMA
  stub({
    id: 'fc-gpr-filing',
    name: 'FC-GPR Filing',
    mainHead: 'FEMA COMPLIANCE',
    categoryId: 'fema-compliance',
    routeMainCategorySlug: 'fema-compliance',
  }),
  stub({
    id: 'odi-filing',
    name: 'ODI Filing',
    mainHead: 'FEMA COMPLIANCE',
    categoryId: 'fema-compliance',
    routeMainCategorySlug: 'fema-compliance',
  }),
  stub({
    id: 'fla-return-filing',
    name: 'FLA Return Filing',
    mainHead: 'FEMA COMPLIANCE',
    categoryId: 'fema-compliance',
    routeMainCategorySlug: 'fema-compliance',
  }),
  stub({
    id: 'fema-advisory',
    name: 'FEMA Advisory',
    mainHead: 'FEMA COMPLIANCE',
    categoryId: 'fema-compliance',
    routeMainCategorySlug: 'fema-compliance',
  }),

  // Food / FSSAI
  stub({
    id: 'fssai-renewal',
    name: 'FSSAI Renewal',
    mainHead: 'FOOD BUSINESS COMPLIANCE',
    categoryId: 'food-business-compliance',
    routeMainCategorySlug: 'food-business-compliance',
  }),
  stub({
    id: 'fssai-return-filing',
    name: 'FSSAI Return Filing',
    mainHead: 'FOOD BUSINESS COMPLIANCE',
    categoryId: 'food-business-compliance',
    routeMainCategorySlug: 'food-business-compliance',
  }),
  stub({
    id: 'fssai-modification',
    name: 'FSSAI Modification',
    mainHead: 'FOOD BUSINESS COMPLIANCE',
    categoryId: 'food-business-compliance',
    routeMainCategorySlug: 'food-business-compliance',
  }),

  // GST
  stub({
    id: 'composition-gst-registration',
    name: 'Composition GST Registration',
    mainHead: 'GST SERVICES',
    categoryId: 'gst-services',
    routeMainCategorySlug: 'goods-services-tax',
  }),
  stub({
    id: 'gst-nil-return-filing',
    name: 'GST Nil Return Filing',
    mainHead: 'GST SERVICES',
    categoryId: 'gst-services',
    routeMainCategorySlug: 'goods-services-tax',
  }),
  stub({
    id: 'gstr-10-final-return',
    name: 'GSTR 10 (Final Return)',
    mainHead: 'GST SERVICES',
    categoryId: 'gst-services',
    routeMainCategorySlug: 'goods-services-tax',
  }),

  // Income tax
  stub({
    id: 'tax-audit',
    name: 'Tax Audit',
    mainHead: 'INCOME TAX',
    categoryId: 'income-tax',
    routeMainCategorySlug: 'income-tax',
  }),

  // Import / export
  stub({
    id: 'icegate-registration',
    name: 'ICEGATE Registration',
    mainHead: 'IMPORT EXPORT',
    categoryId: 'import-export-business',
    routeMainCategorySlug: 'import-export-business',
  }),
  stub({
    id: 'iec-modification',
    name: 'IEC Modification',
    mainHead: 'IMPORT EXPORT',
    categoryId: 'import-export-business',
    routeMainCategorySlug: 'import-export-business',
  }),
  stub({
    id: 'rcmc-registration',
    name: 'RCMC Registration',
    mainHead: 'IMPORT EXPORT',
    categoryId: 'import-export-business',
    routeMainCategorySlug: 'import-export-business',
  }),

  // Legal compliance additions
  stub({
    id: 'opc-annual-compliance',
    name: 'One Person Company Annual Compliance',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    routeMainCategorySlug: 'legal-compliance',
  }),
  stub({
    id: 'roc-notice-reply',
    name: 'ROC Notice Reply',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    routeMainCategorySlug: 'legal-compliance',
  }),
  stub({
    id: 'dir-3-kyc-registration',
    name: 'DIR-3 KYC Registration',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    routeMainCategorySlug: 'legal-compliance',
  }),
  stub({
    id: 'private-limited-to-section-8-conversion',
    name: 'Private Limited to Section 8 Company Conversion',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    routeMainCategorySlug: 'legal-compliance',
  }),
  stub({
    id: 'section-8-to-private-limited-conversion',
    name: 'Section 8 to Private Limited Company Conversion',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    routeMainCategorySlug: 'legal-compliance',
  }),

  // ROC filings
  stub({
    id: 'add-remove-partner',
    name: 'Add/Remove Partner',
    mainHead: 'ROC COMPLIANCE',
    categoryId: 'roc-compliance',
    routeMainCategorySlug: 'roc-compliance',
  }),
  stub({
    id: 'adt-1-filing',
    name: 'Auditor Appointment (Form ADT-1 Filing)',
    mainHead: 'ROC COMPLIANCE',
    categoryId: 'roc-compliance',
    routeMainCategorySlug: 'roc-compliance',
  }),
  stub({
    id: 'demat-of-shares',
    name: 'Demat of Shares',
    mainHead: 'ROC COMPLIANCE',
    categoryId: 'roc-compliance',
    routeMainCategorySlug: 'roc-compliance',
  }),
  stub({
    id: 'share-transfer',
    name: 'Share Transfer',
    mainHead: 'ROC COMPLIANCE',
    categoryId: 'roc-compliance',
    routeMainCategorySlug: 'roc-compliance',
  }),
  stub({
    id: 'dir-12-filing',
    name: 'Appointment/Resignation (Form DIR-12)',
    mainHead: 'ROC COMPLIANCE',
    categoryId: 'roc-compliance',
    routeMainCategorySlug: 'roc-compliance',
  }),
  stub({
    id: 'dpt-3-filing',
    name: 'DPT-3 Form Filing',
    mainHead: 'ROC COMPLIANCE',
    categoryId: 'roc-compliance',
    routeMainCategorySlug: 'roc-compliance',
  }),
  stub({
    id: 'company-strike-off-filing',
    name: 'Company Strike Filing',
    mainHead: 'ROC COMPLIANCE',
    categoryId: 'roc-compliance',
    routeMainCategorySlug: 'roc-compliance',
  }),
  stub({
    id: 'llp-form-11-filing',
    name: 'LLP Form 11 Filing',
    mainHead: 'ROC COMPLIANCE',
    categoryId: 'roc-compliance',
    routeMainCategorySlug: 'roc-compliance',
  }),
  stub({
    id: 'pas-3-filing',
    name: 'PAS-3 Filing',
    mainHead: 'ROC COMPLIANCE',
    categoryId: 'roc-compliance',
    routeMainCategorySlug: 'roc-compliance',
  }),
  stub({
    id: 'aoc-4-filing',
    name: 'AOC-4 Filing',
    mainHead: 'ROC COMPLIANCE',
    categoryId: 'roc-compliance',
    routeMainCategorySlug: 'roc-compliance',
  }),
  stub({
    id: 'mgt-7a-filing',
    name: 'MGT-7A Filing',
    mainHead: 'ROC COMPLIANCE',
    categoryId: 'roc-compliance',
    routeMainCategorySlug: 'roc-compliance',
  }),
  stub({
    id: 'mgt-14-filing',
    name: 'MGT-14 Filing',
    mainHead: 'ROC COMPLIANCE',
    categoryId: 'roc-compliance',
    routeMainCategorySlug: 'roc-compliance',
  }),
  stub({
    id: 'msme-1-form-filing',
    name: 'MSME-1 Form Filing',
    mainHead: 'ROC COMPLIANCE',
    categoryId: 'roc-compliance',
    routeMainCategorySlug: 'roc-compliance',
  }),

  // Misc
  stub({
    id: 'one-day-liquor-permission-private-event',
    name: 'One Day & Liquor Permission for Private Event',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'liquor-licenses',
    routeMainCategorySlug: 'miscellaneous',
  }),
  stub({
    id: 'cl-3-license',
    name: 'CL-3 License',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'liquor-licenses',
    routeMainCategorySlug: 'miscellaneous',
  }),
  stub({
    id: 'fl-3-wine-bar-license',
    name: 'FL-3 License & Wine Bar License',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'liquor-licenses',
    routeMainCategorySlug: 'miscellaneous',
  }),
  stub({
    id: 'frro-registration',
    name: 'Registration of Foreigner (FRRO)',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'mandatory-licenses',
    routeMainCategorySlug: 'miscellaneous',
  }),
  stub({
    id: 'aadhar-pan-linking',
    name: 'Aadhar PAN Linking',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'mandatory-licenses',
    routeMainCategorySlug: 'miscellaneous',
  }),
  stub({
    id: 'aadhar-address-update',
    name: 'Aadhar Address Update',
    mainHead: 'MISCELLANEOUS',
    categoryId: 'mandatory-licenses',
    routeMainCategorySlug: 'miscellaneous',
  }),

  // Starts new business — catalogue additions
  stub({
    id: 'msme-registration',
    name: 'MSME Registration',
    mainHead: 'START NEW BUSINESS',
    categoryId: 'new-business',
    routeMainCategorySlug: 'starts-new-business',
  }),
  stub({
    id: 'rera-registration-for-projects',
    name: 'RERA Registration for Projects',
    mainHead: 'START NEW BUSINESS',
    categoryId: 'new-business',
    routeMainCategorySlug: 'starts-new-business',
  }),
  stub({
    id: 'rera-registration-for-agents',
    name: 'RERA Registration for Agents',
    mainHead: 'START NEW BUSINESS',
    categoryId: 'new-business',
    routeMainCategorySlug: 'starts-new-business',
  }),
  stub({
    id: 'vat-registration',
    name: 'VAT Registration',
    mainHead: 'START NEW BUSINESS',
    categoryId: 'registration',
    routeMainCategorySlug: 'starts-new-business',
  }),
  stub({
    id: 'darpan-registration',
    name: 'DARPAN Registration',
    mainHead: 'START NEW BUSINESS',
    categoryId: 'ngo-registrations',
    routeMainCategorySlug: 'starts-new-business',
  }),
  stub({
    id: 'barcode-registration',
    name: 'BARCODE Registration',
    mainHead: 'START NEW BUSINESS',
    categoryId: 'mandatory-licenses',
    routeMainCategorySlug: 'starts-new-business',
  }),
  stub({
    id: 'halal-license',
    name: 'HALAL License',
    mainHead: 'START NEW BUSINESS',
    categoryId: 'mandatory-licenses',
    routeMainCategorySlug: 'starts-new-business',
  }),
  stub({
    id: 'drug-license-registration',
    name: 'DRUG LICENSE REGISTRATION',
    mainHead: 'START NEW BUSINESS',
    categoryId: 'mandatory-licenses',
    routeMainCategorySlug: 'starts-new-business',
  }),
  stub({
    id: 'legal-entity-identifier-lei',
    name: 'Legal Entity Identifier (LEI)',
    mainHead: 'START NEW BUSINESS',
    categoryId: 'mandatory-licenses',
    routeMainCategorySlug: 'starts-new-business',
  }),
  stub({
    id: 'bis-registration',
    name: 'BIS Registration',
    mainHead: 'START NEW BUSINESS',
    categoryId: 'mandatory-licenses',
    routeMainCategorySlug: 'starts-new-business',
  }),
  stub({
    id: 'certificate-of-origin-coo',
    name: 'Certificate of Origin (COO)',
    mainHead: 'START NEW BUSINESS',
    categoryId: 'import-export-business',
    routeMainCategorySlug: 'starts-new-business',
  }),
  stub({
    id: 'startup-india-registration',
    name: 'STARTUP INDIA REGISTRATION',
    mainHead: 'START NEW BUSINESS',
    categoryId: 'new-business',
    routeMainCategorySlug: 'starts-new-business',
  }),
  stub({
    id: 'dpit-registration',
    name: 'DPIT Registration',
    mainHead: 'START NEW BUSINESS',
    categoryId: 'new-business',
    routeMainCategorySlug: 'starts-new-business',
  }),
  stub({
    id: 'psic-license',
    name: 'PSIC License',
    mainHead: 'START NEW BUSINESS',
    categoryId: 'mandatory-licenses',
    routeMainCategorySlug: 'starts-new-business',
  }),
  stub({
    id: 'iso-registration',
    name: 'ISO Registration',
    mainHead: 'START NEW BUSINESS',
    categoryId: 'mandatory-licenses',
    routeMainCategorySlug: 'starts-new-business',
  }),
  stub({
    id: 'dot-osp-license',
    name: 'DOT OSP License',
    mainHead: 'START NEW BUSINESS',
    categoryId: 'mandatory-licenses',
    routeMainCategorySlug: 'starts-new-business',
  }),
  stub({
    id: 'isi-registration',
    name: 'ISI Registration',
    mainHead: 'START NEW BUSINESS',
    categoryId: 'mandatory-licenses',
    routeMainCategorySlug: 'starts-new-business',
  }),
  stub({
    id: 'startup-india-tax-exemption',
    name: 'STARTUP INDIA TAX EXEMPTION',
    mainHead: 'START NEW BUSINESS',
    categoryId: 'income-tax',
    routeMainCategorySlug: 'starts-new-business',
  }),

  // Professional tax
  stub({
    id: 'professional-tax-return-filing',
    name: 'Professional Tax Return Filing',
    mainHead: 'PROFESSIONAL TAX',
    categoryId: 'professional-tax-compliance',
    routeMainCategorySlug: 'professional-tax-compliance',
  }),
  stub({
    id: 'professional-tax-payment',
    name: 'Professional Tax Payment',
    mainHead: 'PROFESSIONAL TAX',
    categoryId: 'professional-tax-compliance',
    routeMainCategorySlug: 'professional-tax-compliance',
  }),

  // Trademark
  stub({
    id: 'expedite-trademark-registration',
    name: 'Expedite Trademark Registration',
    mainHead: 'TRADEMARK & IP',
    categoryId: 'trademark-ip',
    routeMainCategorySlug: 'trademark-ip',
  }),

  // Mandatory licenses — additional catalogue entries
  stub({
    id: 'psara-registration',
    name: 'PSARA Registration',
    mainHead: 'MANDATORY LICENSES',
    categoryId: 'mandatory-licenses',
    routeMainCategorySlug: 'mandatory-licenses',
  }),
  stub({
    id: 'fire-license',
    name: 'Fire License (Fire NOC)',
    mainHead: 'MANDATORY LICENSES',
    categoryId: 'mandatory-licenses',
    routeMainCategorySlug: 'mandatory-licenses',
  }),

  // Start new business — additional catalogue entries
  stub({
    id: 'dpiit-registration',
    name: 'DPIIT Registration (Startup Recognition)',
    mainHead: 'START NEW BUSINESS',
    categoryId: 'new-business',
    routeMainCategorySlug: 'starts-new-business',
  }),
  // Legal compliance — additional catalogue entries
  stub({
    id: 'certificate-of-incumbency',
    name: 'Certificate of Incumbency',
    mainHead: 'LEGAL COMPLIANCE',
    categoryId: 'legal-compliance',
    routeMainCategorySlug: 'legal-compliance',
  }),

  // FEMA — additional catalogue entries
  stub({
    id: 'fdi-filing',
    name: 'FDI Filing (Foreign Direct Investment Reporting)',
    mainHead: 'FEMA COMPLIANCE',
    categoryId: 'fema-compliance',
    routeMainCategorySlug: 'fema-compliance',
  }),

  // ROC compliance — additional catalogue entries
  stub({
    id: 'aoa-amendment',
    name: 'AOA Amendment (Articles of Association)',
    mainHead: 'ROC COMPLIANCE',
    categoryId: 'roc-compliance',
    routeMainCategorySlug: 'roc-compliance',
  }),
  stub({
    id: 'xbrl-filing',
    name: 'XBRL Filing',
    mainHead: 'ROC COMPLIANCE',
    categoryId: 'roc-compliance',
    routeMainCategorySlug: 'roc-compliance',
  }),
  stub({
    id: 'mgt-7-filing',
    name: 'MGT-7 Filing',
    mainHead: 'ROC COMPLIANCE',
    categoryId: 'roc-compliance',
    routeMainCategorySlug: 'roc-compliance',
  }),
  stub({
    id: 'ccfs-scheme',
    name: 'CCFS scheme (Compromises, arrangements and amalgamations)',
    mainHead: 'ROC COMPLIANCE',
    categoryId: 'roc-compliance',
    routeMainCategorySlug: 'roc-compliance',
  }),
  stub({
    id: 'inc-20a-filing',
    name: 'Commencement of business (Form INC-20A)',
    mainHead: 'ROC COMPLIANCE',
    categoryId: 'roc-compliance',
    routeMainCategorySlug: 'roc-compliance',
  }),
  stub({
    id: 'dormant-status-filing',
    name: 'Dormant company status (Section 455, MSC-1)',
    mainHead: 'ROC COMPLIANCE',
    categoryId: 'roc-compliance',
    routeMainCategorySlug: 'roc-compliance',
  }),

  // GST — additional catalogue entries
  stub({
    id: 'virtual-office-gstin',
    name: 'Virtual Office + GSTIN Registration',
    mainHead: 'GST SERVICES',
    categoryId: 'gst-services',
    routeMainCategorySlug: 'goods-services-tax',
  }),

  // Income tax — additional catalogue entries
  stub({
    id: 'form-15ca-15cb',
    name: 'Form 15CA & 15CB Filing',
    mainHead: 'INCOME TAX',
    categoryId: 'income-tax',
    routeMainCategorySlug: 'income-tax',
  }),
  stub({
    id: 'itr-u-filing',
    name: 'ITR-U Filing (Updated Return)',
    mainHead: 'INCOME TAX',
    categoryId: 'income-tax',
    routeMainCategorySlug: 'income-tax',
  }),
];
