import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  readChatAgent,
  readChatAuthors,
  readOriginalChatAgent,
  rememberChatAuthors,
  tagChatAgent,
} from '@/features/assistant/runtime/chat/chat-agent';
import {
  projectMessages,
  reconstructMessages,
  type AguiMessage,
  type ProjectedMessage,
} from '@/features/assistant/runtime/chat/message-codec';
import {
  readWorkflowBinding,
  withWorkflowBinding,
} from '@/features/assistant/runtime/chat/workflow-binding';

test('next-agent selection saves without relabeling settled messages, tools or the exact workflow', () => {
  const transcript: AguiMessage[] = [
    { id: 'user', role: 'user', content: 'Review this run.' },
    { id: 'sina-answer', role: 'assistant', content: 'I will prepare a proposal.' },
    {
      id: 'sina-tool',
      role: 'assistant',
      toolCalls: [
        { id: 'proposal-call', function: { name: 'proposeWorkflowChange', arguments: '{}' } },
      ],
    },
    {
      id: 'proposal-result',
      role: 'tool',
      toolCallId: 'proposal-call',
      content: '{"status":"review-required","agentId":"sina"}',
    },
  ];
  const authors = rememberChatAuthors(transcript, {}, 'sina');
  assert.equal(rememberChatAuthors(transcript, authors, 'microsina'), authors);
  const binding = { workflowId: 'fapi', runId: 'exact-run', afterMessageId: 'sina-answer' };
  const rows = tagChatAgent(
    withWorkflowBinding(projectMessages(transcript), 'same-chat', binding),
    'microsina',
    'sina',
    authors,
  );
  const restored = JSON.parse(JSON.stringify(rows));
  assert.equal(readChatAgent(restored), 'microsina');
  assert.equal(readOriginalChatAgent(restored), 'sina');
  assert.deepEqual(readWorkflowBinding(restored), binding);
  assert.deepEqual(readChatAuthors(restored), {
    'sina-answer': 'sina',
    'proposal-call': 'sina',
    'proposal-result': 'sina',
  });
  const modelMessages = reconstructMessages(restored);
  assert.equal(
    modelMessages.find((message) => message.id === 'proposal-result')?.content,
    transcript[3].content,
  );
  assert.ok(
    modelMessages.every(
      (message) => !('authorAgent' in message) && !('selectedChatAgent' in message),
    ),
  );
  assert.ok(!String(modelMessages[0].content).includes('selectedChatAgent'));
});

test('later MicroSina text and tools keep distinct authors across save and reload', () => {
  const old: AguiMessage[] = [{ id: 'sina', role: 'assistant', content: 'Sina first.' }];
  const messages: AguiMessage[] = [
    ...old,
    {
      id: 'micro',
      role: 'assistant',
      content: 'MicroSina next.',
      toolCalls: [
        { id: 'micro-call', function: { name: 'inspectWorkflowBlock', arguments: '{}' } },
      ],
    },
    { id: 'micro-result', role: 'tool', toolCallId: 'micro-call', content: 'Ready' },
  ];
  const authors = rememberChatAuthors(messages, rememberChatAuthors(old, {}, 'sina'), 'microsina');
  const saved = tagChatAgent(projectMessages(messages), 'sina', 'sina', authors);
  assert.deepEqual(readChatAuthors(saved), {
    sina: 'sina',
    micro: 'microsina',
    'micro-call': 'microsina',
    'micro-result': 'microsina',
  });
  const reloaded = reconstructMessages(saved);
  assert.deepEqual(
    rememberChatAuthors(reloaded, readChatAuthors(saved), 'sina'),
    readChatAuthors(saved),
  );
});

test('first MicroSina turn and legacy MicroSina history preserve their original provider', () => {
  const messages = [{ id: 'old', role: 'assistant', content: 'Original answer' }];
  const fresh = tagChatAgent(projectMessages(messages), 'microsina');
  assert.equal(readOriginalChatAgent(fresh), 'microsina');
  assert.deepEqual(readChatAuthors(fresh), { old: 'microsina' });
  const legacy: ProjectedMessage[] = [
    {
      id: 'old',
      role: 'assistant',
      seq: 0,
      content: { text: 'Old answer', chatAgent: 'microsina' },
    },
  ];
  assert.equal(readChatAgent(legacy), 'microsina');
  assert.deepEqual(readChatAuthors(legacy), { old: 'microsina' });
  const switched = tagChatAgent(
    legacy,
    'sina',
    readOriginalChatAgent(legacy),
    readChatAuthors(legacy),
  );
  assert.equal(readChatAgent(switched), 'sina');
  assert.deepEqual(readChatAuthors(switched), { old: 'microsina' });
  assert.deepEqual(readChatAuthors(projectMessages(messages)), { old: 'sina' });
});

test('unsupported next-agent, legacy-agent and per-message authors fail instead of being relabeled', () => {
  for (const field of ['chatAgent', 'selectedChatAgent', 'authorAgent']) {
    const rows = [
      {
        id: 'unknown',
        role: 'assistant',
        seq: 0,
        content: { text: 'Keep the evidence', [field]: 'future-agent' },
      },
    ] as ProjectedMessage[];
    assert.throws(
      () => (field === 'selectedChatAgent' ? readChatAgent(rows) : readChatAuthors(rows)),
      /unsupported agent/,
    );
  }
});
