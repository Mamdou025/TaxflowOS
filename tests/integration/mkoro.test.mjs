import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createTestRun } from '../../scripts/testing/runtime.mjs';
import { startTestStack } from '../../scripts/testing/stack.mjs';
import { createAccount, createWorkspace, setMember } from './access-fixtures.mjs';

const run = createTestRun('mkoro');
let stack, owner, editor, viewer, workspace, other;
before(
  async () => {
    stack = await startTestStack(run);
    owner = await createAccount(stack, 'Mkoro owner');
    editor = await createAccount(stack, 'Mkoro editor');
    viewer = await createAccount(stack, 'Mkoro viewer');
    workspace = await createWorkspace(owner);
    other = await createWorkspace(owner, 'Other workspace');
    await setMember(owner, workspace, editor, 'editor');
    await setMember(owner, workspace, viewer, 'viewer');
  },
  { timeout: 240000 },
);
after(() => run.close());

const request = (path, body, method = 'POST', account = owner, ws = workspace) =>
  account.request('/mkoro' + path, { workspace: ws, method, body });
const workerRequest = (path, body, token) =>
  fetch(stack.baseURL + '/api/mkoro-worker' + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(20000),
  });
async function json(response, expected = 200) {
  assert.equal(response.status, expected, await response.clone().text());
  return response.json();
}
async function pair(account = owner) {
  const code = await json(await request('/pairings', {}, 'POST', account), 201);
  const companion = await json(
    await workerRequest('/pair', {
      pairingToken: code.pairingToken,
      name: 'Synthetic companion',
      capabilities: ['sina-delegation-v1', 'desktop-screenshots-v1'],
    }),
    201,
  );
  return { ...companion, code };
}
async function conversation(companion) {
  const response = await json(
    await owner.request('/chat/threads', {
      workspace,
      method: 'POST',
      body: { title: 'Synthetic Sina delegation' },
    }),
    201,
  );
  return { id: null, threadId: response.thread.id, workerId: companion.workerId };
}
const delegation = (chat, message = 'Read the synthetic fixture', requestId = randomUUID()) => ({
  threadId: chat.threadId,
  workerId: chat.workerId,
  requestId,
  taskType: 'local_file',
  target: 'synthetic-fixtures',
  objective: message,
  expectedOutput: 'Report the fixture name.',
  reasonNoPlatformTool: 'The file exists only on this computer.',
});
async function message(chat, text = 'Read the synthetic fixture') {
  const input = delegation(chat, text);
  const response = await json(await request('/delegations', input), 202);
  chat.id = response.conversation.id;
  return { task: response.task, requestId: input.requestId };
}
const event = (task, seq, type, payload = {}) => ({
  id: randomUUID(),
  taskId: task.id,
  seq,
  type,
  payload,
});

test('cookie APIs deny unauthenticated and Viewer writes, including case and trailing slash variants', async () => {
  assert.equal((await fetch(stack.baseURL + '/api/mkoro/workers')).status, 401);
  for (const path of [
    '/pairings',
    '/PAIRINGS/',
    '/conversations',
    '/CONVERSATIONS/',
    '/delegations',
    '/DELEGATIONS/',
    `/tasks/${randomUUID()}/screen-view`,
    `/TASKS/${randomUUID()}/SCREEN-VIEW/`,
    `/tasks/${randomUUID()}/cancel`,
    `/CONVERSATIONS/${randomUUID()}/MESSAGES/`,
    `/TASKS/${randomUUID()}/PERMISSION/`,
  ]) {
    assert.equal((await request(path, {}, 'POST', viewer)).status, 403, path);
  }
  assert.equal(
    (await request(`/WORKERS/${randomUUID()}/`, undefined, 'DELETE', viewer)).status,
    403,
  );
  assert.equal((await request('/workers', undefined, 'GET', editor, other)).status, 403);
  assert.equal((await workerRequest('/poll', {}, 'forged-token')).status, 401);
  assert.equal((await workerRequest('/POLL/', {}, 'forged-token')).status, 401);
  for (const method of ['GET', 'HEAD'])
    for (const path of [`/tasks/${randomUUID()}/screen`, `/TASKS/${randomUUID()}/SCREEN/`])
      assert.equal((await request(path, undefined, method, viewer)).status, 403);
});

