import { type ToolDefinition } from '../types';
import { asRecord, completeResult, makeLog } from '../primitives';
import { collectEvidence, collectSourceTrace } from '../rows';
import {
  VALUE_TO_APPROVE_INPUT_ROLE,
  VALIDATION_RESULT_INPUT_ROLE,
  REVIEW_FINDINGS_INPUT_ROLE,
  getToolInputSchema,
  APPROVAL_STATUS_OUTPUT_ROLE,
  REVIEW_STATUS_OUTPUT_ROLE,
  getToolOutputSchema,
} from '../ports';

export const reviewApprovalGateTool: ToolDefinition = {
  defaultConfig: { approved: true },
  description: 'Records a local mock approval decision.',
  displayName: 'Approval Gate',
  execute: (context) => {
    const approved = context.config.approved !== false;
    const approvedWithWarnings = context.config.approvedWithWarnings === true;
    const reviewOverride = asRecord(context.config.reviewOverride);
    const overrideUnmatchedRows =
      context.config.overrideUnmatchedRows === true ||
      reviewOverride?.overrideUnmatchedRows === true;
    const overrideReason =
      String(context.config.overrideReason || reviewOverride?.overrideReason || '').trim() ||
      undefined;
    const reviewerOverrides = {
      approvedWithWarnings,
      overrideReason,
      overrideUnmatchedRows,
    };
    const warnings = approved ? [] : ['Approval gate is not approved.'];
    const reviewer = context.config.reviewer || context.config.owner || 'Reviewer';
    const notes = context.config.notes || context.config.approvalNotes || '';
    const approvalStatus = {
      approved,
      approvedWithWarnings,
      notes,
      overrideReason,
      overrideUnmatchedRows,
      reviewer,
      reviewerOverrides,
      status: approved ? 'approved' : 'not_approved',
    };

    return completeResult({
      context,
      evidenceRefs: collectEvidence(context),
      logs: [
        makeLog({
          blockId: context.block.id,
          level: approved ? 'info' : 'warning',
          message: approved ? 'Approval gate approved locally.' : 'Approval gate needs review.',
        }),
      ],
      output: {
        approved,
        approvedWithWarnings,
        approvalStatus,
        approval_status: approvalStatus,
        notes,
        reviewOverride: reviewerOverrides,
        reviewer,
        reviewerOverrides,
      },
      sourceTrace: collectSourceTrace(context),
      status: approved ? 'success' : 'needs_review',
      warnings,
    });
  },
  family: 'Review / Validation',
  inputRoles: [
    VALUE_TO_APPROVE_INPUT_ROLE,
    VALIDATION_RESULT_INPUT_ROLE,
    REVIEW_FINDINGS_INPUT_ROLE,
  ],
  inputSchema: getToolInputSchema([{ key: 'reviewFindings', type: 'object' }]),
  outputRoles: [
    APPROVAL_STATUS_OUTPUT_ROLE,
    {
      ...REVIEW_STATUS_OUTPUT_ROLE,
      outputKey: 'approved',
      samplePreview: true,
    },
  ],
  outputSchema: getToolOutputSchema([{ key: 'approved', type: 'boolean' }]),
  runMode: 'local_mock',
  subtype: 'Approval Gate',
  toolGroup: 'review',
  toolId: 'review.approval_gate',
};
