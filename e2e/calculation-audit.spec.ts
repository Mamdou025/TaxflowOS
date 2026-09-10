import { test, expect } from './workflow-audit-isolation';

test('constant and explicit numeric-field formulas do not require a generic amount field', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(async () => {
    const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
    const { workflowDefinitionToCanvas } = await import('/src/shared/workflow-engine/local-fiscal-workflow.ts');
    const { runLocalWorkflowTools } = await import('/src/shared/workflow-engine/local-tool-runner.ts');
    const { calculationValueKey } = await import('/src/shared/workflow-engine/calculation-values.ts');
    const definition = templateDefinition('pf-fapi')!;
    const source = definition.blocks.find(b => b.config.toolId === 'source.manual_table')!;
    const compute = definition.blocks.find(b => b.config.toolId === 'logic.calculation_engine')!;
    source.config = { toolId: 'source.manual_table', sourceKind: 'manual_table', rows: [{ label: 'Widget', quantity: 12 }] };
    const formula = (expression: string) => ({ calculationId: 'RESULT', resultKey: 'RESULT', label: 'Result', formulaExpression: expression, operation: 'pass_through', operands: [] });
    definition.blocks = [source, compute];
    definition.edges = [{ ...definition.edges[0], sourceBlockId: source.id, targetBlockId: compute.id, sourceOutputRole: 'selected_rows', targetInputRole: 'named_values', status: 'active' }];
    const run = (expression: string) => {
      compute.config = { toolId: 'logic.calculation_engine', mode: 'inline', formulas: [formula(expression)] };
      const result = runLocalWorkflowTools({ ...workflowDefinitionToCanvas(definition), workflowName: definition.name }).result.results.find(r => r.blockId === compute.id)!;
      return { status: result.status, errors: result.errors, value: result.output.calculatedResults };
    };
    return { constant: run('500 / 2'), field: run(`${calculationValueKey(source.id, ['rows', '0', 'quantity'])} * 2`) };
  });
  console.log(JSON.stringify(result));
  expect(result.constant).toMatchObject({ status: 'success', value: { RESULT: 250 } });
  expect(result.field).toMatchObject({ status: 'success', value: { RESULT: 24 } });
});

test('invalid arithmetic and malformed formulas cannot publish a numeric result', async ({ page }) => {
  await page.goto('/');
  const results = await page.evaluate(async () => {
    const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
    const { runCalculationEngine } = await import('/src/shared/workflow-engine/execution/blocks/logic/calculation-engine/run.ts');
    const block = templateDefinition('pf-fapi')!.blocks.find(b => b.config.toolId === 'logic.calculation_engine')!;
    return ['500 / 0', '500 +', '(500 / 2', '2 ** 3'].map(expression => {
      const config = { mode: 'inline', formulas: [{ calculationId: 'BAD', resultKey: 'BAD', label: 'Invalid', formulaExpression: expression, operation: 'pass_through', operands: [] }] };
      const result = runCalculationEngine({ block: { ...block, config }, config, inputsByRole: {}, runId: 'arithmetic-audit', startedAt: new Date().toISOString() });
      return { expression, status: result.status, errors: result.errors, warnings: result.warnings, output: result.outputs.calculated_results };
    });
  });
  console.log(JSON.stringify(results));
  for (const result of results) expect(result.status, result.expression).toBe('error');
});

test('aggregation operations and nested groups agree with the editor', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(async () => {
    const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
    const { runCategoryRollupAggregator } = await import('/src/shared/workflow-engine/execution/blocks/logic/category-rollup-aggregator/run.ts');
    const block = templateDefinition('pf-fapi')!.blocks.find(b => b.config.toolId === 'logic.category_rollup_aggregator')!;
    const config = { rollupRules: [
      ...['sum', 'sum_abs', 'subtract', 'multiply', 'divide', 'pass_through'].map(operation => ({ rollupId: operation, label: operation, operation, includeCategoryIds: ['a', 'b'] })),
      { rollupId: 'nested', label: 'Nested', operation: 'sum', includeCategoryIds: ['sum', 'a'] },
      { rollupId: 'a', label: 'Same name as category', operation: 'sum', includeCategoryIds: ['a'] },
    ] };
    const result = runCategoryRollupAggregator({ block: { ...block, config }, config, inputsByRole: { mapped_rows: [{ mappedRows: [
      { rowId: 'a', label: 'A', amount: 6, categoryId: 'a', categoryLabel: 'A' },
      { rowId: 'b', label: 'B', amount: 2, categoryId: 'b', categoryLabel: 'B' },
    ] }] }, runId: 'rollup-audit', startedAt: new Date().toISOString() });
    return { status: result.status, errors: result.errors, totals: result.outputs.rollup_totals, warnings: result.warnings };
  });
  console.log(JSON.stringify(result));
  expect(result.totals.rollupTotals).toEqual({ sum: 8, sum_abs: 8, subtract: 4, multiply: 12, divide: 3, pass_through: 6, nested: 14, a: 6 });
});

