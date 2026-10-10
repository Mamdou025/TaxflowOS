import { readFileSync } from 'node:fs';
import type { Page } from '@playwright/test';
import { test, expect } from './workflow-audit-isolation';

// Invented records with independently specified arithmetic:
// A = 1,000 - 100 = 900; B = 400 × 0.5 = 200; gross = 1,100;
// FAT deduction = 100 × 4 = 400; net = 700; CAD = 700 × 1.35 = 945.
const sourceRows = [
  {
    rowId: 'interest',
    account: '4000',
    label: 'Interest income',
    description: 'Bank interest income',
    amount: 1000,
    currency: 'USD',
  },
  {
    rowId: 'expense',
    account: '5000',
    label: 'General expenses',
    description: 'Operating expenses',
    amount: -100,
    currency: 'USD',
  },
  {
    rowId: 'gain',
    account: '4300',
    label: 'Capital gains',
    description: 'Capital gains on shares',
    amount: 400,
    currency: 'USD',
  },
];

async function mountFapi(page: Page, withSource: boolean) {
  const ready = page.waitForResponse(
    (response) =>
      response.url().endsWith('/api/workflow-library') && response.request().method() === 'GET',
  );
  await page.goto('/');
  await ready;
  await expect(page.getByRole('button', { name: 'New chat', exact: true }).first()).toBeVisible({
    timeout: 60000,
  });
  await page.evaluate(
    async ({ rootPath, rows }) => {
      const React = await import('/@id/react');
      const { createRoot } = (await import('/@id/react-dom/client')).default;
      const { createStore, Provider } = await import('/@id/jotai');
      const { createWorkflow, saveVersion } = await import(
        `${rootPath}/lib/workflow-core/src/application/commands.ts`
      );
      const { startSession } = await import(
        `${rootPath}/lib/workflow-core/src/application/sessions.ts`
      );
      const { createFapiTemplateWorkflow } =
        await import('/src/shared/workflow-engine/workflow/templates/fapi.ts');
      const { workflowLibraryAtom } =
        await import('/src/features/workflows-hub/workflow-library.ts');
      const { syncWorkflowLibrary, workflowSyncStatus } =
        await import('/src/features/workflows-hub/workflow-sync.ts');
      const { applySessionAction } =
        await import('/src/features/workflows-hub/workflow-session-store.ts');
      const { WorkflowSessionPanel } =
        await import('/src/features/workflows-hub/workflow-session-panel.tsx');
      const { SavedWorkflowRun } =
        await import('/src/features/workflows-hub/saved-workflow-run.tsx');
      const { selectedWorkflowRunIdAtom } =
        await import('/src/features/workflows-hub/workflows-store.ts');
      const entry = startSession(
        saveVersion(
          createWorkflow('custom:fapi-reference', 'pf-fapi', createFapiTemplateWorkflow()),
        ),
        1,
        'fapi-reference-run',
        '2026-10-09T12:00:00.000Z',
      );
      const store = createStore();
      const ref = { workflowId: entry.id, runId: 'fapi-reference-run' };
      store.sub(workflowLibraryAtom, () => {});
      await syncWorkflowLibrary();
      if (!['Saved to server', 'Ready to save to server'].includes(workflowSyncStatus())) {
        throw new Error('Fixture library did not initialize: ' + workflowSyncStatus());
      }
      store.set(workflowLibraryAtom, { [entry.id]: entry });
      if (rows.length) {
        applySessionAction(store, ref, 0, {
          kind: 'source',
          blockId: 'fapi-source-trial-balance',
          sourceId: 'synthetic-fapi-source',
          name: 'Synthetic FAPI trial balance.xlsx',
          mode: 'replace',
          rows,
        });
      }
      window.readFapiReference = () => structuredClone(store.get(workflowLibraryAtom)[entry.id]);
      window.readFapiRunCount = () => store.get(workflowLibraryAtom)[entry.id].runs.length;
      const root = document.createElement('div');
      document.body.replaceChildren(root);
      const view = createRoot(root);
      window.showFapiResults = (selectedRunId = ref.runId, resultsOnly = true) => {
        store.set(selectedWorkflowRunIdAtom, selectedRunId);
        view.render(
          React.default.createElement(
            Provider,
            { store },
            React.default.createElement(SavedWorkflowRun, { id: entry.id, resultsOnly }),
          ),
        );
      };
      view.render(
        React.default.createElement(
          Provider,
          { store },
          React.default.createElement(WorkflowSessionPanel, { ...ref, presentation: 'chat' }),
        ),
      );
    },
    { rootPath: `/@fs/${process.cwd().replaceAll('\\', '/')}`, rows: withSource ? sourceRows : [] },
  );
}

