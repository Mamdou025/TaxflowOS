import { createServer } from 'node:http';
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
  const runSteps = await panel
    .locator('ol[aria-label="Execution steps"] > li > details > summary')
    .allTextContents();
  await panel.getByRole('button', { name: 'Continue in Chat' }).click();
  await expect(page.getByRole('button', { name: 'Chat', exact: true })).toBeVisible();
  // The workspace retains its Run view behind the expanded Chat surface.
  panel = page.getByRole('region', { name: 'Workflow execution' }).last();
  await expect(panel).toBeVisible();
  await expect(panel.getByRole('list', { name: 'Execution steps' })).toHaveCount(1);
  await expect(panel.getByRole('list', { name: 'Workflow progress' })).toHaveCount(0);
  expect(await panel.locator('[data-step-toggle]').allTextContents()).toEqual(runSteps);
  await expect(panel.locator('[data-step-toggle][aria-expanded="true"]')).toHaveCount(0);
  await expect(
    page.getByRole('textbox', { name: 'Ask Scope, or describe a task…' }),
  ).toBeEditable();
  expect((await read()).run.id).toBe(original.run.id);
  await panel.locator('[data-step-id="pf-document-calculator--document"]').click();
  await panel.getByRole('combobox', { name: 'Source action' }).selectOption('add');
  await attachSessionWorkbook(page, panel, 'additional.xlsx', 50);
  await expect.poll(async () => (await read()).run.sources.length).toBe(2);
  await expect(panel.getByRole('button', { name: 'Approve completed results' })).toBeDisabled();
  await expect(panel.getByRole('list', { name: 'Execution steps' })).toContainText('outdated');
  await panel.getByRole('button', { name: 'Collapse all steps' }).click();
  await expect(panel.locator('[data-step-toggle][aria-expanded="true"]')).toHaveCount(0);
  await expect(panel.getByRole('button', { name: 'Resume workflow', exact: true })).toBeEnabled();
  await panel.getByRole('button', { name: 'Resume workflow', exact: true }).click();
  await expect.poll(async () => (await read()).run.paused, { timeout: 30000 }).toBe(true);
  await expect(panel.getByRole('button', { name: 'Approve completed results' })).toBeEnabled();
  await expect(panel.locator('[data-step-toggle][aria-expanded="true"]')).toHaveCount(0);
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
      {
        ...base,
        id: 'other-document',
        label: 'Other document',
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
  await panel.getByRole('combobox', { name: 'Run source block' }).selectOption('document');
  await panel
    .getByLabel('Upload run source')
    .setInputFiles({ name: 'sales-check.pdf', mimeType: 'application/pdf', buffer: bytes });
  await expect(panel).toContainText('sales-check.pdf · 0 records');
  await panel.getByRole('combobox', { name: 'Run source block' }).selectOption('other-document');
  await attachSessionWorkbook(page, panel, 'other-records.xlsx', 10);
  await expect(panel).toContainText('other-records.xlsx · 1 records');
  await panel.getByRole('button', { name: 'Resume workflow', exact: true }).click();
  await expect(panel.getByRole('button', { name: 'Approve completed results' })).toBeEnabled();
  await panel.locator('summary').filter({ hasText: 'Document evidence source' }).first().click();
  await expect(panel.getByRole('region', { name: 'Document evidence', exact: true })).toContainText(
    'source revision 1',
  );
  await panel.getByRole('button', { name: 'Continue in Chat', exact: true }).click();
  panel = page.getByRole('region', { name: 'Workflow execution' }).last();
  await panel.locator('[data-step-id="other-document"]').click();
  const otherDocument = panel.getByRole('region', { name: 'Step 2: Other document' });
  await expect(otherDocument.getByLabel('Upload run source')).toBeVisible();
  await expect(otherDocument).toContainText('other-records.xlsx · 1 records');
  await expect(otherDocument).not.toContainText('sales-check.pdf');
  await panel.locator('[data-step-id="document"]').click();
  await expect(
    panel.getByRole('region', { name: 'Step 1: Document evidence source' }),
  ).toContainText('sales-check.pdf · 0 records');
  await expect(
    panel.getByRole('region', { name: 'Step 1: Document evidence source' }),
  ).not.toContainText('other-records.xlsx');
  const evidence = panel.getByRole('region', { name: 'Document evidence', exact: true });
  await evidence.locator('summary', { hasText: 'Page 1' }).click();
  await expect(evidence).toContainText('Revenue CAD 120');
  await expect(evidence).toContainText('Original file not confirmed saved');
  const currentRunLink = await panel
    .getByRole('link', { name: 'Open this workflow in Run' })
    .getAttribute('href');
  const currentWorkflowId = decodeURIComponent(
    new URL(currentRunLink!, page.url()).pathname.split('/').at(-1)!,
  );
  const beforeInspection = await page.evaluate(async (workflowId) => {
    const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
    return readWorkflowLibrary()[workflowId];
  }, currentWorkflowId);
  expect(beforeInspection).toBeDefined();
  await panel.getByRole('button', { name: 'Verify this block in Build' }).click();
  const inspector = page.getByRole('region', { name: 'Run verification in Build' });
  await expect(inspector).toBeVisible();
  await expect(inspector.getByTestId('workflow-canvas')).toBeVisible();
  await expect(inspector.locator('.react-flow__node-action')).toHaveCount(2);
  await expect(page.getByRole('button', { name: 'Test block', exact: true })).toHaveCount(0);
  await expect(page.getByLabel('Verify block', { exact: true })).toHaveValue('document');
  const recorded = page
    .getByRole('article', { name: 'Block verification', exact: true })
    .getByRole('region', { name: 'Document evidence', exact: true })
    .first();
  await recorded.locator('summary', { hasText: 'Page 1' }).click();
  await expect(recorded).toContainText('Revenue CAD 120');
  await expect(recorded).toContainText('source revision 1');
  const afterInspection = await page.evaluate(async (workflowId) => {
    const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
    return readWorkflowLibrary()[workflowId];
  }, currentWorkflowId);
  expect(afterInspection).toEqual(beforeInspection);
});