test('compact storage preserves old saves and all snapshots without truncation', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(async () => {
    const { stringifySharedJSON, parseSharedJSON } = await import('/src/shared/workflow-engine/shared-json.ts');
    const rows = Array.from({ length: 1000 }, (_, i) => ({ id: i, label: `Product ${i}`, amount: i / 10, optional: undefined }));
    const original = { rows, copies: Array.from({ length: 20 }, () => ({ rows: structuredClone(rows) })), at: new Date('2026-09-09T00:00:00Z'), marker: { format: 'user-data', '$ref': 123 } };
    const text = JSON.stringify(original);
    const packed = stringifySharedJSON(original);
    const decoded = parseSharedJSON(packed);
    return { equal: JSON.stringify(decoded) === text, legacy: JSON.stringify(parseSharedJSON(text)) === text, rawBytes: text.length, packedBytes: packed.length };
  });
  console.log(JSON.stringify(result));
  expect(result.equal).toBe(true);
  expect(result.legacy).toBe(true);
  expect(result.packedBytes).toBeLessThan(result.rawBytes / 4);
});

test('duplicate keys and circular calculation or rollup references fail clearly', async ({ page }) => {
  await page.goto('/');
  const results = await page.evaluate(async () => {
    const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
    const { runCalculationEngine } = await import('/src/shared/workflow-engine/execution/blocks/logic/calculation-engine/run.ts');
    const { evaluateRollupGroups } = await import('/src/shared/workflow-engine/rollup-evaluation.ts');
    const block = templateDefinition('pf-fapi')!.blocks.find(b => b.config.toolId === 'logic.calculation_engine')!;
    const formula = (key: string, expression: string) => ({ calculationId: key, resultKey: key, label: key, formulaExpression: expression, operation: 'pass_through', operands: [] });
    const cases = [[formula('A', 'B + 1'), formula('B', 'A + 1')], [formula('A', '1'), formula('A', '2')]];
    const calculations = cases.map(formulas => {
      const config = { mode: 'inline', formulas };
      const result = runCalculationEngine({ block: { ...block, config }, config, inputsByRole: {}, runId: 'invalid-graph', startedAt: new Date().toISOString() });
      return { status: result.status, errors: result.errors };
    });
    let rollupError = '';
    try { evaluateRollupGroups([{ rollupId: 'A', label: 'A', operation: 'sum', includeCategoryIds: ['B'] }, { rollupId: 'B', label: 'B', operation: 'sum', includeCategoryIds: ['A'] }], {}); }
    catch (error) { rollupError = String(error); }
    return { calculations, rollupError };
  });
  expect(results.calculations.every(result => result.status === 'error')).toBe(true);
  expect(results.rollupError).toContain('Circular');
});

test('FX override precedence and clearing agree with the editor', async ({ page }) => {
  await page.goto('/');
  const rates = await page.evaluate(async () => {
    const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
    const { runCurrencyRateSource } = await import('/src/shared/workflow-engine/execution/blocks/source/currency-rate/run.ts');
    const block = templateDefinition('pf-fapi')!.blocks.find(b => b.config.sourceKind === 'currency_rate')!;
    return [1.35, null].map(overrideRate => {
      const config = { ...block.config, liveRate: 1.3977622489959842, overrideRate };
      const result = runCurrencyRateSource({ block: { ...block, config }, config, inputsByRole: {}, runId: 'fx-precedence', startedAt: new Date().toISOString() });
      return result.outputs.exchange_rate;
    });
  });
  expect(rates[0]).toMatchObject({ rate: 1.35, rate_source: 'override' });
  expect(rates[1]).toMatchObject({ rate: 1.3977622489959842, rate_source: 'bank_of_canada_valet' });
});
