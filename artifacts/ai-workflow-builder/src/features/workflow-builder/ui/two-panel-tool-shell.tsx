

import { cn } from "@/lib/utils";
import { useCallback, useRef, useState } from "react";

const BADGE_STYLES = {
  source:
    "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800",
  logic:
    "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800",
  review:
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  default: "bg-muted/60 text-muted-foreground border-border",
} as const;

type BadgeVariant = keyof typeof BADGE_STYLES;

export type TwoPanelToolShellProps = {
  // Tool identity shown in the sub-header
  title: string;
  subtitle?: string;
  badge?: string;
  badgeVariant?: BadgeVariant;

  // Panel content
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;

  // Layout — left panel width as a percent of total (20–55)
  defaultLeftPercent?: number;
  // Minimum left panel width in px before resize is clamped
  minLeftPx?: number;

  // Optional footer row rendered below both panels
  footer?: React.ReactNode;
};

function usePanelResize(defaultPercent: number, minLeftPx: number) {
  const [leftPercent, setLeftPercent] = useState(defaultPercent);
  const containerRef = useRef<HTMLDivElement>(null);

  const onHandlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const container = containerRef.current;
      if (!container) return;

      const onMove = (ev: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        const raw = ((ev.clientX - rect.left) / rect.width) * 100;
        const min = (minLeftPx / rect.width) * 100;
        setLeftPercent(Math.max(min, Math.min(55, raw)));
      };

      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [minLeftPx]
  );

  return { leftPercent, containerRef, onHandlePointerDown };
}

export function TwoPanelToolShell({
  title,
  subtitle,
  badge,
  badgeVariant = "default",
  leftPanel,
  rightPanel,
  defaultLeftPercent = 32,
  minLeftPx = 200,
  footer,
}: TwoPanelToolShellProps) {
  const { leftPercent, containerRef, onHandlePointerDown } = usePanelResize(
    defaultLeftPercent,
    minLeftPx
  );

  return (
    <div className="flex h-full flex-col">
      {/* Sub-header: tool identity */}
      <div className="flex shrink-0 items-center gap-2 border-b bg-muted/20 px-3 py-2">
        <span className="truncate font-semibold text-sm">{title}</span>
        {badge && (
          <span
            className={cn(
              "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
              BADGE_STYLES[badgeVariant]
            )}
          >
            {badge}
          </span>
        )}
        {subtitle && (
          <span className="ml-auto hidden shrink-0 text-[11px] text-muted-foreground sm:block">
            {subtitle}
          </span>
        )}
      </div>

      {/* Two-panel body */}
      <div
        className="flex min-h-0 flex-1 overflow-hidden"
        ref={containerRef}
      >
        {/* Left panel — index / navigation */}
        <div
          className="flex shrink-0 flex-col overflow-y-auto border-r"
          style={{ width: `${leftPercent}%` }}
        >
          {leftPanel}
        </div>

        {/* Drag handle */}
        <button
          aria-label="Resize panels"
          className="group w-1 shrink-0 cursor-col-resize bg-transparent transition-colors hover:bg-primary/20 active:bg-primary/30 focus:outline-none"
          onPointerDown={onHandlePointerDown}
          type="button"
        />

        {/* Right panel — workspace */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {rightPanel}
        </div>
      </div>

      {/* Optional footer */}
      {footer && (
        <div className="flex shrink-0 items-center gap-3 border-t bg-muted/10 px-3 py-2">
          {footer}
        </div>
      )}
    </div>
  );
}