test('inline chat workflow restores its exact run without execution or latest-run substitution', async ({
  page,
}) => {
  const saved = new Map<
    string,
    { messages: { id: string; role: string; seq: number; content: Record<string, unknown> }[] }
  >();
  let requests = 0;
  await page.route('**/api/copilotkit**', async (route) => {
    const data = route.request().method() === 'POST' ? route.request().postDataJSON() : null;
    if (data?.method === 'agent/run') requests++;
    return route.fulfill({
      json: {
        version: '1.63.2',
        mode: 'sse',
        agents: {
          default: { name: 'default', description: 'Synthetic test', className: 'FixtureAgent' },
        },
        audioFileTranscriptionEnabled: false,
        suggestions: false,
        telemetryDisabled: true,
        threadEndpoints: { list: false, inspect: false, mutations: false, realtimeMetadata: false },
      },
    });
  });
  await page.route('**/api/chat/threads**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    const id = path.split('/')[4];
    if (route.request().method() === 'POST') {
      saved.set(id, route.request().postDataJSON());
      return route.fulfill({ json: { ok: true } });
    }
    if (!id)
      return route.fulfill({
        json: {
          threads: [...saved.keys()].map((id) => ({
            id,
            title: 'Bound workflow chat',
            updatedAt: new Date().toISOString(),
          })),
        },
      });
    return route.fulfill({ json: saved.get(id) ?? { messages: [] } });
  });
  await openDocumentCalculationFixture(page);
  await page.getByRole('button', { name: 'Run', exact: true }).first().click();
  await page.getByRole('button', { name: 'Start guided workflow', exact: true }).click();
  const original = await page
    .getByRole('region', { name: 'Workflow execution' })
    .locator('header p')
    .first()
    .innerText();
  await page.getByRole('button', { name: 'Continue in Chat', exact: true }).click();
  const side = page.getByRole('region', { name: 'Workflow in chat' });
  await expect(page.locator('.chat-work-side')).toHaveCount(0);
  await expect(side.getByLabel('Upload run source')).toBeVisible();
  await expect(side).toContainText(original);
  await expect.poll(() => saved.size).toBe(1);
  const chatId = [...saved.keys()][0];
  const binding = saved.get(chatId)!.messages[0].content.workflowBinding as {
    workflowId: string;
    runId: string;
  };
  expect(binding.runId).toBeTruthy();
  await page.getByRole('button', { name: 'New chat', exact: true }).click();
  await expect(side).toHaveCount(0);
  // Add a newer session to the local backup. Reopening must still resolve the older ID.
  await page.evaluate(async (binding) => {
    const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
    const { workspaceStorage } = await import('/src/platform/auth/workspace-context.ts');
    const { stringifySharedJSON } = await import('/src/shared/workflow-engine/shared-json.ts');
    const library = readWorkflowLibrary();
    const entry = library[binding.workflowId];
    const old = entry.sessions!.find((s) => s.id === binding.runId)!;
    entry.sessions!.push({ ...structuredClone(old), id: 'newer-run' });
    workspaceStorage.setItem('taxflow:workflow-library:v1', stringifySharedJSON(library));
  }, binding);
  await page.reload();
  await page.getByTitle('Bound workflow chat', { exact: true }).click();
  await expect(side).toContainText(original);
  await page.reload();
  await expect(side).toContainText(original);
  await expect(side).not.toContainText('newer-run');
  expect(requests).toBe(0);
  const attempts = await page.evaluate(async () => {
    const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts');
    return Object.values(readWorkflowLibrary())
      .flatMap((w) => w.sessions ?? [])
      .map((s) => s.attempts.length);
  });
  expect(attempts).toEqual([0, 0]);
  await page.screenshot({ path: test.info().outputPath('chat-work-thread.png'), fullPage: true });
  // Missing historical run must not be replaced by the newer session.
  await page.getByRole('button', { name: 'New chat', exact: true }).click();
  await expect(side).toHaveCount(0);
  saved.get(chatId)!.messages[0].content.workflowBinding = { ...binding, runId: 'missing-run' };
  await page.getByTitle('Bound workflow chat', { exact: true }).click();
  await expect(side).toContainText('This exact run is unavailable. No other run was selected.');
});

