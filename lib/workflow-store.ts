import type { Edge, EdgeChange, Node, NodeChange } from "@xyflow/react";
import { atom, type Getter, type Setter } from "jotai";
import { appendWorkflowChangeEvents } from "@/src/audit/change-log";
import type { WorkflowAuditEvent } from "@/src/audit/workflow-events";
import {
  runWorkflowCommand,
  type WorkflowChangeEvent,
  type WorkflowCommand,
  type WorkflowCommandState,
} from "@/src/state/workflow-commands";
import { api } from "./api-client";
import type {
  WorkflowBlock,
  WorkflowEvent,
  WorkflowEdge as WorkflowSchemaEdge,
} from "./local-fiscal-workflow";
import {
  isLocalWorkflowId,
  LOCAL_WORKFLOW_ID,
  saveLocalWorkflowSnapshot,
} from "./local-fiscal-workflow";

export type WorkflowNodeType = "trigger" | "action" | "add";

export type WorkflowNodeData = {
  label: string;
  description?: string;
  type: WorkflowNodeType;
  config?: Record<string, unknown>;
  visualLevel?: "L1" | "L2" | "L3";
  visualRole?:
    | "trigger"
    | "stage"
    | "step"
    | "calculation"
    | "review"
    | "validation"
    | "source"
    | "evidence"
    | "logic"
    | "protected"
    | "field"
    | "output";
  status?: "idle" | "running" | "success" | "error";
  block?: WorkflowBlock;
  enabled?: boolean; // Whether the step is enabled (defaults to true)
  onClick?: () => void; // For the "add" node type
};

export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdgeData = Record<string, unknown> & {
  workflowEdge?: WorkflowSchemaEdge;
  relationshipType?: WorkflowSchemaEdge["relationshipType"];
  status?: WorkflowSchemaEdge["status"];
  runStatus?: "error" | "idle" | "running" | "success" | "warning";
  runStatusRunId?: string;
  confidence?: number;
  sourceOutputRole?: string;
  targetInputRole?: string;
  bindingLabel?: string;
  bindingStatus?: WorkflowSchemaEdge["bindingStatus"];
};
export type WorkflowEdge = Edge<WorkflowEdgeData>;

// Workflow visibility type
export type WorkflowVisibility = "private" | "public";

// Atoms for workflow state (now backed by database)
export const nodesAtom = atom<WorkflowNode[]>([]);
export const edgesAtom = atom<WorkflowEdge[]>([]);
export const selectedNodeAtom = atom<string | null>(null);
export const selectedEdgeAtom = atom<string | null>(null);
export const localWorkflowRevisionAtom = atom(0);
export const isExecutingAtom = atom(false);
export const isLoadingAtom = atom(false);
export const isGeneratingAtom = atom(false);
export const currentWorkflowIdAtom = atom<string | null>(null);
export const currentWorkflowNameAtom = atom<string>("");
export const currentWorkflowVisibilityAtom =
  atom<WorkflowVisibility>("private");
export const isWorkflowOwnerAtom = atom<boolean>(true); // Whether current user owns this workflow

// UI state atoms
export const propertiesPanelActiveTabAtom = atom<string>("properties");
export const showMinimapAtom = atom(false);
export const selectedExecutionIdAtom = atom<string | null>(null);
export const rightPanelWidthAtom = atom<string | null>(null);
export const isPanelAnimatingAtom = atom<boolean>(false);
export const hasSidebarBeenShownAtom = atom<boolean>(false);
export const isSidebarCollapsedAtom = atom<boolean>(true);
export const isBottomPanelExpandedAtom = atom<boolean>(false);
export const isTransitioningFromHomepageAtom = atom<boolean>(false);

export type ActiveRightPanel = "runtime-preview" | "ai-panel" | "pages" | "settings" | null;
export const activeRightPanelAtom = atom<ActiveRightPanel>(null);
export const triggerFitViewAtom = atom<boolean>(false);

