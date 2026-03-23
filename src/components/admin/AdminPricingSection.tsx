import React, { useState, useEffect, useCallback } from 'react';
import { Save, Trash2, Plus, Layers } from 'lucide-react';
import { SortableList } from './SortableList';
import type { PricingPlan, PricingTabGroup, ServicePricingPageConfig } from '../../types/content';
import {
  buildPricingPayload,
  emptyPricingPlan,
  emptyTabGroup,
  newTabId,
} from '../../utils/pricingTabs';

type Plan = PricingPlan;
type ServiceRef = { id: string; name: string };

type Props = {
  data: Record<string, unknown>;
  services: ServiceRef[];
  onSave: (data: Record<string, unknown>) => void;
  saving: boolean;
};

function normalizePlan(p: unknown): Plan {
  const x = p as Record<string, unknown>;
  return {
    name: String(x.name ?? ''),
    badge: x.badge != null && String(x.badge) ? String(x.badge) : null,
    price: String(x.price ?? ''),
    tagline: String(x.tagline ?? ''),
    features: Array.isArray(x.features) ? x.features.map(String) : [],
    cta: String(x.cta ?? ''),
    ctaTo: String(x.ctaTo ?? ''),
    highlight: Boolean(x.highlight),
  };
}

function normalizeTab(t: unknown, index: number): PricingTabGroup {
  const x = t as Record<string, unknown>;
  const plans = Array.isArray(x.plans) ? x.plans.map(normalizePlan) : [];
  return {
    id: String(x.id || `tab-${index}-${newTabId()}`),
    label: String(x.label || `Tab ${index + 1}`),
    description: x.description != null ? String(x.description) : '',
    footnote: x.footnote != null ? String(x.footnote) : '',
    plans: plans.length ? plans : [emptyPricingPlan()],
  };
}

function loadTabsFromData(data: Record<string, unknown>): PricingTabGroup[] {
  const rawTabs = data.tabs;
  if (Array.isArray(rawTabs) && rawTabs.length > 0) {
    return rawTabs.map((t, i) => normalizeTab(t, i));
  }
  const plans = Array.isArray(data.plans) ? data.plans.map(normalizePlan) : [];
  return [
    {
      id: 'default',
      label: 'General',
      description: '',
      footnote: '',
      plans: plans.length ? plans : [emptyPricingPlan()],
    },
  ];
}

function loadServicePages(data: Record<string, unknown>): ServicePricingPageConfig[] {
  const raw = data.servicePricingPages;
  if (!Array.isArray(raw)) return [];
  return raw.map((row, ri) => {
    const r = row as Record<string, unknown>;
    const tabs = Array.isArray(r.tabs) ? r.tabs.map((t, i) => normalizeTab(t, i)) : [];
    return {
      serviceId: String(r.serviceId ?? ''),
      sectionLabel: r.sectionLabel != null ? String(r.sectionLabel) : '',
      sectionTitle: r.sectionTitle != null ? String(r.sectionTitle) : '',
      sectionSubtitle: r.sectionSubtitle != null ? String(r.sectionSubtitle) : '',
      footnote: r.footnote != null ? String(r.footnote) : '',
      tabs: tabs.length ? tabs : [emptyTabGroup('Plans')],
    };
  }).filter((x) => x.serviceId);
}

