import { useId, useState, type ReactNode } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { selectAtom } from 'jotai/utils';
import {
  Boxes,
  Database,
  FileText,
  History,
  Library,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Workflow,
} from 'lucide-react';
import {
  PORTFOLIO_WORKFLOWS,
  type PortfolioWorkflowGroup,
} from '@/shared/workflow-engine/templates/portfolio/portfolio-workflows';
import { workflowLibraryAtom } from './workflow-library';
import { WorkflowStoragePanel } from './workflow-storage-panel';
import {
  NEW_WORKFLOW_ID,
  selectedWorkflowIdAtom,
  selectedWorkflowRunIdAtom,
  workflowSurfaceAtom,
  workflowTabAtom,
} from './workflows-store';
import './workflow-navigation.css';

const GROUPS: { id: PortfolioWorkflowGroup; label: string; Icon: typeof Boxes }[] = [
  { id: 'platform', label: 'Platform services', Icon: Boxes },
  { id: 'foundation', label: 'Foundation', Icon: Database },
  { id: 'tier1', label: 'Tier 1', Icon: FileText },
];

// Step results and run history change frequently; the list only needs identities
// and names. Keep its subscription stable when those navigation fields agree.
const navigationItemsAtom = selectAtom(
  workflowLibraryAtom,
  (library) => Object.values(library).map((entry) => ({ id: entry.id, name: entry.draft.name })),
  (previous, next) =>
    previous.length === next.length &&
    previous.every((item, index) => item.id === next[index].id && item.name === next[index].name),
);

function NavigationRow({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="workflow-navigation__row"
      aria-current={active ? 'page' : undefined}
      title={label}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/** Page-local navigation shares selection with the header, editor and Chat. */
export function WorkflowNavigation() {
  const listId = useId();
  const [expanded, setExpanded] = useState(true);
  const [selectedId, setSelected] = useAtom(selectedWorkflowIdAtom);
  const [surface, setSurface] = useAtom(workflowSurfaceAtom);
  const setTab = useSetAtom(workflowTabAtom);
  const setSelectedRun = useSetAtom(selectedWorkflowRunIdAtom);
  const saved = useAtomValue(navigationItemsAtom);
  const select = (id: string) => {
    setSelected(id);
    setSelectedRun(null);
    setSurface('workflow');
    setTab('overview');
  };

  return (
    <nav aria-label="Workflow navigation" className="workflow-navigation" data-expanded={expanded}>
      <div className="workflow-navigation__heading">
        {expanded && <span>Workflows</span>}
        <button
          type="button"
          className="workflow-navigation__toggle"
          aria-label={expanded ? 'Hide workflow list' : 'Show workflow list'}
          title={expanded ? 'Hide workflow list' : 'Show workflow list'}
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded((previous) => !previous)}
        >
          {expanded ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </button>
      </div>
      <div id={listId} className="workflow-navigation__list" hidden={!expanded}>
        <div className="workflow-navigation__actions">
          <NavigationRow
            label="Library"
            icon={<Library size={16} />}
            active={surface === 'library'}
            onClick={() => {
              setSurface('library');
              setSelectedRun(null);
            }}
          />
          <NavigationRow
            label="Run history"
            icon={<History size={16} />}
            active={surface === 'history'}
            onClick={() => {
              setSurface('history');
              setSelectedRun(null);
            }}
          />
          <NavigationRow
            label="New workflow"
            icon={<Plus size={16} />}
            active={surface === 'workflow' && selectedId === NEW_WORKFLOW_ID}
            onClick={() => {
              select(NEW_WORKFLOW_ID);
              setTab('build');
            }}
          />
        </div>
        <WorkflowStoragePanel />
        <section aria-label="Saved workflows" className="workflow-navigation__group">
          <h2>
            Saved workflows <span>{saved.length}</span>
          </h2>
          {saved.length ? (
            saved.map((entry) => (
              <NavigationRow
                key={entry.id}
                label={entry.name}
                icon={<Workflow size={16} />}
                active={surface === 'workflow' && selectedId === entry.id}
                onClick={() => select(entry.id)}
              />
            ))
          ) : (
            <p className="workflow-navigation__empty">Your saved workflows will appear here.</p>
          )}
        </section>
        <section aria-label="Templates" className="workflow-navigation__group">
          <h2>
            Templates <span>{PORTFOLIO_WORKFLOWS.length}</span>
          </h2>
          {GROUPS.map(({ id, label, Icon }) => {
            const items = PORTFOLIO_WORKFLOWS.filter((workflow) => workflow.group === id);
            if (!items.length) return null;
            return (
              <section key={id} aria-label={label}>
                <h3>{label}</h3>
                {items.map((workflow) => (
                  <NavigationRow
                    key={workflow.id}
                    label={workflow.name.replace(/^Platform Services · /, '')}
                    icon={<Icon size={16} />}
                    active={surface === 'workflow' && selectedId === workflow.id}
                    onClick={() => select(workflow.id)}
                  />
                ))}
              </section>
            );
          })}
        </section>
      </div>
    </nav>
  );
}
