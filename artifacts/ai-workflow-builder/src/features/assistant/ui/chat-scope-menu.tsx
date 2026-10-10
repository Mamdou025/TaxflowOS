import { useEffect, useRef, useState } from 'react';
import { useAtomValue, useSetAtom, useStore } from 'jotai';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Workflow, X } from 'lucide-react';
import { InScopeNeuMark } from '@/components/inscope-neu-mark';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
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
  const titleRef = useRef<HTMLHeadingElement>(null);
  const skipReturnFocus = useRef(false);
  const returnToWorkflow = useRef(false);
  const reducedMotion = useReducedMotion();
  useReconcileWorkHistory();
  useEffect(() => {
    setOpen(false);
  }, [epoch]);
  const sourceCount = new Set(context.sources.map((source) => source.id)).size;
  const summary =
    [
      context.companyName,
      context.year?.toString(),
      sourceCount ? `${sourceCount} ${sourceCount === 1 ? 'source' : 'sources'}` : '',
      workflow
        ? `${workflow.name} · v${workflow.version} · ${workflow.status}`
        : context.workflowScope
          ? `${context.workflowScope.name} · Draft reference`
          : '',
    ]
      .filter(Boolean)
      .join(' · ') || 'General chat';
  const closeForNavigation = () => {
    skipReturnFocus.current = true;
    setOpen(false);
  };
  const browseSources = () => {
    closeForNavigation();
    store.set(chatPanelModeAtom, 'split');
    store.set(openWorkspaceWindowAtom, { pageKey: 'sources', title: 'Sources' });
    router.push('/');
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) skipReturnFocus.current = false;
        setOpen(next);
      }}
    >
      <WorkMenuStyles />
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Open Scope"
          title={`Scope: ${summary}`}
          className="chat-scope-trigger"
          data-chat-scope-trigger
          data-hero={hero || undefined}
          data-compact={compact || undefined}
        >
          <motion.span
            layoutId="scope-orb"
            layout
            transition={{ duration: reducedMotion ? 0 : 0.3 }}
            className="chat-scope-orb"
            data-chat-scope-orb
          >
            <InScopeNeuMark
              size={hero ? 100 : compact ? 44 : 50}
              animate={!reducedMotion}
              label="Scope"
            />
          </motion.span>
          {hero && <span className="chat-scope-wordmark">InScope</span>}
          <span className="chat-scope-summary" data-chat-scope-summary>
            <span>{summary}</span>
            <ChevronDown size={12} />
          </span>
        </button>
      </DialogTrigger>
      <DialogContent
        className="chat-scope-panel"
        data-chat-scope-panel
        data-chat-context
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          titleRef.current?.focus();
        }}
        onCloseAutoFocus={(event) => {
          if (!skipReturnFocus.current) return;
          event.preventDefault();
          if (returnToWorkflow.current) {
            returnToWorkflow.current = false;
            requestAnimationFrame(() => {
              const card = document.getElementById('chat-workflow');
              card?.scrollIntoView({ block: 'start', behavior: reducedMotion ? 'auto' : 'smooth' });
              card?.focus({ preventScroll: true });
            });
          }
        }}
      >
        <div className="chat-scope-panel-heading">
          <InScopeNeuMark size={40} />
          <div>
            <DialogTitle ref={titleRef} tabIndex={-1}>
              Scope for this chat
            </DialogTitle>
            <DialogDescription>Choose what this conversation works with.</DialogDescription>
          </div>
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
                      returnToWorkflow.current = true;
                      closeForNavigation();
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
      </DialogContent>
    </Dialog>
  );
}
