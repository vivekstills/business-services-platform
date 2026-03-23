import type { PricingPlan, PricingTabGroup, ServicePackage, ServicePricingPageConfig } from '../types/content';

export function newTabId(): string {
  return `tab-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizePlan(p: unknown): PricingPlan {
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

/** Homepage / shared: resolve `tabs` or fall back to legacy `plans`. */
export function getPricingTabGroups(pricing: {
  plans?: PricingPlan[];
  tabs?: PricingTabGroup[];
}): PricingTabGroup[] {
  const raw = pricing.tabs;
  if (Array.isArray(raw) && raw.length > 0) {
    return raw.map((t, i) => ({
      id: String(t.id || `tab-${i}`),
      label: String(t.label || `Tab ${i + 1}`),
      description: t.description ? String(t.description) : undefined,
      footnote: t.footnote ? String(t.footnote) : undefined,
      plans: Array.isArray(t.plans) ? t.plans.map((p) => normalizePlan(p)) : [],
    }));
  }
  const plans = Array.isArray(pricing.plans) ? pricing.plans.map((p) => normalizePlan(p)) : [];
  return [{ id: 'default', label: 'Plans', plans }];
}

export function emptyPricingPlan(): PricingPlan {
  return {
    name: 'New plan',
    badge: null,
    price: '₹0',
    tagline: '',
    features: [],
    cta: 'Get started',
    ctaTo: '/contact-us',
    highlight: false,
  };
}

export function emptyTabGroup(label = 'New tab'): PricingTabGroup {
  return {
    id: newTabId(),
    label,
    description: '',
    plans: [emptyPricingPlan()],
    footnote: '',
  };
}

/** Map admin homepage plan → service card package (service page tabbed pricing). */
export function pricingPlanToServicePackage(plan: PricingPlan): ServicePackage {
  return {
    name: plan.name,
    price: plan.price,
    description: plan.tagline,
    features: plan.features?.length ? plan.features : undefined,
    popular: plan.highlight,
    customBadge: plan.badge?.trim() ? plan.badge.trim() : null,
  };
}

/** For saves: keep `plans` aligned with first tab for older consumers. */
export function buildPricingPayload(args: {
  sectionLabel: string;
  sectionTitle: string;
  sectionSubtitle: string;
  footnote: string;
  tabs: PricingTabGroup[];
  servicePricingPages: ServicePricingPageConfig[];
}): Record<string, unknown> {
  const tabs = args.tabs.map((t) => ({
    ...t,
    plans: t.plans,
  }));
  const firstPlans = tabs[0]?.plans ?? [];
  return {
    sectionLabel: args.sectionLabel || undefined,
    sectionTitle: args.sectionTitle || undefined,
    sectionSubtitle: args.sectionSubtitle || undefined,
    footnote: args.footnote,
    tabs,
    plans: firstPlans,
    servicePricingPages: args.servicePricingPages.length ? args.servicePricingPages : undefined,
  };
}
