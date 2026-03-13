/**
 * Parses a display price string like "₹4,500" into an amount in paise.
 * Returns null for unparseable values like "On request", "TBD", etc.
 */
export function parsePriceToAmount(price: string): number | null {
  if (!price) return null;

  const cleaned = price
    .replace(/₹/g, '')
    .replace(/,/g, '')
    .replace(/\s+/g, '')
    .trim();

  if (!cleaned || /[a-zA-Z]/.test(cleaned)) return null;

  const num = parseFloat(cleaned);
  if (isNaN(num) || num <= 0) return null;

  return Math.round(num * 100);
}

/**
 * Formats paise amount to a display string like "₹4,500"
 */
export function formatAmount(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}
