import { App } from '@modelcontextprotocol/ext-apps';
import {
  parseWorkflowView,
  sameViewIdentity,
  selectionContext,
  type WorkflowView,
} from './view-contract';
import {
  accessRejected,
  operationReceipt,
  parseToolData,
  type ViewerFocus,
} from './workbench-contract';

type Observer = {
  view: (view: WorkflowView | null) => void;
  connected: () => void;
  error: (message: string) => void;
};

/** All reads pass through the host and the same authenticated MCP tools. */
export function createHostBridge(observer: Observer) {
  const app = new App({ name: 'InScope workflow viewer', version: '0.2.0' }, {});
  let closed = false;
  let current: WorkflowView | null = null;
  let epoch = 0;
  let refreshSequence = 0;
  let contextSequence = 0;
  let contextQueue = Promise.resolve();
  const reportError = (message: string) => {
    if (!closed) observer.error(message);
  };

  // Serialize context writes: an old in-flight selection cannot overwrite a later clear.
  function context(text: string) {
    const sequence = ++contextSequence;
    const update = contextQueue
      .catch(() => {})
      .then(async () => {
        if (closed || sequence !== contextSequence) return false;
        await app.updateModelContext({ content: [{ type: 'text', text }] });
        return !closed && sequence === contextSequence;
      });
    contextQueue = update.then(
      () => {},
      () => {},
    );
    return update;
  }
  function unavailable(message: string) {
    current = null;
    epoch++;
    observer.view(null);
    reportError(message);
    void context(
      'InScope viewer unavailable. No workflow or block is currently selected. Retrieve the exact requested workflow again before reasoning about it.',
    ).catch(() =>
      reportError(
        'The workflow is unavailable and its context could not be cleared. Reconnect and reopen it from chat.',
      ),
    );
  }
  function publish(view: WorkflowView) {
    current = view;
    observer.view(view);
    if (!view.definition.blocks.length)
      void context(
        JSON.stringify({
          workspaceId: view.workspace.id,
          workflowId: view.workflowId,
          version: view.version,
          runId: view.runId ?? null,
          selectedBlockId: null,
          capturedAt: view.capturedAt,
          readOnly: true,
          message: 'This saved workflow has no blocks. No block is currently selected.',
        }),
      ).catch(() =>
        reportError('The empty workflow context could not be shared. Request it again in chat.'),
      );
  }
  app.ontoolresult = (result) => {
    if (closed) return;
    epoch++;
    try {
      publish(parseWorkflowView(result));
    } catch {
      unavailable(
        'This workflow response is unavailable or invalid. Request the exact version or run again in chat.',
      );
    }
  };
  app.onerror = () => {
    if (!closed)
      unavailable('The connection to ChatGPT was interrupted. Reconnect and reopen this workflow.');
  };
  app.onhostcontextchanged = ({ theme }) => {
    if (theme) document.documentElement.classList.toggle('dark', theme === 'dark');
  };
  async function request(view: WorkflowView, name: string, args: Record<string, unknown>) {
    if (closed || current !== view)
      throw new Error('The displayed work changed. Refresh before continuing.');
    if (view.pendingReceipt)
      throw new Error('The operation was saved. Refresh the same run before continuing.');
    const requestEpoch = epoch;
    const result = await app.callServerTool({ name, arguments: args }, { timeout: 120000 });
    if (closed || requestEpoch !== epoch || current !== view)
      throw new Error('A newer workflow is open. This response was not applied to its panel.');
    if (accessRejected(result))
      unavailable(
        'Access to this work was rejected. Reconnect and reopen the exact run before continuing.',
      );
    parseToolData(result);
    return result;
  }
  return {
    async connect() {
      if (window.parent === window) {
        reportError(
          'Open this viewer from an InScope tool in ChatGPT. A connected host is required.',
        );
        return;
      }
      try {
        await app.connect(undefined, { timeout: 15000 });
        if (closed) return;
        document.documentElement.classList.toggle('dark', app.getHostContext()?.theme === 'dark');
        observer.connected();
      } catch {
        reportError('The viewer could not connect to ChatGPT. Reopen the workflow from chat.');
      }
    },
    async shareSelection(view: WorkflowView, blockId: string, focus?: ViewerFocus) {
      if (current !== view) return;
      await context(JSON.stringify(selectionContext(view, blockId, focus)));
    },
    async request(view: WorkflowView, name: string, args: Record<string, unknown>) {
      return parseToolData(await request(view, name, args));
    },
    async command(
      view: WorkflowView,
      name: string,
      args: Record<string, unknown>,
      startsRun = false,
    ) {
      const result = await request(view, name, args);
      try {
        const receipt = operationReceipt(result);
        if (
          receipt &&
          (receipt.workflowId !== view.workflowId ||
            receipt.version !== view.version ||
            (!startsRun && receipt.runId !== view.runId) ||
            receipt.revision < (view.inspection?.revision ?? 0) ||
            receipt.libraryRevision < (view.libraryRevision ?? 0))
        )
          throw new Error('The operation receipt does not match this work.');
        if (parseToolData(result).snapshotUnavailable === true) {
          if (!receipt) throw new Error('No verified saved receipt was supplied.');
          const pending = {
            ...view,
            capabilities: { write: false, execute: false },
            pendingReceipt: receipt,
          };
          epoch++;
          publish(pending);
          return pending;
        }
        const next = parseWorkflowView(result);
        const matches = startsRun
          ? next.workspace.id === view.workspace.id &&
            next.workflowId === view.workflowId &&
            next.version === view.version &&
            next.kind === 'workflow-run'
          : sameViewIdentity(next, view);
        if (
          !matches ||
          (receipt &&
            (next.runId !== receipt.runId ||
              (next.inspection?.revision ?? -1) < receipt.revision ||
              (next.libraryRevision ?? -1) < receipt.libraryRevision)) ||
          (view.inspection?.revision !== undefined &&
            (next.inspection?.revision === undefined ||
              next.inspection.revision < view.inspection.revision))
        )
          throw new Error('The operation returned a different workflow or an older revision.');
        epoch++;
        next.operationReceipt = receipt;
        publish(next);
        return next;
      } catch {
        unavailable(
          'The operation result could not be verified. Reopen this exact work before continuing.',
        );
        throw new Error(
          'The operation result could not be verified. It may have been saved; read the current work before retrying.',
        );
      }
    },
    async explain(view: WorkflowView, blockId: string, focus?: ViewerFocus) {
      if (current !== view) return;
      const selected = selectionContext(view, blockId, focus);
      const shared = await context(JSON.stringify(selected));
      if (!shared || current !== view || closed) return;
      const response = await app.sendMessage({
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Explain the selected InScope block using this exact saved context and its recorded evidence. Do not run or change it or open another viewer. ${JSON.stringify(selected)}`,
          },
        ],
      });
      if (response.isError) throw new Error('The host rejected the explanation request.');
    },
    async refresh(view: WorkflowView, blockId?: string) {
      const requestEpoch = epoch;
      const sequence = ++refreshSequence;
      const runId = view.pendingReceipt?.runId ?? view.runId;
      try {
        const result = await app.callServerTool(
          {
            name: runId ? 'inspect_workflow_run' : 'get_workflow_version',
            arguments: {
              workflowId: view.workflowId,
              ...(runId ? { runId } : { version: view.version }),
              ...(blockId ? { blockId } : {}),
            },
          },
          { timeout: 20000 },
        );
        if (
          closed ||
          requestEpoch !== epoch ||
          sequence !== refreshSequence ||
          !current ||
          !sameViewIdentity(current, view)
        )
          return;
        const next = parseWorkflowView(result);
        const previousRevision =
          view.pendingReceipt?.revision ?? view.inspection?.revision ?? view.revision;
        const nextRevision = next.inspection?.revision ?? next.revision;
        if (
          !(view.pendingReceipt
            ? next.workspace.id === view.workspace.id &&
              next.workflowId === view.workflowId &&
              next.version === view.version &&
              next.runId === runId &&
              next.kind === 'workflow-run'
            : sameViewIdentity(next, view)) ||
          (view.pendingReceipt &&
            (next.libraryRevision ?? -1) < view.pendingReceipt.libraryRevision) ||
          (previousRevision !== undefined &&
            (nextRevision === undefined || nextRevision < previousRevision))
        )
          throw new Error('The refreshed snapshot does not match the requested identity/revision.');
        epoch++;
        publish(next);
      } catch {
        if (closed || requestEpoch !== epoch || sequence !== refreshSequence) return;
        unavailable(
          `Refresh could not verify this exact workflow. Its previous snapshot was cleared. Reconnect if needed and reopen ${runId ? `run ${runId}` : 'the exact version'} from chat.`,
        );
      }
    },
    async expand() {
      const response = await app.requestDisplayMode({ mode: 'fullscreen' });
      if (response.mode !== 'fullscreen') throw new Error('The host retained the current view.');
    },
    close() {
      closed = true;
      epoch++;
      contextSequence++;
      void app.close();
    },
  };
}

export type HostBridge = ReturnType<typeof createHostBridge>;
