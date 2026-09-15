import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium, expect } from '@playwright/test';
import { createTestRun, webRoot, reserveLoopbackPort } from '../../scripts/testing/runtime.mjs';
import { syntheticContext, syntheticSession } from '../../scripts/testing/browser-fixtures.mjs';

// Exercise actual Rollup chunks: dev-server tests cannot detect production-only
// circular initialization or missing lazy assets. No provider calls or real data.
const run = createTestRun('production-ui');
const { preview } = await import(
  pathToFileURL(path.join(webRoot, 'node_modules/vite/dist/node/index.js')).href
);
const port = await reserveLoopbackPort();
const server = await preview({
  configFile: false,
  envFile: false,
  root: webRoot,
  build: { outDir: 'dist/public' },
  preview: { host: '127.0.0.1', port, strictPort: true, open: false },
});
let browser;
try {
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ serviceWorkers: 'block' });
  const failures = [];
  page.on('pageerror', (error) => failures.push(error.message));
  const baseURL = `http://127.0.0.1:${port}`;
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== baseURL) return route.abort();
    if (!url.pathname.startsWith('/api/')) return route.continue();
    const json =
      url.pathname === '/api/session'
        ? syntheticSession
        : url.pathname === '/api/workspaces'
          ? { workspaces: [syntheticContext.workspace] }
          : url.pathname === '/api/workflow-library'
            ? { payload: null, revision: 0 }
            : url.pathname === '/api/documents'
              ? { documents: [] }
              : url.pathname === '/api/integrations'
                ? []
                : url.pathname === '/api/chat/threads'
                  ? { threads: [] }
                  : undefined;
    return route.fulfill({
      status: json === undefined ? 503 : 200,
      json: json ?? { error: 'Provider disabled in production smoke test.' },
    });
  });
  await page.addInitScript(
    (value) => sessionStorage.setItem('taxflow:authenticated-workspace', JSON.stringify(value)),
    syntheticContext,
  );
  await page.goto(baseURL, { waitUntil: 'load' });
  await expect(page.getByRole('button', { name: 'New chat', exact: true }).first()).toBeVisible({
    timeout: 60_000,
  });
  for (const name of ['Sources', 'Connections']) {
    await page.getByRole('button', { name, exact: true }).first().click();
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible({ timeout: 30_000 });
  }
  await page.getByRole('button', { name: 'Workflows', exact: true }).first().click();
  await page.getByRole('button', { name: 'Run history', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Workflow run history' })).toBeVisible({
    timeout: 30_000,
  });
  await page.screenshot({ path: path.join(run.output, 'production-workspace.png') });
  expect(failures).toEqual([]);
  console.log(`Production Chat, Sources, Connections and run-history smoke passed: ${run.output}`);
} finally {
  await browser?.close();
  await new Promise((resolve, reject) =>
    server.httpServer.close((error) => (error ? reject(error) : resolve())),
  );
  await run.close();
}
