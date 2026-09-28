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
const timestamp = '2026-09-28T12:00:00.000Z';
const worker: MkoroWorker = {
  id: workerId,
  name: 'Synthetic test computer',
  capabilities: ['goose-acp'],
  status: 'online',
  lastSeenAt: timestamp,
  createdAt: timestamp,
};
const conversation: MkoroConversation = {
  id: conversationId,
  workerId,
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
    status: 'running',
    cancelRequested: false,
    connectionLost: false,
    error: null,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides,
  };
}

async function mockWorkspaceReads(page: Page) {
  await page.route('**/api/documents**', (route) => route.fulfill({ json: { documents: [] } }));
  await page.route('**/api/integrations**', (route) => route.fulfill({ json: [] }));
  await page.route('**/api/chat/threads**', (route) => route.fulfill({ json: { threads: [] } }));
  // These tests never invoke Sina or any real model provider.
  await page.route('**/api/copilotkit**', (route) =>
    route.fulfill({ status: 503, json: { error: 'Models are disabled in this synthetic test.' } }),
  );
}

async function mockMkoro(page: Page) {
  await mockWorkspaceReads(page);
  const state = {
    workers: [] as MkoroWorker[],
    conversations: [] as MkoroConversation[],
    tasks: [] as MkoroTask[],
    events: [] as MkoroEvent[],
    pendingPermissions: [] as (typeof MkoroPendingPermissionSchema._output)[],
    workerResponse: 'valid' as 'valid' | 'malformed' | 'unavailable',
    writes: [] as { path: string; body: Record<string, unknown> }[],
    unexpected: [] as string[],
  };
  // Every Mkoro endpoint, including worker endpoints, is intercepted. No Goose
  // process, personal computer, live provider or server write participates.
  await page.route('**/api/mkoro**', async (route) => {
    const request = route.request();
    const pathname = new URL(request.url()).pathname;
    const method = request.method();
    if (method === 'GET' && pathname === '/api/mkoro/workers') {
      if (state.workerResponse === 'unavailable') {
        await route.fulfill({
          status: 503,
          json: { error: 'Synthetic Mkoro service unavailable.' },
        });
      } else {
        await route.fulfill({
          json:
            state.workerResponse === 'malformed'
              ? { workers: [{ ...worker, status: 'invented-status' }] }
              : { workers: state.workers },
        });
      }
      return;
    }
    if (method === 'GET' && pathname === '/api/mkoro/conversations') {
      await route.fulfill({ json: { conversations: state.conversations } });
      return;
    }
    if (method === 'GET' && pathname === `/api/mkoro/conversations/${conversationId}`) {
      await route.fulfill({
        json: {
          conversation,
          tasks: state.tasks,
          events: state.events,
          eventsTruncated: false,
          tasksTruncated: false,
          pendingPermissions: state.pendingPermissions,
        },
      });
      return;
    }
    if (method === 'POST') {
      const body: Record<string, unknown> = request.postDataJSON();
      state.writes.push({ path: pathname, body });
      if (pathname === '/api/mkoro/pairings') {
        await route.fulfill({
          json: {
            pairingToken: 'synthetic-pairing-token-for-browser-test-only',
            expiresAt: '2099-01-01T00:00:00.000Z',
          },
        });
        return;
      }
      if (pathname === '/api/mkoro/conversations') {
        state.conversations = [conversation];
        await route.fulfill({ json: { conversation } });
        return;
      }
      if (pathname === `/api/mkoro/conversations/${conversationId}/messages`) {
        const submitted = task({
          message: String(body.message),
          requestId: String(body.requestId),
        });
        state.tasks = [submitted];
        state.events = [event(1, 'message_delta', { text: 'Inspecting the synthetic folder.' })];
        await route.fulfill({ json: { task: submitted } });
        return;
      }
      if (pathname === `/api/mkoro/tasks/${taskId}/permission`) {
        state.tasks = state.tasks.map((item) => ({ ...item, status: 'running' }));
        state.pendingPermissions = [];
        await route.fulfill({ json: { ok: true } });
        return;
      }
      if (pathname === `/api/mkoro/tasks/${taskId}/cancel`) {
        state.tasks = state.tasks.map((item) => ({ ...item, cancelRequested: true }));
        await route.fulfill({ json: { ok: true } });
        return;
      }
    }
    state.unexpected.push(`${method} ${pathname}`);
    await route.fulfill({ status: 500, json: { error: 'Unmocked Mkoro operation blocked.' } });
  });
  return state;
}

