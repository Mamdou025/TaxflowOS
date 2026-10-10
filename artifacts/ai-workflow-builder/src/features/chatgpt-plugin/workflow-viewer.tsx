import { useCallback, useEffect, useRef, useState } from 'react';
import { RecordedWorkflowBuilder } from '@/features/workflows-hub/recorded-workflow-builder';
import { createHostBridge, type HostBridge } from './host-bridge';
import { sameViewIdentity, type WorkflowView } from './view-contract';
import { SelectedEvidence, StepNavigator } from './step-navigator';
import { ViewerHeader } from './viewer-header';
import { InputPanel } from './input-panel';
import { SourcePanel } from './source-panel';
import { ChangePanel } from './change-panel';
import { useWorkflowActions } from './use-workflow-actions';
import type { ViewerTab } from './workbench-contract';

export function WorkflowViewer() {
  const [view, setView] = useState<WorkflowView | null>(null);
  const [selected, setSelected] = useState('');
  const [inspected, setInspected] = useState<string | null>(null);
  const [mode, setMode] = useState<'steps' | 'canvas'>('steps');
  const [tab, setTab] = useState<ViewerTab>('workflow');
  const [sourceId, setSourceId] = useState<string>();
  const [hasDrafts, setHasDrafts] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');
  const [shared, setShared] = useState(false);
  const [explaining, setExplaining] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const refreshToken = useRef(0);
  const bridge = useRef<HostBridge | null>(null);
  const currentSelection = useRef({ view, selected });
  currentSelection.current = { view, selected };
  const actions = useWorkflowActions(view, bridge);
  useEffect(() => {
    const connection = createHostBridge({
      connected: () => setConnected(true),
      error: (message) => {
        setError(message);
        setShared(false);
      },
      view: (snapshot) => {
        const previous = currentSelection.current;
        const same = snapshot && previous.view && sameViewIdentity(snapshot, previous.view);
        const sameWorkflow =
          snapshot &&
          previous.view &&
          snapshot.workspace.id === previous.view.workspace.id &&
          snapshot.workflowId === previous.view.workflowId &&
          snapshot.version === previous.view.version;
        const nextSelection =
          sameWorkflow && snapshot.definition.blocks.some((block) => block.id === previous.selected)
            ? previous.selected
            : (snapshot?.selectedBlockId ?? snapshot?.definition.blocks[0]?.id ?? '');
        setView(snapshot);
        setSelected(nextSelection);
        setInspected((id) =>
          same && snapshot.definition.blocks.some((block) => block.id === id) ? id : null,
        );
        setSourceId((id) =>
          same && snapshot.inspection?.sourceSummaries?.some((source) => source.id === id)
            ? id
            : undefined,
        );
        if (!same) {
          setMode('steps');
          setHasDrafts(false);
        }
        if (!sameWorkflow) setTab('workflow');
        setShared(false);
        setError('');
        refreshToken.current++;
        setRefreshing(false);
      },
    });
    bridge.current = connection;
    void connection.connect();
    return () => {
      bridge.current = null;
      connection.close();
    };
  }, []);
  useEffect(() => {
    let active = true;
    setShared(false);
    if (connected && view && selected && bridge.current)
      void bridge.current
        .shareSelection(view, selected, {
          tab,
          hasUnappliedDrafts: hasDrafts,
          pendingReview: actions.review,
          ...(tab === 'sources' && sourceId ? { sourceId } : {}),
        })
        .then(
          () => {
            if (active) setShared(true);
          },
          () => {
            if (active)
              setError(
                'The selected context could not be shared with ChatGPT. Try Explain this block to retry.',
              );
          },
        );
    return () => {
      active = false;
    };
  }, [connected, view, selected, tab, sourceId, hasDrafts, actions.review]);
  const select = useCallback((blockId: string) => {
    if (!blockId || currentSelection.current.selected === blockId) return;
    setSelected(blockId);
    setInspected(null);
    setShared(false);
    setError('');
  }, []);
  useEffect(() => {
    if (actions.review) {
      setTab('changes');
      if (actions.reviewBlockId) select(actions.reviewBlockId);
    }
  }, [actions.review, actions.reviewBlockId, select]);
  const inspectStep = (blockId: string) => {
    select(blockId);
    setInspected((previous) => (previous === blockId ? null : blockId));
  };
  const explain = async () => {
    if (!view || !selected || !bridge.current) return;
    setExplaining(true);
    try {
      await bridge.current.explain(view, selected, {
        tab,
        hasUnappliedDrafts: hasDrafts,
        pendingReview: actions.review,
        ...(tab === 'sources' && sourceId ? { sourceId } : {}),
      });
      if (currentSelection.current.view !== view || currentSelection.current.selected !== selected)
        return;
      setShared(true);
      setError('');
    } catch {
      if (currentSelection.current.view !== view || currentSelection.current.selected !== selected)
        return;
      setShared(false);
      setError('ChatGPT could not receive the explanation request. Your workflow was not changed.');
    } finally {
      setExplaining(false);
    }
  };
  const refresh = async () => {
    if (!view || !bridge.current) return;
    const token = ++refreshToken.current;
    setRefreshing(true);
    setError('');
    await bridge.current.refresh(view, selected || undefined);
    if (refreshToken.current === token) setRefreshing(false);
  };
  const expand = async () => {
    try {
      await bridge.current?.expand();
    } catch {
      setError('A larger view is unavailable in this host. Continue in this panel.');
    }
  };
  const block = view?.definition.blocks.find((item) => item.id === selected);
  const contextLabel =
    view && block
      ? `${shared ? 'Context shared' : error ? 'Context sharing unavailable' : 'Sharing selection'}: ${block.label} · ${view.workflowId} · v${view.version} · ${tab}`
      : connected
        ? 'Connected. Open an exact workflow version or run from chat.'
        : 'Connecting to ChatGPT…';
  const identity = view
    ? `${view.workspace.id}:${view.workflowId}:${view.version}:${view.runId ?? 'definition'}`
    : '';
  return (
    <main className="inscope-chatgpt-viewer">
      <ViewerHeader
        view={view}
        connected={connected}
        error={error}
        contextLabel={contextLabel}
        refreshing={refreshing}
        busy={!!actions.busy}
        tab={tab}
        onTab={setTab}
        onRefresh={() => void refresh()}
        onExpand={() => void expand()}
      />
      {(actions.busy ||
        actions.error ||
        actions.notice ||
        (view?.capabilities.write && !view.runId)) && (
        <div className="viewer-work-actions">
          {view?.capabilities.write && !view.runId && (
            <>
              <button
                className="viewer-button"
                type="button"
                disabled={!!actions.busy || view.libraryRevision === undefined}
                onClick={() => void actions.start()}
              >
                Start work from this version
              </button>
              <span className="viewer-muted">
                Creates a paused run here. No calculations run until Recalculate.
              </span>
            </>
          )}
          {actions.busy && <p role="status">{actions.busy}</p>}
          {actions.error && <p role="alert">{actions.error}</p>}
          {actions.notice && <p role="status">{actions.notice}</p>}
        </div>
      )}
      <div className="viewer-body">
        {view?.pendingReceipt && (
          <p className="viewer-empty">
            Run {view.pendingReceipt.runId} · saved revision {view.pendingReceipt.revision}.
            Previous evidence is hidden until the refreshed snapshot is verified.
          </p>
        )}
        <section
          role="tabpanel"
          id="viewer-panel-workflow"
          aria-labelledby="viewer-tab-workflow"
          hidden={tab !== 'workflow' || !!view?.pendingReceipt}
          className={mode === 'steps' ? 'viewer-scroll' : 'viewer-canvas-panel'}
          data-testid="viewer-content"
        >
          <div
            className="viewer-workflow-tools viewer-modes"
            role="group"
            aria-label="Workflow view"
          >
            <button
              type="button"
              aria-pressed={mode === 'steps'}
              disabled={!view}
              onClick={() => setMode('steps')}
            >
              Steps
            </button>
            <button
              type="button"
              aria-pressed={mode === 'canvas'}
              disabled={!view?.definition.blocks.length}
              onClick={() => setMode('canvas')}
            >
              Canvas
            </button>
          </div>
          {view?.definition.blocks.length ? (
            mode === 'steps' ? (
              <StepNavigator
                view={view}
                selected={selected}
                inspected={inspected}
                connected={connected}
                explaining={explaining}
                onSelect={inspectStep}
                onExplain={() => void explain()}
              />
            ) : (
              <div className="viewer-canvas">
                <RecordedWorkflowBuilder
                  key={identity}
                  definition={view.definition}
                  record={view.record}
                  statuses={view.statuses}
                  selectedBlockId={selected}
                  onSelect={select}
                  openInspectorOnMount={false}
                  header={
                    <div className="p-4">
                      <p className="viewer-muted">
                        {view.workspace.name} · Version {view.version} · Read-only graph inspection
                      </p>
                      <button
                        type="button"
                        className="viewer-button"
                        disabled={!connected || explaining}
                        onClick={() => void explain()}
                      >
                        {explaining ? 'Sending…' : 'Explain this block'}
                      </button>
                      <p role="status" className="viewer-muted">
                        {contextLabel}
                      </p>
                      {error && <p role="alert">{error}</p>}
                    </div>
                  }
                  evidence={<SelectedEvidence view={view} blockId={selected} />}
                />
              </div>
            )
          ) : (
            <p className="viewer-empty">
              {view
                ? 'This saved workflow has no blocks to inspect.'
                : 'Open a saved InScope workflow from chat to inspect its exact steps.'}
            </p>
          )}
        </section>
        {view && (
          <>
            <section
              role="tabpanel"
              id="viewer-panel-inputs"
              aria-labelledby="viewer-tab-inputs"
              hidden={tab !== 'inputs' || !!view.pendingReceipt}
              className="viewer-scroll"
            >
              <InputPanel
                key={identity}
                view={view}
                actions={actions}
                onSelect={select}
                onDirty={setHasDrafts}
              />
            </section>
            <section
              role="tabpanel"
              id="viewer-panel-sources"
              aria-labelledby="viewer-tab-sources"
              hidden={tab !== 'sources' || !!view.pendingReceipt}
              className="viewer-scroll"
            >
              <SourcePanel
                key={identity}
                view={view}
                bridge={bridge.current}
                actions={actions}
                sourceId={sourceId}
                onSource={(id, blockId) => {
                  setSourceId(id);
                  select(blockId);
                }}
                onSelect={select}
              />
            </section>
            <section
              role="tabpanel"
              id="viewer-panel-changes"
              aria-labelledby="viewer-tab-changes"
              hidden={tab !== 'changes' || !!view.pendingReceipt}
              className="viewer-scroll"
            >
              <ChangePanel view={view} actions={actions} hasDrafts={hasDrafts} />
            </section>
          </>
        )}
      </div>
    </main>
  );
}
