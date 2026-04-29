#!/usr/bin/env node
/**
 * Converts tmp/extracted-user-batches/batch-*.txt (transcript extractions) into
 * service markdown under tmp/{batchDir}/, using ALL-CAPS service title lines
 * like "1. FDI FILING" or "2. BIS REGISTRATION".
 *
 * Run: node scripts/emit-batch-mds-from-raw.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const EXTRACTED = path.join(ROOT, 'tmp/extracted-user-batches');

/** Batches that use: BATCH N: ... \n 1. ALL CAPS TITLE */
const CONFIG = {
  4: {
    dir: 'fema-batch4',
    ids: ['fdi-filing', 'fema-advisory', 'fla-return-filing', 'odi-filing'],
  },
  5: {
    dir: 'fssai-batch5',
    ids: ['fssai-registration', 'fssai-modification', 'fssai-renewal', 'fssai-return-filing'],
  },
  6: {
    dir: 'gov-reg-batch6',
    ids: [
      'barcode-registration',
      'bis-registration',
      'certificate-of-incumbency',
      'darpan-registration',
      'digital-signature',
      'dot-osp-license',
      'dpiit-registration',
      'drug-license-registration',
      'fire-license',
      'halal-license',
      'iso-registration',
      'legal-entity-identifier-lei',
      'msme-registration',
      'rcmc-registration',
      'startup-india-registration',
      'startup-india-tax-exemption',
    ],
  },
  7: {
    dir: 'gst-batch7',
    ids: [
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
    ],
  },
  8: {
    dir: 'import-export-batch8',
    ids: ['icegate-registration', 'iec-modification', 'import-export-code'],
  },
};

const SECTION_ONE_LINE = new Set(
  `Overview,Applicability,Features,Benefits,Limitations,Process,Documents,Documents Required,Validity,Timeline,Deadlines,Errors,Disclaimers,Comparison,Conclusion,Summary,Key Features,Key Provisions,Key highlights,Regulatory framework,Governing framework,Who can apply,Who should apply,Types of,Introduction,What is,Scope,Eligibility,Requirements,Service overview,Service fees,Professional fees,Professional Service,Government fees,Government Fees,Common errors,Common mistakes,Applicability in India,When to use,Advantages,Disadvantages,Comparison chart,Table of forms,Relevant forms,Important points,Key reporting forms,Membership Tier,Service charges`
    .split(',')
    .map((s) => s.trim().toLowerCase())
);

function isAllCapsServiceTitleLine(line) {
  const t = line.trim();
  const m = t.match(/^(\d+)\.\s+(.+)$/);
  if (!m) return null;
  const rest = m[2].trim();
  if (rest.length < 8) return null;
  if (rest !== rest.toUpperCase()) return null;
  if (!/[A-Z]/.test(rest)) return null;
  return { n: m[1], title: rest, full: t };
}

function looksLikeOneLineHeader(line) {
  const t = line.trim();
  if (t.length < 3 || t.length > 80) return false;
  if (t.includes('?')) return false;
  if (/^step\s+\d/i.test(t)) return false;
  if (/^\d+\./.test(t)) return false;
  const k = t.toLowerCase();
  for (const s of SECTION_ONE_LINE) {
    if (k === s) return t;
  }
  // Title case single-line headers: "Frequently Asked Questions" etc.
  if (/^(Frequently\s+Asked\s+Questions|F\s*A\s*Q|FAQs?)$/i.test(t)) return 'Frequently asked questions';
  return null;
}

function tryPairTable(lines, startIdx) {
  // Document / Details style two-column: header row then pairs of lines
  if (startIdx + 1 >= lines.length) return { end: startIdx, table: null };
  const a = lines[startIdx].trim();
  const b = lines[startIdx + 1].trim();
  const h1 = a.toLowerCase();
  const h2 = b.toLowerCase();
  if (!['document', 'documents', 'item', 'sl no', 'sl.', 's.no', 'parameter', 'membership tier', 'form', 'category'].includes(h1)) {
    return { end: startIdx, table: null };
  }
  if (!['details', 'purpose', 'description', 'particulars', 'amount', 'fee', 'applicable to', 'huf', 'content', 'particulars', 'nature'].includes(h2) && h1 !== 'parameter') {
    // second column may be a known header
    if (!(h2 === 'details' || h2 === 'fee' || h2 === 'purpose' || h2 === 'description')) {
      return { end: startIdx, table: null };
    }
  }
  const rows = [[a, b]];
  let j = startIdx + 2;
  while (j + 1 < lines.length) {
    const l1 = lines[j].trim();
    const l2 = lines[j + 1].trim();
    if (!l1) break;
    if (looksLikeOneLineHeader(l1) || isAllCapsServiceTitleLine(l1) || l1 === 'Frequently asked questions' || /^\d+\.\s+/.test(l1)) {
      if (l1.length < 80 && l1 && !l1.includes('|')) {
        if (j > startIdx + 2 && looksLikeOneLineHeader(l1)) break;
      }
    }
    if (l1.length > 0 && l2.length > 0 && j > startIdx + 2) {
      // stop if next two lines are "Overview" or section
      if (SECTION_ONE_LINE.has(l1.toLowerCase()) && l1.length < 50) {
        j -= 1;
        break;
      }
    }
    if (!l1 && !l2) break;
    rows.push([l1, l2]);
    j += 2;
  }
  if (rows.length < 2) return { end: startIdx, table: null };
  return { end: j, table: rows };
}

