import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  projectAssistantUiMessages,
  rawMessageIndex,
  rawMessageSource,
} from '../../artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/assistant-ui-messages';
import type { AguiMessage } from '../../artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/message-codec';

test('visible messages retain their IDs, streaming text and exact raw positions', () => {
  const user: AguiMessage = { id: 'question', role: 'user', content: 'Calculate this.' };
  const firstReply: AguiMessage = { id: 'reply', role: 'assistant', content: 'Opening' };
  const messages = [
    { id: 'policy', role: 'system', content: 'Private instructions' },
    user,
    { id: 'developer', role: 'developer', content: 'More instructions' },
    firstReply,
    { id: 'unknown', role: 'activity', content: 'Unrecognized protocol message' },
    { id: 'orphan', role: 'tool', toolCallId: 'absent', content: 'Orphan result' },
  ];
  const projected = projectAssistantUiMessages(messages);
  assert.deepEqual(
    projected.map(({ id, role, content }) => ({ id, role, content })),
    [
      { id: 'question', role: 'user', content: [{ type: 'text', text: 'Calculate this.' }] },
      { id: 'reply', role: 'assistant', content: [{ type: 'text', text: 'Opening' }] },
    ],
  );
  assert.deepEqual(projected.map(rawMessageIndex), [1, 3]);
  assert.equal(rawMessageSource(projected[0]), user);
  assert.equal(rawMessageSource(projected[1]), firstReply);
  const streamed = { ...firstReply, content: 'Opening the workflow.' };
  const next = projectAssistantUiMessages([...messages.slice(0, 3), streamed]);
  assert.equal(next[1].id, projected[1].id);
  assert.deepEqual(next[1].content, [{ type: 'text', text: 'Opening the workflow.' }]);
  assert.equal(rawMessageSource(next[1]), streamed);
});

test('tool receipts join by call ID and distinguish results, errors and pending calls', () => {
  const messages: AguiMessage[] = [
    {
      id: 'tools',
      role: 'assistant',
      toolCalls: [
        { id: 'pending', function: { name: 'runWorkflow', arguments: '{"workflowId":' } },
        {
          id: 'finished',
          function: { name: 'inspectWorkflowBlock', arguments: '{"blockId":"total"}' },
        },
        { id: 'failed', function: { name: 'controlWorkflowRun', arguments: '{bad json' } },
        { id: 'empty', function: { name: 'lookup', arguments: '[]' } },
      ],
    },
    {
      id: 'error-result',
      role: 'tool',
      toolCallId: 'failed',
      content: '{"error":"Source changed"}',
    },
    {
      id: 'result',
      role: 'tool',
      toolCallId: 'finished',
      content: '{"amount":0,"approved":false}',
    },
    { id: 'empty-result', role: 'tool', toolCallId: 'empty', content: 'null' },
  ];
  const projected = projectAssistantUiMessages(messages);
  assert.equal(projected.length, 1);
  assert.deepEqual(projected[0].content, [
    {
      type: 'tool-call',
      toolCallId: 'pending',
      toolName: 'runWorkflow',
      args: {},
      argsText: '{"workflowId":',
    },
    {
      type: 'tool-call',
      toolCallId: 'finished',
      toolName: 'inspectWorkflowBlock',
      args: { blockId: 'total' },
      argsText: '{"blockId":"total"}',
      result: { amount: 0, approved: false },
      isError: false,
    },
    {
      type: 'tool-call',
      toolCallId: 'failed',
      toolName: 'controlWorkflowRun',
      args: {},
      argsText: '{bad json',
      result: { error: 'Source changed' },
      isError: true,
    },
    {
      type: 'tool-call',
      toolCallId: 'empty',
      toolName: 'lookup',
      args: {},
      argsText: '[]',
      result: null,
      isError: false,
    },
  ]);
  const first = Array.isArray(projected[0].content) ? projected[0].content[0] : undefined;
  assert.ok(first);
  assert.equal(Object.hasOwn(first, 'result'), false);
});

