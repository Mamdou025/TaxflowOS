import path from 'node:path';
import { chromium } from '@playwright/test';
import { syntheticContext, syntheticSession } from './browser-fixtures.mjs';

// Cold dependency optimization is setup, separate from each regression's clock.
// This temporary browser context is discarded before any test starts.
const output = process.env.TAXFLOW_TEST_OUTPUT_DIR;
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ serviceWorkers: 'block' });
// Warmup only prepares dependencies. Functional persistence/auth tests use real sessions.
await context.addInitScript(
  (value) => sessionStorage.setItem('taxflow:authenticated-workspace', JSON.stringify(value)),
  syntheticContext,
);
await context.route('**/api/session', (route) => route.fulfill({ json: syntheticSession }));
await context.route('**/api/workspaces', (route) =>
  route.fulfill({ json: { workspaces: [syntheticContext.workspace] } }),
);
await context.route('**/api/workflow-library', (route) =>
  route.fulfill({ json: { payload: null, revision: 0 } }),
);
await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
const page = await context.newPage();
try {
  await page.goto(process.env.TAXFLOW_TEST_BASE_URL, { timeout: 300000, waitUntil: 'load' });
  await page
    .getByRole('button', { name: 'New chat', exact: true })
    .first()
    .waitFor({ timeout: 60000 });
  await context.tracing.stop();
} catch (error) {
  await page
    .screenshot({ path: path.join(output, 'warmup-failure.png'), timeout: 5000 })
    .catch(() => {});
  await context.tracing.stop({ path: path.join(output, 'warmup-trace.zip') });
  throw error;
} finally {
  await context.close();
  await browser.close();
}
