// @ts-nocheck — transpiled by Playwright's own loader (mirrors playwright.config.ts).
//
// Minimal config for the deterministic run-persistence regression check. It targets
// the ALREADY-RUNNING app (docker compose up on :5173) and starts no servers of its
// own — so it needs no API on the host and no AI-gateway credit.
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: 'workflow-run-persistence.spec.ts',
  timeout: 60_000,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    navigationTimeout: 30_000,
    ...devices['Desktop Chrome'],
  },
});
