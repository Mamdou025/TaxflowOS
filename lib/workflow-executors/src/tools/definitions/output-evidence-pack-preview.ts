import { isGovernedValueBlock } from '@workspace/workflow-executors/domain/workflow/protected-rules';
import { type ToolDefinition } from '../types';
import {
  dedupeStrings,
  findProtectedResult,
  getProtectedResults,
  findValidationResult,
  findApprovalStatus,
  getOutputFinalitySummary,
  buildFinalityPreviewHeader,
} from '../finality';
import {
  collectRowsByOutputKey,
  isDualResultMappingWorkflow,
  buildExpandedEvidencePreview,
  getAggregationRuleCount,
  getExpandedWarnings,
  buildZEvidencePreview,
  buildGenericEvidencePreview,
  getDualResultPipelineTrace,
  buildSingleItemPipelineTrace,
} from '../output-evidence';
import { asRecord, completeResult, makeLog } from '../primitives';
import { collectEvidence, collectRows, collectSourceTrace } from '../rows';
import {
  PROTECTED_RESULT_INPUT_ROLE,
  MAPPED_ROWS_INPUT_ROLE,
  VALIDATION_RESULT_INPUT_ROLE,
  APPROVAL_STATUS_INPUT_ROLE,
  REVIEW_FINDINGS_INPUT_ROLE,
  PROTECTED_VALUES_INPUT_ROLE,
  getToolInputSchema,
  OUTPUT_PACKAGE_ROLE,
  getToolOutputSchema,
} from '../ports';

