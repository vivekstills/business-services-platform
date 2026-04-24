#!/usr/bin/env node
/**
 * Patches data/content.json + public/content.json with About content for Business Conversions batch 3.
 * Run: node scripts/patch-conversions-batch3.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BATCH_DIR = path.join(ROOT, 'tmp/conversions-batch3');

const IDS = [
  'llp-to-company',
  'opc-to-private-limited',
  'opc-to-public-limited',
  'partnership-to-company',
  'partnership-to-llp',
  'private-to-opc',
  'private-to-public-company',
  'proprietorship-to-opc',
  'proprietorship-to-partnership',
  'public-to-private-company',
];

function loadMd(id) {
  const f = path.join(BATCH_DIR, `${id}.md`);
  if (!fs.existsSync(f)) throw new Error(`Missing ${f}`);
  return fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n').replace(/\u2014/g, ', ').trim() + '\n';
}

for (const id of IDS) loadMd(id);

for (const file of ['data/content.json', 'public/content.json']) {
  const abs = path.join(ROOT, file);
  const json = JSON.parse(fs.readFileSync(abs, 'utf8'));
  if (!Array.isArray(json.services)) throw new Error(`No services in ${file}`);
  const byId = (id) => json.services.findIndex((s) => s && s.id === id);
  for (const id of IDS) {
    const idx = byId(id);
    if (idx < 0) throw new Error(`Service ${id} not found in ${file}`);
    json.services[idx] = { ...json.services[idx], content: loadMd(id) };
  }
  fs.writeFileSync(abs, JSON.stringify(json, null, 2) + '\n', 'utf8');
  console.log('Patched', file);
}
console.log('Done.', IDS.length, 'conversion services.');
