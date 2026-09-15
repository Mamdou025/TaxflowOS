import { isGovernedValueBlock } from '@workspace/workflow-executors/domain/workflow/protected-rules';
import { type ToolDefinition } from '../types';
import { getProtectedResults, getOutputFinalitySummary } from '../finality';
import { asStringArray, completeResult, makeLog } from '../primitives';
import { collectEvidence, collectSourceTrace } from '../rows';
import {
  PROTECTED_VALUES_INPUT_ROLE,
  VALIDATION_RESULT_INPUT_ROLE,
  REVIEW_FINDINGS_INPUT_ROLE,
  getToolInputSchema,
  VALIDATION_RESULT_OUTPUT_ROLE,
  REVIEW_STATUS_OUTPUT_ROLE,
  getToolOutputSchema,
} from '../ports';

export const reviewOutputReadinessCheckTool: ToolDefinition = {
  defaultConfig: {},
  description: 'Checks whether protected values and outputs are present.',
  displayName: 'Output Readiness Check',
  execute: (context) => {
    const protectedBlocks = context.workflow.blocks.filter((block) => isGovernedValueBlock(block));
    const outputBlocks = context.workflow.blocks.filter((block) => block.family === 'Output');
    const protectedResults = getProtectedResults(context.upstreamResults);
    const requiredProtectedResults = asStringArray(context.config.requiredProtectedResults);
    const protectedResultNames = new Set(
      protectedResults.map((result) => String(result.name || '')),
    );
    const missingProtectedResults = requiredProtectedResults.filter(
      (name) => !protectedResultNames.has(name),
    );
    const finality = getOutputFinalitySummary({
      protectedResults,
      results: context.upstreamResults,
      workflow: context.workflow,
    });
    const missingItems = [
      protectedBlocks.length === 0 ? 'No Protected blocks are present.' : '',
      outputBlocks.length === 0 ? 'No Output blocks are present.' : '',
      ...missingProtectedResults.map((name) => `Missing required protected result: ${name}.`),
      ...finality.blockingIssues.map((issue) => issue.message),
    ].filter(Boolean);
    const pass = missingItems.length === 0;
    const outputReadinessResult = {
      blocking: true,
      finalityStatus: pass ? 'final' : 'review_ready',
      message: pass
        ? 'Outputs are ready for final handoff.'
        : 'Outputs are review-ready, but blocking findings remain.',
      missingItems,
      missingProtectedResults,
      pass,
      protectedCount: protectedBlocks.length,
      protectedResultCount: protectedResults.length,
      requiredProtectedResults,
      status: pass ? 'pass' : 'fail',
      validationSummary: finality.validationSummary,
    };

    return completeResult({
      context,
      evidenceRefs: collectEvidence(context),
      logs: [
        makeLog({
          blockId: context.block.id,
          level: missingItems.length > 0 ? 'warning' : 'info',
          message: 'Output readiness check completed.',
        }),
      ],
      output: {
        blocking: true,
        finalityStatus: outputReadinessResult.finalityStatus,
        missingItems,
        missingProtectedResults,
        outputReadinessResult,
        output_readiness_result: outputReadinessResult,
        outputCount: outputBlocks.length,
        pass,
        protectedCount: protectedBlocks.length,
        protectedResultsFinality: finality.protectedResultsFinality,
        ready: pass,
        validationResult: outputReadinessResult,
        validation_result: outputReadinessResult,
      },
      sourceTrace: collectSourceTrace(context),
      status: pass ? 'success' : 'needs_review',
      warnings: missingItems,
    });
  },
  family: 'Review / Validation',
  inputRoles: [
    PROTECTED_VALUES_INPUT_ROLE,
    VALIDATION_RESULT_INPUT_ROLE,
    REVIEW_FINDINGS_INPUT_ROLE,
  ],
  inputSchema: getToolInputSchema([{ key: 'workflow', type: 'object' }]),
  outputRoles: [
    VALIDATION_RESULT_OUTPUT_ROLE,
    {
      ...REVIEW_STATUS_OUTPUT_ROLE,
      outputKey: 'ready',
    },
  ],
  outputSchema: getToolOutputSchema([{ key: 'ready', type: 'boolean' }]),
  runMode: 'local_mock',
  subtype: 'Output Readiness Check',
  toolGroup: 'review',
  toolId: 'review.output_readiness_check',
};
