import { type ToolDefinition } from '../types';
import { getProtectedValue } from '../arithmetic';
import { summarizeValidationGateResults, getUpstreamCurrency, getPipelineTrace } from '../finality';
import {
  getProtectedApprovalState,
  getProtectedFinalityStatus,
  getProtectedFinalityReason,
  getProtectedWarnings,
} from '../input-readiness';
import { completeResult, makeLog } from '../primitives';
import { collectEvidence, collectSourceTrace } from '../rows';
import {
  CANDIDATE_VALUE_INPUT_ROLE,
  APPROVAL_STATUS_INPUT_ROLE,
  APPROVED_VALUE_INPUT_ROLE,
  VALIDATION_RESULT_INPUT_ROLE,
  getToolInputSchema,
  PROTECTED_RESULT_OUTPUT_ROLE,
  GOVERNED_VALUE_OUTPUT_ROLE,
  getToolOutputSchema,
} from '../ports';

export const protectedProtectedResultTool: ToolDefinition = {
  defaultConfig: { runtimeLocked: true },
  description: 'Creates a governed runtime-locked result value.',
  displayName: 'Protected Result',
  execute: (context) => {
    const resultName = String(
      context.config.resultName || context.config.name || context.block.label,
    );
    const value = getProtectedValue(context, resultName);
    const validationGate = summarizeValidationGateResults({
      results: context.upstreamResults,
      workflow: context.workflow,
    });
    const { approvalPresent, approved, approvedBy } = getProtectedApprovalState(
      context.upstreamResults,
    );
    const blockingIssues = validationGate.blockingIssues;
    const finalityStatus = getProtectedFinalityStatus({
      approvalPresent,
      approved,
      blockingIssues,
      value,
    });
    const finalLocked = finalityStatus === 'final';
    const finalityReason = getProtectedFinalityReason(finalityStatus);
    const warnings = getProtectedWarnings({
      approvalPresent,
      approved,
      blockingIssues,
      value,
    });
    const protectedResult = {
      approved,
      approvedBy,
      blockingIssues,
      currency: getUpstreamCurrency(context, resultName),
      final: finalLocked,
      finalityReason,
      finalityStatus,
      name: resultName,
      nonBlockingWarnings: validationGate.nonBlockingWarnings,
      reviewerOverrides: validationGate.reviewerOverrides,
      runtimeLocked: finalLocked,
      sourceTrace: getPipelineTrace(context, resultName),
      status: finalLocked ? 'locked' : finalityStatus,
      validationSummary: validationGate.validationSummary,
      value,
    };

    return completeResult({
      context,
      evidenceRefs: collectEvidence(context),
      logs: [
        makeLog({
          blockId: context.block.id,
          level: warnings.length > 0 ? 'warning' : 'info',
          message: 'Protected result emitted with runtime lock metadata.',
        }),
      ],
      output: {
        approvalStatus: finalLocked ? 'approved' : finalityStatus,
        blockingIssues,
        draftOnly: !finalLocked,
        finalityReason,
        finalityStatus,
        formulaTrace: context.upstreamResults
          .map((result) => result.output.formulaTrace)
          .filter(Boolean),
        governedValue: value,
        nonBlockingWarnings: validationGate.nonBlockingWarnings,
        protectedKind: context.block.governance?.protectedKind || 'result',
        protectedResult,
        protected_result: protectedResult,
        reviewerOverrides: validationGate.reviewerOverrides,
        runtimeLocked: finalLocked,
        sourceTrace: collectSourceTrace(context),
        validationSummary: validationGate.validationSummary,
      },
      sourceTrace: collectSourceTrace(context),
      status: warnings.length > 0 ? 'needs_review' : 'success',
      warnings,
    });
  },
  family: 'Protected',
  inputRoles: [
    CANDIDATE_VALUE_INPUT_ROLE,
    APPROVAL_STATUS_INPUT_ROLE,
    APPROVED_VALUE_INPUT_ROLE,
    VALIDATION_RESULT_INPUT_ROLE,
  ],
  inputSchema: getToolInputSchema([{ key: 'approvedLogicResult', type: 'object' }]),
  outputRoles: [PROTECTED_RESULT_OUTPUT_ROLE, GOVERNED_VALUE_OUTPUT_ROLE],
  outputSchema: getToolOutputSchema([
    { key: 'governedValue', type: 'number' },
    { key: 'runtimeLocked', type: 'boolean' },
  ]),
  runMode: 'local_mock',
  subtype: 'Protected Result',
  toolGroup: 'protected',
  toolId: 'protected.protected_result',
};
