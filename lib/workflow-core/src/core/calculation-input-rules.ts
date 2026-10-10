import type {
  WorkflowBlock,
  WorkflowDefinition,
} from '@workspace/workflow-contracts/domain/workflow-types';
import type { CalculationInputRule } from './calculation-inputs';
import type { CalculationInputSource } from './calculation-input-resolution';
import { getToolIdForBlock } from './tool-resolution';

/** This projects configured dependencies for readiness, never supplies executable rules. */
function configuredRules(value: unknown): CalculationInputRule[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const rule = item as Record<string, unknown>;
    const string = (value: unknown) =>
      typeof value === 'string' && value.trim() ? value.trim() : undefined;
    const id = string(rule.calculationId) ?? string(rule.nodeId) ?? string(rule.id);
    if (!id) return [];
    const resultKey = string(rule.resultKey) ?? string(rule.resultName) ?? id;
    const operands = Array.isArray(rule.operands)
      ? rule.operands
      : typeof rule.operands === 'string'
        ? rule.operands.split(/[,;\n|]/)
        : [];
    return [
      {
        resultKey,
        label: string(rule.label),
        unit: string(rule.unit),
        operation: string(rule.operation),
        formulaExpression: string(rule.formulaExpression) ?? string(rule.expression),
        operands: operands.flatMap<string | number>((value: unknown) => {
          if (typeof value === 'number') return Number.isFinite(value) ? [value] : [];
          if (typeof value !== 'string' || !value.trim()) return [];
          return [Number.isFinite(Number(value)) ? Number(value) : value.trim()];
        }),
      },
    ];
  });
}

/** Project the same inline/external precedence used by the calculation executor. */
export function effectiveCalculationInputRules(
  block: WorkflowBlock,
  definition?: Pick<WorkflowDefinition, 'blocks' | 'edges'>,
  sources: readonly CalculationInputSource[] = [],
): CalculationInputRule[] {
  const config = block.config;
  const incoming = new Set(
    definition?.edges
      .filter((edge) => edge.status === 'active' && edge.targetBlockId === block.id)
      .map((edge) => edge.sourceBlockId) ?? [],
  );
  const external = (definition?.blocks ?? [])
    .filter(
      (source) =>
        incoming.has(source.id) && getToolIdForBlock(source) === 'source.calculation_rules',
    )
    .flatMap((source) => {
      const result = sources.find(
        (item) =>
          item.blockId === source.id &&
          (!item.status || ['success', 'warning'].includes(item.status)),
      );
      // A recorded rule structure remains useful for the form while its source
      // reruns. This is metadata only: numeric resolution still excludes stale
      // captures, and the source remains an execution prerequisite.
      const output =
        result?.output && typeof result.output === 'object'
          ? (result.output as Record<string, unknown>)
          : undefined;
      const rules = output ?? source.config;
      return configuredRules(
        rules.calculationRules ?? rules.calculation_rules ?? rules.rules ?? rules.nodes,
      );
    });
  const inline = configuredRules(
    config.formulas ?? config.calculationRules ?? config.inlineFormulas,
  );
  return config.mode === 'inline'
    ? inline
    : config.mode === 'external_rules' || external.length
      ? external
      : inline;
}
