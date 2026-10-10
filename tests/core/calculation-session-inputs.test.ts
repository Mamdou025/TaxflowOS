import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { LocalWorkflowSnapshotSchema } from '../../lib/workflow-contracts/src/generated-schemas';
import type { ToolDefinition } from '../../lib/workflow-contracts/src/tool-types';
import { createWorkflow, saveVersion } from '../../lib/workflow-core/src/application/commands';
import {
  changeSession,
  getSession,
  sessionContext,
  sessionDefinition,
  startSession,
} from '../../lib/workflow-core/src/application/sessions';
import {
  runInputKeys,
  validateRunInputPatch,
} from '../../lib/workflow-core/src/application/session-inputs';
import { createWorkflowEdgeRecord } from '../../lib/workflow-core/src/core/edges';
import type { GraphRuntime } from '../../lib/workflow-core/src/core/ports';
import {
  effectiveCalculationInputRules,
  resolveCalculationInputs,
  calculationInputOptionsFromOutputs,
} from '../../lib/workflow-core/src/core/calculation-inputs';

const at = '2026-10-04T12:00:00.000Z';
function fixture() {
  const backup = JSON.parse(readFileSync('tests/fixtures/backups/legacy-v0.json', 'utf8'));
  const definition = LocalWorkflowSnapshotSchema.parse(backup['custom:synthetic-recovery'].draft);
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
    createdBy: 'fixture',
    updatedBy: 'fixture',
  };
  const calculation = {
    ...base,
    id: 'calculate',
    family: 'Logic' as const,
    subtype: 'Calculation Engine' as const,
    label: 'Quote',
    config: {
      toolId: 'logic.calculation_engine',
      mode: 'inline',
      formulas: [
        {
          calculationId: 'total',
          resultKey: 'total',
          formulaExpression: 'quantity * price',
          operation: 'multiply',
          operands: [],
        },
      ],
      inputDefinitions: [
        { name: 'quantity', type: 'number', binding: { kind: 'manual' } },
        { name: 'price', type: 'number', binding: { kind: 'manual' } },
        { name: 'unused', type: 'number', binding: { kind: 'manual' } },
        {
          name: 'rate',
          type: 'number',
          binding: { kind: 'source', blockId: 'api', path: ['rate'] },
        },
      ],
      inputValues: { price: 12 } as Record<string, number>,
    },
  };
  const report = {
    ...base,
    id: 'report',
    label: 'Result',
    family: 'Logic' as const,
    subtype: 'Calculation Engine' as const,
    config: { toolId: 'report' },
  };
  definition.blocks = [calculation, report];
  definition.edges = [
    createWorkflowEdgeRecord({
      sourceBlockId: 'calculate',
      targetBlockId: 'report',
      reason: 'quote total',
      createdAt: at,
    }),
  ];
  const tool = (id: string): ToolDefinition => ({
    toolId: id,
    family: 'Logic',
    toolGroup: 'calculation',
    displayName: id,
    description: '',
    inputRoles: [],
    outputRoles: [],
    inputSchema: { fields: [] },
    outputSchema: { fields: [] },
    defaultConfig: {},
    runMode: 'local_mock',
    execute: (context) => {
      const values = resolveCalculationInputs(
        effectiveCalculationInputRules(context.block, context.workflow),
        context.config,
        calculationInputOptionsFromOutputs(
          context.upstreamResults.map((result) => ({
            blockId: result.blockId,
            output: result.output,
            status: result.status,
          })),
        ),
      ).values;
      return {
        blockId: context.block.id,
        runId: context.runId,
        toolId: id,
        status: 'success',
        output: {
          value:
            id === 'report'
              ? context.upstreamResults[0].output.value
              : id === 'source.manual_value'
                ? context.config.value
                : values.quantity * values.price,
        },
        logs: [],
        errors: [],
        warnings: [],
        evidenceRefs: [],
        sourceTrace: [],
        startedAt: at,
        completedAt: at,
      };
    },
  });
  let counter = 0;
  const runtime: GraphRuntime = {
    resolveToolId: (block) => String(block.config.toolId),
    getTool: tool,
    createId: () => `run-${++counter}`,
    now: () => new Date(at),
  };
  const entry = startSession(
    saveVersion(createWorkflow('custom:variables', 'variables', definition), at),
    1,
    'session',
    at,
  );
  return { entry, runtime, calculation, definition };
}

