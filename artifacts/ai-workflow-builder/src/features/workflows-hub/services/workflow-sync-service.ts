import type { WorkflowLibrary } from '@workspace/workflow-contracts/library-types';
import { validateWorkflowLibrary } from '@workspace/workflow-contracts/library';
import { deleteUnusedWorkflowDrafts } from '@workspace/workflow-core/commands';
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

// Compare decoded JSON without constructing another potentially large backup string.
function sameData(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;
  if (!left || !right || typeof left !== 'object' || typeof right !== 'object') return false;
  if (left instanceof Date || right instanceof Date)
    return left instanceof Date && right instanceof Date && left.getTime() === right.getTime();
  if (Array.isArray(left) !== Array.isArray(right)) return false;
  const a = left as Record<string, unknown>;
  const b = right as Record<string, unknown>;
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every((key) => Object.hasOwn(b, key) && sameData(a[key], b[key]));
}

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
  let deleting = false;
  let deletionSequence = 0;

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
    if (conflict || deleting) return;
    status('Saving changes…');
    cancelTimer();
    timer = schedule(() => void sync(), 700);
  }
  function sync(): Promise<void> {
    if (active) return active;
    if (!read || !apply || conflict || deleting) return Promise.resolve();
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
    if (deleting) throw new Error('Wait for the selected draft removal before opening another workspace.');
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

  async function deleteUnusedDrafts(ids: readonly string[]) {
    if (!read || !apply) throw new Error('Open the workspace before removing drafts.');
    if (deleting) throw new Error('A draft removal is already in progress.');
    const selected = [...ids];
    deleteUnusedWorkflowDrafts(read(), selected);
    const originals = new Map(selected.map((id) => [id, structuredClone(read!()[id])]));
    const sequence = ++deletionSequence;
    const currentEpoch = epoch;
    const code = recoveryCode();
    const check = () => {
      if (sequence !== deletionSequence || epoch !== currentEpoch || recoveryCode() !== code)
        throw new Error('The workspace changed. No local drafts were removed.');
      for (const id of selected)
        if (!sameData(read!()[id], originals.get(id)))
          throw new Error('A selected draft changed. No local drafts were removed.');
      deleteUnusedWorkflowDrafts(read!(), selected);
    };
    deleting = true;
    ++openSequence;
    cancelTimer();
    let committed = false;
    try {
      // A previous full-library save must settle before taking the server revision.
      await active;
      check();
      status('Removing selected unused drafts…');
      const remote = await deps.client.read(code);
      check();
      const remoteLibrary = remote.payload === null ? {} : validateWorkflowLibrary(deps.decode(remote.payload));
      const present = selected.filter((id) => Object.hasOwn(remoteLibrary, id));
      const remainingRemote = present.length ? deleteUnusedWorkflowDrafts(remoteLibrary, present) : remoteLibrary;
      const saved = await deps.client.save(code, {
        payload: deps.encode(remainingRemote),
        revision: remote.revision,
      });
      committed = true;
      check();
      const remainingLocal = deleteUnusedWorkflowDrafts(read(), selected);
      const dirty = !sameData(remainingLocal, remainingRemote);
      apply(remainingLocal);
      generation++;
      loaded = true;
      conflict = false;
      saveMeta({ revision: saved.revision, dirty });
      status(dirty ? 'Selected drafts removed. Other local changes still need saving.' : 'Saved to server');
      return { removedIds: selected, dirty };
    } catch (error) {
      if (sequence === deletionSequence && epoch === currentEpoch) {
        if (committed || (error instanceof WorkflowStorageError && error.status === 409)) {
          conflict = true;
          saveMeta({ ...meta(), dirty: true });
        }
        status(committed
          ? 'Server draft removal completed, but local work changed. Local data was kept. Export it before reloading the server copy.'
          : error instanceof Error ? error.message : 'Draft removal failed. Local data was kept.');
      }
      throw error;
    } finally {
      deleting = false;
      cancelTimer();
    }
  }
  return {
    initialize(get: () => WorkflowLibrary, set: (value: WorkflowLibrary) => void) {
      read = get;
      apply = set;
      void sync();
      return () => {
        deletionSequence++;
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
    deleteUnusedDrafts,
  };
}
