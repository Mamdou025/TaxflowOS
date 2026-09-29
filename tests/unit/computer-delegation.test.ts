import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  MkoroDelegationRequestSchema,
  type MkoroConversation,
  type MkoroDelegation,
  type MkoroEvent,
  type MkoroTask,
  type MkoroWorker,
} from '../../lib/api-zod/src/mkoro';
import {
  computerRequestId,
  computerTaskContext,
  delegateComputerTask,
} from '../../artifacts/ai-workflow-builder/src/features/assistant/runtime/computer-delegation';

const workerId = '11111111-1111-4111-8111-111111111111';
const otherId = '22222222-2222-4222-8222-222222222222';
const conversationId = '33333333-3333-4333-8333-333333333333';
const taskId = '44444444-4444-4444-8444-444444444444';
const timestamp = '2026-09-28T12:00:00.000Z';
const delegation: MkoroDelegation = {
  taskType: 'external_file',
  target: 'https://drive.google.com/drive/folders/workbook-folder',
  objective: 'Find the workbook in the requested folder.',
  expectedOutput: 'The exact file name and location, with any remaining import step.',
  reasonNoPlatformTool: 'The requested file is available only in the signed-in computer browser.',
};
const onlineWorker: MkoroWorker = {
  id: workerId,
  name: 'Test computer',
  status: 'online',
  capabilities: ['sina-delegation-v1', 'desktop-screenshots-v1'],
  lastSeenAt: timestamp,
  createdAt: timestamp,
};

