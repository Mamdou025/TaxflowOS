import type { WorkflowBlock } from '@/shared/workflow-engine/workflow/contracts';
import type { WorkflowEdge, WorkflowNode } from '@/shared/workflow-engine/state/workflow-store';
import { numericOutputFields } from '@/shared/workflow-engine/calculation-values';
import { collectCalculationRulesFromBackendInput } from '@workspace/workflow-executors/execution/blocks/logic/calculation-engine/schema';

export function isCalculationInputRuleSource(block: WorkflowBlock) {
  return (
    block.config.toolId === 'source.calculation_rules' ||
    block.config.sourceKind === 'calculation_rules' ||
    block.catalogId === 'source:calculation-rules' ||
    block.subtype === 'Calculation Rules'
  );
}

function configuredRules(config: Record<string, unknown>) {
  const value = config.formulas ?? config.calculationRules ?? config.inlineFormulas ?? config;
  return collectCalculationRulesFromBackendInput(value);
}

export function selectCalculationInputRules(block: WorkflowBlock, ruleSources: WorkflowBlock[]) {
  const inline = configuredRules(block.config);
  if (block.config.mode === 'inline') return inline;
  const external = ruleSources.flatMap((source) => configuredRules(source.config));
  return block.config.mode === 'external_rules' || external.length ? external : inline;
}

/** The editor follows the engine's inline/external choice without changing its rules. */
export function calculationInputRules(
  block: WorkflowBlock,
  edges: WorkflowEdge[],
  nodes: WorkflowNode[],
) {
  const sources = edges
    .filter(
      (edge) =>
        edge.target === block.id &&
        edge.data?.workflowEdge?.status !== 'disabled' &&
        edge.data?.status !== 'disabled' &&
        ((edge.data?.workflowEdge?.targetInputRole ?? edge.data?.targetInputRole) ===
          'calculation_rules' ||
          isCalculationInputRuleSource(
            nodes.find((node) => node.id === edge.source)?.data.block ?? block,
          )),
    )
    .flatMap((edge) => {
      const source = nodes.find((node) => node.id === edge.source)?.data.block;
      return source ? [source] : [];
    });
  return selectCalculationInputRules(block, sources);
}

/** Declared API fields can be bound before fetching; values still require a real capture. */
export function calculationSourceFields(block: WorkflowBlock, output: unknown) {
  const fields = new Map(
    numericOutputFields(output).map((field) => [JSON.stringify(field.path), field.path]),
  );
  if (block.config.outputMode === 'values' && Array.isArray(block.config.outputMappings)) {
    for (const mapping of block.config.outputMappings) {
      if (
        !mapping ||
        typeof mapping !== 'object' ||
        mapping.type !== 'number' ||
        typeof mapping.name !== 'string'
      )
        continue;
      const path = ['namedValues', mapping.name];
      fields.set(JSON.stringify(path), path);
    }
  }
  return [...fields.values()];
}
