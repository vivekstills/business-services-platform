import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, MapPin, HelpCircle } from 'lucide-react';
import { SortableList } from './SortableList';
import { INDIAN_STATES } from '../../data/stateData';

type FAQ = { q: string; a: string };

type ServiceFaqMode = 'all-states' | 'per-state';

type ServiceStateFaqs = {
  mode: ServiceFaqMode;
  allStateFaqs: FAQ[];
  perStateFaqs: Record<string, FAQ[]>;
};

type StateFaqConfig = Record<string, ServiceStateFaqs>;

type Props = {
  data: Record<string, unknown>;
  services: { id: string; name: string }[];
  onSave: (data: Record<string, unknown>) => void;
  saving: boolean;
};

const DEFAULT_SVC: ServiceStateFaqs = { mode: 'all-states', allStateFaqs: [], perStateFaqs: {} };

function parseFaqArr(arr: unknown): FAQ[] {
  if (!Array.isArray(arr)) return [];
  return arr.map((f) => ({ q: String((f as FAQ).q ?? ''), a: String((f as FAQ).a ?? '') }));
}

function parseConfig(raw: Record<string, unknown>): StateFaqConfig {
  const out: StateFaqConfig = {};

  // Handle new format: { "gst-registration": { mode, allStateFaqs, perStateFaqs } }
  for (const [key, val] of Object.entries(raw)) {
    if (key === 'mode' || key === 'globalFaqs' || key === 'serviceFaqs') continue;
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      const svcData = val as Record<string, unknown>;
      const mode = svcData.mode === 'per-state' ? 'per-state' : 'all-states';
      const allStateFaqs = parseFaqArr(svcData.allStateFaqs);
      const perStateFaqs: Record<string, FAQ[]> = {};
      if (svcData.perStateFaqs && typeof svcData.perStateFaqs === 'object') {
        for (const [state, faqs] of Object.entries(svcData.perStateFaqs as Record<string, unknown>)) {
          perStateFaqs[state] = parseFaqArr(faqs);
        }
      }
      out[key] = { mode, allStateFaqs, perStateFaqs };
    }
  }

  // Handle legacy format: { mode: "all"|"per-service", globalFaqs: {...}, serviceFaqs: {...} }
  if (raw.serviceFaqs && typeof raw.serviceFaqs === 'object') {
    for (const [svcId, states] of Object.entries(raw.serviceFaqs as Record<string, unknown>)) {
      if (out[svcId]) continue;
      if (states && typeof states === 'object' && !Array.isArray(states)) {
        const perStateFaqs: Record<string, FAQ[]> = {};
        for (const [state, arr] of Object.entries(states as Record<string, unknown>)) {
          perStateFaqs[state] = parseFaqArr(arr);
        }
        out[svcId] = { mode: 'per-state', allStateFaqs: [], perStateFaqs };
      }
    }
  }

  return out;
}

