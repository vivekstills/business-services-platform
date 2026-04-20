/**
 * Generates sitemap.xml from the services/categories data at build time.
 * Run: npx tsx scripts/generate-sitemap.ts
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SERVICES, SERVICE_CATEGORIES } from '../src/data/services';
import { getRouteMainCategorySlug } from '../src/data/serviceExcelRouting';
import type { Content } from '../src/types/content';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://mridhuvassociates.com';
const TODAY = new Date().toISOString().split('T')[0];

const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/about-us', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact-us', priority: '0.8', changefreq: 'monthly' },
  { path: '/reviews', priority: '0.7', changefreq: 'monthly' },
  { path: '/articles', priority: '0.8', changefreq: 'weekly' },
  { path: '/business-search', priority: '0.6', changefreq: 'monthly' },
  { path: '/trademark-search', priority: '0.6', changefreq: 'monthly' },
  { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
  { path: '/refund-policy', priority: '0.3', changefreq: 'yearly' },
  { path: '/confidentiality-policy', priority: '0.3', changefreq: 'yearly' },
  { path: '/disclaimer-policy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms-conditions', priority: '0.3', changefreq: 'yearly' },
];

function buildSitemap(): string {
  const urls: string[] = [];

  const addUrl = (loc: string, priority: string, changefreq: string) => {
    urls.push(`  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`);
  };

  for (const page of staticPages) {
    addUrl(page.path, page.priority, page.changefreq);
  }

  for (const cat of SERVICE_CATEGORIES) {
    addUrl(`/category/${cat.id}`, '0.8', 'weekly');
  }

  for (const svc of SERVICES) {
    const main = getRouteMainCategorySlug(svc);
    addUrl(`/services/${main}/${svc.id}`, '0.7', 'weekly');
    addUrl(`/service/${svc.id}`, '0.5', 'weekly');
  }

  const contentPath = path.resolve(__dirname, '..', 'data', 'content.json');
  const rawContent = fs.readFileSync(contentPath, 'utf-8');
  const content = JSON.parse(rawContent) as Content;
  const articleSlugs = (content.articles ?? [])
    .filter((article) => article.published && article.slug)
    .map((article) => article.slug);

  for (const slug of articleSlugs) {
    addUrl(`/articles/${slug}`, '0.6', 'monthly');
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

const sitemap = buildSitemap();
const outPath = path.resolve(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(outPath, sitemap, 'utf-8');
console.log(`Sitemap generated: ${outPath}`);
