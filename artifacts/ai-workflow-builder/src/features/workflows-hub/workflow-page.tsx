

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

import { useEffect } from 'react';
import { useRouter } from '@/lib/router';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useTheme } from 'next-themes';
import { ArrowRight, Bot, Boxes, Database, FileText, Maximize2, Play, Plus, Redo2, Save, Undo2, Workflow as WorkflowIcon } from 'lucide-react';
import { PORTFOLIO_WORKFLOWS, getPortfolioWorkflowDef, type PortfolioWorkflowDef, type PortfolioWorkflowGroup } from '@/shared/workflow-engine/templates/portfolio/portfolio-workflows';
import { getWorkflowConfig } from '@/shared/workflow-engine/runtime/workflow-runs';
import { triggerFitViewAtom } from '@/shared/workflow-engine/state/workflow-store';
import { builderBridgeAtom } from '@/lib/builder-bridge';
import { getPage } from '@/shared/stores/resource-registry';
import { usePageMenu, type PageMenuItem } from '@/shared/stores/page-menu-store';
import { usePageSidebar } from '@/shared/stores/page-sidebar-store';
import { WorkflowRunFlow } from '@/features/assistant/workspace/workflow-run-flow';
import { InlineBuilder } from '@/features/workflow-builder/ui/inline-builder';
import { NEU } from '@/components/neumorphic-sidebar';
import { WorkflowOverview } from '@/features/workflows-hub/workflow-overview';
import { GenericWorksheet } from '@/features/workflows-hub/generic-worksheet';
import { NEW_WORKFLOW_ID, selectedWorkflowIdAtom, workflowTabAtom, type WorkflowTab } from '@/features/workflows-hub/workflows-store';

const TAB_LABELS: { id: WorkflowTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'build', label: 'Build' },
  { id: 'run', label: 'Run' },
  { id: 'results', label: 'Results' },
];

const GROUPS: { id: PortfolioWorkflowGroup; label: string; Icon: typeof Boxes }[] = [
  { id: 'platform', label: 'Platform services', Icon: Boxes },
  { id: 'foundation', label: 'Foundation', Icon: Database },
  { id: 'tier1', label: 'Tier 1', Icon: FileText },
];

const short = (name: string) => name.replace(/^Platform Services · /, '');