test('pairing is single-use and expired codes fail; stored credentials are hashes', async () => {
  const companion = await pair();
  assert.equal(
    (await workerRequest('/pair', { pairingToken: companion.code.pairingToken, name: 'Replay' }))
      .status,
    401,
  );
  const expired = await json(await request('/pairings', {}), 201);
  await stack.db.query(
    "UPDATE mkoro_pairings SET expires_at=now()-interval '1 second' WHERE used_at IS NULL",
  );
  assert.equal(
    (await workerRequest('/pair', { pairingToken: expired.pairingToken, name: 'Expired' })).status,
    401,
  );
  const { rows } = await stack.db.query('SELECT token_hash FROM mkoro_workers WHERE id=$1', [
    companion.workerId,
  ]);
  assert.match(rows[0].token_hash, /^[a-f0-9]{64}$/);
  assert.notEqual(rows[0].token_hash, companion.token);
});

test('personal workers and chats are inaccessible to another member or workspace', async () => {
  const companion = await pair();
  const chat = await conversation(companion);
  await message(chat);
  assert.equal((await request(`/conversations/${chat.id}`, undefined, 'GET', editor)).status, 404);
  assert.equal(
    (await request(`/conversations/${chat.id}`, undefined, 'GET', owner, other)).status,
    404,
  );
  assert.equal(
    (await request(`/workers/${companion.workerId}`, undefined, 'DELETE', editor)).status,
    404,
  );
  const workers = await json(await request('/workers', undefined, 'GET', editor));
  assert.equal(
    workers.workers.some((item) => item.id === companion.workerId),
    false,
  );
});

test('message delivery is claim-once, idempotent, bounded to one active task and persists events across restart', async () => {
  const companion = await pair();
  const chat = await conversation(companion);
  const { task, requestId } = await message(chat);
  const replay = await json(
    await request('/delegations', delegation(chat, task.message, requestId)),
    202,
  );
  assert.equal(replay.task.id, task.id);
  assert.equal((await request('/delegations', delegation(chat, 'Changed', requestId))).status, 409);
  assert.equal((await request('/delegations', delegation(chat, 'Another'))).status, 409);
  const commands = await json(await workerRequest('/poll', {}, companion.token));
  assert.equal(commands.commands.length, 1);
  assert.equal(commands.commands[0].taskId, task.id);
  assert.equal(commands.commands[0].payload.conversationId, chat.id);
  assert.deepEqual((await json(await workerRequest('/poll', {}, companion.token))).commands, []);
  const events = [
    event(task, 0, 'task_started'),
    event(task, 1, 'message_delta', { text: 'Verified synthetic output.' }),
    event(task, 2, 'task_completed', { stopReason: 'end_turn' }),
  ];
  assert.equal(
    (await json(await workerRequest('/events', { events }, companion.token))).accepted,
    3,
  );
  assert.equal(
    (await json(await workerRequest('/events', { events }, companion.token))).accepted,
    3,
  );
  assert.equal(
    (
      await workerRequest(
        '/events',
        { events: [{ ...events[1], payload: { text: 'Changed' } }] },
        companion.token,
      )
    ).status,
    409,
  );
  await stack.restartApi();
  const detail = await json(await request(`/conversations/${chat.id}`, undefined, 'GET'));
  assert.equal(detail.tasks[0].status, 'completed');
  assert.equal(detail.events.length, 3);
  assert.equal(detail.events[1].payload.text, 'Verified synthetic output.');
  assert.deepEqual((await json(await workerRequest('/poll', {}, companion.token))).commands, []);
});

