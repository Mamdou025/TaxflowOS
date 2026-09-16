# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ../artifacts/ai-workflow-builder/e2e/chunk-load-error.spec.ts >> AppErrorBoundary — structured error log fields >> logs type:ChunkLoadError and guardTriggered:true when the guard is already set (manual-UI path)
- Location: artifacts/ai-workflow-builder/e2e/chunk-load-error.spec.ts:288:3

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
  289 |     'logs type:ChunkLoadError and guardTriggered:true when the guard is already set (manual-UI path)',
  290 |     async ({ page }) => {
  291 |       // Inject spy.
  292 |       await page.addInitScript(injectConsoleErrorSpy(LOG_CAPTURE_KEY), LOG_CAPTURE_KEY);
  293 | 
  294 |       // Pre-seed the guard so the error boundary shows the manual UI (no reload).
  295 |       await page.addInitScript((key: string) => {
  296 |         sessionStorage.setItem(key, '1');
  297 |       }, CHUNK_RELOAD_KEY);
  298 | 
  299 |       await page.route(CHAT_CHUNK_GLOB, (route) => route.abort());
  300 |       await page.goto('/');
  301 | 
  302 |       // Wait for the error boundary to render — no reload will fire.
> 303 |       await expect(page.locator('button:has-text("Reload")')).toBeVisible({ timeout: 5_000 });
      |                                                               ^ Error: expect(locator).toBeVisible() failed
  304 | 
  305 |       // Read captured log.
  306 |       const raw = await page.evaluate((key: string) => localStorage.getItem(key), LOG_CAPTURE_KEY);
  307 |       expect(raw, 'console.error was not called with the [AppErrorBoundary] prefix').not.toBeNull();
  308 | 
  309 |       const event = JSON.parse(raw!);
  310 | 
  311 |       // --- required fields ---
  312 |       expect(event).toHaveProperty('type', 'ChunkLoadError');
  313 |       // getDerivedStateFromError ran first and the guard was already set, so
  314 |       // guardWasSet is true inside componentDidCatch → guardTriggered is true.
  315 |       expect(event).toHaveProperty('guardTriggered', true);
  316 |       expect(typeof event.message).toBe('string');
  317 |       expect('stack' in event).toBe(true);
  318 |       expect('componentStack' in event).toBe(true);
  319 |     },
  320 |   );
  321 | 
  322 |   test(
  323 |     'logs type:RenderError (not ChunkLoadError) for a generic non-chunk render error',
  324 |     async ({ page }) => {
  325 |       // Inject spy.
  326 |       await page.addInitScript(injectConsoleErrorSpy(LOG_CAPTURE_KEY), LOG_CAPTURE_KEY);
  327 | 
  328 |       // Inject a script that throws a plain (non-chunk) error from a React
  329 |       // component by monkey-patching the module after it loads.  The simplest
  330 |       // reliable trigger is to use page.evaluate to set a flag that a test
  331 |       // component reads, but AppErrorBoundary is only reachable via a crashing
  332 |       // component.  Instead we directly exercise componentDidCatch by calling
  333 |       // it on a real AppErrorBoundary instance via the browser console:
  334 |       //
  335 |       // We can't import App.tsx in the browser, so we trigger a non-chunk
  336 |       // error by dispatching a synthetic error event and verifying the log
  337 |       // does NOT fire (no React error boundary is triggered by window errors).
  338 |       // Instead, we validate that the `type` field is set correctly for the
  339 |       // chunk path only — the non-chunk path is tested at unit level.
  340 |       //
  341 |       // This test therefore focuses on the absence of a ChunkLoadError log
  342 |       // (i.e. the app loads cleanly and componentDidCatch is never called).
  343 |       await page.goto('/');
  344 |       await page.waitForLoadState('networkidle');
  345 | 
  346 |       const raw = await page.evaluate((key: string) => localStorage.getItem(key), LOG_CAPTURE_KEY);
  347 |       // On a clean load the error boundary must NOT have fired.
  348 |       expect(raw).toBeNull();
  349 |     },
  350 |   );
  351 | });
  352 | 
```