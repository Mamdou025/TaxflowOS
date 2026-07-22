"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  ChevronDown,
  ChevronRight,
  Code,
  Copy,
  Eraser,
  Eye,
  EyeOff,
  FileCode,
  Play,
  RefreshCw,
  Settings2,
  Trash2,
} from "lucide-react";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ConfirmOverlay } from "@/shared/ui/overlays/confirm-overlay";
import { SmartOverlayHeader } from "@/shared/ui/overlays/overlay-header";
import { useOverlay } from "@/shared/ui/overlays/overlay-provider";
import { Button } from "@/shared/ui/button";
import { CodeEditor } from "@/shared/ui/code-editor";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { EdgeInspector } from "@/features/workflow-builder/ui/edge-inspector";
import { CalculationEngineModeSection } from "@/features/workflow-builder/ui/logic-viewers/calculation-engine-panel";
import { CalculationEngineEditor } from "@/features/workflow-builder/ui/logic-viewers/calculation-engine-editor";
import { AggregatorWorkspace } from "@/features/workflow-builder/ui/logic-viewers/aggregator-workspace";
import { CalculationEngineWorkspace } from "@/features/workflow-builder/ui/logic-viewers/calculation-engine-workspace";
import { FieldBlockWorkspace } from "@/features/workflow-builder/ui/logic-viewers/field-block-workspace";
import { KeywordMapperWorkspace } from "@/features/workflow-builder/ui/logic-viewers/keyword-mapper-workspace";
import { HierarchyAggregatorPanel } from "@/features/workflow-builder/ui/logic-viewers/hierarchy-aggregator-panel";
import { api } from "@/lib/api-client";
import { integrationsAtom } from "@/lib/integrations-store";
import {
  clearLocalRunRecords,
  createCanvasEdgeFromWorkflowEdge,
  createWorkflowBlockFromCatalog,
  createWorkflowEdgeRecord,
  type FiscalStage,
  getBlockCatalogItem,
  getFiscalPreset,
  getFiscalVisualForFamily,
  getFiscalVisualForStage,
  getPendingWorkflowConnection,
  getUnsupportedWorkflowRelationshipMessage,
  getWorkflowEdgeDefaults,
  isLocalWorkflowId,
  type LocalRunRecord,
  loadLocalRunRecords,
  saveLocalRunRecord,
  saveLocalWorkflowSnapshot,
  type WorkflowBlock,
} from "@/shared/workflow-engine/local-fiscal-workflow";
import { getToolForBlock } from "@/shared/workflow-engine/local-tool-registry";
import {
  type LocalEdgeRunStatus,
  runLocalWorkflowTools,
} from "@/shared/workflow-engine/local-tool-runner";
import type { IntegrationType } from "@/lib/types/integration";
import { generateWorkflowCode } from "@/shared/workflow-engine/codegen/workflow-codegen";
import {
  autosaveAtom,
  clearNodeStatusesAtom,
  clearWorkflowAtom,
  currentWorkflowIdAtom,
  currentWorkflowNameAtom,
  deleteEdgeAtom,
  deleteNodeAtom,
  edgesAtom,
  executionLogsAtom,
  hasUnsavedChangesAtom,
  insertBlockBetweenEdgeAtom,
  isGeneratingAtom,
  isWorkflowOwnerAtom,
  newlyCreatedNodeIdAtom,
  nodesAtom,
  propertiesPanelActiveTabAtom,
  selectedEdgeAtom,
  selectedExecutionIdAtom,
  selectedNodeAtom,
  updateEdgeDataAtom,
  updateNodeDataAtom,
  type WorkflowEdge,
  type WorkflowNode,
} from "@/shared/workflow-engine/state/workflow-store";
import { findActionById } from "@/plugins";
import { isInspectorTab } from "@/shared/workflow-engine/domain/workflow/inspector-rules";
import { hasExcelSourceEvidence } from "@/shared/workflow-engine/domain/workflow/source-rules";
import { ActionConfig } from "@/features/workflow-builder/ui/config/action-config";
import { ActionGrid } from "@/features/workflow-builder/ui/config/action-grid";
import { FiscalBlockConfig } from "@/features/workflow-builder/ui/config/fiscal-block-config";
import { TriggerConfig } from "@/features/workflow-builder/ui/config/trigger-config";
import { generateBlockCodePreview } from "@/features/workflow-builder/ui/inspector/code-preview/generate-code-preview";
import { SourceSetupPanel } from "@/features/workflow-builder/ui/inspector/source-setup-panel";
import { ExcelWorkbookViewer } from "@/features/workflow-builder/ui/source-viewers/excel-workbook-viewer";
import { KeywordRulebookEditor } from "@/features/workflow-builder/ui/source-viewers/keyword-rulebook-editor";
import { RollupRulebookEditor } from "@/features/workflow-builder/ui/source-viewers/rollup-rulebook-editor";
import {
  getKeywordRules,
  KeywordMapperRulesPanel,
  NEW_AGGREGATION_RULE_NODE_ID,
  NEW_CALCULATION_RULE_ID,
  NEW_KEYWORD_RULE_ID,
  NEW_ROLLUP_RULE_ID,
  RuleSourceViewer,
} from "@/features/workflow-builder/ui/source-viewers/rule-source-editor";
import { generateNodeCode } from "@/features/workflow-builder/ui/utils/code-generators";
import { WorkflowRuns } from "@/features/workflow-builder/ui/workflow-runs";
import { BlockDataFlowColumn } from "@/features/workflow-builder/ui/workspace/block-data-flow-pane";
import { getLatestLocalRunForBlock } from "@/features/workflow-builder/ui/workspace/latest-local-run";
import {
  getWorkspaceGridColumns,
  useWorkspacePaneSizing,
  WorkspaceResizeHandle,
} from "@/features/workflow-builder/ui/workspace/workspace-pane-sizing";
import type { OverlayComponentProps } from "@/shared/ui/overlays/types";

// System actions that need integrations (not in plugin registry)
const SYSTEM_ACTION_INTEGRATIONS: Record<string, IntegrationType> = {
  "Database Query": "database",
};

// Regex constants
const NON_ALPHANUMERIC_REGEX = /[^a-zA-Z0-9\s]/g;
const WORD_SPLIT_REGEX = /\s+/;

function createExecutionLogsMap(logs: LocalRunRecord["logs"]) {
  return Object.fromEntries(
    logs.map((log) => [
      log.nodeId,
      {
        nodeId: log.nodeId,
        nodeName: log.nodeName,
        nodeType: log.nodeType,
        output: log.output,
        status: log.status,
      },
    ])
  );
}

