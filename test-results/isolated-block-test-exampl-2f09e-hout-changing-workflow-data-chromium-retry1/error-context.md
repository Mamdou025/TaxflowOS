# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: isolated-block-test.spec.ts >> example CSV uploads into one block without changing workflow data
- Location: e2e/isolated-block-test.spec.ts:150:5

# Error details

```
Error: expect(locator).toHaveValue(expected) failed

Locator: getByRole('region', { name: 'Individual block test' }).getByLabel('Test row 1 text')
Expected: "Item one"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveValue" with timeout 5000ms
  - waiting for getByRole('region', { name: 'Individual block test' }).getByLabel('Test row 1 text')

```

```yaml
- group: "Workspace: Synthetic workspace (owner)"
- button "Open chat": InScope
- button "Collapse sidebar"
- button "New chat"
- button "Workspace"
- button "Chat"
- button "Workflows"
- button "Sources"
- button "Connections"
- button "Recent conversations"
- text: No saved chats yet.
- button "Workflows"
- group: Saved to server
- button "Library"
- button "Run history"
- button "New workflow"
- text: MY WORKFLOWS
- button "Document calculation fixture — Imported"
- text: Platform services
- button "Scope Service"
- button "Tax Position Summary Workpaper"
- button "Data Readiness Service"
- button "Execution Readiness & Review Checklist"
- text: Foundation
- button "Ownership Graph Workpaper"
- button "Tax Attribute Continuity Workpaper"
- button "Portfolio Calendar & Requests Workpaper"
- text: Tier 1
- button "FAPI Calculation (portfolio)"
- button "T1134 Affiliate Reporting Workpaper"
- button "Foreign Affiliate Surplus Continuity Workpaper"
- button "T106 Transaction Workpaper"
- button "EIFEL Fixed-Ratio Scenario Workpaper"
- button "T2 Taxable Income Bridge Workpaper"
- button "Corporate Tax Provision Workpaper"
- button "Part XIII Withholding Workpaper"
- button "Settings"
- button "Help"
- group "Theme":
  - button "Light" [pressed]
  - button "Dark"
- button "Workflows"
- text: Document calculation fixture — Imported Unsaved changes
- button "Overview"
- button "Build"
- button "Run"
- button "Results"
- button "Agent Lab"
- button "Undo" [disabled]
- button "Redo" [disabled]
- button "Fit"
- button "Save"
- button "Run"
- group: Test data — upload document or enter examples
- text: Fiscal Flow Source → Logic → Review / Validation Protected → Output
- application:
  - img:
    - group "Edge from pf-document-calculator--start to pf-document-calculator--document"
  - img:
    - group "Edge from pf-document-calculator--document to pf-document-calculator--rules"
  - img:
    - group "Edge from pf-document-calculator--rules to pf-document-calculator--groups"
  - img:
    - group "Edge from pf-document-calculator--groups to pf-document-calculator--calculate"
  - img:
    - group "Edge from pf-document-calculator--calculate to pf-document-calculator--result"
  - group:
    - button "Start"
  - group:
    - button "Document"
  - group:
    - button "Keyword rules"
  - group:
    - button "Aggregation groups"
  - group:
    - button "Calculate"
  - group:
    - button "Final result"
  - img
  - group:
    - button "Zoom in"
    - button "Zoom out"
    - button "Fit view"
    - button "Show minimap"
  - link "React Flow attribution":
    - /url: https://reactflow.dev/attribution
    - text: React Flow
- separator "Drag to resize"
- text: Chat panel
- button "Hide chat panel"
- button "Expand chat panel"
- text: Agent
- combobox "Chat agent":
  - option "Sina" [selected]
  - option "MicroSina · Foundry"
- button "Mkoro computer settings": Mkoro computer Unverified
- button "Choose client — Scope reads their worksheets & documents"
- button "N Northstar Inc"
- button "Work"
- 'button "Context: 0 selected, 0 used"'
- button "Tools": "9"
- text: Good morning, Sophia What would you like to work on?
- textbox "Ask Scope, or describe a task…"
- button "Add — search, workflows, worksheets"
- button "Attach files"
- 'button "Chat agent: Sina"': Sina
- button "Send" [disabled]
- region "Notifications alt+T"
- heading "Block workspace" [level=2]
- button "Close"
- button "Test block"
- button "Test with upstream blocks"
- text: Test this block alone, or run the blocks supplying its inputs.
- region "Individual block test":
  - heading "Test Keyword rules on its own" [level=3]
  - paragraph: Only this block executes. You can reuse its recorded output in another block test.
  - text: Test inputs
  - combobox "Block test input source":
    - option "Current block settings only"
    - option "Example inputs" [selected]
    - option "Recorded upstream outputs"
  - paragraph: Examples are only used for this test. They do not replace workflow documents or saved API data.
  - text: Input editor
  - combobox "Block test input editor":
    - option "Form" [selected]
    - option "JSON"
  - heading "Numbers for calculations" [level=4]
  - button "Add test value"
  - heading "Example records" [level=4]
  - text: Supply records as
  - combobox "Test record type":
    - option "Document records" [selected]
    - option "Categorized records"
  - button "Add test record"
  - group:
    - text: Test data — upload document or enter examples Document source
    - combobox "Document source":
      - option "Example document" [selected]
    - button "Upload test document"
    - button "Enter example data / JSON"
    - paragraph: Check the extracted records before using them. Text without numbers can still be classified; enter numerical fields when needed for calculations.
    - text: Text to classify
    - combobox "Text to classify":
      - option "Use existing fields" [selected]
      - option "label"
      - option "amount"
    - text: Number to calculate
    - combobox "Number to calculate":
      - option "Use existing fields" [selected]
      - option "label"
      - option "amount"
    - text: Decimal separator
    - combobox "Document decimal separator":
      - 'option "Point: 1,234.56" [selected]'
      - 'option "Comma: 1.234,56"'
    - paragraph: 3 records · edit values and choose numeric columns before applying.
    - table:
      - rowgroup:
        - row "label Text amount Number Remove":
          - columnheader "label Text":
            - text: label
            - combobox "Column type label":
              - option "Text" [selected]
              - option "Number"
          - columnheader "amount Number":
            - text: amount
            - combobox "Column type amount":
              - option "Text"
              - option "Number" [selected]
          - columnheader "Remove"
      - rowgroup:
        - row "Item one 120 Remove row 1":
          - cell "Item one":
            - textbox "Row 1 label": Item one
          - cell "120":
            - textbox "Row 1 amount": "120"
          - cell "Remove row 1":
            - button "Remove row 1": Remove
        - row "Item two 80 Remove row 2":
          - cell "Item two":
            - textbox "Row 2 label": Item two
          - cell "80":
            - textbox "Row 2 amount": "80"
          - cell "Remove row 2":
            - button "Remove row 2": Remove
        - row "Service 30 Remove row 3":
          - cell "Service":
            - textbox "Row 3 label": Service
          - cell "30":
            - textbox "Row 3 amount": "30"
          - cell "Remove row 3":
            - button "Remove row 3": Remove
    - button "Previous records" [disabled]
    - text: Page 1 of 1
    - button "Next records" [disabled]
    - button "Add record"
    - textbox "New document field":
      - /placeholder: New field name
    - button "Add field" [disabled]
    - group: Original structured preview / JSON
    - button "Use this test data"
    - button "Cancel"
  - group: Expected inputs
  - heading "Run this block" [level=3]
  - paragraph: Executes this block using the supplied test inputs. Results are labeled as a block test.
  - button "Run block"
  - paragraph: This block hasn't been run yet. Press Run block to execute Keyword rules and see its real output — the same executor the full workflow uses.
- button "Properties"
- button "Input & Output"
- button "Runs"
```

