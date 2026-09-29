import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { randomUUID } from 'node:crypto';
import { setImmediate as nextTurn } from 'node:timers/promises';
import {
  MkoroWorker,
  WorkerApi,
  publicTool,
  publicPermissionTool,
  serverOrigin,
} from './worker.mjs';

class FakeAcp extends EventEmitter {
  capabilities = { loadSession: true };
  requests = [];
  responses = [];
  notifications = [];
  async request(method, params) {
    this.requests.push({ method, params });
    if (method === 'session/new')
      return { sessionId: 'goose-session', modes: { availableModes: [{ id: 'approve' }] } };
    if (method === 'session/set_mode' && this.rejectMode)
      throw new Error('Manual approval unavailable.');
    if (method === 'session/prompt')
      return new Promise((resolve, reject) => {
        this.finish = resolve;
        this.rejectPrompt = reject;
      });
    return {};
  }
  respond(id, result) {
    this.responses.push({ id, result });
  }
  notify(method, params) {
    this.notifications.push({ method, params });
  }
  close() {
    this.closed = true;
    this.rejectPrompt?.(new Error('Goose stopped.'));
  }
}

function fixture(options = {}) {
  const acp = new FakeAcp();
  const posts = [];
  const api = {
    server: 'https://inscope.example',
    async post(endpoint, body) {
      posts.push({ endpoint, body });
      return endpoint === 'poll' ? { commands: [] } : { ok: true, accepted: body.events.length };
    },
  };
  const saved = [];
  const worker = new MkoroWorker({
    api,
    acp,
    workspace: 'C:\\Mkoro',
    saveSessions: async (value) => saved.push(value),
    ...options,
  });
  const command = {
    id: randomUUID(),
    taskId: randomUUID(),
    type: 'message',
    payload: {
      message: 'List the files.',
      conversationId: randomUUID(),
      threadId: 'sina-thread',
      platformOrigin: 'https://inscope.example',
      delegation: {
        taskType: 'local_file',
        target: 'C:\\Mkoro',
        objective: 'List the files.',
        expectedOutput: 'The names of files in the folder.',
        reasonNoPlatformTool: 'This folder is on the paired computer.',
      },
    },
  };
  return { acp, posts, api, saved, worker, command };
}

async function start(f) {
  f.worker.handle(f.command);
  await nextTurn();
}
function permission(f, options) {
  f.acp.emit('permission', {
    jsonrpc: '2.0',
    id: 50,
    method: 'session/request_permission',
    params: {
      sessionId: 'goose-session',
      toolCall: { toolCallId: 'tool-1', title: 'List files', rawInput: { password: 'secret' } },
      options: options ?? [
        { optionId: 'yes', name: 'Allow once', kind: 'allow_once' },
        { optionId: 'always', name: 'Allow always', kind: 'allow_always' },
        { optionId: 'no', name: 'Reject once', kind: 'reject_once' },
      ],
    },
  });
}

test('forces manual approval before prompt and ignores any remote cwd or executable', async () => {
  const f = fixture();
  f.command.payload.cwd = 'C:\\Other';
  f.command.payload.executable = 'powershell';
  await start(f);
  assert.deepEqual(
    f.acp.requests.map((r) => r.method),
    ['session/new', 'session/set_mode', 'session/prompt'],
  );
  assert.equal(f.acp.requests[0].params.cwd, 'C:\\Mkoro');
  assert.equal(f.acp.requests[1].params.modeId, 'approve');
  assert.match(f.acp.requests[2].params.prompt[0].text, /Sina owns user conversation/);
  assert.match(f.acp.requests[2].params.prompt[0].text, /List the files/);
  assert.equal(f.saved[0][f.command.payload.conversationId], 'goose-session');
  f.acp.finish({ stopReason: 'end_turn' });
  await f.worker.turn;
  assert.equal(f.worker.outbox.at(-1).type, 'task_completed');
});

test('unstructured legacy chat and native platform targets fail before a Goose session starts', async () => {
  for (const change of [
    (payload) => delete payload.delegation,
    (payload) => (payload.delegation.target = 'https://inscope.example/workflows'),
    (payload) => (payload.delegation.taskType = 'workflow_run'),
  ]) {
    const f = fixture();
    change(f.command.payload);
    await start(f);
    assert.equal(f.acp.requests.length, 0);
    assert.equal(f.worker.outbox.at(-1).type, 'task_failed');
  }
});

