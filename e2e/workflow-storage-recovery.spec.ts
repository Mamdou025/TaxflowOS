import { test, expect } from '@playwright/test';
import { randomBytes } from 'node:crypto';

test('a workflow and its result recover in another browser; backups, offline retry, and conflict protection work', async ({ page, browser, request }, info) => {
  test.setTimeout(180000);
  let code = '';
  const secondContext = await browser.newContext({ baseURL: 'http://localhost:5173' });
  try {
    await page.goto('/w/pf-document-calculator');
    await page.getByRole('button', { name: 'Build', exact: true }).click();
    await page.getByText('Test data — upload document or enter examples', { exact: true }).click();
    await page.getByLabel('Upload test document').setInputFiles({ name: 'items.csv', mimeType: 'text/csv', buffer: Buffer.from('label,amount\nItem one,10\nItem two,20') });
    await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
    await page.getByRole('button', { name: 'Run', exact: true }).first().click();
    await page.getByLabel('Workflow name').fill('Recovery rehearsal');
    await page.getByRole('button', { name: 'Save changes and run', exact: true }).click();
    await expect(page.getByRole('region', { name: 'Final workflow results' })).toContainText('60');
    await expect(page.getByLabel('Workflow storage status')).toHaveText('Saved to server', { timeout: 30000 });
    await page.getByLabel('Workflow storage status').click();
    await page.getByRole('button', { name: 'Show recovery code', exact: true }).click();
    code = await page.getByLabel('Workspace recovery code', { exact: true }).inputValue();
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export workflow backup', exact: true }).click();
    const download = await downloadPromise;
    const backup = info.outputPath('workflow-backup.json'); await download.saveAs(backup);

    const second = await secondContext.newPage();
    await second.goto('/w/pf-document-calculator');
    await second.getByLabel('Workflow storage status').click();
    await second.getByLabel('Open workspace recovery code').fill(code);
    await second.getByRole('button', { name: 'Open saved workspace', exact: true }).click();
    await second.getByRole('button', { name: 'Recovery rehearsal', exact: true }).click();
    await second.getByRole('button', { name: 'Run', exact: true }).first().click();
    await expect(second.getByRole('region', { name: 'Final workflow results' })).toContainText('60');
    await expect(second.getByRole('button', { name: 'Run saved version 1', exact: true })).toBeVisible();
    await second.getByLabel('Import workflow backup').setInputFiles(backup);
    await expect(second.getByRole('button', { name: 'Recovery rehearsal — Imported', exact: true })).toBeVisible();
    await expect(second.getByLabel('Workflow storage status')).toHaveText('Saved to server', { timeout: 30000 });

    await second.route('**/api/workflow-library', async route => {
      if (route.request().method() === 'PUT') await route.fulfill({ status: 503, json: { error: 'Simulated offline save: local work retained.' } }); else await route.continue();
    });
    await second.getByLabel('Workflow name').fill('Offline edit'); await second.getByLabel('Workflow name').blur();
    await expect(second.getByLabel('Workflow storage status')).toContainText('Simulated offline save', { timeout: 15000 });
    await expect(second.getByRole('button', { name: 'Offline edit', exact: true })).toBeVisible();
    await second.unroute('**/api/workflow-library');
    await second.getByRole('button', { name: 'Retry server save', exact: true }).click();
    await expect(second.getByLabel('Workflow storage status')).toHaveText('Saved to server', { timeout: 30000 });

    const url = 'http://localhost:5050/api/workflow-library'; const headers = { 'x-workflow-workspace': code };
    const remote = await (await request.get(url, { headers })).json();
    await request.put(url, { headers, data: { revision: remote.revision, payload: remote.payload } });
    await second.getByLabel('Workflow name').fill('Conflicting local edit'); await second.getByLabel('Workflow name').blur();
    await expect(second.getByLabel('Workflow storage status')).toContainText('changed in another browser', { timeout: 15000 });
    const unchanged = await (await request.get(url, { headers })).json();
    expect(unchanged.payload).toBe(remote.payload);
  } finally {
    if (code) await request.delete('http://localhost:5050/api/workflow-library', { headers: { 'x-workflow-workspace': code } });
    await secondContext.close();
  }
});

test('server persistence roundtrips a one-megabyte payload above the default JSON body limit', async ({ request }) => {
  const headers = { 'x-workflow-workspace': randomBytes(32).toString('hex') };
  const url = 'http://localhost:5050/api/workflow-library';
  const payload = JSON.stringify({ records: 'x'.repeat(1024 * 1024) });
  try {
    const saved = await request.put(url, { headers, data: { revision: 0, payload } });
    expect(saved.status()).toBe(200);
    const loaded = await request.get(url, { headers });
    expect((await loaded.json()).payload).toBe(payload);
  } finally { await request.delete(url, { headers }); }
});
