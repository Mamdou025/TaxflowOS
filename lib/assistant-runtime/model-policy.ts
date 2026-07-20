// ─────────────────────────────────────────────────────────────────────────────
// Model policy — pick the per-turn model tier from the route.
//
// "Smarter answers, cheaper navigation": use a stronger model for hard tax/analysis
// questions, a fast one for pure navigation, the standard chat model otherwise. The
// decision is driven by the AssistantRoute the intent layer already computes.
//
// SAFE BY DEFAULT: every tier defaults to the chat model, so this is a NO-OP until
// ASSISTANT_MODEL_FAST / ASSISTANT_MODEL_DEEP are set to distinct models. When a tier
// equals the baseline we return modelSpec=null (no override → the base model is used).
//
// CopilotKit's BuiltInAgent override (input.forwardedProps.model) resolves a
// PROVIDER-PREFIXED string ("openai/gpt-4o", "anthropic/claude-…"), so bare ids are
// normalized here.
// ─────────────────────────────────────────────────────────────────────────────

import type { AssistantRuntimeConfig } from './config';
import type { AssistantIntent, AssistantRoute } from './routing/route-schema';

export type ModelTierName = 'fast' | 'standard' | 'deep';

export type ModelDecision = {
  tier: ModelTierName;
  /** Provider-prefixed model spec to override with, or null to keep the base model. */
  modelSpec: string | null;
  /** Optional provider options (e.g. reasoningEffort), or undefined. */
  providerOptions?: Record<string, unknown>;
};

/** Normalize a bare or already-prefixed model id to a provider-prefixed spec. */
export function normalizeModelSpec(model: string): string {
  const s = model.trim();
  if (!s) return s;
  if (s.includes('/') || s.includes(':')) return s; // already "provider/model"
  if (/^claude/i.test(s)) return `anthropic/${s}`;
  if (/^gemini/i.test(s) || s.startsWith('models/')) return `google/${s}`;
  return `openai/${s}`; // OpenAI-centric app default (gpt-*, o-series, etc.)
}

// Hard-reasoning intents get the strong model; navigation gets the fast model.
const DEEP_INTENTS = new Set<AssistantIntent>([
  'explain_workflow',
  'inspect_calculation',
  'run_calculation',
  'search_evidence',
  'answer_question',
  'modify_protected_value',
  'find_workflow',
]);

const FAST_INTENTS = new Set<AssistantIntent>([
  'open_page',
  'open_artifact',
  'edit_field',
  'general_conversation',
  'get_workflow_status',
  'cancel_pending_action',
  'approve_action',
  'reject_action',
  'create_ui_view',
]);

export function tierForRoute(route: AssistantRoute): ModelTierName {
  if (DEEP_INTENTS.has(route.intent)) return 'deep';
  if (FAST_INTENTS.has(route.intent)) return 'fast';
  return 'standard';
}

/**
 * Decide the model tier + override for a turn. Returns modelSpec=null when the chosen
 * tier resolves to the same model as the chat baseline (→ no override, zero change).
 */
export function pickModelDecision(route: AssistantRoute, config: AssistantRuntimeConfig): ModelDecision {
  const tier = tierForRoute(route);
  const chosen = tier === 'deep' ? config.deep : tier === 'fast' ? config.fast : config.conductor;

  const baseSpec = normalizeModelSpec(config.conductor.model);
  const chosenSpec = normalizeModelSpec(chosen.model);
  const modelSpec = chosenSpec === baseSpec ? null : chosenSpec;

  // Only attach reasoningEffort when explicitly enabled and we're actually overriding
  // to a (presumably reasoning-capable) deep model — otherwise leave it to the model.
  let providerOptions: Record<string, unknown> | undefined;
  if (config.reasoningEnabled && tier === 'deep' && modelSpec) {
    providerOptions = { openai: { reasoningEffort: chosen.reasoning } };
  }

  return { tier, modelSpec, providerOptions };
}
