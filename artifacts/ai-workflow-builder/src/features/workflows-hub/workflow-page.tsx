import { runWorkflowAtom, templateDefinition } from './workflow-execution';
import { createWorkflow } from '@workspace/workflow-core/commands';
import { WorkflowStoragePanel } from './workflow-storage-panel';

// WorkflowPage — the Workflows surface, built for maximum canvas room:
//   • the workflow LIST is published into the Scope sidebar (usePageSidebar), a
//     contextual section below "Clients & Chats" — no second sidebar in the body.
//   • the workflow NAME + mode tabs (Overview·Build·Run·Results) + the Build
//     controls (Undo/Redo/Fit/Save/Run) are published into the panel header
//     (usePageMenu) — no title block / tab strip / toolbar in the body.
//   • the body is JUST the mode content: Overview / the builder canvas (full-bleed)
//     / the run loop / the worksheet.
// Selection + active tab live in shared atoms so the sidebar list, the header, and
// the body stay in sync. The engine — not the page — gates Run/Results.

import dynamic from '@/lib/next-dynamic-shim';
import { workflowLibraryAtom, saveVersion, definitionFingerprint } from './workflow-library';
import { useEffect } from 'react';
import { useRouter } from '@/lib/router';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useTheme } from 'next-themes';
import {
  ArrowRight,
  Bot,
  Boxes,
  Database,
  FileText,
  History,
  Library,
  Maximize2,
  Play,
  Plus,
  Redo2,
  Save,
  Undo2,
  Workflow as WorkflowIcon,
} from 'lucide-react';
import {
  PORTFOLIO_WORKFLOWS,
  getPortfolioWorkflowDef,
  type PortfolioWorkflowDef,
  type PortfolioWorkflowGroup,
} from '@/shared/workflow-engine/templates/portfolio/portfolio-workflows';
import { getWorkflowConfig } from '@/shared/workflow-engine/runtime/workflow-runs';
import { triggerFitViewAtom } from '@/shared/workflow-engine/state/workflow-store';
import { builderBridgeAtom } from '@/lib/builder-bridge';
import { getPage } from '@/shared/stores/resource-registry';
import { usePageMenu, type PageMenuItem } from '@/shared/stores/page-menu-store';
import { usePageSidebar } from '@/shared/stores/page-sidebar-store';
import { WorkflowRunFlow } from '@/features/assistant/workspace/workflow-run-flow';
import { NEU } from '@/components/neumorphic-sidebar';
import { WorkflowOverview } from '@/features/workflows-hub/workflow-overview';
import { GenericWorksheet } from '@/features/workflows-hub/generic-worksheet';
import {
  NEW_WORKFLOW_ID,
  selectedWorkflowIdAtom,
  selectedWorkflowRunIdAtom,
  workflowSurfaceAtom,
  workflowTabAtom,
  type WorkflowTab,
} from '@/features/workflows-hub/workflows-store';

// Keep the library/overview independent of the canvas and execution screens.
// Each boundary leaves the page menu and Chat mounted while its view loads.
const loadingWorkflowView = () => (
  <div role="status" aria-label="Loading workflow view" className="p-6 text-sm text-muted-foreground">
    Loading workflow view…
  </div>
);
const InlineBuilder = dynamic(
  () => import('@/features/workflow-builder/ui/inline-builder').then((module) => module.InlineBuilder),
  { loading: loadingWorkflowView },
);
const SavedWorkflowRun = dynamic(
  () => import('./saved-workflow-run').then((module) => module.SavedWorkflowRun),
  { loading: loadingWorkflowView },
);
const WorkflowRunHistory = dynamic(
  () => import('./workflow-run-history').then((module) => module.WorkflowRunHistory),
  { loading: loadingWorkflowView },
);

const TAB_LABELS: { id: WorkflowTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'build', label: 'Build' },
  { id: 'run', label: 'Run' },
  { id: 'results', label: 'Results' },
];

