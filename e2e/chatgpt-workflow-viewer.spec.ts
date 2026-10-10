import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

type HostRequest = {
  method: string;
  params?: {
    name?: string;
    arguments?: Record<string, unknown>;
    content?: { type: string; text?: string }[];
  };
};
type TestHost = Window & {
  received: HostRequest[];
  sendResult: (value: unknown) => void;
  rejectMessages: boolean;
  refreshResult: unknown;
  toolResults: Record<string, unknown>;
  holdTools: boolean;
  pendingTools: { id: string | number; target: Window }[];
  replyTool: (index: number, value: unknown) => void;
};
const backup = JSON.parse(
  readFileSync('tests/fixtures/backups/document-calculation-v1.json', 'utf8'),
);
const definition = backup.library['custom:synthetic-document-calculation'].draft;
const calculationId = 'pf-document-calculator--calculate';
const calculation = definition.blocks.find((block: { id: string }) => block.id === calculationId);
const savedView = {
  schemaVersion: 'inscope-workflow-view-v1',
  kind: 'workflow-version',
  workspace: { id: 'workspace-test', name: 'Viewer test workspace' },
  workflowId: 'custom:synthetic-document-calculation',
  version: 3,
  definition,
  statuses: {},
  capturedAt: '2026-10-07T12:00:00.000Z',
};
const toolResult = (inscope: unknown) => ({
  content: [{ type: 'text', text: 'Saved workflow available.' }],
  structuredContent: { ok: true },
  _meta: { inscope },
});
const recordedResult = (id = calculationId, status = 'success') => ({
  runId: 'saved-run-17',
  blockId: id,
  toolId: 'logic.calculation_engine',
  status,
  input: { amount: 200 },
  output: { calculatedResults: { RESULT: 400 } },
  logs: [],
  warnings: status === 'warning' ? ['Recorded warning'] : [],
  errors: status === 'error' ? ['Recorded error'] : [],
  evidenceRefs: [],
  sourceTrace: [],
  startedAt: savedView.capturedAt,
  completedAt: savedView.capturedAt,
});
const runView = {
  ...savedView,
  kind: 'workflow-run',
  runId: 'saved-run-17',
  selectedBlockId: calculationId,
  statuses: { [calculationId]: 'success' },
  inspection: {
    workflowId: savedView.workflowId,
    runId: 'saved-run-17',
    version: 3,
    revision: 2,
    results: { [calculationId]: recordedResult() },
  },
};
const documentBlock = definition.blocks.find((block: { config: { sourceKind?: string } }) =>
  /excel|workbook|uploaded|manual_table|pdf_document/.test(block.config.sourceKind ?? ''),
);
const editableView = {
  ...runView,
  libraryRevision: 10,
  capabilities: { write: true, execute: true },
  inspection: {
    ...runView.inspection,
    kind: 'session',
    paused: true,
    stale: [],
    reviewed: [],
    inputOverrides: {},
    steps: definition.blocks.map((block: { id: string; label: string; family: string }) => ({
      id: block.id,
      label: block.label,
      family: block.family,
      status: block.id === calculationId ? 'success' : 'pending',
      dependencies: [],
      ready: true,
      inputRequired: false,
      inputKeys: block.id === calculationId ? ['inputChoices', 'inputValues'] : [],
      ...(block.id === calculationId
        ? {
            inputRequirements: [
              {
                name: 'AMOUNT',
                label: 'Amount',
                type: 'number',
                status: 'provided',
                origin: 'manual',
                value: 200,
              },
            ],
          }
        : {}),
    })),
    sourceSummaries: [
      {
        id: 'source-old',
        blockId: documentBlock.id,
        name: 'Original trial balance.xlsx',
        at: savedView.capturedAt,
        mode: 'replace',
        active: true,
        rowCount: 30,
        previewRows: [{ account: '1000', amount: 200 }],
      },
    ],
    changeHistory: [],
    attemptSummaries: [
      { at: savedView.capturedAt, revision: 2, blockId: calculationId, status: 'success' },
    ],
  },
};
const reviewData = {
  reviewToken: 'test-review-token',
  workflowId: savedView.workflowId,
  runId: 'saved-run-17',
  revision: 2,
  libraryRevision: 10,
  expiresAt: '2099-01-01T00:00:00.000Z',
  changes: [{ field: 'inputChoices.AMOUNT', before: 200, after: 0 }],
  affectedBlockIds: [calculationId],
  approvalInvalidated: false,
};
const dataResult = (structuredContent: unknown) => ({ content: [], structuredContent });

