/** Approximate adult reading speed (English) for estimates. */
const DEFAULT_WPM = 200;

/**
 * Strip markdown-like syntax so word count reflects what a reader sees, not markup.
 */
export function stripMarkdownForWordCount(source: string): string {
  if (!source?.trim()) return '';
  let t = source;
  t = t.replace(/```[\s\S]*?```/g, ' ');
  t = t.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1');
  t = t.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  t = t.replace(/^#{1,6}\s+/gm, '');
  t = t.replace(/\*\*([^*]+)\*\*/g, '$1');
  t = t.replace(/\*([^*\n]+)\*/g, '$1');
  t = t.replace(/__([^_]+)__/g, '$1');
  t = t.replace(/_([^_\n]+)_/g, '$1');
  t = t.replace(/`([^`]+)`/g, '$1');
  t = t.replace(/^\s*[-*+]\s+/gm, ' ');
  t = t.replace(/^\s*\d+\.\s+/gm, ' ');
  t = t.replace(/^>\s?/gm, '');
  t = t.replace(/<[^>]+>/g, ' ');
  t = t.replace(/[^\p{L}\p{N}]+/gu, ' ');
  return t.trim();
}

export function estimateReadingMinutes(source: string, wpm: number = DEFAULT_WPM): number {
  const plain = stripMarkdownForWordCount(source);
  const words = plain.split(/\s+/).filter(Boolean).length;
  if (words === 0) return 1;
  return Math.max(1, Math.round(words / wpm));
}

export function formatReadingTimeLabel(source: string, wpm: number = DEFAULT_WPM): string {
  return `${estimateReadingMinutes(source, wpm)} min read`;
}
