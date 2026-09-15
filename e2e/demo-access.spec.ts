import { test, expect as baseExpect } from '@playwright/test';
const expect = baseExpect.configure({ timeout: 20000 });

test('an unavailable startup access check keeps demo visible and recovers without a reload', async ({
  page,
}) => {
  await page.route('**/api/session', (route) => route.fulfill({ status: 503, json: {} }));
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('app service is not ready');
  await expect(page.getByRole('button', { name: 'Try demo', exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Demo session' })).toHaveCount(0);
  await page.unroute('**/api/session');
  // The normal focus refresh must clear the old error when the API returns 401.
  // Previously state became signed-out but the error screen stayed mounted.
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(page.getByRole('alert')).toHaveCount(0);
  await page.getByRole('button', { name: 'Try demo', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Demo session' })).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
});

test('Try demo can recover directly from a failed startup check without credential entry', async ({
  page,
}) => {
  await page.route('**/api/session', (route) => route.fulfill({ status: 503, json: {} }));
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Retry access check', exact: true })).toBeVisible();
  await page.unroute('**/api/session');
  await page.getByRole('button', { name: 'Try demo', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Demo session' })).toBeVisible();
  const session = await (await page.request.get('/api/session')).json();
  expect(session.user.isDemo).toBe(true);
});

test('Try demo opens Chat without credentials, saves a real run and exits cleanly', async ({
  page,
}, info) => {
  test.setTimeout(300000);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Sign in to TaxflowOS' })).toBeVisible();
  await page.screenshot({ path: info.outputPath('demo-entry.png'), fullPage: true });
  await page.route('**/api/auth/sign-in/anonymous', (route) =>
    route.fulfill({ status: 503, json: {} }),
  );
  await page.getByRole('button', { name: 'Try demo', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('The demo could not start');
  await page.unroute('**/api/auth/sign-in/anonymous');
  await page.getByRole('button', { name: 'Try demo', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Demo session' })).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
  const first = await page.evaluate(() =>
    JSON.parse(sessionStorage.getItem('taxflow:authenticated-workspace')!),
  );
  expect(first.isDemo).toBe(true);
  await page.goto('/w/pf-document-calculator');
  await page.getByRole('button', { name: 'Build', exact: true }).click();
  await page.getByText('Test data — upload document or enter examples', { exact: true }).click();
  await page.getByLabel('Upload test document').setInputFiles({
    name: 'demo.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('label,amount\nItem one,10\nItem two,20'),
  });
  await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
  await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  await page.getByLabel('Workflow name').fill('My password-free run');
  await page.getByRole('button', { name: 'Save changes and preview', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Final workflow results' })).toContainText('60');
  await expect(page.getByLabel('Workflow storage status')).toHaveText('Saved to server', {
    timeout: 30000,
  });
  // Reopening a tab has no selected-workspace cache; the guest cookie must still
  // recover the same workspace automatically, without another demo signup.
  await page.evaluate(() => sessionStorage.removeItem('taxflow:authenticated-workspace'));
  await page.reload();
  await expect(page.getByRole('region', { name: 'Demo session' })).toBeVisible();
  expect(
    await page.evaluate(
      () => JSON.parse(sessionStorage.getItem('taxflow:authenticated-workspace')!).workspace.id,
    ),
  ).toBe(first.workspace.id);
  await page.goto('/w/pf-document-calculator');
  await page.getByRole('button', { name: 'My password-free run', exact: true }).click();
  await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  await expect(page.getByRole('region', { name: 'Final workflow results' })).toContainText('60');
  await page.getByLabel('Workflow storage status').click();
  await expect(page.getByRole('button', { name: 'Claim legacy library' })).toHaveCount(0);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export workflow backup', exact: true }).click();
  await (await download).saveAs(info.outputPath('demo-backup.json'));
  await page.goto('/');
  await expect(page.getByRole('region', { name: 'Demo session' })).toContainText(
    'Private to this browser',
  );
  await page.screenshot({ path: info.outputPath('demo-workspace.png'), fullPage: true });
  await page.getByRole('button', { name: 'Exit demo', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Sign in to TaxflowOS' })).toBeVisible();
  await page.getByRole('button', { name: 'Try demo', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Demo session' })).toBeVisible();
  const next = await page.evaluate(() =>
    JSON.parse(sessionStorage.getItem('taxflow:authenticated-workspace')!),
  );
  expect(next.userId).not.toBe(first.userId);
  expect(next.workspace.id).not.toBe(first.workspace.id);
  await page.goto('/w/pf-document-calculator');
  await expect(page.getByRole('button', { name: 'My password-free run', exact: true })).toHaveCount(
    0,
  );
  expect(
    (
      await page.request.get('/api/workflow-library', {
        headers: { 'x-taxflow-workspace': first.workspace.id },
      })
    ).status(),
  ).toBe(403);
});
