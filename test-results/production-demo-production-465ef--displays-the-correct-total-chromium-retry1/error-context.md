# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: production-demo.spec.ts >> production load of 1000 rows persists two runs and displays the correct total
- Location: e2e/production-demo.spec.ts:102:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('summary').filter({ hasText: /^Previous runs \(1\)/ })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('summary').filter({ hasText: /^Previous runs \(1\)/ })

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
- button "Production 1000-row rehearsal"
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
- text: Production 1000-row rehearsal Version 1
- button "Overview"
- button "Build"
- button "Run"
- button "Results"
- text: Workflow name
- textbox "Workflow name": Production 1000-row rehearsal
- paragraph: Personal workflow · Saved version 1
- group: Test data — upload document or enter examples
- region "API data for next run":
  - heading "API data for next run" [level=3]
  - paragraph: Run uses the saved response; it does not fetch again. To refresh, open the source in Build, create a new source version if locked, fetch, then save the workflow.
  - strong: Bank of Canada FX Rate
  - paragraph: "Manual override active: 1.35. The fetched rate is not used."
  - paragraph: "Fetched: Not recorded"
- region "Trigger readiness":
  - heading "Workflow start conditions" [level=3]
  - paragraph: Advisory only — you can always start a manual run. Field checks use recorded source outputs; test again after changing data.
  - text: Document uploaded Met
  - paragraph: "Trial Balance · Uploaded: production-1000.csv"
- paragraph: Build and Run share saved version 1
- text: Saved workflow version
- combobox "Saved workflow version":
  - option "Production 1000-row rehearsal - Version 1" [selected]
- button "Preview saved version 1 in this browser"
- button "Run saved version 1 durably"
- button "Save changes and preview"
- paragraph: Runs the graph and rules shown in Build using its configured source data. Blocks without an executable tool are reported in the results.
- complementary "Workflow execution lifetime": Durable runs use an immutable saved version and continue on the server if this tab closes. All installed workflow tools are supported. Runs use the inputs and source responses saved in that version. Browser previews require this tab to stay open.
- heading "Version 1 · 9/16/2026, 10:39:20 PM · warning" [level=3]
- paragraph: Run ID local-tool-workflow-f4fe3da7-6f8f-4772-b63b-8ae3532c9b8f · Started from run
- region "Final workflow results":
  - heading "Final results" [level=3]
  - text: Display precision
  - combobox "Result display precision":
    - option "Full precision" [selected]
    - option "0 decimal places"
    - option "2 decimal places"
    - option "4 decimal places"
    - option "6 decimal places"
  - paragraph: Display formatting does not change values sent to other blocks or exported in JSON.
  - group: Choose displayed results
  - table:
    - rowgroup:
      - row "Result Value Unit":
        - columnheader "Result"
        - columnheader "Value"
        - columnheader "Unit"
    - rowgroup:
      - row "FX Rate FAPI Summary Engine 1.35 —":
        - cell "FX Rate FAPI Summary Engine"
        - cell "1.35"
        - cell "—"
      - row "Deductions FAPI Summary Engine 0 —":
        - cell "Deductions FAPI Summary Engine"
        - cell "0"
        - cell "—"
      - row "Gross FAPI Summary Engine 1,000 —":
        - cell "Gross FAPI Summary Engine"
        - cell "1,000"
        - cell "—"
      - row "Deductions CAD FAPI Summary Engine 0 —":
        - cell "Deductions CAD FAPI Summary Engine"
        - cell "0"
        - cell "—"
      - row "Gross CAD FAPI Summary Engine 1,350 —":
        - cell "Gross CAD FAPI Summary Engine"
        - cell "1,350"
        - cell "—"
      - row "FAPI Brut FAPI Summary Engine 1,000 —":
        - cell "FAPI Brut FAPI Summary Engine"
        - cell "1,000"
        - cell "—"
      - row "FAPI Brut CAD FAPI Summary Engine 1,350 —":
        - cell "FAPI Brut CAD FAPI Summary Engine"
        - cell "1,350"
        - cell "—"
      - row "FAT Deduction FAPI Summary Engine 400 —":
        - cell "FAT Deduction FAPI Summary Engine"
        - cell "400"
        - cell "—"
      - row "FAT Deduction CAD FAPI Summary Engine 540 —":
        - cell "FAT Deduction CAD FAPI Summary Engine"
        - cell "540"
        - cell "—"
      - row "Net FAPI FAPI Summary Engine 600 —":
        - cell "Net FAPI FAPI Summary Engine"
        - cell "600"
        - cell "—"
      - row "Net FAPI CAD FAPI Summary Engine 810 —":
        - cell "Net FAPI CAD FAPI Summary Engine"
        - cell "810"
        - cell "—"
  - group: 1 review message
