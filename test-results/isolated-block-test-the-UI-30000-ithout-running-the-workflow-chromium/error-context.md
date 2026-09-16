# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: isolated-block-test.spec.ts >> the UI reuses individual aggregation and calculation results after reload without running the workflow
- Location: e2e/isolated-block-test.spec.ts:166:5

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByRole('region', { name: 'Individual block test' })
Expected substring: "prior block test"
Received string:    "Test Calculate on its ownOnly this block executes. You can reuse its recorded output in another block test.Test inputs Current block settings onlyExample inputsRecorded upstream outputsThese are saved snapshots; upstream blocks are not refreshed during this test.Aggregation groups: No usable result, or source settings changedExpected inputsCalculation values · OptionalCalculation rules (optional) · OptionalProtected/source inputs · OptionalRun this blockExecutes this block using the supplied test inputs. Results are labeled as a block test.Run blockThis block hasn't been run yet. Press Run block to execute Calculate and see its real output — the same executor the full workflow uses."
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for getByRole('region', { name: 'Individual block test' })
    14 × locator resolved to <section data-component-name="section" aria-label="Individual block test" class="grid min-h-0 flex-1 grid-cols-1 overflow-auto lg:grid-cols-2 lg:overflow-hidden" data-replit-metadata="artifacts/ai-workflow-builder/src/features/workflow-builder/ui/workspace/isolated-block-test.tsx:75:9">…</section>
       - unexpected value "Test Calculate on its ownOnly this block executes. You can reuse its recorded output in another block test.Test inputs Current block settings onlyExample inputsRecorded upstream outputsThese are saved snapshots; upstream blocks are not refreshed during this test.Aggregation groups: No usable result, or source settings changedExpected inputsCalculation values · OptionalCalculation rules (optional) · OptionalProtected/source inputs · OptionalRun this blockExecutes this block using the supplied test inputs. Results are labeled as a block test.Run blockThis block hasn't been run yet. Press Run block to execute Calculate and see its real output — the same executor the full workflow uses."

```

```yaml
- region "Individual block test":
  - heading "Test Calculate on its own" [level=3]
  - paragraph: Only this block executes. You can reuse its recorded output in another block test.
  - text: Test inputs
  - combobox "Block test input source":
    - option "Current block settings only"
    - option "Example inputs"
    - option "Recorded upstream outputs" [selected]
  - paragraph: These are saved snapshots; upstream blocks are not refreshed during this test.
  - paragraph: "Aggregation groups: No usable result, or source settings changed"
  - group: Expected inputs
  - heading "Run this block" [level=3]
  - paragraph: Executes this block using the supplied test inputs. Results are labeled as a block test.
  - button "Run block"
  - paragraph: This block hasn't been run yet. Press Run block to execute Calculate and see its real output — the same executor the full workflow uses.
