import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  assertCurrentChatRequest,
  stopChatBeforeSwitch,
} from '@/features/assistant/runtime/chat/chat-switch';
import {
  projectCompleteMessages,
  projectMessages,
  reconstructMessages,
  type AguiMessage,
} from '@/features/assistant/runtime/chat/message-codec';

const call = (id: string) => ({
  id,
  type: 'function',
  function: { name: 'delegateComputerTask', arguments: '{}' },
});
const user = { id: 'request', role: 'user', content: 'Find my workbook.' };

test('saving while delegation is executing retains only completed exchanges', () => {
  const complete: AguiMessage[] = [
    user,
    { id: 'lookup', role: 'assistant', toolCalls: [call('lookup-call')] },
    {
      id: 'lookup-result',
      role: 'tool',
      toolCallId: 'lookup-call',
      content: 'No connected source.',
    },
  ];
  const pending: AguiMessage[] = [
    ...complete,
    {
      id: 'delegating',
      role: 'assistant',
      content: 'Checking the computer.',
      toolCalls: [call('pending-call')],
    },
  ];
  assert.deepEqual(projectCompleteMessages(pending), projectMessages(complete));
  assert.equal(
    reconstructMessages(projectCompleteMessages(pending)).some((message) =>
      message.toolCalls?.some((tool) => tool.id === 'pending-call'),
    ),
    false,
  );
  const finished = [
    ...pending,
    { id: 'accepted', role: 'tool', toolCallId: 'pending-call', content: 'Task accepted.' },
  ];
  assert.deepEqual(projectCompleteMessages(finished), projectMessages(finished));
});

test('partially answered parallel calls are not saved as a completed tool exchange', () => {
  const messages: AguiMessage[] = [
    user,
    { id: 'parallel', role: 'assistant', toolCalls: [call('a'), call('b')] },
    { id: 'result-a', role: 'tool', toolCallId: 'a', content: 'First result.' },
  ];
  assert.deepEqual(projectCompleteMessages(messages), projectMessages([user]));
});

test('a stale delegation callback cannot bind itself to a newer user request', () => {
  assert.doesNotThrow(() => assertCurrentChatRequest([user], 'request'));
  assert.throws(
    () =>
      assertCurrentChatRequest(
        [user, { id: 'new-request', role: 'user', content: 'A different task.' }],
        'request',
      ),
    /user request changed/,
  );
  assert.throws(() => assertCurrentChatRequest([], 'request'), /user request changed/);
});

test('chat replacement waits for the aborted stream to settle and propagates a detach failure', async () => {
  const steps: string[] = [];
  let settle!: () => void;
  const finished = new Promise<void>((resolve) => {
    settle = resolve;
  });
  const transition = stopChatBeforeSwitch({
    stopGeneration: () => {
      steps.push('abort');
    },
    agent: {
      detachActiveRun: async () => {
        steps.push('detach');
        await finished;
        steps.push('settled');
      },
    },
  }).then(() => {
    steps.push('replace');
  });
  assert.deepEqual(steps, ['abort', 'detach']);
  settle();
  await transition;
  assert.deepEqual(steps, ['abort', 'detach', 'settled', 'replace']);
  await assert.rejects(
    stopChatBeforeSwitch({
      stopGeneration() {},
      agent: {
        async detachActiveRun() {
          throw new Error('Could not detach.');
        },
      },
    }),
    /Could not detach/,
  );
});
