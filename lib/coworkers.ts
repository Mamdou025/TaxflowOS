// ─────────────────────────────────────────────────────────────────────────────
// Coworkers — the business-role "AI coworkers" the workspace surfaces.
//
// A Coworker is a labeled actor the user sees working: a persona agent (Sofi,
// Théo, …, derived from lib/agents.ts), the coordinating Workspace Assistant, the
// UI Concierge / Composer, or the DETERMINISTIC Workflow Engine. Every coworker
// carries an `ActorKind` so activity can be attributed truthfully — the workflow
// engine is a `workflow` actor, never mislabeled as an `agent`.
// ─────────────────────────────────────────────────────────────────────────────

import { getAgentForWorkflow, type Agent } from './agents';
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

/** The coordinator that owns the conversation and routes to specialists. */
export const WORKSPACE_ASSISTANT: Coworker = {
  kind: 'agent',
  id: 'workspace-assistant',
  name: 'Workspace Assistant',
  role: 'Coordinates your workspace',
  accent: '#3b3b46',
  initials: 'WA',
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

// ── Persona agents → coworkers ──────────────────────────────────────────────────

export function coworkerForAgent(agent: Agent): Coworker {
  return {
    kind: 'agent',
    id: agent.id,
    name: agent.name,
    role: agent.role,
    accent: agent.accent,
    initials: agent.initials,
  };
}

/** The specialist coworker that owns a workflow, if any (e.g. 'fapi' → Sofi). */
export function coworkerForWorkflow(workflowId: string): Coworker | null {
  const agent = getAgentForWorkflow(workflowId);
  return agent ? coworkerForAgent(agent) : null;
}

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
  if (!name) return WORKSPACE_ASSISTANT;
  if (name === 'generateUI') return UI_COMPOSER;
  if (name === 'runWorkflow') {
    try {
      const args = call?.arguments ? (JSON.parse(call.arguments) as { workflowId?: string }) : {};
      return (args.workflowId ? coworkerForWorkflow(args.workflowId) : null) ?? WORKFLOW_ENGINE;
    } catch {
      return WORKFLOW_ENGINE;
    }
  }
  if (UI_CONCIERGE_TOOLS.has(name)) return UI_CONCIERGE;
  return WORKSPACE_ASSISTANT;
}
