import type { Page } from '@playwright/test';
import type {
  MkoroConversation,
  MkoroEvent,
  MkoroPendingPermissionSchema,
  MkoroTask,
  MkoroWorker,
} from '../lib/api-zod/src/mkoro';
import { test, expect } from './workflow-audit-isolation';

const workerId = '10000000-0000-4000-8000-000000000001';
const conversationId = '20000000-0000-4000-8000-000000000001';
const taskId = '30000000-0000-4000-8000-000000000001';
const threadId = 'sina-computer-task-test';
const timestamp = '2026-09-28T12:00:00.000Z';
const worker: MkoroWorker = {
  id: workerId,
  name: 'Synthetic test computer',
  capabilities: ['goose-acp', 'sina-delegation-v1', 'desktop-screenshots-v1'],
  status: 'online',
  lastSeenAt: timestamp,
  createdAt: timestamp,
};
const conversation: MkoroConversation = {
  id: conversationId,
  workerId,
  threadId,
  title: 'Synthetic folder inspection',
  createdAt: timestamp,
  updatedAt: timestamp,
};
function event(seq: number, type: MkoroEvent['type'], payload: MkoroEvent['payload']): MkoroEvent {
  return {
    id: `40000000-0000-4000-8000-${String(seq).padStart(12, '0')}`,
    taskId,
    seq,
    type,
    payload,
    cursor: seq,
    createdAt: timestamp,
  };
}
function task(overrides: Partial<MkoroTask> = {}): MkoroTask {
  return {
    id: taskId,
    conversationId,
    workerId,
    message: 'Inspect the synthetic folder without changing files.',
    requestId: '50000000-0000-4000-8000-000000000001',
    delegation: {
      taskType: 'local_file',
      target: 'C:\\Synthetic',
      objective: 'Inspect the synthetic folder without changing files.',
      expectedOutput: 'File names only',
      reasonNoPlatformTool: 'The files exist only on the connected computer.',
    },
    status: 'running',
    cancelRequested: false,
    connectionLost: false,
    error: null,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides,
  };
}

