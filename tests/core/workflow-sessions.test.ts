import { inspectWorkflowRun } from '../../lib/workflow-core/src/application/inspection';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { executeGraph } from '../../lib/workflow-core/src/core/graph';
import { createWorkflowEdgeRecord } from '../../lib/workflow-core/src/core/edges';
import type { GraphRuntime } from '../../lib/workflow-core/src/core/ports';
import {
  createWorkflow,
  saveVersion,
  replaceDraft,
} from '../../lib/workflow-core/src/application/commands';
import {
  startSession,
  changeSession,
  getSession,
  sessionContext,
  sessionDefinition,
} from '../../lib/workflow-core/src/application/sessions';
import { LocalWorkflowSnapshotSchema } from '../../lib/workflow-contracts/src/generated-schemas';
import { validateWorkflowLibrary } from '../../lib/workflow-contracts/src/library';
import type { WorkflowBlock } from '../../lib/workflow-contracts/src/domain/workflow-types';
import type {
  ToolDefinition,
  ToolExecutionContext,
} from '../../lib/workflow-contracts/src/tool-types';
const instant = '2026-01-02T03:04:05.000Z';
function definition() {
  const backup = JSON.parse(readFileSync('tests/fixtures/backups/legacy-v0.json', 'utf8'));
  const base = LocalWorkflowSnapshotSchema.parse(backup['custom:synthetic-recovery'].draft);
  const block = (id: string, x: number): WorkflowBlock => ({
    id,
    family: 'Logic',
    subtype: 'Calculation Engine',
    label: id,
    description: '',
    status: 'configured',
    position: { x, y: 0 },
    config: { toolId: id },
    runtime: {
      visible: true,
      editableInRuntime: true,
      generatedUiLocked: false,
      masked: false,
      showInRuns: true,
    },
    createdAt: instant,
    updatedAt: instant,
    createdBy: 'fixture',
    updatedBy: 'fixture',
  });
  // Reverse display order exercises dependency ordering rather than array order.
  return {
    ...base,
    id: 'custom:core',
    name: 'Independent arithmetic',
    blocks: [
      block('double', 0),
      { ...block('total', 1), config: { toolId: 'total', values: [120, 80] } },
    ],
    edges: [
      createWorkflowEdgeRecord({
        sourceBlockId: 'total',
        targetBlockId: 'double',
        reason: 'Supply total',
        createdAt: instant,
      }),
    ],
  };
}
function runtime() {
  let calls = 0,
    ids = 0;
  const tools: Record<string, ToolDefinition> = {};
  for (const [toolId, compute] of Object.entries({
    total: (ctx: ToolExecutionContext) =>
      (ctx.config.values as number[]).reduce((a, b) => a + b, 0),
    double: (ctx: ToolExecutionContext) => Number(ctx.upstreamResults[0].output.value) * 2,
  }))
    tools[toolId] = {
      toolId,
      family: 'Logic',
      toolGroup: 'calculation',
      displayName: toolId,
      description: '',
      inputRoles: [],
      outputRoles: [],
      inputSchema: { fields: [] },
      outputSchema: { fields: [{ key: 'value', type: 'number', required: true }] },
      defaultConfig: {},
      runMode: 'local_mock',
      execute: (ctx) => {
        calls++;
        return {
          blockId: ctx.block.id,
          runId: ctx.runId,
          toolId,
          status: 'success',
          output: { value: compute(ctx) },
          logs: [],
          warnings: [],
          errors: [],
          evidenceRefs: [],
          sourceTrace: [],
          startedAt: ctx.startedAt,
          completedAt: ctx.startedAt,
        };
      },
    };
  const ports: GraphRuntime = {
    resolveToolId: (block) => String(block.config.toolId),
    getTool: (id) => tools[id] ?? null,
    createId: () => `fixed-run-${++ids}`,
    now: () => new Date(instant),
  };
  return {
    ports,
    tools,
    calls: () => calls,
    execute: (d: ReturnType<typeof definition>) => executeGraph({ definition: d }, ports),
  };
}

