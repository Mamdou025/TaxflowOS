import { test, expect } from '@playwright/test';
import { randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';

test('missing and blank values stop calculations; explicit defaults preserve real zero; intermediate precision survives', async ({ page }) => {
  await page.goto('/');
  const results = await page.evaluate(async () => {
    const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
    const { runCalculationEngine } = await import('/src/shared/workflow-engine/execution/blocks/logic/calculation-engine/run.ts');
    const block = templateDefinition('pf-document-calculator')!.blocks.find(b => b.config.toolId === 'logic.calculation_engine')!;
    const formula = (key: string, expression: string, roundingDigits?: number) => ({ calculationId: key, resultKey: key, label: key, formulaExpression: expression, operation: 'pass_through', operands: [], roundingDigits });
    const run = (formulas: any[], namedValues = {}, inputDefaults = {}) => {
      const config = { mode: 'inline', formulas, inputDefaults };
      return runCalculationEngine({ block: { ...block, config }, config, inputsByRole: { named_values: [{ namedValues }] }, runId: 'remediation', startedAt: new Date().toISOString() });
    };
    return { scientific: run([formula('SMALL', '1e-8 * 100000000'), formula('LARGE', '1E+8 / 100000000')]), missing: run([formula('A', 'missing + 1')]), blank: run([formula('A', 'blank + 1')], { blank: '' }), defaults: run([formula('A', 'missing + 1')], {}, { missing: 8 }), zero: run([formula('A', 'present + 1')], { present: 0 }, { present: 8 }), precision: run([formula('A', '1 / 3'), formula('B', 'A * 3')]), rounded: run([formula('A', '1 / 3', 2), formula('B', 'A * 3')]), ties: run([formula('POS', 'round(1.005, 2)'), formula('NEG', 'round(-1.005, 2)')]), syntax: ['abs()', 'round(1, 99)', 'max(1,2', '500 / 0'].map(expression => run([formula('A', expression)])) };
  });
  expect(results.scientific.outputs.calculated_results.calculatedResults).toEqual({ SMALL: 1, LARGE: 1 });
  expect(results.missing.status).toBe('error'); expect(results.blank.status).toBe('error');
  expect(results.defaults.outputs.calculated_results.calculatedResults.A).toBe(9);
  expect(results.defaults.warnings.join(' ')).toContain('explicit default');
  expect(results.zero.outputs.calculated_results.calculatedResults.A).toBe(1);
  expect(results.precision.outputs.calculated_results.calculatedResults).toEqual({ A: 1 / 3, B: 1 });
  expect(results.rounded.outputs.calculated_results.calculatedResults).toEqual({ A: 0.33, B: 0.99 });
  expect(results.ties.outputs.calculated_results.calculatedResults).toEqual({ POS: 1.01, NEG: -1.01 });
  for (const result of results.syntax) expect(result.status).toBe('error');
});

test('document parsing preserves quoted records, zero, decimal conventions and numeric candidates', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(async () => {
    const { parseDelimitedRecords, parseDocumentNumber, textDocumentRecords } = await import('/src/features/workflows-hub/document-records.ts');
    let malformed = false; try { parseDelimitedRecords('label,amount\n"unclosed,20', ','); } catch { malformed = true; }
    return { rows: parseDelimitedRecords('label,amount\n"Item, one",0\n"Item\ntwo",20', ','), us: parseDocumentNumber('1,234.56'), eu: parseDocumentNumber('1.234,56', ','), invalid: parseDocumentNumber('12oops'), empty: parseDocumentNumber(''), text: textDocumentRecords('Widget order 120\nDelivery 0'), malformed };
  });
  expect(result.rows).toEqual([{ label: 'Item, one', amount: 0 }, { label: 'Item\ntwo', amount: 20 }]);
  expect(result.us).toBe(1234.56); expect(result.eu).toBe(1234.56); expect(result.invalid).toBeNull(); expect(result.empty).toBeNull();
  expect(result.text[0]).toMatchObject({ label: 'Widget order 120', number_1: '120' }); expect(result.malformed).toBe(true);
});