```

# Test source

```ts
  79  |     const definition = templateDefinition('pf-fapi')!;
  80  |     const { createWorkflowBlockFromCatalog } = await import('/src/shared/workflow-engine/workflow/block-factory.ts');
  81  |     const rulebook = createWorkflowBlockFromCatalog('source:keyword-rules', { id: 'test-rulebook', label: 'Keyword Rulebook', position: { x: 0, y: 0 }, config: { keywordRules: [{ ruleId: 'items', categoryId: 'items', keyword: 'Item', matchType: 'contains', enabled: true }] } });
  82  |     definition.blocks.push(rulebook);
  83  |     const run = runLocalWorkflowTools({ ...workflowDefinitionToCanvas(definition), workflowName: definition.name, mode: 'isolated', selectedBlockId: rulebook.id });
  84  |     const neutral = templateDefinition('pf-document-calculator')!;
  85  |     const document = neutral.blocks.find(b => b.label === 'Document')!;
  86  |     const missing = runLocalWorkflowTools({ ...workflowDefinitionToCanvas(neutral), workflowName: neutral.name, mode: 'isolated', selectedBlockId: document.id });
  87  |     return { id: rulebook.id, result: run.result, missing: missing.result };
  88  |   });
  89  |   expect(result.result.results.map(r => r.blockId)).toEqual([result.id]);
  90  |   expect(result.result.results[0].output.keywordRules.length).toBeGreaterThan(0);
  91  |   expect(result.missing.results).toHaveLength(1);
  92  |   expect(result.missing.status).toBe('error');
  93  |   expect(result.missing.errors.join(' ')).toMatch(/upload|document/i);
  94  | });
  95  | 
  96  | async function openTest(page, label: string) {
  97  |   await page.goto('/w/pf-document-calculator');
  98  |   await page.getByRole('button', { name: 'Build', exact: true }).click();
  99  |   await page.getByRole('button', { name: label, exact: true }).click();
  100 |   await page.getByRole('button', { name: 'Test block', exact: true }).click();
  101 |   return page.getByRole('region', { name: 'Individual block test' });
  102 | }
  103 | 
  104 | test('standalone Compute accepts example numbers, flags stale results and validates inputs', async ({ page }, testInfo) => {
  105 |   const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  106 |   const panel = await openTest(page, 'Calculate');
  107 |   await expect(panel.getByLabel('Test value 1 name')).toHaveValue('item_total');
  108 |   await panel.getByLabel('Test value 1 number').fill('200');
  109 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  110 |   await expect(panel).toContainText('400');
  111 |   await panel.getByLabel('Test value 1 number').fill('220');
  112 |   await expect(panel.getByRole('status')).toContainText('Run again');
  113 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  114 |   await expect(panel).toContainText('440');
  115 |   await expect(panel.getByRole('status')).toHaveCount(0);
  116 |   await page.screenshot({ path: testInfo.outputPath('isolated-calculation.png'), fullPage: true });
  117 |   await panel.getByLabel('Test value 1 number').fill('');
  118 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  119 |   await expect(panel.getByRole('alert')).toContainText('Blank values are not zero');
  120 |   await panel.getByLabel('Block test input editor').selectOption('json');
  121 |   await panel.getByLabel('Block test input JSON').fill('null');
  122 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  123 |   await expect(panel.getByRole('alert')).toContainText('Enter an input object');
  124 |   await panel.getByLabel('Block test input JSON').fill('{"namedValues":{"item_total":0}}');
  125 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  126 |   await expect(panel.getByRole('alert')).toHaveCount(0);
  127 |   await expect(panel).toContainText('success');
  128 |   const stored = await page.evaluate(async () => {
  129 |     const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
  130 |     const { loadLocalRunRecords } = await import('/src/shared/workflow-engine/workflow/run-storage.ts');
  131 |     return { entries: Object.values(readWorkflowLibrary()), records: loadLocalRunRecords() };
  132 |   });
  133 |   expect(stored.entries.flatMap((e: any) => e.runs)).toHaveLength(0);
  134 |   expect(stored.records).toHaveLength(3);
  135 |   expect(stored.records.every(r => r.logs.length === 1)).toBe(true);
  136 |   expect(errors).toEqual([]);
  137 | });
  138 | 
  139 | test('example CSV uploads into one block without changing workflow data', async ({ page }) => {
  140 |   const panel = await openTest(page, 'Keyword rules');
  141 |   await panel.getByText(/Test data .* upload document or enter examples/).click();
  142 |   await panel.getByLabel('Upload test document').setInputFiles({ name: 'block-only.csv', mimeType: 'text/csv', buffer: Buffer.from('label,amount\nItem one,120\nItem two,80\nService,30\n') });
  143 |   await panel.getByRole('button', { name: 'Use this test data', exact: true }).click();
  144 |   await expect(panel.getByLabel('Test row 1 text')).toHaveValue('Item one');
  145 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  146 |   await expect(panel).toContainText('Items');
  147 |   const stored = await page.evaluate(async () => {
  148 |     const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
  149 |     const { loadLocalRunRecords } = await import('/src/shared/workflow-engine/workflow/run-storage.ts');
  150 |     return { entries: Object.values(readWorkflowLibrary()), result: loadLocalRunRecords()[0].logs[0].output };
  151 |   });
  152 |   expect(stored.result.output.mappedRows).toHaveLength(2);
  153 |   expect(stored.entries.every((entry: any) => entry.draft.blocks.every((b: any) => b.config.fileName !== 'block-only.csv'))).toBe(true);
  154 | });
  155 | 
  156 | test('recorded inputs are explicit and missing snapshots do not execute upstream blocks', async ({ page }) => {
  157 |   const panel = await openTest(page, 'Calculate');
  158 |   await panel.getByLabel('Block test input source').selectOption('recorded');
  159 |   await expect(panel).toContainText('Aggregation groups');
  160 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  161 |   await expect(panel.getByRole('alert')).toContainText('No usable recorded result');
  162 |   const records = await page.evaluate(async () => (await import('/src/shared/workflow-engine/workflow/run-storage.ts')).loadLocalRunRecords());
  163 |   expect(records).toHaveLength(0);
  164 | });
  165 | 
  166 | test('the UI reuses individual aggregation and calculation results after reload without running the workflow', async ({ page }, testInfo) => {
  167 |   let panel = await openTest(page, 'Aggregation groups');
  168 |   await expect(panel.getByLabel('Test record type')).toHaveValue('mappedRows');
  169 |   for (const [index, amount] of [120, 80].entries()) {
  170 |     await panel.getByRole('button', { name: 'Add test record', exact: true }).click();
  171 |     await panel.getByLabel(`Test row ${index + 1} text`).fill(`Item ${index + 1}`);
  172 |     await panel.getByLabel(`Test row ${index + 1} number`).fill(String(amount));
  173 |     await panel.getByLabel(`Test row ${index + 1} category`).fill('items');
  174 |   }
  175 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  176 |   await expect(panel).toContainText('200');
  177 |   panel = await openTest(page, 'Calculate');
  178 |   await panel.getByLabel('Block test input source').selectOption('recorded');
> 179 |   await expect(panel).toContainText('prior block test');
      |                       ^ Error: expect(locator).toContainText(expected) failed
  180 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  181 |   await expect(panel).toContainText('400');
  182 |   await page.getByRole('button', { name: 'Input & Output', exact: true }).click();
  183 |   await expect(page.getByTestId('block-io-panel')).toContainText('Individual block test');
  184 |   panel = await openTest(page, 'Final result');
  185 |   await panel.getByLabel('Block test input source').selectOption('recorded');
  186 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  187 |   await expect(panel).toContainText('400');
  188 |   await page.screenshot({ path: testInfo.outputPath('individual-final-output.png'), fullPage: true });
  189 |   const stored = await page.evaluate(async () => {
  190 |     const { loadLocalRunRecords } = await import('/src/shared/workflow-engine/workflow/run-storage.ts');
  191 |     return loadLocalRunRecords();
  192 |   });
  193 |   expect(stored).toHaveLength(3);
  194 |   expect(stored.every(r => r.logs.length === 1)).toBe(true);
  195 |   expect(stored[0].logs[0].output.output.canonicalJson.calculated_results.RESULT).toBe(400);
  196 | });
  197 | 
  198 | test('large example imports paginate editable records and process every row', async ({ page }) => {
  199 |   const panel = await openTest(page, 'Keyword rules');
  200 |   await panel.getByText(/Test data .* upload document or enter examples/).click();
  201 |   await panel.getByLabel('Upload test document').setInputFiles({ name: 'many-items.csv', mimeType: 'text/csv', buffer: Buffer.from('label,amount\n' + Array.from({ length: 500 }, (_, i) => `Item ${i + 1},${i + 1}`).join('\n')) });
  202 |   await panel.getByRole('button', { name: 'Use this test data', exact: true }).click();
  203 |   await expect(panel.getByRole('textbox', { name: /^Test row .* text$/ })).toHaveCount(25);
  204 |   await panel.getByRole('button', { name: 'Next test records', exact: true }).click();
  205 |   await expect(panel.getByLabel('Test row 26 text')).toHaveValue('Item 26');
  206 |   await panel.getByLabel('Test row 26 number').fill('0');
  207 |   const start = Date.now();
  208 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  209 |   const result = await page.evaluate(async () => (await import('/src/shared/workflow-engine/workflow/run-storage.ts')).loadLocalRunRecords()[0].logs[0].output);
  210 |   expect(result.output.mappedRows).toHaveLength(500);
  211 |   expect(result.output.mappedRows[25].amount).toBe(0);
  212 |   expect(Date.now() - start).toBeLessThan(5000);
  213 | });
  214 | 
  215 | test('isolated calculation combines an aggregate snapshot with a source-qualified API field and literal numbers', async ({ page }) => {
  216 |   await page.goto('/');
  217 |   const result = await page.evaluate(async () => {
  218 |     const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
  219 |     const { createWorkflowBlockFromCatalog } = await import('/src/shared/workflow-engine/workflow/block-factory.ts');
  220 |     const { workflowDefinitionToCanvas } = await import('/src/shared/workflow-engine/workflow/canvas.ts');
  221 |     const { runLocalWorkflowTools } = await import('/src/shared/workflow-engine/local-tool-runner.ts');
  222 |     const { exampleInput } = await import('/src/shared/workflow-engine/block-test-inputs.ts');
  223 |     const { calculationValueKey } = await import('/src/shared/workflow-engine/calculation-values.ts');
  224 |     const d = templateDefinition('pf-document-calculator')!;
  225 |     const compute = d.blocks.find(b => b.label === 'Calculate')!;
  226 |     const api = createWorkflowBlockFromCatalog('source:api-http-request', { id: 'api-rate', label: 'Exchange rate API', position: { x: 0, y: 0 } });
  227 |     const apiInput = exampleInput({ rawRows: [{ rate: 2.5 }] });
  228 |     apiInput.block = api; apiInput.result.blockId = api.id;
  229 |     compute.config.formulas[0].formulaExpression = `item_total * ${calculationValueKey(api.id, ['rawRows', '0', 'rate'])} * 500 / 2`;
  230 |     return runLocalWorkflowTools({ ...workflowDefinitionToCanvas(d), workflowName: d.name, mode: 'isolated', selectedBlockId: compute.id, isolatedInputs: [exampleInput({ namedValues: { item_total: 200 } }), apiInput], testInputSource: 'recorded' }).result;
  231 |   });
  232 |   expect(result.results).toHaveLength(1);
  233 |   expect(result.errors).toEqual([]);
  234 |   expect(result.results[0].output.calculatedResults.RESULT).toBe(125000);
  235 | });
  236 | 
  237 | test('an unconfigured document source reports missing data in its own test', async ({ page }) => {
  238 |   const panel = await openTest(page, 'Document');
  239 |   await expect(panel.getByLabel('Block test input source')).toHaveValue('none');
  240 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  241 |   await expect(panel).toContainText('No document records supplied');
  242 |   await expect(panel).toContainText('error');
  243 | });
  244 | 
```