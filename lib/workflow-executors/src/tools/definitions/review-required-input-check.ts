import { type ToolDefinition } from '../types';
import { asStringArray, completeResult, makeLog } from '../primitives';
import { hasRequiredInputKey } from '../input-readiness';
import { collectEvidence, collectSourceTrace } from '../rows';
import {
  REVIEW_FINDINGS_INPUT_ROLE,
  getToolInputSchema,
  VALIDATION_RESULT_OUTPUT_ROLE,
  REVIEW_STATUS_OUTPUT_ROLE,
  getToolOutputSchema,
} from '../ports';

export const reviewRequiredInputCheckTool: ToolDefinition = {
  defaultConfig: { requiredKeys: [] },
  description: 'Checks whether required upstream values are available.',
  displayName: 'Required Input Check',
  execute: (context) => {
    const requiredKeys = asStringArray(context.config.requiredKeys);
    const missingRequiredKeys = requiredKeys.filter((key) => !hasRequiredInputKey(context, key));
    const missingUpstream =
      context.upstreamResults.length === 0 ? ['No upstream tool results were available.'] : [];
    const errored = context.upstreamResults.filter(
      (result) => result.status === 'error' || result.status === 'skipped',
    );
    const warnings = [
      ...missingUpstream,
      ...missingRequiredKeys.map((key) => `Missing required input: ${key}.`),
      ...errored.map((result) => `${result.blockId} did not complete.`),
    ];
    const pass = warnings.length === 0;
    const validationResult = {
      blocking: true,
      checkedBlockIds: context.upstreamBlocks.map((block) => block.id),
      checkedKeys: requiredKeys,
      failedCount: warnings.length,
      message: pass ? 'Required FAPI workflow inputs are present.' : warnings[0],
      missingItems: warnings,
      missingRequiredKeys,
      pass,
      status: pass ? 'pass' : 'fail',
    };

    return completeResult({
      context,
      evidenceRefs: collectEvidence(context),
      logs: [
        makeLog({
          blockId: context.block.id,
          level: warnings.length > 0 ? 'warning' : 'info',
          message: 'Required input check completed.',
        }),
      ],
      output: {
        blocking: true,
        missingItems: warnings,
        missingRequiredKeys,
        pass,
        checkedBlockIds: context.upstreamBlocks.map((block) => block.id),
        requiredInputResult: validationResult,
        required_input_result: validationResult,
        validationResult,
        validation_result: validationResult,
      },
      sourceTrace: collectSourceTrace(context),
      status: pass ? 'success' : 'needs_review',
      warnings,
    });
  },
  family: 'Review / Validation',
  inputRoles: [REVIEW_FINDINGS_INPUT_ROLE],
  inputSchema: getToolInputSchema([{ key: 'upstream', type: 'object' }]),
  outputRoles: [
    VALIDATION_RESULT_OUTPUT_ROLE,
    {
      ...REVIEW_STATUS_OUTPUT_ROLE,
      outputKey: 'pass',
      samplePreview: true,
    },
  ],
  outputSchema: getToolOutputSchema([{ key: 'pass', type: 'boolean' }]),
  runMode: 'local_mock',
  subtype: 'Required Input Check',
  toolGroup: 'review',
  toolId: 'review.required_input_check',
};
