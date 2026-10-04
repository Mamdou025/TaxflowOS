# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: production-demo.spec.ts >> production individual block tests show real inputs and outputs without becoming full workflow runs
- Location: e2e/production-demo.spec.ts:3:5

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Build', exact: true })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - group [ref=e4]:
    - 'generic "Workspace: Synthetic workspace (owner)" [ref=e5] [cursor=pointer]'
    - option "Select…" [disabled]
    - option "Synthetic workspace (owner)" [selected]
    - option "Viewer" [selected]
    - option "Editor"
    - option "Owner"
  - generic [ref=e8]:
    - generic [ref=e9]:
      - generic [ref=e10]:
        - button "Open chat" [ref=e11] [cursor=pointer]:
          - generic [ref=e12]: InScope
        - button "Collapse sidebar" [ref=e13] [cursor=pointer]
      - button "New chat" [ref=e17] [cursor=pointer]
      - button "Workspace" [ref=e19] [cursor=pointer]
      - button "Chat" [ref=e23] [cursor=pointer]
      - button "Workflows" [ref=e29] [cursor=pointer]
      - button "Sources" [ref=e37] [cursor=pointer]
      - button "Connections" [ref=e45] [cursor=pointer]
      - button "Recent conversations" [ref=e55] [cursor=pointer]
      - generic [ref=e59]: No saved chats yet.
      - button "Workflows" [ref=e60] [cursor=pointer]
      - generic [ref=e64]:
        - group [ref=e65]:
          - generic "Workflow storage status" [ref=e66]: Ready to save to server
        - button "Library" [ref=e67] [cursor=pointer]
        - button "Run history" [ref=e70] [cursor=pointer]
        - button "New workflow" [ref=e75] [cursor=pointer]
        - generic [ref=e77]:
          - generic [ref=e78]: Platform services
          - button "Scope Service" [ref=e79] [cursor=pointer]
          - button "Tax Position Summary Workpaper" [ref=e92] [cursor=pointer]
          - button "Data Readiness Service" [ref=e105] [cursor=pointer]
          - button "Execution Readiness & Review Checklist" [ref=e118] [cursor=pointer]
        - generic [ref=e131]:
          - generic [ref=e132]: Foundation
          - button "Ownership Graph Workpaper" [ref=e133] [cursor=pointer]
          - button "Tax Attribute Continuity Workpaper" [ref=e140] [cursor=pointer]
          - button "Portfolio Calendar & Requests Workpaper" [ref=e147] [cursor=pointer]
        - generic [ref=e154]:
          - generic [ref=e155]: Tier 1
          - button "FAPI Calculation (portfolio)" [ref=e156] [cursor=pointer]
          - button "T1134 Affiliate Reporting Workpaper" [ref=e162] [cursor=pointer]
          - button "Foreign Affiliate Surplus Continuity Workpaper" [ref=e168] [cursor=pointer]
          - button "T106 Transaction Workpaper" [ref=e174] [cursor=pointer]
          - button "EIFEL Fixed-Ratio Scenario Workpaper" [ref=e180] [cursor=pointer]
          - button "T2 Taxable Income Bridge Workpaper" [ref=e186] [cursor=pointer]
          - button "Corporate Tax Provision Workpaper" [ref=e192] [cursor=pointer]
          - button "Part XIII Withholding Workpaper" [ref=e198] [cursor=pointer]
      - generic [ref=e204]:
        - button "Settings" [ref=e206] [cursor=pointer]
        - button "Help" [ref=e213] [cursor=pointer]
        - group "Theme" [ref=e221]:
          - button "Light" [pressed] [ref=e222] [cursor=pointer]
          - button "Dark" [ref=e229] [cursor=pointer]
    - generic [ref=e232]:
      - generic [ref=e233]:
        - generic [ref=e234]:
          - button "Workflows" [ref=e236] [cursor=pointer]
          - generic [ref=e242]: Select a workflow
        - generic [ref=e248]:
          - generic [ref=e254]: Select a workflow
          - generic [ref=e255]: Pick one in the sidebar to view its process, build it, run it, and review the result — all here.
      - separator "Drag to resize" [ref=e256]
      - generic [ref=e258]:
        - generic [ref=e259]:
          - generic [ref=e260]: Chat panel
          - button "Hide chat panel" [ref=e261] [cursor=pointer]
          - button "Expand chat panel" [ref=e265] [cursor=pointer]
        - generic [ref=e272]:
          - generic [ref=e273]:
            - generic [ref=e274]:
              - text: Agent
              - combobox "Chat agent" [ref=e275]:
                - option "Sina" [selected]
                - option "MicroSina · Foundry"
            - button "Mkoro computer settings" [ref=e276] [cursor=pointer]:
              - generic [ref=e279]: Mkoro computer
              - generic [ref=e280]: Unverified
          - generic [ref=e281]:
            - generic [ref=e282]:
              - button "Choose client — Scope reads their worksheets & documents" [ref=e283] [cursor=pointer]
              - generic [ref=e339]:
                - button "N Northstar Inc" [ref=e340] [cursor=pointer]:
                  - generic [ref=e341]: "N"
                  - generic [ref=e342]: Northstar Inc
                - button "Work" [ref=e347] [cursor=pointer]
            - 'button "Context: 0 selected, 0 used" [ref=e356] [cursor=pointer]'
            - button "Tools" [ref=e362] [cursor=pointer]:
              - generic [ref=e365]: "9"
          - generic [ref=e369]:
            - generic [ref=e370]:
              - generic [ref=e371]: Good morning, Sophia
              - generic [ref=e372]: What would you like to work on?
            - generic [ref=e375]:
              - textbox "Ask Scope, or describe a task…" [ref=e376]
              - generic [ref=e377]:
                - button "Add — search, workflows, worksheets" [ref=e378] [cursor=pointer]
                - button "Attach files" [ref=e380] [cursor=pointer]
                - 'button "Chat agent: Sina" [ref=e383] [cursor=pointer]': Sina
                - button "Send" [disabled] [ref=e394]
  - region "Notifications alt+T"
