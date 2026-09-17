# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workspace-dataflow.spec.ts >> Run keeps saved versions separate from changed drafts and readiness stays advisory
- Location: e2e/workspace-dataflow.spec.ts:55:5

# Error details

```
Error: page.evaluate: TypeError: Failed to fetch dynamically imported module: http://127.0.0.1:5173/src/shared/workflow-engine/workflow/canvas.ts
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e7]:
        - button "Open chat" [ref=e8] [cursor=pointer]:
          - generic [ref=e9]: InScope
        - button "Collapse sidebar" [ref=e10] [cursor=pointer]
      - button "New chat" [ref=e14] [cursor=pointer]
      - button "Workspace" [ref=e16] [cursor=pointer]
      - button "Workflows" [ref=e20] [cursor=pointer]
      - button "Agent" [ref=e28] [cursor=pointer]
      - button "Documents" [ref=e35] [cursor=pointer]
      - button "Clients & Chats" [ref=e43] [cursor=pointer]
      - generic [ref=e47]:
        - generic [ref=e48]:
          - generic [ref=e49] [cursor=pointer]:
            - generic "Northstar Inc." [ref=e56]
            - generic [ref=e57]:
              - button "New subfolder" [ref=e58]
              - button "New chat" [ref=e61]
              - button "Delete folder" [ref=e64]
          - generic [ref=e69] [cursor=pointer]:
            - generic "FAPI · 2025" [ref=e76]
            - generic [ref=e77]:
              - button "New subfolder" [ref=e78]
              - button "New chat" [ref=e81]
              - button "Delete folder" [ref=e84]
          - generic [ref=e89] [cursor=pointer]:
            - generic "T1134 · 2025" [ref=e96]
            - generic [ref=e97]:
              - button "New subfolder" [ref=e98]
              - button "New chat" [ref=e101]
              - button "Delete folder" [ref=e104]
          - generic [ref=e109] [cursor=pointer]:
            - generic "GROSS approval — $538,100" [ref=e113]: GROSS approval — $538,1001w ago
            - button "Delete chat" [ref=e115]
        - generic [ref=e120] [cursor=pointer]:
          - generic "Meridian Energy Corp." [ref=e127]
          - generic [ref=e128]:
            - button "New subfolder" [ref=e129]
            - button "New chat" [ref=e132]
            - button "Delete folder" [ref=e135]
        - generic [ref=e140] [cursor=pointer]:
          - generic "Cascade Technologies Ltd." [ref=e147]
          - generic [ref=e148]:
            - button "New subfolder" [ref=e149]
            - button "New chat" [ref=e152]
            - button "Delete folder" [ref=e155]
        - button "New client folder" [ref=e159] [cursor=pointer]
      - button "Recent chats" [ref=e162] [cursor=pointer]
      - generic [ref=e166]: No saved chats yet.
      - group "Theme" [ref=e169]:
        - button "Light" [pressed] [ref=e170] [cursor=pointer]
        - button "Dark" [ref=e177] [cursor=pointer]
    - generic [ref=e185]:
      - generic [ref=e186]:
        - generic [ref=e187]: InScope
        - button "Choose client — Scope reads their worksheets & documents" [ref=e188] [cursor=pointer]
      - generic [ref=e245]:
        - generic [ref=e246]:
          - generic [ref=e247]: Good afternoon, Sophia
          - generic [ref=e248]: How can I help you drive impact today?
        - generic [ref=e251]:
          - textbox "Ask Scope, or describe a task…" [ref=e252]
          - generic [ref=e253]:
            - button "Add — search, attach, workflows, worksheets" [ref=e254] [cursor=pointer]
            - button "Attach files" [ref=e256] [cursor=pointer]
            - button "Send" [disabled] [ref=e259]
        - generic [ref=e262]:
          - button "Calculate FAPI for Northstar" [ref=e263] [cursor=pointer]
          - button "Open the dashboard" [ref=e264] [cursor=pointer]
          - button "Run the art. 85 rollover" [ref=e265] [cursor=pointer]
          - button "Review FAPI exceptions" [ref=e266] [cursor=pointer]
        - generic [ref=e267]:
          - button "Build a workflow Design an automation on the canvas" [ref=e268] [cursor=pointer]:
            - generic [ref=e276]:
              - generic [ref=e277]: Build a workflow
              - generic [ref=e278]: Design an automation on the canvas
          - button "Statutory holiday payroll accrual Live holiday API → classify → day counts → accrual" [ref=e279] [cursor=pointer]:
            - generic [ref=e284]:
              - generic [ref=e285]: Statutory holiday payroll accrual
              - generic [ref=e286]: Live holiday API → classify → day counts → accrual
          - button "Calculate FAPI Foreign accrual property income" [ref=e287] [cursor=pointer]:
            - generic [ref=e292]:
              - generic [ref=e293]: Calculate FAPI
              - generic [ref=e294]: Foreign accrual property income
          - button "Roulement fiscal (art. 85) Rollover election → T2057" [ref=e295] [cursor=pointer]:
            - generic [ref=e300]:
              - generic [ref=e301]: Roulement fiscal (art. 85)
              - generic [ref=e302]: Rollover election → T2057
          - button "Expense reimbursement Receipts → policy caps → net payable" [ref=e303] [cursor=pointer]:
            - generic [ref=e308]:
              - generic [ref=e309]: Expense reimbursement
              - generic [ref=e310]: Receipts → policy caps → net payable
          - button "Campaign budget allocation Requests → elect budget → projection" [ref=e311] [cursor=pointer]:
            - generic [ref=e316]:
              - generic [ref=e317]: Campaign budget allocation
              - generic [ref=e318]: Requests → elect budget → projection
  - region "Notifications alt+T"
```

