import { type ToolDefinition } from '../types';
import { parseNumber, completeResult, makeLog } from '../primitives';
import { collectRows, collectEvidence, collectSourceTrace } from '../rows';
import {
  CHECKED_ITEMS_INPUT_ROLE,
  getToolInputSchema,
  REVIEW_STATUS_OUTPUT_ROLE,
  LOW_CONFIDENCE_ROWS_OUTPUT_ROLE,
  getToolOutputSchema,
} from '../ports';

export const reviewLowConfidenceWarningTool: ToolDefinition = {
  defaultConfig: { threshold: 0.8 },
  description: 'Flags mapped rows below the configured confidence threshold.',
  displayName: 'Low Confidence Warning',
  execute: (context) => {
    const threshold = parseNumber(context.config.threshold) ?? 0.8;
    const lowConfidenceRows = collectRows(context).filter(
      (row) => (row.confidence ?? 1) < threshold,
    );
    const warnings =
      lowConfidenceRows.length > 0
        ? [`${lowConfidenceRows.length} row(s) are below confidence ${threshold}.`]
        : [];

    return completeResult({
      context,
      evidenceRefs: collectEvidence(context),
      logs: [
        makeLog({
          blockId: context.block.id,
          details: { lowConfidenceRows: lowConfidenceRows.length, threshold },
          level: warnings.length > 0 ? 'warning' : 'info',
          message: 'Low-confidence review check completed.',
        }),
      ],
      output: {
        blocking: false,
        lowConfidenceRows,
        pass: warnings.length === 0,
        threshold,
        validationResult: {
          blocking: false,
          checkedCount: collectRows(context).length,
          failedCount: lowConfidenceRows.length,
          message: warnings[0] || 'All mapped rows meet the low-confidence warning threshold.',
          pass: warnings.length === 0,
          status: warnings.length > 0 ? 'warning' : 'pass',
          threshold,
        },
      },
      sourceTrace: collectSourceTrace(context),
      status: warnings.length > 0 ? 'warning' : 'success',
      warnings,
    });
  },
  family: 'Review / Validation',
  inputRoles: [CHECKED_ITEMS_INPUT_ROLE],
  inputSchema: getToolInputSchema([{ key: 'mappedRows', type: 'array' }]),
  outputRoles: [
    REVIEW_STATUS_OUTPUT_ROLE,
    {
      ...LOW_CONFIDENCE_ROWS_OUTPUT_ROLE,
      canRouteToFamilies: ['Output'],
    },
  ],
  outputSchema: getToolOutputSchema([{ key: 'lowConfidenceRows', type: 'array' }]),
  runMode: 'local_mock',
  subtype: 'Low Confidence Warning',
  toolGroup: 'review',
  toolId: 'review.low_confidence_warning',
};
