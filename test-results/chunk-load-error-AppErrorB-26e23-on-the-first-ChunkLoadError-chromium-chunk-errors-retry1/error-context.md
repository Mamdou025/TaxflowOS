# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ../artifacts/ai-workflow-builder/e2e/chunk-load-error.spec.ts >> AppErrorBoundary — ChunkLoadError auto-reload >> triggers a page reload exactly once on the first ChunkLoadError
- Location: artifacts/ai-workflow-builder/e2e/chunk-load-error.spec.ts:50:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

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
  1   | /**
  2   |  * E2E tests: AppErrorBoundary — ChunkLoadError auto-reload guard.
  3   |  *
  4   |  * These tests verify the behaviour described in AppErrorBoundary.getDerivedStateFromError:
  5   |  *
  6   |  *  1. When a ChunkLoadError is caught and the sessionStorage guard is absent,
  7   |  *     window.location.reload() must fire — detected as a second main-frame
  8   |  *     navigation after the initial page.goto().
  9   |  *  2. When the guard is already set (i.e. a reload already happened), a second
  10  |  *     ChunkLoadError must NOT trigger another reload — the "Reload" button UI
  11  |  *     is shown instead so the user can recover manually.
  12  |  *
  13  |  * Strategy:
  14  |  *  - page.addInitScript pre-seeds sessionStorage as needed per scenario.
  15  |  *  - page.route aborts the lazy-loaded ChatWorkspacePage module. Chrome turns
  16  |  *    an aborted dynamic import into:
  17  |  *      TypeError: Failed to fetch dynamically imported module: <url>
  18  |  *    which matches the isChunkLoadError() check in AppErrorBoundary.
  19  |  *  - RouteErrorBoundary re-throws ChunkLoadErrors so they bubble up to
  20  |  *    AppErrorBoundary for proper handling (see the re-throw fix in App.tsx).
  21  |  *  - Reload detection: window.location.reload() triggers a real navigation.
  22  |  *    page.waitForNavigation() resolves when that second navigation starts,
  23  |  *    which is more reliable than trying to spy on window.location.reload
  24  |  *    (Chrome's Location API does not delegate through Location.prototype for
  25  |  *    the native reload method).
  26  |  */
  27  | 
  28  | import { test, expect } from '@playwright/test';
  29  | 
  30  | // ---------------------------------------------------------------------------
  31  | // Constants — must match App.tsx
  32  | // ---------------------------------------------------------------------------
  33  | 
  34  | /** sessionStorage key used by AppErrorBoundary to prevent reload loops. */
  35  | const CHUNK_RELOAD_KEY = 'inscope_chunk_reload_attempted';
  36  | 
  37  | /**
  38  |  * URL glob that matches the lazy-loaded ChatWorkspacePage module.
  39  |  * In Vite dev mode each module is served as its own ES module file, so the
  40  |  * URL mirrors the @/ alias → src/ path used in App.tsx.
  41  |  */
  42  | const CHAT_CHUNK_GLOB =
  43  |   '**/features/assistant/workspace/copilot-workspace-panel*';
  44  | 
  45  | // ---------------------------------------------------------------------------
  46  | // Tests
  47  | // ---------------------------------------------------------------------------
  48  | 
  49  | test.describe('AppErrorBoundary — ChunkLoadError auto-reload', () => {
  50  |   test(
  51  |     'triggers a page reload exactly once on the first ChunkLoadError',
  52  |     async ({ page }) => {
  53  |       // Each Playwright test runs in a fresh browser context, so sessionStorage
  54  |       // starts empty — no need to explicitly clear the guard key.
  55  | 
  56  |       // 1. Abort the ChatWorkspacePage module so the dynamic import() throws:
  57  |       //    TypeError: Failed to fetch dynamically imported module: <url>
  58  |       //    RouteErrorBoundary re-throws ChunkLoadErrors up to AppErrorBoundary,
  59  |       //    which sets the sessionStorage guard and calls window.location.reload().
  60  |       await page.route(CHAT_CHUNK_GLOB, (route) => route.abort());
  61  | 
  62  |       // 3. Navigate — count ALL main-frame navigations.
  63  |       //    - Navigation #1: the page.goto() call.
  64  |       //    - Navigation #2: the reload scheduled by AppErrorBoundary.
  65  |       let navigationCount = 0;
  66  |       page.on('framenavigated', (frame) => {
  67  |         if (frame === page.mainFrame()) navigationCount++;
  68  |       });
  69  | 
> 70  |       await page.goto('/');
      |                  ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/
  71  |       // navigationCount is 1 after the initial load.
  72  | 
  73  |       // 4. Wait for the reload navigation (AppErrorBoundary schedules it via
  74  |       //    setTimeout(..., 0) so it fires shortly after the render cycle).
  75  |       await page.waitForNavigation({ timeout: 8_000 });
  76  |       // waitForNavigation resolves on the reload, so navigationCount is now 2.
  77  | 
  78  |       // 5. Exactly one reload must have fired (total of 2 navigations).
  79  |       expect(navigationCount).toBe(2);
  80  | 
  81  |       // 6. The sessionStorage guard must be set so a future ChunkLoadError
  82  |       //    will not loop infinitely.  sessionStorage persists across reloads
  83  |       //    within the same origin.
  84  |       const guard = await page.evaluate(
  85  |         (key: string) => sessionStorage.getItem(key),
  86  |         CHUNK_RELOAD_KEY,
  87  |       );
  88  |       expect(guard).toBe('1');
  89  |     },
  90  |   );
  91  | 
  92  |   test(
  93  |     'does NOT trigger a reload when the sessionStorage guard is already set',
  94  |     async ({ page }) => {
  95  |       // 1. Pre-seed the guard as if a reload already happened once.
  96  |       await page.addInitScript((key: string) => {
  97  |         sessionStorage.setItem(key, '1');
  98  |       }, CHUNK_RELOAD_KEY);
  99  | 
  100 |       // 2. Abort the same chunk — now the guard is set, so AppErrorBoundary
  101 |       //    must show the manual error UI instead of reloading.
  102 |       await page.route(CHAT_CHUNK_GLOB, (route) => route.abort());
  103 | 
  104 |       // 3. Count navigations.
  105 |       let navigationCount = 0;
  106 |       page.on('framenavigated', (frame) => {
  107 |         if (frame === page.mainFrame()) navigationCount++;
  108 |       });
  109 | 
  110 |       await page.goto('/');
  111 |       // navigationCount is 1 after initial load.
  112 | 
  113 |       // 4. Give AppErrorBoundary time to settle — if a reload were incorrectly
  114 |       //    triggered, it would fire within this window.
  115 |       await page.waitForTimeout(3_000);
  116 | 
  117 |       // 5. No second navigation must have occurred.
  118 |       expect(navigationCount).toBe(1);
  119 | 
  120 |       // 6. The error boundary must render the manual "Reload" button, not the
  121 |       //    "New version available — reloading…" spinner.
  122 |       const reloadBtn = page.locator('button:has-text("Reload")');
  123 |       await expect(reloadBtn).toBeVisible({ timeout: 5_000 });
  124 |     },
  125 |   );
  126 | 
  127 |   test(
  128 |     'shows "page was updated" guidance (not generic error) when the guard fires',
  129 |     async ({ page }) => {
  130 |       // Pre-seed the guard so the second ChunkLoadError renders the
  131 |       // guard-triggered fallback UI rather than the generic error panel.
  132 |       await page.addInitScript((key: string) => {
  133 |         sessionStorage.setItem(key, '1');
  134 |       }, CHUNK_RELOAD_KEY);
  135 | 
  136 |       await page.route(CHAT_CHUNK_GLOB, (route) => route.abort());
  137 |       await page.goto('/');
  138 |       await page.waitForTimeout(3_000);
  139 | 
  140 |       // The heading must explain the situation — not the generic "Something went wrong".
  141 |       const heading = page.locator('h1');
  142 |       await expect(heading).toHaveText('The page was updated', { timeout: 5_000 });
  143 | 
  144 |       // Hard-refresh keyboard hint must be visible.
  145 |       await expect(page.getByText(/Ctrl/)).toBeVisible({ timeout: 5_000 });
  146 | 
  147 |       // The Reload button must be present so the user can retry manually.
  148 |       await expect(page.locator('button:has-text("Reload")')).toBeVisible({ timeout: 5_000 });
  149 |     },
  150 |   );
  151 | 
  152 |   test(
  153 |     'Reload button in guard-triggered path clears sessionStorage key so next reload can auto-refresh',
  154 |     async ({ page }) => {
  155 |       // Strategy: seed the guard key via page.evaluate (not addInitScript) so
  156 |       // it is NOT re-seeded on subsequent reloads — addInitScript runs on every
  157 |       // navigation, which would undo the key-removal we are trying to verify.
  158 | 
  159 |       // 1. Navigate without chunk abort so the app loads cleanly.
  160 |       await page.goto('/');
  161 |       await page.waitForLoadState('networkidle');
  162 | 
  163 |       // 2. Seed the guard key directly into sessionStorage.  sessionStorage
  164 |       //    persists across same-origin reloads, so the next page load will
  165 |       //    see it — but only until it is explicitly removed.
  166 |       await page.evaluate((key: string) => {
  167 |         sessionStorage.setItem(key, '1');
  168 |       }, CHUNK_RELOAD_KEY);
  169 | 
  170 |       // 3. Abort the lazy chunk and reload — error boundary reads the guard
```