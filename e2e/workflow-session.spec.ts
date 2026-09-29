import { attachSessionWorkbook } from './workflow-session-fixtures';
import { test, expect } from './workflow-audit-isolation';
import { openDocumentCalculationFixture } from './retired-workflow-fixtures';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

test('document interpretation is saved by the user and stale proposals cannot overwrite it', async ({
  page,
}) => {
  await page.goto('/w/pf-fapi');
  await expect(
    page.getByRole('textbox', { name: 'Ask Scope, or describe a task…' }),
  ).toBeEditable();
  await page.evaluate(
    async (rootPath) => {
      const React = await import('/@id/react');
      const { createRoot } = (await import('/@id/react-dom/client')).default;
      const { createStore, Provider } = await import('/@id/jotai');
      const { createWorkflow, saveVersion } = await import(
        `${rootPath}/lib/workflow-core/src/application/commands.ts`
      );
      const { startSession, changeSession } = await import(
        `${rootPath}/lib/workflow-core/src/application/sessions.ts`
      );
      const { makeDocumentReview } = await import(
        `${rootPath}/lib/workflow-core/src/application/document-review.ts`
      );
      const { browserGraphRuntime } =
        await import('/src/shared/workflow-engine/workflow/execute.ts');
      const { workflowLibraryAtom } =
        await import('/src/features/workflows-hub/workflow-library.ts');
      const { workspaceContext } = await import('/src/platform/auth/workspace-context.ts');
      const { DOCUMENT_CALCULATOR_CONFIG } =
        await import('/src/shared/workflow-engine/runtime/workflow-runs/document-calculator.ts');
      const { DocumentReviewProposal } =
        await import('/src/features/assistant/ui/use-document-review-tools.tsx');
      const { WorkflowSessionPanel } =
        await import('/src/features/workflows-hub/workflow-session-panel.tsx');
      const definition = DOCUMENT_CALCULATOR_CONFIG.buildSnapshot();
      definition.blocks = [definition.blocks.find((block) => block.family === 'Source')!];
      definition.edges = [];
      let entry = startSession(
        saveVersion(createWorkflow('custom:review-ui', 'blank', definition)),
        1,
        'review-run',
        '2026-09-29T12:00:00.000Z',
      );
      entry = changeSession(
        entry,
        'review-run',
        0,
        {
          kind: 'source',
          sourceId: 'review-source',
          blockId: definition.blocks[0].id,
          name: 'review.pdf',
          mode: 'replace',
          rows: [],
          extraction: {
            id: 'review-source',
            revision: 1,
            fileName: 'review.pdf',
            extractedAt: '2026-09-29T12:00:00.000Z',
            method: 'pdf_text',
            contentHash: `sha256:${'a'.repeat(64)}`,
            rows: [],
            issues: [],
            segments: [
              {
                id: 'page-1',
                location: 'Page 1',
                text: 'Northwind Synthetic Ltd. Revenue CAD 120.',
              },
            ],
          },
        },
        browserGraphRuntime,
      );
      const session = entry.sessions![0];
      const review = makeDocumentReview(
        session,
        'review-source',
        {
          observations: [
            {
              field: 'company',
              value: 'Northwind Synthetic Ltd.',
              citations: [{ segmentId: 'page-1', quote: 'Northwind Synthetic Ltd.' }],
            },
          ],
          questions: ['document_type', 'reporting_period', 'currency'].map((field) => ({
            field,
            kind: 'missing',
            question: `Confirm ${field}`,
            citations: [],
          })),
        },
        'ui-review',
        '2026-09-29T12:00:00.000Z',
      );
      const store = createStore();
      store.set(workflowLibraryAtom, { [entry.id]: entry });
      const props = {
        ref: { workflowId: entry.id, runId: session.id },
        revision: session.revision,
        review,
        workspaceId: workspaceContext!.workspace.id,
      };
      const root = document.createElement('div');
      document.body.replaceChildren(root);
      createRoot(root).render(
        React.default.createElement(
          Provider,
          { store },
          React.default.createElement(DocumentReviewProposal, { proposal: props }),
          React.default.createElement(DocumentReviewProposal, {
            proposal: { ...props, review: { ...review, id: 'stale-review' } },
          }),
          React.default.createElement(WorkflowSessionPanel, {
            workflowId: entry.id,
            runId: session.id,
          }),
        ),
      );
    },
    `/@fs/${process.cwd().replaceAll('\\', '/')}`,
  );
  const proposals = page.getByRole('region', { name: 'Document review proposal', exact: true });
  const execution = page.getByRole('region', { name: 'Workflow execution' });
  await expect(execution).toContainText('No interpretation recorded');
  await proposals
    .first()
    .getByRole('button', { name: 'Save interpretation notes', exact: true })
    .click();
  await expect(
    execution.getByRole('region', { name: 'Document interpretation', exact: true }),
  ).toContainText('Northwind Synthetic Ltd.');
  await proposals
    .last()
    .getByRole('button', { name: 'Save interpretation notes', exact: true })
    .click();
  await expect(proposals.last().getByRole('alert')).toContainText('The run changed');
  await page.reload();
  const saved = await page.evaluate(async () => {
    const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
    return readWorkflowLibrary()['custom:review-ui'].sessions![0];
  });
  expect(saved.documentReviews).toHaveLength(1);
  expect(saved.documentReviews![0].draft.observations[0].citations[0].quote).toBe(
    'Northwind Synthetic Ltd.',
  );
  expect(saved.results).toEqual({});
  expect(saved.approvedAt).toBeUndefined();
});

