import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Info,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ChevronDown,
  FileText,
  Check,
  CheckCircle2,
} from 'lucide-react';

type Props = {
  content: string;
  className?: string;
  /** Show Table of Contents when >= 3 H2 sections. Default: true */
  showToc?: boolean;
  /**
   * Remove the first markdown H1 line (`# Document title …`). Service and article
   * pages already show the name in the UI, so the duplicate H1 is hidden and
   * future batch content can keep a leading H1 in source for exports without
   * showing raw `#` in the browser. Default false (admin preview shows full text).
   */
  stripLeadingH1?: boolean;
  /**
   * `service`: grouped H2 sections in cards, stronger ordered-list (step) visuals.
   * Other pages (articles, policies, admin) use `default` to preserve existing layout.
   */
  variant?: 'default' | 'service';
  /**
   * Optional layout preset for long-form service markdown (e.g. business conversion batch,
   * FEMA compliance batch 4). Only applied with `variant="service"`.
   */
  contentPreset?: 'business-conv-batch-3' | 'fema-batch-4';
};

type CalloutVariant = 'default' | 'note' | 'tip' | 'warn' | 'important';

type Block =
  | { type: 'h1'; text: string }
  | { type: 'h2'; text: string; id: string }
  | { type: 'h3'; text: string }
  | { type: 'h4'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'blockquote'; lines: string[]; variant: CalloutVariant; title: string | null }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'faq'; items: { q: string; a: string }[] };

function parseInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*|\[([^\]]+)\]\(([^)]+)\))/g);
  const nodes: React.ReactNode[] = [];
  let i = 0;
  while (i < parts.length) {
    const part = parts[i];
    if (!part) { i++; continue; }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      nodes.push(<strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>);
      i += 1;
    } else if (part.startsWith('[') && part.includes('](')) {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        nodes.push(
          <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer"
            className="text-blue-600 underline underline-offset-2 hover:text-blue-800 transition-colors">
            {match[1]}
          </a>
        );
        i += 3;
      } else { nodes.push(part); i++; }
    } else { nodes.push(part); i++; }
  }
  return nodes;
}

function sectionIdOf(rest: string): string {
  return `section-${rest.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)}`;
}

function extractSectionNum(text: string): { num: string | null; rest: string } {
  const m = text.match(/^(\d+)[\).:]\s+(.+)$/);
  if (m) return { num: m[1], rest: m[2] };
  return { num: null, rest: text };
}

/** Pipe-split a GFM table row. Trims cells and drops leading/trailing empties
 *  created by the outer `|` delimiters. */
function splitTableRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  return trimmed.split('|').map((c) => c.trim());
}

function isTableSeparator(line: string): boolean {
  const t = line.trim();
  if (!t.startsWith('|') || !t.endsWith('|')) return false;
  const cells = splitTableRow(t);
  if (cells.length === 0) return false;
  return cells.every((c) => /^:?-{2,}:?$/.test(c));
}

function indexOfNextNonEmptyLine(lines: string[], from: number): number {
  let j = from;
  while (j < lines.length && !lines[j].trim()) j++;
  return j;
}

/**
 * GFM table where header, separator, and/or data rows are separated by blank
 * lines (common in generated / pasted service copy). Returns null if this line
 * is not a table header row.
 */
function tryParseGfmTable(
  lines: string[],
  start: number
): { end: number; headers: string[]; rows: string[][] } | null {
  const t0 = lines[start].trim();
  if (!t0.startsWith('|') || !t0.endsWith('|') || isTableSeparator(t0)) return null;
  const sepIdx = indexOfNextNonEmptyLine(lines, start + 1);
  if (sepIdx >= lines.length || !isTableSeparator(lines[sepIdx])) return null;
  const headers = splitTableRow(t0);
  let i = sepIdx + 1;
  const rows: string[][] = [];
  while (i < lines.length) {
    i = indexOfNextNonEmptyLine(lines, i);
    if (i >= lines.length) break;
    const row = lines[i].trim();
    if (!row.startsWith('|') || !row.endsWith('|') || isTableSeparator(row)) break;
    rows.push(splitTableRow(row));
    i++;
  }
  return { end: i, headers, rows };
}

