import {
  BaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
  getBezierPath,
  getSimpleBezierPath,
  type InternalNode,
  type Node,
  Position,
  useInternalNode,
} from "@xyflow/react";
import { CheckCircle2, Loader2, TriangleAlert, XCircle } from "lucide-react";
import type { WorkflowEdge as SchemaWorkflowEdge } from "@/lib/local-fiscal-workflow";
import {
  formatRelationshipType,
  getEdgeLabelClassName,
  getEdgeStatusClasses,
} from "@/components/workflow/utils/edge-relationships";

const EDGE_SELECTED_STROKE = "rgb(167 139 250)";
const EDGE_SELECTED_GLOW = "rgba(139, 92, 246, 0.60)";
const EDGE_TEMPORARY_STROKE = "rgb(248 250 252)";

type EdgeRunStatus = "error" | "idle" | "running" | "success" | "warning";

function getRunStatusVisual(status?: EdgeRunStatus) {
  if (status === "success") {
    return {
      badgeClassName:
        "border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-200",
      glow: "rgba(16, 185, 129, 0.45)",
      label: "passed",
      stroke: "rgb(16 185 129)",
      strokeDasharray: "10 6",
    };
  }

  if (status === "warning") {
    return {
      badgeClassName:
        "border-amber-500/40 bg-amber-500/15 text-amber-700 dark:text-amber-200",
      glow: "rgba(245, 158, 11, 0.42)",
      label: "review",
      stroke: "rgb(245 158 11)",
      strokeDasharray: "8 5",
    };
  }

  if (status === "error") {
    return {
      badgeClassName:
        "border-red-500/40 bg-red-500/15 text-red-700 dark:text-red-200",
      glow: "rgba(239, 68, 68, 0.45)",
      label: "blocked",
      stroke: "rgb(239 68 68)",
      strokeDasharray: "3 5",
    };
  }

  if (status === "running") {
    return {
      badgeClassName:
        "border-cyan-500/40 bg-cyan-500/15 text-cyan-700 dark:text-cyan-200",
      glow: "rgba(34, 211, 238, 0.4)",
      label: "running",
      stroke: "rgb(34 211 238)",
      strokeDasharray: "8 6",
    };
  }

  return null;
}

function RunStatusIcon({ status }: { status?: EdgeRunStatus }) {
  if (status === "success") {
    return <CheckCircle2 className="size-3" />;
  }
  if (status === "warning") {
    return <TriangleAlert className="size-3" />;
  }
  if (status === "error") {
    return <XCircle className="size-3" />;
  }
  if (status === "running") {
    return <Loader2 className="size-3 animate-spin" />;
  }
  return null;
}

const Temporary = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
}: EdgeProps) => {
  const [edgePath] = getSimpleBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      {selected && (
        <BaseEdge
          id={`${id}-glow`}
          path={edgePath}
          style={{
            filter: "drop-shadow(0 0 8px rgba(139, 92, 246, 0.8))",
            opacity: 0.5,
            stroke: EDGE_SELECTED_GLOW,
            strokeDasharray: "5, 5",
            strokeWidth: 4,
          }}
        />
      )}
      <BaseEdge
        className="stroke-1"
        id={id}
        path={edgePath}
        style={{
          stroke: selected ? EDGE_SELECTED_STROKE : EDGE_TEMPORARY_STROKE,
          strokeDasharray: "5, 5",
          strokeWidth: selected ? 2 : 1.5,
        }}
      />
    </>
  );
};

