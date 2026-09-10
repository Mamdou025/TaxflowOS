import { test, expect, type Page } from '@playwright/test';

async function seed(page: Page, uploaded = true) {
  await page.goto('/');
  const info = await page.evaluate(async uploaded => {
    const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
    const { saveVersion } = await import('/src/features/workflows-hub/workflow-library.ts');
    const { workflowDefinitionToCanvas } = await import('/src/shared/workflow-engine/local-fiscal-workflow.ts');
    const { runLocalWorkflowTools } = await import('/src/shared/workflow-engine/local-tool-runner.ts');
    const { calculationValueKey } = await import('/src/shared/workflow-engine/calculation-values.ts');
    const definition = templateDefinition('pf-fapi')!;
    const source = definition.blocks.find(block => block.config.toolId === 'source.manual_table')!;
    const compute = definition.blocks.find(block => block.config.toolId === 'logic.calculation_engine')!;
    source.label = 'Uploaded document';
    source.position = { x: 0, y: 0 };
    source.config = { toolId: 'source.manual_table', sourceKind: 'manual_table', rows: [{ rowId: 'a', label: 'Units', amount: 10 }], ...(uploaded ? { fileName: 'inventory.csv', uploadTimestamp: new Date().toISOString() } : {}), readinessConditions: [{ id: 'document', kind: 'document', sourceId: source.id }] };
    compute.label = 'Calculate units';
    compute.position = { x: 400, y: 0 };
    const ref = calculationValueKey(source.id, ['rows', '0', 'amount']);
    compute.config = { toolId: 'logic.calculation_engine', mode: 'inline', formulas: [{ calculationId: 'TOTAL', resultKey: 'TOTAL', label: 'Total', operation: 'pass_through', operands: [], formulaExpression: `${ref} * 2` }] };
    definition.id = 'custom:workspace-audit';
    definition.name = 'Inventory calculation';
    definition.structure.entryBlockId = source.id;
    definition.blocks = [source, compute];
    definition.edges = [{ ...definition.edges[0], id: 'audit-transfer', sourceBlockId: source.id, targetBlockId: compute.id, sourceOutputRole: 'rows', targetInputRole: 'named_values', status: 'active' }];
    let entry = saveVersion({ id: definition.id, templateId: 'pf-fapi', draft: definition, versions: [], runs: [] });
    const result = runLocalWorkflowTools({ ...workflowDefinitionToCanvas(entry.versions[0].definition), workflowName: definition.name, workflowId: definition.id });
    entry.runs = [{ version: 1, at: new Date().toISOString(), result }];
    compute.config.formulas[0].formulaExpression = `${ref} * 3`;
    localStorage.setItem('taxflow:workflow-library:v1', JSON.stringify({ [entry.id]: entry }));
    return { id: entry.id, source: source.id, target: compute.id };
  }, uploaded);
  await page.goto(`/w/${info.id}`);
  return info;
}

test('block I/O replaces the strip and selected connections show recorded transfers', async ({ page }) => {
  const info = await seed(page);
  await page.getByRole('button', { name: 'Build', exact: true }).click();
  await page.getByRole('button', { name: 'Calculate units', exact: true }).click();
  await expect(page.getByText('Connected I/O', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Input & Output', exact: true }).click();
  await expect(page.getByTestId('block-io-panel')).toContainText('From Uploaded document');
  await expect(page.getByTestId('block-io-panel')).toContainText('This block has changed');
  await expect(page.getByRole('region', { name: 'Produced outputs' })).toContainText('20');
  await expect(page.getByLabel('Inspect run')).toBeVisible();
  await page.goto('/w/custom:workspace-audit');
  await page.getByRole('button', { name: 'Build', exact: true }).click();
  await page.getByRole('group', { name: `Edge from ${info.source} to ${info.target}`, exact: true }).click();
  await expect(page.getByTestId('connection-transfer-panel')).toContainText('Uploaded document');
  await expect(page.getByTestId('connection-transfer-panel')).toContainText('Units');
  await expect(page.getByTestId('connection-transfer-panel')).toContainText('as a whole');
});

test('Run keeps saved versions separate from changed drafts and readiness stays advisory', async ({ page }) => {
  const { id } = await seed(page, false);
  await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  await expect(page.getByRole('region', { name: 'Trigger readiness' })).toContainText('Waiting');
  await expect(page.getByRole('button', { name: 'Run saved version 1', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Run saved version 1', exact: true }).click();
  let stored = await page.evaluate(async id => { const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts'); return readWorkflowLibrary()[id]; }, id);
  expect(stored.versions).toHaveLength(1);
  expect(stored.runs.at(-1).result.result.results.at(-1).output.calculatedResults.TOTAL).toBe(20);
  await page.getByRole('button', { name: 'Save changes and run', exact: true }).click();
  stored = await page.evaluate(async id => { const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts'); return readWorkflowLibrary()[id]; }, id);
  expect(stored.versions).toHaveLength(2);
  expect(stored.runs.at(-1).result.result.results.at(-1).output.calculatedResults.TOTAL).toBe(30);
  await page.getByLabel('Saved workflow version').selectOption('1');
  await page.getByRole('button', { name: 'Run saved version 1', exact: true }).click();
  stored = await page.evaluate(async id => { const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts'); return readWorkflowLibrary()[id]; }, id);
  expect(stored.runs.at(-1).version).toBe(1);
  expect(stored.runs.at(-1).result.result.results.at(-1).output.calculatedResults.TOTAL).toBe(20);
});

test('Trigger displays uploaded documents and saves editable conditions', async ({ page }) => {
  const info = await seed(page);
  await page.getByRole('button', { name: 'Build', exact: true }).click();
  await page.getByRole('button', { name: 'Fit view', exact: true }).click();
  await page.getByRole('button', { name: 'Uploaded document', exact: true }).click();
  const panel = page.getByRole('region', { name: 'Trigger readiness' });
  await expect(panel).toContainText('Uploaded: inventory.csv');
  await expect(panel).toContainText('Met');
  await expect(panel.getByLabel('Condition source').first()).toHaveValue(info.source);
  await panel.getByRole('button', { name: 'Add condition', exact: true }).click();
  await panel.getByLabel('Condition type').last().selectOption('api');
  await expect(panel).toContainText('Waiting for a fetched API response');
  await page.goto('/w/custom:workspace-audit');
  await page.getByRole('button', { name: 'Build', exact: true }).click();
  await page.getByRole('button', { name: 'Uploaded document', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Trigger readiness' }).getByLabel('Condition type').last()).toHaveValue('api');
});
