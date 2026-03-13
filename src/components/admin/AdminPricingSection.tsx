import React, { useState, useEffect } from 'react';
import { Save, Trash2 } from 'lucide-react';
import { SortableList } from './SortableList';

type Plan = {
  name: string;
  badge: string | null;
  price: string;
  tagline: string;
  features: string[];
  cta: string;
  ctaTo: string;
  highlight: boolean;
};

type Props = {
  data: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
  saving: boolean;
};

export default function AdminPricingSection({ data, onSave, saving }: Props) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [footnote, setFootnote] = useState('');

  useEffect(() => {
    const d = data as { plans?: Plan[]; footnote?: string };
    setPlans(
      Array.isArray(d.plans)
        ? d.plans.map((p) => ({
            name: String(p.name ?? ''),
            badge: p.badge ? String(p.badge) : null,
            price: String(p.price ?? ''),
            tagline: String(p.tagline ?? ''),
            features: Array.isArray(p.features) ? p.features.map(String) : [],
            cta: String(p.cta ?? ''),
            ctaTo: String(p.ctaTo ?? ''),
            highlight: Boolean(p.highlight),
          }))
        : []
    );
    setFootnote(String(d.footnote ?? ''));
  }, [data]);

  const updatePlan = (i: number, updates: Partial<Plan>) => {
    setPlans((p) => {
      const next = [...p];
      next[i] = { ...next[i], ...updates };
      return next;
    });
  };

  const updateFeature = (planIndex: number, featureIndex: number, value: string) => {
    setPlans((p) => {
      const next = [...p];
      const arr = [...next[planIndex].features];
      arr[featureIndex] = value;
      next[planIndex] = { ...next[planIndex], features: arr };
      return next;
    });
  };

  const addFeature = (planIndex: number) => {
    setPlans((p) => {
      const next = [...p];
      next[planIndex] = {
        ...next[planIndex],
        features: [...next[planIndex].features, ''],
      };
      return next;
    });
  };

  const removeFeature = (planIndex: number, featureIndex: number) => {
    setPlans((p) => {
      const next = [...p];
      next[planIndex] = {
        ...next[planIndex],
        features: next[planIndex].features.filter((_, j) => j !== featureIndex),
      };
      return next;
    });
  };

  const reorderFeatures = (planIndex: number, features: string[]) => {
    setPlans((p) => {
      const next = [...p];
      next[planIndex] = { ...next[planIndex], features };
      return next;
    });
  };

  return (
    <div className="space-y-8">
      <p className="text-xs text-gray-400">Drag plans and features to reorder.</p>
      <div className="space-y-6">
        <SortableList
          items={plans}
          onReorder={setPlans}
          getItemId={(p, i) => `plan-${i}-${p.name}`}
          renderItem={(plan, i) => (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Plan: {plan.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                <input
                  value={plan.name}
                  onChange={(e) => updatePlan(i, { name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Badge (optional)</label>
                <input
                  value={plan.badge ?? ''}
                  onChange={(e) => updatePlan(i, { badge: e.target.value || null })}
                  placeholder="e.g. Most popular"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Price</label>
                <input
                  value={plan.price}
                  onChange={(e) => updatePlan(i, { price: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Tagline</label>
                <input
                  value={plan.tagline}
                  onChange={(e) => updatePlan(i, { tagline: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">CTA text</label>
                <input
                  value={plan.cta}
                  onChange={(e) => updatePlan(i, { cta: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">CTA link</label>
                <input
                  value={plan.ctaTo}
                  onChange={(e) => updatePlan(i, { ctaTo: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`highlight-${i}`}
                checked={plan.highlight}
                onChange={(e) => updatePlan(i, { highlight: e.target.checked })}
                className="rounded border-gray-300"
              />
              <label htmlFor={`highlight-${i}`} className="text-sm text-gray-600">
                Highlight (featured plan)
              </label>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-gray-500">Features</label>
                <button
                  onClick={() => addFeature(i)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add
                </button>
              </div>
              <SortableList
                items={plan.features}
                onReorder={(features) => reorderFeatures(i, features)}
                getItemId={(f, j) => `feat-${i}-${j}-${f.slice(0, 15)}`}
                renderItem={(f, j) => (
                  <div className="flex gap-2">
                    <input
                      value={f}
                      onChange={(e) => updateFeature(i, j, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                    />
                    <button
                      onClick={() => removeFeature(i, j)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              />
            </div>
            </div>
          )}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <label className="block text-xs font-medium text-gray-500 mb-2">Footnote</label>
        <input
          value={footnote}
          onChange={(e) => setFootnote(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
        />
      </div>

      <button
        onClick={() => onSave({ plans, footnote })}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
      >
        <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Pricing'}
      </button>
    </div>
  );
}