test('run input boundary permits only finite values for declared manual calculation variables', () => {
  const { calculation } = fixture();
  assert.deepEqual(runInputKeys(calculation), ['inputValues', 'inputChoices']);
  assert.deepEqual(validateRunInputPatch(calculation, { inputValues: { quantity: 0 } }), {
    inputValues: { quantity: 0 },
  });
  assert.deepEqual(validateRunInputPatch(calculation, { inputValues: {} }), { inputValues: {} });
  for (const value of [null, [], 12, '12'])
    assert.throws(() => validateRunInputPatch(calculation, { inputValues: value }), /number map/);
  for (const value of ['', '0', true, null, Number.NaN, Number.POSITIVE_INFINITY])
    assert.throws(
      () => validateRunInputPatch(calculation, { inputValues: { quantity: value } }),
      /finite number/,
    );
  for (const name of ['rate', 'invented', '__proto__'])
    assert.throws(
      () => validateRunInputPatch(calculation, { inputValues: { [name]: 1 } }),
      /declared manual/,
    );
  for (const patch of [
    { formulas: [] },
    { inputDefinitions: [] },
    { inputValues: {}, mode: 'inline' },
  ])
    assert.throws(() => validateRunInputPatch(calculation, patch), /reviewed workflow proposal/);
});

test('form-only sessions wait for required variables, accept zero, and retain saved history after input edits', () => {
  const fixtureData = fixture();
  let entry = fixtureData.entry;
  const originalDraft = structuredClone(entry.draft);
  const originalVersions = structuredClone(entry.versions);
  const change = (action: Parameters<typeof changeSession>[3]) => {
    entry = changeSession(
      entry,
      'session',
      getSession(entry, 'session').revision,
      action,
      fixtureData.runtime,
      at,
    );
  };
  assert.equal(sessionContext(entry, getSession(entry, 'session')).steps[0].inputRequired, true);
  change({ kind: 'resume' });
  change({ kind: 'pause' });
  assert.throws(() => change({ kind: 'block', blockId: 'calculate' }), /required inputs/);
  change({
    kind: 'inputs',
    blockId: 'calculate',
    patch: { inputValues: { quantity: 0, price: 12 } },
  });
  assert.equal(sessionContext(entry, getSession(entry, 'session')).steps[0].inputRequired, false);
  change({ kind: 'block', blockId: 'calculate' });
  change({ kind: 'block', blockId: 'report' });
  assert.equal(getSession(entry, 'session').results.report.output.value, 0);
  change({ kind: 'approve' });
  const historical = structuredClone(entry.runs);
  change({
    kind: 'inputs',
    blockId: 'calculate',
    patch: { inputValues: { quantity: 3, price: 12 } },
  });
  const changed = getSession(entry, 'session');
  assert.equal(changed.approvedAt, undefined);
  assert.deepEqual(changed.stale, ['calculate', 'report']);
  assert.throws(() => change({ kind: 'approve' }), /Complete/);
  assert.throws(
    () =>
      changeSession(
        entry,
        'session',
        changed.revision - 1,
        { kind: 'inputs', blockId: 'calculate', patch: { inputValues: {} } },
        fixtureData.runtime,
        at,
      ),
    /changed/,
  );
  change({ kind: 'block', blockId: 'calculate' });
  change({ kind: 'block', blockId: 'report' });
  assert.equal(getSession(entry, 'session').results.report.output.value, 36);
  assert.deepEqual(entry.runs, historical);
  assert.deepEqual(entry.draft, originalDraft);
  assert.deepEqual(entry.versions, originalVersions);
  assert.deepEqual(
    sessionDefinition(entry, getSession(entry, 'session')).blocks[0].config.inputValues,
    { quantity: 3, price: 12 },
  );
  change({ kind: 'inputs', blockId: 'calculate', patch: { inputValues: { price: 12 } } });
  assert.equal(sessionContext(entry, getSession(entry, 'session')).steps[0].inputRequired, true);
});

