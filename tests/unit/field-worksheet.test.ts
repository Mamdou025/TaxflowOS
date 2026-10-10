import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import type { FieldWorksheetProjection } from '../../lib/workflow-contracts/src/domain/field-worksheet';
import type { WorkflowBlock } from '../../lib/workflow-contracts/src/domain/workflow-types';
import { LocalWorkflowSnapshotSchema } from '../../lib/workflow-contracts/src/generated-schemas';
import { createWorkflowEdgeRecord } from '../../lib/workflow-core/src/core/edges';
import { executeGraph } from '../../lib/workflow-core/src/core/graph';
import { getToolIdForBlock } from '../../lib/workflow-core/src/core/tool-resolution';
import { LOCAL_TOOL_REGISTRY } from '../../lib/workflow-executors/src/tools/registry';
import { fieldFieldBlockTool } from '../../lib/workflow-executors/src/tools/definitions/field-field-block';
import { apiRequestSignature } from '../../lib/workflow-executors/src/api-snapshot';
import { createWorkflow, saveVersion } from '../../lib/workflow-core/src/application/commands';
import {
  changeSession,
  sessionContext,
  startSession,
} from '../../lib/workflow-core/src/application/sessions';

const at = '2026-10-04T12:00:00Z';
function block(id: string, config: Record<string, unknown>): WorkflowBlock {
  return {
    id,
    config,
    label: id,
    description: '',
    family: 'Logic',
    subtype: 'Calculation Engine',
    status: 'configured',
    position: { x: 0, y: 0 },
    runtime: {
      visible: true,
      editableInRuntime: true,
      generatedUiLocked: false,
      masked: false,
      showInRuns: true,
    },
    createdAt: at,
    updatedAt: at,
    createdBy: 'test',
    updatedBy: 'test',
  };
}
function fixture() {
  const backup = JSON.parse(readFileSync('tests/fixtures/backups/legacy-v0.json', 'utf8'));
  const definition = LocalWorkflowSnapshotSchema.parse(backup['custom:synthetic-recovery'].draft);
  const source = block('base', {
    toolId: 'logic.calculation_engine',
    mode: 'inline',
    formulas: [
      { calculationId: 'subtotal', resultKey: 'subtotal', formulaExpression: 'quantity * price' },
    ],
    inputChoices: { quantity: { kind: 'manual', value: 0 }, price: { kind: 'manual', value: 12 } },
  });
  const total = block('calculate', {
    toolId: 'logic.calculation_engine',
    mode: 'inline',
    formulas: [{ calculationId: 'total', resultKey: 'total', formulaExpression: 'base + fee' }],
    inputDefinitions: [
      {
        name: 'base',
        type: 'number',
        binding: { kind: 'source', blockId: 'base', path: ['calculatedResults', 'subtotal'] },
      },
    ],
    inputChoices: { fee: { kind: 'manual', value: 2 } },
  });
  const field = {
    ...block('worksheet', {
      toolId: 'field.field_block',
      worksheetLines: [
        { id: 'zero', label: 'Subtotal', calculationBlockId: 'base', resultKey: 'subtotal' },
        { id: 'grand-total', label: 'Total', calculationBlockId: 'calculate', resultKey: 'total' },
      ],
    }),
    family: 'Field' as const,
    subtype: 'Field Block' as const,
  };
  definition.blocks = [source, total, field];
  const edge = (sourceBlockId: string, targetBlockId: string, targetInputRole: string) =>
    createWorkflowEdgeRecord({
      sourceBlockId,
      targetBlockId,
      reason: 'Supply calculation result',
      sourceOutputRole:
        targetInputRole === 'computed_values' ? 'calculated_results' : 'named_values',
      targetInputRole,
    });
  definition.edges = [
    edge('base', 'calculate', 'named_values'),
    edge('base', 'worksheet', 'computed_values'),
    edge('calculate', 'worksheet', 'computed_values'),
  ];
  const runtime = {
    resolveToolId: getToolIdForBlock,
    getTool: (id: string) => LOCAL_TOOL_REGISTRY[id] ?? null,
    createId: (prefix: string) => `${prefix}-test`,
  };
  return { definition, field, source, total, runtime };
}

test('real generic calculators feed declared worksheet results including zero and upstream bindings', () => {
  const { definition, runtime } = fixture();
  const run = executeGraph({ definition }, runtime);
  const worksheet = run.result.results.find((result) => result.blockId === 'worksheet')!;
  assert.equal(worksheet.status, 'success', worksheet.errors.join('\n'));
  assert.deepEqual(worksheet.output.computedValues, { zero: 0, 'grand-total': 2 });
  const projected = worksheet.output.worksheet as FieldWorksheetProjection;
  assert.equal(projected.lines[0].status, 'current');
  assert.equal(projected.lines[1].dependencies[0].origin, 'source');
  assert.deepEqual(projected.lines[1].dependencies[0].binding, {
    kind: 'source',
    blockId: 'base',
    path: ['calculatedResults', 'subtotal'],
  });
  assert.equal(projected.lines[1].dependencies[0].value, 0);
  const previous = projected.lines[1].dependencies[0].dependencies[0];
  assert.equal(previous.kind, 'calculation');
  assert.equal(previous.calculationBlockId, 'base');
  assert.equal(previous.formula, 'quantity * price');
  assert.deepEqual(
    previous.dependencies.map((item) => [item.key, item.value]),
    [
      ['quantity', 0],
      ['price', 12],
    ],
  );
});

