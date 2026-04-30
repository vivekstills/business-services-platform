/**
 * Syncs scripts/web-maintenance-body.md → SERVICE_ABOUT_CONTENT, services in JSON,
 * and the editorial article slug website-maintenance.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const mdPath = path.join(__dirname, 'web-maintenance-body.md');
const body = fs.readFileSync(mdPath, 'utf8');

function wordCount(md) {
  return md
    .replace(/#{1,6}\s+/g, ' ')
    .replace(/\|/g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

function readingTimeFrom(md) {
  const m = Math.max(3, Math.ceil(wordCount(md) / 200));
  return `${m} min read`;
}

function excerptFrom(md, max = 220) {
  const plain = md
    .replace(/^#[^\n]+\n+/m, '')
    .replace(/#{2,}[^\n]+\n/g, ' ')
    .replace(/\|[^|]+\|/g, ' ')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length <= max ? plain : plain.slice(0, max - 1).trim() + '…';
}

/* ----- TypeScript SERVICE_ABOUT_CONTENT ----- */
const tsPath = path.join(root, 'src', 'data', 'serviceAboutContent.ts');
const ts = fs.readFileSync(tsPath, 'utf8');
const tsAnchor = '\n\n  // Website Designing in India';
const tsKey = "  'web-maintenance': ";
const tsStart = ts.indexOf(tsKey);
if (tsStart === -1) throw new Error('web-maintenance key not found in serviceAboutContent.ts');
const tsEnd = ts.indexOf(tsAnchor, tsStart);
if (tsEnd === -1) throw new Error('anchor after web-maintenance not found');
const serialized = JSON.stringify(body);
const newTsSlice = `${tsKey}${serialized},`;
fs.writeFileSync(tsPath, ts.slice(0, tsStart) + newTsSlice + ts.slice(tsEnd));
console.log('Updated serviceAboutContent.ts web-maintenance');

const pkgs = [
  {
    name: 'Essential',
    price: 'On request',
    description:
      'Backups, monitoring, and scheduled CMS/security updates for brochure or low-change sites.',
    features: [
      'Monthly backup verification',
      'Uptime & SSL expiry monitoring',
      'Scheduled CMS/plugin/theme updates (staging when applicable)',
      'Broken-link spot checks',
      'Email/ticket support',
    ],
    popular: false,
  },
  {
    name: 'Growth',
    price: 'On request',
    description:
      'Adds performance tuning, SEO hygiene, and content update bandwidth for marketing-led sites.',
    features: [
      'Everything in Essential',
      'Performance optimisation pass (caching, images, critical scripts)',
      'Google Search Console & crawl hygiene',
      'Agreed content/edit hours each month',
      'Monthly maintenance report',
    ],
    popular: true,
  },
  {
    name: 'Commerce / SLA',
    price: 'On request',
    description: 'For stores and high-traffic apps: tighter SLAs, staged releases, and deeper QA.',
    features: [
      'Everything in Growth',
      'Priority incident response window',
      'Pre-release checkout/payment smoke tests',
      'Integration monitoring support',
      'Quarterly restore drill',
    ],
    popular: false,
  },
];

const steps = [
  'Kickoff: scope, contacts, and secure access handover',
  'Baseline audit (security, performance, SEO, backlog)',
  'Backup → staging updates → production deploy with verification',
  'Enable monitoring, alerts, and monthly reporting cadence',
];

for (const rel of ['data/content.json', 'public/content.json']) {
  const p = path.join(root, rel);
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));

  const svc = data.services.find((x) => x.id === 'web-maintenance');
  if (!svc) throw new Error('missing web-maintenance service in ' + rel);
  svc.content = body;
  svc.packages = pkgs;
  svc.steps = steps;

  const art = data.articles.find((a) => a.slug === 'website-maintenance');
  if (art) {
    art.content = body;
    art.excerpt = excerptFrom(body);
    art.readingTime = readingTimeFrom(body);
    art.tags = ['Website maintenance', 'CMS', 'Security', 'SEO', 'India'];
  }

  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
  console.log('Updated', rel);
}

if (!body.includes('# Website Maintenance')) {
  console.warn('Expected H1 "# Website Maintenance" in web-maintenance-body.md');
}
