// ─────────────────────────────────────────────────────────────────────────────
// Kernel · Artifact (durable, promotable generated UI)
//
// Net-new — there is no existing shape to extend (today's genui output lives only in
// component useState). An Artifact captures a generated view / workpaper, binds it to
// the run + scope that produced it, and versions it. The layout NEVER owns values — it
// binds to canonical workflow results (kernel-migration-spec §7).
//
// Promotion path is small: capture the OpenUI-Lang string genui-render already holds as
// `body.content`, bind it, persist, and register it as a Surface (./surface).
// ─────────────────────────────────────────────────────────────────────────────

import type { Actor, Scope } from './scope';

export type ArtifactKind = 'workpaper' | 'review-pack' | 'generated-view';

export type ArtifactFormat = 'openui-lang' | 'react-native-surface' | 'data';

export type ArtifactBody = {
  format: ArtifactFormat;
  content: string;
};

/** Binds an artifact field to a canonical result — layout binds to values, never owns them. */
export type DataBinding = {
  /** Field/slot in the artifact body. */
  target: string;
  /** Source of the value: a run's node output, an evidence ref, or a scope figure. */
  source: { runId?: string; nodeId?: string; evidenceId?: string; key: string };
};

export type Artifact = {
  id: string;
  version: number;
  kind: ArtifactKind;
  scope: Scope;
  /** The run that produced it, if any. */
  runId?: string;
  body: ArtifactBody;
  bindings: DataBinding[];
  createdBy: Actor;
  createdAt: string;
};