async function openHost(page: Page, snapshot: unknown) {
  const unexpectedRequests: string[] = [];
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1' && ['/', '/chatgpt.html'].includes(url.pathname))
      return route.continue();
    unexpectedRequests.push(`${route.request().method()} ${url.pathname}`);
    return route.abort();
  });
  await page.addInitScript((initialResult) => {
    if (window.parent !== window) return;
    const host = window as TestHost;
    host.received = [];
    host.rejectMessages = false;
    host.holdTools = false;
    host.pendingTools = [];
    host.refreshResult = initialResult;
    host.toolResults = {};
    host.replyTool = (index, result) => {
      const pending = host.pendingTools[index];
      pending.target.postMessage(
        { jsonrpc: '2.0', id: pending.id, result },
        window.location.origin,
      );
    };
    host.sendResult = (value) =>
      document
        .querySelector('iframe')
        ?.contentWindow?.postMessage(
          { jsonrpc: '2.0', method: 'ui/notifications/tool-result', params: value },
          window.location.origin,
        );
    window.addEventListener('message', (event) => {
      if (event.source !== document.querySelector('iframe')?.contentWindow) return;
      const message = event.data;
      if (message?.jsonrpc !== '2.0' || typeof message.method !== 'string') return;
      host.received.push(message);
      if (message.method === 'ui/notifications/initialized') {
        host.sendResult(initialResult);
        return;
      }
      if (message.id === undefined) return;
      if (message.method === 'tools/call' && host.holdTools) {
        host.pendingTools.push({ id: message.id, target: event.source as Window });
        return;
      }
      const result =
        message.method === 'ui/initialize'
          ? {
              protocolVersion: message.params.protocolVersion,
              hostInfo: { name: 'InScope test host', version: '1.0.0' },
              hostCapabilities: {
                updateModelContext: { text: {} },
                message: { text: {} },
                serverTools: {},
              },
              hostContext: {
                theme: 'light',
                displayMode: 'inline',
                availableDisplayModes: ['inline', 'fullscreen'],
              },
            }
          : message.method === 'tools/call'
            ? message.params.name === 'append_workflow_source'
              ? {
                  structuredContent: {
                    offset:
                      Number(message.params.arguments.offset) +
                      atob(message.params.arguments.base64).length,
                  },
                  content: [],
                }
              : (host.toolResults[message.params.name] ?? host.refreshResult)
            : message.method === 'ui/request-display-mode'
              ? { mode: message.params.mode }
              : message.method === 'ui/message' && host.rejectMessages
                ? { isError: true }
                : {};
      (event.source as Window).postMessage(
        { jsonrpc: '2.0', id: message.id, result },
        window.location.origin,
      );
    });
  }, toolResult(snapshot));
  await page.goto('/');
  const frame = page.frameLocator('iframe');
  await expect(frame.getByRole('list', { name: 'Workflow steps' })).toBeVisible();
  return { frame, unexpectedRequests, errors };
}
async function contexts(page: Page) {
  return page.evaluate(() =>
    (window as TestHost).received
      .filter((item) => item.method === 'ui/update-model-context')
      .map((item) => item.params?.content?.[0]?.text ?? ''),
  );
}
async function requests(page: Page, method: string) {
  return page.evaluate(
    (name) => (window as TestHost).received.filter((item) => item.method === name),
    method,
  );
}

