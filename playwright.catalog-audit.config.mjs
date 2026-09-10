import { defineConfig } from '@playwright/test';
export default defineConfig({
  tsconfig: './e2e/tsconfig.json', testDir: './e2e', testMatch: ['workflow-catalog-audit.spec.ts', 'workflow-catalog-deep-checks.spec.ts', 'workflow-catalog-release-gates.spec.ts'],
  outputDir: 'test-results/catalog-execution', timeout: 120000, workers: 1,
  reporter: [['list'], ['json', { outputFile: 'docs/workflow-catalog-evidence/test-report.json' }]],
  use: { baseURL: 'http://localhost:5173', headless: true, screenshot: 'only-on-failure', viewport: { width: 1440, height: 1000 } },
});
