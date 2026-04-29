#!/usr/bin/env node
/**
 * Patches data/content.json + public/content.json with About content for MCA compliance batch 12 (24 services).
 * Adds inc-20a-filing and dormant-status-filing if missing (clone of aoc-4-filing shell).
 * Run from repo root: node scripts/patch-mca-compliance-batch12.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BATCH_DIR = path.join(ROOT, 'tmp/mca-compliance-batch12');

const IDS = [
  'aoc-4-filing',
  'mgt-7-filing',
  'mgt-7a-filing',
  'xbrl-filing',
  'add-director',
  'add-partner-llp',
  'aoa-amendment',
  'adt-1-filing',
  'ccfs-scheme',
  'change-llp-agreement',
  'change-registered-office',
  'close-company',
  'close-llp',
  'inc-20a-filing',
  'demat-of-shares',
  'dormant-status-filing',
  'dpt-3-filing',
  'increase-authorised-capital',
  'llp-form-11-filing',
  'moa-amendment',
  'msme-1-form-filing',
  'name-change-company',
  'remove-director',
  'share-transfer',
];

function loadMd(id) {
  const f = path.join(BATCH_DIR, `${id}.md`);
  if (!fs.existsSync(f)) throw new Error(`Missing ${f}`);
  return fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n').replace(/\u2014/g, ', ').trim() + '\n';
}

function ensureNewService(services, templateId, newId, meta) {
  const has = services.some((s) => s && s.id === newId);
  if (has) return;
  const tpl = services.find((s) => s && s.id === templateId);
  if (!tpl) throw new Error(`Template ${templateId} not found for ${newId}`);
  const copy = JSON.parse(JSON.stringify(tpl));
  copy.id = newId;
  copy.name = meta.name;
  copy.mainHead = 'ROC COMPLIANCE';
  copy.categoryId = 'roc-compliance';
  copy.routeMainCategorySlug = 'roc-compliance';
  copy.shortDescription = meta.shortDescription;
  copy.content = loadMd(newId);
  services.push(copy);
}

function patchFile(abs) {
  const json = JSON.parse(fs.readFileSync(abs, 'utf8'));
  if (!Array.isArray(json.services)) throw new Error(`No services in ${abs}`);

  ensureNewService(json.services, 'aoc-4-filing', 'inc-20a-filing', {
    name: 'Commencement of business (Form INC-20A)',
    shortDescription:
      'INC-20A filing under Section 10A: subscription receipt, board declaration, and MCA filing within 180 days of incorporation.',
  });
  ensureNewService(json.services, 'aoc-4-filing', 'dormant-status-filing', {
    name: 'Dormant company status (Section 455, MSC-1)',
    shortDescription:
      'MSC-1 application for dormant company status, simplified compliances, and revival through MSC-4 when operations resume.',
  });

  const ccfsIdx = json.services.findIndex((s) => s && s.id === 'ccfs-scheme');
  if (ccfsIdx < 0) throw new Error('ccfs-scheme not found');
  const ccfs = json.services[ccfsIdx];
  json.services[ccfsIdx] = {
    ...ccfs,
    name: 'CCFS scheme (Compromises, arrangements and amalgamations)',
    mainHead: 'ROC COMPLIANCE',
    categoryId: 'roc-compliance',
    routeMainCategorySlug: 'roc-compliance',
    shortDescription:
      'NCLT or Regional Director routes for mergers, demergers, schemes of arrangement, debt restructuring, and related corporate restructuring.',
    content: loadMd('ccfs-scheme'),
  };

  for (const id of IDS) {
    const idx = json.services.findIndex((s) => s && s.id === id);
    if (idx < 0) {
      if (id === 'inc-20a-filing' || id === 'dormant-status-filing') continue;
      throw new Error(`Service ${id} not found in ${abs}`);
    }
    if (id === 'ccfs-scheme') continue;
    json.services[idx] = { ...json.services[idx], content: loadMd(id) };
  }

  fs.writeFileSync(abs, JSON.stringify(json, null, 2) + '\n', 'utf8');
  console.log('Patched', path.relative(ROOT, abs));
}

function main() {
  for (const id of IDS) loadMd(id);
  for (const file of ['data/content.json', 'public/content.json']) {
    const abs = path.join(ROOT, file);
    if (!fs.existsSync(abs)) {
      console.warn('Skip missing', file);
      continue;
    }
    patchFile(abs);
  }
  console.log('Done. MCA compliance batch 12 (24 services).');
}

main();
