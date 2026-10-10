import type { CalculationInputDefinition } from '@workspace/workflow-contracts/domain/calculation-inputs';
import type {
  WorkflowBlock,
  WorkflowDefinition,
} from '@workspace/workflow-contracts/domain/workflow-types';
import type { ToolRunResult } from '@workspace/workflow-contracts/tool-types';
import type { WorkflowSession } from '@workspace/workflow-contracts/library-types';
import {
  inferCalculationInputs,
  effectiveCalculationInputRules,
  resolveCalculationInputs,
  calculationInputOptionsFromOutputs,
  isCalculationInputChoice,
  isSafeCalculationInputName,
  type CalculationInputSource,
} from '../core/calculation-inputs';
import { getToolIdForBlock } from '../core/tool-resolution';
import { WorkflowCommandError } from './commands';

export function isCalculationInputBlock(block: WorkflowBlock) {
  return block.family === 'Logic' && getToolIdForBlock(block) === 'logic.calculation_engine';
}

export function manualCalculationInputs(block: WorkflowBlock): CalculationInputDefinition[] {
  if (!isCalculationInputBlock(block) || !Array.isArray(block.config.inputDefinitions)) return [];
  return block.config.inputDefinitions.filter(
    (item): item is CalculationInputDefinition =>
      !!item &&
      typeof item === 'object' &&
      typeof item.name === 'string' &&
      !!item.name.trim() &&
      !['__proto__', 'constructor', 'prototype'].includes(item.name) &&
      item.type === 'number' &&
      item.binding?.kind === 'manual',
  );
}

/** Same requirements as execution, using only direct recorded predecessors. */
export function calculationSourcesForBlock(
  block: WorkflowBlock,
  definition: Pick<WorkflowDefinition, 'blocks' | 'edges'>,
  results: Record<string, ToolRunResult> = {},
  stale: readonly string[] = [],
  history: readonly ToolRunResult[] = [],
) {
  const incoming = new Set(
    definition.edges
      .filter((edge) => edge.status === 'active' && edge.targetBlockId === block.id)
      .map((edge) => edge.sourceBlockId),
  );
  return [...incoming].flatMap((blockId) => {
    const result = results[blockId];
    const source = definition.blocks.find((item) => item.id === blockId);
    if (
      source &&
      getToolIdForBlock(source) === 'source.calculation_rules' &&
      (!result || !['success', 'warning'].includes(result.status))
    ) {
      const recorded = [...history]
        .reverse()
        .find((item) => item.blockId === blockId && ['success', 'warning'].includes(item.status));
      if (recorded)
        return [{ blockId, output: recorded.output, status: recorded.status, stale: true }];
    }
    return result
      ? [{ blockId, output: result.output, status: result.status, stale: stale.includes(blockId) }]
      : [];
  });
}

export function calculationInputHistory(session?: Pick<WorkflowSession, 'attempts'>) {
  return session?.attempts.flatMap((attempt) => attempt.result.result.results) ?? [];
}

/** Accepted earlier rule structures keep persisted choices readable, never supply values. */
export function recordedCalculationInputNames(
  block: WorkflowBlock,
  definition: WorkflowDefinition,
  history: readonly ToolRunResult[],
) {
  if (!isCalculationInputBlock(block)) return [];
  return [
    ...new Set(
      history
        .filter((result) => ['success', 'warning'].includes(result.status))
        .flatMap((result) =>
          inferCalculationInputs(
            effectiveCalculationInputRules(block, definition, [
              {
                blockId: result.blockId,
                output: result.output,
                status: result.status,
                stale: true,
              },
            ]),
          ),
        ),
    ),
  ];
}

export function calculationInputState(
  block: WorkflowBlock,
  definition: WorkflowDefinition,
  results: Record<string, ToolRunResult> = {},
  stale: readonly string[] = [],
  history: readonly ToolRunResult[] = [],
) {
  const sources = calculationSourcesForBlock(block, definition, results, stale, history);
  const rules = effectiveCalculationInputRules(block, definition, sources);
  return resolveCalculationInputs(rules, block.config, calculationInputOptionsFromOutputs(sources));
}

export function hasMissingCalculationInputs(
  block: WorkflowBlock,
  definition: WorkflowDefinition,
  results: Record<string, ToolRunResult> = {},
  stale: readonly string[] = [],
  history: readonly ToolRunResult[] = [],
) {
  return (
    isCalculationInputBlock(block) &&
    calculationInputState(block, definition, results, stale, history).requirements.some(
      (input) => input.status !== 'provided',
    )
  );
}

export function validateCalculationInputChoices(
  block: WorkflowBlock,
  value: unknown,
  definition?: WorkflowDefinition,
  sources: readonly CalculationInputSource[] = [],
  acceptedHistoricalNames: readonly string[] = [],
) {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new WorkflowCommandError('INVALID_REQUEST', 'Supply calculation input choices as a map.');
  const names = new Set([
    ...inferCalculationInputs(effectiveCalculationInputRules(block, definition, sources)),
    ...acceptedHistoricalNames,
  ]);
  const incoming = new Set(
    definition?.edges
      .filter((edge) => edge.status === 'active' && edge.targetBlockId === block.id)
      .map((edge) => edge.sourceBlockId) ?? [],
  );
  for (const [name, choice] of Object.entries(value)) {
    if (!isSafeCalculationInputName(name) || !names.has(name))
      throw new WorkflowCommandError(
        'INVALID_REQUEST',
        'Only required external calculation variables can change during a run: ' + name + '.',
      );
    if (!isCalculationInputChoice(choice))
      throw new WorkflowCommandError(
        'INVALID_REQUEST',
        'Choose a finite manual number or a valid connected field for ' + name + '.',
      );
    if (
      choice.kind === 'source' &&
      (!incoming.has(choice.blockId) ||
        !definition?.blocks.some((source) => source.id === choice.blockId))
    )
      throw new WorkflowCommandError(
        'INVALID_REQUEST',
        'Choose a directly connected source for ' + name + '.',
      );
  }
}

export function validateCalculationInputValues(block: WorkflowBlock, value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new WorkflowCommandError(
      'INVALID_REQUEST',
      'Supply calculation input values as a number map.',
    );
  const names = new Set(manualCalculationInputs(block).map(({ name }) => name));
  for (const [name, supplied] of Object.entries(value)) {
    if (!names.has(name))
      throw new WorkflowCommandError(
        'INVALID_REQUEST',
        `Only declared manual variables can change during a run: ${name}.`,
      );
    if (typeof supplied !== 'number' || !Number.isFinite(supplied))
      throw new WorkflowCommandError(
        'INVALID_REQUEST',
        `${name} must be a finite number. Leave it empty instead of inventing a value.`,
      );
  }
}
