import { attachSessionWorkbook } from './workflow-session-fixtures';
import { test, expect } from './workflow-audit-isolation';

test('Chat starts a real workflow and Build verifies exact paused evidence and source revisions', async ({
  page,
}) => {
  await page.route('**/api/chat/threads**', (route) => route.fulfill({ json: { threads: [] } }));
  await page.goto('/');
  const composer = page.getByRole('textbox', { name: 'Ask Scope, or describe a task…' });
  await expect(composer).toBeEditable();
  await composer.fill('Document Calculator');
  await composer.press('ArrowDown');
  await composer.press('Enter');
  let panel = page.getByRole('region', { name: 'Workflow execution' }).last();
  await expect(panel).toBeVisible();
  const read = () =>
    page.evaluate(async () => {
      const { readWorkflowLibrary } =
        await import('/src/features/workflows-hub/workflow-library.ts');
      const entry = Object.values(readWorkflowLibrary()).find((item) => item.sessions?.length)!;
      return { entry, session: entry.sessions!.at(-1)! };
    });
  await attachSessionWorkbook(page, panel, 'audit-original.xlsx', 200);
  await panel.getByRole('button', { name: 'Resume workflow', exact: true }).click();
  await expect(panel.getByRole('button', { name: 'Approve completed results' })).toBeEnabled();
  const original = await read();
  const calculated = Object.values(original.session.results).find(
    (r) => r.output.calculatedResults,
  )!;
  expect(calculated.output.calculatedResults).toEqual({ RESULT: 400 });
  expect(original.entry.runs).toHaveLength(0);
  await composer.fill('Explain this result before I approve it');
  await panel.getByRole('button', { name: 'Verify this run in Build', exact: true }).click();
  let inspector = page.getByRole('region', { name: 'Run verification in Build' });
  await expect(inspector).toContainText(original.session.id);
  await inspector.getByLabel('Verify block').selectOption(calculated.blockId);
  await expect(inspector.getByRole('article', { name: 'Block verification' })).toContainText('400');
  expect((await read()).session).toEqual(original.session);
  await inspector.getByRole('button', { name: 'Continue this run in Chat' }).click();
  panel = page.getByRole('region', { name: 'Workflow execution' }).last();
  await expect(panel).toContainText(original.session.id);
  await attachSessionWorkbook(page, panel, 'audit-replacement.xlsx', 50);
  await expect(panel.getByRole('list', { name: 'Execution steps' })).toContainText('outdated');
  await panel.getByRole('button', { name: 'Resume workflow', exact: true }).click();
  await expect(panel.getByRole('button', { name: 'Approve completed results' })).toBeEnabled();
  await panel.getByRole('button', { name: 'Verify this run in Build', exact: true }).click();
  inspector = page.getByRole('region', { name: 'Run verification in Build' });
  await inspector.getByLabel('Verify block').selectOption(calculated.blockId);
  await expect(inspector.getByRole('article', { name: 'Block verification' })).toContainText('100');
  const oldAttempt = original.session.attempts.findIndex((a) => a.blockId === calculated.blockId);
  await inspector.getByLabel('Evidence attempt').selectOption(String(oldAttempt));
  await expect(inspector.getByRole('article', { name: 'Block verification' })).toContainText('400');
  await inspector.getByRole('button', { name: 'Return to this run' }).click();
  await page.getByRole('button', { name: 'Build', exact: true }).click();
  await expect(inspector).toContainText(original.session.id);
  expect((await read()).entry.draft).toEqual(original.entry.draft);
  const link = `/w/${encodeURIComponent(original.entry.id)}?run=${encodeURIComponent(original.session.id)}`;
  await page.reload();
  await page.goto(link);
  await page.getByRole('button', { name: 'Build', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Run verification in Build' })).toContainText(
    original.session.id,
  );
});
