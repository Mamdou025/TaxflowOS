import { type ToolDefinition } from '../types';
import { parseNumber, completeResult, makeLog } from '../primitives';
import {
  collectExpectedResultValues,
  collectActualResultValues,
  getNumberRecordValueByResultName,
} from '../validation-values';
import { collectEvidence, collectSourceTrace } from '../rows';
import {
  CHECKED_ITEMS_INPUT_ROLE,
  getToolInputSchema,
  VALIDATION_RESULT_OUTPUT_ROLE,
  REVIEW_STATUS_OUTPUT_ROLE,
  getToolOutputSchema,
} from '../ports';

export const reviewFormulaConsistencyCheckTool: ToolDefinition = {
  defaultConfig: { tolerance: 0.01 },
  description: 'Compares actual calculator results against expected workbook results.',
  displayName: 'Formula Consistency Check',
  execute: (context) => {
    const tolerance = parseNumber(context.config.tolerance) ?? 0.01;
    const expectedResults = collectExpectedResultValues(context);
    const actualResults = collectActualResultValues(context);
    const checks = Object.entries(expectedResults).map(([resultName, expected]) => {
      const actual = getNumberRecordValueByResultName(actualResults, resultName);
      const delta = typeof actual === 'number' ? Number((actual - expected).toFixed(6)) : null;
      return {
        actual,
        delta,
        expected,
        pass: actual !== undefined && Math.abs(actual - expected) <= tolerance,
        resultName,
      };
    });
    const mismatches = checks.filter((check) => !check.pass);
    const warnings =
      checks.length === 0
        ? ['No expected results were available for formula comparison.']
        : mismatches.map(
            (check) =>
              `${check.resultName} expected ${check.expected} but got ${check.actual ?? 'missing'}.`,
          );
    const pass = checks.length > 0 && mismatches.length === 0;
    const validationResult = {
      blocking: true,
      checkedCount: checks.length,
      failedCount: mismatches.length,
      message: pass ? 'Formula results match the expected workbook values.' : warnings[0],
      pass,
      status: pass ? 'pass' : 'warning',
      tolerance,
    };

    return completeResult({
      context,
      evidenceRefs: collectEvidence(context),
      logs: [
        makeLog({
          blockId: context.block.id,
          details: validationResult,
          level: pass ? 'info' : 'warning',
          message: 'Formula consistency check completed.',
        }),
      ],
      output: {
        actualResults,
        blocking: true,
        expectedResults,
        formulaConsistency: { checks, mismatches, tolerance },
        mismatches,
        pass,
        validationResult,
        validation_result: validationResult,
      },
      sourceTrace: collectSourceTrace(context),
      status: pass ? 'success' : 'warning',
      warnings: pass ? [] : warnings,
    });
  },
  family: 'Review / Validation',
  inputRoles: [CHECKED_ITEMS_INPUT_ROLE],
  inputSchema: getToolInputSchema([{ key: 'results', type: 'object' }]),
  outputRoles: [VALIDATION_RESULT_OUTPUT_ROLE, REVIEW_STATUS_OUTPUT_ROLE],
  outputSchema: getToolOutputSchema([
    { key: 'formulaConsistency', type: 'object' },
    { key: 'mismatches', type: 'array' },
    { key: 'validationResult', type: 'object' },
  ]),
  runMode: 'local_mock',
  subtype: 'Formula Consistency Check',
  toolGroup: 'review',
  toolId: 'review.formula_consistency_check',
};
