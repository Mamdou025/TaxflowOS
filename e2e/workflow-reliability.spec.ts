import { test, expect } from './workflow-audit-isolation';

test.beforeEach(async ({ page, baseURL }) => {
  await page.route(`${baseURL}/`, (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<html><body>Workflow verification</body></html>',
    }),
  );
  await page.goto('/');
});

test('all advertised workflows execute from chat data and export actual results', async ({
  page,
}) => {
  const findings = await page.evaluate(async () => {
    const { WORKFLOW_CONFIGS, runTemplateCore } =
      await import('/src/shared/workflow-engine/runtime/workflow-runs/index.ts');
    const { executeWorkflowCommand } =
      await import('/src/features/assistant/runtime/workflow-command.ts');
    const { PORTFOLIO_WORKFLOWS } =
      await import('/src/shared/workflow-engine/templates/portfolio/portfolio-workflows.ts');
    const { resolveWorkflowTarget } =
      await import('/src/features/assistant/runtime/routing/workflow-targets.ts');
    return {
      catalog: PORTFOLIO_WORKFLOWS.map((w) => w.id),
      runs: Object.values(WORKFLOW_CONFIGS).map((config) => {
        const command = executeWorkflowCommand({
          workflowId: config.id,
          useSample: true,
        });
        const core = command.core!;
        const exports = core.execution.result.results.filter(
          (r) => r.toolId === 'output.excel_export',
        );
        return {
          id: config.id,
          status: core.status,
          errors: core.errors,
          summary: core.summaryValues,
          exportRows: exports.map((r) => r.output.rowCount),
          exportData: exports.map((r) => r.output.sheets[0].rows),
          rows: core.detail.workpaperRows,
          target: resolveWorkflowTarget(`Run ${config.name}`).id,
          required: executeWorkflowCommand({ workflowId: config.id }).required,
          alteredExpense:
            config.id === 'expense'
              ? runTemplateCore(config, {
                  rows: config.sampleRows,
                  overrides: [],
                  inputs: { mealCap: 100 },
                }).summaryValues.NET_PAYABLE
              : undefined,
        };
      }),
    };
  });
  console.log(JSON.stringify(findings.runs.map(({ rows, exportData, ...r }) => r)));
  expect(findings.runs).toHaveLength(17);
  for (const run of findings.runs) {
    expect(run.errors, run.id).toEqual([]);
    expect(run.status, run.id).not.toBe('error');
    expect(run.target, run.id).toBe(run.id);
    expect(run.required.length, run.id).toBeGreaterThan(0);
    for (const count of run.exportRows) expect(count, run.id).toBeGreaterThan(0);
    if (run.rows) for (const exported of run.exportData) expect(exported, run.id).toEqual(run.rows);
  }
  expect(findings.runs.find((r) => r.id === 'document-calculator')!.summary.RESULT).toBe(400);
  expect(findings.runs.find((r) => r.id === 'fapi')!.summary.NET_FAPI).toBe(24600);
  expect(findings.runs.find((r) => r.id === 'expense')!.summary.NET_PAYABLE).toBe(2325);
  expect(findings.runs.find((r) => r.id === 'expense')!.alteredExpense).toBe(2175);
  for (const id of findings.catalog)
    expect(findings.runs.some((r) => `pf-${r.id}` === id)).toBe(true);
});

test('invalid graphs and input records cannot claim completion or substitute samples', async ({
  page,
}) => {
  const checks = await page.evaluate(async () => {
    const { WORKFLOW_CONFIGS, runTemplateLoop, runToCompletion, initialRunState } =
      await import('/src/shared/workflow-engine/runtime/workflow-runs/index.ts');
    const { executeWorkflowCommand } =
      await import('/src/features/assistant/runtime/workflow-command.ts');
    const bad = {
      ...WORKFLOW_CONFIGS['document-calculator'],
      buildSnapshot: () => {
        const snapshot = WORKFLOW_CONFIGS['document-calculator'].buildSnapshot();
        snapshot.blocks.find((b) => b.id === 'pf-document-calculator--calculate')!.config.formulas =
          [];
        return snapshot;
      },
    };
    const failure = runTemplateLoop(bad, {
      ...initialRunState(),
      uploaded: true,
      approved: true,
      rows: bad.sampleRows,
    });
    const auto = runToCompletion(bad);
    const empty = runTemplateLoop(WORKFLOW_CONFIGS.fapi, {
      ...initialRunState(),
      uploaded: true,
      approved: true,
      rows: [],
    });
    const rejected: string[] = [];
    for (const args of [
      { workflowId: 'fapi', recordsJson: '[]' },
      {
        workflowId: 'fapi',
        recordsJson: '[{"label":"Interest","amount":"bad"}]',
      },
      { workflowId: 'campaign', useSample: true },
      { workflowId: 'roulement', useSample: true },
      { workflowId: 'holiday-payroll', useSample: true },
    ]) {
      try {
        executeWorkflowCommand(args);
      } catch {
        rejected.push(args.workflowId);
      }
    }
    const { parseHttpJsonConfig, mapRecordsToRows } =
      await import('/src/shared/workflow-engine/execution/blocks/source/http-json/schema.ts');
    const mapped = mapRecordsToRows({
      records: [{ name: 'Holiday one' }, { name: 'Holiday two' }],
      fieldMap: { label: 'name' },
      defaultAmount: 1,
    });
    return {
      failure,
      auto,
      empty,
      rejected,
      mappedAmounts: mapped.rows.map((r) => r.amount),
      blankDefault: parseHttpJsonConfig({ defaultAmount: null }).defaultAmount,
    };
  });
  for (const run of [checks.failure, checks.auto, checks.empty]) {
    expect(run.done).toBe(false);
    expect(run.blocker?.kind).toBe('error');
    expect(run.headline).toBeUndefined();
  }
  expect(checks.rejected).toHaveLength(5);
  expect(checks.mappedAmounts).toEqual([1, 1]);
  expect(checks.blankDefault).toBeUndefined();
});

