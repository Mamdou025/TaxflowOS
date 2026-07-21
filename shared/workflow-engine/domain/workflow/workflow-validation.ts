import type { BlockFamily } from "./block-types";
import type { WorkflowRelationshipType } from "./edge-types";
import { WORKFLOW_RELATIONSHIP_TYPES } from "./edge-types";
import { getAllowedRelationshipTypesForFamilies } from "./workflow-rules";

export function isKnownWorkflowRelationshipType(
  value: unknown
): value is WorkflowRelationshipType {
  return (
    typeof value === "string" &&
    WORKFLOW_RELATIONSHIP_TYPES.includes(value as WorkflowRelationshipType)
  );
}

export function isWorkflowRelationshipAllowed({
  sourceFamily,
  targetFamily,
  relationshipType,
}: {
  sourceFamily: BlockFamily;
  targetFamily: BlockFamily;
  relationshipType: WorkflowRelationshipType;
}): boolean {
  return getAllowedRelationshipTypesForFamilies(
    sourceFamily,
    targetFamily
  ).includes(relationshipType);
}
