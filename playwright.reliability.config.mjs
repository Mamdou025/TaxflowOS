import { defineConfig } from '@playwright/test';
import { browserConfig } from './scripts/testing/playwright-config.mjs';
export default defineConfig({
  ...browserConfig(),
  testMatch: [
    'workflow-session.spec.ts',
    'workflow-traceability.spec.ts',
    'workflow-reliability.spec.ts',
    'workflow-shared-execution.spec.ts',
    'workflow-run-persistence.spec.ts',
    'calculation-audit.spec.ts',
    'calculation-inputs.spec.ts',
    'source-library.spec.ts',
    'phase-7-navigation.spec.ts',
  ],
  timeout: 240000,
});
