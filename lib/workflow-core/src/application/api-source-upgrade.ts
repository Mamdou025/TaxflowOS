import type { WorkflowDefinition, WorkflowBlock } from '@workspace/workflow-contracts/domain/workflow-types';

/** Explicit draft edit only. Callers save it through their normal draft command. */
export function upgradeFapiApiSourceDraft(definition: WorkflowDefinition, replacement: WorkflowBlock): WorkflowDefinition {
  const old = definition.blocks.find((block) => block.id === 'fapi-source-fx-rate');
  if (!old || old.config.sourceKind !== 'currency_rate') throw new Error('No legacy FAPI FX source to replace.');
  const outgoing = definition.edges.filter((edge) => edge.sourceBlockId === old.id);
  if (outgoing.some((edge) => edge.targetInputRole !== 'named_values' || edge.sourceOutputRole !== 'exchange_rate')) {
    throw new Error('This FX source has custom downstream bindings. Reconnect them to named values before upgrading.');
  }
  const redundantId = 'fapi-api-boc-fx';
  const redundantEdges = definition.edges.filter((edge) => edge.sourceBlockId === redundantId || edge.targetBlockId === redundantId);
  if (redundantEdges.some((edge) => edge.sourceBlockId !== redundantId || edge.targetBlockId !== old.id)) {
    throw new Error('The Valet source has additional connections. Review those before replacing it.');
  }
  if (definition.edges.some((edge) => edge.targetBlockId === old.id && edge.sourceBlockId !== redundantId)) {
    throw new Error('The FX source has additional inputs. Review those before replacing it.');
  }
  const next = structuredClone(definition);
  next.blocks = next.blocks.filter((block) => block.id !== redundantId).map((block) => block.id === old.id ? {
    ...structuredClone(replacement), id: old.id, label: old.label, position: old.position,
    config: { ...replacement.config, overrideRate: old.config.overrideRate ?? null, overrideReason: old.config.overrideReason },
  } : block);
  next.edges = next.edges.filter((edge) => edge.sourceBlockId !== redundantId && edge.targetBlockId !== redundantId)
    .map((edge) => edge.sourceBlockId === old.id ? { ...edge, sourceOutputRole: 'named_values' } : edge);
  next.structure = { ...next.structure,
    blockOrder: next.structure.blockOrder.filter((id) => id !== redundantId),
    columns: next.structure.columns.map((column) => ({ ...column, blockIds: column.blockIds.filter((id) => id !== redundantId) })),
  };
  return next;
}
