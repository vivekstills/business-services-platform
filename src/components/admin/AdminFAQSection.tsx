import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { SortableList } from './SortableList';

type FAQ = { q: string; a: string };
type Service = { id: string; name: string };

type Props = {
  data: Record<string, unknown[]>;
  services: { id: string; name: string }[];
  onSave: (data: Record<string, FAQ[]>) => void;
  saving: boolean;
};

export default function AdminFAQSection({ data, services, onSave, saving }: Props) {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [faqs, setFaqs] = useState<Record<string, FAQ[]>>({});

  useEffect(() => {
    const out: Record<string, FAQ[]> = {};
    for (const [k, v] of Object.entries(data)) {
      if (Array.isArray(v)) {
        out[k] = v.map((x) => ({
          q: String((x as FAQ).q ?? ''),
          a: String((x as FAQ).a ?? ''),
        }));
      }
    }
    setFaqs(out);
    if (!selectedServiceId && Object.keys(out).length) {
      setSelectedServiceId(Object.keys(out)[0]);
    }
  }, [data]);

  useEffect(() => {
    if (!selectedServiceId && services?.length) {
      setSelectedServiceId(services[0]?.id ?? '');
    }
  }, [services, selectedServiceId]);

  const currentFaqs = selectedServiceId ? (faqs[selectedServiceId] ?? []) : [];
  const serviceOptions = services?.length ? services : Object.keys(faqs).map((id) => ({ id, name: id }));

  const updateFaq = (i: number, field: 'q' | 'a', value: string) => {
    if (!selectedServiceId) return;
    const next = [...(faqs[selectedServiceId] ?? [])];
    next[i] = { ...next[i], [field]: value };
    setFaqs((p) => ({ ...p, [selectedServiceId]: next }));
  };

  const addFaq = () => {
    if (!selectedServiceId) return;
    const next = [...(faqs[selectedServiceId] ?? []), { q: '', a: '' }];
    setFaqs((p) => ({ ...p, [selectedServiceId]: next }));
  };

  const removeFaq = (i: number) => {
    if (!selectedServiceId) return;
    const next = (faqs[selectedServiceId] ?? []).filter((_, j) => j !== i);
    setFaqs((p) => ({ ...p, [selectedServiceId]: next }));
  };

  const reorderFaqs = (items: FAQ[]) => {
    if (!selectedServiceId) return;
    setFaqs((p) => ({ ...p, [selectedServiceId]: items }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Select service</h2>
        <select
          value={selectedServiceId}
          onChange={(e) => setSelectedServiceId(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
        >
          <option value="">Choose a service…</option>
          {serviceOptions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {selectedServiceId && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              FAQs for {serviceOptions.find((s) => s.id === selectedServiceId)?.name ?? selectedServiceId}
            </h2>
            <button
              onClick={addFaq}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200"
            >
              <Plus className="w-4 h-4" /> Add FAQ
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-gray-400">Drag to reorder FAQs.</p>
            <SortableList
              items={currentFaqs}
              onReorder={reorderFaqs}
              getItemId={(faq, i) => `faq-${selectedServiceId}-${i}`}
              renderItem={(faq, i) => (
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-3">
                  <div className="flex justify-end">
                    <button
                      onClick={() => removeFaq(i)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Question</label>
                    <input
                      value={faq.q}
                      onChange={(e) => updateFaq(i, 'q', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Answer</label>
                    <textarea
                      value={faq.a}
                      onChange={(e) => updateFaq(i, 'a', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                    />
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      )}

      <button
        onClick={() => onSave(faqs)}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
      >
        <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save FAQs'}
      </button>
    </div>
  );
}
