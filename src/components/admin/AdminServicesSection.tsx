import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Save, Search, ChevronDown, ChevronUp, Heading2, Heading3, List, ListOrdered, Bold, Eye, EyeOff, Link2, X, Check, Plus, Trash2 } from 'lucide-react';
import { SortableList } from './SortableList';
import RichContent from '../RichContent';

type ServicePackage = { name: string; price: string; description: string; features?: string[]; popular?: boolean };
type Service = {
  id: string;
  name: string;
  mainHead: string;
  categoryId: string;
  shortDescription?: string;
  content: string;
  packages: ServicePackage[];
  steps?: string[];
};

type CategoryRef = { id: string; title: string };

type Props = {
  data: unknown[];
  categories: CategoryRef[];
  onSave: (data: unknown[]) => void;
  saving: boolean;
};

function slugifyId(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

type ServiceEditorBodyProps = {
  s: Service;
  categories: CategoryRef[];
  update: (id: string, updates: Partial<Service>) => void;
  updateSteps: (serviceId: string, steps: string[]) => void;
  updatePackage: (serviceId: string, pkgIndex: number, updates: Partial<ServicePackage>) => void;
  reorderPackages: (serviceId: string, packages: ServicePackage[]) => void;
  addPackage: (serviceId: string) => void;
  deletePackage: (serviceId: string, pkgIndex: number) => void;
  setPopular: (serviceId: string, pkgIndex: number) => void;
  onRemoveService: (id: string) => void;
  onChangeServiceId: (oldId: string, newId: string) => void;
  sortablePackages: boolean;
};

function ServiceEditorBody({
  s,
  categories,
  update,
  updateSteps,
  updatePackage,
  reorderPackages,
  addPackage,
  deletePackage,
  setPopular,
  onRemoveService,
  onChangeServiceId,
  sortablePackages,
}: ServiceEditorBodyProps) {
  const sortedCats = useMemo(
    () => [...categories].sort((a, b) => a.title.localeCompare(b.title)),
    [categories]
  );

  const packageList = (
    <>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-medium text-gray-500">Packages</label>
        <button
          type="button"
          onClick={() => addPackage(s.id)}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200"
        >
          <Plus className="w-3.5 h-3.5" /> Add Package
        </button>
      </div>
      <p className="text-xs text-gray-400 mb-2">
        {sortablePackages ? 'Drag to reorder. ' : ''}Only one plan can be Most Popular.
      </p>
      {sortablePackages ? (
        <SortableList
          items={s.packages}
          onReorder={(pkgs) => reorderPackages(s.id, pkgs)}
          getItemId={(pkg, j) => `pkg-${s.id}-${j}`}
          renderItem={(pkg, i) => (
            <div className={`p-3 rounded-lg border space-y-2 ${pkg.popular ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <input
                    value={pkg.name}
                    onChange={(e) => updatePackage(s.id, i, { name: e.target.value })}
                    placeholder="Package name"
                    className="px-3 py-1.5 rounded border border-gray-200 text-sm"
                  />
                  <input
                    value={pkg.price}
                    onChange={(e) => updatePackage(s.id, i, { price: e.target.value })}
                    placeholder="Price"
                    className="px-3 py-1.5 rounded border border-gray-200 text-sm"
                  />
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setPopular(s.id, i)}
                    title={pkg.popular ? 'Remove Most Popular' : 'Mark as Most Popular'}
                    className={`text-[calc(10px+3pt)] font-bold px-2 py-1 rounded-full border transition-all ${
                      pkg.popular
                        ? 'bg-amber-400 border-amber-400 text-amber-900'
                        : 'border-gray-200 text-gray-400 hover:border-amber-300 hover:text-amber-600'
                    }`}
                  >
                    ★ Popular
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePackage(s.id, i)}
                    className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <textarea
                value={pkg.description}
                onChange={(e) => updatePackage(s.id, i, { description: e.target.value })}
                placeholder="Description"
                rows={2}
                className="w-full px-3 py-1.5 rounded border border-gray-200 text-sm"
              />
              <PackageFeaturesEditor
                features={pkg.features ?? []}
                onChange={(features) => updatePackage(s.id, i, { features })}
              />
            </div>
          )}
        />
      ) : (
        <div className="space-y-3">
          {s.packages.map((pkg, i) => (
            <div key={i} className={`p-3 rounded-lg border space-y-2 ${pkg.popular ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <input
                    value={pkg.name}
                    onChange={(e) => updatePackage(s.id, i, { name: e.target.value })}
                    placeholder="Package name"
                    className="px-3 py-1.5 rounded border border-gray-200 text-sm"
                  />
                  <input
                    value={pkg.price}
                    onChange={(e) => updatePackage(s.id, i, { price: e.target.value })}
                    placeholder="Price"
                    className="px-3 py-1.5 rounded border border-gray-200 text-sm"
                  />
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setPopular(s.id, i)}
                    title={pkg.popular ? 'Remove Most Popular' : 'Mark as Most Popular'}
                    className={`text-[calc(10px+3pt)] font-bold px-2 py-1 rounded-full border transition-all ${
                      pkg.popular
                        ? 'bg-amber-400 border-amber-400 text-amber-900'
                        : 'border-gray-200 text-gray-400 hover:border-amber-300 hover:text-amber-600'
                    }`}
                  >
                    ★ Popular
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePackage(s.id, i)}
                    className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <textarea
                value={pkg.description}
                onChange={(e) => updatePackage(s.id, i, { description: e.target.value })}
                placeholder="Description"
                rows={2}
                className="w-full px-3 py-1.5 rounded border border-gray-200 text-sm"
              />
              <PackageFeaturesEditor
                features={pkg.features ?? []}
                onChange={(features) => updatePackage(s.id, i, { features })}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50/50">
      <div className="flex flex-wrap items-start justify-between gap-3 pb-2 border-b border-gray-200">
        <div>
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Placement & URL</p>
          <p className="text-[calc(11px+3pt)] text-gray-400 mt-0.5">
            Category controls mega-menu and category page. Public URLs use{' '}
            <code className="text-gray-600">/services/main-category/service-id</code>.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onRemoveService(s.id)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50"
        >
          <Trash2 className="w-3.5 h-3.5" /> Remove service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Category / section</label>
          <select
            value={s.categoryId}
            onChange={(e) => update(s.id, { categoryId: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white text-sm"
          >
            {sortedCats.length === 0 && <option value="">— add categories first —</option>}
            {sortedCats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Page badge (mainHead)</label>
          <input
            value={s.mainHead}
            onChange={(e) => update(s.id, { mainHead: e.target.value })}
            placeholder="e.g. REGISTRATION, FORM NEW BUSINESS"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 text-sm"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">Service URL slug</label>
          <input
            key={s.id}
            defaultValue={s.id}
            onBlur={(e) => {
              const next = slugifyId(e.target.value);
              if (next && next !== s.id) onChangeServiceId(s.id, next);
            }}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 font-mono text-sm"
          />
          <p className="text-[calc(10px+3pt)] text-amber-700 mt-1">
            Changing the slug breaks old links. Use lowercase letters, numbers, and hyphens only.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
        <input
          value={s.name}
          onChange={(e) => update(s.id, { name: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Short description</label>
        <input
          value={s.shortDescription ?? ''}
          onChange={(e) => update(s.id, { shortDescription: e.target.value || undefined })}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Content</label>
        <ContentEditor value={s.content} onChange={(v) => update(s.id, { content: v })} />
      </div>

      <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4">
        <StepsEditor steps={s.steps ?? []} onChange={(steps) => updateSteps(s.id, steps)} />
      </div>

      <div>{packageList}</div>
    </div>
  );
}

function ContentEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);
  const [linkPopover, setLinkPopover] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  // Remember cursor position when link button is clicked
  const savedSelection = useRef<{ start: number; end: number }>({ start: 0, end: 0 });

  const insert = useCallback((prefix: string, suffix = '') => {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);
    const before = value.slice(0, start);
    const after = value.slice(end);
    const inserted = prefix + (selected || 'text') + suffix;
    const next = before + inserted + after;
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      const newCursorPos = start + prefix.length;
      ta.setSelectionRange(newCursorPos, newCursorPos + (selected || 'text').length);
    });
  }, [value, onChange]);

  const openLinkPopover = () => {
    const ta = ref.current;
    if (ta) {
      savedSelection.current = { start: ta.selectionStart, end: ta.selectionEnd };
      const selected = value.slice(ta.selectionStart, ta.selectionEnd);
      setLinkText(selected || '');
    }
    setLinkUrl('');
    setLinkPopover(true);
  };

  const insertLink = () => {
    const text = linkText.trim() || 'link';
    const url = linkUrl.trim() || '#';
    const markdown = `[${text}](${url})`;
    const { start, end } = savedSelection.current;
    const before = value.slice(0, start);
    const after = value.slice(end);
    onChange(before + markdown + after);
    setLinkPopover(false);
    setLinkText('');
    setLinkUrl('');
    requestAnimationFrame(() => {
      const ta = ref.current;
      if (ta) {
        ta.focus();
        const cursor = start + markdown.length;
        ta.setSelectionRange(cursor, cursor);
      }
    });
  };

  const toolbar = [
    { icon: Heading2, label: 'H2', action: () => insert('\n## ', '\n') },
    { icon: Heading3, label: 'H3', action: () => insert('\n### ', '\n') },
    { icon: Bold, label: 'Bold', action: () => insert('**', '**') },
    { icon: List, label: 'Bullets', action: () => insert('\n- ') },
    { icon: ListOrdered, label: 'Numbered', action: () => insert('\n1. ') },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 flex-wrap">
          {toolbar.map((btn) => (
            <button
              key={btn.label}
              type="button"
              onClick={btn.action}
              title={btn.label}
              className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-gray-500 hover:text-blue-600 transition-all"
            >
              <btn.icon className="w-4 h-4" />
            </button>
          ))}

          {/* Divider */}
          <div className="w-px h-5 bg-gray-300 mx-0.5" />

          {/* Link button */}
          <div className="relative">
            <button
              type="button"
              onClick={openLinkPopover}
              title="Insert link"
              className={`p-1.5 rounded-md hover:bg-white hover:shadow-sm transition-all ${
                linkPopover ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <Link2 className="w-4 h-4" />
            </button>

            {/* Inline link popover */}
            {linkPopover && (
              <div className="absolute top-full left-0 mt-1.5 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-3 w-72">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-blue-500" /> Insert Hyperlink
                  </span>
                  <button
                    type="button"
                    onClick={() => setLinkPopover(false)}
                    className="p-0.5 rounded text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[calc(11px+3pt)] font-medium text-gray-500 mb-1">Display text</label>
                    <input
                      autoFocus
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                      placeholder="e.g. Click here"
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[calc(11px+3pt)] font-medium text-gray-500 mb-1">URL</label>
                    <input
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && insertLink()}
                      placeholder="https://example.com"
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={insertLink}
                    disabled={!linkUrl.trim()}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <Check className="w-3.5 h-3.5" /> Insert Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPreview(!preview)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 transition-all"
        >
          {preview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {preview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {preview ? (
        <div className="px-4 py-3 rounded-lg border border-gray-200 bg-white min-h-[180px]">
          <RichContent content={value} />
        </div>
      ) : (
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={10}
          placeholder="## Heading&#10;&#10;Paragraph text here.&#10;&#10;- Bullet point&#10;- Another point&#10;&#10;1. Numbered step&#10;2. Next step&#10;&#10;**Bold text**&#10;&#10;[Link text](https://example.com)"
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 font-mono text-sm leading-relaxed"
        />
      )}
      <p className="text-[calc(11px+3pt)] text-gray-400">
        Use ## headings, ### subheadings, - bullets, 1. numbered, **bold**, [text](url) links
      </p>
    </div>
  );
}

function StepsEditor({
  steps,
  onChange,
}: {
  steps: string[];
  onChange: (steps: string[]) => void;
}) {
  const update = (i: number, val: string) => {
    const next = [...steps];
    next[i] = val;
    onChange(next);
  };
  const remove = (i: number) => onChange(steps.filter((_, idx) => idx !== i));
  const add = () => onChange([...steps, '']);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[calc(11px+3pt)] font-bold uppercase tracking-wider text-gray-400">How It Works — Steps</label>
        <button
          onClick={add}
          type="button"
          className="flex items-center gap-1 text-[calc(11px+3pt)] text-blue-500 hover:text-blue-700 font-semibold"
        >
          <Plus className="w-3 h-3" /> Add step
        </button>
      </div>
      {steps.length === 0 && (
        <p className="text-[calc(11px+3pt)] text-gray-300 italic">No steps — default steps will be used. Click "Add step" to customise.</p>
      )}
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-[calc(10px+3pt)] font-bold text-blue-700 flex-shrink-0">
            {i + 1}
          </span>
          <input
            value={step}
            onChange={(e) => update(i, e.target.value)}
            placeholder={`Step ${i + 1}…`}
            className="flex-1 px-2.5 py-1.5 rounded border border-gray-200 text-[calc(12.5px+3pt)] focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          />
          <button
            onClick={() => remove(i)}
            type="button"
            className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

function PackageFeaturesEditor({
  features,
  onChange,
}: {
  features: string[];
  onChange: (features: string[]) => void;
}) {
  const update = (i: number, val: string) => {
    const next = [...features];
    next[i] = val;
    onChange(next);
  };
  const remove = (i: number) => onChange(features.filter((_, idx) => idx !== i));
  const add = () => onChange([...features, '']);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between mb-1">
        <label className="text-[calc(11px+3pt)] font-bold uppercase tracking-wider text-gray-400">What's Included</label>
        <button
          onClick={add}
          type="button"
          className="flex items-center gap-1 text-[calc(11px+3pt)] text-blue-500 hover:text-blue-700 font-semibold"
        >
          <Plus className="w-3 h-3" /> Add item
        </button>
      </div>
      {features.length === 0 && (
        <p className="text-[calc(11px+3pt)] text-gray-300 italic">No items yet. Click "Add item" to add bullet points.</p>
      )}
      {features.map((f, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
          <input
            value={f}
            onChange={(e) => update(i, e.target.value)}
            placeholder={`Feature ${i + 1}`}
            className="flex-1 px-2.5 py-1 rounded border border-gray-200 text-[calc(12.5px+3pt)] focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          />
          <button
            onClick={() => remove(i)}
            type="button"
            className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function AdminServicesSection({ data, categories, onSave, saving }: Props) {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setServices(
      Array.isArray(data)
        ? data.map((s) => {
            const x = s as Service;
            return {
              id: String(x.id ?? ''),
              name: String(x.name ?? ''),
              mainHead: String(x.mainHead ?? ''),
              categoryId: String(x.categoryId ?? ''),
              shortDescription: x.shortDescription ? String(x.shortDescription) : undefined,
              content: String(x.content ?? ''),
              packages: Array.isArray(x.packages)
                ? x.packages.map((p) => ({
                    name: String(p.name ?? ''),
                    price: String(p.price ?? ''),
                    description: String(p.description ?? ''),
                    features: Array.isArray(p.features) ? p.features.map(String) : [],
                    popular: Boolean(p.popular ?? false),
                  }))
                : [],
              steps: Array.isArray(x.steps) ? x.steps.map(String) : [],
            };
          })
        : []
    );
  }, [data]);

  const filtered = useMemo(() => {
    if (!search.trim()) return services;
    const q = search.toLowerCase();
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.mainHead.toLowerCase().includes(q)
    );
  }, [services, search]);

  const update = (id: string, updates: Partial<Service>) => {
    setServices((p) =>
      p.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const updatePackage = (serviceId: string, pkgIndex: number, updates: Partial<ServicePackage>) => {
    setServices((p) =>
      p.map((s) => {
        if (s.id !== serviceId) return s;
        const next = [...s.packages];
        next[pkgIndex] = { ...next[pkgIndex], ...updates };
        return { ...s, packages: next };
      })
    );
  };

  const reorderPackages = (serviceId: string, packages: ServicePackage[]) => {
    setServices((p) =>
      p.map((s) => (s.id === serviceId ? { ...s, packages } : s))
    );
  };

  const addPackage = (serviceId: string) => {
    setServices((p) =>
      p.map((s) =>
        s.id === serviceId
          ? { ...s, packages: [...s.packages, { name: '', price: '', description: '', features: [], popular: false }] }
          : s
      )
    );
  };

  const deletePackage = (serviceId: string, pkgIndex: number) => {
    setServices((p) =>
      p.map((s) =>
        s.id === serviceId
          ? { ...s, packages: s.packages.filter((_, i) => i !== pkgIndex) }
          : s
      )
    );
  };

  const setPopular = (serviceId: string, pkgIndex: number) => {
    setServices((p) =>
      p.map((s) => {
        if (s.id !== serviceId) return s;
        const packages = s.packages.map((pkg, i) => ({ ...pkg, popular: i === pkgIndex ? !pkg.popular : false }));
        return { ...s, packages };
      })
    );
  };

  const updateSteps = (serviceId: string, steps: string[]) =>
    setServices((p) => p.map((s) => (s.id === serviceId ? { ...s, steps } : s)));

  const categoryTitle = useCallback(
    (id: string) => categories.find((c) => c.id === id)?.title ?? id,
    [categories]
  );

  const addService = () => {
    const defaultCat = categories[0]?.id ?? 'new-business';
    const nid = `new-service-${Date.now()}`;
    const newS: Service = {
      id: nid,
      name: 'New service',
      mainHead: 'SERVICES',
      categoryId: defaultCat,
      shortDescription: '',
      content: '## About this service\n\nDescribe what you offer.',
      packages: [
        { name: 'Standard', price: '₹0', description: 'Package description', features: [], popular: true },
      ],
      steps: [],
    };
    setServices((p) => [...p, newS]);
    setExpandedId(nid);
    setSearch('');
  };

  const removeService = (id: string) => {
    const svc = services.find((s) => s.id === id);
    if (!svc) return;
    if (!window.confirm(`Remove "${svc.name}" (${id}) from the site? Click Save services to apply.`)) return;
    setServices((p) => p.filter((s) => s.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const changeServiceId = (oldId: string, candidate: string) => {
    const nextId = slugifyId(candidate);
    if (!nextId) {
      window.alert('URL slug cannot be empty.');
      return;
    }
    if (nextId === oldId) return;
    if (services.some((x) => x.id === nextId)) {
      window.alert(`The slug "${nextId}" is already in use.`);
      return;
    }
    setServices((p) => p.map((s) => (s.id === oldId ? { ...s, id: nextId } : s)));
    if (expandedId === oldId) setExpandedId(nextId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-sm text-gray-600 max-w-xl">
          <strong>Add</strong> or <strong>remove</strong> whole services, or open a service and set <strong>Category / section</strong> to move it (e.g. from International Incorporations to another heading). Save when done.
        </p>
        <button
          type="button"
          onClick={addService}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add service
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          />
        </div>
        <span className="text-sm text-gray-500">{filtered.length} services</span>
      </div>

      <div className="space-y-3 max-h-[60vh] overflow-y-auto">
        {!search.trim() ? (
        <SortableList
          items={services}
          onReorder={setServices}
          getItemId={(s) => s.id}
          renderItem={(s) => (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div>
                <div className="font-semibold text-gray-900">{s.name}</div>
                <div className="text-xs text-gray-400">
                  {s.id} · <span className="text-gray-500">{categoryTitle(s.categoryId)}</span>
                </div>
              </div>
              {expandedId === s.id ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {expandedId === s.id && (
              <ServiceEditorBody
                s={s}
                categories={categories}
                update={update}
                updateSteps={updateSteps}
                updatePackage={updatePackage}
                reorderPackages={reorderPackages}
                addPackage={addPackage}
                deletePackage={deletePackage}
                setPopular={setPopular}
                onRemoveService={removeService}
                onChangeServiceId={changeServiceId}
                sortablePackages
              />
            )}
          </div>
          )}
        />
        ) : (
        filtered.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div>
                <div className="font-semibold text-gray-900">{s.name}</div>
                <div className="text-xs text-gray-400">
                  {s.id} · <span className="text-gray-500">{categoryTitle(s.categoryId)}</span>
                </div>
              </div>
              {expandedId === s.id ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {expandedId === s.id && (
              <ServiceEditorBody
                s={s}
                categories={categories}
                update={update}
                updateSteps={updateSteps}
                updatePackage={updatePackage}
                reorderPackages={reorderPackages}
                addPackage={addPackage}
                deletePackage={deletePackage}
                setPopular={setPopular}
                onRemoveService={removeService}
                onChangeServiceId={changeServiceId}
                sortablePackages={false}
              />
            )}
          </div>
        ))
        )}
      </div>

      <button
        onClick={() => onSave(services)}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
      >
        <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Services'}
      </button>
    </div>
  );
}
