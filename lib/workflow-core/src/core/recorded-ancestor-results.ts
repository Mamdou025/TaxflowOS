import type { WorkflowDefinition } from '@workspace/workflow-contracts/domain/workflow-types';
import type { ToolRunResult } from '@workspace/workflow-contracts/tool-types';

/** Traverse each known block once; disabled edges and the selected block are never ancestors. */
export function ancestorBlockIds(
  definition: Pick<WorkflowDefinition, 'blocks' | 'edges'>,
  blockId: string,
) {
  const known = new Set(definition.blocks.map((block) => block.id));
  const incoming = new Map<string, string[]>();
  for (const edge of definition.edges) {
    if (
      edge.status !== 'active' ||
      !known.has(edge.sourceBlockId) ||
      !known.has(edge.targetBlockId)
    )
      continue;
    const sources = incoming.get(edge.targetBlockId) ?? [];
    sources.push(edge.sourceBlockId);
    incoming.set(edge.targetBlockId, sources);
  }
  const visited = new Set([blockId]);
  const pending = [blockId];
  while (pending.length) {
    for (const source of incoming.get(pending.pop()!) ?? []) {
      if (visited.has(source)) continue;
      visited.add(source);
      pending.push(source);
    }
  }
  visited.delete(blockId);
  return visited;
}

/** Captured evidence is context, never an input edge or permission to execute an ancestor. */
export function validateRecordedAncestorResults(
  definition: WorkflowDefinition,
  selectedBlockId: string,
  results: Record<string, ToolRunResult>,
) {
  const ancestors = ancestorBlockIds(definition, selectedBlockId);
  for (const [id, result] of Object.entries(results)) {
    if (!ancestors.has(id) || !result || result.blockId !== id)
      throw new Error('Recorded context must contain only matching results from active ancestors.');
  }
  return structuredClone(results);
}
