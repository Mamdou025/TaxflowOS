import { type ToolDefinition, type ToolRunStatus } from '../types';
import { parseNumber, completeResult, makeLog } from '../primitives';
import { collectRows, collectEvidence, collectSourceTrace } from '../rows';
import {
  CHECKED_ITEMS_INPUT_ROLE,
  getToolInputSchema,
  VALIDATION_RESULT_OUTPUT_ROLE,
  LOW_CONFIDENCE_ROWS_OUTPUT_ROLE,
  getToolOutputSchema,
} from '../ports';

export const reviewConfidenceCheckTool: ToolDefinition = {
  defaultConfig: { blocking: true, threshold: 0.75 },
  description: 'Checks whether mapped rows meet a configured confidence threshold.',
  displayName: 'Confidence Check',
  execute: (context) => {
    const threshold = parseNumber(context.config.threshold) ?? 0.75;
    const rows = collectRows(context);
    const failedRows = rows.filter((row) => (row.confidence ?? 1) < threshold);
    const blocking = context.config.blocking !== false;
    const pass = failedRows.length === 0;
    let reviewStatus = 'pass';
    let runStatus: ToolRunStatus = 'success';
    if (!pass) {
      reviewStatus = blocking ? 'fail' : 'warning';
      runStatus = blocking ? 'needs_review' : 'warning';
    }
    const validationResult = {
      checkedCount: rows.length,
      failedCount: failedRows.length,
      message: pass
        ? 'All mapped rows meet the confidence threshold.'
        : `${failedRows.length} mapped row(s) are below confidence ${threshold}.`,
      status: reviewStatus,
      threshold,
    };
    const warnings = pass ? [] : [validationResult.message];

    return completeResult({
      context,
      evidenceRefs: collectEvidence(context),
      logs: [
        makeLog({
          blockId: context.block.id,
          details: validationResult,
          level: pass ? 'info' : 'warning',
          message: 'Confidence review check completed.',
        }),
      ],
      output: {
        blocking,
        failedRows,
        lowConfidenceRows: failedRows,
        pass,
        threshold,
        validationResult: { ...validationResult, blocking, pass },
        validation_result: { ...validationResult, blocking, pass },
      },
      sourceTrace: collectSourceTrace(context),
      status: runStatus,
      warnings,
    });
  },
  family: 'Review / Validation',
  inputRoles: [CHECKED_ITEMS_INPUT_ROLE],
  inputSchema: getToolInputSchema([{ key: 'mappedRows', type: 'array' }]),
  outputRoles: [
    VALIDATION_RESULT_OUTPUT_ROLE,
    {
      ...LOW_CONFIDENCE_ROWS_OUTPUT_ROLE,
      canRouteToFamilies: ['Output'],
    },
  ],
  outputSchema: getToolOutputSchema([
    { key: 'validationResult', type: 'object' },
    { key: 'lowConfidenceRows', type: 'array' },
  ]),
  runMode: 'local_mock',
  subtype: 'Low Confidence Warning',
  toolGroup: 'review',
  toolId: 'review.confidence_check',
};