function StubCard({ title, body, action }: { title: string; body: string; action?: { label: string; icon: React.ReactNode; onClick: () => void } }) {
  return (
    <div style={{ maxWidth: 560, background: NEU.surface, borderRadius: 16, boxShadow: NEU.shadowSm, padding: '22px 24px' }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: NEU.text }}>{title}</div>
      <div style={{ fontSize: 13, lineHeight: 1.6, color: NEU.muted, margin: '8px 0 0' }}>{body}</div>
      {action && (
        <button onClick={action.onClick} style={{ marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 8, border: 'none', cursor: 'pointer', background: NEU.bg, boxShadow: NEU.shadowSm, color: NEU.accent, fontSize: 13, fontWeight: 650, borderRadius: 11, padding: '10px 16px' }}>
          {action.icon}{action.label}<ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}

// ── Sidebar section (published into the Scope sidebar via usePageSidebar) ────────
export function WorkflowSidebarList() {
  const [selectedId, setSelected] = useAtom(selectedWorkflowIdAtom);
  const setTab = useSetAtom(workflowTabAtom);
  const isNew = selectedId === NEW_WORKFLOW_ID;
  const select = (id: string) => { setSelected(id); setTab('overview'); };
  return (
    <div>
      <button
        onClick={() => { setSelected(NEW_WORKFLOW_ID); setTab('build'); }}
        className="neu-row"
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 7, border: 'none', cursor: 'pointer', background: isNew ? 'var(--sx-accent-soft)' : 'transparent', color: isNew ? NEU.accent : NEU.muted, fontSize: 11.5, fontWeight: 600, borderRadius: 9, padding: '6px 8px', marginBottom: 2 }}
      >
        <Plus size={13} /> New workflow
      </button>
      {GROUPS.map(({ id, label, Icon }) => {
        const items = PORTFOLIO_WORKFLOWS.filter((w) => w.group === id);
        if (items.length === 0) return null;
        return (
          <div key={id}>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: NEU.faint, padding: '9px 8px 4px' }}>{label}</div>
            {items.map((w) => {
              const sel = w.id === selectedId;
              return (
                <button key={w.id} onClick={() => select(w.id)} className="neu-row" style={{ width: '100%', textAlign: 'left', display: 'flex', gap: 8, alignItems: 'center', border: 'none', cursor: 'pointer', borderRadius: 9, padding: '7px 8px', marginBottom: 1, background: sel ? 'var(--sx-accent-soft)' : 'transparent' }}>
                  <span style={{ width: 20, height: 20, borderRadius: 6, background: sel ? 'transparent' : NEU.surface, boxShadow: sel ? 'none' : NEU.shadowSm, display: 'grid', placeItems: 'center', color: sel ? NEU.accent : NEU.muted, flexShrink: 0 }}><Icon size={12} /></span>
                  <span style={{ fontSize: 12, fontWeight: sel ? 650 : 550, color: sel ? NEU.accent : NEU.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{short(w.name)}</span>
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

  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '24px 28px 56px' }}>
        {tab === 'overview' && <WorkflowOverview def={def} />}

        {tab === 'run' && (
          runnable ? (
            <div style={{ background: NEU.surface, borderRadius: 18, boxShadow: NEU.shadowSm, padding: '16px 16px 12px' }}>
              <WorkflowRunFlow
                config={runnable}
                surface={surface}
                onComplete={() => setTab('results')}
                onOpenPage={(pk) => { if (resultPage && pk === resultPage) setTab('results'); else router.push(`/${pk}`); }}
                onOpenBuilder={() => setTab('build')}
              />
            </div>
          ) : (
            <StubCard
              title="Run — engine not built yet"
              body="This workflow is a structural blueprint: it maps the standardized process, but its calculation engine hasn't been built. Once it is, you'll run it right here and the result lands in Results. Use the Build tab to view or edit the graph."
              action={{ label: 'Open the Build tab', icon: <ArrowRight size={15} />, onClick: () => setTab('build') }}
            />
          )
        )}

        {tab === 'results' && (() => {
          const ResultComp = resultPage ? getPage(resultPage)?.Component : null;
          if (ResultComp) {
            return (
              <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: NEU.shadowSm, background: 'var(--sx-card)' }}>
                <ResultComp />
              </div>
            );
          }
          if (runnable) {
            // Config-driven worksheet for runnable workflows without a bespoke one
            // (the representative blueprint runs).
            return (
              <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: NEU.shadowSm, background: 'var(--sx-card)' }}>
                <GenericWorksheet config={runnable} representative />
              </div>
            );
          }
          return (
            <StubCard
              title="Results appear here after a run"
              body="Once this workflow runs and is approved, its manager-reviewable worksheet — the deliverable — shows up right here (and in the Worksheets library)."
            />
          );
        })()}
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
            action={{ label: 'Start building', icon: <ArrowRight size={15} />, onClick: () => setTab('build') }}
          />
        )}
        {tab === 'run' && <StubCard title="Nothing to run yet" body="Build the workflow first. Once it has a deterministic engine, you'll run it right here." />}
        {tab === 'results' && <StubCard title="No results yet" body="Run the workflow to produce its worksheet." />}
      </div>
    </div>
  );
}