function parseBlocks(raw: string): Block[] {
  const lines = raw.split('\n');
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const trimmed = lines[i].trim();
    if (!trimmed) { i++; continue; }
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      i++;
      continue;
    }
    const gfmTable = tryParseGfmTable(lines, i);
    if (gfmTable) {
      i = gfmTable.end;
      blocks.push({ type: 'table', headers: gfmTable.headers, rows: gfmTable.rows });
      continue;
    }
    if (trimmed.startsWith('## ')) {
      const text = trimmed.slice(3).trim();
      const { rest } = extractSectionNum(text);
      blocks.push({ type: 'h2', text, id: sectionIdOf(rest) });
      i++;
    } else if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'h3', text: trimmed.slice(4).trim() });
      i++;
    } else if (trimmed.startsWith('#### ')) {
      blocks.push({ type: 'h4', text: trimmed.slice(5).trim() });
      i++;
    } else if (trimmed.startsWith('# ')) {
      blocks.push({ type: 'h1', text: trimmed.slice(2).trim() });
      i++;
    } else if (trimmed.startsWith('> ')) {
      const bqLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        bqLines.push(lines[i].trim().slice(2).trim());
        i++;
      }
      // GitHub-style callout marker on the first line, e.g.
      //   > [!IMPORTANT] Optional title
      //   > body line 1
      let variant: CalloutVariant = 'default';
      let title: string | null = null;
      if (bqLines.length > 0) {
        const m = bqLines[0].match(/^\[!(NOTE|TIP|WARN|WARNING|IMPORTANT)\]\s*(.*)$/);
        if (m) {
          const tag = m[1].toUpperCase();
          variant =
            tag === 'NOTE' ? 'note'
            : tag === 'TIP' ? 'tip'
            : tag === 'IMPORTANT' ? 'important'
            : 'warn';
          title = m[2].trim() ? m[2].trim() : null;
          bqLines.shift();
        }
      }
      blocks.push({ type: 'blockquote', lines: bqLines, variant, title });
    } else if (/^[-*] /.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*] /, ''));
        i++;
      }
      blocks.push({ type: 'ul', items });
    } else if (/^\d+\.\s/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ''));
        i++;
      }
      blocks.push({ type: 'ol', items });
    } else {
      let para = trimmed;
      i++;
      while (i < lines.length) {
        const next = lines[i].trim();
        if (!next || next.startsWith('## ') || next.startsWith('### ') || next.startsWith('#### ') ||
          next.startsWith('# ') ||
          /^[-*] /.test(next) || /^\d+\.\s/.test(next) || next.startsWith('> ') ||
          (next.startsWith('|') && next.endsWith('|'))) break;
        para += ' ' + next;
        i++;
      }
      blocks.push({ type: 'p', text: para });
    }
  }
  return blocks;
}

/**
 * Section titles that should become FAQ accordions. Many pages use
 * "FAQs on …", "Common questions", "Q & A" instead of "Frequently asked questions".
 */
const FAQ_H2 =
  /\b(?:faqs?|frequently asked questions|common questions|questions?\s+and\s+answers?|q\s*&\s*a)\b/i;

/**
 * `Q1. First question? Answer text Q2. Second question? …` in one or more paragraphs.
 */
function splitRunOnNumberedFaq(text: string): { q: string; a: string }[] {
  const t = text.trim();
  if (!/Q[0-9]+\./i.test(t)) return [];
  const parts = t
    .split(/(?=Q[0-9]+\.\s)/i)
    .map((p) => p.trim())
    .filter((p) => p.length);
  return parts
    .map((part) => parseOneNumberedFaqChunk(part))
    .filter((x): x is { q: string; a: string } => x !== null);
}

function parseOneNumberedFaqChunk(chunk: string): { q: string; a: string } | null {
  const m = chunk.match(/^Q[0-9]+\.\s*([\s\S]+)$/i);
  if (!m) return null;
  const body = m[1].trim();
  const qIdx = body.indexOf('?');
  if (qIdx !== -1 && qIdx <= 500) {
    return { q: body.slice(0, qIdx + 1).trim(), a: body.slice(qIdx + 1).trim() };
  }
  const firstSentence = body.search(/[.?:]\s+/);
  if (firstSentence !== -1 && firstSentence < 320) {
    return {
      q: body.slice(0, firstSentence + 1).trim(),
      a: body.slice(firstSentence + 1).trim(),
    };
  }
  if (body.length) {
    return { q: body.slice(0, Math.min(160, body.length)).trim(), a: body.slice(Math.min(160, body.length)).trim() };
  }
  return null;
}

function tryParseFaqListItem(item: string): { q: string; a: string } | null {
  const t = item.trim();
  const bold = t.match(/^\*\*(.+?)\*\*\s*([\s\S]*)$/);
  if (bold) return { q: bold[1].trim(), a: bold[2].trim() };
  const qn = t.match(/^Q[0-9]+\.\s+([^\?]+\?)\s*([\s\S]*)$/i);
  if (qn) return { q: qn[1].trim(), a: qn[2].trim() };
  return null;
}

/**
 * After an FAQ H2, collect: `**Q**` paragraphs, run-on `Q1./Q2.` blocks, and
 * ul/ol whose items look like Q&A. Stops at the next H1/H2 or a block that
 * cannot be interpreted as part of the FAQ.
 */
function extractFaqAccordion(blocks: Block[]): Block[] {
  const out: Block[] = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.type === 'h2' && FAQ_H2.test(b.text)) {
      out.push(b);
      i++;
      const items: { q: string; a: string }[] = [];
      while (i < blocks.length) {
        const n = blocks[i];
        if (n.type === 'h2' || n.type === 'h1') break;

        if (n.type === 'ul' || n.type === 'ol') {
          const parsed = n.items.map(tryParseFaqListItem);
          if (parsed.length && parsed.every((x) => x !== null)) {
            for (const p of parsed) if (p) items.push(p);
            i++;
            continue;
          }
          break;
        }

        if (n.type !== 'p') break;

        const t = n.text.trim();
        if (t === '---' || t === '***' || t === '___') {
          i++;
          continue;
        }

        const m = t.match(/^\*\*(.+?)\*\*\s*([\s\S]*)$/);
        if (m) {
          let a = m[2].trim();
          i++;
          while (i < blocks.length) {
            const nb = blocks[i];
            if (nb.type !== 'p') break;
            const t2 = nb.text.trim();
            if (/^\*\*(.+?)\*\*/.test(t2)) break;
            if (splitRunOnNumberedFaq(t2).length > 0) break;
            if (t2) a = a ? `${a}\n\n${t2}` : t2;
            i++;
          }
          items.push({ q: m[1].trim(), a });
          continue;
        }

        const run = splitRunOnNumberedFaq(t);
        if (run.length) {
          items.push(...run);
          i++;
          continue;
        }
        break;
      }
      if (items.length) out.push({ type: 'faq', items });
      continue;
    }
    out.push(b);
    i++;
  }
  return out;
}

