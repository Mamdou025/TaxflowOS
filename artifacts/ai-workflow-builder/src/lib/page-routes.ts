// Map a registered page key (resource id) to its real Next.js route, so direct
// (non-AI) navigation from the homepage / run surface goes to the actual page
// instead of opening an in-chat tab. Keys come from lib/resource-registry.tsx.
export const PAGE_ROUTES: Record<string, string> = {
  fapi: '/fapi',
  dashboard: '/dashboard',
  'bu-overview': '/bu-overview',
  surplus: '/surplus',
  t1134: '/t1134',
};

/** The route for a page key; falls back to the dashboard for unmapped keys. */
export function pageRoute(key: string): string {
  return PAGE_ROUTES[key] ?? '/dashboard';
}