test('guided execution freezes Build version and records real block results with dependency invalidation', () => {
  const engine = runtime();
  let entry = startSession(
    saveVersion(createWorkflow('custom:core', 'core', definition()), instant),
    1,
    'session-1',
    instant,
  );
  assert.throws(
    () => changeSession(entry, 'session-1', 0, { kind: 'block', blockId: 'double' }, engine.ports),
    /dependencies/,
  );
  entry = changeSession(
    entry,
    'session-1',
    0,
    { kind: 'block', blockId: 'total' },
    engine.ports,
    instant,
  );
  entry = changeSession(
    entry,
    'session-1',
    1,
    { kind: 'block', blockId: 'double' },
    engine.ports,
    instant,
  );
  assert.equal(getSession(entry, 'session-1').results.double.output.value, 400);
  entry = changeSession(entry, 'session-1', 2, { kind: 'approve' }, engine.ports, instant);
  assert.equal(entry.runs.length, 1);
  const old = JSON.stringify(entry.runs[0]);
  entry = changeSession(
    entry,
    'session-1',
    3,
    { kind: 'block', blockId: 'total' },
    engine.ports,
    instant,
  );
  const run = getSession(entry, 'session-1');
  assert.equal(run.approvedAt, undefined);
  assert.deepEqual(run.stale, ['double']);
  assert.equal(run.attempts.length, 3);
  assert.equal(JSON.stringify(entry.runs[0]), old);
  assert.throws(
    () => changeSession(entry, 'session-1', 3, { kind: 'pause' }, engine.ports),
    /changed/,
  );
  assert.throws(
    () => changeSession(entry, 'session-1', 4, { kind: 'approve' }, engine.ports),
    /Complete/,
  );
  const changed = structuredClone(entry.draft);
  changed.blocks[1].config.values = [900];
  entry = saveVersion(replaceDraft(entry, changed), instant);
  assert.deepEqual(
    sessionDefinition(entry, getSession(entry, 'session-1')).blocks[1].config.values,
    [120, 80],
  );
  assert.equal(entry.versions.length, 2);
  assert.equal(sessionContext(entry, getSession(entry, 'session-1')).version, 1);
  assert.deepEqual(
    validateWorkflowLibrary(JSON.parse(JSON.stringify({ [entry.id]: entry })))[entry.id]
      .sessions?.[0].stale,
    ['double'],
  );
});

test('source replacement and addition preserve evidence and reject ambiguous or oversized operations', () => {
  const engine = runtime();
  const d = definition();
  d.blocks[1].family = 'Source';
  d.blocks[1].config.sourceKind = 'manual_table';
  let entry = startSession(
    saveVersion(createWorkflow('custom:core', 'core', d), instant),
    1,
    'session-2',
    instant,
  );
  entry = changeSession(
    entry,
    'session-2',
    0,
    {
      kind: 'source',
      blockId: 'total',
      sourceId: 'a',
      name: 'First',
      mode: 'replace',
      rows: [{ rowId: '1', amount: 10 }],
    },
    engine.ports,
    instant,
  );
  entry = changeSession(
    entry,
    'session-2',
    1,
    {
      kind: 'source',
      blockId: 'total',
      sourceId: 'b',
      name: 'Second',
      mode: 'add',
      rows: [{ rowId: '1', amount: 20 }],
    },
    engine.ports,
    instant,
  );
  let rows = sessionDefinition(entry, getSession(entry, 'session-2')).blocks[1].config
    .rows as Record<string, unknown>[];
  assert.deepEqual(
    rows.map((row) => row.amount),
    [10, 20],
  );
  assert.notEqual(rows[0].rowId, rows[1].rowId);
  entry = changeSession(
    entry,
    'session-2',
    2,
    {
      kind: 'source',
      blockId: 'total',
      sourceId: 'c',
      name: 'Replacement',
      mode: 'replace',
      rows: [{ amount: 30 }],
    },
    engine.ports,
    instant,
  );
  rows = sessionDefinition(entry, getSession(entry, 'session-2')).blocks[1].config.rows as Record<
    string,
    unknown
  >[];
  assert.deepEqual(
    rows.map((row) => row.amount),
    [30],
  );
  assert.equal(getSession(entry, 'session-2').sources.length, 3);
  assert.equal(getSession(entry, 'session-2').paused, true);
  assert.throws(
    () =>
      changeSession(
        entry,
        'session-2',
        3,
        {
          kind: 'source',
          blockId: 'total',
          sourceId: 'too-large',
          name: 'Too large',
          mode: 'add',
          rows: Array.from({ length: 50000 }, (_, index) => ({ rowId: String(index), amount: 1 })),
        },
        engine.ports,
      ),
    /combined source exceeds/,
  );
  assert.equal(getSession(entry, 'session-2').sources.length, 3);
  assert.throws(
    () =>
      changeSession(
        entry,
        'session-2',
        3,
        {
          kind: 'source',
          blockId: 'double',
          sourceId: 'd',
          name: 'Bad',
          mode: 'replace',
          rows: [{ amount: 4 }],
        },
        engine.ports,
      ),
    /source block/,
  );
});