function stripLeadingH1Line(raw: string): string {
  return raw.replace(/^#[ \t]([^\n]*)\n*/m, '').trimStart();
}

type TocItem = { id: string; num: string | null; label: string };

function buildToc(blocks: Block[]): TocItem[] {
  return blocks
    .filter((b): b is Extract<Block, { type: 'h2' }> => b.type === 'h2')
    .map((b) => {
      const { num, rest } = extractSectionNum(b.text);
      return { id: b.id, num, label: rest };
    });
}

type Segment =
  | { type: 'intro'; blocks: Block[] }
  | { type: 'h2section'; h2: Extract<Block, { type: 'h2' }>; blocks: Block[] };

/**
 * Splits the flat block list into a leading "intro" (if any) and one segment per
 * H2+body. Preserves top-to-bottom order; does not merge or drop blocks.
 */
function segmentByH2(blocks: Block[]): Segment[] {
  const segs: Segment[] = [];
  let intro: Block[] = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.type === 'h2') {
      if (intro.length) {
        segs.push({ type: 'intro', blocks: intro });
        intro = [];
      }
      i++;
      const body: Block[] = [];
      while (i < blocks.length && blocks[i].type !== 'h2') {
        body.push(blocks[i]);
        i++;
      }
      segs.push({ type: 'h2section', h2: b, blocks: body });
    } else {
      intro.push(b);
      i++;
    }
  }
  if (intro.length) segs.push({ type: 'intro', blocks: intro });
  return segs;
}

/**
 * Short label used on TOC chips — keeps the chip compact regardless of how
 * verbose the section heading is.
 */
function shortChipLabel(label: string): string {
  const cleaned = label
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  // Take the first half up to the first ' / ' or ' - ' or ' — '
  const cut = cleaned.split(/\s+[-/—]\s+/)[0];
  return cut.length > 26 ? cut.slice(0, 24).trim() + '…' : cut;
}

/**
 * Interactive Table of Contents — a horizontally-scrollable chip strip that
 * floats at the top of the viewport while the user is reading an article,
 * and settles back into the document flow when scrolled past.
 *
 * Why `position: fixed` instead of `position: sticky`?
 *   Many ancestors in this app set `overflow: hidden` / `overflow-x: hidden`
 *   which silently breaks `position: sticky` on descendants (sticky scopes
 *   itself to the nearest scroll container). Rather than fight that, we use
 *   a rock-solid `position: fixed` pattern:
 *     1. Render a zero-height sentinel at the pill's natural position.
 *     2. Observe when the sentinel leaves the top of the viewport AND when
 *        the outer article wrapper is still partially in view.
 *     3. While those conditions hold, render the pill as `fixed` so it
 *        visibly floats over the page; otherwise render it inline so it
 *        occupies its normal spot in the flow (no layout jump).
 *
 * Other design notes:
 *   - Observer on H2 blocks only drives chip highlight state; it never
 *     triggers a page scroll, so there is no risk of the observer racing
 *     with a smooth-scroll animation (the "endless scrolling" symptom
 *     previously seen on long service pages).
 *   - Programmatic jumps use `window.scrollTo(0, top)` with default auto
 *     behavior — no smooth animation, no race window.
 *   - The chip strip itself never auto-scrolls horizontally; on mobile the
 *     user can swipe freely.
 */
