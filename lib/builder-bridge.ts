import { atom } from 'jotai';

// Bridge between the (huge, monolithic) WorkflowToolbar and the inline builder's
// page-menu header. When the builder is embedded in the Scope panel, the floating
// toolbar rail is hidden and its actions are published here so BuilderPageMenu can
// drive Save / Run / Undo / Redo from the shared header. Functions read the LATEST
// handlers via the toolbar's ref, so no stale nodes/edges.

export type BuilderBridge = {
  save: () => void;
  run: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isExecuting: boolean;
  isSaving: boolean;
  hasUnsaved: boolean;
};

export const builderBridgeAtom = atom<BuilderBridge | null>(null);

/** True while the builder is rendered inline (Scope panel) → hide the floating rail. */
export const builderEmbeddedAtom = atom(false);
