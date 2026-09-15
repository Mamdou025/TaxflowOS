import { isGovernedValueBlock } from '@workspace/workflow-executors/domain/workflow/protected-rules';
import { type ToolDefinition } from '../types';
import {
  collectRowsByOutputKey,
  isDualResultMappingWorkflow,
  buildExpandedCanonicalJson,
  buildZCanonicalJson,
  buildGenericCanonicalJson,
  buildSingleItemPipelineTrace,
} from '../output-evidence';
import {
  findProtectedResult,
  getProtectedResults,
  findValidationResult,
  findApprovalStatus,
  getOutputFinalitySummary,
  dedupeStrings,
  withCanonicalFinality,
} from '../finality';
import { asRecord, completeResult, makeLog } from '../primitives';
import { collectEvidence, collectSourceTrace } from '../rows';
import {
  PROTECTED_RESULT_INPUT_ROLE,
  MAPPED_ROWS_INPUT_ROLE,
  REVIEW_FINDINGS_INPUT_ROLE,
  SOURCE_TRACE_INPUT_ROLE,
  PROTECTED_VALUES_INPUT_ROLE,
  getToolInputSchema,
  OUTPUT_PACKAGE_ROLE,
  getToolOutputSchema,
} from '../ports';

export const outputCanonicalJsonTool: ToolDefinition = {
  defaultConfig: {},
  description: 'Creates a local canonical JSON package.',
  displayName: 'Canonical JSON',
  execute: (context) => {
    const allResults = Object.values(context.allResults);
    const sourceResults = allResults.filter((result) => {
      const block = context.workflow.blocks.find((item) => item.id === result.blockId);
      return block?.family !== 'Output';
    });
    const protectedValues = sourceResults
      .filter((result) => {
        const block = context.workflow.blocks.find((item) => item.id === result.blockId);
        return isGovernedValueBlock(block);
      })
      .map((result) => ({
        blockId: result.blockId,
        value: result.output.governedValue,
        runtimeLocked: result.output.runtimeLocked,
      }));
    const candidateLogicOutputs = sourceResults
      .filter((result) => {
        const block = context.workflow.blocks.find((item) => item.id === result.blockId);
        return block?.family === 'Logic';
      })
      .map((result) => ({ blockId: result.blockId, output: result.output }));
    const reviewResults = sourceResults
      .filter((result) => {
        const block = context.workflow.blocks.find((item) => item.id === result.blockId);
        return block?.family === 'Review / Validation';
      })
      .map((result) => ({ blockId: result.blockId, output: result.output }));
    const mappedRows = sourceResults.flatMap((result) =>
      Array.isArray(result.output.mappedRows) ? result.output.mappedRows : [],
    );
    const mappedFiscalRows = collectRowsByOutputKey(sourceResults, 'mappedRows');
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
    const expandedCanonicalJson = isDualResultMappingWorkflow(context.workflow.name)
      ? buildExpandedCanonicalJson({
          context,
          keywordRulesUsed,
          lowConfidenceRows,
          mappedRows: mappedFiscalRows,
          protectedResults,
          results: sourceResults,
          unmatchedRows,
        })
      : null;
    const zCanonicalJson =
      protectedResult?.name === 'Z'
        ? buildZCanonicalJson({
            approvalStatus,
            context,
            mappedRows,
            protectedResult,
            ruleUsed: asRecord(keywordRulesUsed[0]) || undefined,
            validationResult,
          })
        : null;
    const genericCanonicalJson =
      expandedCanonicalJson || zCanonicalJson
        ? null
        : buildGenericCanonicalJson({
            context,
            lowConfidenceRows,
            mappedRows: mappedFiscalRows,
            protectedResults,
            results: sourceResults,
            unmatchedRows,
          });
    const protectedNeedsReview = protectedValues.some((value) => value.runtimeLocked !== true);
    const warnings = dedupeStrings([
      ...sourceResults.flatMap((result) => result.warnings),
      finalitySummary.finalityStatus !== 'final' || protectedNeedsReview
        ? 'Output preview includes results that still need review.'
        : '',
    ]);
    const canonicalPayload: Record<string, unknown> = {};
    if (expandedCanonicalJson) {
      canonicalPayload.canonicalJson = withCanonicalFinality(
        expandedCanonicalJson,
        finalitySummary,
      );
      canonicalPayload.canonical_json = canonicalPayload.canonicalJson;
      canonicalPayload.pipelineTrace = expandedCanonicalJson.trace;
    } else if (zCanonicalJson) {
      canonicalPayload.canonicalJson = withCanonicalFinality(zCanonicalJson, finalitySummary);
      canonicalPayload.canonical_json = canonicalPayload.canonicalJson;
      canonicalPayload.pipelineTrace = buildSingleItemPipelineTrace();
    } else if (genericCanonicalJson) {
      canonicalPayload.canonicalJson = withCanonicalFinality(genericCanonicalJson, finalitySummary);
      canonicalPayload.canonical_json = canonicalPayload.canonicalJson;
      canonicalPayload.pipelineTrace = genericCanonicalJson.trace;
    }

    return completeResult({
      context,
      evidenceRefs: collectEvidence(context),
      logs: [
        makeLog({
          blockId: context.block.id,
          details: { protectedValues: protectedValues.length },
          message: 'Canonical JSON package generated locally.',
        }),
      ],
      output: {
        ...canonicalPayload,
        blockingIssues: finalitySummary.blockingIssues,
        candidateLogicOutputs,
        finalityStatus: finalitySummary.finalityStatus,
        generatedAt: new Date().toISOString(),
        keywordRulesUsed,
        mappedRows,
        nonBlockingWarnings: finalitySummary.nonBlockingWarnings,
        outputFinality: finalitySummary.finalityStatus,
        protectedValues,
        protectedResult,
        protectedResults,
        protectedResultsFinality: finalitySummary.protectedResultsFinality,
        reviewResults,
        reviewerOverrides: finalitySummary.reviewerOverrides,
        runId: context.runId,
        sourceTrace: collectSourceTrace(context),
        validationSummary: finalitySummary.validationSummary,
        warnings,
        workflowId: context.workflow.id,
        workflowName: context.workflow.name,
      },
      sourceTrace: collectSourceTrace(context),
      status: protectedNeedsReview || warnings.length > 0 ? 'warning' : 'success',
      warnings,
    });
  },
  family: 'Output',
  inputRoles: [
    PROTECTED_RESULT_INPUT_ROLE,
    MAPPED_ROWS_INPUT_ROLE,
    REVIEW_FINDINGS_INPUT_ROLE,
    SOURCE_TRACE_INPUT_ROLE,
    PROTECTED_VALUES_INPUT_ROLE,
  ],
  inputSchema: getToolInputSchema([{ key: 'protectedValues', type: 'array' }]),
  outputRoles: [
    {
      ...OUTPUT_PACKAGE_ROLE,
      id: 'canonical_json',
      label: 'Canonical JSON',
      outputKey: 'canonicalJson',
      outputType: 'canonical_json',
    },
  ],
  outputSchema: getToolOutputSchema([{ key: 'protectedValues', type: 'array' }]),
  runMode: 'local_mock',
  subtype: 'Canonical JSON',
  toolGroup: 'output',
  toolId: 'output.canonical_json',
};
