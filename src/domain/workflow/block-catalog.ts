import type { BlockFamily, BlockSubtype, FiscalStage } from "./block-types";

export type BlockCatalogItem = {
  id: string;
  family: BlockFamily;
  subtype: BlockSubtype;
  label: string;
  description: string;
  defaultConfig: Record<string, unknown>;
};

export const BLOCK_FAMILY_STAGE: Record<BlockFamily, FiscalStage> = {
  Trigger: "trigger",
  Source: "source",
  Logic: "logic",
  "Review / Validation": "validation",
  Field: "field",
  Output: "output",
  "AI / Agent": "ai-agent",
  // "Protected" is an internal governed-value family with no dedicated FiscalStage;
  // bucket it with "output" (governed/locked final values), matching the worksheet
  // ordering in generate-structure-view. Revisit at the kernel node-model step.
  Protected: "output",
};

export const FISCAL_STAGE_OPTIONS: Array<{
  id: string;
  stage: FiscalStage;
  family: BlockFamily;
  label: string;
  description: string;
}> = [
  {
    id: "preset:trigger",
    stage: "trigger",
    family: "Trigger",
    label: "Trigger",
    description: "Initiates the workflow — schedule, webhook, or manual start",
  },
  {
    id: "preset:source",
    stage: "source",
    family: "Source",
    label: "Source",
    description: "Immutable truth or reference data",
  },
  {
    id: "preset:logic",
    stage: "logic",
    family: "Logic",
    label: "Logic",
    description: "Transform, calculate, classify, or derive values",
  },
  {
    id: "preset:review-validation",
    stage: "validation",
    family: "Review / Validation",
    label: "Review / Validation",
    description: "Check whether the workflow is trustworthy",
  },
  {
    id: "preset:field",
    stage: "field",
    family: "Field",
    label: "Field",
    description: "Display computed values and their category breakdowns in the user-facing UI",
  },
  {
    id: "preset:output",
    stage: "output",
    family: "Output",
    label: "Output",
    description: "Generate handoff or export artifacts",
  },
  {
    id: "preset:ai-agent",
    stage: "ai-agent",
    family: "AI / Agent",
    label: "AI / Agent",
    description: "Propose searches, mappings, formulas, or workflow changes",
  },
];
