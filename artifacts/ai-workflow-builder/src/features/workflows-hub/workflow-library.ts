import { workspaceStorage } from '@/platform/auth/workspace-context';
import { atom } from 'jotai';
import { initializeWorkflowSync, queueWorkflowSave, pauseWorkflowSync } from './workflow-sync';
import { parseSharedJSON, stringifySharedJSON } from '@/shared/workflow-engine/shared-json';
import { createWorkflowLibraryRepository } from './services/workflow-library-repository';

import type { PersonalWorkflow } from '@workspace/workflow-contracts/library-types';
export type { PersonalWorkflow } from '@workspace/workflow-contracts/library-types';
type Library = Record<string, PersonalWorkflow>;
const repository = createWorkflowLibraryRepository({
  storage: {
    getItem: key => typeof window === 'undefined' ? null : workspaceStorage.getItem(key),
    setItem: (key, value) => workspaceStorage.setItem(key, value),
  },
  encode: stringifySharedJSON,
  decode: parseSharedJSON,
});
export const readWorkflowLibrary = repository.read;
export const rawWorkflowBackup = repository.rawBackup;
let restoreError: string | undefined;
let currentLibrary: Library = {};
try { currentLibrary = readWorkflowLibrary(); }
catch (error) {
  restoreError = error instanceof Error ? error.message : 'The local workflow backup could not be read.';
}
const localLibraryAtom = atom<Library>(currentLibrary);
type LibraryUpdate = Library | ((previous: Library) => Library) | { remoteLibrary: Library; fromServer: true };
export const workflowLibraryAtom = atom(
  get => get(localLibraryAtom),
  (get, set, update: LibraryUpdate) => {
    const remote = 'fromServer' in update && update.fromServer === true;
    const next = remote ? (update as { remoteLibrary: Library }).remoteLibrary : typeof update === 'function' ? update(get(localLibraryAtom)) : update as Library;
    currentLibrary = next;
    set(localLibraryAtom, next);
    if (remote) restoreError = undefined;
    // Keep unreadable original bytes available for raw export until an explicit
    // restore succeeds. An empty fallback must never overwrite the only backup.
    if (!restoreError) {
      try { repository.save(next); } catch { /* Keep the in-memory result and sync it to the server. */ }
      if (!remote) queueWorkflowSave();
    }
  },
);
workflowLibraryAtom.onMount = set => {
  if (restoreError) pauseWorkflowSync(`${restoreError} Download the raw backup or open a saved workspace to recover.`);
  return initializeWorkflowSync(() => currentLibrary, remoteLibrary => set({ remoteLibrary, fromServer: true }));
};
export { definitionFingerprint, saveVersion } from './services/workflow-commands';
