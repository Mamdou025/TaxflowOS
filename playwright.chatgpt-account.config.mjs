import { accessSync, constants } from 'node:fs';
import { defineConfig } from '@playwright/test';

// Fail before launching a browser if the production build is absent.
accessSync(
  new URL('./artifacts/ai-workflow-builder/dist/public/index.html', import.meta.url),
  constants.R_OK,
);
const port = Number(process.env.CHATGPT_ACCOUNT_TEST_PORT ?? 4198);
export default defineConfig({
  testDir: './e2e',
  testMatch: 'chatgpt-account-linking.spec.ts',
  tsconfig: './e2e/tsconfig.json',
  workers: 1,
  retries: 0,
  timeout: 240000,
  outputDir: './test-results/phase2/chatgpt-account-linking',
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    viewport: { width: 1280, height: 900 },
    headless: true,
    serviceWorkers: 'block',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node scripts/testing/chatgpt-account-server.mjs',
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    timeout: 15000,
  },
});
