import { SERVICES, SERVICE_CATEGORIES, type Service } from './services';

export type ServicesNavCategory = {
  slug: string;
  title: string;
  categoryId: string;
  featuredServiceIds: string[];
  categoryServiceIds?: string[];
};

export const SERVICES_NAV_CATEGORIES: ServicesNavCategory[] = [
  {
    slug: 'registration',
    title: 'Registration',
    categoryId: 'registration',
    featuredServiceIds: ['gst-registration', 'fssai-registration', 'trade-license', 'digital-signature'],
    categoryServiceIds: [
      'gst-registration',
      'professional-tax-registration',
      'tan-registration',
      'pf-registration',
      'esi-registration',
      'import-export-code',
      'fssai-registration',
      'trade-license',
      'digital-signature',
      'health-trade-licence',
    ],
  },
  {
    slug: 'start-business',
    title: 'Start Business',
    categoryId: 'new-business',
    featuredServiceIds: ['proprietorship', 'partnership', 'llp', 'private-limited-company'],
  },
  {
    slug: 'tax-filing',
    title: 'Tax & Filing',
    categoryId: 'return-filing',
    featuredServiceIds: ['itr-1-filing', 'tds-return-filing', 'gst-return-filing'],
  },
];

const serviceMap = new Map(SERVICES.map((s) => [s.id, s]));

export function getNavCategoryBySlug(slug: string | undefined) {
  if (!slug) return null;
  return SERVICES_NAV_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function getCategoryServices(categorySlug: string | undefined): Service[] {
  const cat = getNavCategoryBySlug(categorySlug);
  if (!cat) return [];
  if (cat.categoryServiceIds?.length) {
    return cat.categoryServiceIds
      .map((id) => serviceMap.get(id))
      .filter((s): s is Service => Boolean(s));
  }
  return SERVICES.filter((s) => s.categoryId === cat.categoryId);
}

export function getServiceBySlug(serviceSlug: string | undefined) {
  if (!serviceSlug) return null;
  return serviceMap.get(serviceSlug) ?? null;
}

export function getServiceDetailRoute(categorySlug: string, serviceSlug: string) {
  void categorySlug;
  return `/service/${serviceSlug}`;
}

export function getCategoryTitleById(categoryId: string) {
  return SERVICE_CATEGORIES.find((c) => c.id === categoryId)?.title ?? 'Services';
}
