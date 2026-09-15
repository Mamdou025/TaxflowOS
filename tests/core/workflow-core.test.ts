import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { executeGraph } from '../../lib/workflow-core/src/core/graph';
import { createWorkflowEdgeRecord } from '../../lib/workflow-core/src/core/edges';
import type { GraphRuntime } from '../../lib/workflow-core/src/core/ports';
import {
  createWorkflow,
  definitionFingerprint,
  replaceDraft,
  saveVersion,
  executeSavedWorkflow,
  getWorkflowRun,
  getSavedVersion,
} from '../../lib/workflow-core/src/application/commands';
import { listWorkflowRuns } from '../../lib/workflow-core/src/application/queries';
import { LocalWorkflowSnapshotSchema } from '../../lib/workflow-contracts/src/generated-schemas';
import type { WorkflowBlock } from '../../lib/workflow-contracts/src/domain/workflow-types';
import type {
  ToolDefinition,
  ToolExecutionContext,
} from '../../lib/workflow-contracts/src/tool-types';
import { validateWorkflowLibrary } from '../../lib/workflow-contracts/src/library';

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

test('cross-workflow run history keeps exact run identity and newest-first ordering', () => {
  const engine = runtime();
  let first = saveVersion(createWorkflow('custom:core', 'template:core', definition()), instant);
  first = executeSavedWorkflow(
    first,
    { saveDraft: false, version: 1, requestId: 'request-one' },
    engine.execute,
    {
      now: () => new Date('2026-01-02T04:00:00.000Z'),
      initiatedBy: { actorId: 'actor-a', workspaceId: 'workspace-a', surface: 'chat' },
    },
  ).entry;

  const secondDefinition = { ...definition(), id: 'custom:second', name: 'Second workflow' };
  let second = saveVersion(
    createWorkflow('custom:second', 'template:second', secondDefinition),
    instant,
  );
  second = executeSavedWorkflow(
    second,
    { saveDraft: false, version: 1, requestId: 'request-two' },
    engine.execute,
    {
      now: () => new Date('2026-01-02T05:00:00.000Z'),
      initiatedBy: { actorId: 'actor-b', workspaceId: 'workspace-a', surface: 'run' },
    },
  ).entry;

  const history = listWorkflowRuns({ [first.id]: first, [second.id]: second });
  assert.deepEqual(
    history.map(({ workflowId, workflowName, runId, version, at, initiatedBy }) => ({
      workflowId,
      workflowName,
      runId,
      version,
      at,
      surface: initiatedBy?.surface,
    })),
    [
      {
        workflowId: 'custom:second',
        workflowName: 'Second workflow',
        runId: 'fixed-run-2',
        version: 1,
        at: '2026-01-02T05:00:00.000Z',
        surface: 'run',
      },
      {
        workflowId: 'custom:core',
        workflowName: 'Independent arithmetic',
        runId: 'fixed-run-1',
        version: 1,
        at: '2026-01-02T04:00:00.000Z',
        surface: 'chat',
      },
    ],
  );
});

test('portable graph orders dependencies and produces 400 without a browser or model', () => {
  assert.equal('window' in globalThis, false);
  const d = definition(),
    original = structuredClone(d),
    run = runtime().execute(d);
  assert.equal(run.result.results.at(-1)?.output.value, 400);
  assert.deepEqual(
    run.result.results.map((result) => result.blockId),
    ['total', 'double'],
  );
  assert.equal(run.result.runId, run.record.execution.id);
  assert.equal(run.result.startedAt, instant);
  assert.equal(run.result.workflowId, d.id);
  assert.deepEqual(d, original);
});

test('cycles and missing dependencies fail before executing tools', () => {
  const d = definition(),
    r = runtime();
  d.edges.push(
    createWorkflowEdgeRecord({ sourceBlockId: 'double', targetBlockId: 'total', reason: 'Cycle' }),
  );
  assert.throws(() => r.execute(d), /cycl/i);
  assert.equal(r.calls(), 0);
  d.edges = [
    createWorkflowEdgeRecord({
      sourceBlockId: 'missing',
      targetBlockId: 'double',
      reason: 'Absent',
    }),
  ];
  assert.throws(() => r.execute(d), /missing|unknown|invalid/i);
  assert.equal(r.calls(), 0);
});

test('partial runs require an existing selection and validate only relevant dependencies', () => {
  const d = definition(),
    r = runtime();
  for (const mode of ['selected', 'downstream', 'isolated'] as const)
    for (const selectedBlockId of [undefined, null, 'absent'])
      assert.throws(
        () => executeGraph({ definition: d, mode, selectedBlockId }, r.ports),
        /Select an existing block/,
      );
  d.edges.push(
    createWorkflowEdgeRecord({
      sourceBlockId: 'double',
      targetBlockId: 'absent',
      reason: 'Missing downstream block',
    }),
  );
  assert.throws(
    () => executeGraph({ definition: d, mode: 'downstream', selectedBlockId: 'total' }, r.ports),
    /missing block/,
  );
  assert.equal(r.calls(), 0);
  const selected = executeGraph(
    { definition: d, mode: 'selected', selectedBlockId: 'total' },
    r.ports,
  );
  assert.deepEqual(
    selected.result.results.map((result) => result.blockId),
    ['total'],
  );
  assert.equal(selected.result.results[0].output.value, 200);
});