test('missing tools and checkpoints do not fabricate success or advance dependents', () => {
  const engine = runtime();
  engine.tools.total.execute = (ctx) => ({
    blockId: ctx.block.id,
    runId: ctx.runId,
    toolId: 'total',
    status: 'needs_review',
    output: { value: 200 },
    logs: [],
    warnings: ['Confirm classification'],
    errors: [],
    evidenceRefs: [],
    sourceTrace: [],
    startedAt: instant,
    completedAt: instant,
  });
  let entry = startSession(
    saveVersion(createWorkflow('custom:core', 'core', definition()), instant),
    1,
    'review',
    instant,
  );
  entry = changeSession(
    entry,
    'review',
    0,
    { kind: 'block', blockId: 'total' },
    engine.ports,
    instant,
  );
  assert.equal(getSession(entry, 'review').paused, true);
  assert.throws(
    () => changeSession(entry, 'review', 1, { kind: 'block', blockId: 'double' }, engine.ports),
    /dependencies/,
  );
  entry = changeSession(
    entry,
    'review',
    1,
    { kind: 'review', blockId: 'total' },
    engine.ports,
    instant,
  );
  entry = changeSession(
    entry,
    'review',
    2,
    { kind: 'block', blockId: 'double' },
    engine.ports,
    instant,
  );
  assert.equal(getSession(entry, 'review').results.double.output.value, 400);
  delete engine.tools.double;
  entry = changeSession(
    entry,
    'review',
    3,
    { kind: 'block', blockId: 'double' },
    engine.ports,
    instant,
  );
  assert.equal(getSession(entry, 'review').results.double.status, 'skipped');
  assert.throws(
    () => changeSession(entry, 'review', 4, { kind: 'approve' }, engine.ports),
    /Complete/,
  );
});

test('Build inspection selects the exact paused session and immutable version without executing or mutating', () => {
  const engine = runtime();
  let entry = startSession(
    saveVersion(createWorkflow('custom:core', 'core', definition()), instant),
    1,
    'old-session',
    instant,
  );
  entry = changeSession(
    entry,
    'old-session',
    0,
    { kind: 'block', blockId: 'total' },
    engine.ports,
    instant,
  );
  entry = changeSession(
    entry,
    'old-session',
    1,
    { kind: 'block', blockId: 'double' },
    engine.ports,
    instant,
  );
  const changed = structuredClone(entry.draft);
  changed.blocks[1].config.values = [900];
  entry = saveVersion(replaceDraft(entry, changed), instant);
  entry = startSession(entry, 2, 'new-session', instant);
  const before = JSON.stringify(entry);
  const calls = engine.calls();
  const evidence = inspectWorkflowRun(entry, 'old-session');
  assert.equal(evidence.version, 1);
  assert.equal(evidence.results.double.output.value, 400);
  assert.deepEqual(evidence.definition.blocks[1].config.values, [120, 80]);
  assert.equal(evidence.attempts.length, 2);
  evidence.results.double.output.value = -1;
  evidence.definition.blocks[1].config.values = [];
  assert.equal(JSON.stringify(entry), before);
  assert.equal(engine.calls(), calls);
  assert.throws(() => inspectWorkflowRun(entry, 'missing'), /exact run/);
  assert.equal(Object.keys(inspectWorkflowRun(entry, 'new-session').results).length, 0);
  entry = changeSession(entry, 'old-session', 2, { kind: 'approve' }, engine.ports, instant);
  const recordedId = entry.runs[0].result.record.execution.id;
  entry = changeSession(
    entry,
    'old-session',
    3,
    { kind: 'block', blockId: 'total' },
    engine.ports,
    instant,
  );
  assert.equal(
    inspectWorkflowRun(entry, 'old-session').steps.find((s) => s.id === 'double')?.status,
    'outdated',
  );
  assert.equal(inspectWorkflowRun(entry, recordedId).results.double.output.value, 400);
  assert.equal(inspectWorkflowRun(entry, recordedId).version, 1);
});