test('readiness follows external formula dependencies and ignores unused manual declarations', () => {
  const { definition, calculation } = fixture();
  calculation.config.mode = 'external_rules';
  const rules = {
    ...calculation,
    id: 'rules',
    family: 'Source' as const,
    subtype: 'Calculation Rules' as const,
    config: {
      toolId: 'source.calculation_rules',
      calculationRules: [
        { calculationId: 'quote', resultKey: 'quote', formulaExpression: 'price * 2' },
      ],
    },
  };
  definition.blocks.push(rules);
  definition.edges.push(
    createWorkflowEdgeRecord({
      sourceBlockId: 'rules',
      targetBlockId: 'calculate',
      reason: 'formula',
      createdAt: at,
    }),
  );
  const entry = startSession(
    saveVersion(createWorkflow('custom:external', 'external', definition), at),
    1,
    'session',
    at,
  );
  assert.equal(
    sessionContext(entry, getSession(entry, 'session')).steps.find(
      (step) => step.id === 'calculate',
    )!.inputRequired,
    false,
  );
});

test('sources can collect data while the calculation still waits for a manual field', () => {
  const { definition, calculation, runtime } = fixture();
  const source = {
    ...calculation,
    id: 'source',
    label: 'Reference value',
    family: 'Source' as const,
    subtype: 'Manual Entry' as const,
    config: { toolId: 'source.manual_value', value: 4, inputValues: { quantity: 2, price: 2 } },
  };
  definition.blocks.unshift(source);
  definition.edges.push(
    createWorkflowEdgeRecord({
      sourceBlockId: 'source',
      targetBlockId: 'calculate',
      reason: 'reference data',
      createdAt: at,
    }),
  );
  let entry = startSession(
    saveVersion(createWorkflow('custom:collection', 'collection', definition), at),
    1,
    'session',
    at,
  );
  entry = changeSession(entry, 'session', 0, { kind: 'resume' }, runtime, at);
  entry = changeSession(entry, 'session', 1, { kind: 'block', blockId: 'source' }, runtime, at);
  const session = getSession(entry, 'session');
  assert.equal(session.results.source.status, 'success');
  assert.equal(session.results.source.output.value, 4);
  assert.equal(
    sessionContext(entry, session).steps.find((step) => step.id === 'calculate')!.inputRequired,
    true,
  );
  assert.throws(
    () => changeSession(entry, 'session', 2, { kind: 'block', blockId: 'calculate' }, runtime, at),
    /required inputs/,
  );
  assert.equal(session.results.calculate, undefined);
});

test('undeclared external inputs generate run fields and explicit choices preserve saved history', () => {
  const { definition, calculation, runtime } = fixture();
  Object.assign(calculation.config, { inputDefinitions: undefined, inputValues: {} });
  let entry = startSession(
    saveVersion(createWorkflow('custom:inferred', 'inferred', definition), at),
    1,
    'session',
    at,
  );
  const saved = structuredClone(entry.versions);
  const draft = structuredClone(entry.draft);
  const change = (action: Parameters<typeof changeSession>[3]) => {
    entry = changeSession(
      entry,
      'session',
      getSession(entry, 'session').revision,
      action,
      runtime,
      at,
    );
  };
  const step = () => sessionContext(entry, getSession(entry, 'session')).steps[0];
  assert.deepEqual(
    step().inputRequirements?.map((input) => input.name),
    ['quantity', 'price'],
  );
  assert.equal(step().inputRequired, true);
  change({
    kind: 'inputs',
    blockId: 'calculate',
    patch: {
      inputChoices: {
        quantity: { kind: 'manual', value: 0 },
        price: { kind: 'manual', value: 12 },
      },
    },
  });
  assert.equal(step().inputRequired, false);
  change({ kind: 'block', blockId: 'calculate' });
  change({ kind: 'block', blockId: 'report' });
  assert.equal(getSession(entry, 'session').results.report.output.value, 0);
  change({ kind: 'approve' });
  const history = structuredClone(entry.runs);
  change({
    kind: 'inputs',
    blockId: 'calculate',
    patch: { inputChoices: { quantity: { kind: 'manual' } } },
  });
  assert.equal(step().inputRequired, true);
  assert.equal(getSession(entry, 'session').approvedAt, undefined);
  assert.deepEqual(getSession(entry, 'session').stale, ['calculate', 'report']);
  assert.equal(
    step().inputRequirements?.find((input) => input.name === 'price')?.status,
    'missing',
  );
  assert.throws(() => change({ kind: 'block', blockId: 'calculate' }), /required inputs/);
  change({ kind: 'inputs', blockId: 'calculate', patch: { inputChoices: {} } });
  assert.deepEqual(getSession(entry, 'session').inputOverrides?.calculate.inputChoices, {});
  assert.deepEqual(entry.versions, saved);
  assert.deepEqual(entry.draft, draft);
  assert.deepEqual(entry.runs, history);
});

