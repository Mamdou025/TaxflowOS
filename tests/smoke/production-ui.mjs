import path from 'node:path';
import fs from 'node:fs';
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
  const timings = [];
  const scriptRequests = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'script') scriptRequests.push(request.url());
  });
  async function measure(name, action, ready) {
    const start = performance.now();
    const requestStart = scriptRequests.length;
    await action();
    await expect(ready).toBeVisible({ timeout: 60_000 });
    const milliseconds = Math.round(performance.now() - start);
    const scripts = scriptRequests.slice(requestStart).map((url) => new URL(url).pathname);
    timings.push({
      name,
      milliseconds,
      // File bytes are decoded JS size, not compressed network transfer.
      javascriptBytes: scripts.reduce(
        (total, script) => total + fs.statSync(path.join(webRoot, 'dist/public', script)).size,
        0,
      ),
      scripts,
    });
  }
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
  await measure(
    'chat-startup',
    () => page.goto(baseURL, { waitUntil: 'load' }),
    page.getByRole('button', { name: 'New chat', exact: true }).first(),
  );
  const draft = page.locator('.lc-console').getByRole('textbox');
  await draft.fill('Preserve this draft across deferred pages');
  await page.getByRole('button', { name: 'Chat agent: Sina' }).click();
  await measure(
    'agent-first-open',
    () => page.getByRole('menuitem', { name: 'Customize agent' }).click(),
    page.getByText('Operator instructions', { exact: true }),
  );
  await page.getByRole('button', { name: 'Overview', exact: true }).click();
  await expect(page.getByText('Identity — one unified agent', { exact: true })).toBeVisible();
  await measure(
    'workflows-first-open',
    () => page.getByRole('button', { name: 'Workflows', exact: true }).first().click(),
    page.getByText('Workflow library', { exact: true }).last(),
  );
  // A fast library must not preload the editor just because its tab exists.
  expect(
    scriptRequests.filter((url) =>
      /\/(inline-builder|saved-workflow-run|workflow-run-history)-/.test(new URL(url).pathname),
    ),
  ).toEqual([]);
  await page.getByRole('button', { name: 'Chat', exact: true }).click();
  await measure(
    'workflows-reopen',
    () => page.getByRole('button', { name: 'Workflows', exact: true }).first().click(),
    page.getByText('Workflow library', { exact: true }).last(),
  );
  await expect(draft).toHaveValue('Preserve this draft across deferred pages');
  for (const name of ['Sources', 'Connections']) {
    await page.getByRole('button', { name, exact: true }).first().click();
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible({ timeout: 30_000 });
  }
  await page.getByRole('button', { name: 'Workflows', exact: true }).first().click();
  await page.getByRole('button', { name: 'Run history', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Workflow run history' })).toBeVisible({
    timeout: 30_000,
  });
  await measure(
    'workflow-builder-first-open',
    () => page.getByRole('button', { name: 'New workflow', exact: true }).click(),
    page.locator('.react-flow'),
  );
  await page.getByRole('button', { name: 'Chat agent: Sina' }).click();
  await page.getByRole('menuitem', { name: 'Customize agent' }).click();
  await measure(
    'agent-lab-first-open',
    () => page.getByRole('button', { name: 'Lab', exact: true }).click(),
    page.getByText('Models — pick one per column', { exact: true }),
  );
  await page.getByRole('button', { name: 'Workflows', exact: true }).first().click();
  await page.getByRole('button', { name: 'Document Calculator', exact: true }).click();
  await page.getByRole('button', { name: 'Results', exact: true }).click();
  await expect(page.getByText('No results yet.', { exact: false })).toBeVisible();
  await expect(draft).toHaveValue('Preserve this draft across deferred pages');
  await page.screenshot({ path: path.join(run.output, 'production-workspace.png') });
  fs.writeFileSync(path.join(run.output, 'page-loading.json'), JSON.stringify(timings, null, 2));
  console.table(
    timings.map(({ name, milliseconds, scripts }) => ({
      name,
      milliseconds,
      scripts: scripts.length,
    })),
  );
  expect(failures).toEqual([]);
  console.log(`Production navigation, deferred editors and chat-draft smoke passed: ${run.output}`);
} finally {
  await browser?.close();
  await new Promise((resolve, reject) =>
    server.httpServer.close((error) => (error ? reject(error) : resolve())),
  );
  await run.close();
}
