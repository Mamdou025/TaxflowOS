import {
  Archive,
  BadgeCheck,
  Bot,
  Braces,
  Calculator,
  CheckCircle2,
  Clock,
  Cloud,
  Code2,
  Database,
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  GitBranch,
  Globe,
  LayoutList,
  ListFilter,
  type LucideIcon,
  PencilLine,
  Play,
  Search,
  ShieldCheck,
  Shuffle,
  Sigma,
  Sparkles,
  TriangleAlert,
  Webhook,
} from "lucide-react";
import type { ReactNode } from "react";
import type {
  BlockFamily,
  BlockSubtype,
  WorkflowBlock,
} from "@/lib/local-fiscal-workflow";
import type { WorkflowNodeData } from "@/lib/workflow-store";

type CanvasFamily = BlockFamily | "Generic";

type FamilyNodeStyle = {
  badgeClassName: string;
  captionClassName: string;
  contentClassName: string;
  nodeClassName: string;
};

const TRAILING_TYPE_WORDS: Partial<Record<BlockSubtype, string[]>> = {
  "Approval Gate": ["gate"],
  "CSV Export": ["export"],
  "Excel Export": ["export"],
  "Evidence Pack": ["pack"],
  "Low Confidence Warning": ["warning"],
  "Manual Override Review": ["review"],
  "Missing Source Check": ["check"],
  "ONESOURCE Handoff": ["handoff"],
  "Output Readiness Check": ["check"],
  "Required Input Check": ["check"],
  "Taxprep Handoff": ["handoff"],
};

const FAMILY_NODE_STYLES: Record<BlockFamily, FamilyNodeStyle> = {
  Trigger: {
    badgeClassName: "top-1 border-white/15 bg-(--node-badge-bg) text-orange-300",
    captionClassName: "w-44",
    contentClassName: "h-full w-full p-0",
    nodeClassName:
      "size-24 overflow-visible border-0 bg-transparent! p-0 shadow-none",
  },
  "AI / Agent": {
    badgeClassName: "top-1 border-white/15 bg-(--node-badge-bg) text-fuchsia-300",
    captionClassName: "w-44",
    contentClassName: "h-full w-full p-0",
    nodeClassName:
      "size-28 overflow-visible rounded-full border-0 bg-transparent! p-0 shadow-none",
  },
  Logic: {
    badgeClassName: "top-1 border-white/15 bg-(--node-badge-bg) text-emerald-300",
    captionClassName: "w-44",
    contentClassName: "h-full w-full p-0",
    nodeClassName:
      "size-24 overflow-visible rounded-sm border-0 bg-transparent! p-0 shadow-none",
  },
  Output: {
    badgeClassName: "top-1 border-white/15 bg-(--node-badge-bg) text-indigo-300",
    captionClassName: "w-48",
    contentClassName: "h-full w-full p-0",
    nodeClassName:
      "h-28 w-24 overflow-visible rounded-md border-0 bg-transparent! p-0 shadow-none",
  },
  Field: {
    badgeClassName: "top-1 border-white/15 bg-(--node-badge-bg) text-violet-300",
    captionClassName: "w-64",
    contentClassName: "h-full w-full p-0",
    nodeClassName:
      "h-20 w-56 overflow-visible rounded-sm border-0 bg-transparent! p-0 shadow-none",
  },
  "Review / Validation": {
    badgeClassName: "top-1 border-white/15 bg-(--node-badge-bg) text-amber-300",
    captionClassName: "w-48",
    contentClassName: "h-full w-full p-0",
    nodeClassName:
      "size-24 overflow-visible rounded-none border-0 bg-transparent! p-0 shadow-none",
  },
  Source: {
    badgeClassName: "top-1 border-white/15 bg-(--node-badge-bg) text-sky-300",
    captionClassName: "w-48",
    contentClassName: "h-full w-full p-0",
    nodeClassName:
      "h-28 w-28 overflow-visible rounded-md border-0 bg-transparent! p-0 shadow-none",
  },
  // Governed-value blocks (family "Protected"); mirrors Output geometry with a
  // locked/rose accent. Reached when a block carries family "Protected" directly.
  Protected: {
    badgeClassName: "top-1 border-white/15 bg-(--node-badge-bg) text-rose-300",
    captionClassName: "w-48",
    contentClassName: "h-full w-full p-0",
    nodeClassName:
      "h-28 w-24 overflow-visible rounded-md border-0 bg-transparent! p-0 shadow-none",
  },
};

