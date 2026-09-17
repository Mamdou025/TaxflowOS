# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workflow-catalog-audit.spec.ts >> inventory and execute every catalog, additional runtime, and builder example definition
- Location: e2e/workflow-catalog-audit.spec.ts:10:5

# Error details

```
Error: expect(received).toHaveLength(expected)

Expected length: 24
Received length: 21
Received array:  [{"alternateRuntime": [Object], "baseline": [Object], "blockCount": 6, "calculators": [Array], "configured": [Object], "configuredRows": 2, "danglingEdges": [Array], "edgeCount": 5, "id": "pf-document-calculator", "missingExecutors": [Array], "name": "Document Calculator", "perturbation": [Object], "representative": false, "sources": [Array], "surface": "catalog"}, {"alternateRuntime": [Object], "baseline": [Object], "blockCount": 13, "calculators": [Array], "configured": [Object], "configuredRows": 10, "danglingEdges": [Array], "edgeCount": 14, "id": "pf-expense", "missingExecutors": [Array], "name": "Employee Expense Reimbursement", "perturbation": [Object], "representative": false, "sources": [Array], "surface": "catalog"}, {"alternateRuntime": [Object], "baseline": [Object], "blockCount": 13, "calculators": [Array], "configured": [Object], "configuredRows": 8, "danglingEdges": [Array], "edgeCount": 15, "id": "pf-fapi", "missingExecutors": [Array], "name": "FAPI Calculation (portfolio)", "perturbation": [Object], "representative": false, "sources": [Array], "surface": "catalog"}, {"alternateRuntime": [Object], "baseline": [Object], "blockCount": 3, "calculators": [Array], "configured": [Object], "configuredRows": 1, "danglingEdges": [Array], "edgeCount": 2, "id": "pf-scope-service", "missingExecutors": [Array], "name": "Scope Service", "perturbation": [Object], "representative": false, "sources": [Array], "surface": "catalog"}, {"alternateRuntime": [Object], "baseline": [Object], "blockCount": 3, "calculators": [Array], "configured": [Object], "configuredRows": 1, "danglingEdges": [Array], "edgeCount": 2, "id": "pf-tax-position-summary", "missingExecutors": [Array], "name": "Tax Position Summary Workpaper", "perturbation": [Object], "representative": false, "sources": [Array], "surface": "catalog"}, {"alternateRuntime": [Object], "baseline": [Object], "blockCount": 3, "calculators": [Array], "configured": [Object], "configuredRows": 1, "danglingEdges": [Array], "edgeCount": 2, "id": "pf-data-readiness", "missingExecutors": [Array], "name": "Data Readiness Service", "perturbation": [Object], "representative": false, "sources": [Array], "surface": "catalog"}, {"alternateRuntime": [Object], "baseline": [Object], "blockCount": 3, "calculators": [Array], "configured": [Object], "configuredRows": 1, "danglingEdges": [Array], "edgeCount": 2, "id": "pf-platform-sequence", "missingExecutors": [Array], "name": "Execution Readiness & Review Checklist", "perturbation": [Object], "representative": false, "sources": [Array], "surface": "catalog"}, {"alternateRuntime": [Object], "baseline": [Object], "blockCount": 3, "calculators": [Array], "configured": [Object], "configuredRows": 2, "danglingEdges": [Array], "edgeCount": 2, "id": "pf-ownership-graph", "missingExecutors": [Array], "name": "Ownership Graph Workpaper", "perturbation": [Object], "representative": false, "sources": [Array], "surface": "catalog"}, {"alternateRuntime": [Object], "baseline": [Object], "blockCount": 3, "calculators": [Array], "configured": [Object], "configuredRows": 1, "danglingEdges": [Array], "edgeCount": 2, "id": "pf-attribute-ledgers", "missingExecutors": [Array], "name": "Tax Attribute Continuity Workpaper", "perturbation": [Object], "representative": false, "sources": [Array], "surface": "catalog"}, {"alternateRuntime": [Object], "baseline": [Object], "blockCount": 3, "calculators": [Array], "configured": [Object], "configuredRows": 1, "danglingEdges": [Array], "edgeCount": 2, "id": "pf-portfolio-ops", "missingExecutors": [Array], "name": "Portfolio Calendar & Requests Workpaper", "perturbation": [Object], "representative": false, "sources": [Array], "surface": "catalog"}, …]
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
  3   | 
  4   | const evidence = 'docs/workflow-catalog-evidence';
  5   | function save(name: string, value: unknown) {
  6   |   mkdirSync(evidence, { recursive: true });
  7   |   writeFileSync(`${evidence}/${name}.json`, JSON.stringify(value, null, 2));
  8   | }
  9   | 
  10  | test('inventory and execute every catalog, additional runtime, and builder example definition', async ({ page }) => {
  11  |   await page.goto('/');
  12  |   const audit = await page.evaluate(async () => {
  13  |     const { workflowDefinitionToCanvas } = await import('/src/shared/workflow-engine/workflow/canvas.ts');
  14  |     const { createSingleItemPipelineDemoWorkflow } = await import('/src/shared/workflow-engine/workflow/templates/single-item.ts');
  15  |     const { createExpandedMappingPipelineDemoWorkflow } = await import('/src/shared/workflow-engine/workflow/templates/expanded-mapping.ts');
  16  |     const { createWorkingSourceRulesDemoWorkflow } = await import('/src/shared/workflow-engine/workflow/templates/working-source.ts');
  17  |     const { createFapiSampleWorkflow } = await import('/src/shared/workflow-engine/workflow/templates/fapi.ts');
  18  |     const { PORTFOLIO_WORKFLOWS } = await import('/src/shared/workflow-engine/templates/portfolio/portfolio-workflows.ts');
  19  |     const { WORKFLOW_CONFIGS, runTemplateCore } = await import('/src/shared/workflow-engine/runtime/workflow-runs/index.ts');
  20  |     const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
  21  |     const { runLocalWorkflowTools } = await import('/src/shared/workflow-engine/local-tool-runner.ts');
  22  |     const { getToolForBlock } = await import('/src/shared/workflow-engine/tools/lookup.ts');
  23  |     const entries = PORTFOLIO_WORKFLOWS.map(spec => ({ id: spec.id, name: spec.name, surface: 'catalog', definition: templateDefinition(spec.id)!, config: WORKFLOW_CONFIGS[spec.id.replace(/^pf-/, '')] }));
  24  |     for (const [id, config] of Object.entries(WORKFLOW_CONFIGS)) {
  25  |       if (!entries.some(entry => entry.id === `pf-${id}`)) entries.push({ id, name: config.name, surface: 'additional-runtime', definition: config.buildSnapshot(), config });
  26  |     }
  27  |     const builderExamples = [
  28  |       { name: 'createSingleItemPipelineDemoWorkflow', create: createSingleItemPipelineDemoWorkflow },
  29  |       { name: 'createExpandedMappingPipelineDemoWorkflow', create: createExpandedMappingPipelineDemoWorkflow },
  30  |       { name: 'createWorkingSourceRulesDemoWorkflow', create: createWorkingSourceRulesDemoWorkflow },
  31  |       { name: 'createFapiSampleWorkflow', create: createFapiSampleWorkflow },
  32  |     ];
  33  |     for (const { name, create } of builderExamples) {
  34  |       const definition = create(); entries.push({ id: name, name: definition.name, surface: 'builder-example', definition, config: undefined });
  35  |     }
  36  |     const execute = (definition: any) => {
  37  |       const start = performance.now();
  38  |       try {
  39  |         const run = runLocalWorkflowTools({ ...workflowDefinitionToCanvas(definition), workflowName: definition.name, workflowId: definition.id }).result;
  40  |         return { status: run.status, elapsedMs: Math.round(performance.now() - start), errors: run.errors, warnings: run.warnings, results: run.results.map(result => ({ blockId: result.blockId, label: definition.blocks.find(b => b.id === result.blockId)?.label, toolId: result.toolId, status: result.status, errors: result.errors, warnings: result.warnings, outputKeys: Object.keys(result.output), calculated: result.output.calculatedResults, namedValues: result.output.namedValues, rowCount: Array.isArray(result.output.rows) ? result.output.rows.length : undefined, mappedCount: Array.isArray(result.output.mappedRows) ? result.output.mappedRows.length : undefined, unmatchedCount: Array.isArray(result.output.unmatchedRows) ? result.output.unmatchedRows.length : undefined, transfers: result.inputTransfers?.map(t => ({ sourceBlockId: t.sourceBlockId, delivered: t.delivered, sourceOutputRole: t.sourceOutputRole, targetInputRole: t.targetInputRole, keys: Object.keys(t.output) })) })) };
  41  |       } catch (error) { return { status: 'exception', message: String(error), elapsedMs: Math.round(performance.now() - start), results: [] }; }
  42  |     };
  43  |     return entries.map(entry => {
  44  |       const definition = entry.definition;
  45  |       const baseline = execute(definition);
  46  |       const config = entry.config;
  47  |       const rows = config?.sampleRows ?? (entry.id === 'pf-document-calculator' ? [{ rowId: 'item-1', label: 'Item one', amount: 120 }, { rowId: 'item-2', label: 'Item two', amount: 80 }] : null);
  48  |       const injected = structuredClone(definition);
  49  |       const source = injected.blocks.find(block => block.id === config?.sourceBlockId) ?? (entry.id === 'pf-document-calculator' ? injected.blocks.find(block => block.config.toolId === 'source.manual_table') : undefined);
  50  |       if (source && rows) source.config = { ...source.config, rows: config?.toRawRow ? rows.map(config.toRawRow) : rows, requireUpload: false, selectedRowsCount: rows.length, sourceStatus: 'ready' };
  51  |       const configured = source && rows ? execute(injected) : null;
  52  |       let alternateRuntime = null;
  53  |       if (config) {
  54  |         try { const core = runTemplateCore(config, { rows: config.sampleRows, overrides: [], elected: config.id === 'holiday-payroll' ? 8 : undefined }); alternateRuntime = { status: core.status, headlineKey: config.headlineKey, headline: core.summaryValues[config.headlineKey], summary: core.summaryValues, buckets: core.detail.buckets, unmatched: core.unmatched }; }
  55  |         catch (error) { alternateRuntime = { exception: String(error) }; }
  56  |       }
  57  |       const changed = structuredClone(injected);
  58  |       const changedSource = changed.blocks.find(block => block.id === source?.id);
  59  |       if (changedSource?.config.rows?.[0]) changedSource.config.rows[0].amount = Number(changedSource.config.rows[0].amount) + 17;
  60  |       const perturbation = changedSource ? execute(changed) : null;
  61  |       return { id: entry.id, name: entry.name, surface: entry.surface, representative: config?.representative === true, blockCount: definition.blocks.length, edgeCount: definition.edges.length, configuredRows: rows?.length, sources: definition.blocks.filter(b => b.family === 'Source').map(b => ({ id: b.id, label: b.label, catalogId: b.catalogId, toolId: getToolForBlock(b)?.toolId, requireUpload: b.config.requireUpload, rowCount: Array.isArray(b.config.rows) ? b.config.rows.length : null })), calculators: definition.blocks.filter(b => b.config.toolId === 'logic.calculation_engine').map(b => ({ id: b.id, label: b.label, mode: b.config.mode, formulas: b.config.formulas, calculationRules: b.config.calculationRules })), missingExecutors: definition.blocks.filter(b => !getToolForBlock(b)).map(b => ({ id: b.id, label: b.label, catalogId: b.catalogId })), danglingEdges: definition.edges.filter(e => !definition.blocks.some(b => b.id === e.sourceBlockId) || !definition.blocks.some(b => b.id === e.targetBlockId)).map(e => e.id), baseline, configured, perturbation, alternateRuntime };
  62  |     });
  63  |   });
  64  |   save('engine-inventory', audit);
  65  |   for (const entry of audit) console.log(JSON.stringify({ id: entry.id, baseline: entry.baseline.status, configured: entry.configured?.status, alternate: entry.alternateRuntime?.status, headline: entry.alternateRuntime?.headline, errors: entry.configured?.errors ?? entry.baseline.errors, missingExecutors: entry.missingExecutors }));
  66  |   expect(audit.filter(entry => entry.surface === 'catalog')).toHaveLength(17);
> 67  |   expect(audit).toHaveLength(24);
      |                 ^ Error: expect(received).toHaveLength(expected)
  68  | });
  69  | 
  70  | const catalogIds = ['pf-document-calculator', 'pf-holiday-payroll', 'pf-platform-sequence', 'pf-scope-service', 'pf-tax-position-summary', 'pf-data-readiness', 'pf-ownership-graph', 'pf-attribute-ledgers', 'pf-portfolio-ops', 'pf-t1134', 'pf-fapi', 'pf-surplus', 'pf-t106', 'pf-eifel', 'pf-t2-suite', 'pf-tax-provision', 'pf-part-xiii'];
  71  | for (const id of catalogIds) {
  72  |   test(`UI audit: ${id} opens Build, accepts a document, executes and retains its actual result`, async ({ page }, info) => {
  73  |     const browserErrors: string[] = [];
  74  |     page.on('pageerror', error => browserErrors.push(error.message));
  75  |     const start = Date.now();
  76  |     await page.goto(`/w/${id}`);
  77  |     await page.getByRole('button', { name: 'Build', exact: true }).click();
  78  |     await expect(page.getByText('Test data — upload document or enter examples', { exact: true })).toBeVisible();
  79  |     const openMs = Date.now() - start;
  80  |     const input = await page.evaluate(async id => {
  81  |       const { WORKFLOW_CONFIGS } = await import('/src/shared/workflow-engine/runtime/workflow-runs/index.ts');
  82  |       const config = WORKFLOW_CONFIGS[id.replace(/^pf-/, '')];
  83  |       return { kind: config ? 'bundled sample records' : id === 'pf-document-calculator' ? 'controlled neutral records' : 'generic upload probe; not domain-complete input', rows: config?.sampleRows ?? (id === 'pf-document-calculator' ? [{ label: 'Item one', amount: 120 }, { label: 'Item two', amount: 80 }] : [{ label: 'Operating revenue', amount: 100 }, { label: 'Salaries expense', amount: -20 }]) };
  84  |     }, id);
  85  |     await page.getByText('Test data — upload document or enter examples', { exact: true }).click();
  86  |     const upload = page.getByLabel('Upload test document');
  87  |     await expect(upload).toBeEnabled();
  88  |     await upload.setInputFiles({ name: 'workflow-audit.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(input.rows)) });
  89  |     await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
  90  |     await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  91  |     const runStart = Date.now();
  92  |     await page.getByRole('button', { name: 'Save changes and preview', exact: true }).click();
  93  |     await expect(page.getByRole('region', { name: 'Final workflow results' })).toBeVisible();
  94  |     const readSaved = () => page.evaluate(async () => {
  95  |       const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
  96  |       const entries = Object.values(readWorkflowLibrary());
  97  |       const entry = entries.find(entry => entry.runs.length > 0);
  98  |       if (!entry) return null;
  99  |       const run = entry.runs.at(-1)!.result.result;
  100 |       const sourceIds = entry.draft.blocks.filter(b => b.config.uploadTimestamp).map(b => b.id);
  101 |       return { id: entry.id, name: entry.draft.name, version: entry.versions.at(-1)?.number, runCount: entry.runs.length, runId: run.runId, status: run.status, errors: run.errors, warnings: run.warnings, sources: sourceIds.map(id => ({ id, connected: entry.draft.edges.some(e => e.sourceBlockId === id && e.status === 'active'), consumedBy: run.results.filter(r => r.inputTransfers?.some(t => t.sourceBlockId === id && t.delivered)).map(r => r.blockId) })), results: run.results.map(r => ({ blockId: r.blockId, label: entry.draft.blocks.find(b => b.id === r.blockId)?.label, status: r.status, errors: r.errors, warnings: r.warnings, calculated: r.output.calculatedResults, outputKeys: Object.keys(r.output) })) };
  102 |     });
  103 |     await expect.poll(async () => (await readSaved())?.runCount).toBe(1);
  104 |     const first = (await readSaved())!;
  105 |     const runMs = Date.now() - runStart;
  106 |     await page.reload();
  107 |     await page.getByRole('button', { name: 'Workflows', exact: true }).click();
  108 |     await page.getByRole('button', { name: first.name, exact: true }).click();
  109 |     await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  110 |     await page.getByRole('button', { name: 'Preview saved version 1 in this browser', exact: true }).click();
  111 |     await expect.poll(async () => (await readSaved())?.runCount).toBe(2);
  112 |     const second = (await readSaved())!;
  113 |     expect(second.runId).not.toBe(first.runId);
  114 |     expect(second.status).toBe(first.status);
  115 |     await page.getByRole('region', { name: 'Final workflow results' }).scrollIntoViewIfNeeded();
  116 |     if (['pf-document-calculator', 'pf-holiday-payroll', 'pf-t1134', 'pf-fapi', 'pf-platform-sequence'].includes(id)) await page.screenshot({ path: `${evidence}/${id}.png`, fullPage: true });
  117 |     save(`ui-${id}`, { id, inputKind: input.kind, inputRows: input.rows.length, openMs, runMs, totalMs: Date.now() - start, browserErrors, first, second });
  118 |     console.log(JSON.stringify({ id, status: first.status, errors: first.errors, uploadSources: first.sources, openMs, runMs, persistedRuns: second.runCount, browserErrors }));
  119 |     expect(browserErrors).toEqual([]);
  120 |   });
  121 | }
  122 | 
```