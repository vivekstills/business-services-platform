import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { Content } from '../types/content';
import { SERVICES, SERVICE_CATEGORIES } from '../data/services';
import { getServiceDetailRoute } from '../data/servicesData';
import FAQS from '../data/faqs';
import { CONTACT_EMAIL, CONTACT_PHONE } from '../data/constants';
import type { Service } from '../data/services';
import { defaultPolicyPages } from '../data/policyPageDefaults';
import { isRichMarkdown, SERVICE_ABOUT_CONTENT } from '../data/serviceAboutContent';

const defaultContent: Content = {
  hero: {
    badge: "India's trusted business compliance platform",
    headline: "Launch & grow your business with complete legal compliance",
    subheadline:
      "GST Registration, Company Formation, Trademark, Tax Filing and 120+ more services — handled end‑to‑end by our expert team.",
    popular: [
      { label: 'GST Registration', to: getServiceDetailRoute(undefined, 'gst-registration') },
      { label: 'Private Limited Co.', to: getServiceDetailRoute(undefined, 'private-limited-company') },
      { label: 'Trademark', to: getServiceDetailRoute(undefined, 'trademark-registration') },
      { label: 'ITR Filing', to: getServiceDetailRoute(undefined, 'itr-1-filing') },
      { label: 'Import Export Code', to: getServiceDetailRoute(undefined, 'import-export-code') },
    ],
    stats: [
      { value: '50,000+', label: 'Businesses served' },
      { value: '4.9 / 5', label: 'Average rating' },
      { value: '100%', label: 'Govt. approved process' },
    ],
    trustCard: {
      title: 'Expert Advisory',
      subtitle: 'Your business, our expertise — from registration to compliance.',
      items: [
        { label: 'GST Registration', time: '3–5 days' },
        { label: 'Company Incorporation', time: '7–10 days' },
        { label: 'Trademark Registration', time: '2–3 weeks' },
      ],
      rating: '4.9',
      reviews: '12,000+ reviews',
      badgeValue: '50K+',
      badgeLabel: 'Businesses',
    },
  },
  contact: {
    email: CONTACT_EMAIL,
    phone: CONTACT_PHONE,
    address: 'Om Chambers, 468/A, 4th Floor, Binnamangala, 1st Stage, Indiranagar, Bangalore North, Karnataka – 560038.',
  },
  footer: {
    tagline: "India's trusted platform for business registrations, tax compliance and legal services.",
    serviceLinks: [
      {
        heading: 'Form New Business',
        items: [
          { label: 'Private Limited Company', to: getServiceDetailRoute(undefined, 'private-limited-company') },
          { label: 'LLP', to: getServiceDetailRoute(undefined, 'llp') },
          { label: 'One Person Company', to: getServiceDetailRoute(undefined, 'one-person-company') },
          { label: 'Partnership', to: getServiceDetailRoute(undefined, 'partnership') },
          { label: 'Nidhi Company', to: getServiceDetailRoute(undefined, 'nidhi-company') },
        ],
      },
      {
        heading: 'Registrations',
        items: [
          { label: 'GST Registration', to: getServiceDetailRoute(undefined, 'gst-registration') },
          { label: 'FSSAI Registration', to: getServiceDetailRoute(undefined, 'fssai-registration') },
          { label: 'Trade License', to: getServiceDetailRoute(undefined, 'trade-license') },
          { label: 'Import Export Code', to: getServiceDetailRoute(undefined, 'import-export-code') },
          { label: 'Digital Signature', to: getServiceDetailRoute(undefined, 'digital-signature') },
        ],
      },
      {
        heading: 'GST & Tax',
        items: [
          { label: 'GST Return Filing', to: getServiceDetailRoute(undefined, 'gst-return-filing') },
          { label: 'GST Refund', to: getServiceDetailRoute(undefined, 'gst-refund') },
          { label: 'ITR-1 Filing', to: getServiceDetailRoute(undefined, 'itr-1-filing') },
          { label: 'ITR-3 Filing', to: getServiceDetailRoute(undefined, 'itr-3-filing') },
          { label: 'TDS Return Filing', to: getServiceDetailRoute(undefined, 'tds-return-filing') },
        ],
      },
      {
        heading: 'Trademark & IP',
        items: [
          { label: 'Trademark Registration', to: getServiceDetailRoute(undefined, 'trademark-registration') },
          { label: 'Trademark Renewal', to: getServiceDetailRoute(undefined, 'trademark-renewal') },
          { label: 'Copyright Registration', to: getServiceDetailRoute(undefined, 'copyright-registration') },
          { label: 'Patent Registration', to: getServiceDetailRoute(undefined, 'patent-registration') },
        ],
      },
    ],
    policyLinks: [
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Refund Policy', to: '/refund-policy' },
      { label: 'Confidentiality Policy', to: '/confidentiality-policy' },
      { label: 'Disclaimer Policy', to: '/disclaimer-policy' },
      { label: 'Terms & Conditions', to: '/terms-conditions' },
      { label: 'Review Page', to: '/reviews' },
      { label: 'About Us', to: '/about-us' },
      { label: 'Contact Us', to: '/contact-us' },
    ],
    logoAlt: 'Mridhuv Associates',
    quickToolsHeading: 'Quick Tools',
    quickTools: [
      { label: 'Business Search', to: '/business-search' },
      { label: 'Trademark Search', to: '/trademark-search' },
    ],
    paymentTitle: 'Make a Payment',
    paymentFootnote: 'Secured by Razorpay · 256-bit SSL encryption',
    paymentPayButtonLabel: 'Pay Now',
    paymentSuccessTitle: 'Payment successful!',
    paymentSuccessSub: "You'll receive a confirmation shortly.",
    copyrightLine: '© {{year}} Mridhuv Associates. All rights reserved.',
    contactBlockHeading: 'Contact Us',
    showBottomContactRow: true,
    paymentCheckoutBrandName: 'Mridhuv Associates',
    paymentPlaceholderAmount: 'Amount (₹)',
    paymentPlaceholderName: 'Your name',
    paymentPlaceholderPhone: 'Phone number',
    paymentPlaceholderEmail: 'Email (optional, for receipt)',
    paymentPlaceholderNote: 'Payment note / reference (optional)',
  },
  categories: SERVICE_CATEGORIES,
  services: SERVICES,
  faqs: FAQS,
  pricing: {
    plans: [
      {
        name: 'Standard',
        badge: null,
        price: '₹4,500',
        tagline: 'Essential setup for new ventures',
        features: [
          'Company / entity registration',
          'PAN & TAN application',
          'Digital Signature (DSC)',
          'Director Identification Number (DIN)',
          'Basic compliance guidance',
        ],
        cta: 'Get Standard',
        ctaTo: '/category/new-business',
        highlight: false,
      },
      {
        name: 'Deluxe',
        badge: 'Most popular',
        price: '₹8,999',
        tagline: 'Complete compliance for growing companies',
        features: [
          'Everything in Standard',
          'GST Registration & 3-month filing',
          'MSME Registration',
          'Bank account opening support',
          '1 year annual compliance filing',
          'Dedicated account manager',
        ],
        cta: 'Get Deluxe',
        ctaTo: '/category/new-business',
        highlight: true,
      },
      {
        name: 'Premium',
        badge: null,
        price: '₹15,499',
        tagline: 'Full-service with trademark & legal support',
        features: [
          'Everything in Deluxe',
          'Trademark Registration',
          'Shareholders Agreement',
          'Employment contracts template',
          'Priority support (24 × 7)',
          'Legal consultation (2 hours)',
        ],
        cta: 'Get Premium',
        ctaTo: '/category/new-business',
        highlight: false,
      },
    ],
    footnote:
      'Each individual service also has its own tailored packages — browse any service for specific pricing.',
  },
  contactSection: {
    label: 'Get in Touch',
    heading: "Let's get your business started",
    subheading:
      'Fill out the form and our team will reach out within 24 business hours with a personalised plan for your requirements.',
    servicesList: [
      'GST Registration',
      'Private Limited Company',
      'LLP Formation',
      'Trademark Registration',
      'FSSAI Registration',
      'Import Export Code',
      'ITR Filing',
      'TDS Return',
      'Other',
    ],
    features: [
      { label: 'Expert consultation', desc: 'Talk to a specialist who understands your industry.' },
      { label: 'Fast turnaround', desc: 'Most services completed within 7–10 working days.' },
      { label: 'Fixed pricing', desc: 'No hidden fees — you know the cost upfront.' },
    ],
  },
  servicesSection: {
    label: 'Our Services',
    heading: 'Everything you need to start & run your business',
    description:
      '120+ services across registrations, tax, IP, compliance and more — handled end‑to‑end by experts.',
  },
  stateServiceHints: {},
  policyPages: defaultPolicyPages as Content['policyPages'],
};

