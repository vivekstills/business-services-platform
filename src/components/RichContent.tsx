import React from 'react';

type Props = {
  content: string;
  className?: string;
};

type Block =
  | { type: 'h2'; text: string }
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

function parseBlocks(raw: string): Block[] {
  const lines = raw.split('\n');
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const trimmed = lines[i].trim();
    if (!trimmed) { i++; continue; }
    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'h2', text: trimmed.slice(3).trim() });
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

function extractSectionNum(text: string): { num: string | null; rest: string } {
  const m = text.match(/^(\d+)[\).:]\s+(.+)$/);
  if (m) return { num: m[1], rest: m[2] };
  return { num: null, rest: text };
}

export default function RichContent({ content, className = '' }: Props) {
  if (!content?.trim()) return null;

  const isPlainText =
    !content.includes('## ') && !content.includes('### ') && !content.includes('#### ') &&
    !content.includes('- ') && !content.includes('* ') && !content.includes('**') &&
    !/\[.*?\]\(.*?\)/.test(content) && !content.includes('\n> ');

  if (isPlainText) {
    return (
      <div className={`text-[18px] text-gray-700 leading-[1.75] whitespace-pre-line ${className}`}>
        {content}
      </div>
    );
  }

  const blocks = parseBlocks(content);

  return (
    <div className={className}>
      {blocks.map((block, i) => {
        switch (block.type) {

          case 'h2': {
            const { rest } = extractSectionNum(block.text);
            const sectionId = `section-${rest.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`;
            return (
              <div key={i} id={sectionId} className="mt-8 mb-3 first:mt-0">
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
