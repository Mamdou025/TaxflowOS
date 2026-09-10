import { test, expect } from './workflow-audit-isolation';
import { mkdirSync, writeFileSync } from 'node:fs';

const evidence = 'docs/workflow-catalog-evidence';
function save(name: string, value: unknown) {
  mkdirSync(evidence, { recursive: true });
  writeFileSync(`${evidence}/${name}.json`, JSON.stringify(value, null, 2));
}

test('inventory and execute every catalog, additional runtime, and builder example definition', async ({ page }) => {
  await page.goto('/');
  const audit = await page.evaluate(async () => {
    const local = await import('/src/shared/workflow-engine/local-fiscal-workflow.ts');
    const { PORTFOLIO_WORKFLOWS } = await import('/src/shared/workflow-engine/templates/portfolio/portfolio-workflows.ts');
    const { WORKFLOW_CONFIGS, runTemplateCore } = await import('/src/shared/workflow-engine/runtime/workflow-runs/index.ts');
    const { templateDefinition } = await import('/src/features/workflows-hub/saved-workflow-run.tsx');
    const { runLocalWorkflowTools } = await import('/src/shared/workflow-engine/local-tool-runner.ts');
    const { getToolForBlock } = await import('/src/shared/workflow-engine/local-tool-registry.ts');
    const entries = PORTFOLIO_WORKFLOWS.map(spec => ({ id: spec.id, name: spec.name, surface: 'catalog', definition: templateDefinition(spec.id)!, config: WORKFLOW_CONFIGS[spec.id.replace(/^pf-/, '')] }));
    for (const [id, config] of Object.entries(WORKFLOW_CONFIGS)) {
      if (!entries.some(entry => entry.id === `pf-${id}`)) entries.push({ id, name: config.name, surface: 'additional-runtime', definition: config.buildSnapshot(), config });
    }
    for (const name of ['createSingleItemPipelineDemoWorkflow', 'createExpandedMappingPipelineDemoWorkflow', 'createWorkingSourceRulesDemoWorkflow', 'createFapiSampleWorkflow']) {
      const definition = local[name](); entries.push({ id: name, name: definition.name, surface: 'builder-example', definition, config: undefined });
    }
    const execute = (definition: any) => {
      const start = performance.now();
      try {
        const run = runLocalWorkflowTools({ ...local.workflowDefinitionToCanvas(definition), workflowName: definition.name, workflowId: definition.id }).result;
        return { status: run.status, elapsedMs: Math.round(performance.now() - start), errors: run.errors, warnings: run.warnings, results: run.results.map(result => ({ blockId: result.blockId, label: definition.blocks.find(b => b.id === result.blockId)?.label, toolId: result.toolId, status: result.status, errors: result.errors, warnings: result.warnings, outputKeys: Object.keys(result.output), calculated: result.output.calculatedResults, namedValues: result.output.namedValues, rowCount: Array.isArray(result.output.rows) ? result.output.rows.length : undefined, mappedCount: Array.isArray(result.output.mappedRows) ? result.output.mappedRows.length : undefined, unmatchedCount: Array.isArray(result.output.unmatchedRows) ? result.output.unmatchedRows.length : undefined, transfers: result.inputTransfers?.map(t => ({ sourceBlockId: t.sourceBlockId, delivered: t.delivered, sourceOutputRole: t.sourceOutputRole, targetInputRole: t.targetInputRole, keys: Object.keys(t.output) })) })) };
      } catch (error) { return { status: 'exception', message: String(error), elapsedMs: Math.round(performance.now() - start), results: [] }; }
    };
    return entries.map(entry => {
      const definition = entry.definition;
      const baseline = execute(definition);
      const config = entry.config;
      const rows = config?.sampleRows ?? (entry.id === 'pf-document-calculator' ? [{ rowId: 'item-1', label: 'Item one', amount: 120 }, { rowId: 'item-2', label: 'Item two', amount: 80 }] : null);
      const injected = structuredClone(definition);
      const source = injected.blocks.find(block => block.id === config?.sourceBlockId) ?? (entry.id === 'pf-document-calculator' ? injected.blocks.find(block => block.config.toolId === 'source.manual_table') : undefined);
      if (source && rows) source.config = { ...source.config, rows: config?.toRawRow ? rows.map(config.toRawRow) : rows, requireUpload: false, selectedRowsCount: rows.length, sourceStatus: 'ready' };
      const configured = source && rows ? execute(injected) : null;
      let alternateRuntime = null;
      if (config) {
        try { const core = runTemplateCore(config, { rows: config.sampleRows, overrides: [], elected: config.id === 'holiday-payroll' ? 8 : undefined }); alternateRuntime = { status: core.status, headlineKey: config.headlineKey, headline: core.summaryValues[config.headlineKey], summary: core.summaryValues, buckets: core.detail.buckets, unmatched: core.unmatched }; }
        catch (error) { alternateRuntime = { exception: String(error) }; }
      }
      const changed = structuredClone(injected);
      const changedSource = changed.blocks.find(block => block.id === source?.id);
      if (changedSource?.config.rows?.[0]) changedSource.config.rows[0].amount = Number(changedSource.config.rows[0].amount) + 17;
      const perturbation = changedSource ? execute(changed) : null;
      return { id: entry.id, name: entry.name, surface: entry.surface, representative: config?.representative === true, blockCount: definition.blocks.length, edgeCount: definition.edges.length, configuredRows: rows?.length, sources: definition.blocks.filter(b => b.family === 'Source').map(b => ({ id: b.id, label: b.label, catalogId: b.catalogId, toolId: getToolForBlock(b)?.toolId, requireUpload: b.config.requireUpload, rowCount: Array.isArray(b.config.rows) ? b.config.rows.length : null })), calculators: definition.blocks.filter(b => b.config.toolId === 'logic.calculation_engine').map(b => ({ id: b.id, label: b.label, mode: b.config.mode, formulas: b.config.formulas, calculationRules: b.config.calculationRules })), missingExecutors: definition.blocks.filter(b => !getToolForBlock(b)).map(b => ({ id: b.id, label: b.label, catalogId: b.catalogId })), danglingEdges: definition.edges.filter(e => !definition.blocks.some(b => b.id === e.sourceBlockId) || !definition.blocks.some(b => b.id === e.targetBlockId)).map(e => e.id), baseline, configured, perturbation, alternateRuntime };
    });
  });
  save('engine-inventory', audit);
  for (const entry of audit) console.log(JSON.stringify({ id: entry.id, baseline: entry.baseline.status, configured: entry.configured?.status, alternate: entry.alternateRuntime?.status, headline: entry.alternateRuntime?.headline, errors: entry.configured?.errors ?? entry.baseline.errors, missingExecutors: entry.missingExecutors }));
  expect(audit.filter(entry => entry.surface === 'catalog')).toHaveLength(17);
  expect(audit).toHaveLength(24);
});

