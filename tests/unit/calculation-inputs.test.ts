import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import type { CalculationInputRequirement } from '../../lib/workflow-contracts/src/domain/calculation-inputs';
import type { WorkflowBlock } from '../../lib/workflow-contracts/src/domain/workflow-types';
import {
  describeCalculationInputs,
  calculationInputOptionsFromOutputs,
  inferCalculationInputs,
  type CalculationInputSource,
} from '../../lib/workflow-executors/src/calculation-inputs';
import { runCalculationEngine } from '../../lib/workflow-executors/src/execution/blocks/logic/calculation-engine/run';
import { runHttpJsonSource } from '../../lib/workflow-executors/src/execution/blocks/source/http-json/run';
import { httpJsonDefinition } from '../../lib/workflow-executors/src/execution/blocks/source/http-json/definition';
import { apiRequestSignature } from '../../lib/workflow-executors/src/api-snapshot';
import { LocalWorkflowSnapshotSchema } from '../../lib/workflow-contracts/src/generated-schemas';
import { createWorkflowEdgeRecord } from '../../lib/workflow-core/src/core/edges';
import { executeDurableWorkflow } from '../../artifacts/api-server/src/lib/workflow-runs/executor';
import { executeGraph } from '../../lib/workflow-core/src/core/graph';
import { LOCAL_TOOL_REGISTRY } from '../../lib/workflow-executors/src/tools/registry';
import { getToolIdForBlock } from '../../lib/workflow-core/src/core/tool-resolution';

