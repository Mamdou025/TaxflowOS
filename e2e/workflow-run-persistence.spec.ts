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
    await page.goto('/run/ownership-graph');
    await expect(page.getByRole('button', { name: 'Start guided workflow' })).toBeEnabled();
    await expect(page.getByRole('list', { name: 'Execution steps' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Approve completed results' })).toHaveCount(0);
  });
  test('a retired workflow route is unavailable and cannot create a new session', async ({
    page,
  }) => {
    await page.goto('/run/expense');
    await expect(
      page.getByRole('heading', { name: 'Requested workflow version unavailable', exact: true }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start guided workflow' })).toBeDisabled();
    await expect(page.getByRole('list', { name: 'Execution steps' })).toHaveCount(0);
    const sessions = await page.evaluate(async () => {
      const { readWorkflowLibrary } =
        await import('/src/features/workflows-hub/workflow-library.ts');
      return Object.values(readWorkflowLibrary()).flatMap((entry) => entry.sessions ?? []);
    });
    expect(sessions).toEqual([]);
  });
});