test('neutral template executes without fiscal inputs', async ({ page }) => {
  await page.goto('/');
  const results = await page.evaluate(async () => {
    const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
    const { workflowDefinitionToCanvas } = await import('/src/shared/workflow-engine/local-fiscal-workflow.ts');
    const { runLocalWorkflowTools } = await import('/src/shared/workflow-engine/local-tool-runner.ts');
    const definition = templateDefinition('pf-document-calculator')!;
    const source = definition.blocks.find(b => b.config.toolId === 'source.manual_table')!;
    source.config = { ...source.config, requireUpload: false, rows: [{ label: 'Item one', amount: 10 }, { label: 'Item two', amount: 20 }] };
    return runLocalWorkflowTools({ ...workflowDefinitionToCanvas(definition), workflowName: definition.name }).result.results.map(result => ({ block: result.blockId, status: result.status, errors: result.errors, output: result.output }));
  });
  expect(results.flatMap(result => result.errors)).toEqual([]);
  expect(results.find(result => result.block.endsWith('--result'))?.status).toBe('success');
  expect(results.find(result => result.block.endsWith('--calculate'))?.output.calculatedResults).toEqual({ RESULT: 60 });
});

test('server saves use recovery codes, reject stale writes, isolate workspaces and survive a fresh reader', async ({ request }) => {
  const key = randomBytes(32).toString('hex');
  const headers = { 'x-workflow-workspace': key };
  const url = 'http://localhost:5050/api/workflow-library';
  try {
    await expect((await request.get(url)).status()).toBe(401);
    const first = await request.put(url, { headers, data: { revision: 0, payload: '{"saved":"one"}' } }); expect(first.ok()).toBeTruthy();
    await expect((await request.get(url, { headers })).json()).resolves.toMatchObject({ revision: 1, payload: '{"saved":"one"}' });
    const stale = await request.put(url, { headers, data: { revision: 0, payload: '{"saved":"stale"}' } }); expect(stale.status()).toBe(409);
    await expect((await request.get(url, { headers: { 'x-workflow-workspace': randomBytes(32).toString('hex') } })).json()).resolves.toMatchObject({ revision: 0, payload: null });
    const second = await request.put(url, { headers, data: { revision: 1, payload: '{"saved":"two"}' } }); expect(second.ok()).toBeTruthy();
    await expect((await request.get(url, { headers })).json()).resolves.toMatchObject({ revision: 2, payload: '{"saved":"two"}' });
  } finally { await request.delete(url, { headers }); }
});

test('PDF extraction review creates numeric columns and produces a neutral final result', async ({ page }) => {
  await page.route('**/api/workflow-library', route => route.fulfill({ json: route.request().method() === 'GET' ? { revision: 0, payload: null } : { revision: 1 } }));
  await page.goto('/w/pf-document-calculator');
  await page.getByRole('button', { name: 'Build', exact: true }).click();
  await page.getByText('Test data — upload document or enter examples', { exact: true }).click();
  await page.getByLabel('Upload test document').setInputFiles('e2e/fixtures/demo/sales-check.pdf');
  await expect(page.getByLabel('Row 1 number_1')).toBeVisible({ timeout: 30000 });
  await expect(page.getByRole('button', { name: 'Use this test data', exact: true })).toBeDisabled();
  await page.getByLabel('Row 1 label', { exact: true }).fill('Item one');
  await page.getByLabel('Row 1 number_1', { exact: true }).fill('120');
  await page.getByLabel('Row 2 label', { exact: true }).fill('Item two');
  await page.getByLabel('Row 2 number_1', { exact: true }).fill('80');
  await page.getByLabel('Remove row 3', { exact: true }).click();
  await page.getByLabel('Number to calculate').selectOption('number_1');
  await page.getByLabel('Confirm extracted values').check();
  await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
  await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  await page.getByRole('button', { name: 'Save changes and run', exact: true }).click();
  const final = page.getByRole('region', { name: 'Final workflow results' });
  await expect(final).toContainText('Adjusted total'); await expect(final).toContainText('400'); await expect(final).toContainText('units');
  await expect(final).not.toContainText('formulaTrace');
});

test('precision survives a connection between separate calculation blocks', async ({ page }) => {
  await page.goto('/');
  const values = await page.evaluate(async () => {
    const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
    const { workflowDefinitionToCanvas } = await import('/src/shared/workflow-engine/local-fiscal-workflow.ts');
    const { runLocalWorkflowTools } = await import('/src/shared/workflow-engine/local-tool-runner.ts');
    const definition = templateDefinition('pf-document-calculator')!;
    const first = definition.blocks.find(block => block.config.toolId === 'logic.calculation_engine')!;
    const formula = (key: string, expression: string) => ({ calculationId: key, resultKey: key, label: key, operands: [], operation: 'pass_through', formulaExpression: expression });
    first.config = { toolId: 'logic.calculation_engine', mode: 'inline', formulas: [formula('A', '1 / 3')] };
    const second = { ...first, id: 'second-compute', config: { ...first.config, formulas: [formula('B', 'A * 3')] } };
    definition.blocks = [first, second];
    definition.edges = [{ ...definition.edges[1], sourceBlockId: first.id, targetBlockId: second.id, sourceOutputRole: 'named_values', targetInputRole: 'named_values' }];
    return runLocalWorkflowTools({ ...workflowDefinitionToCanvas(definition), workflowName: definition.name }).result.results.map(result => result.output.calculatedResults);
  });
  expect(values).toEqual([{ A: 1 / 3 }, { B: 1 }]);
});

