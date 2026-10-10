import { useEffect, useId, useState, type CSSProperties, type ReactNode } from 'react';
import { Check, ChevronDown, Loader2 } from 'lucide-react';
import './workflow-timeline.css';

export type WorkflowTimelineItem = {
  id: string;
  label: string;
  description?: string;
  type: string;
  tone: string;
  status: string;
  panelLabel: string;
};

/** All workflows share this interaction; visited forms stay mounted while folded. */
export function WorkflowStepTimeline({
  items,
  initialId,
  focusId,
  requiredId,
  kind = 'block',
  listLabel = 'Execution steps',
  renderItem,
}: {
  items: WorkflowTimelineItem[];
  initialId?: string | null;
  focusId?: string;
  requiredId?: string;
  kind?: 'block' | 'stage';
  listLabel?: string;
  renderItem: (item: WorkflowTimelineItem) => ReactNode;
}) {
  const [expanded, setExpanded] = useState<string | null>(initialId ?? null);
  const [visited, setVisited] = useState(() => new Set(initialId ? [initialId] : []));
  const instance = useId();
  const open = (id: string) => {
    setVisited((previous) => new Set([...previous, id]));
    setExpanded(id);
  };
  useEffect(() => {
    if (focusId) {
      setVisited((previous) => new Set([...previous, focusId]));
      setExpanded(focusId);
    }
  }, [focusId]);
  const required = items.find((item) => item.id === requiredId);
  return (
    <div className="workflow-timeline">
      <div className="mb-3 flex items-center justify-between gap-3 text-sm">
        <h4 className="font-medium">Steps</h4>
        <button
          type="button"
          className="text-xs text-muted-foreground underline disabled:opacity-40"
          disabled={!expanded}
          onClick={() => setExpanded(null)}
        >
          Collapse all steps
        </button>
      </div>
      {required && expanded !== required.id && (
        <button type="button" className="mb-2 text-xs underline" onClick={() => open(required.id)}>
          Provide input for {required.label}
        </button>
      )}
      <ol aria-label={listLabel}>
        {items.map((item, index) => {
          const isOpen = expanded === item.id;
          const panelId = `${instance}-${item.id}`;
          const complete = ['Complete', 'Completed with warnings'].includes(item.status);
          return (
            <li
              key={item.id}
              className="workflow-timeline-stage"
              style={
                {
                  '--stage-tone': item.tone,
                  '--stage-delay': `${Math.min(index, 8) * 70}ms`,
                } as CSSProperties
              }
            >
              <button
                type="button"
                data-step-toggle={kind === 'block' ? '' : undefined}
                data-step-id={kind === 'block' ? item.id : undefined}
                data-stage-toggle={kind === 'stage' ? item.id : undefined}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="workflow-timeline-toggle"
                onClick={() => (isOpen ? setExpanded(null) : open(item.id))}
              >
                <span aria-hidden="true" className="workflow-timeline-spine">
                  <span
                    className="workflow-timeline-dot"
                    data-progress={
                      complete ? 'complete' : item.status === 'Running' ? 'running' : 'pending'
                    }
                  >
                    {complete ? (
                      <Check size={9} strokeWidth={3} />
                    ) : item.status === 'Running' ? (
                      <Loader2 size={9} />
                    ) : null}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">
                      {kind === 'block' ? `${index + 1}. ` : ''}
                      {item.label}
                    </span>
                    <span className="workflow-timeline-kind">{item.type}</span>
                  </span>
                  {item.description && (
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  )}
                  <span
                    className="mt-1 block text-xs"
                    data-stage-status={item.status}
                    style={{ color: item.tone }}
                  >
                    {item.status}
                  </span>
                </span>
                <ChevronDown
                  aria-hidden="true"
                  size={13}
                  className={`mt-1 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <section
                id={panelId}
                aria-label={item.panelLabel}
                hidden={!isOpen}
                aria-hidden={!isOpen}
                className="workflow-timeline-details"
              >
                {visited.has(item.id) && renderItem(item)}
              </section>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