test('source alternatives require fresh numeric fields and retain every graph prerequisite', () => {
  const { definition, calculation, runtime } = fixture();
  const source = {
    ...calculation,
    id: 'source',
    family: 'Source' as const,
    subtype: 'Manual Entry' as const,
    config: { toolId: 'source.manual_value', value: 4 },
  };
  definition.blocks.unshift(source);
  definition.edges.push(
    createWorkflowEdgeRecord({
      sourceBlockId: 'source',
      targetBlockId: 'calculate',
      reason: 'quantity provider',
    }),
  );
  let entry = startSession(
    saveVersion(createWorkflow('custom:alternative', 'alternative', definition), at),
    1,
    'session',
    at,
  );
  const change = (action: Parameters<typeof changeSession>[3]) => {
    entry = changeSession(
      entry,
      'session',
      getSession(entry, 'session').revision,
      action,
      runtime,
      at,
    );
  };
  const step = () =>
    sessionContext(entry, getSession(entry, 'session')).steps.find(
      (item) => item.id === 'calculate',
    )!;
  change({
    kind: 'inputs',
    blockId: 'calculate',
    patch: { inputChoices: { quantity: { kind: 'manual', value: 0 } } },
  });
  assert.equal(step().inputRequired, false);
  assert.equal(step().ready, false, 'A manual value does not waive a graph prerequisite');
  assert.throws(() => change({ kind: 'block', blockId: 'calculate' }), /dependencies/);
  change({ kind: 'block', blockId: 'source' });
  change({
    kind: 'inputs',
    blockId: 'calculate',
    patch: { inputChoices: { quantity: { kind: 'source', blockId: 'source', path: ['value'] } } },
  });
  assert.equal(step().inputRequired, false);
  assert.equal(step().inputRequirements?.find((input) => input.name === 'quantity')?.value, 4);
  change({ kind: 'block', blockId: 'calculate' });
  assert.equal(getSession(entry, 'session').results.calculate.output.value, 48);
  change({ kind: 'inputs', blockId: 'source', patch: { value: 4 } });
  assert.equal(
    step().inputRequired,
    true,
    'Even a same-value source refresh makes its prior output stale',
  );
  change({ kind: 'block', blockId: 'source' });
  assert.equal(step().inputRequired, false);
  change({
    kind: 'inputs',
    blockId: 'calculate',
    patch: { inputChoices: { quantity: { kind: 'source', blockId: 'source', path: ['absent'] } } },
  });
  assert.equal(step().inputRequired, true);
  change({
    kind: 'inputs',
    blockId: 'calculate',
    patch: { inputChoices: { quantity: { kind: 'source', blockId: 'source', path: ['value'] } } },
  });
  for (const status of ['error', 'skipped', 'needs_review'] as const) {
    const invalid = structuredClone(entry);
    invalid.sessions![0].results.source.status = status;
    assert.equal(
      sessionContext(invalid, getSession(invalid, 'session')).steps.find(
        (item) => item.id === 'calculate',
      )!.inputRequired,
      true,
    );
  }
  const malformed = structuredClone(entry);
  malformed.sessions![0].results.source.output.value = 'not numeric';
  assert.equal(
    sessionContext(malformed, getSession(malformed, 'session')).steps.find(
      (item) => item.id === 'calculate',
    )!.inputRequired,
    true,
  );
});

