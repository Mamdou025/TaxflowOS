// ─────────────────────────────────────────────────────────────────────────────
// Coworkers — the business-role "AI coworkers" the workspace surfaces.
//
// A Coworker is a labeled actor the user sees working: Sina (the ONE unified AI
// assistant), the UI Concierge / Composer (tool actors), or the DETERMINISTIC
// Workflow Engine. Every coworker carries an `ActorKind` so activity can be
// attributed truthfully — the workflow engine is a `workflow` actor, never
// mislabeled as an `agent`.
// ─────────────────────────────────────────────────────────────────────────────

import type { ActorKind } from '@/shared/kernel/scope';

/** The audit-grade actor taxonomy — the canonical definition lives in the kernel
 *  (lib/kernel/scope.ts); re-exported here so the UI layer shares the one vocabulary. */
export type { ActorKind };

export type Coworker = {
  kind: ActorKind;
  id: string;
  name: string;
  role: string;
  /** Avatar background (dark tones on the dark chat surface; paired with a subtle border). */
  accent: string;
  initials: string;
};

export const ACTOR_KIND_LABEL: Record<ActorKind, string> = {
  human: 'Human',
  agent: 'Agent',
  workflow: 'Workflow',
  tool: 'Tool',
  system: 'System',
};

// ── Fixed, non-persona coworkers (business roles + system actors) ───────────────

/** Coordinator actor — a legacy label kept only for truthful attribution fallbacks.
 *  User-facing replies are attributed to Sina; see coworkerForMessage below. */
export const WORKSPACE_ASSISTANT: Coworker = {
  kind: 'agent',
  id: 'workspace-assistant',
  name: 'Workspace Assistant',
  role: 'Coordinates your workspace',
  accent: '#3b3b46',
  initials: 'WA',
};

/** Sina — the ONE unified assistant (absorbed the former Sofi/Théo/Mira/Nova specialists).
 *  This is the single AI-agent face across the chat; the tool/engine actors below stay
 *  as truthful attribution (UI Composer for generated views, the deterministic engine, …). */
export const SINA: Coworker = {
  kind: 'agent',
  id: 'sina',
  name: 'Sina',
  role: 'Your tax specialist',
  accent: '#18181b',
  initials: 'Si',
};

/** The deterministic run engine — an attributed system actor, NOT an AI agent. */
export const WORKFLOW_ENGINE: Coworker = {
  kind: 'workflow',
  id: 'workflow-engine',
  name: 'Workflow Engine',
  role: 'Deterministic',
  accent: '#26382c',
  initials: 'WE',
};

/** Opens existing registered pages/components — a tool call, no LLM. */
export const UI_CONCIERGE: Coworker = {
  kind: 'tool',
  id: 'ui-concierge',
  name: 'UI Concierge',
  role: 'Opens pages & components',
  accent: '#26314d',
  initials: 'UC',
};

/** Generates new temporary interfaces (OpenUI). */
export const UI_COMPOSER: Coworker = {
  kind: 'tool',
  id: 'ui-composer',
  name: 'UI Composer',
  role: 'Generates views',
  accent: '#3a274c',
  initials: 'UX',
};

export const YOU: Coworker = {
  kind: 'human',
  id: 'you',
  name: 'You',
  role: '',
  accent: '#52525b',
  initials: 'You',
};

export const SYSTEM: Coworker = {
  kind: 'system',
  id: 'system',
  name: 'System',
  role: '',
  accent: '#3f3f46',
  initials: 'Sy',
};

/** Human-readable actor tag, e.g. "Agent", "Workflow · Deterministic". */
export function coworkerKindLabel(coworker: Coworker): string {
  const base = ACTOR_KIND_LABEL[coworker.kind];
  if (coworker.kind === 'workflow' && coworker.role) {
    return `${base} · ${coworker.role}`;
  }
  return base;
}

// Tool names the UI Concierge is responsible for (opening/summoning existing surfaces).
const UI_CONCIERGE_TOOLS = new Set([
  'openPage', 'bringIntoChat', 'showWorkflowElement', 'editField', 'focusAnchor',
  'commandPage', 'closePage', 'closeAll', 'openWorkflowBuilder',
]);

/**
 * The coworker responsible for an assistant message, inferred from its first tool call:
 * a generated view → UI Composer, a workflow run → that workflow's specialist, a
 * page/element op → UI Concierge, a plain reply (no tool) → Workspace Assistant.
 * Defensive: unknown/absent shapes and partially-streamed JSON args fall back sensibly,
 * so it never throws on a mid-stream message.
 */
export function coworkerForMessage(message: unknown): Coworker {
  const call = (
    message as { toolCalls?: Array<{ function?: { name?: string; arguments?: string } } | null | undefined> } | null | undefined
  )?.toolCalls?.[0]?.function;
  const name = call?.name;
  // One unified agent (Sina): a plain reply and a workflow proposal are both Sina; only
  // the truthful non-agent actors (generated view / page ops) get their own attribution.
  if (!name) return SINA;
  if (name === 'generateUI') return UI_COMPOSER;
  if (name === 'runWorkflow') return SINA;
  if (UI_CONCIERGE_TOOLS.has(name)) return UI_CONCIERGE;
  return SINA;
}
