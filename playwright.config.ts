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
const API_PORT = 8080;
// Use 127.0.0.1 (IPv4) throughout — the Replit validation environment does not
// support IPv6, so `localhost` resolving to ::1 causes EAFNOSUPPORT errors.
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;
const API_URL = `http://127.0.0.1:${API_PORT}`;

// Ensure api-smoke tests pick up the IPv4 address even when run in a worker
// process that inherits this environment.
process.env.API_BASE = process.env.API_BASE ?? API_URL;

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  retries: 1,
  workers: 1,
  reporter: 'list',

  webServer: [
    {
      // Start the Vite dev server with fixed port + base path for tests.
      command: `PORT=${TEST_PORT} BASE_PATH=/ pnpm --filter @workspace/ai-workflow-builder run dev`,
      url: BASE_URL,
      // If a server is already listening on this port, reuse it rather than erroring.
      reuseExistingServer: true,
      timeout: 60_000,
    },
    {
      // Start (or reuse) the Express API server so the api-smoke tests have a
      // target.  reuseExistingServer lets the Replit workflow keep it running
      // between runs without a conflict.
      command: `PORT=${API_PORT} pnpm --filter @workspace/api-server run dev`,
      url: `${API_URL}/api/healthz`,
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],

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
    // API smoke tests — no browser required; uses Playwright's request fixture
    // to hit the Express API directly.  Included here so API regressions are
    // caught on every deploy alongside the route-smoke tests.
    {
      name: 'chromium-api',
      testDir: './artifacts/ai-workflow-builder/e2e',
      testMatch: 'api-smoke.spec.ts',
      use: {},
    },
  ],
});
