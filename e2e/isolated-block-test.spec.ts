import { test, expect } from './workflow-audit-isolation';

test('isolated execution runs only the selected block, supports constants and leaves the workflow untouched', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(async () => {
    const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
    const { workflowDefinitionToCanvas } = await import('/src/shared/workflow-engine/local-fiscal-workflow.ts');
    const { runLocalWorkflowTools } = await import('/src/shared/workflow-engine/local-tool-runner.ts');
    const { exampleInput } = await import('/src/shared/workflow-engine/block-test-inputs.ts');
    const definition = templateDefinition('pf-document-calculator')!;
    const block = definition.blocks.find(b => b.label === 'Calculate')!;
    const canvas = workflowDefinitionToCanvas(definition);
    const before = JSON.stringify(canvas);
    const run = runLocalWorkflowTools({ ...canvas, workflowName: definition.name, mode: 'isolated', selectedBlockId: block.id, isolatedInputs: [exampleInput({ namedValues: { item_total: 200 } })], testInputSource: 'examples' });
    const unchanged = JSON.stringify(canvas) === before;
    const connected = runLocalWorkflowTools({ ...canvas, workflowName: definition.name, mode: 'selected', selectedBlockId: block.id });
    const missing = runLocalWorkflowTools({ ...canvas, workflowName: definition.name, mode: 'isolated', selectedBlockId: block.id });
    block.config.formulas[0].formulaExpression = '500 / 2';
    const constant = runLocalWorkflowTools({ ...workflowDefinitionToCanvas(definition), workflowName: definition.name, mode: 'isolated', selectedBlockId: block.id });
    return { id: block.id, run, unchanged, connected: connected.result, missing: missing.result, constant: constant.result };
  });
  expect(result.unchanged).toBe(true);
  expect(result.run.result.results).toHaveLength(1);
  expect(result.run.record.logs.map(log => log.nodeId)).toEqual([result.id]);
  expect(Object.keys(result.run.edgeStatuses)).toHaveLength(0);
  expect(result.run.result.results[0].output.calculatedResults).toEqual({ RESULT: 400 });
  expect(result.run.result.results[0].input['Example inputs']).toEqual({ namedValues: { item_total: 200 } });
  expect(result.run.result.results[0].blockTest).toEqual({ mode: 'isolated', inputs: 'examples' });
  expect(result.connected.status).toBe('error');
  expect(result.missing.status).toBe('error');
  expect(result.constant.results[0].output.calculatedResults).toEqual({ RESULT: 250 });
});

test('individual keyword, aggregate, compute and output blocks pass real data between recorded tests', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(async () => {
    const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
    const { workflowDefinitionToCanvas } = await import('/src/shared/workflow-engine/local-fiscal-workflow.ts');
    const { runLocalWorkflowTools } = await import('/src/shared/workflow-engine/local-tool-runner.ts');
    const { exampleInput, recordedBlockInput } = await import('/src/shared/workflow-engine/block-test-inputs.ts');
    const definition = templateDefinition('pf-document-calculator')!;
    const canvas = workflowDefinitionToCanvas(definition);
    const records = [];
    const run = (label: string, inputs: any[], mode = 'recorded') => {
      const block = definition.blocks.find(b => b.label === label)!;
      const run = runLocalWorkflowTools({ ...canvas, workflowName: definition.name, selectedBlockId: block.id, mode: 'isolated', isolatedInputs: inputs, testInputSource: mode as any });
      records.unshift(run.record);
      return { run, input: recordedBlockInput(block, records) };
    };
    const classified = run('Keyword rules', [exampleInput({ rows: [{ rowId: 'a', label: 'Item one', amount: 120 }, { rowId: 'b', label: 'Item two', amount: 80 }, { rowId: 'c', label: 'Service', amount: 30 }] })], 'examples');
    const grouped = run('Aggregation groups', [classified.input]);
    const calculated = run('Calculate', [grouped.input]);
    const output = run('Final result', [calculated.input]);
    const blank = run('Aggregation groups', [exampleInput({ mappedRows: [{ rowId: 'blank', label: 'Item', categoryId: 'items', amount: null }] })], 'examples');
    const calcBlock = definition.blocks.find(b => b.label === 'Calculate')!;
    const valid = !!recordedBlockInput(calcBlock, records);
    const latestError = { ...calculated.run.record, logs: calculated.run.record.logs.map(log => ({ ...log, output: { ...log.output, status: 'error', errors: ['failed'] } })) };
    const rejectsLatestFailure = !recordedBlockInput(calcBlock, [latestError, ...records]);
    calcBlock.config.formulas[0].formulaExpression = 'item_total * 3';
    const rejectsChangedSettings = !recordedBlockInput(calcBlock, records);
    return { results: [classified, grouped, calculated, output, blank].map(item => item.run.result), valid, rejectsLatestFailure, rejectsChangedSettings };
  });
  for (const run of result.results) expect(run.results).toHaveLength(1);
  expect(result.results[0].results[0].output.mappedRows).toHaveLength(2);
  expect(result.results[0].results[0].output.unmatchedRows).toHaveLength(1);
  expect(result.results[1].results[0].output.rollupTotals.item_total).toBe(200);
  expect(result.results[2].results[0].output.calculatedResults.RESULT).toBe(400);
  expect(result.results[3].results[0].output.canonicalJson.calculated_results.RESULT).toBe(400);
  expect(result.results[4].status).toBe('error');
  expect(result.valid && result.rejectsLatestFailure && result.rejectsChangedSettings).toBe(true);
});

