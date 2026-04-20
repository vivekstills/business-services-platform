import React, { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  content: string;
  className?: string;
  /** Show Table of Contents when >= 3 H2 sections. Default: true */
  showToc?: boolean;
};

type Block =
  | { type: 'h2'; text: string; id: string }
  | { type: 'h3'; text: string }
  | { type: 'h4'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'blockquote'; lines: string[] };

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
    } else if (trimmed.startsWith('> ')) {
      const bqLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        bqLines.push(lines[i].trim().slice(2).trim());
        i++;
      }
      blocks.push({ type: 'blockquote', lines: bqLines });
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
          /^[-*] /.test(next) || /^\d+\.\s/.test(next) || next.startsWith('> ')) break;
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
 * Interactive Table of Contents. Sticky horizontal chip strip that highlights
 * the section currently in the viewport. Clicking a chip scrolls the page to
 * the matching H2 block.
 *
 * Deliberately kept minimal:
 *   - Observer only drives chip highlight state; never touches page scroll.
 *   - No smooth browser scroll. Programmatic scroll is a direct scrollTop
 *     assignment, which eliminates any possibility of the observer racing
 *     with an in-flight `behavior: 'smooth'` animation (the "endless
 *     scrolling" symptom previously seen on long service pages).
 *   - The strip itself is not auto-scrolled horizontally; the active chip
 *     updates in place. On mobile the user can swipe the strip freely.
 */
function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  /**
   * Short window after a click during which observer callbacks are ignored.
   * Prevents a visible flicker on the clicked chip while the page jumps.
   */
  const suppressObserverUntil = useRef(0);

  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (performance.now() < suppressObserverUntil.current) return;
        // Pick the top-most entry that is currently intersecting the
        // "active band" (viewport middle 10%). Updating state here must
        // NEVER cause a scroll side effect elsewhere.
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

  const onJump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    // Offset clears the fixed site header (~64px) + sticky TOC strip (~55px).
    // Using plain `window.scrollTo(top)` with the default "auto" behavior so
    // the browser can't interleave a smooth animation with observer updates.
    const offset = 120;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    suppressObserverUntil.current = performance.now() + 600;
    setActiveId(id);
    window.scrollTo(0, Math.max(0, top));
  };

  return (
    <div className="sticky top-20 z-20 mb-6 flex justify-center pointer-events-none">
      <div className="pointer-events-auto inline-flex max-w-full rounded-full border border-gray-200 bg-white/85 backdrop-blur-xl shadow-[0_10px_30px_-12px_rgba(17,24,39,0.18)] ring-1 ring-black/5">
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

export default function RichContent({ content, className = '', showToc = true }: Props) {
  const safe = content ?? '';
  const isPlainText =
    !safe.includes('## ') && !safe.includes('### ') && !safe.includes('#### ') &&
    !safe.includes('- ') && !safe.includes('* ') && !safe.includes('**') &&
    !/\[.*?\]\(.*?\)/.test(safe) && !safe.includes('\n> ');

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
              <div key={i} className="my-4 pl-4 border-l-2 border-gray-300 py-1">
                {block.lines.map((line, j) => (
                  <p key={j} className="text-[17px] text-gray-600 leading-relaxed italic">
                    {parseInline(line)}
                  </p>
                ))}
              </div>
            );

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
