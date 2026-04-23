import React, { useState, useEffect, useCallback } from 'react';
import {
  Save, Plus, Trash2, MapPin, DollarSign, Check, Eye,
  Star, ChevronDown, ChevronUp, GripVertical,
} from 'lucide-react';
import { SortableList } from './SortableList';
import { INDIAN_STATES } from '../../data/stateData';
import type { ServicePackage } from '../../types/content';

type Pkg = ServicePackage & { description: string };

type StatePackages = Record<string, Record<string, Pkg[]>>;

type Props = {
  data: Record<string, unknown>;
  services: { id: string; name: string }[];
  onSave: (data: Record<string, unknown>) => void;
  saving: boolean;
};

// ── parse ─────────────────────────────────────────────────────────────────────
function parsePkg(p: unknown): Pkg {
  const x = p as Record<string, unknown>;
  return {
    name:        String(x.name ?? ''),
    price:       String(x.price ?? ''),
    description: String(x.description ?? ''),
    features:    Array.isArray(x.features) ? (x.features as unknown[]).map(String) : [],
    popular:     Boolean(x.popular ?? false),
    recommended: Boolean(x.recommended ?? false),
    customBadge: x.customBadge != null && String(x.customBadge).trim()
      ? String(x.customBadge)
      : null,
  };
}

function parseData(raw: Record<string, unknown>): StatePackages {
  const out: StatePackages = {};
  for (const [svcId, states] of Object.entries(raw)) {
    if (states && typeof states === 'object' && !Array.isArray(states)) {
      out[svcId] = {};
      for (const [state, pkgs] of Object.entries(states as Record<string, unknown>)) {
        if (Array.isArray(pkgs)) out[svcId][state] = pkgs.map(parsePkg);
      }
    }
  }
  return out;
}

function emptyPkg(): Pkg {
  return { name: '', price: '', description: '', features: [], popular: false, recommended: false, customBadge: null };
}