test('cancellation, terminal events and failed polls stop desktop viewing independently of progress', async () => {
  const f = fixture();
  await start(f);
  let stopped = 0;
  f.worker.screenshots.stop = () => stopped++;
  f.worker.cancel();
  assert.equal(stopped, 1);
  f.acp.finish({ stopReason: 'cancelled' });
  await f.worker.turn;
  assert.equal(stopped, 2);
  f.api.post = async () => {
    throw new Error('Offline');
  };
  await assert.rejects(f.worker.tick(), /Offline/);
  assert.equal(stopped, 3);
});

test('a slow desktop capture does not hold up permission and cancellation polling', async () => {
  let finishCapture;
  let captureSignal;
  const f = fixture({
    capture: ({ signal }) => {
      captureSignal = signal;
      return new Promise((resolve) => {
        finishCapture = resolve;
      });
    },
  });
  await start(f);
  let pollCount = 0;
  f.api.post = async (endpoint, body) => {
    f.posts.push({ endpoint, body });
    if (endpoint === 'poll') {
      pollCount++;
      return {
        commands:
          pollCount === 2
            ? [{ id: randomUUID(), taskId: f.command.taskId, type: 'cancel', payload: {} }]
            : [],
        screenLease: {
          taskId: f.command.taskId,
          leaseId: f.command.id,
          expiresAt: new Date(Date.now() + 10_000).toISOString(),
        },
      };
    }
    return { ok: true };
  };
  await f.worker.tick();
  assert.equal(captureSignal.aborted, false);
  permission(f);
  await f.worker.tick();
  assert.equal(captureSignal.aborted, true);
  assert.equal(f.acp.responses[0].result.outcome.outcome, 'cancelled');
  finishCapture({ data: 'late private image' });
  await f.worker.screenshots.pending;
  assert.equal(
    f.posts.some((post) => post.endpoint === 'screen'),
    false,
  );
  f.acp.finish({ stopReason: 'cancelled' });
  await f.worker.turn;
});

test('failure to set approve mode prevents prompt execution', async () => {
  const f = fixture();
  f.acp.rejectMode = true;
  await start(f);
  await f.worker.turn;
  assert.equal(
    f.acp.requests.some((r) => r.method === 'session/prompt'),
    false,
  );
  assert.equal(f.worker.outbox.at(-1).type, 'task_failed');
});

test('single-action permission waits for a matching user decision and blocks permanent grants', async () => {
  const f = fixture();
  await start(f);
  permission(f);
  assert.deepEqual(f.acp.responses, []);
  const event = f.worker.outbox.at(-1);
  assert.equal(event.type, 'permission_required');
  assert.deepEqual(
    event.payload.options.map((o) => o.kind),
    ['allow_once', 'reject_once'],
  );
  assert.equal(event.payload.toolCall.rawInput, undefined);
  f.worker.decide(f.command.taskId, { requestId: event.payload.requestId, optionId: 'always' });
  f.worker.decide(randomUUID(), { requestId: event.payload.requestId, optionId: 'yes' });
  assert.deepEqual(f.acp.responses, []);
  f.worker.handle({
    id: randomUUID(),
    taskId: f.command.taskId,
    type: 'permission',
    payload: { requestId: event.payload.requestId, optionId: 'yes' },
  });
  assert.deepEqual(f.acp.responses, [
    { id: 50, result: { outcome: { outcome: 'selected', optionId: 'yes' } } },
  ]);
  f.acp.finish({ stopReason: 'end_turn' });
  await f.worker.turn;
});

test('approval requests without one-time choices are cancelled', async () => {
  const f = fixture();
  await start(f);
  permission(f, [{ optionId: 'always', name: 'Always', kind: 'allow_always' }]);
  assert.equal(f.acp.responses[0].result.outcome.outcome, 'cancelled');
  f.acp.finish({ stopReason: 'end_turn' });
  await f.worker.turn;
});

