import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { logicFormula } from '../../lib/workflow-core/src/core/durable-tools';
import type { ToolExecutionContext } from '../../lib/workflow-contracts/src/tool-types';
import { LocalWorkflowSnapshotSchema } from '../../lib/workflow-contracts/src/generated-schemas';
import type { WorkflowBlock } from '../../lib/workflow-contracts/src/domain/workflow-types';
import { createWorkflowEdgeRecord } from '../../lib/workflow-core/src/core/edges';
import {
  executeDurableWorkflow,
  unsupportedDurableToolIds,
} from '../../artifacts/api-server/src/lib/workflow-runs/executor';

const instant = '2026-01-02T03:04:05.000Z';

function block(
  id: string,
  family: WorkflowBlock['family'],
  subtype: WorkflowBlock['subtype'],
  config: Record<string, unknown>,
): WorkflowBlock {
  return {
    id,
    family,
    subtype,
    label: id,
    description: '',
    status: 'configured',
    position: { x: 0, y: 0 },
    config,
    runtime: {
      visible: true,
      editableInRuntime: true,
      generatedUiLocked: false,
      masked: false,
      showInRuns: true,
    },
    createdAt: instant,
    updatedAt: instant,
    createdBy: 'test',
    updatedBy: 'test',
  };
}

function definition() {
  const backup = JSON.parse(readFileSync('tests/fixtures/backups/legacy-v0.json', 'utf8'));
  const base = LocalWorkflowSnapshotSchema.parse(backup['custom:synthetic-recovery'].draft);
  return {
    ...base,
    id: 'custom:durable-test',
    name: 'Durable arithmetic',
    blocks: [
      block('source', 'Source', 'Manual Entry', { toolId: 'source.manual_value', value: 125 }),
      block('formula', 'Logic', 'Formula', {
        toolId: 'logic.formula',
        operation: 'percentage',
        operands: ['source.value', 20],
      }),
    ],
    edges: [
      createWorkflowEdgeRecord({
        sourceBlockId: 'source',
        targetBlockId: 'formula',
        reason: 'Use the immutable saved value',
        createdAt: instant,
      }),
    ],
  };
}

test('durable runtime executes explicit saved values without sample substitution', () => {
  const saved = definition();
  saved.blocks[0]!.config.sourceLocator = 'manual-ledger:42';
  const result = executeDurableWorkflow(saved, 'durable-run-one');
  assert.equal(result.result.status, 'success');
  assert.equal(result.result.runId, 'durable-run-one');
  assert.equal(result.result.results.find((item) => item.blockId === 'formula')?.output.value, 25);
  assert.equal(result.result.results[0]?.evidenceRefs[0]?.locator, 'manual-ledger:42');
});

test('durable runtime rejects unsupported tools before enqueue', () => {
  const changed = definition();
  changed.blocks[1]!.config.toolId = 'source.uninstalled';
  assert.deepEqual(unsupportedDurableToolIds(changed), ['source.uninstalled']);
});

test('durable runtime reports missing explicit values as an execution error', () => {
  const changed = definition();
  changed.blocks[0]!.config = { toolId: 'source.manual_value' };
  const result = executeDurableWorkflow(changed, 'durable-run-missing-value');
  assert.equal(result.result.status, 'error');
  assert.match(result.result.errors[0] ?? '', /requires an explicit numeric value/i);
});

test('formula rejects each unresolved operand instead of calculating a partial result', () => {
  for (const operands of [
    [100, 'missing.value'],
    ['missing.value', 100],
    [100, null],
  ]) {
    const changed = definition();
    changed.blocks[1]!.config = { toolId: 'logic.formula', operation: 'add', operands };
    const result = executeDurableWorkflow(changed, 'invalid-formula');
    const formula = result.result.results.find((item) => item.blockId === 'formula');
    assert.equal(formula?.status, 'error');
    assert.equal(formula?.output.value, undefined);
    assert.match(formula?.errors.join(' ') ?? '', /operand/i);
  }
});

test('formula preserves zero, negative numbers and qualified references', () => {
  const changed = definition();
  changed.blocks[1]!.config = {
    toolId: 'logic.formula',
    operation: 'add',
    operands: ['source.value', 0, -25],
  };
  const result = executeDurableWorkflow(changed, 'valid-formula');
  assert.equal(result.result.status, 'success');
  assert.equal(result.result.results.find((item) => item.blockId === 'formula')?.output.value, 100);
});

test('a historical API reference never becomes a fabricated numeric value', () => {
  const changed = definition();
  changed.blocks = [
    block('reference', 'Source', 'API / HTTP Request', {
      toolId: 'source.manual_value',
      sourceKind: 'api_reference',
      sourceLocator: 'https://example.invalid/rates',
    }),
  ];
  changed.edges = [];
  const result = executeDurableWorkflow(changed, 'reference-only');
  assert.equal(result.result.results[0]?.output.value, undefined);
  assert.deepEqual(result.result.results[0]?.output.apiReference, {
    locator: 'https://example.invalid/rates',
    label: 'reference',
  });
  assert.equal(result.result.status, 'warning');
});

test('formula retains named aggregate references and rejects ambiguous short names', () => {
  const workflow = definition();
  const context: ToolExecutionContext = {
    workflow,
    block: workflow.blocks[1]!,
    config: { operation: 'add', operands: ['source.final_totals.net', -5] },
    allResults: {},
    evidenceRefs: [],
    sourceTrace: [],
    runId: 'named-totals',
    startedAt: instant,
    upstreamBlocks: [workflow.blocks[0]!],
    upstreamOutputs: {},
    upstreamResults: [
      {
        blockId: 'source',
        toolId: 'logic.aggregation',
        runId: 'named-totals',
        startedAt: instant,
        completedAt: instant,
        status: 'success',
        output: { finalTotals: { net: { value: 30 } } },
        logs: [],
        errors: [],
        warnings: [],
        evidenceRefs: [],
        sourceTrace: [],
      },
    ],
  };
  assert.equal(logicFormula.execute(context).output.value, 25);
  context.upstreamResults[0]!.output = { value: 30, total: 40 };
  context.config.operands = ['source'];
  assert.equal(logicFormula.execute(context).status, 'error');
  context.config.operands = ['source.value', 0];
  context.config.operation = 'divide';
  assert.equal(logicFormula.execute(context).status, 'error');
});
