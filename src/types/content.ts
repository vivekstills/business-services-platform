export type ServicePackage = {
  name: string;
  price: string;
  description: string;
};

export type Service = {
  id: string;
  name: string;
  mainHead: string;
  categoryId: string;
  shortDescription?: string;
  content: string;
  packages: ServicePackage[];
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
    address: string;
  };
  categories: ServiceCategory[];
  services: Service[];
  faqs: FAQMap;
  pricing: {
    plans: PricingPlan[];
    footnote: string;
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