test('an unbound named earlier result expands only when its provider is unambiguous', () => {
  const { definition, total, runtime } = fixture();
  total.config = {
    toolId: 'logic.calculation_engine',
    mode: 'inline',
    formulas: [{ calculationId: 'total', resultKey: 'total', formulaExpression: 'subtotal + fee' }],
    inputChoices: { fee: { kind: 'manual', value: 2 } },
  };
  const run = executeGraph({ definition }, runtime);
  const projected = run.result.results.find((item) => item.blockId === 'worksheet')!.output
    .worksheet as FieldWorksheetProjection;
  const input = projected.lines[1].dependencies[0];
  assert.equal(input.origin, 'connected');
  assert.equal(input.dependencies[0].calculationBlockId, 'base');
  assert.equal(input.dependencies[0].dependencies[0].value, 0);
  total.config.inputChoices = {
    subtotal: { kind: 'manual', value: 8 },
    fee: { kind: 'manual', value: 2 },
  };
  const manualRun = executeGraph({ definition }, runtime);
  const manual = (
    manualRun.result.results.find((item) => item.blockId === 'worksheet')!.output
      .worksheet as FieldWorksheetProjection
  ).lines[1].dependencies[0];
  assert.equal(manual.origin, 'manual');
  assert.deepEqual(manual.dependencies, []);
  total.config.inputChoices = { fee: { kind: 'manual', value: 2 } };
  definition.blocks.push(
    block('other', {
      toolId: 'logic.calculation_engine',
      mode: 'inline',
      formulas: [{ calculationId: 'subtotal', resultKey: 'subtotal', formulaExpression: '0' }],
    }),
  );
  definition.edges.push(
    createWorkflowEdgeRecord({
      sourceBlockId: 'other',
      targetBlockId: total.id,
      reason: 'Second same-name result',
      sourceOutputRole: 'named_values',
      targetInputRole: 'named_values',
    }),
  );
  const ambiguousRun = executeGraph({ definition }, runtime);
  const ambiguous = (
    ambiguousRun.result.results.find((item) => item.blockId === 'worksheet')!.output
      .worksheet as FieldWorksheetProjection
  ).lines[1].dependencies[0];
  assert.equal(ambiguous.origin, 'connected');
  assert.equal(ambiguous.value, 0);
  assert.deepEqual(
    ambiguous.dependencies,
    [],
    'Equal values do not prove which source supplied a legacy merged name',
  );
});

test('declared missing results cannot return an empty successful Field output', () => {
  const { definition, field } = fixture();
  const result = fieldFieldBlockTool.execute({
    workflow: definition,
    block: field,
    config: field.config,
    allResults: {},
    upstreamBlocks: [],
    upstreamResults: [],
    upstreamOutputs: {},
    evidenceRefs: [],
    sourceTrace: [],
    runId: 'isolated',
    startedAt: at,
  });
  assert.equal(result.status, 'needs_review');
  assert.deepEqual(result.output.computedValues, {});
  assert.deepEqual(
    (result.output.worksheet as FieldWorksheetProjection).lines.map((line) => line.status),
    ['missing', 'missing'],
  );
  assert.equal(result.warnings.length, 2);
  const invalid = fieldFieldBlockTool.execute({
    workflow: definition,
    block: field,
    config: { worksheetLines: [] },
    allResults: {},
    upstreamBlocks: [],
    upstreamResults: [],
    upstreamOutputs: {},
    evidenceRefs: [],
    sourceTrace: [],
    runId: 'invalid',
    startedAt: at,
  });
  assert.equal(invalid.status, 'error');
  assert.ok(invalid.errors.length);
});

test('legacy undeclared Field output preserves its existing collection behavior', () => {
  const { definition, field, runtime } = fixture();
  field.config = { toolId: 'field.field_block' };
  const run = executeGraph({ definition }, runtime);
  const result = run.result.results.find((item) => item.blockId === field.id)!;
  assert.equal(result.status, 'success');
  assert.equal(result.output.worksheet, undefined);
  assert.equal((result.output.computedValues as Record<string, unknown>).total, 2);
});

