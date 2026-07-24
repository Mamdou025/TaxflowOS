// ─────────────────────────────────────────────────────────────────────────────
// Kernel · Scope & Actor
//
// The two smallest shared vocabularies every other kernel entity threads through:
//   • Scope  — what a run / action / artifact is bound to (client → entity → period).
//   • Actor  — who did a thing, with an audit-grade `ActorKind` taxonomy.
//
// `ActorKind` is the SINGLE source of truth for the Human/Agent/Workflow/Tool/System
// distinction (lib/coworkers.ts re-exports it for the UI layer). See
// kernel-migration-spec §6 (scope) and §8 (actor).
// ─────────────────────────────────────────────────────────────────────────────

/** Audit-grade actor taxonomy. The deterministic engine is `workflow`, never `agent`. */
export type ActorKind = 'human' | 'agent' | 'workflow' | 'tool' | 'system';

/** Who performed an action or produced an event. */
export type Actor = {
  kind: ActorKind;
  /** Stable id — agent id, workflow id, tool/capability id, or user id. */
  id: string;
  /** Optional display name (the UI layer resolves richer presentation from lib/coworkers.ts). */
  name?: string;
};

/**
 * What a run / action / artifact / surface is bound to. The key addition the current
 * app lacks — nothing today ties a page, run, or value to client/entity/period. Every
 * field is optional so a scope can be as coarse (whole client) or precise (one run) as
 * the context allows.
 */
export type Scope = {
  clientId?: string;
  entityId?: string;
  affiliateId?: string;
  period?: string;
  workflowId?: string;
  runId?: string;
};

export const EMPTY_SCOPE: Scope = {};

/** True when `outer` contains `inner` — every field set on `outer` matches `inner`. */
export function scopeContains(outer: Scope, inner: Scope): boolean {
  return (Object.keys(outer) as (keyof Scope)[]).every(
    (key) => outer[key] === undefined || outer[key] === inner[key]
  );
}

/** Merge scopes left-to-right; later, defined fields win. */
export function mergeScope(...scopes: Scope[]): Scope {
  return scopes.reduce<Scope>((acc, s) => {
    for (const key of Object.keys(s) as (keyof Scope)[]) {
      if (s[key] !== undefined) acc[key] = s[key];
    }
    return acc;
  }, {});
}