const catalogIds = ['pf-document-calculator', 'pf-holiday-payroll', 'pf-platform-sequence', 'pf-scope-service', 'pf-tax-position-summary', 'pf-data-readiness', 'pf-ownership-graph', 'pf-attribute-ledgers', 'pf-portfolio-ops', 'pf-t1134', 'pf-fapi', 'pf-surplus', 'pf-t106', 'pf-eifel', 'pf-t2-suite', 'pf-tax-provision', 'pf-part-xiii'];
for (const id of catalogIds) {
  test(`UI audit: ${id} opens Build, accepts a document, executes and retains its actual result`, async ({ page }, info) => {
    const browserErrors: string[] = [];
    page.on('pageerror', error => browserErrors.push(error.message));
    const start = Date.now();
    await page.goto(`/w/${id}`);
    await page.getByRole('button', { name: 'Build', exact: true }).click();
    await expect(page.getByText('Test data — upload document or enter examples', { exact: true })).toBeVisible();
    const openMs = Date.now() - start;
    const input = await page.evaluate(async id => {
      const { WORKFLOW_CONFIGS } = await import('/src/shared/workflow-engine/runtime/workflow-runs/index.ts');
      const config = WORKFLOW_CONFIGS[id.replace(/^pf-/, '')];
      return { kind: config ? 'bundled sample records' : id === 'pf-document-calculator' ? 'controlled neutral records' : 'generic upload probe; not domain-complete input', rows: config?.sampleRows ?? (id === 'pf-document-calculator' ? [{ label: 'Item one', amount: 120 }, { label: 'Item two', amount: 80 }] : [{ label: 'Operating revenue', amount: 100 }, { label: 'Salaries expense', amount: -20 }]) };
    }, id);
    await page.getByText('Test data — upload document or enter examples', { exact: true }).click();
    const upload = page.getByLabel('Upload test document');
    await expect(upload).toBeEnabled();
    await upload.setInputFiles({ name: 'workflow-audit.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(input.rows)) });
    await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
    await page.getByRole('button', { name: 'Run', exact: true }).first().click();
    const runStart = Date.now();
    await page.getByRole('button', { name: 'Save changes and run', exact: true }).click();
    await expect(page.getByRole('region', { name: 'Final workflow results' })).toBeVisible();
    const readSaved = () => page.evaluate(async () => {
      const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
      const entries = Object.values(readWorkflowLibrary());
      const entry = entries.find(entry => entry.runs.length > 0);
      if (!entry) return null;
      const run = entry.runs.at(-1)!.result.result;
      const sourceIds = entry.draft.blocks.filter(b => b.config.uploadTimestamp).map(b => b.id);
      return { id: entry.id, name: entry.draft.name, version: entry.versions.at(-1)?.number, runCount: entry.runs.length, runId: run.runId, status: run.status, errors: run.errors, warnings: run.warnings, sources: sourceIds.map(id => ({ id, connected: entry.draft.edges.some(e => e.sourceBlockId === id && e.status === 'active'), consumedBy: run.results.filter(r => r.inputTransfers?.some(t => t.sourceBlockId === id && t.delivered)).map(r => r.blockId) })), results: run.results.map(r => ({ blockId: r.blockId, label: entry.draft.blocks.find(b => b.id === r.blockId)?.label, status: r.status, errors: r.errors, warnings: r.warnings, calculated: r.output.calculatedResults, outputKeys: Object.keys(r.output) })) };
    });
    await expect.poll(async () => (await readSaved())?.runCount).toBe(1);
    const first = (await readSaved())!;
    const runMs = Date.now() - runStart;
    await page.reload();
    await page.getByRole('button', { name: 'Workflows', exact: true }).click();
    await page.getByRole('button', { name: first.name, exact: true }).click();
    await page.getByRole('button', { name: 'Run', exact: true }).first().click();
    await page.getByRole('button', { name: 'Run saved version 1', exact: true }).click();
    await expect.poll(async () => (await readSaved())?.runCount).toBe(2);
    const second = (await readSaved())!;
    expect(second.runId).not.toBe(first.runId);
    expect(second.status).toBe(first.status);
    await page.getByRole('region', { name: 'Final workflow results' }).scrollIntoViewIfNeeded();
    if (['pf-document-calculator', 'pf-holiday-payroll', 'pf-t1134', 'pf-fapi', 'pf-platform-sequence'].includes(id)) await page.screenshot({ path: `${evidence}/${id}.png`, fullPage: true });
    save(`ui-${id}`, { id, inputKind: input.kind, inputRows: input.rows.length, openMs, runMs, totalMs: Date.now() - start, browserErrors, first, second });
    console.log(JSON.stringify({ id, status: first.status, errors: first.errors, uploadSources: first.sources, openMs, runMs, persistedRuns: second.runCount, browserErrors }));
    expect(browserErrors).toEqual([]);
  });
}
