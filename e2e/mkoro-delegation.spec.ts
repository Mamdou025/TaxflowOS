import type { Page, Route } from '@playwright/test';
import {
  MkoroDelegationRequestSchema,
  type MkoroConversation,
  type MkoroEvent,
  type MkoroTask,
} from '../lib/api-zod/src/mkoro';
import { test, expect } from './workflow-audit-isolation';

const workerId = '10000000-0000-4000-8000-000000000011';
const conversationId = '20000000-0000-4000-8000-000000000011';
const taskId = '30000000-0000-4000-8000-000000000011';
const toolCallId = 'synthetic-delegation-call';
const stamp = '2026-09-28T12:00:00.000Z';
const computerTask = {
  taskType: 'local_file',
  target: 'C:\\MKORO',
  objective:
    'Find the workbook in the local MKORO folder and report its exact path. Do not change files.',
  expectedOutput: 'The actual workbook path and whether it is readable.',
  reasonNoPlatformTool: 'The workbook exists only on this computer and is not an Inscope Source.',
};
type RuntimeMessage = {
  id?: string;
  role?: string;
  content?: unknown;
  toolCallId?: string;
  toolCalls?: unknown[];
};
type RuntimeInput = {
  threadId: string;
  runId: string;
  messages: RuntimeMessage[];
  tools: { name: string }[];
  context?: unknown[];
};
type SavedMessage = { id: string; role: string; seq: number; content: unknown };

async function eventStream(route: Route, input: RuntimeInput, events: Record<string, unknown>[]) {
  await route.fulfill({
    status: 200,
    contentType: 'text/event-stream',
    headers: { 'Cache-Control': 'no-cache' },
    body: [
      { type: 'RUN_STARTED', threadId: input.threadId, runId: input.runId },
      ...events,
      { type: 'RUN_FINISHED', threadId: input.threadId, runId: input.runId },
    ]
      .map((event) => `data: ${JSON.stringify(event)}\n\n`)
      .join(''),
  });
}
function textEvents(text: string) {
  return [
    { type: 'TEXT_MESSAGE_START', messageId: crypto.randomUUID(), role: 'assistant' },
  ].flatMap((start) => [
    start,
    { type: 'TEXT_MESSAGE_CONTENT', messageId: start.messageId, delta: text },
    { type: 'TEXT_MESSAGE_END', messageId: start.messageId },
  ]);
}

