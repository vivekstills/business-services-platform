/**
 * Old article slugs removed from content.json still receive organic/external links.
 * SPA navigates to the canonical keeper article.
 */
export const ARTICLE_REDIRECTS: Record<string, string> = {
  'section-80c-cornerstone-tax-planning-india':
    'section-80c-complete-guide-india-popular-tax-deduction',
  'save-tax-every-income-level-india-10l-to-1cr':
    'how-save-tax-different-income-levels-complete-strategy-guide',
  'home-loan-tax-benefit-how-save-income-tax-your-home-loan':
    'home-loan-tax-benefits-claim-2024-25',
  'tax-benefits-children-education-allowance-tuition-fees-school-fees':
    'children-education-allowance-tax-benefits-parents-india',
  'section-80ggc-income-tax-act-deduction-limit-exceptions':
    'section-80ggc-political-party-donation-deduction',
  /** Old URL; canonical slug is now deductions-under-section-80ccd */
  'section-80ccd-1b-nps-extra-50000-deduction': 'deductions-under-section-80ccd',
};
