"use client";

import {
  ConnectionMode,
  type EdgeMouseHandler,
  MiniMap,
  type Node,
  type NodeMouseHandler,
  type OnConnect,
  type OnConnectStartParams,
  useReactFlow,
  type Connection as XYFlowConnection,
  type Edge as XYFlowEdge,
} from "@xyflow/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@/components/ai-elements/canvas";
import { Connection } from "@/components/ai-elements/connection";
import { Controls } from "@/components/ai-elements/controls";
import { AIPrompt } from "@/components/ai-elements/prompt";
import { ConfigurationOverlay } from "@/components/overlays/configuration-overlay";
import { useOverlay } from "@/components/overlays/overlay-provider";
import { WorkflowToolbar } from "@/components/workflow/workflow-toolbar";
import "@xyflow/react/dist/style.css";

import { nanoid } from "nanoid";
import { toast } from "sonner";
import {
  createDefaultWorkflowBlockCandidate,
  createPendingWorkflowConnection,
  getUnsupportedWorkflowRelationshipMessage,
  getWorkflowEdgeDefaults,
  isLocalWorkflowId,
} from "@/lib/local-fiscal-workflow";
import {
  addNodeAtom,
  connectBlocksAtom,
  currentWorkflowIdAtom,
  edgesAtom,
  isGeneratingAtom,
  isPanelAnimatingAtom,
  isSidebarCollapsedAtom,
  isTransitioningFromHomepageAtom,
  nodesAtom,
  onEdgesChangeAtom,
  onNodesChangeAtom,
  propertiesPanelActiveTabAtom,
  rightPanelWidthAtom,
  selectedEdgeAtom,
  selectedNodeAtom,
  showMinimapAtom,
  triggerFitViewAtom,
  updateNodeDataAtom,
  type WorkflowNode,
} from "@/lib/workflow-store";
import {
  getDefaultInspectorTabForFamily,
  getDefaultInspectorTabForSelection,
} from "@/src/domain/workflow/inspector-rules";
import { Edge } from "../ai-elements/edge";
import { Panel } from "../ai-elements/panel";
import { ActionNode } from "./nodes/action-node";
import { AddNode } from "./nodes/add-node";
import { TriggerNode } from "./nodes/trigger-node";
import {
  type ContextMenuState,
  useContextMenuHandlers,
  WorkflowContextMenu,
} from "./workflow-context-menu";

const edgeTypes = {
  animated: Edge.Animated,
  temporary: Edge.Temporary,
};

