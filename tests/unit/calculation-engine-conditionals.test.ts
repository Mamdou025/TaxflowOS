import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { WorkflowBlock } from '../../lib/workflow-contracts/src/domain/workflow-types';
import { runCalculationEngine } from '../../lib/workflow-executors/src/execution/blocks/logic/calculation-engine/run';

// Phase 2 of docs/block-palette-redesign.md: the Calculate block's formula
// language had no comparison operators and no conditional/branch construct,
// so a threshold rule ("if income exceeds $500K, apply rate B") could not be
// expressed at all. These tests prove the new `> < >= <= == !=` comparators
// and `if(condition, then, else)` function against independently worked-out
// expected values — not just that the code runs.

const instant = '2026-10-10T00:00:00Z';

function block(formulaExpression: string): WorkflowBlock {
  return {
    id: 'calculate',
    family: 'Logic',
    subtype: 'Calculation Engine',
    label: 'calculate',
    description: '',
    status: 'configured',
    position: { x: 0, y: 0 },
    config: {
      formulas: [{ calculationId: 'result', resultKey: 'result', formulaExpression }],
    },
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

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
}

function evaluate(formulaExpression: string, namedValues: Record<string, number> = {}) {
  const config = block(formulaExpression).config as Record<string, unknown>;
  const result = runCalculationEngine({
    block: block(formulaExpression),
    config,
    inputsByRole: { named_values: [{ namedValues }] },
    runId: 'test',
    startedAt: instant,
  });
  const calculatedResults = asRecord(asRecord(result.outputs.calculated_results).calculatedResults);
  return calculatedResults.result;
}

test('comparison operators report 1 or 0, matching an independently worked-out truth table', () => {
  const cases: Array<[string, Record<string, number>, number]> = [
    ['5 > 3', {}, 1],
    ['3 > 5', {}, 0],
    ['5 < 3', {}, 0],
    ['3 < 5', {}, 1],
    ['5 >= 5', {}, 1],
    ['6 >= 5', {}, 1],
    ['4 >= 5', {}, 0],
    ['5 <= 5', {}, 1],
    ['4 <= 5', {}, 1],
    ['6 <= 5', {}, 0],
    ['4 == 4', {}, 1],
    ['4 == 5', {}, 0],
    ['4 != 5', {}, 1],
    ['4 != 4', {}, 0],
    // The arithmetic operands still bind tighter than the comparison itself.
    ['a + b > c', { a: 2, b: 3, c: 4 }, 1], // (2+3)=5 > 4
    ['a + b > c', { a: 2, b: 1, c: 4 }, 0], // (2+1)=3 > 4 is false
  ];
  for (const [expression, namedValues, expected] of cases) {
    assert.equal(evaluate(expression, namedValues), expected, expression);
  }
});

test('if(condition, then, else) branches on the comparison result', () => {
  assert.equal(evaluate('if(5 > 3, 10, 20)'), 10);
  assert.equal(evaluate('if(3 > 5, 10, 20)'), 20);
  // Nonzero-is-true, not just exactly 1 — matches every other formula value.
  assert.equal(evaluate('if(7, 100, 200)'), 100);
  assert.equal(evaluate('if(0, 100, 200)'), 200);
});

test('a progressive-bracket pattern — impossible before this change — now computes correctly', () => {
  // A textbook general-calculation need the engine could not express at all:
  // apply a higher rate once income crosses a threshold.
  const expression = 'if(income > threshold, income * highRate, income * lowRate)';
  assert.equal(
    evaluate(expression, { income: 600, threshold: 500, highRate: 0.3, lowRate: 0.15 }),
    180, // 600 > 500, so 600 * 0.3
  );
  assert.equal(
    evaluate(expression, { income: 400, threshold: 500, highRate: 0.3, lowRate: 0.15 }),
    60, // 400 is not > 500, so 400 * 0.15
  );
});

test('if composes with the existing guard functions unchanged', () => {
  // ss.91(4)-style cap, now reachable only when a condition actually holds.
  assert.equal(
    evaluate('if(paid > 0, min_multiply_cap(paid, rtf, cap), 0)', {
      paid: 100,
      rtf: 4,
      cap: 300,
    }),
    300, // min(100*4, 300) = 300
  );
  assert.equal(
    evaluate('if(paid > 0, min_multiply_cap(paid, rtf, cap), 0)', { paid: 0, rtf: 4, cap: 300 }),
    0, // paid > 0 is false, so the guarded branch never runs
  );
});

test('pre-existing arithmetic-only formulas are unaffected by the new grammar level', () => {
  // A regression check for the exact kind of expression FAPI's saved template
  // uses today — no comparator present, so parseComparison must be a no-op.
  assert.equal(
    evaluate('max_subtract_zero(gross, deductions)', { gross: 500, deductions: 120 }),
    380,
  );
  assert.equal(evaluate('(a + b) * c', { a: 2, b: 3, c: 4 }), 20);
});
