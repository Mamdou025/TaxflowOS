import { defineConfig } from '@playwright/test';
export default defineConfig({
  tsconfig: './e2e/tsconfig.json', testDir: './e2e', testMatch: ['production-demo.spec.ts'],
  timeout: 120000, workers: 1,
  reporter: [['list'], ['json', { outputFile: 'test-results/production-audit-report.json' }]],
  use: { baseURL: 'http://127.0.0.1:4173', headless: true, screenshot: 'only-on-failure', viewport: { width: 1440, height: 900 } },
  webServer: { command: 'python e2e/serve-production.py', url: 'http://127.0.0.1:4173', reuseExistingServer: true, timeout: 15000 },
});
