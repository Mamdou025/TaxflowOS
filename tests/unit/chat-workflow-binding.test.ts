import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  withWorkflowBinding,
  readWorkflowBinding,
  workflowAnchorForMessages,
} from '@/features/assistant/runtime/chat/workflow-binding';
import {
  projectMessages,
  reconstructMessages,
} from '@/features/assistant/runtime/chat/message-codec';
import { tagChatAgent, readChatAgent } from '@/features/assistant/runtime/chat/chat-agent';

test('exact run identity survives chat serialization without entering model context', () => {
  const messages = [{ id: 'user-1', role: 'user', content: 'Explain step three.' }];
  const ref = { workflowId: 'company-workflow', runId: 'older-run' };
  const saved = tagChatAgent(
    withWorkflowBinding(projectMessages(messages), 'chat-1', ref),
    'microsina',
  );
  const restored = JSON.parse(JSON.stringify(saved));
  assert.deepEqual(readWorkflowBinding(restored), ref);
  assert.deepEqual(reconstructMessages(restored), messages);
  assert.equal(readChatAgent(restored), 'microsina');
});

test('a workflow-only conversation can persist without inventing a message', () => {
  const saved = withWorkflowBinding([], 'chat-1', { workflowId: 'workflow', runId: 'run' });
  assert.deepEqual(reconstructMessages(saved), []);
  assert.equal(readWorkflowBinding(saved)?.runId, 'run');
  assert.notEqual(saved[0].id, withWorkflowBinding([], 'chat-2', null)[0].id);
});

test('legacy chats never infer a binding and malformed links fail explicitly', () => {
  assert.equal(readWorkflowBinding([{ content: { text: 'Run the latest workflow' } }]), null);
  assert.equal(readWorkflowBinding(withWorkflowBinding([], 'chat', null)), null);
  for (const value of [{ workflowId: 'a' }, { workflowId: 'a', runId: '' }, 'run'])
    assert.throws(
      () => readWorkflowBinding([{ content: { workflowBinding: value } }]),
      /invalid workflow link/,
    );
});

test('launcher position survives later conversation and reload without a synthetic message', () => {
  const opening = [
    { id: 'user-before', role: 'user', content: 'Let us calculate this.' },
    { id: 'assistant-before', role: 'assistant', content: 'Ready when you are.' },
  ];
  const binding = {
    workflowId: 'workflow',
    runId: 'exact-run',
    afterMessageId: workflowAnchorForMessages(opening),
  };
  const messages = [...opening, { id: 'follow-up', role: 'user', content: 'Change the rate.' }];
  const saved = withWorkflowBinding(projectMessages(messages), 'chat', binding);
  const restored = JSON.parse(JSON.stringify(saved));
  assert.equal(readWorkflowBinding(restored)?.afterMessageId, 'assistant-before');
  assert.deepEqual(reconstructMessages(restored), messages);
});

test('a beginning anchor remains explicit while legacy links stay unanchored', () => {
  const ref = { workflowId: 'workflow', runId: 'run' };
  const binding = { ...ref, afterMessageId: workflowAnchorForMessages([]) };
  const saved = withWorkflowBinding([], 'chat', binding);
  assert.deepEqual(readWorkflowBinding(JSON.parse(JSON.stringify(saved))), {
    ...ref,
    afterMessageId: null,
  });
  assert.deepEqual(reconstructMessages(saved), []);
  assert.deepEqual(readWorkflowBinding(withWorkflowBinding([], 'legacy-chat', ref)), ref);
});

test('anchors use serialized IDs and do not point inside pending tool exchanges', () => {
  const messages = [
    { id: 'user', role: 'user', content: 'Read this first.' },
    {
      id: 'assistant',
      role: 'assistant',
      toolCalls: [{ id: 'call', function: { name: 'readSomething', arguments: '{}' } }],
    },
  ];
  assert.equal(workflowAnchorForMessages(messages), 'user');
  const complete = [...messages, { id: 'result', role: 'tool', toolCallId: 'call', content: '{}' }];
  assert.equal(workflowAnchorForMessages(complete), 'result');
  assert.equal(reconstructMessages(projectMessages(complete)).at(-1)?.id, 'result');
});

test('invalid persisted anchors fail without changing the exact run identity', () => {
  for (const afterMessageId of [12, '', ' ', {}, undefined])
    assert.throws(
      () =>
        readWorkflowBinding([
          {
            content: { workflowBinding: { workflowId: 'workflow', runId: 'run', afterMessageId } },
          },
        ]),
      /invalid workflow position/,
    );
});
