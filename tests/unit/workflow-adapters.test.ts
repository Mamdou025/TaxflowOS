import { test } from 'node:test';
import assert from 'node:assert/strict';
import { executeWorkflowCommand } from '../../lib/workflow-core/src/application/template-command';
import {
  createWorkflow,
  executeSavedWorkflow,
} from '../../lib/workflow-core/src/application/commands';
import { getWorkflowConfig } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/runtime/workflow-runs';
import { executeWorkflowDefinition } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/workflow/execute';
import { executeSavedWorkflow as builderExecute } from '../../artifacts/ai-workflow-builder/src/features/workflows-hub/services/workflow-commands';
import { validateWorkflowLibrary } from '../../lib/workflow-contracts/src/library';

test('Chat and builder adapters obey the same version, calculation and recorded-run contract', () => {
  const chat = executeWorkflowCommand(
    {
      workflowId: 'document-calculator',
      recordsJson: '[{"label":"Item one","amount":120},{"label":"Item two","amount":80}]',
    },
    undefined,
    {
      resolveTemplate: getWorkflowConfig,
      execute: executeWorkflowDefinition,
      createWorkflowId: () => 'custom:chat-contract',
      context: {
        initiatedBy: { actorId: 'test-actor', workspaceId: 'test-workspace', surface: 'chat' },
      },
    },
    true,
  );
  assert.ok(chat.core);
  assert.ok(chat.entry);
  const builder = builderExecute(
    createWorkflow('custom:builder-contract', 'pf-document-calculator', chat.core.definition),
    {},
  );
  for (const entry of [chat.entry, builder.entry]) {
    assert.equal(entry.versions.length, 1);
    assert.equal(entry.runs.length, 1);
    const { result, version } = entry.runs[0];
    assert.equal(version, 1);
    assert.equal(result.result.workflowId, entry.id);
    assert.equal(result.record.execution.workflowId, entry.id);
    assert.equal(result.record.execution.id, result.result.runId);
    assert.equal(
      result.result.results.find((block) => block.blockId.endsWith('--calculate'))?.output
        .calculatedResults &&
        (
          result.result.results.find((block) => block.blockId.endsWith('--calculate'))!.output
            .calculatedResults as Record<string, unknown>
        ).RESULT,
      400,
    );
    assert.notEqual(result.result.status, 'error');
    assert.equal(
      validateWorkflowLibrary(JSON.parse(JSON.stringify({ [entry.id]: entry })))[entry.id].runs
        .length,
      1,
    );
  }
  assert.equal(chat.entry.runs[0].initiatedBy?.surface, 'chat');
  const original = structuredClone(chat.entry.versions[0]);
  const replay = executeSavedWorkflow(
    chat.entry,
    { saveDraft: false, version: 1 },
    executeWorkflowDefinition,
  );
  assert.equal(replay.entry.versions.length, 1);
  assert.equal(replay.entry.runs.length, 2);
  assert.deepEqual(replay.entry.versions[0], original);
});

test('the shared Chat command validates input before requesting an execution or saved identity', () => {
  let executions = 0,
    identities = 0;
  const runtime = {
    resolveTemplate: getWorkflowConfig,
    execute: () => {
      executions++;
      throw new Error('Unexpected execution');
    },
    createWorkflowId: () => {
      identities++;
      return 'custom:invalid';
    },
  };
  for (const recordsJson of [
    '[]',
    '[{"label":"Item","amount":"bad"}]',
    '[{"rowId":"same","amount":1},{"rowId":"same","amount":2}]',
  ])
    assert.throws(() =>
      executeWorkflowCommand(
        { workflowId: 'document-calculator', recordsJson },
        undefined,
        runtime,
        true,
      ),
    );
  const missing = executeWorkflowCommand(
    { workflowId: 'document-calculator' },
    undefined,
    runtime,
    true,
  );
  assert.equal(missing.core, null);
  assert.equal(executions, 0);
  assert.equal(identities, 0);
});