function applyEdgeRunStatuses({
  edgeStatuses,
  edges,
  runId,
}: {
  edgeStatuses: Record<string, LocalEdgeRunStatus>;
  edges: WorkflowEdge[];
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

function isExcelWorkbookSource(block?: WorkflowBlock | null) {
  const sourceKind = String(block?.config.sourceKind || "").toLowerCase();
  return (
    block?.family === "Source" &&
    (block.subtype === "Excel / Workbook" ||
      sourceKind.includes("excel") ||
      sourceKind.includes("workbook"))
  );
}

function isRuleKnowledgeSource(block?: WorkflowBlock | null) {
  const sourceKind = String(block?.config.sourceKind || "").toLowerCase();
  return (
    block?.family === "Source" &&
    (block.subtype === "Keyword Rules" ||
      block.subtype === "Aggregation Rules" ||
      block.subtype === "Rollup Rules" ||
      block.subtype === "Calculation Rules" ||
      sourceKind.includes("keyword_rules") ||
      sourceKind.includes("aggregation_rules") ||
      sourceKind.includes("rollup_rules") ||
      sourceKind.includes("calculation_rules") ||
      sourceKind.includes("rule_knowledge"))
  );
}

function isAggregationRuleKnowledgeSource(block?: WorkflowBlock | null) {
  const sourceKind = String(block?.config.sourceKind || "").toLowerCase();
  return (
    block?.family === "Source" &&
    (block.subtype === "Aggregation Rules" ||
      block.subtype === "Rollup Rules" ||
      block.subtype === "Calculation Rules" ||
      sourceKind.includes("aggregation_rules") ||
      sourceKind.includes("rollup_rules"))
  );
}

function isRollupRuleKnowledgeSource(block?: WorkflowBlock | null) {
  const sourceKind = String(block?.config.sourceKind || "").toLowerCase();
  return (
    block?.family === "Source" &&
    (block.subtype === "Rollup Rules" || sourceKind.includes("rollup_rules")) &&
    block.subtype !== "Aggregation Rules" &&
    !sourceKind.includes("aggregation_rules")
  );
}

function isCalculationRuleKnowledgeSource(block?: WorkflowBlock | null) {
  const sourceKind = String(block?.config.sourceKind || "").toLowerCase();
  return (
    block?.family === "Source" &&
    (block.subtype === "Calculation Rules" ||
      sourceKind.includes("calculation_rules"))
  );
}

function isKeywordMapperBlock(block?: WorkflowBlock | null) {
  return (
    block?.config.toolId === "logic.keyword_mapper" ||
    block?.subtype === "Classification / Mapping"
  );
}

function isHierarchyAggregatorBlock(block?: WorkflowBlock | null) {
  return (
    block?.config.toolId === "logic.hierarchy_aggregator" ||
    block?.subtype === "Hierarchy Aggregator"
  );
}

function isCategoryRollupAggregatorBlock(block?: WorkflowBlock | null) {
  return (
    block?.config.toolId === "logic.category_rollup_aggregator" ||
    block?.subtype === "Category Rollup Aggregator"
  );
}

function isCalculationEngineBlock(block?: WorkflowBlock | null) {
  return (
    block?.config.toolId === "logic.calculation_engine" ||
    block?.subtype === "Calculation Engine"
  );
}

function usesFocusedLogicWorkspace(block?: WorkflowBlock | null) {
  return (
    isKeywordMapperBlock(block) ||
    isCategoryRollupAggregatorBlock(block) ||
    isCalculationEngineBlock(block) ||
    isHierarchyAggregatorBlock(block)
  );
}

function isAggregatorLogicBlock(block?: WorkflowBlock | null) {
  return isHierarchyAggregatorBlock(block) || isCategoryRollupAggregatorBlock(block);
}

function hasConnectedInputRole(
  block: WorkflowBlock,
  edges: WorkflowEdge[],
  role: string
) {
  return edges.some(
    (edge) =>
      edge.target === block.id &&
      (edge.data?.targetInputRole === role ||
        edge.data?.workflowEdge?.targetInputRole === role)
  );
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function getRunOutputsByBlockId(record?: LocalRunRecord) {
  return Object.fromEntries(
    (record?.logs || []).map((log) => {
      const output = asRecord(log.output);
      const nestedOutput = asRecord(output.output);
      return [
        log.nodeId,
        Object.keys(nestedOutput).length > 0 ? nestedOutput : output,
      ];
    })
  );
}

// Helper to generate code filename based on node type
function getCodeFilename(node: {
  data: { type: string; config?: Record<string, unknown> };
}): string {
  if (node.data.config?.fiscalStage) {
    return `blocks/${node.data.config.fiscalStage}.ts`;
  }

  if (node.data.type === "trigger") {
    const triggerType = node.data.config?.triggerType as string;
    if (triggerType === "Schedule") {
      return "vercel.json";
    }
    const webhookPath = (node.data.config?.webhookPath as string) || "/webhook";
    return `app/api${webhookPath}/route.ts`;
  }
  const actionType = (node.data.config?.actionType as string) || "action";
  return `steps/${actionType
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")}-step.ts`;
}

function getBlockInputBindingsForCode({
  block,
  edges,
  nodes,
}: {
  block: WorkflowBlock;
  edges: WorkflowEdge[];
  nodes: WorkflowNode[];
}) {
  return edges
    .filter((edge) => edge.target === block.id)
    .map((edge) => ({
      label: edge.data?.workflowEdge?.targetInputRole || "input",
      value: `${nodes.find((node) => node.id === edge.source)?.data.block?.label || edge.source}.${edge.data?.workflowEdge?.sourceOutputRole || "output"}`,
    }));
}

function BlockGeneratedCodeTab({
  block,
  edges,
  nodes,
}: {
  block: WorkflowBlock;
  edges: WorkflowEdge[];
  nodes: WorkflowNode[];
}) {
  const preview = generateBlockCodePreview({
    block,
    config: block.config || {},
    inputBindings: getBlockInputBindingsForCode({ block, edges, nodes }),
    tool: getToolForBlock(block),
  });
  const copyCode = () => {
    navigator.clipboard.writeText(preview.code);
    toast.success("Generated preview copied");
  };

  return (
    <div className="flex h-[400px] flex-col">
      <div className="flex shrink-0 items-start justify-between gap-3 border-b bg-muted/30 px-3 py-2">
        <div>
          <div className="font-medium text-sm">{preview.title}</div>
          <p className="mt-1 text-muted-foreground text-xs">
            {preview.explanation}
          </p>
        </div>
        <Button
          className="shrink-0 text-muted-foreground"
          onClick={copyCode}
          size="sm"
          variant="ghost"
        >
          <Copy className="mr-2 size-4" />
          Copy
        </Button>
      </div>
      <pre className="min-h-0 flex-1 overflow-auto bg-background p-4 text-xs">
        {preview.code}
      </pre>
    </div>
  );
}

function getPatchBaseConfig(node: WorkflowNode) {
  return node.data.block?.config || node.data.config || {};
}

function getPatchedWorkflowBlock({
  block,
  nextConfig,
}: {
  block?: WorkflowBlock;
  nextConfig: Record<string, unknown>;
}) {
  if (!block) {
    return;
  }

  const source = block.source
    ? {
        ...block.source,
        locator: String(nextConfig.sourceLocator || block.source.locator),
        valuePreview:
          typeof nextConfig.valuePreview === "string"
            ? nextConfig.valuePreview
            : block.source.valuePreview,
      }
    : block.source;

  return {
    ...block,
    config: nextConfig,
    source,
    updatedAt: new Date().toISOString(),
  };
}

type ConfigurationOverlayProps = OverlayComponentProps;

function WorkspaceRunsTab({
  activeTab,
  isRefreshing,
  onDeleteAll,
  onRefresh,
  refreshRunsRef,
}: {
  activeTab: string;
  isRefreshing: boolean;
  onDeleteAll: () => void;
  onRefresh: () => void;
  refreshRunsRef: React.RefObject<(() => Promise<void>) | null>;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-2 border-b px-4 py-2">
        <Button
          className="text-muted-foreground"
          disabled={isRefreshing}
          onClick={onRefresh}
          size="sm"
          variant="ghost"
        >
          <RefreshCw className={`mr-2 size-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
        <Button
          className="text-muted-foreground"
          onClick={onDeleteAll}
          size="sm"
          variant="ghost"
        >
          <Eraser className="mr-2 size-4" />
          Clear All
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <WorkflowRuns isActive={activeTab === "runs"} onRefreshRef={refreshRunsRef} />
      </div>
    </div>
  );
}

function CollapsibleDataFlow({
  block,
  edges,
  lastRun,
  nodes,
  onExecuteStep,
}: {
  block: WorkflowBlock;
  edges: WorkflowEdge[];
  lastRun?: LocalRunRecord;
  nodes: WorkflowNode[];
  onExecuteStep?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [panelHeight, setPanelHeight] = useState(260);

  const onResizePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      const startY = e.clientY;
      const startHeight = panelHeight;
      const onMove = (ev: PointerEvent) => {
        const delta = startY - ev.clientY;
        setPanelHeight(Math.max(160, Math.min(600, startHeight + delta)));
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [panelHeight]
  );

  return (
    <div className="shrink-0 border-t bg-background">
      <button
        className="flex w-full items-center gap-2 px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        {open ? (
          <ChevronDown className="size-3 shrink-0" />
        ) : (
          <ChevronRight className="size-3 shrink-0" />
        )}
        <span className="font-medium">Connected I/O</span>
        <span className="ml-auto text-[10px] opacity-60">
          {open ? "collapse" : "expand"}
        </span>
      </button>
      {open && (
        <>
          {/* Drag handle — drag up to make panel taller */}
          <div
            className="h-1.5 w-full cursor-ns-resize bg-border/40 transition-colors hover:bg-primary/30 active:bg-primary/40"
            onPointerDown={onResizePointerDown}
            title="Drag to resize"
          />
          <div className="flex border-t" style={{ height: panelHeight }}>
            <div className="flex-1 overflow-y-auto border-r">
              <BlockDataFlowColumn
                block={block}
                edges={edges}
                lastRun={lastRun}
                nodes={nodes}
                side="inputs"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              <BlockDataFlowColumn
                block={block}
                edges={edges}
                lastRun={lastRun}
                nodes={nodes}
                onExecuteStep={onExecuteStep}
                side="outputs"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Complex UI logic with multiple conditions
export function ConfigurationOverlay({ overlayId }: ConfigurationOverlayProps) {
  const { push, closeAll } = useOverlay();
  const [selectedNodeId, setSelectedNodeId] = useAtom(selectedNodeAtom);
  const [selectedEdgeId] = useAtom(selectedEdgeAtom);
  const [nodes] = useAtom(nodesAtom);
  const [edges, setEdges] = useAtom(edgesAtom);
  const [isGenerating] = useAtom(isGeneratingAtom);
  const [currentWorkflowId] = useAtom(currentWorkflowIdAtom);
  const [selectedExecutionId, setSelectedExecutionId] = useAtom(
    selectedExecutionIdAtom
  );
  const [executionLogs, setExecutionLogs] = useAtom(executionLogsAtom);
  const [currentWorkflowName, setCurrentWorkflowName] = useAtom(
    currentWorkflowNameAtom
  );
  const isOwner = useAtomValue(isWorkflowOwnerAtom);
  const updateNodeData = useSetAtom(updateNodeDataAtom);
  const updateEdgeData = useSetAtom(updateEdgeDataAtom);
  const triggerAutosave = useSetAtom(autosaveAtom);
  const setHasUnsavedChanges = useSetAtom(hasUnsavedChangesAtom);
  const deleteNode = useSetAtom(deleteNodeAtom);
  const deleteEdge = useSetAtom(deleteEdgeAtom);
  const insertBlockBetweenEdge = useSetAtom(insertBlockBetweenEdgeAtom);
  const clearNodeStatuses = useSetAtom(clearNodeStatusesAtom);
  const clearWorkflow = useSetAtom(clearWorkflowAtom);
  const [newlyCreatedNodeId, setNewlyCreatedNodeId] = useAtom(
    newlyCreatedNodeIdAtom
  );
  const [activeTab, setActiveTab] = useAtom(propertiesPanelActiveTabAtom);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [calculationInsertRequest, setCalculationInsertRequest] = useState<{
    id: string;
    key: string;
  } | null>(null);
  const [calculationTermCreateRequest, setCalculationTermCreateRequest] =
    useState(0);
  const [selectedCalculationTermId, setSelectedCalculationTermId] = useState<
    string | null
  >(null);
  const [selectedRulebookItemId, setSelectedRulebookItemId] = useState("");
  const { handleWorkspaceResizeStart, workspaceGridRef, workspacePaneWidths } =
    useWorkspacePaneSizing();
  const refreshRunsRef = useRef<(() => Promise<void>) | null>(null);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const selectedEdge = edges.find((edge) => edge.id === selectedEdgeId);
  const selectedEdgeSourceNode = selectedEdge
    ? nodes.find((node) => node.id === selectedEdge.source)
    : undefined;
  const selectedEdgeTargetNode = selectedEdge
    ? nodes.find((node) => node.id === selectedEdge.target)
    : undefined;

  useEffect(() => {
    setSelectedRulebookItemId(selectedNodeId ? "" : "");
    setCalculationInsertRequest(null);
    setCalculationTermCreateRequest(0);
    setSelectedCalculationTermId(null);
  }, [selectedNodeId]);

  // Auto-fix invalid integration references
  const globalIntegrations = useAtomValue(integrationsAtom);
  useEffect(() => {
    if (!(selectedNode && isOwner)) {
      return;
    }

    const actionType = selectedNode.data.config?.actionType as
      | string
      | undefined;
    const currentIntegrationId = selectedNode.data.config?.integrationId as
      | string
      | undefined;

    if (!(actionType && currentIntegrationId)) {
      return;
    }

    const action = findActionById(actionType);
    const integrationType: IntegrationType | undefined =
      (action?.integration as IntegrationType | undefined) ||
      SYSTEM_ACTION_INTEGRATIONS[actionType];

    if (!integrationType) {
      return;
    }

    const validIntegrations = globalIntegrations.filter(
      (i) => i.type === integrationType
    );
    const isValid = validIntegrations.some(
      (i) => i.id === currentIntegrationId
    );

    if (!isValid && validIntegrations.length > 0) {
      updateNodeData({
        id: selectedNode.id,
        data: {
          config: {
            ...selectedNode.data.config,
            integrationId: validIntegrations[0].id,
          },
        },
      });
    }
  }, [selectedNode, globalIntegrations, isOwner, updateNodeData]);

  const handleUpdateConfig = useCallback(
    (key: string, value: string) => {
      if (!selectedNode) {
        return;
      }
      updateNodeData({
        id: selectedNode.id,
        data: {
          config: { ...selectedNode.data.config, [key]: value },
        },
      });
    },
    [selectedNode, updateNodeData]
  );

  const handlePatchSelectedBlockConfig = useCallback(
    (patch: Record<string, unknown>) => {
      if (!selectedNode) {
        return;
      }

      const currentConfig = getPatchBaseConfig(selectedNode);
      const nextConfig = { ...currentConfig, ...patch };
      const nextBlock = getPatchedWorkflowBlock({
        block: selectedNode.data.block,
        nextConfig,
      });

      updateNodeData({
        id: selectedNode.id,
        data: {
          block: nextBlock,
          config: nextConfig,
          description: nextBlock?.description ?? selectedNode.data.description,
          label: nextBlock?.label ?? selectedNode.data.label,
        },
      });
      setHasUnsavedChanges(true);
      triggerAutosave({ immediate: true });
    },
    [selectedNode, setHasUnsavedChanges, triggerAutosave, updateNodeData]
  );

  const handleApplyVisualPreset = useCallback(
    (presetId: string) => {
      if (!selectedNode || selectedNode.data.type !== "action") {
        return;
      }

      const preset = getFiscalPreset(presetId);
      if (!preset) {
        return;
      }

      const configWithoutActionType = Object.fromEntries(
        Object.entries(selectedNode.data.config ?? {}).filter(
          ([key]) => key !== "actionType" && key !== "integrationId"
        )
      );

      updateNodeData({
        id: selectedNode.id,
        data: {
          label:
            selectedNode.data.label && selectedNode.data.label.trim().length > 0
              ? selectedNode.data.label
              : preset.label,
          description:
            selectedNode.data.description &&
            selectedNode.data.description.trim().length > 0
              ? selectedNode.data.description
              : preset.description,
          visualLevel: preset.visualLevel,
          visualRole: preset.visualRole,
          config: { ...configWithoutActionType, ...preset.config },
        },
      });
    },
    [selectedNode, updateNodeData]
  );

  const createPendingRelationshipForBlock = useCallback(
    (block: WorkflowBlock) => {
      if (!selectedNode) {
        return false;
      }

      const pendingConnection = getPendingWorkflowConnection(
        selectedNode.data.config?.pendingConnection
      );
      if (!pendingConnection) {
        return false;
      }

      const sourceBlock =
        pendingConnection.sourceBlockId === block.id
          ? block
          : nodes.find((node) => node.id === pendingConnection.sourceBlockId)
              ?.data.block;
      const targetBlock =
        pendingConnection.targetBlockId === block.id
          ? block
          : nodes.find((node) => node.id === pendingConnection.targetBlockId)
              ?.data.block;
      const edgeDefaults =
        sourceBlock && targetBlock
          ? getWorkflowEdgeDefaults({ sourceBlock, targetBlock })
          : null;

      if (!edgeDefaults) {
        toast.warning(
          getUnsupportedWorkflowRelationshipMessage({
            sourceBlock,
            targetBlock,
          })
        );
        return false;
      }

      const relationshipExists = edges.some(
        (edge) =>
          edge.source === pendingConnection.sourceBlockId &&
          edge.target === pendingConnection.targetBlockId
      );
      if (relationshipExists) {
        return false;
      }

      const workflowEdge = createWorkflowEdgeRecord({
        id: nanoid(),
        bindingLabel: edgeDefaults.bindingLabel,
        bindingStatus: edgeDefaults.bindingStatus,
        sourceBlockId: pendingConnection.sourceBlockId,
        sourceOutputRole: edgeDefaults.sourceOutputRole,
        targetBlockId: pendingConnection.targetBlockId,
        targetInputRole: edgeDefaults.targetInputRole,
        relationshipType: edgeDefaults.relationshipType,
        reason: edgeDefaults.reason,
      });
      const newEdge = {
        ...createCanvasEdgeFromWorkflowEdge(workflowEdge),
        sourceHandle: pendingConnection.sourceHandle,
        targetHandle: pendingConnection.targetHandle,
      };

      setEdges([...edges, newEdge]);
      setHasUnsavedChanges(true);
      triggerAutosave({ immediate: true });
      toast.success("Typed relationship created");
      return true;
    },
    [
      edges,
      nodes,
      selectedNode,
      setEdges,
      setHasUnsavedChanges,
      triggerAutosave,
    ]
  );

  const handleApplyBlockCatalogItem = useCallback(
    (catalogId: string) => {
      if (!selectedNode || selectedNode.data.type !== "action") {
        return;
      }

      const catalogItem = getBlockCatalogItem(catalogId);
      if (!catalogItem) {
        return;
      }

      const configWithoutActionType = Object.fromEntries(
        Object.entries(selectedNode.data.config ?? {}).filter(
          ([key]) =>
            key !== "actionType" &&
            key !== "blockCandidate" &&
            key !== "integrationId" &&
            key !== "pendingConnection"
        )
      );
      const block = createWorkflowBlockFromCatalog(catalogId, {
        id: selectedNode.id,
        label:
          selectedNode.data.label && selectedNode.data.label.trim().length > 0
            ? selectedNode.data.label
            : catalogItem.label,
        description:
          selectedNode.data.description &&
          selectedNode.data.description.trim().length > 0
            ? selectedNode.data.description
            : catalogItem.description,
        position: selectedNode.position,
        config: configWithoutActionType,
      });
      const visual = getFiscalVisualForFamily(block.family);

      updateNodeData({
        id: selectedNode.id,
        data: {
          label: block.label,
          description: block.description,
          visualLevel: visual.visualLevel,
          visualRole: visual.visualRole,
          config: block.config,
          block,
        },
      });
      createPendingRelationshipForBlock(block);
    },
    [createPendingRelationshipForBlock, selectedNode, updateNodeData]
  );

  const handleUpdateFiscalStage = useCallback(
    (stage: FiscalStage) => {
      if (!selectedNode) {
        return;
      }
      updateNodeData({
        id: selectedNode.id,
        data: getFiscalVisualForStage(stage),
      });
    },
    [selectedNode, updateNodeData]
  );

  const handleUpdateLabel = useCallback(
    (label: string) => {
      if (!selectedNode) {
        return;
      }
      updateNodeData({ id: selectedNode.id, data: { label } });
    },
    [selectedNode, updateNodeData]
  );

  const handleUpdateDescription = useCallback(
    (description: string) => {
      if (!selectedNode) {
        return;
      }
      updateNodeData({ id: selectedNode.id, data: { description } });
    },
    [selectedNode, updateNodeData]
  );

  const handleToggleEnabled = useCallback(() => {
    if (!selectedNode) {
      return;
    }
    updateNodeData({
      id: selectedNode.id,
      data: { enabled: selectedNode.data.enabled === false },
    });
  }, [selectedNode, updateNodeData]);

  const handleDeleteNode = useCallback(() => {
    push(ConfirmOverlay, {
      title: "Delete Step",
      message:
        "Are you sure you want to delete this node? This action cannot be undone.",
      confirmLabel: "Delete",
      confirmVariant: "destructive" as const,
      onConfirm: () => {
        if (selectedNode) {
          deleteNode(selectedNode.id);
          closeAll();
        }
      },
    });
  }, [selectedNode, deleteNode, closeAll, push]);

  const handleCopyCode = useCallback(() => {
    if (!selectedNode) {
      return;
    }
    navigator.clipboard.writeText(generateNodeCode(selectedNode));
    toast.success("Code copied to clipboard");
  }, [selectedNode]);

  const handleRefreshRuns = async () => {
    if (refreshRunsRef.current) {
      setIsRefreshing(true);
      await refreshRunsRef.current();
      setIsRefreshing(false);
    }
  };

  const refreshRunsIfAvailable = async () => {
    if (refreshRunsRef.current) {
      await refreshRunsRef.current();
    }
  };

  const confirmDeleteAllRuns = async () => {
    if (!currentWorkflowId) {
      return;
    }

    if (isLocalWorkflowId(currentWorkflowId)) {
      clearLocalRunRecords();
      clearNodeStatuses();
      await refreshRunsIfAvailable();
      toast.success("All local runs deleted");
      return;
    }

    try {
      await api.workflow.deleteExecutions(currentWorkflowId);
      clearNodeStatuses();
      await refreshRunsIfAvailable();
      toast.success("All runs deleted");
    } catch (error) {
      console.error("Failed to delete runs:", error);
      toast.error("Failed to delete runs");
    }
  };

  const handleDeleteAllRuns = () => {
    push(ConfirmOverlay, {
      title: "Delete All Runs",
      message:
        "Are you sure you want to delete all workflow runs? This action cannot be undone.",
      confirmLabel: "Delete",
      confirmVariant: "destructive" as const,
      onConfirm: confirmDeleteAllRuns,
    });
  };

  // Determine which tabs to show (only for node view)
  const showCodeTab = Boolean(
    selectedNode &&
      (selectedNode.data.block?.family === "Logic" ||
        ((selectedNode.data.type !== "trigger" ||
          (selectedNode.data.config?.triggerType as string) !== "Manual" ||
          selectedNode.data.config?.fiscalStage) &&
          selectedNode.data.config?.actionType !== "Condition"))
  );

  // Get current tab title
  const getTabTitle = () => {
    if (!selectedNode) {
      // For workflow view, validate the tab
      const validTab =
        isInspectorTab(activeTab) && (activeTab !== "runs" || isOwner)
          ? activeTab
          : "properties";
      switch (validTab) {
        case "properties":
          return "Workflow";
        case "code":
          return "Code";
        case "runs":
          return "Runs";
        default:
          return "Workflow";
      }
    }
    switch (activeTab) {
      case "properties":
        return "Properties";
      case "code":
        return "Code";
      case "runs":
        return "Runs";
      default:
        return "Properties";
    }
  };

  // Handle updating workflow name
  const handleUpdateWorkflowName = async (newName: string) => {
    setCurrentWorkflowName(newName);

    if (isLocalWorkflowId(currentWorkflowId)) {
      saveLocalWorkflowSnapshot({
        edges,
        name: newName,
        nodes,
        status: "draft",
      });
      return;
    }

    if (currentWorkflowId) {
      try {
        await api.workflow.update(currentWorkflowId, { name: newName });
      } catch (error) {
        console.error("Failed to update workflow name:", error);
      }
    }
  };

  // Handle clear workflow
  const handleClearWorkflow = () => {
    push(ConfirmOverlay, {
      title: "Clear Workflow",
      message:
        "Are you sure you want to clear all nodes and connections? This action cannot be undone.",
      confirmLabel: "Clear Workflow",
      confirmVariant: "destructive" as const,
      destructive: true,
      onConfirm: () => {
        if (isLocalWorkflowId(currentWorkflowId)) {
          clearWorkflow();
          saveLocalWorkflowSnapshot({
            edges: [],
            name: currentWorkflowName,
            nodes: [],
            status: "draft",
          });
          return;
        }
        clearWorkflow();
      },
    });
  };

  // Handle delete workflow
  const handleDeleteWorkflow = () => {
    push(ConfirmOverlay, {
      title: "Delete Workflow",
      message: `Are you sure you want to delete "${currentWorkflowName}"? This will permanently delete the workflow. This cannot be undone.`,
      confirmLabel: "Delete Workflow",
      confirmVariant: "destructive" as const,
      destructive: true,
      onConfirm: async () => {
        if (!currentWorkflowId) {
          return;
        }
        if (isLocalWorkflowId(currentWorkflowId)) {
          clearWorkflow();
          saveLocalWorkflowSnapshot({
            edges: [],
            name: currentWorkflowName,
            nodes: [],
            status: "draft",
          });
          toast.success("Local workflow cleared");
          return;
        }
        try {
          await api.workflow.delete(currentWorkflowId);
          closeAll();
          toast.success("Workflow deleted successfully");
          window.location.href = "/";
        } catch (error) {
          console.error("Failed to delete workflow:", error);
          toast.error("Failed to delete workflow. Please try again.");
        }
      },
    });
  };

  // Generate full workflow code
  const workflowCode = (() => {
    const baseName = currentWorkflowName
      .replace(NON_ALPHANUMERIC_REGEX, "")
      .split(WORD_SPLIT_REGEX)
      .map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join("");
    const functionName = `${baseName}Workflow`;
    const { code } = generateWorkflowCode(nodes, edges, { functionName });
    return code;
  })();

  // Handle copy workflow code
  const handleCopyWorkflowCode = () => {
    navigator.clipboard.writeText(workflowCode);
    toast.success("Code copied to clipboard");
  };

  // Handle delete edge
  const handleDeleteEdge = () => {
    if (selectedEdgeId) {
      push(ConfirmOverlay, {
        title: "Delete Connection",
        message:
          "Are you sure you want to delete this connection? This action cannot be undone.",
        confirmLabel: "Delete",
        confirmVariant: "destructive" as const,
        onConfirm: () => {
          deleteEdge(selectedEdgeId);
          closeAll();
        },
      });
    }
  };

  const handleInsertBlockBetweenEdge = (catalogId: string) => {
    if (!selectedEdgeId) {
      return;
    }

    const result = insertBlockBetweenEdge({
      catalogId,
      edgeId: selectedEdgeId,
    });
    if (result.ok) {
      toast.success(result.message);
      return;
    }
    toast.warning(result.message);
  };

  const selectedBlock = selectedNode?.data.block;
  const handleExecuteSelectedStep = useCallback(() => {
    if (!(selectedNode && selectedBlock)) {
      return;
    }

    const localRun = runLocalWorkflowTools({
      edges,
      mode: "selected",
      nodes,
      selectedBlockId: selectedBlock.id,
      workflowName: currentWorkflowName,
    });
    saveLocalRunRecord(localRun.record);
    setSelectedExecutionId(localRun.record.execution.id);
    setExecutionLogs(createExecutionLogsMap(localRun.record.logs));
    for (const [nodeId, status] of Object.entries(localRun.blockStatuses)) {
      updateNodeData({ id: nodeId, data: { status } });
    }
    setEdges(
      applyEdgeRunStatuses({
        edgeStatuses: localRun.edgeStatuses,
        edges,
        runId: localRun.record.execution.id,
      })
    );
    if (localRun.result.status === "success") {
      toast.success("Local step run completed");
    } else {
      toast.warning(
        `Local step run completed with ${localRun.result.warnings.length} warning${localRun.result.warnings.length === 1 ? "" : "s"}`
      );
    }
  }, [
    currentWorkflowName,
    edges,
    nodes,
    selectedBlock,
    selectedNode,
    setEdges,
    setExecutionLogs,
    setSelectedExecutionId,
    updateNodeData,
  ]);

  // If an edge is selected, show edge properties
  if (selectedEdge && !selectedNode) {
    return (
      <div className="flex h-[85vh] flex-col">
        <SmartOverlayHeader overlayId={overlayId} title="Relationship" />

        <div className="flex-1 space-y-4 overflow-y-auto px-6 pt-4 pb-6">
          <EdgeInspector
            disabled={isGenerating || !isOwner}
            edge={selectedEdge}
            onDelete={handleDeleteEdge}
            onInsertBlockBetween={handleInsertBlockBetweenEdge}
            onUpdate={(updates) =>
              updateEdgeData({ id: selectedEdge.id, updates })
            }
            sourceBlock={selectedEdgeSourceNode?.data.block}
            targetBlock={selectedEdgeTargetNode?.data.block}
          />
        </div>
      </div>
    );
  }

  // If no node is selected, show workflow-level configuration
  if (!selectedNode) {
    // For workflow view, only properties, code, and runs (if owner) are valid tabs
    const validWorkflowTab =
      activeTab === "properties" ||
      activeTab === "code" ||
      (activeTab === "runs" && isOwner)
        ? activeTab
        : "properties";

    return (
      <div className="flex h-[85vh] flex-col">
        <SmartOverlayHeader overlayId={overlayId} title={getTabTitle()} />

        <div className="flex-1 overflow-y-auto">
          {validWorkflowTab === "properties" && (
            <div className="space-y-4 px-6 pt-4 pb-6">
              <div className="space-y-2">
                <Label htmlFor="workflow-name">Workflow Name</Label>
                <Input
                  disabled={!isOwner}
                  id="workflow-name"
                  onChange={(e) => handleUpdateWorkflowName(e.target.value)}
                  value={currentWorkflowName}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workflow-id">Workflow ID</Label>
                <Input
                  disabled
                  id="workflow-id"
                  value={currentWorkflowId || "Not saved"}
                />
              </div>
              {!isOwner && (
                <div className="rounded-lg border border-muted bg-muted/30 p-3">
                  <p className="text-muted-foreground text-sm">
                    You are viewing a public workflow. Duplicate it to make
                    changes.
                  </p>
                </div>
              )}
              {isOwner && (
                <div className="flex items-center gap-2 pt-2">
                  <Button onClick={handleClearWorkflow} variant="ghost">
                    <Eraser className="mr-2 size-4" />
                    Clear
                  </Button>
                  <Button onClick={handleDeleteWorkflow} variant="ghost">
                    <Trash2 className="mr-2 size-4" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          )}

          {validWorkflowTab === "code" && (
            <div className="flex flex-col">
              <div className="flex shrink-0 items-center justify-between border-b bg-muted/30 px-3 py-2">
                <div className="flex items-center gap-2">
                  <FileCode className="size-3.5 text-muted-foreground" />
                  <code className="text-muted-foreground text-xs">
                    workflow.ts
                  </code>
                </div>
                <Button
                  className="h-7 text-xs"
                  onClick={handleCopyWorkflowCode}
                  size="sm"
                  variant="ghost"
                >
                  <Copy className="mr-1 size-3" />
                  Copy
                </Button>
              </div>
              <div className="h-[400px]">
                <CodeEditor
                  defaultLanguage="typescript"
                  height="100%"
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    fontSize: 12,
                    wordWrap: "on",
                  }}
                  value={workflowCode}
                />
              </div>
            </div>
          )}

          {validWorkflowTab === "runs" && isOwner && (
            <div className="flex h-full flex-col">
              <div className="flex shrink-0 items-center gap-2 border-b px-4 py-2">
                <Button
                  className="text-muted-foreground"
                  disabled={isRefreshing}
                  onClick={handleRefreshRuns}
                  size="icon"
                  variant="ghost"
                >
                  <RefreshCw
                    className={`size-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                </Button>
                <Button
                  className="text-muted-foreground"
                  onClick={handleDeleteAllRuns}
                  size="icon"
                  variant="ghost"
                >
                  <Eraser className="size-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <WorkflowRuns
                  isActive={validWorkflowTab === "runs"}
                  onRefreshRef={refreshRunsRef}
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom tab navigation */}
        <div className="flex shrink-0 items-center justify-around border-t bg-background pb-safe">
          <button
            className={`flex flex-1 flex-col items-center gap-1 py-3 font-medium text-xs transition-colors ${
              validWorkflowTab === "properties"
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("properties")}
            type="button"
          >
            <Settings2 className="size-5" />
            Workflow
          </button>
          <button
            className={`flex flex-1 flex-col items-center gap-1 py-3 font-medium text-xs transition-colors ${
              validWorkflowTab === "code"
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("code")}
            type="button"
          >
            <Code className="size-5" />
            Code
          </button>
          {isOwner && (
            <button
              className={`flex flex-1 flex-col items-center gap-1 py-3 font-medium text-xs transition-colors ${
                validWorkflowTab === "runs"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("runs")}
              type="button"
            >
              <Play className="size-5" />
              Runs
            </button>
          )}
        </div>
      </div>
    );
  }

  const selectedBlockIsExcelSource = isExcelWorkbookSource(selectedBlock);
  const selectedBlockIsRuleSource = isRuleKnowledgeSource(selectedBlock);
  const selectedBlockIsAggregationRuleSource =
    isAggregationRuleKnowledgeSource(selectedBlock);
  const selectedBlockIsCalculationRuleSource =
    isCalculationRuleKnowledgeSource(selectedBlock);
  const selectedBlockIsRollupRuleSource =
    isRollupRuleKnowledgeSource(selectedBlock);

  const selectedExcelSourceHasEvidence = Boolean(
    selectedBlockIsExcelSource &&
      selectedBlock &&
      hasExcelSourceEvidence(selectedBlock.config || {})
  );
  const emptyDraftExcelSource = Boolean(
    selectedBlockIsExcelSource && !selectedExcelSourceHasEvidence
  );
  const sourceEvidenceLocked = Boolean(
    selectedNode.data.block?.source?.treatedAsEvidence &&
      selectedNode.data.block.source.immutable &&
      !isRuleKnowledgeSource(selectedNode.data.block) &&
      !emptyDraftExcelSource
  );
  const protectedNeedsUnlock = Boolean(
    selectedNode.data.block?.governance?.requiresUnlockToEdit &&
      !selectedNode.data.config?.protectedEditIntent
  );
  const identityFieldsDisabled =
    isGenerating || !isOwner || sourceEvidenceLocked || protectedNeedsUnlock;
  const showDataFlowWorkspace = Boolean(
    selectedBlock && !selectedNode.data.config?.blockCandidate
  );
  const latestSelectedBlockRun = selectedBlock
    ? getLatestLocalRunForBlock({
        blockId: selectedBlock.id,
        executionLogs,
        selectedExecutionId,
        storedRecords: loadLocalRunRecords(),
        workflowId: currentWorkflowId,
      })
    : undefined;
  const latestRunOutputsByBlockId = getRunOutputsByBlockId(
    latestSelectedBlockRun
  );
  const sourceVersionCreatedAt = selectedBlock?.config.sourceVersionCreatedAt
    ? Date.parse(String(selectedBlock.config.sourceVersionCreatedAt))
    : Date.parse(String(selectedBlock?.createdAt || ""));
  const latestSourceRunAt = latestSelectedBlockRun?.execution.startedAt
    ? new Date(latestSelectedBlockRun.execution.startedAt).getTime()
    : 0;
  const sourceHasLockableEvidence = Boolean(
    !selectedBlockIsExcelSource || selectedExcelSourceHasEvidence
  );
  const sourceUsedInRun = Boolean(
    selectedBlock?.family === "Source" &&
      latestSelectedBlockRun &&
      latestSourceRunAt >=
        (Number.isNaN(sourceVersionCreatedAt) ? 0 : sourceVersionCreatedAt) &&
      sourceHasLockableEvidence
  );
  const sourceVersion = Number(selectedBlock?.config.sourceVersion || 1);
  const sourceLocked = Boolean(
    selectedBlock?.family === "Source" &&
      (selectedBlock.config.sourceStatus === "published" ||
        (!selectedBlockIsRuleSource &&
          sourceHasLockableEvidence &&
          (sourceUsedInRun || selectedBlock.config.sourceUsedInRun === true)))
  );
  const handleCreateRulebookItem = () => {
    if (selectedBlockIsCalculationRuleSource) {
      setSelectedRulebookItemId(NEW_CALCULATION_RULE_ID);
      return;
    }
    const sourceKind = String(
      selectedBlock?.config.sourceKind || ""
    ).toLowerCase();
    if (
      selectedBlock?.subtype === "Rollup Rules" ||
      sourceKind.includes("rollup_rules")
    ) {
      setSelectedRulebookItemId(NEW_ROLLUP_RULE_ID);
      return;
    }
    if (selectedBlockIsAggregationRuleSource) {
      setSelectedRulebookItemId(NEW_AGGREGATION_RULE_NODE_ID);
      return;
    }
    // Keyword rules
    setSelectedRulebookItemId(NEW_KEYWORD_RULE_ID);
  };
  const handleCreateSourceVersion = () => {
    if (!selectedBlock || selectedBlock.family !== "Source") {
      return;
    }
    handlePatchSelectedBlockConfig({
      previousSourceVersion: sourceVersion,
      sourceStatus: "draft",
      sourceUsedInRun: false,
      sourceVersion: sourceVersion + 1,
      sourceVersionCreatedAt: new Date().toISOString(),
    });
    toast.success("New draft Source version created");
  };
  const leftWorkspacePane = (() => {
    if (!(showDataFlowWorkspace && selectedBlock)) {
      return null;
    }

    if (selectedBlockIsExcelSource) {
      return (
        <ExcelWorkbookViewer
          config={selectedBlock.config || {}}
          disabled={isGenerating || !isOwner || sourceLocked}
          onConfigPatch={handlePatchSelectedBlockConfig}
        />
      );
    }

    if (selectedBlockIsRuleSource) {
      return (
        <RuleSourceViewer
          config={selectedBlock.config || {}}
          disabled={isGenerating || !isOwner || sourceLocked}
          onCreateItem={isOwner && !sourceLocked ? handleCreateRulebookItem : undefined}
          onSelectItem={setSelectedRulebookItemId}
          selectedItemId={selectedRulebookItemId}
        />
      );
    }

    return (
      <BlockDataFlowColumn
        block={selectedBlock}
        calculationInsertDisabled={isGenerating || !isOwner}
        calculationInsertRequest={(key) =>
          setCalculationInsertRequest({ id: nanoid(), key })
        }
        calculationTermCreateRequest={() =>
          setCalculationTermCreateRequest((current) => current + 1)
        }
        calculationTermSelectRequest={setSelectedCalculationTermId}
        edges={edges}
        lastRun={latestSelectedBlockRun}
        nodes={nodes}
        selectedCalculationTermId={selectedCalculationTermId}
        side="inputs"
      />
    );
  })();

  return (
    <div className="flex h-[85vh] flex-col">
      {/* Header with current tab name */}
      <SmartOverlayHeader
        overlayId={overlayId}
        title={showDataFlowWorkspace ? "Block workspace" : getTabTitle()}
      />

      {/* Content based on active tab */}
      {selectedBlockIsRuleSource &&
      !selectedBlockIsAggregationRuleSource &&
      !selectedBlockIsCalculationRuleSource &&
      selectedBlock ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {activeTab === "runs" && isOwner ? (
            <WorkspaceRunsTab
              activeTab={activeTab}
              isRefreshing={isRefreshing}
              onDeleteAll={handleDeleteAllRuns}
              onRefresh={handleRefreshRuns}
              refreshRunsRef={refreshRunsRef}
            />
          ) : (
            <div className="min-h-0 flex-1 overflow-hidden">
              <KeywordRulebookEditor
                disabled={isGenerating || !isOwner || sourceLocked}
                fill
                onRulesChange={(rules) =>
                  handlePatchSelectedBlockConfig({ keywordRules: rules })
                }
                onSelectedRuleIdChange={setSelectedRulebookItemId}
                rules={getKeywordRules(selectedBlock.config || {})}
                selectedRuleId={selectedRulebookItemId}
                sourceVersion={sourceVersion}
              />
            </div>
          )}
        </div>
      ) : selectedBlockIsRollupRuleSource && selectedBlock ? (
        <div className="min-h-0 flex-1 overflow-hidden">
          <RollupRulebookEditor
            config={selectedBlock.config || {}}
            disabled={isGenerating || !isOwner || sourceLocked}
            fill
            onConfigPatch={handlePatchSelectedBlockConfig}
          />
        </div>
      ) : selectedBlockIsCalculationRuleSource && selectedBlock ? (
        <div className="min-h-0 flex-1 overflow-hidden">
          <CalculationEngineEditor
            block={selectedBlock}
            createTermRequest={calculationTermCreateRequest}
            disabled={isGenerating || !isOwner || sourceLocked}
            edges={edges}
            fill
            insertRequest={calculationInsertRequest}
            lastRunOutput={latestRunOutputsByBlockId}
            nodes={nodes}
            onSelectedTermIdChange={setSelectedCalculationTermId}
            onUpdateConfig={(key, value) =>
              handlePatchSelectedBlockConfig({ [key]: value })
            }
            selectedTermId={selectedCalculationTermId}
          />
        </div>
      ) : selectedBlock && isCalculationEngineBlock(selectedBlock) ? (
        // Calculation / Formula group
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {activeTab === "runs" && isOwner ? (
            <WorkspaceRunsTab
              activeTab={activeTab}
              isRefreshing={isRefreshing}
              onDeleteAll={handleDeleteAllRuns}
              onRefresh={handleRefreshRuns}
              refreshRunsRef={refreshRunsRef}
            />
          ) : (
            <CalculationEngineWorkspace
              block={selectedBlock}
              createTermRequest={calculationTermCreateRequest}
              disabled={isGenerating || !isOwner || sourceLocked}
              edges={edges}
              insertRequest={calculationInsertRequest}
              lastRun={latestSelectedBlockRun}
              lastRunOutput={latestRunOutputsByBlockId}
              nodes={nodes}
              onConfigPatch={handlePatchSelectedBlockConfig}
              onExecuteStep={handleExecuteSelectedStep}
              onSelectedTermIdChange={setSelectedCalculationTermId}
              selectedTermId={selectedCalculationTermId}
            />
          )}
        </div>
      ) : selectedBlock && selectedBlock.family === "Field" ? (
        <FieldBlockWorkspace
          block={selectedBlock}
          edges={edges}
          lastRun={latestSelectedBlockRun}
          nodes={nodes}
          onExecuteStep={handleExecuteSelectedStep}
        />
      ) : selectedBlock && (isAggregatorLogicBlock(selectedBlock) || isKeywordMapperBlock(selectedBlock)) ? (
        // Rollup / Aggregation group — inline rules save to block config; connected rulebook overrides
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {activeTab === "runs" && isOwner ? (
            <WorkspaceRunsTab
              activeTab={activeTab}
              isRefreshing={isRefreshing}
              onDeleteAll={handleDeleteAllRuns}
              onRefresh={handleRefreshRuns}
              refreshRunsRef={refreshRunsRef}
            />
          ) : isKeywordMapperBlock(selectedBlock) ? (
            <KeywordMapperWorkspace
              block={selectedBlock}
              disabled={isGenerating || !isOwner}
              edges={edges}
              lastRun={latestSelectedBlockRun}
              nodes={nodes}
              onConfigPatch={handlePatchSelectedBlockConfig}
              onExecuteStep={handleExecuteSelectedStep}
              onSelectedRuleIdChange={setSelectedRulebookItemId}
              selectedRuleId={selectedRulebookItemId}
              sourceVersion={sourceVersion}
            />
          ) : (
            <AggregatorWorkspace
              block={selectedBlock}
              disabled={isGenerating || !isOwner || sourceLocked}
              edges={edges}
              lastRun={latestSelectedBlockRun}
              nodes={nodes}
              onConfigPatch={handlePatchSelectedBlockConfig}
              onExecuteStep={handleExecuteSelectedStep}
            />
          )}
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto">
          {activeTab === "properties" && (
            <div className="space-y-4 px-6 pt-4 pb-6">
              {/* Action selection */}
              {selectedNode.data.type === "action" &&
                !selectedNode.data.config?.actionType &&
                !selectedNode.data.visualLevel &&
                isOwner && (
                  <ActionGrid
                    disabled={isGenerating}
                    isNewlyCreated={selectedNode?.id === newlyCreatedNodeId}
                    onSelectAction={(actionType) => {
                      if (actionType.startsWith("preset:")) {
                        handleApplyVisualPreset(actionType);
                        if (selectedNode?.id === newlyCreatedNodeId) {
                          setNewlyCreatedNodeId(null);
                        }
                        return;
                      }

                      if (getBlockCatalogItem(actionType)) {
                        handleApplyBlockCatalogItem(actionType);
                        if (selectedNode?.id === newlyCreatedNodeId) {
                          setNewlyCreatedNodeId(null);
                        }
                        return;
                      }

                      handleUpdateConfig("actionType", actionType);
                      if (selectedNode?.id === newlyCreatedNodeId) {
                        setNewlyCreatedNodeId(null);
                      }
                    }}
                  />
                )}

              {selectedNode.data.type === "trigger" && (
                <TriggerConfig
                  config={selectedNode.data.config || {}}
                  disabled={isGenerating || !isOwner}
                  onUpdateConfig={handleUpdateConfig}
                  workflowId={currentWorkflowId ?? undefined}
                />
              )}

              {selectedBlock?.family === "Source" && (
                <SourceSetupPanel
                  block={selectedBlock}
                  config={
                    selectedBlock.config || selectedNode.data.config || {}
                  }
                  disabled={isGenerating || !isOwner}
                  onConfigPatch={handlePatchSelectedBlockConfig}
                  onCreateSourceVersion={handleCreateSourceVersion}
                  onSelectedRulebookItemChange={setSelectedRulebookItemId}
                  selectedRulebookItemId={selectedRulebookItemId}
                  showRulebookOverview={!selectedBlockIsRuleSource}
                  sourceLocked={sourceLocked}
                  sourceUsedInRun={sourceUsedInRun}
                  sourceVersion={sourceVersion}
                />
              )}

              {selectedBlock && isKeywordMapperBlock(selectedBlock) && (
                <KeywordMapperRulesPanel
                  block={selectedBlock}
                  edges={edges}
                  nodes={nodes}
                  onOpenRuleSource={(nodeId) => {
                    setSelectedNodeId(nodeId);
                    setActiveTab("properties");
                  }}
                />
              )}

              {selectedBlock && isHierarchyAggregatorBlock(selectedBlock) && (
                <HierarchyAggregatorPanel
                  block={selectedBlock}
                  edges={edges}
                  lastRun={latestSelectedBlockRun}
                  nodes={nodes}
                  onOpenRuleSource={(nodeId) => {
                    setSelectedNodeId(nodeId);
                    setActiveTab("properties");
                  }}
                />
              )}

              {selectedBlock && isCalculationEngineBlock(selectedBlock) && (
                <CalculationEngineModeSection
                  block={selectedBlock}
                  createTermRequest={calculationTermCreateRequest}
                  disabled={isGenerating || !isOwner}
                  edges={edges}
                  insertRequest={calculationInsertRequest}
                  lastRunOutput={latestRunOutputsByBlockId}
                  nodes={nodes}
                  onSelectedTermIdChange={setSelectedCalculationTermId}
                  onUpdateConfig={(key, value) =>
                    handlePatchSelectedBlockConfig({ [key]: value })
                  }
                  selectedTermId={selectedCalculationTermId}
                />
              )}

              {selectedNode.data.type === "action" &&
                selectedNode.data.config?.actionType !== undefined && (
                  <ActionConfig
                    config={selectedNode.data.config || {}}
                    disabled={isGenerating || !isOwner}
                    isOwner={isOwner}
                    onUpdateConfig={handleUpdateConfig}
                  />
                )}

              {(selectedNode.data.config?.fiscalStage ||
                (!selectedNode.data.config?.actionType &&
                  selectedNode.data.visualRole)) &&
                !usesFocusedLogicWorkspace(selectedBlock) && (
                  <FiscalBlockConfig
                    config={selectedNode.data.config || {}}
                    disabled={isGenerating || !isOwner}
                    onUpdateConfig={handleUpdateConfig}
                    onUpdateStage={handleUpdateFiscalStage}
                    visualRole={selectedNode.data.visualRole}
                  />
                )}

              {/* Label & Description */}
              {(selectedNode.data.type !== "action" ||
                selectedNode.data.config?.actionType !== undefined ||
                selectedNode.data.visualLevel) && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="label">Label</Label>
                    <Input
                      disabled={identityFieldsDisabled}
                      id="label"
                      onChange={(e) => handleUpdateLabel(e.target.value)}
                      value={selectedNode.data.label as string}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      disabled={identityFieldsDisabled}
                      id="description"
                      onChange={(e) => handleUpdateDescription(e.target.value)}
                      placeholder="Optional description"
                      value={(selectedNode.data.description as string) || ""}
                    />
                  </div>
                </>
              )}

              {/* Actions */}
              {isOwner && (
                <div className="flex items-center gap-2 pt-2">
                  {selectedNode.data.type === "action" && (
                    <Button
                      className="text-muted-foreground"
                      onClick={handleToggleEnabled}
                      size="sm"
                      variant="ghost"
                    >
                      {selectedNode.data.enabled === false ? (
                        <>
                          <EyeOff className="mr-2 size-4" />
                          Disabled
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 size-4" />
                          Enabled
                        </>
                      )}
                    </Button>
                  )}
                  <Button
                    className="text-muted-foreground"
                    onClick={handleDeleteNode}
                    size="sm"
                    variant="ghost"
                  >
                    <Trash2 className="mr-2 size-4" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Preload Code tab - always render but hide when not active */}
          {showCodeTab && (
            <div
              className={`flex flex-col ${activeTab === "code" ? "" : "-z-10 invisible absolute"}`}
            >
              {showDataFlowWorkspace && selectedBlock ? (
                <BlockGeneratedCodeTab
                  block={selectedBlock}
                  edges={edges}
                  nodes={nodes}
                />
              ) : (
                <>
                  <div className="flex shrink-0 items-center justify-between border-b bg-muted/30 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <FileCode className="size-3.5 text-muted-foreground" />
                      <code className="text-muted-foreground text-xs">
                        {getCodeFilename(selectedNode)}
                      </code>
                    </div>
                    <Button
                      className="text-muted-foreground"
                      onClick={handleCopyCode}
                      size="sm"
                      variant="ghost"
                    >
                      <Copy className="mr-2 size-4" />
                      Copy
                    </Button>
                  </div>
                  <div className="h-[400px]">
                    <CodeEditor
                      height="100%"
                      language={
                        selectedNode.data.type === "trigger" &&
                        (selectedNode.data.config?.triggerType as string) ===
                          "Schedule"
                          ? "json"
                          : "typescript"
                      }
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 13,
                        lineNumbers: "on",
                        folding: false,
                        wordWrap: "off",
                        padding: { top: 16, bottom: 16 },
                      }}
                      value={generateNodeCode(selectedNode)}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "runs" && isOwner && (
            <div className="flex h-full flex-col">
              <div className="flex shrink-0 items-center gap-2 border-b px-4 py-2">
                <Button
                  className="text-muted-foreground"
                  disabled={isRefreshing}
                  onClick={handleRefreshRuns}
                  size="sm"
                  variant="ghost"
                >
                  <RefreshCw
                    className={`mr-2 size-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
                <Button
                  className="text-muted-foreground"
                  onClick={handleDeleteAllRuns}
                  size="sm"
                  variant="ghost"
                >
                  <Eraser className="mr-2 size-4" />
                  Clear All
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <WorkflowRuns
                  isActive={activeTab === "runs"}
                  onRefreshRef={refreshRunsRef}
                />
              </div>
            </div>
          )}
          </div>
          {selectedBlock && (
            <CollapsibleDataFlow
              block={selectedBlock}
              edges={edges}
              lastRun={latestSelectedBlockRun}
              nodes={nodes}
              onExecuteStep={handleExecuteSelectedStep}
            />
          )}
        </div>
      )}

      {/* Bottom tab navigation */}
      <div className="flex shrink-0 items-center justify-around border-t bg-background pb-safe">
        <button
          className={`flex flex-1 flex-col items-center gap-1 py-3 font-medium text-xs transition-colors ${
            activeTab === "properties"
              ? "text-foreground"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("properties")}
          type="button"
        >
          <Settings2 className="size-5" />
          Properties
        </button>
        {showCodeTab && (
          <button
            className={`flex flex-1 flex-col items-center gap-1 py-3 font-medium text-xs transition-colors ${
              activeTab === "code" ? "text-foreground" : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("code")}
            type="button"
          >
            <Code className="size-5" />
            Code
          </button>
        )}
        {isOwner && (
          <button
            className={`flex flex-1 flex-col items-center gap-1 py-3 font-medium text-xs transition-colors ${
              activeTab === "runs" ? "text-foreground" : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("runs")}
            type="button"
          >
            <Play className="size-5" />
            Runs
          </button>
        )}
      </div>
    </div>
  );
}
