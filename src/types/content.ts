export type ServicePackage = {
  name: string;
  price: string;
  description: string;
  features?: string[];
  popular?: boolean;
  /** State-wise pricing: highlighted plan per state (separate from default-service "Most Popular") */
  recommended?: boolean;
  /** When set (e.g. tabbed pricing from admin), shown as card badge instead of Recommended/Most Popular */
  customBadge?: string | null;
};

export type Service = {
  id: string;
  name: string;
  mainHead: string;
  categoryId: string;
  shortDescription?: string;
  content: string;
  packages: ServicePackage[];
  steps?: string[];
};

export type ServiceCategory = {
  id: string;
  title: string;
  description: string;
};

export type FAQ = { q: string; a: string };
export type FAQMap = Record<string, FAQ[]>;

export type PricingPlan = {
  name: string;
  badge: string | null;
  price: string;
  tagline: string;
  features: string[];
  cta: string;
  ctaTo: string;
  highlight: boolean;
};

/** One tab on the homepage pricing section (each tab has its own plan cards). */
export type PricingTabGroup = {
  id: string;
  label: string;
  description?: string;
  plans: PricingPlan[];
  /** Shown under the plan grid for this tab only */
  footnote?: string;
};

/** Tabbed pricing + copy for a specific service page (when no state-specific packages apply). */
export type ServicePricingPageConfig = {
  serviceId: string;
  sectionLabel?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
  footnote?: string;
  tabs: PricingTabGroup[];
};

export type Content = {
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    popular: { label: string; to: string }[];
    stats: { value: string; label: string }[];
    trustCard: {
      title: string;
      subtitle: string;
      items: { label: string; time: string }[];
      rating: string;
      reviews: string;
      badgeValue: string;
      badgeLabel: string;
    };
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  footer: {
    tagline: string;
    serviceLinks: { heading: string; items: { label: string; to: string }[] }[];
    policyLinks: { label: string; to: string }[];
    /** @deprecated Use contact.address; kept for older saves */
    address?: string;
    /** Logo image alt text */
    logoAlt?: string;
    /** Quick tools column (e.g. Business Search) */
    quickToolsHeading?: string;
    quickTools?: { label: string; to: string }[];
    /** Payment column */
    paymentTitle?: string;
    paymentFootnote?: string;
    paymentPayButtonLabel?: string;
    paymentSuccessTitle?: string;
    paymentSuccessSub?: string;
    /** Bottom bar; use {{year}} for current year */
    copyrightLine?: string;
  };
  categories: ServiceCategory[];
  services: Service[];
  faqs: FAQMap;
  pricing: {
    /** Small uppercase label above the title (e.g. "Pricing") */
    sectionLabel?: string;
    sectionTitle?: string;
    sectionSubtitle?: string;
    /** Legacy: first tab’s plans; kept in sync when saving from admin */
    plans: PricingPlan[];
    footnote: string;
    /** Homepage plan tabs; if omitted, `plans` is shown as a single implicit tab */
    tabs?: PricingTabGroup[];
    /** Per-service tabbed pricing on service pages */
    servicePricingPages?: ServicePricingPageConfig[];
  };
  contactSection: {
    label: string;
    heading: string;
    subheading: string;
    servicesList: string[];
    features: { label: string; desc: string }[];
  };
  servicesSection: {
    label: string;
    heading: string;
    description: string;
  };
  stateFaqConfig?: Record<string, {
    mode: 'all-states' | 'per-state';
    allStateFaqs: FAQ[];
    perStateFaqs: Record<string, FAQ[]>;
  }>;
  statePackages?: Record<string, Record<string, ServicePackage[]>>;
  /** Service page blue info box under state dropdown: serviceId → state name → message */
  stateServiceHints?: Record<string, Record<string, string>>;
  articles?: Article[];
  articleCategories?: string[];
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  published: boolean;
  tags: string[];
  readingTime: string;
  coverImage?: string;
};
