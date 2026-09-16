# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ../artifacts/ai-workflow-builder/e2e/chunk-load-error.spec.ts >> AppErrorBoundary — ChunkLoadError auto-reload >> Reload button in guard-triggered path clears sessionStorage key so next reload can auto-refresh
- Location: artifacts/ai-workflow-builder/e2e/chunk-load-error.spec.ts:163:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('button:has-text("Reload")')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('button:has-text("Reload")')

```

# Test source

```ts
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
  153 |       await expect(heading).toHaveText('The page was updated', { timeout: 5_000 });
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
> 188 |       await expect(reloadBtn).toBeVisible({ timeout: 5_000 });
      |                               ^ Error: expect(locator).toBeVisible() failed
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
  254 |   test(
  255 |     'logs type:ChunkLoadError and guardTriggered:true on the first chunk error (auto-reload path)',
  256 |     async ({ page }) => {
  257 |       // Inject spy before any script runs so it wraps console.error from the start.
  258 |       // addInitScript re-runs on every navigation, ensuring capture after reload too.
  259 |       await page.addInitScript(injectConsoleErrorSpy(LOG_CAPTURE_KEY), LOG_CAPTURE_KEY);
  260 | 
  261 |       // Abort the chunk so AppErrorBoundary catches a ChunkLoadError.
  262 |       await page.route(CHAT_CHUNK_GLOB, (route) => route.abort());
  263 | 
  264 |       // Navigate and wait for the auto-reload that AppErrorBoundary triggers.
  265 |       await page.goto('/');
  266 |       await page.waitForNavigation({ timeout: 8_000 });
  267 | 
  268 |       // After the reload the spy (re-injected by addInitScript) may fire again
  269 |       // on the reloaded page — wait a moment for React to settle.
  270 |       await page.waitForTimeout(2_000);
  271 | 
  272 |       // Read the captured log from localStorage (persists across same-origin reload).
  273 |       const raw = await page.evaluate((key: string) => localStorage.getItem(key), LOG_CAPTURE_KEY);
  274 |       expect(raw, 'console.error was not called with the [AppErrorBoundary] prefix').not.toBeNull();
  275 | 
  276 |       const event = JSON.parse(raw!);
  277 | 
  278 |       // --- required fields ---
  279 |       expect(event).toHaveProperty('type', 'ChunkLoadError');
  280 |       expect(event).toHaveProperty('guardTriggered', true);
  281 |       expect(typeof event.message).toBe('string');
  282 |       // stack may be undefined in some environments but must be present as a key
  283 |       expect('stack' in event).toBe(true);
  284 |       expect('componentStack' in event).toBe(true);
  285 |     },
  286 |   );
  287 | 
  288 |   test(
```