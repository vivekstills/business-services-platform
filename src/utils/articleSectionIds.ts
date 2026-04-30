/** Stable DOM ids for article H2 headings — must match RichContent and ArticlePage TOC. */
export function extractSectionNum(text: string): { num: string | null; rest: string } {
  const m = text.match(/^(\d+)[\).:]\s+(.+)$/);
  if (m) return { num: m[1], rest: m[2] };
  return { num: null, rest: text };
}

export function articleSectionIdFromRest(rest: string): string {
  const slug = rest
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return `section-${slug}`;
}

/** From a single markdown line starting with `## `. */
export function articleSectionIdFromMarkdownH2Line(line: string): string {
  const t = line.trim().replace(/^##\s+/, '');
  const { rest } = extractSectionNum(t);
  return articleSectionIdFromRest(rest);
}