test('source and rulebook tests execute themselves and report missing documents', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(async () => {
    const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
    const { workflowDefinitionToCanvas } = await import('/src/shared/workflow-engine/local-fiscal-workflow.ts');
    const { runLocalWorkflowTools } = await import('/src/shared/workflow-engine/local-tool-runner.ts');
    const definition = templateDefinition('pf-fapi')!;
    const { createWorkflowBlockFromCatalog } = await import('/src/shared/workflow-engine/local-fiscal-workflow.ts');
    const rulebook = createWorkflowBlockFromCatalog('source:keyword-rules', { id: 'test-rulebook', label: 'Keyword Rulebook', position: { x: 0, y: 0 }, config: { keywordRules: [{ ruleId: 'items', categoryId: 'items', keyword: 'Item', matchType: 'contains', enabled: true }] } });
    definition.blocks.push(rulebook);
    const run = runLocalWorkflowTools({ ...workflowDefinitionToCanvas(definition), workflowName: definition.name, mode: 'isolated', selectedBlockId: rulebook.id });
    const neutral = templateDefinition('pf-document-calculator')!;
    const document = neutral.blocks.find(b => b.label === 'Document')!;
    const missing = runLocalWorkflowTools({ ...workflowDefinitionToCanvas(neutral), workflowName: neutral.name, mode: 'isolated', selectedBlockId: document.id });
    return { id: rulebook.id, result: run.result, missing: missing.result };
  });
  expect(result.result.results.map(r => r.blockId)).toEqual([result.id]);
  expect(result.result.results[0].output.keywordRules.length).toBeGreaterThan(0);
  expect(result.missing.results).toHaveLength(1);
  expect(result.missing.status).toBe('error');
  expect(result.missing.errors.join(' ')).toMatch(/upload|document/i);
});

async function openTest(page, label: string) {
  await page.goto('/w/pf-document-calculator');
  await page.getByRole('button', { name: 'Build', exact: true }).click();
  await page.getByRole('button', { name: label, exact: true }).click();
  await page.getByRole('button', { name: 'Test block', exact: true }).click();
  return page.getByRole('region', { name: 'Individual block test' });
}