test('run choice boundary rejects unknown variables, unsafe paths and disconnected providers', () => {
  const { calculation, definition } = fixture();
  const choose = (inputChoices: unknown) =>
    validateRunInputPatch(calculation, { inputChoices }, definition);
  for (const inputChoices of [null, [], 1]) assert.throws(() => choose(inputChoices), /map/);
  for (const name of ['total', 'unused', 'invented', '__proto__'])
    assert.throws(() => choose({ [name]: { kind: 'manual', value: 1 } }), /required external/);
  for (const choice of [
    { kind: 'manual', value: NaN },
    { kind: 'manual', value: '0' },
    { kind: 'source', blockId: 'source', path: [] },
    { kind: 'source', blockId: 'source', path: ['constructor'] },
  ])
    assert.throws(() => choose({ quantity: choice }), /finite manual number|valid connected/);
  assert.throws(
    () => choose({ quantity: { kind: 'source', blockId: 'report', path: ['value'] } }),
    /directly connected/,
  );
  definition.edges.push(
    createWorkflowEdgeRecord({
      sourceBlockId: 'report',
      targetBlockId: 'calculate',
      reason: 'disabled',
      status: 'disabled',
    }),
  );
  assert.throws(
    () => choose({ quantity: { kind: 'source', blockId: 'report', path: ['value'] } }),
    /directly connected/,
  );
  assert.deepEqual(choose({ quantity: { kind: 'manual' } }), {
    inputChoices: { quantity: { kind: 'manual' } },
  });
});

test('effective external rule outputs drive both readiness and input-choice validation', () => {
  const { calculation, definition } = fixture();
  calculation.config.mode = 'external_rules';
  const source = {
    ...calculation,
    id: 'rules',
    family: 'Source' as const,
    subtype: 'Calculation Rules' as const,
    config: {
      toolId: 'source.calculation_rules',
      calculationRules: [
        { calculationId: 'old', resultKey: 'old', formulaExpression: 'configuredValue * 2' },
      ],
    },
  };
  definition.blocks.unshift(source);
  definition.edges.push(
    createWorkflowEdgeRecord({
      sourceBlockId: 'rules',
      targetBlockId: 'calculate',
      reason: 'rules',
    }),
  );
  const sources = [
    {
      blockId: 'rules',
      status: 'success',
      output: {
        calculationRules: [
          { calculationId: 'actual', resultKey: 'actual', formulaExpression: 'capturedValue * 2' },
        ],
      },
    },
  ];
  assert.deepEqual(
    effectiveCalculationInputRules(calculation, definition, sources).map(
      (rule) => rule.formulaExpression,
    ),
    ['capturedValue * 2'],
  );
  assert.doesNotThrow(() =>
    validateRunInputPatch(
      calculation,
      { inputChoices: { capturedValue: { kind: 'manual', value: 3 } } },
      definition,
      sources,
    ),
  );
  assert.throws(
    () =>
      validateRunInputPatch(
        calculation,
        { inputChoices: { configuredValue: { kind: 'manual', value: 3 } } },
        definition,
        sources,
      ),
    /required external/,
  );
});

test('configuration errors are not disguised as missing data when no external fields exist', () => {
  const { calculation, definition } = fixture();
  Object.assign(calculation.config, {
    formulas: [{ calculationId: 'total', resultKey: 'total', formulaExpression: '1 + 2' }],
    inputDefinitions: [{ name: 'total', type: 'number', binding: { kind: 'manual' } }],
  });
  const entry = startSession(
    saveVersion(createWorkflow('custom:invalid', 'invalid', definition), at),
    1,
    'session',
    at,
  );
  const step = sessionContext(entry, getSession(entry, 'session')).steps[0];
  assert.equal(
    step.inputRequired,
    false,
    'Execution must surface the invalid definition instead of an empty form',
  );
  assert.deepEqual(step.inputRequirements, []);
});

