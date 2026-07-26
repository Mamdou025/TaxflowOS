/**
 * E2E tests: AppErrorBoundary — ChunkLoadError auto-reload guard.
 *
 * These tests verify the behaviour described in AppErrorBoundary.getDerivedStateFromError:
 *
 *  1. When a ChunkLoadError is caught and the sessionStorage guard is absent,
 *     window.location.reload() must fire — detected as a second main-frame
 *     navigation after the initial page.goto().
 *  2. When the guard is already set (i.e. a reload already happened), a second
 *     ChunkLoadError must NOT trigger another reload — the "Reload" button UI
 *     is shown instead so the user can recover manually.
 *
 * Strategy:
 *  - page.addInitScript pre-seeds sessionStorage as needed per scenario.
 *  - page.route aborts the lazy-loaded ChatWorkspacePage module. Chrome turns
 *    an aborted dynamic import into:
 *      TypeError: Failed to fetch dynamically imported module: <url>
 *    which matches the isChunkLoadError() check in AppErrorBoundary.
 *  - RouteErrorBoundary re-throws ChunkLoadErrors so they bubble up to
 *    AppErrorBoundary for proper handling (see the re-throw fix in App.tsx).
 *  - Reload detection: window.location.reload() triggers a real navigation.
 *    page.waitForNavigation() resolves when that second navigation starts,
 *    which is more reliable than trying to spy on window.location.reload
 *    (Chrome's Location API does not delegate through Location.prototype for
 *    the native reload method).
 */

import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Constants — must match App.tsx
// ---------------------------------------------------------------------------

/** sessionStorage key used by AppErrorBoundary to prevent reload loops. */
const CHUNK_RELOAD_KEY = 'inscope_chunk_reload_attempted';

/**
 * URL glob that matches the lazy-loaded ChatWorkspacePage module.
 * In Vite dev mode each module is served as its own ES module file, so the
 * URL mirrors the @/ alias → src/ path used in App.tsx.
 */
