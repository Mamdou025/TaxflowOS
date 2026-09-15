import { defineConfig } from '@playwright/test';
import { browserConfig } from './scripts/testing/playwright-config.mjs';
export default defineConfig({
  ...browserConfig(),
  testMatch: [
    'workflow-storage-recovery.spec.ts',
    'workspace-access.spec.ts',
    'demo-access.spec.ts',
    'demo-resume.spec.ts',
  ],
  timeout: 180000,
});
