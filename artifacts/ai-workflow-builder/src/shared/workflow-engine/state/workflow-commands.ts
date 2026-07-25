import type { EdgeChange, NodeChange } from "@xyflow/react";
import { applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import { nanoid } from "nanoid";
import {
  createCanvasEdgeFromWorkflowEdge,
  createSplitWorkflowEdgeRecords,
  createWorkflowBlockFromCatalog,
  createWorkflowEdgeRecord,
  createWorkflowNodeFromBlock,
  getBlockCatalogItem,
  getWorkflowEdgeDefaults,
  updateWorkflowEdgeRecord,
  type WorkflowBlock,
  type WorkflowEdge as WorkflowSchemaEdge,
} from "@/shared/workflow-engine/local-fiscal-workflow";
import type {
  WorkflowEdge,
  WorkflowNode,
  WorkflowNodeData,
} from "@/shared/workflow-engine/state/workflow-store";
import { isGovernedValueBlock } from "@/shared/workflow-engine/domain/workflow/protected-rules";
import {
  createWorkflowAuditEvent,
  summarizeBlockForAudit,
  summarizeEdgeForAudit,
  type WorkflowAuditEvent,
  type WorkflowAuditEventType,
  type WorkflowAuditTargetType,
} from "@/shared/workflow-engine/audit/workflow-events";
import type { WorkflowRelationshipType } from "@/shared/workflow-engine/domain/workflow/edge-types";
import {
  SOURCE_LOCKED_CONFIG_KEYS,
  sourceHasLockableEvidence,
} from "@/shared/workflow-engine/domain/workflow/source-rules";
import {
  isKnownWorkflowRelationshipType,
  isWorkflowRelationshipAllowed,
} from "@/shared/workflow-engine/domain/workflow/workflow-validation";

export type WorkflowCommandType =
  | "add-block"
  | "apply-edge-changes"
  | "apply-node-changes"
  | "clear-workflow"
  | "connect-blocks"
  | "delete-block"
  | "delete-edge"
  | "delete-selected"
  | "split-edge"
  | "update-block"
  | "update-edge";

export type WorkflowChangeEvent = {
  id: string;
  type: WorkflowCommandType;
  message: string;
  createdAt: string;
  createdBy: string;
  subjectId?: string;
  metadata?: Record<string, unknown>;
};

export type WorkflowCommandState = {
  activeTab?: string;
  actor?: string;
  edges: WorkflowEdge[];
  newlyCreatedNodeId?: string | null;
  nodes: WorkflowNode[];
  selectedEdgeId: string | null;
  selectedNodeId: string | null;
  workflowId: string;
};

export type WorkflowCommand =
  | { type: "add-block"; node: WorkflowNode }
  | { type: "apply-edge-changes"; changes: EdgeChange[] }
  | { type: "apply-node-changes"; changes: NodeChange[] }
  | { type: "clear-workflow" }
  | {
      type: "connect-blocks";
      connection: {
        source: string;
        sourceHandle?: string | null;
        target: string;
        targetHandle?: string | null;
      };
      id?: string;
    }
  | { type: "delete-block"; nodeId: string }
  | { type: "delete-edge"; edgeId: string }
  | { type: "delete-selected" }
  | {
      type: "split-edge";
      catalogId: string;
      edgeId: string;
      insertedId?: string;
    }
  | { type: "update-block"; data: Partial<WorkflowNodeData>; id: string }
  | {
      type: "update-edge";
      id: string;
      updates: Partial<
        Pick<
          WorkflowSchemaEdge,
          | "bindingLabel"
          | "bindingStatus"
          | "confidence"
          | "notes"
          | "reason"
          | "relationshipType"
          | "sourceOutputRole"
          | "status"
          | "targetInputRole"
        >
      >;
    };

export type WorkflowCommandResult = {
  auditEvents: WorkflowAuditEvent[];
  events: WorkflowChangeEvent[];
  history: boolean;
  message?: string;
  ok: boolean;
  saveMode: "debounced" | "immediate" | "none";
  state: WorkflowCommandState;
};

function event({
  message,
  metadata,
  subjectId,
  type,
}: {
  message: string;
  metadata?: Record<string, unknown>;
  subjectId?: string;
  type: WorkflowCommandType;
}): WorkflowChangeEvent {
  return {
    id: `change-${Date.now()}-${nanoid(6)}`,
    type,
    message,
    createdAt: new Date().toISOString(),
    createdBy: "workflow-studio",
    subjectId,
    ...(metadata ? { metadata } : {}),
  };
}

function auditEvent({
  after,
  before,
  metadata,
  proposalId,
  reason,
  sourceId,
  state,
  targetObjectId,
  targetObjectType,
  type,
}: {
  after?: Record<string, unknown>;
  before?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  proposalId?: string;
  reason?: string;
  sourceId?: string;
  state: WorkflowCommandState;
  targetObjectId?: string;
  targetObjectType?: WorkflowAuditTargetType;
  type: WorkflowAuditEventType;
}): WorkflowAuditEvent {
  return createWorkflowAuditEvent({
    actor: state.actor || "workflow-studio",
    after,
    before,
    metadata,
    proposalId,
    reason,
    sourceId,
    targetObjectId,
    targetObjectType,
    type,
    workflowId: state.workflowId,
  });
}

function unchanged(
  state: WorkflowCommandState,
  message?: string
): WorkflowCommandResult {
  return {
    auditEvents: [],
    events: message
      ? [
          event({
            message,
            type: "update-block",
          }),
        ]
      : [],
    history: false,
    message,
    ok: false,
    saveMode: "none",
    state,
  };
}

function changed({
  auditEvents = [],
  events,
  history = false,
  saveMode = "debounced",
  state,
}: {
  auditEvents?: WorkflowAuditEvent[];
  events: WorkflowChangeEvent[];
  history?: boolean;
  saveMode?: WorkflowCommandResult["saveMode"];
  state: WorkflowCommandState;
}): WorkflowCommandResult {
  return {
    auditEvents,
    events,
    history,
    ok: true,
    saveMode,
    state,
  };
}

function getConfigWithLockedSourceFields(
  node: WorkflowNode,
  config: Record<string, unknown> | undefined
): Record<string, unknown> | undefined {
  if (!(config && isSourceLockedByConfig(node.data.block, node.data.config))) {
    return config;
  }

  const currentConfig = node.data.config || {};
  const nextConfig = { ...config };
  for (const key of SOURCE_LOCKED_CONFIG_KEYS) {
    if (key in currentConfig) {
      nextConfig[key] = currentConfig[key];
    }
  }
  return nextConfig;
}

function isSourceLockedByConfig(
  block: WorkflowBlock | undefined,
  config: Record<string, unknown> | undefined
) {
  if (!(block?.source?.immutable && sourceHasLockableEvidence(block))) {
    return false;
  }
  return Boolean(
    config?.sourceStatus === "published" || config?.sourceUsedInRun === true
  );
}

function getUpdatedSourceMetadata(
  block: WorkflowBlock,
  nextConfig: Record<string, unknown>
): WorkflowBlock["source"] {
  if (!block.source) {
    return;
  }

  const sourceLocked = isSourceLockedByConfig(
    { ...block, config: nextConfig },
    nextConfig
  );

  return {
    ...block.source,
    locator:
      sourceLocked && block.source.locatorLocked
        ? block.source.locator
        : String(nextConfig.sourceLocator || block.source.locator),
    valuePreview:
      (sourceLocked && block.source.valuesLocked) ||
      typeof nextConfig.valuePreview !== "string"
        ? block.source.valuePreview
        : nextConfig.valuePreview,
  };
}

function getUpdatedGovernanceMetadata(
  block: WorkflowBlock,
  nextConfig: Record<string, unknown>
): WorkflowBlock["governance"] {
  if (!block.governance) {
    return;
  }

  return {
    ...block.governance,
    editIntent:
      typeof nextConfig.protectedEditIntent === "string"
        ? nextConfig.protectedEditIntent
        : block.governance.editIntent,
  };
}

function getUpdatedEmbeddedBlock(
  node: WorkflowNode,
  nextData: WorkflowNodeData
): WorkflowBlock | undefined {
  if (!node.data.block) {
    return nextData.block;
  }

  const block = nextData.block || node.data.block;
  const nextConfig = nextData.config || block.config;

  return {
    ...block,
    label: nextData.label,
    description: nextData.description || "",
    position: node.position,
    config: nextConfig,
    source: getUpdatedSourceMetadata(block, nextConfig),
    governance: getUpdatedGovernanceMetadata(block, nextConfig),
    runtime: {
      ...block.runtime,
      outputKey:
        typeof nextConfig.outputs === "string"
          ? nextConfig.outputs
          : block.runtime.outputKey,
    },
    updatedBy: "workflow-studio",
    updatedAt: new Date().toISOString(),
  };
}

function getUpdatedNodeData(
  node: WorkflowNode,
  data: Partial<WorkflowNodeData>
): WorkflowNodeData {
  const sourceLabelLocked = Boolean(
    node.data.block?.source?.treatedAsEvidence &&
      node.data.block.source.labelLocked &&
      isSourceLockedByConfig(node.data.block, node.data.config)
  );
  const nextConfig = getConfigWithLockedSourceFields(
    node,
    data.config || node.data.config
  );
  const nextData: WorkflowNodeData = {
    ...node.data,
    ...data,
    config: nextConfig,
    label:
      sourceLabelLocked && data.label !== undefined
        ? node.data.label
        : (data.label ?? node.data.label),
  };

  return {
    ...nextData,
    block: getUpdatedEmbeddedBlock(node, nextData),
  };
}

function updateTemplatesInConfig(
  config: Record<string, unknown>,
  nodeId: string,
  oldLabel: string,
  newLabel: string
): Record<string, unknown> {
  let hasChanges = false;
  const updated: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(config)) {
    if (typeof value === "string") {
      const pattern = new RegExp(
        `\\{\\{@${escapeRegex(nodeId)}:${escapeRegex(oldLabel)}(\\.[^}]+)?\\}\\}`,
        "g"
      );
      const newValue = value.replace(pattern, (_match, fieldPart) => {
        hasChanges = true;
        return `{{@${nodeId}:${newLabel}${fieldPart || ""}}}`;
      });
      updated[key] = newValue;
    } else if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      const nestedUpdated = updateTemplatesInConfig(
        value as Record<string, unknown>,
        nodeId,
        oldLabel,
        newLabel
      );
      if (nestedUpdated !== value) {
        hasChanges = true;
      }
      updated[key] = nestedUpdated;
    } else {
      updated[key] = value;
    }
  }

  return hasChanges ? updated : config;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getInsertedBlockPosition({
  sourceNode,
  targetNode,
}: {
  sourceNode: WorkflowNode;
  targetNode: WorkflowNode;
}) {
  return {
    x: (sourceNode.position.x + targetNode.position.x) / 2,
    y: (sourceNode.position.y + targetNode.position.y) / 2,
  };
}

