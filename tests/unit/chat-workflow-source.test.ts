import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prepareWorkflowRunInput } from '../../artifacts/ai-workflow-builder/src/features/assistant/runtime/workflow-run-input';
import { executeWorkflowCommand } from '../../lib/workflow-core/src/application/template-command';
import { getWorkflowConfig } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/runtime/workflow-runs';
import { executeWorkflowDefinition } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/workflow/execute';

const source = () => ({
  fileName: 'supplied-records.json',
  at: 1,
  rows: [
    { rowId: 'one', label: 'Item one', amount: 120 },
    { rowId: 'two', label: 'Item two', amount: 80 },
  ],
});
const runtime = {
  resolveTemplate: getWorkflowConfig,
  execute: executeWorkflowDefinition,
  createWorkflowId: () => 'test-source-run',
};

test('explicit uploaded source uses the original rows even when the model emits an empty array', () => {
  const prepared = prepareWorkflowRunInput(
    { workflowId: 'document-calculator', sourceMode: 'uploaded', recordsJson: '[]' },
    source(),
  );
  const result = executeWorkflowCommand(prepared.args, undefined, runtime);
  assert.ok(result.core);
  assert.equal(result.sample, false);
  assert.equal(result.core.detail.sourceRows.length, 2);
  assert.equal(
    result.core.detail.sourceRows.reduce((sum, row) => sum + row.amount, 0),
    200,
  );
  assert.equal(result.core.detail.sourceRows[0].sourceFileName, 'supplied-records.json');
});

test('approval input is a frozen snapshot even if the selected source changes', () => {
  const selected = source();
  const prepared = prepareWorkflowRunInput(
    { workflowId: 'fapi', sourceMode: 'uploaded' },
    selected,
  );
  selected.rows[0].amount = 9999;
  selected.fileName = 'replacement.json';
  assert.equal(JSON.parse(prepared.args.recordsJson!)[0].amount, 120);
  assert.equal(prepared.source?.fileName, 'supplied-records.json');
});

test('missing uploads cannot fall back to inline or sample data', () => {
  assert.throws(
    () =>
      prepareWorkflowRunInput(
        { workflowId: 'fapi', sourceMode: 'uploaded', useSample: true },
        undefined,
      ),
    /Choose a source/,
  );
  assert.throws(
    () =>
      prepareWorkflowRunInput(
        { workflowId: 'fapi', sourceMode: 'uploaded' },
        { ...source(), rows: [] },
      ),
    /Choose a source/,
  );
  assert.throws(
    () => prepareWorkflowRunInput({ workflowId: 'fapi', sourceMode: 'records' }, source()),
    /Supply inline records/,
  );
});

test('explicit invalid inline records remain invalid despite an available uploaded source', () => {
  const prepared = prepareWorkflowRunInput(
    { workflowId: 'document-calculator', sourceMode: 'records', recordsJson: '[]' },
    source(),
  );
  assert.throws(() => executeWorkflowCommand(prepared.args, source().rows, runtime), /non-empty/);
});

test('sample execution remains explicit and overrides neither the uploaded source nor its contents', () => {
  const selected = source();
  const prepared = prepareWorkflowRunInput(
    { workflowId: 'document-calculator', sourceMode: 'sample' },
    selected,
  );
  assert.equal(prepared.args.useSample, true);
  assert.equal(prepared.args.recordsJson, undefined);
  assert.deepEqual(selected, source());
});