# Test source

```ts
  55  |     const output = run('Final result', [calculated.input]);
  56  |     const blank = run('Aggregation groups', [exampleInput({ mappedRows: [{ rowId: 'blank', label: 'Item', categoryId: 'items', amount: null }] })], 'examples');
  57  |     const calcBlock = definition.blocks.find(b => b.label === 'Calculate')!;
  58  |     const valid = !!recordedBlockInput(calcBlock, records);
  59  |     const latestError = { ...calculated.run.record, logs: calculated.run.record.logs.map(log => ({ ...log, output: { ...log.output, status: 'error', errors: ['failed'] } })) };
  60  |     const rejectsLatestFailure = !recordedBlockInput(calcBlock, [latestError, ...records]);
  61  |     calcBlock.config.formulas[0].formulaExpression = 'item_total * 3';
  62  |     const rejectsChangedSettings = !recordedBlockInput(calcBlock, records);
  63  |     return { results: [classified, grouped, calculated, output, blank].map(item => item.run.result), valid, rejectsLatestFailure, rejectsChangedSettings };
  64  |   });
  65  |   for (const run of result.results) expect(run.results).toHaveLength(1);
  66  |   expect(result.results[0].results[0].output.mappedRows).toHaveLength(2);
  67  |   expect(result.results[0].results[0].output.unmatchedRows).toHaveLength(1);
  68  |   expect(result.results[1].results[0].output.rollupTotals.item_total).toBe(200);
  69  |   expect(result.results[2].results[0].output.calculatedResults.RESULT).toBe(400);
  70  |   expect(result.results[3].results[0].output.canonicalJson.calculated_results.RESULT).toBe(400);
  71  |   expect(result.results[4].status).toBe('error');
  72  |   expect(result.valid && result.rejectsLatestFailure && result.rejectsChangedSettings).toBe(true);
  73  | });
  74  | 
  75  | test('source and rulebook tests execute themselves and report missing documents', async ({ page }) => {
  76  |   await page.goto('/');
  77  |   const result = await page.evaluate(async () => {
  78  |     const { DOCUMENT_CALCULATOR_CONFIG } = await import('/src/shared/workflow-engine/runtime/workflow-runs/document-calculator.ts');
  79  |     const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
  80  |     const { workflowDefinitionToCanvas } = await import('/src/shared/workflow-engine/workflow/canvas.ts');
  81  |     const { runLocalWorkflowTools } = await import('/src/shared/workflow-engine/local-tool-runner.ts');
  82  |     const definition = templateDefinition('pf-fapi')!;
  83  |     const { createWorkflowBlockFromCatalog } = await import('/src/shared/workflow-engine/workflow/block-factory.ts');
  84  |     const rulebook = createWorkflowBlockFromCatalog('source:keyword-rules', { id: 'test-rulebook', label: 'Keyword Rulebook', position: { x: 0, y: 0 }, config: { keywordRules: [{ ruleId: 'items', categoryId: 'items', keyword: 'Item', matchType: 'contains', enabled: true }] } });
  85  |     definition.blocks.push(rulebook);
  86  |     const run = runLocalWorkflowTools({ ...workflowDefinitionToCanvas(definition), workflowName: definition.name, mode: 'isolated', selectedBlockId: rulebook.id });
  87  |     const neutral = DOCUMENT_CALCULATOR_CONFIG.buildSnapshot();
  88  |     const document = neutral.blocks.find(b => b.label === 'Document')!;
  89  |     const missing = runLocalWorkflowTools({ ...workflowDefinitionToCanvas(neutral), workflowName: neutral.name, mode: 'isolated', selectedBlockId: document.id });
  90  |     return { id: rulebook.id, result: run.result, missing: missing.result };
  91  |   });
  92  |   expect(result.result.results.map(r => r.blockId)).toEqual([result.id]);
  93  |   expect(result.result.results[0].output.keywordRules.length).toBeGreaterThan(0);
  94  |   expect(result.missing.results).toHaveLength(1);
  95  |   expect(result.missing.status).toBe('error');
  96  |   expect(result.missing.errors.join(' ')).toMatch(/upload|document/i);
  97  | });
  98  | 
  99  | const documentFixturePages = new WeakSet<Page>();
  100 | 
  101 | async function openTest(page: Page, label: string) {
  102 |   if (documentFixturePages.has(page)) {
  103 |     await page.goto('/w/pf-fapi');
  104 |     await page.getByRole('button', { name: 'Document calculation fixture — Imported', exact: true }).click();
  105 |   } else {
  106 |     await openDocumentCalculationFixture(page);
  107 |     documentFixturePages.add(page);
  108 |   }
  109 |   await page.getByRole('button', { name: 'Build', exact: true }).click();
  110 |   await page.getByRole('button', { name: label, exact: true }).click();
  111 |   await page.getByRole('button', { name: 'Test block', exact: true }).click();
  112 |   return page.getByRole('region', { name: 'Individual block test' });
  113 | }
  114 | 
  115 | test('standalone Compute accepts example numbers, flags stale results and validates inputs', async ({ page }, testInfo) => {
  116 |   const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  117 |   const panel = await openTest(page, 'Calculate');
  118 |   await expect(panel.getByLabel('Test value 1 name')).toHaveValue('item_total');
  119 |   await panel.getByLabel('Test value 1 number').fill('200');
  120 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  121 |   await expect(panel).toContainText('400');
  122 |   await panel.getByLabel('Test value 1 number').fill('220');
  123 |   await expect(panel.getByRole('status')).toContainText('Run again');
  124 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  125 |   await expect(panel).toContainText('440');
  126 |   await expect(panel.getByRole('status')).toHaveCount(0);
  127 |   await page.screenshot({ path: testInfo.outputPath('isolated-calculation.png'), fullPage: true });
  128 |   await panel.getByLabel('Test value 1 number').fill('');
  129 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  130 |   await expect(panel.getByRole('alert')).toContainText('Blank values are not zero');
  131 |   await panel.getByLabel('Block test input editor').selectOption('json');
  132 |   await panel.getByLabel('Block test input JSON').fill('null');
  133 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  134 |   await expect(panel.getByRole('alert')).toContainText('Enter an input object');
  135 |   await panel.getByLabel('Block test input JSON').fill('{"namedValues":{"item_total":0}}');
  136 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  137 |   await expect(panel.getByRole('alert')).toHaveCount(0);
  138 |   await expect(panel).toContainText('success');
  139 |   const stored = await page.evaluate(async () => {
  140 |     const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
  141 |     const { loadLocalRunRecords } = await import('/src/shared/workflow-engine/workflow/run-storage.ts');
  142 |     return { entries: Object.values(readWorkflowLibrary()), records: loadLocalRunRecords() };
  143 |   });
  144 |   expect(stored.entries.flatMap((e: any) => e.runs)).toHaveLength(0);
  145 |   expect(stored.records).toHaveLength(3);
  146 |   expect(stored.records.every(r => r.logs.length === 1)).toBe(true);
  147 |   expect(errors).toEqual([]);
  148 | });
  149 | 
  150 | test('example CSV uploads into one block without changing workflow data', async ({ page }) => {
  151 |   const panel = await openTest(page, 'Keyword rules');
  152 |   await panel.getByText(/Test data .* upload document or enter examples/).click();
  153 |   await panel.getByLabel('Upload test document').setInputFiles({ name: 'block-only.csv', mimeType: 'text/csv', buffer: Buffer.from('label,amount\nItem one,120\nItem two,80\nService,30\n') });
  154 |   await panel.getByRole('button', { name: 'Use this test data', exact: true }).click();
> 155 |   await expect(panel.getByLabel('Test row 1 text')).toHaveValue('Item one');
      |                                                     ^ Error: expect(locator).toHaveValue(expected) failed
  156 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  157 |   await expect(panel).toContainText('Items');
  158 |   const stored = await page.evaluate(async () => {
  159 |     const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
  160 |     const { loadLocalRunRecords } = await import('/src/shared/workflow-engine/workflow/run-storage.ts');
  161 |     return { entries: Object.values(readWorkflowLibrary()), result: loadLocalRunRecords()[0].logs[0].output };
  162 |   });
  163 |   expect(stored.result.output.mappedRows).toHaveLength(2);
  164 |   expect(stored.entries.every((entry: any) => entry.draft.blocks.every((b: any) => b.config.fileName !== 'block-only.csv'))).toBe(true);
  165 | });
  166 | 
  167 | test('recorded inputs are explicit and missing snapshots do not execute upstream blocks', async ({ page }) => {
  168 |   const panel = await openTest(page, 'Calculate');
  169 |   await panel.getByLabel('Block test input source').selectOption('recorded');
  170 |   await expect(panel).toContainText('Aggregation groups');
  171 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  172 |   await expect(panel.getByRole('alert')).toContainText('No usable recorded result');
  173 |   const records = await page.evaluate(async () => (await import('/src/shared/workflow-engine/workflow/run-storage.ts')).loadLocalRunRecords());
  174 |   expect(records).toHaveLength(0);
  175 | });
  176 | 
  177 | test('the UI reuses individual aggregation and calculation results after reload without running the workflow', async ({ page }, testInfo) => {
  178 |   let panel = await openTest(page, 'Aggregation groups');
  179 |   await expect(panel.getByLabel('Test record type')).toHaveValue('mappedRows');
  180 |   for (const [index, amount] of [120, 80].entries()) {
  181 |     await panel.getByRole('button', { name: 'Add test record', exact: true }).click();
  182 |     await panel.getByLabel(`Test row ${index + 1} text`).fill(`Item ${index + 1}`);
  183 |     await panel.getByLabel(`Test row ${index + 1} number`).fill(String(amount));
  184 |     await panel.getByLabel(`Test row ${index + 1} category`).fill('items');
  185 |   }
  186 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  187 |   await expect(panel).toContainText('200');
  188 |   panel = await openTest(page, 'Calculate');
  189 |   await panel.getByLabel('Block test input source').selectOption('recorded');
  190 |   await expect(panel).toContainText('prior block test');
  191 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  192 |   await expect(panel).toContainText('400');
  193 |   await page.getByRole('button', { name: 'Input & Output', exact: true }).click();
  194 |   await expect(page.getByTestId('block-io-panel')).toContainText('Individual block test');
  195 |   panel = await openTest(page, 'Final result');
  196 |   await panel.getByLabel('Block test input source').selectOption('recorded');
  197 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  198 |   await expect(panel).toContainText('400');
  199 |   await page.screenshot({ path: testInfo.outputPath('individual-final-output.png'), fullPage: true });
  200 |   const stored = await page.evaluate(async () => {
  201 |     const { loadLocalRunRecords } = await import('/src/shared/workflow-engine/workflow/run-storage.ts');
  202 |     return loadLocalRunRecords();
  203 |   });
  204 |   expect(stored).toHaveLength(3);
  205 |   expect(stored.every(r => r.logs.length === 1)).toBe(true);
  206 |   expect(stored[0].logs[0].output.output.canonicalJson.calculated_results.RESULT).toBe(400);
  207 | });
  208 | 
  209 | test('large example imports paginate editable records and process every row', async ({ page }) => {
  210 |   const panel = await openTest(page, 'Keyword rules');
  211 |   await panel.getByText(/Test data .* upload document or enter examples/).click();
  212 |   await panel.getByLabel('Upload test document').setInputFiles({ name: 'many-items.csv', mimeType: 'text/csv', buffer: Buffer.from('label,amount\n' + Array.from({ length: 500 }, (_, i) => `Item ${i + 1},${i + 1}`).join('\n')) });
  213 |   await panel.getByRole('button', { name: 'Use this test data', exact: true }).click();
  214 |   await expect(panel.getByRole('textbox', { name: /^Test row .* text$/ })).toHaveCount(25);
  215 |   await panel.getByRole('button', { name: 'Next test records', exact: true }).click();
  216 |   await expect(panel.getByLabel('Test row 26 text')).toHaveValue('Item 26');
  217 |   await panel.getByLabel('Test row 26 number').fill('0');
  218 |   const start = Date.now();
  219 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  220 |   const result = await page.evaluate(async () => (await import('/src/shared/workflow-engine/workflow/run-storage.ts')).loadLocalRunRecords()[0].logs[0].output);
  221 |   expect(result.output.mappedRows).toHaveLength(500);
  222 |   expect(result.output.mappedRows[25].amount).toBe(0);
  223 |   expect(Date.now() - start).toBeLessThan(5000);
  224 | });
  225 | 
  226 | test('isolated calculation combines an aggregate snapshot with a source-qualified API field and literal numbers', async ({ page }) => {
  227 |   await page.goto('/');
  228 |   const result = await page.evaluate(async () => {
  229 |     const { DOCUMENT_CALCULATOR_CONFIG } = await import('/src/shared/workflow-engine/runtime/workflow-runs/document-calculator.ts');
  230 |     const { createWorkflowBlockFromCatalog } = await import('/src/shared/workflow-engine/workflow/block-factory.ts');
  231 |     const { workflowDefinitionToCanvas } = await import('/src/shared/workflow-engine/workflow/canvas.ts');
  232 |     const { runLocalWorkflowTools } = await import('/src/shared/workflow-engine/local-tool-runner.ts');
  233 |     const { exampleInput } = await import('/src/shared/workflow-engine/block-test-inputs.ts');
  234 |     const { calculationValueKey } = await import('/src/shared/workflow-engine/calculation-values.ts');
  235 |     const d = DOCUMENT_CALCULATOR_CONFIG.buildSnapshot();
  236 |     const compute = d.blocks.find(b => b.label === 'Calculate')!;
  237 |     const api = createWorkflowBlockFromCatalog('source:api-http-request', { id: 'api-rate', label: 'Exchange rate API', position: { x: 0, y: 0 } });
  238 |     const apiInput = exampleInput({ rawRows: [{ rate: 2.5 }] });
  239 |     apiInput.block = api; apiInput.result.blockId = api.id;
  240 |     compute.config.formulas[0].formulaExpression = `item_total * ${calculationValueKey(api.id, ['rawRows', '0', 'rate'])} * 500 / 2`;
  241 |     return runLocalWorkflowTools({ ...workflowDefinitionToCanvas(d), workflowName: d.name, mode: 'isolated', selectedBlockId: compute.id, isolatedInputs: [exampleInput({ namedValues: { item_total: 200 } }), apiInput], testInputSource: 'recorded' }).result;
  242 |   });
  243 |   expect(result.results).toHaveLength(1);
  244 |   expect(result.errors).toEqual([]);
  245 |   expect(result.results[0].output.calculatedResults.RESULT).toBe(125000);
  246 | });
  247 | 
  248 | test('an unconfigured document source reports missing data in its own test', async ({ page }) => {
  249 |   const panel = await openTest(page, 'Document');
  250 |   await expect(panel.getByLabel('Block test input source')).toHaveValue('none');
  251 |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  252 |   await expect(panel).toContainText('No document records supplied');
  253 |   await expect(panel).toContainText('error');
  254 | });
  255 | 
```