test('permission choices are task-bound, one-time, offered options; foreign events are denied', async () => {
  const companion = await pair();
  const foreign = await pair(editor);
  const chat = await conversation(companion);
  const { task } = await message(chat);
  await json(await workerRequest('/poll', {}, companion.token));
  const events = [
    event(task, 0, 'task_started'),
    event(task, 1, 'permission_required', {
      requestId: 'permission-1',
      toolCall: { title: 'Read fixture' },
      options: [
        { optionId: 'yes', name: 'Allow once', kind: 'allow_once' },
        { optionId: 'always', name: 'Always', kind: 'allow_always' },
        { optionId: 'no', name: 'Deny', kind: 'reject_once' },
      ],
    }),
    event(task, 2, 'permission_required', {
      requestId: 'permission-2',
      toolCall: { title: 'Read another fixture' },
      options: [{ optionId: 'no', name: 'Deny', kind: 'reject_once' }],
    }),
  ];
  assert.equal((await workerRequest('/events', { events }, foreign.token)).status, 404);
  await json(await workerRequest('/events', { events }, companion.token));
  const pending = await json(await request(`/tasks/${task.id}/events`, undefined, 'GET'));
  assert.equal(pending.pendingPermissions.length, 2);
  const endpoint = `/tasks/${task.id}/permission`;
  assert.equal(
    (await request(endpoint, { requestId: 'permission-1', optionId: 'yes' }, 'POST', editor))
      .status,
    404,
  );
  assert.equal(
    (await request(endpoint, { requestId: 'permission-1', optionId: 'invented' })).status,
    400,
  );
  assert.equal(
    (await request(endpoint, { requestId: 'permission-1', optionId: 'always' })).status,
    400,
  );
  const first = await json(await request(endpoint, { requestId: 'permission-1', optionId: 'yes' }));
  assert.equal(first.task.status, 'waiting_permission');
  assert.equal(
    (await request(endpoint, { requestId: 'permission-1', optionId: 'yes' })).status,
    409,
  );
  const commands = (await json(await workerRequest('/poll', {}, companion.token))).commands;
  assert.equal(commands[0].type, 'permission');
  assert.equal(commands[0].payload.optionId, 'yes');
  const second = await json(await request(endpoint, { requestId: 'permission-2', optionId: 'no' }));
  assert.equal(second.task.status, 'running');
  const resolved = await json(await request(`/tasks/${task.id}/events`, undefined, 'GET'));
  assert.equal(resolved.pendingPermissions.length, 0);
  await json(
    await workerRequest('/events', { events: [event(task, 3, 'task_completed')] }, companion.token),
  );
});

test('long streamed responses retain earlier events through explicit pagination', async () => {
  const companion = await pair();
  const chat = await conversation(companion);
  const { task } = await message(chat);
  await json(await workerRequest('/poll', {}, companion.token));
  const events = [event(task, 0, 'task_started')];
  for (let i = 1; i <= 505; i++)
    events.push(event(task, i, 'message_delta', { text: `Part ${i}.` }));
  events.push(event(task, 506, 'task_completed'));
  for (let start = 0; start < events.length; start += 40)
    await json(
      await workerRequest('/events', { events: events.slice(start, start + 40) }, companion.token),
    );
  const latest = await json(await request(`/conversations/${chat.id}`, undefined, 'GET'));
  assert.equal(latest.events.length, 500);
  assert.equal(latest.eventsTruncated, true);
  const older = await json(
    await request(`/conversations/${chat.id}?before=${latest.events[0].cursor}`, undefined, 'GET'),
  );
  assert.equal(older.events.length, 7);
  assert.equal(older.eventsTruncated, false);
  assert.equal(older.events[1].payload.text, 'Part 1.');
  const tail = await json(await request(`/tasks/${task.id}/events?latest=true`, undefined, 'GET'));
  assert.equal(tail.events.length, 200);
  assert.equal(tail.events[0].seq, 307);
  assert.equal(tail.events.at(-2).payload.text, 'Part 505.');
  assert.equal(tail.events.at(-1).type, 'task_completed');
  assert.equal(tail.cursor, tail.events.at(-1).cursor);
  assert.equal(
    (await request(`/tasks/${task.id}/events?latest=true&after=0`, undefined, 'GET')).status,
    400,
  );
});