test('inline Chat reuses manual inputs, recalculates current work, retains history and enforces End', async ({
  page,
}) => {
  await page.route('**/api/agent-actions/grants', (route) =>
    route.fulfill({ json: { grant: { id: 'one-time' } } }),
  );
  await page.route('**/api/agent-actions/operations/authorize', (route) =>
    route.fulfill({ json: { allowed: true, authorization: {}, operationStatus: 'allowed' } }),
  );
  await page.route('**/api/agent-actions/operations/*/outcome', (route) =>
    route.fulfill({ json: { ok: true } }),
  );
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
      const { startSession } = await import(
        `${rootPath}/lib/workflow-core/src/application/sessions.ts`
      );
      const { workflowLibraryAtom } =
        await import('/src/features/workflows-hub/workflow-library.ts');
      const { chatSessionAtom } =
        await import('/src/features/workflows-hub/workflow-session-store.ts');
      const { SessionActionReview, proposalsAtom } =
        await import('/src/features/assistant/ui/use-session-tools.tsx');
      const { workspaceContext } = await import('/src/platform/auth/workspace-context.ts');
      const { ChatWorkflowThread } =
        await import('/src/features/assistant/ui/chat-workflow-thread.tsx');
      const { WorkMenu } = await import('/src/features/assistant/ui/work-menu.tsx');
      const { DOCUMENT_CALCULATOR_CONFIG } =
        await import('/src/shared/workflow-engine/runtime/workflow-runs/document-calculator.ts');
      const definition = DOCUMENT_CALCULATOR_CONFIG.buildSnapshot();
      const source = definition.blocks.find((block) => block.family === 'Source')!;
      source.id = 'amount';
      source.label = 'Amount';
      source.subtype = 'Manual Entry';
      source.config = { toolId: 'source.manual_value', sourceKind: 'manual_value', value: 200 };
      definition.blocks = [
        source,
        { ...source, id: 'reference', label: 'Reference', config: { ...source.config, value: 10 } },
      ];
      definition.edges = [];
      const entry = startSession(
        saveVersion(createWorkflow('custom:inputs-ui', 'blank', definition)),
        1,
        'inputs-ui',
        '2026-10-02T12:00:00.000Z',
      );
      const store = createStore();
      store.set(workflowLibraryAtom, { [entry.id]: entry });
      store.set(chatSessionAtom, { workflowId: entry.id, runId: 'inputs-ui' });
      store.set(proposalsAtom, {
        'proposed-input': {
          ref: { workflowId: entry.id, runId: 'inputs-ui' },
          revision: 0,
          workspaceId: workspaceContext!.workspace.id,
          action: { kind: 'inputs', blockId: 'amount', patch: { value: 225 } },
          before: { value: 200 },
          request: {
            operationId: 'proposed-input',
            agentId: 'sina',
            capability: 'workflow:execute',
            resourceType: 'workflow',
            resourceId: entry.id,
            resourceRevision: 'session:inputs-ui:0',
            requestFingerprint: 'test',
          },
        },
      });
      const root = document.createElement('div');
      document.body.replaceChildren(root);
      createRoot(root).render(
        React.default.createElement(
          Provider,
          { store },
          React.default.createElement(SessionActionReview, { operationId: 'proposed-input' }),
          React.default.createElement(WorkMenu, { onOpen: () => {} }),
          React.default.createElement(ChatWorkflowThread),
        ),
      );
    },
    `/@fs/${process.cwd().replaceAll('\\', '/')}`,
  );
  const card = page.getByRole('region', { name: 'Workflow in chat' });
  const read = () =>
    page.evaluate(async () => {
      const { readWorkflowLibrary } =
        await import('/src/features/workflows-hub/workflow-library.ts');
      return readWorkflowLibrary()['custom:inputs-ui'];
    });
  await expect(card.getByRole('list', { name: 'Execution steps' })).toHaveCount(1);
  await expect(card.getByRole('list', { name: 'Workflow progress' })).toHaveCount(0);
  await expect(card.getByRole('combobox', { name: 'Chat input block' })).toHaveCount(0);
  await expect(card.locator('[data-step-toggle][aria-expanded="true"]')).toHaveCount(0);
  await expect(card.getByRole('button', { name: 'Resume workflow' })).toBeEnabled();
  const openingUrl = page.url();
  const beforeBrowsing = await read();
  await card.locator('[data-step-id="amount"]').click();
  const amount = card.getByRole('region', { name: 'Step 1: Amount' });
  const reference = card.getByRole('region', { name: 'Step 2: Reference' });
  await expect(amount.getByPlaceholder('e.g. 1.3978')).toHaveValue('200');
  await expect(amount.getByPlaceholder('none', { exact: true })).toBeEditable();
  await expect(amount.getByPlaceholder('Amount', { exact: true })).toBeEditable();
  await amount.getByPlaceholder('e.g. 1.3978').fill('251');
  await card.getByRole('button', { name: 'Collapse all steps' }).click();
  await expect(card.getByRole('region', { name: /^Inputs for / })).toHaveCount(0);
  await card.locator('[data-step-id="reference"]').click();
  await expect(reference.getByPlaceholder('e.g. 1.3978')).toHaveValue('10');
  await card.locator('[data-step-id="amount"]').click();
  await expect(amount.getByPlaceholder('e.g. 1.3978')).toHaveValue('251');
  await expect(card.getByRole('region', { name: /^Inputs for / })).toHaveCount(1);
  expect(page.url()).toBe(openingUrl);
  expect(await read()).toEqual(beforeBrowsing);
  expect((await read()).sessions![0].results).toEqual({});
  expect((await read()).sessions![0].inputOverrides).toBeUndefined();
  await page.getByRole('button', { name: 'Approve workflow action', exact: true }).click();
  await expect.poll(async () => (await read()).runs.length).toBe(1);
  const original = await read();
  await expect(amount.getByPlaceholder('e.g. 1.3978')).toHaveValue('251');
  await expect(amount.getByRole('alert')).toContainText('This bloc’s inputs changed');
  await expect(amount.getByRole('button', { name: 'Apply inputs & recalculate' })).toBeDisabled();
  await amount.getByRole('button', { name: 'Review my edits on latest inputs' }).click();
  await expect(amount.getByRole('alert')).toHaveCount(0);
  await expect(amount.getByRole('button', { name: 'Apply inputs & recalculate' })).toBeEnabled();
  expect(await read()).toEqual(original);
  await expect(page.getByTestId('work-menu')).toContainText('Completed');
  await amount.getByPlaceholder('e.g. 1.3978').fill('');
  await amount.getByRole('button', { name: 'Apply inputs & recalculate' }).click();
  await expect(amount.getByRole('alert')).toBeVisible();
  expect((await read()).sessions![0].results.amount.output.value).toBe(225);
  expect((await read()).runs).toHaveLength(1);
  await amount.getByPlaceholder('e.g. 1.3978').fill('250');
  await card.locator('[data-step-id="reference"]').click();
  await reference.getByPlaceholder('e.g. 1.3978').fill('11');
  await reference.getByRole('button', { name: 'Apply inputs & recalculate' }).click();
  await expect.poll(async () => (await read()).runs.length).toBe(2);
  await card.locator('[data-step-id="amount"]').click();
  await expect(amount.getByPlaceholder('e.g. 1.3978')).toHaveValue('250');
  await expect(
    amount.getByRole('button', { name: 'Review my edits on latest inputs' }),
  ).toHaveCount(0);
  await expect(amount.getByRole('button', { name: 'Apply inputs & recalculate' })).toBeEnabled();
  await amount.getByPlaceholder('none', { exact: true }).fill('CAD');
  await amount.getByPlaceholder('Amount', { exact: true }).fill('Reviewed amount');
  expect((await read()).sessions![0].results.amount.output.value).toBe(225);
  await amount.getByRole('button', { name: 'Apply inputs & recalculate' }).click();
  await expect.poll(async () => (await read()).runs.length).toBe(3);
  const changed = await read();
  expect(changed.sessions![0].results.amount.output.value).toBe(250);
  expect(changed.sessions![0].inputOverrides?.amount).toMatchObject({
    value: 250,
    unit: 'CAD',
    valueLabel: 'Reviewed amount',
  });
  expect(changed.runs[0]).toEqual(original.runs[0]);
  expect(changed.versions).toEqual(original.versions);
  expect(changed.draft).toEqual(original.draft);
  await card.getByRole('button', { name: 'End workflow', exact: true }).click();
  await expect(card).toContainText('Ended — history retained');
  await expect(page.getByTestId('work-menu')).toContainText('Ended');
  await expect(card.getByRole('button', { name: 'Resume workflow' })).toBeDisabled();
  await expect(amount.getByPlaceholder('e.g. 1.3978')).toBeDisabled();
  await page.screenshot({ path: test.info().outputPath('inline-workflow.png'), fullPage: true });
});

