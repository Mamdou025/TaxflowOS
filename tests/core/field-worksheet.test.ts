import assert from 'node:assert/strict';
import { test } from 'node:test';
import type {
  WorkflowBlock,
  WorkflowDefinition,
} from '../../lib/workflow-contracts/src/domain/workflow-types';
import type { ToolRunResult } from '../../lib/workflow-contracts/src/tool-types';
import {
  projectFieldWorksheet,
  readWorksheetLines,
} from '../../lib/workflow-core/src/application/field-worksheet';
import { createWorkflowEdgeRecord } from '../../lib/workflow-core/src/core/edges';
import { getAllowedRelationshipTypesForFamilies } from '../../lib/workflow-contracts/src/domain/workflow-rules';

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
function result(
  blockId: string,
  output: Record<string, unknown>,
  status: ToolRunResult['status'] = 'success',
): ToolRunResult {
  return {
    blockId,
    output,
    status,
    toolId: 'test',
    runId: 'test',
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
  const calc = block('calculate', {
    toolId: 'logic.calculation_engine',
    mode: 'inline',
    formulas: [
      {
        calculationId: 'subtotal',
        resultKey: 'subtotal',
        label: 'Subtotal',
        formulaExpression: 'amount * rate',
      },
      {
        calculationId: 'total',
        resultKey: 'total',
        label: 'Total',
        formulaExpression: 'subtotal + fee',
        unit: 'units',
      },
    ],
    inputChoices: {
      amount: { kind: 'manual', value: 0 },
      fee: { kind: 'manual', value: 2 },
      rate: { kind: 'source', blockId: 'api', path: ['namedValues', 'rate'] },
    },
  });
  const api = {
    ...block('api', { toolId: 'source.http_json' }),
    family: 'Source' as const,
    subtype: 'API / HTTP Request' as const,
  };
  const field = {
    ...block('worksheet', {
      toolId: 'field.field_block',
      worksheetLines: [
        {
          id: 'grand-total',
          label: 'Grand total',
          calculationBlockId: calc.id,
          resultKey: 'total',
        },
      ],
    }),
    family: 'Field' as const,
    subtype: 'Field Block' as const,
  };
  const definition: Pick<WorkflowDefinition, 'blocks' | 'edges'> = {
    blocks: [api, calc, field],
    edges: [
      createWorkflowEdgeRecord({
        sourceBlockId: api.id,
        targetBlockId: calc.id,
        reason: 'Rate',
        sourceOutputRole: 'named_values',
        targetInputRole: 'named_values',
      }),
      createWorkflowEdgeRecord({
        sourceBlockId: calc.id,
        targetBlockId: field.id,
        reason: 'Result',
        sourceOutputRole: 'calculated_results',
        targetInputRole: 'computed_values',
      }),
    ],
  };
  const apiResult = result('api', { namedValues: { rate: 1.5 } });
  apiResult.evidenceRefs = [
    {
      evidenceId: 'capture',
      sourceBlockId: 'api',
      sourceLabel: 'Rate API',
      immutable: true,
      locator: '$.rate',
    },
  ];
  const calcResult = result('calculate', { calculatedResults: { subtotal: 0, total: 2 } });
  calcResult.evidenceRefs = apiResult.evidenceRefs;
  const results = { api: apiResult, calculate: calcResult };
  return { calc, api, field, definition, results };
}

test('declared worksheet lines exist before execution with formula and nested requirements', () => {
  const { field, definition } = fixture();
  const projection = projectFieldWorksheet({ block: field, definition });
  assert.deepEqual(projection.errors, []);
  const line = projection.lines[0];
  assert.equal(line.status, 'missing');
  assert.equal(line.value, undefined);
  assert.equal(line.formula, 'subtotal + fee');
  assert.equal(line.dependencies[0].kind, 'calculation');
  assert.equal(line.dependencies[0].formula, 'amount * rate');
  assert.deepEqual(
    line.dependencies[0].dependencies.map((item) => [item.key, item.status, item.value]),
    [
      ['amount', 'current', 0],
      ['rate', 'missing', undefined],
    ],
  );
});

test('result presentation metadata survives projection without rounding or changing value states', () => {
  const { field, definition, results } = fixture();
  const display = {
    presentation: 'primary',
    group: 'Outcome',
    description: 'Total after the fee',
    decimalPlaces: 2,
  };
  const line = (field.config.worksheetLines as Record<string, unknown>[])[0];
  Object.assign(line, display);
  results.calculate.output.calculatedResults = { subtotal: 0, total: 2.123456 };
  const current = projectFieldWorksheet({ block: field, definition, results });
  assert.deepEqual(current.errors, []);
  assert.equal(
    current.lines[0].value,
    2.123456,
    'Display precision must not round captured values',
  );
  for (const [key, value] of Object.entries(display))
    assert.equal((current.lines[0] as unknown as Record<string, unknown>)[key], value);
  assert.equal(current.lines[0].status, 'current');
  const missing = projectFieldWorksheet({ block: field, definition });
  assert.equal(missing.lines[0].presentation, 'primary');
  assert.equal(missing.lines[0].value, undefined);
  assert.equal(missing.lines[0].status, 'missing');
  const stale = projectFieldWorksheet({ block: field, definition, results, stale: ['api'] });
  assert.equal(stale.lines[0].presentation, 'primary');
  assert.equal(stale.lines[0].value, undefined);
  assert.equal(stale.lines[0].status, 'stale');
});

test('worksheet display settings reject malformed values while legacy lines stay unchanged', () => {
  const { field } = fixture();
  const line = (field.config.worksheetLines as Record<string, unknown>[])[0];
  assert.deepEqual(readWorksheetLines(field.config).lines, [line]);
  for (const settings of [
    { presentation: 'headline' },
    { presentation: ['primary'] },
    { group: 10 },
    { description: false },
    { decimalPlaces: -1 },
    { decimalPlaces: 7 },
    { decimalPlaces: 1.5 },
    { decimalPlaces: '2' },
    { decimalPlaces: Number.NaN },
  ]) {
    const parsed = readWorksheetLines({ worksheetLines: [{ ...line, ...settings }] });
    assert.equal(parsed.lines.length, 0);
    assert.equal(parsed.errors.length, 1);
    assert.match(parsed.errors[0], /invalid display settings/);
  }
  for (const presentation of ['primary', 'summary', 'detail']) {
    const parsed = readWorksheetLines({
      worksheetLines: [{ ...line, presentation, decimalPlaces: 0, description: '', group: '' }],
    });
    assert.deepEqual(parsed.errors, []);
    assert.equal(parsed.lines[0].decimalPlaces, 0);
    assert.equal(parsed.lines[0].presentation, presentation);
  }
});

test('current finite results preserve zero, source binding and provenance without recomputing', () => {
  const { field, definition, results } = fixture();
  const original = structuredClone(definition);
  const line = projectFieldWorksheet({ block: field, definition, results }).lines[0];
  assert.equal(line.value, 2);
  assert.equal(line.status, 'current');
  assert.equal(line.unit, 'units');
  assert.equal(line.dependencies[0].value, 0);
  const rate = line.dependencies[0].dependencies[1];
  assert.equal(rate.origin, 'source');
  assert.equal(rate.value, 1.5);
  assert.deepEqual(rate.binding, { kind: 'source', blockId: 'api', path: ['namedValues', 'rate'] });
  assert.equal(rate.evidenceRefs[0].evidenceId, 'capture');
  assert.equal(line.evidenceRefs[0].evidenceId, 'capture');
  assert.deepEqual(definition, original);
  results.api.output.namedValues = { rate: 1.75 };
  assert.equal(
    projectFieldWorksheet({ block: field, definition, results }).lines[0].dependencies[0]
      .dependencies[1].value,
    1.75,
    'A new projection reads refreshed provider values even when the source object identity is retained',
  );
  results.calculate.output.calculatedResults = { subtotal: 0, total: 123 };
  assert.equal(
    projectFieldWorksheet({ block: field, definition, results }).lines[0].value,
    123,
    'Field displays actual engine output rather than evaluating its own formula',
  );
});

test('stale dependencies and failed captures never present prior numeric values as current', () => {
  const { field, definition, results } = fixture();
  const stale = projectFieldWorksheet({ block: field, definition, results, stale: ['api'] })
    .lines[0];
  assert.equal(stale.status, 'stale');
  assert.equal(stale.value, undefined);
  assert.equal(stale.dependencies[0].dependencies[1].status, 'stale');
  assert.equal(stale.dependencies[0].dependencies[1].value, undefined);
  for (const value of [NaN, Infinity, '2', null]) {
    results.calculate.output.calculatedResults = { total: value };
    const line = projectFieldWorksheet({ block: field, definition, results }).lines[0];
    assert.equal(line.status, 'invalid');
    assert.equal(line.value, undefined);
  }
  results.calculate.status = 'error';
  results.calculate.output.calculatedResults = { total: 2 };
  assert.equal(
    projectFieldWorksheet({ block: field, definition, results }).lines[0].status,
    'invalid',
  );
  results.calculate.status = 'success';
  results.calculate.output.calculatedResults = { subtotal: 0, total: 2 };
  results.api.status = 'error';
  const failedSource = projectFieldWorksheet({ block: field, definition, results }).lines[0];
  assert.notEqual(failedSource.status, 'current');
  assert.equal(failedSource.value, undefined);
});

test('line validation rejects malformed declarations, unknown keys and disconnected calculators', () => {
  const { field, definition, results } = fixture();
  for (const worksheetLines of [null, {}, [], [null], [{ id: '__proto__' }]]) {
    const projection = projectFieldWorksheet({
      block: { ...field, config: { worksheetLines } },
      definition,
      results,
    });
    assert.ok(projection.errors.length);
    assert.equal(projection.declared, true);
  }
  const line = (field.config.worksheetLines as Record<string, unknown>[])[0];
  field.config.worksheetLines = [{ ...line, resultKey: 'unknown' }];
  assert.equal(
    projectFieldWorksheet({ block: field, definition, results }).lines[0].status,
    'invalid',
  );
  field.config.worksheetLines = [line, line];
  assert.match(projectFieldWorksheet({ block: field, definition }).errors[0], /more than once/);
  field.config.worksheetLines = [line];
  definition.edges[1].status = 'disabled';
  assert.match(
    projectFieldWorksheet({ block: field, definition, results }).lines[0].message ?? '',
    /Connect/,
  );
  assert.deepEqual(projectFieldWorksheet({ block: { ...field, config: {} }, definition }), {
    declared: false,
    lines: [],
    errors: [],
  });
});

test('the worksheet keeps missing lines beside available results and source choices remain authoritative', () => {
  const { field, calc, definition, results } = fixture();
  const waiting = block('waiting', {
    toolId: 'logic.calculation_engine',
    mode: 'inline',
    formulas: [{ calculationId: 'pending', resultKey: 'pending', formulaExpression: 'unknown' }],
  });
  definition.blocks.push(waiting);
  definition.edges.push(
    createWorkflowEdgeRecord({
      sourceBlockId: waiting.id,
      targetBlockId: field.id,
      reason: 'Second result',
    }),
  );
  (field.config.worksheetLines as Record<string, unknown>[]).push({
    id: 'pending',
    label: 'Pending amount',
    calculationBlockId: waiting.id,
    resultKey: 'pending',
  });
  const projection = projectFieldWorksheet({ block: field, definition, results });
  assert.deepEqual(
    projection.lines.map((line) => [line.status, line.value]),
    [
      ['current', 2],
      ['missing', undefined],
    ],
  );
  calc.config.inputChoices = {
    amount: { kind: 'manual', value: 0 },
    fee: { kind: 'manual', value: 2 },
    rate: { kind: 'manual' },
  };
  const blank = projectFieldWorksheet({ block: field, definition, results, stale: [calc.id] })
    .lines[0];
  assert.equal(blank.dependencies[0].dependencies[1].status, 'missing');
  assert.equal(blank.dependencies[0].dependencies[1].origin, 'manual');
});

test('Field relationships carry candidate results without granting protected finality', () => {
  assert.deepEqual(getAllowedRelationshipTypesForFamilies('Logic', 'Field'), ['provides_data_to']);
  assert.ok(
    getAllowedRelationshipTypesForFamilies('Field', 'Output').includes('feeds_output_input'),
  );
  assert.ok(!getAllowedRelationshipTypesForFamilies('Field', 'Output').includes('maps_to_output'));
});

test('worksheet metadata follows captured external rules while stale numeric results stay unavailable', () => {
  const { field, calc, definition, results } = fixture();
  const rules = {
    ...block('rules', {
      toolId: 'source.calculation_rules',
      calculationRules: [
        { calculationId: 'configured', resultKey: 'configured', formulaExpression: 'amount' },
      ],
    }),
    family: 'Source' as const,
    subtype: 'Calculation Rules' as const,
  };
  definition.blocks.push(rules);
  definition.edges.push(
    createWorkflowEdgeRecord({
      sourceBlockId: rules.id,
      targetBlockId: calc.id,
      reason: 'External rulebook',
      sourceOutputRole: 'calculation_rules',
      targetInputRole: 'calculation_rules',
    }),
  );
  calc.config = {
    toolId: 'logic.calculation_engine',
    mode: 'external_rules',
    inputChoices: { amount: { kind: 'manual', value: 0 } },
  };
  field.config.worksheetLines = [
    {
      id: 'captured',
      label: 'Captured result',
      calculationBlockId: calc.id,
      resultKey: 'captured',
    },
  ];
  const captured = result('rules', {
    calculationRules: [
      { calculationId: 'captured', resultKey: 'captured', formulaExpression: 'amount + 1' },
    ],
  });
  results.calculate.output.calculatedResults = { captured: 1 };
  const current = projectFieldWorksheet({
    block: field,
    definition,
    results: { ...results, rules: captured },
  }).lines[0];
  assert.equal(current.status, 'current');
  assert.equal(current.formula, 'amount + 1');
  const stale = projectFieldWorksheet({
    block: field,
    definition,
    results: { ...results, rules: result('rules', {}, 'error') },
    stale: ['rules'],
    history: [captured],
  }).lines[0];
  assert.equal(stale.status, 'stale');
  assert.equal(stale.formula, 'amount + 1');
  assert.equal(stale.value, undefined);
});

test('circular dependencies are bounded and identified before calculation', () => {
  const { field, calc, definition } = fixture();
  calc.config.formulas = [
    { calculationId: 'subtotal', resultKey: 'subtotal', formulaExpression: 'total - fee' },
    { calculationId: 'total', resultKey: 'total', formulaExpression: 'subtotal + fee' },
  ];
  const line = projectFieldWorksheet({ block: field, definition }).lines[0];
  assert.equal(line.status, 'invalid');
  assert.match(line.message ?? '', /Circular/);
});
