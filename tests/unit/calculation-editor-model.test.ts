import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  formulaToExpression,
  getFormulasFromConfig,
  getTokenItems,
  isValidNumericLiteral,
  tokenizeExpression,
  tokensToExpression,
} from '../../artifacts/ai-workflow-builder/src/features/workflow-builder/ui/logic-viewers/calculation-editor-model';

test('calculation editor tokens preserve references, functions, operators and numeric literals', () => {
  const expression = 'max(source:block@3Aid:rawRows.0.rate - TERM_A, 1.25e+2)';
  const tokens = tokenizeExpression(expression);

  assert.deepEqual(
    tokens.map(({ type, value }) => [type, value]),
    [
      ['func', 'max'],
      ['paren', '('],
      ['ref', 'source:block@3Aid:rawRows.0.rate'],
      ['op', '-'],
      ['ref', 'TERM_A'],
      ['op', ','],
      ['num', '1.25e+2'],
      ['paren', ')'],
    ],
  );
  assert.equal(
    tokensToExpression(tokens),
    'max ( source:block@3Aid:rawRows.0.rate - TERM_A , 1.25e+2 )',
  );
});

test('legacy formula operations receive the same editable expression representation', () => {
  assert.equal(
    formulaToExpression({
      calculationId: 'TOTAL',
      label: 'Total',
      operands: ['BASE', 2, 3],
      operation: 'subtract',
      resultKey: 'TOTAL',
    }),
    'BASE - 2 - 3',
  );
  assert.equal(
    formulaToExpression({
      calculationId: 'TOTAL',
      formulaExpression: ' BASE * 4 ',
      label: 'Total',
      operands: [],
      operation: 'pass_through',
      resultKey: 'TOTAL',
    }),
    'BASE * 4',
  );
});

test('calculation config filtering and token keys reject malformed ambiguity', () => {
  const formulas = getFormulasFromConfig({
    formulas: [
      {
        calculationId: 'A',
        label: 'A',
        operands: [1],
        operation: 'pass_through',
        resultKey: 'A',
      },
      null,
      { label: 'missing id' },
    ],
  });
  assert.equal(formulas.length, 1);
  assert.deepEqual(
    getTokenItems(tokenizeExpression('A + A')).map(({ key }) => key),
    ['ref:A:1', 'op:+:1', 'ref:A:2'],
  );
  assert.equal(isValidNumericLiteral('-0.25e3'), true);
  assert.equal(isValidNumericLiteral('12oops'), false);
  assert.equal(isValidNumericLiteral(''), false);
});