// Shared card design tokens — chip fill flips with the theme (dark chip on the
// light gray board in light mode; a raised slate chip on the dark board in dark).
const NEU_BG = 'var(--sx-node-chip)';
const NEU_BORDER = 'rgba(255,255,255,0.09)';
const NEU_DECOR = 'rgba(255,255,255,0.07)';
// Soft elevation shadow, tuned for the light gray canvas — the heavy near-black
// shadow (built for the old dark canvas) pooled onto the caption zone right below
// each node and drowned the title. Lighter + a cool tone keeps the node elevated
// without darkening the label area.
const NEU_BOX_SHADOW =
  '0 2px 6px rgba(30,30,45,0.16), 0 6px 16px rgba(30,30,45,0.10)';
// Filter-based elevation for clip-path shapes (hex, diamond)
const NEU_FILTER =
  'drop-shadow(0 2px 5px rgba(30,30,45,0.18)) drop-shadow(0 6px 13px rgba(30,30,45,0.11))';

function getFamilyFromRole(role: WorkflowNodeData["visualRole"]): CanvasFamily {
  if (role === "trigger") {
    return "Trigger";
  }
  if (role === "source" || role === "evidence") {
    return "Source";
  }
  if (role === "logic" || role === "calculation" || role === "step") {
    return "Logic";
  }
  if (role === "review" || role === "validation") {
    return "Review / Validation";
  }
  if (role === "protected" || role === "field") {
    return "Field";
  }
  if (role === "output") {
    return "Output";
  }
  return "Generic";
}

function isRulebookSubtype(subtype?: BlockSubtype) {
  return (
    subtype === "Keyword Rules" ||
    subtype === "Aggregation Rules" ||
    subtype === "Rollup Rules" ||
    subtype === "Calculation Rules"
  );
}

export function resolveCanvasFamily(data: WorkflowNodeData): CanvasFamily {
  const configFamily = data.config?.blockFamily as BlockFamily | undefined;
  if (isRulebookSubtype(data.block?.subtype)) {
    return "Review / Validation";
  }
  return (
    data.block?.family || configFamily || getFamilyFromRole(data.visualRole)
  );
}

export function getFamilyNodeStyle(
  data: WorkflowNodeData
): FamilyNodeStyle | null {
  const family = resolveCanvasFamily(data);
  return family === "Generic" ? null : FAMILY_NODE_STYLES[family];
}

function stripLeadingType(title: string, typeName: string): string {
  const trimmedTitle = title.trim();
  const trimmedType = typeName.trim();
  const lowerTitle = trimmedTitle.toLowerCase();
  const lowerType = trimmedType.toLowerCase();

  if (lowerTitle === lowerType) {
    return trimmedTitle;
  }

  for (const separator of [": ", " - ", " / ", " "]) {
    const prefix = `${lowerType}${separator}`;
    if (lowerTitle.startsWith(prefix)) {
      return trimmedTitle.slice(trimmedType.length + separator.length).trim();
    }
  }

  return trimmedTitle;
}

function stripTrailingTypeWord(title: string, typeWord: string): string {
  const trimmedTitle = title.trim();
  const suffix = ` ${typeWord.toLowerCase()}`;

  if (trimmedTitle.toLowerCase().endsWith(suffix)) {
    return trimmedTitle.slice(0, -suffix.length).trim();
  }

  return trimmedTitle;
}

export function getFamilyCanvasTitle(
  data: WorkflowNodeData,
  fallbackTitle: string
): string {
  const block = data.block;
  let title = (block?.label || data.label || fallbackTitle).trim();

  if (!block) {
    return title || fallbackTitle;
  }

  for (const typeName of [block.family, block.subtype]) {
    title = stripLeadingType(title, typeName);
  }

  if (block.family === "Source") {
    title = stripTrailingTypeWord(title, "source");
  }

  for (const word of TRAILING_TYPE_WORDS[block.subtype] || []) {
    title = stripTrailingTypeWord(title, word);
  }

  return title || fallbackTitle;
}