test('a follow-up interrupts the model reply without resetting the conversation', async ({
  page,
}) => {
  let calls = 0;
  const streamServer = createServer((request, response) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {
      const payload = JSON.parse(body);
      const input = payload.body ?? payload;
      response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
      });
      response.write(
        `data: ${JSON.stringify({ type: 'RUN_STARTED', threadId: input.threadId, runId: input.runId })}\n\n`,
      );
      response.write(
        `data: ${JSON.stringify({ type: 'TEXT_MESSAGE_START', messageId: 'partial-reply', role: 'assistant' })}\n\n`,
      );
      response.write(
        `data: ${JSON.stringify({ type: 'TEXT_MESSAGE_CONTENT', messageId: 'partial-reply', delta: 'Let me explain…' })}\n\n`,
      );
      // Keep the stream open until the actual browser aborts it.
    });
  });
  await new Promise<void>((resolve) => streamServer.listen(0, '127.0.0.1', resolve));
  const streamAddress = streamServer.address();
  if (!streamAddress || typeof streamAddress === 'string') throw new Error('No stream port.');
  await page.route('**/api/copilotkit**', async (route) => {
    const data = route.request().postDataJSON();
    if (data?.method === 'info' || route.request().method() === 'GET')
      return route.fulfill({
        json: {
          version: '1.63.2',
          mode: 'sse',
          agents: {
            default: { name: 'default', description: 'Synthetic', className: 'FixtureAgent' },
          },
          audioFileTranscriptionEnabled: false,
          suggestions: false,
          telemetryDisabled: true,
          threadEndpoints: {
            list: false,
            inspect: false,
            mutations: false,
            realtimeMetadata: false,
          },
        },
      });
    if (data?.method !== 'agent/run')
      return route.fulfill({ contentType: 'text/event-stream', body: '' });
    calls++;
    if (calls === 1) return route.continue({ url: `http://127.0.0.1:${streamAddress.port}/` });
    const input = data.body ?? data;
    const events = [
      { type: 'RUN_STARTED', threadId: input.threadId, runId: input.runId },
      { type: 'TEXT_MESSAGE_START', messageId: 'followup-reply', role: 'assistant' },
      { type: 'TEXT_MESSAGE_CONTENT', messageId: 'followup-reply', delta: 'Follow-up received.' },
      { type: 'TEXT_MESSAGE_END', messageId: 'followup-reply' },
      { type: 'RUN_FINISHED', threadId: input.threadId, runId: input.runId },
    ];
    return route.fulfill({
      contentType: 'text/event-stream',
      body: events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join(''),
    });
  });
  await page.route('**/api/chat/threads**', (route) =>
    route.fulfill({ json: route.request().method() === 'GET' ? { threads: [] } : { ok: true } }),
  );
  try {
    await page.goto('/');
    // Set the agent explicitly before opening the synthetic stream.
    await page.getByRole('button', { name: 'Chat agent: Sina', exact: true }).click();
    await page.getByRole('menuitemradio', { name: 'MicroSina · Foundry', exact: true }).click();
    await page.getByRole('button', { name: 'Chat agent: MicroSina', exact: true }).click();
    await page.getByRole('menuitemradio', { name: 'Sina · Tax specialist', exact: true }).click();
    const composer = page.getByRole('textbox', { name: 'Ask Scope, or describe a task…' });
    await composer.fill('Explain this calculation.');
    await expect(page.getByRole('button', { name: 'Send', exact: true })).toBeEnabled();
    await page.getByRole('button', { name: 'Send', exact: true }).click();
    await expect.poll(() => calls).toBe(1);
    await expect(page.getByText('Let me explain…', { exact: true })).toBeVisible();
    await composer.fill('First, explain the exchange rate.');
    await expect(page.getByRole('button', { name: 'Interrupt reply and send' })).toBeEnabled();
    await composer.press('Enter');
    await expect.poll(() => calls).toBe(2);
    await expect(page.getByText('Follow-up received.', { exact: true })).toBeVisible();
    await expect(page.getByText('Explain this calculation.', { exact: true })).toBeVisible();
    await expect(
      page.getByText('First, explain the exchange rate.', { exact: true }),
    ).toBeVisible();
  } finally {
    streamServer.closeAllConnections();
    await new Promise<void>((resolve) => streamServer.close(() => resolve()));
  }
});
