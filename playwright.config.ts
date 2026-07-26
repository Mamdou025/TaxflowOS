// @ts-nocheck — transpiled by Playwright's own TS loader; e2e/tsconfig.json
// covers the test files. The root workspace tsconfig uses composite project
// references that Playwright's resolver cannot handle, so we opt out here.
import { defineConfig, devices } from '@playwright/test';

/**
 * Route smoke-test config.
 *
 * Playwright starts the Vite dev server on a fixed port (5173) before running
 * tests, so the validation command is self-contained — no separate "start the
 * server" step is needed.
 *
 * In the Replit environment the platform pre-installs Chromium and exposes it
 * via REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE so we never need to run
 * `playwright install`.
 */

const TEST_PORT = 5173;
const BASE_URL = `http://localhost:${TEST_PORT}`;

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  retries: 1,
  workers: 1,
  reporter: 'list',

  webServer: {
    // Start the Vite dev server with fixed port + base path for tests.
    command: `PORT=${TEST_PORT} BASE_PATH=/ pnpm --filter @workspace/ai-workflow-builder run dev`,
    url: BASE_URL,
    // If a server is already listening on this port, reuse it rather than erroring.
    reuseExistingServer: true,
    timeout: 60_000,
  },

  use: {
    baseURL: BASE_URL,
    screenshot: 'only-on-failure',
    navigationTimeout: 30_000,
    launchOptions: {
      // Replit pre-installs Chromium here; avoids a separate `playwright install`.
      executablePath: process.env.REPLIT_PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    },
  },

  projects: [
    // Root route-smoke tests (./e2e/)
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Chunk-load-error guard tests — spec lives inside the artifact but is
    // included here so it runs with every root `playwright test` invocation.
    {
      name: 'chromium-chunk-errors',
      testDir: './artifacts/ai-workflow-builder/e2e',
      testMatch: 'chunk-load-error.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