test('workpaper arithmetic, evidence checks, currency grouping and ownership validation', async ({
  page,
}) => {
  const data = await page.evaluate(async () => {
    const { WORKPAPER_SPECS, executeWorkpaper } =
      await import('/src/shared/workflow-engine/portfolio-workpapers.ts');
    const run = (id: string, rows?: any[]) =>
      executeWorkpaper(id, rows ?? WORKPAPER_SPECS.find((s) => s.id === id)!.sample);
    const invalid = WORKPAPER_SPECS.map((spec) =>
      spec.fields.every((field) => {
        const rows = structuredClone(spec.sample);
        delete rows[0][field];
        try {
          run(spec.id, rows);
          return false;
        } catch {
          return true;
        }
      }),
    );
    let cycle = false;
    try {
      run('ownership-graph', [
        { owner: 'A', entity: 'B', ownershipPercent: 50, evidence: 'x' },
        { owner: 'B', entity: 'A', ownershipPercent: 50, evidence: 'y' },
      ]);
    } catch {
      cycle = true;
    }
    const tx = WORKPAPER_SPECS.find((s) => s.id === 't106')!.sample[0];
    return {
      invalid,
      cycle,
      ownership: run('ownership-graph'),
      ledger: run('attribute-ledgers'),
      surplus: run('surplus'),
      eifel: run('eifel'),
      bridge: run('t2-suite'),
      provision: run('tax-provision'),
      withholding: run('part-xiii'),
      tx: run('t106', [tx, { ...tx, currency: 'CAD' }, { ...tx, direction: 'receipt' }]),
    };
  });
  expect(data.invalid).toEqual(Array(14).fill(true));
  expect(data.cycle).toBe(true);
  expect(
    data.ownership.rows.find((r) => r.owner === 'Parent' && r.entity === 'Opco')!.ownershipPercent,
  ).toBe(40);
  expect(data.ledger.rows[0].closing).toBe(900);
  expect(data.surplus.rows[0].closing).toBe(1100);
  expect(data.eifel.rows[0].deniedInterest).toBe(130);
  expect(data.bridge.rows[0].taxableIncome).toBe(800);
  expect(data.provision.rows[0].totalTaxExpense).toBe(261.5);
  expect(data.withholding.rows[0].balance).toBe(50);
  expect(data.tx.rows).toHaveLength(3);
});

