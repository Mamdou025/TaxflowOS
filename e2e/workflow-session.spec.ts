import { attachSessionWorkbook } from './workflow-session-fixtures';
import { test, expect } from './workflow-audit-isolation';

test('guided run shares exact progress with Chat and preserves source revisions on reload', async ({
  page,
}) => {
  await page.route('**/api/chat/threads**', (route) => route.fulfill({ json: { threads: [] } }));
  await page.goto('/w/pf-document-calculator');
  await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  await page.getByRole('button', { name: 'Start guided workflow', exact: true }).click();
  let panel = page.getByRole('region', { name: 'Workflow execution' });
  // section uses its accessible name and is the same component in both surfaces.
  const read = () =>
    page.evaluate(async () => {
      const { readWorkflowLibrary } =
        await import('/src/features/workflows-hub/workflow-library.ts');
      const entry = Object.values(readWorkflowLibrary()).find((item) => item.sessions?.length)!;
      return { id: entry.id, version: entry.versions[0], run: entry.sessions!.at(-1)! };
    });
  const original = await read();
  await attachSessionWorkbook(page, panel, 'records.xlsx', 200);
  await expect.poll(async () => (await read()).run.sources.length).toBe(1);
  await panel.getByRole('button', { name: 'Resume workflow', exact: true }).click();
  await expect(panel.getByRole('button', { name: 'Approve completed results' })).toBeEnabled();
  expect(
    Object.values((await read()).run.results).find((result) => result.output.calculatedResults)
      ?.output.calculatedResults,
  ).toEqual({ RESULT: 400 });
  const runSteps = await panel.getByRole('list', { name: 'Execution steps' }).innerText();
  await panel.getByRole('button', { name: 'Continue in Chat' }).click();
  await expect(page.getByRole('button', { name: 'Chat', exact: true })).toBeVisible();
  // The workspace retains its Run view behind the expanded Chat surface.
  panel = page.getByRole('region', { name: 'Workflow execution' }).last();
  await expect(panel).toBeVisible();
  expect(await panel.getByRole('list', { name: 'Execution steps' }).innerText()).toEqual(runSteps);
  await expect(
    page.getByRole('textbox', { name: 'Ask Scope, or describe a task…' }),
  ).toBeEditable();
  expect((await read()).run.id).toBe(original.run.id);
  await panel.getByRole('combobox', { name: 'Source action' }).selectOption('add');
  await attachSessionWorkbook(page, panel, 'additional.xlsx', 50);
  await expect.poll(async () => (await read()).run.sources.length).toBe(2);
  await expect(panel.getByRole('button', { name: 'Approve completed results' })).toBeDisabled();
  await expect(panel.getByRole('list', { name: 'Execution steps' })).toContainText('outdated');
  await panel.getByRole('button', { name: 'Resume workflow', exact: true }).click();
  await expect.poll(async () => (await read()).run.paused, { timeout: 30000 }).toBe(true);
  await expect(panel.getByRole('button', { name: 'Approve completed results' })).toBeEnabled();
  expect(
    Object.values((await read()).run.results).find((result) => result.output.calculatedResults)
      ?.output.calculatedResults,
  ).toEqual({ RESULT: 500 });
  await panel.getByRole('button', { name: 'Approve completed results' }).click();
  await expect(panel).toContainText('Completed — approved');
  const savedRunLink = await panel
    .getByRole('link', { name: 'Open this workflow in Run' })
    .getAttribute('href');
  await panel.getByRole('link', { name: 'Open this workflow in Run' }).click();
  await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  await page.reload();
  await expect(
    page.getByRole('textbox', { name: 'Ask Scope, or describe a task…' }),
  ).toBeEditable();
  await page.goto(savedRunLink!);
  await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  await expect(page.getByRole('region', { name: 'Workflow execution' }).first()).toContainText(
    'Completed — approved',
  );
  const restored = await read();
  expect(restored.run.id).toBe(original.run.id);
  expect(restored.version).toEqual(original.version);
  expect(restored.run.sources).toHaveLength(2);
  expect(restored.run.attempts.length).toBeGreaterThan(original.run.attempts.length);
});
