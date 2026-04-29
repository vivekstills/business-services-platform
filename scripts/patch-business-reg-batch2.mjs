#!/usr/bin/env node
/**
 * Patches data/content.json + public/content.json with About content for Business Registrations batch 2.
 * Prereq: tmp/business-reg-batch2/<id>.md for each id; inserts huf-registration if missing.
 * Run: node scripts/patch-business-reg-batch2.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BATCH_DIR = path.join(ROOT, 'tmp/business-reg-batch2');

const IDS = [
  'huf-registration',
  'indian-subsidiary-foreign-company',
  'llp-registration',
  'logo-designing',
  'nidhi-company',
  'one-person-company',
  'partnership-registration',
  'private-limited-company',
  'producer-company',
  'public-limited-company',
  'section-8-company',
  'society-registration',
  'trust-registration',
];

const HUF_STEPS = [
  'HUF deed drafting and notarization',
  'PAN in Form 49A for the HUF',
  'Bank account in HUF name',
  'ITR-2 and ongoing tax support as needed',
];

const HUF_SVC = {
  id: 'huf-registration',
  name: 'HUF Registration',
  mainHead: 'FORM NEW BUSINESS',
  categoryId: 'new-business',
  shortDescription:
    'HUF deed, separate PAN, bank account, and ITR support for family tax planning.',
  packages: [
    {
      name: 'Custom',
      price: 'On request',
      description: 'Scoped to family structure, state stamp rules, and banking needs.',
      features: [
        'Expert consultation and requirement capture',
        'Deed, PAN, and document coordination',
        'Application support with bank and NSDL',
        'Status tracking and follow-up',
        'Email support',
      ],
      popular: false,
    },
  ],
  steps: HUF_STEPS,
};

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

    const byId = (id) => json.services.findIndex((s) => s && s.id === id);
    for (const id of IDS) {
      if (id === 'huf-registration' && byId(id) < 0) {
        const pIdx = byId('partnership-registration');
        if (pIdx < 0) throw new Error('partnership-registration not found, cannot insert huf');
        json.services.splice(pIdx, 0, { ...HUF_SVC, content: loadMd(id) });
        continue;
      }
      const idx = byId(id);
      if (idx < 0) throw new Error(`Service ${id} not found in ${file}`);
      json.services[idx] = { ...json.services[idx], content: loadMd(id) };
    }

    fs.writeFileSync(abs, JSON.stringify(json, null, 2) + '\n', 'utf8');
    console.log('Patched', file);
  }
  console.log('Done. 13 or 14 services updated, HUF inserted if absent.');
}

patch();
