import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { SortableList } from './SortableList';

type Props = {
  data: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
  saving: boolean;
};

export default function AdminGetInTouchSection({ data, onSave, saving }: Props) {
  const [form, setForm] = useState({
    label: '',
    heading: '',
    subheading: '',
    servicesList: [] as string[],
    features: [] as { label: string; desc: string }[],
  });

  useEffect(() => {
    const d = data as {
      label?: string;
      heading?: string;
      subheading?: string;
      servicesList?: string[];
      features?: { label: string; desc: string }[];
    };
    setForm({
      label: String(d.label ?? ''),
      heading: String(d.heading ?? ''),
      subheading: String(d.subheading ?? ''),
      servicesList: Array.isArray(d.servicesList) ? d.servicesList : [],
      features: Array.isArray(d.features) ? d.features : [],
    });
  }, [data]);

  const update = (k: keyof typeof form, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Get in Touch section</h2>
        <p className="text-xs text-gray-400">The contact form block on the homepage.</p>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
          <input
            value={form.label}
            onChange={(e) => update('label', e.target.value)}
            placeholder="Get in Touch"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Heading</label>
          <input
            value={form.heading}
            onChange={(e) => update('heading', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Subheading</label>
          <textarea
            value={form.subheading}
            onChange={(e) => update('subheading', e.target.value)}
            rows={2}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Services dropdown list</h2>
        <p className="text-xs text-gray-400">Drag to reorder. Options shown in the enquiry form service selector.</p>
        <SortableList
          items={form.servicesList}
          onReorder={(items) => update('servicesList', items)}
          getItemId={(item, i) => `svc-${i}-${item}`}
          renderItem={(item, i) => (
            <div className="flex gap-2">
              <input
                value={item}
                onChange={(e) => {
                  const next = [...form.servicesList];
                  next[i] = e.target.value;
                  update('servicesList', next);
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={() => update('servicesList', form.servicesList.filter((_, j) => j !== i))}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        />
        <button
          type="button"
          onClick={() => update('servicesList', [...form.servicesList, ''])}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
        >
          <Plus className="w-4 h-4" /> Add option
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Feature cards</h2>
        <p className="text-xs text-gray-400">Drag to reorder.</p>
        <SortableList
          items={form.features}
          onReorder={(items) => update('features', items)}
          getItemId={(f) => f.label || f.desc}
          renderItem={(f, i) => (
            <div className="p-4 rounded-lg border border-gray-100 space-y-2">
              <input
                value={f.label}
                onChange={(e) => {
                  const next = [...form.features];
                  next[i] = { ...next[i], label: e.target.value };
                  update('features', next);
                }}
                placeholder="Label"
                className="w-full px-4 py-2 rounded-lg border border-gray-200"
              />
              <input
                value={f.desc}
                onChange={(e) => {
                  const next = [...form.features];
                  next[i] = { ...next[i], desc: e.target.value };
                  update('features', next);
                }}
                placeholder="Description"
                className="w-full px-4 py-2 rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => update('features', form.features.filter((_, j) => j !== i))}
                className="text-sm text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          )}
        />
        <button
          type="button"
          onClick={() => update('features', [...form.features, { label: '', desc: '' }])}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
        >
          <Plus className="w-4 h-4" /> Add feature
        </button>
      </div>

      <button
        onClick={() => onSave(form)}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
      >
        <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save'}
      </button>
    </div>
  );
}