// ── Builder focus (chat → builder deep-link) ──────────────────────────────────
/** Set before navigating to /builder to load a specific workflow template and
 *  focus one block. Read + cleared by the builder page on mount. */
export const builderFocusTargetAtom = atom<{ workflowId: string; blockId: string } | null>(null);
/** When set, the canvas scrolls to + centers on this node id, then clears. */
export const focusNodeIdAtom = atom<string | null>(null);

// Tracks nodes that are pending integration auto-select check
// Don't show "missing integration" warning for these nodes
export const pendingIntegrationNodesAtom = atom<Set<string>>(new Set<string>());

// Tracks the ID of a newly created node (for auto-focusing search input)
// Cleared when the node gets an action type or is deselected
export const newlyCreatedNodeIdAtom = atom<string | null>(null);

// Trigger execute atom - set to true to trigger workflow execution
// This allows keyboard shortcuts to trigger the same execute flow as the button
export const triggerExecuteAtom = atom(false);

// Execution log entry type for storing run outputs per node
export type ExecutionLogEntry = {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  status: "pending" | "running" | "success" | "error";
  output?: unknown;
};

// Map of nodeId -> execution log entry for the currently selected execution
export const executionLogsAtom = atom<Record<string, ExecutionLogEntry>>({});
export const workflowChangeEventsAtom = atom<WorkflowChangeEvent[]>([]);
export const workflowAuditEventsAtom = atom<WorkflowAuditEvent[]>([]);

function toWorkflowEvent(change: WorkflowChangeEvent): WorkflowEvent {
  return {
    id: change.id,
    type: "workflow_command",
    message: change.message,
    createdAt: change.createdAt,
    createdBy: change.createdBy,
    details: {
      commandType: change.type,
      ...(change.subjectId ? { subjectId: change.subjectId } : {}),
      ...(change.metadata ? change.metadata : {}),
    },
  };
}

function getWorkflowCommandState(get: Getter): WorkflowCommandState {
  return {
    activeTab: get(propertiesPanelActiveTabAtom),
    edges: get(edgesAtom),
    newlyCreatedNodeId: get(newlyCreatedNodeIdAtom),
    nodes: get(nodesAtom),
    selectedEdgeId: get(selectedEdgeAtom),
    selectedNodeId: get(selectedNodeAtom),
    workflowId: get(currentWorkflowIdAtom) || LOCAL_WORKFLOW_ID,
  };
}

function commitWorkflowCommand(
  get: Getter,
  set: Setter,
  command: WorkflowCommand
) {
  const currentNodes = get(nodesAtom);
  const currentEdges = get(edgesAtom);
  const result = runWorkflowCommand(getWorkflowCommandState(get), command);

  if (!result.ok) {
    return result;
  }

  if (result.history) {
    set(historyAtom, [
      ...get(historyAtom),
      { edges: currentEdges, nodes: currentNodes },
    ]);
    set(futureAtom, []);
  }

  set(nodesAtom, result.state.nodes);
  set(edgesAtom, result.state.edges);
  set(selectedNodeAtom, result.state.selectedNodeId);
  set(selectedEdgeAtom, result.state.selectedEdgeId);
  if (result.state.activeTab) {
    set(propertiesPanelActiveTabAtom, result.state.activeTab);
  }
  if (result.state.newlyCreatedNodeId !== undefined) {
    set(newlyCreatedNodeIdAtom, result.state.newlyCreatedNodeId);
  }
  if (result.events.length > 0) {
    set(workflowChangeEventsAtom, [
      ...get(workflowChangeEventsAtom),
      ...result.events,
    ]);
  }
  if (result.auditEvents.length > 0) {
    set(workflowAuditEventsAtom, [
      ...result.auditEvents,
      ...get(workflowAuditEventsAtom),
    ]);
    appendWorkflowChangeEvents(result.auditEvents);
  }

  if (result.saveMode !== "none") {
    const latestEvent = result.events.at(-1);
    set(hasUnsavedChangesAtom, true);
    set(autosaveAtom, {
      event: latestEvent ? toWorkflowEvent(latestEvent) : undefined,
      immediate: result.saveMode === "immediate",
    });
  }

  return result;
}

