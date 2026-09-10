import { createWorkflowBlockFromCatalog, type LocalRunRecord, type WorkflowBlock } from './local-fiscal-workflow';
import type { IsolatedBlockInput } from './local-tool-runner';
import type { ToolRunResult } from './local-tool-registry';
import { collectFormulaReferences } from './execution/blocks/logic/calculation-engine/run';

export function exampleInput(output: Record<string, unknown>): IsolatedBlockInput {
  const block = createWorkflowBlockFromCatalog('source:manual-entry', { id: 'isolated-example-input', label: 'Example inputs', position: { x: 0, y: 0 } });
  const now = new Date().toISOString();
  return { block, result: { blockId: block.id, toolId: 'test.example_input', runId: 'example-input', status: 'success', output, warnings: [], errors: [], logs: [], evidenceRefs: [], sourceTrace: [], startedAt: now, completedAt: now, blockTest: { mode: 'isolated', inputs: 'examples' } } };
}

export function formulaInputNames(block: WorkflowBlock): string[] {
  const raw = block.config.formulas ?? block.config.calculationRules ?? [];
  if (!Array.isArray(raw)) return [];
  const rules = raw as { resultKey?: string; formulaExpression?: string; operands?: unknown[] }[];
  const outputs = new Set(rules.map(rule => rule.resultKey));
  return [...new Set(rules.flatMap(rule => rule.formulaExpression ? collectFormulaReferences(rule.formulaExpression) : (rule.operands ?? []).filter((value): value is string => typeof value === 'string')).filter(key => !outputs.has(key)))];
}

export function recordedBlockInput(block: WorkflowBlock, records: LocalRunRecord[]): IsolatedBlockInput | undefined {
  for (const record of records) {
    const result = record.logs.find(log => log.nodeId === block.id)?.output as ToolRunResult | undefined;
    if (!result || !('output' in result)) continue;
    // Inspect the most recent result, never silently fall back past an error or edit.
    if (!['success', 'warning', 'needs_review'].includes(result.status) || result.errors.length || result.configSignature !== JSON.stringify(block.config)) return undefined;
    return { block, result };
  }
  return undefined;
}
