import React from 'react';

/** Shown under feature lists in the admin. */
export const PRICING_FEATURE_FORMAT_HINT =
  'Use **double asterisks** for bold. Press Enter for a line break within one bullet.';

type Props = { text: string; className?: string };

function plainWithBreaks(segment: string, baseKey: string): React.ReactNode[] {
  const lines = segment.split('\n');
  return lines.map((line, i) => (
    <React.Fragment key={`${baseKey}-l${i}`}>
      {i > 0 && <br />}
      {line}
    </React.Fragment>
  ));
}

const BOLD_SEG = /^\*\*([^*]+)\*\*$/;

/**
 * Renders a single pricing feature line: `**bold**` pairs and newlines.
 * No HTML; safe for admin-entered text.
 */
export function parsePricingFeatureText(text: string): React.ReactNode {
  if (text == null || text === '') return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  const out: React.ReactNode[] = [];
  let key = 0;
  for (const part of parts) {
    if (part === '') continue;
    const bm = BOLD_SEG.exec(part);
    if (bm) {
      out.push(<strong key={`b${key++}`}>{bm[1]}</strong>);
    } else {
      out.push(...plainWithBreaks(part, `s${key++}`));
    }
  }
  return <>{out}</>;
}

/** Default export for `className` wrapper on the whole bullet text. */
export default function PricingFeatureText({ text, className }: Props) {
  return <span className={className}>{parsePricingFeatureText(text)}</span>;
}
