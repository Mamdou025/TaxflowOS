"use client";

import { useReactFlow } from "@xyflow/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  Check,
  ChevronDown,
  Copy,
  Download,
  Globe,
  Loader2,
  Lock,
  Play,
  Plus,
  Redo2,
  RotateCcw,
  Save,
  Settings2,
  Trash2,
  Undo2,
  Upload,
} from "lucide-react";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api-client";
import { authClient, useSession } from "@/lib/auth-client";
import { integrationsAtom } from "@/lib/integrations-store";
import {
  createDefaultWorkflowBlockCandidate,
  createExpandedMappingPipelineDemoWorkflow,
  createFapiSampleWorkflow,
  createSingleItemPipelineDemoWorkflow,
  createWorkflowBlockFromCatalog,
  createWorkflowEvent,
  createWorkflowNodeFromBlock,
  createWorkingSourceRulesDemoWorkflow,
  isLocalWorkflowId,
  LOCAL_WORKFLOW_ID,
  type LocalRunRecord,
  loadLocalWorkflowSnapshot,
  parseLocalWorkflowJson,
  publishLocalWorkflowSnapshot,
  saveLocalRunRecord,
  saveLocalWorkflowSnapshot,
  saveWorkflowDefinitionSnapshot,
  workflowDefinitionToCanvas,
} from "@/lib/local-fiscal-workflow";
import {
  type LocalEdgeRunStatus,
  runLocalWorkflowTools,
} from "@/lib/local-tool-runner";
import type { IntegrationType } from "@/lib/types/integration";
import {
  addNodeAtom,
  canRedoAtom,
  canUndoAtom,
  clearWorkflowAtom,
  currentWorkflowIdAtom,
  currentWorkflowNameAtom,
  currentWorkflowVisibilityAtom,
  deleteEdgeAtom,
  deleteNodeAtom,
  edgesAtom,
  executionLogsAtom,
  hasUnsavedChangesAtom,
  isExecutingAtom,
  isGeneratingAtom,
  isSavingAtom,
  isWorkflowOwnerAtom,
  nodesAtom,
  propertiesPanelActiveTabAtom,
  redoAtom,
  rightPanelWidthAtom,
  selectedEdgeAtom,
  selectedExecutionIdAtom,
  selectedNodeAtom,
  triggerExecuteAtom,
  undoAtom,
  updateNodeDataAtom,
  type WorkflowEdge,
  type WorkflowNode,
  type WorkflowVisibility,
} from "@/lib/workflow-store";
import {
  findActionById,
  flattenConfigFields,
  getIntegrationLabels,
} from "@/plugins";
import { appendWorkflowChangeEvent } from "@/src/audit/change-log";
import {
  createWorkflowAuditEvent,
  summarizeWorkflowForAudit,
  type WorkflowAuditEventType,
} from "@/src/audit/workflow-events";
import { Panel } from "../ai-elements/panel";
import { DeployButton } from "../deploy-button";
import { GitHubStarsButton } from "../github-stars-button";
import { ConfigurationOverlay } from "../overlays/configuration-overlay";
import { ConfirmOverlay } from "../overlays/confirm-overlay";
import { ExportWorkflowOverlay } from "../overlays/export-workflow-overlay";
import { MakePublicOverlay } from "../overlays/make-public-overlay";
import { useOverlay } from "../overlays/overlay-provider";
import { WorkflowIssuesOverlay } from "../overlays/workflow-issues-overlay";
import { WorkflowIcon } from "../ui/workflow-icon";
import { UserMenu } from "../workflows/user-menu";
import {
  buildFapiWorkbookImportPatch,
  parseExcelWorkbookFile,
} from "./source-viewers/excel-utils";

type WorkflowToolbarProps = {
  workflowId?: string;
};

const LOCAL_PUBLISH_STATUS_KEY = "workflow-studio.publish-status";

type LocalPublishStatus = "draft" | "published";

// Helper functions to reduce complexity
function updateNodesStatus(
  nodes: WorkflowNode[],
  updateNodeData: (update: {
    id: string;
    data: { status?: "idle" | "running" | "success" | "error" };
  }) => void,
  status: "idle" | "running" | "success" | "error"
) {
  for (const node of nodes) {
    updateNodeData({ id: node.id, data: { status } });
  }
}

function isLocalToolWorkflow(nodes: WorkflowNode[]) {
  return nodes.some((node) => {
    const toolId = String(
      node.data.block?.config?.toolId || node.data.config?.toolId || ""
    );
    return ["source.", "logic.", "review.", "protected.", "output."].some(
      (prefix) => toolId.startsWith(prefix)
    );
  });
}

function createExecutionLogsMap(logs: LocalRunRecord["logs"]) {
  return Object.fromEntries(
    logs.map((log) => [
      log.nodeId,
      {
        nodeId: log.nodeId,
        nodeName: log.nodeName,
        nodeType: log.nodeType,
        status: log.status,
        output: log.output,
      },
    ])
  );
}

function applyEdgeRunStatuses({
  edges,
  edgeStatuses,
  runId,
}: {
  edges: WorkflowEdge[];
  edgeStatuses: Record<string, LocalEdgeRunStatus>;
  runId: string;
}) {
  return edges.map((edge) => ({
    ...edge,
    data: {
      ...edge.data,
      runStatus: edgeStatuses[edge.id] || "idle",
      runStatusRunId: runId,
    },
  }));
}

type MissingIntegrationInfo = {
  integrationType: IntegrationType;
  integrationLabel: string;
  nodeNames: string[];
};

// Built-in actions that require integrations but aren't in the plugin registry
const BUILTIN_ACTION_INTEGRATIONS: Record<string, IntegrationType> = {
  "Database Query": "database",
};

// Labels for built-in integration types that don't have plugins
const BUILTIN_INTEGRATION_LABELS: Record<string, string> = {
  database: "Database",
};

// Type for broken template reference info
type BrokenTemplateReferenceInfo = {
  nodeId: string;
  nodeLabel: string;
  brokenReferences: Array<{
    fieldKey: string;
    fieldLabel: string;
    referencedNodeId: string;
    displayText: string;
  }>;
};

// Extract template variables from a string and check if they reference existing nodes
function extractTemplateReferences(
  value: unknown
): Array<{ nodeId: string; displayText: string }> {
  if (typeof value !== "string") {
    return [];
  }

  const pattern = /\{\{@([^:]+):([^}]+)\}\}/g;
  const matches = value.matchAll(pattern);

  return Array.from(matches).map((match) => ({
    nodeId: match[1],
    displayText: match[2],
  }));
}

// Recursively extract all template references from a config object
function extractAllTemplateReferences(
  config: Record<string, unknown>,
  prefix = ""
): Array<{ field: string; nodeId: string; displayText: string }> {
  const results: Array<{ field: string; nodeId: string; displayText: string }> =
    [];

  for (const [key, value] of Object.entries(config)) {
    const fieldPath = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "string") {
      const refs = extractTemplateReferences(value);
      for (const ref of refs) {
        results.push({ field: fieldPath, ...ref });
      }
    } else if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      results.push(
        ...extractAllTemplateReferences(
          value as Record<string, unknown>,
          fieldPath
        )
      );
    }
  }

  return results;
}

// Get broken template references for workflow nodes
function getBrokenTemplateReferences(
  nodes: WorkflowNode[]
): BrokenTemplateReferenceInfo[] {
  const nodeIds = new Set(nodes.map((n) => n.id));
  const brokenByNode: BrokenTemplateReferenceInfo[] = [];

  for (const node of nodes) {
    // Skip disabled nodes
    if (node.data.enabled === false) {
      continue;
    }

    const config = node.data.config as Record<string, unknown> | undefined;
    if (!config || typeof config !== "object") {
      continue;
    }

    const allRefs = extractAllTemplateReferences(config);
    const brokenRefs = allRefs.filter((ref) => !nodeIds.has(ref.nodeId));

    if (brokenRefs.length > 0) {
      // Get action for label lookups
      const actionType = config.actionType as string | undefined;
      const action = actionType ? findActionById(actionType) : undefined;
      const flatFields = action ? flattenConfigFields(action.configFields) : [];

      brokenByNode.push({
        nodeId: node.id,
        nodeLabel: node.data.label || action?.label || "Unnamed Step",
        brokenReferences: brokenRefs.map((ref) => {
          // Look up human-readable field label
          const configField = flatFields.find((f) => f.key === ref.field);
          return {
            fieldKey: ref.field,
            fieldLabel: configField?.label || ref.field,
            referencedNodeId: ref.nodeId,
            displayText: ref.displayText,
          };
        }),
      });
    }
  }

  return brokenByNode;
}

// Type for missing required fields info
type MissingRequiredFieldInfo = {
  nodeId: string;
  nodeLabel: string;
  missingFields: Array<{
    fieldKey: string;
    fieldLabel: string;
  }>;
};

// Check if a field value is effectively empty
function isFieldEmpty(value: unknown): boolean {
  if (value === undefined || value === null) {
    return true;
  }
  if (typeof value === "string" && value.trim() === "") {
    return true;
  }
  return false;
}

// Check if a conditional field should be shown based on current config
function shouldShowField(
  field: { showWhen?: { field: string; equals: string } },
  config: Record<string, unknown>
): boolean {
  if (!field.showWhen) {
    return true;
  }
  return config[field.showWhen.field] === field.showWhen.equals;
}