test('guided run shares exact progress with Chat and preserves source revisions on reload', async ({
  page,
}) => {
  await page.route('**/api/chat/threads**', (route) => route.fulfill({ json: { threads: [] } }));
  await openDocumentCalculationFixture(page);
  await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  await page.getByRole('button', { name: 'Start guided workflow', exact: true }).click();
  let panel = page.getByRole('region', { name: 'Workflow execution' });
  // section uses its accessible name and is the same component in both surfaces.
  const read = () =>
    page.evaluate(async () => {
      const { readWorkflowLibrary } =
        await import('/src/features/workflows-hub/workflow-library.ts');
      const entry = Object.values(readWorkflowLibrary()).find((item) => item.sessions?.length)!;
      return { id: entry.id, version: entry.versions[0], run: entry.sessions!.at(-1)! };
    });
  const original = await read();
  await attachSessionWorkbook(page, panel, 'records.xlsx', 200);
  await expect.poll(async () => (await read()).run.sources.length).toBe(1);
  await panel.getByRole('button', { name: 'Resume workflow', exact: true }).click();
  await expect(panel.getByRole('button', { name: 'Approve completed results' })).toBeEnabled();
  expect(
    Object.values((await read()).run.results).find((result) => result.output.calculatedResults)
      ?.output.calculatedResults,
  ).toEqual({ RESULT: 400 });
  const runSteps = await panel.getByRole('list', { name: 'Execution steps' }).innerText();
  await panel.getByRole('button', { name: 'Continue in Chat' }).click();
  await expect(page.getByRole('button', { name: 'Chat', exact: true })).toBeVisible();
  // The workspace retains its Run view behind the expanded Chat surface.
  panel = page.getByRole('region', { name: 'Workflow execution' }).last();
  await expect(panel).toBeVisible();
  expect(await panel.getByRole('list', { name: 'Execution steps' }).innerText()).toEqual(runSteps);
  await expect(
    page.getByRole('textbox', { name: 'Ask Scope, or describe a task…' }),
  ).toBeEditable();
  expect((await read()).run.id).toBe(original.run.id);
  await panel.getByRole('combobox', { name: 'Source action' }).selectOption('add');
  await attachSessionWorkbook(page, panel, 'additional.xlsx', 50);
  await expect.poll(async () => (await read()).run.sources.length).toBe(2);
  await expect(panel.getByRole('button', { name: 'Approve completed results' })).toBeDisabled();
  await expect(panel.getByRole('list', { name: 'Execution steps' })).toContainText('outdated');
  await panel.getByRole('button', { name: 'Resume workflow', exact: true }).click();
  await expect.poll(async () => (await read()).run.paused, { timeout: 30000 }).toBe(true);
  await expect(panel.getByRole('button', { name: 'Approve completed results' })).toBeEnabled();
  expect(
    Object.values((await read()).run.results).find((result) => result.output.calculatedResults)
      ?.output.calculatedResults,
  ).toEqual({ RESULT: 500 });
  await panel.getByRole('button', { name: 'Approve completed results' }).click();
  await expect(panel).toContainText('Completed — approved');
  const savedRunLink = await panel
    .getByRole('link', { name: 'Open this workflow in Run' })
    .getAttribute('href');
  await panel.getByRole('link', { name: 'Open this workflow in Run' }).click();
  await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  await page.reload();
  await expect(
    page.getByRole('textbox', { name: 'Ask Scope, or describe a task…' }),
  ).toBeEditable();
  await page.goto(savedRunLink!);
  await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  await expect(page.getByRole('region', { name: 'Workflow execution' }).first()).toContainText(
    'Completed — approved',
  );
  const restored = await read();
  expect(restored.run.id).toBe(original.run.id);
  expect(restored.version).toEqual(original.version);
  expect(restored.run.sources).toHaveLength(2);
  expect(restored.run.attempts.length).toBeGreaterThan(original.run.attempts.length);
});