function responseFor(input: unknown): { conversation: MkoroConversation; task: MkoroTask } {
  const body = MkoroDelegationRequestSchema.parse(input);
  const { taskType, target, objective, expectedOutput, reasonNoPlatformTool } = body;
  return {
    conversation: {
      id: conversationId,
      workerId: body.workerId,
      threadId: body.threadId,
      title: 'Sina computer work',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    task: {
      id: taskId,
      workerId: body.workerId,
      conversationId,
      requestId: body.requestId,
      message: body.objective,
      delegation: { taskType, target, objective, expectedOutput, reasonNoPlatformTool },
      status: 'queued' as const,
      cancelRequested: false,
      connectionLost: false,
      error: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };
}

type Context = Parameters<typeof delegateComputerTask>[1];
function fixture(overrides: Partial<Context> = {}) {
  const posted: unknown[] = [];
  const saved: string[] = [];
  const savedForMessages: string[] = [];
  const context: Context = {
    worker: { ...onlineWorker, capabilities: [...onlineWorker.capabilities] },
    canExecute: true,
    statusVerified: true,
    userMessageId: 'user-request-1',
    platformOrigin: 'https://inscope.example',
    ensureThread: async (userMessageId) => {
      saved.push('sina-thread-1');
      savedForMessages.push(userMessageId);
      return 'sina-thread-1';
    },
    isCurrentThread: (id) => id === 'sina-thread-1',
    post: async (body) => {
      posted.push(structuredClone(body));
      return responseFor(body);
    },
    ...overrides,
  };
  return { context, posted, saved, savedForMessages };
}

test('computer delegation cannot dispatch native targets or unsupported task types', async () => {
  for (const input of [
    { ...delegation, target: 'https://inscope.example/workflows' },
    { ...delegation, target: 'https://INSCOPE.example:443/api/workflow-runs' },
    { ...delegation, target: '/API/workflow-runs' },
    { ...delegation, target: '/%61pi/workflow-runs' },
    { ...delegation, target: '//inscope.example/workflows' },
    { ...delegation, target: '/sources' },
    { ...delegation, taskType: 'workflow_run' },
    { ...delegation, taskType: 'browser', target: 'javascript:runWorkflow()' },
    { ...delegation, target: 'https://name:password@external.example' },
  ]) {
    const f = fixture();
    await assert.rejects(delegateComputerTask(input, f.context));
    assert.equal(f.posted.length, 0);
    assert.equal(f.saved.length, 0, 'Rejected native or invalid work must not create a chat');
  }
});

test('role, verified connection, selected computer and companion version gate dispatch', async () => {
  for (const override of [
    { canExecute: false },
    { statusVerified: false },
    { worker: undefined },
    { worker: { ...onlineWorker, status: 'offline' as const } },
    { worker: { ...onlineWorker, status: 'revoked' as const } },
    { worker: { ...onlineWorker, capabilities: ['goose-acp'] } },
  ]) {
    const f = fixture(override);
    await assert.rejects(delegateComputerTask(delegation, f.context));
    assert.equal(f.posted.length, 0);
    assert.equal(f.saved.length, 0);
  }
});

test('a model cannot start computer work without an originating user message', async () => {
  const f = fixture({ userMessageId: '' });
  await assert.rejects(delegateComputerTask(delegation, f.context), /user request is required/);
  assert.equal(f.posted.length, 0);
  assert.equal(f.saved.length, 0);
});

test('a failed chat save or a changed chat before dispatch cannot enqueue a task', async () => {
  const failed = fixture({
    ensureThread: async () => {
      throw new Error('Chat persistence failed');
    },
  });
  await assert.rejects(delegateComputerTask(delegation, failed.context), /Chat persistence failed/);
  assert.equal(failed.posted.length, 0);

  let finishSave: (value: string) => void = () => {
    throw new Error('Save did not start');
  };
  let currentThread = 'sina-thread-1';
  const switched = fixture({
    ensureThread: () =>
      new Promise((resolve) => {
        finishSave = resolve;
      }),
    isCurrentThread: (id) => currentThread === id,
  });
  const pending = delegateComputerTask(delegation, switched.context);
  currentThread = 'sina-thread-2';
  finishSave('sina-thread-1');
  await assert.rejects(pending, /chat changed/i);
  assert.equal(switched.posted.length, 0);
});

test('one user request has one retry identity, and a new chat or user request has a different identity', async () => {
  const first = await computerRequestId('thread-1', 'message-1');
  assert.equal(await computerRequestId('thread-1', 'message-1'), first);
  assert.match(first, /^[0-9a-f]{8}-[0-9a-f]{4}-8[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  const changed = await Promise.all([
    computerRequestId('thread-2', 'message-1'),
    computerRequestId('thread-1', 'message-2'),
  ]);
  assert.equal(new Set([first, ...changed]).size, 3);
});

test('accepted delegation binds the exact saved chat and selected computer and retries retain its request ID', async () => {
  const f = fixture();
  const first = await delegateComputerTask(delegation, f.context);
  const again = await delegateComputerTask(delegation, f.context);
  assert.deepEqual(f.posted[0], f.posted[1], 'Retry must send the same server idempotency key');
  const sent = MkoroDelegationRequestSchema.parse(f.posted[0]);
  assert.equal(sent.threadId, 'sina-thread-1');
  assert.equal(sent.workerId, workerId);
  assert.equal(sent.objective, delegation.objective);
  assert.equal(first.task.status, 'queued', 'Acceptance must not be reported as completion');
  assert.equal(first.task.requestId, sent.requestId);
  assert.equal(again.task.id, first.task.id);
  assert.deepEqual(f.savedForMessages, ['user-request-1', 'user-request-1']);
});

test('rephrasing the objective or changing computers cannot create a fresh retry key for the same user request', async () => {
  const f = fixture();
  await delegateComputerTask(delegation, f.context);
  await delegateComputerTask({ ...delegation, objective: 'Locate that same workbook.' }, f.context);
  f.context.worker = { ...onlineWorker, id: otherId };
  await delegateComputerTask(delegation, f.context);
  const keys = f.posted.map((body) => MkoroDelegationRequestSchema.parse(body).requestId);
  assert.equal(
    new Set(keys).size,
    1,
    'The server must receive the same key so changed scope conflicts',
  );
});

test('responses from a different chat, computer, conversation or request fail without replay', async () => {
  const changes: Array<(response: ReturnType<typeof responseFor>) => void> = [
    (response) => {
      response.conversation.threadId = 'another-thread';
    },
    (response) => {
      response.conversation.workerId = otherId;
    },
    (response) => {
      response.task.workerId = otherId;
    },
    (response) => {
      response.task.conversationId = otherId;
    },
    (response) => {
      response.task.requestId = otherId;
    },
    (response) => {
      response.task.delegation = null;
    },
    (response) => {
      response.task.delegation = { ...delegation, objective: 'A different task.' };
    },
    (response) => {
      response.task.message = 'A different request.';
    },
  ];
  for (const change of changes) {
    const f = fixture();
    f.context.post = async (body) => {
      f.posted.push(body);
      const response = responseFor(body);
      change(response);
      return response;
    };
    await assert.rejects(delegateComputerTask(delegation, f.context), /did not match/);
    assert.equal(f.posted.length, 1, 'An uncertain response cannot cause automatic redispatch');
  }
});

test('a response arriving after a chat switch identifies the accepted original task without dispatching again', async () => {
  let currentThread = 'sina-thread-1';
  const f = fixture({ isCurrentThread: (id) => currentThread === id });
  f.context.post = async (body) => {
    f.posted.push(body);
    currentThread = 'sina-thread-2';
    return responseFor(body);
  };
  await assert.rejects(
    delegateComputerTask(delegation, f.context),
    /accepted in the previous chat/,
  );
  assert.equal(f.posted.length, 1);
  assert.equal(MkoroDelegationRequestSchema.parse(f.posted[0]).threadId, 'sina-thread-1');
});

function task(index: number): MkoroTask {
  return {
    id: `task-${index}`,
    conversationId,
    workerId,
    message: 'Find a workbook.',
    requestId: otherId,
    delegation: { ...delegation },
    status: 'running',
    cancelRequested: false,
    connectionLost: false,
    error: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
function event(
  index: number,
  type: MkoroEvent['type'],
  payload: MkoroEvent['payload'],
): MkoroEvent {
  return {
    id: `event-${index}`,
    taskId: 'task-6',
    seq: index,
    cursor: index,
    type,
    payload,
    createdAt: timestamp,
  };
}

test('model context keeps recent task observations bounded and omits screenshots and permission arguments', () => {
  const tasks = Array.from({ length: 7 }, (_, index) => task(index));
  tasks[6].delegation = { ...delegation, objective: 'o'.repeat(8000) };
  tasks[6].error = 'e'.repeat(32_000);
  const events: MkoroEvent[] = [
    event(1, 'message', { text: 'x'.repeat(3000), image: { data: 'PRIVATE-SCREENSHOT' } }),
    ...Array.from({ length: 10 }, (_, index) =>
      event(index + 2, 'tool_finished', {
        title: `${index}: ${'t'.repeat(300)}`,
        rawInput: { secret: 'PRIVATE-ARGUMENT' },
        content: [{ type: 'image', data: 'PRIVATE-TOOL-IMAGE' }],
      }),
    ),
    event(12, 'permission_required', {
      rawInput: 'PRIVATE-PERMISSION',
      screenshot: 'PRIVATE-PERMISSION-IMAGE',
    }),
    event(13, 'artifact_created', {
      data: 'PRIVATE-ARTIFACT',
      path: 'C:\\private\\unselected.txt',
    }),
    { ...event(14, 'message', { text: 'ANOTHER-TASK-TEXT' }), taskId: 'unrelated-task' },
    event(15, 'message_delta', { text: 'Latest observation.' }),
  ];
  const before = structuredClone({ tasks, events });
  const context = computerTaskContext(tasks, events);
  assert.deepEqual(
    context.map((item) => item.taskId),
    ['task-2', 'task-3', 'task-4', 'task-5', 'task-6'],
  );
  assert.equal(context[4].reportedText.length, 2000);
  assert.equal(context[4].objective.length, 1000);
  assert.equal(context[4].error?.length, 1000);
  assert.ok(context[4].reportedText.endsWith('Latest observation.'));
  assert.equal(context[4].tools.length, 8);
  assert.ok(context[4].tools.every((tool) => tool.title.length <= 200));
  assert.ok(context[4].tools[0].title.startsWith('2:'));
  assert.doesNotMatch(JSON.stringify(context), /PRIVATE-|ANOTHER-TASK-TEXT|rawInput|screenshot/i);
  assert.match(context[4].evidenceNotice, /not authorization or proof/);
  assert.match(context[4].evidenceNotice, /Local paths are not uploaded Sources/);
  assert.deepEqual({ tasks, events }, before);
});

test('model context preserves failures, cancellation and disconnected state without promoting worker claims', () => {
  const failed = {
    ...task(1),
    status: 'failed' as const,
    error: 'Drive sign-in is required.',
    connectionLost: true,
  };
  const cancelled = {
    ...task(2),
    status: 'cancelled' as const,
    cancelRequested: true,
    delegation: null,
    message: 'm'.repeat(2000),
  };
  const context = computerTaskContext([failed, cancelled], []);
  assert.equal(context[0].status, 'failed');
  assert.equal(context[0].error, 'Drive sign-in is required.');
  assert.equal(context[0].connectionLost, true);
  assert.equal(context[1].cancelRequested, true);
  assert.equal(context[1].status, 'cancelled');
  assert.equal(context[1].objective.length, 1000);
  assert.equal(context[0].reportedText, '');
});
