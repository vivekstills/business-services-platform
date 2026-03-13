import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { SortableList } from './SortableList';

type Category = { id: string; title: string; description: string };

type Props = {
  data: unknown[];
  onSave: (data: unknown[]) => void;
  saving: boolean;
};

export default function AdminCategoriesSection({ data, onSave, saving }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setCategories(
      Array.isArray(data)
        ? data.map((c) => ({
            id: String((c as Category).id ?? ''),
            title: String((c as Category).title ?? ''),
            description: String((c as Category).description ?? ''),
          }))
        : []
    );
  }, [data]);

  const update = (i: number, k: keyof Category, v: string) => {
    setCategories((p) => {
      const next = [...p];
      next[i] = { ...next[i], [k]: v };
      return next;
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Categories</h2>
        <p className="text-xs text-gray-400">Drag to reorder. Order affects display on the site.</p>
        <SortableList
          items={categories}
          onReorder={setCategories}
          getItemId={(cat) => cat.id}
          renderItem={(cat, i) => (
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-400">{cat.id}</span>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                <input
                  value={cat.title}
                  onChange={(e) => update(i, 'title', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                <textarea
                  value={cat.description}
                  onChange={(e) => update(i, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                />
              </div>
            </div>
          )}
        />
      </div>

      <button
        onClick={() => onSave(categories)}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
      >
        <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Categories'}
      </button>
    </div>
  );
}