async function installProtocolFixture(page: Page, native = false) {
  const state = {
    conversation: null as MkoroConversation | null,
    task: null as MkoroTask | null,
    events: [] as MkoroEvent[],
    delegations: [] as unknown[],
    saved: new Map<string, SavedMessage[]>(),
    order: [] as string[],
    runs: [] as RuntimeInput[],
    reviews: 0,
    failReview: false,
    unexpected: [] as string[],
    screenCalls: 0,
  };
  await page.route('**/api/documents**', (route) => route.fulfill({ json: { documents: [] } }));
  await page.route('**/api/integrations**', (route) => route.fulfill({ json: [] }));
  await page.route('**/api/chat/threads**', async (route) => {
    const request = route.request();
    const pathname = new URL(request.url()).pathname;
    if (request.method() === 'POST' && pathname.endsWith('/messages')) {
      const id = decodeURIComponent(pathname.split('/')[4]);
      const body = request.postDataJSON() as { messages: SavedMessage[] };
      state.order.push('save-chat');
      state.saved.set(id, body.messages);
      return route.fulfill({ json: { ok: true } });
    }
    if (request.method() === 'GET' && pathname === '/api/chat/threads')
      return route.fulfill({
        json: {
          threads: [...state.saved.keys()].map((id) => ({
            id,
            title: 'Saved computer request',
            updatedAt: stamp,
          })),
        },
      });
    if (request.method() === 'GET')
      return route.fulfill({
        json: { messages: state.saved.get(decodeURIComponent(pathname.split('/')[4])) ?? [] },
      });
    state.unexpected.push(`${request.method()} ${pathname}`);
    return route.fulfill({ status: 500, json: { error: 'Unexpected chat mutation blocked.' } });
  });
  await page.route('**/api/mkoro**', async (route) => {
    const request = route.request();
    const pathname = new URL(request.url()).pathname;
    if (pathname.includes('/screen')) state.screenCalls++;
    if (request.method() === 'GET' && pathname === '/api/mkoro/workers')
      return route.fulfill({
        json: {
          workers: [
            {
              id: workerId,
              name: 'Protocol test computer',
              capabilities: ['goose-acp', 'sina-delegation-v1', 'desktop-screenshots-v1'],
              status: 'online',
              lastSeenAt: stamp,
              createdAt: stamp,
            },
          ],
        },
      });
    if (request.method() === 'POST' && pathname === '/api/mkoro/delegations') {
      const body = MkoroDelegationRequestSchema.parse(request.postDataJSON());
      state.order.push('delegate');
      state.delegations.push(body);
      state.conversation = {
        id: conversationId,
        workerId,
        threadId: body.threadId,
        title: body.objective,
        createdAt: stamp,
        updatedAt: stamp,
      };
      const { threadId: _thread, workerId: _worker, requestId, ...delegation } = body;
      state.task = {
        id: taskId,
        conversationId,
        workerId,
        message: body.objective,
        requestId,
        delegation,
        status: 'running',
        cancelRequested: false,
        connectionLost: false,
        error: null,
        createdAt: stamp,
        updatedAt: stamp,
      };
      return route.fulfill({
        status: 202,
        json: { conversation: state.conversation, task: state.task },
      });
    }
    if (request.method() === 'GET' && pathname.startsWith('/api/mkoro/threads/'))
      return route.fulfill({
        json: {
          conversations:
            state.conversation &&
            pathname ===
              `/api/mkoro/threads/${encodeURIComponent(state.conversation.threadId!)}/conversations`
              ? [state.conversation]
              : [],
        },
      });
    if (request.method() === 'GET' && pathname === `/api/mkoro/conversations/${conversationId}`)
      return route.fulfill({
        json: {
          conversation: state.conversation,
          tasks: state.task ? [state.task] : [],
          events: state.events,
          pendingPermissions: [],
          eventsTruncated: false,
          tasksTruncated: false,
        },
      });
    if (request.method() === 'GET' && pathname === `/api/mkoro/tasks/${taskId}/events`)
      return route.fulfill({
        json: {
          task: state.task,
          events: state.events,
          cursor: state.events.length,
          pendingPermissions: [],
        },
      });
    state.unexpected.push(`${request.method()} ${pathname}`);
    return route.fulfill({
      status: 500,
      json: { error: 'Unexpected computer operation blocked.' },
    });
  });
  await page.route('**/api/copilotkit**', async (route) => {
    const request = route.request();
    const pathname = new URL(request.url()).pathname;
    const envelope =
      request.method() === 'POST'
        ? (request.postDataJSON() as { method?: string; body?: RuntimeInput })
        : {};
    if (envelope.method === 'info' || pathname.endsWith('/info') || request.method() === 'GET')
      return route.fulfill({
        json: {
          version: '1.63.2',
          mode: 'sse',
          agents: {
            default: {
              name: 'default',
              description: 'Isolated AG-UI fixture',
              className: 'FixtureAgent',
            },
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
    if (envelope.method === 'agent/connect' || pathname.endsWith('/connect'))
      return route.fulfill({ status: 200, contentType: 'text/event-stream', body: '' });
    if (envelope.method === 'agent/stop' || pathname.includes('/stop/'))
      return route.fulfill({ json: { ok: true } });
    if (envelope.method !== 'agent/run' && !pathname.endsWith('/run')) {
      state.unexpected.push(`Runtime ${envelope.method ?? pathname}`);
      return route.fulfill({ status: 500, json: { error: 'Unexpected model operation blocked.' } });
    }
    const input = (envelope.body ?? request.postDataJSON()) as RuntimeInput;
    state.runs.push(input);
    if (state.runs.length === 1) {
      const toolName = native ? 'runWorkflow' : 'delegateComputerTask';
      expect(input.tools.some((tool) => tool.name === toolName)).toBe(true);
      return eventStream(route, input, [
        {
          type: 'TOOL_CALL_START',
          toolCallId,
          toolCallName: toolName,
          parentMessageId: 'synthetic-tool-message',
        },
        {
          type: 'TOOL_CALL_ARGS',
          toolCallId,
          delta: JSON.stringify(native ? { workflowId: 'fapi' } : computerTask),
        },
        { type: 'TOOL_CALL_END', toolCallId },
      ]);
    }
    const isReview = input.messages.some(
      (message) =>
        message.id === `mkoro-update-${taskId}` ||
        (message.role === 'user' &&
          typeof message.content === 'string' &&
          message.content.startsWith('Review the reported outcome')),
    );
    if (isReview) {
      state.reviews++;
      if (state.failReview)
        return route.fulfill({
          status: 503,
          json: { error: 'Synthetic review provider is unavailable.' },
        });
      return eventStream(
        route,
        input,
        textEvents(
          'Mkoro reported C:\\MKORO\\workbook.xlsx. Sina still needs an uploaded Source before running the platform workflow.',
        ),
      );
    }
    return eventStream(
      route,
      input,
      textEvents('The computer task was accepted. Its progress is visible below.'),
    );
  });
  return state;
}
async function submit(page: Page, text: string) {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Mkoro computer settings' })).toContainText(
    'online',
  );
  const composer = page.locator('.lc-console').getByRole('textbox');
  await composer.fill(text);
  await composer.press('Enter');
}
function complete(state: Awaited<ReturnType<typeof installProtocolFixture>>) {
  if (!state.task) throw new Error('The registered delegation tool did not create a task.');
  state.task.status = 'completed';
  state.events = [
    {
      id: '40000000-0000-4000-8000-000000000011',
      taskId,
      seq: 1,
      cursor: 1,
      type: 'message',
      payload: {
        text: 'Found readable C:\\MKORO\\workbook.xlsx. It has not been uploaded to Inscope.',
      },
      createdAt: stamp,
    },
  ];
}

test('registered Sina delegation saves its chat, resolves the tool and reviews the completed computer task once', async ({
  page,
}) => {
  const state = await installProtocolFixture(page);
  await submit(page, computerTask.objective);
  await expect.poll(() => state.delegations.length).toBe(1);
  expect(state.order.indexOf('save-chat')).toBeLessThan(state.order.indexOf('delegate'));
  expect(state.task?.message).toBe(computerTask.objective);
  expect(state.conversation?.threadId).toBeTruthy();
  expect(state.saved.has(state.conversation!.threadId!)).toBe(true);
  await expect(page.getByRole('article', { name: 'Mkoro delegated task' })).toContainText(
    computerTask.objective,
  );
  await expect
    .poll(() =>
      state.runs.some((run) =>
        run.messages.some(
          (message) =>
            message.role === 'tool' &&
            message.toolCallId === toolCallId &&
            JSON.stringify(message.content).includes('delegated'),
        ),
      ),
    )
    .toBe(true);
  await expect(
    page.getByText('The computer task was accepted. Its progress is visible below.', {
      exact: true,
    }),
  ).toBeVisible();
  complete(state);
  await expect(
    page.getByText(
      'Mkoro reported C:\\MKORO\\workbook.xlsx. Sina still needs an uploaded Source before running the platform workflow.',
      { exact: true },
    ),
  ).toBeVisible();
  expect(state.reviews).toBe(1);
  const review = state.runs.find((run) =>
    run.messages.some((message) => message.id === `mkoro-update-${taskId}`),
  );
  expect(JSON.stringify(review?.context)).toContain('Found readable C:');
  expect(state.delegations).toHaveLength(1);
  expect(state.screenCalls).toBe(0);
  await expect
    .poll(() => JSON.stringify(state.saved.get(state.conversation!.threadId!)))
    .toContain(`mkoro-update-${taskId}`);
  await expect
    .poll(() =>
      state.saved
        .get(state.conversation!.threadId!)
        ?.some(
          (message) =>
            message.role === 'assistant' &&
            (message.content as { text?: string }).text ===
              'Mkoro reported C:\\MKORO\\workbook.xlsx. Sina still needs an uploaded Source before running the platform workflow.',
        ),
    )
    .toBe(true);
  await page.reload();
  await expect(page.getByRole('article', { name: 'Mkoro delegated task' })).toContainText(
    'Turn finished',
  );
  await expect(
    page.getByText(
      'Mkoro reported C:\\MKORO\\workbook.xlsx. Sina still needs an uploaded Source before running the platform workflow.',
      { exact: true },
    ),
  ).toBeVisible();
  expect(state.reviews).toBe(1);
  expect(state.delegations).toHaveLength(1);
  expect(state.unexpected).toEqual([]);
});

test('the registered native workflow tool opens FAPI in Sina without delegating computer work', async ({
  page,
}) => {
  const state = await installProtocolFixture(page, true);
  await submit(page, 'Open the FAPI workflow here so I can supply its source.');
  const workflow = page.getByRole('region', { name: 'Workflow execution' });
  await expect(workflow).toContainText('FAPI');
  await expect(workflow.getByRole('button', { name: 'Start guided workflow' })).toBeVisible();
  expect(state.runs[0].tools.some((tool) => tool.name === 'runWorkflow')).toBe(true);
  expect(state.delegations).toEqual([]);
  expect(state.screenCalls).toBe(0);
  await expect(page.getByRole('article', { name: 'Mkoro delegated task' })).toHaveCount(0);
  expect(state.unexpected).toEqual([]);
});

test('a failed automatic Sina review leaves the computer result visible and can be retried explicitly', async ({
  page,
}) => {
  const state = await installProtocolFixture(page);
  await submit(page, computerTask.objective);
  await expect.poll(() => state.delegations.length).toBe(1);
  await expect(
    page.getByText('The computer task was accepted. Its progress is visible below.', {
      exact: true,
    }),
  ).toBeVisible();
  state.failReview = true;
  complete(state);
  await expect(page.getByRole('article', { name: 'Mkoro delegated task' })).toContainText(
    'Found readable C:\\MKORO\\workbook.xlsx',
  );
  await expect(page.getByRole('alert').filter({ hasText: 'Sina could not review' })).toBeVisible();
  expect(state.reviews).toBe(1);
  expect(state.delegations).toHaveLength(1);
  state.failReview = false;
  await page.getByRole('button', { name: 'Ask Sina about this result', exact: true }).click();
  await expect(
    page.getByText(
      'Mkoro reported C:\\MKORO\\workbook.xlsx. Sina still needs an uploaded Source before running the platform workflow.',
      { exact: true },
    ),
  ).toBeVisible();
  expect(state.reviews).toBe(2);
  expect(state.delegations).toHaveLength(1);
  expect(state.unexpected).toEqual([]);
});
