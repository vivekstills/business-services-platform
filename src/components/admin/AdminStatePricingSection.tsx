import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, MapPin, DollarSign } from 'lucide-react';
import { SortableList } from './SortableList';
import { INDIAN_STATES } from '../../data/stateData';

type Pkg = { name: string; price: string; description: string };
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
          }));
        }
      }
    }
  }
  return out;
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

  const addPkg = () => setCurrentPkgs([...currentPkgs, { name: '', price: '', description: '' }]);
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

          {currentPkgs.length === 0 ? (
            <p className="text-sm text-gray-400">No packages yet. Click "Add Package" to create one.</p>
          ) : (
            <SortableList
              items={currentPkgs}
              onReorder={(items) => setCurrentPkgs(items)}
              getItemId={(_, i) => `spkg-${selectedService}-${selectedState}-${i}`}
              renderItem={(pkg, i) => (
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-3">
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
                    <button onClick={() => removePkg(i)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 ml-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                    <textarea
                      value={pkg.description}
                      onChange={(e) => updatePkg(i, { description: e.target.value })}
                      rows={2}
                      placeholder="Package details…"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                    />
                  </div>
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
