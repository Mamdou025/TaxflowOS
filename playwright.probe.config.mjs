import { defineConfig } from '@playwright/test';
import { browserConfig } from './scripts/testing/playwright-config.mjs';
export default defineConfig({
  ...browserConfig(),
  testDir: './tests/probes',
  testMatch: 'browser-failure.spec.ts',
});
