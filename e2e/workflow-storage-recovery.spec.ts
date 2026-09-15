import { test, expect } from './authenticated-fixture';
import { readFileSync } from 'node:fs';

test('a workflow and its result recover in another browser; backups, offline retry, and conflict protection work', async ({
  page,
  browser,
  request,
  baseURL,
  workspaceSession,
}, info) => {
  test.setTimeout(180000);
  const code = workspaceSession.workspace.id;
  const secondContext = await browser.newContext({ baseURL });
  const signedIn = await secondContext.request.post('/api/auth/sign-in/email', {
    headers: { Origin: baseURL! },
    data: { email: workspaceSession.email, password: workspaceSession.password },
  });
  expect(signedIn.status(), await signedIn.text()).toBe(200);
  await secondContext.addInitScript(
    (value) => sessionStorage.setItem('taxflow:authenticated-workspace', JSON.stringify(value)),
    { userId: workspaceSession.userId, workspace: workspaceSession.workspace },
  );
  try {
    await page.goto('/w/pf-document-calculator');
    await page.getByRole('button', { name: 'Build', exact: true }).click();
    await page.getByText('Test data — upload document or enter examples', { exact: true }).click();
    await page
      .getByLabel('Upload test document')
      .setInputFiles({
        name: 'items.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from('label,amount\nItem one,10\nItem two,20'),
      });
    await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
    await page.getByRole('button', { name: 'Run', exact: true }).first().click();
    await page.getByLabel('Workflow name').fill('Recovery rehearsal');
    await page.getByRole('button', { name: 'Save changes and preview', exact: true }).click();
    await expect(page.getByRole('region', { name: 'Final workflow results' })).toContainText('60');
    await expect(page.getByLabel('Workflow storage status')).toHaveText('Saved to server', {
      timeout: 30000,
    });
    await page.getByLabel('Workflow storage status').click();
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export workflow backup', exact: true }).click();
    const download = await downloadPromise;
    const backup = info.outputPath('workflow-backup.json');
    await download.saveAs(backup);

    const second = await secondContext.newPage();
    await second.goto('/w/pf-document-calculator');
    await second.getByRole('button', { name: 'Recovery rehearsal', exact: true }).click();
    await second.getByRole('button', { name: 'Run', exact: true }).first().click();
    await expect(second.getByRole('region', { name: 'Final workflow results' })).toContainText(
      '60',
    );
    await expect(
      second.getByRole('button', { name: 'Preview saved version 1 in this browser', exact: true }),
    ).toBeVisible();
    await second.getByLabel('Workflow storage status').click();
    await second.getByLabel('Import workflow backup').setInputFiles(backup);
    await expect(
      second.getByRole('button', { name: 'Recovery rehearsal — Imported', exact: true }),
    ).toBeVisible();
    await expect(second.getByLabel('Workflow storage status')).toHaveText('Saved to server', {
      timeout: 30000,
    });

    await second.route('**/api/workflow-library', async (route) => {
      if (route.request().method() === 'PUT')
        await route.fulfill({
          status: 503,
          json: { error: 'Simulated offline save: local work retained.' },
        });
      else await route.continue();
    });
    await second.getByLabel('Workflow name').fill('Offline edit');
    await second.getByLabel('Workflow name').blur();
    await expect(second.getByLabel('Workflow storage status')).toContainText(
      'Simulated offline save',
      { timeout: 15000 },
    );
    await expect(second.getByRole('button', { name: 'Offline edit', exact: true })).toBeVisible();
    await second.unroute('**/api/workflow-library');
    await second.getByRole('button', { name: 'Retry server save', exact: true }).click();
    await expect(second.getByLabel('Workflow storage status')).toHaveText('Saved to server', {
      timeout: 30000,
    });

    const url = '/api/workflow-library';
    const headers = { 'x-taxflow-workspace': code };
    const remote = await (await request.get(url, { headers })).json();
    await request.put(url, {
      headers,
      data: { revision: remote.revision, payload: remote.payload },
    });
    await second.getByLabel('Workflow name').fill('Conflicting local edit');
    await second.getByLabel('Workflow name').blur();
    await expect(second.getByLabel('Workflow storage status')).toContainText(
      'changed in another browser',
      { timeout: 15000 },
    );
    const unchanged = await (await request.get(url, { headers })).json();
    expect(unchanged.payload).toBe(remote.payload);
  } finally {
    if (code)
      await request.delete('/api/workflow-library', { headers: { 'x-taxflow-workspace': code } });
    await secondContext.close();
  }
});

test('server persistence roundtrips a one-megabyte payload above the default JSON body limit', async ({
  request,
  workspaceSession,
}) => {
  const headers = { 'x-taxflow-workspace': workspaceSession.workspace.id };
  const url = '/api/workflow-library';
  const fixture = JSON.parse(readFileSync('tests/fixtures/backups/legacy-v0.json', 'utf8'));
  fixture['custom:synthetic-recovery'].draft.description = 'x'.repeat(1024 * 1024);
  const payload = JSON.stringify(fixture);
  try {
    const saved = await request.put(url, { headers, data: { revision: 0, payload } });
    expect(saved.status()).toBe(200);
    const loaded = await request.get(url, { headers });
    expect((await loaded.json()).payload).toBe(payload);
  } finally {
    await request.delete(url, { headers });
  }
});