// Autosave functionality
let autosaveTimeoutId: NodeJS.Timeout | null = null;
const AUTOSAVE_DELAY = 1000; // 1 second debounce for field typing

// Autosave atom that handles saving workflow state
export const autosaveAtom = atom(
  null,
  async (
    get,
    set,
    options?: { event?: WorkflowEvent; immediate?: boolean }
  ) => {
    const workflowId = get(currentWorkflowIdAtom);
    const nodes = get(nodesAtom);
    const edges = get(edgesAtom);
    const workflowName = get(currentWorkflowNameAtom);

    // Only autosave if we have a workflow ID
    if (!workflowId) {
      return;
    }

    const saveFunc = async () => {
      try {
        if (isLocalWorkflowId(workflowId)) {
          saveLocalWorkflowSnapshot({
            edges,
            event: options?.event,
            name: workflowName,
            nodes,
            status: "draft",
          });
          set(localWorkflowRevisionAtom, get(localWorkflowRevisionAtom) + 1);
          set(hasUnsavedChangesAtom, false);
          return;
        }

        await api.workflow.update(workflowId, { nodes, edges });
        // Clear the unsaved changes indicator after successful save
        set(hasUnsavedChangesAtom, false);
      } catch (error) {
        console.error("Autosave failed:", error);
      }
    };

    if (options?.immediate) {
      // Save immediately (for add/delete/connect operations)
      await saveFunc();
    } else {
      // Debounce for typing operations
      if (autosaveTimeoutId) {
        clearTimeout(autosaveTimeoutId);
      }
      autosaveTimeoutId = setTimeout(saveFunc, AUTOSAVE_DELAY);
    }
  }
);

// Derived atoms for node/edge operations
export const onNodesChangeAtom = atom(
  null,
  (get, set, changes: NodeChange[]) => {
    commitWorkflowCommand(get, set, { changes, type: "apply-node-changes" });
  }
);

export const onEdgesChangeAtom = atom(
  null,
  (get, set, changes: EdgeChange[]) => {
    commitWorkflowCommand(get, set, { changes, type: "apply-edge-changes" });
  }
);

export const addNodeAtom = atom(null, (get, set, node: WorkflowNode) => {
  commitWorkflowCommand(get, set, { node, type: "add-block" });
});

export const connectBlocksAtom = atom(
  null,
  (
    get,
    set,
    connection: {
      source: string;
      sourceHandle?: string | null;
      target: string;
      targetHandle?: string | null;
    }
  ) =>
    commitWorkflowCommand(get, set, {
      connection,
      type: "connect-blocks",
    })
);

export const updateNodeDataAtom = atom(
  null,
  (get, set, { id, data }: { id: string; data: Partial<WorkflowNodeData> }) => {
    commitWorkflowCommand(get, set, { data, id, type: "update-block" });
  }
);

export const deleteNodeAtom = atom(null, (get, set, nodeId: string) => {
  commitWorkflowCommand(get, set, { nodeId, type: "delete-block" });
});

export const deleteEdgeAtom = atom(null, (get, set, edgeId: string) => {
  commitWorkflowCommand(get, set, { edgeId, type: "delete-edge" });
});

export const updateEdgeDataAtom = atom(
  null,
  (
    get,
    set,
    {
      id,
      updates,
    }: {
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
    }
  ) => {
    commitWorkflowCommand(get, set, { id, type: "update-edge", updates });
  }
);

export const insertBlockBetweenEdgeAtom = atom(
  null,
  (get, set, { catalogId, edgeId }: { catalogId: string; edgeId: string }) => {
    const result = commitWorkflowCommand(get, set, {
      catalogId,
      edgeId,
      type: "split-edge",
    });

    return {
      ok: result.ok,
      message:
        result.message ||
        result.events.at(-1)?.message ||
        "Relationship split completed.",
    };
  }
);