async function openMkoro(page: Page) {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Mkoro', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Mkoro chat' })).toBeVisible();
}

test('switching between Sina and offline Mkoro preserves drafts and offers pairing', async ({
  page,
}) => {
  const state = await mockMkoro(page);
  await page.goto('/');
  const sinaDraft = page.locator('.lc-console').getByRole('textbox');
  await sinaDraft.fill('Keep this unsent Sina request.');
  await page.getByRole('tab', { name: 'Mkoro', exact: true }).click();
  await expect(page.getByText('No computer connected', { exact: true })).toBeVisible();
  const mkoroDraft = page.getByRole('textbox', { name: 'Message Mkoro' });
  await mkoroDraft.fill('Keep this unsent computer task.');
  await expect(page.getByRole('button', { name: 'Send to Mkoro' })).toBeDisabled();
  await mkoroDraft.press('Enter');
  expect(state.writes).toEqual([]);
  await page.getByRole('button', { name: 'Connect your computer', exact: true }).click();
  const pairing = page.getByRole('region', { name: 'Pair your computer' });
  await expect(pairing).toBeVisible();
  await expect(pairing.getByRole('textbox', { name: 'Pairing code' })).toHaveValue(
    'synthetic-pairing-token-for-browser-test-only',
  );
  await expect(pairing).toContainText('node scripts/mkoro/companion.mjs');
  await expect(pairing).toContainText('Single use');
  await page.getByRole('tab', { name: 'Sina', exact: true }).click();
  await expect(sinaDraft).toBeVisible();
  await expect(sinaDraft).toHaveValue('Keep this unsent Sina request.');
  await page.getByRole('tab', { name: 'Mkoro', exact: true }).click();
  await expect(mkoroDraft).toHaveValue('Keep this unsent computer task.');
  await expect(page.getByRole('button', { name: 'Send to Mkoro' })).toBeDisabled();
  expect(state.writes.map((write) => write.path)).toEqual(['/api/mkoro/pairings']);
  expect(state.unexpected).toEqual([]);
});

test('Mkoro shows tool progress, requests permission once and waits for stop confirmation', async ({
  page,
}, testInfo) => {
  const state = await mockMkoro(page);
  state.workers = [worker];
  await openMkoro(page);
  await page.getByRole('textbox', { name: 'Message Mkoro' }).fill(task().message);
  await page.getByRole('button', { name: 'Send to Mkoro' }).click();
  const turn = page.getByRole('article', { name: 'Mkoro conversation turn' });
  await expect(turn).toContainText('Inspecting the synthetic folder.');
  await expect(page.getByRole('textbox', { name: 'Message Mkoro' })).toHaveValue('');
  expect(state.writes[0]).toEqual({
    path: '/api/mkoro/conversations',
    body: { workerId, title: task().message },
  });
  expect(state.writes[1].body.message).toBe(task().message);
  expect(state.writes[1].body.requestId).toMatch(
    /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i,
  );

  state.events.push(
    event(2, 'tool_started', { toolCallId: 'list-files', title: 'List synthetic files' }),
  );
  await page.getByRole('button', { name: 'Refresh Mkoro status' }).click();
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
  const pendingPermission: typeof MkoroPendingPermissionSchema._output = {
    taskId,
    requestId: 'permission-1',
    toolCall: { title: 'Read synthetic-report.txt', toolCallId: 'read-report' },
    options: [
      { optionId: 'allow-one', name: 'Allow once', kind: 'allow_once' },
      { optionId: 'allow-forever', name: 'Always allow', kind: 'allow_always' },
      { optionId: 'reject-one', name: 'Reject once', kind: 'reject_once' },
    ],
  };
  state.pendingPermissions = [pendingPermission];
  state.events.push(event(4, 'permission_required', pendingPermission));
  state.tasks[0].status = 'waiting_permission';
  await page.getByRole('button', { name: 'Refresh Mkoro status' }).click();
  const tool = turn
    .locator('details')
    .filter({ has: page.locator('summary').filter({ hasText: 'List synthetic files' }) });
  await expect(tool.locator('summary')).toContainText('completed');
  await tool.locator('summary').click();
  await expect(tool).toContainText('Found synthetic-report.txt');
  const permission = page.getByRole('group', { name: 'Mkoro permission request' });
  await expect(permission).toContainText('Read synthetic-report.txt');
  await expect(permission.getByRole('button', { name: 'Always allow' })).toHaveCount(0);
  await page.setViewportSize({ width: 1440, height: 1000 });
  const screenshot = testInfo.outputPath('mkoro-online-permission.png');
  await page.screenshot({ path: screenshot, fullPage: true });
  await testInfo.attach('Mkoro online transcript and permission', {
    path: screenshot,
    contentType: 'image/png',
  });
  await permission.getByRole('button', { name: 'Allow once', exact: true }).click();
  await expect(permission).toHaveCount(0);
  expect(state.writes.filter((write) => write.path.endsWith('/permission'))).toEqual([
    {
      path: `/api/mkoro/tasks/${taskId}/permission`,
      body: { requestId: 'permission-1', optionId: 'allow-one' },
    },
  ]);

  await page.getByRole('button', { name: 'Stop', exact: true }).click();
  await expect(turn).toContainText('Stop requested. Waiting for the computer to confirm.');
  await expect(page.getByRole('button', { name: 'Stopping…', exact: true })).toBeDisabled();
  await expect(turn).not.toContainText('Stopped. Actions already performed');
  state.tasks[0].status = 'cancelled';
  await page.getByRole('button', { name: 'Refresh Mkoro status' }).click();
  await expect(turn).toContainText('Stopped. Actions already performed have not been undone.');
  expect(state.writes.filter((write) => write.path.endsWith('/cancel'))).toHaveLength(1);
  expect(state.writes.filter((write) => write.path.endsWith('/messages'))).toHaveLength(1);
  expect(state.unexpected).toEqual([]);
});

