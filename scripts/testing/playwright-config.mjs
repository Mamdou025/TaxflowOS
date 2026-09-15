import path from 'node:path';
import { root, assertRunPath } from './runtime.mjs';

export function browserConfig() {
  const id = process.env.TAXFLOW_TEST_RUN_ID;
  const baseURL = process.env.TAXFLOW_TEST_BASE_URL;
  if (
    !/^[a-f0-9]{8}-[a-f0-9-]{36}$/.test(id ?? '') ||
    !/^http:\/\/127\.0\.0\.1:\d+$/.test(baseURL ?? '')
  ) {
    throw new Error(
      'Use the package test commands; they start an isolated server before Playwright.',
    );
  }
  const output = assertRunPath(
    path.join(root, 'test-results/phase2'),
    path.join(root, 'test-results/phase2', id),
  );
  return {
    testDir: './e2e',
    tsconfig: './e2e/tsconfig.json',
    workers: 1,
    retries: 0,
    reporter: [
      ['list'],
      ['json', { outputFile: path.join(output, 'report.json') }],
      ['html', { outputFolder: path.join(output, 'html'), open: 'never' }],
    ],
    outputDir: path.join(output, 'artifacts'),
    use: {
      baseURL,
      headless: true,
      trace: 'retain-on-failure',
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      serviceWorkers: 'block',
    },
  };
}
