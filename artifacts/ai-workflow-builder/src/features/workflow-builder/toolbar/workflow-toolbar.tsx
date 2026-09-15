import { useAtomValue, useSetAtom } from 'jotai';
import { Bot } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { builderBridgeAtom, builderEmbeddedAtom } from '@/lib/builder-bridge';
import { Button } from '@/shared/ui/button';
import { Panel } from '../ui/ai-elements/panel';
import { DeployButton } from '@/components/deploy-button';
import { GitHubStarsButton } from '@/components/github-stars-button';
import { UserMenu } from '@/components/workflows/user-menu';
import { type WorkflowToolbarProps } from './types';
import { useWorkflowState } from './use-workflow-state';
import { useWorkflowActions } from './use-workflow-actions';
import { LocalStudioTopBar } from './local-studio-top-bar';
import { WorkflowMenuComponent, ToolbarActions, DuplicateButton } from './toolbar-actions';

export const WorkflowToolbar = ({ workflowId }: WorkflowToolbarProps) => {
  const state = useWorkflowState();
  const actions = useWorkflowActions(state);
  const setBridge = useSetAtom(builderBridgeAtom);
  const embedded = useAtomValue(builderEmbeddedAtom);

  // Keep the latest handlers/state in a ref so the published (stable) bridge
  // functions never close over stale nodes/edges.
  const latest = useRef({ state, actions });
  latest.current = { state, actions };

  // Publish local-builder actions for the inline page-menu header. Flags come from
  // the deps snapshot; functions read `latest.current`.
  useEffect(() => {
    if (!state.isLocal) return;
    setBridge({
      save: () => latest.current.actions.handleSave(),
      run: () => latest.current.actions.handleExecute(),
      undo: () => latest.current.state.undo(),
      redo: () => latest.current.state.redo(),
      canUndo: state.canUndo,
      canRedo: state.canRedo,
      isExecuting: state.isExecuting,
      isSaving: state.isSaving,
      hasUnsaved: state.hasUnsavedChanges,
    });
    return () => setBridge(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.isLocal,
    state.canUndo,
    state.canRedo,
    state.isExecuting,
    state.isSaving,
    state.hasUnsavedChanges,
  ]);

  if (state.isLocal) {
    // Inline (Scope panel): the chrome lives in the page-menu header instead of a
    // floating rail. Still mounted above (hooks/effects run) — just no rail.
    if (embedded) return null;
    return <LocalStudioTopBar actions={actions} state={state} />;
  }

  return (
    <>
      <Panel
        className="flex flex-col gap-2 rounded-none border-none bg-transparent p-0 lg:flex-row lg:items-center"
        position="top-left"
      >
        <div className="flex items-center gap-2">
          <WorkflowMenuComponent actions={actions} state={state} workflowId={workflowId} />
          {workflowId && !state.isOwner && (
            <span className="hidden text-muted-foreground text-xs uppercase lg:inline">
              Read-only
            </span>
          )}
        </div>
      </Panel>

      <div className="pointer-events-auto absolute top-4 right-4 z-10">
        <div className="flex flex-col-reverse items-end gap-2 lg:flex-row lg:items-center">
          <ToolbarActions actions={actions} state={state} workflowId={workflowId} />
          <div className="flex items-center gap-2">
            <Button
              className="border hover:bg-black/5 dark:hover:bg-white/5"
              onClick={() => state.router.push('/agent-lab')}
              size="sm"
              title="Open the Agent Lab — configure & evaluate an agent"
              variant="secondary"
            >
              <Bot className="size-4" />
              <span className="hidden lg:inline">Agent Lab</span>
            </Button>
            {!workflowId && (
              <>
                <GitHubStarsButton />
                <DeployButton />
              </>
            )}
            {workflowId && !state.isOwner && !state.isLocal && (
              <DuplicateButton
                isDuplicating={state.isDuplicating}
                onDuplicate={actions.handleDuplicate}
              />
            )}
            {!state.isLocal && <UserMenu />}
          </div>
        </div>
      </div>
    </>
  );
};
