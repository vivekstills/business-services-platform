import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, MapPin, DollarSign, Check } from 'lucide-react';
import { SortableList } from './SortableList';
import { INDIAN_STATES } from '../../data/stateData';

type Pkg = { name: string; price: string; description: string; features: string[]; recommended: boolean };
type StatePackages = Record<string, Record<string, Pkg[]>>;

type Props = {
  data: Record<string, unknown>;
  services: { id: string; name: string }[];
  onSave: (data: Record<string, unknown>) => void;
  saving: boolean;
};

function parseData(raw: Record<string, unknown>): StatePackages {
  const out: StatePackages = {};
  for (const [svcId, states] of Object.entries(raw)) {
    if (states && typeof states === 'object' && !Array.isArray(states)) {
      out[svcId] = {};
      for (const [state, pkgs] of Object.entries(states as Record<string, unknown>)) {
        if (Array.isArray(pkgs)) {
          out[svcId][state] = pkgs.map((p) => ({
            name: String((p as Pkg).name ?? ''),
            price: String((p as Pkg).price ?? ''),
            description: String((p as Pkg).description ?? ''),
            features: Array.isArray((p as Pkg).features) ? (p as Pkg).features.map(String) : [],
            popular: Boolean((p as Pkg).popular ?? false),
          }));
        }
      }
    }
  }
  return out;
}

/* ── small inline features editor ── */
function FeaturesEditor({ features, onChange }: { features: string[]; onChange: (f: string[]) => void }) {
  const update = (i: number, val: string) => { const n = [...features]; n[i] = val; onChange(n); };
  const remove = (i: number) => onChange(features.filter((_, j) => j !== i));
  const add = () => onChange([...features, '']);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[calc(11px+1.5pt)] font-bold uppercase tracking-wider text-gray-400">What's Included</label>
        <button onClick={add} type="button" className="flex items-center gap-1 text-[calc(11px+1.5pt)] text-blue-500 hover:text-blue-700 font-semibold">
          <Plus className="w-3 h-3" /> Add item
        </button>
      </div>
      {features.length === 0 && (
        <p className="text-[calc(11px+1.5pt)] text-gray-300 italic">No items yet.</p>
      )}
      {features.map((f, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
          <input
            value={f}
            onChange={(e) => update(i, e.target.value)}
            placeholder={`Feature ${i + 1}`}
            className="flex-1 px-2.5 py-1 rounded border border-gray-200 text-[calc(12.5px+1.5pt)] focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          />
          <button onClick={() => remove(i)} type="button" className="p-1 rounded text-red-400 hover:bg-red-50">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function AdminStatePricingSection({ data, services, onSave, saving }: Props) {
  const [packages, setPackages] = useState<StatePackages>({});
  const [selectedService, setSelectedService] = useState('');
  const [selectedState, setSelectedState] = useState('');

  useEffect(() => {
    setPackages(data && typeof data === 'object' ? parseData(data) : {});
  }, [data]);

  useEffect(() => {
    if (!selectedService && services?.length) setSelectedService(services[0].id);
  }, [services, selectedService]);

  const statesWithData = selectedService ? Object.keys(packages[selectedService] ?? {}) : [];
  const availableStates = INDIAN_STATES.filter((s) => !statesWithData.includes(s));
  const currentPkgs: Pkg[] = packages[selectedService]?.[selectedState] ?? [];

  const setCurrentPkgs = (pkgs: Pkg[]) => {
    setPackages((prev) => ({
      ...prev,
      [selectedService]: { ...(prev[selectedService] ?? {}), [selectedState]: pkgs },
    }));
  };

  const updatePkg = (i: number, updates: Partial<Pkg>) => {
    const next = [...currentPkgs];
    next[i] = { ...next[i], ...updates };
    setCurrentPkgs(next);
  };

  const addPkg = () => setCurrentPkgs([...currentPkgs, { name: '', price: '', description: '', features: [], recommended: false }]);

  const toggleRecommended = (i: number) => {
    setCurrentPkgs(currentPkgs.map((p, idx) => ({ ...p, recommended: idx === i ? !p.recommended : false })));
  };
  const removePkg = (i: number) => setCurrentPkgs(currentPkgs.filter((_, j) => j !== i));

  const addState = (state: string) => {
    if (!state || !selectedService) return;
    setPackages((prev) => ({
      ...prev,
      [selectedService]: { ...(prev[selectedService] ?? {}), [state]: [] },
    }));
    setSelectedState(state);
  };

  const deleteState = () => {
    if (!selectedState || !selectedService) return;
    setPackages((prev) => {
      const { [selectedState]: _, ...rest } = prev[selectedService] ?? {};
      return { ...prev, [selectedService]: rest };
    });
    setSelectedState('');
  };

  return (
    <div className="space-y-6">
      {/* Service selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> Select Service
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

      {/* State selector */}
      {selectedService && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4" /> States with pricing
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
            <p className="text-sm text-gray-400">No state-wise pricing yet. Use the dropdown above to add one.</p>
          )}
        </div>
      )}

      {/* Package editor */}
      {selectedState && selectedService && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Packages — {selectedState}
              <span className="text-gray-400 font-normal normal-case ml-2">
                ({services.find((s) => s.id === selectedService)?.name})
              </span>
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={addPkg}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200"
              >
                <Plus className="w-4 h-4" /> Add Package
              </button>
              <button
                onClick={deleteState}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100"
              >
                <Trash2 className="w-4 h-4" /> Remove state
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 -mt-2 mb-2">
            Mark one plan as <strong>Recommended</strong> for this state — it appears highlighted on the service page when that state is selected. Only one recommended plan per state.
          </p>

          {currentPkgs.length === 0 ? (
            <p className="text-sm text-gray-400">No packages yet. Click "Add Package" to create one.</p>
          ) : (
            <SortableList
              items={currentPkgs}
              onReorder={(items) => setCurrentPkgs(items)}
              getItemId={(_, i) => `spkg-${selectedService}-${selectedState}-${i}`}
              renderItem={(pkg, i) => (
                <div className={`p-4 rounded-xl border space-y-3 ${pkg.recommended ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-2 gap-3 flex-1">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Package Name</label>
                        <input
                          value={pkg.name}
                          onChange={(e) => updatePkg(i, { name: e.target.value })}
                          placeholder="e.g. Standard"
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Price</label>
                        <input
                          value={pkg.price}
                          onChange={(e) => updatePkg(i, { price: e.target.value })}
                          placeholder="e.g. ₹5,999"
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleRecommended(i)}
                        title={pkg.recommended ? 'Remove Recommended' : 'Mark as Recommended for this state'}
                        className={`text-[calc(10px+1.5pt)] font-bold px-2 py-1 rounded-full border transition-all ${
                          pkg.recommended
                            ? 'bg-violet-500 border-violet-500 text-white'
                            : 'border-gray-200 text-gray-400 hover:border-violet-300 hover:text-violet-600'
                        }`}
                      >
                        ★ Recommended
                      </button>
                      <button onClick={() => removePkg(i)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                    <textarea
                      value={pkg.description}
                      onChange={(e) => updatePkg(i, { description: e.target.value })}
                      rows={2}
                      placeholder="Short package summary…"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                    />
                  </div>
                  <FeaturesEditor
                    features={pkg.features}
                    onChange={(features) => updatePkg(i, { features })}
                  />
                </div>
              )}
            />
          )}
        </div>
      )}

      <button
        onClick={() => onSave(packages as unknown as Record<string, unknown>)}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
      >
        <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save State Pricing'}
      </button>
    </div>
  );
}
