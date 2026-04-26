/**
 * Restructures long-form income-tax (batch 9) service markdown so RichContent
 * can parse it: GFM table rows, plain grids, and loose list markers. Does not
 * change wording.
 */

function splitTableRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/u, '');
  return trimmed.split('|').map((c) => c.trim());
}

function isTableSeparatorLine(line: string): boolean {
  const t = line.trim();
  if (!t.startsWith('|') || !t.endsWith('|')) return false;
  const cells = splitTableRow(t);
  if (cells.length === 0) return false;
  return cells.every((c) => /^:?-{2,}:?$/.test(c));
}

function findNextNonEmptyIndex(lines: string[], from: number): number {
  let j = from;
  while (j < lines.length && !lines[j].trim()) j++;
  return j;
}

function isBoldSectionLine(s: string): boolean {
  const t = s.trim();
  if (!t.startsWith('**')) return false;
  if (t.startsWith('**') && t.endsWith('**') && t.length > 4) {
    if (/^\*\*[^*]+:\*\*\s*$/u.test(t)) return true;
    if (t.length < 200) return true;
  }
  return false;
}

function fixGfmOrphanDataRows(input: string): string {
  const lines = input.split('\n');
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const t = lines[i].trim();
    const looksLikeHeader = t.startsWith('|') && t.endsWith('|') && !isTableSeparatorLine(t);
    if (looksLikeHeader) {
      const sepIdx = findNextNonEmptyIndex(lines, i + 1);
      if (sepIdx < lines.length && isTableSeparatorLine(lines[sepIdx].trim())) {
        const headerCells = splitTableRow(t);
        const colN = headerCells.length;
        if (colN >= 2) {
          out.push(lines[i], lines[sepIdx]);
          let j = findNextNonEmptyIndex(lines, sepIdx + 1);
          const orphans: string[] = [];
          while (j < lines.length) {
            const w = lines[j].trim();
            if (!w) {
              if (orphans.length > 0) break;
              j++;
              continue;
            }
            if (w.startsWith('##') || w.startsWith('###') || w.startsWith('####')) break;
            if (w === '#') break;
            if (w.startsWith('> ')) break;
            if (w.startsWith('- ') || w.startsWith('* ')) break;
            if (/^\d+\.\s/.test(w)) break;
            if (w.startsWith('|') && w.endsWith('|') && !isTableSeparatorLine(w) && orphans.length === 0) {
              break;
            }
            if (w.startsWith('|') && w.endsWith('|') && !isTableSeparatorLine(w) && orphans.length > 0) {
              break;
            }
            if (isBoldSectionLine(w) && orphans.length > 0) {
              if (/^\*\*[^*]+:\*\*\s*$/u.test(w)) break;
            }
            orphans.push(lines[j]);
            j++;
          }
          if (colN === 3 && orphans.length >= 2) {
            const a = orphans[0].trim();
            const b = orphans[1].trim();
            if (a === headerCells[1] && b === headerCells[2]) {
              orphans.splice(0, 2);
            }
          }
          for (let k = 0; k < orphans.length; k += colN) {
            const chunk = orphans.slice(k, k + colN);
            if (chunk.length < colN) {
              for (const x of chunk) out.push(x);
              break;
            }
            if (chunk.some((c) => !c.trim())) {
              for (const x of chunk) out.push(x);
              break;
            }
            out.push('| ' + chunk.map((c) => c.trim()).join(' | ') + ' |');
          }
          i = j;
          continue;
        }
      }
    }
    out.push(lines[i]);
    i++;
  }
  return out.join('\n');
}