function PlanFields({
  plan,
  planIndex,
  tabIndex,
  updatePlan,
  updateFeature,
  addFeature,
  removeFeature,
  reorderFeatures,
}: {
  plan: Plan;
  planIndex: number;
  tabIndex: number;
  updatePlan: (ti: number, pi: number, updates: Partial<Plan>) => void;
  updateFeature: (ti: number, pi: number, fi: number, value: string) => void;
  addFeature: (ti: number, pi: number) => void;
  removeFeature: (ti: number, pi: number, fi: number) => void;
  reorderFeatures: (ti: number, pi: number, features: string[]) => void;
}) {
  const i = planIndex;
  const t = tabIndex;
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
          <input
            value={plan.name}
            onChange={(e) => updatePlan(t, i, { name: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Badge (optional)</label>
          <input
            value={plan.badge ?? ''}
            onChange={(e) => updatePlan(t, i, { badge: e.target.value || null })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Price</label>
          <input
            value={plan.price}
            onChange={(e) => updatePlan(t, i, { price: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Tagline</label>
          <input
            value={plan.tagline}
            onChange={(e) => updatePlan(t, i, { tagline: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">CTA text</label>
          <input
            value={plan.cta}
            onChange={(e) => updatePlan(t, i, { cta: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">CTA link</label>
          <input
            value={plan.ctaTo}
            onChange={(e) => updatePlan(t, i, { ctaTo: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={plan.highlight}
          onChange={(e) => updatePlan(t, i, { highlight: e.target.checked })}
          className="rounded border-gray-300"
        />
        Highlight (featured card)
      </label>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500">Features</span>
          <button type="button" onClick={() => addFeature(t, i)} className="text-xs text-blue-600 font-medium">
            + Add
          </button>
        </div>
        <SortableList
          items={plan.features}
          onReorder={(features) => reorderFeatures(t, i, features)}
          getItemId={(f, j) => `f-${t}-${i}-${j}-${f.slice(0, 12)}`}
          renderItem={(f, j) => (
            <div className="flex gap-2">
              <input
                value={f}
                onChange={(e) => updateFeature(t, i, j, e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
              />
              <button type="button" onClick={() => removeFeature(t, i, j)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default function AdminPricingSection({ data, services, onSave, saving }: Props) {
  const [sectionLabel, setSectionLabel] = useState('');
  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionSubtitle, setSectionSubtitle] = useState('');
  const [footnote, setFootnote] = useState('');
  const [tabs, setTabs] = useState<PricingTabGroup[]>([]);
  const [servicePages, setServicePages] = useState<ServicePricingPageConfig[]>([]);
  const [addServiceId, setAddServiceId] = useState('');

  useEffect(() => {
    setSectionLabel(String(data.sectionLabel ?? ''));
    setSectionTitle(String(data.sectionTitle ?? ''));
    setSectionSubtitle(String(data.sectionSubtitle ?? ''));
    setFootnote(String(data.footnote ?? ''));
    setTabs(loadTabsFromData(data));
    setServicePages(loadServicePages(data));
  }, [data]);

  const updatePlan = useCallback((tabIndex: number, planIndex: number, updates: Partial<Plan>) => {
    setTabs((prev) => {
      const next = [...prev];
      const plans = [...next[tabIndex].plans];
      plans[planIndex] = { ...plans[planIndex], ...updates };
      next[tabIndex] = { ...next[tabIndex], plans };
      return next;
    });
  }, []);

  const updateFeature = useCallback((tabIndex: number, planIndex: number, featureIndex: number, value: string) => {
    setTabs((prev) => {
      const next = [...prev];
      const plans = [...next[tabIndex].plans];
      const features = [...plans[planIndex].features];
      features[featureIndex] = value;
      plans[planIndex] = { ...plans[planIndex], features };
      next[tabIndex] = { ...next[tabIndex], plans };
      return next;
    });
  }, []);

  const addFeature = useCallback((tabIndex: number, planIndex: number) => {
    setTabs((prev) => {
      const next = [...prev];
      const plans = [...next[tabIndex].plans];
      plans[planIndex] = { ...plans[planIndex], features: [...plans[planIndex].features, ''] };
      next[tabIndex] = { ...next[tabIndex], plans };
      return next;
    });
  }, []);

  const removeFeature = useCallback((tabIndex: number, planIndex: number, featureIndex: number) => {
    setTabs((prev) => {
      const next = [...prev];
      const plans = [...next[tabIndex].plans];
      plans[planIndex] = {
        ...plans[planIndex],
        features: plans[planIndex].features.filter((_, j) => j !== featureIndex),
      };
      next[tabIndex] = { ...next[tabIndex], plans };
      return next;
    });
  }, []);

  const reorderFeatures = useCallback((tabIndex: number, planIndex: number, features: string[]) => {
    setTabs((prev) => {
      const next = [...prev];
      const plans = [...next[tabIndex].plans];
      plans[planIndex] = { ...plans[planIndex], features };
      next[tabIndex] = { ...next[tabIndex], plans };
      return next;
    });
  }, []);

  const addPlanToTab = (tabIndex: number) => {
    setTabs((prev) => {
      const next = [...prev];
      next[tabIndex] = {
        ...next[tabIndex],
        plans: [...next[tabIndex].plans, emptyPricingPlan()],
      };
      return next;
    });
  };

  const removePlanFromTab = (tabIndex: number, planIndex: number) => {
    setTabs((prev) => {
      const next = [...prev];
      const plans = next[tabIndex].plans.filter((_, j) => j !== planIndex);
      next[tabIndex] = { ...next[tabIndex], plans: plans.length ? plans : [emptyPricingPlan()] };
      return next;
    });
  };

  const reorderPlansInTab = (tabIndex: number, plans: Plan[]) => {
    setTabs((prev) => {
      const next = [...prev];
      next[tabIndex] = { ...next[tabIndex], plans };
      return next;
    });
  };

  const addHomepageTab = () => setTabs((prev) => [...prev, emptyTabGroup(`Tab ${prev.length + 1}`)]);
  const removeHomepageTab = (idx: number) => {
    if (tabs.length <= 1) return;
    setTabs((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateServicePage = (si: number, patch: Partial<ServicePricingPageConfig>) => {
    setServicePages((prev) => {
      const next = [...prev];
      next[si] = { ...next[si], ...patch };
      return next;
    });
  };

  const updateServiceTab = (si: number, tabIndex: number, patch: Partial<PricingTabGroup>) => {
    setServicePages((prev) => {
      const next = [...prev];
      const tbs = [...next[si].tabs];
      tbs[tabIndex] = { ...tbs[tabIndex], ...patch };
      next[si] = { ...next[si], tabs: tbs };
      return next;
    });
  };

  const servicePlanUpdate = (si: number, tabIndex: number, planIndex: number, updates: Partial<Plan>) => {
    setServicePages((prev) => {
      const next = [...prev];
      const tbs = [...next[si].tabs];
      const plans = [...tbs[tabIndex].plans];
      plans[planIndex] = { ...plans[planIndex], ...updates };
      tbs[tabIndex] = { ...tbs[tabIndex], plans };
      next[si] = { ...next[si], tabs: tbs };
      return next;
    });
  };

  const serviceFeatureUpdate = (si: number, ti: number, pi: number, fi: number, value: string) => {
    setServicePages((prev) => {
      const next = [...prev];
      const tbs = [...next[si].tabs];
      const plans = [...tbs[ti].plans];
      const features = [...plans[pi].features];
      features[fi] = value;
      plans[pi] = { ...plans[pi], features };
      tbs[ti] = { ...tbs[ti], plans };
      next[si] = { ...next[si], tabs: tbs };
      return next;
    });
  };

  const serviceAddFeature = (si: number, ti: number, pi: number) => {
    setServicePages((prev) => {
      const next = [...prev];
      const tbs = [...next[si].tabs];
      const plans = [...tbs[ti].plans];
      plans[pi] = { ...plans[pi], features: [...plans[pi].features, ''] };
      tbs[ti] = { ...tbs[ti], plans };
      next[si] = { ...next[si], tabs: tbs };
      return next;
    });
  };

  const serviceRemoveFeature = (si: number, ti: number, pi: number, fi: number) => {
    setServicePages((prev) => {
      const next = [...prev];
      const tbs = [...next[si].tabs];
      const plans = [...tbs[ti].plans];
      plans[pi] = { ...plans[pi], features: plans[pi].features.filter((_, j) => j !== fi) };
      tbs[ti] = { ...tbs[ti], plans };
      next[si] = { ...next[si], tabs: tbs };
      return next;
    });
  };

  const serviceReorderFeatures = (si: number, ti: number, pi: number, features: string[]) => {
    setServicePages((prev) => {
      const next = [...prev];
      const tbs = [...next[si].tabs];
      const plans = [...tbs[ti].plans];
      plans[pi] = { ...plans[pi], features };
      tbs[ti] = { ...tbs[ti], plans };
      next[si] = { ...next[si], tabs: tbs };
      return next;
    });
  };

  const serviceAddPlan = (si: number, ti: number) => {
    setServicePages((prev) => {
      const next = [...prev];
      const tbs = [...next[si].tabs];
      tbs[ti] = { ...tbs[ti], plans: [...tbs[ti].plans, emptyPricingPlan()] };
      next[si] = { ...next[si], tabs: tbs };
      return next;
    });
  };

  const serviceRemovePlan = (si: number, ti: number, pi: number) => {
    setServicePages((prev) => {
      const next = [...prev];
      const tbs = [...next[si].tabs];
      const plans = tbs[ti].plans.filter((_, j) => j !== pi);
      tbs[ti] = { ...tbs[ti], plans: plans.length ? plans : [emptyPricingPlan()] };
      next[si] = { ...next[si], tabs: tbs };
      return next;
    });
  };

  const serviceReorderPlans = (si: number, ti: number, plans: Plan[]) => {
    setServicePages((prev) => {
      const next = [...prev];
      const tbs = [...next[si].tabs];
      tbs[ti] = { ...tbs[ti], plans };
      next[si] = { ...next[si], tabs: tbs };
      return next;
    });
  };

  const serviceAddTab = (si: number) => {
    setServicePages((prev) => {
      const next = [...prev];
      const tbs = [...next[si].tabs, emptyTabGroup(`Option ${next[si].tabs.length + 1}`)];
      next[si] = { ...next[si], tabs: tbs };
      return next;
    });
  };

  const serviceRemoveTab = (si: number, ti: number) => {
    setServicePages((prev) => {
      const next = [...prev];
      if (next[si].tabs.length <= 1) return prev;
      next[si] = { ...next[si], tabs: next[si].tabs.filter((_, i) => i !== ti) };
      return next;
    });
  };

  const addServicePage = () => {
    if (!addServiceId) return;
    if (servicePages.some((s) => s.serviceId === addServiceId)) return;
    const svc = services.find((s) => s.id === addServiceId);
    setServicePages((prev) => [
      ...prev,
      {
        serviceId: addServiceId,
        sectionLabel: 'Pricing',
        sectionTitle: svc ? `Plans for ${svc.name}` : 'Choose your plan',
        sectionSubtitle: 'All plans include expert support and document handling.',
        footnote: 'All prices are exclusive of GST. Government fees charged at actuals.',
        tabs: [emptyTabGroup('Standard')],
      },
    ]);
    setAddServiceId('');
  };

  const removeServicePage = (si: number) => {
    setServicePages((prev) => prev.filter((_, i) => i !== si));
  };

  const usedServiceIds = new Set(servicePages.map((s) => s.serviceId));
  const availableServices = services.filter((s) => !usedServiceIds.has(s.id));

  const handleSave = () => {
    const payload = buildPricingPayload({
      sectionLabel,
      sectionTitle,
      sectionSubtitle,
      footnote,
      tabs,
      servicePricingPages: servicePages,
    });
    onSave(payload);
  };

  return (
    <div className="space-y-10">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4" /> Homepage pricing section
        </h2>
        <p className="text-xs text-gray-400">
          Add multiple <strong>tabs</strong> (e.g. “Company”, “LLP”) — each tab has its own plan cards. Single tab hides the tab bar on the site.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Section label (small caps)</label>
            <input value={sectionLabel} onChange={(e) => setSectionLabel(e.target.value)} placeholder="Pricing" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Section title</label>
            <input value={sectionTitle} onChange={(e) => setSectionTitle(e.target.value)} placeholder="Transparent pricing…" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Section subtitle</label>
            <input value={sectionSubtitle} onChange={(e) => setSectionSubtitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-gray-400">Drag tabs to reorder. Each tab: label, intro, plans, optional footnote.</p>
          <button type="button" onClick={addHomepageTab} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Add plan tab
          </button>
        </div>

        <SortableList
          items={tabs}
          onReorder={setTabs}
          getItemId={(tab, i) => `${tab.id}-${i}`}
          renderItem={(tab, tabIndex) => (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-gray-700">Tab: {tab.label || `Tab ${tabIndex + 1}`}</h3>
                <button
                  type="button"
                  onClick={() => removeHomepageTab(tabIndex)}
                  disabled={tabs.length <= 1}
                  className="text-xs text-red-600 hover:text-red-700 disabled:opacity-40"
                >
                  Remove tab
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Tab label</label>
                  <input
                    value={tab.label}
                    onChange={(e) => {
                      const v = e.target.value;
                      setTabs((prev) => {
                        const next = [...prev];
                        next[tabIndex] = { ...next[tabIndex], label: v };
                        return next;
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Tab footnote (optional)</label>
                  <input
                    value={tab.footnote ?? ''}
                    onChange={(e) => {
                      const v = e.target.value;
                      setTabs((prev) => {
                        const next = [...prev];
                        next[tabIndex] = { ...next[tabIndex], footnote: v };
                        return next;
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Intro under tab (optional)</label>
                  <textarea
                    value={tab.description ?? ''}
                    onChange={(e) => {
                      const v = e.target.value;
                      setTabs((prev) => {
                        const next = [...prev];
                        next[tabIndex] = { ...next[tabIndex], description: v };
                        return next;
                      });
                    }}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase">Plans in this tab</span>
                <button type="button" onClick={() => addPlanToTab(tabIndex)} className="text-xs text-blue-600 font-medium">
                  + Add plan
                </button>
              </div>
              <SortableList
                items={tab.plans}
                onReorder={(plans) => reorderPlansInTab(tabIndex, plans)}
                getItemId={(pl, pi) => `hp-${tab.id}-${pi}-${pl.name}`}
                renderItem={(plan, planIndex) => (
                  <div className="space-y-2">
                    <div className="flex justify-end">
                      <button type="button" onClick={() => removePlanFromTab(tabIndex, planIndex)} className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded">
                        Remove plan
                      </button>
                    </div>
                    <PlanFields
                      plan={plan}
                      planIndex={planIndex}
                      tabIndex={tabIndex}
                      updatePlan={updatePlan}
                      updateFeature={updateFeature}
                      addFeature={addFeature}
                      removeFeature={removeFeature}
                      reorderFeatures={reorderFeatures}
                    />
                  </div>
                )}
              />
            </div>
          )}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <label className="block text-xs font-medium text-gray-500 mb-2">Global footnote (below all tabs)</label>
        <input value={footnote} onChange={(e) => setFootnote(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
      </div>

      <div className="border-t border-gray-200 pt-10 space-y-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Service-specific pricing tabs</h2>
        <p className="text-xs text-gray-400 max-w-3xl">
          Override the default service packages on each service page with your own <strong>tabbed</strong> plans (same fields as homepage). When a state has{' '}
          <strong>State Pricing</strong> configured, state packages still take priority. Otherwise these tabs show for visitors who have not picked a state yet, or when no state tiers exist.
        </p>

        <div className="flex flex-wrap gap-2 items-end">
          <div className="min-w-[200px] flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">Add service</label>
            <select
              value={addServiceId}
              onChange={(e) => setAddServiceId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
            >
              <option value="">Select a service…</option>
              {availableServices.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={addServicePage}
            disabled={!addServiceId}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-900 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {servicePages.map((sp, si) => {
          const svcName = services.find((s) => s.id === sp.serviceId)?.name ?? sp.serviceId;
          return (
            <div key={sp.serviceId} className="bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold text-gray-900">{svcName}</h3>
                <button type="button" onClick={() => removeServicePage(si)} className="text-sm text-red-600 hover:underline">
                  Remove service block
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Section label</label>
                  <input
                    value={sp.sectionLabel ?? ''}
                    onChange={(e) => updateServicePage(si, { sectionLabel: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Section title</label>
                  <input
                    value={sp.sectionTitle ?? ''}
                    onChange={(e) => updateServicePage(si, { sectionTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Section subtitle</label>
                  <input
                    value={sp.sectionSubtitle ?? ''}
                    onChange={(e) => updateServicePage(si, { sectionSubtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Bottom footnote</label>
                  <input
                    value={sp.footnote ?? ''}
                    onChange={(e) => updateServicePage(si, { footnote: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={() => serviceAddTab(si)} className="text-xs text-blue-600 font-medium">
                  + Add tab for this service
                </button>
              </div>

              <SortableList
                items={sp.tabs}
                onReorder={(newTabs) => updateServicePage(si, { tabs: newTabs })}
                getItemId={(t, ti) => `${sp.serviceId}-${t.id}-${ti}`}
                renderItem={(st, ti) => (
                  <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                    <div className="flex justify-between items-center gap-2">
                      <input
                        value={st.label}
                        onChange={(e) => updateServiceTab(si, ti, { label: e.target.value })}
                        className="font-medium text-sm border border-gray-200 rounded px-2 py-1 flex-1"
                        placeholder="Tab label"
                      />
                      <button
                        type="button"
                        disabled={sp.tabs.length <= 1}
                        onClick={() => serviceRemoveTab(si, ti)}
                        className="text-xs text-red-500 disabled:opacity-40"
                      >
                        Remove tab
                      </button>
                    </div>
                    <textarea
                      value={st.description ?? ''}
                      onChange={(e) => updateServiceTab(si, ti, { description: e.target.value })}
                      placeholder="Intro (optional)"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                    />
                    <input
                      value={st.footnote ?? ''}
                      onChange={(e) => updateServiceTab(si, ti, { footnote: e.target.value })}
                      placeholder="Tab footnote (optional)"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Plans</span>
                      <button type="button" onClick={() => serviceAddPlan(si, ti)} className="text-xs text-blue-600">
                        + Plan
                      </button>
                    </div>
                    <SortableList
                      items={st.plans}
                      onReorder={(plans) => serviceReorderPlans(si, ti, plans)}
                      getItemId={(pl, pi) => `${sp.serviceId}-${st.id}-p-${pi}`}
                      renderItem={(plan, planIndex) => (
                        <div className="space-y-2">
                          <div className="flex justify-end">
                            <button type="button" onClick={() => serviceRemovePlan(si, ti, planIndex)} className="text-xs text-red-500">
                              Remove plan
                            </button>
                          </div>
                          <PlanFields
                            plan={plan}
                            planIndex={planIndex}
                            tabIndex={ti}
                            updatePlan={(tix, pix, u) => servicePlanUpdate(si, tix, pix, u)}
                            updateFeature={(tix, pix, fi, v) => serviceFeatureUpdate(si, tix, pix, fi, v)}
                            addFeature={(tix, pix) => serviceAddFeature(si, tix, pix)}
                            removeFeature={(tix, pix, fi) => serviceRemoveFeature(si, tix, pix, fi)}
                            reorderFeatures={(tix, pix, feats) => serviceReorderFeatures(si, tix, pix, feats)}
                          />
                        </div>
                      )}
                    />
                  </div>
                )}
              />
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
      >
        <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save pricing'}
      </button>
    </div>
  );
}
