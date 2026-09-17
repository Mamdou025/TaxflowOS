# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workflow-catalog-deep-checks.spec.ts >> compare runtime completion claims with underlying execution errors
- Location: e2e/workflow-catalog-deep-checks.spec.ts:6:5

# Error details

```
Error: expect(received).toHaveLength(expected)

Expected length: 12
Received length: 17
Received array:  [{"blocker": {"figures": [{"formula": "item_total × 2", "key": "RESULT", "label": "Adjusted total", "value": 400}], "kind": "approval", "message": "All inputs are resolved and computed. Each figure below shows how it was derived. Approve to finalize."}, "coreStatus": "success", "done": false, "headline": {"currency": "units", "label": "Adjusted total", "value": 400}, "id": "document-calculator", "representative": false, "summaryText": undefined}, {"blocker": {"figures": [{"formula": "Gross = A + A1 + A2 + B + C", "key": "GROSS", "label": "Gross", "value": 25000}, {"formula": "Deductions = D + E + F + F1 + G + H", "key": "DEDUCTIONS", "label": "Deductions", "value": 0}, {"formula": "FAPI Brut = max(Gross - Deductions, 0)", "key": "FAPI_BRUT", "label": "FAPI Brut", "value": 25000}, {"formula": "FAT Deduction = min(FAT_PAID × RTF, FAPI_BRUT)", "key": "FAT_DEDUCTION", "label": "FAT Deduction", "value": 400}, {"formula": "Net FAPI = max(FAPI_BRUT - FAT_DEDUCTION, 0)", "key": "NET_FAPI", "label": "Net FAPI", "value": 24600}, {"formula": "FX_RATE = fxRate (from Bank of Canada source)", "key": "FX_RATE", "label": "FX Rate", "value": 1.35}, {"formula": "Gross CAD = GROSS × FX_RATE", "key": "GROSS_CAD", "label": "Gross CAD", "value": 33750}, {"formula": "Deductions CAD = DEDUCTIONS × FX_RATE", "key": "DEDUCTIONS_CAD", "label": "Deductions CAD", "value": 0}, {"formula": "FAPI Brut CAD = FAPI_BRUT × FX_RATE", "key": "FAPI_BRUT_CAD", "label": "FAPI Brut CAD", "value": 33750}, {"formula": "FAT Deduction CAD = FAT_DEDUCTION × FX_RATE", "key": "FAT_DEDUCTION_CAD", "label": "FAT Deduction CAD", "value": 540}, …], "kind": "approval", "message": "All inputs are resolved and computed. Each figure below shows how it was derived. Approve to finalize."}, "coreStatus": "warning", "done": false, "headline": {"currency": "USD", "label": "Gross", "value": 25000}, "id": "fapi", "representative": false, "summaryText": undefined}, {"blocker": {"figures": [{"formula": "Submitted total = every receipt across all categories", "key": "SUBMITTED_TOTAL", "label": "Submitted total", "value": 2462}, {"formula": "Total reimbursable = sum of the five reimbursable category lines", "key": "TOTAL_REIMBURSABLE", "label": "Total reimbursable", "value": 2325}, {"formula": "Disallowed = non-reimbursable items + meals over cap", "key": "POLICY_DISALLOWED", "label": "Policy-disallowed", "value": 137}, {"formula": "Net payable to employee = total reimbursable", "key": "NET_PAYABLE", "label": "Net payable to employee", "value": 2325}, {"formula": "Annual-average USD→CAD rate (Bank of Canada)", "key": "FX_RATE", "label": "FX rate (USD → CAD)", "value": 1.35}, {"formula": "Net payable (CAD) = net payable × FX rate", "key": "NET_PAYABLE_CAD", "label": "Net payable (CAD)", "value": 3138.75}], "kind": "approval", "message": "All inputs are resolved and computed. Each figure below shows how it was derived. Approve to finalize."}, "coreStatus": "warning", "done": false, "headline": {"currency": "USD", "label": "Net payable to employee", "value": 2325}, "id": "expense", "representative": false, "summaryText": undefined}, {"blocker": {"figures": [{"formula": "Number of output records", "key": "RECORDS", "label": "Workpaper records", "value": 1}, {"formula": "Outstanding review findings", "key": "REVIEW_FINDINGS", "label": "Review findings", "value": 0}], "kind": "approval", "message": "All inputs are resolved and computed. Each figure below shows how it was derived. Approve to finalize."}, "coreStatus": "success", "done": false, "headline": {"currency": "records", "label": "Workpaper records", "value": 1}, "id": "scope-service", "representative": false, "summaryText": undefined}, {"blocker": {"figures": [{"formula": "Number of output records", "key": "RECORDS", "label": "Workpaper records", "value": 1}, {"formula": "Outstanding review findings", "key": "REVIEW_FINDINGS", "label": "Review findings", "value": 1}], "kind": "approval", "message": "All inputs are resolved and computed. Each figure below shows how it was derived. Approve to finalize."}, "coreStatus": "warning", "done": false, "headline": {"currency": "records", "label": "Workpaper records", "value": 1}, "id": "tax-position-summary", "representative": false, "summaryText": undefined}, {"blocker": {"figures": [{"formula": "Number of output records", "key": "RECORDS", "label": "Workpaper records", "value": 1}, {"formula": "Outstanding review findings", "key": "REVIEW_FINDINGS", "label": "Review findings", "value": 0}], "kind": "approval", "message": "All inputs are resolved and computed. Each figure below shows how it was derived. Approve to finalize."}, "coreStatus": "success", "done": false, "headline": {"currency": "records", "label": "Workpaper records", "value": 1}, "id": "data-readiness", "representative": false, "summaryText": undefined}, {"blocker": {"figures": [{"formula": "Number of output records", "key": "RECORDS", "label": "Workpaper records", "value": 1}, {"formula": "Outstanding review findings", "key": "REVIEW_FINDINGS", "label": "Review findings", "value": 1}], "kind": "approval", "message": "All inputs are resolved and computed. Each figure below shows how it was derived. Approve to finalize."}, "coreStatus": "warning", "done": false, "headline": {"currency": "records", "label": "Workpaper records", "value": 1}, "id": "platform-sequence", "representative": false, "summaryText": undefined}, {"blocker": {"figures": [{"formula": "Number of output records", "key": "RECORDS", "label": "Workpaper records", "value": 3}, {"formula": "Outstanding review findings", "key": "REVIEW_FINDINGS", "label": "Review findings", "value": 0}], "kind": "approval", "message": "All inputs are resolved and computed. Each figure below shows how it was derived. Approve to finalize."}, "coreStatus": "success", "done": false, "headline": {"currency": "records", "label": "Workpaper records", "value": 3}, "id": "ownership-graph", "representative": false, "summaryText": undefined}, {"blocker": {"figures": [{"formula": "Number of output records", "key": "RECORDS", "label": "Workpaper records", "value": 1}, {"formula": "Outstanding review findings", "key": "REVIEW_FINDINGS", "label": "Review findings", "value": 0}], "kind": "approval", "message": "All inputs are resolved and computed. Each figure below shows how it was derived. Approve to finalize."}, "coreStatus": "success", "done": false, "headline": {"currency": "records", "label": "Workpaper records", "value": 1}, "id": "attribute-ledgers", "representative": false, "summaryText": undefined}, {"blocker": {"figures": [{"formula": "Number of output records", "key": "RECORDS", "label": "Workpaper records", "value": 1}, {"formula": "Outstanding review findings", "key": "REVIEW_FINDINGS", "label": "Review findings", "value": 1}], "kind": "approval", "message": "All inputs are resolved and computed. Each figure below shows how it was derived. Approve to finalize."}, "coreStatus": "warning", "done": false, "headline": {"currency": "records", "label": "Workpaper records", "value": 1}, "id": "portfolio-ops", "representative": false, "summaryText": undefined}, …]
```

