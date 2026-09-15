import { test, expect as baseExpect } from '@playwright/test';
const expect = baseExpect.configure({ timeout: 20000 });

test('an existing demo resumes with one click after startup verification fails', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Try demo', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Demo session' })).toBeVisible();
  const first = await page.evaluate(() =>
    JSON.parse(sessionStorage.getItem('taxflow:authenticated-workspace')!),
  );
  await page.route('**/api/session', (route) => route.fulfill({ status: 503, json: {} }));
  await page.reload();
  await expect(page.getByRole('alert')).toContainText('app service is not ready');
  await page.unroute('**/api/session');
  await page.getByRole('button', { name: 'Try demo', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Demo session' })).toBeVisible();
  const resumed = await page.evaluate(() =>
    JSON.parse(sessionStorage.getItem('taxflow:authenticated-workspace')!),
  );
  expect(resumed.isDemo).toBe(true);
  expect(resumed.userId).toBe(first.userId);
  expect(resumed.workspace.id).toBe(first.workspace.id);
});
