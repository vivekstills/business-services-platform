import React, { useState, useEffect } from 'react';
import { Save, ChevronDown, ChevronUp } from 'lucide-react';
import RichContent from '../RichContent';
import {
  POLICY_PAGE_LIST,
  defaultPolicyPages,
  type PolicyPageEntry,
  type PolicyPageId,
} from '../../data/policyPageDefaults';

type Props = {
  data: Record<string, unknown> | undefined;
  onSave: (data: Record<PolicyPageId, PolicyPageEntry>) => void;
  saving: boolean;
};

function mergedFromApi(raw: Record<string, unknown> | undefined): Record<PolicyPageId, PolicyPageEntry> {
  const src = raw ?? {};
  const out = {} as Record<PolicyPageId, PolicyPageEntry>;
  for (const { id } of POLICY_PAGE_LIST) {
    const d = src[id] as Record<string, unknown> | undefined;
    const def = defaultPolicyPages[id];
    out[id] = {
      title: typeof d?.title === 'string' && d.title.trim() ? d.title.trim() : def.title,
      lastUpdated:
        typeof d?.lastUpdated === 'string' && d.lastUpdated.trim()
          ? d.lastUpdated.trim()
          : def.lastUpdated,
      bodyMarkdown:
        typeof d?.bodyMarkdown === 'string' && d.bodyMarkdown.trim() !== ''
          ? d.bodyMarkdown
          : def.bodyMarkdown,
    };
  }
  return out;
}

export default function AdminPolicyPagesSection({ data, onSave, saving }: Props) {
  const [pages, setPages] = useState<Record<PolicyPageId, PolicyPageEntry>>(() =>
    mergedFromApi(data as Record<string, unknown> | undefined)
  );
  const [openId, setOpenId] = useState<PolicyPageId | null>('privacy-policy');
  const [showPreview, setShowPreview] = useState<Record<PolicyPageId, boolean>>({});

  useEffect(() => {
    setPages(mergedFromApi(data as Record<string, unknown> | undefined));
  }, [data]);

  const update = (id: PolicyPageId, patch: Partial<PolicyPageEntry>) => {
    setPages((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Edit legal page titles, “last updated” text, and body copy. Body uses simple markdown:{' '}
        <code className="text-xs bg-gray-100 px-1 rounded">##</code> headings, lists with{' '}
        <code className="text-xs bg-gray-100 px-1 rounded">-</code>,{' '}
        <code className="text-xs bg-gray-100 px-1 rounded">**bold**</code>,{' '}
        <code className="text-xs bg-gray-100 px-1 rounded">[label](url)</code>.
      </p>

      <div className="space-y-3">
        {POLICY_PAGE_LIST.map(({ id, adminLabel }) => {
          const entry = pages[id];
          const open = openId === id;
          return (
            <div
              key={id}
              className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenId(open ? null : id)}
                className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-gray-900 hover:bg-gray-50"
              >
                <span>{adminLabel}</span>
                {open ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </button>
              {open && (
                <div className="px-4 pb-4 pt-0 border-t border-gray-100 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4 pt-4">
                    <label className="block text-sm">
                      <span className="text-gray-600 font-medium">Page title</span>
                      <input
                        type="text"
                        value={entry.title}
                        onChange={(e) => update(id, { title: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      />
                    </label>
                    <label className="block text-sm">
                      <span className="text-gray-600 font-medium">Last updated (display text)</span>
                      <input
                        type="text"
                        value={entry.lastUpdated}
                        onChange={(e) => update(id, { lastUpdated: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        placeholder="e.g. February 2025"
                      />
                    </label>
                  </div>
                  <label className="block text-sm">
                    <span className="text-gray-600 font-medium">Body (markdown)</span>
                    <textarea
                      value={entry.bodyMarkdown}
                      onChange={(e) => update(id, { bodyMarkdown: e.target.value })}
                      rows={14}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono"
                    />
                  </label>
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        setShowPreview((s) => ({ ...s, [id]: !s[id] }))
                      }
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {showPreview[id] ? 'Hide preview' : 'Show preview'}
                    </button>
                    {showPreview[id] && (
                      <div className="mt-3 p-4 rounded-lg border border-gray-200 bg-slate-50 max-h-[min(400px,50vh)] overflow-y-auto">
                        <RichContent content={entry.bodyMarkdown} />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        disabled={saving}
        onClick={() => onSave(pages)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        {saving ? 'Saving…' : 'Save legal pages'}
      </button>
    </div>
  );
}