test('FAPI reference opens four typed stages and an uncalculated worksheet with reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await mountFapi(page, false);
  const panel = page.getByRole('region', { name: 'Workflow execution', exact: true });
  const timeline = panel.getByRole('list', { name: 'Execution steps', exact: true });
  await expect(timeline.locator('[data-stage-toggle]')).toHaveCount(4);
  await expect(timeline.locator('.workflow-timeline-kind')).toHaveText([
    'Source',
    'Rule match',
    'Engine',
    'Checkpoint',
  ]);
  await expect(timeline.locator('[data-stage-toggle="collect"]')).toContainText('Needs your input');
  await expect(panel.getByLabel('Upload run source')).toBeVisible();
  await expect(panel.getByRole('button', { name: 'Start workflow', exact: true })).toBeVisible();
  const worksheet = panel.getByRole('region', { name: 'FAPI worksheet', exact: true });
  const summary = worksheet.getByRole('table', { name: 'FAPI results summary', exact: true });
  await expect(summary.locator('[data-value-status="missing"]')).toHaveCount(10);
  await expect(summary.locator('[data-result-key="NET_FAPI"]')).toHaveText('Not calculated');
  await expect(summary.locator('[data-result-key="NET_FAPI_CAD"]')).toHaveText('Not calculated');
  await expect(
    worksheet.getByRole('button', { name: 'Export worksheet CSV', exact: true }),
  ).toBeDisabled();
  expect(
    await timeline
      .locator('.workflow-timeline-stage')
      .evaluateAll((stages) => stages.map((stage) => getComputedStyle(stage).animationName)),
  ).toEqual(['none', 'none', 'none', 'none']);
  await timeline.locator('[data-stage-toggle="compute"]').click();
  await expect(timeline.locator('[data-stage-toggle="compute"]')).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  const savedLines = panel.locator('[data-block-details="fapi-logic-lines-engine"]');
  await expect(
    savedLines.getByRole('region', { name: 'Saved formulas', exact: true }),
  ).toContainText('pCoefficient * (income_bucket - expense_bucket) + canadianRules95_4');
  await expect(savedLines.locator('[data-result-state="missing"]')).toContainText(
    'No recorded result yet',
  );
  await expect(panel.getByText('Step evidence and controls', { exact: true })).toHaveCount(0);
  await savedLines.screenshot({
    path: test.info().outputPath('fapi-inline-saved-formulas.png'),
    style: 'html, body { height: auto !important; overflow: visible !important; }',
  });
  await timeline.locator('[data-stage-toggle="collect"]').click();
  await expect(panel.getByLabel('Upload run source')).toBeVisible();
  const entry = await page.evaluate(() => window.readFapiReference());
  expect(entry.sessions[0].results).toEqual({});
  expect(entry.sessions[0].attempts).toHaveLength(0);
  expect(entry.runs).toHaveLength(0);
});

