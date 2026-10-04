import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { chromium, expect } from '@playwright/test';
import { createTestRun, webRoot, reserveLoopbackPort } from '../../scripts/testing/runtime.mjs';
import { syntheticContext, syntheticSession } from '../../scripts/testing/browser-fixtures.mjs';

// Exercise the built application with synthetic Excel files and isolated API writes.
const run = createTestRun('workflow-session-ui');
const { preview } = await import(
  pathToFileURL(path.join(webRoot, 'node_modules/vite/dist/node/index.js')).href
);
const XLSX = createRequire(path.join(webRoot, 'package.json'))('xlsx');
const port = await reserveLoopbackPort();
const baseURL = `http://127.0.0.1:${port}`;
const server = await preview({
  configFile: false,
  envFile: false,
  root: webRoot,
  build: { outDir: 'dist/public' },
  preview: { host: '127.0.0.1', port, strictPort: true, open: false },
});
let browser, page;
try {
  browser = await chromium.launch({ headless: true });
  page = await browser.newPage({ serviceWorkers: 'block' });
  page.setDefaultTimeout(30000);
  const failures = [];
  const chats = new Map();
  page.on('pageerror', (error) => failures.push(error.message));
  await page.route('**/*', (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin !== baseURL) return route.abort();
    if (!url.pathname.startsWith('/api/')) return route.continue();
    if (url.pathname.startsWith('/api/chat/threads')) {
      const id = url.pathname.split('/')[4];
      if (request.method() === 'POST' && id) {
        chats.set(id, request.postDataJSON());
        return route.fulfill({ json: { ok: true } });
      }
      return route.fulfill({
        json: id
          ? (chats.get(id) ?? { messages: [] })
          : {
              threads: [...chats.keys()].map((id) => ({
                id,
                title: 'Workflow conversation',
                updatedAt: new Date().toISOString(),
              })),
            },
      });
    }
    const json =
      url.pathname === '/api/session'
        ? syntheticSession
        : url.pathname === '/api/workspaces'
          ? { workspaces: [syntheticContext.workspace] }
          : url.pathname === '/api/workflow-library'
            ? request.method() === 'GET'
              ? { payload: null, revision: 0 }
              : { revision: (request.postDataJSON()?.revision ?? 0) + 1 }
            : url.pathname === '/api/chat/threads'
              ? { threads: [] }
              : undefined;
    return route.fulfill({
      status: json === undefined ? 503 : 200,
      json: json ?? { error: 'Live providers disabled for test.' },
    });
  });
  await page.addInitScript(
    (value) => sessionStorage.setItem('taxflow:authenticated-workspace', JSON.stringify(value)),
    syntheticContext,
  );
  // Import a test-only saved graph; the retired example is not in the public catalog.
  await page.goto(`${baseURL}/w/pf-fapi`);
  await page.getByLabel('Workflow storage status').click();
  await page
    .getByLabel('Import workflow backup')
    .setInputFiles(path.resolve('tests/fixtures/backups/document-calculation-v1.json'));
  const imported = page.getByRole('button', {
    name: 'Synthetic document calculation — Imported',
    exact: true,
  });
  await expect(imported).toBeVisible();
  await page.getByLabel('Workflow storage status').click();
  await imported.click();
  await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  await page.getByRole('button', { name: 'Start guided workflow' }).click();
  let panel = page.getByRole('region', { name: 'Workflow execution' });
  const identity = await panel.locator('header p').first().innerText();
  async function attach(name, amount) {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet([
        ['label', 'amount', 'currency'],
        ['Synthetic item', amount, 'CAD'],
      ]),
      'Records',
    );
    await panel.getByLabel('Upload run source').setInputFiles({
      name,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer: XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }),
    });
    const dialog = page.getByRole('dialog', { name: 'Choose spreadsheet data' });
    await dialog.getByRole('combobox', { name: 'Worksheet', exact: true }).selectOption('Records');
    await dialog.getByRole('button', { name: 'Use selected data' }).click();
    await expect(panel).toContainText(name);
  }
  async function calculate(expected) {
    await panel.getByRole('button', { name: 'Resume workflow', exact: true }).click();
    await expect(panel.getByRole('button', { name: 'Approve completed results' })).toBeEnabled({
      timeout: 30000,
    });
    const step = panel.getByRole('list', { name: 'Execution steps' }).locator(':scope > li').last();
    const chatToggle = step.locator('[data-step-toggle]');
    if (await chatToggle.count()) {
      if ((await chatToggle.getAttribute('aria-expanded')) !== 'true') await chatToggle.click();
    } else await step.locator('summary').first().click();
    await expect(step.getByText(String(expected), { exact: true }).last()).toBeVisible();
  }
  await attach('records.xlsx', 200);
  await calculate(400);
  await panel.getByRole('button', { name: 'Continue in Chat' }).click();
  panel = page.getByRole('region', { name: 'Workflow execution' }).last();
  await expect(panel.locator('header p').first()).toHaveText(identity);
  await page
    .getByRole('textbox', { name: 'Ask Scope, or describe a task…' })
    .fill('Explain the mapping before we continue');
  await panel
    .locator('[data-step-toggle][data-step-id="pf-document-calculator--document"]')
    .click();
  await expect(panel.getByRole('region', { name: 'Step 2: Document', exact: true })).toBeVisible();
  await panel.getByRole('combobox', { name: 'Source action' }).selectOption('add');
  await attach('additional.xlsx', 50);
  await expect(panel.getByRole('button', { name: 'Approve completed results' })).toBeDisabled();
  await expect(panel.getByRole('list', { name: 'Execution steps' })).toContainText('outdated');
  await calculate(500);
  await panel.getByRole('button', { name: 'Approve completed results' }).click();
  await expect(panel).toContainText('Completed — approved');
  const savedRunLink = await panel
    .getByRole('link', { name: 'Open this workflow in Run' })
    .getAttribute('href');
  await panel.getByRole('link', { name: 'Open this workflow in Run' }).click();
  await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  await page.reload();
  // Chat is home on startup. Reopen the exact saved run, rather than assuming an open workspace tab.
  await expect(
    page.getByRole('textbox', { name: 'Ask Scope, or describe a task…' }),
  ).toBeEditable();
  await page.goto(baseURL + savedRunLink);
  await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  panel = page.getByRole('region', { name: 'Workflow execution' }).first();
  await expect(panel.locator('header p').first()).toHaveText(identity);
  await expect(panel).toContainText('Completed — approved');
  await expect(panel).toContainText('additional.xlsx');
  const directLink = await panel
    .getByRole('link', { name: 'Open this workflow in Run' })
    .getAttribute('href');
  await page.goto(baseURL + directLink);
  panel = page.getByRole('region', { name: 'Workflow execution' }).first();
  await expect(panel.locator('header p').first()).toHaveText(identity);
  await expect(panel).toContainText('Completed — approved');
  await panel.getByRole('button', { name: 'Verify this run in Build', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Run verification in Build' })).toBeVisible();
  await expect(
    page.getByRole('region', { name: 'Run verification in Build' }).locator('header').first(),
  ).toContainText(identity);
  await expect(
    page.getByRole('region', { name: 'Run verification in Build' }).getByTestId('workflow-canvas'),
  ).toBeVisible();
  await expect(
    page.getByRole('article', { name: 'Block verification', exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel('Verify block', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Test block', exact: true })).toHaveCount(0);
  expect(failures).toEqual([]);
  console.log(
    `Built-app Excel, Run/Chat/Build, recomputation, approval and reload passed: ${run.output}`,
  );
} catch (error) {
  await page
    ?.screenshot({ path: path.join(run.output, 'failure.png'), timeout: 5000 })
    .catch(() => {});
  throw error;
} finally {
  await browser?.close();
  await new Promise((resolve, reject) =>
    server.httpServer.close((error) => (error ? reject(error) : resolve())),
  );
  await run.close();
}
