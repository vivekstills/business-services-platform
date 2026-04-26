/**
 * Legacy service `id` values that should resolve to a canonical `id` for
 * routes and form URLs. All keys must be removed as standalone services.
 */
const SERVICE_ID_CANONICAL: Record<string, string> = {
  llp: 'llp-registration',
  'indian-subsidiary': 'indian-subsidiary-foreign-company',
  'dpit-registration': 'dpiit-registration',
  'tan-registration-service': 'tan-registration',
};

export function getCanonicalServiceId(id: string | undefined | null): string | null {
  if (id == null || id === '') return null;
  return SERVICE_ID_CANONICAL[id] ?? null;
}
