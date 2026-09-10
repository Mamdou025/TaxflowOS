import { test, expect } from '@playwright/test';

test('formulas combine constants with API fields and retain source identity', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(async () => {
    const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
    const { workflowDefinitionToCanvas } = await import('/src/shared/workflow-engine/local-fiscal-workflow.ts');
    const { runLocalWorkflowTools } = await import('/src/shared/workflow-engine/local-tool-runner.ts');
    const { calculationValueKey } = await import('/src/shared/workflow-engine/calculation-values.ts');
    const { runCalculationEngine } = await import('/src/shared/workflow-engine/execution/blocks/logic/calculation-engine/run.ts');
    const definition = templateDefinition('pf-fapi')!;
    const compute = definition.blocks.find(block => block.config.toolId === 'logic.calculation_engine')!;
    const original = definition.blocks.find(block => block.config.toolId === 'source.manual_table')!;
    const source = (id: string, rate: number) => ({ ...original, id, catalogId: 'source:api-http-request', subtype: 'API / HTTP Request', label: id, config: { toolId: 'source.http_json', sourceKind: 'http_json', url: 'https://example.test/rates', fetchedRows: [{ rowId: 'rate', label: 'Rate', amount: rate, raw: { rate } }] } });
    const a = source('api-a', 2);
    const b = source('api-b', 3);
    const refA = calculationValueKey(a.id, ['rawRows', '0', 'rate']);
    const refB = calculationValueKey(b.id, ['rawRows', '0', 'rate']);
    const formula = (key: string, expression: string) => ({ calculationId: key, resultKey: key, label: key, formulaExpression: expression, operation: 'pass_through', operands: [] });
    compute.config = { toolId: 'logic.calculation_engine', mode: 'inline', formulas: [formula('RESULT', `${refA} * 500 / 2 + ${refB}`)] };
    definition.blocks = [a, b, compute];
    definition.edges = [a, b].map((source, index) => ({ ...definition.edges[0], id: `api-edge-${index}`, sourceBlockId: source.id, targetBlockId: compute.id, sourceOutputRole: 'raw_rows', targetInputRole: 'named_values', status: 'active' }));
    const run = () => runLocalWorkflowTools({ ...workflowDefinitionToCanvas(definition), workflowName: definition.name }).result.results.find(result => result.blockId === compute.id)!;
    const initial = run();
    a.config.fetchedRows[0].raw.rate = 4;
    const changed = run();
    const context = (expression: string) => {
      const config = { mode: 'inline', formulas: [formula('RESULT', expression)] };
      return { block: { ...compute, config }, config, inputsByRole: {}, runId: 'test', startedAt: new Date().toISOString() };
    };
    const constant = runCalculationEngine(context('500 / 2 * -2.5'));
    const missing = runCalculationEngine(context(`${refA} * 500`));
    const mixedContext = context(`TOTAL * ${refA} / 2`);
    mixedContext.inputsByRole = { named_values: [{ namedValues: { TOTAL: 100 } }], calculation_sources: [{ blockId: a.id, output: { rawRows: [{ rate: '2.5' }] } }] };
    const mixed = runCalculationEngine(mixedContext);
    mixedContext.inputsByRole.calculation_sources[0].output.rawRows[0].rate = 'unavailable';
    const nonnumeric = runCalculationEngine(mixedContext);
    return { initial: initial.output.calculatedResults, initialStatus: initial.status, changed: changed.output.calculatedResults, constant: constant.outputs.calculated_results, mixed: mixed.outputs.calculated_results, nonnumeric: nonnumeric.status, missing: missing.status, errors: missing.errors };
  });
  expect(result.initialStatus).toBe('success');
  expect(result.initial).toEqual({ RESULT: 503 });
  expect(result.changed).toEqual({ RESULT: 1003 });
  expect(result.constant.calculatedResults).toEqual({ RESULT: -625 });
  expect(result.mixed.calculatedResults).toEqual({ RESULT: 125 });
  expect(result.nonnumeric).toBe('error');
  expect(result.missing).toBe('error');
  expect(result.errors.join(' ')).toContain('no numeric value');
});

test('Compute exposes number entry beside the formula and allows expected source fields', async ({ page }) => {
  await page.goto('/w/pf-fapi');
  await page.getByRole('button', { name: 'Build', exact: true }).click();
  const label = await page.evaluate(async () => {
    const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
    return templateDefinition('pf-fapi')!.blocks.find(block => block.config.toolId === 'logic.calculation_engine')!.label;
  });
  await page.getByRole('button', { name: label, exact: true }).click();
  await page.getByRole('button', { name: 'New term', exact: true }).click();
  await page.getByRole('spinbutton', { name: 'Number to add' }).fill('500');
  await page.getByRole('button', { name: 'Add number', exact: true }).click();
  await page.getByRole('button', { name: '÷', exact: true }).click();
  await page.getByRole('spinbutton', { name: 'Number to add' }).fill('2');
  await page.getByRole('button', { name: 'Add number', exact: true }).click();
  await expect(page.getByText('500 / 2', { exact: true })).toBeVisible();
  const select = page.getByRole('combobox', { name: 'Value source block' });
  const source = await select.locator('option').nth(1).getAttribute('value');
  expect(source).toBeTruthy();
  await select.selectOption(source!);
  await page.getByRole('button', { name: '×', exact: true }).click();
  await page.getByRole('textbox', { name: 'Expected output field' }).fill('rawRows.0.rate');
  await page.getByRole('button', { name: 'Add field to formula', exact: true }).click();
  await expect(page.getByText(/· rawRows › 0 › rate/)).toBeVisible();
});
