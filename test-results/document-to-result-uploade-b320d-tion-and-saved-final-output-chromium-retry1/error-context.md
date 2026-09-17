# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: document-to-result.spec.ts >> uploaded CSV to new keyword rule, rollup, calculation and saved final output
- Location: e2e/document-to-result.spec.ts:3:5

# Error details

```
TimeoutError: locator.click: Timeout 20000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Run saved version 1', exact: true })

```

# Page snapshot

```yaml
- generic [ref=f6e2]:
  - group [ref=f6e3]:
    - 'generic "Workspace: Synthetic workspace (owner)" [ref=f6e4] [cursor=pointer]'
    - option "Select…" [disabled]
    - option "Synthetic workspace (owner)" [selected]
    - option "Viewer" [selected]
    - option "Editor"
    - option "Owner"
  - generic [ref=f6e7]:
    - generic [ref=f6e8]:
      - generic [ref=f6e9]:
        - button "Open chat" [ref=f6e10] [cursor=pointer]:
          - generic [ref=f6e11]: InScope
        - button "Collapse sidebar" [ref=f6e12] [cursor=pointer]
      - button "New chat" [ref=f6e16] [cursor=pointer]
      - button "Workspace" [ref=f6e18] [cursor=pointer]
      - button "Chat" [ref=f6e22] [cursor=pointer]
      - button "Workflows" [ref=f6e28] [cursor=pointer]
      - button "Sources" [ref=f6e36] [cursor=pointer]
      - button "Connections" [ref=f6e44] [cursor=pointer]
      - button "Recent conversations" [ref=f6e54] [cursor=pointer]
      - generic [ref=f6e58]: No saved chats yet.
      - button "Workflows" [ref=f6e59] [cursor=pointer]
      - generic [ref=f6e63]:
        - group [ref=f6e64]:
          - generic "Workflow storage status" [ref=f6e65]: Saved to server
        - button "Library" [ref=f6e66] [cursor=pointer]
        - button "Run history" [ref=f6e69] [cursor=pointer]
        - button "New workflow" [ref=f6e74] [cursor=pointer]
        - generic [ref=f6e76]:
          - generic [ref=f6e77]: MY WORKFLOWS
          - button "FAPI Calculation Template — My workflow" [ref=f6e78] [cursor=pointer]
        - generic [ref=f6e79]:
          - generic [ref=f6e80]: Runnable demos
          - button "Document Calculator" [ref=f6e81] [cursor=pointer]
          - button "Employee Expense Reimbursement" [ref=f6e86] [cursor=pointer]
        - generic [ref=f6e91]:
          - generic [ref=f6e92]: Platform services
          - button "Scope Service" [ref=f6e93] [cursor=pointer]
          - button "Tax Position Summary Workpaper" [ref=f6e106] [cursor=pointer]
          - button "Data Readiness Service" [ref=f6e119] [cursor=pointer]
          - button "Execution Readiness & Review Checklist" [ref=f6e132] [cursor=pointer]
        - generic [ref=f6e145]:
          - generic [ref=f6e146]: Foundation
          - button "Ownership Graph Workpaper" [ref=f6e147] [cursor=pointer]
          - button "Tax Attribute Continuity Workpaper" [ref=f6e154] [cursor=pointer]
          - button "Portfolio Calendar & Requests Workpaper" [ref=f6e161] [cursor=pointer]
        - generic [ref=f6e168]:
          - generic [ref=f6e169]: Tier 1
          - button "FAPI Calculation (portfolio)" [ref=f6e170] [cursor=pointer]
          - button "T1134 Affiliate Reporting Workpaper" [ref=f6e176] [cursor=pointer]
          - button "Foreign Affiliate Surplus Continuity Workpaper" [ref=f6e182] [cursor=pointer]
          - button "T106 Transaction Workpaper" [ref=f6e188] [cursor=pointer]
          - button "EIFEL Fixed-Ratio Scenario Workpaper" [ref=f6e194] [cursor=pointer]
          - button "T2 Taxable Income Bridge Workpaper" [ref=f6e200] [cursor=pointer]
          - button "Corporate Tax Provision Workpaper" [ref=f6e206] [cursor=pointer]
          - button "Part XIII Withholding Workpaper" [ref=f6e212] [cursor=pointer]
      - generic [ref=f6e218]:
        - button "Settings" [ref=f6e220] [cursor=pointer]
        - button "Help" [ref=f6e227] [cursor=pointer]
        - group "Theme" [ref=f6e235]:
          - button "Light" [pressed] [ref=f6e236] [cursor=pointer]
          - button "Dark" [ref=f6e243] [cursor=pointer]
    - generic [ref=f6e246]:
      - generic [ref=f6e247]:
        - generic [ref=f6e248]:
          - button "Workflows" [ref=f6e250] [cursor=pointer]
          - generic [ref=f6e256]:
            - generic [ref=f6e257]: FAPI Calculation Template — My workflow
            - generic [ref=f6e258]: Version 1
            - button "Overview" [ref=f6e260] [cursor=pointer]
            - button "Build" [ref=f6e261] [cursor=pointer]
            - button "Run" [active] [ref=f6e262] [cursor=pointer]
            - button "Results" [ref=f6e263] [cursor=pointer]
        - generic [ref=f6e269]:
          - generic [ref=f6e270]:
            - generic [ref=f6e271]:
              - text: Workflow name
              - textbox "Workflow name" [ref=f6e272]: FAPI Calculation Template — My workflow
            - paragraph [ref=f6e273]: Personal workflow · Saved version 1
          - region "Workflow execution" [ref=f6e274]:
            - generic [ref=f6e275]:
              - heading "FAPI Calculation Template — My workflow" [level=3] [ref=f6e276]
              - paragraph [ref=f6e277]: Version 1 · Run local-tool-workflow-2199c58c-8680-401c-a15c-69207fb134f7
              - status [ref=f6e278]: Paused — ready when you are
            - link "Open this workflow in Run" [ref=f6e279] [cursor=pointer]:
              - /url: /w/custom%3Ac8b05ed0-9e3a-4ff4-9558-bb3b7f2f3523?run=local-tool-workflow-2199c58c-8680-401c-a15c-69207fb134f7
            - button "Continue in Chat" [ref=f6e280] [cursor=pointer]
            - paragraph [ref=f6e281]: Interactive execution stays in this browser. Progress and evidence are included in the workspace save; resume after reopening. Server background runs remain available in Run.
            - generic [ref=f6e282]:
              - button "Resume workflow" [ref=f6e283] [cursor=pointer]
              - button "New run from Build" [ref=f6e284] [cursor=pointer]
              - button "Approve completed results" [ref=f6e285] [cursor=pointer]
            - group "Sources" [ref=f6e286]:
              - generic [ref=f6e288]:
                - text: Source block
                - combobox "Run source block" [ref=f6e289]:
                  - option "Choose a source block"
                  - option "Trial Balance" [selected]
              - generic [ref=f6e290]:
                - text: Source action
                - combobox "Source action" [ref=f6e291]:
                  - option "Replace source records" [selected]
                  - option "Add another source"
              - button "Upload run source" [ref=f6e292]
              - paragraph [ref=f6e293]: Source changes preserve previous evidence and mark affected results as outdated. Pause before changing sources.
            - list "Execution steps" [ref=f6e294]:
              - listitem [ref=f6e295]:
                - group [ref=f6e296]:
                  - generic "1. Trial Balance · success" [ref=f6e297] [cursor=pointer]
              - listitem [ref=f6e298]:
                - group [ref=f6e299]:
                  - generic "2. FAPI Inputs · success" [ref=f6e300] [cursor=pointer]
              - listitem [ref=f6e301]:
                - group [ref=f6e302]:
                  - generic "3. Bank of Canada Valet API · warning" [ref=f6e303] [cursor=pointer]
              - listitem [ref=f6e304]:
                - group [ref=f6e305]:
                  - generic "4. Bank of Canada FX Rate · success" [ref=f6e306] [cursor=pointer]
              - listitem [ref=f6e307]:
                - group [ref=f6e308]:
                  - generic "5. Keyword Mapper · warning" [ref=f6e309] [cursor=pointer]
              - listitem [ref=f6e310]:
                - group [ref=f6e311]:
                  - generic "6. Category Rollup · success" [ref=f6e312] [cursor=pointer]
              - listitem [ref=f6e313]:
                - group [ref=f6e314]:
                  - generic "7. FAPI Lines Engine · success" [ref=f6e315] [cursor=pointer]
              - listitem [ref=f6e316]:
                - group [ref=f6e317]:
                  - generic "8. FAPI Summary Engine · success" [ref=f6e318] [cursor=pointer]
              - listitem [ref=f6e319]:
                - group [ref=f6e320]:
                  - generic "9. Income & Expense · success" [ref=f6e321] [cursor=pointer]
              - listitem [ref=f6e322]:
                - group [ref=f6e323]:
                  - generic "10. FAPI Lines A–H · success" [ref=f6e324] [cursor=pointer]
              - listitem [ref=f6e325]:
                - group [ref=f6e326]:
                  - generic "11. FAPI Summary · success" [ref=f6e327] [cursor=pointer]
              - listitem [ref=f6e328]:
                - group [ref=f6e329]:
                  - generic "12. Evidence Pack · warning" [ref=f6e330] [cursor=pointer]
              - listitem [ref=f6e331]:
                - group [ref=f6e332]:
                  - generic "13. Canonical JSON · warning" [ref=f6e333] [cursor=pointer]
            - group [ref=f6e334]:
              - generic "Execution history (1)" [ref=f6e335] [cursor=pointer]
            - complementary "Workflow execution lifetime" [ref=f6e336]:
              - generic [ref=f6e340]: Durable runs use an immutable saved version and continue on the server if this tab closes. All installed workflow tools are supported. Runs use the inputs and source responses saved in that version. Browser previews require this tab to stay open.
          - group [ref=f6e341]:
            - generic "Test data — upload document or enter examples" [ref=f6e342] [cursor=pointer]
            - option "Trial Balance" [selected]
          - region "API data for next run" [ref=f6e343]:
            - heading "API data for next run" [level=3] [ref=f6e344]
            - paragraph [ref=f6e345]: Run uses the saved response; it does not fetch again. To refresh, open the source in Build, create a new source version if locked, fetch, then save the workflow.
            - generic [ref=f6e346]:
              - strong [ref=f6e347]: Bank of Canada FX Rate
              - paragraph [ref=f6e348]: "Manual override active: 1.35. The fetched rate is not used."
              - paragraph [ref=f6e349]: "Fetched: Not recorded"
          - region "Trigger readiness" [ref=f6e350]:
            - heading "Workflow start conditions" [level=3] [ref=f6e351]
            - paragraph [ref=f6e352]: Advisory only — you can always start a manual run. Field checks use recorded source outputs; test again after changing data.
            - generic [ref=f6e353]:
              - generic [ref=f6e354]:
                - generic [ref=f6e355]: Document uploaded
                - generic [ref=f6e356]: Met
              - paragraph [ref=f6e357]: "Trial Balance · Uploaded: sales-check.csv"
          - generic [ref=f6e358]:
            - paragraph [ref=f6e359]: Build and Run share saved version 1
            - generic [ref=f6e360]:
              - text: Saved workflow version
              - combobox "Saved workflow version" [ref=f6e361]:
                - option "FAPI Calculation Template — My workflow - Version 1" [selected]
            - button "Preview saved version 1 in this browser" [ref=f6e362] [cursor=pointer]
            - button "Run saved version 1 durably" [ref=f6e363] [cursor=pointer]
          - button "Save changes and preview" [ref=f6e364] [cursor=pointer]
          - paragraph [ref=f6e365]: Runs the graph and rules shown in Build using its configured source data. Blocks without an executable tool are reported in the results.
          - complementary "Workflow execution lifetime" [ref=f6e366]:
            - generic [ref=f6e370]: Durable runs use an immutable saved version and continue on the server if this tab closes. All installed workflow tools are supported. Runs use the inputs and source responses saved in that version. Browser previews require this tab to stay open.
          - generic [ref=f6e371]:
            - heading "Version 1 · 9/17/2026, 2:54:30 AM · warning" [level=3] [ref=f6e372]
            - paragraph [ref=f6e373]: Run ID local-tool-workflow-2199c58c-8680-401c-a15c-69207fb134f7 · Started from run
            - region "Final workflow results" [ref=f6e374]:
              - heading "Final results" [level=3] [ref=f6e375]
              - generic [ref=f6e376]:
                - text: Display precision
                - combobox "Result display precision" [ref=f6e377]:
                  - option "Full precision" [selected]
                  - option "0 decimal places"
                  - option "2 decimal places"
                  - option "4 decimal places"
                  - option "6 decimal places"
              - paragraph [ref=f6e378]: Display formatting does not change values sent to other blocks or exported in JSON.
              - group [ref=f6e379]:
                - generic "Choose displayed results" [ref=f6e380]
              - table [ref=f6e381]:
                - rowgroup [ref=f6e382]:
                  - row [ref=f6e383]:
                    - columnheader "Result" [ref=f6e384]
                    - columnheader "Value" [ref=f6e385]
                    - columnheader "Unit" [ref=f6e386]
                - rowgroup [ref=f6e387]:
                  - row [ref=f6e388]:
                    - cell "Final widget result FAPI Summary Engine" [ref=f6e389]:
                      - text: Final widget result
                      - generic [ref=f6e390]: FAPI Summary Engine
                    - cell "50,000" [ref=f6e391]
                    - cell "—" [ref=f6e392]
                  - row [ref=f6e393]:
                    - cell "FX Rate FAPI Summary Engine" [ref=f6e394]:
                      - text: FX Rate
                      - generic [ref=f6e395]: FAPI Summary Engine
                    - cell "1.35" [ref=f6e396]
                    - cell "—" [ref=f6e397]
                  - row [ref=f6e398]:
                    - cell "Deductions FAPI Summary Engine" [ref=f6e399]:
                      - text: Deductions
                      - generic [ref=f6e400]: FAPI Summary Engine
                    - cell "0" [ref=f6e401]
                    - cell "—" [ref=f6e402]
                  - row [ref=f6e403]:
                    - cell "Gross FAPI Summary Engine" [ref=f6e404]:
                      - text: Gross
                      - generic [ref=f6e405]: FAPI Summary Engine
                    - cell "0" [ref=f6e406]
                    - cell "—" [ref=f6e407]
                  - row [ref=f6e408]:
                    - cell "Deductions CAD FAPI Summary Engine" [ref=f6e409]:
                      - text: Deductions CAD
                      - generic [ref=f6e410]: FAPI Summary Engine
                    - cell "0" [ref=f6e411]
                    - cell "—" [ref=f6e412]
                  - row [ref=f6e413]:
                    - cell "Gross CAD FAPI Summary Engine" [ref=f6e414]:
                      - text: Gross CAD
                      - generic [ref=f6e415]: FAPI Summary Engine
                    - cell "0" [ref=f6e416]
                    - cell "—" [ref=f6e417]
                  - row [ref=f6e418]:
                    - cell "FAPI Brut FAPI Summary Engine" [ref=f6e419]:
                      - text: FAPI Brut
                      - generic [ref=f6e420]: FAPI Summary Engine
                    - cell "0" [ref=f6e421]
                    - cell "—" [ref=f6e422]
                  - row [ref=f6e423]:
                    - cell "FAPI Brut CAD FAPI Summary Engine" [ref=f6e424]:
                      - text: FAPI Brut CAD
                      - generic [ref=f6e425]: FAPI Summary Engine
                    - cell "0" [ref=f6e426]
                    - cell "—" [ref=f6e427]
                  - row [ref=f6e428]:
                    - cell "FAT Deduction FAPI Summary Engine" [ref=f6e429]:
                      - text: FAT Deduction
                      - generic [ref=f6e430]: FAPI Summary Engine
                    - cell "0" [ref=f6e431]
                    - cell "—" [ref=f6e432]
                  - row [ref=f6e433]:
                    - cell "FAT Deduction CAD FAPI Summary Engine" [ref=f6e434]:
                      - text: FAT Deduction CAD
                      - generic [ref=f6e435]: FAPI Summary Engine
                    - cell "0" [ref=f6e436]
                    - cell "—" [ref=f6e437]
                  - row [ref=f6e438]:
                    - cell "Net FAPI FAPI Summary Engine" [ref=f6e439]:
                      - text: Net FAPI
                      - generic [ref=f6e440]: FAPI Summary Engine
                    - cell "0" [ref=f6e441]
                    - cell "—" [ref=f6e442]
                  - row [ref=f6e443]:
                    - cell "Net FAPI CAD FAPI Summary Engine" [ref=f6e444]:
                      - text: Net FAPI CAD
                      - generic [ref=f6e445]: FAPI Summary Engine
                    - cell "0" [ref=f6e446]
                    - cell "—" [ref=f6e447]
              - group [ref=f6e448]:
                - generic "2 review messages" [ref=f6e449]
            - region "API data used in this run" [ref=f6e450]:
              - heading "API data used in this run" [level=3] [ref=f6e451]
              - paragraph [ref=f6e452]: Run uses the saved response; it does not fetch again. To refresh, open the source in Build, create a new source version if locked, fetch, then save the workflow.
              - generic [ref=f6e453]:
                - strong [ref=f6e454]: Bank of Canada FX Rate
                - paragraph [ref=f6e455]: "Manual override active: 1.35. The fetched rate is not used."
                - paragraph [ref=f6e456]: "Fetched: Not recorded"
            - group [ref=f6e457]:
              - generic "Bank of Canada Valet API · warning" [ref=f6e458] [cursor=pointer]
            - group [ref=f6e459]:
              - generic "Trial Balance · success" [ref=f6e460] [cursor=pointer]
            - group [ref=f6e461]:
              - generic "FAPI Inputs · success" [ref=f6e462] [cursor=pointer]
            - group [ref=f6e463]:
              - generic "Bank of Canada FX Rate · success" [ref=f6e464] [cursor=pointer]
            - group [ref=f6e465]:
              - generic "Keyword Mapper · warning" [ref=f6e466] [cursor=pointer]
            - group [ref=f6e467]:
              - generic "Category Rollup · success" [ref=f6e468] [cursor=pointer]
            - group [ref=f6e469]:
              - generic "Income & Expense · success" [ref=f6e470] [cursor=pointer]
            - group [ref=f6e471]:
              - generic "FAPI Lines Engine · success" [ref=f6e472] [cursor=pointer]
            - group [ref=f6e473]:
              - generic "FAPI Lines A–H · success" [ref=f6e474] [cursor=pointer]
            - group [ref=f6e475]:
              - generic "FAPI Summary Engine · success" [ref=f6e476] [cursor=pointer]
            - group [ref=f6e477]:
              - generic "FAPI Summary · success" [ref=f6e478] [cursor=pointer]
            - group [ref=f6e479]:
              - generic "Evidence Pack · warning" [ref=f6e480] [cursor=pointer]
            - group [ref=f6e481]:
              - generic "Canonical JSON · warning" [ref=f6e482] [cursor=pointer]
      - separator "Drag to resize" [ref=f6e483]
      - generic [ref=f6e485]:
        - generic [ref=f6e486]:
          - generic [ref=f6e487]: Chat panel
          - button "Hide chat panel" [ref=f6e488] [cursor=pointer]
          - button "Expand chat panel" [ref=f6e492] [cursor=pointer]
        - generic [ref=f6e499]:
          - generic [ref=f6e500]:
            - generic [ref=f6e501]:
              - button "Choose client — Scope reads their worksheets & documents" [ref=f6e502] [cursor=pointer]
              - generic [ref=f6e558]:
                - button "N Northstar Inc" [ref=f6e559] [cursor=pointer]:
                  - generic [ref=f6e560]: "N"
                  - generic [ref=f6e561]: Northstar Inc
                - button "Work" [ref=f6e566] [cursor=pointer]
            - 'button "Context: 0 selected, 0 used" [ref=f6e575] [cursor=pointer]'
            - button "Tools" [ref=f6e581] [cursor=pointer]:
              - generic [ref=f6e584]: "9"
          - generic [ref=f6e588]:
            - generic [ref=f6e589]:
              - generic [ref=f6e590]: Good morning, Sophia
              - generic [ref=f6e591]: What would you like to work on?
            - generic [ref=f6e594]:
              - textbox "Ask Scope, or describe a task…" [ref=f6e595]
              - generic [ref=f6e596]:
                - button "Add — search, workflows, worksheets" [ref=f6e597] [cursor=pointer]
                - button "Attach files" [ref=f6e599] [cursor=pointer]
                - 'button "Chat agent: Sina" [ref=f6e602] [cursor=pointer]': Sina
                - button "Send" [disabled] [ref=f6e613]
  - region "Notifications alt+T"
```

