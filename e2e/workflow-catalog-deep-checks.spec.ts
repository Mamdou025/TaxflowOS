import { test, expect } from './workflow-audit-isolation';
import { mkdirSync, writeFileSync } from 'node:fs';
const evidence = 'docs/workflow-catalog-evidence';
const save = (name: string, data: unknown) => { mkdirSync(evidence, { recursive: true }); writeFileSync(`${evidence}/${name}.json`, JSON.stringify(data, null, 2)); };

test('compare runtime completion claims with underlying execution errors', async ({ page }) => {
  await page.goto('/');
  const findings = await page.evaluate(async () => {
    const { WORKFLOW_CONFIGS, runTemplateCore, runToCompletion } = await import('/src/shared/workflow-engine/runtime/workflow-runs/index.ts');
    return Object.entries(WORKFLOW_CONFIGS).map(([id, config]) => {
      const core = runTemplateCore(config, { rows: config.sampleRows, overrides: [] });
      const completion = runToCompletion(config);
      return { id, representative: config.representative === true, coreStatus: core.status, done: completion.done, headline: completion.headline, summaryText: completion.summaryText, blocker: completion.blocker };
    });
  });
  save('completion-claims', findings);
  console.log(JSON.stringify(findings));
  expect(findings).toHaveLength(12);
});

test('builder examples execute with an explicitly supplied matching document', async ({ page }) => {
  await page.goto('/');
  const findings = await page.evaluate(async () => {
    const local = await import('/src/shared/workflow-engine/local-fiscal-workflow.ts');
    const { FAPI_CONFIG } = await import('/src/shared/workflow-engine/runtime/workflow-runs/fapi.ts');
    const { runLocalWorkflowTools } = await import('/src/shared/workflow-engine/local-tool-runner.ts');
    return ['createWorkingSourceRulesDemoWorkflow', 'createFapiSampleWorkflow'].map(name => {
      const definition = local[name]();
      const source = definition.blocks.find(block => block.catalogId === 'source:excel-workbook');
      if (source) source.config = { ...source.config, rows: FAPI_CONFIG.sampleRows, requireUpload: false, selectedRowsCount: FAPI_CONFIG.sampleRows.length, sourceStatus: 'ready' };
      const run = runLocalWorkflowTools({ ...local.workflowDefinitionToCanvas(definition), workflowName: definition.name }).result;
      return { name, sourceId: source?.id, rows: FAPI_CONFIG.sampleRows.length, status: run.status, errors: run.errors, warnings: run.warnings, results: run.results.map(r => ({ label: definition.blocks.find(b => b.id === r.blockId)?.label, toolId: r.toolId, status: r.status, errors: r.errors, warnings: r.warnings, output: { keys: Object.keys(r.output), calculatedResults: r.output.calculatedResults, protectedResult: r.output.protectedResult, finalityStatus: r.output.finalityStatus } })) };
    });
  });
  save('configured-builder-examples', findings);
  console.log(JSON.stringify(findings.map(f => ({ name: f.name, status: f.status, errors: f.errors }))));
  expect(findings).toHaveLength(2);
});