test('offline and revoked companions do not fabricate completion; cancellation is explicit', async () => {
  const companion = await pair();
  const chat = await conversation(companion);
  const { task } = await message(chat);
  await json(await request(`/tasks/${task.id}/cancel`, {}));
  assert.deepEqual((await json(await workerRequest('/poll', {}, companion.token))).commands, []);
  const next = (await message(chat)).task;
  await json(await workerRequest('/poll', {}, companion.token));
  await stack.db.query(
    "UPDATE mkoro_workers SET last_seen_at=now()-interval '2 minutes' WHERE id=$1",
    [companion.workerId],
  );
  const detail = await json(await request(`/tasks/${next.id}/events`, undefined, 'GET'));
  assert.equal(detail.task.connectionLost, true);
  assert.equal(detail.task.status, 'queued');
  await json(await request(`/tasks/${next.id}/cancel`, {}));
  const commands = (await json(await workerRequest('/poll', {}, companion.token))).commands;
  assert.equal(commands[0].type, 'cancel');
  await json(
    await workerRequest(
      '/events',
      {
        events: [
          event(next, 0, 'permission_required', {
            requestId: 'buffered-before-stop',
            options: [{ optionId: 'yes', name: 'Allow once', kind: 'allow_once' }],
          }),
        ],
      },
      companion.token,
    ),
  );
  const stopping = await json(await request(`/tasks/${next.id}/events`, undefined, 'GET'));
  assert.equal(stopping.task.cancelRequested, true);
  assert.deepEqual(stopping.pendingPermissions, []);
  assert.equal(
    (
      await request(`/tasks/${next.id}/permission`, {
        requestId: 'buffered-before-stop',
        optionId: 'yes',
      })
    ).status,
    409,
  );
  await json(
    await workerRequest('/events', { events: [event(next, 1, 'task_cancelled')] }, companion.token),
  );
  const stopped = await json(await request(`/tasks/${next.id}/events`, undefined, 'GET'));
  assert.equal(stopped.task.status, 'cancelled');
  await json(await request(`/workers/${companion.workerId}`, undefined, 'DELETE'));
  assert.equal((await workerRequest('/poll', {}, companion.token)).status, 401);
  assert.equal((await request('/delegations', delegation(chat, 'Cannot run'))).status, 409);
});

test('Sina delegation binds the exact thread and computer, rejects native work, and preserves personal scope', async () => {
  const companion = await pair();
  const second = await pair();
  const chat = await conversation(companion);
  const input = delegation(chat);
  assert.equal((await request('/delegations', { ...input, threadId: randomUUID() })).status, 404);
  assert.equal((await request('/delegations', { ...input, taskType: 'workflow' })).status, 400);
  assert.equal(
    (
      await request('/delegations', {
        ...input,
        taskType: 'browser',
        target: stack.origin + '/workflows',
      })
    ).status,
    400,
  );
  assert.equal(
    (await request('/delegations', { ...input, target: '/API/workflow-runs' })).status,
    400,
  );
  assert.equal(
    (await request('/delegations', { ...input, target: 'https://user:secret@example.invalid' }))
      .status,
    400,
  );
  assert.equal((await request('/delegations', input, 'POST', editor)).status, 404);
  assert.equal((await request('/delegations', input, 'POST', owner, other)).status, 404);
  const [first, replay] = await Promise.all([
    request('/delegations', input).then((response) => json(response, 202)),
    request('/delegations', input).then((response) => json(response, 202)),
  ]);
  assert.equal(first.task.id, replay.task.id);
  assert.equal(first.conversation.threadId, chat.threadId);
  assert.equal(first.task.delegation.expectedOutput, input.expectedOutput);
  assert.equal(
    (await request('/delegations', { ...input, workerId: second.workerId })).status,
    409,
  );
  assert.equal(
    (await request('/delegations', { ...input, expectedOutput: 'Changed expected output' })).status,
    409,
  );
  const own = await json(
    await request(`/threads/${chat.threadId}/conversations`, undefined, 'GET'),
  );
  assert.equal(own.conversations[0].id, first.conversation.id);
  const member = await json(
    await request(`/THREADS/${chat.threadId}/CONVERSATIONS/`, undefined, 'GET', editor),
  );
  assert.deepEqual(member.conversations, []);
  assert.equal(
    (await request(`/threads/${chat.threadId}/conversations`, undefined, 'GET', owner, other))
      .status,
    404,
  );
  const commands = (await json(await workerRequest('/poll', {}, companion.token))).commands;
  assert.equal(commands.length, 1);
  assert.equal(commands[0].payload.threadId, chat.threadId);
  assert.equal(commands[0].payload.platformOrigin, stack.origin);
  assert.deepEqual(commands[0].payload.delegation, first.task.delegation);
  const native = await fetch(stack.baseURL + '/api/workflow-runs', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + companion.token, 'Content-Type': 'application/json' },
    body: '{}',
  });
  assert.equal(native.status, 401, 'companion credentials are not platform command grants');
});

