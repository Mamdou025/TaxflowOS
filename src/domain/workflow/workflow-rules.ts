import type { BlockFamily } from "./block-types";
import type {
  RelationshipTypesByFamilyPair,
  WorkflowRelationshipType,
} from "./edge-types";
import {
  CANDIDATE_OUTPUT_RELATIONSHIP_TYPES,
  GOVERNED_OUTPUT_RELATIONSHIP_TYPES,
} from "./edge-types";

export type BlockFamilyRule = {
  family: BlockFamily;
  responsibility: string;
  mustNot: string;
};

export const BLOCK_FAMILY_RULES: Record<BlockFamily, BlockFamilyRule> = {
  Trigger: {
    family: "Trigger",
    responsibility:
      "Initiates the workflow via schedule, webhook, or manual start.",
    mustNot:
      "Trigger blocks do not process, transform, or store data — they only fire the workflow.",
  },
  Source: {
    family: "Source",
    responsibility: "Immutable truth or reference objects.",
    mustNot: "Sources do not classify, calculate, correct, or finalize values.",
  },
  Logic: {
    family: "Logic",
    responsibility:
      "Transforms, calculates, classifies, aggregates, or branches data.",
    mustNot: "Logic does not overwrite Source truth or lock final governance.",
  },
  "Review / Validation": {
    family: "Review / Validation",
    responsibility:
      "Judges readiness, trust, approval, completeness, or warnings.",
    mustNot:
      "Review blocks do not mutate evidence or perform primary calculations.",
  },
  Field: {
    family: "Field",
    responsibility: "Displays computed values and category breakdowns in the user-facing UI.",
    mustNot:
      "Field blocks do not compute or transform data — they only display results from upstream blocks.",
  },
  Output: {
    family: "Output",
    responsibility: "Generates deliverables, handoffs, previews, and exports.",
    mustNot: "Output blocks do not become the source of workflow truth.",
  },
  "AI / Agent": {
    family: "AI / Agent",
    responsibility: "Proposes changes, mappings, formulas, or reviews.",
    mustNot: "AI / Agent blocks do not silently mutate workflows.",
  },
  Protected: {
    family: "Protected",
    responsibility:
      "Holds governed, locked values — approved inputs, official lines, locked rates, and final reviewed amounts.",
    mustNot:
      "Protected values are not recalculated or edited without an explicit unlock or approval.",
  },
};

export const LOGIC_OUTPUT_GOVERNANCE_WARNING =
  "Final governed handoffs should usually map from Protected values. This Logic mapping is treated as a draft/candidate mapping.";

export const AI_PROPOSAL_RELATIONSHIP_TYPES = [
  "proposes",
  "suggests_mapping",
  "suggests_formula",
  "suggests_workflow_change",
] as const satisfies readonly WorkflowRelationshipType[];

export const AI_CONTEXT_RELATIONSHIP_TYPES = [
  "feeds_ai_context",
  "provides_context_to_ai",
  "requests_ai_review",
  "supplies_candidate_data",
] as const satisfies readonly WorkflowRelationshipType[];

export const RELATIONSHIP_TYPES_BY_FAMILY_PAIR: RelationshipTypesByFamilyPair =
  {
    Logic: {
      "AI / Agent": AI_CONTEXT_RELATIONSHIP_TYPES,
      Logic: [
        "transforms_into",
        "aggregates_into",
        "branches_to",
        "depends_on",
      ],
      Output: CANDIDATE_OUTPUT_RELATIONSHIP_TYPES,
      Protected: ["feeds_protected_input", "feeds_protected_result"],
      "Review / Validation": [
        "checked_by",
        "requires_review_by",
        "triggers_validation",
      ],
    },
    Output: {
      "AI / Agent": AI_CONTEXT_RELATIONSHIP_TYPES,
    },
    Protected: {
      "AI / Agent": AI_CONTEXT_RELATIONSHIP_TYPES,
      Output: GOVERNED_OUTPUT_RELATIONSHIP_TYPES,
    },
    "Review / Validation": {
      "AI / Agent": AI_CONTEXT_RELATIONSHIP_TYPES,
      Output: ["included_in_output_preview"],
      Protected: ["approves_for", "blocks_until_resolved", "certifies"],
      "Review / Validation": [
        "depends_on",
        "blocks_until_resolved",
        "certifies",
      ],
    },
    Source: {
      "AI / Agent": AI_CONTEXT_RELATIONSHIP_TYPES,
      Logic: ["provides_data_to", "extracted_into", "referenced_by"],
    },
    Trigger: {
      Source: ["initiates", "provides_data_to"],
      Logic: ["initiates", "provides_data_to"],
    },
  };

export function getBlockFamilyRule(family: BlockFamily): BlockFamilyRule {
  return BLOCK_FAMILY_RULES[family];
}

export function getAllowedRelationshipTypesForFamilies(
  sourceFamily: BlockFamily,
  targetFamily: BlockFamily
): WorkflowRelationshipType[] {
  if (sourceFamily === "AI / Agent") {
    return [...AI_PROPOSAL_RELATIONSHIP_TYPES];
  }

  return [
    ...(RELATIONSHIP_TYPES_BY_FAMILY_PAIR[sourceFamily]?.[targetFamily] || []),
  ];
}
