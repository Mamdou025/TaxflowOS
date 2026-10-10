import { attachSessionWorkbook } from './workflow-session-fixtures';
import { test, expect } from './workflow-audit-isolation';

test.describe('Guided run-state persistence', () => {
  test('a started run retains its source and exact identity after navigating away and reloading', async ({
    page,
  }) => {
    await page.goto('/run/fapi');
    await page.getByRole('button', { name: 'Start guided workflow' }).click();
    const panel = page.getByRole('region', { name: 'Workflow execution' });
    await attachSessionWorkbook(page, panel, 'trial.xlsx', 120);
    await expect(panel).toContainText('trial.xlsx');
    const identity = await panel.locator(':scope > header').innerText();
    const exactRunLink = await panel
      .getByRole('link', { name: 'Open this workflow in Run', exact: true })
      .getAttribute('href');
    const readLibrary = () =>
      page.evaluate(async () => {
        const { readWorkflowLibrary } =
          await import('/src/features/workflows-hub/workflow-library.ts');
        return readWorkflowLibrary();
      });
    const original = Object.values(await readLibrary()).find((entry) => entry.sessions?.length)!;
    expect(original.sessions).toHaveLength(1);
    await page.goto('/documents');
    await page.goto('/run/fapi');
    await panel.waitFor();
    // A template selection cannot infer the sole saved derivative as a Resume.
    await expect(panel.getByRole('button', { name: 'Start guided workflow' })).toBeEnabled();
    await expect(panel).not.toContainText('trial.xlsx');
    await expect(panel.getByRole('button', { name: 'Approve completed results' })).toHaveCount(0);
    expect((await readLibrary())[original.id]).toEqual(original);
    await panel.getByRole('button', { name: 'Start guided workflow' }).click();
    const library = await readLibrary();
    const fresh = Object.values(library).find((entry) => entry.id !== original.id)!;
    expect(Object.keys(library)).toHaveLength(2);
    expect(fresh.sessions).toHaveLength(1);
    expect(fresh.sessions![0].id).not.toBe(original.sessions![0].id);
    expect(fresh.sessions![0].sources).toEqual([]);
    expect(fresh.sessions![0].attempts).toEqual([]);
    expect(library[original.id]).toEqual(original);
    await expect(panel).not.toContainText('trial.xlsx');
    // Only the captured saved identity restores that source and version.
    await page.goto(exactRunLink!);
    await page.getByRole('button', { name: 'Run', exact: true }).first().click();
    await expect(panel).toContainText('trial.xlsx');
    expect(await panel.locator(':scope > header').innerText()).toBe(identity);
    await page.reload();
    // The /w compatibility route normalizes to Chat home; refreshing does not
    // restore its transient detail window. Reopen the captured exact saved run.
    await page.getByRole('textbox', { name: 'Ask Scope, or describe a task…' }).waitFor();
    await page.goto(exactRunLink!);
    await page.getByRole('button', { name: 'Run', exact: true }).first().click();
    await panel.waitFor();
    await expect(panel).toContainText('trial.xlsx');
    expect(await panel.locator(':scope > header').innerText()).toBe(identity);
    const restored = (await readLibrary())[original.id];
    expect(restored.versions).toEqual(original.versions);
    expect(restored.sessions).toEqual(original.sessions);
  });

  test('an exact run selection replaces a local new run in the same mounted panel', async ({
    page,
  }) => {
    await page.goto('/run/fapi');
    await page.getByRole('region', { name: 'Workflow execution', exact: true }).waitFor();
    await page.evaluate(
      async (rootPath) => {
        const React = await import('/@id/react');
        const { createRoot } = (await import('/@id/react-dom/client')).default;
        const { createStore, Provider, useAtomValue } = await import('/@id/jotai');
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
        const { selectedWorkflowRunIdAtom } =
          await import('/src/features/workflows-hub/workflows-store.ts');
        const { WorkflowSessionPanel } =
          await import('/src/features/workflows-hub/workflow-session-panel.tsx');
        const entry = startSession(
          saveVersion(
            createWorkflow('custom:panel-identity', 'pf-fapi', createFapiTemplateWorkflow()),
          ),
          1,
          'original-panel-run',
          '2026-10-09T12:00:00.000Z',
        );
        const store = createStore();
        store.sub(workflowLibraryAtom, () => {});
        store.set(workflowLibraryAtom, { [entry.id]: entry });
        store.set(selectedWorkflowRunIdAtom, 'original-panel-run');
        window.readPanelIdentity = () => ({
          selectedRunId: store.get(selectedWorkflowRunIdAtom),
          entry: structuredClone(store.get(workflowLibraryAtom)[entry.id]),
        });
        window.selectPanelRun = (runId: string) => store.set(selectedWorkflowRunIdAtom, runId);
        function RequestedPanel() {
          const runId = useAtomValue(selectedWorkflowRunIdAtom);
          return React.default.createElement(WorkflowSessionPanel, {
            workflowId: entry.id,
            runId: runId ?? undefined,
          });
        }
        const root = document.createElement('div');
        document.body.replaceChildren(root);
        createRoot(root).render(
          React.default.createElement(
            Provider,
            { store },
            React.default.createElement(RequestedPanel),
          ),
        );
      },
      `/@fs/${process.cwd().replaceAll('\\', '/')}`,
    );
    const panel = page.getByRole('region', { name: 'Workflow execution', exact: true });
    await expect(panel.locator(':scope > header')).toContainText('original-panel-run');
    const original = await page.evaluate(() => window.readPanelIdentity());
    await panel.getByRole('button', { name: 'New run from Build', exact: true }).click();
    const fresh = await page.evaluate(() => window.readPanelIdentity());
    expect(fresh.selectedRunId).not.toBe(original.selectedRunId);
    expect(fresh.entry.sessions).toHaveLength(2);
    expect(fresh.entry.sessions[0]).toEqual(original.entry.sessions[0]);
    expect(fresh.entry.versions).toEqual(original.entry.versions);
    await expect(panel.locator(':scope > header')).toContainText(fresh.selectedRunId!);
    // Change only the requested ID; keep the same parent and panel instance.
    await page.evaluate(() => window.selectPanelRun('original-panel-run'));
    await expect(panel.locator(':scope > header')).toContainText('original-panel-run');
    await expect(panel.locator(':scope > header')).not.toContainText(fresh.selectedRunId!);
    expect((await page.evaluate(() => window.readPanelIdentity())).entry).toEqual(fresh.entry);
    await page.evaluate(() => window.selectPanelRun('missing-panel-run'));
    await expect(page.getByRole('alert')).toContainText('This exact run is unavailable');
    expect((await page.evaluate(() => window.readPanelIdentity())).entry).toEqual(fresh.entry);
  });
  test('an unstarted workflow does not inherit another workflow source or approvals', async ({
    page,
  }) => {
    await page.goto('/run/fapi');
    // Finish loading the deferred workspace before checking run isolation.
    await page.getByRole('region', { name: 'Workflow execution', exact: true }).waitFor();
    await expect(page.getByRole('button', { name: 'Start guided workflow' })).toBeVisible();
    await page.getByRole('button', { name: 'Start guided workflow' }).click();
    await expect(page.getByRole('button', { name: 'Approve completed results' })).toBeDisabled();
    await expect(page.getByRole('list', { name: 'Execution steps' })).toContainText('Pending');
    await page.goto('/run/t1134');
    await page.getByRole('region', { name: 'Workflow execution', exact: true }).waitFor();
    await expect(page.getByRole('button', { name: 'Start guided workflow' })).toBeEnabled();
    await expect(page.getByRole('list', { name: 'Execution steps' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Approve completed results' })).toHaveCount(0);
  });
  test('retired workflow routes outside Tier 1 are unavailable and cannot create new sessions', async ({
    page,
  }) => {
    for (const id of [
      'expense',
      'scope-service',
      'tax-position-summary',
      'data-readiness',
      'platform-sequence',
      'ownership-graph',
      'attribute-ledgers',
      'portfolio-ops',
    ]) {
      await page.goto(`/run/${id}`);
      const unavailable = page.getByRole('heading', {
        name: 'Requested workflow version unavailable',
        exact: true,
      });
      await unavailable.waitFor();
      await expect(unavailable).toBeVisible();
      await expect(page.getByRole('button', { name: 'Start guided workflow' })).toBeDisabled();
      await expect(page.getByRole('list', { name: 'Execution steps' })).toHaveCount(0);
    }
    const sessions = await page.evaluate(async () => {
      const { readWorkflowLibrary } =
        await import('/src/features/workflows-hub/workflow-library.ts');
      return Object.values(readWorkflowLibrary()).flatMap((entry) => entry.sessions ?? []);
    });
    expect(sessions).toEqual([]);
  });
});
