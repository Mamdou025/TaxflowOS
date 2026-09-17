# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: production-demo.spec.ts >> production PDF review calculates final values without downloading document parser bundles
- Location: e2e/production-demo.spec.ts:136:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByLabel('Row 1 number_1')
Expected: visible
Timeout: 30000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 30000ms
  - waiting for getByLabel('Row 1 number_1')

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
- button "Document Calculator — My workflow"
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
- text: Document Calculator — My workflow Unsaved changes
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
    - option "Document" [selected]
  - button "Upload test document"
  - button "Enter example data / JSON"
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
  128 |   await expect(page.locator('summary').filter({ hasText: /^Previous runs \(1\)/ })).toBeVisible();
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
> 146 |   await expect(page.getByLabel('Row 1 number_1')).toBeVisible({ timeout: 30000 });
      |                                                   ^ Error: expect(locator).toBeVisible() failed
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