const GROUPS: { id: PortfolioWorkflowGroup; label: string; Icon: typeof Boxes }[] = [
  // Runnable end-to-end, listed first so a demo is one click away.
  { id: 'demo', label: 'Runnable demos', Icon: Play },
  { id: 'platform', label: 'Platform services', Icon: Boxes },
  { id: 'foundation', label: 'Foundation', Icon: Database },
  { id: 'tier1', label: 'Tier 1', Icon: FileText },
];

const short = (name: string) => name.replace(/^Platform Services · /, '');

function StubCard({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: { label: string; icon: React.ReactNode; onClick: () => void };
}) {
  return (
    <div
      style={{
        maxWidth: 560,
        background: NEU.surface,
        borderRadius: 16,
        boxShadow: NEU.shadowSm,
        padding: '22px 24px',
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 700, color: NEU.text }}>{title}</div>
      <div style={{ fontSize: 13, lineHeight: 1.6, color: NEU.muted, margin: '8px 0 0' }}>
        {body}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            marginTop: 18,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            border: 'none',
            cursor: 'pointer',
            background: NEU.bg,
            boxShadow: NEU.shadowSm,
            color: NEU.accent,
            fontSize: 13,
            fontWeight: 650,
            borderRadius: 11,
            padding: '10px 16px',
          }}
        >
          {action.icon}
          {action.label}
          <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}