test('plain tool text and explicit error flags survive without invented completion', () => {
  const flagged = {
    role: 'tool',
    toolCallId: 'explicit',
    content: 'Provider unavailable',
    isError: true,
  };
  const protocolError = {
    role: 'tool',
    toolCallId: 'protocol-error',
    content: '',
    error: 'AG-UI tool execution failed',
  };
  const projected = projectAssistantUiMessages([
    {
      id: 'calls',
      role: 'assistant',
      toolCalls: [
        { id: 'plain', function: { name: 'read', arguments: '{}' } },
        { id: 'explicit', function: { name: 'read', arguments: '{}' } },
        { id: 'empty', function: { name: 'read', arguments: '{}' } },
        { id: 'protocol-error', function: { name: 'read', arguments: '{}' } },
      ],
    },
    { role: 'tool', toolCallId: 'plain', content: 'No matching records' },
    flagged,
    { role: 'tool', toolCallId: 'empty' },
    protocolError,
  ]);
  const parts = projected[0].content;
  assert.ok(Array.isArray(parts));
  assert.equal(parts[0].result, 'No matching records');
  assert.equal(parts[0].isError, false);
  assert.equal(parts[1].result, 'Provider unavailable');
  assert.equal(parts[1].isError, true);
  assert.equal(Object.hasOwn(parts[2], 'result'), false);
  assert.equal(parts[3].result, '');
  assert.equal(parts[3].isError, true);
});

test('known user image shapes retain supplied data and unsupported content is omitted', () => {
  const projected = projectAssistantUiMessages([
    {
      id: 'images',
      role: 'user',
      content: [
        { type: 'text', text: 'Review these images.' },
        { type: 'image', source: { type: 'url', value: 'https://example.test/source.png' } },
        { type: 'image', source: { type: 'data', value: 'aW1hZ2U=', mimeType: 'image/png' } },
        { type: 'image_url', image_url: { url: '/source.jpg' } },
        { type: 'image', source: { type: 'data', value: 'unknown' } },
        { type: 'image', source: { type: 'file_id', value: 'not-a-url' } },
        { type: 'audio', source: { type: 'url', value: '/recording.mp3' } },
        { type: 'unknown', text: 'Do not invent a supported part' },
      ],
    },
  ]);
  assert.deepEqual(projected[0].content, [
    { type: 'text', text: 'Review these images.' },
    { type: 'image', image: 'https://example.test/source.png' },
    { type: 'image', image: 'data:image/png;base64,aW1hZ2U=' },
    { type: 'image', image: '/source.jpg' },
  ]);
});

test('conversion is read-only and never touches renderer functions', () => {
  let rendererReads = 0;
  const message: AguiMessage = {
    id: 'frozen',
    role: 'assistant',
    content: 'Saved reply',
    toolCalls: [{ id: 'call', function: { name: 'read', arguments: '{"id":"saved"}' } }],
  };
  Object.defineProperty(message, 'generativeUI', {
    get() {
      rendererReads += 1;
      throw new Error('The converter must not read renderers');
    },
  });
  Object.freeze(message.toolCalls![0].function);
  Object.freeze(message.toolCalls![0]);
  Object.freeze(message.toolCalls);
  Object.freeze(message);
  const raw = Object.freeze([message]);
  const before = JSON.stringify(raw);
  const projected = projectAssistantUiMessages(raw);
  assert.equal(JSON.stringify(raw), before);
  assert.equal(rawMessageSource(projected[0]), message);
  assert.equal(rendererReads, 0);
  assert.deepEqual(projectAssistantUiMessages(raw), projected);
});

test('missing IDs have stable display fallbacks and source readers reject unrelated metadata', () => {
  const messages: AguiMessage[] = [
    {
      role: 'assistant',
      content: '',
      toolCalls: [
        { function: { name: 'lookup', arguments: '{' } },
        { id: 'unfinished-name', function: { arguments: '{}' } },
      ],
    },
  ];
  const first = projectAssistantUiMessages(messages);
  const next = projectAssistantUiMessages(messages);
  assert.equal(first[0].id, 'taxflow:projection:0');
  assert.deepEqual(first, next);
  assert.equal(rawMessageIndex(first[0]), 0);
  assert.equal(rawMessageSource(first[0]), messages[0]);
  assert.equal(rawMessageIndex({}), undefined);
  assert.equal(rawMessageSource({ metadata: { custom: { originalMessage: {} } } }), undefined);
  assert.equal(rawMessageIndex({ metadata: { custom: { originalRawIndex: -1 } } }), undefined);
  assert.equal(rawMessageIndex({ metadata: { custom: { originalRawIndex: 0.5 } } }), undefined);
});