test('old companions must advertise the new boundary; legacy chats stay readable without accepting direct messages', async () => {
  const companion = await pair();
  const chat = await conversation(companion);
  await json(await workerRequest('/poll', { capabilities: ['acp'] }, companion.token));
  assert.equal((await request('/delegations', delegation(chat))).status, 409);
  await json(
    await workerRequest(
      '/poll',
      { capabilities: ['sina-delegation-v1', 'desktop-screenshots-v1'] },
      companion.token,
    ),
  );
  await message(chat);
  const legacyId = randomUUID();
  await stack.db.query(
    'INSERT INTO mkoro_conversations(id,workspace_id,actor_id,worker_id,title) VALUES($1,$2,$3,$4,$5)',
    [legacyId, workspace, owner.user.id, companion.workerId, 'Existing personal history'],
  );
  const legacy = await json(await request(`/conversations/${legacyId}`, undefined, 'GET'));
  assert.equal(legacy.conversation.threadId, null);
  assert.equal(legacy.conversation.title, 'Existing personal history');
  assert.equal((await request('/CONVERSATIONS/', { workerId: companion.workerId })).status, 410);
  assert.equal(
    (
      await request(`/CONVERSATIONS/${legacyId}/MESSAGES/`, {
        message: 'Bypass Sina',
        requestId: randomUUID(),
      })
    ).status,
    410,
  );
});

// A real 2x1 JPEG generated from a solid synthetic color; no desktop/customer content.
const screenshotData =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDxGiiitjI//9k=';
const screenshot = () => ({
  mimeType: 'image/jpeg',
  data: screenshotData,
  width: 2,
  height: 1,
  capturedAt: new Date().toISOString(),
});

test('desktop previews require an active personal lease and bounded genuine JPEG dimensions; pixels never become events', async () => {
  const companion = await pair();
  const foreign = await pair();
  const chat = await conversation(companion);
  const { task } = await message(chat);
  assert.equal((await json(await workerRequest('/poll', {}, companion.token))).screenLease, null);
  const path = `/tasks/${task.id}`;
  const inactive = await json(await request(path + '/screen', undefined, 'GET'));
  assert.equal(inactive.status, 'inactive');
  const { lease } = await json(await request(path + '/screen-view', { enabled: true }));
  const offered = (await json(await workerRequest('/poll', {}, companion.token))).screenLease;
  assert.equal(offered.leaseId, lease.leaseId);
  assert.equal(offered.taskId, task.id);
  const upload = { taskId: task.id, leaseId: lease.leaseId, frame: screenshot() };
  assert.equal((await workerRequest('/screen', upload)).status, 401);
  assert.equal((await workerRequest('/SCREEN/', upload, foreign.token)).status, 404);
  assert.equal((await request(path + '/SCREEN/', undefined, 'GET', editor)).status, 404);
  assert.equal((await request(path + '/screen', undefined, 'GET', owner, other)).status, 404);
  assert.equal(
    (await request(path + '/screen-view', { enabled: true }, 'POST', editor)).status,
    404,
  );
  for (const frame of [
    { ...upload.frame, data: Buffer.from('<svg onload="bad"/>').toString('base64') },
    { ...upload.frame, width: 3 },
    { ...upload.frame, width: 1921 },
    { ...upload.frame, data: Buffer.alloc(512 * 1024 + 1).toString('base64') },
    { ...upload.frame, capturedAt: new Date(Date.now() - 60_000).toISOString() },
  ])
    assert.equal(
      (await workerRequest('/screen', { ...upload, frame }, companion.token)).status,
      400,
    );
  await json(await workerRequest('/screen', upload, companion.token));
  const response = await request(path + '/screen', undefined, 'GET');
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const ready = await json(response);
  assert.equal(ready.status, 'ready');
  assert.deepEqual(ready.frame, upload.frame);
  const detail = await json(await request(`/conversations/${chat.id}`, undefined, 'GET'));
  assert.equal(detail.events.length, 0);
  assert.equal(JSON.stringify(detail).includes(screenshotData), false);
  assert.equal((await workerRequest('/screen', upload, companion.token)).status, 409);
  const error = { code: 'desktop_unavailable', message: 'No interactive desktop is available.' };
  await json(
    await workerRequest(
      '/screen',
      { taskId: task.id, leaseId: lease.leaseId, error },
      companion.token,
    ),
  );
  const unavailable = await json(await request(path + '/screen', undefined, 'GET'));
  assert.equal(unavailable.status, 'unavailable');
  assert.deepEqual(unavailable.error, error);
  assert.equal(unavailable.frame, undefined);
  await json(await request(path + '/screen-view', { enabled: false }));
  assert.equal((await workerRequest('/screen', upload, companion.token)).status, 409);
  assert.equal((await json(await request(path + '/screen', undefined, 'GET'))).status, 'inactive');
});

