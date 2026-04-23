#!/usr/bin/env node
/**
 * Patches data/content.json + public/content.json with About content for Legal Compliance batch 1.
 * Run from repo root: node scripts/patch-legal-compliance-batch1.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BATCH_DIR = path.join(ROOT, 'tmp/legal-batch1');

const IDS = [
  'indian-subsidiary-annual-compliance',
  'llp-annual-compliance',
  'opc-annual-compliance',
  'partnership-annual-compliance',
  'private-ltd-annual-compliance',
  'proprietorship-annual-compliance',
  'section-8-annual-compliance',
];

const NEW_PUBLIC = {
  id: 'public-limited-annual-compliance',
  name: 'Public Limited Company Annual Compliance',
  mainHead: 'LEGAL COMPLIANCE',
  categoryId: 'legal-compliance',
  shortDescription: 'Board, AGM, MCA, SEBI (listed), audit committee, and ITR compliances for public companies.',
  packages: [
    {
      name: 'Custom',
      price: 'On request',
      description: 'Scoped to listing status, paid-up capital, and subsidiary footprint.',
      features: [
        'Expert consultation and requirement capture',
        'Document checklist and preparation',
        'Application filing with relevant authority',
        'Status tracking and follow-up',
        'Email support',
      ],
      popular: false,
    },
  ],
  steps: [
    'Requirement discussion and advisory',
    'Document and form preparation',
    'Filing with appropriate authority',
    'Follow-up until completion',
  ],
};

function loadMd(id) {
  const f = path.join(BATCH_DIR, `${id}.md`);
  if (!fs.existsSync(f)) throw new Error(`Missing ${f}`);
  return fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n').trim() + '\n';
}

function patch() {
  for (const id of IDS) {
    loadMd(id); // validate exists
  }
  loadMd(NEW_PUBLIC.id);

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

    const pubIdx = byId(NEW_PUBLIC.id);
    if (pubIdx >= 0) {
      json.services[pubIdx] = {
        ...json.services[pubIdx],
        ...NEW_PUBLIC,
        content: loadMd(NEW_PUBLIC.id),
      };
    } else {
      const privIdx = byId('private-ltd-annual-compliance');
      if (privIdx < 0) throw new Error('private-ltd-annual-compliance not found');
      json.services.splice(privIdx + 1, 0, {
        ...NEW_PUBLIC,
        content: loadMd(NEW_PUBLIC.id),
      });
    }

    fs.writeFileSync(abs, JSON.stringify(json, null, 2) + '\n', 'utf8');
    console.log('Patched', file);
  }
  console.log('Done. 8 services updated, public limited inserted if missing.');
}

patch();
