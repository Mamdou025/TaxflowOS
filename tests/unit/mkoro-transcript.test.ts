import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { MkoroEvent } from '../../lib/api-zod/src/mkoro';
import { projectMkoroEvents } from '../../artifacts/ai-workflow-builder/src/features/assistant/mkoro/mkoro-transcript';

const event = (
  cursor: number,
  type: MkoroEvent['type'],
  payload: MkoroEvent['payload'],
): MkoroEvent => ({
  id: `event-${cursor}`,
  taskId: 'synthetic-task',
  seq: cursor,
  cursor,
  type,
  payload,
  createdAt: '2026-09-28T12:00:00.000Z',
});

test('Mkoro transcript orders streamed fragments and keeps tool progress separate from the reply', () => {
  const events = [
    event(4, 'tool_finished', {
      toolCallId: 'download',
      status: 'completed',
      content: [{ type: 'content', content: { type: 'text', text: 'Downloaded 128 bytes' } }],
    }),
    event(1, 'message_delta', { text: 'Checking ' }),
    event(2, 'message_delta', { text: 'Drive.' }),
    event(3, 'tool_started', {
      toolCallId: 'download',
      title: 'Download workbook',
      status: 'in_progress',
    }),
    event(5, 'message_delta', { text: 'The workbook is ready.' }),
  ];
  const original = JSON.stringify(events);
  assert.deepEqual(projectMkoroEvents(events), [
    { kind: 'text', id: 'event-1', text: 'Checking Drive.' },
    {
      kind: 'tool',
      id: 'download',
      title: 'Download workbook',
      status: 'completed',
      text: 'Downloaded 128 bytes',
    },
    { kind: 'text', id: 'event-5', text: 'The workbook is ready.' },
  ]);
  assert.equal(JSON.stringify(events), original, 'The cached event evidence must remain unchanged');
});

test('Mkoro retains partial and failed actions rather than presenting success without evidence', () => {
  const items = projectMkoroEvents([
    event(1, 'tool_started', { toolCallId: 'upload', title: 'Upload file' }),
    event(2, 'tool_finished', { toolCallId: 'upload', status: 'failed', content: [] }),
    event(3, 'tool_started', { toolCallId: 'inspect', title: 'Inspect page' }),
  ]);
  assert.deepEqual(items, [
    { kind: 'tool', id: 'upload', title: 'Upload file', status: 'failed', text: '' },
    { kind: 'tool', id: 'inspect', title: 'Inspect page', status: 'in_progress', text: '' },
  ]);
});

test('Mkoro treats model/tool HTML as display text and does not turn arbitrary output into navigation', () => {
  const items = projectMkoroEvents([
    event(1, 'message', { text: '<script>steal()</script>' }),
    event(2, 'tool_finished', {
      toolCallId: 'page',
      content: [
        { type: 'content', content: { type: 'image', data: 'oversized-image' } },
        {
          type: 'content',
          content: { type: 'text', text: '<button onclick="steal()">Approve</button>' },
        },
      ],
    }),
    event(3, 'artifact_created', {
      name: 'Workbook',
      path: 'C:\\Mkoro\\output.xlsx',
      url: 'javascript:steal()',
    }),
  ]);
  assert.deepEqual(items, [
    { kind: 'text', id: 'event-1', text: '<script>steal()</script>' },
    {
      kind: 'tool',
      id: 'page',
      title: 'Computer action',
      status: 'completed',
      text: '<button onclick="steal()">Approve</button>',
    },
    { kind: 'artifact', id: 'event-3', name: 'Workbook', path: 'C:\\Mkoro\\output.xlsx' },
  ]);
});