```

# Test source

```ts
  1   | import { test, expect } from './workflow-audit-isolation';
  2   | 
  3   | test('production individual block tests show real inputs and outputs without becoming full workflow runs', async ({ page }, info) => {
  4   |   const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  5   |   const start = Date.now();
  6   |   await page.goto('/w/pf-document-calculator');
> 7   |   await page.getByRole('button', { name: 'Build', exact: true }).click();
      |                                                                  ^ Error: locator.click: Test timeout of 60000ms exceeded.
  8   |   await page.getByRole('button', { name: 'Calculate', exact: true }).click();
  9   |   await page.getByRole('button', { name: 'Test block', exact: true }).click();
  10  |   const panel = page.getByRole('region', { name: 'Individual block test' });
  11  |   await panel.getByLabel('Test value 1 number').fill('125.5');
  12  |   const runStart = Date.now();
  13  |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  14  |   await expect(panel.getByText('251', { exact: true })).toBeVisible();
  15  |   await expect(panel.getByText('125.5', { exact: true })).toBeVisible();
  16  |   await expect(panel).toContainText('Individual block test');
  17  |   const runMs = Date.now() - runStart;
  18  |   await page.screenshot({ path: info.outputPath('production-individual-block.png'), fullPage: true });
  19  |   await page.getByRole('button', { name: 'Close', exact: true }).click();
  20  |   await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  21  |   await expect(page.getByRole('region', { name: 'Final workflow results' })).toHaveCount(0);
  22  |   await page.getByRole('button', { name: 'Build', exact: true }).click();
  23  |   await page.getByRole('button', { name: 'Final result', exact: true }).click();
  24  |   await page.getByRole('button', { name: 'Test block', exact: true }).click();
  25  |   await panel.getByLabel('Block test input source').selectOption('recorded');
  26  |   await panel.getByRole('button', { name: 'Run block', exact: true }).click();
  27  |   await expect(panel).toContainText('251');
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
```