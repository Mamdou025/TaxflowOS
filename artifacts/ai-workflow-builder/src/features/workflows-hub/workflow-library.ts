import { atom } from 'jotai';
import { initializeWorkflowSync, queueWorkflowSave } from './workflow-sync';
import { sharedJSONStorage } from '@/shared/workflow-engine/shared-json';
import type { WorkflowDefinition } from "@/shared/workflow-engine/local-fiscal-workflow";
import type { LocalToolRunnerResult } from "@/shared/workflow-engine/local-tool-runner";

export type PersonalWorkflow = {
  id: string;
  templateId: string;
  draft: WorkflowDefinition;
  versions: {
    number: number;
    savedAt: string;
    definition: WorkflowDefinition;
  }[];
  runs: { version: number; at: string; result: LocalToolRunnerResult }[];
};
type Library = Record<string, PersonalWorkflow>;
const storage = sharedJSONStorage<Library>();
const STORAGE_KEY = 'taxflow:workflow-library:v1';
export function readWorkflowLibrary(): Library { return storage.getItem(STORAGE_KEY, {}); }
let currentLibrary = typeof window === 'undefined' ? {} : readWorkflowLibrary();
const localLibraryAtom = atom<Library>(currentLibrary);
type LibraryUpdate = Library | ((previous: Library) => Library) | { remoteLibrary: Library; fromServer: true };
export const workflowLibraryAtom = atom(
  get => get(localLibraryAtom),
  (get, set, update: LibraryUpdate) => {
    const remote = 'fromServer' in update && update.fromServer === true;
    const next = remote ? (update as { remoteLibrary: Library }).remoteLibrary : typeof update === 'function' ? update(get(localLibraryAtom)) : update as Library;
    currentLibrary = next;
    set(localLibraryAtom, next);
    try { storage.setItem(STORAGE_KEY, next); } catch { /* Keep the in-memory result and send it to durable server storage. */ }
    if (!remote) queueWorkflowSave();
  },
);
workflowLibraryAtom.onMount = set => {
  initializeWorkflowSync(() => currentLibrary, remoteLibrary => set({ remoteLibrary, fromServer: true }));
};
export function definitionFingerprint(definition: WorkflowDefinition) {
  return JSON.stringify({
    name: definition.name,
    blocks: definition.blocks.map(({ config, id, label, subtype, family }) => ({
      config,
      id,
      label,
      subtype,
      family,
    })),
    edges: definition.edges.map(
      ({
        id,
        sourceBlockId,
        targetBlockId,
        relationshipType,
        sourceOutputRole,
        targetInputRole,
        bindingStatus,
        status,
      }) => ({
        id,
        sourceBlockId,
        targetBlockId,
        relationshipType,
        sourceOutputRole,
        targetInputRole,
        bindingStatus,
        status,
      }),
    ),
  });
}
export function saveVersion(entry: PersonalWorkflow): PersonalWorkflow {
  const previous = entry.versions.at(-1);
  if (
    previous &&
    definitionFingerprint(previous.definition) ===
      definitionFingerprint(entry.draft)
  )
    return entry;
  return {
    ...entry,
    versions: [
      ...entry.versions,
      {
        number: (previous?.number ?? 0) + 1,
        savedAt: new Date().toISOString(),
        definition: structuredClone(entry.draft),
      },
    ],
  };
}