# Page snapshot

```yaml
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
      - generic [ref=e59]:
        - button "Settings" [ref=e61] [cursor=pointer]
        - button "Help" [ref=e68] [cursor=pointer]
        - group "Theme" [ref=e76]:
          - button "Light" [pressed] [ref=e77] [cursor=pointer]
          - button "Dark" [ref=e84] [cursor=pointer]
    - generic [ref=e92]:
      - generic [ref=e93]:
        - generic [ref=e94]: InScope
        - button "Choose client — Scope reads their worksheets & documents" [ref=e95] [cursor=pointer]
      - generic [ref=e152]:
        - generic [ref=e153]:
          - generic [ref=e154]: Good morning, Sophia
          - generic [ref=e155]: What would you like to work on?
        - generic [ref=e158]:
          - textbox "Ask Scope, or describe a task…" [ref=e159]
          - generic [ref=e160]:
            - button "Add — search, workflows, worksheets" [ref=e161] [cursor=pointer]
            - button "Attach files" [ref=e163] [cursor=pointer]
            - 'button "Chat agent: Sina" [ref=e166] [cursor=pointer]': Sina
            - button "Send" [disabled] [ref=e177]
        - generic [ref=e181]:
          - button "Ask about sources" [ref=e182] [cursor=pointer]:
            - generic [ref=e188]:
              - generic [ref=e189]: Ask about sources
              - generic [ref=e190]: Find facts with visible evidence
          - button "Build a workflow" [ref=e191] [cursor=pointer]:
            - generic [ref=e199]:
              - generic [ref=e200]: Build a workflow
              - generic [ref=e201]: Design and save a reusable process
          - button "Run a workflow" [ref=e202] [cursor=pointer]:
            - generic [ref=e206]:
              - generic [ref=e207]: Run a workflow
              - generic [ref=e208]: Choose exact inputs and review the result
  - region "Notifications alt+T"
```