test('controlled arithmetic checks and exported expense payload inspection', async ({ page }) => {
  await page.goto('/');
  const findings = await page.evaluate(async () => {
    const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
    const { WORKFLOW_CONFIGS, runTemplateCore } = await import('/src/shared/workflow-engine/runtime/workflow-runs/index.ts');
    const { workflowDefinitionToCanvas } = await import('/src/shared/workflow-engine/local-fiscal-workflow.ts');
    const { runLocalWorkflowTools } = await import('/src/shared/workflow-engine/local-tool-runner.ts');
    const run = (id: string, rows: any[]) => {
      const definition = templateDefinition(id)!;
      const config = WORKFLOW_CONFIGS[id.replace(/^pf-/, '')];
      const source = definition.blocks.find(b => b.id === config?.sourceBlockId) ?? definition.blocks.find(b => b.config.toolId === 'source.manual_table')!;
      source.config = { ...source.config, rows, requireUpload: false };
      return runLocalWorkflowTools({ ...workflowDefinitionToCanvas(definition), workflowName: definition.name }).result;
    };
    const neutral = run('pf-document-calculator', [{ label: 'Item one', amount: 120 }, { label: 'Item two', amount: 80 }]);
    const fapi = run('pf-fapi', WORKFLOW_CONFIGS.fapi.sampleRows);
    const expense = run('expense', WORKFLOW_CONFIGS.expense.sampleRows);
    const alteredExpense = runTemplateCore(WORKFLOW_CONFIGS.expense, { rows: WORKFLOW_CONFIGS.expense.sampleRows, overrides: [], inputs: { mealCap: 100 } });
    return { neutral: neutral.results.find(r => r.toolId === 'logic.calculation_engine')!.output.calculatedResults, fapi: fapi.results.find(r => r.blockId === WORKFLOW_CONFIGS.fapi.summaryBlockId)!.output.calculatedResults, expense: expense.results.find(r => r.blockId === WORKFLOW_CONFIGS.expense.summaryBlockId)!.output.calculatedResults, expenseOutputs: expense.results.filter(r => r.toolId.startsWith('output.')).map(r => ({ toolId: r.toolId, status: r.status, warnings: r.warnings, output: r.output })), alteredMealCap: { status: alteredExpense.status, net: alteredExpense.summaryValues.NET_PAYABLE } };
  });
  save('arithmetic-and-expense-export', findings);
  expect(findings.neutral.RESULT).toBe((120 + 80) * 2);
  expect(findings.fapi.NET_FAPI).toBe((12000 + 8000 + 5000 - 1500 - 900 - 600 + 6000 * 0.5) - 100 * 4);
  expect(findings.fapi.NET_FAPI_CAD).toBe(33210);
  expect(findings.expense.NET_PAYABLE).toBe(820 + 65 + 540 + 250 + 180 + 350 + 120);
  expect(findings.alteredMealCap.net).toBe(2175);
});

test('holiday workflow with a real API response still reports its calculation outcome', async ({ page }) => {
  const browserErrors: string[] = []; page.on('pageerror', error => browserErrors.push(error.message));
  await page.goto('/w/pf-holiday-payroll');
  await page.getByRole('button', { name: 'Build', exact: true }).click();
  const label = await page.evaluate(async () => {
    const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
    return templateDefinition('pf-holiday-payroll')!.blocks.find(b => b.id === 'hol-source-holidays')!.label;
  });
  await page.getByRole('button', { name: label, exact: true }).click();
  const responsePromise = page.waitForResponse(response => response.url().endsWith('/api/http-source') && response.request().method() === 'POST');
  const fetchStart = Date.now();
  await page.getByRole('button', { name: 'Send', exact: true }).filter({ hasText: 'Send' }).first().click();
  const response = await responsePromise; const payload = await response.json();
  save('holiday-live-response', { fetchMs: Date.now() - fetchStart, httpStatus: response.status(), ...payload });
  await expect(page.getByRole('button', { name: 'Send', exact: true }).filter({ hasText: 'Send' }).first()).toBeEnabled();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  await page.getByRole('button', { name: 'Save changes and run', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Final workflow results' })).toBeVisible();
  const findings = await page.evaluate(async () => {
    const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
    const entry = Object.values(readWorkflowLibrary()).find(e => e.runs.length)!;
    const run = entry.runs.at(-1)!.result.result;
    return { status: run.status, errors: run.errors, warnings: run.warnings, results: run.results.map(r => ({ label: entry.draft.blocks.find(b => b.id === r.blockId)?.label, status: r.status, errors: r.errors, warnings: r.warnings, output: r.toolId === 'source.http_json' ? { rows: r.output.rows, responseMetadata: r.output.responseMetadata } : r.toolId === 'logic.calculation_engine' ? r.output : { namedValues: r.output.namedValues } })) };
  });
  save('holiday-live-execution', { ...findings, browserErrors });
  await page.getByRole('region', { name: 'Final workflow results' }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${evidence}/holiday-live-failure.png`, fullPage: true });
  console.log(JSON.stringify({ apiOk: payload.ok, rows: payload.rowCount, status: findings.status, errors: findings.errors, browserErrors }));
  expect(payload.ok).toBe(true);
  expect(browserErrors).toEqual([]);
});
