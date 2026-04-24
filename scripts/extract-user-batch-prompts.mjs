#!/usr/bin/env node
/**
 * Scans Cursor agent-transcript JSONL for user_query messages containing
 * "BATCH N:" and writes the longest text per batch to tmp/extracted-user-batches/.
 * Run: node scripts/extract-user-batch-prompts.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'tmp/extracted-user-batches');

const TRANSCRIPT = path.join(
  process.env.HOME,
  '.cursor/projects/Users-vivek-business-services-platform/agent-transcripts/7977e80e-8ef1-496f-a0f6-35fc9aacc64e/7977e80e-8ef1-496f-a0f6-35fc9aacc64e.jsonl'
);

function extractTextFromLine(line) {
  let o;
  try {
    o = JSON.parse(line);
  } catch {
    return null;
  }
  if (o.role !== 'user' || !o.message?.content) return null;
  const parts = o.message.content;
  if (!Array.isArray(parts)) return null;
  const texts = parts.filter((p) => p.type === 'text').map((p) => p.text);
  return texts.join('\n') || null;
}

function batchNumFromText(t) {
  const m = t.match(/BATCH\s*(\d+)\s*:/i);
  return m ? Number(m[1], 10) : null;
}

async function main() {
  if (!fs.existsSync(TRANSCRIPT)) {
    console.error('Transcript not found:', TRANSCRIPT);
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  /** @type {Map<number, string>} */
  const longest = new Map();

  const rl = readline.createInterface({
    input: fs.createReadStream(TRANSCRIPT, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (!line.trim()) continue;
    const text = extractTextFromLine(line);
    if (!text) continue;
    const n = batchNumFromText(text);
    if (n == null || n < 1 || n > 20) continue;
    const prev = longest.get(n);
    if (!prev || text.length > prev.length) longest.set(n, text);
  }

  for (const [n, text] of [...longest.entries()].sort((a, b) => a[0] - b[0])) {
    const out = path.join(OUT_DIR, `batch-${n}-raw.txt`);
    fs.writeFileSync(out, text, 'utf8');
    console.log('Wrote', out, `(${text.length} chars)`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