const instant = '2026-10-04T12:00:00Z';
function block(id: string, config: Record<string, unknown>): WorkflowBlock {
  return {
    id,
    family: 'Logic',
    subtype: 'Calculation Engine',
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
const formulas = [
  {
    calculationId: 'converted',
    resultKey: 'converted',
    formulaExpression: 'amount * exchangeRate',
  },
];
const manual = (name: string) => ({ name, type: 'number', binding: { kind: 'manual' } });
const fromApi = {
  name: 'exchangeRate',
  type: 'number',
  binding: { kind: 'source', blockId: 'api', path: ['namedValues', 'rate'] },
};
function run(
  config: Record<string, unknown>,
  sources: CalculationInputSource[] = [],
  namedValues: Record<string, unknown> = {},
) {
  const complete = { formulas, ...config };
  return runCalculationEngine({
    block: block('calculate', complete),
    config: complete,
    inputsByRole: { calculation_sources: sources, named_values: [{ namedValues }] },
    runId: 'test',
    startedAt: instant,
  });
}
const requirements = (result: ReturnType<typeof run>) =>
  result.outputs.calculation_summary.inputRequirements as CalculationInputRequirement[];

test('formula-first manual inputs calculate without source blocks and preserve zero', () => {
  for (const [amount, expected] of [
    [120, 180],
    [0, 0],
  ]) {
    const result = run({
      inputDefinitions: [manual('amount'), manual('exchangeRate')],
      inputValues: { amount, exchangeRate: 1.5 },
    });
    assert.equal(result.status, 'success', result.errors.join('\n'));
    assert.deepEqual(result.outputs.calculated_results.calculatedResults, { converted: expected });
    assert.deepEqual(
      requirements(result).map((item) => item.status),
      ['provided', 'provided'],
    );
    assert.equal(requirements(result)[0].origin, 'manual');
  }
});

test('requirements exclude intermediate results and match the engine formula parser', () => {
  const rules = [
    ...formulas,
    { resultKey: 'rounded', formulaExpression: 'round(converted, 2)' },
    { resultKey: 'total', operands: ['rounded', 'fee', 1] },
  ];
  assert.deepEqual(inferCalculationInputs(rules), ['amount', 'exchangeRate', 'fee']);
  const config = {
    formulas: rules.map((rule) => ({ calculationId: rule.resultKey, ...rule })),
    inputDefinitions: [manual('amount'), manual('exchangeRate'), manual('fee')],
    inputValues: { amount: 10, exchangeRate: 1.234, fee: 2 },
  };
  assert.deepEqual(
    describeCalculationInputs(rules, config).map((item) => item.name),
    ['amount', 'exchangeRate', 'fee'],
  );
  const result = run(config);
  assert.equal(result.status, 'success', result.errors.join('\n'));
  assert.equal(
    (result.outputs.calculated_results.calculatedResults as Record<string, number>).total,
    15.34,
  );
});

test('a generic API named number supplies a bound conversion variable', () => {
  const config: Record<string, unknown> = {
    url: 'https://example.invalid/rates',
    outputMode: 'values',
    outputMappings: [{ name: 'rate', path: 'rates.current', type: 'number' }],
    fetchedPayload: { rates: { current: '1.25' } },
  };
  config.fetchedRequestSignature = apiRequestSignature(config);
  const api = runHttpJsonSource({
    block: { ...block('api', config), family: 'Source', subtype: 'API / HTTP Request' },
    config,
    inputsByRole: {},
    runId: 'api-test',
    startedAt: instant,
  });
  assert.equal(api.status, 'success');
  const result = run(
    {
      inputDefinitions: [manual('amount'), fromApi],
      inputValues: { amount: 80 },
    },
    [{ blockId: 'api', output: api.outputs.named_values }],
  );
  assert.equal(result.status, 'success', result.errors.join('\n'));
  assert.deepEqual(result.outputs.calculated_results.calculatedResults, { converted: 100 });
  assert.equal(requirements(result)[1].origin, 'source');
});

test('explicit source bindings cannot fall back to same-name values or defaults', () => {
  const config = {
    inputDefinitions: [manual('amount'), fromApi],
    inputValues: { amount: 80, exchangeRate: 9 },
    inputDefaults: { exchangeRate: 2 },
  };
  for (const sources of [
    [],
    [{ blockId: 'different', output: { namedValues: { rate: 3 } } }],
    [{ blockId: 'api', output: { namedValues: {} } }],
  ]) {
    const result = run(config, sources, { exchangeRate: 4 });
    assert.equal(result.status, 'error');
    assert.equal(requirements(result)[1].status, 'missing');
    assert.deepEqual(result.outputs.calculated_results.calculatedResults, {});
    assert.match(result.errors.join(' '), /source/i);
  }
});

test('source bindings reject non-numeric fields and retain an explicit source zero', () => {
  const config = { inputDefinitions: [manual('amount'), fromApi], inputValues: { amount: 80 } };
  for (const rate of ['', null, false, 'not a number', Infinity]) {
    const result = run(config, [{ blockId: 'api', output: { namedValues: { rate } } }]);
    assert.equal(result.status, 'error');
    assert.equal(requirements(result)[1].status, 'invalid');
  }
  const result = run(config, [{ blockId: 'api', output: { namedValues: { rate: 0 } } }]);
  assert.equal(result.status, 'success');
  assert.deepEqual(result.outputs.calculated_results.calculatedResults, { converted: 0 });
  const ambiguous = run(config, [
    { blockId: 'api', output: { namedValues: { rate: 1 } } },
    { blockId: 'api', output: { namedValues: { rate: 2 } } },
  ]);
  assert.equal(ambiguous.status, 'error');
  assert.equal(requirements(ambiguous)[1].status, 'invalid');
  assert.match(ambiguous.errors.join(' '), /More than one result/);
});

test('manual inputs reject missing and non-numeric values without implicit fallback', () => {
  for (const inputValues of [
    { amount: 80 },
    { amount: 80, exchangeRate: '' },
    { amount: 80, exchangeRate: null },
    { amount: 80, exchangeRate: true },
  ]) {
    const result = run(
      {
        inputDefinitions: [manual('amount'), manual('exchangeRate')],
        inputValues,
        inputDefaults: { exchangeRate: 2 },
      },
      [],
      { exchangeRate: 4 },
    );
    assert.equal(result.status, 'error');
    assert.notEqual(requirements(result)[1].status, 'provided');
    assert.equal(requirements(result)[1].origin, 'manual');
    assert.deepEqual(result.outputs.calculated_results.calculatedResults, {});
  }
});

test('legacy connected inputs and explicit defaults keep their precedence', () => {
  const config = { inputDefaults: { amount: 5, exchangeRate: 2 } };
  const result = run(config, [], { amount: 0 });
  assert.equal(result.status, 'warning');
  assert.deepEqual(result.outputs.calculated_results.calculatedResults, { converted: 0 });
  assert.equal(requirements(result)[0].origin, 'connected');
  assert.equal(requirements(result)[1].origin, 'default');
  assert.deepEqual(result.warnings, ['Used your explicit default for exchangeRate: 2.']);
});

test('invalid definitions fail explicitly and never shadow calculated results', () => {
  for (const inputDefinitions of [
    [manual('amount'), manual('amount')],
    [manual('converted')],
    [{ ...manual('amount'), type: 'text' }],
    [{ ...manual('amount'), label: { invalid: true } }],
    [{ ...manual('amount'), unit: 12 }],
    [{ ...fromApi, binding: { kind: 'source', blockId: 'api', path: ['__proto__'] } }],
  ]) {
    const result = run({ inputDefinitions }, [], { amount: 1, exchangeRate: 2 });
    assert.equal(result.status, 'error');
    assert.deepEqual(result.outputs.calculated_results.calculatedResults, {});
  }
});

test('the durable graph and readiness projection agree on API bindings and source evidence', () => {
  const backup = JSON.parse(readFileSync('tests/fixtures/backups/legacy-v0.json', 'utf8'));
  const definition = LocalWorkflowSnapshotSchema.parse(backup['custom:synthetic-recovery'].draft);
  const apiConfig: Record<string, unknown> = {
    ...httpJsonDefinition.defaultConfig,
    toolId: 'source.http_json',
    url: 'https://example.invalid/rates',
    outputMode: 'values',
    outputMappings: [{ name: 'rate', path: 'rate', type: 'number' }],
    fetchedPayload: { rate: 1.25 },
  };
  apiConfig.fetchedRequestSignature = apiRequestSignature(apiConfig);
  const config = {
    formulas,
    inputDefinitions: [manual('amount'), fromApi],
    inputValues: { amount: 80 },
  };
  definition.blocks = [
    { ...block('api', apiConfig), family: 'Source', subtype: 'API / HTTP Request' },
    block('calculate', config),
  ];
  definition.edges = [
    createWorkflowEdgeRecord({
      sourceBlockId: 'api',
      targetBlockId: 'calculate',
      reason: 'Supply the selected API rate to the calculation',
      sourceOutputRole: 'named_values',
      targetInputRole: 'named_values',
    }),
  ];
  const executed = executeDurableWorkflow(definition, 'bound-calculation');
  const apiResult = executed.result.results.find((item) => item.blockId === 'api')!;
  const calculated = executed.result.results.find((item) => item.blockId === 'calculate')!;
  assert.equal(apiResult.status, 'success', apiResult.errors.join('\n'));
  assert.equal(calculated.status, 'success', calculated.errors.join('\n'));
  assert.deepEqual(calculated.output.calculatedResults, { converted: 100 });
  assert.ok(calculated.evidenceRefs.some((ref) => ref.sourceBlockId === 'api'));
  const options = calculationInputOptionsFromOutputs([
    { blockId: 'api', output: apiResult.output },
  ]);
  assert.deepEqual(
    describeCalculationInputs(formulas, config, options),
    (calculated.output.calculationSummary as Record<string, unknown>).inputRequirements,
  );
  assert.equal(options.namedValues?.rate, 1.25);

  definition.edges.push(
    createWorkflowEdgeRecord({
      id: 'api-metadata',
      sourceBlockId: 'api',
      targetBlockId: 'calculate',
      sourceOutputRole: 'response_metadata',
      targetInputRole: 'named_values',
      reason: 'A second connection still refers to the same captured source result',
    }),
  );
  const repeatedEdge = executeDurableWorkflow(definition, 'same-source-two-edges');
  const repeatedCalculation = repeatedEdge.result.results.find(
    (item) => item.blockId === 'calculate',
  )!;
  assert.equal(repeatedCalculation.status, 'success', repeatedCalculation.errors.join('\n'));
  assert.deepEqual(repeatedCalculation.output.calculatedResults, { converted: 100 });

  definition.blocks = [
    block('calculate', {
      formulas,
      inputDefinitions: [manual('amount'), manual('exchangeRate')],
      inputValues: { amount: 0, exchangeRate: 1.5 },
    }),
  ];
  definition.edges = [];
  const formOnly = executeDurableWorkflow(definition, 'form-calculation');
  assert.deepEqual(formOnly.result.results[0].output.calculatedResults, { converted: 0 });
});

test('inferred formula inputs accept run choices without input definitions and preserve zero', () => {
  const config = {
    inputChoices: {
      amount: { kind: 'manual', value: 0 },
      exchangeRate: { kind: 'manual', value: 1.5 },
    },
  };
  const result = run(config);
  assert.equal(result.status, 'success', result.errors.join('\n'));
  assert.deepEqual(result.outputs.calculated_results.calculatedResults, { converted: 0 });
  assert.deepEqual(
    requirements(result).map((item) => item.name),
    ['amount', 'exchangeRate'],
  );
  assert.ok(requirements(result).every((item) => item.origin === 'manual'));
});

test('an explicit blank choice cannot fall back and removing choices restores the saved setting', () => {
  const saved = {
    inputDefinitions: [manual('amount'), fromApi],
    inputValues: { amount: 80, exchangeRate: 9 },
    inputDefaults: { exchangeRate: 2 },
  };
  const original = structuredClone(saved);
  const sources = [{ blockId: 'api', output: { namedValues: { rate: 1.25 } }, status: 'success' }];
  const blank = run({ ...saved, inputChoices: { exchangeRate: { kind: 'manual' } } }, sources, {
    exchangeRate: 4,
  });
  assert.equal(blank.status, 'error');
  assert.equal(requirements(blank)[1].status, 'missing');
  assert.equal(requirements(blank)[1].origin, 'manual');
  assert.deepEqual(blank.warnings, []);
  const entered = run(
    { ...saved, inputChoices: { exchangeRate: { kind: 'manual', value: 2 } } },
    sources,
  );
  assert.deepEqual(entered.outputs.calculated_results.calculatedResults, { converted: 160 });
  const restored = run({ ...saved, inputChoices: {} }, sources);
  assert.deepEqual(restored.outputs.calculated_results.calculatedResults, { converted: 100 });
  assert.equal(requirements(restored)[1].origin, 'source');
  assert.deepEqual(saved, original);
});

test('selected sources require current successful numeric output and cannot use legacy alternatives', () => {
  const config = {
    inputDefinitions: [manual('amount'), manual('exchangeRate')],
    inputValues: { amount: 80, exchangeRate: 10 },
    inputChoices: {
      exchangeRate: { kind: 'source', blockId: 'api', path: ['namedValues', 'rate'] },
    },
  };
  for (const state of [
    { status: 'error' },
    { status: 'skipped' },
    { status: 'needs_review' },
    { status: 'success', stale: true },
  ]) {
    const source = {
      blockId: 'api',
      output: { namedValues: { rate: 1.25, exchangeRate: 4 } },
      ...state,
    };
    const result = run(config, [source], { exchangeRate: 5 });
    assert.equal(result.status, 'error');
    assert.equal(requirements(result)[1].status, 'missing');
    assert.equal(calculationInputOptionsFromOutputs([source]).namedValues?.exchangeRate, undefined);
  }
  for (const status of ['success', 'warning']) {
    const result = run(config, [{ blockId: 'api', output: { namedValues: { rate: 0 } }, status }]);
    assert.equal(result.status, 'success');
    assert.deepEqual(result.outputs.calculated_results.calculatedResults, { converted: 0 });
  }
  for (const output of [{ namedValues: {} }, { namedValues: { rate: 'not a number' } }]) {
    const result = run(config, [{ blockId: 'api', output, status: 'success' }], {
      exchangeRate: 5,
    });
    assert.equal(result.status, 'error');
    assert.notEqual(requirements(result)[1].status, 'provided');
  }
});

test('malformed choices and attempts to supply formula results fail explicitly', () => {
  for (const inputChoices of [
    [],
    null,
    { converted: { kind: 'manual', value: 1 } },
    { amount: { kind: 'manual', value: null } },
    { amount: { kind: 'manual', value: Infinity } },
    { amount: { kind: 'source', blockId: 'api', path: ['__proto__', 'value'] } },
    JSON.parse('{"__proto__":{"kind":"manual","value":1}}'),
  ])
    assert.equal(run({ inputChoices }, [], { amount: 2, exchangeRate: 3 }).status, 'error');
});

test('a needs-review source cannot feed calculation values while its findings still reach evidence output', () => {
  const backup = JSON.parse(readFileSync('tests/fixtures/backups/legacy-v0.json', 'utf8'));
  const definition = LocalWorkflowSnapshotSchema.parse(backup['custom:synthetic-recovery'].draft);
  const approval = {
    ...block('review', { toolId: 'review.approval_gate', approved: false }),
    family: 'Review / Validation' as const,
    subtype: 'Approval Gate' as const,
  };
  definition.blocks = [
    approval,
    block('calculate', {
      toolId: 'logic.calculation_engine',
      formulas,
      inputChoices: {
        amount: { kind: 'manual', value: 80 },
        exchangeRate: { kind: 'source', blockId: 'review', path: ['namedValues', 'rate'] },
      },
    }),
    {
      ...block('evidence', { toolId: 'output.evidence_pack_preview' }),
      family: 'Output',
      subtype: 'Evidence Pack',
    },
  ];
  definition.edges = ['calculate', 'evidence'].map((targetBlockId) =>
    createWorkflowEdgeRecord({
      sourceBlockId: 'review',
      targetBlockId,
      reason: 'Review source test',
    }),
  );
  const actual = executeGraph(
    { definition, mode: 'workflow' },
    {
      createId: () => 'review-status-test',
      resolveToolId: getToolIdForBlock,
      getTool: (id) => {
        const tool = LOCAL_TOOL_REGISTRY[id];
        if (id !== 'review.approval_gate') return tool;
        return {
          ...tool,
          execute: (context) => {
            const result = tool.execute(context);
            return {
              ...result,
              status: 'needs_review',
              warnings: ['Awaiting reviewed provider.'],
              output: { ...result.output, namedValues: { rate: 1.25 } },
            };
          },
        };
      },
    },
  );
  assert.equal(actual.result.results.find((item) => item.blockId === 'calculate')!.status, 'error');
  const evidence = actual.result.results.find((item) => item.blockId === 'evidence')!;
  assert.ok(evidence.warnings.includes('Awaiting reviewed provider.'));
  assert.notEqual(evidence.status, 'error');
});
