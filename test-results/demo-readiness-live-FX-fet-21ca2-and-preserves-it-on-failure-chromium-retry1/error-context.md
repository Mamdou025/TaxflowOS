# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: demo-readiness.spec.ts >> live FX fetch pins a value, reports override precedence, and preserves it on failure
- Location: e2e/demo-readiness.spec.ts:127:5

# Error details

```
Error: {"error":"Sign in to access this workspace."}

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: undefined
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - group [ref=e3]:
      - 'generic "Workspace: Synthetic workspace (owner)" [ref=e4] [cursor=pointer]'
      - option "Select…" [disabled]
      - option "Synthetic workspace (owner)" [selected]
      - option "Viewer" [selected]
      - option "Editor"
      - option "Owner"
    - generic [ref=e7]:
      - generic [ref=e8]:
        - generic [ref=e9]:
          - button "Open chat" [ref=e10] [cursor=pointer]:
            - generic [ref=e11]: InScope
          - button "Collapse sidebar" [ref=e12] [cursor=pointer]
        - button "New chat" [ref=e16] [cursor=pointer]
        - button "Workspace" [ref=e18] [cursor=pointer]
        - button "Chat" [ref=e22] [cursor=pointer]
        - button "Workflows" [ref=e28] [cursor=pointer]
        - button "Sources" [ref=e36] [cursor=pointer]
        - button "Connections" [ref=e44] [cursor=pointer]
        - button "Recent conversations" [ref=e54] [cursor=pointer]
        - generic [ref=e58]: No saved chats yet.
        - button "Workflows" [ref=e59] [cursor=pointer]
        - generic [ref=e63]:
          - group [ref=e64]:
            - generic "Workflow storage status" [ref=e65]: Saved to server
          - button "Library" [ref=e66] [cursor=pointer]
          - button "Run history" [ref=e69] [cursor=pointer]
          - button "New workflow" [ref=e74] [cursor=pointer]
          - generic [ref=e76]:
            - generic [ref=e77]: MY WORKFLOWS
            - button "FAPI Calculation Template — My workflow" [ref=e78] [cursor=pointer]
          - generic [ref=e79]:
            - generic [ref=e80]: Runnable demos
            - button "Document Calculator" [ref=e81] [cursor=pointer]
            - button "Employee Expense Reimbursement" [ref=e86] [cursor=pointer]
          - generic [ref=e91]:
            - generic [ref=e92]: Platform services
            - button "Scope Service" [ref=e93] [cursor=pointer]
            - button "Tax Position Summary Workpaper" [ref=e106] [cursor=pointer]
            - button "Data Readiness Service" [ref=e119] [cursor=pointer]
            - button "Execution Readiness & Review Checklist" [ref=e132] [cursor=pointer]
          - generic [ref=e145]:
            - generic [ref=e146]: Foundation
            - button "Ownership Graph Workpaper" [ref=e147] [cursor=pointer]
            - button "Tax Attribute Continuity Workpaper" [ref=e154] [cursor=pointer]
            - button "Portfolio Calendar & Requests Workpaper" [ref=e161] [cursor=pointer]
          - generic [ref=e168]:
            - generic [ref=e169]: Tier 1
            - button "FAPI Calculation (portfolio)" [ref=e170] [cursor=pointer]
            - button "T1134 Affiliate Reporting Workpaper" [ref=e176] [cursor=pointer]
            - button "Foreign Affiliate Surplus Continuity Workpaper" [ref=e182] [cursor=pointer]
            - button "T106 Transaction Workpaper" [ref=e188] [cursor=pointer]
            - button "EIFEL Fixed-Ratio Scenario Workpaper" [ref=e194] [cursor=pointer]
            - button "T2 Taxable Income Bridge Workpaper" [ref=e200] [cursor=pointer]
            - button "Corporate Tax Provision Workpaper" [ref=e206] [cursor=pointer]
            - button "Part XIII Withholding Workpaper" [ref=e212] [cursor=pointer]
        - generic [ref=e218]:
          - button "Settings" [ref=e220] [cursor=pointer]
          - button "Help" [ref=e227] [cursor=pointer]
          - group "Theme" [ref=e235]:
            - button "Light" [pressed] [ref=e236] [cursor=pointer]
            - button "Dark" [ref=e243] [cursor=pointer]
      - generic [ref=e246]:
        - generic [ref=e247]:
          - generic [ref=e248]:
            - button "Workflows" [ref=e250] [cursor=pointer]
            - generic [ref=e256]:
              - generic [ref=e257]: FAPI Calculation Template — My workflow
              - generic [ref=e258]: Unsaved changes
              - button "Overview" [ref=e260] [cursor=pointer]
              - button "Build" [ref=e261] [cursor=pointer]
              - button "Run" [ref=e262] [cursor=pointer]
              - button "Results" [ref=e263] [cursor=pointer]
              - button "Agent Lab" [ref=e264] [cursor=pointer]
              - button "Undo" [disabled] [ref=e269]
              - button "Redo" [disabled] [ref=e273]
              - button "Fit" [ref=e277] [cursor=pointer]
              - button "Save" [ref=e284] [cursor=pointer]
              - button "Run" [ref=e289] [cursor=pointer]
          - generic [ref=e296]:
            - group [ref=e298]:
              - generic "Test data — upload document or enter examples" [ref=e299] [cursor=pointer]
              - option "Trial Balance" [selected]
            - generic [ref=e301]:
              - generic:
                - generic: Fiscal Flow
                - generic: Source → Logic → Review / Validation
                - generic: Protected → Output
              - application [ref=e302]:
                - generic [ref=e304]:
                  - generic:
                    - generic:
                      - img:
                        - group "Edge from fapi-source-trial-balance to fapi-logic-keyword-mapper" [ref=e305] [cursor=pointer]
                      - img:
                        - group "Edge from fapi-logic-keyword-mapper to fapi-logic-category-rollup"
                      - img:
                        - group "Edge from fapi-logic-category-rollup to fapi-logic-lines-engine"
                      - img:
                        - group "Edge from fapi-source-inputs to fapi-logic-lines-engine" [ref=e308] [cursor=pointer]
                      - img:
                        - group "Edge from fapi-logic-lines-engine to fapi-logic-summary-engine"
                      - img:
                        - group "Edge from fapi-api-boc-fx to fapi-source-fx-rate"
                      - img:
                        - group "Edge from fapi-source-fx-rate to fapi-logic-summary-engine" [ref=e311] [cursor=pointer]
                      - img:
                        - group "Edge from fapi-logic-category-rollup to fapi-field-income" [ref=e314] [cursor=pointer]
                      - img:
                        - group "Edge from fapi-logic-lines-engine to fapi-field-lines" [ref=e317] [cursor=pointer]
                      - img:
                        - group "Edge from fapi-logic-summary-engine to fapi-field-summary" [ref=e320] [cursor=pointer]
                      - img:
                        - group "Edge from fapi-logic-keyword-mapper to fapi-output-evidence" [ref=e323] [cursor=pointer]
                      - img:
                        - group "Edge from fapi-logic-category-rollup to fapi-output-evidence" [ref=e326] [cursor=pointer]
                      - img:
                        - group "Edge from fapi-logic-summary-engine to fapi-output-evidence" [ref=e329] [cursor=pointer]
                      - img:
                        - group "Edge from fapi-logic-keyword-mapper to fapi-output-json" [ref=e332] [cursor=pointer]
                      - img:
                        - group "Edge from fapi-logic-summary-engine to fapi-output-json" [ref=e335] [cursor=pointer]
                    - generic:
                      - group [ref=e338] [cursor=pointer]:
                        - button "Trial Balance" [ref=e345]
                      - group [ref=e346] [cursor=pointer]:
                        - button "FAPI Inputs" [ref=e350]
                      - group [ref=e354] [cursor=pointer]:
                        - button "Bank of Canada FX Rate" [ref=e358]
                      - group [ref=e362] [cursor=pointer]:
                        - button "Bank of Canada Valet API" [ref=e366]
                      - group [ref=e370] [cursor=pointer]:
                        - button "Keyword Mapper" [ref=e374]
                      - group [ref=e378] [cursor=pointer]:
                        - button "Category Rollup" [ref=e382]
                      - group [ref=e386] [cursor=pointer]:
                        - button "FAPI Lines Engine" [ref=e390]
                      - group [ref=e394] [cursor=pointer]:
                        - button "FAPI Summary Engine" [ref=e398]
                      - group [ref=e402] [cursor=pointer]:
                        - button "Income & Expense" [ref=e406]
                      - group [ref=e410] [cursor=pointer]:
                        - button "FAPI Lines A–H" [ref=e414]
                      - group [ref=e418] [cursor=pointer]:
                        - button "FAPI Summary" [ref=e422]
                      - group [ref=e426] [cursor=pointer]:
                        - button "Evidence" [ref=e430]
                      - group [ref=e434] [cursor=pointer]:
                        - button "Canonical JSON" [ref=e438]
                - group [ref=e443]:
                  - button "Zoom in" [ref=e444] [cursor=pointer]
                  - button "Zoom out" [ref=e445] [cursor=pointer]
                  - button "Fit view" [ref=e446] [cursor=pointer]
                  - button "Show minimap" [ref=e447] [cursor=pointer]
                - link "React Flow attribution" [ref=e449] [cursor=pointer]:
                  - /url: https://reactflow.dev/attribution
                  - text: React Flow
        - separator "Drag to resize" [ref=e452]
        - generic [ref=e454]:
          - generic [ref=e455]:
            - generic [ref=e456]: Chat panel
            - button "Hide chat panel" [ref=e457] [cursor=pointer]
            - button "Expand chat panel" [ref=e461] [cursor=pointer]
          - generic [ref=e468]:
            - generic [ref=e469]:
              - generic [ref=e470]:
                - button "Choose client — Scope reads their worksheets & documents" [ref=e471] [cursor=pointer]
                - generic [ref=e527]:
                  - button "N Northstar Inc" [ref=e528] [cursor=pointer]:
                    - generic [ref=e529]: "N"
                    - generic [ref=e530]: Northstar Inc
                  - button "Work" [ref=e535] [cursor=pointer]
              - 'button "Context: 0 selected, 0 used" [ref=e544] [cursor=pointer]'
              - button "Tools" [ref=e550] [cursor=pointer]:
                - generic [ref=e553]: "9"
            - generic [ref=e557]:
              - generic [ref=e558]:
                - generic [ref=e559]: Good morning, Sophia
                - generic [ref=e560]: What would you like to work on?
              - generic [ref=e563]:
                - textbox "Ask Scope, or describe a task…" [ref=e564]
                - generic [ref=e565]:
                  - button "Add — search, workflows, worksheets" [ref=e566] [cursor=pointer]
                  - button "Attach files" [ref=e568] [cursor=pointer]
                  - 'button "Chat agent: Sina" [ref=e571] [cursor=pointer]': Sina
                  - button "Send" [disabled] [ref=e582]
    - region "Notifications alt+T"
  - generic [ref=e591]:
    - generic [ref=e593]:
      - heading "Block workspace" [level=2] [ref=e594]
      - button "Close" [ref=e595] [cursor=pointer]
    - generic [ref=e596]:
      - button "Test block" [ref=e597] [cursor=pointer]
      - button "Test with upstream blocks" [ref=e598] [cursor=pointer]
      - text: Test this block alone, or run the blocks supplying its inputs.
    - generic [ref=e601]:
      - generic [ref=e602]:
        - generic [ref=e603]:
          - heading "Bank of Canada FX Rate" [level=3] [ref=e604]
          - paragraph [ref=e605]: The annual average of the published daily rate, read live from the Valet API. Fetch pins the rate into this block so the run replays it; a reviewed correction belongs downstream in FX Rate Review, then locked as a Protected FX Rate.
        - generic [ref=e606]:
          - generic [ref=e607]:
            - generic [ref=e608]: Document currency
            - textbox [ref=e609]: USD
          - generic [ref=e610]:
            - generic [ref=e611]: Reporting currency
            - textbox [ref=e612]: CAD
            - paragraph [ref=e613]: The Valet series is quoted against CAD.
          - generic [ref=e614]:
            - generic [ref=e615]: Year
            - textbox [ref=e616]: "2025"
        - paragraph [ref=e617]: The published currency list could not be loaded, so this is free text — enter a three-letter code. Fetch will report if the pair has no series.
        - generic "Saved API response status" [ref=e618]:
          - paragraph [ref=e619]: Run reuses the saved response. Fetch explicitly to refresh it.
          - paragraph [ref=e620]: "Fetched: Not recorded"
          - paragraph [ref=e621]: "Manual override active: 1.35. The fetched rate will not be used."
        - button "Fetch USD/CAD 2025" [ref=e623] [cursor=pointer]
        - generic [ref=e624]:
          - paragraph
        - generic [ref=e625]:
          - generic [ref=e626]: Local draft override
          - textbox "none" [ref=e627]: "1.35"
          - paragraph [ref=e628]: Overrides the fetched rate for this workflow. Leave blank to use the published average.
        - generic [ref=e629]:
          - generic [ref=e630]: "Provider: Bank of Canada Valet API"
          - generic [ref=e631]: "Rate type: annual_average"
          - generic [ref=e632]: "Source version: v1"
          - generic [ref=e633]: "Locator: bank-of-canada://annual-average/USD-CAD/2025"
      - generic [ref=e634]:
        - generic [ref=e635]:
          - generic [ref=e636]: Workflow Family
          - combobox "Workflow Family" [disabled] [ref=e637]:
            - generic: Source
        - generic [ref=e638]:
          - generic [ref=e639]: Source Locator
          - textbox "Source Locator" [ref=e640]: bank-of-canada://annual-average/USD-CAD/2025
        - generic [ref=e641]:
          - generic [ref=e642]:
            - generic [ref=e643]: Owner
            - textbox "Owner" [ref=e644]:
              - /placeholder: Team or reviewer
          - generic [ref=e645]:
            - generic [ref=e646]: Output Key
            - textbox "Output Key" [ref=e647]:
              - /placeholder: Source output
              - text: exchange_rate, rate_metadata
        - generic [ref=e648]:
          - generic [ref=e649]: Inputs
          - textbox "Inputs" [ref=e650]:
            - /placeholder: Source keys or upstream outputs
            - text: Bank of Canada rate lookup
        - generic [ref=e651]:
          - generic [ref=e652]: Rulebook Alignment
          - textbox "Rulebook Alignment" [ref=e653]:
            - /placeholder: Fiscal control or governance note
            - text: FX rates are captured as source references, then reviewed/protected downstream.
      - generic [ref=e654]:
        - generic [ref=e655]: Label
        - textbox "Label" [ref=e656]: Bank of Canada FX Rate
      - generic [ref=e657]:
        - generic [ref=e658]: Description
        - textbox "Description" [ref=e659]:
          - /placeholder: Optional description
          - text: Bank of Canada annual average USD→CAD FX rate for the FAPI year. Consumes the live Valet API rate when available, otherwise the workbook override.
      - generic [ref=e660]:
        - button "Enabled" [ref=e661] [cursor=pointer]
        - button "Delete" [ref=e662] [cursor=pointer]
    - generic [ref=e663]:
      - button "Properties" [ref=e664] [cursor=pointer]
      - button "Input & Output" [ref=e668] [cursor=pointer]:
        - generic [ref=e669]: I/O
        - text: Input & Output
      - button "Runs" [ref=e670] [cursor=pointer]
```

