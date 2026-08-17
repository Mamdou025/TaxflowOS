import type { WorkflowBlock } from "./workflow-types";

export const SOURCE_LOCKED_CONFIG_KEYS = [
  "sourceLabel",
  "sourceLocator",
  "sourceValue",
  "valuePreview",
] as const;

export type SourceLockedConfigKey = (typeof SOURCE_LOCKED_CONFIG_KEYS)[number];

export function isSourceEvidenceImmutable(block: WorkflowBlock): boolean {
  return Boolean(block.source?.treatedAsEvidence && block.source.immutable);
}

export function canMutateSourceEvidence(block: WorkflowBlock): boolean {
  return !isSourceEvidenceImmutable(block);
}

export function isExcelWorkbookSource(block?: WorkflowBlock | null): boolean {
  const sourceKind = String(block?.config.sourceKind || "").toLowerCase();
  return (
    block?.family === "Source" &&
    (block.subtype === "Excel / Workbook" ||
      sourceKind.includes("excel") ||
      sourceKind.includes("workbook"))
  );
}

export function hasExcelSourceEvidence(config: Record<string, unknown>) {
  const rowCount =
    typeof config.selectedRowsCount === "number"
      ? config.selectedRowsCount
      : Number(config.selectedRowsCount || 0);
  const workbookFile =
    typeof config.workbookFile === "object" && config.workbookFile !== null
      ? config.workbookFile
      : null;
  const workbook =
    typeof config.excelWorkbook === "object" && config.excelWorkbook !== null
      ? config.excelWorkbook
      : null;

  return Boolean(
    (workbook && Array.isArray((workbook as { sheets?: unknown }).sheets)) ||
      (Array.isArray(config.rows) && config.rows.length > 0) ||
      (Number.isFinite(rowCount) && rowCount > 0) ||
      config.fileName ||
      config.workbookId ||
      config.uploadTimestamp ||
      (workbookFile && Object.keys(workbookFile).length > 0)
  );
}

/**
 * Has this Source been COMMITTED — published, or already consumed by a run?
 *
 * Every Source block is born `treatedAsEvidence` + `immutable` (getSourceMetadata
 * stamps both the moment it is created from the catalog), so gating edits on those
 * flags alone freezes a brand-new, still-empty block — a Manual Entry you just
 * dropped had no editable field to type its value into. The product rule the UI
 * itself states is narrower: "Source evidence is view-only AFTER USE OR PUBLISH."
 * This is that rule. Until a source is committed it is a draft you configure; after,
 * it freezes and corrections belong downstream in Logic.
 */
export function isSourceCommitted(block?: WorkflowBlock | null): boolean {
  return Boolean(
    block?.family === "Source" &&
      (block.config.sourceStatus === "published" ||
        block.config.sourceUsedInRun === true)
  );
}

export function sourceHasLockableEvidence(block?: WorkflowBlock | null) {
  if (!block) {
    return false;
  }
  return !isExcelWorkbookSource(block) || hasExcelSourceEvidence(block.config);
}
