/**
 * Route smoke tests — assert that every static route in App.tsx renders
 * without triggering the RouteErrorBoundary crash panel.
 *
 * The error boundary renders a <div> containing the literal text
 * "Route render error:" when an import or render throws, so we check for
 * its absence on every page.
 *
 * Dynamic routes (e.g. /workflows/:workflowId) are skipped here because they
 * require a real resource ID; they are covered by feature-level tests.
 */

import { test, expect, Page } from '@playwright/test';

// All static routes declared in artifacts/ai-workflow-builder/src/App.tsx
const STATIC_ROUTES = [
  '/',
  '/builder',
  '/workflows',
  '/workflows-hub',
  '/agent',
  '/agent-lab',
  '/dashboard',
  '/bu-overview',
  '/t1134',
  '/surplus',
  '/fapi',
  '/documents',
  '/viewer',
  '/worksheets',
  '/genui-lab',
];

/** Text that only appears inside the RouteErrorBoundary crash panel. */
const CRASH_MARKER = 'Route render error:';

async function assertNoCrash(page: Page, route: string) {
  // Wait for the network to be idle so lazy chunks have time to resolve.
  await page.goto(route, { waitUntil: 'networkidle' });

  const bodyText = await page.locator('body').innerText();
  expect(
    bodyText,
    `RouteErrorBoundary crash panel found on "${route}"`,
  ).not.toContain(CRASH_MARKER);
}

for (const route of STATIC_ROUTES) {
  test(`no crash on ${route}`, async ({ page }) => {
    await assertNoCrash(page, route);
  });
}
