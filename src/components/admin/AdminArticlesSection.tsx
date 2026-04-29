import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Save, Plus, Trash2, ArrowLeft, Eye, EyeOff, Search,
  Heading2, Heading3, Heading4, List, ListOrdered, Bold, Link2, X, Check,
  BookOpen, Globe, EyeOff as Draft, Calendar, Tag, User, Clock,
  ChevronRight, Image, Quote, FileText, HelpCircle,
} from 'lucide-react';
import RichContent from '../RichContent';
import type { Article } from '../../types/content';
import {
  ARTICLE_CATEGORIES,
  getArticleCategoryBadgeClasses,
  normalizeArticleCategory,
} from '../../data/articleCategories';
import { formatReadingTimeLabel } from '../../utils/readingTime';

type Props = {
  data: Article[];
  categories: string[];
  onSave: (articles: Article[], categories: string[]) => void;
  saving: boolean;
};

// ─── Inline ContentEditor (mirrors AdminServicesSection version) ──────────────
function ContentEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);
  const [linkPopover, setLinkPopover] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const savedSel = useRef<{ start: number; end: number }>({ start: 0, end: 0 });

  const insert = useCallback((prefix: string, suffix = '') => {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);
    const next = value.slice(0, start) + prefix + (selected || 'text') + suffix + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length + (selected || 'text').length);
    });
  }, [value, onChange]);

  const openLink = () => {
    const ta = ref.current;
    if (ta) {
      savedSel.current = { start: ta.selectionStart, end: ta.selectionEnd };
      setLinkText(value.slice(ta.selectionStart, ta.selectionEnd) || '');
    }
    setLinkUrl('');
    setLinkPopover(true);
  };

  const insertLink = () => {
    const text = linkText.trim() || 'link';
    const url = linkUrl.trim() || '#';
    const md = `[${text}](${url})`;
    const { start, end } = savedSel.current;
    onChange(value.slice(0, start) + md + value.slice(end));
    setLinkPopover(false);
    requestAnimationFrame(() => {
      const ta = ref.current;
      if (ta) { ta.focus(); const c = start + md.length; ta.setSelectionRange(c, c); }
    });
  };

  const useTemplate = () => {
    if (value.trim() && !confirm('Replace current content with the structured template?')) return;
    onChange(STRUCTURED_TEMPLATE);
    setPreview(false);
  };

  const toolbar = [
    { icon: Heading2, label: 'H2 — Main section', action: () => insert('\n## ', '\n') },
    { icon: Heading3, label: 'H3 — Sub-section', action: () => insert('\n### ', '\n') },
    { icon: Heading4, label: 'H4 — Label badge', action: () => insert('\n#### ', '\n') },
    { icon: Bold, label: 'Bold', action: () => insert('**', '**') },
    { icon: List, label: 'Bullet list', action: () => insert('\n- ') },
    { icon: ListOrdered, label: 'Numbered list', action: () => insert('\n1. ') },
    { icon: Quote, label: 'Callout / Info box (> )', action: () => insert('\n> ') },
  ];

  return (
    <div className="space-y-2">
      {/* Top row: toolbar + actions */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 flex-wrap">
          {toolbar.map((btn) => (
            <button key={btn.label} type="button" onClick={btn.action} title={btn.label}
              className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-gray-500 hover:text-blue-600 transition-all">
              <btn.icon className="w-4 h-4" />
            </button>
          ))}
          <div className="w-px h-5 bg-gray-300 mx-0.5" />
          <div className="relative">
            <button type="button" onClick={openLink} title="Insert link"
              className={`p-1.5 rounded-md hover:bg-white hover:shadow-sm transition-all ${linkPopover ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-blue-600'}`}>
              <Link2 className="w-4 h-4" />
            </button>
            {linkPopover && (
              <div className="absolute top-full left-0 mt-1.5 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-3 w-72">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-blue-500" /> Insert Hyperlink
                  </span>
                  <button type="button" onClick={() => setLinkPopover(false)} className="p-0.5 rounded text-gray-400 hover:text-gray-600"><X className="w-3.5 h-3.5" /></button>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[calc(11px+3pt)] font-medium text-gray-500 mb-1">Display text</label>
                    <input autoFocus value={linkText} onChange={(e) => setLinkText(e.target.value)} placeholder="e.g. Click here" className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[calc(11px+3pt)] font-medium text-gray-500 mb-1">URL</label>
                    <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && insertLink()} placeholder="https://example.com" className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 outline-none" />
                  </div>
                  <button type="button" onClick={insertLink} disabled={!linkUrl.trim()} className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed">
                    <Check className="w-3.5 h-3.5" /> Insert Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Structured template button */}
          <button type="button" onClick={useTemplate} title="Load structured article template"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all">
            <FileText className="w-3.5 h-3.5" /> Use Template
          </button>
          {/* Format guide */}
          <div className="relative">
            <button type="button" onClick={() => setHelpOpen(!helpOpen)} title="Formatting guide"
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${helpOpen ? 'bg-gray-200 text-gray-700' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}>
              <HelpCircle className="w-4 h-4" />
            </button>
            {helpOpen && (
              <div className="absolute top-full right-0 mt-1.5 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-72 text-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-gray-700">Formatting Guide</span>
                  <button type="button" onClick={() => setHelpOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-3.5 h-3.5" /></button>
                </div>
                <div className="space-y-2 font-mono text-gray-600">
                  {[
                    ['## Heading', '→ Large section title'],
                    ['### Sub-heading', '→ Sub-section title'],
                    ['#### Label', '→ Blue label badge (a), b)…)'],
                    ['**bold text**', '→ Bold / highlighted'],
                    ['- item', '→ Bullet list'],
                    ['1. item', '→ Numbered step list'],
                    ['> note text', '→ Amber callout / info box'],
                    ['[text](url)', '→ Hyperlink'],
                  ].map(([syntax, desc]) => (
                    <div key={syntax} className="flex gap-2 items-start">
                      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-blue-700 flex-shrink-0">{syntax}</code>
                      <span className="text-gray-500 text-[10px] pt-0.5">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Preview toggle */}
          <button type="button" onClick={() => setPreview(!preview)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 transition-all">
            {preview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {preview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {preview ? (
        <div className="px-4 py-3 rounded-lg border border-gray-200 bg-white min-h-[260px]">
          <RichContent content={value} />
        </div>
      ) : (
        <textarea ref={ref} value={value} onChange={(e) => onChange(e.target.value)} rows={16}
          placeholder="Click 'Use Template' above to load a pre-built structured article template, or type freely using the toolbar."
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 font-mono text-sm leading-relaxed" />
      )}
      <p className="text-[calc(11px+3pt)] text-gray-400">
        ## sections · ### sub-sections · #### labels · - bullets · 1. steps · **bold** · &gt; callout box
      </p>
    </div>
  );
}

// ─── Structured article template ─────────────────────────────────────────────
const STRUCTURED_TEMPLATE = `## 1) Detailed Brief / Overview

Write a comprehensive overview here. Explain what this topic is about, why it matters, and who it applies to.

- Key point one
- Key point two
- Key point three

## 2) Advantages / Benefits

### a) First Benefit

Describe the first benefit here.

### b) Second Benefit

Describe the second benefit here.

### c) Third Benefit

Describe the third benefit here.

## 3) Disadvantages / Limitations

### a) First Limitation

Describe the first limitation here.

### b) Second Limitation

Describe the second limitation here.

## 4) Applicability

Who does this apply to and where?

- **Category One** — Details here
- **Category Two** — Details here

## 5) Key Features

### a) Feature One

**Value or detail** here.

### b) Feature Two

**Value or detail** here.

## 6) Documents Required

### Primary Documents

- Document one
- Document two
- Document three

### Supporting Documents

- Supporting doc one
- Supporting doc two

## 7) Process / Procedure

1. **Step One** — Describe what to do in this step.
2. **Step Two** — Describe what to do in this step.
3. **Step Three** — Describe what to do in this step.
4. **Step Four** — Describe what to do in this step.

## 8) Fees / Costs Payable

### a) Government Fee

**Amount** — Description

### b) Penalties

**Percentage or amount** for non-compliance

> **Key Calculation Example** — Replace this with a real example. Input: ₹X | Tax: ₹Y | **Total: ₹Z**

## Conclusion

Summarise the topic, key takeaways, and what readers should do next.
`;

// ─── Slug generator ───────────────────────────────────────────────────────────
function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ─── Empty article template ───────────────────────────────────────────────────
function emptyArticle(): Article {
  return {
    id: `article-${Date.now()}`,
    title: '',
    slug: '',
    category: '',
    excerpt: '',
    content: '',
    author: 'Mridhuv Associates',
    date: new Date().toISOString().slice(0, 10),
    published: false,
    tags: [],
    readingTime: formatReadingTimeLabel(''),
  };
}

// ─── Category badge ───────────────────────────────────────────────────────────
function CategoryBadge({ cat }: { cat: string }) {
  const cls = getArticleCategoryBadgeClasses(cat);
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[calc(11px+3pt)] font-semibold border ${cls}`}>{cat}</span>;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AdminArticlesSection({ data, categories, onSave, saving }: Props) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [cats, setCats] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Article | null>(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [newCat, setNewCat] = useState('');
  const [showCatMgr, setShowCatMgr] = useState(false);

  useEffect(() => {
    const normalizedArticles = (Array.isArray(data) ? data : []).map((a) => ({
      ...a,
      category: normalizeArticleCategory(a.category || ''),
    }));
    setArticles(normalizedArticles);
    const articleDerived = (Array.isArray(data) ? data : [])
      .map((a) => normalizeArticleCategory((a.category || '').trim()))
      .filter(Boolean);
    const incoming = (Array.isArray(categories) ? categories : [])
      .map((c) => normalizeArticleCategory((c || '').trim()))
      .filter(Boolean);
    const normalized = Array.from(new Set([...ARTICLE_CATEGORIES, ...incoming, ...articleDerived]));
    setCats(normalized);
  }, [data, categories]);

  const filtered = [...articles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter((a) => {
      if (filterCat && a.category !== filterCat) return false;
      if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.excerpt.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });

  const startEdit = (article: Article) => {
    setDraft({ ...article });
    setEditingId(article.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startNew = () => {
    const a = emptyArticle();
    setDraft(a);
    setEditingId(a.id);
  };

  const updateDraft = (field: keyof Article, value: unknown) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [field]: value } as Article;
      if (field === 'title') updated.slug = toSlug(value as string);
      if (field === 'content' && typeof value === 'string') {
        updated.readingTime = formatReadingTimeLabel(value);
      }
      return updated;
    });
  };

  const saveDraft = () => {
    if (!draft) return;
    const finalDraft: Article = { ...draft, readingTime: formatReadingTimeLabel(draft.content) };
    const exists = articles.find((a) => a.id === finalDraft.id);
    const next = exists ? articles.map((a) => (a.id === finalDraft.id ? finalDraft : a)) : [...articles, finalDraft];
    setArticles(next);
    onSave(next, cats);
    setEditingId(null);
    setDraft(null);
  };

  const deleteArticle = (id: string) => {
    if (!confirm('Delete this article?')) return;
    const next = articles.filter((a) => a.id !== id);
    setArticles(next);
    onSave(next, cats);
    if (editingId === id) { setEditingId(null); setDraft(null); }
  };

  const togglePublish = (id: string) => {
    const next = articles.map((a) => a.id === id ? { ...a, published: !a.published } : a);
    setArticles(next);
    onSave(next, cats);
  };

  const addCat = () => {
    const t = newCat.trim();
    if (!t || cats.includes(t)) return;
    const next = [...cats, t];
    setCats(next);
    onSave(articles, next);
    setNewCat('');
  };

  const deleteCat = (cat: string) => {
    const next = cats.filter((c) => c !== cat);
    setCats(next);
    onSave(articles, next);
  };

  // ── Editor view ──────────────────────────────────────────────────────────────
  if (editingId && draft) {
    const isNew = !articles.find((a) => a.id === draft.id);
    return (
      <div className="space-y-5">
        {/* Back bar */}
        <div className="flex items-center justify-between">
          <button onClick={() => { setEditingId(null); setDraft(null); }}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to articles
          </button>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${draft.published ? 'bg-green-100 text-green-700' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>
              {draft.published ? 'Published' : 'Draft'}
            </span>
            <button onClick={saveDraft} disabled={saving || !draft.title.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? 'Saving…' : isNew ? 'Publish article' : 'Save changes'}
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Article Title *</label>
            <input value={draft.title} onChange={(e) => updateDraft('title', e.target.value)} placeholder="e.g. Complete Guide to GST Registration in India"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-lg font-semibold focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Slug (URL)</label>
              <input value={draft.slug} onChange={(e) => updateDraft('slug', e.target.value)} placeholder="auto-generated-from-title"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm font-mono focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
              <p className="text-[calc(11px+3pt)] text-gray-400 mt-1">URL: /articles/{draft.slug || 'slug'}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
              <select value={draft.category} onChange={(e) => updateDraft('category', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100">
                <option value="">Select a category…</option>
                {cats.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Article Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><User className="w-3.5 h-3.5" /> Author</label>
              <input value={draft.author} onChange={(e) => updateDraft('author', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Date</label>
              <input type="date" value={draft.date} onChange={(e) => updateDraft('date', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Reading time</label>
              <div className="w-full px-3 py-2 rounded-lg border border-gray-100 bg-gray-50 text-sm text-gray-700">
                {formatReadingTimeLabel(draft.content)}
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Estimated from article body; updates as you edit content.</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Tags (comma-separated)</label>
              <input value={draft.tags.join(', ')} onChange={(e) => updateDraft('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))} placeholder="GST, Tax, Registration"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><Image className="w-3.5 h-3.5" /> Cover Image URL (optional)</label>
            <input value={draft.coverImage ?? ''} onChange={(e) => updateDraft('coverImage', e.target.value || undefined)} placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Excerpt / Summary *</label>
            <textarea value={draft.excerpt} onChange={(e) => updateDraft('excerpt', e.target.value)} rows={3}
              placeholder="A short summary shown on the article listing page (2-3 sentences)."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-700">Published</p>
              <p className="text-xs text-gray-400">Visible on the public Articles page</p>
            </div>
            <button onClick={() => updateDraft('published', !draft.published)}
              className={`relative w-12 h-6 rounded-full transition-colors ${draft.published ? 'bg-green-500' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${draft.published ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Content editor */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Article Content</h3>
          <ContentEditor value={draft.content} onChange={(v) => updateDraft('content', v)} />
        </div>

        {/* Bottom actions */}
        <div className="flex items-center justify-between">
          {!isNew && (
            <button onClick={() => deleteArticle(draft.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 text-sm font-medium transition-colors">
              <Trash2 className="w-4 h-4" /> Delete article
            </button>
          )}
          <div className="ml-auto flex items-center gap-3">
            <button onClick={() => { setEditingId(null); setDraft(null); }} className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-100">
              Cancel
            </button>
            <button onClick={saveDraft} disabled={saving || !draft.title.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? 'Saving…' : isNew ? 'Publish article' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── List view ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-600" /> Articles</h2>
            <p className="text-xs text-gray-400 mt-0.5">{articles.filter((a) => a.published).length} published · {articles.filter((a) => !a.published).length} drafts</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowCatMgr(!showCatMgr)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 font-medium transition-all">
              <Tag className="w-4 h-4" /> Categories
            </button>
            <button onClick={startNew}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">
              <Plus className="w-4 h-4" /> New Article
            </button>
          </div>
        </div>

        {/* Category manager */}
        {showCatMgr && (
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3 mb-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Manage Categories</h3>
            <div className="flex flex-wrap gap-2">
              {cats.map((c) => (
                <div key={c} className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2.5 py-1">
                  <span className="text-sm text-gray-700">{c}</span>
                  <button onClick={() => deleteCat(c)} className="text-gray-300 hover:text-red-500 transition-colors ml-1"><X className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newCat} onChange={(e) => setNewCat(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addCat()} placeholder="New category name…"
                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
              <button onClick={addCat} disabled={!newCat.trim() || cats.includes(newCat.trim())}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-40">
                Add
              </button>
            </div>
          </div>
        )}

        {/* Search + filter */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles…"
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
          </div>
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 focus:border-blue-400 focus:ring-1 focus:ring-blue-100">
            <option value="">All categories</option>
            {cats.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Article list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">{articles.length === 0 ? 'No articles yet' : 'No articles match your search'}</p>
          <p className="text-sm text-gray-400 mt-1">{articles.length === 0 ? 'Click "New Article" to create your first one.' : 'Try a different search or filter.'}</p>
          {articles.length === 0 && (
            <button onClick={startNew} className="mt-4 px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">
              Create first article
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((article) => (
            <div key={article.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-200 hover:shadow-sm transition-all group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    {article.category && <CategoryBadge cat={article.category} />}
                    <span className={`text-[calc(11px+3pt)] font-semibold ${article.published ? 'text-green-600' : 'text-yellow-600'}`}>
                      {article.published ? '● Published' : '○ Draft'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate pr-2">{article.title || <span className="text-gray-400 italic">Untitled</span>}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">{article.excerpt}</p>
                  <div className="flex items-center gap-3 mt-2 text-[calc(11px+3pt)] text-gray-400">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {article.author}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {article.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatReadingTimeLabel(article.content)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => togglePublish(article.id)}
                    title={article.published ? 'Unpublish' : 'Publish'}
                    className={`p-2 rounded-lg transition-colors ${article.published ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}>
                    <Globe className="w-4 h-4" />
                  </button>
                  <button onClick={() => startEdit(article)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-blue-600 hover:bg-blue-50 font-medium transition-colors">
                    Edit <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteArticle(article.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
