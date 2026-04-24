/**
 * Normalizes pasted / legacy service About markdown so RichContent renders
 * structured lists and FAQ accordions:
 * - "Step 1 , … Step 2 , …" run-on blocks → numbered list under ## Process
 * - "1. Q? A 2. Q? A" FAQ run-on → **Q?** answer paragraphs under ## Frequently asked questions
 * - em dash, " ,  " double-comma spacing
 *
 * Note: In JavaScript RegExp, \\Z is NOT end-of-string; it matches a literal "Z" and
 * was breaking non-greedy *? in the middle of long FAQ answers.
 */

const FAQ_H2 = /##\s*Frequently\s+asked\s+questions\b[^\n]*/i;
const PROCESS_H2 = /##\s*Process\b[^\n]*/i;

/**
 * Removes Chat / batch instructions that were accidentally pasted into the About field
 * (e.g. "Here are all service contents…", "You are a senior frontend…", dashed
 * "CONTENT CLEANING" / "STRUCTURE" blocks). These are not user-facing service copy.
 */
export function stripPastedMetaInstructions(raw) {
  if (typeof raw !== 'string' || !raw.trim()) return raw;
  let t = raw;
  // Meta lines sometimes appended right after a valid disclaimer
  t = t.replace(/\n+Here are all service contents[\s\S]*$/i, '');
  t = t.replace(/\n+You are a senior frontend engineer and content formatter\.[\s\S]*$/i, '');
  t = t.replace(
    /\n+[\s-]{3,}[^\n]*\bCONTENT CLEANING\b[^\n]*-*\s*\n+[\s\S]*$/i,
    ''
  );
  t = t.replace(/\n+={5,}[\s\n]*-+\s*OUTPUT EXPECTATION[-\s]*\n*[\s\S]*$/i, '');
  t = t.replace(/\n+[-]{3,}\s*EXECUTION:\s*[-]{3,}[\s\S]*$/i, '');
  return t.trimEnd();
}

export function normalizeServiceAbout(raw) {
  if (typeof raw !== 'string' || !raw.trim()) return raw;
  let t = stripPastedMetaInstructions(raw);
  t = t.replace(/\u2014/g, ', ');
  t = t.replace(/\s+,/g, ',');
  t = t.replace(/ ,  /g, ', ');
  t = normalizeProcessSection(t);
  t = normalizeFaqSection(t);
  return t;
}

/**
 * index of the newline that starts the next H2 (##␠), or end of string.
 * Skips H3+ (###).
 */
function findEndBeforeNextH2(md, from) {
  for (let p = from; p < md.length; p++) {
    if (md[p] !== '\n') continue;
    if (p + 1 < md.length && md[p + 1] === '#' && md[p + 2] === '#') {
      if (p + 3 < md.length && md[p + 3] === ' ') return p;
    }
  }
  return md.length;
}

/**
 * Under first ## Process, if body contains Step N but not already a markdown ol.
 */
function normalizeProcessSection(md) {
  const idx = md.search(PROCESS_H2);
  if (idx < 0) return md;

  const m = md.slice(idx).match(/^(##\s*Process[^\n]*\n+)/i);
  if (!m) return md;

  const head = md.slice(0, idx);
  const headerBlock = m[0];
  const bodyStart = idx + headerBlock.length;
  const bodyEnd = findEndBeforeNextH2(md, bodyStart);
  const body = md.slice(bodyStart, bodyEnd);
  const after = md.slice(bodyEnd);

  const trimmed = body.replace(/^\n+/, '').replace(/\n+$/, '');
  if (/^\d+\.\s/m.test(trimmed)) return md;
  if (!/Step\s+\d+/i.test(trimmed)) return md;

  const parts = trimmed
    .split(/(?=Step\s+\d+[\s,:\-])/i)
    .map((p) => p.trim())
    .filter(Boolean);
  const items = [];
  for (const p of parts) {
    const step = p.match(/^Step\s+(\d+)[\s,:\-]+\s*([\s\S]+)$/i);
    if (step) items.push(`${step[1]}. ${step[2].replace(/\s+/g, ' ').trim()}`);
  }
  if (items.length < 2) return md;

  return head + headerBlock + items.join('\n\n') + '\n\n' + after;
}

/**
 * Under first FAQ H2, convert "1. …? … 2. …" into **question?** answer blocks.
 */
function normalizeFaqSection(md) {
  const idx = md.search(FAQ_H2);
  if (idx < 0) return md;

  const m = md.slice(idx).match(/^(##\s*Frequently\s+asked\s+questions[^\n]*\n+)/i);
  if (!m) return md;

  const before = md.slice(0, idx);
  const headerBlock = m[0];
  const bodyStart = idx + headerBlock.length;
  const bodyEnd = findEndBeforeNextH2(md, bodyStart);
  const body = md.slice(bodyStart, bodyEnd).trim();
  const after = md.slice(bodyEnd);

  if (body.match(/^\*\*[^*]/)) return md;
  if (!/^\d+\.\s+/.test(body)) return md;

  // Run-on like "1. Q? A. 2. Q? A" — next item is "2. 3. …" after ". " before a digit+dot
  let chunks = body
    .split(/(?<=[.!?…])\s+(?=\d+\.\s+[A-Za-z0-9"'])/u)
    .map((c) => c.trim())
    .filter(Boolean);
  if (chunks.length < 2) {
    chunks = body
      .split(/(?<=\?)\s+(?=\d+\.\s+)/)
      .map((c) => c.trim())
      .filter(Boolean);
  }
  if (chunks.length < 2) return md;

  const out = [];
  for (const ch of chunks) {
    const t = ch.replace(/^\d+\.\s+/, '').trim();
    const qEnd = t.indexOf('?');
    if (qEnd === -1) {
      if (t) out.push(t);
      continue;
    }
    const q = t.slice(0, qEnd + 1).trim();
    const a = t.slice(qEnd + 1).trim();
    if (q && a) out.push(`**${q}** ${a}`);
  }
  if (out.length < 2) return md;

  return before + headerBlock + out.join('\n\n') + '\n\n' + after;
}

export function countStructureSignals(content) {
  const c = content || '';
  return {
    hasTable: /^\|[^\n]+\|\s*$/m.test(c) && /^\|[-:\s|]+\|$/m.test(c),
    hasProcessList: /##\s*Process[^\n]*\n\n(\d+\.\s)/is.test(c),
    hasFaqBold: /##\s*Frequently\s+asked\s+questions[^\n]*\n\n\*\*[^*]+\*\*/is.test(c),
    runonStep: /##\s*Process[^]*Step\s+\d+[^]*Step\s+\d+/is.test(c) && !/##\s*Process[^]*\n\n\d+\.\s/s.test(c),
  };
}
