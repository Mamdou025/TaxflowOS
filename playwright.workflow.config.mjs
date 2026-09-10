import { defineConfig } from "@playwright/test";
export default defineConfig({
  tsconfig: "./e2e/tsconfig.json",
  testDir: "./e2e",
  testMatch: ["workflow-storage-recovery.spec.ts", "workflow-remediation.spec.ts", "workflow-builder-roundtrip.spec.ts", "panel-resize.spec.ts", "calculation-inputs.spec.ts", "workspace-dataflow.spec.ts", "document-to-result.spec.ts", "demo-readiness.spec.ts", "calculation-audit.spec.ts", "route-smoke.spec.ts", "workflow-run-persistence.spec.ts"],
  reporter: [['list'], ['json', { outputFile: 'test-results/demo-audit-report.json' }]],
  timeout: 90000,
  workers: 1,
  use: {
    baseURL: "http://localhost:5173",
    headless: true,
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "pnpm --filter @workspace/ai-workflow-builder dev",
    env: { PORT: "5173", BASE_PATH: "/" },
    url: "http://localhost:5173",
    reuseExistingServer: true,
    timeout: 90000,
  },
});
