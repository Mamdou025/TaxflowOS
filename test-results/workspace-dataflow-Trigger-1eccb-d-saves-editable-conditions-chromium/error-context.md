# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workspace-dataflow.spec.ts >> Trigger displays uploaded documents and saves editable conditions
- Location: e2e/workspace-dataflow.spec.ts:75:5

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
- main [ref=f1e3]:
  - generic [ref=f1e4]:
    - heading "Sign in to TaxflowOS" [level=1] [ref=f1e5]
    - paragraph [ref=f1e6]: Try the app without credentials, or sign in to your workspace.
    - generic [ref=f1e7]:
      - button "Try demo" [ref=f1e8] [cursor=pointer]
      - paragraph [ref=f1e9]: No email or password needed. Explore in your own demo workspace. Export workflows before exiting; access depends on this browser session.
    - generic [ref=f1e10]:
      - text: Email
      - textbox "Email" [ref=f1e11]
    - generic [ref=f1e12]:
      - text: Password
      - textbox "Password" [ref=f1e13]
    - button "Sign in" [ref=f1e14] [cursor=pointer]
    - button "Create an account" [ref=f1e15] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect, type Page } from '@playwright/test';
  2  | 
  3  | async function seed(page: Page, uploaded = true) {
  4  |   await page.goto('/');
  5  |   const info = await page.evaluate(async uploaded => {
  6  |     const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
  7  |     const { saveVersion } = await import('/src/features/workflows-hub/workflow-library.ts');
  8  |     const { workflowDefinitionToCanvas } = await import('/src/shared/workflow-engine/workflow/canvas.ts');
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
  59 |   await expect(page.getByRole('button', { name: 'Preview saved version 1 in this browser', exact: true })).toBeEnabled();
  60 |   await page.getByRole('button', { name: 'Preview saved version 1 in this browser', exact: true }).click();
  61 |   let stored = await page.evaluate(async id => { const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts'); return readWorkflowLibrary()[id]; }, id);
  62 |   expect(stored.versions).toHaveLength(1);
  63 |   expect(stored.runs.at(-1).result.result.results.at(-1).output.calculatedResults.TOTAL).toBe(20);
  64 |   await page.getByRole('button', { name: 'Save changes and preview', exact: true }).click();
  65 |   stored = await page.evaluate(async id => { const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts'); return readWorkflowLibrary()[id]; }, id);
  66 |   expect(stored.versions).toHaveLength(2);
  67 |   expect(stored.runs.at(-1).result.result.results.at(-1).output.calculatedResults.TOTAL).toBe(30);
  68 |   await page.getByLabel('Saved workflow version').selectOption('1');
  69 |   await page.getByRole('button', { name: 'Preview saved version 1 in this browser', exact: true }).click();
  70 |   stored = await page.evaluate(async id => { const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts'); return readWorkflowLibrary()[id]; }, id);
  71 |   expect(stored.runs.at(-1).version).toBe(1);
  72 |   expect(stored.runs.at(-1).result.result.results.at(-1).output.calculatedResults.TOTAL).toBe(20);
  73 | });
  74 | 
  75 | test('Trigger displays uploaded documents and saves editable conditions', async ({ page }) => {
  76 |   const info = await seed(page);
> 77 |   await page.getByRole('button', { name: 'Build', exact: true }).click();
     |                                                                  ^ Error: locator.click: Test timeout of 60000ms exceeded.
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