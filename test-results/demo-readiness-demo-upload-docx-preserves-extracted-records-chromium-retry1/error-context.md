# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: demo-readiness.spec.ts >> demo upload docx preserves extracted records
- Location: e2e/demo-readiness.spec.ts:14:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: 'Use this test data', exact: true })
Expected: visible
Timeout: 30000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 30000ms
  - waiting for getByRole('button', { name: 'Use this test data', exact: true })

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
- button "FAPI Calculation Template — My workflow"
- text: Runnable demos
- button "Document Calculator"
- button "Employee Expense Reimbursement"
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
- text: FAPI Calculation Template — My workflow Unsaved changes
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
- group:
  - text: Test data — upload document or enter examples Document source
  - combobox "Document source":
    - option "Trial Balance" [selected]
  - button "Upload test document"
  - button "Enter example data / JSON"
- text: Fiscal Flow Source → Logic → Review / Validation Protected → Output
- application:
  - img:
    - group "Edge from fapi-source-trial-balance to fapi-logic-keyword-mapper"
  - img:
    - group "Edge from fapi-logic-keyword-mapper to fapi-logic-category-rollup"
  - img:
    - group "Edge from fapi-logic-category-rollup to fapi-logic-lines-engine"
  - img:
    - group "Edge from fapi-source-inputs to fapi-logic-lines-engine"
  - img:
    - group "Edge from fapi-logic-lines-engine to fapi-logic-summary-engine"
  - img:
    - group "Edge from fapi-api-boc-fx to fapi-source-fx-rate"
  - img:
    - group "Edge from fapi-source-fx-rate to fapi-logic-summary-engine"
  - img:
    - group "Edge from fapi-logic-category-rollup to fapi-field-income"
  - img:
    - group "Edge from fapi-logic-lines-engine to fapi-field-lines"
  - img:
    - group "Edge from fapi-logic-summary-engine to fapi-field-summary"
  - img:
    - group "Edge from fapi-logic-keyword-mapper to fapi-output-evidence"
  - img:
    - group "Edge from fapi-logic-category-rollup to fapi-output-evidence"
  - img:
    - group "Edge from fapi-logic-summary-engine to fapi-output-evidence"
  - img:
    - group "Edge from fapi-logic-keyword-mapper to fapi-output-json"
  - img:
    - group "Edge from fapi-logic-summary-engine to fapi-output-json"
  - group:
    - button "Trial Balance"
  - group:
    - button "FAPI Inputs"
  - group:
    - button "Bank of Canada FX Rate"
  - group:
    - button "Bank of Canada Valet API"
  - group:
    - button "Keyword Mapper"
  - group:
    - button "Category Rollup"
  - group:
    - button "FAPI Lines Engine"
  - group:
    - button "FAPI Summary Engine"
  - group:
    - button "Income & Expense"
  - group:
    - button "FAPI Lines A–H"
  - group:
    - button "FAPI Summary"
  - group:
    - button "Evidence"
  - group:
    - button "Canonical JSON"
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
```

# Test source

```ts
  1   | import { test, expect } from './workflow-audit-isolation';
  2   | import type { Page } from '@playwright/test';
  3   | import path from 'node:path';
  4   | 
  5   | const stored = (page: Page) => page.evaluate(async () => { const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts'); return Object.values(readWorkflowLibrary())[0] as any; });
  6   | async function uploadPanel(page: Page) {
  7   |   page.setDefaultTimeout(20000);
  8   |   await page.goto('/w/pf-fapi');
  9   |   await page.getByRole('button', { name: 'Build', exact: true }).click();
  10  |   await page.getByText('Test data — upload document or enter examples', { exact: true }).click();
  11  | }
  12  | 
  13  | for (const format of ['xlsx', 'pdf', 'docx', 'tsv', 'json', 'txt']) {
  14  |   test(`demo upload ${format} preserves extracted records`, async ({ page }, info) => {
  15  |     const errors: string[] = [];
  16  |     page.on('pageerror', error => errors.push(error.message));
  17  |     await uploadPanel(page);
  18  |     const start = Date.now();
  19  |     const input = page.getByLabel('Upload test document');
  20  |     if (['xlsx', 'pdf', 'docx'].includes(format)) {
  21  |       await input.setInputFiles(path.resolve(`e2e/fixtures/demo/sales-check.${format}`));
  22  |     } else {
  23  |       const content = format === 'tsv' ? 'label\tamount\tquantity\nWidget order one\t120\t3\nWidget order two\t80\t2\nConsulting service\t50\t1'
  24  |         : format === 'json' ? JSON.stringify([{label: 'Widget order one', amount: 120, quantity: 3}, {label: 'Widget order two', amount: 80, quantity: 2}, {label: 'Consulting service', amount: 50, quantity: 1}])
  25  |         : 'Widget order one 120\nWidget order two 80\nConsulting service 50';
  26  |       await input.setInputFiles({ name: `sales-check.${format}`, mimeType: 'application/octet-stream', buffer: Buffer.from(content) });
  27  |     }
> 28  |     await expect(page.getByRole('button', { name: 'Use this test data', exact: true })).toBeVisible({ timeout: 30000 });
      |                                                                                         ^ Error: expect(locator).toBeVisible() failed
  29  |     const previewMs = Date.now() - start;
  30  |     if (await page.getByLabel('Confirm extracted values').count()) await page.getByLabel('Confirm extracted values').check();
  31  |     await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
  32  |     const entry = await stored(page);
  33  |     const source = entry.draft.blocks.find((block: any) => block.id === 'fapi-source-trial-balance');
  34  |     expect(source.config.rows).toHaveLength(3);
  35  |     expect(JSON.stringify(source.config.rows)).toContain('Widget order one');
  36  |     expect(source.config.uploadTimestamp).toBeTruthy();
  37  |     const structured = ['xlsx', 'tsv', 'json'].includes(format);
  38  |     if (structured) expect(source.config.rows.map((row: any) => Number(row.amount))).toEqual([120, 80, 50]);
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
```