export function WorkflowPage({ workflowId }: { workflowId?: string }) {
  const setSelected = useSetAtom(selectedWorkflowIdAtom);
  const selectedId = useAtomValue(selectedWorkflowIdAtom);
  const [tab, setTab] = useAtom(workflowTabAtom);
  const bridge = useAtomValue(builderBridgeAtom);
  const setFit = useSetAtom(triggerFitViewAtom);
  const router = useRouter();

  // Deep-link preselect (e.g. /w/pf-t1134). Runs once per id.
  useEffect(() => {
    if (workflowId) { setSelected(workflowId); setTab('overview'); }
  }, [workflowId, setSelected, setTab]);

  // Publish the workflow list into the Scope sidebar.
  usePageSidebar('workflows', WorkflowSidebarList);

  const isNew = selectedId === NEW_WORKFLOW_ID;
  const def = !isNew && selectedId ? getPortfolioWorkflowDef(selectedId) : null;
  const hasSelection = isNew || !!def;
  const headerName = isNew ? 'New workflow' : def ? short(def.name) : null;
  const isBuild = tab === 'build';

  // Publish the workflow name + mode tabs (+ Build controls) into the panel header.
  const left: PageMenuItem[] = headerName
    ? [
        // Fixed-width title slot so the tabs after it always start at the same x
        // (consistent across workflows AND across Build/Run/… for one workflow).
        { kind: 'label', id: 'wf-name', text: headerName, strong: true, width: 210 },
        { kind: 'separator', id: 'sep' },
        ...TAB_LABELS.map((t): PageMenuItem => ({
          kind: 'button', id: `tab-${t.id}`, label: t.label, active: tab === t.id, onClick: () => setTab(t.id),
        })),
      ]
    : [{ kind: 'label', id: 'wf-empty', text: 'Select a workflow' }];
  const right: PageMenuItem[] = hasSelection && isBuild
    ? [
        { kind: 'button', id: 'agent-lab', icon: <Bot size={14} />, label: 'Agent Lab', title: 'Open the Agent Lab — configure & evaluate an agent', onClick: () => router.push('/agent-lab') },
        { kind: 'separator', id: 'sep-al' },
        { kind: 'button', id: 'undo', icon: <Undo2 size={14} />, title: 'Undo', onClick: () => bridge?.undo(), disabled: !bridge?.canUndo },
        { kind: 'button', id: 'redo', icon: <Redo2 size={14} />, title: 'Redo', onClick: () => bridge?.redo(), disabled: !bridge?.canRedo },
        { kind: 'button', id: 'fit', icon: <Maximize2 size={14} />, title: 'Fit', onClick: () => setFit(true), disabled: !bridge },
        { kind: 'separator', id: 'sep2' },
        { kind: 'button', id: 'save', icon: <Save size={14} />, label: bridge?.isSaving ? 'Saving…' : 'Save', onClick: () => bridge?.save(), disabled: !bridge || bridge?.isSaving },
        { kind: 'button', id: 'run', icon: <Play size={14} />, label: bridge?.isExecuting ? 'Running…' : 'Run', primary: true, onClick: () => bridge?.run(), disabled: !bridge || bridge?.isExecuting },
      ]
    : [];
  usePageMenu('workflows', { left, right }, [selectedId, tab, !!bridge, bridge?.canUndo, bridge?.canRedo, bridge?.isSaving, bridge?.isExecuting]);

  return (
    <div style={{ position: 'relative', height: '100%', background: NEU.bg, fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      {isNew ? (
        <NewWorkflowDetail />
      ) : def ? (
        <WorkflowDetail def={def} />
      ) : (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', padding: 32, textAlign: 'center' }}>
          <div>
            <span style={{ display: 'inline-grid', placeItems: 'center', width: 52, height: 52, borderRadius: 15, background: NEU.surface, boxShadow: NEU.shadowSm, color: NEU.faint }}><WorkflowIcon size={24} /></span>
            <div style={{ fontSize: 15, fontWeight: 700, color: NEU.text, marginTop: 14 }}>Select a workflow</div>
            <div style={{ fontSize: 13, color: NEU.muted, marginTop: 5, maxWidth: 340 }}>Pick one in the sidebar to view its process, build it, run it, and review the result — all here.</div>
          </div>
        </div>
      )}
    </div>
  );
}