test('missing API data cannot become zero or an implicit sample; changed requests cannot reuse mismatched responses', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(async () => {
    const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
    const { runCurrencyRateSource } = await import('/src/shared/workflow-engine/execution/blocks/source/currency-rate/run.ts');
    const { runHttpJsonSource } = await import('/src/shared/workflow-engine/execution/blocks/source/http-json/run.ts');
    const { apiRequestSignature } = await import('/src/shared/workflow-engine/api-snapshot.ts');
    const block = templateDefinition('pf-fapi')!.blocks.find(block => block.config.sourceKind === 'currency_rate')!;
    const run = (config: any, runner: any) => runner({ block: { ...block, config }, config, inputsByRole: {}, runId: 'source-check', startedAt: new Date().toISOString() });
    const fx = { documentCurrency: 'USD', reportingCurrency: 'CAD', fapiYear: 2025, overrideRate: null, liveRate: null };
    const http = { url: 'https://example.test/a', fetchedRows: [{ label: 'Rate', amount: 2 }] };
    return { missingFx: run(fx, runCurrencyRateSource), staleFx: run({ ...fx, liveRate: 1.4, rateFetchedFor: { documentCurrency: 'EUR', reportingCurrency: 'CAD', year: 2025 } }, runCurrencyRateSource), missingHttp: run({}, runHttpJsonSource), explicitSample: run({ useSampleData: true }, runHttpJsonSource), staleHttp: run({ ...http, url: 'https://example.test/b', fetchedRequestSignature: apiRequestSignature(http) }, runHttpJsonSource) };
  });
  for (const key of ['missingFx', 'staleFx', 'missingHttp', 'staleHttp'] as const) expect(result[key].status).toBe('error');
  expect(result.explicitSample.status).not.toBe('error');
  expect(result.explicitSample.warnings.join(' ')).toContain('sample');
});

