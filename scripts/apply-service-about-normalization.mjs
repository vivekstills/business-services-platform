#!/usr/bin/env node
/**
 * Applies scripts/lib/normalizeServiceAbout.mjs to every service in data/content.json,
 * then mirrors to public/content.json (run `npm run build` to regenerate sitemap).
 *
 * Usage: node scripts/apply-service-about-normalization.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeServiceAbout } from './lib/normalizeServiceAbout.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

function patchFile(abs) {
  const j = JSON.parse(fs.readFileSync(abs, 'utf8'));
  if (!Array.isArray(j.services)) throw new Error('No services');
  let n = 0;
  j.services = j.services.map((s) => {
    if (!s || typeof s.content !== 'string') return s;
    const next = normalizeServiceAbout(s.content);
    if (next !== s.content) {
      n++;
      return { ...s, content: next };
    }
    return s;
  });
  fs.writeFileSync(abs, JSON.stringify(j, null, 2) + '\n', 'utf8');
  return n;
}

const d = patchFile(path.join(ROOT, 'data', 'content.json'));
console.log(`Normalized about copy: ${d} services changed in data/content.json`);
console.log('Run: npm run build  (copies data/content.json → public/content.json)');