# Test source

```ts
  1   | import { test, expect } from './workflow-audit-isolation';
  2   | import { mkdirSync, writeFileSync } from 'node:fs';
  3   | const evidence = 'docs/workflow-catalog-evidence';
  4   | const save = (name: string, data: unknown) => { mkdirSync(evidence, { recursive: true }); writeFileSync(`${evidence}/${name}.json`, JSON.stringify(data, null, 2)); };
  5   | 
  6   | test('compare runtime completion claims with underlying execution errors', async ({ page }) => {
  7   |   await page.goto('/');
  8   |   const findings = await page.evaluate(async () => {
  9   |     const { WORKFLOW_CONFIGS, runTemplateCore, runToCompletion } = await import('/src/shared/workflow-engine/runtime/workflow-runs/index.ts');
  10  |     return Object.entries(WORKFLOW_CONFIGS).map(([id, config]) => {
  11  |       const core = runTemplateCore(config, { rows: config.sampleRows, overrides: [] });
  12  |       const completion = runToCompletion(config);
  13  |       return { id, representative: config.representative === true, coreStatus: core.status, done: completion.done, headline: completion.headline, summaryText: completion.summaryText, blocker: completion.blocker };
  14  |     });
  15  |   });
  16  |   save('completion-claims', findings);
  17  |   console.log(JSON.stringify(findings));
> 18  |   expect(findings).toHaveLength(12);
      |                    ^ Error: expect(received).toHaveLength(expected)
  19  | });
  20  | 
  21  | test('builder examples execute with an explicitly supplied matching document', async ({ page }) => {
  22  |   await page.goto('/');
  23  |   const findings = await page.evaluate(async () => {
  24  |     const { workflowDefinitionToCanvas } = await import('/src/shared/workflow-engine/workflow/canvas.ts');
  25  |     const { createWorkingSourceRulesDemoWorkflow } = await import('/src/shared/workflow-engine/workflow/templates/working-source.ts');
  26  |     const { createFapiSampleWorkflow } = await import('/src/shared/workflow-engine/workflow/templates/fapi.ts');
  27  |     const { FAPI_CONFIG } = await import('/src/shared/workflow-engine/runtime/workflow-runs/fapi.ts');
  28  |     const { runLocalWorkflowTools } = await import('/src/shared/workflow-engine/local-tool-runner.ts');
  29  |     return [
  30  |       { name: 'createWorkingSourceRulesDemoWorkflow', create: createWorkingSourceRulesDemoWorkflow },
  31  |       { name: 'createFapiSampleWorkflow', create: createFapiSampleWorkflow },
  32  |     ].map(({ name, create }) => {
  33  |       const definition = create();
  34  |       const source = definition.blocks.find(block => block.catalogId === 'source:excel-workbook');
  35  |       if (source) source.config = { ...source.config, rows: FAPI_CONFIG.sampleRows, requireUpload: false, selectedRowsCount: FAPI_CONFIG.sampleRows.length, sourceStatus: 'ready' };
  36  |       const run = runLocalWorkflowTools({ ...workflowDefinitionToCanvas(definition), workflowName: definition.name }).result;
  37  |       return { name, sourceId: source?.id, rows: FAPI_CONFIG.sampleRows.length, status: run.status, errors: run.errors, warnings: run.warnings, results: run.results.map(r => ({ label: definition.blocks.find(b => b.id === r.blockId)?.label, toolId: r.toolId, status: r.status, errors: r.errors, warnings: r.warnings, output: { keys: Object.keys(r.output), calculatedResults: r.output.calculatedResults, protectedResult: r.output.protectedResult, finalityStatus: r.output.finalityStatus } })) };
  38  |     });
  39  |   });
  40  |   save('configured-builder-examples', findings);
  41  |   console.log(JSON.stringify(findings.map(f => ({ name: f.name, status: f.status, errors: f.errors }))));
  42  |   expect(findings).toHaveLength(2);
  43  | });
  44  | 
  45  | test('controlled arithmetic checks and exported expense payload inspection', async ({ page }) => {
  46  |   await page.goto('/');
  47  |   const findings = await page.evaluate(async () => {
  48  |     const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
  49  |     const { WORKFLOW_CONFIGS, runTemplateCore } = await import('/src/shared/workflow-engine/runtime/workflow-runs/index.ts');
  50  |     const { workflowDefinitionToCanvas } = await import('/src/shared/workflow-engine/workflow/canvas.ts');
  51  |     const { runLocalWorkflowTools } = await import('/src/shared/workflow-engine/local-tool-runner.ts');
  52  |     const run = (id: string, rows: any[]) => {
  53  |       const definition = templateDefinition(id)!;
  54  |       const config = WORKFLOW_CONFIGS[id.replace(/^pf-/, '')];
  55  |       const source = definition.blocks.find(b => b.id === config?.sourceBlockId) ?? definition.blocks.find(b => b.config.toolId === 'source.manual_table')!;
  56  |       source.config = { ...source.config, rows, requireUpload: false };
  57  |       return runLocalWorkflowTools({ ...workflowDefinitionToCanvas(definition), workflowName: definition.name }).result;
  58  |     };
  59  |     const neutral = run('pf-document-calculator', [{ label: 'Item one', amount: 120 }, { label: 'Item two', amount: 80 }]);
  60  |     const fapi = run('pf-fapi', WORKFLOW_CONFIGS.fapi.sampleRows);
  61  |     const expense = run('expense', WORKFLOW_CONFIGS.expense.sampleRows);
  62  |     const alteredExpense = runTemplateCore(WORKFLOW_CONFIGS.expense, { rows: WORKFLOW_CONFIGS.expense.sampleRows, overrides: [], inputs: { mealCap: 100 } });
  63  |     return { neutral: neutral.results.find(r => r.toolId === 'logic.calculation_engine')!.output.calculatedResults, fapi: fapi.results.find(r => r.blockId === WORKFLOW_CONFIGS.fapi.summaryBlockId)!.output.calculatedResults, expense: expense.results.find(r => r.blockId === WORKFLOW_CONFIGS.expense.summaryBlockId)!.output.calculatedResults, expenseOutputs: expense.results.filter(r => r.toolId.startsWith('output.')).map(r => ({ toolId: r.toolId, status: r.status, warnings: r.warnings, output: r.output })), alteredMealCap: { status: alteredExpense.status, net: alteredExpense.summaryValues.NET_PAYABLE } };
  64  |   });
  65  |   save('arithmetic-and-expense-export', findings);
  66  |   expect(findings.neutral.RESULT).toBe((120 + 80) * 2);
  67  |   expect(findings.fapi.NET_FAPI).toBe((12000 + 8000 + 5000 - 1500 - 900 - 600 + 6000 * 0.5) - 100 * 4);
  68  |   expect(findings.fapi.NET_FAPI_CAD).toBe(33210);
  69  |   expect(findings.expense.NET_PAYABLE).toBe(820 + 65 + 540 + 250 + 180 + 350 + 120);
  70  |   expect(findings.alteredMealCap.net).toBe(2175);
  71  | });
  72  | 
  73  | test('holiday workflow with a real API response still reports its calculation outcome', async ({ page }) => {
  74  |   const browserErrors: string[] = []; page.on('pageerror', error => browserErrors.push(error.message));
  75  |   await page.goto('/w/pf-holiday-payroll');
  76  |   await page.getByRole('button', { name: 'Build', exact: true }).click();
  77  |   const label = await page.evaluate(async () => {
  78  |     const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
  79  |     return templateDefinition('pf-holiday-payroll')!.blocks.find(b => b.id === 'hol-source-holidays')!.label;
  80  |   });
  81  |   await page.getByRole('button', { name: label, exact: true }).click();
  82  |   const responsePromise = page.waitForResponse(response => response.url().endsWith('/api/http-source') && response.request().method() === 'POST');
  83  |   const fetchStart = Date.now();
  84  |   await page.getByRole('button', { name: 'Send', exact: true }).filter({ hasText: 'Send' }).first().click();
  85  |   const response = await responsePromise; const payload = await response.json();
  86  |   save('holiday-live-response', { fetchMs: Date.now() - fetchStart, httpStatus: response.status(), ...payload });
  87  |   await expect(page.getByRole('button', { name: 'Send', exact: true }).filter({ hasText: 'Send' }).first()).toBeEnabled();
  88  |   await page.getByRole('button', { name: 'Close', exact: true }).click();
  89  |   await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  90  |   await page.getByRole('button', { name: 'Save changes and preview', exact: true }).click();
  91  |   await expect(page.getByRole('region', { name: 'Final workflow results' })).toBeVisible();
  92  |   const findings = await page.evaluate(async () => {
  93  |     const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
  94  |     const entry = Object.values(readWorkflowLibrary()).find(e => e.runs.length)!;
  95  |     const run = entry.runs.at(-1)!.result.result;
  96  |     return { status: run.status, errors: run.errors, warnings: run.warnings, results: run.results.map(r => ({ label: entry.draft.blocks.find(b => b.id === r.blockId)?.label, status: r.status, errors: r.errors, warnings: r.warnings, output: r.toolId === 'source.http_json' ? { rows: r.output.rows, responseMetadata: r.output.responseMetadata } : r.toolId === 'logic.calculation_engine' ? r.output : { namedValues: r.output.namedValues } })) };
  97  |   });
  98  |   save('holiday-live-execution', { ...findings, browserErrors });
  99  |   await page.getByRole('region', { name: 'Final workflow results' }).scrollIntoViewIfNeeded();
  100 |   await page.screenshot({ path: `${evidence}/holiday-live-failure.png`, fullPage: true });
  101 |   console.log(JSON.stringify({ apiOk: payload.ok, rows: payload.rowCount, status: findings.status, errors: findings.errors, browserErrors }));
  102 |   expect(payload.ok).toBe(true);
  103 |   expect(browserErrors).toEqual([]);
  104 | });
  105 | 
```