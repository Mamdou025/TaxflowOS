/**
 * Next.js navigation → wouter compatibility shim.
 *
 * Rules:
 *  - No double imports of the same module (causes esbuild cycle detection)
 *  - Only export what files actually need; wouter primitives pass through
 */
import { useLocation, useSearch } from 'wouter';

// Pass-through re-exports for files that previously imported from next/link or next/navigation
export { Link, Route, Switch, Router, Redirect, useLocation, useRoute, useSearch, useParams } from 'wouter';

// ── next/navigation compat ────────────────────────────────────────────────────

/** usePathname() ↔ wouter useLocation()[0] */
export function usePathname(): string {
  const [path] = useLocation();
  return path;
}

/** useRouter() — push/replace/back */
export function useRouter() {
  const [, navigate] = useLocation();
  return {
    push: (href: string) => navigate(href),
    replace: (href: string) => navigate(href, { replace: true }),
    back: () => window.history.back(),
    prefetch: () => {},
    refresh: () => window.location.reload(),
  };
}

/** useSearchParams() → URLSearchParams */
export function useSearchParams(): URLSearchParams {
  const search = useSearch();
  return new URLSearchParams(search);
}

/** redirect() — client-side navigation + throw to stop rendering */
export function redirect(href: string): never {
  window.location.replace(href);
  throw new Error('redirect');
}

/** notFound() — throw a not-found sentinel */
export function notFound(): never {
  throw new Error('notFound');
}