const getHandleCoordsByPosition = (
  node: InternalNode<Node>,
  handlePosition: Position
) => {
  // Choose the handle type based on position - Left is for target, Right is for source
  const handleType = handlePosition === Position.Left ? "target" : "source";

  const handle = node.internals.handleBounds?.[handleType]?.find(
    (h) => h.position === handlePosition
  );

  if (!handle) {
    return [0, 0] as const;
  }

  let offsetX = handle.width / 2;
  let offsetY = handle.height / 2;

  // this is a tiny detail to make the markerEnd of an edge visible.
  // The handle position that gets calculated has the origin top-left, so depending which side we are using, we add a little offset
  // when the handlePosition is Position.Right for example, we need to add an offset as big as the handle itself in order to get the correct position
  switch (handlePosition) {
    case Position.Left:
      offsetX = 0;
      break;
    case Position.Right:
      offsetX = handle.width;
      break;
    case Position.Top:
      offsetY = 0;
      break;
    case Position.Bottom:
      offsetY = handle.height;
      break;
    default:
      throw new Error(`Invalid handle position: ${handlePosition}`);
  }

  const x = node.internals.positionAbsolute.x + handle.x + offsetX;
  const y = node.internals.positionAbsolute.y + handle.y + offsetY;

  return [x, y] as const;
};

const getEdgeParams = (
  source: InternalNode<Node>,
  target: InternalNode<Node>
) => {
  const sourcePos = Position.Right;
  const [sx, sy] = getHandleCoordsByPosition(source, sourcePos);
  const targetPos = Position.Left;
  const [tx, ty] = getHandleCoordsByPosition(target, targetPos);

  return {
    sx,
    sy,
    tx,
    ty,
    sourcePos,
    targetPos,
  };
};

const Animated = ({
  data,
  id,
  selected,
  source,
  style,
  target,
}: EdgeProps) => {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!(sourceNode && targetNode)) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode
  );

  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetX: tx,
    targetY: ty,
    targetPosition: targetPos,
  });
  const workflowEdge = data?.workflowEdge as SchemaWorkflowEdge | undefined;
  const runStatus = data?.runStatus as EdgeRunStatus | undefined;
  const runVisual = getRunStatusVisual(runStatus);
  const statusClasses = getEdgeStatusClasses(workflowEdge?.status);
  const showLabel = Boolean(
    workflowEdge && (selected || workflowEdge.status !== "active")
  );
  const relationshipLabel = workflowEdge
    ? formatRelationshipType(workflowEdge.relationshipType)
    : "";
  const labelX = (sx + tx) / 2;
  const labelY = (sy + ty) / 2;

  return (
    <>
      {runVisual && (
        <BaseEdge
          id={`${id}-run-glow`}
          path={edgePath}
          style={{
            filter: `drop-shadow(0 0 8px ${runVisual.glow})`,
            opacity: 0.5,
            stroke: runVisual.glow,
            strokeDasharray: runVisual.strokeDasharray,
            strokeWidth: 5,
          }}
        />
      )}
      {selected && (
        <BaseEdge
          id={`${id}-glow`}
          path={edgePath}
          style={{
            filter: "drop-shadow(0 0 10px rgba(139, 92, 246, 0.85))",
            opacity: 0.55,
            stroke: EDGE_SELECTED_GLOW,
            strokeDasharray: statusClasses.strokeDasharray,
            strokeWidth: 5,
          }}
        />
      )}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          opacity: workflowEdge?.status === "disabled" ? 0.55 : 1,
          stroke: selected
            ? EDGE_SELECTED_STROKE
            : runVisual?.stroke || statusClasses.stroke,
          strokeDasharray:
            runVisual?.strokeDasharray || statusClasses.strokeDasharray,
          strokeWidth: selected ? 3 : runVisual ? 2.5 : 2,
        }}
      />
      {runVisual && (
        <EdgeLabelRenderer>
          <div
            className={`nodrag nopan pointer-events-auto flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-medium text-[10px] shadow-sm backdrop-blur ${runVisual.badgeClassName}`}
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY - 24}px)`,
            }}
            title={`Latest run: ${runVisual.label}`}
          >
            <RunStatusIcon status={runStatus} />
            {runVisual.label}
          </div>
        </EdgeLabelRenderer>
      )}
      {showLabel && (
        <EdgeLabelRenderer>
          <div
            className={getEdgeLabelClassName(workflowEdge?.status)}
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
            title={workflowEdge?.reason}
          >
            {relationshipLabel}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export const Edge = {
  Temporary,
  Animated,
};