const PAN_APPLICABILITY_BLOCK =
  /(## Applicability\n\nPAN is mandatory for:\n)Applicant Category\nRequirement\n([\s\S]*?)(\n\nMandatory quoting of PAN)/u;

function wrapPanApplicabilityToGfm(s: string): string {
  return s.replace(PAN_APPLICABILITY_BLOCK, (_M, pre, body, post) => {
    const lineList = body.trim().split('\n');
    if (lineList.length < 2 || lineList.length % 2 === 1) {
      return pre + 'Applicant Category\nRequirement\n' + body + post;
    }
    const rows: string[] = ['| Applicant Category | Requirement |', '| --- | --- |'];
    for (let r = 0; r < lineList.length; r += 2) {
      if (r + 1 < lineList.length) {
        rows.push(`| ${lineList[r].trim()} | ${lineList[r + 1].trim()} |`);
      }
    }
    return pre + rows.join('\n') + post;
  });
}

const PAN_DOCUMENTS_BLOCK =
  /(## Documents\n\n)Applicant Type\nIdentity Proof\nAddress Proof\nDate of Birth Proof\n([\s\S]*?)(\n## Process\n)/u;

function wrapPanDocumentsToGfm(s: string): string {
  return s.replace(PAN_DOCUMENTS_BLOCK, (_M, pre, body, post) => {
    const lineList = body.trim().split('\n');
    if (lineList.length < 4 || lineList.length % 4 !== 0) {
      return pre + 'Applicant Type\nIdentity Proof\nAddress Proof\nDate of Birth Proof\n' + body + post;
    }
    const rows: string[] = [
      '| Applicant Type | Identity Proof | Address Proof | Date of Birth Proof |',
      '| --- | --- | --- | --- |',
    ];
    for (let r = 0; r < lineList.length; r += 4) {
      rows.push(
        `| ${lineList[r].trim()} | ${lineList[r + 1].trim()} | ${lineList[r + 2].trim()} | ${lineList[r + 3].trim()} |`
      );
    }
    return pre + rows.join('\n') + post;
  });
}

function wrapItr2TwoColGrid(s: string): string {
  return s.replace(
    /(ITR-2 is applicable for:\n)Income Source\nITR-2 Applicable\n([\s\S]*?)(\n\n\*\*ITR-2 CANNOT be used if:\*\*)/u,
    (_M, pre, body, post) => {
      const L = body.trim().split('\n');
      if (L.length < 2 || L.length % 2 === 1) return pre + 'Income Source\nITR-2 Applicable\n' + body + post;
      const rows: string[] = ['| Income Source | ITR-2 Applicable |', '| --- | --- |'];
      for (let r = 0; r < L.length; r += 2) {
        if (r + 1 < L.length) rows.push(`| ${L[r].trim()} | ${L[r + 1].trim()} |`);
      }
      return pre + rows.join('\n') + post;
    }
  );
}

function wrapItr3TwoColGrid(s: string): string {
  return s.replace(
    /(ITR-3 is applicable for individuals and HUFs who have:\n)Income Source\nITR-3\n([\s\S]*?)(\n\nITR-3 vs\. ITR-4:)/u,
    (_M, pre, body, post) => {
      const L = body.trim().split('\n');
      if (L.length < 2 || L.length % 2 === 1) return pre + 'Income Source\nITR-3\n' + body + post;
      const rows: string[] = ['| Income Source | ITR-3 |', '| --- | --- |'];
      for (let r = 0; r < L.length; r += 2) {
        if (r + 1 < L.length) rows.push(`| ${L[r].trim()} | ${L[r + 1].trim()} |`);
      }
      return pre + rows.join('\n') + post;
    }
  );
}

function wrapItr5TwoColGrid(s: string): string {
  return s.replace(
    /(ITR-5 is applicable for:\n)Entity Type\nITR-5\n([\s\S]*?)(\n\nNot applicable for:)/u,
    (_M, pre, body, post) => {
      const L = body.trim().split('\n');
      if (L.length < 2 || L.length % 2 === 1) return pre + 'Entity Type\nITR-5\n' + body + post;
      const rows: string[] = ['| Entity Type | ITR-5 |', '| --- | --- |'];
      for (let r = 0; r < L.length; r += 2) {
        if (r + 1 < L.length) rows.push(`| ${L[r].trim()} | ${L[r + 1].trim()} |`);
      }
      return pre + rows.join('\n') + post;
    }
  );
}

function wrapItr6TwoColGrid(s: string): string {
  return s.replace(
    /(ITR-6 is mandatory for:\n)Entity Type\nITR-6\n([\s\S]*?)(\n\n\*\*Not applicable for:\*\*)/u,
    (_M, pre, body, post) => {
      const L = body.trim().split('\n');
      if (L.length < 2 || L.length % 2 === 1) return pre + 'Entity Type\nITR-6\n' + body + post;
      const rows: string[] = ['| Entity Type | ITR-6 |', '| --- | --- |'];
      for (let r = 0; r < L.length; r += 2) {
        if (r + 1 < L.length) rows.push(`| ${L[r].trim()} | ${L[r + 1].trim()} |`);
      }
      return pre + rows.join('\n') + post;
    }
  );
}

function listifyItr4Applicability(s: string): string {
  return s.replace(
    /(## Applicability\n\nITR-4 \(Sugam\) is applicable for:\n)([\s\S]+?)(\n\*\*ITR-4 CANNOT be used if:\*\*)/u,
    (_M, pre, body, br) => {
      const lines = body.split('\n');
      const out = lines.map((line) => {
        const t = line.trim();
        if (!t) return '';
        if (t.startsWith('- ')) return line;
        return '- ' + t;
      });
      return pre + out.join('\n') + br;
    }
  );
}

function listifyItr7Applicability(s: string): string {
  return s.replace(
    /(## Applicability\n\nITR-7 is applicable for:\n)([\s\S]+?)(\nNot applicable for: Individuals, HUFs, firms, LLPs, or regular companies not claiming charitable\/institutional exemption\.\n\n## Features)/u,
    (_M, pre, body, post) => {
      const lines = body.split('\n');
      const out = lines.map((line) => {
        const t = line.trim();
        if (!t) return '';
        if (t.startsWith('- ')) return line;
        return '- ' + t;
      });
      return pre + out.join('\n') + post;
    }
  );
}

function listifyTdsApplicabilityList(s: string): string {
  return s.replace(
    /(TDS Return Filing is mandatory for:\n)([\s\S]+?)(\nNIL TDS Returns: [^\n]+)/u,
    (_M, pre, mid, end) => {
      const lines = mid.split('\n');
      const out: string[] = [pre];
      for (const line of lines) {
        const t = line.trim();
        if (!t) {
          out.push('');
          continue;
        }
        if (t.startsWith('- ')) {
          out.push(line);
        } else {
          out.push('- ' + t);
        }
      }
      return out.join('\n') + end;
    }
  );
}

/**
 * `**X:**` (colon before closing bold) and lines until next section.
 */
function prefixLinesAfterBoldColon(s: string): string {
  const lines = s.split('\n');
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const t = lines[i].trim();
    if (/^\*\*[^*]+:\*\*\s*$/u.test(t)) {
      out.push(lines[i]);
      i++;
      while (i < lines.length) {
        const u = lines[i];
        const ut = u.trim();
        if (!ut) {
          out.push(u);
          i++;
          continue;
        }
        if (ut.startsWith('##') || ut.startsWith('###')) break;
        if (ut.startsWith('- ') || ut.startsWith('* ')) {
          out.push(u);
          i++;
          continue;
        }
        if (ut.startsWith('|') && ut.endsWith('|')) break;
        out.push('- ' + ut);
        i++;
      }
      continue;
    }
    out.push(lines[i]);
    i++;
  }
  return out.join('\n');
}

function listifyAppliesForBlock(s: string): string {
  const lines = s.split('\n');
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const raw = lines[i];
    const t = raw.trim();
    if (/applies for:\s*$/iu.test(t) && !t.startsWith('-')) {
      out.push(raw);
      i++;
      while (i < lines.length) {
        const u = lines[i];
        const ut = u.trim();
        if (!ut) {
          out.push(u);
          i++;
          break;
        }
        if (ut.startsWith('##') || ut.startsWith('###')) break;
        if (ut.startsWith('- ') || ut.startsWith('* ')) {
          out.push(u);
          i++;
          continue;
        }
        if (ut.startsWith('|') && ut.endsWith('|')) break;
        out.push('- ' + ut);
        i++;
      }
      continue;
    }
    out.push(raw);
    i++;
  }
  return out.join('\n');
}

function listifyFeaturesAndBenefits(s: string): string {
  const lines = s.split('\n');
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    if (/^## (Features|Benefits)\s*$/iu.test(lines[i].trim())) {
      out.push(lines[i]);
      i++;
      while (i < lines.length && !/^## /u.test(lines[i].trim())) {
        const line = lines[i];
        const t = line.trim();
        if (!t) {
          out.push(line);
          i++;
          continue;
        }
        if (t.startsWith('|') || t.startsWith('> ')) {
          out.push(line);
          i++;
          continue;
        }
        if (t.startsWith('- ') || t.startsWith('* ')) {
          out.push(line);
          i++;
          continue;
        }
        out.push('- ' + t);
        i++;
      }
      continue;
    }
    out.push(lines[i]);
    i++;
  }
  return out.join('\n');
}

export function preprocessIncomeTaxBatch9ServiceMarkdown(s: string): string {
  let r = s.replace(/\r\n/g, '\n');
  r = wrapPanApplicabilityToGfm(r);
  r = wrapPanDocumentsToGfm(r);
  r = wrapItr2TwoColGrid(r);
  r = wrapItr3TwoColGrid(r);
  r = wrapItr5TwoColGrid(r);
  r = wrapItr6TwoColGrid(r);
  r = listifyItr4Applicability(r);
  r = listifyItr7Applicability(r);
  r = listifyTdsApplicabilityList(r);
  r = fixGfmOrphanDataRows(r);
  r = prefixLinesAfterBoldColon(r);
  r = listifyAppliesForBlock(r);
  r = listifyFeaturesAndBenefits(r);
  return r;
}