test('document evidence follows the exact run from upload to Chat and Build', async ({ page }) => {
  const bytes = readFileSync('e2e/fixtures/demo/sales-check.pdf');
  const contentHash = `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
  await page.route('**/api/chat/threads**', (route) => route.fulfill({ json: { threads: [] } }));
  await page.route('**/api/documents/upload-url', (route) =>
    route.fulfill({ status: 503, json: { error: 'STORAGE_NOT_CONFIGURED' } }),
  );
  await page.route('**/api/workflow-extract', (route) =>
    route.fulfill({
      json: {
        needsOcr: false,
        extraction: {
          id: 'captured-pdf',
          revision: 1,
          fileName: 'sales-check.pdf',
          contentHash,
          extractedAt: '2026-09-29T12:00:00.000Z',
          method: 'pdf_text',
          rows: [],
          segments: [
            {
              id: 'page-1',
              location: 'Page 1',
              page: 1,
              text: 'Synthetic document evidence: Revenue CAD 120.',
            },
          ],
          issues: [{ code: 'TEXT_ONLY', message: 'No table structure inferred.' }],
        },
      },
    }),
  );
  const backup = JSON.parse(
    readFileSync('tests/fixtures/backups/document-calculation-v1.json', 'utf8'),
  ).library;
  const original = backup['custom:synthetic-document-calculation'].draft;
  const base = original.blocks[0];
  const id = 'custom:document-evidence';
  const draft = {
    ...original,
    id,
    name: 'Document evidence fixture',
    blocks: [
      {
        ...base,
        id: 'document',
        label: 'Document evidence source',
        family: 'Source',
        subtype: 'PDF / Document',
        config: { sourceKind: 'pdf_document', toolId: 'source.pdf_document' },
      },
    ],
    edges: [],
  };
  await page.goto('/w/pf-fapi');
  await page.getByLabel('Workflow storage status').click();
  await page.getByLabel('Import workflow backup').setInputFiles({
    name: 'evidence.json',
    mimeType: 'application/json',
    buffer: Buffer.from(
      JSON.stringify({ [id]: { id, templateId: 'custom', draft, versions: [], runs: [] } }),
    ),
  });
  const imported = page.getByRole('button', {
    name: 'Document evidence fixture — Imported',
    exact: true,
  });
  await expect(imported).toBeVisible();
  await page.getByLabel('Workflow storage status').click();
  await imported.click();
  await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  await page.getByRole('button', { name: 'Start guided workflow', exact: true }).click();
  let panel = page.getByRole('region', { name: 'Workflow execution' }).first();
  await panel
    .getByLabel('Upload run source')
    .setInputFiles({ name: 'sales-check.pdf', mimeType: 'application/pdf', buffer: bytes });
  await expect(panel).toContainText('sales-check.pdf · 0 records');
  await panel.getByRole('button', { name: 'Resume workflow', exact: true }).click();
  await panel.locator('summary').filter({ hasText: 'Document evidence source' }).first().click();
  await expect(panel.getByRole('region', { name: 'Document evidence', exact: true })).toContainText(
    'source revision 1',
  );
  await panel.getByRole('button', { name: 'Continue in Chat', exact: true }).click();
  panel = page.getByRole('region', { name: 'Workflow execution' }).last();
  await panel.locator('summary').filter({ hasText: 'Document evidence source' }).first().click();
  const evidence = panel.getByRole('region', { name: 'Document evidence', exact: true });
  await evidence.locator('summary', { hasText: 'Page 1' }).click();
  await expect(evidence).toContainText('Revenue CAD 120');
  await expect(evidence).toContainText('Original file not confirmed saved');
  await panel.getByRole('button', { name: 'Verify this block in Build' }).click();
  const inspector = page.getByRole('region', { name: 'Run verification in Build' });
  await expect(inspector).toBeVisible();
  const recorded = inspector
    .getByRole('region', { name: 'Document evidence', exact: true })
    .first();
  await recorded.locator('summary', { hasText: 'Page 1' }).click();
  await expect(recorded).toContainText('Revenue CAD 120');
  await expect(recorded).toContainText('source revision 1');
});
