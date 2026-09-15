import { defineConfig } from '@playwright/test';
import { browserConfig } from './scripts/testing/playwright-config.mjs';
export default defineConfig({
  ...browserConfig(),
  testMatch: [
    'workflow-shared-execution.spec.ts',
    'isolated-block-test.spec.ts',
    'workflow-storage-recovery.spec.ts',
    'workflow-remediation.spec.ts',
    'workflow-builder-roundtrip.spec.ts',
    'panel-resize.spec.ts',
    'calculation-inputs.spec.ts',
    'workspace-dataflow.spec.ts',
    'document-to-result.spec.ts',
    'demo-readiness.spec.ts',
    'calculation-audit.spec.ts',
    'route-smoke.spec.ts',
    'source-library.spec.ts',
    'workflow-run-persistence.spec.ts',
  ],
  timeout: 90000,
});