function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const [isFloating, setIsFloating] = useState(false);
  /** Sentinel placed at the pill's natural (in-flow) position. */
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  /**
   * Short window after a click during which the H2 observer is ignored, so
   * the clicked chip's "active" state doesn't flicker mid-jump.
   */
  const suppressObserverUntil = useRef(0);
  /** Height of the pill — used both to reserve space in flow and to decide
   *  when the article bottom has scrolled past the floating pill. */
  const PILL_RESERVED_HEIGHT = 56;
  const FLOATING_TOP = 80;

  // H2-in-viewport observer — drives chip highlight only.
  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (performance.now() < suppressObserverUntil.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const id = visible[0].target.id;
          if (id) setActiveId((prev) => (prev === id ? prev : id));
        }
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    for (const it of items) {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  // Scroll-driven float state. Float the pill when (a) the sentinel has
  // scrolled above the pinned top, AND (b) the article content below the
  // sentinel is still visible — i.e. the last H2 section hasn't fully
  // scrolled past the pinned top. Using scroll + rAF keeps this cheap.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    let raf = 0;
    const evaluate = () => {
      raf = 0;
      const sentinelRect = sentinel.getBoundingClientRect();
      // Find the containing article wrapper by walking up; fall back to the
      // sentinel's parent. We use the parent wrapper's bottom to know when
      // the reader has moved past the article entirely.
      const wrapper = sentinel.parentElement;
      const wrapperRect = wrapper ? wrapper.getBoundingClientRect() : sentinelRect;

      const pastTop = sentinelRect.top <= FLOATING_TOP;
      const stillInArticle = wrapperRect.bottom > FLOATING_TOP + PILL_RESERVED_HEIGHT;
      setIsFloating(pastTop && stillInArticle);
    };

    const onScrollOrResize = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(evaluate);
    };

    evaluate();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  const onJump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    // Offset clears the fixed site header (~64px) + floating TOC pill (~55px).
    const offset = 120;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    suppressObserverUntil.current = performance.now() + 600;
    setActiveId(id);
    window.scrollTo(0, Math.max(0, top));
  };

  // When floating, the pill is rendered as `position: fixed` so the chrome
  // (border, shadow, blur) is anchored to the viewport. When not floating,
  // the pill sits in normal flow at its sentinel. We reserve vertical space
  // via the sentinel wrapper so the page doesn't jump when state flips.
  const pillPositionStyle: React.CSSProperties = isFloating
    ? { position: 'fixed', top: FLOATING_TOP, left: '50%', transform: 'translateX(-50%)', zIndex: 30 }
    : { position: 'relative' };

  return (
    // Outer sentinel wrapper reserves a constant height (~56px) regardless
    // of floating state, which prevents a layout shift when the pill lifts.
    <div
      ref={sentinelRef}
      className="relative mb-6 flex justify-center"
      style={{ minHeight: PILL_RESERVED_HEIGHT }}
    >
      <div
        style={pillPositionStyle}
        className="pointer-events-auto inline-flex max-w-[calc(100vw-24px)] rounded-full border border-gray-200 bg-white/85 backdrop-blur-xl shadow-[0_10px_30px_-12px_rgba(17,24,39,0.18)] ring-1 ring-black/5"
      >
        <div
          className="flex items-center gap-1.5 max-w-full overflow-x-auto px-2 py-1.5 rounded-full hide-scrollbar toc-fade-mask"
          role="tablist"
          aria-label="Section navigation"
        >
          {items.map((it) => {
            const isActive = activeId === it.id;
            return (
              <button
                key={it.id}
                data-toc-target={it.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onJump(it.id)}
                className={`inline-flex items-center gap-1.5 shrink-0 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900'
                }`}
              >
                {it.num && (
                  <span
                    className={`inline-flex items-center justify-center w-[18px] h-[18px] rounded-full text-[10px] font-bold tabular-nums ${
                      isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {it.num}
                  </span>
                )}
                <span>{shortChipLabel(it.label)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Styling config for callout blockquotes — keeps the render body compact. */
const CALLOUT_STYLES: Record<
  CalloutVariant,
  { wrap: string; iconWrap: string; Icon: React.ComponentType<{ className?: string }>; label: string }
> = {
  default:   { wrap: 'border-gray-200 bg-gray-50',        iconWrap: 'bg-gray-200 text-gray-700',   Icon: Info,           label: 'Note' },
  note:      { wrap: 'border-blue-200 bg-blue-50/70',      iconWrap: 'bg-blue-100 text-blue-700',    Icon: Info,           label: 'Note' },
  tip:       { wrap: 'border-emerald-200 bg-emerald-50/70',iconWrap: 'bg-emerald-100 text-emerald-700', Icon: Lightbulb,   label: 'Tip' },
  warn:      { wrap: 'border-amber-200 bg-amber-50/80',    iconWrap: 'bg-amber-100 text-amber-700',  Icon: AlertTriangle,  label: 'Heads up' },
  important: { wrap: 'border-violet-200 bg-violet-50/70',  iconWrap: 'bg-violet-100 text-violet-700',Icon: Sparkles,       label: 'Important' },
};

type CalloutProps = { variant: CalloutVariant; title: string | null; lines: string[] };

const Callout: React.FC<CalloutProps> = ({ variant, title, lines }) => {
  const cfg = CALLOUT_STYLES[variant];
  const Icon = cfg.Icon;
  const heading = title ?? (variant === 'default' ? null : cfg.label);
  return (
    <div className={`my-5 rounded-2xl border ${cfg.wrap} p-4 sm:p-5 shadow-sm`}>
      <div className="flex items-start gap-3">
        <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${cfg.iconWrap} flex-shrink-0`}>
          <Icon className="w-4.5 h-4.5" />
        </span>
        <div className="min-w-0 flex-1">
          {heading && (
            <div className="text-[15px] font-semibold text-gray-900 mb-1">
              {parseInline(heading)}
            </div>
          )}
          <div className="space-y-1.5">
            {lines.map((line, j) => (
              <p key={j} className="text-[16px] text-gray-700 leading-relaxed">
                {parseInline(line)}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

type DataTableProps = { headers: string[]; rows: string[][] };

const FaqAccordion: React.FC<{
  items: { q: string; a: string }[];
  /** FEMA: flat dividers, no filled card chrome */
  minimal?: boolean;
}> = ({ items, minimal }) => {
  if (minimal) {
    return (
      <div className="my-1 divide-y divide-gray-200 border border-gray-200/80 rounded-lg overflow-hidden bg-white" role="list">
        {items.map((item, i) => (
          <details key={i} className="group" role="listitem">
            <summary className="flex cursor-pointer list-none items-start gap-2.5 px-4 py-3.5 text-left [&::-webkit-details-marker]:hidden min-h-[3.25rem]">
              <ChevronDown
                className="h-[18px] w-[18px] mt-0.5 flex-shrink-0 text-gray-500 transition-transform group-open:rotate-180"
                aria-hidden
                strokeWidth={2}
              />
              <span className="text-[17px] sm:text-[18px] font-semibold text-gray-900 leading-snug pr-1">
                {parseInline(item.q)}
              </span>
            </summary>
            <div className="px-4 pb-4 pl-10 sm:pl-11 text-[16px] sm:text-[18px] text-gray-700 leading-relaxed">
              {item.a
                ? item.a
                    .split(/\n\n+/)
                    .map((c) => c.trim())
                    .filter(Boolean)
                    .map((chunk, pi) => (
                      <p key={pi} className={pi > 0 ? 'mt-3' : undefined}>
                        {parseInline(chunk)}
                      </p>
                    ))
                : null}
            </div>
          </details>
        ))}
      </div>
    );
  }
  return (
    <div className="my-2 space-y-2" role="list">
      {items.map((item, i) => (
        <details
          key={i}
          className="group border border-gray-200/90 rounded-xl bg-slate-50/40 open:bg-white open:shadow-sm transition-shadow"
          role="listitem"
        >
          <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3.5 text-left [&::-webkit-details-marker]:hidden min-h-[3.5rem]">
            <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-500 group-open:text-blue-600 group-open:border-blue-200 group-open:bg-blue-50/80 transition-colors">
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden />
            </span>
            <span className="text-[17px] sm:text-[18px] font-semibold text-gray-900 leading-snug pr-2">
              {parseInline(item.q)}
            </span>
          </summary>
          <div className="px-4 pb-4 pl-[3.25rem] sm:pl-14 text-[16px] sm:text-[18px] text-gray-700 leading-relaxed border-t border-gray-100/80 pt-3 -mt-0.5">
            {item.a
              ? item.a
                  .split(/\n\n+/)
                  .map((c) => c.trim())
                  .filter(Boolean)
                  .map((chunk, pi) => (
                    <p key={pi} className={pi > 0 ? 'mt-3' : undefined}>
                      {parseInline(chunk)}
                    </p>
                  ))
              : null}
          </div>
        </details>
      ))}
    </div>
  );
};

const DataTable: React.FC<DataTableProps & { feeColumnRight?: boolean }> = ({
  headers,
  rows,
  feeColumnRight,
}) => {
  const h0 = (headers[0] ?? '').trim();
  const firstColIsIndex = /^#$/i.test(h0) || /^s\.?\s*no\.?$/i.test(h0) || /^no\.?$/i.test(h0);
  const lastIdx = Math.max(0, headers.length - 1);
  return (
    <div className="my-5 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[min(100%,480px)] border-collapse text-[15px]">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className={`px-4 py-3 font-semibold text-gray-800 ${
                    firstColIsIndex && i === 0
                      ? 'w-14 min-w-[3.25rem] text-center text-[13px] text-gray-500'
                      : 'text-left whitespace-nowrap'
                  } ${
                    feeColumnRight && i === lastIdx ? 'text-right' : ''
                  }`}
                >
                  {parseInline(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className={`border-b border-gray-100 last:border-b-0 ${rIdx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'} hover:bg-slate-50/80 transition-colors`}
              >
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className={`align-top px-4 py-3 text-gray-700 leading-relaxed ${
                      firstColIsIndex && cIdx === 0
                        ? 'w-14 min-w-[3.25rem] text-center tabular-nums text-gray-600 font-medium'
                        : ''
                    } ${feeColumnRight && cIdx === lastIdx ? 'text-right tabular-nums' : ''}`}
                  >
                    {parseInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

type BlockRenderCtx = {
  variant: 'default' | 'service';
  contentPreset?: 'business-conv-batch-3' | 'fema-batch-4';
  /** Normalized H2 label for the current section (when inside an H2 segment). */
  sectionHeading?: string;
};

const RichBlock: React.FC<{ block: Block; h2InSection: boolean; ctx: BlockRenderCtx }> = ({
  block,
  h2InSection,
  ctx,
}) => {
  const { variant } = ctx;
  const defaultList = 'mt-2.5 space-y-3';

  switch (block.type) {
    case 'h1':
      return (
        <h1 className="text-[1.75rem] sm:text-[2rem] font-bold text-gray-900 leading-tight tracking-tight mt-2 mb-4">
          {parseInline(block.text)}
        </h1>
      );

    case 'faq':
      return (
        <FaqAccordion
          items={block.items}
          minimal={ctx.contentPreset === 'fema-batch-4'}
        />
      );

    case 'h2': {
      const { rest } = extractSectionNum(block.text);
      if (h2InSection) {
        const r = rest.trim();
        const fema = ctx.contentPreset === 'fema-batch-4';
        const lim = fema && /^limitations$/i.test(r);
        const doc = fema && /^documents required$/i.test(r);
        const comp = fema && /^compliance requirements$/i.test(r);
        const FemaIcon = lim ? AlertTriangle : doc ? FileText : comp ? CheckCircle2 : null;
        return (
          <h2
            id={`${block.id}-heading`}
            className={`text-[26px] font-bold text-gray-900 leading-snug pb-2.5 border-b border-gray-200/80 mt-0 mb-4 ${
              FemaIcon ? 'flex items-center gap-2.5' : ''
            }`}
          >
            {FemaIcon ? (
              <FemaIcon
                className="h-6 w-6 flex-shrink-0 text-sky-800/90"
                strokeWidth={1.75}
                aria-hidden
              />
            ) : null}
            <span className="min-w-0">{parseInline(rest)}</span>
          </h2>
        );
      }
      return (
        <div id={block.id} className="mt-8 mb-3 first:mt-0 scroll-mt-[120px]">
          <h2 className="text-[26px] font-bold text-gray-900 leading-snug pb-2.5 border-b border-gray-200">
            {parseInline(rest)}
          </h2>
        </div>
      );
    }

    case 'h3':
      return (
        <h3 className="mt-4 mb-1.5 text-[20px] font-semibold text-gray-800">
          {parseInline(block.text)}
        </h3>
      );

    case 'h4':
      return (
        <h4 className="mt-3 mb-1 text-[15px] font-semibold text-gray-600">
          {parseInline(block.text)}
        </h4>
      );

    case 'blockquote':
      return <Callout variant={block.variant} title={block.title} lines={block.lines} />;

    case 'table': {
      const sh = (ctx.sectionHeading ?? '').trim();
      const feeish =
        ctx.contentPreset === 'fema-batch-4' &&
        (/^fees$/i.test(sh) || /\bfee\b/i.test((block.headers[1] ?? block.headers[0] ?? '').toLowerCase()));
      return (
        <DataTable
          headers={block.headers}
          rows={block.rows}
          feeColumnRight={!!feeish}
        />
      );
    }

    case 'p':
      return (
        <p className="mt-2.5 text-[18px] text-gray-700 leading-[1.75]">
          {parseInline(block.text)}
        </p>
      );

    case 'ul': {
      const preset = ctx.contentPreset;
      const sh = (ctx.sectionHeading ?? '').trim();
      const femaBenefits =
        ctx.variant === 'service' && preset === 'fema-batch-4' && /^benefits$/i.test(sh);
      if (femaBenefits) {
        return (
          <ul
            className="mt-2.5 grid list-none grid-cols-1 gap-3 pl-0 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
          >
            {block.items.map((item, j) => {
              const colon = item.match(/^([^:]+):\s*([\s\S]+)$/);
              const title = colon ? colon[1].trim() : null;
              const body = colon ? colon[2].trim() : item;
              return (
                <li
                  key={j}
                  className="flex items-start gap-3 border-l-[3px] border-sky-800/85 bg-transparent py-2 pl-3 pr-1"
                >
                  <Check
                    className="mt-0.5 h-[20px] w-[20px] flex-shrink-0 text-sky-800"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <div className="min-w-0 text-[16px] leading-relaxed sm:text-[17px] text-gray-800">
                    {title && colon ? (
                      <>
                        <span className="font-semibold text-gray-900">{parseInline(title)}</span>
                        <span className="text-gray-700">: {parseInline(body)}</span>
                      </>
                    ) : (
                      parseInline(item)
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        );
      }
      const femaLimitations =
        ctx.variant === 'service' && preset === 'fema-batch-4' && /^limitations$/i.test(sh);
      if (femaLimitations) {
        return (
          <ul className="mt-2.5 list-disc space-y-2 pl-5 text-[16px] sm:text-[17px] text-gray-800 leading-relaxed">
            {block.items.map((item, j) => (
              <li key={j} className="marker:text-gray-400">
                {parseInline(item)}
              </li>
            ))}
          </ul>
        );
      }
      const femaComp =
        ctx.variant === 'service' &&
        preset === 'fema-batch-4' &&
        /^compliance requirements$/i.test(sh);
      if (femaComp) {
        return (
          <ul className="mt-2.5 list-disc space-y-2 pl-5 text-[16px] sm:text-[17px] text-gray-800 leading-relaxed">
            {block.items.map((item, j) => (
              <li key={j} className="marker:text-gray-400">
                {parseInline(item)}
              </li>
            ))}
          </ul>
        );
      }
      const femaDocs =
        ctx.variant === 'service' && preset === 'fema-batch-4' && /^documents required$/i.test(sh);
      if (femaDocs) {
        return (
          <ul
            className="mt-2.5 list-none space-y-0 overflow-hidden rounded-lg border border-gray-200/80 pl-0"
            role="list"
          >
            {block.items.map((item, j) => {
              const em = item.split(/\s+—\s+/);
              if (em.length >= 2) {
                const left = em[0].trim();
                const right = em.slice(1).join(' — ').trim();
                return (
                  <li
                    key={j}
                    className="grid grid-cols-1 border-b border-gray-100 bg-white/0 px-3 py-2.5 last:border-b-0 sm:grid-cols-2 sm:gap-x-5 sm:px-4"
                  >
                    <span className="font-semibold text-gray-900 text-[16px]">{parseInline(left)}</span>
                    <span className="text-[15px] sm:text-[16px] text-gray-600">{parseInline(right)}</span>
                  </li>
                );
              }
              return (
                <li key={j} className="px-3 py-2.5 text-[16px] text-gray-800 sm:px-4">
                  {parseInline(item)}
                </li>
              );
            })}
          </ul>
        );
      }
      const glassBenefits =
        ctx.variant === 'service' && preset === 'business-conv-batch-3' && /^benefits$/i.test(sh);
      const glassLimitations =
        ctx.variant === 'service' && preset === 'business-conv-batch-3' && /^limitations$/i.test(sh);
      const glassDocuments =
        ctx.variant === 'service' && preset === 'business-conv-batch-3' && /^documents$/i.test(sh);

      if (glassBenefits) {
        return (
          <ul
            className="mt-2.5 grid list-none grid-cols-1 gap-3 pl-0 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
          >
            {block.items.map((item, j) => (
              <li
                key={j}
                className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/50 p-4 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] ring-1 ring-white/60 backdrop-blur-md"
              >
                <span
                  className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-700"
                  aria-hidden
                >
                  <Sparkles className="h-4 w-4" strokeWidth={2} />
                </span>
                <span className="min-w-0 text-[16px] leading-relaxed text-gray-800 sm:text-[17px]">
                  {parseInline(item)}
                </span>
              </li>
            ))}
          </ul>
        );
      }
      if (glassLimitations) {
        return (
          <ul
            className="mt-2.5 grid list-none grid-cols-1 gap-3 pl-0 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
          >
            {block.items.map((item, j) => (
              <li
                key={j}
                className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/35 p-4 shadow-[0_8px_30px_-12px_rgba(180,83,9,0.1)] ring-1 ring-amber-100/50 backdrop-blur-md"
              >
                <span
                  className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-800"
                  aria-hidden
                >
                  <AlertTriangle className="h-4 w-4" strokeWidth={2} />
                </span>
                <span className="min-w-0 text-[16px] leading-relaxed text-gray-800 sm:text-[17px]">
                  {parseInline(item)}
                </span>
              </li>
            ))}
          </ul>
        );
      }
      if (glassDocuments) {
        return (
          <ul
            className="mt-2.5 grid list-none grid-cols-1 gap-3 pl-0 sm:grid-cols-2"
            role="list"
          >
            {block.items.map((item, j) => (
              <li
                key={j}
                className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/40 p-4 shadow-sm ring-1 ring-slate-100/60 backdrop-blur-sm"
              >
                <span
                  className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-600/10 text-slate-700"
                  aria-hidden
                >
                  <FileText className="h-4 w-4" strokeWidth={2} />
                </span>
                <span className="min-w-0 text-[16px] leading-relaxed text-gray-800 sm:text-[17px]">
                  {parseInline(item)}
                </span>
              </li>
            ))}
          </ul>
        );
      }
      return (
        <ul className="mt-2.5 space-y-1">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-2.5 text-[18px] text-gray-700 leading-[1.35]">
              <span className="mt-[0.55em] w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
              <span>{parseInline(item)}</span>
            </li>
          ))}
        </ul>
      );
    }

    case 'ol': {
      const shOl = (ctx.sectionHeading ?? '').trim();
      if (
        ctx.variant === 'service' &&
        ctx.contentPreset === 'fema-batch-4' &&
        /^process$/i.test(shOl)
      ) {
        const n = block.items.length;
        return (
          <ol className="mt-3 list-none space-y-0 pl-0" role="list">
            {block.items.map((item, j) => {
              const m = item.match(/^Step\s+\d+\s+—\s*(.+)$/i);
              const rest = m ? m[1].trim() : item;
              const colon = rest.indexOf(':');
              const stepTitle = colon > 0 ? rest.slice(0, colon).trim() : rest;
              const stepBody = colon > 0 ? rest.slice(colon + 1).trim() : '';
              return (
                <li
                  key={j}
                  className="flex min-h-0 list-none pb-8 last:pb-0"
                >
                  <div
                    className="flex w-7 shrink-0 flex-col items-center self-stretch sm:w-8"
                    aria-hidden
                  >
                    {j > 0 ? (
                      <div className="h-2 w-0.5 shrink-0 bg-sky-200/90 sm:h-3" />
                    ) : null}
                    <div className="z-[1] flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 border-sky-800 bg-white text-[12px] font-semibold text-sky-900">
                      {j + 1}
                    </div>
                    {j < n - 1 ? (
                      <div className="min-h-6 w-0.5 flex-1 bg-sky-200/90" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1 pl-3 text-[16px] leading-relaxed text-gray-800 sm:pl-3.5 sm:text-[17px]">
                    <p className="font-semibold text-gray-900">{parseInline(stepTitle)}</p>
                    {stepBody ? (
                      <p className="mt-1.5 font-normal text-gray-700">{parseInline(stepBody)}</p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        );
      }
      if (variant === 'service') {
        return (
          <ol className="mt-2.5 list-none space-y-3 pl-0">
            {block.items.map((item, j) => {
              const dashIdx = item.indexOf(' — ');
              const hasTitle = dashIdx !== -1;
              const title = hasTitle ? item.slice(0, dashIdx) : null;
              const desc = hasTitle ? item.slice(dashIdx + 3) : item;
              return (
                <li
                  key={j}
                  className="flex items-start gap-3 rounded-xl border border-gray-200/80 bg-gradient-to-b from-white to-slate-50/40 p-3.5 sm:p-4 shadow-sm ring-1 ring-gray-100/40"
                >
                  <span
                    className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-[12px] font-bold text-white shadow-sm"
                    aria-hidden
                  >
                    {j + 1}
                  </span>
                  <div className="min-w-0 text-[16px] leading-relaxed text-gray-700 sm:text-[17px]">
                    {hasTitle && title ? (
                      <>
                        <span className="font-semibold text-gray-900">{parseInline(title)}</span>
                        {desc ? (
                          <>
                            <span className="text-gray-500"> — </span>
                            {parseInline(desc)}
                          </>
                        ) : null}
                      </>
                    ) : (
                      parseInline(item)
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        );
      }
      return (
        <ol className={defaultList}>
          {block.items.map((item, j) => {
            const dashIdx = item.indexOf(' — ');
            const hasTitle = dashIdx !== -1;
            const title = hasTitle ? item.slice(0, dashIdx) : null;
            const desc = hasTitle ? item.slice(dashIdx + 3) : item;
            return (
              <li key={j} className="flex items-start gap-3">
                <span className="mt-[0.25em] flex h-[20px] w-[20px] flex-shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-[11px] font-bold text-gray-500">
                  {j + 1}
                </span>
                <span className="min-w-0 text-[18px] leading-[1.35] text-gray-700">
                  {hasTitle && title ? (
                    <><strong className="font-semibold text-gray-900">{parseInline(title)}</strong>{' — '}{parseInline(desc)}</>
                  ) : (
                    parseInline(item)
                  )}
                </span>
              </li>
            );
          })}
        </ol>
      );
    }
  }
};

export default function RichContent({
  content,
  className = '',
  showToc = true,
  stripLeadingH1 = false,
  variant: variantProp = 'default',
  contentPreset,
}: Props) {
  const processed = useMemo(() => {
    const safe = (content ?? '').replace(/\r\n/g, '\n');
    if (!stripLeadingH1) return safe;
    return stripLeadingH1Line(safe);
  }, [content, stripLeadingH1]);

  const isPlainText = useMemo(
    () =>
      !processed.includes('## ') &&
      !processed.includes('### ') &&
      !processed.includes('#### ') &&
      !/(^|\n)#[ \t]/m.test(processed) &&
      !processed.includes('- ') &&
      !processed.includes('* ') &&
      !processed.includes('**') &&
      !/\[.*?\]\(.*?\)/.test(processed) &&
      !processed.includes('\n> ') &&
      !processed.includes('|'),
    [processed]
  );

  const blocks = useMemo(
    () => (processed.trim() && !isPlainText ? extractFaqAccordion(parseBlocks(processed)) : []),
    [processed, isPlainText]
  );
  const toc = useMemo(() => buildToc(blocks), [blocks]);

  if (!processed.trim()) return null;

  if (isPlainText) {
    return (
      <div className={`text-[18px] text-gray-700 leading-[1.75] whitespace-pre-line ${className}`}>
        {processed}
      </div>
    );
  }

  const displayToc = showToc && toc.length >= 3;
  const blockCtx: BlockRenderCtx = { variant: variantProp, contentPreset };
  const segments = variantProp === 'service' ? segmentByH2(blocks) : null;
  const femaClass =
    contentPreset === 'fema-batch-4'
      ? 'scroll-mt-[120px] rounded-xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-none ring-0'
      : 'scroll-mt-[120px] rounded-2xl border border-gray-200/70 bg-gradient-to-b from-white to-slate-50/30 p-4 sm:p-6 shadow-sm ring-1 ring-gray-100/50';

  if (variantProp === 'service' && segments) {
    return (
      <div className={className}>
        {displayToc && <TableOfContents items={toc} />}
        <div className="space-y-6 sm:space-y-7">
          {segments.map((seg, segIdx) => {
            if (seg.type === 'intro') {
              return (
                <div key={`intro-${segIdx}`}>
                  {seg.blocks.map((b, j) => (
                    <RichBlock
                      key={`intro-${segIdx}-b${j}`}
                      block={b}
                      h2InSection={false}
                      ctx={blockCtx}
                    />
                  ))}
                </div>
              );
            }
            const { rest: sectionHeading } = extractSectionNum(seg.h2.text);
            const ctxInSection: BlockRenderCtx = { ...blockCtx, sectionHeading };
            return (
              <section
                key={seg.h2.id}
                id={seg.h2.id}
                className={femaClass}
                aria-labelledby={`${seg.h2.id}-heading`}
              >
                <RichBlock key={`${seg.h2.id}-h2`} block={seg.h2} h2InSection ctx={blockCtx} />
                {seg.blocks.map((b, j) => (
                  <RichBlock
                    key={`${seg.h2.id}-b${j}`}
                    block={b}
                    h2InSection={false}
                    ctx={ctxInSection}
                  />
                ))}
              </section>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {displayToc && <TableOfContents items={toc} />}
      {blocks.map((block, i) => (
        <RichBlock key={i} block={block} h2InSection={false} ctx={blockCtx} />
      ))}
    </div>
  );
}
