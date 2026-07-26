/**
 * Production build smoke tests.
 *
 * These tests build the production bundle, serve it with `vite preview`, and
 * load the result in a real browser.  They exist specifically to catch
 * module-evaluation crashes (e.g. circular-chunk import ordering issues) that
 * Vite's dev server never surfaces because it does not bundle at all.
 *
 * Running:
 *   pnpm --filter @workspace/ai-workflow-builder test:e2e --project=production
 *
 * The suite runs in serial mode (one worker) so beforeAll fires exactly once.
 * The spec manages its own preview server (port 22180) alongside the dev-server
 * tests on 22179 — no port conflicts.
 */

import { test, expect } from '@playwright/test';
import { execSync, spawn, type ChildProcess } from 'child_process';
import { fileURLToPath } from 'url';
import * as http from 'http';
import * as path from 'path';
import * as fs from 'fs';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

// path.dirname converts the file URL to its containing directory first, so
// '..' correctly resolves to the artifact root (artifacts/ai-workflow-builder/).
const ARTIFACT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROD_PORT = 22180;
const PROD_BASE = `http://localhost:${PROD_PORT}`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Poll until the server returns any HTTP response (or timeout). */
async function waitForServer(url: string, timeoutMs = 45_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  let lastErr = '';
  while (Date.now() < deadline) {
    try {
      await new Promise<void>((resolve, reject) => {
        const req = http.get(url, (res) => {
          res.resume();
          resolve();
        });
        req.on('error', (e) => {
          lastErr = e.message;
          reject(e);
        });
        req.setTimeout(1_000, () => {
          req.destroy();
          reject(new Error('timeout'));
        });
      });
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw new Error(`Preview server at ${url} did not start within ${timeoutMs}ms — last error: ${lastErr}`);
}

// ---------------------------------------------------------------------------
// Test suite — serial so beforeAll/afterAll run exactly once across all tests
// ---------------------------------------------------------------------------

// Run all tests in this suite in a single worker so beforeAll is called once.
test.describe.configure({ mode: 'serial' });

test.describe('Production bundle boot', () => {
  // Each test in this block targets the production preview server, not the
  // dev server that playwright.config.mjs registers as the default webServer.
  test.use({ baseURL: PROD_BASE });
  // The build step can take ~60 s; give beforeAll enough headroom.
  test.setTimeout(180_000);

  let previewProcess: ChildProcess | null = null;

  test.beforeAll(async () => {
    // Extend the current hook's deadline before doing any slow I/O.
    // Calling test.setTimeout() inside a hook applies to that hook's running
    // budget (not just individual test bodies), so the build step (≈45 s)
    // won't hit the default 30 s limit.
    test.setTimeout(180_000);

    // Verify ARTIFACT_DIR resolved correctly — fail fast with a clear message.
    const pkgPath = path.join(ARTIFACT_DIR, 'package.json');
    if (!fs.existsSync(pkgPath)) {
      throw new Error(
        `ARTIFACT_DIR resolved to ${ARTIFACT_DIR} but package.json not found there. ` +
        `prod-boot.spec.ts path calculation is wrong.`,
      );
    }

    // Check if a preview server is already listening (e.g. from a previous run
    // that wasn't cleaned up).  If so, skip spawning a new one.
    let serverAlreadyRunning = false;
    try {
      await waitForServer(PROD_BASE, 1_500);
      serverAlreadyRunning = true;
      console.log('[prod-boot] Reusing preview server already running on', PROD_BASE);
    } catch {
      // Not running — we'll build and start it below.
    }

    if (!serverAlreadyRunning) {
      console.log('[prod-boot] Building production bundle…');
      execSync('pnpm run build', {
        cwd: ARTIFACT_DIR,
        env: {
          ...process.env,
          // PORT is required by vite.config.ts validation; value is only used
          // during `vite dev` / `vite preview`, not during the build itself.
          PORT: '22179',
          BASE_PATH: '/',
          NODE_ENV: 'production',
        },
        stdio: 'inherit',
        // Give the build up to 3 min; it's ~45 s in normal conditions.
        timeout: 180_000,
      });
      console.log('[prod-boot] Build done. Starting preview server…');

      previewProcess = spawn('pnpm', ['run', 'serve'], {
        cwd: ARTIFACT_DIR,
        env: {
          ...process.env,
          PORT: String(PROD_PORT),
          BASE_PATH: '/',
        },
        stdio: 'pipe',
        detached: false,
      });
      previewProcess.stderr?.on('data', (d: Buffer) => process.stderr.write(d));

      await waitForServer(PROD_BASE, 30_000);
      console.log(`[prod-boot] Preview server ready at ${PROD_BASE}`);
    }
  });

  test.afterAll(async () => {
    if (previewProcess) {
      previewProcess.kill('SIGTERM');
      previewProcess = null;
    }
  });

  // --------------------------------------------------------------------------
  // Smoke assertions
  // --------------------------------------------------------------------------

  test('home page boots without uncaught JS errors and React mounts', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (e) => pageErrors.push(e.message));

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // React must have mounted — #root cannot be empty.
    const rootChildCount = await page.$eval('#root', (el) => el.childElementCount);
    expect(
      rootChildCount,
      '#root is empty — React did not mount (likely a module-evaluation crash)',
    ).toBeGreaterThan(0);

    // Pre-React boot failsafe must NOT have triggered (its heading would show
    // "Something went wrong" before React ever runs).
    const bootErrVisible = await page.locator('#root >> h1 >> text="Something went wrong"').count();
    expect(
      bootErrVisible,
      'Pre-React boot failsafe fired — bundle crashed before React mounted',
    ).toBe(0);

    // Zero uncaught JS errors.
    expect(pageErrors, `Uncaught JS errors on /: ${pageErrors.join(' | ')}`).toHaveLength(0);
  });

  test('/dashboard loads without JS errors', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (e) => pageErrors.push(e.message));

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const rootChildCount = await page.$eval('#root', (el) => el.childElementCount);
    expect(rootChildCount, '#root empty on /dashboard').toBeGreaterThan(0);
    expect(pageErrors, `Uncaught JS errors on /dashboard: ${pageErrors.join(' | ')}`).toHaveLength(0);
  });

  test('/workflows loads without JS errors', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (e) => pageErrors.push(e.message));

    await page.goto('/workflows');
    await page.waitForLoadState('networkidle');

    const rootChildCount = await page.$eval('#root', (el) => el.childElementCount);
    expect(rootChildCount, '#root empty on /workflows').toBeGreaterThan(0);
    expect(pageErrors, `Uncaught JS errors on /workflows: ${pageErrors.join(' | ')}`).toHaveLength(0);
  });
});