for (const failure of ['malformed', 'unavailable'] as const) {
  test(`Mkoro blocks sends after ${failure} status even with a previously online computer`, async ({
    page,
  }) => {
    const state = await mockMkoro(page);
    state.workers = [worker];
    await openMkoro(page);
    const draft = page.getByRole('textbox', { name: 'Message Mkoro' });
    await draft.fill('Do not lose this task during an outage.');
    const send = page.getByRole('button', { name: 'Send to Mkoro' });
    await expect(send).toBeEnabled();
    state.workerResponse = failure;
    await page.getByRole('button', { name: 'Refresh Mkoro status' }).click();
    await expect(page.getByText('Unverified', { exact: true })).toBeVisible();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(send).toBeDisabled();
    await draft.press('Enter');
    await expect(draft).toHaveValue('Do not lose this task during an outage.');
    expect(state.writes).toEqual([]);
    state.workerResponse = 'valid';
    await page.getByRole('button', { name: 'Check again', exact: true }).click();
    await expect(page.getByRole('alert')).toHaveCount(0);
    await expect(send).toBeEnabled();
    expect(state.unexpected).toEqual([]);
  });
}

test('saved Mkoro conversation survives reload without repeating an old computer task', async ({
  page,
}) => {
  const state = await mockMkoro(page);
  state.workers = [{ ...worker, status: 'offline' }];
  state.conversations = [conversation];
  state.tasks = [task({ status: 'completed' })];
  state.events = [
    event(1, 'message', { text: 'The synthetic report was saved on your computer.' }),
  ];
  await openMkoro(page);
  await page.getByText('Computer connection and chat history', { exact: true }).click();
  await page.getByRole('combobox', { name: 'Saved Mkoro chats' }).selectOption(conversationId);
  await expect(page.getByRole('article', { name: 'Mkoro conversation turn' })).toContainText(
    'The synthetic report was saved on your computer.',
  );
  await page.reload();
  await expect(page.getByRole('tab', { name: 'Mkoro', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.getByRole('article', { name: 'Mkoro conversation turn' })).toContainText(
    'The synthetic report was saved on your computer.',
  );
  await page
    .getByRole('textbox', { name: 'Message Mkoro' })
    .fill('A new task must wait for the computer.');
  await expect(page.getByRole('button', { name: 'Send to Mkoro' })).toBeDisabled();
  expect(state.writes).toEqual([]);
  expect(state.unexpected).toEqual([]);
});
