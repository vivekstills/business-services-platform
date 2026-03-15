import React from 'react';
import { CheckCircle2 } from 'lucide-react';

type Props = {
  content: string;
  className?: string;
};

type Block =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] };

function parseBold(text: string): React.ReactNode[] {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold text-gray-800">{part}</strong> : part
  );
}

function parseBlocks(raw: string): Block[] {
  const lines = raw.split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) { i++; continue; }

    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'h2', text: trimmed.slice(3).trim() });
      i++;
    } else if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'h3', text: trimmed.slice(4).trim() });
      i++;
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
        if (!next || next.startsWith('## ') || next.startsWith('### ') || /^[-*] /.test(next) || /^\d+\.\s/.test(next)) break;
        para += ' ' + next;
        i++;
      }
      blocks.push({ type: 'p', text: para });
    }
  }

  return blocks;
}

export default function RichContent({ content, className = '' }: Props) {
  if (!content?.trim()) return null;

  const isPlainText = !content.includes('## ') && !content.includes('### ') && !content.includes('- ') && !content.includes('* ') && !content.includes('**');

  if (isPlainText) {
    return (
      <div className={`text-[14.5px] text-gray-500 leading-relaxed whitespace-pre-line ${className}`}>
        {content}
      </div>
    );
  }

  const blocks = parseBlocks(content);

  return (
    <div className={`space-y-4 ${className}`}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2 key={i} className="text-xl font-bold text-gray-900 mt-8 first:mt-0">
                {parseBold(block.text)}
              </h2>
            );
          case 'h3':
            return (
              <h3 key={i} className="text-base font-semibold text-gray-800 mt-5">
                {parseBold(block.text)}
              </h3>
            );
          case 'p':
            return (
              <p key={i} className="text-[14.5px] text-gray-500 leading-relaxed">
                {parseBold(block.text)}
              </p>
            );
          case 'ul':
            return (
              <ul key={i} className="space-y-2.5 my-3">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-[14px] text-gray-600">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{parseBold(item)}</span>
                  </li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i} className="space-y-2.5 my-3">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-[14px] text-gray-600">
                    <span className="w-6 h-6 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-[11px] font-bold text-blue-700 flex-shrink-0 mt-0.5">
                      {j + 1}
                    </span>
                    <span>{parseBold(item)}</span>
                  </li>
                ))}
              </ol>
            );
        }
      })}
    </div>
  );
}
