import { defineConfig } from '@playwright/test';
export default defineConfig({
  tsconfig: './e2e/tsconfig.json', testDir: './e2e', testMatch: ['isolated-block-test.spec.ts'],
  outputDir: 'test-results/isolated-block', timeout: 120000, workers: 1,
  reporter: [['list'], ['json', { outputFile: 'docs/isolated-block-evidence/test-report.json' }]],
  use: { baseURL: 'http://localhost:5173', headless: true, screenshot: 'only-on-failure', viewport: { width: 1440, height: 1000 } },
});
