import { test } from 'node:test';
import assert from 'node:assert/strict';
import { workflowMessageIndex } from '@/features/assistant/runtime/chat/workflow-position';
import {
  projectMessages,
  reconstructMessages,
} from '@/features/assistant/runtime/chat/message-codec';

test('workflow card stays at its exact opening receipt through follow-ups and restored chats', () => {
  const ref = { workflowId: 'fapi', runId: 'first-run' };
  const messages = [
    { id: 'u', role: 'user', content: 'Start FAPI' },
    {
      id: 'a',
      role: 'assistant',
      toolCalls: [
        { id: 'open', function: { name: 'runWorkflow', arguments: '{"workflowId":"fapi"}' } },
      ],
    },
    { id: 'r', role: 'tool', toolCallId: 'open', content: JSON.stringify(ref) },
    { id: 'q', role: 'user', content: 'Change the rate' },
    {
      id: 'b',
      role: 'assistant',
      toolCalls: [{ id: 'edit', function: { name: 'controlWorkflowRun', arguments: '{}' } }],
    },
    { id: 'e', role: 'tool', toolCallId: 'edit', content: JSON.stringify(ref) },
  ];
  assert.equal(workflowMessageIndex(messages, ref), 2);
  assert.equal(workflowMessageIndex(reconstructMessages(projectMessages(messages)), ref), 2);
  assert.equal(workflowMessageIndex(messages, { ...ref, runId: 'newer-run' }), -1);
  assert.equal(workflowMessageIndex(messages, null), -1);
});

test('untrusted mentions, unfinished tools and failed openings do not place a workflow', () => {
  const ref = { workflowId: 'fapi', runId: 'run' };
  assert.equal(
    workflowMessageIndex(
      [
        { role: 'user', content: JSON.stringify(ref) },
        { role: 'tool', toolCallId: 'unknown', content: JSON.stringify(ref) },
        {
          role: 'assistant',
          toolCalls: [{ id: 'open', function: { name: 'openSavedWorkflowVersion' } }],
        },
        { role: 'tool', toolCallId: 'open', content: '{' },
      ],
      ref,
    ),
    -1,
  );
});

test('launcher position stays beside its saved message when later conversation is restored', () => {
  const messages = [
    { id: 'before', role: 'user', content: 'Let us work on the file.' },
    { id: 'later', role: 'assistant', content: 'We can discuss the rate while it runs.' },
  ];
  const binding = { workflowId: 'fapi', runId: 'run', afterMessageId: 'before' };
  assert.equal(workflowMessageIndex(reconstructMessages(projectMessages(messages)), binding), 0);
  assert.equal(workflowMessageIndex(messages, { ...binding, afterMessageId: null }), -1);
  assert.equal(
    workflowMessageIndex(messages, { ...binding, afterMessageId: 'removed-message' }),
    -1,
  );
});
