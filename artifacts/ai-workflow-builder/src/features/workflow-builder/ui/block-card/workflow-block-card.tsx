import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { WorkflowNodeData } from '@/shared/workflow-engine/state/workflow-store';
import { getVisualLevelStyle } from '../nodes/visual-level';

export type BlockReadiness = 'not_configured' | 'waiting_on_input' | 'computed' | 'needs_review';

// Status color, not a literal Tailwind shade per state — the --warning/
// --success/--destructive tokens (index.css) already carry their own
// light/dark pairing, so one class list works in both themes instead of
// each badge hand-picking a -100/-950 pair.
const READINESS_STYLES: Record<BlockReadiness, { label: string; className: string }> = {
  not_configured: {
    label: 'Not configured',
    className: 'bg-muted text-muted-foreground border-border',
  },
  waiting_on_input: {
    label: 'Waiting on input',
    className: 'bg-warning/10 text-warning border-warning/25',
  },
  computed: {
    label: 'Computed',
    className: 'bg-success/10 text-success border-success/25',
  },
  needs_review: {
    label: 'Needs review',
    className: 'bg-destructive/10 text-destructive border-destructive/25',
  },
};

export function WorkflowBlockReadinessBadge({ readiness }: { readiness: BlockReadiness }) {
  const style = READINESS_STYLES[readiness];
  return (
    // Keying on readiness remounts the badge whenever the value actually
    // changes, replaying the pop-in below — so "computed" turning green
    // after a run reads as something that just happened, not a static label.
    <span
      key={readiness}
      className={cn(
        'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
        'motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-90 motion-safe:duration-300',
        style.className,
      )}
    >
      {style.label}
    </span>
  );
}

export type WorkflowBlockCardTabId = 'inputs' | 'logic' | 'results' | 'review';

const TAB_ORDER: { id: WorkflowBlockCardTabId; label: string }[] = [
  { id: 'inputs', label: 'Inputs' },
  { id: 'logic', label: 'Logic' },
  { id: 'results', label: 'Results' },
  { id: 'review', label: 'Review' },
];

/** Consistent "nothing here" state for a tab with thin content for this block type. */
export function WorkflowBlockCardEmptyTab({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground text-xs">
      {children}
    </div>
  );
}

/**
 * One shell for every block type's expanded editor: a compact identity header
 * (icon, name, readiness, key result) plus the same four tabs in the same
 * order everywhere. Block types supply tab content into these fixed slots;
 * none render their own top-level layout.
 * See docs/block-palette-redesign.md, "Shared visual shell".
 */
export function WorkflowBlockCard({
  visualLevel,
  label,
  readiness,
  keyResult,
  activeTab,
  onActiveTabChange,
  tabs,
  fill,
}: {
  visualLevel: WorkflowNodeData['visualLevel'];
  label: string;
  readiness: BlockReadiness;
  /** The one key-result line — same position for every block type, content varies. */
  keyResult?: ReactNode;
  activeTab: WorkflowBlockCardTabId;
  onActiveTabChange: (tab: WorkflowBlockCardTabId) => void;
  tabs: Record<WorkflowBlockCardTabId, ReactNode>;
  /** true = fill the parent's height; 'auto' = size to content (a page listing
   *  several blocks); omitted = a fixed standalone height. */
  fill?: boolean | 'auto';
}) {
  const { Icon, iconClassName } = getVisualLevelStyle(visualLevel);
  return (
    <div
      className={cn(
        fill === true ? 'h-full' : fill === 'auto' ? '' : 'h-[560px]',
        'flex flex-col overflow-hidden rounded-md border',
      )}
    >
      <div className="flex shrink-0 items-center gap-2.5 border-b bg-muted/10 px-3 py-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md border bg-background">
          <Icon className={cn('size-4', iconClassName)} strokeWidth={1.8} />
        </span>
        <span className="min-w-0 flex-1 truncate font-semibold text-sm">{label}</span>
        <WorkflowBlockReadinessBadge readiness={readiness} />
        {keyResult && (
          <span className="shrink-0 border-l pl-3 font-mono text-xs text-muted-foreground tabular-nums">
            {keyResult}
          </span>
        )}
      </div>
      <div className="flex shrink-0 border-b bg-muted/10" role="tablist">
        {TAB_ORDER.map(({ id, label: tabLabel }) => (
          <button
            className={cn(
              'px-4 py-2 text-xs font-medium transition-colors',
              activeTab === id
                ? 'border-b-2 border-primary text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
            key={id}
            onClick={() => onActiveTabChange(id)}
            role="tab"
            aria-selected={activeTab === id}
            type="button"
          >
            {tabLabel}
          </button>
        ))}
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{tabs[activeTab]}</div>
    </div>
  );
}