function getSubtypeIcon(subtype: BlockSubtype | undefined): LucideIcon {
  switch (subtype) {
    case "Manual / On Demand":
      return Play;
    case "Schedule / Cron":
      return Clock;
    case "Webhook / API Event":
      return Webhook;
    case "Manual Entry":
      return PencilLine;
    case "Excel / Workbook":
    case "Excel Export":
      return FileSpreadsheet;
    case "PDF / Document":
    case "PDF Report":
      return FileText;
    case "API / HTTP Request":
      return Cloud;
    case "Currency Rate":
      return Braces;
    case "Database Query":
      return Database;
    case "Web / URL":
      return Globe;
    case "AI Search Result":
    case "AI Search":
      return Search;
    case "Keyword Rules":
    case "Aggregation Rules":
    case "Rollup Rules":
    case "Calculation Rules":
      return GitBranch;
    case "Formula":
      return Calculator;
    case "Aggregation":
    case "Category Rollup Aggregator":
    case "Hierarchy Aggregator":
      return Sigma;
    case "Calculation Engine":
      return Calculator;
    case "Transformation":
      return Shuffle;
    case "Excel Table Reader":
      return FileSpreadsheet;
    case "PDF Text Parser":
    case "PDF Table Parser":
      return FileText;
    case "OCR Extractor":
      return Search;
    case "API Response Parser":
      return Braces;
    case "Condition":
      return GitBranch;
    case "Script":
      return Code2;
    case "Classification / Mapping":
      return ListFilter;
    case "Field Block":
      return LayoutList;
    case "CSV Export":
      return Download;
    case "Evidence Pack":
      return Archive;
    case "Canonical JSON":
      return FileJson;
    case "Taxprep Handoff":
    case "ONESOURCE Handoff":
      return BadgeCheck;
    case "AI Mapping Suggestion":
    case "AI Formula Proposal":
    case "AI Workflow Proposal":
      return Sparkles;
    default:
      return Bot;
  }
}

function getIconForBlock(
  block: WorkflowBlock | undefined,
  fallback?: ReactNode
) {
  if (fallback) {
    return fallback;
  }
  const Icon = getSubtypeIcon(block?.subtype);
  return <Icon className="size-9" strokeWidth={1.7} />;
}

