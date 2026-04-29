#!/usr/bin/env node
/**
 * Patches data/content.json + public/content.json for GST Services Batch 7.
 * Run: node scripts/patch-gst-batch7.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BATCH_DIR = path.join(ROOT, 'tmp/gst-batch7');

const IDS = [
  'gst-advisory',
  'gst-annual-return',
  'gst-e-way-bill',
  'gst-lut-filing',
  'gst-refund',
  'gst-registration',
  'gst-registration-cancellation',
  'gst-registration-foreigners',
  'gst-return-filing',
  'gstr-10-final-return',
  'input-tax-credit-recon',
  'temporary-gst-registration',
  'virtual-office-gstin',
  'gst-registration-revocation',
];

function loadMd(id) {
  const f = path.join(BATCH_DIR, `${id}.md`);
  if (!fs.existsSync(f)) throw new Error(`Missing ${f}`);
  return fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n').replace(/\u2014/g, ', ').trim() + '\n';
}

const byId = Object.fromEntries(IDS.map((id) => [id, loadMd(id)]));

for (const file of ['data/content.json', 'public/content.json']) {
  const abs = path.join(ROOT, file);
  const json = JSON.parse(fs.readFileSync(abs, 'utf8'));
  if (!Array.isArray(json.services)) throw new Error(`No services in ${file}`);
  for (const id of IDS) {
    const idx = json.services.findIndex((s) => s && s.id === id);
    if (idx < 0) throw new Error(`Service ${id} not found in ${file}`);
    json.services[idx] = { ...json.services[idx], content: byId[id] };
  }
  fs.writeFileSync(abs, JSON.stringify(json, null, 2) + '\n', 'utf8');
  console.log('Patched', file);
}
console.log('Done.', IDS.length, 'GST service pages.');
