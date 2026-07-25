// ─────────────────────────────────────────────────────────────────────────────
// Assistant-runtime configuration — feature flags + model policy, in ONE place.
//
// This module is the single, server-readable source of truth for how the intent
// layer behaves. Nothing here reaches into React/jotai; it only reads env once so
// the whole runtime can be re-tuned (or fully disabled) without touching agent,
// route, or UI code. Import from server code only.
//
// The central knob is the INTENT GATE mode:
//   'off'      → the gate is inert; the chat behaves exactly as before this feature.
//   'shadow'   → the gate classifies every user turn and logs its decision, but does
//                NOT change which tools the model sees (safe to run in production to
//                collect routing accuracy before enforcing).
//   'enforce'  → the gate additionally scopes the tool set / adds a routing directive
//                so a workflow MENTION can no longer trigger a run and an explicit
//                command is reliably caught. Always fail-open: any error → no change.
// ─────────────────────────────────────────────────────────────────────────────

export type IntentGateMode = 'off' | 'shadow' | 'enforce';

/** Reasoning effort tiers we may request from the model provider. */
export type ReasoningEffort = 'minimal' | 'low' | 'medium' | 'high';

export type ModelTier = {
  /** Env-overridable model id. */
  model: string;
  reasoning: ReasoningEffort;
};

export type AssistantRuntimeConfig = {
  /** How aggressively the intent gate acts on each user turn. */
  intentGate: IntentGateMode;
  /** Whether the enforced gate may append a short routing directive to the user turn. */
  intentDirectives: boolean;
  /** Whether the per-turn model tier is chosen from the route (default on; no-op until distinct models are set). */
  modelTiering: boolean;
  /** Whether the assistant wears a domain-specialist "hat" per turn (default on). */
  specialists: boolean;
  /** Whether to send providerOptions.reasoningEffort for the deep tier (default off — depends on the model supporting it). */
  reasoningEnabled: boolean;
  /** Model used by the (optional, out-of-hot-path) structured intent router. */
  router: ModelTier;
  /** The conductor/chat model. Mirrors the value the CopilotKit route already reads. Also the tier baseline. */
  conductor: ModelTier;
  /** Fast/cheap model for simple navigation turns. */
  fast: ModelTier;
  /** Deeper-reasoning model for hard tax/analysis turns. */
  deep: ModelTier;
};

function readGateMode(): IntentGateMode {
  const raw = (process.env.ASSISTANT_INTENT_GATE ?? '').trim().toLowerCase();
  if (raw === 'off' || raw === 'shadow' || raw === 'enforce') return raw;
  // Default: enforce. The gate is surgical and fail-open, so the safe default is the
  // one that actually fixes the reported behavior. Set ASSISTANT_INTENT_GATE=off to
  // revert to the pre-feature chat with zero code changes.
  return 'enforce';
}

function readReasoning(envKey: string, fallback: ReasoningEffort): ReasoningEffort {
  const raw = (process.env[envKey] ?? '').trim().toLowerCase();
  if (raw === 'minimal' || raw === 'low' || raw === 'medium' || raw === 'high') return raw;
  return fallback;
}

/**
 * Resolve the full runtime config from env. Cheap and pure — safe to call per request.
 * (Env is read live rather than cached so a flag flip in dev takes effect on reload.)
 */
export function getAssistantRuntimeConfig(): AssistantRuntimeConfig {
  // The chat baseline model — the same value the CopilotKit route already uses.
  const chatModel = process.env.OPENAI_CHAT_MODEL ?? 'gpt-4o';
  return {
    intentGate: readGateMode(),
    intentDirectives: (process.env.ASSISTANT_INTENT_DIRECTIVES ?? '').trim().toLowerCase() !== 'off',
    // Default ON, but a no-op until FAST/DEEP are set to models distinct from the chat model.
    modelTiering: (process.env.ASSISTANT_MODEL_TIERING ?? '').trim().toLowerCase() !== 'off',
    specialists: (process.env.ASSISTANT_SPECIALISTS ?? '').trim().toLowerCase() !== 'off',
    // Off by default: reasoningEffort only applies to reasoning-capable models.
    reasoningEnabled: (process.env.ASSISTANT_REASONING_ENABLED ?? '').trim().toLowerCase() === 'on',
    router: {
      // The optional structured router prefers accuracy; use the fast chat model by default.
      model: process.env.ASSISTANT_MODEL_ROUTER ?? chatModel,
      reasoning: readReasoning('ASSISTANT_REASONING_ROUTER', 'low'),
    },
    conductor: {
      model: chatModel,
      reasoning: readReasoning('ASSISTANT_REASONING_CONDUCTOR', 'medium'),
    },
    fast: {
      // Simple navigation turns. Defaults to the chat model (→ no change) until set.
      model: process.env.ASSISTANT_MODEL_FAST ?? chatModel,
      reasoning: readReasoning('ASSISTANT_REASONING_FAST', 'low'),
    },
    deep: {
      // Hard tax/analysis turns. Defaults to the chat model (→ no change) until set.
      model: process.env.ASSISTANT_MODEL_DEEP ?? chatModel,
      reasoning: readReasoning('ASSISTANT_REASONING_DEEP', 'high'),
    },
  };
}

/** True when the gate should compute a decision at all (shadow or enforce). */
export function intentGateActive(mode: IntentGateMode): boolean {
  return mode === 'shadow' || mode === 'enforce';
}
