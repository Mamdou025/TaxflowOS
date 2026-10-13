import { useEffect, useId, useRef, useState } from 'react';
import { useAtomValue, useSetAtom, useStore } from 'jotai';
import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, ChevronDown, Files, Workflow, X } from 'lucide-react';
import { InScopeNeuMark } from '@/components/inscope-neu-mark';
import { useRouter } from '@/lib/router';
import type { WorkItem } from '@/lib/work-store';
import { openWorkspaceWindowAtom } from '@/shared/stores/workspace-store';
import { chatPanelModeAtom } from '@/shared/stores/chat-store';
import { showSessionInRun } from '@/features/workflows-hub/workflow-session-store';
import { workflowSurfaceAtom } from '@/features/workflows-hub/workflows-store';
import {
  chatContextAtom,
  chatContextEpochAtom,
  chatContextLockedAtom,
} from '../runtime/chat/chat-context-store';
import { selectedChatWorkflowAtom } from '../runtime/chat/source-selection';
import { ChatScopeContent } from './chat-context-strip';
import { ChatEvidence } from './data-files-panel';
import { useChatWorkflowSummary } from './chat-workflow-thread';
import { WorkMenu, WorkMenuStyles, useReconcileWorkHistory } from './work-menu';
import './chat-scope-menu.css';

/** Deterministic company-initial color, same visual family as CoworkerAvatar's accent chips. */
function companyAccent(name: string) {
  let hash = 0;
  for (let index = 0; index < name.length; index += 1) {
    hash = (hash * 31 + name.charCodeAt(index)) >>> 0;
  }
  return `hsl(${hash % 360} 52% 42%)`;
}

/** Maps a workflow status label onto the bar's three badge tones. Display grouping only. */
function statusTone(status: string): 'done' | 'active' | 'paused' {
  if (status === 'Running') return 'active';
  if (status === 'Paused') return 'paused';
  return 'done';
}

