/**
 * Regenerates public/sitemap.xml from data/content.json and route rules.
 * Invoked in npm run build after copying data/content.json → public.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Service } from '../src/data/services';
import { getRouteMainCategorySlug } from '../src/data/serviceExcelRouting';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const SITE =
  (typeof process !== 'undefined' && process.env.SITEMAP_BASE_URL?.replace(/\/$/, '')) ||
  'https://mridhuvassociates.com';

type UrlRow = { loc: string; changefreq: string; priority: string };
const seen = new Set<string>();
const rows: UrlRow[] = [];

function add(path: string, changefreq: string, priority: string) {
  const loc = `${SITE}${path.startsWith('/') ? path : `/${path}`}`;
  if (seen.has(loc)) return;
  seen.add(loc);
  rows.push({ loc, changefreq, priority });
}

const content = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'data', 'content.json'), 'utf8')
) as {
  services?: Service[];
  categories?: { id: string }[];
  articles?: { slug: string; published?: boolean }[];
};

const lastmod = new Date().toISOString().slice(0, 10);

// Static & policy-style pages
for (const [p, cf, pr] of [
  ['/', 'daily', '1.0'],
  ['/about-us', 'monthly', '0.8'],
  ['/contact-us', 'monthly', '0.8'],
  ['/reviews', 'monthly', '0.7'],
  ['/articles', 'weekly', '0.8'],
  ['/business-search', 'monthly', '0.6'],
  ['/trademark-search', 'monthly', '0.6'],
  ['/privacy-policy', 'yearly', '0.3'],
  ['/refund-policy', 'yearly', '0.3'],
  ['/confidentiality-policy', 'yearly', '0.3'],
  ['/disclaimer-policy', 'yearly', '0.3'],
  ['/terms-conditions', 'yearly', '0.3'],
] as const) {
  add(p, cf, pr);
}

// Category listing pages
for (const c of content.categories ?? []) {
  if (c?.id) add(`/category/${c.id}`, 'weekly', '0.8');
}

// Service pages (canonical + legacy short path)
const services = (content.services ?? []) as Service[];
for (const s of services) {
  if (!s?.id) continue;
  const main = getRouteMainCategorySlug(s);
  add(`/services/${main}/${s.id}`, 'weekly', '0.7');
  add(`/service/${s.id}`, 'weekly', '0.6');
}

// Blog articles
for (const a of content.articles ?? []) {
  if (!a?.slug) continue;
  if (a.published === false) continue;
  add(`/articles/${a.slug}`, 'monthly', '0.6');
}

// Emit XML
const esc = (u: string) =>
  u.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const body = rows
  .map(
    (r) => `  <url>
    <loc>${esc(r.loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

const outPath = path.join(ROOT, 'public', 'sitemap.xml');
fs.writeFileSync(outPath, xml, 'utf8');
console.log('Wrote', outPath, `(${rows.length} URLs, lastmod ${lastmod})`);