# Test source

```ts
  39  |     else expect(source.config.rows.every((row: any) => row.amount === undefined)).toBe(true);
  40  |     await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  41  |     await expect(page.getByRole('region', { name: 'Trigger readiness' })).toContainText('Met');
  42  |     expect(errors).toEqual([]);
  43  |     console.log(JSON.stringify({ format, previewMs, rows: source.config.rows.length, structuredNumbers: structured, errors }));
  44  |     await info.attach('upload-result', { contentType: 'application/json', body: JSON.stringify({ format, previewMs, rows: source.config.rows, structuredNumbers: structured, errors }, null, 2) });
  45  |   });
  46  | }
  47  | 
  48  | test('a failed replacement upload cannot apply a stale preview', async ({ page }) => {
  49  |   await uploadPanel(page);
  50  |   const input = page.getByLabel('Upload test document');
  51  |   await input.setInputFiles({ name: 'valid.json', mimeType: 'application/json', buffer: Buffer.from('[{"label":"Old preview","amount":999}]') });
  52  |   await expect(page.getByRole('button', { name: 'Use this test data' })).toBeVisible();
  53  |   await input.setInputFiles({ name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{broken') });
  54  |   await expect(page.getByLabel('Upload test document')).toBeEnabled();
  55  |   await expect(page.getByRole('button', { name: 'Use this test data' })).toHaveCount(0);
  56  | });
  57  | 
  58  | test('custom columns can be mapped to classification and calculation fields', async ({ page }) => {
  59  |   await uploadPanel(page);
  60  |   await page.getByLabel('Upload test document').setInputFiles({ name: 'inventory.csv', mimeType: 'text/csv', buffer: Buffer.from('Product,Units,Rate\nWidget,12,2.5\nService,0,3') });
  61  |   await page.getByLabel('Text to classify').selectOption('Product');
  62  |   await page.getByLabel('Number to calculate').selectOption('Units');
  63  |   await page.getByRole('button', { name: 'Use this test data' }).click();
  64  |   const entry = await stored(page);
  65  |   const source = entry.draft.blocks.find((block: any) => block.id === 'fapi-source-trial-balance');
  66  |   expect(source.config.rows.map((row: any) => row.label)).toEqual(['Widget', 'Service']);
  67  |   expect(source.config.rows.map((row: any) => Number(row.amount))).toEqual([12, 0]);
  68  |   expect(source.config.rows.map((row: any) => Number(row.Rate))).toEqual([2.5, 3]);
  69  | });
  70  | 
  71  | test('empty and malformed documents show an error without replacing saved data', async ({ page }) => {
  72  |   await uploadPanel(page);
  73  |   const input = page.getByLabel('Upload test document');
  74  |   await input.setInputFiles({ name: 'good.json', mimeType: 'application/json', buffer: Buffer.from('[{"label":"Keep me","amount":12}]') });
  75  |   await page.getByRole('button', { name: 'Use this test data' }).click();
  76  |   const before = await stored(page);
  77  |   for (const [name, contents] of [['empty.csv', ''], ['empty.json', '[]'], ['scalar.json', '42'], ['broken.pdf', 'not a PDF']]) {
  78  |     await input.setInputFiles({ name, mimeType: 'application/octet-stream', buffer: Buffer.from(contents) });
  79  |     await expect(input).toBeEnabled();
  80  |     await expect(page.getByRole('button', { name: 'Use this test data' })).toHaveCount(0);
  81  |     expect((await stored(page)).draft).toEqual(before.draft);
  82  |   }
  83  | });
  84  | 
  85  | for (const count of [100, 1000]) {
  86  |   test(`demo load ${count} rows saves a real run and stays responsive`, async ({ page }, info) => {
  87  |     test.setTimeout(120000);
  88  |     const errors: string[] = [];
  89  |     page.on('pageerror', error => errors.push(error.message));
  90  |     await uploadPanel(page);
  91  |     const csv = 'label,amount\n' + Array.from({ length: count }, (_, i) => `Interest income ${i + 1},1`).join('\n');
  92  |     let start = Date.now();
  93  |     await page.getByLabel('Upload test document').setInputFiles({ name: `load-${count}.csv`, mimeType: 'text/csv', buffer: Buffer.from(csv) });
  94  |     await page.getByRole('button', { name: 'Use this test data' }).click();
  95  |     const uploadMs = Date.now() - start;
  96  |     await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  97  |     start = Date.now();
  98  |     await page.getByRole('button', { name: 'Save changes and preview', exact: true }).click();
  99  |     const persisted = await page.evaluate(async () => {
  100 |       const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
  101 |       const entry = Object.values(readWorkflowLibrary())[0];
  102 |       const run = entry.runs.at(-1)?.result.result;
  103 |       return { id: entry.id, runId: run?.runId, errors: run?.errors, total: run?.results.find(r => r.blockId === 'fapi-logic-category-rollup')?.output.categoryTotals, storedCharacters: localStorage.getItem('taxflow:workflow-library:v1')!.length };
  104 |     });
  105 |     const runMs = Date.now() - start;
  106 |     console.log(JSON.stringify({ count, uploadMs, runMs, ...persisted, browserErrors: errors }));
  107 |     await info.attach('load-measurements', { contentType: 'application/json', body: JSON.stringify({ count, uploadMs, runMs, ...persisted, browserErrors: errors }, null, 2) });
  108 |     expect(persisted.runId).toBeTruthy();
  109 |     expect(persisted.total.interestIncome).toBe(count);
  110 |     expect(persisted.errors).toEqual([]);
  111 |     expect(errors).toEqual([]);
  112 |     await page.goto(`/w/${persisted.id}`);
  113 |     await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  114 |     await expect(page.getByRole('button', { name: 'Preview saved version 1 in this browser' })).toBeVisible();
  115 |     await page.getByRole('button', { name: 'Preview saved version 1 in this browser' }).click();
  116 |     const repeat = await page.evaluate(async () => {
  117 |       const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
  118 |       const entry = Object.values(readWorkflowLibrary())[0];
  119 |       return { runs: entry.runs.length, id: entry.runs.at(-1)?.result.result.runId, storedCharacters: localStorage.getItem('taxflow:workflow-library:v1')!.length };
  120 |     });
  121 |     console.log(JSON.stringify({ count, repeat }));
  122 |     expect(repeat.runs).toBe(2);
  123 |     expect(repeat.id).not.toBe(persisted.runId);
  124 |   });
  125 | }
  126 | 
  127 | test('live FX fetch pins a value, reports override precedence, and preserves it on failure', async ({ page }, info) => {
  128 |   test.setTimeout(120000);
  129 |   page.setDefaultTimeout(40000);
  130 |   await page.goto('/w/pf-fapi');
  131 |   await page.getByRole('button', { name: 'Build', exact: true }).click();
  132 |   await page.getByRole('button', { name: 'Fit view', exact: true }).click();
  133 |   await page.getByRole('button', { name: 'Bank of Canada FX Rate', exact: true }).click();
  134 |   const start = Date.now();
  135 |   const responsePromise = page.waitForResponse(response => response.url().includes('/api/fx-rate?'));
  136 |   await page.getByRole('button', { name: 'Fetch USD/CAD 2025', exact: true }).click();
  137 |   const response = await responsePromise;
  138 |   const data = await response.json();
> 139 |   expect(data.ok, JSON.stringify(data)).toBe(true);
      |                                         ^ Error: {"error":"Sign in to access this workspace."}
  140 |   expect(data.rate).toBeGreaterThan(0);
  141 |   await expect.poll(async () => (await stored(page))?.draft.blocks.find((b: any) => b.id === 'fapi-source-fx-rate')?.config.liveRate).toBe(data.rate);
  142 |   await expect(page.getByText(/takes precedence/)).toBeVisible();
  143 |   const fetchMs = Date.now() - start;
  144 |   await page.getByPlaceholder('none', { exact: true }).fill('');
  145 |   expect((await stored(page)).draft.blocks.find((b: any) => b.id === 'fapi-source-fx-rate').config.overrideRate).toBeNull();
  146 |   await page.getByRole('button', { name: 'Test with upstream blocks', exact: true }).click();
  147 |   await expect(page.getByRole('region', { name: 'Produced outputs' })).toContainText(data.rate.toLocaleString('en-US', { maximumSignificantDigits: 21 }));
  148 |   await page.getByRole('button', { name: 'Properties', exact: true }).click();
  149 |   await page.getByRole('button', { name: 'Create new source version from v1', exact: true }).click();
  150 |   await page.route('**/api/fx-rate?**', route => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ ok: false, reason: 'Simulated API outage' }) }));
  151 |   await page.getByRole('button', { name: 'Fetch USD/CAD 2025', exact: true }).click();
  152 |   await expect(page.getByText('Simulated API outage', { exact: true })).toBeVisible();
  153 |   expect((await stored(page)).draft.blocks.find((b: any) => b.id === 'fapi-source-fx-rate').config.liveRate).toBe(data.rate);
  154 |   console.log(JSON.stringify({ liveFx: data.rate, observations: data.observationCount, fetchMs, failurePreservedPinnedValue: true }));
  155 |   await info.attach('live-api-result', { contentType: 'application/json', body: JSON.stringify({ ...data, fetchMs }, null, 2) });
  156 | });
  157 | 
```