async function mockMkoro(page: Page, { modelReady = false } = {}) {
  const state = {
    workers: [] as MkoroWorker[],
    conversations: [] as MkoroConversation[],
    tasks: [] as MkoroTask[],
    events: [] as MkoroEvent[],
    pendingPermissions: [] as (typeof MkoroPendingPermissionSchema._output)[],
    workerResponse: 'valid' as 'valid' | 'malformed' | 'unavailable',
    writes: [] as { path: string; body: Record<string, unknown> }[],
    screenReads: 0,
    screenEnabled: false,
    screenshot: '',
    capturedAt: '',
    screenError: '',
    screenDenied: false,
    wrongTaskFrame: false,
    modelRequests: [] as string[],
    chatWrites: [] as string[],
    unexpected: [] as string[],
  };
  await page.route('**/api/documents**', (route) => route.fulfill({ json: { documents: [] } }));
  await page.route('**/api/integrations**', (route) => route.fulfill({ json: [] }));
  await page.route('**/api/chat/threads**', (route) => {
    const request = route.request();
    const pathname = new URL(request.url()).pathname;
    if (request.method() === 'POST') {
      state.chatWrites.push(request.postData() ?? '');
      return route.fulfill({ json: { ok: true } });
    }
    return route.fulfill({
      json:
        pathname === '/api/chat/threads'
          ? {
              threads: [
                { id: threadId, title: 'Computer task test', updatedAt: timestamp },
                { id: 'another-sina-thread', title: 'Another Sina chat', updatedAt: timestamp },
              ],
            }
          : {
              messages: [
                {
                  id: 'synthetic-user-request',
                  role: 'user',
                  seq: 0,
                  content: { text: 'Inspect the synthetic folder.' },
                },
                {
                  id: 'synthetic-sina-response',
                  role: 'assistant',
                  seq: 1,
                  content: { text: 'I delegated the file inspection to Mkoro.' },
                },
              ],
            },
    });
  });
  await page.route('**/api/copilotkit**', (route) => {
    const body = route.request().postData() ?? '';
    if (modelReady) {
      const method = body ? (JSON.parse(body) as { method?: string }).method : 'info';
      if (method === 'info')
        return route.fulfill({
          json: {
            version: '1.63.2',
            mode: 'sse',
            agents: {
              default: {
                name: 'default',
                description: 'No-op UI fixture',
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
      if (method === 'agent/connect')
        return route.fulfill({ status: 200, contentType: 'text/event-stream', body: '' });
      if (method === 'agent/stop') return route.fulfill({ json: { ok: true } });
    }
    if (body && !body.includes('"method":"info"')) state.modelRequests.push(body);
    return route.fulfill({ status: 503, json: { error: 'No real model is used in this test.' } });
  });
  // Every endpoint is intercepted. No actual computer, provider or API write participates.
  await page.route('**/api/mkoro**', async (route) => {
    const request = route.request(),
      pathname = new URL(request.url()).pathname,
      method = request.method();
    if (method === 'GET' && pathname === '/api/mkoro/workers') {
      return route.fulfill(
        state.workerResponse === 'unavailable'
          ? { status: 503, json: { error: 'Synthetic Mkoro service unavailable.' } }
          : {
              json:
                state.workerResponse === 'malformed'
                  ? { workers: [{ ...worker, status: 'invented-status' }] }
                  : { workers: state.workers },
            },
      );
    }
    if (method === 'PATCH' && pathname === `/api/mkoro/workers/${workerId}/approval`) {
      const body = request.postDataJSON();
      state.writes.push({ path: pathname, body });
      state.workers = state.workers.map((item) =>
        item.id === workerId ? { ...item, autoApprove: body.autoApprove } : item,
      );
      return route.fulfill({ json: { ok: true } });
    }
    if (method === 'GET' && pathname === '/api/mkoro/conversations')
      return route.fulfill({ json: { conversations: state.conversations } });
    if (method === 'GET' && pathname.startsWith('/api/mkoro/threads/'))
      return route.fulfill({
        json: {
          conversations: state.conversations.filter(
            (item) => pathname === `/api/mkoro/threads/${item.threadId}/conversations`,
          ),
        },
      });
    if (method === 'GET' && pathname === `/api/mkoro/conversations/${conversationId}`)
      return route.fulfill({
        json: {
          conversation:
            state.conversations.find((item) => item.id === conversationId) ?? conversation,
          tasks: state.tasks,
          events: state.events,
          eventsTruncated: false,
          tasksTruncated: false,
          pendingPermissions: state.pendingPermissions,
        },
      });
    if (method === 'GET' && pathname === `/api/mkoro/tasks/${taskId}/screen`) {
      state.screenReads++;
      if (state.screenDenied)
        return route.fulfill({
          status: 403,
          json: { error: 'Synthetic screen access was revoked.' },
        });
      return route.fulfill({
        json: {
          taskId: state.wrongTaskFrame ? workerId : taskId,
          status: state.screenError
            ? 'unavailable'
            : state.screenEnabled && state.screenshot
              ? 'ready'
              : 'waiting',
          leaseExpiresAt: new Date(Date.now() + 10_000).toISOString(),
          ...(state.screenError
            ? { error: { code: 'capture_failed', message: state.screenError } }
            : state.screenshot
              ? {
                  frame: {
                    mimeType: 'image/jpeg',
                    data: state.screenshot,
                    width: 20,
                    height: 12,
                    capturedAt: state.capturedAt || new Date().toISOString(),
                  },
                }
              : {}),
        },
      });
    }
    if (method === 'GET' && pathname === `/api/mkoro/tasks/${taskId}/events`)
      return route.fulfill({
        json: {
          task: state.tasks[0],
          events: state.events,
          cursor: state.events.length,
          pendingPermissions: state.pendingPermissions,
        },
      });
    if (method === 'POST') {
      const body: Record<string, unknown> = request.postDataJSON();
      state.writes.push({ path: pathname, body });
      if (pathname === '/api/mkoro/pairings')
        return route.fulfill({
          json: {
            pairingToken: 'synthetic-pairing-token-for-browser-test-only',
            expiresAt: '2099-01-01T00:00:00.000Z',
          },
        });
      if (pathname === `/api/mkoro/tasks/${taskId}/permission`) {
        state.tasks = state.tasks.map((item) => ({ ...item, status: 'running' }));
        state.pendingPermissions = [];
        return route.fulfill({ json: { task: state.tasks[0] } });
      }
      if (pathname === `/api/mkoro/tasks/${taskId}/cancel`) {
        state.tasks = state.tasks.map((item) => ({ ...item, cancelRequested: true }));
        return route.fulfill({ json: { task: state.tasks[0] } });
      }
      if (pathname === `/api/mkoro/tasks/${taskId}/screen-view`) {
        state.screenEnabled = body.enabled === true;
        return route.fulfill({
          json: {
            lease: state.screenEnabled
              ? {
                  taskId,
                  leaseId: '60000000-0000-4000-8000-000000000001',
                  expiresAt: new Date(Date.now() + 10_000).toISOString(),
                  intervalMs: 2000,
                }
              : null,
          },
        });
      }
    }
    state.unexpected.push(`${method} ${pathname}`);
    return route.fulfill({ status: 500, json: { error: 'Unmocked Mkoro operation blocked.' } });
  });
  return state;
}

async function openTask(page: Page, state: Awaited<ReturnType<typeof mockMkoro>>) {
  state.workers = [worker];
  state.conversations = [conversation];
  state.tasks = [task()];
  state.events = [event(1, 'message_delta', { text: 'Inspecting the synthetic folder.' })];
  await page.goto('/');
  await page.getByTitle('Computer task test', { exact: true }).click();
  await expect(page.getByRole('article', { name: 'Mkoro delegated task' })).toBeVisible();
}

test('one Sina composer remains while computer settings offer pairing and preserve the draft', async ({
  page,
}) => {
  const state = await mockMkoro(page);
  await page.goto('/');
  const sinaDraft = page.locator('.lc-console').getByRole('textbox');
  await sinaDraft.fill('Keep this unsent Sina request.');
  await expect(page.getByRole('tab', { name: 'Mkoro', exact: true })).toHaveCount(0);
  await expect(page.getByRole('textbox', { name: 'Message Mkoro' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Mkoro computer settings' }).click();
  const settings = page.getByRole('dialog', { name: 'Mkoro computer', exact: true });
  await expect(settings.getByText('No computer connected', { exact: true })).toBeVisible();
  await settings.getByRole('button', { name: 'Connect a computer', exact: true }).click();
  const pairing = settings.getByRole('region', { name: 'Pair your computer' });
  await expect(pairing.getByRole('textbox', { name: 'Pairing code' })).toHaveValue(
    'synthetic-pairing-token-for-browser-test-only',
  );
  await expect(pairing).toContainText('node scripts/mkoro/companion.mjs');
  await expect(pairing).toContainText('Single use');
  await settings.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(sinaDraft).toHaveValue('Keep this unsent Sina request.');
  expect(state.writes.map((write) => write.path)).toEqual(['/api/mkoro/pairings']);
  expect(state.unexpected).toEqual([]);
});

test('Mkoro reconnects a revoked computer with fresh pairing and a selectable new entry', async ({
  page,
}) => {
  const state = await mockMkoro(page);
  state.workers = [{ ...worker, name: 'Surface Book', status: 'revoked' }];
  await page.goto('/');
  await page.getByRole('button', { name: 'Mkoro computer settings' }).click();
  const settings = page.getByRole('dialog', { name: 'Mkoro computer', exact: true });
  await expect(settings.getByRole('option', { name: 'Surface Book · revoked' })).toBeDisabled();
  await settings.getByRole('button', { name: 'Reconnect Surface Book', exact: true }).click();
  const pairing = settings.getByRole('region', { name: 'Pair your computer' });
  await expect(pairing).toContainText('original startup command with --pair added');
  await expect(pairing).toContainText('same server or relay address');
  await expect(pairing).toContainText('Creating a code does not connect the computer');
  await expect(pairing.getByRole('textbox', { name: 'Pairing code' })).toHaveValue(
    'synthetic-pairing-token-for-browser-test-only',
  );
  await expect(settings.getByText(/^Delegation ready/)).toHaveCount(0);
  const replacementId = '10000000-0000-4000-8000-000000000002';
  state.workers.push({ ...worker, id: replacementId, name: 'Mkoro - Surface Book' });
  await settings.getByRole('button', { name: 'Refresh Mkoro status' }).click();
  await settings.getByRole('combobox', { name: 'Mkoro computer' }).selectOption(replacementId);
  await expect(settings.getByRole('combobox', { name: 'Mkoro computer' })).toHaveValue(
    replacementId,
  );
  await expect(settings.getByText(/^Delegation ready/)).toBeVisible();
  await expect(settings.getByRole('option', { name: 'Surface Book · revoked' })).toBeDisabled();
  expect(state.writes.map((write) => write.path)).toEqual(['/api/mkoro/pairings']);
  expect(state.unexpected).toEqual([]);
});

test('Mkoro distinguishes online legacy companions from delegation readiness', async ({ page }) => {
  const state = await mockMkoro(page);
  state.workers = [{ ...worker, capabilities: ['goose-acp'] }];
  await page.goto('/');
  await page.getByRole('button', { name: 'Mkoro computer settings' }).click();
  const settings = page.getByRole('dialog', { name: 'Mkoro computer', exact: true });
  await expect(
    settings.getByText('Connected — companion update required before delegation.'),
  ).toBeVisible();
  await expect(settings.getByText(/^Delegation ready/)).toHaveCount(0);
  state.workers = [worker];
  await settings.getByRole('button', { name: 'Refresh Mkoro status' }).click();
  await expect(settings.getByText(/^Delegation ready/)).toBeVisible();
  state.workerResponse = 'unavailable';
  await settings.getByRole('button', { name: 'Refresh Mkoro status' }).click();
  await expect(settings.getByText('Unverified', { exact: true })).toBeVisible();
  await expect(settings.getByText(/^Delegation ready/)).toHaveCount(0);
  expect(state.writes).toEqual([]);
});

test('Mkoro saves automatic approval per computer and can turn it off', async ({ page }) => {
  const state = await mockMkoro(page);
  state.workers = [worker];
  await page.goto('/');
  await page.getByRole('button', { name: 'Mkoro computer settings' }).click();
  const toggle = page.getByRole('checkbox', { name: /Automatically approve Mkoro tools/ });
  await expect(toggle).not.toBeChecked();
  // This control reflects the saved server value after the request and refresh.
  await toggle.click();
  await expect(toggle).toBeChecked();
  await page.reload();
  await page.getByRole('button', { name: 'Mkoro computer settings' }).click();
  await expect(toggle).toBeChecked();
  await toggle.click();
  await expect(toggle).not.toBeChecked();
  expect(state.writes.map((write) => write.body)).toEqual([
    { autoApprove: true },
    { autoApprove: false },
  ]);
  expect(state.unexpected).toEqual([]);
});

test('Mkoro explains missing screenshot uploads instead of waiting indefinitely', async ({
  page,
}) => {
  const state = await mockMkoro(page);
  await openTask(page, state);
  await page.getByRole('button', { name: 'View Mkoro’s computer' }).click();
  await expect(page.getByRole('region', { name: 'Mkoro desktop view' })).toContainText(
    'No screenshot has arrived.',
    { timeout: 25000 },
  );
  await expect(page.getByRole('region', { name: 'Mkoro desktop view' })).toContainText(
    'Check-MkoroScreen.cmd',
  );
  await expect(page.getByRole('img', { name: `Mkoro desktop on ${worker.name}` })).toHaveCount(0);
});

test('Mkoro requires confirmation before revoking and offers recovery afterward', async ({
  page,
}) => {
  const state = await mockMkoro(page);
  state.workers = [worker];
  const deletions: string[] = [];
  await page.route(`**/api/mkoro/workers/${workerId}`, (route) => {
    if (route.request().method() !== 'DELETE') return route.fallback();
    deletions.push(workerId);
    state.workers = [{ ...worker, status: 'revoked' }];
    return route.fulfill({ json: { ok: true } });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Mkoro computer settings' }).click();
  const settings = page.getByRole('dialog', { name: 'Mkoro computer', exact: true });
  const revoke = settings.getByRole('button', {
    name: `Revoke access to ${worker.name}`,
    exact: true,
  });
  await revoke.click();
  await expect(settings.getByRole('region', { name: 'Confirm revocation' })).toContainText(
    'requires a fresh code',
  );
  expect(deletions).toEqual([]);
  await settings.getByRole('button', { name: 'Keep connected', exact: true }).click();
  await expect(settings.getByRole('region', { name: 'Confirm revocation' })).toHaveCount(0);
  expect(deletions).toEqual([]);
  await revoke.click();
  await settings.getByRole('button', { name: 'Confirm revoke access', exact: true }).click();
  await expect(
    settings.getByRole('button', { name: `Reconnect ${worker.name}`, exact: true }),
  ).toBeVisible();
  expect(deletions).toEqual([workerId]);
  expect(state.unexpected).toEqual([]);
});

test('delegated task progress asks permission once and waits for stop confirmation in the Sina chat', async ({
  page,
}, testInfo) => {
  const state = await mockMkoro(page);
  await openTask(page, state);
  await expect(
    page.getByRole('region', { name: 'Saved chat recovery' }).getByRole('alert'),
  ).toContainText('Sina is unavailable');
  const turn = page.getByRole('article', { name: 'Mkoro delegated task' });
  await expect(turn).toContainText('Delegated by Sina');
  await expect(turn).toContainText('Inspecting the synthetic folder.');
  state.events.push(
    event(2, 'tool_started', { toolCallId: 'list-files', title: 'List synthetic files' }),
  );
  await page.getByRole('button', { name: 'Refresh Mkoro task progress' }).click();
  await expect(turn.locator('summary').filter({ hasText: 'List synthetic files' })).toContainText(
    'in progress',
  );
  state.events.push(
    event(3, 'tool_finished', {
      toolCallId: 'list-files',
      status: 'completed',
      content: [{ type: 'content', content: { type: 'text', text: 'Found synthetic-report.txt' } }],
    }),
  );
  const permission = {
    taskId,
    requestId: 'permission-1',
    toolCall: { title: 'Read synthetic-report.txt', toolCallId: 'read-report' },
    options: [
      { optionId: 'allow-one', name: 'Allow once', kind: 'allow_once' as const },
      { optionId: 'allow-forever', name: 'Always allow', kind: 'allow_always' as const },
      { optionId: 'reject-one', name: 'Reject once', kind: 'reject_once' as const },
    ],
  };
  state.pendingPermissions = [permission];
  state.events.push(event(4, 'permission_required', permission));
  state.tasks[0].status = 'waiting_permission';
  await page.getByRole('button', { name: 'Refresh Mkoro task progress' }).click();
  const request = page.getByRole('group', { name: 'Mkoro permission request' });
  await expect(request).toContainText('Read synthetic-report.txt');
  const fileTool = turn
    .locator('details')
    .filter({ has: page.locator('summary').filter({ hasText: 'List synthetic files' }) });
  await expect(fileTool.locator('summary')).toContainText('completed');
  await fileTool.locator('summary').click();
  await expect(fileTool).toContainText('Found synthetic-report.txt');
  await expect(request.getByRole('button', { name: 'Always allow' })).toHaveCount(0);
  await request.getByRole('button', { name: 'Allow once', exact: true }).click();
  await expect(request).toHaveCount(0);
  expect(state.writes.filter((write) => write.path.endsWith('/permission'))).toEqual([
    {
      path: `/api/mkoro/tasks/${taskId}/permission`,
      body: { requestId: 'permission-1', optionId: 'allow-one' },
    },
  ]);
  await page.getByRole('button', { name: 'Stop Mkoro task', exact: true }).click();
  await expect(turn).toContainText('Stop requested. Waiting for the computer to confirm.');
  await expect(page.getByRole('button', { name: 'Stopping…', exact: true })).toBeDisabled();
  state.tasks[0].status = 'cancelled';
  await page.getByRole('button', { name: 'Refresh Mkoro task progress' }).click();
  await expect(turn).toContainText('Stopped. Actions already performed have not been undone.');
  await testInfo.attach('Unified Sina and Mkoro progress', {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png',
  });
  expect(state.writes.filter((write) => write.path.endsWith('/cancel'))).toHaveLength(1);
  expect(
    state.writes.some(
      (write) => write.path.includes('/messages') || write.path === '/api/mkoro/delegations',
    ),
  ).toBe(false);
  expect(state.unexpected).toEqual([]);
});

test('desktop screenshots are opt-in, refresh, discard errors and stop on close and hidden views', async ({
  page,
}, testInfo) => {
  const state = await mockMkoro(page);
  await openTask(page, state);
  state.screenshot = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 20;
    canvas.height = 12;
    const context = canvas.getContext('2d')!;
    context.fillStyle = '#2368a6';
    context.fillRect(0, 0, 20, 12);
    return canvas.toDataURL('image/jpeg').split(',')[1];
  });
  expect(state.screenReads).toBe(0);
  await page.getByRole('button', { name: 'View Mkoro’s computer', exact: true }).click();
  const view = page.getByRole('region', { name: 'Mkoro desktop view' });
  const image = view.getByRole('img', { name: 'Mkoro desktop on Synthetic test computer' });
  await expect(image).toBeVisible();
  await expect(image).toHaveAttribute('src', `data:image/jpeg;base64,${state.screenshot}`);
  await expect.poll(() => state.screenReads).toBeGreaterThan(1);
  await testInfo.attach('Mkoro desktop screenshot in chat', {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png',
  });
  expect(state.chatWrites.join(' ')).not.toContain(state.screenshot);
  expect(state.modelRequests.join(' ')).not.toContain(state.screenshot);
  state.screenError = 'Synthetic desktop session is locked.';
  await expect(view).toContainText(state.screenError);
  await expect(image).toHaveCount(0);
  state.screenError = '';
  await expect(image).toBeVisible();
  await expect
    .poll(
      () =>
        state.writes.filter(
          (write) => write.path.endsWith('/screen-view') && write.body.enabled === true,
        ).length,
    )
    .toBeGreaterThan(1);
  await page.getByRole('button', { name: 'Close desktop view', exact: true }).click();
  await expect(view).toHaveCount(0);
  await expect.poll(() => state.screenEnabled).toBe(false);
  const closedReads = state.screenReads;
  await page.waitForTimeout(2400);
  expect(state.screenReads).toBe(closedReads);
  await page.getByRole('button', { name: 'View Mkoro’s computer', exact: true }).click();
  await expect(image).toBeVisible();
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(image).toHaveCount(0);
  await expect.poll(() => state.screenEnabled).toBe(false);
  const hiddenReads = state.screenReads;
  await page.waitForTimeout(2400);
  expect(state.screenReads).toBe(hiddenReads);
  expect(state.unexpected).toEqual([]);
});

test('screenshots reject stale or wrong-task frames and disappear when the task finishes', async ({
  page,
}) => {
  const state = await mockMkoro(page);
  await openTask(page, state);
  state.screenshot = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 20;
    canvas.height = 12;
    return canvas.toDataURL('image/jpeg').split(',')[1];
  });
  state.capturedAt = new Date(Date.now() - 60_000).toISOString();
  await page.getByRole('button', { name: 'View Mkoro’s computer', exact: true }).click();
  const view = page.getByRole('region', { name: 'Mkoro desktop view' });
  await expect.poll(() => state.screenReads).toBeGreaterThan(0);
  await expect(view.getByRole('img')).toHaveCount(0);
  state.capturedAt = '';
  state.wrongTaskFrame = true;
  await expect(view).toContainText('The screenshot did not belong to this task.');
  await expect(view.getByRole('img')).toHaveCount(0);
  state.wrongTaskFrame = false;
  await view.getByRole('button', { name: 'Retry desktop view', exact: true }).click();
  await expect(view.getByRole('img')).toBeVisible();
  state.tasks[0].status = 'completed';
  await expect(view.getByRole('img')).toHaveCount(0);
  await expect.poll(() => state.screenEnabled).toBe(false);
  expect(state.unexpected).toEqual([]);
});

test('revoked screen access pauses renewal until explicit retry and Stop ends the preview', async ({
  page,
}) => {
  const state = await mockMkoro(page);
  await openTask(page, state);
  state.screenshot = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 20;
    canvas.height = 12;
    return canvas.toDataURL('image/jpeg').split(',')[1];
  });
  await page.getByRole('button', { name: 'View Mkoro’s computer', exact: true }).click();
  const view = page.getByRole('region', { name: 'Mkoro desktop view' });
  await expect(view.getByRole('img')).toBeVisible();
  state.screenDenied = true;
  await expect(view).toContainText('Synthetic screen access was revoked.');
  await expect(view.getByRole('img')).toHaveCount(0);
  await expect.poll(() => state.screenEnabled).toBe(false);
  const reads = state.screenReads;
  const renewals = state.writes.filter(
    (write) => write.path.endsWith('/screen-view') && write.body.enabled === true,
  ).length;
  await page.waitForTimeout(5200);
  expect(state.screenReads).toBe(reads);
  expect(
    state.writes.filter(
      (write) => write.path.endsWith('/screen-view') && write.body.enabled === true,
    ),
  ).toHaveLength(renewals);
  state.screenDenied = false;
  await view.getByRole('button', { name: 'Retry desktop view', exact: true }).click();
  await expect(view.getByRole('img')).toBeVisible();
  await page.getByRole('button', { name: 'Stop Mkoro task', exact: true }).click();
  await expect(view.getByRole('img')).toHaveCount(0);
  await expect.poll(() => state.screenEnabled).toBe(false);
  expect(state.unexpected).toEqual([]);
});

for (const failure of ['malformed', 'unavailable'] as const) {
  test(`Mkoro disables computer actions after ${failure} status without losing Sina's draft`, async ({
    page,
  }) => {
    // Isolate the computer-service failure while keeping the draft's chat ready.
    const state = await mockMkoro(page, { modelReady: true });
    await openTask(page, state);
    const draft = page.locator('.lc-console').getByRole('textbox');
    await draft.fill('Keep this request during an outage.');
    state.workerResponse = failure;
    await page.getByRole('button', { name: 'Refresh Mkoro task progress' }).click();
    await expect(page.getByRole('button', { name: 'Stop Mkoro task' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'View Mkoro’s computer' })).toBeDisabled();
    await expect(page.locator('.mkoro-chat-tasks').getByRole('alert')).toBeVisible();
    await expect(draft).toHaveValue('Keep this request during an outage.');
    expect(state.writes).toEqual([]);
    state.workerResponse = 'valid';
    await page.getByRole('button', { name: 'Refresh Mkoro task progress' }).click();
    await expect(page.getByRole('button', { name: 'Stop Mkoro task' })).toBeEnabled();
    expect(state.unexpected).toEqual([]);
  });
}

test('an existing legacy task retains one-time permission and Stop without a new computer composer', async ({
  page,
}) => {
  const state = await mockMkoro(page);
  state.workers = [worker];
  state.conversations = [{ ...conversation, threadId: null }];
  state.tasks = [task({ status: 'waiting_permission', delegation: null })];
  state.pendingPermissions = [
    {
      taskId,
      requestId: 'legacy-permission',
      toolCall: { title: 'Read the existing legacy file' },
      options: [{ optionId: 'legacy-allow', name: 'Allow once', kind: 'allow_once' }],
    },
  ];
  await page.goto('/');
  await page.getByRole('button', { name: 'Mkoro computer settings' }).click();
  const settings = page.getByRole('dialog', { name: 'Mkoro computer', exact: true });
  await settings.getByText('Computer task history', { exact: true }).click();
  await settings
    .getByRole('combobox', { name: 'Saved computer conversations' })
    .selectOption(conversationId);
  await expect(settings).toContainText(
    'No new messages; existing tasks can still be stopped or approved.',
  );
  const permission = settings.getByRole('group', { name: 'Mkoro permission request' });
  await expect(permission).toContainText('Read the existing legacy file');
  await permission.getByRole('button', { name: 'Allow once', exact: true }).click();
  await expect(permission).toHaveCount(0);
  await settings.getByRole('button', { name: 'Stop Mkoro task', exact: true }).click();
  await expect(settings.getByRole('button', { name: 'Stopping…', exact: true })).toBeDisabled();
  state.tasks[0].status = 'cancelled';
  await expect(settings.getByRole('article', { name: 'Mkoro conversation turn' })).toContainText(
    'Stopped. Actions already performed have not been undone.',
  );
  await expect(settings.getByRole('textbox', { name: 'Message Mkoro' })).toHaveCount(0);
  await expect(settings.getByRole('button', { name: 'View Mkoro’s computer' })).toHaveCount(0);
  expect(state.writes).toEqual([
    {
      path: `/api/mkoro/tasks/${taskId}/permission`,
      body: { requestId: 'legacy-permission', optionId: 'legacy-allow' },
    },
    { path: `/api/mkoro/tasks/${taskId}/cancel`, body: {} },
  ]);
  expect(state.modelRequests).toEqual([]);
  expect(state.unexpected).toEqual([]);
});

test('computer task history can stop a bound task after its Sina chat is no longer listed', async ({
  page,
}) => {
  const state = await mockMkoro(page);
  state.workers = [worker];
  state.conversations = [{ ...conversation, threadId: 'deleted-sina-thread' }];
  state.tasks = [task()];
  await page.goto('/');
  await page.getByRole('button', { name: 'Mkoro computer settings' }).click();
  const settings = page.getByRole('dialog', { name: 'Mkoro computer', exact: true });
  await settings.getByText('Computer task history', { exact: true }).click();
  await settings
    .getByRole('combobox', { name: 'Saved computer conversations' })
    .selectOption(conversationId);
  await expect(settings.getByRole('article', { name: 'Mkoro delegated task' })).toContainText(
    task().message,
  );
  await settings.getByRole('button', { name: 'Stop Mkoro task', exact: true }).click();
  await expect(settings.getByRole('button', { name: 'Stopping…', exact: true })).toBeDisabled();
  await expect(settings.getByRole('button', { name: 'View Mkoro’s computer' })).toHaveCount(0);
  await expect(settings.getByRole('button', { name: 'Ask Sina about this result' })).toHaveCount(0);
  await expect(settings.getByRole('textbox', { name: 'Message Mkoro' })).toHaveCount(0);
  expect(state.writes).toEqual([{ path: `/api/mkoro/tasks/${taskId}/cancel`, body: {} }]);
  expect(state.modelRequests).toEqual([]);
  expect(state.unexpected).toEqual([]);
});

test('task history stays bound to its Sina chat and completed legacy history does not start new tasks', async ({
  page,
}) => {
  const state = await mockMkoro(page);
  await openTask(page, state);
  await page.getByTitle('Another Sina chat', { exact: true }).click();
  await expect(page.getByRole('article', { name: 'Mkoro delegated task' })).toHaveCount(0);
  await page.getByTitle('Computer task test', { exact: true }).click();
  await expect(page.getByRole('article', { name: 'Mkoro delegated task' })).toBeVisible();
  state.conversations = [{ ...conversation, threadId: null }];
  state.tasks = [task({ status: 'completed', delegation: null })];
  state.events = [event(1, 'message', { text: 'The older report was saved on your computer.' })];
  await page.getByRole('button', { name: 'Mkoro computer settings' }).click();
  const settings = page.getByRole('dialog', { name: 'Mkoro computer', exact: true });
  await settings.getByText('Computer task history', { exact: true }).click();
  await settings
    .getByRole('combobox', { name: 'Saved computer conversations' })
    .selectOption(conversationId);
  await expect(settings.getByRole('article', { name: 'Mkoro conversation turn' })).toContainText(
    'The older report was saved on your computer.',
  );
  await expect(settings.getByRole('textbox', { name: 'Message Mkoro' })).toHaveCount(0);
  await expect(settings.getByRole('button', { name: 'Stop Mkoro task' })).toHaveCount(0);
  await expect(settings.getByRole('button', { name: 'View Mkoro’s computer' })).toHaveCount(0);
  await settings.getByRole('button', { name: 'Close', exact: true }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Mkoro computer settings' }).click();
  await settings.getByText('Computer task history', { exact: true }).click();
  await settings
    .getByRole('combobox', { name: 'Saved computer conversations' })
    .selectOption(conversationId);
  await expect(settings.getByRole('article', { name: 'Mkoro conversation turn' })).toContainText(
    'The older report was saved on your computer.',
  );
  expect(state.writes).toEqual([]);
  expect(state.unexpected).toEqual([]);
});
