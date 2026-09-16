# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ../artifacts/ai-workflow-builder/e2e/chunk-load-error.spec.ts >> AppErrorBoundary — ChunkLoadError auto-reload >> shows "page was updated" guidance (not generic error) when the guard fires
- Location: artifacts/ai-workflow-builder/e2e/chunk-load-error.spec.ts:138:3

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: locator('h1')
Expected: "The page was updated"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveText" with timeout 5000ms
  - waiting for locator('h1')

```

# Test source

```ts
  53  | const CHAT_CHUNK_GLOB =
  54  |   '**/features/assistant/workspace/copilot-workspace-panel*';
  55  | 
  56  | // ---------------------------------------------------------------------------
  57  | // Tests
  58  | // ---------------------------------------------------------------------------
  59  | 
  60  | test.describe('AppErrorBoundary — ChunkLoadError auto-reload', () => {
  61  |   test(
  62  |     'triggers a page reload exactly once on the first ChunkLoadError',
  63  |     async ({ page }) => {
  64  |       // Each Playwright test runs in a fresh browser context, so sessionStorage
  65  |       // starts empty — no need to explicitly clear the guard key.
  66  | 
  67  |       // 1. Abort the ChatWorkspacePage module so the dynamic import() throws:
  68  |       //    TypeError: Failed to fetch dynamically imported module: <url>
  69  |       //    RouteErrorBoundary re-throws ChunkLoadErrors up to AppErrorBoundary,
  70  |       //    which sets the sessionStorage guard and calls window.location.reload().
  71  |       await page.route(CHAT_CHUNK_GLOB, (route) => route.abort());
  72  | 
  73  |       // 3. Navigate — count ALL main-frame navigations.
  74  |       //    - Navigation #1: the page.goto() call.
  75  |       //    - Navigation #2: the reload scheduled by AppErrorBoundary.
  76  |       let navigationCount = 0;
  77  |       page.on('framenavigated', (frame) => {
  78  |         if (frame === page.mainFrame()) navigationCount++;
  79  |       });
  80  | 
  81  |       await page.goto('/');
  82  |       // navigationCount is 1 after the initial load.
  83  | 
  84  |       // 4. Wait for the reload navigation (AppErrorBoundary schedules it via
  85  |       //    setTimeout(..., 0) so it fires shortly after the render cycle).
  86  |       await page.waitForNavigation({ timeout: 8_000 });
  87  |       // waitForNavigation resolves on the reload, so navigationCount is now 2.
  88  | 
  89  |       // 5. Exactly one reload must have fired (total of 2 navigations).
  90  |       expect(navigationCount).toBe(2);
  91  | 
  92  |       // 6. The sessionStorage guard must be set so a future ChunkLoadError
  93  |       //    will not loop infinitely.  sessionStorage persists across reloads
  94  |       //    within the same origin.
  95  |       const guard = await page.evaluate(
  96  |         (key: string) => sessionStorage.getItem(key),
  97  |         CHUNK_RELOAD_KEY,
  98  |       );
  99  |       expect(guard).toBe('1');
  100 |     },
  101 |   );
  102 | 
  103 |   test(
  104 |     'does NOT trigger a reload when the sessionStorage guard is already set',
  105 |     async ({ page }) => {
  106 |       // 1. Pre-seed the guard as if a reload already happened once.
  107 |       await page.addInitScript((key: string) => {
  108 |         sessionStorage.setItem(key, '1');
  109 |       }, CHUNK_RELOAD_KEY);
  110 | 
  111 |       // 2. Abort the same chunk — now the guard is set, so AppErrorBoundary
  112 |       //    must show the manual error UI instead of reloading.
  113 |       await page.route(CHAT_CHUNK_GLOB, (route) => route.abort());
  114 | 
  115 |       // 3. Count navigations.
  116 |       let navigationCount = 0;
  117 |       page.on('framenavigated', (frame) => {
  118 |         if (frame === page.mainFrame()) navigationCount++;
  119 |       });
  120 | 
  121 |       await page.goto('/');
  122 |       // navigationCount is 1 after initial load.
  123 | 
  124 |       // 4. Give AppErrorBoundary time to settle — if a reload were incorrectly
  125 |       //    triggered, it would fire within this window.
  126 |       await page.waitForTimeout(3_000);
  127 | 
  128 |       // 5. No second navigation must have occurred.
  129 |       expect(navigationCount).toBe(1);
  130 | 
  131 |       // 6. The error boundary must render the manual "Reload" button, not the
  132 |       //    "New version available — reloading…" spinner.
  133 |       const reloadBtn = page.locator('button:has-text("Reload")');
  134 |       await expect(reloadBtn).toBeVisible({ timeout: 5_000 });
  135 |     },
  136 |   );
  137 | 
  138 |   test(
  139 |     'shows "page was updated" guidance (not generic error) when the guard fires',
  140 |     async ({ page }) => {
  141 |       // Pre-seed the guard so the second ChunkLoadError renders the
  142 |       // guard-triggered fallback UI rather than the generic error panel.
  143 |       await page.addInitScript((key: string) => {
  144 |         sessionStorage.setItem(key, '1');
  145 |       }, CHUNK_RELOAD_KEY);
  146 | 
  147 |       await page.route(CHAT_CHUNK_GLOB, (route) => route.abort());
  148 |       await page.goto('/');
  149 |       await page.waitForTimeout(3_000);
  150 | 
  151 |       // The heading must explain the situation — not the generic "Something went wrong".
  152 |       const heading = page.locator('h1');
> 153 |       await expect(heading).toHaveText('The page was updated', { timeout: 5_000 });
      |                             ^ Error: expect(locator).toHaveText(expected) failed
  154 | 
  155 |       // Hard-refresh keyboard hint must be visible.
  156 |       await expect(page.getByText(/Ctrl/)).toBeVisible({ timeout: 5_000 });
  157 | 
  158 |       // The Reload button must be present so the user can retry manually.
  159 |       await expect(page.locator('button:has-text("Reload")')).toBeVisible({ timeout: 5_000 });
  160 |     },
  161 |   );
  162 | 
  163 |   test(
  164 |     'Reload button in guard-triggered path clears sessionStorage key so next reload can auto-refresh',
  165 |     async ({ page }) => {
  166 |       // Strategy: seed the guard key via page.evaluate (not addInitScript) so
  167 |       // it is NOT re-seeded on subsequent reloads — addInitScript runs on every
  168 |       // navigation, which would undo the key-removal we are trying to verify.
  169 | 
  170 |       // 1. Navigate without chunk abort so the app loads cleanly.
  171 |       await page.goto('/');
  172 |       await page.waitForLoadState('networkidle');
  173 | 
  174 |       // 2. Seed the guard key directly into sessionStorage.  sessionStorage
  175 |       //    persists across same-origin reloads, so the next page load will
  176 |       //    see it — but only until it is explicitly removed.
  177 |       await page.evaluate((key: string) => {
  178 |         sessionStorage.setItem(key, '1');
  179 |       }, CHUNK_RELOAD_KEY);
  180 | 
  181 |       // 3. Abort the lazy chunk and reload — error boundary reads the guard
  182 |       //    (already set) and shows the manual "Reload" UI instead of auto-reloading.
  183 |       await page.route(CHAT_CHUNK_GLOB, (route) => route.abort());
  184 |       await page.reload();
  185 |       await page.waitForTimeout(3_000);
  186 | 
  187 |       const reloadBtn = page.locator('button:has-text("Reload")');
  188 |       await expect(reloadBtn).toBeVisible({ timeout: 5_000 });
  189 | 
  190 |       // 4. Remove the chunk-abort route so the page that loads after the
  191 |       //    button click can fetch the chunk successfully.  This prevents the
  192 |       //    error boundary on the reloaded page from re-setting the guard key.
  193 |       await page.unroute(CHAT_CHUNK_GLOB);
  194 | 
  195 |       // 5. Click Reload — the handler removes the key then calls reload().
  196 |       await Promise.all([
  197 |         page.waitForNavigation({ timeout: 8_000 }),
  198 |         reloadBtn.click(),
  199 |       ]);
  200 | 
  201 |       // 6. Key must be null: the handler cleared it and the reloaded page
  202 |       //    loaded the chunk cleanly so the error boundary never re-set it.
  203 |       const guardAfterReload = await page.evaluate(
  204 |         (key: string) => sessionStorage.getItem(key),
  205 |         CHUNK_RELOAD_KEY,
  206 |       );
  207 |       expect(guardAfterReload).toBeNull();
  208 |     },
  209 |   );
  210 | });
  211 | 
  212 | // ---------------------------------------------------------------------------
  213 | // Structured error log field assertions
  214 | // ---------------------------------------------------------------------------
  215 | //
  216 | // AppErrorBoundary.componentDidCatch emits:
  217 | //   console.error('[AppErrorBoundary]', { type, guardTriggered, message, stack, componentStack })
  218 | //
  219 | // The spy below serialises the second argument (the event object) into
  220 | // localStorage as JSON.  localStorage survives a same-origin reload, so
  221 | // assertions can be read after the page settles even when a reload fires.
  222 | //
  223 | // Implementation note on guardTriggered:
  224 | //   getDerivedStateFromError runs BEFORE componentDidCatch.  When it's the
  225 | //   first chunk error, getDerivedStateFromError sets the sessionStorage guard,
  226 | //   then componentDidCatch reads guardWasSet = true.  Therefore
  227 | //   guardTriggered === true for both chunk-error scenarios.
  228 | // ---------------------------------------------------------------------------
  229 | 
  230 | const LOG_CAPTURE_KEY = '__appErrorBoundaryLog';
  231 | 
  232 | /**
  233 |  * addInitScript that intercepts console.error and persists the structured
  234 |  * AppErrorBoundary event object to localStorage as JSON.  This runs on every
  235 |  * navigation within the test, ensuring we capture the log even after a reload.
  236 |  */
  237 | function injectConsoleErrorSpy(captureKey: string) {
  238 |   return (captureKey: string) => {
  239 |     const orig = console.error.bind(console);
  240 |     console.error = (...args: unknown[]) => {
  241 |       orig(...args);
  242 |       if (args[0] === '[AppErrorBoundary]' && args[1] && typeof args[1] === 'object') {
  243 |         try {
  244 |           localStorage.setItem(captureKey, JSON.stringify(args[1]));
  245 |         } catch {
  246 |           // swallow serialisation errors so the app is not disrupted
  247 |         }
  248 |       }
  249 |     };
  250 |   };
  251 | }
  252 | 
  253 | test.describe('AppErrorBoundary — structured error log fields', () => {
```