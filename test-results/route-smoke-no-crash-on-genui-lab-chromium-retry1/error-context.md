# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: route-smoke.spec.ts >> no crash on /genui-lab
- Location: e2e/route-smoke.spec.ts:49:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/genui-lab
Call log:
  - navigating to "http://localhost:5173/genui-lab", waiting until "networkidle"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e6]:
    - heading "This site can’t be reached" [level=1] [ref=e7]
    - paragraph [ref=e8]:
      - strong [ref=e9]: localhost
      - text: refused to connect.
    - generic [ref=e10]:
      - paragraph [ref=e11]: "Try:"
      - list [ref=e12]:
        - listitem [ref=e13]: Checking the connection
        - listitem [ref=e14]:
          - link "Checking the proxy and the firewall" [ref=e15] [cursor=pointer]:
            - /url: "#buttons"
    - generic [ref=e16]: ERR_CONNECTION_REFUSED
  - generic [ref=e17]:
    - button "Reload" [ref=e19] [cursor=pointer]
    - button "Details" [ref=e20] [cursor=pointer]
```

# Test source

```ts
  1  | /**
  2  |  * Route smoke tests — assert that every static route in App.tsx renders
  3  |  * without triggering the RouteErrorBoundary crash panel.
  4  |  *
  5  |  * The error boundary renders a <div> containing the literal text
  6  |  * "Route render error:" when an import or render throws, so we check for
  7  |  * its absence on every page.
  8  |  *
  9  |  * Dynamic routes (e.g. /workflows/:workflowId) are skipped here because they
  10 |  * require a real resource ID; they are covered by feature-level tests.
  11 |  */
  12 | 
  13 | import { test, expect, Page } from '@playwright/test';
  14 | 
  15 | // All static routes declared in artifacts/ai-workflow-builder/src/App.tsx
  16 | const STATIC_ROUTES = [
  17 |   '/',
  18 |   '/builder',
  19 |   '/workflows',
  20 |   '/workflows-hub',
  21 |   '/agent',
  22 |   '/agent-lab',
  23 |   '/dashboard',
  24 |   '/bu-overview',
  25 |   '/t1134',
  26 |   '/surplus',
  27 |   '/fapi',
  28 |   '/documents',
  29 |   '/viewer',
  30 |   '/worksheets',
  31 |   '/genui-lab',
  32 | ];
  33 | 
  34 | /** Text that only appears inside the RouteErrorBoundary crash panel. */
  35 | const CRASH_MARKER = 'Route render error:';
  36 | 
  37 | async function assertNoCrash(page: Page, route: string) {
  38 |   // Wait for the network to be idle so lazy chunks have time to resolve.
> 39 |   await page.goto(route, { waitUntil: 'networkidle' });
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/genui-lab
  40 | 
  41 |   const bodyText = await page.locator('body').innerText();
  42 |   expect(
  43 |     bodyText,
  44 |     `RouteErrorBoundary crash panel found on "${route}"`,
  45 |   ).not.toContain(CRASH_MARKER);
  46 | }
  47 | 
  48 | for (const route of STATIC_ROUTES) {
  49 |   test(`no crash on ${route}`, async ({ page }) => {
  50 |     await assertNoCrash(page, route);
  51 |   });
  52 | }
  53 | 
```