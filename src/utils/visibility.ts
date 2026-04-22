/**
 * Visibility helpers for content that is ready in the codebase but should
 * not yet be shown to the public.
 *
 * `isDeveloperView()` returns true when the site is being served in a
 * developer context — either through Vite's dev server (`import.meta.env.DEV`)
 * or from a localhost preview build. Everywhere else (production deployment
 * on a real domain) it returns false so the gated content is hidden.
 */
export function isDeveloperView(): boolean {
  if (import.meta.env.DEV) return true;
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host === '::1';
}
