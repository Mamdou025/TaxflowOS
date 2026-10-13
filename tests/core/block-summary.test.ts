import assert from 'node:assert/strict';
import { test } from 'node:test';
import type {
  WorkflowBlock,
  WorkflowDefinition,
} from '../../lib/workflow-contracts/src/domain/workflow-types';
import { describeWorkflowBlock } from '../../lib/workflow-core/src/application/block-summary';

const at = '2026-10-11T12:00:00Z';

function block(
  id: string,
  family: WorkflowBlock['family'],
  subtype: WorkflowBlock['subtype'],
  config: Record<string, unknown>,
  description = '',
): WorkflowBlock {
  return {
    id,
    config,
    label: id,
    description,
    family,
    subtype,
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

test('a Calculation Engine summary lists its real formulas, not a generic label', () => {
  const calc = block('calc', 'Logic', 'Calculation Engine', {
    toolId: 'logic.calculation_engine',
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
      },
    ],
  });
  const definition: Pick<WorkflowDefinition, 'blocks' | 'edges'> = { blocks: [calc], edges: [] };
  const summary = describeWorkflowBlock(calc, definition);
  assert.match(summary, /subtotal = amount \* rate/);
  assert.match(summary, /total = subtotal \+ fee/);
});

test('a Calculation Engine with no formulas says so honestly, instead of fabricating detail', () => {
  const calc = block('calc', 'Logic', 'Calculation Engine', {
    toolId: 'logic.calculation_engine',
    formulas: [],
  });
  const definition: Pick<WorkflowDefinition, 'blocks' | 'edges'> = { blocks: [calc], edges: [] };
  assert.match(describeWorkflowBlock(calc, definition), /no formulas defined yet/);
});

test('a long formula list is truncated with a count, not dumped in full', () => {
  const formulas = Array.from({ length: 10 }, (_, i) => ({
    calculationId: `t${i}`,
    resultKey: `t${i}`,
    label: `T${i}`,
    formulaExpression: `${i} + 1`,
  }));
  const calc = block('calc', 'Logic', 'Calculation Engine', {
    toolId: 'logic.calculation_engine',
    formulas,
  });
  const definition: Pick<WorkflowDefinition, 'blocks' | 'edges'> = { blocks: [calc], edges: [] };
  const summary = describeWorkflowBlock(calc, definition);
  assert.match(summary, /\+4 more/);
});

test('a Workpaper summary names its declared fields and the calculator each comes from', () => {
  const calc = block('calc', 'Logic', 'Calculation Engine', {
    toolId: 'logic.calculation_engine',
    formulas: [
      { calculationId: 'total', resultKey: 'total', label: 'Total', formulaExpression: 'a + b' },
    ],
  });
  const field = block('worksheet', 'Field', 'Field Block', {
    toolId: 'field.field_block',
    worksheetLines: [
      { id: 'line-1', label: 'Grand total', calculationBlockId: 'calc', resultKey: 'total' },
    ],
  });
  const definition: Pick<WorkflowDefinition, 'blocks' | 'edges'> = {
    blocks: [calc, field],
    edges: [],
  };
  const summary = describeWorkflowBlock(field, definition);
  assert.match(summary, /Grand total \(total from calc\)/);
});

test('an undeclared Workpaper says it is showing whatever its calculators produce', () => {
  const field = block('worksheet', 'Field', 'Field Block', { toolId: 'field.field_block' });
  const definition: Pick<WorkflowDefinition, 'blocks' | 'edges'> = { blocks: [field], edges: [] };
  assert.match(describeWorkflowBlock(field, definition), /no worksheet lines declared/);
});

test('a block type without a structural summary falls back to its own description, then a generic label', () => {
  const withDescription = block(
    'src',
    'Source',
    'API / HTTP Request',
    {},
    'Pulls the daily FX rate.',
  );
  const withoutDescription = block('src2', 'Source', 'API / HTTP Request', {});
  const definition: Pick<WorkflowDefinition, 'blocks' | 'edges'> = {
    blocks: [withDescription, withoutDescription],
    edges: [],
  };
  assert.equal(describeWorkflowBlock(withDescription, definition), 'Pulls the daily FX rate.');
  assert.equal(
    describeWorkflowBlock(withoutDescription, definition),
    'src2 — a Source / API / HTTP Request block.',
  );
});
