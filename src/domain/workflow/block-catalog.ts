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
  Source: "source",
  Logic: "logic",
  "Review / Validation": "validation",
  Protected: "protected",
  Output: "output",
  "AI / Agent": "ai-agent",
};

export const FISCAL_STAGE_OPTIONS: Array<{
  id: string;
  stage: FiscalStage;
  family: BlockFamily;
  label: string;
  description: string;
}> = [
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
    id: "preset:protected",
    stage: "protected",
    family: "Protected",
    label: "Protected",
    description: "Governed inputs, official lines, and protected results",
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