/** One current-chat scope surface. Rendering never selects a workflow or executes it. */
export function ChatScopeMenu({
  compact = false,
  hero = false,
  onOpenWork,
}: {
  compact?: boolean;
  hero?: boolean;
  onOpenWork: (item: WorkItem) => void;
}) {
  const store = useStore();
  const router = useRouter();
  const context = useAtomValue(chatContextAtom);
  const epoch = useAtomValue(chatContextEpochAtom);
  const locked = useAtomValue(chatContextLockedAtom);
  const clearDraft = useSetAtom(selectedChatWorkflowAtom);
  const workflow = useChatWorkflowSummary();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  useReconcileWorkHistory();
  useEffect(() => {
    setOpen(false);
  }, [epoch]);
  // Floats over the conversation (no backdrop, no document-flow push) — clicking
  // outside closes it the same way a standard popover would.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);
  const sourceCount = new Set(context.sources.map((source) => source.id)).size;
  const summaryItems = [
    { id: 'company', label: context.companyName },
    { id: 'year', label: context.year?.toString() },
    {
      id: 'sources',
      label: sourceCount ? `${sourceCount} ${sourceCount === 1 ? 'source' : 'sources'}` : '',
    },
    {
      id: 'workflow',
      label: workflow
        ? `${workflow.name} · v${workflow.version} · ${workflow.status}`
        : context.workflowScope
          ? `${context.workflowScope.name} · Draft reference`
          : '',
    },
  ].filter((item) => item.label);
  const summary = summaryItems.map((item) => item.label).join(' · ') || 'General chat';
  const closeForNavigation = () => setOpen(false);
  const closeScope = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };
  const browseSources = () => {
    closeForNavigation();
    store.set(chatPanelModeAtom, 'split');
    store.set(openWorkspaceWindowAtom, { pageKey: 'sources', title: 'Sources' });
    router.push('/');
  };
  return (
    <div
      ref={containerRef}
      className="chat-scope"
      data-chat-scope-bar
      data-hero={hero || undefined}
      data-expanded={open || undefined}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open && !event.defaultPrevented) {
          event.preventDefault();
          event.stopPropagation();
          closeScope();
        }
      }}
    >
      <WorkMenuStyles />
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? 'Close Scope' : 'Open Scope'}
        aria-expanded={open}
        aria-controls={panelId}
        title={`Scope: ${summary}`}
        className="chat-scope-trigger"
        data-chat-scope-trigger
        data-hero={hero || undefined}
        data-compact={compact || undefined}
        onClick={() => setOpen((previous) => !previous)}
      >
        <motion.span
          layoutId="scope-orb"
          layout
          transition={{ duration: reducedMotion ? 0 : 0.3 }}
          className="chat-scope-orb"
          data-chat-scope-orb
        >
          <InScopeNeuMark
            size={hero ? 100 : compact ? 40 : 46}
            animate={!reducedMotion}
            label="Scope"
          />
        </motion.span>
        {hero && <span className="chat-scope-wordmark">InScope</span>}
        {hero ? (
          <span className="chat-scope-summary" data-chat-scope-summary>
            <span className="chat-scope-values">
              {summaryItems.length ? (
                summaryItems.map((item) => (
                  <span key={item.id} data-scope-field={item.id} title={item.label}>
                    {item.label}
                  </span>
                ))
              ) : (
                <span>General chat</span>
              )}
            </span>
            <ChevronDown size={13} className="chat-scope-chevron" aria-hidden="true" />
          </span>
        ) : (
          <span className="chat-scope-fields" data-chat-scope-fields>
            <span
              className="chat-scope-field"
              data-scope-field="company"
              data-filled={Boolean(context.companyName) || undefined}
              title={context.companyName || 'No company set for this chat'}
            >
              {context.companyName ? (
                <span
                  className="chat-scope-company-avatar"
                  style={{ background: companyAccent(context.companyName) }}
                  aria-hidden="true"
                >
                  {context.companyName.trim().charAt(0).toUpperCase()}
                </span>
              ) : (
                <span className="chat-scope-placeholder-icon" aria-hidden="true">
                  +
                </span>
              )}
              <span className="chat-scope-field-text">{context.companyName || 'Company'}</span>
            </span>
            <span className="chat-scope-divider" aria-hidden="true" data-scope-divider-year />
            <span
              className="chat-scope-field"
              data-scope-field="year"
              data-filled={Boolean(context.year) || undefined}
              title={context.year ? `Reporting year ${context.year}` : 'No reporting year set'}
            >
              <Calendar size={13} className="chat-scope-field-icon" aria-hidden="true" />
              <span className="chat-scope-field-text">{context.year ?? 'Year'}</span>
            </span>
            <span className="chat-scope-divider" aria-hidden="true" data-scope-divider-sources />
            <span
              className="chat-scope-field"
              data-scope-field="sources"
              data-filled={sourceCount > 0 || undefined}
              title={sourceCount ? `${sourceCount} selected source(s)` : 'No sources selected'}
            >
              <Files size={13} className="chat-scope-field-icon" aria-hidden="true" />
              <span className="chat-scope-field-text">
                {sourceCount
                  ? `${sourceCount} ${sourceCount === 1 ? 'source' : 'sources'}`
                  : 'Sources'}
              </span>
            </span>
            <span className="chat-scope-divider" aria-hidden="true" />
            {workflow ? (
              <span
                className="chat-scope-field chat-scope-field-workflow"
                data-scope-field="workflow"
                data-filled="true"
                title={`${workflow.name} · v${workflow.version} · ${workflow.status}`}
              >
                <Workflow size={13} className="chat-scope-field-icon" aria-hidden="true" />
                <span className="chat-scope-field-stack">
                  <span className="chat-scope-field-text">
                    {workflow.name}
                    <span
                      className="chat-scope-badge chat-scope-status-badge"
                      data-status={statusTone(workflow.status)}
                    >
                      {workflow.status.toUpperCase()}
                    </span>
                  </span>
                  {workflow.headline && (
                    <span className="chat-scope-field-sub">
                      {workflow.headline.label} {workflow.headline.value}
                    </span>
                  )}
                </span>
              </span>
            ) : context.workflowScope ? (
              <span
                className="chat-scope-field"
                data-scope-field="workflow"
                data-filled="true"
                title={`${context.workflowScope.name} · Draft reference`}
              >
                <Workflow size={13} className="chat-scope-field-icon" aria-hidden="true" />
                <span className="chat-scope-field-text">{context.workflowScope.name} · Draft</span>
              </span>
            ) : (
              <span
                className="chat-scope-field"
                data-scope-field="workflow"
                title="No workflow active in this chat"
              >
                <Workflow size={13} className="chat-scope-field-icon" aria-hidden="true" />
                <span className="chat-scope-field-text">Workflow</span>
              </span>
            )}
          </span>
        )}
        {!hero && <ChevronDown size={14} className="chat-scope-chevron" aria-hidden="true" />}
      </button>
      <section
        id={panelId}
        role="region"
        aria-label="Scope for this chat"
        hidden={!open}
        className="chat-scope-panel"
        data-chat-scope-panel
        data-chat-context
      >
        <div className="chat-scope-panel-heading">
          <div>
            <h2>Scope for this chat</h2>
            <p>Choose what this conversation works with.</p>
          </div>
          <button
            type="button"
            className="chat-scope-icon-button"
            aria-label="Close Scope"
            onClick={closeScope}
          >
            <X size={16} />
          </button>
        </div>
        <div className="chat-scope-panel-body">
          {locked && (
            <p className="chat-scope-lock-note" role="status">
              Scope can be edited when the chat is ready.
            </p>
          )}
          <ChatScopeContent key={`scope-${epoch}`} onBrowseSources={browseSources} />
          <section className="chat-scope-section" aria-label="Workflow scope">
            <h3>
              <Workflow size={15} /> Workflow
            </h3>
            {workflow ? (
              <section className="chat-scope-workflow" aria-label="Current workflow">
                <strong>{workflow.name}</strong>
                <p className="chat-scope-note">
                  Version {workflow.version} · {workflow.status}
                </p>
                <div className="chat-scope-actions">
                  <button
                    type="button"
                    onClick={() => {
                      closeForNavigation();
                      requestAnimationFrame(() => {
                        const card = document.getElementById('chat-workflow');
                        card?.scrollIntoView({
                          block: 'start',
                          behavior: reducedMotion ? 'auto' : 'smooth',
                        });
                        card?.focus({ preventScroll: true });
                      });
                    }}
                  >
                    Return to workflow in chat
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closeForNavigation();
                      showSessionInRun(store, workflow.ref);
                      store.set(workflowSurfaceAtom, 'workflow');
                      store.set(chatPanelModeAtom, 'split');
                      store.set(openWorkspaceWindowAtom, {
                        pageKey: 'workflows',
                        title: 'Workflows',
                      });
                      router.push('/');
                    }}
                  >
                    Open workflow details
                  </button>
                </div>
              </section>
            ) : (
              <p className="chat-scope-empty">No workflow is active in this chat.</p>
            )}
            {context.workflowScope && (
              <div className="chat-scope-draft">
                <div>
                  <strong>{context.workflowScope.name}</strong>
                  <p className="chat-scope-note">Draft reference · selected context; not started</p>
                </div>
                <button
                  type="button"
                  className="chat-scope-icon-button"
                  aria-label="Remove workflow scope"
                  disabled={locked}
                  onClick={() => clearDraft(null)}
                >
                  <X size={15} />
                </button>
              </div>
            )}
            {context.workflowInteraction && (
              <p className="chat-scope-note" aria-label="Latest workflow action">
                {context.workflowInteraction.message}
              </p>
            )}
          </section>
          <ChatEvidence key={`evidence-${epoch}`} />
          <WorkMenu
            historyOnly
            historyLocked={locked}
            onOpen={onOpenWork}
            onNavigate={closeForNavigation}
          />
        </div>
      </section>
    </div>
  );
}
