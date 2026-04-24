#!/usr/bin/env node
/**
 * Lists services in data/content.json whose "Frequently asked" block looks like
 * a single run-on paragraph (e.g. "1. Q? A. 2. Next Q") instead of
 * **Question?** Answer lines that RichContent turns into an accordion.
 *
 * Run: node scripts/audit-faq-runon.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, '..', 'data', 'content.json');

function isRunOnFaqBlock(body) {
  const t = body.replace(/\r\n/g, '\n').trim();
  if (!t) return false;
  // Accordion pattern: at least one **...** line in FAQ block
  if (/\*\*[^*]{8,300}\*\*/.test(t)) return false;
  // Numbered Q&A all in one line / paragraph: "1. ...? ... 2. ..."
  if (/\b1\.\s+.+\?[\s\S]{20,}?\b2\.\s+/.test(t)) return true;
  if (/\b1\.\s+.+\?[\s\S]{20,}?\b2\.\s+We\s+are\b/.test(t)) return true;
  return false;
}

function faqBlock(content) {
  const c = content || '';
  const m = c.match(
    /(^|\n)#{1,3}\s*Frequently asked questions?\s*(\n+)([\s\S]*?)(?=\n#{1,2}\s+[^#]|\n#[^#]|\Z)/i
  );
  if (m) return m[3] || '';
  return '';
}

const j = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const out = [];
for (const s of j.services || []) {
  const fb = faqBlock(s.content);
  if (fb && isRunOnFaqBlock(fb)) out.push(s.id);
}

console.log(`FAQ run-on heuristics: ${out.length} services (restructure with **Question?** + answer per line, or H3 per Q).`);
out.sort().forEach((id) => console.log(' ', id));
process.exit(0);