test('standalone Compute accepts example numbers, flags stale results and validates inputs', async ({ page }, testInfo) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  const panel = await openTest(page, 'Calculate');
  await expect(panel.getByLabel('Test value 1 name')).toHaveValue('item_total');
  await panel.getByLabel('Test value 1 number').fill('200');
  await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  await expect(panel).toContainText('400');
  await panel.getByLabel('Test value 1 number').fill('220');
  await expect(panel.getByRole('status')).toContainText('Run again');
  await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  await expect(panel).toContainText('440');
  await expect(panel.getByRole('status')).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath('isolated-calculation.png'), fullPage: true });
  await panel.getByLabel('Test value 1 number').fill('');
  await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  await expect(panel.getByRole('alert')).toContainText('Blank values are not zero');
  await panel.getByLabel('Block test input editor').selectOption('json');
  await panel.getByLabel('Block test input JSON').fill('null');
  await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  await expect(panel.getByRole('alert')).toContainText('Enter an input object');
  await panel.getByLabel('Block test input JSON').fill('{"namedValues":{"item_total":0}}');
  await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  await expect(panel.getByRole('alert')).toHaveCount(0);
  await expect(panel).toContainText('success');
  const stored = await page.evaluate(async () => {
    const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
    const { loadLocalRunRecords } = await import('/src/shared/workflow-engine/local-fiscal-workflow.ts');
    return { entries: Object.values(readWorkflowLibrary()), records: loadLocalRunRecords() };
  });
  expect(stored.entries.flatMap((e: any) => e.runs)).toHaveLength(0);
  expect(stored.records).toHaveLength(3);
  expect(stored.records.every(r => r.logs.length === 1)).toBe(true);
  expect(errors).toEqual([]);
});

test('example CSV uploads into one block without changing workflow data', async ({ page }) => {
  const panel = await openTest(page, 'Keyword rules');
  await panel.getByText(/Test data .* upload document or enter examples/).click();
  await panel.getByLabel('Upload test document').setInputFiles({ name: 'block-only.csv', mimeType: 'text/csv', buffer: Buffer.from('label,amount\nItem one,120\nItem two,80\nService,30\n') });
  await panel.getByRole('button', { name: 'Use this test data', exact: true }).click();
  await expect(panel.getByLabel('Test row 1 text')).toHaveValue('Item one');
  await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  await expect(panel).toContainText('Items');
  const stored = await page.evaluate(async () => {
    const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
    const { loadLocalRunRecords } = await import('/src/shared/workflow-engine/local-fiscal-workflow.ts');
    return { entries: Object.values(readWorkflowLibrary()), result: loadLocalRunRecords()[0].logs[0].output };
  });
  expect(stored.result.output.mappedRows).toHaveLength(2);
  expect(stored.entries.every((entry: any) => entry.draft.blocks.every((b: any) => b.config.fileName !== 'block-only.csv'))).toBe(true);
});

test('recorded inputs are explicit and missing snapshots do not execute upstream blocks', async ({ page }) => {
  const panel = await openTest(page, 'Calculate');
  await panel.getByLabel('Block test input source').selectOption('recorded');
  await expect(panel).toContainText('Aggregation groups');
  await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  await expect(panel.getByRole('alert')).toContainText('No usable recorded result');
  const records = await page.evaluate(async () => (await import('/src/shared/workflow-engine/local-fiscal-workflow.ts')).loadLocalRunRecords());
  expect(records).toHaveLength(0);
});

test('the UI reuses individual aggregation and calculation results after reload without running the workflow', async ({ page }, testInfo) => {
  let panel = await openTest(page, 'Aggregation groups');
  await expect(panel.getByLabel('Test record type')).toHaveValue('mappedRows');
  for (const [index, amount] of [120, 80].entries()) {
    await panel.getByRole('button', { name: 'Add test record', exact: true }).click();
    await panel.getByLabel(`Test row ${index + 1} text`).fill(`Item ${index + 1}`);
    await panel.getByLabel(`Test row ${index + 1} number`).fill(String(amount));
    await panel.getByLabel(`Test row ${index + 1} category`).fill('items');
  }
  await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  await expect(panel).toContainText('200');
  panel = await openTest(page, 'Calculate');
  await panel.getByLabel('Block test input source').selectOption('recorded');
  await expect(panel).toContainText('prior block test');
  await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  await expect(panel).toContainText('400');
  await page.getByRole('button', { name: 'Input & Output', exact: true }).click();
  await expect(page.getByTestId('block-io-panel')).toContainText('Individual block test');
  panel = await openTest(page, 'Final result');
  await panel.getByLabel('Block test input source').selectOption('recorded');
  await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  await expect(panel).toContainText('400');
  await page.screenshot({ path: testInfo.outputPath('individual-final-output.png'), fullPage: true });
  const stored = await page.evaluate(async () => {
    const { loadLocalRunRecords } = await import('/src/shared/workflow-engine/local-fiscal-workflow.ts');
    return loadLocalRunRecords();
  });
  expect(stored).toHaveLength(3);
  expect(stored.every(r => r.logs.length === 1)).toBe(true);
  expect(stored[0].logs[0].output.output.canonicalJson.calculated_results.RESULT).toBe(400);
});