test('parallel permission requests retain independent decisions', async () => {
  const f = fixture();
  await start(f);
  permission(f);
  f.acp.emit('permission', {
    id: 51,
    params: {
      sessionId: 'goose-session',
      toolCall: { toolCallId: 'tool-2' },
      options: [{ optionId: 'yes-2', name: 'Allow once', kind: 'allow_once' }],
    },
  });
  const events = f.worker.outbox.filter((event) => event.type === 'permission_required');
  assert.equal(events.length, 2);
  f.worker.decide(f.command.taskId, { requestId: events[1].payload.requestId, optionId: 'yes-2' });
  assert.equal(f.acp.responses[0].id, 51);
  assert.equal(f.worker.permissions.size, 1);
  f.worker.decide(f.command.taskId, { requestId: events[0].payload.requestId, optionId: 'no' });
  assert.equal(f.acp.responses[1].id, 50);
  assert.equal(f.worker.permissions.size, 0);
  f.acp.finish({ stopReason: 'end_turn' });
  await f.worker.turn;
});

test('approval preview shows commands while masking credential fields and typed text', () => {
  const tool = publicPermissionTool({
    rawInput: {
      command: 'Get-ChildItem C:\\Mkoro',
      api_key: 'credential-1',
      fields: [{ name: 'username', value: 'credential-2' }],
      text: 'typed-secret',
      authorization: 'Bearer private-token',
      url: 'https://user:pass@example.com?token=url-secret',
    },
  });
  assert.match(tool.argumentsPreview, /Get-ChildItem/);
  for (const secret of [
    'credential-1',
    'credential-2',
    'typed-secret',
    'private-token',
    'url-secret',
    'user:pass',
  ])
    assert.equal(tool.argumentsPreview.includes(secret), false);
  assert.match(tool.argumentsNotice, /Redaction may miss secrets/);
  const long = publicPermissionTool({ rawInput: { command: 'x'.repeat(3000) } });
  assert.match(long.argumentsNotice, /truncated/);
  assert.ok(long.argumentsPreview.length < 2600);
});

test('polling continues while prompt waits, cancellation rejects outstanding permissions', async () => {
  const f = fixture();
  await start(f);
  permission(f);
  await f.worker.tick();
  assert.deepEqual(
    f.posts.map((p) => p.endpoint),
    ['poll', 'events'],
  );
  f.worker.handle({ id: randomUUID(), taskId: f.command.taskId, type: 'cancel', payload: {} });
  assert.equal(f.acp.responses[0].result.outcome.outcome, 'cancelled');
  assert.deepEqual(f.acp.notifications, [
    { method: 'session/cancel', params: { sessionId: 'goose-session' } },
  ]);
  f.acp.finish({ stopReason: 'cancelled' });
  await f.worker.turn;
  assert.equal(f.worker.outbox.at(-1).type, 'task_cancelled');
});

test('duplicate commands do not replay prompts and simultaneous messages fail visibly', async () => {
  const f = fixture();
  await start(f);
  f.worker.handle(f.command);
  const other = { ...f.command, id: randomUUID(), taskId: randomUUID() };
  f.worker.handle(other);
  assert.equal(f.acp.requests.filter((r) => r.method === 'session/prompt').length, 1);
  assert.equal(f.worker.outbox.at(-1).taskId, other.taskId);
  assert.equal(f.worker.outbox.at(-1).type, 'task_failed');
  f.acp.finish({ stopReason: 'end_turn' });
  await f.worker.turn;
});

test('event transport retries retain event IDs and ordering', async () => {
  const f = fixture();
  f.worker.emit(f.command.taskId, 'message_delta', { text: 'first' });
  f.worker.emit(f.command.taskId, 'message_delta', { text: 'second' });
  const attempts = [];
  f.api.post = async (_endpoint, body) => {
    attempts.push(structuredClone(body));
    if (attempts.length === 1) throw new Error('offline');
    return { ok: true };
  };
  await assert.rejects(f.worker.flush(), /offline/);
  assert.equal(f.worker.outbox.length, 2);
  await f.worker.flush();
  assert.deepEqual(attempts[0], attempts[1]);
  assert.deepEqual(
    attempts[1].events.map((event) => event.seq),
    [0, 1],
  );
  assert.equal(f.worker.outbox.length, 0);
});

