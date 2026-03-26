import React, { useState, useEffect } from 'react';
import { Save, Trash2, MapPin, MessageSquare } from 'lucide-react';
import { INDIAN_STATES } from '../../data/stateData';

type HintsMap = Record<string, Record<string, string>>;

type Props = {
  data: Record<string, unknown>;
  services: { id: string; name: string }[];
  onSave: (data: Record<string, unknown>) => void;
  saving: boolean;
};

function parseHints(raw: Record<string, unknown>): HintsMap {
  const out: HintsMap = {};
  for (const [svcId, states] of Object.entries(raw)) {
    if (states && typeof states === 'object' && !Array.isArray(states)) {
      out[svcId] = {};
      for (const [state, text] of Object.entries(states as Record<string, unknown>)) {
        if (typeof text === 'string') out[svcId][state] = text;
      }
    }
  }
  return out;
}

export default function AdminStateHintsSection({ data, services, onSave, saving }: Props) {
  const [hints, setHints] = useState<HintsMap>({});
  const [selectedService, setSelectedService] = useState('');
  const [selectedState, setSelectedState] = useState('');

  useEffect(() => {
    setHints(data && typeof data === 'object' ? parseHints(data as Record<string, unknown>) : {});
  }, [data]);

  useEffect(() => {
    if (!selectedService && services?.length) setSelectedService(services[0].id);
  }, [services, selectedService]);

  const statesWithHints = selectedService ? Object.keys(hints[selectedService] ?? {}).sort() : [];
  const usedStates = new Set(statesWithHints);
  const availableStates = INDIAN_STATES.filter((s) => !usedStates.has(s));

  const currentText = selectedService && selectedState
    ? (hints[selectedService]?.[selectedState] ?? '')
    : '';

  const setHintText = (text: string) => {
    if (!selectedService || !selectedState) return;
    setHints((prev) => ({
      ...prev,
      [selectedService]: { ...(prev[selectedService] ?? {}), [selectedState]: text },
    }));
  };

  const addState = (state: string) => {
    if (!state || !selectedService) return;
    setHints((prev) => ({
      ...prev,
      [selectedService]: { ...(prev[selectedService] ?? {}), [state]: '' },
    }));
    setSelectedState(state);
  };

  const removeState = () => {
    if (!selectedService || !selectedState) return;
    setHints((prev) => {
      const svc = { ...(prev[selectedService] ?? {}) };
      delete svc[selectedState];
      const next = { ...prev };
      if (Object.keys(svc).length === 0) delete next[selectedService];
      else next[selectedService] = svc;
      return next;
    });
    setSelectedState('');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-blue-100 bg-blue-50/80 p-4 text-sm text-blue-900">
        <p className="font-semibold mb-1 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" /> State dropdown info box
        </p>
        <p className="text-[calc(13px+2pt)] text-blue-800/90 leading-relaxed">
          On each service page, when a visitor selects a state, a blue information message can appear under the dropdown (e.g. stamp duty notes for Maharashtra).
          Set a custom message per <strong>service</strong> and <strong>state</strong> here. If you leave no custom text for a combination, the site uses built-in defaults where they exist (GST special states, Professional Tax, etc.).
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Select service</h2>
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

      {selectedService && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4" /> States with a custom message
            </h2>
            {availableStates.length > 0 && (
              <select
                value=""
                onChange={(e) => addState(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium border border-blue-200"
              >
                <option value="">+ Add state…</option>
                {availableStates.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}
          </div>

          {statesWithHints.length === 0 ? (
            <p className="text-sm text-gray-400">
              No custom hints yet. Use “+ Add state…” to add one (e.g. Maharashtra for Private Limited Company).
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {statesWithHints.map((state) => (
                <button
                  key={state}
                  type="button"
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
          )}
        </div>
      )}

      {selectedService && selectedState && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Message for <span className="text-gray-800">{selectedState}</span>
              <span className="text-gray-400 font-normal normal-case ml-2">
                — {services.find((s) => s.id === selectedService)?.name}
              </span>
            </h2>
            <button
              onClick={removeState}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100"
            >
              <Trash2 className="w-4 h-4" /> Remove this state
            </button>
          </div>
          <textarea
            value={currentText}
            onChange={(e) => setHintText(e.target.value)}
            rows={5}
            placeholder="e.g. Maharashtra has higher stamp duty on MOA/AOA. State-specific pricing is reflected below."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          />
          <p className="text-xs text-gray-400">
            Shown in the blue info box under the state field when this state is selected. Leave empty to show nothing for this pair unless a built-in default applies.
          </p>
        </div>
      )}

      <button
        onClick={() => onSave(hints as unknown as Record<string, unknown>)}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
      >
        <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save state hints'}
      </button>
    </div>
  );
}
