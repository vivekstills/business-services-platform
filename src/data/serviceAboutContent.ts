/**
 * Long-form, SEO-friendly "About this service" markdown content keyed by
 * service id. Rendered via <RichContent /> on the service page when present.
 *
 * Markdown conventions (matched to RichContent parser):
 *   ##  → section heading (H2). Leading "N)" is stripped automatically.
 *   ### → subsection heading (H3)
 *   -   → bullet list
 *   1.  → numbered/ordered list ("Title — description" renders as bold + desc)
 *   **x**  → inline bold
 *   > x  → blockquote
 *
 * Keys are `Service.id`. Content here overrides the default `content` on the
 * matching service in `SERVICES` at module load time (see services.ts).
 */
export const SERVICE_ABOUT_CONTENT: Record<string, string> = {
  'odi-filing': `## 1) Detailed Brief / Overview

Overseas Direct Investment (ODI) Filing refers to the regulatory compliance process that Indian individuals and companies must follow when they invest in or establish businesses outside India. It is governed under **FEMA regulations** and monitored by the **Reserve Bank of India**.

From a consulting perspective, ODI is not just an investment — it is a strategic move toward global expansion. Businesses use ODI when they want to establish subsidiaries, acquire foreign companies, or build an international presence.

In real-world scenarios, ODI is commonly used when:

- An Indian company sets up a subsidiary in another country
- A business acquires shares in a foreign company
- Entrepreneurs expand operations internationally
- Companies establish global holding structures

For example, an Indian startup expanding into Dubai or Singapore may set up a foreign entity. This is not just a business decision — it requires ODI compliance including reporting, valuation, and regulatory approvals.

One important insight is that ODI is highly structured and regulated. It involves:

- Limits on investment based on net worth
- Reporting of financial performance of the overseas entity
- Compliance with RBI guidelines

Unlike domestic investments, ODI requires ongoing monitoring. Businesses must:

- File annual performance reports
- Track financials of the foreign entity
- Ensure proper repatriation rules

Another key point is that ODI is not freely allowed in all forms. There are restrictions on:

- Certain sectors
- Layered structures
- Round-tripping investments

From a strategic standpoint, ODI helps businesses:

- Expand globally
- Diversify markets
- Build international brand presence

However, it also comes with responsibilities. Improper structuring can lead to compliance issues, especially when dealing with tax and regulatory frameworks across multiple countries.

In summary, ODI Filing is a critical compliance for global expansion, ensuring that Indian investments abroad are structured, transparent, and legally compliant.

## 2) Advantages / Benefits

- **Global Expansion** — allows Indian businesses to expand internationally
- **Diversification** — helps investors spread business risk across countries
- **Strategic Growth** — enables acquisition of foreign companies or partnerships
- **Regulatory Compliance** — ensures adherence to FEMA and RBI norms
- **Access to New Markets** — opens doors to international customers and opportunities
- **Tax Planning Opportunities** — in some cases, helps in better structuring

## 3) Disadvantages / Limits

- **Regulatory Complexity** — ODI rules can be technical and require expert handling
- **Strict Reporting Requirements** — continuous compliance, like APR filing, is mandatory
- **Currency Risk** — investments are subject to foreign exchange fluctuations
- **Approval Requirements** — some investments may require RBI / government approval
- **Penalties for Non-Compliance** — delay or incorrect filing can attract penalties

## 4) Applicability in India

ODI Filing is applicable uniformly across all states and union territories of India. Since ODI is centrally governed by the Reserve Bank of India and FEMA regulations, there are no state-wise differences in compliance or procedures. However, the overseas entity's business activity must comply with sectoral guidelines.

## 5) Features

- Governed under **FEMA (Overseas Investment) Rules & Regulations, 2022**
- Applicable for investment in foreign subsidiaries or joint ventures
- Reporting done through the **Authorized Dealer (AD) Bank**
- Mandatory **Unique Identification Number (UIN)** for each investment
- **Annual Performance Report (APR)** filing required
- Covers equity, debt, guarantees, and financial commitments
- Applicable to individuals, companies, and LLPs

## 6) Documents List

- PAN Card of Investor (Individual / Company / LLP)
- Certificate of Incorporation (for companies / LLPs)
- Board Resolution approving the investment
- Net Worth Certificate from a Chartered Accountant
- Valuation Report (if applicable)
- Details of the Foreign Entity (MOA, registration, etc.)
- Shareholding Pattern
- Banker's Report / KYC
- Form FC and other RBI forms
- ODI Declaration and Undertaking

## 7) Process / Procedure

1. Plan Overseas Investment — decide on subsidiary, joint venture or acquisition
2. Check Eligibility & Limits — verify your case under ODI rules
3. Approach Authorized Dealer (AD) Bank — route the transaction through your bank
4. Submit Required Documents & Forms — provide complete paperwork
5. Obtain UIN (Unique Identification Number) — issued by RBI for the investment
6. Remit Funds Abroad — transfer investment through the bank
7. File ODI Form (Form FC) — formal filing with RBI
8. Comply with Ongoing Requirements — annual APR filing and monitoring

## 8) Government Cost / Fees Payable

- **RBI Fees** — no direct government fee is charged for ODI filing itself
- **Bank Charges** — AD Bank may charge processing / remittance fees
- **Late Fees / Penalty** — applicable for non-compliance or delayed filings
- **Professional Fees** — CA / CS fees typically range from ₹10,000 to ₹50,000 depending on complexity
`,
};

/**
 * True if the given string looks like rich markdown content (contains at
 * least one markdown structural marker we render). Plain-text `content`
 * returns false and should continue to use the simple summary layout.
 */
export function isRichMarkdown(content: string | undefined | null): boolean {
  if (!content) return false;
  return (
    /(^|\n)#{2,4} /.test(content) ||
    /(^|\n)[-*] /.test(content) ||
    /(^|\n)\d+\.\s/.test(content) ||
    /\*\*[^*]+\*\*/.test(content) ||
    /(^|\n)> /.test(content)
  );
}