// Get missing required fields for a single node
function getNodeMissingFields(
  node: WorkflowNode
): MissingRequiredFieldInfo | null {
  if (node.data.enabled === false) {
    return null;
  }

  const config = node.data.config as Record<string, unknown> | undefined;
  const actionType = config?.actionType as string | undefined;
  if (!actionType) {
    return null;
  }

  const action = findActionById(actionType);
  if (!action) {
    return null;
  }

  // Flatten grouped fields to check all required fields
  const flatFields = flattenConfigFields(action.configFields);

  const missingFields = flatFields
    .filter(
      (field) =>
        field.required &&
        shouldShowField(field, config || {}) &&
        isFieldEmpty(config?.[field.key])
    )
    .map((field) => ({
      fieldKey: field.key,
      fieldLabel: field.label,
    }));

  if (missingFields.length === 0) {
    return null;
  }

  return {
    nodeId: node.id,
    nodeLabel: node.data.label || action.label || "Unnamed Step",
    missingFields,
  };
}

// Get missing required fields for workflow nodes
function getMissingRequiredFields(
  nodes: WorkflowNode[]
): MissingRequiredFieldInfo[] {
  return nodes
    .map(getNodeMissingFields)
    .filter((result): result is MissingRequiredFieldInfo => result !== null);
}

function isExcelSourceNode(node: WorkflowNode) {
  const block = node.data.block;
  const sourceKind = String(block?.config.sourceKind || "").toLowerCase();
  return (
    block?.family === "Source" &&
    (block.subtype === "Excel / Workbook" ||
      sourceKind.includes("excel") ||
      sourceKind.includes("workbook") ||
      block.catalogId === "source:excel-workbook")
  );
}

function isWorkflowNodeCatalog(node: WorkflowNode, catalogId: string) {
  return node.data.block?.catalogId === catalogId;
}

function isFapiInputsSourceNode(node: WorkflowNode) {
  return node.data.block?.config.sourceKind === "fapi_inputs";
}

function getFapiInputsPatchForWorkbookImport(
  fapiInputs: Record<string, unknown>
) {
  return Object.fromEntries(
    Object.entries(fapiInputs).filter(
      ([key]) => !["exchangeRate", "fxRate", "overrideRate"].includes(key)
    )
  );
}

function getFxRatePatchForWorkbookImport(fapiInputs: Record<string, unknown>) {
  const overrideRate =
    fapiInputs.overrideRate || fapiInputs.fxRate || fapiInputs.exchangeRate;
  return {
    documentCurrency: fapiInputs.documentCurrency,
    fapiYear: fapiInputs.fapiYear,
    overrideRate,
    reportingCurrency: fapiInputs.reportingCurrency,
  };
}

function applyWorkbookImportPatchToFapiNode({
  node,
  workbook,
  workbookImport,
}: {
  node: WorkflowNode;
  workbook: { fileName: string; workbookId: string };
  workbookImport: ReturnType<typeof buildFapiWorkbookImportPatch>;
}): WorkflowNode | null {
  if (
    isFapiInputsSourceNode(node) &&
    (workbookImport.importedSheets.fapiInputs ||
      Object.keys(workbookImport.expectedResults).length > 0)
  ) {
    return {
      ...applyConfigPatchToNode(node, {
        ...getFapiInputsPatchForWorkbookImport(workbookImport.fapiInputs),
        importedFromWorkbook: workbook.fileName,
        sourceLocator: `local-excel://${workbook.workbookId}/${encodeURIComponent(
          workbookImport.importedSheets.fapiInputs || "FAPI Inputs"
        )}`,
        sourceStatus: "draft",
      }),
      selected: false,
    };
  }

  if (
    isWorkflowNodeCatalog(node, "source:currency-rate") &&
    workbookImport.importedSheets.fapiInputs
  ) {
    return {
      ...applyConfigPatchToNode(node, {
        ...getFxRatePatchForWorkbookImport(workbookImport.fapiInputs),
        importedFromWorkbook: workbook.fileName,
        sourceLocator: `bank-of-canada://annual-average/${String(
          workbookImport.fapiInputs.documentCurrency || "USD"
        )}-${String(workbookImport.fapiInputs.reportingCurrency || "CAD")}/${String(
          workbookImport.fapiInputs.fapiYear || "current"
        )}`,
        sourceStatus: "draft",
      }),
      selected: false,
    };
  }

  return null;
}

function applyConfigPatchToNode(
  node: WorkflowNode,
  patch: Record<string, unknown>
): WorkflowNode {
  const block = node.data.block;
  if (!block) {
    return node;
  }
  const nextConfig = { ...block.config, ...patch };
  const nextBlock = {
    ...block,
    config: nextConfig,
    label:
      typeof patch.workbookName === "string"
        ? "Uploaded Workbook"
        : block.label,
    runtime: {
      ...block.runtime,
      outputKey: "selected_rows",
    },
    source: block.source
      ? {
          ...block.source,
          locator: String(nextConfig.sourceLocator || block.source.locator),
          valuePreview: `${String(nextConfig.selectedRowsCount || 0)} selected rows`,
        }
      : block.source,
    updatedAt: new Date().toISOString(),
    updatedBy: "workflow-studio",
  };

  return {
    ...node,
    data: {
      ...node.data,
      block: nextBlock,
      config: nextConfig,
      label: nextBlock.label,
    },
  };
}

function applyWorkbookImportPatchToNode({
  excelPatch,
  node,
  targetNodeId,
  workbook,
  workbookImport,
}: {
  excelPatch: Record<string, unknown>;
  node: WorkflowNode;
  targetNodeId: string;
  workbook: { fileName: string; workbookId: string };
  workbookImport: ReturnType<typeof buildFapiWorkbookImportPatch>;
}): WorkflowNode {
  if (node.id === targetNodeId) {
    return { ...applyConfigPatchToNode(node, excelPatch), selected: true };
  }

  if (
    isWorkflowNodeCatalog(node, "source:keyword-rules") &&
    workbookImport.keywordRules.length > 0
  ) {
    return {
      ...applyConfigPatchToNode(node, {
        importedFromWorkbook: workbook.fileName,
        keywordRules: workbookImport.keywordRules,
        sourceLocator: `local-excel://${workbook.workbookId}/${encodeURIComponent(
          workbookImport.importedSheets.keywordRules || "Keyword Rules"
        )}`,
        sourceStatus: "draft",
      }),
      selected: false,
    };
  }

  if (
    isWorkflowNodeCatalog(node, "source:aggregation-rules") &&
    workbookImport.aggregationRules.length > 0
  ) {
    return {
      ...applyConfigPatchToNode(node, {
        aggregationRules: workbookImport.aggregationRules,
        importedFromWorkbook: workbook.fileName,
        sourceLocator: `local-excel://${workbook.workbookId}/${encodeURIComponent(
          workbookImport.importedSheets.aggregationRules || "Aggregation Rules"
        )}`,
        sourceStatus: "draft",
      }),
      selected: false,
    };
  }

  const fapiPatchedNode = applyWorkbookImportPatchToFapiNode({
    node,
    workbook,
    workbookImport,
  });
  if (fapiPatchedNode) {
    return fapiPatchedNode;
  }

  return { ...node, selected: false };
}

// Get missing integrations for workflow nodes
// Uses the plugin registry to determine which integrations are required
// Also handles built-in actions that aren't in the plugin registry
function getMissingIntegrations(
  nodes: WorkflowNode[],
  userIntegrations: Array<{ id: string; type: IntegrationType }>
): MissingIntegrationInfo[] {
  const userIntegrationTypes = new Set(userIntegrations.map((i) => i.type));
  const userIntegrationIds = new Set(userIntegrations.map((i) => i.id));
  const missingByType = new Map<IntegrationType, string[]>();
  const integrationLabels = getIntegrationLabels();

  for (const node of nodes) {
    // Skip disabled nodes
    if (node.data.enabled === false) {
      continue;
    }

    const actionType = node.data.config?.actionType as string | undefined;
    if (!actionType) {
      continue;
    }

    // Look up the integration type from the plugin registry first
    const action = findActionById(actionType);
    // Fall back to built-in action integrations for actions not in the registry
    const requiredIntegrationType =
      action?.integration || BUILTIN_ACTION_INTEGRATIONS[actionType];

    if (!requiredIntegrationType) {
      continue;
    }

    // Check if this node has a valid integrationId configured
    // The integration must exist (not just be configured)
    const configuredIntegrationId = node.data.config?.integrationId as
      | string
      | undefined;
    const hasValidIntegration =
      configuredIntegrationId &&
      userIntegrationIds.has(configuredIntegrationId);
    if (hasValidIntegration) {
      continue;
    }

    // Check if user has any integration of this type
    if (!userIntegrationTypes.has(requiredIntegrationType)) {
      const existing = missingByType.get(requiredIntegrationType) || [];
      // Use human-readable label from registry if no custom label
      const actionInfo = findActionById(actionType);
      existing.push(node.data.label || actionInfo?.label || actionType);
      missingByType.set(requiredIntegrationType, existing);
    }
  }

  return Array.from(missingByType.entries()).map(
    ([integrationType, nodeNames]) => ({
      integrationType,
      integrationLabel:
        integrationLabels[integrationType] ||
        BUILTIN_INTEGRATION_LABELS[integrationType] ||
        integrationType,
      nodeNames,
    })
  );
}

type ExecuteTestWorkflowParams = {
  workflowId: string;
  nodes: WorkflowNode[];
  updateNodeData: (update: {
    id: string;
    data: { status?: "idle" | "running" | "success" | "error" };
  }) => void;
  pollingIntervalRef: React.MutableRefObject<NodeJS.Timeout | null>;
  setIsExecuting: (value: boolean) => void;
  setSelectedExecutionId: (value: string | null) => void;
};