test('steps are the compact default, details require selection and only Explain sends a message', async ({
  page,
}) => {
  await page.setViewportSize({ width: 900, height: 650 });
  const { frame, unexpectedRequests, errors } = await openHost(page, savedView);
  await expect(frame.getByTestId('workflow-canvas')).toHaveCount(0);
  await expect(frame.getByRole('dialog')).toHaveCount(0);
  await expect(frame.getByRole('listitem')).toHaveCount(definition.blocks.length);
  await expect(frame.getByLabel('Recorded workflow progress')).toContainText('No run selected');
  await expect(frame.getByRole('progressbar')).toHaveCount(0);
  await expect
    .poll(async () => (await contexts(page)).at(-1))
    .toContain('"status":"no_run_selected"');
  const step = frame.getByRole('button', { name: new RegExp(calculation.label) });
  await step.focus();
  await step.press('Enter');
  const details = frame.getByRole('region', { name: `Step details: ${calculation.label}` });
  await expect(details).toBeVisible();
  await expect
    .poll(async () => (await contexts(page)).at(-1))
    .toContain(`"selectedBlockId":"${calculationId}"`);
  expect(await requests(page, 'ui/message')).toEqual([]);
  await details.getByText('Saved configuration', { exact: true }).click();
  await expect(details.getByLabel('Saved configuration')).toBeVisible();
  await details.getByRole('button', { name: 'Explain this block', exact: true }).click();
  await expect.poll(async () => (await requests(page, 'ui/message')).length).toBe(1);
  expect((await requests(page, 'ui/message'))[0].params?.content?.[0]?.text).toContain(
    calculationId,
  );
  expect((await requests(page, 'ui/message'))[0].params?.content?.[0]?.text).toContain(
    '"version":3',
  );
  const before = await frame.locator('header').boundingBox();
  await frame.getByTestId('viewer-content').evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  const after = await frame.locator('header').boundingBox();
  expect(after?.y).toBe(before?.y);
  await frame.getByRole('button', { name: 'Expand', exact: true }).click();
  await expect.poll(async () => (await requests(page, 'ui/request-display-mode')).length).toBe(1);
  expect(page.context().pages()).toHaveLength(1);
  await step.click();
  await frame.getByTestId('viewer-content').evaluate((element) => {
    element.scrollTop = 0;
  });
  await page.screenshot({ path: 'test-results/chatgpt-viewer-steps.png', fullPage: true });
  expect(unexpectedRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test('run progress separates successful results, review, stale results and input readiness', async ({
  page,
}) => {
  const statuses = [
    'success',
    'warning',
    'reviewed',
    'outdated',
    'error',
    'needs_review',
    'skipped',
    'pending',
  ];
  const blocks = statuses.map((status, index) => ({
    ...calculation,
    id: `step-${index}`,
    label: `Recorded ${status}`,
    status: 'success',
    governance: {
      protected: false,
      steward: '',
      lockedInRuntime: false,
      requiresUnlockToEdit: false,
      approvalState: 'approved',
    },
  }));
  const graph = {
    ...definition,
    blocks,
    edges: [],
    structure: { ...definition.structure, blockOrder: blocks.map((block) => block.id) },
  };
  const results = Object.fromEntries(
    statuses
      .slice(0, -1)
      .map((status, index) => [
        `step-${index}`,
        recordedResult(
          `step-${index}`,
          status === 'reviewed' ? 'needs_review' : status === 'outdated' ? 'success' : status,
        ),
      ]),
  );
  const snapshot = {
    ...runView,
    definition: graph,
    selectedBlockId: 'step-0',
    statuses: Object.fromEntries(statuses.map((status, index) => [`step-${index}`, status])),
    inspection: {
      ...runView.inspection,
      kind: 'session',
      paused: true,
      results,
      steps: [...blocks].reverse().map((block) => ({
        id: block.id,
        label: block.label,
        family: block.family,
        status: statuses[Number(block.id.slice(5))],
        dependencies: [],
        ready: true,
        inputRequired: block.id === 'step-7',
      })),
    },
  };
  const { frame, errors } = await openHost(page, snapshot);
  await expect(frame.getByLabel('Recorded workflow progress')).toContainText(
    '2 of 8 successful results',
  );
  await expect(frame.getByLabel('Recorded workflow progress')).toContainText(
    '8 dependencies ready · 1 need input',
  );
  await expect(frame.getByLabel('Recorded workflow progress')).toContainText(
    '1 reviewed checkpoints',
  );
  await expect(frame.getByLabel('Recorded workflow progress')).toContainText(
    'Approval not recorded',
  );
  await expect(frame.getByRole('progressbar')).toHaveAttribute('value', '2');
  await expect(frame.getByRole('listitem').first()).toContainText('Recorded pending');
  await frame.getByRole('button', { name: /Recorded outdated/ }).click();
  await expect(
    frame.getByRole('region', { name: 'Step details: Recorded outdated' }),
  ).toContainText('excluded from successful current results');
  expect(errors).toEqual([]);
});

test('refresh reads the same exact run in place, preserves selection and sends no chat message', async ({
  page,
}) => {
  const { frame, unexpectedRequests, errors } = await openHost(page, runView);
  await frame.getByRole('button', { name: new RegExp(calculation.label) }).click();
  const updated = {
    ...runView,
    capturedAt: '2026-10-08T13:00:00.000Z',
    inspection: {
      ...runView.inspection,
      revision: 3,
      results: { [calculationId]: { ...recordedResult(), output: { RESULT: 800 } } },
    },
  };
  await page.evaluate((value) => {
    (window as TestHost).refreshResult = value;
  }, toolResult(updated));
  await frame.getByRole('button', { name: 'Refresh', exact: true }).click();
  await expect.poll(async () => (await contexts(page)).at(-1)).toContain('"revision":3');
  const calls = await requests(page, 'tools/call');
  expect(calls).toHaveLength(1);
  expect(calls[0].params).toMatchObject({
    name: 'inspect_workflow_run',
    arguments: { workflowId: savedView.workflowId, runId: 'saved-run-17', blockId: calculationId },
  });
  expect(await requests(page, 'ui/message')).toEqual([]);
  await frame.getByLabel('Selected block evidence').getByText('output', { exact: true }).click();
  await expect(frame.getByLabel('Selected block evidence')).toContainText('800');
  await expect(frame.getByRole('list', { name: 'Workflow steps' })).toHaveCount(1);
  expect(unexpectedRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test('late refresh cannot replace a newly opened workflow and exact definition refresh has no run fallback', async ({
  page,
}) => {
  const { frame, errors } = await openHost(page, savedView);
  await page.evaluate(() => {
    (window as TestHost).holdTools = true;
  });
  await frame.getByRole('button', { name: 'Refresh', exact: true }).click();
  await expect.poll(async () => (await requests(page, 'tools/call')).length).toBe(1);
  expect((await requests(page, 'tools/call'))[0].params).toMatchObject({
    name: 'get_workflow_version',
    arguments: { workflowId: savedView.workflowId, version: 3 },
  });
  const next = {
    ...savedView,
    version: 4,
    definition: { ...definition, name: 'New exact version' },
  };
  await page.evaluate((value) => (window as TestHost).sendResult(value), toolResult(next));
  await expect(frame.getByRole('heading', { name: 'New exact version' })).toBeVisible();
  await page.evaluate((value) => (window as TestHost).replyTool(0, value), toolResult(savedView));
  await expect.poll(async () => (await contexts(page)).at(-1)).toContain('"version":4');
  await expect(frame.getByRole('heading', { name: 'New exact version' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('refresh authorization errors and mismatched identities clear previous evidence and model context', async ({
  page,
}) => {
  const { frame, errors } = await openHost(page, runView);
  await page.evaluate(() => {
    (window as TestHost).refreshResult = {
      isError: true,
      content: [{ type: 'text', text: 'Authorization expired' }],
    };
  });
  await frame.getByRole('button', { name: 'Refresh', exact: true }).click();
  await expect(frame.getByRole('list', { name: 'Workflow steps' })).toHaveCount(0);
  await expect(frame.getByRole('alert')).toContainText('previous snapshot was cleared');
  await expect
    .poll(async () => (await contexts(page)).at(-1))
    .toContain('No workflow or block is currently selected');
  await page.evaluate((value) => (window as TestHost).sendResult(value), toolResult(savedView));
  await page.evaluate(
    (value) => {
      (window as TestHost).refreshResult = value;
    },
    toolResult({ ...savedView, version: 99 }),
  );
  await frame.getByRole('button', { name: 'Refresh', exact: true }).click();
  await expect(frame.getByRole('list', { name: 'Workflow steps' })).toHaveCount(0);
  await expect(frame.getByRole('alert')).toContainText('previous snapshot was cleared');
  expect(errors).toEqual([]);
});

test('empty and invalid snapshots clear exact selection; canvas remains readonly and opens inspector only on click', async ({
  page,
}) => {
  const { frame, unexpectedRequests, errors } = await openHost(page, savedView);
  await frame.getByRole('button', { name: 'Canvas', exact: true }).click();
  await expect(frame.getByTestId('workflow-canvas')).toBeVisible();
  await expect(frame.getByRole('dialog')).toHaveCount(0);
  await expect(frame.locator('.react-flow__node')).toHaveCount(definition.blocks.length);
  await frame.locator('.react-flow__node').first().click();
  await expect(frame.getByRole('dialog')).toBeVisible();
  await page.evaluate(() => {
    (window as TestHost).rejectMessages = true;
  });
  await frame
    .getByRole('dialog')
    .getByRole('button', { name: 'Explain this block', exact: true })
    .click();
  await expect(frame.getByRole('dialog').getByRole('alert')).toContainText('could not receive');
  await expect(frame.getByRole('button', { name: /^(Run|Execute|Save|Approve)$/ })).toHaveCount(0);
  await frame.getByRole('dialog').press('Escape');
  await frame.locator('.react-flow__node').first().click();
  await page.keyboard.press('Delete');
  await expect(frame.locator('.react-flow__node')).toHaveCount(definition.blocks.length);
  const empty = { ...savedView, version: 5, definition: { ...definition, blocks: [], edges: [] } };
  await page.evaluate((value) => (window as TestHost).sendResult(value), toolResult(empty));
  await expect(frame.getByTestId('workflow-canvas')).toHaveCount(0);
  await expect.poll(async () => (await contexts(page)).at(-1)).toContain('"selectedBlockId":null');
  await expect.poll(async () => (await contexts(page)).at(-1)).toContain('"version":5');
  await page.evaluate(
    (value) => (window as TestHost).sendResult(value),
    toolResult({ ...savedView, selectedBlockId: 'missing-block' }),
  );
  await expect(frame.getByRole('alert')).toContainText('unavailable or invalid');
  await expect
    .poll(async () => (await contexts(page)).at(-1))
    .toContain('No workflow or block is currently selected');
  expect(unexpectedRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test('canvas selection closes another step’s details and Explain follows the visible step', async ({
  page,
}) => {
  const { frame, errors } = await openHost(page, savedView);
  await frame.getByRole('button', { name: new RegExp(calculation.label) }).click();
  await expect(
    frame.getByRole('region', { name: `Step details: ${calculation.label}` }),
  ).toBeVisible();
  await frame.getByRole('button', { name: 'Canvas', exact: true }).click();
  await frame.getByRole('button', { name: 'Fit view', exact: true }).click();
  const other = definition.blocks.find((block: { id: string }) => block.id !== calculationId);
  await frame.locator(`.react-flow__node[data-id="${other.id}"]`).click();
  await expect
    .poll(async () => (await contexts(page)).at(-1))
    .toContain(`"selectedBlockId":"${other.id}"`);
  await frame.getByRole('button', { name: 'Close inspector', exact: true }).click();
  await frame.getByRole('button', { name: 'Steps', exact: true }).click();
  await expect(
    frame.getByRole('region', { name: `Step details: ${calculation.label}` }),
  ).toHaveCount(0);
  await frame.getByRole('button', { name: new RegExp(calculation.label) }).click();
  await frame
    .getByRole('region', { name: `Step details: ${calculation.label}` })
    .getByRole('button', { name: 'Explain this block', exact: true })
    .click();
  await expect.poll(async () => (await requests(page, 'ui/message')).length).toBe(1);
  expect((await requests(page, 'ui/message'))[0].params?.content?.[0]?.text).toContain(
    `"selectedBlockId":"${calculationId}"`,
  );
  expect(errors).toEqual([]);
});

test('overview tabs share exact context and page through source evidence without another chat card', async ({
  page,
}) => {
  const snapshot = {
    ...editableView,
    capabilities: { write: false, execute: false },
    disclosure: { omittedCollections: [{ path: 'source.rows', total: 30, shown: 1 }] },
  };
  const { frame, errors, unexpectedRequests } = await openHost(page, snapshot);
  await frame.getByRole('tab', { name: 'Inputs', exact: true }).click();
  await expect(frame.getByLabel('Calculate: Amount')).toHaveValue('200');
  await expect(frame.getByLabel('Calculate: Amount')).toBeDisabled();
  await expect.poll(async () => (await contexts(page)).at(-1)).toContain('"activeTab":"inputs"');
  await expect(frame.getByRole('button', { name: 'Apply reviewed change' })).toHaveCount(0);
  await page.evaluate(
    (value) => {
      (window as TestHost).toolResults.read_workflow_source = value;
    },
    dataResult({
      sourceId: 'source-old',
      name: 'Original trial balance.xlsx',
      totalRows: 30,
      offset: 0,
      rows: [{ account: '1000', amount: 200 }],
      nextOffset: 20,
      segments: [],
      totalSegments: 0,
    }),
  );
  await frame.getByRole('tab', { name: 'Sources', exact: true }).click();
  await frame.getByRole('button', { name: 'Original trial balance.xlsx', exact: true }).click();
  await expect(frame.getByLabel('Source evidence pages')).toContainText('Rows 1–1 of 30');
  await expect
    .poll(async () => (await contexts(page)).at(-1))
    .toContain('"selectedSourceId":"source-old"');
  await page.evaluate(
    (value) => {
      (window as TestHost).toolResults.read_workflow_source = value;
    },
    dataResult({
      sourceId: 'source-old',
      name: 'Original trial balance.xlsx',
      totalRows: 30,
      offset: 20,
      rows: [{ account: '2000', amount: 300 }],
      nextOffset: null,
      segments: [],
      totalSegments: 0,
    }),
  );
  await frame.getByRole('button', { name: 'More rows / evidence' }).click();
  await expect(frame.getByLabel('Source evidence pages')).toContainText('Rows 21–21 of 30');
  await frame.getByRole('tab', { name: 'Changes', exact: true }).click();
  await expect(frame.getByLabel('Workflow changes')).toContainText('No applied changes');
  await expect(
    frame.getByRole('button', { name: 'Recalculate saved inputs', exact: true }),
  ).toHaveCount(0);
  await frame.getByRole('tab', { name: 'Workflow', exact: true }).click();
  await expect(frame.getByRole('list', { name: 'Workflow steps' })).toHaveCount(1);
  expect(await requests(page, 'ui/message')).toEqual([]);
  expect(unexpectedRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test('zero-valued input draft survives tabs and requires review, Apply and separate Recalculate', async ({
  page,
}) => {
  const { frame, errors } = await openHost(page, editableView);
  await frame.getByRole('tab', { name: 'Inputs', exact: true }).click();
  await frame.getByLabel('Calculate: Amount').fill('0');
  await frame.getByRole('tab', { name: 'Sources', exact: true }).click();
  await frame.getByRole('tab', { name: 'Inputs', exact: true }).click();
  await expect(frame.getByLabel('Calculate: Amount')).toHaveValue('0');
  await expect
    .poll(async () => (await contexts(page)).at(-1))
    .toContain('"hasUnappliedDrafts":true');
  expect(await requests(page, 'tools/call')).toEqual([]);
  await page.evaluate((value) => {
    (window as TestHost).toolResults.preview_workflow_change = value;
  }, dataResult(reviewData));
  await frame.getByRole('button', { name: 'Review input changes', exact: true }).click();
  await expect(frame.getByRole('tab', { name: 'Changes', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(frame.getByLabel('Review before applying')).toContainText('200');
  await expect
    .poll(async () => (await contexts(page)).at(-1))
    .toContain('"status":"awaiting_user_review"');
  const reviewedContext = JSON.parse((await contexts(page)).at(-1)!);
  expect(reviewedContext.pendingReview.changes).toEqual(reviewData.changes);
  expect(JSON.stringify(reviewedContext)).not.toContain('reviewToken');
  expect(JSON.stringify(reviewedContext)).not.toContain('test-review-token');
  const preview = (await requests(page, 'tools/call'))[0];
  expect(preview.params).toMatchObject({
    name: 'preview_workflow_change',
    arguments: {
      workflowId: savedView.workflowId,
      runId: 'saved-run-17',
      expectedRevision: 2,
      expectedLibraryRevision: 10,
      change: {
        kind: 'inputs',
        blockId: calculationId,
        patch: { inputChoices: { AMOUNT: { kind: 'manual', value: 0 } } },
      },
    },
  });
  expect((await requests(page, 'tools/call')).map((call) => call.params?.name)).toEqual([
    'preview_workflow_change',
  ]);
  const updated = {
    ...editableView,
    libraryRevision: 11,
    definition: {
      ...definition,
      blocks: definition.blocks.map((block: { id: string; config: object }) =>
        block.id === calculationId
          ? {
              ...block,
              config: { ...block.config, inputChoices: { AMOUNT: { kind: 'manual', value: 0 } } },
            }
          : block,
      ),
    },
    inspection: {
      ...editableView.inspection,
      revision: 3,
      stale: [calculationId],
      steps: editableView.inspection.steps.map((step: { id: string }) =>
        step.id === calculationId ? { ...step, status: 'outdated' } : step,
      ),
      inputOverrides: {
        [calculationId]: { inputChoices: { AMOUNT: { kind: 'manual', value: 0 } } },
      },
      changeHistory: [
        {
          id: 'change-1',
          kind: 'inputs',
          at: savedView.capturedAt,
          actorId: 'user-test',
          revisionBefore: 2,
          revisionAfter: 3,
          changes: reviewData.changes,
          affectedBlockIds: [calculationId],
        },
      ],
    },
  };
  await page.evaluate((value) => {
    (window as TestHost).toolResults.apply_workflow_change = value;
  }, toolResult(updated));
  await frame.getByRole('button', { name: 'Apply reviewed change', exact: true }).click();
  await expect(frame.getByText('Change saved.', { exact: false })).toBeVisible();
  await expect.poll(async () => (await contexts(page)).at(-1)).toContain('"pendingReview":null');
  await expect
    .poll(async () => (await contexts(page)).at(-1))
    .toContain('"hasUnappliedDrafts":false');
  expect((await requests(page, 'tools/call')).map((call) => call.params?.name)).toEqual([
    'preview_workflow_change',
    'apply_workflow_change',
  ]);
  await page.evaluate(
    (value) => {
      (window as TestHost).toolResults.recalculate_workflow_session = value;
    },
    toolResult({
      ...updated,
      libraryRevision: 12,
      inspection: {
        ...updated.inspection,
        revision: 4,
        stale: [],
        steps: editableView.inspection.steps,
        results: { [calculationId]: { ...recordedResult(), output: { RESULT: 0 } } },
      },
    }),
  );
  await frame.getByRole('button', { name: 'Recalculate saved inputs', exact: true }).click();
  await expect.poll(async () => (await contexts(page)).at(-1)).toContain('"revision":4');
  expect((await requests(page, 'tools/call')).at(-1)?.params).toMatchObject({
    name: 'recalculate_workflow_session',
    arguments: {
      workflowId: savedView.workflowId,
      runId: 'saved-run-17',
      expectedRevision: 3,
      expectedLibraryRevision: 11,
    },
  });
  expect(await requests(page, 'ui/message')).toEqual([]);
  expect(errors).toEqual([]);
  await page.screenshot({ path: 'test-results/chatgpt-viewer-workbench.png', fullPage: true });
});

test('a saved start with unavailable snapshot recovers its exact run without creating replacement work', async ({
  page,
}) => {
  const { frame, errors } = await openHost(page, {
    ...savedView,
    libraryRevision: 10,
    capabilities: { write: true, execute: true },
  });
  const receipt = {
    workflowId: savedView.workflowId,
    runId: 'saved-run-17',
    version: 3,
    revision: 2,
    libraryRevision: 11,
    paused: true,
    computed: false,
    executedBlockIds: [],
    completedAt: savedView.capturedAt,
  };
  await page.evaluate(
    (value) => {
      (window as TestHost).toolResults.start_workflow_session = value;
    },
    {
      ...dataResult({ ...receipt, snapshotUnavailable: true }),
      _meta: { operationReceipt: receipt },
    },
  );
  await frame.getByRole('button', { name: 'Start work from this version' }).click();
  await expect(frame.getByText('Previous evidence is hidden', { exact: false })).toBeVisible();
  await expect(frame.getByRole('button', { name: 'Start work from this version' })).toHaveCount(0);
  await expect(frame.getByRole('tab', { name: 'Inputs', exact: true })).toBeDisabled();
  await expect(frame.getByRole('progressbar')).toHaveCount(0);
  await expect
    .poll(async () => (await contexts(page)).at(-1))
    .toContain('"snapshotUnavailable":true');
  await page.evaluate(
    (value) => {
      (window as TestHost).refreshResult = value;
    },
    toolResult({ ...editableView, libraryRevision: 11 }),
  );
  await frame.getByRole('button', { name: 'Refresh', exact: true }).click();
  await expect(frame.getByRole('tab', { name: 'Inputs', exact: true })).toBeEnabled();
  await expect(frame.getByRole('list', { name: 'Workflow steps' })).toBeVisible();
  const calls = await requests(page, 'tools/call');
  expect(calls.map((call) => call.params?.name)).toEqual([
    'start_workflow_session',
    'inspect_workflow_run',
  ]);
  expect(calls[0].params?.arguments).toMatchObject({
    workflowId: savedView.workflowId,
    version: 3,
    expectedLibraryRevision: 10,
  });
  expect(calls[1].params?.arguments).toMatchObject({
    workflowId: savedView.workflowId,
    runId: 'saved-run-17',
  });
  expect(await requests(page, 'ui/message')).toEqual([]);
  expect(errors).toEqual([]);
});

test('worksheet and column choices are explicit, reviewed, and locked to the prepared capture', async ({
  page,
}) => {
  const snapshot = {
    ...editableView,
    inspection: {
      ...editableView.inspection,
      steps: editableView.inspection.steps.map((step: { id: string }) =>
        step.id === documentBlock.id ? { ...step, inputKeys: ['documentCurrency'] } : step,
      ),
    },
  };
  const { frame, errors, unexpectedRequests } = await openHost(page, snapshot);
  const inspection = {
    uploadId: 'workbook-upload',
    fileName: 'sales-check.xlsx',
    kind: 'workbook',
    sheets: [
      {
        sheetName: 'Trial balance',
        headers: ['Account', 'Balance'],
        detectedHeaderRowNumber: 1,
        previewRows: [
          ['Account', 'Balance'],
          ['1000', '0'],
        ],
      },
      {
        sheetName: 'Other',
        headers: ['Ignore'],
        detectedHeaderRowNumber: 1,
        previewRows: [['Ignore']],
      },
    ],
  };
  await page.evaluate(
    (values) => {
      (window as TestHost).toolResults = values;
    },
    {
      begin_workflow_source: dataResult({ uploadId: 'workbook-upload', chunkBytes: 49152 }),
      inspect_workflow_source: dataResult(inspection),
      capture_workflow_source: dataResult({
        captureId: 'workbook-capture',
        fileName: 'sales-check.xlsx',
        rowCount: 1,
        previewRows: [{ account: '1000', amount: 0, currency: 'CAD' }],
        issues: [],
      }),
      preview_workflow_change: dataResult({
        ...reviewData,
        changes: [
          { field: 'source', before: 'Original trial balance.xlsx', after: 'sales-check.xlsx' },
        ],
        affectedBlockIds: [documentBlock.id, calculationId],
      }),
    },
  );
  await frame.getByRole('tab', { name: 'Inputs', exact: true }).click();
  await frame.getByLabel(`${documentBlock.label}: Document Currency`, { exact: true }).fill('EUR');
  await frame.getByRole('tab', { name: 'Sources', exact: true }).click();
  await frame.getByLabel('Source block to amend').selectOption(documentBlock.id);
  await frame
    .getByLabel('Upload workflow source')
    .setInputFiles('e2e/fixtures/demo/sales-check.xlsx');
  await expect(frame.getByLabel('Source worksheet')).toBeVisible();
  await expect(frame.getByRole('button', { name: 'Prepare source preview' })).toBeDisabled();
  await frame.getByLabel('Source worksheet').selectOption('Trial balance');
  await frame.getByLabel('Source header row').fill('2');
  await page.evaluate(
    (value) => {
      (window as TestHost).toolResults.inspect_workflow_source = value;
    },
    dataResult({
      ...inspection,
      sheets: [{ ...inspection.sheets[0], detectedHeaderRowNumber: 2 }],
    }),
  );
  await frame.getByRole('button', { name: 'Read selected header' }).click();
  await expect(frame.getByRole('button', { name: 'Read selected header' })).toHaveCount(0);
  await expect(frame.getByLabel('Source worksheet').locator('option')).toHaveCount(3);
  await frame.getByLabel('Map account column', { exact: true }).selectOption('Account');
  await frame.getByLabel('Map amount column', { exact: true }).selectOption('Balance');
  await expect(frame.getByRole('button', { name: 'Prepare source preview' })).toBeDisabled();
  await frame.getByLabel('Source currency', { exact: true }).fill('CAD');
  await frame.getByRole('button', { name: 'Prepare source preview' }).click();
  await expect(frame.getByLabel('Source worksheet')).toBeDisabled();
  await expect(frame.getByRole('button', { name: 'Prepare source preview' })).toBeDisabled();
  const capture = (await requests(page, 'tools/call')).find(
    (call) => call.params?.name === 'capture_workflow_source',
  );
  expect(capture?.params?.arguments).toEqual({
    uploadId: 'workbook-upload',
    selection: {
      sheetName: 'Trial balance',
      headerRowNumber: 2,
      mapping: { account: 'Account', amount: 'Balance' },
      currency: 'CAD',
    },
  });
  await frame.getByRole('button', { name: 'Review source change' }).click();
  await expect(frame.getByLabel('Review before applying')).toContainText('sales-check.xlsx');
  expect((await requests(page, 'tools/call')).at(-1)?.params?.arguments).toMatchObject({
    change: {
      kind: 'source',
      blockId: documentBlock.id,
      captureId: 'workbook-capture',
      mode: 'replace',
    },
  });
  expect(
    (await requests(page, 'tools/call')).some(
      (call) => call.params?.name === 'apply_workflow_change',
    ),
  ).toBe(false);
  await page.evaluate(
    (value) => {
      (window as TestHost).toolResults.apply_workflow_change = value;
    },
    toolResult({
      ...snapshot,
      libraryRevision: 11,
      inspection: { ...snapshot.inspection, revision: 3 },
    }),
  );
  await frame.getByRole('button', { name: 'Apply reviewed change' }).click();
  await expect(frame.getByText('Change saved.', { exact: false })).toBeVisible();
  await frame.getByRole('tab', { name: 'Inputs', exact: true }).click();
  await expect(
    frame.getByLabel(`${documentBlock.label}: Document Currency`, { exact: true }),
  ).toHaveValue('EUR');
  await expect(frame.getByRole('alert')).toContainText('Your draft is preserved');
  expect(await requests(page, 'ui/message')).toEqual([]);
  expect(unexpectedRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test('an unset server-declared override is sent as a finite number', async ({ page }) => {
  const snapshot = {
    ...editableView,
    inspection: {
      ...editableView.inspection,
      steps: editableView.inspection.steps.map((step: { id: string }) =>
        step.id === documentBlock.id ? { ...step, inputKeys: ['overridePrice'] } : step,
      ),
    },
  };
  const { frame, errors } = await openHost(page, snapshot);
  await page.evaluate((value) => {
    (window as TestHost).toolResults.preview_workflow_change = value;
  }, dataResult(reviewData));
  await frame.getByRole('tab', { name: 'Inputs', exact: true }).click();
  await frame.getByLabel(`${documentBlock.label}: Override Price`).fill('12.5');
  await frame.getByRole('button', { name: 'Review input changes' }).click();
  await expect(frame.getByLabel('Review before applying')).toBeVisible();
  expect((await requests(page, 'tools/call'))[0].params?.arguments).toMatchObject({
    change: { kind: 'inputs', blockId: documentBlock.id, patch: { overridePrice: 12.5 } },
  });
  expect(errors).toEqual([]);
});

test('stale run update preserves an input draft and invalidates an old review', async ({
  page,
}) => {
  const { frame, errors } = await openHost(page, editableView);
  await frame.getByRole('tab', { name: 'Inputs', exact: true }).click();
  await frame.getByLabel('Calculate: Amount').fill('125');
  await page.evaluate((value) => {
    (window as TestHost).toolResults.preview_workflow_change = value;
  }, dataResult(reviewData));
  await frame.getByRole('button', { name: 'Review input changes' }).click();
  await expect(frame.getByRole('button', { name: 'Apply reviewed change' })).toBeVisible();
  await page.evaluate(
    (value) => (window as TestHost).sendResult(value),
    toolResult({
      ...editableView,
      libraryRevision: 11,
      inspection: { ...editableView.inspection, revision: 3 },
    }),
  );
  await expect(frame.getByRole('button', { name: 'Apply reviewed change' })).toHaveCount(0);
  await frame.getByRole('tab', { name: 'Inputs', exact: true }).click();
  await expect(frame.getByLabel('Calculate: Amount')).toHaveValue('125');
  await expect(frame.getByRole('alert')).toContainText('Your draft is preserved');
  await expect(frame.getByRole('button', { name: 'Review input changes' })).toBeDisabled();
  expect(
    (await requests(page, 'tools/call')).some(
      (call) => call.params?.name === 'apply_workflow_change',
    ),
  ).toBe(false);
  expect(errors).toEqual([]);
});

test('actual source bytes are staged and cancelled without replacing the current trial balance', async ({
  page,
}) => {
  const { frame, errors, unexpectedRequests } = await openHost(page, editableView);
  await page.evaluate(
    (values) => {
      (window as TestHost).toolResults = values;
    },
    {
      begin_workflow_source: dataResult({ uploadId: 'upload-test', chunkBytes: 49152 }),
      inspect_workflow_source: dataResult({
        uploadId: 'upload-test',
        fileName: 'replacement.json',
        kind: 'json',
        sheets: [],
      }),
      capture_workflow_source: dataResult({
        captureId: 'capture-test',
        fileName: 'replacement.json',
        rowCount: 1,
        previewRows: [{ account: '2000', amount: 75 }],
        issues: [{ code: 'ORIGINAL_NOT_STORED', message: 'Original file was not stored.' }],
      }),
    },
  );
  await frame.getByRole('tab', { name: 'Sources', exact: true }).click();
  await frame.getByLabel('Source block to amend').selectOption(documentBlock.id);
  const bytes = Buffer.from('[{"account":"2000","amount":75}]');
  await frame
    .getByLabel('Upload workflow source')
    .setInputFiles({ name: 'replacement.json', mimeType: 'application/json', buffer: bytes });
  await expect(frame.getByRole('button', { name: 'Prepare source preview' })).toBeVisible();
  const upload = (await requests(page, 'tools/call')).find(
    (call) => call.params?.name === 'append_workflow_source',
  );
  expect(Buffer.from(String(upload?.params?.arguments?.base64), 'base64')).toEqual(bytes);
  await frame.getByRole('button', { name: 'Prepare source preview' }).click();
  await expect(frame.getByLabel('Prepared source preview')).toContainText('1 records prepared');
  await expect(frame.getByLabel('Prepared source preview')).toContainText(
    'Original file was not stored',
  );
  await frame.getByRole('button', { name: 'Cancel import' }).click();
  await expect(frame.getByLabel('Prepared source preview')).toHaveCount(0);
  await expect(frame.getByRole('button', { name: 'Original trial balance.xlsx' })).toBeVisible();
  expect((await requests(page, 'tools/call')).map((call) => call.params?.name)).toEqual([
    'begin_workflow_source',
    'append_workflow_source',
    'inspect_workflow_source',
    'capture_workflow_source',
  ]);
  expect(await requests(page, 'ui/message')).toEqual([]);
  expect(unexpectedRequests).toEqual([]);
  expect(errors).toEqual([]);
});