// ── card mini-preview (exact same logic as ServiceLeadHero) ───────────────────
function CardPreview({ pkg, idx }: { pkg: Pkg; idx: number }) {
  const isRecommended = Boolean(pkg.recommended);
  const isGradient    = Boolean(pkg.recommended ?? pkg.popular);
  const badgeLabel =
    (pkg.customBadge?.trim() ?? '') ||
    (isGradient ? (isRecommended ? '★ Recommended' : '★ Most Popular') : '');
  const showBadge = badgeLabel.length > 0;
  const badgeClass = isRecommended
    ? 'bg-violet-500 text-white'
    : 'bg-amber-400 text-amber-900';

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-5 overflow-hidden transition-all shrink-0 w-52 ${
        isGradient
          ? 'bg-gradient-to-b from-blue-600 to-blue-700 border-blue-500/50 shadow-xl shadow-blue-200/30 ring-2 ring-blue-100'
          : 'bg-white border-gray-200 shadow-sm'
      } ${idx === 1 ? 'scale-[1.04]' : ''}`}
    >
      {showBadge && (
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-10">
          <span className={`px-3 py-1 rounded-full text-[11px] font-bold shadow whitespace-nowrap ${badgeClass}`}>
            {badgeLabel}
          </span>
        </div>
      )}
      <div className={`mb-4 ${showBadge ? 'mt-7' : ''}`}>
        <p className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${isGradient ? 'text-blue-200' : 'text-gray-400'}`}>
          {pkg.name || 'Plan name'}
        </p>
        <p className={`text-2xl font-semibold tracking-tight ${isGradient ? 'text-white' : 'text-gray-900'}`}>
          {pkg.price || '—'}
        </p>
        {pkg.description && (
          <p className={`text-[12px] mt-1 leading-snug line-clamp-2 ${isGradient ? 'text-blue-200' : 'text-gray-400'}`}>
            {pkg.description}
          </p>
        )}
      </div>
      {(pkg.features ?? []).length > 0 && (
        <ul className="space-y-1.5 mb-4 flex-1">
          {(pkg.features ?? []).slice(0, 4).map((f, fi) => (
            <li key={fi} className={`flex items-start gap-1.5 text-[11px] ${isGradient ? 'text-blue-100' : 'text-gray-600'}`}>
              <div className={`mt-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${isGradient ? 'bg-white/20' : 'bg-emerald-50'}`}>
                <Check className={`w-2 h-2 ${isGradient ? 'text-white' : 'text-emerald-600'}`} />
              </div>
              {f}
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        className={`mt-auto w-full h-9 flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold ${
          isGradient
            ? 'border border-white/30 text-white/80 hover:bg-white/10'
            : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
        }`}
      >
        Get started <Check className="w-3 h-3" />
      </button>
    </div>
  );
}

// ── per-plan editor ───────────────────────────────────────────────────────────
function PlanEditor({
  pkg,
  onChange,
  onRemove,
}: {
  pkg: Pkg;
  onChange: (patch: Partial<Pkg>) => void;
  onRemove: () => void;
}) {
  const isGradient = Boolean(pkg.recommended ?? pkg.popular);

  const setHighlight = (mode: 'none' | 'popular' | 'recommended') => {
    onChange({
      popular:     mode === 'popular',
      recommended: mode === 'recommended',
    });
  };

  const updateFeature = (i: number, v: string) => {
    const f = [...(pkg.features ?? [])];
    f[i] = v;
    onChange({ features: f });
  };
  const addFeature    = () => onChange({ features: [...(pkg.features ?? []), ''] });
  const removeFeature = (i: number) =>
    onChange({ features: (pkg.features ?? []).filter((_, j) => j !== i) });

  const highlightMode = pkg.recommended ? 'recommended' : pkg.popular ? 'popular' : 'none';

  return (
    <div className={`rounded-xl border p-4 space-y-3 ${isGradient ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100'}`}>
      {/* Row 1: name / badge / remove */}
      <div className="flex items-start justify-between gap-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Plan Name</label>
            <input
              value={pkg.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="e.g. Standard"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Custom Badge (optional)</label>
            <input
              value={pkg.customBadge ?? ''}
              onChange={(e) => onChange({ customBadge: e.target.value.trim() || null })}
              placeholder="e.g. Best Value"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Price</label>
            <input
              value={pkg.price}
              onChange={(e) => onChange({ price: e.target.value })}
              placeholder="e.g. ₹5,999 or On request"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Tagline / Description</label>
            <input
              value={pkg.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Short summary shown under price"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 flex-shrink-0 mt-5"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Highlight selector */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Card Style / Highlight</label>
        <div className="flex flex-wrap gap-2">
          {(['none', 'popular', 'recommended'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setHighlight(mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                highlightMode === mode
                  ? mode === 'none'
                    ? 'bg-gray-200 border-gray-300 text-gray-800'
                    : mode === 'popular'
                    ? 'bg-amber-400 border-amber-400 text-amber-900'
                    : 'bg-violet-500 border-violet-500 text-white'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {mode === 'none'      && 'Plain'}
              {mode === 'popular'   && <><Star className="w-3 h-3" /> Most Popular</>}
              {mode === 'recommended' && <><Star className="w-3 h-3" /> Recommended</>}
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-gray-500">What's Included (features)</label>
          <button
            type="button"
            onClick={addFeature}
            className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:text-blue-800"
          >
            <Plus className="w-3 h-3" /> Add item
          </button>
        </div>
        {(pkg.features ?? []).length === 0 ? (
          <p className="text-xs text-gray-300 italic">No features yet.</p>
        ) : (
          <div className="space-y-1.5">
            {(pkg.features ?? []).map((f, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                <input
                  value={f}
                  onChange={(e) => updateFeature(i, e.target.value)}
                  placeholder={`Feature ${i + 1}`}
                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(i)}
                  className="p-1 rounded text-red-400 hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
export default function AdminStatePricingSection({ data, services, onSave, saving }: Props) {
  const [packages, setPackages]           = useState<StatePackages>({});
  const [selectedService, setSelectedService] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [showPreview, setShowPreview]     = useState(true);
  const [expandedPlan, setExpandedPlan]   = useState<number | null>(null);

  useEffect(() => {
    setPackages(data && typeof data === 'object' ? parseData(data) : {});
  }, [data]);

  useEffect(() => {
    if (!selectedService && services?.length) setSelectedService(services[0].id);
  }, [services, selectedService]);

  useEffect(() => {
    setExpandedPlan(null);
  }, [selectedService, selectedState]);

  const statesWithData  = selectedService ? Object.keys(packages[selectedService] ?? {}).sort() : [];
  const availableStates = INDIAN_STATES.filter((s) => !statesWithData.includes(s));
  const currentPkgs: Pkg[] = packages[selectedService]?.[selectedState] ?? [];

  const setCurrentPkgs = useCallback((pkgs: Pkg[]) => {
    setPackages((prev) => ({
      ...prev,
      [selectedService]: { ...(prev[selectedService] ?? {}), [selectedState]: pkgs },
    }));
  }, [selectedService, selectedState]);

  const updatePkg = useCallback((i: number, patch: Partial<Pkg>) => {
    setCurrentPkgs(
      currentPkgs.map((p, idx) => idx === i ? { ...p, ...patch } : p)
    );
  }, [currentPkgs, setCurrentPkgs]);

  const addPkg = () => {
    const next = [...currentPkgs, emptyPkg()];
    setCurrentPkgs(next);
    setExpandedPlan(next.length - 1);
  };

  const removePkg = (i: number) => {
    setCurrentPkgs(currentPkgs.filter((_, j) => j !== i));
    setExpandedPlan(null);
  };

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
      const { [selectedState]: _removed, ...rest } = prev[selectedService] ?? {};
      return { ...prev, [selectedService]: rest };
    });
    setSelectedState('');
  };

  const svcName = services.find((s) => s.id === selectedService)?.name ?? selectedService;

  return (
    <div className="space-y-6">

      {/* ── Service selector ──────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-blue-500" /> Service
        </h2>
        <select
          value={selectedService}
          onChange={(e) => { setSelectedService(e.target.value); setSelectedState(''); }}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 text-sm"
        >
          <option value="">Choose a service…</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* ── State selector ────────────────────────────────────────────── */}
      {selectedService && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" /> States with pricing
              <span className="font-normal normal-case text-gray-400 ml-1">— {svcName}</span>
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
              {statesWithData.map((state) => {
                const pkgCount = (packages[selectedService]?.[state] ?? []).length;
                return (
                  <button
                    key={state}
                    onClick={() => setSelectedState(state)}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                      selectedState === state
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {state}
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      selectedState === state ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>{pkgCount}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No state-wise pricing yet. Use the dropdown to add a state.</p>
          )}
        </div>
      )}

      {/* ── Package editor + live preview ─────────────────────────────── */}
      {selectedState && selectedService && (
        <>
          {/* Header bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-sm font-bold text-gray-900">
                  Pricing for <span className="text-blue-600">{selectedState}</span>
                  <span className="text-gray-400 font-normal ml-2">({svcName})</span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Cards below reflect exactly how they appear on the service page when this state is selected.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowPreview((v) => !v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    showPreview
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
                <button
                  onClick={addPkg}
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" /> Add Plan
                </button>
                <button
                  onClick={deleteState}
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium border border-red-100 hover:bg-red-100"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove state
                </button>
              </div>
            </div>
          </div>

          {/* Live card preview */}
          {showPreview && currentPkgs.length > 0 && (
            <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 rounded-xl border border-gray-200 p-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
                <Eye className="w-3.5 h-3.5" /> Live Preview — as shown on service page
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {currentPkgs.slice(0, 3).map((pkg, i) => (
                  <CardPreview key={i} pkg={pkg} idx={i} />
                ))}
              </div>
              {currentPkgs.length > 3 && (
                <p className="text-center text-xs text-gray-400 mt-4">
                  +{currentPkgs.length - 3} more plan{currentPkgs.length - 3 > 1 ? 's' : ''} (shown below the primary cards on service page)
                </p>
              )}
            </div>
          )}

          {/* Plan list */}
          {currentPkgs.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-10 text-center">
              <DollarSign className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No plans yet. Click <strong>Add Plan</strong> to create one.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <SortableList
                items={currentPkgs}
                onReorder={setCurrentPkgs}
                getItemId={(_, i) => `spkg-${selectedService}-${selectedState}-${i}`}
                renderItem={(pkg, i) => (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {/* Collapsible plan header */}
                    <button
                      type="button"
                      onClick={() => setExpandedPlan(expandedPlan === i ? null : i)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="font-semibold text-gray-900 text-sm truncate">
                            {pkg.name || <span className="text-gray-400 italic">Untitled plan</span>}
                          </span>
                          <span className="ml-2 text-sm text-blue-600 font-medium">{pkg.price || '—'}</span>
                        </div>
                        {pkg.recommended && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-700">★ Recommended</span>
                        )}
                        {pkg.popular && !pkg.recommended && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">★ Most Popular</span>
                        )}
                        {pkg.customBadge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">{pkg.customBadge}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                        <span className="text-xs text-gray-400">{(pkg.features ?? []).length} feature{(pkg.features ?? []).length !== 1 ? 's' : ''}</span>
                        {expandedPlan === i
                          ? <ChevronUp className="w-4 h-4 text-gray-400" />
                          : <ChevronDown className="w-4 h-4 text-gray-400" />
                        }
                      </div>
                    </button>

                    {/* Expanded plan editor */}
                    {expandedPlan === i && (
                      <div className="border-t border-gray-100 p-5">
                        <PlanEditor
                          pkg={pkg}
                          onChange={(patch) => updatePkg(i, patch)}
                          onRemove={() => removePkg(i)}
                        />
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
          )}
        </>
      )}

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onSave(packages as unknown as Record<string, unknown>)}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60 shadow-sm"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save State Pricing'}
        </button>
        {selectedState && selectedService && (
          <p className="text-xs text-gray-400">
            Editing <strong>{selectedState}</strong> — {svcName}
          </p>
        )}
      </div>
    </div>
  );
}
