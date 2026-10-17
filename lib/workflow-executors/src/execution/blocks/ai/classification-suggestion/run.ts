import { error, info, warning } from '../../../runtime/events';
import type { ToolExecutionContext, ToolRunResult } from '../../../runtime/types';
import {
  collectClassifiableRows,
  parseAiClassificationConfig,
  type AiMappingSuggestion,
} from './schema';

function getRoleInputs(context: ToolExecutionContext, role: string) {
  return context.inputsByRole[role] || [];
}

// Read from both roles — see definition.ts's note on why they're named to match
// the upstream Keyword Mapper's own output role ids instead of a generic "rows".
function getRows(context: ToolExecutionContext) {
  return [
    ...getRoleInputs(context, 'unmatched_rows').flatMap((input) => collectClassifiableRows(input)),
    ...getRoleInputs(context, 'low_confidence_rows').flatMap((input) =>
      collectClassifiableRows(input),
    ),
  ];
}

function isRowsRoleConnected(context: ToolExecutionContext) {
  return (
    context.inputsByRole.unmatched_rows !== undefined ||
    context.inputsByRole.low_confidence_rows !== undefined
  );
}

function createErrorResult({
  context,
  errors,
}: {
  context: ToolExecutionContext;
  errors: string[];
}): ToolRunResult {
  return {
    blockId: context.block.id,
    completedAt: new Date().toISOString(),
    errors,
    evidenceRefs: [],
    logs: errors.map((message) => error(message)),
    outputs: {
      suggestions: {
        accepted: false,
        authoritative: false,
        suggestions: [],
      },
    },
    primaryOutputRole: 'suggestions',
    runId: context.runId,
    sourceTrace: [],
    startedAt: context.startedAt,
    status: 'error',
    toolId: 'ai.classification_suggestion',
    warnings: [],
  };
}

export function runClassificationSuggestion(context: ToolExecutionContext): ToolRunResult {
  const rowsRoleConnected = isRowsRoleConnected(context);
  const rows = getRows(context);
  const config = parseAiClassificationConfig(context.config);

  if (!rowsRoleConnected) {
    return createErrorResult({
      context,
      errors: [
        'AI Mapping Suggestion needs an Unmatched rows or Low-confidence rows input, connected from a Keyword Mapper.',
      ],
    });
  }

  // The role IS connected but produced nothing to review this run — the Keyword
  // Mapper classified every row within its confidence threshold. That is a
  // successful outcome, not an error: this block had nothing to do, same as a
  // Review/Validation gate that passes because there was nothing to flag.
  if (rows.length === 0) {
    return {
      blockId: context.block.id,
      completedAt: new Date().toISOString(),
      errors: [],
      evidenceRefs: [],
      logs: [
        info(
          'No rows needed AI review — the Keyword Mapper classified everything within its configured confidence threshold.',
        ),
      ],
      outputs: {
        suggestions: {
          accepted: true,
          authoritative: true,
          highConfidenceCount: 0,
          highConfidenceSuggestions: [],
          lowConfidenceCount: 0,
          lowConfidenceSuggestions: [],
          rowCount: 0,
          suggestions: [],
          uncoveredRowCount: 0,
        },
      },
      primaryOutputRole: 'suggestions',
      runId: context.runId,
      sourceTrace: [],
      startedAt: context.startedAt,
      status: 'success',
      toolId: 'ai.classification_suggestion',
      warnings: [],
    };
  }

  if (!config.proposal) {
    const message =
      'No AI suggestions are pinned to this block. Generate suggestions in the block panel, or remove the block — the run produced none rather than inventing one.';
    return {
      blockId: context.block.id,
      completedAt: new Date().toISOString(),
      errors: [],
      evidenceRefs: [],
      logs: [warning(message)],
      outputs: {
        suggestions: {
          accepted: false,
          authoritative: false,
          rowCount: rows.length,
          suggestions: [],
        },
      },
      primaryOutputRole: 'suggestions',
      runId: context.runId,
      sourceTrace: [],
      startedAt: context.startedAt,
      status: 'warning',
      toolId: 'ai.classification_suggestion',
      warnings: [message],
    };
  }

  const accepted = config.proposalAccepted === true;
  const rowIds = new Set(rows.map((row) => row.rowId));
  const suggestions = config.proposal.suggestions;
  const stale = suggestions.filter((suggestion) => !rowIds.has(suggestion.rowRef));
  const highConfidence = suggestions.filter((s) => s.confidence >= config.confidenceThreshold);
  const lowConfidence = suggestions.filter((s) => s.confidence < config.confidenceThreshold);

  const warnings = [
    !accepted
      ? 'These AI suggestions have not been accepted by a reviewer. They carry no authority and must not be used as a final mapping.'
      : '',
    stale.length > 0
      ? `${stale.length} pinned suggestion(s) reference a row no longer present in the connected input — regenerate suggestions.`
      : '',
  ].filter(Boolean);

  const byRow = new Map<string, AiMappingSuggestion>(suggestions.map((s) => [s.rowRef, s]));

  return {
    blockId: context.block.id,
    completedAt: new Date().toISOString(),
    confidence:
      suggestions.length > 0
        ? suggestions.reduce((total, s) => total + s.confidence, 0) / suggestions.length
        : undefined,
    errors: [],
    evidenceRefs: [],
    logs: [
      warnings.length > 0
        ? warning('AI mapping suggestions replayed — review findings apply.', {
            highConfidenceCount: highConfidence.length,
            lowConfidenceCount: lowConfidence.length,
            staleCount: stale.length,
          })
        : info('AI mapping suggestions replayed (accepted by a reviewer).', {
            model: config.proposal.model,
            suggestionCount: suggestions.length,
          }),
    ],
    outputs: {
      suggestions: {
        accepted,
        acceptedAt: config.proposalAcceptedAt ?? null,
        // The governance signal downstream blocks read — never authoritative until accepted.
        authoritative: accepted,
        generatedAt: config.proposal.generatedAt,
        highConfidenceCount: highConfidence.length,
        highConfidenceSuggestions: highConfidence,
        lowConfidenceCount: lowConfidence.length,
        lowConfidenceSuggestions: lowConfidence,
        model: config.proposal.model,
        rowCount: rows.length,
        // Rows with no suggestion at all (model returned fewer than the input rows).
        uncoveredRowCount: rows.filter((row) => !byRow.has(row.rowId)).length,
        suggestions,
      },
    },
    primaryOutputRole: 'suggestions',
    runId: context.runId,
    sourceTrace: [],
    startedAt: context.startedAt,
    status: !accepted ? 'needs_review' : warnings.length > 0 ? 'warning' : 'success',
    toolId: 'ai.classification_suggestion',
    warnings,
  };
}
