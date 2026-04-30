export const ARTICLE_CATEGORIES: string[] = [
  'GST & Indirect Tax',
  'Income Tax & ITR',
  'TDS & TCS',
  'Business Registration & MCA',
  'FSSAI & Food Compliance',
  'Import Export & Customs',
  'Trademark & Intellectual Property',
  'Legal & Regulatory Compliance',
  'Professional Tax & Payroll',
  'Others',
];

export const LEGACY_ARTICLE_CATEGORY_MAP: Record<string, string> = {
  'FSSAI Compliance': 'FSSAI & Food Compliance',
  'Firm / New Business': 'Business Registration & MCA',
  'Goods & Service Tax': 'GST & Indirect Tax',
  'Import-Export Business': 'Import Export & Customs',
  'Income Tax': 'Income Tax & ITR',
  'Legal Compliance': 'Legal & Regulatory Compliance',
  'MCA Compliance': 'Business Registration & MCA',
  Miscellaneous: 'Others',
  'Professional / Sector-Wise Compliance': 'Legal & Regulatory Compliance',
  'Trademark & IP': 'Trademark & Intellectual Property',
  'Other Updates': 'Others',
};

export function normalizeArticleCategory(category: string): string {
  const clean = (category || '').trim();
  if (!clean) return '';
  return LEGACY_ARTICLE_CATEGORY_MAP[clean] ?? clean;
}

const CATEGORY_COLOR_MAP: Record<string, string> = {
  'GST & Indirect Tax': 'bg-amber-50 text-amber-700 border-amber-200',
  'Income Tax & ITR': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'TDS & TCS': 'bg-teal-50 text-teal-700 border-teal-200',
  'Business Registration & MCA': 'bg-blue-50 text-blue-700 border-blue-200',
  'FSSAI & Food Compliance': 'bg-lime-50 text-lime-700 border-lime-200',
  'Import Export & Customs': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Trademark & Intellectual Property': 'bg-violet-50 text-violet-700 border-violet-200',
  'Legal & Regulatory Compliance': 'bg-rose-50 text-rose-700 border-rose-200',
  'Professional Tax & Payroll': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Others: 'bg-slate-50 text-slate-700 border-slate-200',
};

export function getArticleCategoryBadgeClasses(category: string): string {
  return CATEGORY_COLOR_MAP[normalizeArticleCategory(category)] ?? 'bg-gray-50 text-gray-600 border-gray-200';
}

export function getArticleCategoryPillClasses(category: string, active: boolean): string {
  const base = CATEGORY_COLOR_MAP[normalizeArticleCategory(category)] ?? 'bg-gray-100 text-gray-700 border-gray-200';
  /* Inset ring only — outer ring + outline-offset clash with overflow-y-hidden on the articles filter strip */
  if (active) return `${base} opacity-100 ring-2 ring-inset ring-black/[0.08] shadow-sm`;
  return `${base} opacity-80 hover:opacity-100`;
}
