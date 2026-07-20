// ─────────────────────────────────────────────────────────────────────────────
// Kernel · Surface (the unified page-adapter contract)
//
// Unifies the three registries that exist today — `resource-registry.tsx` +
// `page-chat-store.ts` + `page-menu-store.ts` — into one page-adapter, adding the four
// facets they lack: scope, selection, resources, permissions
// (kernel-migration-spec §6). Types only; the actual merge is migration Step 5.
//
// Three UI kinds stay explicit: native surface (durable app page), artifact surface
// (versioned, run-bound — see ./artifact), quick UI (ephemeral unless promoted).
// ─────────────────────────────────────────────────────────────────────────────

import type { Scope } from './scope';

export type SurfaceKind = 'native' | 'artifact' | 'quick-ui';

/** A deep-link / focus target within a surface (was: resource-registry anchors). */
export type Anchor = {
  id: string;
  label: string;
};

/** A named command a page publishes for the assistant to run (was: PageChatSurface.commands). */
export type SurfaceCommand = {
  id: string;
  label: string;
  /** Capability id the command dispatches through the gateway. */
  capabilityId?: string;
};

/** A lightweight reference the assistant may inspect (NOT full page state). */
export type ResourceRef = {
  id: string;
  kind: string;
  label: string;
};

/** What the assistant can see and act on for one page/surface. */
export type Surface = {
  pageKey: string;
  title: string;
  kind: SurfaceKind;
  scope: Scope; // MISSING today
  selection?: { id: string; kind: string }; // MISSING today — "the thing clicked"
  resources: ResourceRef[];
  commands: SurfaceCommand[];
  anchors: Anchor[];
  permissions: string[]; // MISSING today
  /** For artifact/quick-ui surfaces: the artifact id backing this surface. */
  artifactId?: string;
};
