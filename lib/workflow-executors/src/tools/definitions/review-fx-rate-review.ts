import { type ToolDefinition } from '../types';
import {
  getFxRateReviewDraft,
  getFxRateReviewWarnings,
  getFxRateReviewOutput,
} from '../arithmetic';
import { completeResult, makeLog } from '../primitives';
import { collectEvidence, collectSourceTrace } from '../rows';
import {
  VALUE_TO_APPROVE_INPUT_ROLE,
  getToolInputSchema,
  REVIEWED_EXCHANGE_RATE_OUTPUT_ROLE,
  APPROVAL_STATUS_OUTPUT_ROLE,
  VALIDATION_RESULT_OUTPUT_ROLE,
  getToolOutputSchema,
} from '../ports';

export const reviewFxRateReviewTool: ToolDefinition = {
  defaultConfig: {
    approved: true,
    overrideRate: undefined,
    overrideReason: '',
    reviewer: 'fx-reviewer',
    useOverride: false,
  },
  description:
    'Reviews a source FX rate and optionally emits a reviewer override downstream without mutating the source.',
  displayName: 'FX Rate Review',
  execute: (context) => {
    const draft = getFxRateReviewDraft(context);
    const warnings = getFxRateReviewWarnings(draft);
    const pass = warnings.length === 0;
    const { approvalStatus, exchangeRateInfo, reviewedRate, validationResult } =
      getFxRateReviewOutput({ context, pass, warnings });

    return completeResult({
      context,
      evidenceRefs: collectEvidence(context),
      logs: [
        makeLog({
          blockId: context.block.id,
          details: exchangeRateInfo,
          level: pass ? 'info' : 'warning',
          message: 'FX rate review completed.',
        }),
      ],
      output: {
        approved: pass,
        approvalStatus,
        approval_status: approvalStatus,
        exchangeRateInfo,
        fapiInputs: { fxRate: reviewedRate },
        reviewedExchangeRate: exchangeRateInfo,
        validationResult,
        validation_result: validationResult,
        value: reviewedRate,
      },
      sourceTrace: collectSourceTrace(context),
      status: pass ? 'success' : 'needs_review',
      warnings,
    });
  },
  family: 'Review / Validation',
  inputRoles: [VALUE_TO_APPROVE_INPUT_ROLE],
  inputSchema: getToolInputSchema([{ key: 'exchangeRate', required: true, type: 'object' }]),
  outputRoles: [
    REVIEWED_EXCHANGE_RATE_OUTPUT_ROLE,
    {
      canRouteToFamilies: ['Logic', 'Protected', 'Output'],
      description: 'Reviewed FX rate as calculator input.',
      id: 'fapi_inputs',
      label: 'Reviewed FAPI inputs',
      outputKey: 'fapiInputs',
      outputType: 'fapi_inputs',
      samplePreview: 'fxRate 1.35',
    },
    APPROVAL_STATUS_OUTPUT_ROLE,
    VALIDATION_RESULT_OUTPUT_ROLE,
  ],
  outputSchema: getToolOutputSchema([
    { key: 'exchangeRateInfo', type: 'object' },
    { key: 'fapiInputs', type: 'object' },
    { key: 'validationResult', type: 'object' },
  ]),
  runMode: 'local_mock',
  subtype: 'Manual Override Review',
  toolGroup: 'review',
  toolId: 'review.fx_rate_review',
};
