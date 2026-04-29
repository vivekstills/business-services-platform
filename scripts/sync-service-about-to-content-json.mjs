/**
 * Keep `data/content.json` service `content` in sync with `src/data/service-about/*.md`
 * for the listed ids, so the static file matches what the app now applies from
 * SERVICE_ABOUT_CONTENT at runtime. Run from repo root: node scripts/...
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const jpath = path.join(root, 'data', 'content.json');
const j = JSON.parse(fs.readFileSync(jpath, 'utf8'));
const aboutDir = path.join(root, 'src', 'data', 'service-about');

const map = {
  'web-designing': 'web-designing.md',
  'seo-services': 'seo-services.md',
  'mobile-app-development': 'mobile-app-development.md',
};

for (const [id, file] of Object.entries(map)) {
  const c = fs.readFileSync(path.join(aboutDir, file), 'utf8');
  const s = j.services.find((x) => x.id === id);
  if (!s) {
    console.warn('Missing service in content.json:', id);
    continue;
  }
  s.content = c;
  console.log('Patched', id, '(' + c.length + ' chars)');
}
fs.writeFileSync(jpath, JSON.stringify(j, null, 2) + '\n');
console.log('Wrote', jpath);
