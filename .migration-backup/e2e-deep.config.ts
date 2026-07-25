import { defineConfig, devices } from "@playwright/test";

// Isolated config for the deep chat smoke — points at the already-running dev server
// (no webServer of its own). Run: npx playwright test --config=e2e-deep.config.ts
export default defineConfig({
  testDir: "./e2e",
  testMatch: /deep-chat\.spec\.ts/,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  timeout: 180_000,
  use: {
    baseURL: process.env.DEEP_BASE_URL ?? "http://localhost:3002",
    trace: "off",
    screenshot: "only-on-failure",
    navigationTimeout: 90_000,
    actionTimeout: 30_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
