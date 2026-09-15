import { type ToolDefinition } from '../types';
import { collectUnmatchedRows, collectEvidence, collectSourceTrace } from '../rows';
import {
  getUnmatchedRowsReviewConfig,
  getUnmatchedRowsWarning,
  getUnmatchedRowsMessage,
  getUnmatchedRowsStatus,
} from '../input-readiness';
import { completeResult, makeLog } from '../primitives';
import {
  CHECKED_ITEMS_INPUT_ROLE,
  getToolInputSchema,
  REVIEW_STATUS_OUTPUT_ROLE,
  UNMATCHED_ROWS_OUTPUT_ROLE,
  getToolOutputSchema,
} from '../ports';

export const reviewUnmatchedRowsCheckTool: ToolDefinition = {
  defaultConfig: {},
  description: 'Flags mapped workflows that still have unmatched rows.',
  displayName: 'Unmatched Rows Check',
  execute: (context) => {
    const unmatchedRows = collectUnmatchedRows(context);
    const { blocking, overrideReason, overrideUnmatchedRows } =
      getUnmatchedRowsReviewConfig(context);
    const hasUnmatchedRows = unmatchedRows.length > 0;
    const warning = getUnmatchedRowsWarning({
      count: unmatchedRows.length,
      overrideUnmatchedRows,
    });
    const warnings = warning ? [warning] : [];
    const pass = !hasUnmatchedRows || overrideUnmatchedRows;
    const validationResult = {
      blocking,
      checkedCount: unmatchedRows.length,
      failedCount: pass ? 0 : unmatchedRows.length,
      message: getUnmatchedRowsMessage({ hasUnmatchedRows, pass, warning }),
      overrideApplied: overrideUnmatchedRows && hasUnmatchedRows,
      overrideReason,
      pass,
      status: pass ? 'pass' : 'fail',
    };

    return completeResult({
      context,
      evidenceRefs: collectEvidence(context),
      logs: [
        makeLog({
          blockId: context.block.id,
          details: { unmatchedRows: unmatchedRows.length },
          level: warnings.length > 0 ? 'warning' : 'info',
          message: 'Unmatched row review check completed.',
        }),
      ],
      output: {
        blocking,
        pass,
        reviewOverride: {
          overrideReason,
          overrideUnmatchedRows,
        },
        validationResult,
        validation_result: validationResult,
        unmatchedRows,
      },
      sourceTrace: collectSourceTrace(context),
      status: getUnmatchedRowsStatus({ pass, warnings }),
      warnings,
    });
  },
  family: 'Review / Validation',
  inputRoles: [CHECKED_ITEMS_INPUT_ROLE],
  inputSchema: getToolInputSchema([{ key: 'unmatchedRows', type: 'array' }]),
  outputRoles: [
    REVIEW_STATUS_OUTPUT_ROLE,
    {
      ...UNMATCHED_ROWS_OUTPUT_ROLE,
      canRouteToFamilies: ['Output'],
    },
  ],
  outputSchema: getToolOutputSchema([
    { key: 'unmatchedRows', type: 'array' },
    { key: 'pass', type: 'boolean' },
  ]),
  runMode: 'local_mock',
  subtype: 'Unmatched Rows Check',
  toolGroup: 'review',
  toolId: 'review.unmatched_rows_check',
};