# Test source

```ts
  1  | import { test, expect, type Page } from '@playwright/test';
  2  | 
  3  | async function seed(page: Page, uploaded = true) {
  4  |   await page.goto('/');
> 5  |   const info = await page.evaluate(async uploaded => {
     |                           ^ Error: page.evaluate: TypeError: Failed to fetch dynamically imported module: http://127.0.0.1:5173/src/shared/workflow-engine/workflow/canvas.ts
  6  |     const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
  7  |     const { saveVersion } = await import('/src/features/workflows-hub/workflow-library.ts');
  8  |     const { workflowDefinitionToCanvas } = await import('/src/shared/workflow-engine/local-fiscal-workflow.ts');
  9  |     const { runLocalWorkflowTools } = await import('/src/shared/workflow-engine/local-tool-runner.ts');
  10 |     const { calculationValueKey } = await import('/src/shared/workflow-engine/calculation-values.ts');
  11 |     const definition = templateDefinition('pf-fapi')!;
  12 |     const source = definition.blocks.find(block => block.config.toolId === 'source.manual_table')!;
  13 |     const compute = definition.blocks.find(block => block.config.toolId === 'logic.calculation_engine')!;
  14 |     source.label = 'Uploaded document';
  15 |     source.position = { x: 0, y: 0 };
  16 |     source.config = { toolId: 'source.manual_table', sourceKind: 'manual_table', rows: [{ rowId: 'a', label: 'Units', amount: 10 }], ...(uploaded ? { fileName: 'inventory.csv', uploadTimestamp: new Date().toISOString() } : {}), readinessConditions: [{ id: 'document', kind: 'document', sourceId: source.id }] };
  17 |     compute.label = 'Calculate units';
  18 |     compute.position = { x: 400, y: 0 };
  19 |     const ref = calculationValueKey(source.id, ['rows', '0', 'amount']);
  20 |     compute.config = { toolId: 'logic.calculation_engine', mode: 'inline', formulas: [{ calculationId: 'TOTAL', resultKey: 'TOTAL', label: 'Total', operation: 'pass_through', operands: [], formulaExpression: `${ref} * 2` }] };
  21 |     definition.id = 'custom:workspace-audit';
  22 |     definition.name = 'Inventory calculation';
  23 |     definition.structure.entryBlockId = source.id;
  24 |     definition.blocks = [source, compute];
  25 |     definition.edges = [{ ...definition.edges[0], id: 'audit-transfer', sourceBlockId: source.id, targetBlockId: compute.id, sourceOutputRole: 'rows', targetInputRole: 'named_values', status: 'active' }];
  26 |     let entry = saveVersion({ id: definition.id, templateId: 'pf-fapi', draft: definition, versions: [], runs: [] });
  27 |     const result = runLocalWorkflowTools({ ...workflowDefinitionToCanvas(entry.versions[0].definition), workflowName: definition.name, workflowId: definition.id });
  28 |     entry.runs = [{ version: 1, at: new Date().toISOString(), result }];
  29 |     compute.config.formulas[0].formulaExpression = `${ref} * 3`;
  30 |     localStorage.setItem('taxflow:workflow-library:v1', JSON.stringify({ [entry.id]: entry }));
  31 |     return { id: entry.id, source: source.id, target: compute.id };
  32 |   }, uploaded);
  33 |   await page.goto(`/w/${info.id}`);
  34 |   return info;
  35 | }
  36 | 
  37 | test('block I/O replaces the strip and selected connections show recorded transfers', async ({ page }) => {
  38 |   const info = await seed(page);
  39 |   await page.getByRole('button', { name: 'Build', exact: true }).click();
  40 |   await page.getByRole('button', { name: 'Calculate units', exact: true }).click();
  41 |   await expect(page.getByText('Connected I/O', { exact: true })).toHaveCount(0);
  42 |   await page.getByRole('button', { name: 'Input & Output', exact: true }).click();
  43 |   await expect(page.getByTestId('block-io-panel')).toContainText('From Uploaded document');
  44 |   await expect(page.getByTestId('block-io-panel')).toContainText('This block has changed');
  45 |   await expect(page.getByRole('region', { name: 'Produced outputs' })).toContainText('20');
  46 |   await expect(page.getByLabel('Inspect run')).toBeVisible();
  47 |   await page.goto('/w/custom:workspace-audit');
  48 |   await page.getByRole('button', { name: 'Build', exact: true }).click();
  49 |   await page.getByRole('group', { name: `Edge from ${info.source} to ${info.target}`, exact: true }).click();
  50 |   await expect(page.getByTestId('connection-transfer-panel')).toContainText('Uploaded document');
  51 |   await expect(page.getByTestId('connection-transfer-panel')).toContainText('Units');
  52 |   await expect(page.getByTestId('connection-transfer-panel')).toContainText('as a whole');
  53 | });
  54 | 
  55 | test('Run keeps saved versions separate from changed drafts and readiness stays advisory', async ({ page }) => {
  56 |   const { id } = await seed(page, false);
  57 |   await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  58 |   await expect(page.getByRole('region', { name: 'Trigger readiness' })).toContainText('Waiting');
  59 |   await expect(page.getByRole('button', { name: 'Run saved version 1', exact: true })).toBeEnabled();
  60 |   await page.getByRole('button', { name: 'Run saved version 1', exact: true }).click();
  61 |   let stored = await page.evaluate(async id => { const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts'); return readWorkflowLibrary()[id]; }, id);
  62 |   expect(stored.versions).toHaveLength(1);
  63 |   expect(stored.runs.at(-1).result.result.results.at(-1).output.calculatedResults.TOTAL).toBe(20);
  64 |   await page.getByRole('button', { name: 'Save changes and run', exact: true }).click();
  65 |   stored = await page.evaluate(async id => { const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts'); return readWorkflowLibrary()[id]; }, id);
  66 |   expect(stored.versions).toHaveLength(2);
  67 |   expect(stored.runs.at(-1).result.result.results.at(-1).output.calculatedResults.TOTAL).toBe(30);
  68 |   await page.getByLabel('Saved workflow version').selectOption('1');
  69 |   await page.getByRole('button', { name: 'Run saved version 1', exact: true }).click();
  70 |   stored = await page.evaluate(async id => { const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts'); return readWorkflowLibrary()[id]; }, id);
  71 |   expect(stored.runs.at(-1).version).toBe(1);
  72 |   expect(stored.runs.at(-1).result.result.results.at(-1).output.calculatedResults.TOTAL).toBe(20);
  73 | });
  74 | 
  75 | test('Trigger displays uploaded documents and saves editable conditions', async ({ page }) => {
  76 |   const info = await seed(page);
  77 |   await page.getByRole('button', { name: 'Build', exact: true }).click();
  78 |   await page.getByRole('button', { name: 'Fit view', exact: true }).click();
  79 |   await page.getByRole('button', { name: 'Uploaded document', exact: true }).click();
  80 |   const panel = page.getByRole('region', { name: 'Trigger readiness' });
  81 |   await expect(panel).toContainText('Uploaded: inventory.csv');
  82 |   await expect(panel).toContainText('Met');
  83 |   await expect(panel.getByLabel('Condition source').first()).toHaveValue(info.source);
  84 |   await panel.getByRole('button', { name: 'Add condition', exact: true }).click();
  85 |   await panel.getByLabel('Condition type').last().selectOption('api');
  86 |   await expect(panel).toContainText('Waiting for a fetched API response');
  87 |   await page.goto('/w/custom:workspace-audit');
  88 |   await page.getByRole('button', { name: 'Build', exact: true }).click();
  89 |   await page.getByRole('button', { name: 'Uploaded document', exact: true }).click();
  90 |   await expect(page.getByRole('region', { name: 'Trigger readiness' }).getByLabel('Condition type').last()).toHaveValue('api');
  91 | });
  92 | 
```