test('the chat handler saves the graph result and the result card keeps review findings visible', async ({
  page,
}) => {
  const saved = await page.evaluate(async () => {
    const { createStore } = await import('/@id/jotai');
    const { executeAndSaveWorkflowCommand } =
      await import('/src/features/assistant/runtime/workflow-command-store.ts');
    const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
    const store = createStore();
    const missing = executeAndSaveWorkflowCommand(store, {
      workflowId: 'part-xiii',
    });
    const result = executeAndSaveWorkflowCommand(store, {
      workflowId: 'part-xiii',
      useSample: true,
    });
    const entry = readWorkflowLibrary()[result.savedWorkflowId!];
    return { missing, result, entry };
  });
  expect(saved.missing.status).toBe('needs_input');
  expect(saved.entry.runs).toHaveLength(1);
  expect(saved.entry.runs[0].result.result.workflowId).toBe(saved.entry.id);
  expect(saved.entry.runs[0].result.record.execution.workflowId).toBe(saved.entry.id);
  expect(saved.entry.runs[0].result.record.execution.id).toBe(saved.result.runId);
  expect(saved.result.version).toBe(saved.entry.runs[0].version);
  expect(saved.entry.draft.name).toContain('Sample data');
  expect(saved.entry.runs[0].result.result.status).toBe('warning');
  await page.evaluate(async (result) => {
    const refresh = (await import('/@react-refresh')).default;
    refresh.injectIntoGlobalHook(window);
    window.$RefreshReg$ = () => {};
    window.$RefreshSig$ = () => (type) => type;
    window.__vite_plugin_react_preamble_installed__ = true;
    const React = await import('/@id/react');
    const { createRoot } = (await import('/@id/react-dom/client')).default;
    const { WorkflowCommandResult } =
      await import('/src/features/assistant/ui/workflow-command-result.tsx');
    createRoot(document.body).render(
      React.default.createElement(WorkflowCommandResult, { result }),
    );
  }, saved.result);
  await expect(page.getByRole('region', { name: 'Chat workflow result' })).toBeVisible();
  await expect(page.getByText('Sample data — not client results')).toBeVisible();
  await expect(
    page.getByText('Nonresident A: reconcile withholding balance 50 CAD.'),
  ).toBeVisible();
  await expect(page.getByText('Persistence: Server sync not confirmed')).toBeVisible();
  await page.reload();
  const restored = await page.evaluate(async (id) => {
    const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
    return readWorkflowLibrary()[id];
  }, saved.result.savedWorkflowId!);
  expect(restored.runs).toEqual(saved.entry.runs);
});

test('editing calculation inputs invalidates prior approval and sample previews do not approve', async ({
  page,
}) => {
  const state = await page.evaluate(async () => {
    const { createStore } = await import('/@id/jotai');
    const { runFlowAtom, setRunInputAtom } = await import('/src/shared/stores/workspace-store.ts');
    const { WORKFLOW_CONFIGS, runToCompletion } =
      await import('/src/shared/workflow-engine/runtime/workflow-runs/index.ts');
    const store = createStore();
    store.set(runFlowAtom, { expense: { uploaded: true, approved: true, elected: null } });
    store.set(setRunInputAtom, { id: 'expense', key: 'mealCap', value: 100 });
    const { resolveWorkflowTarget } =
      await import('/src/features/assistant/runtime/routing/workflow-targets.ts');
    return {
      approved: store.get(runFlowAtom).expense.approved,
      preview: runToCompletion(WORKFLOW_CONFIGS['document-calculator']),
      target: resolveWorkflowTarget('Run FAPI with records: [{"label":"expense","amount":5}]').id,
      ambiguous: resolveWorkflowTarget('Run FAPI and the rollover').ambiguous,
    };
  });
  expect(state.approved).toBe(false);
  expect(state.preview.done).toBe(false);
  expect(state.preview.blocker?.kind).toBe('approval');
  expect(state.target).toBe('fapi');
  expect(state.ambiguous).toBe(true);
});

test('workpaper upload, run, business results and saved rerun agree in the app', async ({
  page,
  baseURL,
}, info) => {
  await page.unroute(`${baseURL}/`);
  await page.goto('/w/pf-ownership-graph');
  await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  await page.getByText('Test data — upload document or enter examples', { exact: true }).click();
  await page.getByLabel('Upload test document').setInputFiles({
    name: 'ownership.json',
    mimeType: 'application/json',
    buffer: Buffer.from(
      JSON.stringify([
        {
          owner: 'Parent',
          entity: 'Holdco',
          ownershipPercent: 80,
          evidence: 'register-1',
        },
        {
          owner: 'Holdco',
          entity: 'Opco',
          ownershipPercent: 50,
          evidence: 'register-2',
        },
      ]),
    ),
  });
  await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
  await page.getByRole('button', { name: 'Save changes and preview', exact: true }).click();
  const results = page.getByRole('region', { name: 'Final workflow results' });
  await expect(results.getByRole('cell', { name: '40', exact: true })).toBeVisible();
  const before = await page.evaluate(async () => {
    const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
    return Object.values(readWorkflowLibrary()).find((entry) => entry.runs.length)!;
  });
  await page.reload();
  await page.getByRole('button', { name: 'Workflows', exact: true }).click();
  await page.getByRole('button', { name: before.draft.name, exact: true }).click();
  await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  await page.getByRole('button', { name: 'Preview saved version 1 in this browser', exact: true }).click();
  await expect(results.getByRole('cell', { name: '40', exact: true })).toBeVisible();
  await results.scrollIntoViewIfNeeded();
  await page.screenshot({
    path: info.outputPath('ownership-workpaper.png'),
    fullPage: true,
  });
});