# Test source

```ts
  1   | import { test, expect } from './workflow-audit-isolation';
  2   | 
  3   | test('uploaded CSV to new keyword rule, rollup, calculation and saved final output', async ({ page }, testInfo) => {
  4   |   test.setTimeout(180000);
  5   |   page.setDefaultTimeout(20000);
  6   |   const timings: Record<string, number> = {};
  7   |   const browserErrors: string[] = [];
  8   |   page.on('pageerror', error => browserErrors.push(error.message));
  9   |   let started = Date.now();
  10  |   await page.setViewportSize({ width: 1600, height: 1000 });
  11  |   await page.goto('/w/pf-fapi');
  12  |   await page.getByRole('button', { name: 'Build', exact: true }).click();
  13  |   timings.initialBuildMs = Date.now() - started;
  14  |   await page.getByText('Test data — upload document or enter examples', { exact: true }).click();
  15  |   await page.getByLabel('Upload test document').setInputFiles({
  16  |     name: 'sales-check.csv', mimeType: 'text/csv',
  17  |     buffer: Buffer.from('label,amount,quantity\nWidget order one,120,3\nWidget order two,80,2\nConsulting service,50,1\n'),
  18  |   });
  19  |   await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
  20  |   const library = () => page.evaluate(async () => { const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts'); return Object.values(readWorkflowLibrary())[0] as any; });
  21  |   await expect.poll(async () => (await library())?.draft.blocks.some((b: any) => b.config.fileName === 'sales-check.csv')).toBeTruthy();
  22  |   const id = (await library()).id;
  23  |   async function openBlock(label: string) {
  24  |     console.log(`Opening ${label}`);
  25  |     await page.goto(`/w/${id}`);
  26  |     await page.getByRole('button', { name: 'Build', exact: true }).click();
  27  |     started = Date.now();
  28  |     await page.getByRole('button', { name: label, exact: true }).click();
  29  |     timings[`${label}OpenMs`] = Date.now() - started;
  30  |   }
  31  |   await openBlock('Keyword Mapper');
  32  |   await page.getByRole('button', { name: 'New', exact: true }).click();
  33  |   await page.locator('div.space-y-1\\.5').filter({ has: page.locator('label', { hasText: /^Category ID$/ }) }).locator('input').fill('widget_sales');
  34  |   await page.locator('div.space-y-1\\.5').filter({ has: page.locator('label', { hasText: /^Category label$/ }) }).locator('input').fill('Widget sales');
  35  |   await page.getByPlaceholder('Add contains keyword').fill('Widget');
  36  |   await page.getByPlaceholder('Add contains keyword').press('Enter');
  37  |   await page.getByRole('button', { name: 'Test with upstream blocks', exact: true }).click();
  38  |   await expect(page.getByTestId('block-io-panel')).toContainText('Widget sales');
  39  | 
  40  |   await openBlock('Category Rollup');
  41  |   await page.getByRole('button', { name: 'New Group', exact: true }).click();
  42  |   await page.getByPlaceholder('e.g. income_base').fill('widget_total');
  43  |   await page.getByPlaceholder('e.g. Income Base').fill('Widget total');
  44  |   await page.getByRole('button', { name: 'Widget sales', exact: true }).click();
  45  |   await page.getByRole('button', { name: 'Test with upstream blocks', exact: true }).click();
  46  |   await expect(page.getByTestId('block-io-panel')).toContainText('widget total');
  47  | 
  48  |   await openBlock('FAPI Lines Engine');
  49  |   await page.getByRole('button', { name: 'New term', exact: true }).click();
  50  |   await page.getByPlaceholder('KEY', { exact: true }).fill('WIDGET_RESULT');
  51  |   await page.getByPlaceholder('Label', { exact: true }).fill('Adjusted widget sales');
  52  |   await page.getByRole('button', { name: /^widget_total(?: = 200)?$/ }).click();
  53  |   await page.getByRole('button', { name: '×', exact: true }).click();
  54  |   await page.getByRole('spinbutton', { name: 'Number to add' }).fill('500');
  55  |   await page.getByRole('button', { name: 'Add number', exact: true }).click();
  56  |   await page.getByRole('button', { name: '÷', exact: true }).click();
  57  |   await page.getByRole('spinbutton', { name: 'Number to add' }).fill('2');
  58  |   await page.getByRole('button', { name: 'Add number', exact: true }).click();
  59  |   await page.getByRole('button', { name: 'Test with upstream blocks', exact: true }).click();
  60  |   await expect(page.getByTestId('block-io-panel')).toContainText('50,000');
  61  | 
  62  |   await openBlock('FAPI Summary Engine');
  63  |   await page.getByRole('button', { name: 'New term', exact: true }).click();
  64  |   await page.getByPlaceholder('KEY', { exact: true }).fill('FINAL_WIDGET_RESULT');
  65  |   await page.getByPlaceholder('Label', { exact: true }).fill('Final widget result');
  66  |   await page.getByRole('button', { name: /^WIDGET_RESULT(?: = 50000)?$/ }).click();
  67  |   await page.goto(`/w/${id}`);
  68  |   await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  69  |   started = Date.now();
  70  |   await page.getByRole('button', { name: 'Save changes and preview', exact: true }).click();
  71  |   const entry = await library();
  72  |   timings.fullRunMs = Date.now() - started;
  73  |   const run = entry.runs.at(-1).result.result;
  74  |   expect(run.errors).toEqual([]);
  75  |   expect(run.results.filter((result: any) => result.status === 'error')).toEqual([]);
  76  |   const output = (blockId: string) => run.results.find((result: any) => result.blockId === blockId).output;
  77  |   expect(output('fapi-source-trial-balance').rows).toHaveLength(3);
  78  |   expect(output('fapi-logic-keyword-mapper').mappedRows).toHaveLength(2);
  79  |   expect(output('fapi-logic-keyword-mapper').unmatchedRows).toHaveLength(1);
  80  |   expect(output('fapi-logic-category-rollup').rollupTotals.widget_total).toBe(200);
  81  |   expect(output('fapi-logic-lines-engine').calculatedResults.WIDGET_RESULT).toBe(50000);
  82  |   expect(output('fapi-logic-summary-engine').calculatedResults.FINAL_WIDGET_RESULT).toBe(50000);
  83  |   expect(output('fapi-output-json').canonicalJson.calculated_results.FINAL_WIDGET_RESULT).toBe(50000);
  84  |   await page.locator('summary').filter({ hasText: /^Canonical JSON/ }).click();
  85  |   await expect(page.locator('details').filter({ has: page.locator('summary', { hasText: /^Canonical JSON/ }) }).first()).toContainText('50,000');
  86  |   await testInfo.attach('verified-results', { contentType: 'application/json', body: JSON.stringify({
  87  |     document: 'sales-check.csv', rows: 3, matched: 2, unmatched: 1,
  88  |     groupTotal: 200, formula: 'widget_total * 500 / 2', finalResult: 50000,
  89  |     workflow: entry.draft.name, version: entry.runs.at(-1).version, warnings: run.warnings,
  90  |   }, null, 2) });
  91  |   await page.screenshot({ path: testInfo.outputPath('final-result.png'), fullPage: true });
  92  |   await page.goto(`/w/${id}`);
  93  |   await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  94  |   const version = entry.runs.at(-1).version;
  95  |   for (let repeat = 1; repeat <= 3; repeat++) {
  96  |     started = Date.now();
> 97  |     await page.getByRole('button', { name: `Run saved version ${version}`, exact: true }).click();
      |                                                                                           ^ TimeoutError: locator.click: Timeout 20000ms exceeded.
  98  |     const persisted = await library();
  99  |     const rerun = persisted.runs.at(-1);
  100 |     timings[`rerun${repeat}Ms`] = Date.now() - started;
  101 |     const storedCharacters = await page.evaluate(() => localStorage.getItem('taxflow:workflow-library:v1')!.length);
  102 |     console.log(JSON.stringify({ repeat, runsPersisted: persisted.runs.length, storedCharacters, expandedCharacters: JSON.stringify(persisted).length, timings, browserErrors }));
  103 |     expect(persisted.runs).toHaveLength(entry.runs.length + repeat);
  104 |     expect(rerun.version).toBe(version);
  105 |     expect(rerun.result.result.runId).not.toBe(entry.runs.at(-1).result.result.runId);
  106 |     expect(rerun.result.result.results.find((result: any) => result.blockId === 'fapi-output-json').output.canonicalJson.calculated_results.FINAL_WIDGET_RESULT).toBe(50000);
  107 |   }
  108 |   expect(browserErrors).toEqual([]);
  109 |   await testInfo.attach('timings', { contentType: 'application/json', body: JSON.stringify(timings, null, 2) });
  110 | });
  111 | 
```