test('missing tools never report an ordinary successful calculation', () => {
  const d = definition(),
    r = runtime();
  delete r.tools.total;
  const run = r.execute(d);
  assert.notEqual(run.result.status, 'success');
  assert.notEqual(run.result.results.at(-1)?.status, 'success');
  assert.equal(r.calls(), 0);
});

test('code, formula, source and governance edits create immutable saved versions', () => {
  const initial = saveVersion(createWorkflow('custom:core', 'fixture', definition()), instant);
  for (const patch of [
    { code: { language: 'javascript' as const, body: 'return 5' } },
    { formula: { expression: 'a * 3', outputKey: 'amount', inputs: ['a'] } },
    {
      governance: {
        protected: true,
        steward: 'owner',
        lockedInRuntime: true,
        requiresUnlockToEdit: true,
        approvalState: 'review-required' as const,
      },
    },
    { description: 'Different meaning' },
    {
      source: {
        sourceType: 'Manual Entry' as const,
        locator: 'manual://changed',
        immutable: true as const,
        treatedAsEvidence: true,
        labelLocked: true,
        locatorLocked: true,
        valuesLocked: true,
      },
    },
  ]) {
    const draft = structuredClone(initial.draft);
    Object.assign(draft.blocks[0], patch);
    const changed = saveVersion(replaceDraft(initial, draft));
    assert.equal(changed.versions.length, 2);
    assert.deepEqual(changed.versions[0], initial.versions[0]);
    draft.blocks[0].label = 'Later mutable edit';
    assert.notEqual(changed.versions[1].definition.blocks[0].label, draft.blocks[0].label);
  }
  const audit = structuredClone(initial.draft);
  audit.blocks[0].updatedAt = 'later';
  assert.equal(saveVersion(replaceDraft(initial, audit)).versions.length, 1);
});

test('stale draft writes and explicit missing or ambiguous versions do not execute', () => {
  const r = runtime(),
    initial = saveVersion(createWorkflow('custom:core', 'fixture', definition()));
  const revision = definitionFingerprint(initial.draft);
  const changed = replaceDraft(initial, { ...initial.draft, name: 'Changed' }, revision);
  assert.throws(() => replaceDraft(changed, initial.draft, revision), /draft changed/);
  assert.throws(
    () => executeSavedWorkflow(initial, { version: 999, saveDraft: false }, r.execute),
    /requested workflow version/,
  );
  assert.throws(
    () => executeSavedWorkflow(initial, { version: 1, saveDraft: true }, r.execute),
    /either/,
  );
  assert.equal(r.calls(), 0);
});

test('saved runs preserve identity and initiator, deduplicate retries and reject conflicting reuse', () => {
  const r = runtime(),
    initial = createWorkflow('custom:core', 'fixture', definition());
  const context = {
    now: () => new Date(instant),
    initiatedBy: { actorId: 'actor', workspaceId: 'workspace', surface: 'builder' as const },
  };
  const first = executeSavedWorkflow(initial, { requestId: 'request-one' }, r.execute, context);
  const second = executeSavedWorkflow(
    first.entry,
    { requestId: 'request-one' },
    r.execute,
    context,
  );
  assert.equal(r.calls(), 2);
  assert.equal(second.entry.runs.length, 1);
  assert.equal(first.result.result.runId, second.result.result.runId);
  const run = getWorkflowRun(second.entry, first.result.result.runId);
  assert.deepEqual(run.initiatedBy, context.initiatedBy);
  assert.equal(run.version, 1);
  assert.equal(run.result.record.execution.workflowId, initial.id);
  const changed = replaceDraft(second.entry, { ...second.entry.draft, name: 'New meaning' });
  assert.throws(
    () => executeSavedWorkflow(changed, { requestId: 'request-one' }, r.execute),
    /already used/,
  );
  assert.equal(r.calls(), 2);
  const restored = validateWorkflowLibrary(
    JSON.parse(JSON.stringify({ [initial.id]: second.entry })),
  )[initial.id];
  assert.deepEqual(restored.runs[0].initiatedBy, context.initiatedBy);
});

test('executors and queries cannot mutate saved history or attach foreign run results', () => {
  const r = runtime(),
    initial = saveVersion(createWorkflow('custom:core', 'fixture', definition()));
  const version = getSavedVersion(initial, 1);
  version.definition.name = 'Changed query result';
  assert.notEqual(initial.versions[0].definition.name, version.definition.name);
  const executed = executeSavedWorkflow(initial, { saveDraft: false, version: 1 }, (d) => {
    d.name = 'Executor mutation';
    return r.execute(d);
  });
  assert.equal(initial.versions[0].definition.name, 'Independent arithmetic');
  executed.result.result.results[0].output.value = 999;
  assert.equal(executed.entry.runs[0].result.result.results[0].output.value, 200);
  assert.throws(
    () => executeSavedWorkflow(initial, {}, (d) => r.execute({ ...d, id: 'foreign' })),
    /different workflow/,
  );
});