test('large example imports paginate editable records and process every row', async ({ page }) => {
  const panel = await openTest(page, 'Keyword rules');
  await panel.getByText(/Test data .* upload document or enter examples/).click();
  await panel.getByLabel('Upload test document').setInputFiles({ name: 'many-items.csv', mimeType: 'text/csv', buffer: Buffer.from('label,amount\n' + Array.from({ length: 500 }, (_, i) => `Item ${i + 1},${i + 1}`).join('\n')) });
  await panel.getByRole('button', { name: 'Use this test data', exact: true }).click();
  await expect(panel.getByRole('textbox', { name: /^Test row .* text$/ })).toHaveCount(25);
  await panel.getByRole('button', { name: 'Next test records', exact: true }).click();
  await expect(panel.getByLabel('Test row 26 text')).toHaveValue('Item 26');
  await panel.getByLabel('Test row 26 number').fill('0');
  const start = Date.now();
  await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  const result = await page.evaluate(async () => (await import('/src/shared/workflow-engine/local-fiscal-workflow.ts')).loadLocalRunRecords()[0].logs[0].output);
  expect(result.output.mappedRows).toHaveLength(500);
  expect(result.output.mappedRows[25].amount).toBe(0);
  expect(Date.now() - start).toBeLessThan(5000);
});

test('isolated calculation combines an aggregate snapshot with a source-qualified API field and literal numbers', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(async () => {
    const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
    const { createWorkflowBlockFromCatalog, workflowDefinitionToCanvas } = await import('/src/shared/workflow-engine/local-fiscal-workflow.ts');
    const { runLocalWorkflowTools } = await import('/src/shared/workflow-engine/local-tool-runner.ts');
    const { exampleInput } = await import('/src/shared/workflow-engine/block-test-inputs.ts');
    const { calculationValueKey } = await import('/src/shared/workflow-engine/calculation-values.ts');
    const d = templateDefinition('pf-document-calculator')!;
    const compute = d.blocks.find(b => b.label === 'Calculate')!;
    const api = createWorkflowBlockFromCatalog('source:api-http-request', { id: 'api-rate', label: 'Exchange rate API', position: { x: 0, y: 0 } });
    const apiInput = exampleInput({ rawRows: [{ rate: 2.5 }] });
    apiInput.block = api; apiInput.result.blockId = api.id;
    compute.config.formulas[0].formulaExpression = `item_total * ${calculationValueKey(api.id, ['rawRows', '0', 'rate'])} * 500 / 2`;
    return runLocalWorkflowTools({ ...workflowDefinitionToCanvas(d), workflowName: d.name, mode: 'isolated', selectedBlockId: compute.id, isolatedInputs: [exampleInput({ namedValues: { item_total: 200 } }), apiInput], testInputSource: 'recorded' }).result;
  });
  expect(result.results).toHaveLength(1);
  expect(result.errors).toEqual([]);
  expect(result.results[0].output.calculatedResults.RESULT).toBe(125000);
});

test('an unconfigured document source reports missing data in its own test', async ({ page }) => {
  const panel = await openTest(page, 'Document');
  await expect(panel.getByLabel('Block test input source')).toHaveValue('none');
  await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  await expect(panel).toContainText('No document records supplied');
  await expect(panel).toContainText('error');
});
