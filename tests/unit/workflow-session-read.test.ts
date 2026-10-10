import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import type { WorkflowDefinition } from '../../lib/workflow-contracts/src/domain/workflow-types';
import type { ToolRunResult } from '../../lib/workflow-contracts/src/tool-types';
import { createWorkflow, saveVersion } from '../../lib/workflow-core/src/application/commands';
import { changeSession, startSession } from '../../lib/workflow-core/src/application/sessions';
import { createWorkflowEdgeRecord } from '../../lib/workflow-core/src/core/edges';
import { getToolIdForBlock } from '../../lib/workflow-core/src/core/tool-resolution';
import { createWorkflowSessionReader } from '../../artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-session-read-model';

const at = '2026-10-05T12:00:00.000Z';
function result(blockId: string, rate: number): ToolRunResult {
  return {
    blockId,
    runId: 'capture',
    toolId: 'source.http_json',
    status: 'success',
    output: { namedValues: { rate } },
    logs: [],
    warnings: [],
    errors: [],
    evidenceRefs: [],
    sourceTrace: [],
    startedAt: at,
    completedAt: at,
  };
}
function fixture() {
  const backup = JSON.parse(readFileSync('tests/fixtures/backups/legacy-v0.json', 'utf8'));
  const definition = backup['custom:synthetic-recovery'].draft as WorkflowDefinition;
  const base = {
    description: '',
    status: 'configured' as const,
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
  definition.blocks = ['a', 'b'].flatMap((id, index) => [
    {
      ...base,
      id: `api-${id}`,
      label: `API ${id}`,
      family: 'Source' as const,
      subtype: 'API / HTTP Request' as const,
      config: { toolId: 'source.http_json', sourceKind: 'http_json' },
    },
    {
      ...base,
      id,
      label: `Calculation ${id}`,
      family: 'Logic' as const,
      subtype: 'Calculation Engine' as const,
      config: {
        toolId: 'logic.calculation_engine',
        mode: 'inline',
        formulas: [
          { calculationId: 'total', resultKey: 'total', formulaExpression: 'amount * rate' },
        ],
        inputDefinitions: [
          { name: 'amount', type: 'number', binding: { kind: 'manual' } },
          {
            name: 'rate',
            type: 'number',
            binding: { kind: 'source', blockId: `api-${id}`, path: ['namedValues', 'rate'] },
          },
        ],
        inputValues: { amount: index ? 7 : 2 },
      },
    },
  ]);
  definition.edges = ['a', 'b'].map((id) =>
    createWorkflowEdgeRecord({
      sourceBlockId: `api-${id}`,
      targetBlockId: id,
      reason: 'input',
      createdAt: at,
    }),
  );
  const entry = startSession(
    saveVersion(createWorkflow('custom:read-test', 'read-test', definition)),
    1,
    'session',
    at,
  );
  entry.sessions![0].results = { 'api-a': result('api-a', 1.5), 'api-b': result('api-b', 3) };
  return entry;
}

test('one session reader reuses the same snapshot and keeps identically named calculator inputs separate', () => {
  const entry = fixture();
  const read = createWorkflowSessionReader();
  const session = entry.sessions![0];
  const projection = read(entry, session);
  assert.equal(read(entry, session), projection);
  const [a, b] = projection.groups;
  assert.deepEqual(
    a.requirements.map((input) => [input.name, input.value]),
    [
      ['amount', 2],
      ['rate', 1.5],
    ],
  );
  assert.deepEqual(
    b.requirements.map((input) => [input.name, input.value]),
    [
      ['amount', 7],
      ['rate', 3],
    ],
  );
  assert.equal(a.inputOptions.namedValues?.rate, 1.5);
  assert.equal(b.inputOptions.namedValues?.rate, 3);
  assert.equal(a.inputOptions.sources?.[0].blockId, 'api-a');
  assert.equal(b.inputOptions.sources?.[0].blockId, 'api-b');
  assert.ok(a.sourceOptions.every((option) => JSON.parse(option.value).blockId === 'api-a'));
  assert.ok(b.sourceOptions.every((option) => JSON.parse(option.value).blockId === 'api-b'));

  const otherEntry = fixture();
  otherEntry.sessions![0].results['api-a'] = result('api-a', 9);
  const other = read(otherEntry, otherEntry.sessions![0]);
  assert.notEqual(other, projection);
  assert.equal(other.groups[0].requirements[1].value, 9);
  assert.equal(projection.groups[0].requirements[1].value, 1.5);
  assert.notEqual(createWorkflowSessionReader()(entry, session), projection);
});

test('input choices, same-value source refreshes and invalidation rebuild the session read snapshot', () => {
  const entry = fixture();
  const read = createWorkflowSessionReader();
  const before = read(entry, entry.sessions![0]);
  const changed = changeSession(
    entry,
    'session',
    0,
    {
      kind: 'inputs',
      blockId: 'a',
      patch: { inputChoices: { amount: { kind: 'manual', value: 0 } } },
    },
    { getTool: () => null, resolveToolId: getToolIdForBlock, createId: () => 'unused' },
  );
  const applied = read(changed, changed.sessions![0]);
  assert.notEqual(applied, before);
  assert.equal(applied.groups[0].requirements[0].value, 0);
  assert.equal(applied.groups[1].requirements[0].value, 7);
  assert.equal(before.groups[0].requirements[0].value, 2);
  assert.equal(
    applied.definition.blocks.find((block) => block.id === 'a')!.config.inputChoices !== undefined,
    true,
  );
  assert.equal(
    entry.versions[0].definition.blocks.find((block) => block.id === 'a')!.config.inputChoices,
    undefined,
  );

  const nextSession = {
    ...changed.sessions![0],
    revision: 2,
    results: {
      ...changed.sessions![0].results,
      'api-a': { ...result('api-a', 1.5), completedAt: '2026-10-05T12:01:00.000Z' },
    },
  };
  const refreshedEntry = { ...changed, sessions: [nextSession] };
  const refreshed = read(refreshedEntry, nextSession);
  assert.notEqual(refreshed.sourceIdentities.get('a'), applied.sourceIdentities.get('a'));
  assert.equal(refreshed.groups[0].requirements[1].value, 1.5);
  assert.equal(refreshed.sourceIdentities.get('b'), applied.sourceIdentities.get('b'));

  for (const invalid of [
    { ...nextSession, revision: 3, stale: ['api-a'] },
    {
      ...nextSession,
      revision: 3,
      results: {
        ...nextSession.results,
        'api-a': { ...nextSession.results['api-a'], status: 'error' as const },
      },
    },
  ]) {
    const unavailable = read({ ...refreshedEntry, sessions: [invalid] }, invalid);
    assert.equal(unavailable.groups[0].requirements[1].status, 'missing');
    assert.equal(unavailable.groups[0].requirements[1].value, undefined);
    assert.equal(unavailable.groups[1].requirements[1].value, 3);
  }
});
