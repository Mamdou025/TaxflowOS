import {
  Calculator,
  FileText,
  Layers,
  type LucideIcon,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { WorkflowNodeData } from "@/lib/workflow-store";

type VisualLevel = NonNullable<WorkflowNodeData["visualLevel"]>;
type VisualRole = NonNullable<WorkflowNodeData["visualRole"]>;

type VisualLevelStyle = {
  Icon: LucideIcon;
  badgeClassName: string;
  captionClassName: string;
  contentClassName: string;
  defaultRole: VisualRole;
  iconClassName: string;
  iconShellClassName: string;
  nodeClassName: string;
  placeholderDescription: string;
};

const CARD_SHADOW = '0 2px 8px rgba(0,0,0,0.42), 0 6px 20px rgba(0,0,0,0.28)';

const DEFAULT_STYLE: VisualLevelStyle = {
  Icon: Zap,
  badgeClassName: "top-1 border-white/15 bg-[var(--sx-node-chip-2)] text-zinc-300",
  captionClassName: "w-40",
  contentClassName: "h-full w-full p-0",
  defaultRole: "step",
  iconClassName: "text-zinc-400",
  iconShellClassName:
    "size-24 rounded-lg border-2 border-white/10 bg-[var(--sx-node-chip-3)]",
  nodeClassName:
    "size-24 overflow-visible rounded-lg border-0 bg-transparent! p-0 shadow-none",
  placeholderDescription: "Select an action",
};

const VISUAL_LEVEL_STYLES: Record<VisualLevel, VisualLevelStyle> = {
  L1: {
    Icon: Layers,
    badgeClassName: "top-2 border-white/15 bg-[var(--sx-node-chip-2)] text-orange-300",
    captionClassName: "w-64",
    contentClassName: "h-full w-full p-0",
    defaultRole: "stage",
    iconClassName: "text-orange-400",
    iconShellClassName:
      "h-24 w-64 rounded-xl border-2 border-white/10 bg-[var(--sx-node-chip-3)]",
    nodeClassName:
      "h-24 w-64 overflow-visible rounded-xl border-0 bg-transparent! p-0 shadow-none",
    placeholderDescription: "Workflow stage",
  },
  L2: {
    Icon: Calculator,
    badgeClassName: "top-1 border-white/15 bg-[var(--sx-node-chip-2)] text-emerald-300",
    captionClassName: "w-40",
    contentClassName: "h-full w-full p-0",
    defaultRole: "logic",
    iconClassName: "text-emerald-400",
    iconShellClassName:
      "size-24 rounded-lg border-2 border-white/10 bg-[var(--sx-node-chip-3)]",
    nodeClassName:
      "size-24 overflow-visible rounded-lg border-0 bg-transparent! p-0 shadow-none",
    placeholderDescription: "Workflow block",
  },
  L3: {
    Icon: FileText,
    badgeClassName: "top-1 border-white/15 bg-[var(--sx-node-chip-2)] text-sky-300",
    captionClassName: "w-40",
    contentClassName: "h-full w-full p-0",
    defaultRole: "source",
    iconClassName: "text-sky-400",
    iconShellClassName:
      "size-24 rounded-l-3xl rounded-r-lg border-2 border-white/10 bg-[var(--sx-node-chip-3)]",
    nodeClassName:
      "size-24 overflow-visible rounded-l-3xl rounded-r-lg border-0 bg-transparent! p-0 shadow-none",
    placeholderDescription: "Source evidence",
  },
};

export function getVisualLevelStyle(
  visualLevel: WorkflowNodeData["visualLevel"]
): VisualLevelStyle {
  return visualLevel ? VISUAL_LEVEL_STYLES[visualLevel] : DEFAULT_STYLE;
}

export function resolveVisualLevel(
  data: Pick<WorkflowNodeData, "visualLevel" | "visualRole">
): WorkflowNodeData["visualLevel"] {
  if (data.visualLevel) {
    return data.visualLevel;
  }

  if (data.visualRole === "stage") {
    return "L1";
  }

  if (data.visualRole === "source" || data.visualRole === "evidence") {
    return "L3";
  }

  if (
    data.visualRole === "step" ||
    data.visualRole === "calculation" ||
    data.visualRole === "review" ||
    data.visualRole === "validation" ||
    data.visualRole === "logic" ||
    data.visualRole === "protected" ||
    data.visualRole === "output"
  ) {
    return "L2";
  }
}

export function getVisualBadgeText(
  visualLevel: WorkflowNodeData["visualLevel"],
  visualRole: WorkflowNodeData["visualRole"]
): string | null {
  if (!visualLevel) {
    return null;
  }

  const role = visualRole || getVisualLevelStyle(visualLevel).defaultRole;
  const roleLabel =
    role === "validation"
      ? "Review / Validation"
      : role.charAt(0).toUpperCase() + role.slice(1);

  return roleLabel;
}

export function getVisualPlaceholderDescription(
  visualLevel: WorkflowNodeData["visualLevel"]
): string {
  return getVisualLevelStyle(visualLevel).placeholderDescription;
}

export function VisualLevelIcon({
  children,
  className,
  visualLevel,
}: {
  children?: ReactNode;
  className?: string;
  visualLevel: WorkflowNodeData["visualLevel"];
}) {
  const visualStyle = getVisualLevelStyle(visualLevel);
  const Icon = visualStyle.Icon;

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center",
        visualStyle.iconShellClassName,
        className
      )}
      style={{ boxShadow: CARD_SHADOW }}
    >
      {children ?? (
        <Icon
          className={cn("size-9", visualStyle.iconClassName)}
          strokeWidth={1.7}
        />
      )}
    </div>
  );
}

export function VisualLevelDecor({
  visualLevel,
}: {
  visualLevel: WorkflowNodeData["visualLevel"];
}) {
  if (visualLevel === "L1") {
    return (
      <>
        <div className="pointer-events-none absolute top-4 left-4 h-16 w-px bg-neutral-400/20" />
        <div className="pointer-events-none absolute top-4 right-4 h-16 w-px bg-neutral-400/20" />
      </>
    );
  }

  if (visualLevel === "L2") {
    return (
      <div className="-translate-x-1/2 pointer-events-none absolute top-0 left-1/2 h-1 w-16 rounded-full bg-neutral-400/25" />
    );
  }

  if (visualLevel === "L3") {
    return (
      <>
        <div className="pointer-events-none absolute top-0 right-4 size-6 rounded-bl-xl border-b border-l border-neutral-400/20" />
        <div className="pointer-events-none absolute top-4 left-4 h-16 w-1 rounded-r-full bg-neutral-400/25" />
      </>
    );
  }

  return null;
}