function toGFMTable(rows) {
  const esc = (c) => c.replace(/\|/g, '\\|');
  const header = `| ${rows[0].map(esc).join(' | ')} |`;
  const sep = `| ${rows[0].map(() => '---').join(' | ')} |`;
  const rest = rows.slice(1).map((r) => `| ${r.map(esc).join(' | ')} |`);
  return [header, sep, ...rest].join('\n');
}

function bodyToMarkdown(serviceTitle, bodyText) {
  let t = bodyText.replace(/\r\n/g, '\n');
  t = t.replace(/\u2014/g, ', ').replace(/—/g, ', ');
  const lines = t.split('\n');
  const out = [];
  out.push(`# ${titleCaseH1(serviceTitle)}`);
  out.push('');

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) {
      i++;
      continue;
    }
    const sec = looksLikeOneLineHeader(trimmed);
    if (sec) {
      out.push('## ' + (sec === true ? trimmed : sec));
      out.push('');
      i++;
      const para = [];
      while (i < lines.length) {
        const L = lines[i].trim();
        if (!L) break;
        if (looksLikeOneLineHeader(L) || isAllCapsServiceTitleLine(L)) break;
        const tbl = tryPairTable(lines, i);
        if (tbl.table) {
          if (para.length) {
            out.push(para.join(' '));
            out.push('');
            para.length = 0;
          }
          out.push(toGFMTable(tbl.table));
          out.push('');
          i = tbl.end;
          break;
        }
        para.push(L);
        i++;
      }
      if (para.length) {
        out.push(para.join(' '));
        out.push('');
      }
      continue;
    }
    if (isAllCapsServiceTitleLine(trimmed)) {
      // duplicate title line inside chunk, skip
      i++;
      continue;
    }
    const run = [trimmed];
    i++;
    while (i < lines.length) {
      const L = lines[i].trim();
      if (!L) break;
      if (looksLikeOneLineHeader(L) || isAllCapsServiceTitleLine(L)) break;
      run.push(L);
      i++;
    }
    out.push(run.join(' '));
    out.push('');
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function titleCaseH1(s) {
  return s
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** Split: find `N. ALL CAPS` service title lines, slice between them */
function splitServices(rawText) {
  const text = rawText
    .replace(/<user_query>\s*/gi, '')
    .replace(/<\/user_query>\s*/gi, '')
    .replace(/\r\n/g, '\n');
  const batchIdx = text.search(/BATCH\s+\d+\s*:/i);
  const rest = batchIdx >= 0 ? text.slice(batchIdx) : text;
  const lines = rest.split('\n');
  const idxs = [];
  for (let i = 0; i < lines.length; i++) {
    const m = isAllCapsServiceTitleLine(lines[i]);
    if (m) idxs.push({ i, m });
  }
  const chunks = [];
  for (let k = 0; k < idxs.length; k++) {
    const a = idxs[k].i;
    const b = k + 1 < idxs.length ? idxs[k + 1].i : lines.length;
    const title = idxs[k].m.title;
    const body = lines.slice(a + 1, b).join('\n');
    chunks.push({ title, body });
  }
  return chunks;
}

function runBatch(num, cfg) {
  const rawPath = path.join(EXTRACTED, `batch-${num}-raw.txt`);
  if (!fs.existsSync(rawPath)) {
    console.warn('Missing', rawPath);
    return;
  }
  const raw = fs.readFileSync(rawPath, 'utf8');
  const chunks = splitServices(raw);
  if (chunks.length !== cfg.ids.length) {
    console.error(
      `Batch ${num}: service count mismatch: got ${chunks.length}, expected ${cfg.ids.length} for ${cfg.dir}`
    );
    for (const c of chunks) console.error('  -', c.title);
    return;
  }
  const outDir = path.join(ROOT, 'tmp', cfg.dir);
  fs.mkdirSync(outDir, { recursive: true });
  for (let i = 0; i < cfg.ids.length; i++) {
    const id = cfg.ids[i];
    const { title, body } = chunks[i];
    const md = bodyToMarkdown(title, body);
    const f = path.join(outDir, `${id}.md`);
    fs.writeFileSync(f, md, 'utf8');
    console.log('Wrote', f, `(${md.length} chars)`);
  }
}

for (const [n, cfg] of Object.entries(CONFIG)) {
  runBatch(Number(n), cfg);
}
console.log('Done.');
