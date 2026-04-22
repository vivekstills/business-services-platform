import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Info, AlertTriangle, Lightbulb, Sparkles } from 'lucide-react';

type Props = {
  content: string;
  className?: string;
  /** Show Table of Contents when >= 3 H2 sections. Default: true */
  showToc?: boolean;
};

type CalloutVariant = 'default' | 'note' | 'tip' | 'warn' | 'important';

type Block =
  | { type: 'h2'; text: string; id: string }
  | { type: 'h3'; text: string }
  | { type: 'h4'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'blockquote'; lines: string[]; variant: CalloutVariant; title: string | null }
  | { type: 'table'; headers: string[]; rows: string[][] };

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

function parseBlocks(raw: string): Block[] {
  const lines = raw.split('\n');
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const trimmed = lines[i].trim();
    if (!trimmed) { i++; continue; }
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
    } else if (
      trimmed.startsWith('|') &&
      trimmed.endsWith('|') &&
      i + 1 < lines.length &&
      isTableSeparator(lines[i + 1])
    ) {
      // GFM pipe table: header row, separator row, then data rows until a
      // non-pipe line.
      const headers = splitTableRow(trimmed);
      i += 2; // skip header + separator
      const rows: string[][] = [];
      while (i < lines.length) {
        const next = lines[i].trim();
        if (!next.startsWith('|') || !next.endsWith('|')) break;
        rows.push(splitTableRow(next));
        i++;
      }
      blocks.push({ type: 'table', headers, rows });
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

type TocItem = { id: string; num: string | null; label: string };

function buildToc(blocks: Block[]): TocItem[] {
  return blocks
    .filter((b): b is Extract<Block, { type: 'h2' }> => b.type === 'h2')
    .map((b) => {
      const { num, rest } = extractSectionNum(b.text);
      return { id: b.id, num, label: rest };
    });
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

const DataTable: React.FC<DataTableProps> = ({ headers, rows }) => {
  return (
    <div className="my-5 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[15px]">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="text-left font-semibold text-gray-800 px-4 py-3 whitespace-nowrap"
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
                className={`border-b border-gray-100 last:border-b-0 ${rIdx % 2 === 1 ? 'bg-gray-50/40' : 'bg-white'} hover:bg-blue-50/40 transition-colors`}
              >
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className="align-top px-4 py-3 text-gray-700 leading-relaxed"
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

export default function RichContent({ content, className = '', showToc = true }: Props) {
  const safe = content ?? '';
  const isPlainText =
    !safe.includes('## ') && !safe.includes('### ') && !safe.includes('#### ') &&
    !safe.includes('- ') && !safe.includes('* ') && !safe.includes('**') &&
    !/\[.*?\]\(.*?\)/.test(safe) && !safe.includes('\n> ') && !safe.includes('|');

  const blocks = useMemo(() => (safe.trim() && !isPlainText ? parseBlocks(safe) : []), [safe, isPlainText]);
  const toc = useMemo(() => buildToc(blocks), [blocks]);

  if (!safe.trim()) return null;

  if (isPlainText) {
    return (
      <div className={`text-[18px] text-gray-700 leading-[1.75] whitespace-pre-line ${className}`}>
        {content}
      </div>
    );
  }

  const displayToc = showToc && toc.length >= 3;

  return (
    <div className={className}>
      {displayToc && <TableOfContents items={toc} />}
      {blocks.map((block, i) => {
        switch (block.type) {

          case 'h2': {
            const { rest } = extractSectionNum(block.text);
            return (
              <div key={i} id={block.id} className="mt-8 mb-3 first:mt-0 scroll-mt-[120px]">
                <h2 className="text-[26px] font-bold text-gray-900 leading-snug pb-2.5 border-b border-gray-200">
                  {parseInline(rest)}
                </h2>
              </div>
            );
          }

          case 'h3':
            return (
              <h3 key={i} className="mt-4 mb-1.5 text-[20px] font-semibold text-gray-800">
                {parseInline(block.text)}
              </h3>
            );

          case 'h4':
            return (
              <p key={i} className="mt-3 mb-1 text-[15px] font-semibold text-gray-600">
                {parseInline(block.text)}
              </p>
            );

          case 'blockquote':
            return (
              <Callout
                key={i}
                variant={block.variant}
                title={block.title}
                lines={block.lines}
              />
            );

          case 'table':
            return <DataTable key={i} headers={block.headers} rows={block.rows} />;

          case 'p':
            return (
              <p key={i} className="mt-2.5 text-[18px] text-gray-700 leading-[1.75]">
                {parseInline(block.text)}
              </p>
            );

          case 'ul':
            return (
              <ul key={i} className="mt-2.5 space-y-1">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-[18px] text-gray-700 leading-[1.35]">
                    <span className="mt-[0.55em] w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                    <span>{parseInline(item)}</span>
                  </li>
                ))}
              </ul>
            );

          case 'ol':
            return (
              <ol key={i} className="mt-2.5 space-y-3">
                {block.items.map((item, j) => {
                  const dashIdx = item.indexOf(' — ');
                  const hasTitle = dashIdx !== -1;
                  const title = hasTitle ? item.slice(0, dashIdx) : null;
                  const desc = hasTitle ? item.slice(dashIdx + 3) : item;
                  return (
                    <li key={j} className="flex items-start gap-3">
                      <span className="mt-[0.25em] w-[20px] h-[20px] rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[11px] font-bold text-gray-500 flex-shrink-0">
                        {j + 1}
                      </span>
                      <span className="text-[18px] text-gray-700 leading-[1.35]">
                        {hasTitle && title ? (
                          <><strong className="font-semibold text-gray-900">{parseInline(title)}</strong>{' — '}{parseInline(desc)}</>
                        ) : parseInline(item)}
                      </span>
                    </li>
                  );
                })}
              </ol>
            );
        }
      })}
    </div>
  );
}