test('FAPI prescribed results follow live inputs, retain folded drafts and export the exact recalculated run', async ({
  page,
}) => {
  await mountFapi(page, true);
  const panel = page.getByRole('region', { name: 'Workflow execution', exact: true });
  const timeline = panel.getByRole('list', { name: 'Execution steps', exact: true });
  const worksheet = panel.getByRole('region', { name: 'FAPI worksheet', exact: true });
  const summary = worksheet.getByRole('table', { name: 'FAPI results summary', exact: true });
  const read = () => page.evaluate(() => window.readFapiReference());
  await expect(worksheet).toHaveAttribute('data-run-id', 'fapi-reference-run');
  await expect
    .poll(async () =>
      timeline
        .locator('.workflow-timeline-stage')
        .first()
        .evaluate((stage) => getComputedStyle(stage).animationName),
    )
    .toBe('workflow-step-in');
  await panel.getByRole('button', { name: 'Start workflow', exact: true }).click();
  await expect(summary.locator('[data-result-key="NET_FAPI_CAD"]')).toHaveText('945.00');
  await expect(summary.getByRole('columnheader')).toHaveText(['Results summary', 'USD', 'CAD']);
  await expect(summary.locator('tbody > tr > th')).toContainText([
    'Gross',
    'Deductions',
    'FAPI brut',
    'FAT deduction',
    'Net FAPI',
  ]);
  for (const [key, value] of Object.entries({
    GROSS: '1,100.00',
    DEDUCTIONS: '0.00',
    FAPI_BRUT: '1,100.00',
    FAT_DEDUCTION: '400.00',
    NET_FAPI: '700.00',
    NET_FAPI_CAD: '945.00',
  })) {
    const cell = summary.locator(`[data-result-key="${key}"]`);
    await expect(cell).toHaveAttribute('data-value-status', 'current');
    await expect(cell).toHaveText(value);
  }
  await expect(
    panel.getByRole('button', { name: 'Approve completed results', exact: true }),
  ).toBeEnabled();
  const original = await read();
  expect(original.runs).toHaveLength(1);
  expect(original.sessions[0].sources[0].name).toBe('Synthetic FAPI trial balance.xlsx');
  expect(
    original.sessions[0].results['fapi-logic-summary-engine'].output.calculatedResults.NET_FAPI,
  ).toBe(700);
  await timeline.locator('[data-stage-toggle="compute"]').click();
  const recordedSummary = panel.locator(
    '[data-block-details="fapi-logic-summary-engine"] [data-result-state="recorded"]',
  );
  await expect(recordedSummary).toContainText('700');
  await expect(
    recordedSummary.getByRole('heading', { name: 'Recorded calculation trace', exact: true }),
  ).toBeVisible();
  const collect = timeline.locator('[data-stage-toggle="collect"]');
  if ((await collect.getAttribute('aria-expanded')) !== 'true') await collect.click();
  const form = panel.getByRole('region', { name: 'Inputs for FAPI Inputs', exact: true });
  const inclusion = form
    .getByText('Inclusion rate', { exact: true })
    .locator('..')
    .locator('input');
  await inclusion.fill('0.25');
  await panel.getByRole('button', { name: 'Collapse all steps', exact: true }).click();
  await expect(form).toBeHidden();
  await timeline.locator('[data-stage-toggle="compute"]').click();
  await collect.click();
  await expect(inclusion).toHaveValue('0.25');
  expect(await read()).toEqual(original);
  await expect(summary.locator('[data-result-key="NET_FAPI"]')).toHaveText('700.00');
  await form.getByRole('button', { name: 'Apply inputs & recalculate', exact: true }).click();
  // Only the gains inclusion changes: B=100, gross=1,000, net=600, CAD=810.
  await expect(summary.locator('[data-result-key="NET_FAPI_CAD"]')).toHaveText('810.00');
  await expect(summary.locator('[data-result-key="GROSS"]')).toHaveText('1,000.00');
  await expect(summary.locator('[data-result-key="NET_FAPI"]')).toHaveText('600.00');
  // Poll only the counter: transporting all saved graph attempts can exceed the
  // assertion clock even when the second historical result is already present.
  await expect.poll(() => page.evaluate(() => window.readFapiRunCount())).toBe(2);
  const changed = await read();
  expect(changed.sessions).toHaveLength(1);
  expect(changed.sessions[0].id).toBe(original.sessions[0].id);
  expect(changed.sessions[0].sources).toEqual(original.sessions[0].sources);
  expect(changed.sessions[0].inputOverrides['fapi-source-inputs'].inclusionRate).toBe(0.25);
  expect(changed.sessions[0].attempts.length).toBeGreaterThan(original.sessions[0].attempts.length);
  expect(changed.runs[0]).toEqual(original.runs[0]);
  expect(changed.versions).toEqual(original.versions);
  expect(changed.draft).toEqual(original.draft);
  await expect(worksheet).toContainText('Not yet approved');
  await worksheet.getByText('Open full worksheet', { exact: true }).click();
  const lines = worksheet.getByRole('table', { name: 'FAPI worksheet lines', exact: true });
  await expect(lines.locator('[data-result-key="A"]')).toHaveText('900.00');
  await expect(lines.locator('[data-result-key="B"]')).toHaveText('100.00');
  const downloadPromise = page.waitForEvent('download');
  await worksheet.getByRole('button', { name: 'Export worksheet CSV', exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe(
    `fapi-worksheet-v1-revision-${changed.sessions[0].revision}.csv`,
  );
  const downloadedPath = await download.path();
  expect(downloadedPath).not.toBeNull();
  const csv = readFileSync(downloadedPath!, 'utf8');
  expect(csv).toContain(
    `"Run","fapi-reference-run","Version",1,"Revision",${changed.sessions[0].revision}`,
  );
  expect(csv).toContain(
    '"Results summary","NET_FAPI","Net FAPI","USD","current",600,"fapi-logic-summary-engine","NET_FAPI"',
  );
  expect(csv).toContain(
    '"Results summary","NET_FAPI","Net FAPI","CAD","current",810,"fapi-logic-summary-engine","NET_FAPI_CAD"',
  );
  await panel.getByRole('button', { name: 'Collapse all steps', exact: true }).click();
  await panel.screenshot({
    path: test.info().outputPath('fapi-reference-result.png'),
    // This isolated mount replaces the app's scrolling shell. During capture only,
    // remove its inherited viewport clipping so the complete worksheet is visible.
    style: 'html, body { height: auto !important; overflow: visible !important; }',
  });
  await page.evaluate(() => window.showFapiResults());
  const resultsWorksheet = page.getByRole('region', { name: 'FAPI worksheet', exact: true });
  await expect(resultsWorksheet).toHaveAttribute('data-run-id', 'fapi-reference-run');
  await expect(
    resultsWorksheet.getByRole('table', { name: 'FAPI worksheet lines', exact: true }),
  ).toBeVisible();
  await expect(resultsWorksheet.locator('[data-result-key="B"]')).toHaveText('100.00');
  await expect(resultsWorksheet.locator('[data-result-key="NET_FAPI_CAD"]')).toHaveText('810.00');
  await expect(page.getByRole('button', { name: 'Return to workflow', exact: true })).toBeVisible();
  expect(await read()).toEqual(changed);
  // Selecting the earlier recorded result must show its snapshot, without rerunning
  // or borrowing the newer active session's changed inclusion rate.
  await page.evaluate(
    (runId) => window.showFapiResults(runId),
    original.runs[0].result.record.execution.id,
  );
  await expect(resultsWorksheet.locator('[data-result-key="B"]')).toHaveText('200.00');
  await expect(resultsWorksheet.locator('[data-result-key="NET_FAPI_CAD"]')).toHaveText('945.00');
  expect(await read()).toEqual(changed);
  await page.evaluate(() => window.showFapiResults('fapi-reference-run', false));
  const runPanel = page.getByRole('region', { name: 'Workflow execution', exact: true });
  await runPanel.locator('[data-stage-toggle="collect"]').click();
  const runForm = runPanel.getByRole('region', { name: 'Inputs for FAPI Inputs', exact: true });
  const unappliedRate = runForm
    .getByText('Inclusion rate', { exact: true })
    .locator('..')
    .locator('input');
  await unappliedRate.fill('0.3');
  await page.evaluate(() => window.showFapiResults('fapi-reference-run', true));
  await expect(runPanel).toBeHidden();
  await expect(resultsWorksheet.locator('[data-result-key="NET_FAPI_CAD"]')).toHaveText('810.00');
  expect(await read()).toEqual(changed);
  await page.evaluate(() => window.showFapiResults('fapi-reference-run', false));
  await expect(unappliedRate).toHaveValue('0.3');
  await expect(
    runPanel
      .getByRole('region', { name: 'FAPI worksheet', exact: true })
      .locator('[data-result-key="NET_FAPI_CAD"]'),
  ).toHaveText('810.00');
  expect(await read()).toEqual(changed);
});
