/**
 * Pre-renders key pages to static HTML at build time.
 * This gives search engine crawlers real HTML content to index,
 * dramatically improving SEO for a React SPA.
 *
 * Run after `vite build`: npx tsx scripts/prerender.ts
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync, type ChildProcess, spawn } from 'child_process';
import puppeteer from 'puppeteer';
import { SERVICES, SERVICE_CATEGORIES } from '../src/data/services';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST = path.resolve(__dirname, '..', 'dist');

const STATIC_ROUTES = [
  '/',
  '/about-us',
  '/contact-us',
  '/reviews',
  '/articles',
  '/business-search',
  '/trademark-search',
  '/privacy-policy',
  '/refund-policy',
  '/confidentiality-policy',
  '/disclaimer-policy',
  '/terms-conditions',
];

const CATEGORY_ROUTES = SERVICE_CATEGORIES.map((c) => `/category/${c.id}`);
const SERVICE_ROUTES = SERVICES.map((s) => `/service/${s.id}`);

const ALL_ROUTES = [...STATIC_ROUTES, ...CATEGORY_ROUTES, ...SERVICE_ROUTES];

const PORT = 4173;
const BASE = `http://localhost:${PORT}`;
const CONCURRENCY = 5;

async function startPreviewServer(): Promise<any> {
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: path.resolve(__dirname, '..'),
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, NODE_ENV: 'production' },
  });

  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Preview server start timeout')), 15000);
    server.stdout?.on('data', (data: Buffer) => {
      if (data.toString().includes('Local:') || data.toString().includes(String(PORT))) {
        clearTimeout(timeout);
        resolve();
      }
    });
    server.stderr?.on('data', (data: Buffer) => {
      const msg = data.toString();
      if (msg.includes('EADDRINUSE')) {
        clearTimeout(timeout);
        reject(new Error(`Port ${PORT} already in use`));
      }
    });
    server.on('error', (err) => { clearTimeout(timeout); reject(err); });
  });

  return server;
}

async function prerenderRoute(page: any, route: string): Promise<void> {
  const url = `${BASE}${route}`;
  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
    await page.waitForSelector('#root', { timeout: 5000 });
    // Wait a bit for React to render and helmet to inject meta tags
    await new Promise((r) => setTimeout(r, 500));
  } catch {
    console.warn(`  [WARN] Timeout or error loading ${route}, saving partial HTML`);
  }

  const html = await page.content();

  const routePath = route === '/' ? '/index' : route;
  const filePath = path.join(DIST, `${routePath}.html`);
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, html, 'utf-8');
}

async function main() {
  console.log(`\nPre-rendering ${ALL_ROUTES.length} routes...\n`);

  if (!fs.existsSync(path.join(DIST, 'index.html'))) {
    console.error('Error: dist/index.html not found. Run `npm run build` first.');
    process.exit(1);
  }

  let server: any = null;
  let browser: any = null;

  try {
    console.log('Starting preview server...');
    server = await startPreviewServer();
    console.log(`Preview server running on port ${PORT}`);

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    let completed = 0;

    for (let i = 0; i < ALL_ROUTES.length; i += CONCURRENCY) {
      const batch = ALL_ROUTES.slice(i, i + CONCURRENCY);
      await Promise.all(
        batch.map(async (route) => {
          const page = await browser!.newPage();
          await page.setUserAgent('MridhuvPrerenderer/1.0');
          // Block images/fonts/media to speed up rendering
          await page.setRequestInterception(true);
          page.on('request', (req) => {
            const rt = req.resourceType();
            if (['image', 'font', 'media', 'stylesheet'].includes(rt)) {
              req.abort();
            } else {
              req.continue();
            }
          });
          await prerenderRoute(page, route);
          await page.close();
          completed++;
          if (completed % 20 === 0 || completed === ALL_ROUTES.length) {
            console.log(`  ${completed}/${ALL_ROUTES.length} pages pre-rendered`);
          }
        })
      );
    }

    console.log(`\nDone! ${completed} HTML files written to ${DIST}/`);
  } finally {
    if (browser) await browser.close();
    if (server) {
      server.kill('SIGTERM');
      await new Promise((r) => setTimeout(r, 500));
    }
  }
}

main().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
