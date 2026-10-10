import path from 'node:path';
import { defineConfig } from '@playwright/test';
import { browserConfig } from '../../scripts/testing/playwright-config.mjs';

// Local artifact verification, isolated by the standard repository browser runner.
export default defineConfig({
  ...browserConfig(),
  testDir: '.',
  testMatch: 'browser-verification.spec.ts',
  tsconfig: path.resolve('e2e/tsconfig.json'),
  timeout: 240000,
});
