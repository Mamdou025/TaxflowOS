# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workflow-remediation.spec.ts >> server saves use recovery codes, reject stale writes, isolate workspaces and survive a fresh reader
- Location: e2e/workflow-remediation.spec.ts:57:5

# Error details

```
Error: apiRequestContext.delete: connect EAFNOSUPPORT ::1:5050 - Local (undefined:undefined)
Call log:
  - → DELETE http://localhost:5050/api/workflow-library
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.7922.34 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - x-workflow-workspace: 63df65bd961268c5e4226882a136bd15b807994c322d29f1bfeb66a107e3d4c8

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { randomBytes } from 'node:crypto';
  3   | import { readFileSync } from 'node:fs';
  4   | 
  5   | test('missing and blank values stop calculations; explicit defaults preserve real zero; intermediate precision survives', async ({ page }) => {
  6   |   await page.goto('/');
  7   |   const results = await page.evaluate(async () => {
  8   |     const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
  9   |     const { runCalculationEngine } = await import('/src/shared/workflow-engine/execution/blocks/logic/calculation-engine/run.ts');
  10  |     const block = templateDefinition('pf-document-calculator')!.blocks.find(b => b.config.toolId === 'logic.calculation_engine')!;
  11  |     const formula = (key: string, expression: string, roundingDigits?: number) => ({ calculationId: key, resultKey: key, label: key, formulaExpression: expression, operation: 'pass_through', operands: [], roundingDigits });
  12  |     const run = (formulas: any[], namedValues = {}, inputDefaults = {}) => {
  13  |       const config = { mode: 'inline', formulas, inputDefaults };
  14  |       return runCalculationEngine({ block: { ...block, config }, config, inputsByRole: { named_values: [{ namedValues }] }, runId: 'remediation', startedAt: new Date().toISOString() });
  15  |     };
  16  |     return { scientific: run([formula('SMALL', '1e-8 * 100000000'), formula('LARGE', '1E+8 / 100000000')]), missing: run([formula('A', 'missing + 1')]), blank: run([formula('A', 'blank + 1')], { blank: '' }), defaults: run([formula('A', 'missing + 1')], {}, { missing: 8 }), zero: run([formula('A', 'present + 1')], { present: 0 }, { present: 8 }), precision: run([formula('A', '1 / 3'), formula('B', 'A * 3')]), rounded: run([formula('A', '1 / 3', 2), formula('B', 'A * 3')]), ties: run([formula('POS', 'round(1.005, 2)'), formula('NEG', 'round(-1.005, 2)')]), syntax: ['abs()', 'round(1, 99)', 'max(1,2', '500 / 0'].map(expression => run([formula('A', expression)])) };
  17  |   });
  18  |   expect(results.scientific.outputs.calculated_results.calculatedResults).toEqual({ SMALL: 1, LARGE: 1 });
  19  |   expect(results.missing.status).toBe('error'); expect(results.blank.status).toBe('error');
  20  |   expect(results.defaults.outputs.calculated_results.calculatedResults.A).toBe(9);
  21  |   expect(results.defaults.warnings.join(' ')).toContain('explicit default');
  22  |   expect(results.zero.outputs.calculated_results.calculatedResults.A).toBe(1);
  23  |   expect(results.precision.outputs.calculated_results.calculatedResults).toEqual({ A: 1 / 3, B: 1 });
  24  |   expect(results.rounded.outputs.calculated_results.calculatedResults).toEqual({ A: 0.33, B: 0.99 });
  25  |   expect(results.ties.outputs.calculated_results.calculatedResults).toEqual({ POS: 1.01, NEG: -1.01 });
  26  |   for (const result of results.syntax) expect(result.status).toBe('error');
  27  | });
  28  | 
  29  | test('document parsing preserves quoted records, zero, decimal conventions and numeric candidates', async ({ page }) => {
  30  |   await page.goto('/');
  31  |   const result = await page.evaluate(async () => {
  32  |     const { parseDelimitedRecords, parseDocumentNumber, textDocumentRecords } = await import('/src/features/workflows-hub/document-records.ts');
  33  |     let malformed = false; try { parseDelimitedRecords('label,amount\n"unclosed,20', ','); } catch { malformed = true; }
  34  |     return { rows: parseDelimitedRecords('label,amount\n"Item, one",0\n"Item\ntwo",20', ','), us: parseDocumentNumber('1,234.56'), eu: parseDocumentNumber('1.234,56', ','), invalid: parseDocumentNumber('12oops'), empty: parseDocumentNumber(''), text: textDocumentRecords('Widget order 120\nDelivery 0'), malformed };
  35  |   });
  36  |   expect(result.rows).toEqual([{ label: 'Item, one', amount: 0 }, { label: 'Item\ntwo', amount: 20 }]);
  37  |   expect(result.us).toBe(1234.56); expect(result.eu).toBe(1234.56); expect(result.invalid).toBeNull(); expect(result.empty).toBeNull();
  38  |   expect(result.text[0]).toMatchObject({ label: 'Widget order 120', number_1: '120' }); expect(result.malformed).toBe(true);
  39  | });
  40  | 
  41  | test('neutral template executes without fiscal inputs', async ({ page }) => {
  42  |   await page.goto('/');
  43  |   const results = await page.evaluate(async () => {
  44  |     const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
  45  |     const { workflowDefinitionToCanvas } = await import('/src/shared/workflow-engine/local-fiscal-workflow.ts');
  46  |     const { runLocalWorkflowTools } = await import('/src/shared/workflow-engine/local-tool-runner.ts');
  47  |     const definition = templateDefinition('pf-document-calculator')!;
  48  |     const source = definition.blocks.find(b => b.config.toolId === 'source.manual_table')!;
  49  |     source.config = { ...source.config, requireUpload: false, rows: [{ label: 'Item one', amount: 10 }, { label: 'Item two', amount: 20 }] };
  50  |     return runLocalWorkflowTools({ ...workflowDefinitionToCanvas(definition), workflowName: definition.name }).result.results.map(result => ({ block: result.blockId, status: result.status, errors: result.errors, output: result.output }));
  51  |   });
  52  |   expect(results.flatMap(result => result.errors)).toEqual([]);
  53  |   expect(results.find(result => result.block.endsWith('--result'))?.status).toBe('success');
  54  |   expect(results.find(result => result.block.endsWith('--calculate'))?.output.calculatedResults).toEqual({ RESULT: 60 });
  55  | });
  56  | 
  57  | test('server saves use recovery codes, reject stale writes, isolate workspaces and survive a fresh reader', async ({ request }) => {
  58  |   const key = randomBytes(32).toString('hex');
  59  |   const headers = { 'x-workflow-workspace': key };
  60  |   const url = 'http://localhost:5050/api/workflow-library';
  61  |   try {
  62  |     await expect((await request.get(url)).status()).toBe(401);
  63  |     const first = await request.put(url, { headers, data: { revision: 0, payload: '{"saved":"one"}' } }); expect(first.ok()).toBeTruthy();
  64  |     await expect((await request.get(url, { headers })).json()).resolves.toMatchObject({ revision: 1, payload: '{"saved":"one"}' });
  65  |     const stale = await request.put(url, { headers, data: { revision: 0, payload: '{"saved":"stale"}' } }); expect(stale.status()).toBe(409);
  66  |     await expect((await request.get(url, { headers: { 'x-workflow-workspace': randomBytes(32).toString('hex') } })).json()).resolves.toMatchObject({ revision: 0, payload: null });
  67  |     const second = await request.put(url, { headers, data: { revision: 1, payload: '{"saved":"two"}' } }); expect(second.ok()).toBeTruthy();
  68  |     await expect((await request.get(url, { headers })).json()).resolves.toMatchObject({ revision: 2, payload: '{"saved":"two"}' });
> 69  |   } finally { await request.delete(url, { headers }); }
      |                                   ^ Error: apiRequestContext.delete: connect EAFNOSUPPORT ::1:5050 - Local (undefined:undefined)
  70  | });
  71  | 
  72  | test('PDF extraction review creates numeric columns and produces a neutral final result', async ({ page }) => {
  73  |   await page.route('**/api/workflow-library', route => route.fulfill({ json: route.request().method() === 'GET' ? { revision: 0, payload: null } : { revision: 1 } }));
  74  |   await page.goto('/w/pf-document-calculator');
  75  |   await page.getByRole('button', { name: 'Build', exact: true }).click();
  76  |   await page.getByText('Test data — upload document or enter examples', { exact: true }).click();
  77  |   await page.getByLabel('Upload test document').setInputFiles('e2e/fixtures/demo/sales-check.pdf');
  78  |   await expect(page.getByLabel('Row 1 number_1')).toBeVisible({ timeout: 30000 });
  79  |   await expect(page.getByRole('button', { name: 'Use this test data', exact: true })).toBeDisabled();
  80  |   await page.getByLabel('Row 1 label', { exact: true }).fill('Item one');
  81  |   await page.getByLabel('Row 1 number_1', { exact: true }).fill('120');
  82  |   await page.getByLabel('Row 2 label', { exact: true }).fill('Item two');
  83  |   await page.getByLabel('Row 2 number_1', { exact: true }).fill('80');
  84  |   await page.getByLabel('Remove row 3', { exact: true }).click();
  85  |   await page.getByLabel('Number to calculate').selectOption('number_1');
  86  |   await page.getByLabel('Confirm extracted values').check();
  87  |   await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
  88  |   await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  89  |   await page.getByRole('button', { name: 'Save changes and run', exact: true }).click();
  90  |   const final = page.getByRole('region', { name: 'Final workflow results' });
  91  |   await expect(final).toContainText('Adjusted total'); await expect(final).toContainText('400'); await expect(final).toContainText('units');
  92  |   await expect(final).not.toContainText('formulaTrace');
  93  | });
  94  | 
  95  | test('precision survives a connection between separate calculation blocks', async ({ page }) => {
  96  |   await page.goto('/');
  97  |   const values = await page.evaluate(async () => {
  98  |     const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
  99  |     const { workflowDefinitionToCanvas } = await import('/src/shared/workflow-engine/local-fiscal-workflow.ts');
  100 |     const { runLocalWorkflowTools } = await import('/src/shared/workflow-engine/local-tool-runner.ts');
  101 |     const definition = templateDefinition('pf-document-calculator')!;
  102 |     const first = definition.blocks.find(block => block.config.toolId === 'logic.calculation_engine')!;
  103 |     const formula = (key: string, expression: string) => ({ calculationId: key, resultKey: key, label: key, operands: [], operation: 'pass_through', formulaExpression: expression });
  104 |     first.config = { toolId: 'logic.calculation_engine', mode: 'inline', formulas: [formula('A', '1 / 3')] };
  105 |     const second = { ...first, id: 'second-compute', config: { ...first.config, formulas: [formula('B', 'A * 3')] } };
  106 |     definition.blocks = [first, second];
  107 |     definition.edges = [{ ...definition.edges[1], sourceBlockId: first.id, targetBlockId: second.id, sourceOutputRole: 'named_values', targetInputRole: 'named_values' }];
  108 |     return runLocalWorkflowTools({ ...workflowDefinitionToCanvas(definition), workflowName: definition.name }).result.results.map(result => result.output.calculatedResults);
  109 |   });
  110 |   expect(values).toEqual([{ A: 1 / 3 }, { B: 1 }]);
  111 | });
  112 | 
  113 | test('missing API data cannot become zero or an implicit sample; changed requests cannot reuse mismatched responses', async ({ page }) => {
  114 |   await page.goto('/');
  115 |   const result = await page.evaluate(async () => {
  116 |     const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
  117 |     const { runCurrencyRateSource } = await import('/src/shared/workflow-engine/execution/blocks/source/currency-rate/run.ts');
  118 |     const { runHttpJsonSource } = await import('/src/shared/workflow-engine/execution/blocks/source/http-json/run.ts');
  119 |     const { apiRequestSignature } = await import('/src/shared/workflow-engine/api-snapshot.ts');
  120 |     const block = templateDefinition('pf-fapi')!.blocks.find(block => block.config.sourceKind === 'currency_rate')!;
  121 |     const run = (config: any, runner: any) => runner({ block: { ...block, config }, config, inputsByRole: {}, runId: 'source-check', startedAt: new Date().toISOString() });
  122 |     const fx = { documentCurrency: 'USD', reportingCurrency: 'CAD', fapiYear: 2025, overrideRate: null, liveRate: null };
  123 |     const http = { url: 'https://example.test/a', fetchedRows: [{ label: 'Rate', amount: 2 }] };
  124 |     return { missingFx: run(fx, runCurrencyRateSource), staleFx: run({ ...fx, liveRate: 1.4, rateFetchedFor: { documentCurrency: 'EUR', reportingCurrency: 'CAD', year: 2025 } }, runCurrencyRateSource), missingHttp: run({}, runHttpJsonSource), explicitSample: run({ useSampleData: true }, runHttpJsonSource), staleHttp: run({ ...http, url: 'https://example.test/b', fetchedRequestSignature: apiRequestSignature(http) }, runHttpJsonSource) };
  125 |   });
  126 |   for (const key of ['missingFx', 'staleFx', 'missingHttp', 'staleHttp'] as const) expect(result[key].status).toBe('error');
  127 |   expect(result.explicitSample.status).not.toBe('error');
  128 |   expect(result.explicitSample.warnings.join(' ')).toContain('sample');
  129 | });
  130 | 
  131 | test('documents without a text layer explicitly require OCR; reviewed OCR records reject invalid numbers', async ({ page, request }) => {
  132 |   const detected = await request.post('http://localhost:5050/api/workflow-extract', { multipart: { file: { name: 'no-text.pdf', mimeType: 'application/pdf', buffer: readFileSync('e2e/fixtures/demo/no-text.pdf') } } });
  133 |   expect(detected.ok()).toBeTruthy(); expect(await detected.json()).toMatchObject({ needsOcr: true, text: '' });
  134 |   await page.route('**/api/workflow-library', route => route.fulfill({ json: { revision: 0, payload: null } }));
  135 |   let requestedOcr = false;
  136 |   await page.route('**/api/workflow-extract', route => {
  137 |     requestedOcr = route.request().postData()?.includes('name="ocr"') ?? false;
  138 |     return route.fulfill({ json: requestedOcr ? { text: 'Item scanned 45\nItem other 5', method: 'ocr' } : { needsOcr: true, ocrAvailable: true, text: '' } });
  139 |   });
  140 |   await page.goto('/w/pf-document-calculator'); await page.getByRole('button', { name: 'Build', exact: true }).click();
  141 |   await page.getByText('Test data — upload document or enter examples', { exact: true }).click();
  142 |   await page.getByLabel('Upload test document').setInputFiles('e2e/fixtures/demo/no-text.pdf');
  143 |   await expect(page.getByText(/no readable text layer/)).toBeVisible();
  144 |   await page.getByRole('button', { name: 'Read scanned document with OCR', exact: true }).click();
  145 |   await expect(page.getByLabel('Row 1 number_1')).toHaveValue('45'); expect(requestedOcr).toBe(true);
  146 |   await page.getByLabel('Row 1 number_1').fill('12oops');
  147 |   await page.getByLabel('Number to calculate').selectOption('number_1'); await page.getByLabel('Confirm extracted values').check();
  148 |   await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
  149 |   await expect(page.getByText(/Row 1, number_1: enter a valid number/)).toBeVisible();
  150 |   await page.getByLabel('Row 1 number_1').fill('45'); await page.getByLabel('Confirm extracted values').check();
  151 |   await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
  152 |   await page.getByRole('button', { name: 'Run', exact: true }).first().click(); await page.getByRole('button', { name: 'Save changes and run', exact: true }).click();
  153 |   await expect(page.getByRole('region', { name: 'Final workflow results' })).toContainText('100');
  154 | });
  155 | 
  156 | test('known empty categories total zero but matched rows with missing numbers cannot disappear', async ({ page }) => {
  157 |   await page.goto('/');
  158 |   const results = await page.evaluate(async () => {
  159 |     const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
  160 |     const { runCategoryRollupAggregator } = await import('/src/shared/workflow-engine/execution/blocks/logic/category-rollup-aggregator/run.ts');
  161 |     const block = templateDefinition('pf-document-calculator')!.blocks.find(block => block.config.toolId === 'logic.category_rollup_aggregator')!;
  162 |     const config = { rollupRules: [{ rollupId: 'total', label: 'Total', operation: 'sum', includeCategoryIds: ['present', 'empty'] }] };
  163 |     const run = (extra: any[]) => runCategoryRollupAggregator({ block: { ...block, config }, config, inputsByRole: {
  164 |       mapping_summary: [{ rulesUsed: [{ categoryId: 'present' }, { categoryId: 'empty' }] }],
  165 |       mapped_rows: [{ mappedRows: [{ label: 'Valid row', amount: 4, categoryId: 'present' }, ...extra] }],
  166 |     }, runId: 'empty-category', startedAt: new Date().toISOString() });
  167 |     return { valid: run([]), invalid: run([{ label: 'Missing amount', amount: null, value: 99, categoryId: 'present' }]) };
  168 |   });
  169 |   expect(results.valid.outputs.category_totals.categoryTotals).toEqual({ present: 4, empty: 0 });
```