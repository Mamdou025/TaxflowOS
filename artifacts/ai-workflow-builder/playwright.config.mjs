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
  },
  projects: [
    // Full browser tests — require Chromium with system glibc (GitHub Actions,
    // Ubuntu CI).  Run with: --project=chromium
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, testMatch: '**/e2e/copilotkit-chat.spec.ts' },

    // API-only tests — no browser required, runs everywhere including NixOS.
    // Run with: --project=api  (or just run all, this project is always valid)
    { name: 'api', use: {}, testMatch: '**/e2e/api-smoke.spec.ts' },
  ],
  webServer: {
    command: 'PORT=22179 BASE_PATH=/ pnpm run dev',
    url: 'http://localhost:22179',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