type ExecuteLocalToolWorkflowParams = {
  edges: WorkflowEdge[];
  nodes: WorkflowNode[];
  setEdges: (edges: WorkflowEdge[]) => void;
  setExecutionLogs: WorkflowHandlerParams["setExecutionLogs"];
  setIsExecuting: (value: boolean) => void;
  setSelectedExecutionId: (value: string | null) => void;
  updateNodeData: WorkflowHandlerParams["updateNodeData"];
  workflowName: string;
};

function executeLocalToolWorkflow({
  edges,
  nodes,
  setEdges,
  setExecutionLogs,
  setIsExecuting,
  setSelectedExecutionId,
  updateNodeData,
  workflowName,
}: ExecuteLocalToolWorkflowParams) {
  try {
    const localRun = runLocalWorkflowTools({
      edges,
      nodes,
      workflowName,
    });
    saveLocalRunRecord(localRun.record);
    for (const [nodeId, status] of Object.entries(localRun.blockStatuses)) {
      updateNodeData({ id: nodeId, data: { status } });
    }
    setEdges(
      applyEdgeRunStatuses({
        edgeStatuses: localRun.edgeStatuses,
        edges: edges.map((edge) => ({ ...edge, selected: false })),
        runId: localRun.record.execution.id,
      })
    );
    setSelectedExecutionId(localRun.record.execution.id);
    setExecutionLogs(createExecutionLogsMap(localRun.record.logs));
    if (localRun.result.status === "success") {
      toast.success("Local tool workflow run completed");
    } else {
      toast.warning(
        `Local tool run completed with ${localRun.result.warnings.length} warning${localRun.result.warnings.length === 1 ? "" : "s"}`
      );
    }
  } catch (error) {
    console.error("Local tool workflow run failed:", error);
    updateNodesStatus(nodes, updateNodeData, "error");
    toast.error(
      error instanceof Error ? error.message : "Local tool workflow run failed"
    );
  } finally {
    setIsExecuting(false);
  }
}

