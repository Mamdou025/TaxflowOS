// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright e2e config for the AI Workflow Builder.
 *
 * Tests mock /api/copilotkit/* with page.route() so no real OpenAI key is
 * needed. The dev server is reused if already running (Replit dev); in CI
 * it is started automatically.
 *
 * Run:  pnpm --filter @workspace/ai-workflow-builder test:e2e
 * CI:   playwright install chromium  (once, downloads ~150 MB)
 */
export default defineConfig({
  testDir: './e2e',
  tsconfig: './e2e/tsconfig.json',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${process.env.PORT ?? 22179}`,
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    launchOptions: {
      // Replit pre-installs a NixOS-compatible Chromium at this path.
      // Falls back to Playwright's own downloaded binary in CI / local dev.
      executablePath: process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    },
  },
  projects: [
    // Full browser tests — run with: --project=chromium
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: [
        '**/e2e/copilotkit-chat.spec.ts',
        '**/e2e/chunk-load-error.spec.ts',
      ],
    },

    // API-only tests — no browser required, runs everywhere including NixOS.
    // Run with: --project=api  (or just run all, this project is always valid)
    { name: 'api', use: {}, testMatch: '**/e2e/api-smoke.spec.ts' },

    // Production-build smoke test.
    // Builds the production bundle and serves it via `vite preview` to catch
    // module-evaluation crashes (circular chunk imports, etc.) that Vite's dev
    // server never reveals because it does not bundle.
    // The spec manages its own preview server on port 22180.
    // Run with: --project=production
    {
      name: 'production',
      // The beforeAll hook builds the production bundle (≈45 s) before starting
      // the preview server.  Set a generous project-level timeout so hooks and
      // tests both have enough headroom.
      timeout: 180_000,
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/e2e/prod-boot.spec.ts',
    },
  ],
  webServer: {
    command: 'PORT=22179 BASE_PATH=/ pnpm run dev',
    url: 'http://localhost:22179',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
