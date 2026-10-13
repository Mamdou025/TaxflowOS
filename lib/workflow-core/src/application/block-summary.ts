import type {
  WorkflowBlock,
  WorkflowDefinition,
} from '@workspace/workflow-contracts/domain/workflow-types';
import { getToolIdForBlock } from '../core/tool-resolution';
import { readWorksheetLines } from './field-worksheet';

type Definition = Pick<WorkflowDefinition, 'blocks' | 'edges'>;

function truncateList(items: string[], max: number): string {
  if (items.length <= max) return items.join(', ');
  return `${items.slice(0, max).join(', ')}, +${items.length - max} more`;
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
}

function describeCalculationEngine(block: WorkflowBlock): string {
  const config = block.config as Record<string, unknown>;
  const raw = config.formulas ?? config.calculationRules ?? config.inlineFormulas;
  const formulas = Array.isArray(raw)
    ? raw.filter(
        (item): item is Record<string, unknown> =>
          typeof item === 'object' && item !== null && typeof asRecord(item).resultKey === 'string',
      )
    : [];
  if (formulas.length === 0)
    return `${block.label} — a Calculation Engine with no formulas defined yet.`;
  const terms = formulas.map((formula) => {
    const resultKey = String(formula.resultKey);
    const expression =
      typeof formula.formulaExpression === 'string' && formula.formulaExpression.trim()
        ? formula.formulaExpression.trim()
        : undefined;
    return expression ? `${resultKey} = ${expression}` : resultKey;
  });
  return `${block.label} computes: ${truncateList(terms, 6)}.`;
}

function describeFieldBlock(block: WorkflowBlock, definition: Definition): string {
  const { declared, lines } = readWorksheetLines(block.config as Record<string, unknown>);
  if (!declared || lines.length === 0)
    return `${block.label} — a Workpaper displaying whatever its connected calculators produce (no worksheet lines declared).`;
  const described = lines.map((line) => {
    const calculator = definition.blocks.find((item) => item.id === line.calculationBlockId);
    const source = calculator ? calculator.label : line.calculationBlockId;
    return `${line.label} (${line.resultKey} from ${source})`;
  });
  return `${block.label} — a Workpaper showing ${lines.length} declared field${lines.length === 1 ? '' : 's'}: ${truncateList(described, 6)}.`;
}

/**
 * A short, honest description of what a block actually does, derived from its
 * real configuration — never a hand-typed label that can drift from behavior
 * (the same reason the generated-code preview was removed from the Build
 * overlay). Falls back to the block's own description/label for block types
 * without a structural summary yet. Meant to be read by both a human and the
 * assistant, so it stays plain prose rather than a data dump.
 */
export function describeWorkflowBlock(block: WorkflowBlock, definition: Definition): string {
  const toolId = getToolIdForBlock(block);
  if (toolId === 'logic.calculation_engine') return describeCalculationEngine(block);
  if (toolId === 'field.field_block') return describeFieldBlock(block, definition);
  return block.description.trim() || `${block.label} — a ${block.family} / ${block.subtype} block.`;
}
