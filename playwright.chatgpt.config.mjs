import { defineConfig } from '@playwright/test';

const port = Number(process.env.CHATGPT_VIEWER_TEST_PORT ?? 4199);
export default defineConfig({
  testDir: './e2e',
  testMatch: 'chatgpt-workflow-viewer.spec.ts',
  workers: 1,
  retries: 0,
  timeout: 45000,
  outputDir: './test-results/chatgpt-viewer',
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    viewport: { width: 1440, height: 1000 },
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    serviceWorkers: 'block',
  },
  webServer: {
    command: 'node scripts/testing/chatgpt-viewer-server.mjs',
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    timeout: 15000,
  },
});