function getCatalogItemOrFallback(catalogId: string) {
  return (
    getBlockCatalogItem(catalogId) ||
    getBlockCatalogItem("logic:transformation") ||
    null
  );
}

function assertRelationshipUpdateAllowed({
  currentEdge,
  nextRelationshipType,
  state,
}: {
  currentEdge: WorkflowEdge;
  nextRelationshipType: WorkflowRelationshipType;
  state: WorkflowCommandState;
}) {
  const sourceBlock = state.nodes.find((node) => node.id === currentEdge.source)
    ?.data.block;
  const targetBlock = state.nodes.find((node) => node.id === currentEdge.target)
    ?.data.block;

  if (!(sourceBlock && targetBlock)) {
    return {
      ok: false,
      message:
        "Both blocks need typed workflow metadata before relationship metadata can be updated.",
    };
  }

  if (
    !isWorkflowRelationshipAllowed({
      relationshipType: nextRelationshipType,
      sourceFamily: sourceBlock.family,
      targetFamily: targetBlock.family,
    })
  ) {
    return {
      ok: false,
      message: `${sourceBlock.family} blocks cannot use ${nextRelationshipType} relationships to ${targetBlock.family} blocks.`,
    };
  }

  return { ok: true };
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: The command dispatcher keeps workflow mutations explicit and auditable in one place.
export function runWorkflowCommand(
  state: WorkflowCommandState,
  command: WorkflowCommand
): WorkflowCommandResult {
  switch (command.type) {
    case "add-block": {
      const updatedNodes = state.nodes.map((node) => ({
        ...node,
        selected: false,
      }));
      const newNode: WorkflowNode = {
        ...command.node,
        selected: true,
        data: command.node.data.block
          ? {
              ...command.node.data,
              block: {
                ...command.node.data.block,
                position: command.node.position,
                updatedAt: new Date().toISOString(),
              },
            }
          : command.node.data,
      };

      return changed({
        auditEvents: [
          auditEvent({
            after: summarizeBlockForAudit(newNode),
            state,
            targetObjectId: newNode.id,
            targetObjectType: "block",
            type: "block_created",
          }),
        ],
        events: [
          event({
            message: `Added block ${newNode.data.label}.`,
            metadata: { family: newNode.data.block?.family },
            subjectId: newNode.id,
            type: command.type,
          }),
        ],
        history: true,
        saveMode: "immediate",
        state: {
          ...state,
          edges: state.edges.map((edge) => ({ ...edge, selected: false })),
          newlyCreatedNodeId:
            newNode.data.type === "action" && !newNode.data.config?.actionType
              ? newNode.id
              : state.newlyCreatedNodeId,
          nodes: [...updatedNodes, newNode],
          selectedEdgeId: null,
          selectedNodeId: newNode.id,
        },
      });
    }
    case "apply-node-changes": {
      const filteredChanges = command.changes.filter((change) => {
        if (change.type !== "remove") {
          return true;
        }
        const nodeToRemove = state.nodes.find((node) => node.id === change.id);
        return nodeToRemove?.data.type !== "trigger";
      });
      const changedNodes = applyNodeChanges(
        filteredChanges,
        state.nodes
      ) as WorkflowNode[];
      const nextNodes = changedNodes.map((node) =>
        node.data.block
          ? {
              ...node,
              data: {
                ...node.data,
                block: {
                  ...node.data.block,
                  position: node.position,
                  updatedAt: new Date().toISOString(),
                },
              },
            }
          : node
      );
      const selectedNode = nextNodes.find((node) => node.selected);
      const selectedNodeStillExists = nextNodes.some(
        (node) => node.id === state.selectedNodeId
      );
      const hadDeletions = filteredChanges.some(
        (change) => change.type === "remove"
      );
      const hadPositionChanges = filteredChanges.some(
        (change) => change.type === "position" && change.dragging === false
      );
      const events: WorkflowChangeEvent[] = [];
      let saveMode: WorkflowCommandResult["saveMode"] = "none";
      if (hadDeletions) {
        events.push(
          event({
            message: "Deleted selected block from canvas.",
            type: command.type,
          })
        );
        saveMode = "immediate";
      } else if (hadPositionChanges) {
        events.push(
          event({
            message: "Moved block on canvas.",
            type: command.type,
          })
        );
        saveMode = "debounced";
      }
      const auditEvents: WorkflowAuditEvent[] = [];
      for (const change of filteredChanges) {
        if (change.type === "remove") {
          const removedNode = state.nodes.find((node) => node.id === change.id);
          if (removedNode) {
            auditEvents.push(
              auditEvent({
                before: summarizeBlockForAudit(removedNode),
                state,
                targetObjectId: removedNode.id,
                targetObjectType: "block",
                type: "block_deleted",
              })
            );
          }
        }
        if (change.type === "position" && change.dragging === false) {
          const beforeNode = state.nodes.find((node) => node.id === change.id);
          const afterNode = nextNodes.find((node) => node.id === change.id);
          if (beforeNode && afterNode) {
            auditEvents.push(
              auditEvent({
                after: summarizeBlockForAudit(afterNode),
                before: summarizeBlockForAudit(beforeNode),
                reason: "Canvas position changed.",
                state,
                targetObjectId: afterNode.id,
                targetObjectType: "block",
                type: "block_updated",
              })
            );
          }
        }
      }
      let newlyCreatedNodeId: string | null = null;
      if (selectedNode && state.newlyCreatedNodeId === selectedNode.id) {
        newlyCreatedNodeId = state.newlyCreatedNodeId;
      }
      let selectedNodeId: string | null = null;
      if (selectedNode) {
        selectedNodeId = selectedNode.id;
      } else if (selectedNodeStillExists) {
        selectedNodeId = state.selectedNodeId;
      }

      return changed({
        auditEvents,
        events,
        history: hadDeletions,
        saveMode,
        state: {
          ...state,
          newlyCreatedNodeId,
          nodes: nextNodes,
          selectedEdgeId: selectedNode ? null : state.selectedEdgeId,
          selectedNodeId,
        },
      });
    }
    case "apply-edge-changes": {
      const nextEdges = applyEdgeChanges(
        command.changes,
        state.edges
      ) as WorkflowEdge[];
      const selectedEdge = nextEdges.find((edge) => edge.selected);
      const selectedEdgeStillExists = nextEdges.some(
        (edge) => edge.id === state.selectedEdgeId
      );
      const hadDeletions = command.changes.some(
        (change) => change.type === "remove"
      );
      let selectedEdgeId: string | null = null;
      if (selectedEdge) {
        selectedEdgeId = selectedEdge.id;
      } else if (selectedEdgeStillExists) {
        selectedEdgeId = state.selectedEdgeId;
      }
      const auditEvents = command.changes.flatMap((change) => {
        if (change.type !== "remove") {
          return [];
        }
        const removedEdge = state.edges.find((edge) => edge.id === change.id);
        return removedEdge
          ? [
              auditEvent({
                before: summarizeEdgeForAudit(removedEdge),
                state,
                targetObjectId: removedEdge.id,
                targetObjectType: "edge",
                type: "edge_deleted",
              }),
            ]
          : [];
      });

      return changed({
        auditEvents,
        events: hadDeletions
          ? [
              event({
                message: "Deleted selected relationship from canvas.",
                type: command.type,
              }),
            ]
          : [],
        history: hadDeletions,
        saveMode: hadDeletions ? "immediate" : "none",
        state: {
          ...state,
          activeTab: selectedEdge ? "properties" : state.activeTab,
          edges: nextEdges,
          selectedEdgeId,
          selectedNodeId: selectedEdge ? null : state.selectedNodeId,
        },
      });
    }
    case "connect-blocks": {
      const sourceNode = state.nodes.find(
        (node) => node.id === command.connection.source
      );
      const targetNode = state.nodes.find(
        (node) => node.id === command.connection.target
      );
      const sourceBlock = sourceNode?.data.block;
      const targetBlock = targetNode?.data.block;
      const edgeDefaults =
        sourceBlock && targetBlock
          ? getWorkflowEdgeDefaults({ sourceBlock, targetBlock })
          : null;

      if (!(edgeDefaults && sourceBlock && targetBlock)) {
        return unchanged(
          state,
          "This relationship is not valid for the selected block families."
        );
      }

      const workflowEdge = createWorkflowEdgeRecord({
        id: command.id || nanoid(),
        bindingLabel: edgeDefaults.bindingLabel,
        bindingStatus: edgeDefaults.bindingStatus,
        sourceBlockId: command.connection.source,
        sourceOutputRole: edgeDefaults.sourceOutputRole,
        targetBlockId: command.connection.target,
        targetInputRole: edgeDefaults.targetInputRole,
        relationshipType: edgeDefaults.relationshipType,
        reason: edgeDefaults.reason,
      });
      const canvasEdge: WorkflowEdge = {
        ...createCanvasEdgeFromWorkflowEdge(workflowEdge),
        sourceHandle: command.connection.sourceHandle,
        targetHandle: command.connection.targetHandle,
      };

      return changed({
        auditEvents: [
          auditEvent({
            after: summarizeEdgeForAudit(canvasEdge),
            metadata: {
              relationshipType: workflowEdge.relationshipType,
              sourceBlockId: sourceBlock.id,
              targetBlockId: targetBlock.id,
            },
            reason: workflowEdge.reason,
            state,
            targetObjectId: workflowEdge.id,
            targetObjectType: "edge",
            type: "edge_created",
          }),
        ],
        events: [
          event({
            message: `Connected ${sourceBlock.label} to ${targetBlock.label}.`,
            metadata: {
              relationshipType: workflowEdge.relationshipType,
              sourceFamily: sourceBlock.family,
              targetFamily: targetBlock.family,
            },
            subjectId: workflowEdge.id,
            type: command.type,
          }),
        ],
        history: true,
        saveMode: "immediate",
        state: {
          ...state,
          edges: [...state.edges, canvasEdge],
        },
      });
    }
    case "delete-block": {
      const nodeToDelete = state.nodes.find(
        (node) => node.id === command.nodeId
      );
      if (!nodeToDelete || nodeToDelete.data.type === "trigger") {
        return unchanged(state, "Trigger blocks cannot be deleted.");
      }

      return changed({
        auditEvents: [
          auditEvent({
            before: summarizeBlockForAudit(nodeToDelete),
            state,
            targetObjectId: nodeToDelete.id,
            targetObjectType:
              isGovernedValueBlock(nodeToDelete.data.block)
                ? "protected_block"
                : "block",
            type: "block_deleted",
          }),
        ],
        events: [
          event({
            message: `Deleted block ${nodeToDelete.data.label}.`,
            metadata: { family: nodeToDelete.data.block?.family },
            subjectId: nodeToDelete.id,
            type: command.type,
          }),
        ],
        history: true,
        saveMode: "immediate",
        state: {
          ...state,
          edges: state.edges.filter(
            (edge) =>
              edge.source !== command.nodeId && edge.target !== command.nodeId
          ),
          nodes: state.nodes.filter((node) => node.id !== command.nodeId),
          selectedNodeId:
            state.selectedNodeId === command.nodeId
              ? null
              : state.selectedNodeId,
        },
      });
    }
    case "delete-edge": {
      const edgeToDelete = state.edges.find(
        (edge) => edge.id === command.edgeId
      );
      if (!edgeToDelete) {
        return unchanged(state, "Relationship was not found.");
      }

      return changed({
        auditEvents: [
          auditEvent({
            before: summarizeEdgeForAudit(edgeToDelete),
            state,
            targetObjectId: edgeToDelete.id,
            targetObjectType: "edge",
            type: "edge_deleted",
          }),
        ],
        events: [
          event({
            message: "Deleted relationship.",
            subjectId: edgeToDelete.id,
            type: command.type,
          }),
        ],
        history: true,
        saveMode: "immediate",
        state: {
          ...state,
          edges: state.edges.filter((edge) => edge.id !== command.edgeId),
          selectedEdgeId:
            state.selectedEdgeId === command.edgeId
              ? null
              : state.selectedEdgeId,
        },
      });
    }
    case "delete-selected": {
      const selectedNodeIds = state.nodes
        .filter((node) => node.selected && node.data.type !== "trigger")
        .map((node) => node.id);
      const selectedEdgeIds = state.edges
        .filter((edge) => edge.selected)
        .map((edge) => edge.id);

      if (selectedNodeIds.length + selectedEdgeIds.length === 0) {
        return unchanged(state);
      }
      const auditEvents: WorkflowAuditEvent[] = [
        ...selectedNodeIds.flatMap((nodeId) => {
          const node = state.nodes.find((item) => item.id === nodeId);
          return node
            ? [
                auditEvent({
                  before: summarizeBlockForAudit(node),
                  state,
                  targetObjectId: node.id,
                  targetObjectType:
                    isGovernedValueBlock(node.data.block)
                      ? "protected_block"
                      : "block",
                  type: "block_deleted",
                }),
              ]
            : [];
        }),
        ...selectedEdgeIds.flatMap((edgeId) => {
          const edge = state.edges.find((item) => item.id === edgeId);
          return edge
            ? [
                auditEvent({
                  before: summarizeEdgeForAudit(edge),
                  state,
                  targetObjectId: edge.id,
                  targetObjectType: "edge",
                  type: "edge_deleted",
                }),
              ]
            : [];
        }),
      ];

      return changed({
        auditEvents,
        events: [
          event({
            message: "Deleted selected workflow items.",
            metadata: {
              edgeCount: selectedEdgeIds.length,
              nodeCount: selectedNodeIds.length,
            },
            type: command.type,
          }),
        ],
        history: true,
        saveMode: "immediate",
        state: {
          ...state,
          edges: state.edges.filter(
            (edge) =>
              !(
                edge.selected ||
                selectedNodeIds.includes(edge.source) ||
                selectedNodeIds.includes(edge.target)
              )
          ),
          nodes: state.nodes.filter((node) => {
            if (node.data.type === "trigger") {
              return true;
            }
            return !node.selected;
          }),
          selectedEdgeId: null,
          selectedNodeId: null,
        },
      });
    }
    case "update-block": {
      const oldNode = state.nodes.find((node) => node.id === command.id);
      if (!oldNode) {
        return unchanged(state, "Block was not found.");
      }

      const oldLabel = oldNode.data.label;
      const newLabel =
        oldNode.data.block?.source?.treatedAsEvidence &&
        oldNode.data.block.source.labelLocked &&
        command.data.label !== undefined
          ? oldNode.data.label
          : command.data.label;
      const isLabelChange = newLabel !== undefined && oldLabel !== newLabel;

      const nextNodes = state.nodes.map((node) => {
        if (node.id === command.id) {
          return { ...node, data: getUpdatedNodeData(node, command.data) };
        }

        if (isLabelChange && oldLabel) {
          const updatedConfig = updateTemplatesInConfig(
            node.data.config || {},
            command.id,
            oldLabel,
            newLabel
          );

          if (updatedConfig !== node.data.config) {
            return {
              ...node,
              data: {
                ...node.data,
                config: updatedConfig,
              },
            };
          }
        }

        return node;
      });
      const blockFamily = oldNode.data.block?.family;
      const updatedNode = nextNodes.find((node) => node.id === command.id);
      const isGoverned = isGovernedValueBlock(oldNode.data.block);
      const wasProtectedUnlock =
        isGoverned &&
        !oldNode.data.config?.protectedEditIntent &&
        Boolean(updatedNode?.data.config?.protectedEditIntent);
      let updateAuditType: WorkflowAuditEventType = "block_updated";
      if (isGoverned) {
        updateAuditType = wasProtectedUnlock
          ? "protected_block_unlocked"
          : "protected_block_updated";
      }
      const auditEvents =
        command.data.status || !updatedNode
          ? []
          : [
              auditEvent({
                after: summarizeBlockForAudit(updatedNode),
                before: summarizeBlockForAudit(oldNode),
                metadata: {
                  configKeysChanged: Object.keys(command.data.config || {}),
                  family: blockFamily,
                  sourceFieldsPreserved:
                    oldNode.data.block?.source?.immutable || undefined,
                },
                reason:
                  command.data.config?.protectedEditIntent &&
                  typeof command.data.config.protectedEditIntent === "string"
                    ? command.data.config.protectedEditIntent
                    : undefined,
                state,
                targetObjectId: command.id,
                targetObjectType:
                  isGoverned ? "protected_block" : "block",
                type: updateAuditType,
              }),
            ];

      return changed({
        auditEvents,
        events: command.data.status
          ? []
          : [
              event({
                message: `Updated block ${oldNode.data.label}.`,
                metadata: {
                  family: blockFamily,
                  protectedEditIntent: oldNode.data.block?.governance
                    ?.requiresUnlockToEdit
                    ? command.data.config?.protectedEditIntent
                    : undefined,
                  sourceFieldsPreserved:
                    oldNode.data.block?.source?.immutable || undefined,
                },
                subjectId: command.id,
                type: command.type,
              }),
            ],
        saveMode: command.data.status ? "none" : "debounced",
        state: {
          ...state,
          nodes: nextNodes,
        },
      });
    }
    case "update-edge": {
      const currentEdge = state.edges.find((edge) => edge.id === command.id);
      if (!currentEdge) {
        return unchanged(state, "Relationship was not found.");
      }

      const currentWorkflowEdge =
        currentEdge.data?.workflowEdge ||
        createWorkflowEdgeRecord({
          id: currentEdge.id,
          sourceBlockId: currentEdge.source,
          targetBlockId: currentEdge.target,
          reason: "Migrated visual connection to typed relationship.",
        });
      const relationshipType =
        command.updates.relationshipType ||
        currentWorkflowEdge.relationshipType;

      if (!isKnownWorkflowRelationshipType(relationshipType)) {
        return unchanged(state, "Relationship type is not recognized.");
      }

      const validation = assertRelationshipUpdateAllowed({
        currentEdge,
        nextRelationshipType: relationshipType,
        state,
      });
      if (!validation.ok) {
        return unchanged(state, validation.message);
      }

      const workflowEdge = updateWorkflowEdgeRecord(
        currentWorkflowEdge,
        command.updates
      );
      const canvasEdge = createCanvasEdgeFromWorkflowEdge(workflowEdge);
      const nextEdge = {
        ...currentEdge,
        ...canvasEdge,
      };

      return changed({
        auditEvents: [
          auditEvent({
            after: summarizeEdgeForAudit(nextEdge),
            before: summarizeEdgeForAudit(currentEdge),
            metadata: {
              relationshipType: workflowEdge.relationshipType,
              status: workflowEdge.status,
              updatedKeys: Object.keys(command.updates),
            },
            reason: workflowEdge.reason,
            state,
            targetObjectId: command.id,
            targetObjectType: "edge",
            type: "edge_updated",
          }),
        ],
        events: [
          event({
            message: "Updated relationship metadata.",
            metadata: {
              relationshipType: workflowEdge.relationshipType,
              status: workflowEdge.status,
            },
            subjectId: command.id,
            type: command.type,
          }),
        ],
        saveMode: "debounced",
        state: {
          ...state,
          edges: state.edges.map((edge) => {
            if (edge.id !== command.id) {
              return edge;
            }
            return {
              ...edge,
              ...canvasEdge,
              selected: edge.selected,
              sourceHandle: edge.sourceHandle,
              targetHandle: edge.targetHandle,
            };
          }),
        },
      });
    }
    case "split-edge": {
      const edge = state.edges.find((item) => item.id === command.edgeId);
      const sourceNode = edge
        ? state.nodes.find((node) => node.id === edge.source)
        : undefined;
      const targetNode = edge
        ? state.nodes.find((node) => node.id === edge.target)
        : undefined;
      const sourceBlock = sourceNode?.data.block;
      const targetBlock = targetNode?.data.block;
      const catalogItem = getCatalogItemOrFallback(command.catalogId);

      if (
        !(
          edge &&
          sourceNode &&
          targetNode &&
          sourceBlock &&
          targetBlock &&
          catalogItem
        )
      ) {
        return unchanged(state, "Unable to split this relationship safely.");
      }

      const insertedBlock = createWorkflowBlockFromCatalog(catalogItem.id, {
        id: command.insertedId || nanoid(),
        label: `${catalogItem.label} between ${sourceBlock.label} and ${targetBlock.label}`,
        description:
          "Inserted between an existing typed workflow relationship.",
        position: getInsertedBlockPosition({ sourceNode, targetNode }),
        status: "draft",
      });
      const sourceDefaults = getWorkflowEdgeDefaults({
        sourceBlock,
        targetBlock: insertedBlock,
      });
      const targetDefaults = getWorkflowEdgeDefaults({
        sourceBlock: insertedBlock,
        targetBlock,
      });

      if (!(sourceDefaults && targetDefaults)) {
        return unchanged(
          state,
          "That block cannot be inserted between this source and target with supported relationship types."
        );
      }

      const originalWorkflowEdge =
        edge.data?.workflowEdge ||
        createWorkflowEdgeRecord({
          id: edge.id,
          sourceBlockId: edge.source,
          targetBlockId: edge.target,
          reason: "Migrated visual connection before splitting.",
        });
      const [sourceToInserted, insertedToTarget] =
        createSplitWorkflowEdgeRecords({
          insertedBlock,
          originalEdge: {
            ...originalWorkflowEdge,
            relationshipType: sourceDefaults.relationshipType,
            reason: `${sourceDefaults.reason} Split from ${originalWorkflowEdge.id}.`,
          },
        });
      const targetEdge = {
        ...insertedToTarget,
        relationshipType: targetDefaults.relationshipType,
        reason: `${targetDefaults.reason} Split from ${originalWorkflowEdge.id}.`,
      };
      const insertedNode = createWorkflowNodeFromBlock(insertedBlock, {
        selected: true,
      });
      const auditEvents = [
        auditEvent({
          after: {
            insertedBlockId: insertedBlock.id,
            sourceEdgeId: sourceToInserted.id,
            targetEdgeId: targetEdge.id,
          },
          before: summarizeEdgeForAudit(edge),
          metadata: {
            catalogId: catalogItem.id,
            insertedFamily: insertedBlock.family,
            originalEdgeId: originalWorkflowEdge.id,
          },
          reason: "Inserted a block into an existing relationship.",
          state,
          targetObjectId: originalWorkflowEdge.id,
          targetObjectType: "edge",
          type: "edge_split",
        }),
      ];
      if (sourceBlock.family === "Source" && insertedBlock.family === "Logic") {
        auditEvents.push(
          auditEvent({
            after: summarizeBlockForAudit(insertedNode),
            metadata: {
              catalogId: catalogItem.id,
              sourceBlockId: sourceBlock.id,
            },
            reason: "Created downstream Logic from Source evidence.",
            sourceId: sourceBlock.id,
            state,
            targetObjectId: insertedBlock.id,
            targetObjectType: "block",
            type: "source_derived_logic_created",
          })
        );
      }

      return changed({
        auditEvents,
        events: [
          event({
            message: `Inserted ${insertedBlock.label} between relationship endpoints.`,
            metadata: {
              catalogId: catalogItem.id,
              originalEdgeId: originalWorkflowEdge.id,
            },
            subjectId: insertedBlock.id,
            type: command.type,
          }),
        ],
        history: true,
        saveMode: "immediate",
        state: {
          ...state,
          activeTab: "properties",
          edges: [
            ...state.edges
              .filter((item) => item.id !== edge.id)
              .map((item) => ({ ...item, selected: false })),
            createCanvasEdgeFromWorkflowEdge(sourceToInserted),
            createCanvasEdgeFromWorkflowEdge(targetEdge),
          ],
          nodes: [
            ...state.nodes.map((node) => ({ ...node, selected: false })),
            insertedNode,
          ],
          selectedEdgeId: null,
          selectedNodeId: insertedBlock.id,
        },
      });
    }
    case "clear-workflow": {
      return changed({
        events: [
          event({
            message: "Cleared workflow draft.",
            metadata: {
              edgeCount: state.edges.length,
              nodeCount: state.nodes.length,
            },
            type: command.type,
          }),
        ],
        history: true,
        saveMode: "none",
        state: {
          ...state,
          edges: [],
          nodes: [],
          selectedEdgeId: null,
          selectedNodeId: null,
        },
      });
    }
    default:
      return unchanged(state);
  }
}
