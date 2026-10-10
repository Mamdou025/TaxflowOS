import { useEffect, useRef, useState, type RefObject } from 'react';
import type { HostBridge } from './host-bridge';
import type { WorkflowView } from './view-contract';
import { changeReviewSchema, type ChangeReview, type WorkflowChange } from './workbench-contract';

export function useWorkflowActions(
  view: WorkflowView | null,
  bridge: RefObject<HostBridge | null>,
) {
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [review, setReview] = useState<ChangeReview | null>(null);
  const [reviewChange, setReviewChange] = useState<WorkflowChange | null>(null);
  const [applied, setApplied] = useState<{ blockId: string; revision: number } | null>(null);
  const current = useRef(view);
  current.current = view;
  const retryIds = useRef(new Map<string, string>());
  const sequence = useRef(0);
  const pending = useRef(false);
  useEffect(() => {
    sequence.current++;
    pending.current = false;
    setBusy('');
    if (
      review &&
      (!view ||
        review.workflowId !== view.workflowId ||
        review.runId !== view.runId ||
        review.revision !== view.inspection?.revision ||
        review.libraryRevision !== view.libraryRevision)
    ) {
      setReview(null);
      setReviewChange(null);
    }
  }, [view]);
  const eligible =
    !view?.pendingReceipt &&
    !!view?.runId &&
    view.inspection?.kind === 'session' &&
    view.inspection.paused === true &&
    !view.inspection.endedAt;
  const revisionArgs = (snapshot: WorkflowView) => {
    if (
      snapshot.libraryRevision === undefined ||
      snapshot.inspection?.revision === undefined ||
      !snapshot.runId
    )
      throw new Error('This snapshot has no editable run revision. Refresh or start work first.');
    return {
      workflowId: snapshot.workflowId,
      runId: snapshot.runId,
      expectedRevision: snapshot.inspection.revision,
      expectedLibraryRevision: snapshot.libraryRevision,
    };
  };
  const run = async (
    label: string,
    work: (snapshot: WorkflowView, connection: HostBridge) => Promise<void>,
  ) => {
    if (!view || !bridge.current || pending.current) return;
    pending.current = true;
    const snapshot = view;
    const ticket = ++sequence.current;
    setBusy(label);
    setError('');
    setNotice('');
    try {
      await work(snapshot, bridge.current);
    } catch (cause) {
      if (current.current === snapshot)
        setError(
          cause instanceof Error ? cause.message : 'The operation failed. Refresh before retrying.',
        );
    } finally {
      if (sequence.current === ticket) {
        pending.current = false;
        setBusy('');
      }
    }
  };
  const requestId = (key: string) => {
    const value = retryIds.current.get(key) ?? crypto.randomUUID();
    retryIds.current.set(key, value);
    return value;
  };
  return {
    busy,
    error,
    notice,
    review,
    reviewBlockId: reviewChange?.blockId,
    applied,
    eligible,
    clearReview() {
      setReview(null);
      setReviewChange(null);
      setError('');
    },
    async preview(change: WorkflowChange) {
      await run('Reviewing change…', async (snapshot, connection) => {
        if (!snapshot.capabilities.write || !eligible)
          throw new Error('Editing requires a paused, active run and write access.');
        const args = revisionArgs(snapshot);
        const next = changeReviewSchema.parse(
          await connection.request(snapshot, 'preview_workflow_change', { ...args, change }),
        );
        if (
          next.workflowId !== snapshot.workflowId ||
          next.runId !== snapshot.runId ||
          next.revision !== args.expectedRevision ||
          next.libraryRevision !== args.expectedLibraryRevision ||
          next.affectedBlockIds.some(
            (id) => !snapshot.definition.blocks.some((block) => block.id === id),
          )
        )
          throw new Error(
            'The change review does not match this exact work. Refresh and review again.',
          );
        setReview(next);
        setReviewChange(change);
      });
    },
    async apply() {
      await run('Applying reviewed change…', async (snapshot, connection) => {
        if (!review || !reviewChange || !snapshot.capabilities.write || !eligible)
          throw new Error('Review the change before applying it.');
        if (Date.parse(review.expiresAt) <= Date.now())
          throw new Error('This review expired. Review the change again.');
        const next = await connection.command(snapshot, 'apply_workflow_change', {
          reviewToken: review.reviewToken,
        });
        if (reviewChange.kind === 'inputs')
          setApplied({
            blockId: reviewChange.blockId,
            revision: next.pendingReceipt?.revision ?? next.inspection!.revision!,
          });
        setReview(null);
        setReviewChange(null);
        setNotice(
          next.pendingReceipt
            ? 'Change saved. Refresh the same run to see its current inputs before making further changes.'
            : 'Change saved. Affected existing results are outdated. Recalculate separately when ready.',
        );
      });
    },
    async start() {
      await run('Starting work…', async (snapshot, connection) => {
        if (
          !snapshot.capabilities.write ||
          snapshot.runId ||
          snapshot.libraryRevision === undefined
        )
          throw new Error('Start work requires write access and an exact saved version.');
        const next = await connection.command(
          snapshot,
          'start_workflow_session',
          {
            workflowId: snapshot.workflowId,
            version: snapshot.version,
            expectedLibraryRevision: snapshot.libraryRevision,
            requestId: requestId(
              `start:${snapshot.workspace.id}:${snapshot.workflowId}:${snapshot.version}:${snapshot.libraryRevision}`,
            ),
          },
          true,
        );
        setNotice(
          next.pendingReceipt
            ? 'Work started and was saved. Refresh to load this same run; do not start another.'
            : 'Work started in this panel. No calculations have run.',
        );
      });
    },
    async recalculate() {
      await run('Recalculating saved inputs…', async (snapshot, connection) => {
        if (!snapshot.capabilities.execute || !eligible || review)
          throw new Error(
            'Recalculation requires execute access, a paused active run and no pending review.',
          );
        const args = revisionArgs(snapshot);
        const next = await connection.command(snapshot, 'recalculate_workflow_session', {
          ...args,
          requestId: requestId(
            `recalculate:${snapshot.workspace.id}:${snapshot.workflowId}:${snapshot.runId}:${args.expectedRevision}:${args.expectedLibraryRevision}`,
          ),
        });
        setNotice(
          next.pendingReceipt
            ? 'Recalculation response saved. Refresh this run before using its results.'
            : `Recalculation response saved. ${next.operationReceipt?.stopReason ? `Stopped: ${next.operationReceipt.stopReason}. ` : ''}Check recorded step results and remaining requirements.`,
        );
      });
    },
  };
}
export type WorkflowActions = ReturnType<typeof useWorkflowActions>;
