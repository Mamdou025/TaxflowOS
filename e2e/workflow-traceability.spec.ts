import { attachSessionWorkbook } from './workflow-session-fixtures';
import { test, expect } from './workflow-audit-isolation';
import { openDocumentCalculationFixture } from './retired-workflow-fixtures';

test('Chat starts a catalog workflow and Build verifies exact imported evidence and source revisions', async ({
  page,
}) => {
  await page.route('**/api/chat/threads**', (route) => route.fulfill({ json: { threads: [] } }));
  await page.goto('/');
  const composer = page.getByRole('textbox', { name: 'Ask Scope, or describe a task…' });
  await composer.waitFor();
  await expect(composer).toBeEditable();
  await composer.fill('Calculate FAPI');
  await composer.press('ArrowDown');
  await composer.press('Enter');
  const chatPanel = page
    .getByRole('region', { name: 'Workflow in chat', exact: true })
    .getByRole('region', { name: 'Workflow execution', exact: true });
  let panel = chatPanel;
  await expect(panel).toBeVisible();
  await expect(panel).toContainText('Trial Balance');
  // Keep the independently specified arithmetic fixture for the evidence checks;
  // importing a saved graph does not make its retired template a catalog option.
  await openDocumentCalculationFixture(page);
  await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  await page.getByRole('button', { name: 'Start guided workflow', exact: true }).click();
  panel = page.getByRole('region', { name: 'Workflow execution' }).last();
  await panel.getByRole('button', { name: 'Continue in Chat' }).click();
  panel = chatPanel;
  await expect(panel).toBeVisible();
  const read = () =>
    page.evaluate(async () => {
      const { readWorkflowLibrary } =
        await import('/src/features/workflows-hub/workflow-library.ts');
      const entry = Object.values(readWorkflowLibrary()).find(
        (item) => item.templateId === 'pf-document-calculator' && item.sessions?.length,
      )!;
      return { entry, session: entry.sessions!.at(-1)! };
    });
  const documentStep = chatPanel.locator('[data-step-id="pf-document-calculator--document"]');
  if ((await documentStep.getAttribute('aria-expanded')) !== 'true') await documentStep.click();
  await attachSessionWorkbook(page, panel, 'audit-original.xlsx', 200);
  await panel.getByRole('button', { name: 'Resume workflow', exact: true }).click();
  await expect(panel.getByRole('button', { name: 'Approve completed results' })).toBeEnabled();
  // Calculation history is recorded before the session pauses; approval is a
  // separate explicit action. Wait for recording, not just the last block result.
  await panel.getByRole('button', { name: 'Resume workflow', exact: true }).waitFor();
  const original = await read();
  const calculated = Object.values(original.session.results).find(
    (r) => r.output.calculatedResults,
  )!;
  expect(calculated.output.calculatedResults).toEqual({ RESULT: 400 });
  expect(original.session.approvedAt).toBeUndefined();
  expect(original.entry.runs).toHaveLength(1);
  const originalRecord = original.entry.runs[0];
  expect(originalRecord.version).toBe(1);
  expect(originalRecord.version).toBe(original.session.version);
  expect(originalRecord.sessionSnapshot!.id).toBe(original.session.id);
  expect(originalRecord.sessionSnapshot!.approvedAt).toBeUndefined();
  expect(originalRecord.sessionSnapshot!.sources).toEqual(original.session.sources);
  expect(
    originalRecord.sessionSnapshot!.results[calculated.blockId].output.calculatedResults,
  ).toEqual({ RESULT: 400 });
  await composer.fill('Explain this result before I approve it');
  await panel.getByRole('button', { name: 'Verify this run in Build', exact: true }).click();
  const inspector = page.getByRole('region', { name: 'Run verification in Build', exact: true });
  // Build is deferred, and its block workspace is portaled outside the canvas.
  // Synchronize their actual mounts before checking the unchanged run evidence.
  const blockWorkspace = page.locator('.workflow-studio-overlay').filter({
    has: page.getByLabel('Verify block', { exact: true }),
  });
  const recordedBlock = blockWorkspace.getByRole('article', {
    name: 'Block verification',
    exact: true,
  });
  const waitForInspection = async () => {
    await inspector.waitFor();
    await expect(inspector).toContainText(original.session.id);
    await blockWorkspace.waitFor();
    await expect(blockWorkspace).toContainText(original.session.id);
  };
  await waitForInspection();
  await blockWorkspace.getByLabel('Verify block', { exact: true }).selectOption(calculated.blockId);
  await expect(recordedBlock).toContainText('400');
  expect(await read()).toEqual(original);
  await blockWorkspace.getByRole('button', { name: 'Continue this run in Chat' }).click();
  panel = chatPanel;
  await expect(panel).toContainText(original.session.id);
  if ((await documentStep.getAttribute('aria-expanded')) !== 'true') await documentStep.click();
  await attachSessionWorkbook(page, panel, 'audit-replacement.xlsx', 50);
  await expect(panel.getByRole('list', { name: 'Execution steps' })).toContainText('Outdated');
  await panel.getByRole('button', { name: 'Resume workflow', exact: true }).click();
  await expect(panel.getByRole('button', { name: 'Approve completed results' })).toBeEnabled();
  await panel.getByRole('button', { name: 'Resume workflow', exact: true }).waitFor();
  const recalculated = await read();
  expect(recalculated.session.id).toBe(original.session.id);
  expect(recalculated.session.approvedAt).toBeUndefined();
  expect(recalculated.session.results[calculated.blockId].output.calculatedResults).toEqual({
    RESULT: 100,
  });
  expect(recalculated.entry.versions).toEqual(original.entry.versions);
  expect(recalculated.entry.runs).toHaveLength(2);
  expect(recalculated.entry.runs[0]).toEqual(originalRecord);
  const replacementRecord = recalculated.entry.runs[1];
  expect(replacementRecord.version).toBe(originalRecord.version);
  expect(replacementRecord.sessionSnapshot!.id).toBe(original.session.id);
  expect(replacementRecord.sessionSnapshot!.approvedAt).toBeUndefined();
  expect(replacementRecord.sessionSnapshot!.sources).toEqual(recalculated.session.sources);
  expect(recalculated.session.sources.map((source) => source.name)).toEqual([
    'audit-original.xlsx',
    'audit-replacement.xlsx',
  ]);
  expect(
    replacementRecord.sessionSnapshot!.results[calculated.blockId].output.calculatedResults,
  ).toEqual({ RESULT: 100 });
  await panel.getByRole('button', { name: 'Verify this run in Build', exact: true }).click();
  await waitForInspection();
  await blockWorkspace.getByLabel('Verify block', { exact: true }).selectOption(calculated.blockId);
  await expect(recordedBlock).toContainText('100');
  const oldAttempt = original.session.attempts.findIndex((a) => a.blockId === calculated.blockId);
  await recordedBlock
    .getByLabel('Evidence attempt', { exact: true })
    .selectOption(String(oldAttempt));
  await expect(recordedBlock).toContainText('400');
  await blockWorkspace.getByRole('button', { name: 'Return to this run' }).click();
  await page.getByRole('button', { name: 'Build', exact: true }).click();
  await waitForInspection();
  expect((await read()).entry.draft).toEqual(original.entry.draft);
  expect(await read()).toEqual(recalculated);
  const link = `/w/${encodeURIComponent(original.entry.id)}?run=${encodeURIComponent(original.session.id)}`;
  await page.reload();
  await composer.waitFor();
  await page.goto(link);
  await page.getByRole('button', { name: 'Build', exact: true }).click();
  await waitForInspection();
});
