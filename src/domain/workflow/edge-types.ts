import type { BlockFamily } from "./block-types";

export type EdgeStatus = "active" | "proposed" | "rejected" | "disabled";

export type EdgeBindingStatus = "invalid" | "missing" | "valid" | "warning";

export type WorkflowRelationshipType =
  | "provides_data_to"
  | "extracted_into"
  | "referenced_by"
  | "transforms_into"
  | "aggregates_into"
  | "branches_to"
  | "depends_on"
  | "checked_by"
  | "requires_review_by"
  | "triggers_validation"
  | "approves_for"
  | "blocks_until_resolved"
  | "certifies"
  | "feeds_protected_input"
  | "feeds_protected_result"
  | "feeds_output_input"
  | "included_in_output_preview"
  | "maps_to_output_candidate"
  | "feeds_ai_context"
  | "provides_context_to_ai"
  | "requests_ai_review"
  | "supplies_candidate_data"
  | "maps_to_output"
  | "included_in_handoff"
  | "proposes"
  | "suggests_mapping"
  | "suggests_formula"
  | "suggests_workflow_change"
  | "initiates";

export type WorkflowEdgeHistoryEntry = {
  id: string;
  action:
    | "created"
    | "updated"
    | "approved"
    | "rejected"
    | "disabled"
    | "migrated"
    | "split";
  by: string;
  at: string;
  notes?: string;
};

export const WORKFLOW_RELATIONSHIP_TYPES = [
  "provides_data_to",
  "extracted_into",
  "referenced_by",
  "transforms_into",
  "aggregates_into",
  "branches_to",
  "depends_on",
  "checked_by",
  "requires_review_by",
  "triggers_validation",
  "approves_for",
  "blocks_until_resolved",
  "certifies",
  "feeds_protected_input",
  "feeds_protected_result",
  "feeds_output_input",
  "included_in_output_preview",
  "maps_to_output_candidate",
  "feeds_ai_context",
  "provides_context_to_ai",
  "requests_ai_review",
  "supplies_candidate_data",
  "maps_to_output",
  "included_in_handoff",
  "proposes",
  "suggests_mapping",
  "suggests_formula",
  "suggests_workflow_change",
  "initiates",
] as const satisfies readonly WorkflowRelationshipType[];

export const EDGE_STATUS_VALUES = [
  "active",
  "proposed",
  "disabled",
  "rejected",
] as const satisfies readonly EdgeStatus[];

export const EDGE_BINDING_STATUS_VALUES = [
  "valid",
  "missing",
  "warning",
  "invalid",
] as const satisfies readonly EdgeBindingStatus[];

export const GOVERNED_OUTPUT_RELATIONSHIP_TYPES = [
  "maps_to_output",
  "included_in_handoff",
] as const satisfies readonly WorkflowRelationshipType[];

export const CANDIDATE_OUTPUT_RELATIONSHIP_TYPES = [
  "feeds_output_input",
  "included_in_output_preview",
  "maps_to_output_candidate",
] as const satisfies readonly WorkflowRelationshipType[];

export const OUTPUT_MAPPING_RELATIONSHIP_TYPES = [
  ...GOVERNED_OUTPUT_RELATIONSHIP_TYPES,
  ...CANDIDATE_OUTPUT_RELATIONSHIP_TYPES,
] as const satisfies readonly WorkflowRelationshipType[];

export const WORKFLOW_RELATIONSHIP_LABELS: Record<
  WorkflowRelationshipType,
  string
> = {
  aggregates_into: "Aggregates into",
  approves_for: "Approves for",
  blocks_until_resolved: "Blocks until resolved",
  branches_to: "Branches to",
  certifies: "Certifies",
  checked_by: "Checked by",
  depends_on: "Depends on",
  extracted_into: "Extracted into",
  feeds_ai_context: "Feeds AI context",
  feeds_output_input: "Feeds output input",
  feeds_protected_input: "Feeds protected input",
  feeds_protected_result: "Feeds protected result",
  initiates: "Initiates",
  included_in_output_preview: "Included in output preview",
  included_in_handoff: "Included in handoff",
  maps_to_output: "Maps to output",
  maps_to_output_candidate: "Maps to output candidate",
  proposes: "Proposes",
  provides_context_to_ai: "Provides context to AI",
  provides_data_to: "Provides data to",
  referenced_by: "Referenced by",
  requires_review_by: "Requires review by",
  requests_ai_review: "Requests AI review",
  suggests_formula: "Suggests formula",
  suggests_mapping: "Suggests mapping",
  suggests_workflow_change: "Suggests workflow change",
  supplies_candidate_data: "Supplies candidate data",
  transforms_into: "Transforms into",
  triggers_validation: "Triggers validation",
};

export type RelationshipTypesByFamilyPair = Partial<
  Record<
    BlockFamily,
    Partial<Record<BlockFamily, readonly WorkflowRelationshipType[]>>
  >
>;

export function isWorkflowRelationshipType(
  value: unknown
): value is WorkflowRelationshipType {
  return (
    typeof value === "string" &&
    WORKFLOW_RELATIONSHIP_TYPES.includes(value as WorkflowRelationshipType)
  );
}

export function isGovernedOutputRelationshipType(
  relationshipType: WorkflowRelationshipType
): relationshipType is (typeof GOVERNED_OUTPUT_RELATIONSHIP_TYPES)[number] {
  return (
    GOVERNED_OUTPUT_RELATIONSHIP_TYPES as readonly WorkflowRelationshipType[]
  ).includes(relationshipType);
}

export function isCandidateOutputRelationshipType(
  relationshipType: WorkflowRelationshipType
): relationshipType is (typeof CANDIDATE_OUTPUT_RELATIONSHIP_TYPES)[number] {
  return (
    CANDIDATE_OUTPUT_RELATIONSHIP_TYPES as readonly WorkflowRelationshipType[]
  ).includes(relationshipType);
}

export function isOutputMappingRelationshipType(
  relationshipType: WorkflowRelationshipType
): relationshipType is (typeof OUTPUT_MAPPING_RELATIONSHIP_TYPES)[number] {
  return (
    OUTPUT_MAPPING_RELATIONSHIP_TYPES as readonly WorkflowRelationshipType[]
  ).includes(relationshipType);
}
