import type {
  WorkflowBlock,
  WorkflowDefinition,
} from '@workspace/workflow-contracts/domain/workflow-types';
import type { WorkflowSession } from '@workspace/workflow-contracts/library-types';
import type { CalculationInputChoices } from '@workspace/workflow-contracts/domain/calculation-inputs';
import { getToolIdForBlock } from '@workspace/workflow-core/tool-resolution';
import {
  effectiveCalculationInputRules,
  inferCalculationInputs,
} from '@workspace/workflow-core/calculation-inputs';
import {
  calculationInputHistory,
  calculationSourcesForBlock,
} from '@workspace/workflow-core/sessions';
import {
  calculationInputOptionsFromOutputs,
  describeCalculationInputs,
  numericOutputFields,
} from '@workspace/workflow-executors/calculation-inputs';
import { calculationSourceFields } from '@/features/workflow-builder/ui/logic-viewers/calculation-variable-model';

export type CalculationFormSource = {
  block: WorkflowBlock;
  output?: unknown;
  capturedAt?: string;
  fields: string[][];
};

export type CalculationSourceOption = { value: string; label: string };

/** Prepared once for a captured source set, shared by every variable in this calculation. */
export function calculationFormSourceOptions(
  sources: readonly CalculationFormSource[],
): CalculationSourceOption[] {
  return sources.flatMap((source) => {
    const available = new Set(
      numericOutputFields(source.output).map((field) => JSON.stringify(field.path)),
    );
    return source.fields.map((path) => ({
      value: JSON.stringify({ kind: 'source', blockId: source.block.id, path }),
      label: `${source.block.label} → ${path.join('.') || 'value'} — ${available.has(JSON.stringify(path)) ? 'available' : 'run source to get value'}`,
    }));
  });
}

/** Form projection only. Retired choices leave stored history when the user deliberately applies. */
export function calculationInputChoices(
  config: WorkflowBlock['config'],
  names?: readonly string[],
): CalculationInputChoices {
  const choices =
    config.inputChoices &&
    typeof config.inputChoices === 'object' &&
    !Array.isArray(config.inputChoices)
      ? (config.inputChoices as CalculationInputChoices)
      : {};
  return names
    ? Object.fromEntries(Object.entries(choices).filter(([name]) => names.includes(name)))
    : choices;
}

/** Only current direct predecessors may supply a run value. Declared fields need a capture. */
export function calculationFormSources(
  definition: Pick<WorkflowDefinition, 'blocks' | 'edges'>,
  session: Pick<WorkflowSession, 'results' | 'stale'>,
  blockId: string,
): CalculationFormSource[] {
  const incoming = new Set(
    definition.edges
      .filter((edge) => edge.status === 'active' && edge.targetBlockId === blockId)
      .map((edge) => edge.sourceBlockId),
  );
  return [...incoming]
    .flatMap((id) => {
      const source = definition.blocks.find((block) => block.id === id);
      return source ? [source] : [];
    })
    .map((block) => {
      const result = session.results[block.id];
      const current =
        result &&
        !session.stale.includes(block.id) &&
        ['success', 'warning'].includes(result.status);
      const output = current ? result.output : undefined;
      return {
        block,
        output,
        capturedAt: current ? result.completedAt : undefined,
        fields: calculationSourceFields(block, output),
      };
    });
}

/** Source revisions matter even when a replacement yields the same numeric value. */
export function sessionInputSourceIdentity(
  blockId: string,
  sourceIds: readonly string[],
  session: Pick<WorkflowSession, 'sources' | 'results' | 'stale' | 'attempts' | 'inputOverrides'>,
) {
  const ids = new Set([blockId, ...sourceIds]);
  return JSON.stringify({
    sources: session.sources
      .filter((source) => ids.has(source.blockId))
      .map((source) => [
        source.blockId,
        source.id,
        source.at,
        source.mode,
        source.extraction?.revision,
        source.extraction?.contentHash,
      ]),
    predecessors: sourceIds.map((id) => {
      const result = session.results[id];
      const attempt = session.attempts.findLast((item) => item.blockId === id);
      return [
        id,
        session.inputOverrides?.[id],
        session.stale.includes(id),
        result?.status,
        result?.runId,
        result?.startedAt,
        result?.completedAt,
        result?.sourceTrace,
        attempt?.at,
        attempt?.revision,
      ];
    }),
  });
}

/** A live projection of calculation requirements, without copying definitions onto Trigger. */
export function workflowRequiredInputs(
  definition: Pick<WorkflowDefinition, 'blocks' | 'edges'>,
  session: Pick<WorkflowSession, 'results' | 'stale'> & Partial<Pick<WorkflowSession, 'attempts'>>,
) {
  return definition.blocks
    .filter(
      (block) =>
        block.family === 'Logic' && getToolIdForBlock(block) === 'logic.calculation_engine',
    )
    .map((block) => {
      const sources = calculationFormSources(definition, session, block.id);
      const outputs = sources.flatMap((source) =>
        source.output === undefined ? [] : [{ blockId: source.block.id, output: source.output }],
      );
      const rules = effectiveCalculationInputRules(
        block,
        definition,
        calculationSourcesForBlock(
          block,
          definition,
          session.results,
          session.stale,
          calculationInputHistory({ attempts: session.attempts ?? [] }),
        ),
      );
      const names = inferCalculationInputs(rules);
      const inputOptions = calculationInputOptionsFromOutputs(outputs);
      return {
        blockId: block.id,
        label: block.label,
        rules,
        sources,
        inputOptions,
        sourceOptions: calculationFormSourceOptions(sources),
        retiredChoices: Object.keys(calculationInputChoices(block.config)).filter(
          (name) => !names.includes(name),
        ),
        requirements: describeCalculationInputs(rules, block.config, inputOptions),
      };
    });
}

export type WorkflowCalculationGroup = ReturnType<typeof workflowRequiredInputs>[number];