test('documents without a text layer explicitly require OCR; reviewed OCR records reject invalid numbers', async ({ page, request }) => {
  const detected = await request.post('http://localhost:5050/api/workflow-extract', { multipart: { file: { name: 'no-text.pdf', mimeType: 'application/pdf', buffer: readFileSync('e2e/fixtures/demo/no-text.pdf') } } });
  expect(detected.ok()).toBeTruthy(); expect(await detected.json()).toMatchObject({ needsOcr: true, text: '' });
  await page.route('**/api/workflow-library', route => route.fulfill({ json: { revision: 0, payload: null } }));
  let requestedOcr = false;
  await page.route('**/api/workflow-extract', route => {
    requestedOcr = route.request().postData()?.includes('name="ocr"') ?? false;
    return route.fulfill({ json: requestedOcr ? { text: 'Item scanned 45\nItem other 5', method: 'ocr' } : { needsOcr: true, ocrAvailable: true, text: '' } });
  });
  await page.goto('/w/pf-document-calculator'); await page.getByRole('button', { name: 'Build', exact: true }).click();
  await page.getByText('Test data — upload document or enter examples', { exact: true }).click();
  await page.getByLabel('Upload test document').setInputFiles('e2e/fixtures/demo/no-text.pdf');
  await expect(page.getByText(/no readable text layer/)).toBeVisible();
  await page.getByRole('button', { name: 'Read scanned document with OCR', exact: true }).click();
  await expect(page.getByLabel('Row 1 number_1')).toHaveValue('45'); expect(requestedOcr).toBe(true);
  await page.getByLabel('Row 1 number_1').fill('12oops');
  await page.getByLabel('Number to calculate').selectOption('number_1'); await page.getByLabel('Confirm extracted values').check();
  await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
  await expect(page.getByText(/Row 1, number_1: enter a valid number/)).toBeVisible();
  await page.getByLabel('Row 1 number_1').fill('45'); await page.getByLabel('Confirm extracted values').check();
  await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
  await page.getByRole('button', { name: 'Run', exact: true }).first().click(); await page.getByRole('button', { name: 'Save changes and run', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Final workflow results' })).toContainText('100');
});

test('known empty categories total zero but matched rows with missing numbers cannot disappear', async ({ page }) => {
  await page.goto('/');
  const results = await page.evaluate(async () => {
    const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
    const { runCategoryRollupAggregator } = await import('/src/shared/workflow-engine/execution/blocks/logic/category-rollup-aggregator/run.ts');
    const block = templateDefinition('pf-document-calculator')!.blocks.find(block => block.config.toolId === 'logic.category_rollup_aggregator')!;
    const config = { rollupRules: [{ rollupId: 'total', label: 'Total', operation: 'sum', includeCategoryIds: ['present', 'empty'] }] };
    const run = (extra: any[]) => runCategoryRollupAggregator({ block: { ...block, config }, config, inputsByRole: {
      mapping_summary: [{ rulesUsed: [{ categoryId: 'present' }, { categoryId: 'empty' }] }],
      mapped_rows: [{ mappedRows: [{ label: 'Valid row', amount: 4, categoryId: 'present' }, ...extra] }],
    }, runId: 'empty-category', startedAt: new Date().toISOString() });
    return { valid: run([]), invalid: run([{ label: 'Missing amount', amount: null, value: 99, categoryId: 'present' }]) };
  });
  expect(results.valid.outputs.category_totals.categoryTotals).toEqual({ present: 4, empty: 0 });
  expect(results.valid.outputs.rollup_totals.rollupTotals.total).toBe(4);
  expect(results.invalid.status).toBe('error'); expect(results.invalid.errors.join(' ')).toContain('Missing amount');
});

test('numeric fields reject partial numbers and unknown aggregation categories fail instead of becoming zero', async ({ page }) => {
  await page.goto('/');
  const results = await page.evaluate(async () => {
    const { parseNumericInput } = await import('/src/shared/workflow-engine/numeric-input.ts');
    const { normalizeManualTableRow } = await import('/src/shared/workflow-engine/execution/blocks/source/manual-table/schema.ts');
    const { evaluateRollupGroups } = await import('/src/shared/workflow-engine/rollup-evaluation.ts');
    let error = ''; try { evaluateRollupGroups([{ rollupId: 'total', label: 'Total', operation: 'sum', includeCategoryIds: ['unknown'] }], {}); } catch (caught) { error = String(caught); }
    return { invalid: ['12oops', '$12$3', '1 2', ''].map(value => parseNumericInput(value)), formatted: ['1,234.56', '(1,234.56)', '1e-3', '.5', '1 234.56'].map(value => parseNumericInput(value)), missing: Number.isNaN(normalizeManualTableRow({ label: 'Missing', amount: null, value: 99 }, 0)?.amount), error };
  });
  expect(results.invalid).toEqual([null, null, null, null]); expect(results.formatted).toEqual([1234.56, -1234.56, 0.001, 0.5, 1234.56]);
  expect(results.missing).toBe(true); expect(results.error).toContain('Unknown category');
});


test('ordinary output can finish while workflows requiring a protected result retain that gate', async ({ page }) => {
  await page.goto('/');
  const results = await page.evaluate(async () => {
    const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
    const { getToolForBlock } = await import('/src/shared/workflow-engine/local-tool-registry.ts');
    const workflow = templateDefinition('pf-document-calculator')!;
    const output = workflow.blocks.find(block => block.id.endsWith('--result'))!;
    const calculate = workflow.blocks.find(block => block.id.endsWith('--calculate'))!;
    const source = { blockId: calculate.id, toolId: 'logic.calculation_engine', status: 'success', output: { calculatedResults: { RESULT: 60 } }, warnings: [], errors: [], evidenceRefs: [], sourceTrace: [], logs: [] };
    const context = { allResults: { [calculate.id]: source }, block: output, config: output.config, evidenceRefs: [], sourceTrace: [], runId: 'finality', startedAt: new Date().toISOString(), upstreamBlocks: [calculate], upstreamResults: [source], upstreamOutputs: source.output, workflow };
    const tool = getToolForBlock(output)!;
    const ordinary = tool.execute(context);
    const guarded = tool.execute({ ...context, workflow: { ...workflow, blocks: [...workflow.blocks, { ...calculate, id: 'required-protected-result', catalogId: 'protected:protected-result', config: { toolId: 'protected.protected_result' } }] } });
    return { ordinary, guarded };
  });
  expect(results.ordinary.status).toBe('success');
  expect(results.ordinary.warnings).toEqual([]);
  expect(results.guarded.status).toBe('warning');
  expect(results.guarded.warnings.join(' ')).toContain('still need review');
});
