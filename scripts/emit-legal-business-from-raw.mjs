#!/usr/bin/env node
/**
 * Regenerates tmp/legal-batch1/ and tmp/business-reg-batch2/ from
 * tmp/extracted-user-batches/batch-1-raw.txt and batch-2-raw.txt (verbatim
 * user content, with markdown structure: H1, ## sections, GFM tables).
 *
 * Run: node scripts/emit-legal-business-from-raw.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const EX = path.join(ROOT, 'tmp/extracted-user-batches');

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const LEGAL_ID_BY_NUM = {
  1: 'indian-subsidiary-annual-compliance',
  2: 'llp-annual-compliance',
  3: 'opc-annual-compliance',
  4: 'partnership-annual-compliance',
  5: 'private-ltd-annual-compliance',
  6: 'public-limited-annual-compliance',
  7: 'proprietorship-annual-compliance',
  8: 'section-8-annual-compliance',
};

const BUSINESS_TITLES = [
  'HUF REGISTRATION',
  'INDIAN SUBSIDIARY OF FOREIGN COMPANY REGISTRATION',
  'LLP REGISTRATION',
  'LOGO DESIGNING',
  'NIDHI COMPANY REGISTRATION',
  'ONE PERSON COMPANY REGISTRATION',
  'PARTNERSHIP REGISTRATION',
  'PRIVATE LIMITED COMPANY REGISTRATION',
  'PRODUCER COMPANY REGISTRATION',
  'PUBLIC LIMITED COMPANY REGISTRATION',
  'SECTION 8 COMPANY REGISTRATION',
  'SOCIETY REGISTRATION',
  'TRUST REGISTRATION',
];

const BUSINESS_ID_BY_TITLE = {
  'HUF REGISTRATION': 'huf-registration',
  'INDIAN SUBSIDIARY OF FOREIGN COMPANY REGISTRATION': 'indian-subsidiary-foreign-company',
  'LLP REGISTRATION': 'llp-registration',
  'LOGO DESIGNING': 'logo-designing',
  'NIDHI COMPANY REGISTRATION': 'nidhi-company',
  'ONE PERSON COMPANY REGISTRATION': 'one-person-company',
  'PARTNERSHIP REGISTRATION': 'partnership-registration',
  'PRIVATE LIMITED COMPANY REGISTRATION': 'private-limited-company',
  'PRODUCER COMPANY REGISTRATION': 'producer-company',
  'PUBLIC LIMITED COMPANY REGISTRATION': 'public-limited-company',
  'SECTION 8 COMPANY REGISTRATION': 'section-8-company',
  'SOCIETY REGISTRATION': 'society-registration',
  'TRUST REGISTRATION': 'trust-registration',
};

/** Numbered `N. Name` in legal/business raws (after BATCH line; excludes process-step sentences) */
const NUMBERED_HEADINGS = new Set(
  `overview,applicability,compliance requirements,benefits,penalties / risks,documents required,process / timeline,government fees,compliance calendar,faqs,features,advantages,limitations,documents,process,timeline,comparison,10. faqs,11. faqs`
    .toLowerCase()
    .split(',')
    .map((s) => s.replace(/^\d+\.\s+/, '').trim())
);
(function () {
  const extra = `Overview,Applicability,Compliance requirements,Benefits,Penalties / risks,Documents required,Process / Timeline,Process / timeline,Government fees,Compliance calendar,FAQs,Features,Advantages,Limitations,Documents,Process,Timeline,Comparison,10. FAQs,11. FAQs,Key features`
    .split(',')
    .map((s) => s.trim().toLowerCase());
  extra.forEach((e) => NUMBERED_HEADINGS.add(e));
})();

function cleanUserBlock(t) {
  return t
    .replace(/<user_query>\s*/gi, '')
    .replace(/<\/user_query>\s*/gi, '')
    .replace(/\r\n/g, '\n');
}

function emDashForBody(t) {
  return t
    .replace(/\u2014/g, ', ')
    .replace(/—/g, ', ')
    .replace(/\u2013/g, ' - ');
}

