

import { GripVertical } from "lucide-react";
import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const WORKSPACE_PANE_WIDTHS_STORAGE_KEY =
  "workflow-studio.block-workspace-pane-widths";
const DEFAULT_WORKSPACE_PANE_WIDTHS = {
  center: 34,
  input: 33,
  output: 33,
};
const MIN_WORKSPACE_PANE_WIDTHS = {
  center: 24,
  input: 18,
  output: 18,
};

type WorkspacePaneWidths = typeof DEFAULT_WORKSPACE_PANE_WIDTHS;
type WorkspaceResizeDivider = "center-output" | "input-center";

function normalizeWorkspacePaneWidths(
  value?: Partial<WorkspacePaneWidths>
): WorkspacePaneWidths {
  const input =
    typeof value?.input === "number" && Number.isFinite(value.input)
      ? value.input
      : DEFAULT_WORKSPACE_PANE_WIDTHS.input;
  const center =
    typeof value?.center === "number" && Number.isFinite(value.center)
      ? value.center
      : DEFAULT_WORKSPACE_PANE_WIDTHS.center;
  const output =
    typeof value?.output === "number" && Number.isFinite(value.output)
      ? value.output
      : DEFAULT_WORKSPACE_PANE_WIDTHS.output;
  const total = input + center + output || 100;

  return {
    center: Math.max(MIN_WORKSPACE_PANE_WIDTHS.center, (center / total) * 100),
    input: Math.max(MIN_WORKSPACE_PANE_WIDTHS.input, (input / total) * 100),
    output: Math.max(MIN_WORKSPACE_PANE_WIDTHS.output, (output / total) * 100),
  };
}

function getInitialWorkspacePaneWidths(): WorkspacePaneWidths {
  if (typeof window === "undefined") {
    return DEFAULT_WORKSPACE_PANE_WIDTHS;
  }

  try {
    return normalizeWorkspacePaneWidths(
      JSON.parse(
        window.localStorage.getItem(WORKSPACE_PANE_WIDTHS_STORAGE_KEY) || "{}"
      ) as Partial<WorkspacePaneWidths>
    );
  } catch {
    return DEFAULT_WORKSPACE_PANE_WIDTHS;
  }
}

export function getWorkspaceGridColumns(widths: WorkspacePaneWidths) {
  return `minmax(220px, ${widths.input}fr) 10px minmax(280px, ${widths.center}fr) 10px minmax(220px, ${widths.output}fr)`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function resizeWorkspacePaneWidths({
  deltaPercent,
  divider,
  widths,
}: {
  deltaPercent: number;
  divider: WorkspaceResizeDivider;
  widths: WorkspacePaneWidths;
}): WorkspacePaneWidths {
  if (divider === "input-center") {
    const pairTotal = widths.input + widths.center;
    const input = clamp(
      widths.input + deltaPercent,
      MIN_WORKSPACE_PANE_WIDTHS.input,
      pairTotal - MIN_WORKSPACE_PANE_WIDTHS.center
    );

    return {
      center: pairTotal - input,
      input,
      output: widths.output,
    };
  }

  const pairTotal = widths.center + widths.output;
  const center = clamp(
    widths.center + deltaPercent,
    MIN_WORKSPACE_PANE_WIDTHS.center,
    pairTotal - MIN_WORKSPACE_PANE_WIDTHS.output
  );

  return {
    center,
    input: widths.input,
    output: pairTotal - center,
  };
}

export function useWorkspacePaneSizing() {
  const [workspacePaneWidths, setWorkspacePaneWidths] =
    useState<WorkspacePaneWidths>(getInitialWorkspacePaneWidths);
  const workspaceGridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    window.localStorage.setItem(
      WORKSPACE_PANE_WIDTHS_STORAGE_KEY,
      JSON.stringify(workspacePaneWidths)
    );
  }, [workspacePaneWidths]);

  const handleWorkspaceResizeStart = useCallback(
    (
      divider: WorkspaceResizeDivider,
      event: ReactPointerEvent<HTMLButtonElement>
    ) => {
      event.preventDefault();
      const grid = workspaceGridRef.current;
      if (!grid) {
        return;
      }

      const startX = event.clientX;
      const startWidths = workspacePaneWidths;
      const gridWidth = grid.getBoundingClientRect().width;

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const deltaPercent =
          ((moveEvent.clientX - startX) / Math.max(gridWidth, 1)) * 100;
        setWorkspacePaneWidths(
          resizeWorkspacePaneWidths({
            deltaPercent,
            divider,
            widths: startWidths,
          })
        );
      };

      const handlePointerUp = () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    },
    [workspacePaneWidths]
  );

  return {
    handleWorkspaceResizeStart,
    workspaceGridRef,
    workspacePaneWidths,
  };
}

export function WorkspaceResizeHandle({
  label,
  onPointerDown,
}: {
  label: string;
  onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      aria-label={label}
      className="group flex h-full cursor-col-resize items-center justify-center bg-border/60 outline-none transition-colors hover:bg-primary/30 focus-visible:ring-2 focus-visible:ring-ring"
      onPointerDown={onPointerDown}
      title={label}
      type="button"
    >
      <span className="flex h-10 w-4 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm transition-colors group-hover:text-foreground">
        <GripVertical className="size-3" />
      </span>
    </button>
  );
}