test('screen leases expire, stop on cancellation or completion, and disappear on API restart', async () => {
  const companion = await pair();
  const chat = await conversation(companion);
  const { task } = await message(chat);
  await json(await workerRequest('/poll', {}, companion.token));
  const path = `/tasks/${task.id}`;
  const first = (await json(await request(path + '/screen-view', { enabled: true }))).lease;
  await new Promise((resolve) => setTimeout(resolve, 10_050));
  assert.equal(
    (
      await workerRequest(
        '/screen',
        { taskId: task.id, leaseId: first.leaseId, frame: screenshot() },
        companion.token,
      )
    ).status,
    409,
  );
  assert.equal((await json(await workerRequest('/poll', {}, companion.token))).screenLease, null);
  const second = (await json(await request(path + '/screen-view', { enabled: true }))).lease;
  assert.notEqual(second.leaseId, first.leaseId);
  await json(
    await workerRequest(
      '/screen',
      { taskId: task.id, leaseId: second.leaseId, frame: screenshot() },
      companion.token,
    ),
  );
  await stack.restartApi();
  assert.equal((await json(await request(path + '/screen', undefined, 'GET'))).status, 'inactive');
  assert.equal((await json(await workerRequest('/poll', {}, companion.token))).screenLease, null);
  const third = (await json(await request(path + '/screen-view', { enabled: true }))).lease;
  await json(await request(path + '/cancel', {}));
  assert.equal(
    (
      await workerRequest(
        '/screen',
        { taskId: task.id, leaseId: third.leaseId, frame: screenshot() },
        companion.token,
      )
    ).status,
    409,
  );
  assert.equal((await request(path + '/screen-view', { enabled: true })).status, 409);
  await json(
    await workerRequest('/events', { events: [event(task, 0, 'task_cancelled')] }, companion.token),
  );
  const next = (await message(chat)).task;
  await json(await workerRequest('/poll', {}, companion.token));
  await json(await request(`/tasks/${next.id}/screen-view`, { enabled: true }));
  await json(
    await workerRequest('/events', { events: [event(next, 0, 'task_completed')] }, companion.token),
  );
  assert.equal(
    (await json(await request(`/tasks/${next.id}/screen`, undefined, 'GET'))).status,
    'inactive',
  );
  assert.equal((await request(`/tasks/${next.id}/screen-view`, { enabled: true })).status, 409);
  const last = (await message(chat)).task;
  const lastLease = (await json(await request(`/tasks/${last.id}/screen-view`, { enabled: true })))
    .lease;
  await json(await request(`/workers/${companion.workerId}`, undefined, 'DELETE'));
  assert.equal(
    (
      await workerRequest(
        '/screen',
        { taskId: last.id, leaseId: lastLease.leaseId, frame: screenshot() },
        companion.token,
      )
    ).status,
    401,
  );
  assert.equal(
    (await json(await request(`/tasks/${last.id}/screen`, undefined, 'GET'))).status,
    'inactive',
  );
});

test('companion tokens recheck membership and role on each request', async () => {
  const companion = await pair(editor);
  await setMember(owner, workspace, editor, 'viewer');
  assert.equal((await workerRequest('/poll', {}, companion.token)).status, 401);
  await setMember(owner, workspace, editor, 'editor');
  await json(await workerRequest('/poll', {}, companion.token));
  await stack.db.query('DELETE FROM workspace_members WHERE workspace_id=$1 AND user_id=$2', [
    workspace,
    editor.user.id,
  ]);
  assert.equal((await workerRequest('/events', { events: [] }, companion.token)).status, 401);
});
