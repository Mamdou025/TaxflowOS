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
    await workerRequest('/pair', { pairingToken: code.pairingToken, name: 'Synthetic companion' }),
    201,
  );
  return { ...companion, code };
}
async function conversation(companion) {
  return (await json(await request('/conversations', { workerId: companion.workerId }), 201))
    .conversation;
}
async function message(chat, text = 'Read the synthetic fixture') {
  const requestId = randomUUID();
  const task = (
    await json(
      await request(`/conversations/${chat.id}/messages`, { message: text, requestId }),
      202,
    )
  ).task;
  return { task, requestId };
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
    await request(`/conversations/${chat.id}/messages`, { message: task.message, requestId }),
    202,
  );
  assert.equal(replay.task.id, task.id);
  assert.equal(
    (await request(`/conversations/${chat.id}/messages`, { message: 'Changed', requestId })).status,
    409,
  );
  assert.equal(
    (
      await request(`/conversations/${chat.id}/messages`, {
        message: 'Another',
        requestId: randomUUID(),
      })
    ).status,
    409,
  );
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
  assert.equal(
    (
      await request(`/conversations/${chat.id}/messages`, {
        message: 'Cannot run',
        requestId: randomUUID(),
      })
    ).status,
    409,
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