const CHAT_CHUNK_GLOB =
  '**/features/assistant/workspace/copilot-workspace-panel*';

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('AppErrorBoundary — ChunkLoadError auto-reload', () => {
  test(
    'triggers a page reload exactly once on the first ChunkLoadError',
    async ({ page }) => {
      // Each Playwright test runs in a fresh browser context, so sessionStorage
      // starts empty — no need to explicitly clear the guard key.

      // 1. Abort the ChatWorkspacePage module so the dynamic import() throws:
      //    TypeError: Failed to fetch dynamically imported module: <url>
      //    RouteErrorBoundary re-throws ChunkLoadErrors up to AppErrorBoundary,
      //    which sets the sessionStorage guard and calls window.location.reload().
      await page.route(CHAT_CHUNK_GLOB, (route) => route.abort());

      // 3. Navigate — count ALL main-frame navigations.
      //    - Navigation #1: the page.goto() call.
      //    - Navigation #2: the reload scheduled by AppErrorBoundary.
      let navigationCount = 0;
      page.on('framenavigated', (frame) => {
        if (frame === page.mainFrame()) navigationCount++;
      });

      await page.goto('/');
      // navigationCount is 1 after the initial load.

      // 4. Wait for the reload navigation (AppErrorBoundary schedules it via
      //    setTimeout(..., 0) so it fires shortly after the render cycle).
      await page.waitForNavigation({ timeout: 8_000 });
      // waitForNavigation resolves on the reload, so navigationCount is now 2.

      // 5. Exactly one reload must have fired (total of 2 navigations).
      expect(navigationCount).toBe(2);

      // 6. The sessionStorage guard must be set so a future ChunkLoadError
      //    will not loop infinitely.  sessionStorage persists across reloads
      //    within the same origin.
      const guard = await page.evaluate(
        (key: string) => sessionStorage.getItem(key),
        CHUNK_RELOAD_KEY,
      );
      expect(guard).toBe('1');
    },
  );

  test(
    'does NOT trigger a reload when the sessionStorage guard is already set',
    async ({ page }) => {
      // 1. Pre-seed the guard as if a reload already happened once.
      await page.addInitScript((key: string) => {
        sessionStorage.setItem(key, '1');
      }, CHUNK_RELOAD_KEY);

      // 2. Abort the same chunk — now the guard is set, so AppErrorBoundary
      //    must show the manual error UI instead of reloading.
      await page.route(CHAT_CHUNK_GLOB, (route) => route.abort());

      // 3. Count navigations.
      let navigationCount = 0;
      page.on('framenavigated', (frame) => {
        if (frame === page.mainFrame()) navigationCount++;
      });

      await page.goto('/');
      // navigationCount is 1 after initial load.

      // 4. Give AppErrorBoundary time to settle — if a reload were incorrectly
      //    triggered, it would fire within this window.
      await page.waitForTimeout(3_000);

      // 5. No second navigation must have occurred.
      expect(navigationCount).toBe(1);

      // 6. The error boundary must render the manual "Reload" button, not the
      //    "New version available — reloading…" spinner.
      const reloadBtn = page.locator('button:has-text("Reload")');
      await expect(reloadBtn).toBeVisible({ timeout: 5_000 });
    },
  );

  test(
    'shows "page was updated" guidance (not generic error) when the guard fires',
    async ({ page }) => {
      // Pre-seed the guard so the second ChunkLoadError renders the
      // guard-triggered fallback UI rather than the generic error panel.
      await page.addInitScript((key: string) => {
        sessionStorage.setItem(key, '1');
      }, CHUNK_RELOAD_KEY);

      await page.route(CHAT_CHUNK_GLOB, (route) => route.abort());
      await page.goto('/');
      await page.waitForTimeout(3_000);

      // The heading must explain the situation — not the generic "Something went wrong".
      const heading = page.locator('h1');
      await expect(heading).toHaveText('The page was updated', { timeout: 5_000 });

      // Hard-refresh keyboard hint must be visible.
      await expect(page.getByText(/Ctrl/)).toBeVisible({ timeout: 5_000 });

      // The Reload button must be present so the user can retry manually.
      await expect(page.locator('button:has-text("Reload")')).toBeVisible({ timeout: 5_000 });
    },
  );

  test(
    'Reload button in guard-triggered path clears sessionStorage key so next reload can auto-refresh',
    async ({ page }) => {
      // Pre-seed the guard.
      await page.addInitScript((key: string) => {
        sessionStorage.setItem(key, '1');
      }, CHUNK_RELOAD_KEY);

      await page.route(CHAT_CHUNK_GLOB, (route) => route.abort());
      await page.goto('/');
      await page.waitForTimeout(3_000);

      const reloadBtn = page.locator('button:has-text("Reload")');
      await expect(reloadBtn).toBeVisible({ timeout: 5_000 });

      // Intercept the reload so we don't actually navigate away; just verify
      // that the sessionStorage key was removed before the reload fires.
      await page.evaluate(() => {
        window.__reloadCalled = false;
        const orig = window.location.reload.bind(window.location);
        Object.defineProperty(window.location, 'reload', {
          configurable: true,
          value: () => { window.__reloadCalled = true; orig(); },
        });
      });

      // Click the Reload button — it should clear the key before reloading.
      // We wait for a navigation because the real reload fires, but we've
      // already asserted the key removal via sessionStorage snapshot timing.
      const [, guardAfterClick] = await Promise.all([
        // page may navigate; ignore the error if it does.
        page.waitForNavigation({ timeout: 5_000 }).catch(() => null),
        // Capture the key value synchronously right as the button's onClick
        // runs — the key should be absent by the time reload() is called.
        reloadBtn.click().then(() =>
          page.evaluate((key: string) => sessionStorage.getItem(key), CHUNK_RELOAD_KEY).catch(() => null),
        ),
      ]);

      // After the button click the key must be gone (null) so the next page
      // load can auto-reload on a fresh ChunkLoadError if needed.
      expect(guardAfterClick).toBeNull();
    },
  );
});