function titleCaseH1(s) {
  return s
    .split(' ')
    .map((w) => {
      if (w.length >= 2 && w.length <= 4 && w === w.toUpperCase() && /^[A-Z]+$/.test(w)) {
        return w;
      }
      if (w === w.toUpperCase() && w.length > 1) {
        return w.charAt(0) + w.slice(1).toLowerCase();
      }
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(' ');
}

function toGFMTable(rows) {
  const esc = (c) => c.replace(/\|/g, '\\|');
  const header = `| ${rows[0].map(esc).join(' | ')} |`;
  const sep = `| ${rows[0].map(() => '---').join(' | ')} |`;
  const rest = rows.slice(1).map((r) => `| ${r.map(esc).join(' | ')} |`);
  return [header, sep, ...rest].join('\n');
}

function isNumberedSectionLine(trimmed) {
  const m = trimmed.match(/^(\d+)\.\s+(.+)$/);
  if (!m) return null;
  const rest = m[2].trim();
  const k = rest.toLowerCase();
  if (NUMBERED_HEADINGS.has(k)) return '## ' + rest;
  return null;
}

function normalizeNumberedSectionLines(t) {
  const out = [];
  for (const line of t.split('\n')) {
    const s = line.trim();
    if (!s) {
      out.push(line);
      continue;
    }
    const h2 = isNumberedSectionLine(s);
    if (h2) out.push(h2);
    else out.push(line);
  }
  return out.join('\n');
}

/**
 * 4 line headers, then 4xN data rows. Stops on blank, ##, or Q1. style when not in table
 */
function try4ColTable(lines, i) {
  if (i + 7 > lines.length) return null;
  const c0 = lines[i].trim();
  const c1 = lines[i + 1].trim();
  const c2 = lines[i + 2].trim();
  const c3 = lines[i + 3].trim();
  if (!c0 || !c1 || !c2 || !c3) return null;
  if (c0.startsWith('##') || c0.startsWith('Q') || /^Q\d+\./.test(c0)) return null;
  if (c0.length > 200 || c1.length > 200 || c2.length > 200 || c3.length > 200) return null;
  if ([c0, c1, c2, c3].some((c) => /^##\s/.test(c))) return null;
  const rows = [[c0, c1, c2, c3]];
  let j = i + 4;
  while (j + 3 < lines.length) {
    const a = lines[j].trim();
    const b = lines[j + 1].trim();
    const c = lines[j + 2].trim();
    const d = lines[j + 3].trim();
    if (a === '' && b === '' && c === '' && d === '') break;
    if (a === '' && !b) break;
    if (a.startsWith('##') || a.startsWith('Q1.') || /^Q\d+\./.test(a)) break;
    if (!a && !b && !c) break;
    if (!a || !b || !c || !d) {
      if (a && !b) break;
      break;
    }
    if (a.length > 240 || b.length > 240 || c.length > 240 || d.length > 240) {
      break;
    }
    rows.push([a, b, c, d]);
    j += 4;
  }
  if (rows.length < 2) return null;
  return { end: j, rows };
}

const TWO_COL_HEADERS = [
  ['non-compliance', 'penalty'],
  ['non-compliance / risk', 'penalty'],
  ['document', 'details'],
  ['document', 'purpose'],
  ['document', 'requirement'],
  ['month', 'activity'],
  ['form', 'capital based fee range'],
  ['service', 'fee range'],
  ['sl', 'form'],
  ['sl no', 'form'],
  ['sl.', 'form'],
  ['category', 'fee'],
  ['form', 'fee'],
];

function twoColKey(a, b) {
  return [a, b].map((s) => s.toLowerCase().replace(/\s+/g, ' ').trim());
}

function isKnownTwoColHeaderPair(a, b) {
  const k = twoColKey(a, b);
  for (const [h1, h2] of TWO_COL_HEADERS) {
    if (k[0] === h1 && k[1] === h2) return true;
  }
  return false;
}

function try2ColTable(lines, i) {
  if (i + 1 >= lines.length) return null;
  const a = lines[i].trim();
  const b = lines[i + 1].trim();
  if (!a || !b) return null;
  const k = twoColKey(a, b);
  let matched = false;
  for (const [h1, h2] of TWO_COL_HEADERS) {
    if (k[0] === h1 && k[1] === h2) {
      matched = true;
      break;
    }
  }
  if (!matched) return null;
  const rows = [
    [a, b],
    ...[],
  ];
  let j = i + 2;
  while (j + 1 < lines.length) {
    const c = lines[j].trim();
    const d = lines[j + 1].trim();
    if (c === '' && d === '') break;
    if (!c) break;
    if (c.startsWith('##') || /^Q\d+\./.test(c)) break;
    if (c && !d) break;
    if (c && d) {
      if (isKnownTwoColHeaderPair(c, d) && rows.length >= 2) break;
      if (c.length > 200 || d.length > 200) {
        if (d.length > 200 && j > i + 2) {
          j -= 2;
        }
        break;
      }
      rows.push([c, d]);
    }
    j += 2;
  }
  if (rows.length < 2) return null;
  return { end: j, rows };
}

function isFaqLine(line) {
  return /^Q\d+\./.test(line.trim());
}

function formatServiceBody(h1, bodyText) {
  let t = emDashForBody(cleanUserBlock(bodyText));
  t = normalizeNumberedSectionLines(t);
  const lines = t.split('\n');
  const out = [];
  out.push(`# ${titleCaseH1(h1)}`, '');

  let i = 0;
  while (i < lines.length) {
    const trimmed = lines[i].trim();
    if (!trimmed) {
      i++;
      continue;
    }
    if (trimmed.startsWith('## ')) {
      out.push(trimmed, '');
      i++;
      const para = [];
      while (i < lines.length) {
        const L = lines[i].trim();
        if (!L) {
          i++;
          if (para.length) {
            out.push(para.join(' '));
            out.push('');
            para.length = 0;
          }
          break;
        }
        if (L.startsWith('## ')) {
          if (para.length) {
            out.push(para.join(' '));
            out.push('');
            para.length = 0;
          }
          break;
        }
        if (isFaqLine(L)) {
          if (para.length) {
            out.push(para.join(' '));
            out.push('');
            para.length = 0;
          }
          const faq = [];
          while (i < lines.length) {
            const f = lines[i].trim();
            if (!f) break;
            if (f.startsWith('## ')) break;
            if (!isFaqLine(f)) break;
            faq.push(f);
            i++;
          }
          for (const q of faq) {
            const m = q.match(/^(Q\d+\.\s+)(.+)$/);
            if (m) {
              const restq = m[2];
              const at = restq.indexOf('?');
              if (at > 0) {
                out.push('**' + m[1] + restq.slice(0, at + 1) + '** ' + restq.slice(at + 1).trim());
              } else {
                out.push('**' + q + '**');
              }
            } else {
              out.push(q);
            }
            out.push('');
          }
          continue;
        }
        const t2 = try2ColTable(lines, i);
        if (t2 && t2.rows.length > 0) {
          if (para.length) {
            out.push(para.join(' '));
            out.push('');
            para.length = 0;
          }
          out.push(toGFMTable(t2.rows));
          out.push('');
          i = t2.end;
          continue;
        }
        const t4 = try4ColTable(lines, i);
        if (t4 && t4.rows.length > 0) {
          if (para.length) {
            out.push(para.join(' '));
            out.push('');
            para.length = 0;
          }
          out.push(toGFMTable(t4.rows));
          out.push('');
          i = t4.end;
          continue;
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
    const t2b = try2ColTable(lines, i);
    if (t2b) {
      out.push(toGFMTable(t2b.rows), '');
      i = t2b.end;
      continue;
    }
    const t4b = try4ColTable(lines, i);
    if (t4b) {
      out.push(toGFMTable(t4b.rows), '');
      i = t4b.end;
      continue;
    }
    const run = [trimmed];
    i++;
    while (i < lines.length) {
      const L = lines[i].trim();
      if (!L) break;
      if (L.startsWith('## ')) break;
      if (try2ColTable(lines, i) || try4ColTable(lines, i)) break;
      if (isFaqLine(L)) break;
      run.push(L);
      i++;
    }
    out.push(run.join(' '), '');
  }
  return out
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim() + '\n';
}

function splitLegal(text) {
  const t = cleanUserBlock(text);
  const re = /^SERVICE (\d+):\s*([^\n]+)$/gm;
  const matches = [...t.matchAll(re)];
  if (matches.length === 0) return [];
  const out = [];
  for (let k = 0; k < matches.length; k++) {
    const start = matches[k].index + matches[k][0].length;
    const end = k + 1 < matches.length ? matches[k + 1].index : t.length;
    const num = matches[k][1];
    const title = matches[k][2].trim();
    const body = t.slice(start, end).trim();
    out.push({ num, title, body });
  }
  return out;
}

function splitBusiness(text) {
  const t = cleanUserBlock(text);
  const idx = t.search(/BATCH\s*2\s*:/i);
  const rest = idx >= 0 ? t.slice(idx) : t;
  const positions = [];
  for (const title of BUSINESS_TITLES) {
    const re = new RegExp('(^|\\n)(' + escapeRe(title) + ')(?=\\n|$)', 'i');
    const m = re.exec(rest);
    if (m) {
      const start = m.index + m[1].length;
      positions.push({ title, start });
    } else {
      console.error('Missing business title in raw:', title);
    }
  }
  positions.sort((a, b) => a.start - b.start);
  if (positions.length !== BUSINESS_TITLES.length) {
    console.error('Expected', BUSINESS_TITLES.length, 'title markers, found', positions.length);
  }
  const chunks = [];
  for (let k = 0; k < positions.length; k++) {
    const end = k + 1 < positions.length ? positions[k + 1].start : rest.length;
    const block = rest.slice(positions[k].start, end).trim();
    const n = block.indexOf('\n');
    const line0 = n < 0 ? block : block.slice(0, n);
    const body = n < 0 ? '' : block.slice(n + 1).trim();
    chunks.push({ title: line0.trim(), body });
  }
  return chunks;
}

function runLegal() {
  const f = path.join(EX, 'batch-1-raw.txt');
  if (!fs.existsSync(f)) {
    console.warn('Missing', f);
    return;
  }
  const text = fs.readFileSync(f, 'utf8');
  const list = splitLegal(text);
  const outDir = path.join(ROOT, 'tmp/legal-batch1');
  fs.mkdirSync(outDir, { recursive: true });
  for (const { num, title, body } of list) {
    const id = LEGAL_ID_BY_NUM[Number(num)];
    if (!id) {
      console.error('Unknown service number', num, title);
      continue;
    }
    const md = formatServiceBody(title, body);
    const out = path.join(outDir, `${id}.md`);
    fs.writeFileSync(out, md, 'utf8');
    console.log('Wrote', out, `(${md.length} chars)`);
  }
  if (list.length !== 8) console.error('Legal: expected 8 services, got', list.length);
}

function runBusiness() {
  const f = path.join(EX, 'batch-2-raw.txt');
  if (!fs.existsSync(f)) {
    console.warn('Missing', f);
    return;
  }
  const text = fs.readFileSync(f, 'utf8');
  const list = splitBusiness(text);
  const outDir = path.join(ROOT, 'tmp/business-reg-batch2');
  fs.mkdirSync(outDir, { recursive: true });
  for (const { title, body } of list) {
    const want = title.toUpperCase();
    const id = BUSINESS_ID_BY_TITLE[want];
    if (!id) {
      console.error('No id for business title', title);
      continue;
    }
    const md = formatServiceBody(title, body);
    const out = path.join(outDir, `${id}.md`);
    fs.writeFileSync(out, md, 'utf8');
    console.log('Wrote', out, `(${md.length} chars)`);
  }
  if (list.length !== 13) console.error('Business: expected 13 services, got', list.length);
}

runLegal();
runBusiness();
console.log('Done (legal + business).');
