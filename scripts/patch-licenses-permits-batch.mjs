#!/usr/bin/env node
/**
 * Patches data/content.json + public/content.json with About content for Licenses & Permits batch (27 services).
 * Run from repo root: node scripts/patch-licenses-permits-batch.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BATCH_DIR = path.join(ROOT, 'tmp/licenses-permits-batch');

const IDS = [
  'beer-shop-license',
  'club-license',
  'mild-liquor-wine-bar',
  'one-day-country-liquor',
  'one-day-foreign-liquor',
  'one-year-lifelong-foreign-liquor',
  'permit-room-license',
  'temporary-one-day-function-license',
  'wholesale-country-liquor',
  'wholesale-foreign-liquor',
  'wholesale-wine-license',
  'wine-bar-license',
  'wine-shop-license',
  'factory-license-registration',
  'health-license',
  'professional-tax-registration',
  'psara-registration',
  'rera-registration-for-agents',
  'rera-registration-for-projects',
  'trade-license',
  'vat-registration',
  'contract-labour-license-registration',
  'contract-labour-license-renewal',
  'factory-license-renewal',
  'pcb-consent-establish',
  'pcb-consent-operate',
  'principal-employer-registration',
];

function loadMd(id) {
  const f = path.join(BATCH_DIR, `${id}.md`);
  if (!fs.existsSync(f)) throw new Error(`Missing ${f}`);
  return fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n').replace(/\u2014/g, ', ').trim() + '\n';
}

function patch() {
  for (const id of IDS) {
    loadMd(id);
  }

  for (const file of ['data/content.json', 'public/content.json']) {
    const abs = path.join(ROOT, file);
    const json = JSON.parse(fs.readFileSync(abs, 'utf8'));
    if (!Array.isArray(json.services)) throw new Error(`No services in ${file}`);

    for (const id of IDS) {
      const idx = json.services.findIndex((s) => s && s.id === id);
      if (idx < 0) throw new Error(`Service ${id} not found in ${file}`);
      json.services[idx] = { ...json.services[idx], content: loadMd(id) };
    }

    fs.writeFileSync(abs, JSON.stringify(json, null, 2) + '\n', 'utf8');
    console.log('Patched', file);
  }
  console.log('Done. 27 services updated.');
}

patch();
