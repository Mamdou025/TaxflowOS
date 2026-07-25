
/**
 * Drop-in shim: makes `import { Link, useLocation, useRoute } from '@/lib/router'`
 * work inside a Next.js App Router app without changing any other file.
 * next.config.ts aliases the 'wouter' package to this file.
 */
import NextLink from '@/lib/router';
import { usePathname, useRouter, useParams } from '@/lib/router';
import type { ComponentProps } from 'react';

// Link — same props as Wouter's <Link href="...">
export function Link({ href, children, ...rest }: ComponentProps<'a'> & { href: string }) {
  return <NextLink href={href} {...rest}>{children}</NextLink>;
}

// useLocation — Wouter returns [currentPath, navigate]
export function useLocation(): [string, (to: string) => void] {
  const pathname = usePathname();
  const router = useRouter();
  return [pathname, (to: string) => router.push(to)];
}

// useRoute — Wouter returns [isMatch, params]
export function useRoute(pattern: string): [boolean, Record<string, string> | null] {
  const pathname = usePathname();
  const params = useParams<Record<string, string>>();

  // Simple pattern match: /client/:id matches /client/123
  const regexStr = pattern.replace(/:([^/]+)/g, '([^/]+)');
  const regex = new RegExp(`^${regexStr}$`);
  const isMatch = regex.test(pathname);

  return [isMatch, isMatch ? params : null];
}

// Route and Switch are no-ops in Next.js (routing is file-based)
export function Route() { return null; }
export function Switch({ children }: { children: React.ReactNode }) { return <>{children}</>; }