export default function AdminStateFAQSection({ data, services, onSave, saving }: Props) {
  const [config, setConfig] = useState<StateFaqConfig>({});
  const [selectedService, setSelectedService] = useState('');
  const [selectedState, setSelectedState] = useState('');

  useEffect(() => {
    const parsed = data && typeof data === 'object' && Object.keys(data).length ? parseConfig(data) : {};
    setConfig(parsed);
  }, [data]);

  useEffect(() => {
    if (!selectedService && services?.length) setSelectedService(services[0].id);
  }, [services, selectedService]);

  const svcConfig = config[selectedService] ?? DEFAULT_SVC;
  const mode = svcConfig.mode;

  const statesWithData = Object.keys(svcConfig.perStateFaqs);
  const availableStates = INDIAN_STATES.filter((s) => !statesWithData.includes(s));

  const currentFaqs: FAQ[] = mode === 'all-states'
    ? svcConfig.allStateFaqs
    : (svcConfig.perStateFaqs[selectedState] ?? []);

  const updateSvcConfig = (updates: Partial<ServiceStateFaqs>) => {
    setConfig((prev) => ({
      ...prev,
      [selectedService]: { ...(prev[selectedService] ?? DEFAULT_SVC), ...updates },
    }));
  };

  const setCurrentFaqs = (faqs: FAQ[]) => {
    if (mode === 'all-states') {
      updateSvcConfig({ allStateFaqs: faqs });
    } else {
      const prev = config[selectedService]?.perStateFaqs ?? {};
      updateSvcConfig({ perStateFaqs: { ...prev, [selectedState]: faqs } });
    }
  };

  const updateFaq = (i: number, field: 'q' | 'a', value: string) => {
    const next = [...currentFaqs];
    next[i] = { ...next[i], [field]: value };
    setCurrentFaqs(next);
  };

  const addFaq = () => setCurrentFaqs([...currentFaqs, { q: '', a: '' }]);
  const removeFaq = (i: number) => setCurrentFaqs(currentFaqs.filter((_, j) => j !== i));

  const addState = (state: string) => {
    if (!state || !selectedService) return;
    const prev = config[selectedService]?.perStateFaqs ?? {};
    updateSvcConfig({ perStateFaqs: { ...prev, [state]: [] } });
    setSelectedState(state);
  };

  const deleteState = () => {
    if (!selectedState || !selectedService) return;
    const prev = { ...(config[selectedService]?.perStateFaqs ?? {}) };
    delete prev[selectedState];
    updateSvcConfig({ perStateFaqs: prev });
    setSelectedState('');
  };

  const toggleMode = (newMode: ServiceFaqMode) => {
    updateSvcConfig({ mode: newMode });
    setSelectedState('');
  };

  const svcName = services.find((s) => s.id === selectedService)?.name ?? selectedService;

  return (
    <div className="space-y-6">
      {/* Step 1: Select service */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <HelpCircle className="w-4 h-4" /> Step 1 — Select Service
        </h2>
        <select
          value={selectedService}
          onChange={(e) => { setSelectedService(e.target.value); setSelectedState(''); }}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
        >
          <option value="">Choose a service…</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Step 2: Yes/No — same for all states? */}
      {selectedService && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
            Step 2 — Apply same FAQs to all states for "{svcName}"?
          </h2>
          <p className="text-sm text-gray-500">
            If <strong>Yes</strong>, write FAQs once — they show for every state the user picks.
            If <strong>No</strong>, you can add different FAQs for each state.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => toggleMode('all-states')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                mode === 'all-states'
                  ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Yes — same FAQs for all states
            </button>
            <button
              onClick={() => toggleMode('per-state')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                mode === 'per-state'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              No — different FAQs per state
            </button>
          </div>
        </div>
      )}

      {/* "No" mode → Step 3: Pick a state */}
      {selectedService && mode === 'per-state' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Step 3 — Select State
            </h2>
            {availableStates.length > 0 && (
              <select
                value=""
                onChange={(e) => addState(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium border border-blue-200 focus:ring-1 focus:ring-blue-200"
              >
                <option value="">+ Add state…</option>
                {availableStates.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}
          </div>

          {statesWithData.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {statesWithData.sort().map((state) => (
                <button
                  key={state}
                  onClick={() => setSelectedState(state)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedState === state
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No states added yet. Use the dropdown above to add one.</p>
          )}
        </div>
      )}

      {/* FAQ editor — shown in "Yes" mode directly, in "No" mode after selecting state */}
      {selectedService && (mode === 'all-states' || (mode === 'per-state' && selectedState)) && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              {mode === 'all-states'
                ? `FAQs for "${svcName}" (all states)`
                : `FAQs — ${selectedState}`}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={addFaq}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200"
              >
                <Plus className="w-4 h-4" /> Add FAQ
              </button>
              {mode === 'per-state' && selectedState && (
                <button
                  onClick={deleteState}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4" /> Remove state
                </button>
              )}
            </div>
          </div>

          {mode === 'all-states' && (
            <div className="px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
              These FAQs will automatically appear for <strong>every state</strong> when a user selects any state on the "{svcName}" page.
            </div>
          )}

          {currentFaqs.length === 0 ? (
            <p className="text-sm text-gray-400">No FAQs yet. Click "Add FAQ" to create one.</p>
          ) : (
            <SortableList
              items={currentFaqs}
              onReorder={(items) => setCurrentFaqs(items)}
              getItemId={(_, i) => `sfaq-${selectedService}-${mode}-${selectedState}-${i}`}
              renderItem={(faq, i) => (
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-3">
                  <div className="flex justify-end">
                    <button onClick={() => removeFaq(i)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50">
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
          )}
        </div>
      )}

      <button
        onClick={() => onSave(config as unknown as Record<string, unknown>)}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
      >
        <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save State FAQs'}
      </button>
    </div>
  );
}