function deepMerge<T>(target: T, source: Partial<T>): T {
  if (source === null || typeof source !== 'object' || Array.isArray(source)) {
    return (source as T) ?? target;
  }
  const result = { ...target } as Record<string, unknown>;
  for (const key of Object.keys(source)) {
    const src = (source as Record<string, unknown>)[key];
    const tgt = (target as Record<string, unknown>)[key];
    if (src && typeof src === 'object' && !Array.isArray(src) && tgt && typeof tgt === 'object') {
      (result as Record<string, unknown>)[key] = deepMerge(tgt, src as Partial<typeof tgt>);
    } else if (src !== undefined) {
      (result as Record<string, unknown>)[key] = src;
    }
  }
  return result as T;
}

type ContentContextValue = {
  content: Content;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

/**
 * deepMerge replaces arrays wholesale, which means an older saved
 * `content.services` array from /api/content (or the static snapshot)
 * can hide code-defined services that were added later — making those
 * service pages redirect to /services.
 *
 * Union any code-defined service whose id isn't present in the merged
 * result, preserving admin-edited versions when they exist. Same pattern
 * applies to categories so new categories shipping in code also show up.
 */
function unionCodeDefinedServices(merged: Content): Content {
  const mergedSvcIds = new Set((merged.services ?? []).map((s) => s.id));
  const extraSvcs = defaultContent.services.filter((s) => !mergedSvcIds.has(s.id));

  const mergedCatIds = new Set((merged.categories ?? []).map((c) => c.id));
  const extraCats = defaultContent.categories.filter((c) => !mergedCatIds.has(c.id));

  if (!extraSvcs.length && !extraCats.length) return merged;
  return {
    ...merged,
    services: extraSvcs.length ? [...(merged.services ?? []), ...extraSvcs] : merged.services,
    categories: extraCats.length ? [...(merged.categories ?? []), ...extraCats] : merged.categories,
  };
}

/**
 * Prefer structured About copy from the shipped `public/content.json` when the API
 * response did not supply a full `services` array (merge would keep long-form
 * defaults from `SERVICE_ABOUT_CONTENT` in code, which never gets updated by JSON patches).
 * When the API did return a non-empty `services` array, trust that payload and only
 * overlay public where the merged service still has non-rich or empty content.
 */
/**
 * `defaultContent` + `data/content.json` (and API) merge replaces the
 * `services` array. That snapshot often ships stale, paragraph-style
 * "About" strings that have already been restructured in code under
 * `SERVICE_ABOUT_CONTENT` (including `*.md?raw` imports). Always prefer the
 * bundled long-form text so lists, steps, and section anchors render
 * correctly in `RichContent`.
 */
function applyServiceAboutCodeOverrides(merged: Content): Content {
  if (!merged.services?.length) return merged;
  let changed = false;
  const next = merged.services.map((s) => {
    const fromCode = SERVICE_ABOUT_CONTENT[s.id];
    if (fromCode == null) return s;
    if (fromCode === s.content) return s;
    changed = true;
    return { ...s, content: fromCode };
  });
  return changed ? { ...merged, services: next } : merged;
}

function applyRichAboutFromPublicSnapshot(
  merged: Content,
  snapshot: unknown,
  apiData?: object | null
): Content {
  if (!snapshot || typeof snapshot !== 'object') return merged;
  const list = (snapshot as { services?: Service[] }).services;
  if (!Array.isArray(list) || list.length === 0) return merged;
  const byId = new Map(list.map((s) => [s.id, s] as const));
  const apiServices = apiData && typeof apiData === 'object' ? (apiData as { services?: Service[] }).services : undefined;
  const apiHasFullServices = Array.isArray(apiServices) && apiServices.length > 0;

  let changed = false;
  const next = (merged.services ?? []).map((s) => {
    const pub = byId.get(s.id);
    const c = pub?.content;
    if (typeof c !== 'string' || !c.trim() || !isRichMarkdown(c)) return s;
    if (c === s.content) return s;

    if (apiHasFullServices) {
      if (s.content && isRichMarkdown(s.content)) return s;
      changed = true;
      return { ...s, content: c };
    }

    changed = true;
    return { ...s, content: c };
  });
  if (!changed) return merged;
  return { ...merged, services: next };
}

async function fetchPublicContentJson(): Promise<unknown | null> {
  try {
    const r = await fetch('/content.json');
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<Content>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    setLoading(true);
    setError(null);
    try {
      // Primary source: API-backed content (used by admin panel saves).
      try {
        const apiRes = await fetch('/api/content');
        if (apiRes.ok) {
          const apiData = await apiRes.json();
          if (apiData && typeof apiData === 'object' && Object.keys(apiData).length > 0) {
            const publicSnap = await fetchPublicContentJson();
            const base = unionCodeDefinedServices(deepMerge(defaultContent, apiData) as Content);
            setContent(applyServiceAboutCodeOverrides(applyRichAboutFromPublicSnapshot(base, publicSnap, apiData)));
            return;
          }
        }
      } catch {
        // Swallow and fall through to the static snapshot.
      }

      // Fallback source: static snapshot served from /public (for environments
      // without an API backend, e.g. static hosting / build previews).
      const staticRes = await fetch('/content.json');
      if (staticRes.ok) {
        const staticData = await staticRes.json();
        if (staticData && typeof staticData === 'object' && Object.keys(staticData).length > 0) {
          const merged = unionCodeDefinedServices(deepMerge(defaultContent, staticData) as Content);
          setContent(applyServiceAboutCodeOverrides(applyRichAboutFromPublicSnapshot(merged, staticData, staticData)));
          return;
        }
      }

      setError('Content source is empty');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const value = useMemo(
    () => ({ content, loading, error, refetch: fetchContent }),
    [content, loading, error]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}

export function getServiceById(services: Service[], id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

export function getServicesByCategory(services: Service[], categoryId: string): Service[] {
  return services.filter((s) => s.categoryId === categoryId);
}
