import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

type Props = {
  data: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
  saving: boolean;
};

export default function AdminOurServicesSection({ data, onSave, saving }: Props) {
  const [form, setForm] = useState({
    label: '',
    heading: '',
    description: '',
  });

  useEffect(() => {
    const d = data as { label?: string; heading?: string; description?: string };
    setForm({
      label: String(d.label ?? ''),
      heading: String(d.heading ?? ''),
      description: String(d.description ?? ''),
    });
  }, [data]);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Our Services section</h2>
        <p className="text-xs text-gray-400">The services block heading on the homepage.</p>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
          <input
            value={form.label}
            onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
            placeholder="Our Services"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Heading</label>
          <input
            value={form.heading}
            onChange={(e) => setForm((p) => ({ ...p, heading: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          />
        </div>
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