export const outputEvidencePackPreviewTool: ToolDefinition = {
  defaultConfig: {},
  description: 'Creates a local evidence pack preview payload.',
  displayName: 'Evidence Pack Preview',
  execute: (context) => {
    const allResults = Object.values(context.allResults);
    const sourceResults = allResults.filter((result) => {
      const block = context.workflow.blocks.find((item) => item.id === result.blockId);
      return block?.family !== 'Output';
    });
    const warnings = dedupeStrings(sourceResults.flatMap((result) => result.warnings));
    const protectedValues = sourceResults
      .filter((result) => {
        const block = context.workflow.blocks.find((item) => item.id === result.blockId);
        return isGovernedValueBlock(block);
      })
      .map((result) => ({
        blockId: result.blockId,
        runtimeLocked: result.output.runtimeLocked,
        value: result.output.governedValue,
      }));
    const formulas = sourceResults.map((result) => result.output.formulaTrace).filter(Boolean);
    const reviewDecisions = sourceResults
      .filter((result) => Object.hasOwn(result.output, 'approved'))
      .map((result) => result.output);
    const mappedRows = sourceResults.flatMap((result) =>
      Array.isArray(result.output.mappedRows) ? result.output.mappedRows : [],
    );
    const mappedFiscalRows = collectRowsByOutputKey(sourceResults, 'mappedRows');
    const sourceRows = collectRowsByOutputKey(sourceResults, 'rows');
    const lowConfidenceRows = collectRowsByOutputKey(sourceResults, 'lowConfidenceRows');
    const unmatchedRows = collectRowsByOutputKey(sourceResults, 'unmatchedRows');
    const keywordRulesUsed = sourceResults.flatMap((result) =>
      Array.isArray(result.output.rulesUsed) ? result.output.rulesUsed : [],
    );
    const protectedResult = findProtectedResult(sourceResults);
    const protectedResults = getProtectedResults(sourceResults);
    const validationResult = findValidationResult(sourceResults);
    const approvalStatus = findApprovalStatus(sourceResults);
    const finalitySummary = getOutputFinalitySummary({
      protectedResults,
      results: sourceResults,
      workflow: context.workflow,
    });
    const expandedPreview = isDualResultMappingWorkflow(context.workflow.name)
      ? buildExpandedEvidencePreview({
          aggregationRuleCount: getAggregationRuleCount(sourceResults),
          keywordRuleCount: keywordRulesUsed.length,
          mappedRows: mappedFiscalRows,
          protectedResults,
          results: sourceResults,
          sourceRows,
          sourceWarnings: getExpandedWarnings({
            lowConfidenceRows,
            unmatchedRows,
          }),
          workflowName: context.workflow.name,
        })
      : null;
    const zPreview =
      protectedResult?.name === 'Z'
        ? buildZEvidencePreview({
            approvalStatus,
            mappedRows,
            protectedResult,
            ruleUsed: asRecord(keywordRulesUsed[0]) || undefined,
            validationResult,
          })
        : null;
    const genericPreview =
      expandedPreview || zPreview
        ? null
        : buildGenericEvidencePreview({
            mappedRows: mappedFiscalRows,
            protectedResults,
            results: sourceResults,
            sourceRows,
            warnings,
            workflowName: context.workflow.name,
          });
    const protectedNeedsReview = protectedValues.some((value) => value.runtimeLocked !== true);
    const outputWarnings = dedupeStrings([
      ...warnings,
      finalitySummary.finalityStatus !== 'final' || protectedNeedsReview
        ? 'Output preview includes results that still need review.'
        : '',
    ]);
    let pipelineTrace: string[] | undefined;
    if (isDualResultMappingWorkflow(context.workflow.name)) {
      const zTrace = getDualResultPipelineTrace(context.workflow.name, 'Z');
      pipelineTrace = [
        ...zTrace,
        ...getDualResultPipelineTrace(context.workflow.name, 'W').filter(
          (step) => !zTrace.includes(step),
        ),
      ];
    } else if (protectedResult?.name === 'Z') {
      pipelineTrace = buildSingleItemPipelineTrace();
    }

    return completeResult({
      context,
      evidenceRefs: collectEvidence(context),
      logs: [
        makeLog({
          blockId: context.block.id,
          message: 'Evidence pack preview generated locally.',
        }),
      ],
      output: {
        blockingIssues: finalitySummary.blockingIssues,
        finalityStatus: finalitySummary.finalityStatus,
        formulas,
        keywordRulesUsed,
        mappedRows,
        nonBlockingWarnings: finalitySummary.nonBlockingWarnings,
        outputFinality: finalitySummary.finalityStatus,
        pipelineTrace,
        preview: [
          buildFinalityPreviewHeader(finalitySummary),
          '',
          expandedPreview || zPreview || genericPreview || `Workflow: ${context.workflow.name}`,
        ].join('\n'),
        protectedValues,
        protectedResult,
        protectedResults,
        protectedResultsFinality: finalitySummary.protectedResultsFinality,
        reviewDecisions,
        reviewerOverrides: finalitySummary.reviewerOverrides,
        sourceRows: collectRows(context),
        sourceTrace: collectSourceTrace(context),
        validationSummary: finalitySummary.validationSummary,
        warnings: outputWarnings,
      },
      sourceTrace: collectSourceTrace(context),
      status: protectedNeedsReview || outputWarnings.length > 0 ? 'warning' : 'success',
      warnings: outputWarnings,
    });
  },
  family: 'Output',
  inputRoles: [
    PROTECTED_RESULT_INPUT_ROLE,
    MAPPED_ROWS_INPUT_ROLE,
    VALIDATION_RESULT_INPUT_ROLE,
    APPROVAL_STATUS_INPUT_ROLE,
    REVIEW_FINDINGS_INPUT_ROLE,
    PROTECTED_VALUES_INPUT_ROLE,
  ],
  inputSchema: getToolInputSchema([{ key: 'workflowRun', type: 'object' }]),
  outputRoles: [
    {
      ...OUTPUT_PACKAGE_ROLE,
      outputKey: 'preview',
    },
  ],
  outputSchema: getToolOutputSchema([{ key: 'preview', type: 'string' }]),
  runMode: 'local_mock',
  subtype: 'Evidence Pack',
  toolGroup: 'output',
  toolId: 'output.evidence_pack_preview',
};