function getNeutralNodeForPendingConnection({
  sourceNode,
  targetNode,
}: {
  sourceNode?: WorkflowNode;
  targetNode?: WorkflowNode;
}): WorkflowNode | undefined {
  const sourceIsTyped = Boolean(sourceNode?.data.block);
  const targetIsTyped = Boolean(targetNode?.data.block);
  const sourceIsNeutralAction = Boolean(
    sourceNode && sourceNode.data.type === "action" && !sourceNode.data.block
  );
  const targetIsNeutralAction = Boolean(
    targetNode && targetNode.data.type === "action" && !targetNode.data.block
  );

  if (sourceIsTyped && targetIsNeutralAction) {
    return targetNode;
  }
  if (targetIsTyped && sourceIsNeutralAction) {
    return sourceNode;
  }

  return;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: React Flow canvas requires complex setup
export function WorkflowCanvas() {
  const [nodes, setNodes] = useAtom(nodesAtom);
  const [edges, setEdges] = useAtom(edgesAtom);
  const [isGenerating] = useAtom(isGeneratingAtom);
  const currentWorkflowId = useAtomValue(currentWorkflowIdAtom);
  const [showMinimap] = useAtom(showMinimapAtom);
  const rightPanelWidth = useAtomValue(rightPanelWidthAtom);
  const isPanelAnimating = useAtomValue(isPanelAnimatingAtom);
  const [isTransitioningFromHomepage, setIsTransitioningFromHomepage] = useAtom(
    isTransitioningFromHomepageAtom
  );
  const onNodesChange = useSetAtom(onNodesChangeAtom);
  const onEdgesChange = useSetAtom(onEdgesChangeAtom);
  const setSelectedNode = useSetAtom(selectedNodeAtom);
  const setSelectedEdge = useSetAtom(selectedEdgeAtom);
  const setSidebarCollapsed = useSetAtom(isSidebarCollapsedAtom);
  const addNode = useSetAtom(addNodeAtom);
  const connectBlocks = useSetAtom(connectBlocksAtom);
  const setActiveTab = useSetAtom(propertiesPanelActiveTabAtom);
  const updateNodeData = useSetAtom(updateNodeDataAtom);
  const [triggerFitView, setTriggerFitView] = useAtom(triggerFitViewAtom);
  const { open: openOverlay } = useOverlay();
  const { screenToFlowPosition, fitView, getViewport, setViewport } =
    useReactFlow();

  const connectingNodeId = useRef<string | null>(null);
  const connectingHandleType = useRef<"source" | "target" | null>(null);
  const justCreatedNodeFromConnection = useRef(false);
  const viewportInitialized = useRef(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [contextMenuState, setContextMenuState] =
    useState<ContextMenuState>(null);

  // Context menu handlers
  const { onNodeContextMenu, onEdgeContextMenu, onPaneContextMenu } =
    useContextMenuHandlers(screenToFlowPosition, setContextMenuState);

  const closeContextMenu = useCallback(() => {
    setContextMenuState(null);
  }, []);

  // Track which workflow we've fitted view for to prevent re-running
  const fittedViewForWorkflowRef = useRef<string | null | undefined>(undefined);
  // Track if we have real nodes (not just placeholder "add" node)
  const hasRealNodes = nodes.some((n) => n.type !== "add");
  const hadRealNodesRef = useRef(false);
  useEffect(() => {
    if (triggerFitView) {
      fitView({ duration: 300 });
      setTriggerFitView(false);
    }
  }, [triggerFitView, fitView, setTriggerFitView]);

  // Pre-shift viewport when transitioning from homepage (before sidebar animates)
  const hasPreShiftedRef = useRef(false);
  useEffect(() => {
    if (isTransitioningFromHomepage && !hasPreShiftedRef.current) {
      hasPreShiftedRef.current = true;

      // Check if sidebar is collapsed from cookie (atom may not be initialized yet)
      const collapsedCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("sidebar-collapsed="));
      const isCollapsed = collapsedCookie?.split("=")[1] === "true";

      // Skip if sidebar is collapsed - content should stay centered
      if (isCollapsed) {
        return;
      }

      // Shift viewport left to center content in the future visible area
      // Default sidebar is 30%, so shift by 15% of window width
      const viewport = getViewport();
      const defaultSidebarPercent = 0.3;
      const shiftPixels = (window.innerWidth * defaultSidebarPercent) / 2;
      setViewport(
        { ...viewport, x: viewport.x - shiftPixels },
        { duration: 0 }
      );
    }
  }, [isTransitioningFromHomepage, getViewport, setViewport]);

  // Fit view when workflow changes (only on initial load, not home -> workflow)
  useEffect(() => {
    // Skip if we've already fitted view for this workflow
    if (fittedViewForWorkflowRef.current === currentWorkflowId) {
      return;
    }

    // Skip fitView for homepage -> workflow transition (viewport already set from homepage)
    if (isTransitioningFromHomepage && viewportInitialized.current) {
      fittedViewForWorkflowRef.current = currentWorkflowId;
      setIsCanvasReady(true);
      // Clear the flag after using it
      setIsTransitioningFromHomepage(false);
      return;
    }

    // Use fitView after a brief delay to ensure React Flow and nodes are ready
    setTimeout(() => {
      fitView({ maxZoom: 1, minZoom: 0.5, padding: 0.2, duration: 0 });
      fittedViewForWorkflowRef.current = currentWorkflowId;
      viewportInitialized.current = true;
      // Show canvas immediately so width animation can be seen
      setIsCanvasReady(true);
      // Clear the flag
      setIsTransitioningFromHomepage(false);
    }, 0);
  }, [
    currentWorkflowId,
    fitView,
    isTransitioningFromHomepage,
    setIsTransitioningFromHomepage,
  ]);

  // Fit view when first real node is added on homepage
  useEffect(() => {
    if (currentWorkflowId) {
      return; // Only for homepage
    }
    // Check if we just got our first real node
    if (hasRealNodes && !hadRealNodesRef.current) {
      hadRealNodesRef.current = true;
      // Fit view to center the new node
      setTimeout(() => {
        fitView({ maxZoom: 1, minZoom: 0.5, padding: 0.2, duration: 0 });
        viewportInitialized.current = true;
        setIsCanvasReady(true);
      }, 0);
    } else if (!hasRealNodes) {
      // Reset when back to placeholder only
      hadRealNodesRef.current = false;
    }
  }, [currentWorkflowId, hasRealNodes, fitView]);

  // Keyboard shortcut for fit view (Cmd+/ or Ctrl+/)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd+/ (Mac) or Ctrl+/ (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === "/") {
        event.preventDefault();
        fitView({ padding: 0.2, duration: 300 });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fitView]);

  const nodeTypes = useMemo(
    () => ({
      trigger: TriggerNode,
      action: ActionNode,
      add: AddNode,
    }),
    []
  );

  const nodeHasHandle = useCallback(
    (nodeId: string, handleType: "source" | "target") => {
      const node = nodes.find((n) => n.id === nodeId);

      if (!node) {
        return false;
      }

      if (node.type === "add") {
        return false;
      }

      if (handleType === "target") {
        return node.type !== "trigger";
      }

      return true;
    },
    [nodes]
  );

  const isValidConnection = useCallback(
    (connection: XYFlowConnection | XYFlowEdge) => {
      // Ensure we have both source and target
      if (!(connection.source && connection.target)) {
        return false;
      }

      // Prevent self-connections
      if (connection.source === connection.target) {
        return false;
      }

      // Ensure connection is from source handle to target handle
      // sourceHandle should be defined if connecting from a specific handle
      // targetHandle should be defined if connecting to a specific handle
      return true;
    },
    []
  );

  const onConnect: OnConnect = useCallback(
    (connection: XYFlowConnection) => {
      if (!(connection.source && connection.target)) {
        return;
      }
      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);
      const sourceBlock = sourceNode?.data.block;
      const targetBlock = targetNode?.data.block;
      const edgeDefaults =
        sourceBlock && targetBlock
          ? getWorkflowEdgeDefaults({ sourceBlock, targetBlock })
          : null;

      if (!edgeDefaults) {
        const neutralNode = getNeutralNodeForPendingConnection({
          sourceNode,
          targetNode,
        });
        if (neutralNode) {
          updateNodeData({
            id: neutralNode.id,
            data: {
              config: {
                ...neutralNode.data.config,
                blockCandidate: true,
                pendingConnection: createPendingWorkflowConnection({
                  sourceBlockId: connection.source,
                  sourceHandle: connection.sourceHandle,
                  targetBlockId: connection.target,
                  targetHandle: connection.targetHandle,
                }),
              },
            },
          });
          toast.info("Choose a block type to finish this relationship.");
          return;
        }

        toast.warning(
          getUnsupportedWorkflowRelationshipMessage({
            sourceBlock,
            targetBlock,
          })
        );
        return;
      }

      connectBlocks({
        source: connection.source,
        sourceHandle: connection.sourceHandle,
        target: connection.target,
        targetHandle: connection.targetHandle,
      });
    },
    [connectBlocks, nodes, updateNodeData]
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      const workflowNode = node as WorkflowNode;
      setSelectedNode(node.id);
      setSelectedEdge(null);
      setActiveTab(
        getDefaultInspectorTabForFamily(workflowNode.data.block?.family)
      );
      setSidebarCollapsed(false);
      openOverlay(ConfigurationOverlay, {}, { size: "wide" });
    },
    [
      openOverlay,
      setActiveTab,
      setSelectedEdge,
      setSelectedNode,
      setSidebarCollapsed,
    ]
  );

  const onEdgeClick: EdgeMouseHandler = useCallback(
    (_event, edge) => {
      setSelectedEdge(edge.id);
      setSelectedNode(null);
      setActiveTab(
        getDefaultInspectorTabForSelection({
          family: null,
          selectionKind: "edge",
        })
      );
      setSidebarCollapsed(false);
      setEdges((currentEdges) =>
        currentEdges.map((currentEdge) => ({
          ...currentEdge,
          selected: currentEdge.id === edge.id,
        }))
      );
      setNodes((currentNodes) =>
        currentNodes.map((currentNode) => ({
          ...currentNode,
          selected: false,
        }))
      );
      openOverlay(ConfigurationOverlay, {}, { size: "wide" });
    },
    [
      openOverlay,
      setActiveTab,
      setEdges,
      setNodes,
      setSelectedEdge,
      setSelectedNode,
      setSidebarCollapsed,
    ]
  );

  const onConnectStart = useCallback(
    (_event: MouseEvent | TouchEvent, params: OnConnectStartParams) => {
      connectingNodeId.current = params.nodeId;
      connectingHandleType.current = params.handleType;
    },
    []
  );

  const getClientPosition = useCallback((event: MouseEvent | TouchEvent) => {
    const clientX =
      "changedTouches" in event
        ? event.changedTouches[0].clientX
        : event.clientX;
    const clientY =
      "changedTouches" in event
        ? event.changedTouches[0].clientY
        : event.clientY;
    return { clientX, clientY };
  }, []);

  const calculateMenuPosition = useCallback(
    (event: MouseEvent | TouchEvent, clientX: number, clientY: number) => {
      const reactFlowBounds = (event.target as Element)
        .closest(".react-flow")
        ?.getBoundingClientRect();

      const adjustedX = reactFlowBounds
        ? clientX - reactFlowBounds.left
        : clientX;
      const adjustedY = reactFlowBounds
        ? clientY - reactFlowBounds.top
        : clientY;

      return { adjustedX, adjustedY };
    },
    []
  );

  const handleConnectionToExistingNode = useCallback(
    (nodeElement: Element) => {
      const targetNodeId = nodeElement.getAttribute("data-id");
      const fromSource = connectingHandleType.current === "source";
      const requiredHandle = fromSource ? "target" : "source";
      const connectingId = connectingNodeId.current;

      if (
        targetNodeId &&
        connectingId &&
        targetNodeId !== connectingId &&
        nodeHasHandle(targetNodeId, requiredHandle)
      ) {
        const sourceId = fromSource ? connectingId : targetNodeId;
        const targetId = fromSource ? targetNodeId : connectingId;
        onConnect({
          source: sourceId,
          target: targetId,
          sourceHandle: null,
          targetHandle: null,
        });
      }
    },
    [nodeHasHandle, onConnect]
  );

  const handleConnectionToNewNode = useCallback(
    (event: MouseEvent | TouchEvent, clientX: number, clientY: number) => {
      const sourceNodeId = connectingNodeId.current;
      if (!sourceNodeId) {
        return;
      }

      const { adjustedX, adjustedY } = calculateMenuPosition(
        event,
        clientX,
        clientY
      );

      // Get the position in the flow coordinate system
      const position = screenToFlowPosition({
        x: adjustedX,
        y: adjustedY,
      });

      // Center the node vertically at the cursor position
      // Node height is 192px (h-48 in Tailwind)
      const nodeHeight = 192;
      position.y -= nodeHeight / 2;

      const newNodeId = nanoid();
      const fromSource = connectingHandleType.current === "source";
      const sourceId = fromSource ? sourceNodeId : newNodeId;
      const targetId = fromSource ? newNodeId : sourceNodeId;
      const newNode: WorkflowNode = createDefaultWorkflowBlockCandidate({
        id: newNodeId,
        pendingConnection: createPendingWorkflowConnection({
          sourceBlockId: sourceId,
          sourceHandle: null,
          targetBlockId: targetId,
          targetHandle: null,
        }),
        position,
      });

      addNode(newNode);
      setSelectedNode(newNode.id);
      setActiveTab("properties");
      openOverlay(ConfigurationOverlay, {}, { size: "wide" });

      // Deselect all other nodes and select only the new node
      // Need to do this after a delay because panOnDrag will clear selection
      setTimeout(() => {
        setNodes((currentNodes) =>
          currentNodes.map((n) => ({
            ...n,
            selected: n.id === newNode.id,
          }))
        );
      }, 50);

      toast.info("Choose a block type to finish this relationship.");

      // Set flag to prevent immediate deselection
      justCreatedNodeFromConnection.current = true;
      setTimeout(() => {
        justCreatedNodeFromConnection.current = false;
      }, 100);
    },
    [
      calculateMenuPosition,
      screenToFlowPosition,
      addNode,
      setNodes,
      setSelectedNode,
      setActiveTab,
      openOverlay,
    ]
  );

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!connectingNodeId.current) {
        return;
      }

      // Get client position first
      const { clientX, clientY } = getClientPosition(event);

      // For touch events, use elementFromPoint to get the actual element at the touch position
      // For mouse events, use event.target as before
      const target =
        "changedTouches" in event
          ? document.elementFromPoint(clientX, clientY)
          : (event.target as Element);

      if (!target) {
        connectingNodeId.current = null;
        return;
      }

      const nodeElement = target.closest(".react-flow__node");
      const isHandle = target.closest(".react-flow__handle");

      // Create connection on edge dragged over node release
      if (nodeElement && !isHandle && connectingHandleType.current) {
        handleConnectionToExistingNode(nodeElement);
        connectingNodeId.current = null;
        connectingHandleType.current = null;
        return;
      }

      if (!(nodeElement || isHandle)) {
        handleConnectionToNewNode(event, clientX, clientY);
      }

      connectingNodeId.current = null;
      connectingHandleType.current = null;
    },
    [
      getClientPosition,
      handleConnectionToExistingNode,
      handleConnectionToNewNode,
    ]
  );

  const onPaneClick = useCallback(() => {
    // Don't deselect if we just created a node from a connection
    if (justCreatedNodeFromConnection.current) {
      return;
    }
    setSelectedNode(null);
    setSelectedEdge(null);
    closeContextMenu();
  }, [setSelectedNode, setSelectedEdge, closeContextMenu]);

  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: Node[] }) => {
      // Don't clear selection if we just created a node from a connection
      if (justCreatedNodeFromConnection.current && selectedNodes.length === 0) {
        return;
      }

      if (selectedNodes.length === 0) {
        setSelectedNode(null);
      } else if (selectedNodes.length === 1) {
        setSelectedNode(selectedNodes[0].id);
      }
    },
    [setSelectedNode]
  );

  return (
    <div
      className="relative h-full bg-transparent"
      data-testid="workflow-canvas"
      style={{
        opacity: isCanvasReady ? 1 : 0,
        width: rightPanelWidth ? `calc(100% - ${rightPanelWidth})` : "100%",
        transition: isPanelAnimating
          ? "width 300ms ease-out, opacity 300ms"
          : "opacity 300ms",
      }}
    >
      {/* Toolbar */}
      <div className="pointer-events-auto">
        <WorkflowToolbar workflowId={currentWorkflowId ?? undefined} />
      </div>

      {/* Fiscal workflow vocabulary legend */}
      <div className="pointer-events-none absolute top-16 right-4 z-20 max-w-[260px] rounded-lg px-3 py-2 shadow-sm backdrop-blur" style={{ background: 'rgba(26,26,32,0.88)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="font-medium text-[10px] uppercase" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Fiscal Flow
        </div>
        <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Source → Logic → Review / Validation
        </div>
        <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Protected → Output
        </div>
      </div>

      {/* React Flow Canvas */}
      <Canvas
        className=""
        connectionLineComponent={Connection}
        connectionMode={ConnectionMode.Strict}
        edges={edges}
        edgeTypes={edgeTypes}
        elementsSelectable={!isGenerating}
        isValidConnection={isValidConnection}
        nodes={nodes}
        nodesConnectable={!isGenerating}
        nodesDraggable={!isGenerating}
        nodeTypes={nodeTypes}
        onConnect={isGenerating ? undefined : onConnect}
        onConnectEnd={isGenerating ? undefined : onConnectEnd}
        onConnectStart={isGenerating ? undefined : onConnectStart}
        onEdgeClick={isGenerating ? undefined : onEdgeClick}
        onEdgeContextMenu={isGenerating ? undefined : onEdgeContextMenu}
        onEdgesChange={isGenerating ? undefined : onEdgesChange}
        onNodeClick={isGenerating ? undefined : onNodeClick}
        onNodeContextMenu={isGenerating ? undefined : onNodeContextMenu}
        onNodesChange={isGenerating ? undefined : onNodesChange}
        onPaneClick={onPaneClick}
        onPaneContextMenu={isGenerating ? undefined : onPaneContextMenu}
        onSelectionChange={isGenerating ? undefined : onSelectionChange}
      >
        <Panel
          className="workflow-controls-panel border-none bg-transparent p-0"
          position="bottom-left"
        >
          <Controls />
        </Panel>
        {showMinimap && (
          <MiniMap
            bgColor="var(--card)"
            maskColor="rgba(0,0,0,0.25)"
            nodeColor="var(--muted-foreground)"
            nodeStrokeColor="var(--border)"
            nodeStrokeWidth={1}
          />
        )}
      </Canvas>

      {/* AI Prompt */}
      {currentWorkflowId && !isLocalWorkflowId(currentWorkflowId) && (
        <AIPrompt workflowId={currentWorkflowId} />
      )}

      {/* Context Menu */}
      <WorkflowContextMenu
        menuState={contextMenuState}
        onClose={closeContextMenu}
      />
    </div>
  );
}