test('accepted external-rule choices remain readable through stale and failed rulebook reruns', () => {
  const data = fixture();
  data.calculation.config.mode = 'external_rules';
  const rules = {
    ...data.calculation,
    id: 'rules',
    family: 'Source' as const,
    subtype: 'Calculation Rules' as const,
    config: {
      toolId: 'source.calculation_rules',
      calculationRules: [
        {
          calculationId: 'configured',
          resultKey: 'configured',
          formulaExpression: 'configuredValue * 2',
        },
      ],
    },
  };
  data.definition.blocks.unshift(rules);
  data.definition.edges.push(
    createWorkflowEdgeRecord({
      sourceBlockId: 'rules',
      targetBlockId: 'calculate',
      reason: 'formula source',
    }),
  );
  let fail = false;
  let requiredName = 'capturedValue';
  const runtime: GraphRuntime = {
    ...data.runtime,
    getTool: (id) => {
      const tool = data.runtime.getTool(id)!;
      return id !== 'source.calculation_rules'
        ? tool
        : {
            ...tool,
            execute: (context) => ({
              ...tool.execute(context),
              status: fail ? 'error' : 'success',
              errors: fail ? ['Rule source unavailable'] : [],
              output: fail
                ? {}
                : {
                    calculationRules: [
                      {
                        calculationId: 'actual',
                        resultKey: 'actual',
                        formulaExpression: `${requiredName} * 2`,
                      },
                    ],
                  },
            }),
          };
    },
  };
  let entry = startSession(
    saveVersion(createWorkflow('custom:rule-recovery', 'rules', data.definition), at),
    1,
    'session',
    at,
  );
  const change = (action: Parameters<typeof changeSession>[3]) => {
    entry = changeSession(
      entry,
      'session',
      getSession(entry, 'session').revision,
      action,
      runtime,
      at,
    );
  };
  const step = () =>
    sessionContext(entry, getSession(entry, 'session')).steps.find(
      (item) => item.id === 'calculate',
    )!;
  change({ kind: 'block', blockId: 'rules' });
  change({
    kind: 'inputs',
    blockId: 'calculate',
    patch: { inputChoices: { capturedValue: { kind: 'manual', value: 3 } } },
  });
  entry.sessions![0].stale.push('rules');
  assert.doesNotThrow(() => sessionDefinition(entry, getSession(entry, 'session')));
  assert.equal(step().ready, false);
  assert.equal(step().inputRequirements?.[0].name, 'capturedValue');
  assert.throws(() => change({ kind: 'block', blockId: 'calculate' }), /dependencies/);
  fail = true;
  change({ kind: 'block', blockId: 'rules' });
  assert.equal(step().ready, false);
  assert.equal(step().inputRequirements?.[0].name, 'capturedValue');
  assert.doesNotThrow(() => sessionDefinition(entry, getSession(entry, 'session')));
  fail = false;
  change({ kind: 'block', blockId: 'rules' });
  assert.equal(step().ready, true);
  assert.equal(step().inputRequirements?.[0].value, 3);
  requiredName = 'newCapturedValue';
  change({ kind: 'block', blockId: 'rules' });
  assert.doesNotThrow(() => sessionDefinition(entry, getSession(entry, 'session')));
  assert.equal(step().inputRequired, true);
  assert.throws(
    () =>
      change({
        kind: 'inputs',
        blockId: 'calculate',
        patch: { inputChoices: { capturedValue: { kind: 'manual', value: 4 } } },
      }),
    /required external/,
  );
  change({
    kind: 'inputs',
    blockId: 'calculate',
    patch: { inputChoices: { newCapturedValue: { kind: 'manual', value: 4 } } },
  });
  assert.equal(step().inputRequired, false);
});
