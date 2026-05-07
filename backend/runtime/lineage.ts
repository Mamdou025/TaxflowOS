import type { WorkflowBlock } from "../../lib/local-fiscal-workflow";
import type { EvidenceRef, SourceTraceRef } from "./types";

type SourceLineageInput = {
  block: WorkflowBlock;
  sourceKind: string;
  label: string;
  valuePreview?: string;
  rowId?: string;
  ruleId?: string;
  field?: string;
  edgeId?: string;
};

function getLocator(block: WorkflowBlock) {
  return (
    block.source?.locator ||
    String(block.config.sourceLocator || block.config.locator || "")
  );
}

function getEvidenceItemId(input: SourceLineageInput) {
  return input.rowId || input.ruleId || input.field || "value";
}

export function createEvidenceRef(input: SourceLineageInput): EvidenceRef {
  const itemId = getEvidenceItemId(input);

  return {
    evidenceId: `${input.block.id}:${itemId}`,
    field: input.field,
    immutable: true,
    label: input.label,
    locator: getLocator(input.block) || input.sourceKind,
    rowId: input.rowId,
    ruleId: input.ruleId,
    sourceBlockId: input.block.id,
    sourceKind: input.sourceKind,
    sourceLabel: input.block.label,
    valuePreview: input.valuePreview,
  };
}

export function createSourceTraceRef({
  evidenceRef,
  relationshipPath,
}: {
  evidenceRef: EvidenceRef;
  relationshipPath?: string[];
}): SourceTraceRef {
  return {
    edgeId: undefined,
    evidenceRefId: evidenceRef.evidenceId,
    field: evidenceRef.field,
    relationshipPath: relationshipPath || [evidenceRef.sourceBlockId],
    rowId: evidenceRef.rowId,
    ruleId: evidenceRef.ruleId,
    sourceBlockId: evidenceRef.sourceBlockId,
    sourceKind: evidenceRef.sourceKind,
    sourceLabel: evidenceRef.sourceLabel,
    valuePreview: evidenceRef.valuePreview,
  };
}

export function dedupeEvidenceRefs(refs: EvidenceRef[]): EvidenceRef[] {
  return [...new Map(refs.map((ref) => [ref.evidenceId, ref])).values()];
}

export function dedupeSourceTrace(refs: SourceTraceRef[]): SourceTraceRef[] {
  return [
    ...new Map(
      refs.map((ref) => [
        [
          ref.sourceBlockId,
          ref.rowId || "",
          ref.ruleId || "",
          ref.field || "",
          ref.evidenceRefId || "",
        ].join(":"),
        ref,
      ])
    ).values(),
  ];
}
