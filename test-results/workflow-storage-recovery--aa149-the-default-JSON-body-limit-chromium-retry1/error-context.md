# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workflow-storage-recovery.spec.ts >> server persistence roundtrips a one-megabyte payload above the default JSON body limit
- Location: e2e/workflow-storage-recovery.spec.ts:63:5

# Error details

```
Error: apiRequestContext.delete: connect EAFNOSUPPORT ::1:5050 - Local (undefined:undefined)
Call log:
  - → DELETE http://localhost:5050/api/workflow-library
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.34 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - x-workflow-workspace: 675761af0a01e608ea2f3cf4ef516ae2a95dd1f17779ba129671e9264a52dab2

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { randomBytes } from 'node:crypto';
  3  | 
  4  | test('a workflow and its result recover in another browser; backups, offline retry, and conflict protection work', async ({ page, browser, request }, info) => {
  5  |   test.setTimeout(180000);
  6  |   let code = '';
  7  |   const secondContext = await browser.newContext({ baseURL: 'http://localhost:5173' });
  8  |   try {
  9  |     await page.goto('/w/pf-document-calculator');
  10 |     await page.getByRole('button', { name: 'Build', exact: true }).click();
  11 |     await page.getByText('Test data — upload document or enter examples', { exact: true }).click();
  12 |     await page.getByLabel('Upload test document').setInputFiles({ name: 'items.csv', mimeType: 'text/csv', buffer: Buffer.from('label,amount\nItem one,10\nItem two,20') });
  13 |     await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
  14 |     await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  15 |     await page.getByLabel('Workflow name').fill('Recovery rehearsal');
  16 |     await page.getByRole('button', { name: 'Save changes and run', exact: true }).click();
  17 |     await expect(page.getByRole('region', { name: 'Final workflow results' })).toContainText('60');
  18 |     await expect(page.getByLabel('Workflow storage status')).toHaveText('Saved to server', { timeout: 30000 });
  19 |     await page.getByLabel('Workflow storage status').click();
  20 |     await page.getByRole('button', { name: 'Show recovery code', exact: true }).click();
  21 |     code = await page.getByLabel('Workspace recovery code', { exact: true }).inputValue();
  22 |     const downloadPromise = page.waitForEvent('download');
  23 |     await page.getByRole('button', { name: 'Export workflow backup', exact: true }).click();
  24 |     const download = await downloadPromise;
  25 |     const backup = info.outputPath('workflow-backup.json'); await download.saveAs(backup);
  26 | 
  27 |     const second = await secondContext.newPage();
  28 |     await second.goto('/w/pf-document-calculator');
  29 |     await second.getByLabel('Workflow storage status').click();
  30 |     await second.getByLabel('Open workspace recovery code').fill(code);
  31 |     await second.getByRole('button', { name: 'Open saved workspace', exact: true }).click();
  32 |     await second.getByRole('button', { name: 'Recovery rehearsal', exact: true }).click();
  33 |     await second.getByRole('button', { name: 'Run', exact: true }).first().click();
  34 |     await expect(second.getByRole('region', { name: 'Final workflow results' })).toContainText('60');
  35 |     await expect(second.getByRole('button', { name: 'Run saved version 1', exact: true })).toBeVisible();
  36 |     await second.getByLabel('Import workflow backup').setInputFiles(backup);
  37 |     await expect(second.getByRole('button', { name: 'Recovery rehearsal — Imported', exact: true })).toBeVisible();
  38 |     await expect(second.getByLabel('Workflow storage status')).toHaveText('Saved to server', { timeout: 30000 });
  39 | 
  40 |     await second.route('**/api/workflow-library', async route => {
  41 |       if (route.request().method() === 'PUT') await route.fulfill({ status: 503, json: { error: 'Simulated offline save: local work retained.' } }); else await route.continue();
  42 |     });
  43 |     await second.getByLabel('Workflow name').fill('Offline edit'); await second.getByLabel('Workflow name').blur();
  44 |     await expect(second.getByLabel('Workflow storage status')).toContainText('Simulated offline save', { timeout: 15000 });
  45 |     await expect(second.getByRole('button', { name: 'Offline edit', exact: true })).toBeVisible();
  46 |     await second.unroute('**/api/workflow-library');
  47 |     await second.getByRole('button', { name: 'Retry server save', exact: true }).click();
  48 |     await expect(second.getByLabel('Workflow storage status')).toHaveText('Saved to server', { timeout: 30000 });
  49 | 
  50 |     const url = 'http://localhost:5050/api/workflow-library'; const headers = { 'x-workflow-workspace': code };
  51 |     const remote = await (await request.get(url, { headers })).json();
  52 |     await request.put(url, { headers, data: { revision: remote.revision, payload: remote.payload } });
  53 |     await second.getByLabel('Workflow name').fill('Conflicting local edit'); await second.getByLabel('Workflow name').blur();
  54 |     await expect(second.getByLabel('Workflow storage status')).toContainText('changed in another browser', { timeout: 15000 });
  55 |     const unchanged = await (await request.get(url, { headers })).json();
  56 |     expect(unchanged.payload).toBe(remote.payload);
  57 |   } finally {
  58 |     if (code) await request.delete('http://localhost:5050/api/workflow-library', { headers: { 'x-workflow-workspace': code } });
  59 |     await secondContext.close();
  60 |   }
  61 | });
  62 | 
  63 | test('server persistence roundtrips a one-megabyte payload above the default JSON body limit', async ({ request }) => {
  64 |   const headers = { 'x-workflow-workspace': randomBytes(32).toString('hex') };
  65 |   const url = 'http://localhost:5050/api/workflow-library';
  66 |   const payload = JSON.stringify({ records: 'x'.repeat(1024 * 1024) });
  67 |   try {
  68 |     const saved = await request.put(url, { headers, data: { revision: 0, payload } });
  69 |     expect(saved.status()).toBe(200);
  70 |     const loaded = await request.get(url, { headers });
  71 |     expect((await loaded.json()).payload).toBe(payload);
> 72 |   } finally { await request.delete(url, { headers }); }
     |                                   ^ Error: apiRequestContext.delete: connect EAFNOSUPPORT ::1:5050 - Local (undefined:undefined)
  73 | });
  74 | 
```