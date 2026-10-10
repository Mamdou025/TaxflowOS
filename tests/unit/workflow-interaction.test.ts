import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseWorkflowInteraction,
  type WorkflowInteraction,
} from '../../artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/workflow-interaction';

const opened: WorkflowInteraction = {
  id: 'selection-1',
  afterMessageId: 'list-receipt',
  kind: 'saved-version',
  status: 'opened',
  name: 'Synthetic FAPI',
  requestedWorkflowId: 'custom:exact',
  workflowId: 'custom:exact',
  version: 2,
  runId: 'run-exact',
  message: 'Opened Synthetic FAPI · version 2. No calculations have run.',
  occurredAt: '2026-10-09T12:00:00.000Z',
};

test('selection metadata preserves exact identity and position across JSON storage', () => {
  assert.deepEqual(parseWorkflowInteraction(JSON.parse(JSON.stringify(opened))), opened);
  assert.equal(parseWorkflowInteraction(undefined), null);
  assert.equal(parseWorkflowInteraction(null), null);
});

test('failed selections and draft focus cannot invent run/version identities', () => {
  const draft = { ...opened, kind: 'draft', version: undefined, runId: undefined };
  assert.equal(parseWorkflowInteraction(draft)?.kind, 'draft');
  assert.throws(() => parseWorkflowInteraction({ ...draft, runId: 'old-run' }), /invalid/);
  const failed = { ...opened, status: 'failed', version: undefined, runId: undefined };
  assert.equal(parseWorkflowInteraction(failed)?.status, 'failed');
  assert.throws(() => parseWorkflowInteraction({ ...opened, runId: undefined }), /invalid/);
  assert.throws(() => parseWorkflowInteraction({ ...opened, version: 0 }), /invalid/);
  assert.throws(() => parseWorkflowInteraction({ ...opened, workflowId: '' }), /invalid/);
});

test('malformed selection receipts fail explicitly instead of acquiring a current run', () => {
  for (const patch of [
    { kind: ['saved-version'] },
    { status: ['opened'] },
    { afterMessageId: 42 },
    { occurredAt: 'not a date' },
    { name: null },
  ])
    assert.throws(() => parseWorkflowInteraction({ ...opened, ...patch }), /invalid/);
  assert.throws(() => parseWorkflowInteraction('run-exact'), /could not be read/);
});