async function executeTestWorkflow({
  workflowId,
  nodes,
  updateNodeData,
  pollingIntervalRef,
  setIsExecuting,
  setSelectedExecutionId,
}: ExecuteTestWorkflowParams) {
  // Set all nodes to idle first
  updateNodesStatus(nodes, updateNodeData, "idle");

  // Immediately set trigger nodes to running for instant visual feedback
  for (const node of nodes) {
    if (node.data.type === "trigger") {
      updateNodeData({ id: node.id, data: { status: "running" } });
    }
  }

  try {
    // Start the execution via API
    const response = await fetch(`/api/workflow/${workflowId}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: {} }),
    });

    if (!response.ok) {
      throw new Error("Failed to execute workflow");
    }

    const result = await response.json();

    // Select the new execution
    setSelectedExecutionId(result.executionId);

    // Poll for execution status updates
    const pollInterval = setInterval(async () => {
      try {
        const statusData = await api.workflow.getExecutionStatus(
          result.executionId
        );

        // Update node statuses based on the execution logs
        for (const nodeStatus of statusData.nodeStatuses) {
          updateNodeData({
            id: nodeStatus.nodeId,
            data: {
              status: nodeStatus.status as
                | "idle"
                | "running"
                | "success"
                | "error",
            },
          });
        }

        // Stop polling if execution is complete
        if (statusData.status !== "running") {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }

          setIsExecuting(false);

          // Don't reset node statuses - let them show the final state
          // The user can click another run or deselect to reset
        }
      } catch (error) {
        console.error("Failed to poll execution status:", error);
      }
    }, 500); // Poll every 500ms

    pollingIntervalRef.current = pollInterval;
  } catch (error) {
    console.error("Failed to execute workflow:", error);
    toast.error(
      error instanceof Error ? error.message : "Failed to execute workflow"
    );
    updateNodesStatus(nodes, updateNodeData, "error");
    setIsExecuting(false);
  }
}

// Hook for workflow handlers
type WorkflowHandlerParams = {
  currentWorkflowId: string | null;
  workflowName: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  updateNodeData: (update: {
    id: string;
    data: { status?: "idle" | "running" | "success" | "error" };
  }) => void;
  isExecuting: boolean;
  setIsExecuting: (value: boolean) => void;
  setIsSaving: (value: boolean) => void;
  setHasUnsavedChanges: (value: boolean) => void;
  setActiveTab: (value: string) => void;
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedExecutionId: (id: string | null) => void;
  setExecutionLogs: (
    logs: Record<
      string,
      {
        nodeId: string;
        nodeName: string;
        nodeType: string;
        status: "pending" | "running" | "success" | "error";
        output?: unknown;
      }
    >
  ) => void;
  userIntegrations: Array<{ id: string; type: IntegrationType }>;
};

function useWorkflowHandlers({
  currentWorkflowId,
  workflowName,
  nodes,
  edges,
  updateNodeData,
  isExecuting,
  setIsExecuting,
  setIsSaving,
  setHasUnsavedChanges,
  setActiveTab,
  setNodes,
  setEdges,
  setSelectedNodeId,
  setSelectedExecutionId,
  setExecutionLogs,
  userIntegrations,
}: WorkflowHandlerParams) {
  const { open: openOverlay } = useOverlay();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup polling interval on unmount
  useEffect(
    () => () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    },
    []
  );

  const handleSave = async () => {
    if (!currentWorkflowId) {
      return;
    }

    setIsSaving(true);
    try {
      if (isLocalWorkflowId(currentWorkflowId)) {
        saveLocalWorkflowSnapshot({
          edges,
          event: createWorkflowEvent({
            type: "save_draft",
            message: "Draft saved to localStorage.",
          }),
          name: workflowName,
          nodes,
          status: "draft",
        });
        setHasUnsavedChanges(false);
        toast.success("Saved to local storage");
        return;
      }

      await api.workflow.update(currentWorkflowId, { nodes, edges });
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Failed to save workflow:", error);
      toast.error("Failed to save workflow. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const executeWorkflow = async () => {
    if (!currentWorkflowId) {
      toast.error("Please save the workflow before executing");
      return;
    }

    // Switch to Runs tab when starting a test run
    setActiveTab("runs");
    const useLocalToolRunner =
      isLocalWorkflowId(currentWorkflowId) || isLocalToolWorkflow(nodes);

    // Deselect all nodes and edges
    setNodes(nodes.map((node) => ({ ...node, selected: false })));
    setEdges(
      edges.map((edge) => ({
        ...edge,
        data: {
          ...edge.data,
          ...(useLocalToolRunner ? { runStatus: "running" as const } : {}),
        },
        selected: false,
      }))
    );
    setSelectedNodeId(null);

    setIsExecuting(true);

    if (useLocalToolRunner) {
      executeLocalToolWorkflow({
        edges,
        nodes,
        setEdges,
        setExecutionLogs,
        setIsExecuting,
        setSelectedExecutionId,
        updateNodeData,
        workflowName,
      });
      return;
    }

    await executeTestWorkflow({
      workflowId: currentWorkflowId,
      nodes,
      updateNodeData,
      pollingIntervalRef,
      setIsExecuting,
      setSelectedExecutionId,
    });
    // Don't set executing to false here - let polling handle it
  };

  const handleGoToStep = (nodeId: string, fieldKey?: string) => {
    setSelectedNodeId(nodeId);
    setActiveTab("properties");

    // Focus on the specific field after a short delay to allow the panel to render
    if (fieldKey) {
      setTimeout(() => {
        const element = document.getElementById(fieldKey);
        if (element) {
          element.focus();
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  };

  const handleExecute = async () => {
    // Guard against concurrent executions
    if (isExecuting) {
      return;
    }

    if (isLocalWorkflowId(currentWorkflowId)) {
      await executeWorkflow();
      return;
    }

    // Collect all workflow issues at once
    const brokenRefs = getBrokenTemplateReferences(nodes);
    const missingFields = getMissingRequiredFields(nodes);
    const missingIntegrations = getMissingIntegrations(nodes, userIntegrations);

    // If there are any issues, show the workflow issues overlay
    if (
      brokenRefs.length > 0 ||
      missingFields.length > 0 ||
      missingIntegrations.length > 0
    ) {
      openOverlay(WorkflowIssuesOverlay, {
        issues: {
          brokenReferences: brokenRefs,
          missingRequiredFields: missingFields,
          missingIntegrations,
        },
        onGoToStep: handleGoToStep,
        onRunAnyway: executeWorkflow,
      });
      return;
    }

    await executeWorkflow();
  };

  return {
    handleSave,
    handleExecute,
  };
}

// Hook for workflow state management
function useWorkflowState() {
  const [nodes, setNodes] = useAtom(nodesAtom);
  const [edges, setEdges] = useAtom(edgesAtom);
  const [isExecuting, setIsExecuting] = useAtom(isExecutingAtom);
  const [isGenerating] = useAtom(isGeneratingAtom);
  const clearWorkflow = useSetAtom(clearWorkflowAtom);
  const updateNodeData = useSetAtom(updateNodeDataAtom);
  const [currentWorkflowId] = useAtom(currentWorkflowIdAtom);
  const isLocal = isLocalWorkflowId(currentWorkflowId);
  const [workflowName, setCurrentWorkflowName] = useAtom(
    currentWorkflowNameAtom
  );
  const [workflowVisibility, setWorkflowVisibility] = useAtom(
    currentWorkflowVisibilityAtom
  );
  const isOwner = useAtomValue(isWorkflowOwnerAtom);
  const router = useRouter();
  const [isSaving, setIsSaving] = useAtom(isSavingAtom);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useAtom(
    hasUnsavedChangesAtom
  );
  const undo = useSetAtom(undoAtom);
  const redo = useSetAtom(redoAtom);
  const addNode = useSetAtom(addNodeAtom);
  const [canUndo] = useAtom(canUndoAtom);
  const [canRedo] = useAtom(canRedoAtom);
  const { data: session } = useSession();
  const setActiveTab = useSetAtom(propertiesPanelActiveTabAtom);
  const setSelectedNodeId = useSetAtom(selectedNodeAtom);
  const setSelectedExecutionId = useSetAtom(selectedExecutionIdAtom);
  const setExecutionLogs = useSetAtom(executionLogsAtom);
  const userIntegrations = useAtomValue(integrationsAtom);
  const [triggerExecute, setTriggerExecute] = useAtom(triggerExecuteAtom);

  const [isDownloading, setIsDownloading] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [allWorkflows, setAllWorkflows] = useState<
    Array<{
      id: string;
      name: string;
      updatedAt: string;
    }>
  >([]);

  // Load all workflows on mount
  useEffect(() => {
    if (!(currentWorkflowId && !isLocal)) {
      return;
    }

    const loadAllWorkflows = async () => {
      try {
        const workflows = await api.workflow.getAll();
        setAllWorkflows(workflows);
      } catch (error) {
        console.error("Failed to load workflows:", error);
      }
    };
    loadAllWorkflows();
  }, [currentWorkflowId, isLocal]);

  return {
    nodes,
    edges,
    isExecuting,
    setIsExecuting,
    isGenerating,
    clearWorkflow,
    updateNodeData,
    currentWorkflowId,
    isLocal,
    workflowName,
    setCurrentWorkflowName,
    workflowVisibility,
    setWorkflowVisibility,
    isOwner,
    router,
    isSaving,
    setIsSaving,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    undo,
    redo,
    addNode,
    canUndo,
    canRedo,
    session,
    isDownloading,
    setIsDownloading,
    isDuplicating,
    setIsDuplicating,
    allWorkflows,
    setAllWorkflows,
    setActiveTab,
    setNodes,
    setEdges,
    setSelectedNodeId,
    setSelectedExecutionId,
    setExecutionLogs,
    userIntegrations,
    triggerExecute,
    setTriggerExecute,
  };
}

// Hook for workflow actions
function useWorkflowActions(state: ReturnType<typeof useWorkflowState>) {
  const { open: openOverlay } = useOverlay();
  const {
    currentWorkflowId,
    isLocal,
    workflowName,
    setCurrentWorkflowName,
    nodes,
    edges,
    updateNodeData,
    isExecuting,
    setIsExecuting,
    setIsSaving,
    setHasUnsavedChanges,
    clearWorkflow,
    setWorkflowVisibility,
    setAllWorkflows,
    setIsDownloading,
    setIsDuplicating,
    setActiveTab,
    setNodes,
    setEdges,
    setSelectedNodeId,
    setSelectedExecutionId,
    setExecutionLogs,
    userIntegrations,
    triggerExecute,
    setTriggerExecute,
    router,
    session,
  } = state;

  const { handleSave, handleExecute } = useWorkflowHandlers({
    currentWorkflowId,
    workflowName,
    nodes,
    edges,
    updateNodeData,
    isExecuting,
    setIsExecuting,
    setIsSaving,
    setHasUnsavedChanges,
    setActiveTab,
    setNodes,
    setEdges,
    setSelectedNodeId,
    setSelectedExecutionId,
    setExecutionLogs,
    userIntegrations,
  });

  const recordWorkflowAuditEvent = ({
    after,
    metadata,
    reason,
    type,
  }: {
    after?: {
      edgeCount: number;
      name?: string;
      nodeCount: number;
      status?: string;
    };
    metadata?: Record<string, unknown>;
    reason?: string;
    type: WorkflowAuditEventType;
  }) => {
    appendWorkflowChangeEvent(
      createWorkflowAuditEvent({
        actor: "workflow-toolbar",
        after: summarizeWorkflowForAudit(
          after || {
            edgeCount: edges.length,
            name: workflowName,
            nodeCount: nodes.length,
          }
        ),
        metadata,
        reason,
        targetObjectId: currentWorkflowId || LOCAL_WORKFLOW_ID,
        targetObjectType: "workflow",
        type,
        workflowId: currentWorkflowId || LOCAL_WORKFLOW_ID,
      })
    );
  };

  // Listen for execute trigger from keyboard shortcut
  useEffect(() => {
    if (triggerExecute) {
      setTriggerExecute(false);
      handleExecute();
    }
  }, [triggerExecute, setTriggerExecute, handleExecute]);

  const handleClearWorkflow = () => {
    openOverlay(ConfirmOverlay, {
      title: "Clear Workflow",
      message:
        "Are you sure you want to clear all nodes and connections? This action cannot be undone.",
      confirmLabel: "Clear Workflow",
      confirmVariant: "destructive" as const,
      destructive: true,
      onConfirm: () => {
        if (isLocal) {
          setNodes([]);
          setEdges([]);
          setSelectedNodeId(null);
          setSelectedExecutionId(null);
          setExecutionLogs({});
          saveLocalWorkflowSnapshot({
            edges: [],
            event: createWorkflowEvent({
              type: "save_draft",
              message: "Local draft cleared.",
            }),
            name: workflowName,
            nodes: [],
            status: "draft",
          });
          setHasUnsavedChanges(false);
          return;
        }
        clearWorkflow();
      },
    });
  };

  const handleDeleteWorkflow = () => {
    openOverlay(ConfirmOverlay, {
      title: "Delete Workflow",
      message: `Are you sure you want to delete "${workflowName}"? This will permanently delete the workflow. This cannot be undone.`,
      confirmLabel: "Delete Workflow",
      confirmVariant: "destructive" as const,
      destructive: true,
      onConfirm: async () => {
        if (!currentWorkflowId) {
          return;
        }
        if (isLocal) {
          const sample = {
            ...createFapiSampleWorkflow(),
            events: [
              createWorkflowEvent({
                type: "reset_sample",
                message: "Local studio reset to the FAPI-inspired sample.",
              }),
            ],
          };
          const canvas = workflowDefinitionToCanvas(sample);
          setNodes(canvas.nodes);
          setEdges(canvas.edges);
          setCurrentWorkflowName(sample.name);
          setSelectedNodeId(canvas.nodes[0]?.id ?? null);
          setSelectedExecutionId(null);
          setExecutionLogs({});
          saveWorkflowDefinitionSnapshot(sample);
          setHasUnsavedChanges(false);
          toast.success("Local sample restored");
          return;
        }
        try {
          await api.workflow.delete(currentWorkflowId);
          toast.success("Workflow deleted successfully");
          window.location.href = "/";
        } catch (error) {
          console.error("Failed to delete workflow:", error);
          toast.error("Failed to delete workflow. Please try again.");
        }
      },
    });
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadLocalWorkflow = () => {
    const snapshot = saveLocalWorkflowSnapshot({
      edges,
      event: createWorkflowEvent({
        type: "export_workflow",
        message: "Workflow JSON exported locally.",
      }),
      name: workflowName,
      nodes,
    });
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
      type: "application/json",
    });
    const safeName =
      snapshot.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "workflow";
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `workflow-studio-${safeName}-${timestamp}.json`;
    downloadBlob(blob, fileName);
    recordWorkflowAuditEvent({
      metadata: { fileName, format: "json" },
      reason: "Workflow JSON exported from the local toolbar.",
      type: "workflow_exported",
    });
    toast.success("Workflow JSON exported");
  };

  const downloadWorkflowCode = async (workflowId: string) => {
    toast.info("Preparing workflow files for download...");
    const result = await api.workflow.download(workflowId);

    if (!result.success) {
      throw new Error(result.error || "Failed to prepare download");
    }

    if (!result.files) {
      throw new Error("No files to download");
    }

    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    for (const [path, content] of Object.entries(result.files)) {
      zip.file(path, content);
    }

    const blob = await zip.generateAsync({ type: "blob" });
    const fileName = `${workflowName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-workflow.zip`;
    downloadBlob(blob, fileName);
    recordWorkflowAuditEvent({
      metadata: { fileName, format: "zip", workflowId },
      reason: "Workflow code package exported from the toolbar.",
      type: "workflow_exported",
    });
    toast.success("Workflow downloaded successfully!");
  };

  const handleDownload = async () => {
    if (!currentWorkflowId) {
      toast.error("Please save the workflow before downloading");
      return;
    }

    setIsDownloading(true);

    try {
      if (isLocal) {
        downloadLocalWorkflow();
      } else {
        await downloadWorkflowCode(currentWorkflowId);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to download workflow"
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const loadWorkflows = async () => {
    if (isLocal) {
      return;
    }

    try {
      const workflows = await api.workflow.getAll();
      setAllWorkflows(workflows);
    } catch (error) {
      console.error("Failed to load workflows:", error);
    }
  };

  const handleToggleVisibility = async (newVisibility: WorkflowVisibility) => {
    if (isLocal) {
      return;
    }

    if (!currentWorkflowId) {
      return;
    }

    // Show confirmation overlay when making public
    if (newVisibility === "public") {
      openOverlay(MakePublicOverlay, {
        onConfirm: async () => {
          try {
            await api.workflow.update(currentWorkflowId, {
              visibility: "public",
            });
            setWorkflowVisibility("public");
            toast.success("Workflow is now public");
          } catch (error) {
            console.error("Failed to update visibility:", error);
            toast.error("Failed to update visibility. Please try again.");
          }
        },
      });
      return;
    }

    // Switch to private immediately (no risks)
    try {
      await api.workflow.update(currentWorkflowId, {
        visibility: newVisibility,
      });
      setWorkflowVisibility(newVisibility);
      toast.success("Workflow is now private");
    } catch (error) {
      console.error("Failed to update visibility:", error);
      toast.error("Failed to update visibility. Please try again.");
    }
  };

  const handleDuplicate = async () => {
    if (isLocal) {
      return;
    }

    if (!currentWorkflowId) {
      return;
    }

    setIsDuplicating(true);
    try {
      // Auto-sign in as anonymous if user has no session
      if (!session?.user) {
        await authClient.signIn.anonymous();
        // Wait for session to be established
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const newWorkflow = await api.workflow.duplicate(currentWorkflowId);
      toast.success("Workflow duplicated successfully");
      router.push(`/workflows/${newWorkflow.id}`);
    } catch (error) {
      console.error("Failed to duplicate workflow:", error);
      toast.error("Failed to duplicate workflow. Please try again.");
    } finally {
      setIsDuplicating(false);
    }
  };

  return {
    handleSave,
    handleExecute,
    handleClearWorkflow,
    handleDeleteWorkflow,
    handleDownload,
    loadWorkflows,
    handleToggleVisibility,
    handleDuplicate,
    handleImportWorkflow: async (file: File) => {
      const text = await file.text();
      const parsedSnapshot = parseLocalWorkflowJson(text);
      const snapshot = {
        ...parsedSnapshot,
        events: [
          createWorkflowEvent({
            type: "import_workflow",
            message: `Imported workflow JSON from ${file.name}.`,
            details: { fileName: file.name },
          }),
          ...parsedSnapshot.events,
        ],
      };
      const canvas = workflowDefinitionToCanvas(snapshot);
      setNodes(canvas.nodes);
      setEdges(canvas.edges);
      setCurrentWorkflowName(snapshot.name);
      setSelectedNodeId(canvas.nodes[0]?.id ?? null);
      setSelectedExecutionId(null);
      setExecutionLogs({});
      saveWorkflowDefinitionSnapshot(snapshot);
      recordWorkflowAuditEvent({
        after: {
          edgeCount: snapshot.edges.length,
          name: snapshot.name,
          nodeCount: snapshot.blocks.length,
          status: snapshot.status,
        },
        metadata: { fileName: file.name },
        reason: "Workflow JSON imported into the local draft.",
        type: "workflow_imported",
      });
      setHasUnsavedChanges(false);
      toast.success("Workflow JSON imported");
      return snapshot;
    },
    handleUploadExcelSource: async (file: File) => {
      const workbook = await parseExcelWorkbookFile(file);
      let nextNodes = nodes;
      let nextEdges = edges;
      let targetNode = nextNodes.find(isExcelSourceNode);
      let nextWorkflowName = workflowName;

      if (!targetNode) {
        const demo = {
          ...createWorkingSourceRulesDemoWorkflow(),
          events: [
            createWorkflowEvent({
              message:
                "Local studio opened the Working Excel Source + Rulebooks Demo for workbook upload.",
              type: "reset_sample",
            }),
          ],
        };
        const canvas = workflowDefinitionToCanvas(demo);
        nextNodes = canvas.nodes;
        nextEdges = canvas.edges;
        targetNode = nextNodes.find(isExcelSourceNode);
        nextWorkflowName = demo.name;
      }

      if (!targetNode) {
        throw new Error("No Excel Source block is available for upload.");
      }

      const workbookImport = buildFapiWorkbookImportPatch(
        workbook,
        targetNode.data.block?.config || {}
      );
      const patch = workbookImport.excelSourcePatch;
      nextNodes = nextNodes.map((node) =>
        applyWorkbookImportPatchToNode({
          excelPatch: patch,
          node,
          targetNodeId: targetNode.id,
          workbook,
          workbookImport,
        })
      );
      setNodes(nextNodes);
      setEdges(nextEdges);
      setCurrentWorkflowName(nextWorkflowName);
      setSelectedNodeId(targetNode.id);
      setSelectedExecutionId(null);
      setExecutionLogs({});
      setHasUnsavedChanges(true);
      setActiveTab("properties");
      saveLocalWorkflowSnapshot({
        edges: nextEdges,
        event: createWorkflowEvent({
          message: `Uploaded Excel workbook ${file.name}.`,
          type: "save_draft",
        }),
        name: nextWorkflowName,
        nodes: nextNodes,
        status: "draft",
      });
      openOverlay(ConfigurationOverlay, {}, { size: "wide" });
      const importedParts = [
        workbookImport.keywordRules.length > 0 ? "keyword rules" : "",
        workbookImport.aggregationRules.length > 0 ? "aggregation rules" : "",
        Object.keys(workbookImport.expectedResults).length > 0
          ? "expected results"
          : "",
      ].filter(Boolean);
      toast.success(
        importedParts.length > 0
          ? `Excel workbook loaded with ${importedParts.join(", ")}`
          : "Excel workbook loaded into Source"
      );
    },
    handleLoadSingleItemDemo: () => {
      openOverlay(ConfirmOverlay, {
        title: "Load Z Demo",
        message:
          "Load the Single Item Pipeline Demo? Current local nodes and connections will be replaced.",
        confirmLabel: "Load Demo",
        confirmVariant: "default" as const,
        onConfirm: () => {
          const demo = {
            ...createSingleItemPipelineDemoWorkflow(),
            events: [
              createWorkflowEvent({
                type: "reset_sample",
                message: "Local studio loaded the Single Item Pipeline Demo.",
              }),
            ],
          };
          const canvas = workflowDefinitionToCanvas(demo);
          setNodes(canvas.nodes);
          setEdges(canvas.edges);
          setCurrentWorkflowName(demo.name);
          setSelectedNodeId(canvas.nodes[0]?.id ?? null);
          setSelectedExecutionId(null);
          setExecutionLogs({});
          saveWorkflowDefinitionSnapshot(demo);
          setHasUnsavedChanges(false);
          toast.success("Single Item Pipeline Demo loaded");
        },
      });
    },
    handleLoadExpandedDemo: () => {
      openOverlay(ConfirmOverlay, {
        confirmLabel: "Load Expanded Demo",
        confirmVariant: "default" as const,
        message:
          "Load the Expanded Mapping Pipeline Demo? Current local nodes and connections will be replaced.",
        onConfirm: () => {
          const demo = {
            ...createExpandedMappingPipelineDemoWorkflow(),
            events: [
              createWorkflowEvent({
                message:
                  "Local studio loaded the Expanded Mapping Pipeline Demo.",
                type: "reset_sample",
              }),
            ],
          };
          const canvas = workflowDefinitionToCanvas(demo);
          setNodes(canvas.nodes);
          setEdges(canvas.edges);
          setCurrentWorkflowName(demo.name);
          setSelectedNodeId(canvas.nodes[0]?.id ?? null);
          setSelectedExecutionId(null);
          setExecutionLogs({});
          saveWorkflowDefinitionSnapshot(demo);
          setHasUnsavedChanges(false);
          toast.success("Expanded Mapping Pipeline Demo loaded");
        },
        title: "Load Expanded Demo",
      });
    },
    handleLoadWorkingSourceDemo: () => {
      openOverlay(ConfirmOverlay, {
        confirmLabel: "Open Working Excel Source + Rulebooks Demo",
        confirmVariant: "default" as const,
        message:
          "Open the Working Excel Source + Rulebooks Demo? Current local nodes and connections will be replaced.",
        onConfirm: () => {
          const demo = {
            ...createWorkingSourceRulesDemoWorkflow(),
            events: [
              createWorkflowEvent({
                message:
                  "Local studio loaded the Working Excel Source + Rulebooks Demo.",
                type: "reset_sample",
              }),
            ],
          };
          const canvas = workflowDefinitionToCanvas(demo);
          setNodes(canvas.nodes);
          setEdges(canvas.edges);
          setCurrentWorkflowName(demo.name);
          setSelectedNodeId(canvas.nodes[0]?.id ?? null);
          setSelectedExecutionId(null);
          setExecutionLogs({});
          saveWorkflowDefinitionSnapshot(demo);
          setHasUnsavedChanges(false);
          toast.success("Working Excel Source + Rulebooks Demo loaded");
        },
        title: "Open Working Excel Source + Rulebooks Demo",
      });
    },
    handleResetSample: () => {
      openOverlay(ConfirmOverlay, {
        title: "Reset Sample",
        message:
          "Reset the local studio to the FAPI-inspired sample workflow? Current local nodes and connections will be replaced.",
        confirmLabel: "Reset Sample",
        confirmVariant: "destructive" as const,
        destructive: true,
        onConfirm: () => {
          const sample = {
            ...createFapiSampleWorkflow(),
            events: [
              createWorkflowEvent({
                type: "reset_sample",
                message: "Local studio reset to the FAPI-inspired sample.",
              }),
            ],
          };
          const canvas = workflowDefinitionToCanvas(sample);
          setNodes(canvas.nodes);
          setEdges(canvas.edges);
          setCurrentWorkflowName(sample.name);
          setSelectedNodeId(canvas.nodes[0]?.id ?? null);
          setSelectedExecutionId(null);
          setExecutionLogs({});
          saveWorkflowDefinitionSnapshot(sample);
          setHasUnsavedChanges(false);
          toast.success("FAPI-inspired sample restored");
        },
      });
    },
  };
}

// Toolbar Actions Component - handles add step, undo/redo, save, and run buttons
function ToolbarActions({
  workflowId,
  state,
  actions,
}: {
  workflowId?: string;
  state: ReturnType<typeof useWorkflowState>;
  actions: ReturnType<typeof useWorkflowActions>;
}) {
  const { open: openOverlay, push } = useOverlay();
  const [selectedNodeId] = useAtom(selectedNodeAtom);
  const [selectedEdgeId] = useAtom(selectedEdgeAtom);
  const [nodes] = useAtom(nodesAtom);
  const [edges] = useAtom(edgesAtom);
  const deleteNode = useSetAtom(deleteNodeAtom);
  const deleteEdge = useSetAtom(deleteEdgeAtom);
  const { screenToFlowPosition } = useReactFlow();

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const selectedEdge = edges.find((edge) => edge.id === selectedEdgeId);
  const hasSelection = selectedNode || selectedEdge;

  // For non-owners viewing public workflows, don't show toolbar actions
  // (Duplicate button is now in the main toolbar next to Sign In)
  if (workflowId && !state.isOwner) {
    return null;
  }

  if (!workflowId) {
    return null;
  }

  const handleDeleteConfirm = () => {
    const isNode = Boolean(selectedNodeId);
    const itemType = isNode ? "Node" : "Connection";

    push(ConfirmOverlay, {
      title: `Delete ${itemType}`,
      message: `Are you sure you want to delete this ${itemType.toLowerCase()}? This action cannot be undone.`,
      confirmLabel: "Delete",
      confirmVariant: "destructive" as const,
      onConfirm: () => {
        if (selectedNodeId) {
          deleteNode(selectedNodeId);
        } else if (selectedEdgeId) {
          deleteEdge(selectedEdgeId);
        }
      },
    });
  };

  const handleAddStep = () => {
    // Get the ReactFlow wrapper (the visible canvas container)
    const flowWrapper = document.querySelector(".react-flow");
    if (!flowWrapper) {
      return;
    }

    const rect = flowWrapper.getBoundingClientRect();
    // Calculate center in absolute screen coordinates
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Convert to flow coordinates
    const position = screenToFlowPosition({ x: centerX, y: centerY });

    // Adjust for node dimensions to center it properly
    // Action node is 192px wide and 192px tall (w-48 h-48 in Tailwind)
    const nodeWidth = 192;
    const nodeHeight = 192;
    position.x -= nodeWidth / 2;
    position.y -= nodeHeight / 2;

    // Check if there's already a node at this position
    const offset = 20; // Offset distance in pixels
    const threshold = 20; // How close nodes need to be to be considered overlapping

    const finalPosition = { ...position };
    let hasOverlap = true;
    let attempts = 0;
    const maxAttempts = 20; // Prevent infinite loop

    while (hasOverlap && attempts < maxAttempts) {
      hasOverlap = state.nodes.some((node) => {
        const dx = Math.abs(node.position.x - finalPosition.x);
        const dy = Math.abs(node.position.y - finalPosition.y);
        return dx < threshold && dy < threshold;
      });

      if (hasOverlap) {
        // Offset diagonally down-right
        finalPosition.x += offset;
        finalPosition.y += offset;
        attempts += 1;
      }
    }

    const newNode = createDefaultWorkflowBlockCandidate({
      id: nanoid(),
      position: finalPosition,
    });

    state.addNode(newNode);
    state.setSelectedNodeId(newNode.id);
    state.setActiveTab("properties");
    openOverlay(ConfigurationOverlay, {}, { size: "wide" });
  };

  return (
    <>
      {/* Add Step - Mobile Vertical */}
      <ButtonGroup className="flex lg:hidden" orientation="vertical">
        <Button
          className="border hover:bg-black/5 disabled:opacity-100 dark:hover:bg-white/5 disabled:[&>svg]:text-muted-foreground"
          disabled={state.isGenerating}
          onClick={handleAddStep}
          size="icon"
          title="Add Step"
          variant="secondary"
        >
          <Plus className="size-4" />
        </Button>
      </ButtonGroup>

      {/* Properties - Mobile Vertical (always visible) */}
      <ButtonGroup className="flex lg:hidden" orientation="vertical">
        <Button
          className="border hover:bg-black/5 dark:hover:bg-white/5"
          onClick={() =>
            openOverlay(ConfigurationOverlay, {}, { size: "wide" })
          }
          size="icon"
          title="Configuration"
          variant="secondary"
        >
          <Settings2 className="size-4" />
        </Button>
        {/* Delete - Show when node or edge is selected */}
        {hasSelection && (
          <Button
            className="border hover:bg-black/5 dark:hover:bg-white/5"
            onClick={handleDeleteConfirm}
            size="icon"
            title="Delete"
            variant="secondary"
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </ButtonGroup>

      {/* Add Step - Desktop Horizontal */}
      <ButtonGroup className="hidden lg:flex" orientation="horizontal">
        <Button
          className="border hover:bg-black/5 disabled:opacity-100 dark:hover:bg-white/5 disabled:[&>svg]:text-muted-foreground"
          disabled={state.isGenerating}
          onClick={handleAddStep}
          size="icon"
          title="Add Step"
          variant="secondary"
        >
          <Plus className="size-4" />
        </Button>
      </ButtonGroup>

      {/* Undo/Redo - Mobile Vertical */}
      <ButtonGroup className="flex lg:hidden" orientation="vertical">
        <Button
          className="border hover:bg-black/5 disabled:opacity-100 dark:hover:bg-white/5 disabled:[&>svg]:text-muted-foreground"
          disabled={!state.canUndo || state.isGenerating}
          onClick={() => state.undo()}
          size="icon"
          title="Undo"
          variant="secondary"
        >
          <Undo2 className="size-4" />
        </Button>
        <Button
          className="border hover:bg-black/5 disabled:opacity-100 dark:hover:bg-white/5 disabled:[&>svg]:text-muted-foreground"
          disabled={!state.canRedo || state.isGenerating}
          onClick={() => state.redo()}
          size="icon"
          title="Redo"
          variant="secondary"
        >
          <Redo2 className="size-4" />
        </Button>
      </ButtonGroup>

      {/* Undo/Redo - Desktop Horizontal */}
      <ButtonGroup className="hidden lg:flex" orientation="horizontal">
        <Button
          className="border hover:bg-black/5 disabled:opacity-100 dark:hover:bg-white/5 disabled:[&>svg]:text-muted-foreground"
          disabled={!state.canUndo || state.isGenerating}
          onClick={() => state.undo()}
          size="icon"
          title="Undo"
          variant="secondary"
        >
          <Undo2 className="size-4" />
        </Button>
        <Button
          className="border hover:bg-black/5 disabled:opacity-100 dark:hover:bg-white/5 disabled:[&>svg]:text-muted-foreground"
          disabled={!state.canRedo || state.isGenerating}
          onClick={() => state.redo()}
          size="icon"
          title="Redo"
          variant="secondary"
        >
          <Redo2 className="size-4" />
        </Button>
      </ButtonGroup>

      {/* Save/Download - Mobile Vertical */}
      <ButtonGroup className="flex lg:hidden" orientation="vertical">
        <SaveButton handleSave={actions.handleSave} state={state} />
        <DownloadButton actions={actions} state={state} />
        {state.isLocal && <ImportButton actions={actions} state={state} />}
        {state.isLocal && <ResetSampleButton actions={actions} state={state} />}
      </ButtonGroup>

      {/* Save/Download - Desktop Horizontal */}
      <ButtonGroup className="hidden lg:flex" orientation="horizontal">
        <SaveButton handleSave={actions.handleSave} state={state} />
        <DownloadButton actions={actions} state={state} />
        {state.isLocal && <ImportButton actions={actions} state={state} />}
        {state.isLocal && <ResetSampleButton actions={actions} state={state} />}
      </ButtonGroup>

      {/* Visibility Toggle */}
      {!state.isLocal && <VisibilityButton actions={actions} state={state} />}

      <RunButtonGroup actions={actions} state={state} />
    </>
  );
}

// Save Button Component
function SaveButton({
  state,
  handleSave,
}: {
  state: ReturnType<typeof useWorkflowState>;
  handleSave: () => Promise<void>;
}) {
  if (state.isLocal) {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex h-9 max-w-[220px] items-center gap-2 overflow-hidden rounded-md border bg-secondary px-3 text-secondary-foreground sm:max-w-none">
          <WorkflowIcon className="size-4 shrink-0" />
          <p className="truncate font-medium text-sm">{state.workflowName}</p>
        </div>
      </div>
    );
  }

  return (
    <Button
      className="relative border hover:bg-black/5 disabled:opacity-100 dark:hover:bg-white/5 disabled:[&>svg]:text-muted-foreground"
      disabled={
        !state.currentWorkflowId || state.isGenerating || state.isSaving
      }
      onClick={handleSave}
      size="icon"
      title={state.isSaving ? "Saving..." : "Save workflow"}
      variant="secondary"
    >
      {state.isSaving ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Save className="size-4" />
      )}
      {state.hasUnsavedChanges && !state.isSaving && (
        <div className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
      )}
    </Button>
  );
}

// Download Button Component
function DownloadButton({
  state,
  actions,
}: {
  state: ReturnType<typeof useWorkflowState>;
  actions: ReturnType<typeof useWorkflowActions>;
}) {
  const { open: openOverlay } = useOverlay();
  let title = "Export workflow as code";
  if (state.isLocal) {
    title = "Export workflow JSON";
  }
  if (state.isDownloading) {
    title = "Preparing download...";
  }

  const handleClick = () => {
    if (state.isLocal) {
      actions.handleDownload();
      return;
    }

    openOverlay(ExportWorkflowOverlay, {
      onExport: actions.handleDownload,
      isDownloading: state.isDownloading,
    });
  };

  return (
    <Button
      className="border hover:bg-black/5 disabled:opacity-100 dark:hover:bg-white/5 disabled:[&>svg]:text-muted-foreground"
      disabled={
        state.isDownloading ||
        state.nodes.length === 0 ||
        state.isGenerating ||
        !state.currentWorkflowId
      }
      onClick={handleClick}
      size="icon"
      title={title}
      variant="secondary"
    >
      {state.isDownloading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Download className="size-4" />
      )}
    </Button>
  );
}

function ImportButton({
  state,
  actions,
}: {
  state: ReturnType<typeof useWorkflowState>;
  actions: ReturnType<typeof useWorkflowActions>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        className="border hover:bg-black/5 disabled:opacity-100 dark:hover:bg-white/5 disabled:[&>svg]:text-muted-foreground"
        disabled={state.isGenerating}
        onClick={() => inputRef.current?.click()}
        size="icon"
        title="Import workflow JSON"
        variant="secondary"
      >
        <Upload className="size-4" />
      </Button>
      <input
        accept="application/json,.json"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            actions.handleImportWorkflow(file).catch((error) => {
              toast.error(
                error instanceof Error
                  ? error.message
                  : "Failed to import workflow JSON"
              );
            });
          }
          event.target.value = "";
        }}
        ref={inputRef}
        type="file"
      />
    </>
  );
}

function ResetSampleButton({
  state,
  actions,
}: {
  state: ReturnType<typeof useWorkflowState>;
  actions: ReturnType<typeof useWorkflowActions>;
}) {
  return (
    <Button
      className="border hover:bg-black/5 disabled:opacity-100 dark:hover:bg-white/5 disabled:[&>svg]:text-muted-foreground"
      disabled={state.isGenerating}
      onClick={actions.handleResetSample}
      size="icon"
      title="Reset sample workflow"
      variant="secondary"
    >
      <RotateCcw className="size-4" />
    </Button>
  );
}

// Visibility Button Component
function VisibilityButton({
  state,
  actions,
}: {
  state: ReturnType<typeof useWorkflowState>;
  actions: ReturnType<typeof useWorkflowActions>;
}) {
  const isPublic = state.workflowVisibility === "public";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="border hover:bg-black/5 dark:hover:bg-white/5"
          disabled={!state.currentWorkflowId || state.isGenerating}
          size="icon"
          title={isPublic ? "Public workflow" : "Private workflow"}
          variant="secondary"
        >
          {isPublic ? (
            <Globe className="size-4" />
          ) : (
            <Lock className="size-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={() => actions.handleToggleVisibility("private")}
        >
          <Lock className="size-4" />
          Private
          {!isPublic && <Check className="ml-auto size-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={() => actions.handleToggleVisibility("public")}
        >
          <Globe className="size-4" />
          Public
          {isPublic && <Check className="ml-auto size-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Run Button Group Component
function RunButtonGroup({
  state,
  actions,
}: {
  state: ReturnType<typeof useWorkflowState>;
  actions: ReturnType<typeof useWorkflowActions>;
}) {
  return (
    <Button
      className="border hover:bg-black/5 disabled:opacity-100 dark:hover:bg-white/5 disabled:[&>svg]:text-muted-foreground"
      disabled={
        state.isExecuting || state.nodes.length === 0 || state.isGenerating
      }
      onClick={() => actions.handleExecute()}
      size="icon"
      title="Run Workflow"
      variant="secondary"
    >
      {state.isExecuting ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Play className="size-4" />
      )}
    </Button>
  );
}

// Duplicate Button Component - placed next to Sign In for non-owners
function DuplicateButton({
  isDuplicating,
  onDuplicate,
}: {
  isDuplicating: boolean;
  onDuplicate: () => void;
}) {
  return (
    <Button
      className="h-9 border hover:bg-black/5 dark:hover:bg-white/5"
      disabled={isDuplicating}
      onClick={onDuplicate}
      size="sm"
      title="Duplicate to your workflows"
      variant="secondary"
    >
      {isDuplicating ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : (
        <Copy className="mr-2 size-4" />
      )}
      Duplicate
    </Button>
  );
}

// Workflow Menu Component
function WorkflowMenuComponent({
  workflowId,
  state,
  actions,
}: {
  workflowId?: string;
  state: ReturnType<typeof useWorkflowState>;
  actions: ReturnType<typeof useWorkflowActions>;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex h-9 max-w-[160px] items-center overflow-hidden rounded-md border bg-secondary text-secondary-foreground sm:max-w-none">
        <DropdownMenu onOpenChange={(open) => open && actions.loadWorkflows()}>
          <DropdownMenuTrigger className="flex h-full cursor-pointer items-center gap-2 px-3 font-medium text-sm transition-all hover:bg-black/5 dark:hover:bg-white/5">
            <WorkflowIcon className="size-4 shrink-0" />
            <p className="truncate font-medium text-sm">
              {workflowId ? (
                state.workflowName
              ) : (
                <>
                  <span className="sm:hidden">New</span>
                  <span className="hidden sm:inline">New Workflow</span>
                </>
              )}
            </p>
            <ChevronDown className="size-3 shrink-0 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuItem
              asChild
              className="flex items-center justify-between"
            >
              <a href="/">
                New Workflow{" "}
                {!workflowId && <Check className="size-4 shrink-0" />}
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {state.allWorkflows.length === 0 ? (
              <DropdownMenuItem disabled>No workflows found</DropdownMenuItem>
            ) : (
              state.allWorkflows
                .filter((w) => w.name !== "__current__")
                .map((workflow) => (
                  <DropdownMenuItem
                    className="flex items-center justify-between"
                    key={workflow.id}
                    onClick={() =>
                      state.router.push(`/workflows/${workflow.id}`)
                    }
                  >
                    <span className="truncate">{workflow.name}</span>
                    {workflow.id === state.currentWorkflowId && (
                      <Check className="size-4 shrink-0" />
                    )}
                  </DropdownMenuItem>
                ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {workflowId && !state.isOwner && (
        <span className="text-muted-foreground text-xs uppercase lg:hidden">
          Read-only
        </span>
      )}
    </div>
  );
}

function LocalStudioTopBar({
  state,
  actions,
}: {
  state: ReturnType<typeof useWorkflowState>;
  actions: ReturnType<typeof useWorkflowActions>;
}) {
  const { open: openOverlay } = useOverlay();
  const { screenToFlowPosition } = useReactFlow();
  const rightPanelWidth = useAtomValue(rightPanelWidthAtom);
  const inputRef = useRef<HTMLInputElement>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);
  const [publishStatus, setPublishStatus] = useState<LocalPublishStatus>(() => {
    if (typeof window === "undefined") {
      return "draft";
    }
    const snapshot = loadLocalWorkflowSnapshot();
    return snapshot?.status === "published" ||
      window.localStorage.getItem(LOCAL_PUBLISH_STATUS_KEY) === "published"
      ? "published"
      : "draft";
  });
  const [latestPublishedVersion, setLatestPublishedVersion] = useState<
    number | null
  >(() => loadLocalWorkflowSnapshot()?.publishedVersion?.versionNumber ?? null);
  const graphInitializedRef = useRef(false);

  const updatePublishStatus = useCallback((status: LocalPublishStatus) => {
    setPublishStatus(status);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCAL_PUBLISH_STATUS_KEY, status);
    }
  }, []);

  useEffect(() => {
    if (!graphInitializedRef.current) {
      graphInitializedRef.current = true;
      return;
    }

    if (state.hasUnsavedChanges && publishStatus === "published") {
      updatePublishStatus("draft");
    }
  }, [state.hasUnsavedChanges, publishStatus, updatePublishStatus]);

  useEffect(() => {
    if (state.hasUnsavedChanges) {
      return;
    }

    const snapshot = loadLocalWorkflowSnapshot();
    if (!snapshot) {
      return;
    }

    setPublishStatus(snapshot.status === "published" ? "published" : "draft");
    setLatestPublishedVersion(snapshot.publishedVersion?.versionNumber ?? null);
  }, [state.hasUnsavedChanges]);

  const getCanvasCenterPosition = () => {
    const flowWrapper = document.querySelector(".react-flow");
    if (!flowWrapper) {
      return null;
    }

    const rect = flowWrapper.getBoundingClientRect();
    const position = screenToFlowPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    position.x -= 96;
    position.y -= 96;
    return position;
  };

  const handleAddCatalogSource = (catalogId: string) => {
    if (
      catalogId === "source:keyword-rules" ||
      catalogId === "source:aggregation-rules"
    ) {
      const existingRulebook = state.nodes.find(
        (node) => node.data.block?.catalogId === catalogId
      );
      if (existingRulebook) {
        state.setSelectedNodeId(existingRulebook.id);
        state.setActiveTab("properties");
        openOverlay(ConfigurationOverlay, {}, { size: "wide" });
        return;
      }
    }

    const position = getCanvasCenterPosition();
    if (!position) {
      return;
    }
    const sourceDefaults: Record<
      string,
      { config: Record<string, unknown>; label: string }
    > = {
      "source:aggregation-rules": {
        config: {
          outputs: "aggregation_rules",
          sourceKind: "aggregation_rules",
          sourceStatus: "draft",
          sourceVersion: 1,
          toolId: "source.aggregation_rules",
        },
        label: "Aggregation Rulebook",
      },
      "source:currency-rate": {
        config: {
          documentCurrency: "USD",
          fapiYear: 2025,
          outputs: "exchange_rate, rate_metadata",
          overrideRate: 1.35,
          rateProvider: "bank_of_canada",
          rateType: "annual_average",
          reportingCurrency: "CAD",
          sourceKind: "currency_rate",
          sourceStatus: "draft",
          sourceVersion: 1,
          toolId: "source.currency_rate",
        },
        label: "Bank of Canada FX Rate",
      },
      "source:excel-workbook": {
        config: {
          outputs: "selected_rows",
          sourceKind: "excel_workbook",
          sourceStatus: "draft",
          sourceVersion: 1,
          toolId: "source.manual_table",
        },
        label: "Uploaded Workbook",
      },
      "source:keyword-rules": {
        config: {
          outputs: "keyword_rules",
          sourceKind: "keyword_rules",
          sourceStatus: "draft",
          sourceVersion: 1,
          toolId: "source.keyword_rules",
        },
        label: "Keyword Rulebook",
      },
    };
    const sourceDefault =
      sourceDefaults[catalogId] || sourceDefaults["source:excel-workbook"];
    const block = createWorkflowBlockFromCatalog(catalogId, {
      id: nanoid(),
      label: sourceDefault.label,
      position,
      config: sourceDefault.config,
    });
    state.addNode(createWorkflowNodeFromBlock(block, { selected: true }));
    state.setSelectedNodeId(block.id);
    state.setActiveTab("properties");
    openOverlay(ConfigurationOverlay, {}, { size: "wide" });
  };

  const handlePublish = () => {
    if (state.isLocal) {
      const result = publishLocalWorkflowSnapshot({
        edges: state.edges,
        name: state.workflowName,
        nodes: state.nodes,
        notes: "Published from the local Workflow Studio toolbar.",
      });
      state.setNodes(workflowDefinitionToCanvas(result.workflow).nodes);
      state.setEdges(workflowDefinitionToCanvas(result.workflow).edges);
      state.setHasUnsavedChanges(false);
      setLatestPublishedVersion(result.snapshot.versionNumber);
      appendWorkflowChangeEvent(
        createWorkflowAuditEvent({
          actor: "workflow-toolbar",
          after: summarizeWorkflowForAudit({
            edgeCount: result.workflow.edges.length,
            name: result.workflow.name,
            nodeCount: result.workflow.blocks.length,
            status: "published",
          }),
          metadata: {
            versionNumber: result.snapshot.versionNumber,
            warningCount: result.warnings.length,
          },
          reason: "Workflow published from the local toolbar.",
          targetObjectId: state.currentWorkflowId || LOCAL_WORKFLOW_ID,
          targetObjectType: "workflow",
          type: "workflow_published",
          workflowId: state.currentWorkflowId || LOCAL_WORKFLOW_ID,
        })
      );
      if (result.warnings.length > 0) {
        toast.warning(
          `Published locally with ${result.warnings.length} warning${result.warnings.length === 1 ? "" : "s"}`
        );
      } else {
        toast.success("Published locally");
      }
    }
    updatePublishStatus("published");
  };

  const statusLabel =
    state.hasUnsavedChanges || publishStatus === "draft"
      ? "Draft"
      : "Published";
  const isPublished = statusLabel === "Published";

  return (
    <div
      className="pointer-events-auto absolute top-3 left-[4.75rem] z-30"
      style={{
        right: rightPanelWidth ? `calc(${rightPanelWidth} + 1rem)` : "1rem",
      }}
    >
      <div className="flex min-h-12 items-center justify-between gap-3 rounded-md border bg-background/95 px-3 py-2 shadow-sm backdrop-blur">
        <div className="flex min-w-0 items-center gap-3">
          <WorkflowIcon className="size-5 shrink-0" />
          <div className="min-w-0">
            <div className="truncate font-semibold text-sm">
              {state.workflowName || "Fiscal Workflow Studio"}
            </div>
            <div className="text-muted-foreground text-xs">Workflow Studio</div>
          </div>
          <span
            className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 font-medium text-xs ${
              isPublished
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
            }`}
          >
            {statusLabel}
          </span>
          {latestPublishedVersion && (
            <span className="hidden shrink-0 rounded-full border px-2 py-0.5 text-muted-foreground text-xs xl:inline-flex">
              v{latestPublishedVersion}
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            disabled={state.isGenerating}
            onClick={actions.handleClearWorkflow}
            size="sm"
            variant="secondary"
          >
            New Workflow
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                disabled={state.isGenerating}
                size="sm"
                variant="secondary"
              >
                <Plus className="mr-2 size-4" />
                Add Source
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleAddCatalogSource("source:excel-workbook")}
              >
                Uploaded Workbook
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleAddCatalogSource("source:currency-rate")}
              >
                Bank of Canada FX Rate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            disabled={state.isGenerating}
            onClick={() => excelInputRef.current?.click()}
            size="sm"
            variant="secondary"
          >
            <Upload className="mr-2 size-4" />
            Upload Excel
          </Button>
          <input
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                actions.handleUploadExcelSource(file).catch((error) => {
                  toast.error(
                    error instanceof Error
                      ? error.message
                      : "Failed to upload Excel workbook"
                  );
                });
                updatePublishStatus("draft");
                setLatestPublishedVersion(null);
              }
              event.target.value = "";
            }}
            ref={excelInputRef}
            type="file"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                disabled={state.isGenerating}
                size="sm"
                variant="secondary"
              >
                <Plus className="mr-2 size-4" />
                Add Rulebook
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleAddCatalogSource("source:keyword-rules")}
              >
                Keyword Rulebook
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleAddCatalogSource("source:aggregation-rules")
                }
              >
                Aggregation Rulebook
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            disabled={
              !state.currentWorkflowId || state.isGenerating || state.isSaving
            }
            onClick={actions.handleSave}
            size="sm"
            variant="secondary"
          >
            {state.isSaving ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Save className="mr-2 size-4" />
            )}
            Save
          </Button>
          <Button
            disabled={
              state.isDownloading ||
              state.nodes.length === 0 ||
              state.isGenerating ||
              !state.currentWorkflowId
            }
            onClick={actions.handleDownload}
            size="sm"
            variant="secondary"
          >
            {state.isDownloading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Download className="mr-2 size-4" />
            )}
            Export JSON
          </Button>
          <Button
            disabled={state.isGenerating}
            onClick={() => inputRef.current?.click()}
            size="sm"
            variant="secondary"
          >
            <Upload className="mr-2 size-4" />
            Import JSON
          </Button>
          <input
            accept="application/json,.json"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                actions
                  .handleImportWorkflow(file)
                  .then((snapshot) => {
                    updatePublishStatus(snapshot.status);
                    setLatestPublishedVersion(
                      snapshot.publishedVersion?.versionNumber ?? null
                    );
                  })
                  .catch((error) => {
                    toast.error(
                      error instanceof Error
                        ? error.message
                        : "Failed to import workflow JSON"
                    );
                  });
              }
              event.target.value = "";
            }}
            ref={inputRef}
            type="file"
          />
          <Button
            disabled={state.isGenerating || state.isSaving}
            onClick={handlePublish}
            size="sm"
            variant={isPublished ? "outline" : "default"}
          >
            <Globe className="mr-2 size-4" />
            Publish
          </Button>
          <Button
            disabled={state.isGenerating}
            onClick={() => {
              actions.handleLoadWorkingSourceDemo();
              updatePublishStatus("draft");
              setLatestPublishedVersion(null);
            }}
            size="sm"
            variant="secondary"
          >
            <Upload className="mr-2 size-4" />
            Open Working Excel Source + Rulebooks Demo
          </Button>
          <Button
            disabled={
              state.isExecuting ||
              state.nodes.length === 0 ||
              state.isGenerating
            }
            onClick={() => actions.handleExecute()}
            size="sm"
            variant="secondary"
          >
            {state.isExecuting ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Play className="mr-2 size-4" />
            )}
            Run
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={state.isGenerating} size="sm" variant="ghost">
                <Settings2 className="mr-2 size-4" />
                Dev
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  actions.handleLoadSingleItemDemo();
                  updatePublishStatus("draft");
                  setLatestPublishedVersion(null);
                }}
              >
                Load Z Demo
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  actions.handleLoadExpandedDemo();
                  updatePublishStatus("draft");
                  setLatestPublishedVersion(null);
                }}
              >
                Load Expanded Demo
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  actions.handleResetSample();
                  updatePublishStatus("draft");
                  setLatestPublishedVersion(null);
                }}
              >
                Reset FAPI Sample
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export const WorkflowToolbar = ({ workflowId }: WorkflowToolbarProps) => {
  const state = useWorkflowState();
  const actions = useWorkflowActions(state);

  if (state.isLocal) {
    return <LocalStudioTopBar actions={actions} state={state} />;
  }

  return (
    <>
      <Panel
        className="flex flex-col gap-2 rounded-none border-none bg-transparent p-0 lg:flex-row lg:items-center"
        position="top-left"
      >
        <div className="flex items-center gap-2">
          <WorkflowMenuComponent
            actions={actions}
            state={state}
            workflowId={workflowId}
          />
          {workflowId && !state.isOwner && (
            <span className="hidden text-muted-foreground text-xs uppercase lg:inline">
              Read-only
            </span>
          )}
        </div>
      </Panel>

      <div className="pointer-events-auto absolute top-4 right-4 z-10">
        <div className="flex flex-col-reverse items-end gap-2 lg:flex-row lg:items-center">
          <ToolbarActions
            actions={actions}
            state={state}
            workflowId={workflowId}
          />
          <div className="flex items-center gap-2">
            {!workflowId && (
              <>
                <GitHubStarsButton />
                <DeployButton />
              </>
            )}
            {workflowId && !state.isOwner && !state.isLocal && (
              <DuplicateButton
                isDuplicating={state.isDuplicating}
                onDuplicate={actions.handleDuplicate}
              />
            )}
            {!state.isLocal && <UserMenu />}
          </div>
        </div>
      </div>
    </>
  );
};
