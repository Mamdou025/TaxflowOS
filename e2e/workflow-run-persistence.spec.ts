import { attachSessionWorkbook } from './workflow-session-fixtures';
import { test, expect } from './workflow-audit-isolation';

test.describe('Guided run-state persistence', () => {
  test('a started run retains its source and exact identity after navigating away and reloading', async ({
    page,
  }) => {
    await page.goto('/run/fapi');
    await page.getByRole('button', { name: 'Start guided workflow' }).click();
    const panel = page.getByRole('region', { name: 'Workflow execution' });
    await attachSessionWorkbook(page, panel, 'trial.xlsx', 120);
    await expect(panel).toContainText('trial.xlsx');
    const identity = await panel.locator('header').innerText();
    await page.goto('/documents');
    await page.goto('/run/fapi');
    await expect(panel).toContainText('trial.xlsx');
    expect(await panel.locator('header').innerText()).toBe(identity);
    await page.reload();
    await expect(panel).toContainText('trial.xlsx');
    expect(await panel.locator('header').innerText()).toBe(identity);
  });
  test('an unstarted workflow does not inherit another workflow source or approvals', async ({
    page,
  }) => {
    await page.goto('/run/fapi');
    await expect(page.getByRole('button', { name: 'Start guided workflow' })).toBeVisible();
    await page.getByRole('button', { name: 'Start guided workflow' }).click();
    await expect(page.getByRole('button', { name: 'Approve completed results' })).toBeDisabled();
    await expect(page.getByRole('list', { name: 'Execution steps' })).toContainText('pending');
    await page.goto('/run/expense');
    await expect(page.getByRole('button', { name: 'Start guided workflow' })).toBeVisible();
  });
});