export function FamilyNodeShape({
  data,
  fallback,
}: {
  data: WorkflowNodeData;
  fallback?: ReactNode;
}) {
  const family = resolveCanvasFamily(data);
  const icon = getIconForBlock(data.block, fallback);

  if (family === "Trigger") {
    return (
      <div
        className="pointer-events-none relative flex size-24 items-center justify-center"
        style={{ filter: NEU_FILTER }}
      >
        {/* Hexagon fill */}
        <div
          className="absolute inset-0 border-2"
          style={{
            clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
            background: NEU_BG,
            borderColor: NEU_BORDER,
          }}
        />
        {/* Inner accent ring */}
        <div
          className="absolute inset-[18%]"
          style={{
            clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
            border: `1px solid ${NEU_DECOR}`,
          }}
        />
        {/* Top bar accent */}
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 h-1 w-8 rounded-full"
          style={{ background: NEU_DECOR }}
        />
        <div className="relative z-10 text-orange-400">{icon}</div>
      </div>
    );
  }

  if (family === "Source") {
    return (
      <div
        className="pointer-events-none relative flex h-24 w-28 items-center justify-center border-2 text-sky-400"
        style={{
          borderRadius: "3rem 0.85rem 0.85rem 3rem",
          background: NEU_BG,
          borderColor: NEU_BORDER,
          boxShadow: NEU_BOX_SHADOW,
        }}
      >
        {/* Inner pill accent */}
        <div
          className="absolute inset-2"
          style={{
            borderRadius: "2.5rem 0.55rem 0.55rem 2.5rem",
            border: `1px solid ${NEU_DECOR}`,
          }}
        />
        {/* Right-side handle nub */}
        <div
          className="-translate-y-1/2 absolute top-1/2 right-[-0.65rem] h-5 w-3 rounded-r-full"
          style={{
            background: NEU_BG,
            border: `2px solid ${NEU_BORDER}`,
            borderLeftColor: 'transparent',
          }}
        />
        <div className="relative z-10">{icon}</div>
      </div>
    );
  }

  if (family === "Logic") {
    return (
      <div
        className="pointer-events-none relative flex size-24 items-center justify-center rounded-sm border-2 text-emerald-400"
        style={{
          background: NEU_BG,
          borderColor: NEU_BORDER,
          boxShadow: NEU_BOX_SHADOW,
        }}
      >
        {/* Top bar accent */}
        <div
          className="-translate-x-1/2 absolute top-0 left-1/2 h-1 w-16 rounded-full"
          style={{ background: NEU_DECOR }}
        />
        {/* Inner accent border */}
        <div
          className="absolute inset-3 rounded-[3px]"
          style={{ border: `1px solid ${NEU_DECOR}` }}
        />
        <div className="relative z-10">{icon}</div>
      </div>
    );
  }

  if (family === "Review / Validation") {
    return (
      <div
        className="pointer-events-none relative flex size-24 items-center justify-center"
        style={{ filter: NEU_FILTER }}
      >
        {/* Diamond fill */}
        <div
          className="absolute inset-0 border-2"
          style={{
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            background: NEU_BG,
            borderColor: NEU_BORDER,
          }}
        />
        {/* Inner diamond accent */}
        <div
          className="absolute inset-[22%]"
          style={{
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            border: `1px solid ${NEU_DECOR}`,
          }}
        />
        <div className="relative z-10 text-amber-400">{icon}</div>
      </div>
    );
  }

  if (family === "Field") {
    return (
      <div
        className="pointer-events-none relative flex h-20 w-56 items-center justify-center rounded-md border-2 text-violet-400"
        style={{
          background: NEU_BG,
          borderColor: NEU_BORDER,
          boxShadow: NEU_BOX_SHADOW,
        }}
      >
        {/* Left-side line accents */}
        <div className="absolute inset-y-3 left-3 flex flex-col justify-between">
          <div className="h-px w-5 rounded-full" style={{ background: 'rgba(158,158,178,0.32)' }} />
          <div className="h-px w-4 rounded-full" style={{ background: 'rgba(158,158,178,0.20)' }} />
          <div className="h-px w-5 rounded-full" style={{ background: 'rgba(158,158,178,0.32)' }} />
        </div>
        {/* Inner accent border */}
        <div
          className="absolute inset-2 rounded"
          style={{ border: `1px solid ${NEU_DECOR}` }}
        />
        <div className="relative z-10">{icon}</div>
      </div>
    );
  }

  if (family === "Output") {
    return (
      <div
        className="pointer-events-none relative flex h-24 w-20 items-center justify-center rounded-md border-2 text-indigo-400"
        style={{
          background: NEU_BG,
          borderColor: NEU_BORDER,
          boxShadow: NEU_BOX_SHADOW,
        }}
      >
        {/* Folded corner accent */}
        <div
          className="absolute top-0 right-0 size-7 rounded-bl-md [clip-path:polygon(0_0,100%_0,100%_100%)]"
          style={{
            background: 'rgba(158,158,178,0.14)',
            borderBottom: `1px solid ${NEU_BORDER}`,
            borderLeft: `1px solid ${NEU_BORDER}`,
          }}
        />
        {/* Bottom bar accent */}
        <div
          className="absolute right-2 bottom-3 left-2 h-1 rounded-full"
          style={{ background: NEU_DECOR }}
        />
        <div className="relative z-10">{icon}</div>
      </div>
    );
  }

  if (family === "AI / Agent") {
    return (
      <div
        className="pointer-events-none relative flex size-24 items-center justify-center rounded-full border-2 text-fuchsia-400"
        style={{
          background: NEU_BG,
          borderColor: NEU_BORDER,
          boxShadow: NEU_BOX_SHADOW,
        }}
      >
        {/* Inner dashed ring */}
        <div
          className="absolute inset-3 rounded-full"
          style={{ border: `1px dashed rgba(158,158,178,0.30)` }}
        />
        {/* Accent dot */}
        <div
          className="absolute top-3 right-5 size-2 rounded-full"
          style={{ background: 'rgba(158,158,178,0.40)' }}
        />
        <div className="relative z-10">{icon}</div>
      </div>
    );
  }

  return null;
}
