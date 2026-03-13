import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { SortableList } from './SortableList';

type Props = {
  data: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
  saving: boolean;
};

export default function AdminHeroSection({ data, onSave, saving }: Props) {
  const [form, setForm] = useState({
    badge: '',
    headline: '',
    subheadline: '',
    popular: [] as { label: string; to: string }[],
    stats: [] as { value: string; label: string }[],
    trustCard: {
      title: '',
      subtitle: '',
      items: [] as { label: string; time: string }[],
      rating: '',
      reviews: '',
      badgeValue: '',
      badgeLabel: '',
    },
  });

  useEffect(() => {
    const d = data as {
      badge?: string;
      headline?: string;
      subheadline?: string;
      popular?: { label: string; to: string }[];
      stats?: { value: string; label: string }[];
      trustCard?: {
        title?: string;
        subtitle?: string;
        items?: { label: string; time: string }[];
        rating?: string;
        reviews?: string;
        badgeValue?: string;
        badgeLabel?: string;
      };
    };
    const tc = d.trustCard;
    setForm({
      badge: String(d.badge ?? ''),
      headline: String(d.headline ?? ''),
      subheadline: String(d.subheadline ?? ''),
      popular: Array.isArray(d.popular) ? d.popular : [],
      stats: Array.isArray(d.stats) ? d.stats : [],
      trustCard: {
        title: String(tc?.title ?? ''),
        subtitle: String(tc?.subtitle ?? ''),
        items: Array.isArray(tc?.items) ? tc.items : [],
        rating: String(tc?.rating ?? ''),
        reviews: String(tc?.reviews ?? ''),
        badgeValue: String(tc?.badgeValue ?? ''),
        badgeLabel: String(tc?.badgeLabel ?? ''),
      },
    });
  }, [data]);

  const update = (k: keyof typeof form, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Hero content</h2>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Badge</label>
          <input
            value={form.badge}
            onChange={(e) => update('badge', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Headline</label>
          <input
            value={form.headline}
            onChange={(e) => update('headline', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Subheadline</label>
          <textarea
            value={form.subheadline}
            onChange={(e) => update('subheadline', e.target.value)}
            rows={2}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Trust card</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
            <input
              value={form.trustCard.title}
              onChange={(e) => update('trustCard', { ...form.trustCard, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Subtitle</label>
            <input
              value={form.trustCard.subtitle}
              onChange={(e) => update('trustCard', { ...form.trustCard, subtitle: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Rating</label>
            <input
              value={form.trustCard.rating}
              onChange={(e) => update('trustCard', { ...form.trustCard, rating: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Reviews text</label>
            <input
              value={form.trustCard.reviews}
              onChange={(e) => update('trustCard', { ...form.trustCard, reviews: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Badge value</label>
            <input
              value={form.trustCard.badgeValue}
              onChange={(e) => update('trustCard', { ...form.trustCard, badgeValue: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Badge label</label>
            <input
              value={form.trustCard.badgeLabel}
              onChange={(e) => update('trustCard', { ...form.trustCard, badgeLabel: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Popular links</h2>
        <p className="text-xs text-gray-400">Drag to reorder. Shown as quick links in the hero.</p>
        <SortableList
          items={form.popular}
          onReorder={(items) => update('popular', items)}
          getItemId={(item) => item.label || item.to}
          renderItem={(item, i) => (
            <div className="flex gap-2">
              <input
                value={item.label}
                onChange={(e) => {
                  const next = [...form.popular];
                  next[i] = { ...next[i], label: e.target.value };
                  update('popular', next);
                }}
                placeholder="Label"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200"
              />
              <input
                value={item.to}
                onChange={(e) => {
                  const next = [...form.popular];
                  next[i] = { ...next[i], to: e.target.value };
                  update('popular', next);
                }}
                placeholder="/service/..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200"
              />
            </div>
          )}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Stats</h2>
        <p className="text-xs text-gray-400">Drag to reorder.</p>
        <SortableList
          items={form.stats}
          onReorder={(items) => update('stats', items)}
          getItemId={(item) => item.value || item.label}
          renderItem={(s, i) => (
            <div className="grid grid-cols-2 gap-4">
              <input
                value={s.value}
                onChange={(e) => {
                  const next = [...form.stats];
                  next[i] = { ...next[i], value: e.target.value };
                  update('stats', next);
                }}
                placeholder="Value"
                className="px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              />
              <input
                value={s.label}
                onChange={(e) => {
                  const next = [...form.stats];
                  next[i] = { ...next[i], label: e.target.value };
                  update('stats', next);
                }}
                placeholder="Label"
                className="px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              />
            </div>
          )}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Trust card items</h2>
        <p className="text-xs text-gray-400">Drag to reorder. Service items shown in the trust card.</p>
        <SortableList
          items={form.trustCard.items}
          onReorder={(items) => update('trustCard', { ...form.trustCard, items })}
          getItemId={(item) => item.label || item.time}
          renderItem={(item, i) => (
            <div className="flex gap-2">
              <input
                value={item.label}
                onChange={(e) => {
                  const next = [...form.trustCard.items];
                  next[i] = { ...next[i], label: e.target.value };
                  update('trustCard', { ...form.trustCard, items: next });
                }}
                placeholder="Label"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200"
              />
              <input
                value={item.time}
                onChange={(e) => {
                  const next = [...form.trustCard.items];
                  next[i] = { ...next[i], time: e.target.value };
                  update('trustCard', { ...form.trustCard, items: next });
                }}
                placeholder="Time"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200"
              />
            </div>
          )}
        />
      </div>

      <button
        onClick={() => onSave(form)}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
      >
        <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Hero'}
      </button>
    </div>
  );
}