- region "API data used in this run":
  - heading "API data used in this run" [level=3]
  - paragraph: Run uses the saved response; it does not fetch again. To refresh, open the source in Build, create a new source version if locked, fetch, then save the workflow.
  - strong: Bank of Canada FX Rate
  - paragraph: "Manual override active: 1.35. The fetched rate is not used."
  - paragraph: "Fetched: Not recorded"
- group: Bank of Canada Valet API · warning
- group: Trial Balance · success
- group: FAPI Inputs · success
- group: Bank of Canada FX Rate · success
- group: Keyword Mapper · success
- group: Category Rollup · success
- group: Income & Expense · success
- group: FAPI Lines Engine · success
- group: FAPI Lines A–H · success
- group: FAPI Summary Engine · success
- group: FAPI Summary · success
- group: Evidence Pack · warning
- group: Canonical JSON · warning
- group: Other runs (1)
- separator "Drag to resize"
- text: Chat panel
- button "Hide chat panel"
- button "Expand chat panel"
- button "Choose client — Scope reads their worksheets & documents"
- button "N Northstar Inc"
- button "Work"
- 'button "Context: 0 selected, 0 used"'
- button "Tools": "9"
- text: Good evening, Sophia What would you like to work on?
- textbox "Ask Scope, or describe a task…"
- button "Add — search, workflows, worksheets"
- button "Attach files"
- 'button "Chat agent: Sina"': Sina
- button "Send" [disabled]
- region "Notifications alt+T"
```

# Test source

```ts
  28  |   await expect(panel).not.toContainText('No usable recorded result');
  29  |   expect(errors).toEqual([]);
  30  |   console.log(JSON.stringify({ scenario: 'individual-block', openMs: runStart - start, runMs, errors }));
  31  | });
  32  | 
  33  | test('production document-to-output rehearsal uses the UI and survives reload', async ({ page }, info) => {
  34  |   const errors: string[] = [];
  35  |   page.on('pageerror', error => errors.push(error.message));
  36  |   const start = Date.now();
  37  |   await page.goto('/w/pf-fapi');
  38  |   await page.getByRole('button', { name: 'Build', exact: true }).click();
  39  |   const initialBuildMs = Date.now() - start;
  40  |   await page.getByText('Test data — upload document or enter examples', { exact: true }).click();
  41  |   await page.getByLabel('Upload test document').setInputFiles({ name: 'demo-sales.csv', mimeType: 'text/csv', buffer: Buffer.from('label,amount\nWidget order one,120\nWidget order two,80\nConsulting service,50') });
  42  |   await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
  43  |   await page.getByRole('button', { name: 'Keyword Mapper', exact: true }).click();
  44  |   await page.getByRole('button', { name: 'New', exact: true }).click();
  45  |   await page.locator('div.space-y-1\\.5').filter({ has: page.locator('label', { hasText: /^Category ID$/ }) }).locator('input').fill('widget_sales');
  46  |   await page.locator('div.space-y-1\\.5').filter({ has: page.locator('label', { hasText: /^Category label$/ }) }).locator('input').fill('Widget sales');
  47  |   await page.getByPlaceholder('Add contains keyword').fill('Widget');
  48  |   await page.getByPlaceholder('Add contains keyword').press('Enter');
  49  |   await page.getByRole('button', { name: 'Close', exact: true }).click();
  50  |   await page.getByRole('button', { name: 'Category Rollup', exact: true }).click();
  51  |   await page.getByRole('button', { name: 'New Group', exact: true }).click();
  52  |   await page.getByPlaceholder('e.g. income_base').fill('widget_total');
  53  |   await page.getByPlaceholder('e.g. Income Base').fill('Widget total');
  54  |   await page.getByRole('button', { name: 'Widget sales', exact: true }).click();
  55  |   await page.getByRole('button', { name: 'Close', exact: true }).click();
  56  |   await page.getByRole('button', { name: 'FAPI Lines Engine', exact: true }).click();
  57  |   await page.getByRole('button', { name: 'New term', exact: true }).click();
  58  |   await page.getByPlaceholder('KEY', { exact: true }).fill('WIDGET_RESULT');
  59  |   await page.getByPlaceholder('Label', { exact: true }).fill('Adjusted widget sales');
  60  |   await page.getByRole('button', { name: /^widget_total(?: = 200)?$/ }).click();
  61  |   await page.getByRole('button', { name: '×', exact: true }).click();
  62  |   await page.getByRole('spinbutton', { name: 'Number to add' }).fill('500');
  63  |   await page.getByRole('button', { name: 'Add number', exact: true }).click();
  64  |   await page.getByRole('button', { name: '÷', exact: true }).click();
  65  |   await page.getByRole('spinbutton', { name: 'Number to add' }).fill('2');
  66  |   await page.getByRole('button', { name: 'Add number', exact: true }).click();
  67  |   await page.getByRole('button', { name: 'Test with upstream blocks', exact: true }).click();
  68  |   await expect(page.getByRole('region', { name: 'Produced outputs' })).toContainText('50,000');
  69  |   await page.getByRole('button', { name: 'Close', exact: true }).click();
  70  |   await page.getByRole('button', { name: 'FAPI Summary Engine', exact: true }).click();
  71  |   await page.getByRole('button', { name: 'New term', exact: true }).click();
  72  |   await page.getByPlaceholder('KEY', { exact: true }).fill('FINAL_WIDGET_RESULT');
  73  |   await page.getByPlaceholder('Label', { exact: true }).fill('Final widget sales');
  74  |   await page.getByRole('button', { name: /^WIDGET_RESULT(?: = 50000)?$/ }).click();
  75  |   await page.getByRole('button', { name: 'Close', exact: true }).click();
  76  |   await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  77  |   await page.getByLabel('Workflow name').fill('Demo rehearsal — widget sales');
  78  |   const runStart = Date.now();
  79  |   await page.getByRole('button', { name: 'Save changes and preview', exact: true }).click();
  80  |   await page.locator('summary').filter({ hasText: /^Canonical JSON/ }).click();
  81  |   const output = page.locator('details').filter({ has: page.locator('summary', { hasText: /^Canonical JSON/ }) }).first();
  82  |   await expect(output).toContainText('50,000');
  83  |   const runAndInspectMs = Date.now() - runStart;
  84  |   const finalLabel = output.getByText('FINAL WIDGET RESULT', { exact: true }).last();
  85  |   await finalLabel.scrollIntoViewIfNeeded();
  86  |   await expect(finalLabel).toBeVisible();
  87  |   await page.getByRole('region', { name: 'Final workflow results' }).scrollIntoViewIfNeeded();
  88  |   await page.screenshot({ path: info.outputPath('production-final-result.png'), fullPage: true });
  89  |   await page.reload();
  90  |   await page.getByRole('button', { name: 'Workflows', exact: true }).click();
  91  |   await page.getByRole('button', { name: 'Demo rehearsal — widget sales', exact: true }).click();
  92  |   await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  93  |   await page.getByRole('button', { name: 'Preview saved version 1 in this browser', exact: true }).click();
  94  |   await page.locator('summary').filter({ hasText: /^Canonical JSON/ }).click();
  95  |   await expect(output).toContainText('50,000');
  96  |   await expect(page.locator('summary').filter({ hasText: /^Previous runs \(1\)/ })).toBeVisible();
  97  |   expect(errors).toEqual([]);
  98  |   console.log(JSON.stringify({ initialBuildMs, runAndInspectMs, errors }));
  99  |   await info.attach('production-timing', { contentType: 'application/json', body: JSON.stringify({ initialBuildMs, runAndInspectMs, errors }, null, 2) });
  100 | });
  101 | 
  102 | test('production load of 1000 rows persists two runs and displays the correct total', async ({ page }, info) => {
  103 |   const errors: string[] = [];
  104 |   page.on('pageerror', error => errors.push(error.message));
  105 |   await page.goto('/w/pf-fapi');
  106 |   await page.getByRole('button', { name: 'Build', exact: true }).click();
  107 |   await page.getByText('Test data — upload document or enter examples', { exact: true }).click();
  108 |   await page.getByLabel('Upload test document').setInputFiles({ name: 'production-1000.csv', mimeType: 'text/csv', buffer: Buffer.from('label,amount\n' + Array.from({ length: 1000 }, (_, index) => `Interest income ${index + 1},1`).join('\n')) });
  109 |   await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
  110 |   await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  111 |   await page.getByLabel('Workflow name').fill('Production 1000-row rehearsal');
  112 |   const start = Date.now();
  113 |   await page.getByRole('button', { name: 'Save changes and preview', exact: true }).click();
  114 |   await page.locator('summary').filter({ hasText: /^Category Rollup/ }).click();
  115 |   const rollupOutput = page.locator('details').filter({ has: page.locator('summary', { hasText: /^Category Rollup/ }) }).first();
  116 |   const total = rollupOutput.getByText('category Totals', { exact: true }).locator('..').getByText('interest Income', { exact: true }).locator('..');
  117 |   await expect(total).toContainText('1,000');
  118 |   const runAndInspectMs = Date.now() - start;
  119 |   const reopen = async () => {
  120 |     await page.reload();
  121 |     await page.getByRole('button', { name: 'Workflows', exact: true }).click();
  122 |     await page.getByRole('button', { name: 'Production 1000-row rehearsal', exact: true }).click();
  123 |     await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  124 |   };
  125 |   await reopen();
  126 |   await page.getByRole('button', { name: 'Preview saved version 1 in this browser', exact: true }).click();
  127 |   await reopen();
> 128 |   await expect(page.locator('summary').filter({ hasText: /^Previous runs \(1\)/ })).toBeVisible();
      |                                                                                     ^ Error: expect(locator).toBeVisible() failed
  129 |   await page.locator('summary').filter({ hasText: /^Category Rollup/ }).click();
  130 |   await expect(total).toContainText('1,000');
  131 |   expect(errors).toEqual([]);
  132 |   console.log(JSON.stringify({ count: 1000, runAndInspectMs, persistedRuns: 2, errors }));
  133 |   await info.attach('production-load-timing', { contentType: 'application/json', body: JSON.stringify({ count: 1000, runAndInspectMs, persistedRuns: 2, errors }, null, 2) });
  134 | });
  135 | 
  136 | test('production PDF review calculates final values without downloading document parser bundles', async ({ page }, info) => {
  137 |   const errors: string[] = []; const assets: string[] = [];
  138 |   page.on('pageerror', error => errors.push(error.message));
  139 |   page.on('request', request => { if (request.url().includes('/assets/')) assets.push(request.url()); });
  140 |   const start = Date.now();
  141 |   await page.goto('/w/pf-document-calculator'); await page.getByRole('button', { name: 'Build', exact: true }).click();
  142 |   const openMs = Date.now() - start;
  143 |   await page.getByText('Test data — upload document or enter examples', { exact: true }).click();
  144 |   const uploadStart = Date.now();
  145 |   await page.getByLabel('Upload test document').setInputFiles('e2e/fixtures/demo/sales-check.pdf');
  146 |   await expect(page.getByLabel('Row 1 number_1')).toBeVisible({ timeout: 30000 });
  147 |   const previewMs = Date.now() - uploadStart;
  148 |   await page.getByLabel('Row 1 label', { exact: true }).fill('Item one');
  149 |   await page.getByLabel('Row 1 number_1', { exact: true }).fill('120');
  150 |   await page.getByLabel('Row 2 label', { exact: true }).fill('Item two');
  151 |   await page.getByLabel('Row 2 number_1', { exact: true }).fill('80');
  152 |   await page.getByLabel('Remove row 3', { exact: true }).click();
  153 |   await page.getByLabel('Number to calculate').selectOption('number_1'); await page.getByLabel('Confirm extracted values').check();
  154 |   await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
  155 |   await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  156 |   await page.getByLabel('Workflow name').fill('Document Calculator — PDF rehearsal');
  157 |   const runStart = Date.now();
  158 |   await page.getByRole('button', { name: 'Save changes and preview', exact: true }).click();
  159 |   const summary = page.getByRole('region', { name: 'Final workflow results' });
  160 |   await expect(summary).toContainText('400'); await expect(summary).toContainText('units');
  161 |   await expect(page.locator('summary').filter({ hasText: /^Final result/ })).toHaveText('Final result \u00b7 success');
  162 |   await expect(summary).not.toContainText('review message');
  163 |   const runMs = Date.now() - runStart;
  164 |   await page.locator('summary').filter({ hasText: /^Final result/ }).click();
  165 |   await expect(page.locator('details').filter({ has: page.locator('summary', { hasText: /^Final result/ }) }).first()).toContainText('400');
  166 |   await summary.scrollIntoViewIfNeeded();
  167 |   await page.screenshot({ path: info.outputPath('neutral-pdf-final-result.png'), fullPage: true });
  168 |   expect(errors).toEqual([]);
  169 |   expect(assets.filter(url => /\/(spreadsheets|pdf-processing|word-processing)-/.test(url))).toEqual([]);
  170 |   console.log(JSON.stringify({ openMs, previewMs, runMs, errors, documentParserDownloads: 0 }));
  171 | });
  172 | 
```