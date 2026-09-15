import assert from 'node:assert/strict';
import test from 'node:test';
import type { WorkflowDefinition } from '../../lib/workflow-contracts/src/domain/workflow-types';
import { executeWorkflowCommand } from '../../artifacts/ai-workflow-builder/src/features/assistant/runtime/workflow-command';
import { WORKFLOW_CONFIGS } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/runtime/workflow-runs';
import {
  executeDurableWorkflow,
  unsupportedDurableToolIds,
} from '../../artifacts/api-server/src/lib/workflow-runs/executor';
import { LOCAL_TOOL_REGISTRY } from '../../lib/workflow-executors/src/tools/registry';

test('every registered browser tool is admitted by the server executor', () => {
  const command = executeWorkflowCommand({ workflowId: 'document-calculator', useSample: true });
  assert.ok(command.core);
  for (const [toolId, tool] of Object.entries(LOCAL_TOOL_REGISTRY)) {
    const definition: WorkflowDefinition = structuredClone(command.core.definition);
    definition.blocks = [{ ...definition.blocks[0]!, family: tool.family, config: { toolId } }];
    definition.edges = [];
    assert.deepEqual(unsupportedDurableToolIds(definition), [], toolId);
  }
});

test('all executable template snapshots retain outputs, errors and provenance on the server', (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: new Date('2026-09-15T12:00:00Z') });
  for (const config of Object.values(WORKFLOW_CONFIGS)) {
    const command = executeWorkflowCommand({ workflowId: config.id, useSample: true });
    assert.ok(command.core, config.id);
    const durable = executeDurableWorkflow(
      command.core.definition,
      command.core.execution.result.runId,
    );
    assert.equal(durable.result.status, command.core.status, config.id);
    const project = (results: typeof durable.result.results) =>
      results.map((r) => ({
        blockId: r.blockId,
        toolId: r.toolId,
        output: r.output,
        status: r.status,
        errors: r.errors,
        warnings: r.warnings,
        evidenceRefs: r.evidenceRefs,
        sourceTrace: r.sourceTrace,
      }));
    assert.deepEqual(
      project(durable.result.results),
      project(command.core.execution.result.results),
      config.id,
    );
  }
});
