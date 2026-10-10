import type { ToolRunResult } from '@workspace/workflow-contracts/tool-types';
import type { LocalRunRecord, WorkflowBlock } from '@/shared/workflow-engine/workflow/contracts';
import type { WorkflowEdge, WorkflowNode } from '@/shared/workflow-engine/state/workflow-store';
import { createWorkflowDefinitionFromCanvas } from '@/shared/workflow-engine/workflow/canvas';
import { recordedBlockInput } from '@/shared/workflow-engine/block-test-inputs';

/** Canvas conversion and recorded-config checks stay in the browser adapter. */
export function fieldWorksheetCanvasContext(
  block: WorkflowBlock,
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  lastRun?: LocalRunRecord,
) {
  const definition = createWorkflowDefinitionFromCanvas({
    name: 'Worksheet preview',
    nodes,
    edges,
  });
  definition.blocks = definition.blocks.map((item) => (item.id === block.id ? block : item));
  const results: Record<string, ToolRunResult> = {};
  const stale: string[] = [];
  for (const node of nodes) {
    const current = node.data.block;
    if (!current) continue;
    const raw = lastRun?.logs.find((log) => log.nodeId === current.id)?.output;
    if (!raw || typeof raw !== 'object' || !('output' in raw) || !('status' in raw)) continue;
    results[current.id] = raw as ToolRunResult;
    if (
      !recordedBlockInput(
        { ...current, config: node.data.config ?? current.config },
        lastRun ? [lastRun] : [],
      )
    )
      stale.push(current.id);
  }
  return { block, definition, results, stale };
}