test('a long streamed turn reserves its final API event for an explicit failure', async () => {
  const f = fixture();
  const persisted = [];
  f.api.post = async (_endpoint, body) => {
    assert.ok(
      persisted.length + body.events.length <= 10_000,
      'API event budget must not be exceeded',
    );
    persisted.push(...body.events);
    return { ok: true, accepted: body.events.length };
  };
  await start(f);
  for (let i = 0; i < 10_050; i++) {
    f.acp.emit('update', {
      sessionId: 'goose-session',
      update: {
        sessionUpdate: 'agent_message_chunk',
        content: { type: 'text', text: 'x' },
      },
    });
    // Reproduce a healthy, regularly drained outbox, not only an offline buffer overflow.
    if (i % 30 === 0) await f.worker.flush();
  }
  await f.worker.turn;
  while (f.worker.outbox.length) await f.worker.flush();
  assert.equal(persisted.length, 10_000);
  assert.equal(persisted.at(-1).seq, 9999);
  assert.equal(persisted.at(-1).type, 'task_failed');
  assert.match(persisted.at(-1).payload.message, /progress event limit/);
  assert.equal(persisted.filter((event) => event.type === 'task_failed').length, 1);
  assert.equal(f.acp.closed, true);
  assert.equal(f.worker.stopping, true);
});

test('restored conversations load exact Goose session without replaying history into current turn', async () => {
  const conversationId = randomUUID();
  const f = fixture({ sessions: { [conversationId]: 'saved-session' } });
  f.command.payload.conversationId = conversationId;
  f.acp.request = async function (method, params) {
    this.requests.push({ method, params });
    if (method === 'session/load')
      this.emit('update', {
        sessionId: 'saved-session',
        update: {
          sessionUpdate: 'agent_message_chunk',
          content: { type: 'text', text: 'Old answer' },
        },
      });
    if (method === 'session/prompt')
      return new Promise((resolve) => {
        this.finish = resolve;
      });
    return {};
  };
  await start(f);
  assert.equal(f.acp.requests[0].method, 'session/load');
  assert.equal(f.acp.requests[0].params.sessionId, 'saved-session');
  assert.equal(
    f.worker.outbox.some((event) => event.type === 'message_delta'),
    false,
  );
  f.acp.finish({ stopReason: 'end_turn' });
  await f.worker.turn;
});

test('mode changes away from manual approval terminate the connection', async () => {
  const f = fixture();
  await start(f);
  f.acp.emit('update', {
    sessionId: 'goose-session',
    update: { sessionUpdate: 'current_mode_update', currentModeId: 'auto' },
  });
  await f.worker.turn;
  assert.equal(f.acp.closed, true);
  assert.equal(f.worker.stopping, true);
  assert.equal(f.worker.outbox.at(-1).type, 'task_failed');
});

test('non-completion stop reasons are not reported as success; private thoughts and images stay local', async () => {
  const f = fixture();
  await start(f);
  for (const content of [
    { type: 'text', text: 'private thought' },
    { type: 'image', data: 'base64' },
  ])
    f.acp.emit('update', {
      sessionId: 'goose-session',
      update: { sessionUpdate: 'agent_thought_chunk', content },
    });
  f.acp.emit('update', {
    sessionId: 'goose-session',
    update: {
      sessionUpdate: 'agent_message_chunk',
      content: { type: 'text', text: 'Done thinking' },
    },
  });
  f.acp.finish({ stopReason: 'max_tokens' });
  await f.worker.turn;
  assert.equal(f.worker.outbox.at(-1).type, 'task_failed');
  assert.deepEqual(
    f.worker.outbox
      .filter((event) => event.type === 'message_delta')
      .map((event) => event.payload.text),
    ['Done thinking'],
  );
  assert.deepEqual(
    publicTool({ content: [{ type: 'content', content: { type: 'image', data: 'secret-image' } }] })
      .content,
    [],
  );
});

test('worker API only uses a trusted origin, bearer auth, and refuses redirects', async () => {
  for (const invalid of [
    'http://public.example',
    'https://user:pass@example.com',
    'https://example.com/path',
    'https://example.com?token=x',
  ])
    assert.throws(() => serverOrigin(invalid));
  assert.equal(serverOrigin('http://localhost:3001'), 'http://localhost:3001');
  const calls = [];
  const api = new WorkerApi({
    server: 'https://inscope.example',
    token: 'private-token',
    fetchImpl: async (...args) => {
      calls.push(args);
      return { ok: true, json: async () => ({ commands: [] }) };
    },
  });
  await api.post('poll', {});
  assert.equal(calls[0][0], 'https://inscope.example/api/mkoro-worker/poll');
  assert.equal(calls[0][1].redirect, 'error');
  assert.equal(calls[0][1].headers.authorization, 'Bearer private-token');
});