// ── Sidebar section (published into the Scope sidebar via usePageSidebar) ────────
export function WorkflowSidebarList() {
  const [selectedId, setSelected] = useAtom(selectedWorkflowIdAtom);
  const setTab = useSetAtom(workflowTabAtom);
  const [surface, setSurface] = useAtom(workflowSurfaceAtom);
  const setSelectedRun = useSetAtom(selectedWorkflowRunIdAtom);
  const library = useAtomValue(workflowLibraryAtom);
  const isNew = surface === 'workflow' && selectedId === NEW_WORKFLOW_ID;
  const select = (id: string) => {
    setSelected(id);
    setSelectedRun(null);
    setSurface('workflow');
    setTab('overview');
  };
  return (
    <div>
      <WorkflowStoragePanel />
      <button
        onClick={() => {
          setSurface('library');
          setSelectedRun(null);
        }}
        className="neu-row"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          border: 'none',
          cursor: 'pointer',
          background: surface === 'library' ? 'var(--sx-accent-soft)' : 'transparent',
          color: surface === 'library' ? NEU.accent : NEU.muted,
          fontSize: 11.5,
          fontWeight: 600,
          borderRadius: 9,
          padding: '6px 8px',
          marginBottom: 2,
        }}
      >
        <Library size={13} /> Library
      </button>
      <button
        onClick={() => {
          setSurface('history');
          setSelectedRun(null);
        }}
        className="neu-row"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          border: 'none',
          cursor: 'pointer',
          background: surface === 'history' ? 'var(--sx-accent-soft)' : 'transparent',
          color: surface === 'history' ? NEU.accent : NEU.muted,
          fontSize: 11.5,
          fontWeight: 600,
          borderRadius: 9,
          padding: '6px 8px',
          marginBottom: 2,
        }}
      >
        <History size={13} /> Run history
      </button>
      <button
        onClick={() => {
          setSelected(NEW_WORKFLOW_ID);
          setSelectedRun(null);
          setSurface('workflow');
          setTab('build');
        }}
        className="neu-row"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          border: 'none',
          cursor: 'pointer',
          background: isNew ? 'var(--sx-accent-soft)' : 'transparent',
          color: isNew ? NEU.accent : NEU.muted,
          fontSize: 11.5,
          fontWeight: 600,
          borderRadius: 9,
          padding: '6px 8px',
          marginBottom: 2,
        }}
      >
        <Plus size={13} /> New workflow
      </button>
      {Object.values(library).length > 0 && (
        <div>
          <div style={{ padding: '9px 8px 4px', fontSize: 10, color: NEU.muted }}>MY WORKFLOWS</div>
          {Object.values(library).map((entry) => (
            <button
              key={entry.id}
              onClick={() => select(entry.id)}
              className="neu-row"
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '7px 8px',
                border: 'none',
                borderRadius: 9,
                background:
                  surface === 'workflow' && selectedId === entry.id
                    ? 'var(--sx-accent-soft)'
                    : 'transparent',
                color: NEU.text,
                fontSize: 12,
              }}
            >
              {entry.draft.name}
            </button>
          ))}
        </div>
      )}
      {GROUPS.map(({ id, label, Icon }) => {
        const items = PORTFOLIO_WORKFLOWS.filter((w) => w.group === id);
        if (items.length === 0) return null;
        return (
          <div key={id}>
            <div
              style={{
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: NEU.faint,
                padding: '9px 8px 4px',
              }}
            >
              {label}
            </div>
            {items.map((w) => {
              const sel = surface === 'workflow' && w.id === selectedId;
              return (
                <button
                  key={w.id}
                  onClick={() => select(w.id)}
                  className="neu-row"
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: 9,
                    padding: '7px 8px',
                    marginBottom: 1,
                    background: sel ? 'var(--sx-accent-soft)' : 'transparent',
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      background: sel ? 'transparent' : NEU.surface,
                      boxShadow: sel ? 'none' : NEU.shadowSm,
                      display: 'grid',
                      placeItems: 'center',
                      color: sel ? NEU.accent : NEU.muted,
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={12} />
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: sel ? 650 : 550,
                      color: sel ? NEU.accent : NEU.text,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {short(w.name)}
                  </span>
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ── Body: the selected workflow's active mode ───────────────────────────────────
function WorkflowDetail({ def }: { def: PortfolioWorkflowDef }) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const tab = useAtomValue(workflowTabAtom);
  const library = useAtomValue(workflowLibraryAtom);
  const setTab = useSetAtom(workflowTabAtom);
  const runnable = getWorkflowConfig(def.id.replace(/^pf-/, ''));
  const resultPage = runnable?.resultPage;
  const surface: 'dark' | 'light' = resolvedTheme === 'dark' ? 'dark' : 'light';

  if (tab === 'build') {
    // Full-bleed canvas — the whole body. Controls live in the header.
    return (
      <div style={{ position: 'absolute', inset: 0, background: 'var(--sx-canvas-ground)' }}>
        <InlineBuilder key={def.id} workflowId={def.id} />
      </div>
    );
  }

  if (tab === 'run' || tab === 'results') {
    const content = <SavedWorkflowRun key={def.id} id={def.id} resultsOnly={tab === 'results'} />;
    return (
      <div className="absolute inset-0 overflow-auto p-6">
        <div className="mx-auto max-w-5xl">{content}</div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-auto p-6">
      <div className="mx-auto max-w-5xl">
        <WorkflowOverview def={def} />
      </div>
    </div>
  );
}

// A brand-new blank workflow being built in the surface — empty modes, a fresh
// canvas in Build. Persisted with the header Save button.
function NewWorkflowDetail() {
  const tab = useAtomValue(workflowTabAtom);
  const setTab = useSetAtom(workflowTabAtom);
  if (tab === 'build') {
    return (
      <div style={{ position: 'absolute', inset: 0, background: 'var(--sx-canvas-ground)' }}>
        <InlineBuilder key="__new__" blank />
      </div>
    );
  }
  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '24px 28px 56px' }}>
        {tab === 'overview' && (
          <StubCard
            title="A new, blank workflow"
            body="Switch to Build to add blocks — sources, logic, professional-judgment checkpoints and outputs. As you build, its process appears here. Use Save (top-right) to keep it."
            action={{
              label: 'Start building',
              icon: <ArrowRight size={15} />,
              onClick: () => setTab('build'),
            }}
          />
        )}
        {tab === 'run' && (
          <StubCard
            title="Nothing to run yet"
            body="Build the workflow first. Once it has a deterministic engine, you'll run it right here."
          />
        )}
        {tab === 'results' && (
          <StubCard title="No results yet" body="Run the workflow to produce its worksheet." />
        )}
      </div>
    </div>
  );
}

export function WorkflowPage({ workflowId }: { workflowId?: string }) {
  const executeWorkflow = useSetAtom(runWorkflowAtom);
  const setSelected = useSetAtom(selectedWorkflowIdAtom);
  const selectedId = useAtomValue(selectedWorkflowIdAtom);
  const [tab, setTab] = useAtom(workflowTabAtom);
  const [surface, setSurface] = useAtom(workflowSurfaceAtom);
  const setSelectedRun = useSetAtom(selectedWorkflowRunIdAtom);
  const bridge = useAtomValue(builderBridgeAtom);
  const setFit = useSetAtom(triggerFitViewAtom);
  const router = useRouter();

  // Deep-link preselect (e.g. /w/pf-t1134). Runs once per id.
  useEffect(() => {
    if (workflowId) {
      setSelected(workflowId);
      setSelectedRun(null);
      setSurface('workflow');
      setTab('overview');
    }
  }, [workflowId, setSelected, setSelectedRun, setSurface, setTab]);

  // Publish the workflow list into the Scope sidebar.
  usePageSidebar('workflows', WorkflowSidebarList);

  const isNew = selectedId === NEW_WORKFLOW_ID;
  const [library, setLibrary] = useAtom(workflowLibraryAtom);
  const personal = selectedId ? library[selectedId] : undefined;
  const def = personal
    ? {
        ...(getPortfolioWorkflowDef(personal.templateId) ?? {
          group: 'foundation' as const,
          sub: 'Personal',
          blocks: [],
          edges: [],
        }),
        id: personal.id,
        name: personal.draft.name,
        description: personal.draft.description ?? 'Personal workflow',
      }
    : !isNew && selectedId
      ? getPortfolioWorkflowDef(selectedId)
      : null;
  const hasSelection = isNew || !!def;
  const headerName = isNew ? 'New workflow' : def ? short(def.name) : null;
  const isBuild = tab === 'build';

  // Publish the workflow name + mode tabs (+ Build controls) into the panel header.
  const left: PageMenuItem[] =
    surface === 'history'
      ? [{ kind: 'label', id: 'wf-history', text: 'Run history', strong: true }]
      : surface === 'library'
        ? [{ kind: 'label', id: 'wf-library', text: 'Workflow library', strong: true }]
        : headerName
          ? [
              // Fixed-width title slot so the tabs after it always start at the same x
              // (consistent across workflows AND across Build/Run/… for one workflow).
              { kind: 'label', id: 'wf-name', text: headerName, strong: true, width: 210 },
              {
                kind: 'label',
                id: 'wf-version',
                text: personal
                  ? !personal.versions.length ||
                    definitionFingerprint(personal.draft) !==
                      definitionFingerprint(personal.versions.at(-1)!.definition)
                    ? 'Unsaved changes'
                    : `Version ${personal.versions.at(-1)!.number}`
                  : 'Template',
              },
              { kind: 'separator', id: 'sep' },
              ...TAB_LABELS.map((t): PageMenuItem => ({
                kind: 'button',
                id: `tab-${t.id}`,
                label: t.label,
                active: tab === t.id,
                onClick: () => {
                  // Create the editable copy before mounting the editor. Forking on
                  // the first edit remounted it and discarded in-progress input.
                  if (t.id === 'build' && selectedId && !personal && !isNew) {
                    const draft = templateDefinition(selectedId);
                    if (draft) {
                      const id = `custom:${crypto.randomUUID()}`;
                      setLibrary((previous) => ({
                        ...previous,
                        [id]: createWorkflow(id, selectedId, {
                          ...draft,
                          name: `${draft.name} — My workflow`,
                        }),
                      }));
                      setSelected(id);
                    }
                  }
                  setTab(t.id);
                },
              })),
            ]
          : [{ kind: 'label', id: 'wf-empty', text: 'Select a workflow' }];
  const right: PageMenuItem[] =
    surface === 'workflow' && hasSelection && isBuild
      ? [
          {
            kind: 'button',
            id: 'agent-lab',
            icon: <Bot size={14} />,
            label: 'Agent Lab',
            title: 'Open the Agent Lab — configure & evaluate an agent',
            onClick: () => router.push('/agent-lab'),
          },
          { kind: 'separator', id: 'sep-al' },
          {
            kind: 'button',
            id: 'undo',
            icon: <Undo2 size={14} />,
            title: 'Undo',
            onClick: () => bridge?.undo(),
            disabled: !bridge?.canUndo,
          },
          {
            kind: 'button',
            id: 'redo',
            icon: <Redo2 size={14} />,
            title: 'Redo',
            onClick: () => bridge?.redo(),
            disabled: !bridge?.canRedo,
          },
          {
            kind: 'button',
            id: 'fit',
            icon: <Maximize2 size={14} />,
            title: 'Fit',
            onClick: () => setFit(true),
            disabled: !bridge,
          },
          { kind: 'separator', id: 'sep2' },
          {
            kind: 'button',
            id: 'save',
            icon: <Save size={14} />,
            label: bridge?.isSaving ? 'Saving…' : 'Save',
            onClick: () => {
              if (personal)
                setLibrary((previous) => ({
                  ...previous,
                  [personal.id]: saveVersion(previous[personal.id]),
                }));
              bridge?.save();
            },
            disabled: !bridge || bridge?.isSaving,
          },
          {
            kind: 'button',
            id: 'run',
            icon: <Play size={14} />,
            label: bridge?.isExecuting ? 'Running…' : 'Run',
            primary: true,
            onClick: () => {
              if (selectedId) executeWorkflow({ id: selectedId, fromBuild: true });
            },
            disabled: !bridge || bridge?.isExecuting,
          },
        ]
      : [];
  usePageMenu('workflows', { left, right }, [
    surface,
    selectedId,
    tab,
    !!bridge,
    bridge?.canUndo,
    bridge?.canRedo,
    bridge?.isSaving,
    bridge?.isExecuting,
    personal,
  ]);

  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
        background: NEU.bg,
        fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {surface === 'history' ? (
        <WorkflowRunHistory />
      ) : surface === 'library' ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            padding: 32,
            textAlign: 'center',
          }}
        >
          <div>
            <span
              style={{
                display: 'inline-grid',
                placeItems: 'center',
                width: 52,
                height: 52,
                borderRadius: 15,
                background: NEU.surface,
                boxShadow: NEU.shadowSm,
                color: NEU.accent,
              }}
            >
              <Library size={24} />
            </span>
            <div style={{ fontSize: 16, fontWeight: 700, color: NEU.text, marginTop: 14 }}>
              Workflow library
            </div>
            <div style={{ fontSize: 13, color: NEU.muted, marginTop: 5, maxWidth: 380 }}>
              Choose a saved workflow or template in the sidebar. Its draft, versions, runs and
              results stay together here.
            </div>
          </div>
        </div>
      ) : isNew ? (
        <NewWorkflowDetail />
      ) : def ? (
        <WorkflowDetail def={def} />
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            padding: 32,
            textAlign: 'center',
          }}
        >
          <div>
            <span
              style={{
                display: 'inline-grid',
                placeItems: 'center',
                width: 52,
                height: 52,
                borderRadius: 15,
                background: NEU.surface,
                boxShadow: NEU.shadowSm,
                color: NEU.faint,
              }}
            >
              <WorkflowIcon size={24} />
            </span>
            <div style={{ fontSize: 15, fontWeight: 700, color: NEU.text, marginTop: 14 }}>
              Select a workflow
            </div>
            <div style={{ fontSize: 13, color: NEU.muted, marginTop: 5, maxWidth: 340 }}>
              Pick one in the sidebar to view its process, build it, run it, and review the result —
              all here.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
