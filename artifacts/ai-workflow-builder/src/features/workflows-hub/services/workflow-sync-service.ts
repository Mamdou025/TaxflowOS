import type { WorkflowLibrary } from '@workspace/workflow-contracts/library-types';
import { validateWorkflowLibrary } from '@workspace/workflow-contracts/library';
import {
  RecoveryCodeSchema,
  RevisionSchema,
  WorkflowStorageError,
  type createWorkflowStorageClient,
} from '@workspace/workflow-contracts/storage-protocol';

export const WORKSPACE_KEY = 'taxflow:workflow-workspace';
export const SYNC_META_KEY = 'taxflow:workflow-sync';
type Meta = { revision: number; dirty: boolean };
type Timer = ReturnType<typeof setTimeout> | number;
type Dependencies = {
  storage: Pick<Storage, 'getItem' | 'setItem'>;
  client: ReturnType<typeof createWorkflowStorageClient>;
  encode: (value: WorkflowLibrary) => string;
  decode: (value: string) => unknown;
  createCode: () => string;
  parseCode?: (value: string) => string;
  schedule?: (callback: () => void, delay: number) => Timer;
  cancel?: (timer: Timer) => void;
};

/** One instance owns one workspace session; React and browser globals are adapters. */
export function createWorkflowSyncService(deps: Dependencies) {
  const parseCode = deps.parseCode ?? ((value: string) => RecoveryCodeSchema.parse(value));
  const schedule = deps.schedule ?? setTimeout;
  const cancel = deps.cancel ?? clearTimeout;
  const listeners = new Set<() => void>();
  let message = 'Checking server save…';
  let timer: Timer | undefined;
  let active: Promise<void> | undefined;
  let read: (() => WorkflowLibrary) | undefined;
  let apply: ((value: WorkflowLibrary) => void) | undefined;
  let generation = 0;
  let epoch = 0;
  let loaded = false;
  let conflict = false;
  let openSequence = 0;
  let currentMeta: Meta | undefined;

  function meta(): Meta {
    if (currentMeta) return currentMeta;
    try {
      const raw: unknown = JSON.parse(deps.storage.getItem(SYNC_META_KEY) ?? 'null');
      if (
        raw &&
        typeof raw === 'object' &&
        'revision' in raw &&
        'dirty' in raw &&
        typeof raw.dirty === 'boolean'
      ) {
        const revision = RevisionSchema.parse(raw.revision);
        return (currentMeta = { revision, dirty: raw.dirty });
      }
    } catch {
      /* Missing or invalid metadata must never imply a clean save. */
    }
    return (currentMeta = { revision: 0, dirty: true });
  }
  function saveMeta(value: Meta) {
    currentMeta = value;
    try {
      deps.storage.setItem(SYNC_META_KEY, JSON.stringify(value));
    } catch {
      /* Keep the revision in memory when local storage is full. */
    }
  }
  function status(value: string) {
    message = value;
    listeners.forEach((listener) => listener());
  }
  function cancelTimer() {
    if (timer !== undefined) cancel(timer);
    timer = undefined;
  }
  function recoveryCode() {
    const stored = deps.storage.getItem(WORKSPACE_KEY);
    if (stored !== null) return parseCode(stored);
    const code = parseCode(deps.createCode());
    deps.storage.setItem(WORKSPACE_KEY, code);
    return code;
  }
  function queueSave() {
    generation++;
    saveMeta({ ...meta(), dirty: true });
    if (conflict) return;
    status('Saving changes…');
    cancelTimer();
    timer = schedule(() => void sync(), 700);
  }
  function sync(): Promise<void> {
    if (active) return active;
    if (!read || !apply || conflict) return Promise.resolve();
    const currentEpoch = epoch;
    const task = (async () => {
      try {
        const code = recoveryCode();
        if (!loaded) {
          const remote = await deps.client.read(code);
          if (epoch !== currentEpoch) return;
          const localMeta = meta();
          if (remote.payload !== null) {
            const value = validateWorkflowLibrary(deps.decode(remote.payload));
            // A dirty empty library can be an intentional deletion of all work.
            // Only a never-saved empty workspace is safe to hydrate unconditionally.
            const emptyFirstVisit = localMeta.revision === 0 && Object.keys(read!()).length === 0;
            if (!localMeta.dirty || emptyFirstVisit) {
              apply!(value);
              saveMeta({ revision: remote.revision, dirty: false });
            } else if (localMeta.revision !== remote.revision) {
              conflict = true;
              throw new Error(
                'The server has newer changes. Export your local backup, then reload the server copy.',
              );
            }
          } else saveMeta({ revision: 0, dirty: Object.keys(read!()).length > 0 });
          loaded = true;
        }
        const pending = meta();
        if (!pending.dirty) {
          status(pending.revision ? 'Saved to server' : 'Ready to save to server');
          return;
        }
        status('Saving to server…');
        const version = generation;
        const saved = await deps.client.save(code, {
          payload: deps.encode(read!()),
          revision: pending.revision,
        });
        if (epoch !== currentEpoch) return;
        saveMeta({ revision: saved.revision, dirty: version !== generation });
        status(version === generation ? 'Saved to server' : 'Saving changes…');
        if (version !== generation) timer = schedule(() => void sync(), 100);
      } catch (error) {
        if (epoch !== currentEpoch) return;
        if (error instanceof WorkflowStorageError && error.status === 409) conflict = true;
        status(
          error instanceof Error ? error.message : 'Server save failed. Retry or export a backup.',
        );
      }
    })();
    active = task.finally(() => {
      // An old request must not clear the new workspace's in-flight request.
      if (epoch === currentEpoch) active = undefined;
    });
    return active;
  }
  async function open(code: string) {
    let valid: { data: string };
    try {
      valid = { data: parseCode(code.trim()) };
    } catch {
      throw new Error(
        deps.parseCode
          ? 'Select a valid workspace.'
          : 'Enter the complete workspace recovery code.',
      );
    }
    const sequence = ++openSequence;
    const generationAtStart = generation;
    const remote = await deps.client.read(valid.data);
    if (sequence !== openSequence) return;
    if (generationAtStart !== generation)
      throw new Error(
        'Local workflows changed while opening the workspace. Export them before trying again.',
      );
    if (!remote.payload)
      throw new Error(
        'No saved workspace was found for this recovery code. Your current workflows are unchanged.',
      );
    const value = validateWorkflowLibrary(deps.decode(remote.payload));
    deps.storage.setItem(WORKSPACE_KEY, valid.data);
    epoch++;
    cancelTimer();
    active = undefined;
    saveMeta({ revision: remote.revision, dirty: false });
    conflict = false;
    loaded = true;
    apply?.(value);
    status('Saved to server');
  }
  return {
    initialize(get: () => WorkflowLibrary, set: (value: WorkflowLibrary) => void) {
      read = get;
      apply = set;
      void sync();
      return () => {
        cancelTimer();
      };
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getStatus: () => message,
    pause(reason: string) {
      conflict = true;
      cancelTimer();
      status(reason);
    },
    recoveryCode,
    queueSave,
    sync,
    open,
  };
}