export const deleteSelectedItemsAtom = atom(null, (get, set) => {
  commitWorkflowCommand(get, set, { type: "delete-selected" });
});

export const clearWorkflowAtom = atom(null, (get, set) => {
  commitWorkflowCommand(get, set, { type: "clear-workflow" });
});

// Load workflow from database
export const loadWorkflowAtom = atom(null, async (_get, set) => {
  try {
    set(isLoadingAtom, true);
    const workflow = await api.workflow.getCurrent();
    set(nodesAtom, workflow.nodes);
    set(edgesAtom, workflow.edges);
    if (workflow.id) {
      set(currentWorkflowIdAtom, workflow.id);
    }
  } catch (error) {
    console.error("Failed to load workflow:", error);
  } finally {
    set(isLoadingAtom, false);
  }
});

// Save workflow with a name
export const saveWorkflowAsAtom = atom(
  null,
  async (
    get,
    _set,
    { name, description }: { name: string; description?: string }
  ) => {
    const nodes = get(nodesAtom);
    const edges = get(edgesAtom);

    try {
      const workflow = await api.workflow.create({
        name,
        description,
        nodes,
        edges,
      });
      return workflow;
    } catch (error) {
      console.error("Failed to save workflow:", error);
      throw error;
    }
  }
);

// Workflow toolbar UI state atoms
export const showClearDialogAtom = atom(false);
export const showDeleteDialogAtom = atom(false);
export const isSavingAtom = atom(false);
export const hasUnsavedChangesAtom = atom(false);
export const workflowNotFoundAtom = atom(false);

// Undo/Redo state
type HistoryState = {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
};

const historyAtom = atom<HistoryState[]>([]);
const futureAtom = atom<HistoryState[]>([]);

// Undo atom
export const undoAtom = atom(null, (get, set) => {
  const history = get(historyAtom);
  if (history.length === 0) {
    return;
  }

  const currentNodes = get(nodesAtom);
  const currentEdges = get(edgesAtom);
  const future = get(futureAtom);

  // Save current state to future
  set(futureAtom, [...future, { nodes: currentNodes, edges: currentEdges }]);

  // Pop from history and set as current
  const newHistory = [...history];
  const previousState = newHistory.pop();
  if (!previousState) {
    return; // No history to undo
  }
  set(historyAtom, newHistory);
  set(nodesAtom, previousState.nodes);
  set(edgesAtom, previousState.edges);

  // Mark as having unsaved changes
  set(hasUnsavedChangesAtom, true);
});

// Redo atom
export const redoAtom = atom(null, (get, set) => {
  const future = get(futureAtom);
  if (future.length === 0) {
    return;
  }

  const currentNodes = get(nodesAtom);
  const currentEdges = get(edgesAtom);
  const history = get(historyAtom);

  // Save current state to history
  set(historyAtom, [...history, { nodes: currentNodes, edges: currentEdges }]);

  // Pop from future and set as current
  const newFuture = [...future];
  const nextState = newFuture.pop();
  if (!nextState) {
    return; // No future to redo
  }
  set(futureAtom, newFuture);
  set(nodesAtom, nextState.nodes);
  set(edgesAtom, nextState.edges);

  // Mark as having unsaved changes
  set(hasUnsavedChangesAtom, true);
});

// Can undo/redo atoms
export const canUndoAtom = atom((get) => get(historyAtom).length > 0);
export const canRedoAtom = atom((get) => get(futureAtom).length > 0);

// Clear all node statuses (used when clearing runs)
export const clearNodeStatusesAtom = atom(null, (get, set) => {
  const currentNodes = get(nodesAtom);
  const newNodes = currentNodes.map((node) => ({
    ...node,
    data: { ...node.data, status: "idle" as const },
  }));
  set(nodesAtom, newNodes);
});