test('a captured operand that differs from an internal result cannot produce a misleading worksheet trace', () => {
  const { definition, source, total, field, runtime } = fixture();
  source.config = {
    toolId: 'logic.calculation_engine',
    mode: 'inline',
    formulas: [{ calculationId: 'base', resultKey: 'base', formulaExpression: '100' }],
  };
  total.config = {
    toolId: 'logic.calculation_engine',
    mode: 'inline',
    formulas: [
      { calculationId: 'base', resultKey: 'base', formulaExpression: '2' },
      { calculationId: 'total', resultKey: 'total', formulaExpression: 'base + 1' },
    ],
  };
  field.config.worksheetLines = [
    { id: 'total', label: 'Total', calculationBlockId: total.id, resultKey: 'total' },
  ];
  const run = executeGraph({ definition }, runtime);
  const calculated = run.result.results.find((item) => item.blockId === total.id)!;
  assert.equal(
    calculated.status,
    'success',
    'Existing calculator arithmetic semantics are unchanged.',
  );
  assert.deepEqual(calculated.output.calculatedResults, { total: 101, base: 2 });
  const displayed = run.result.results.find((item) => item.blockId === field.id)!;
  assert.equal(displayed.status, 'error');
  const line = (displayed.output.worksheet as FieldWorksheetProjection).lines[0];
  assert.equal(line.status, 'invalid');
  assert.equal(line.value, undefined);
  assert.match(line.message ?? '', /Recorded operand base was 100.*dependency is 2/);
  assert.deepEqual(displayed.output.computedValues, {});
});

test('guided Field execution retains current API ancestors and invalidates them after source changes', () => {
  const { definition, field, source, runtime } = fixture();
  const apiConfig = {
    ...LOCAL_TOOL_REGISTRY['source.http_json'].defaultConfig,
    toolId: 'source.http_json',
    sourceKind: 'http_json',
    url: 'https://example.com/prices',
    outputMode: 'values',
    outputMappings: [{ name: 'price', path: 'price', type: 'number' }],
    fetchedPayload: { price: 12 },
  };
  const api = {
    ...block('api', { ...apiConfig, fetchedRequestSignature: apiRequestSignature(apiConfig) }),
    family: 'Source' as const,
    subtype: 'API / HTTP Request' as const,
  };
  source.config.inputChoices = {
    quantity: { kind: 'manual', value: 2 },
    price: { kind: 'source', blockId: api.id, path: ['namedValues', 'price'] },
  };
  field.config.worksheetLines = [
    { id: 'grand-total', label: 'Total', calculationBlockId: 'calculate', resultKey: 'total' },
  ];
  definition.blocks.unshift(api);
  definition.edges = definition.edges.filter(
    (edge) => !(edge.sourceBlockId === 'base' && edge.targetBlockId === field.id),
  );
  definition.edges.push(
    createWorkflowEdgeRecord({
      sourceBlockId: api.id,
      targetBlockId: source.id,
      sourceOutputRole: 'named_values',
      targetInputRole: 'named_values',
      reason: 'Price from captured API',
    }),
  );
  let entry = startSession(
    saveVersion(createWorkflow('custom:guided-field', 'guided-field', definition)),
    1,
    'session',
    at,
  );
  const apply = (action: Parameters<typeof changeSession>[3]) => {
    const session = entry.sessions![0];
    entry = changeSession(entry, session.id, session.revision, action, runtime);
  };
  for (const blockId of ['api', 'base', 'calculate', field.id]) {
    apply({ kind: 'block', blockId });
    assert.equal(
      entry.sessions![0].results[blockId].status,
      'success',
      `${blockId}: ${entry.sessions![0].results[blockId].errors.join('; ')}`,
    );
  }
  let session = entry.sessions![0];
  const shown = session.results[field.id];
  assert.equal(shown.status, 'success', shown.warnings.join('\n'));
  assert.deepEqual(shown.output.computedValues, { 'grand-total': 26 });
  assert.deepEqual(
    shown.inputTransfers?.map((transfer) => transfer.sourceBlockId),
    ['calculate'],
  );
  const line = (shown.output.worksheet as FieldWorksheetProjection).lines[0];
  const earlier = line.dependencies[0].dependencies[0];
  assert.equal(earlier.calculationBlockId, 'base');
  assert.equal(earlier.dependencies.find((item) => item.key === 'price')?.value, 12);
  assert.equal(earlier.dependencies.find((item) => item.key === 'price')?.binding?.kind, 'source');

  apply({ kind: 'inputs', blockId: 'api', patch: { fetchedPayload: { price: 15 } } });
  session = entry.sessions![0];
  assert.ok(session.stale.includes(field.id));
  assert.equal(
    sessionContext(entry, session).steps.find((step) => step.id === field.id)?.ready,
    false,
  );
  assert.throws(
    () => apply({ kind: 'block', blockId: field.id }),
    /missing or outdated dependencies/,
  );
  assert.deepEqual(
    session.results[field.id].output.computedValues,
    { 'grand-total': 26 },
    'Previous result remains historical evidence.',
  );
  for (const blockId of ['api', 'base', 'calculate', field.id]) apply({ kind: 'block', blockId });
  const refreshed = entry.sessions![0].results[field.id];
  assert.equal(refreshed.status, 'success', refreshed.warnings.join('\n'));
  assert.deepEqual(refreshed.output.computedValues, { 'grand-total': 32 });
  assert.deepEqual(
    entry.versions[0].definition.blocks.find((block) => block.id === 'api')!.config.fetchedPayload,
    { price: 12 },
  );
});
