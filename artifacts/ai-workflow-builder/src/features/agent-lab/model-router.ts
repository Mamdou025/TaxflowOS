// ─────────────────────────────────────────────────────────────────────────────
// Agent Lab — MODEL ROUTER (client-safe: pure logic, no secrets, no server imports).
//
// One place that decides, per selected model, WHICH provider knobs to send. The
// Agent Lab lets you pick any model; different families want different treatment:
//
//   • effort — Anthropic's thinking-depth dial (low → max). The main quality/cost
//     lever. NOT every model accepts it: Haiku 4.5 and Sonnet 4.5 error if it's sent.
//   • prompt caching — cache the big system/doc block so repeated runs read it at
//     ~10% of input price instead of paying full price every turn. The single biggest
//     token-cost lever for a "read the same statute repeatedly" workload.
//   • temperature safety — the 5-era / 4.7+ Anthropic family (Opus 4.7/4.8, Sonnet 5,
//     Fable 5) REJECTS a non-default temperature with a 400. The router tells the
//     runtime not to send it, so picking Opus/Sonnet no longer breaks the call.
//
// Everything here maps onto @ai-sdk/anthropic provider options, forwarded through the
// Vercel AI Gateway (providerOptions.anthropic.{effort,cacheControl,…}).
// ─────────────────────────────────────────────────────────────────────────────

export type EffortLevel = 'low' | 'medium' | 'high' | 'xhigh' | 'max';
export const EFFORT_LEVELS: EffortLevel[] = ['low', 'medium', 'high', 'xhigh', 'max'];

export type ModelProvider = 'anthropic' | 'openai' | 'gateway-other';

// JSON-compatible shape — structurally matches the AI SDK's ProviderOptions value type,
// so the plan can be spread straight into generateText without a cast or an `ai` import.
type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export type RouterPlan = {
  provider: ModelProvider;
  /** false → the runtime must NOT send `temperature` (this model rejects non-default sampling). */
  sendTemperature: boolean;
  /** Whether this model accepts the `effort` dial at all (Haiku 4.5 / Sonnet 4.5 do not). */
  supportsEffort: boolean;
  /** The effort actually applied this turn (undefined = model default, or unsupported). */
  effort?: EffortLevel;
  /**
   * Cache the large static prefix (tools + system + attached documents) via Anthropic prompt
   * caching, so repeat turns over the same documents read that block at ~10% input price.
   * True for Anthropic (which needs an explicit cache breakpoint); false elsewhere. AI SDK v6+
   * forbids a system-role MESSAGE — the old breakpoint site — so the runtime attaches the
   * breakpoint to a MESSAGE PART instead (the documents on the first user message). Other
   * providers don't need this: OpenAI auto-caches long prefixes. See agent.ts `cacheDocs`.
   */
  cachePrefix: boolean;
  /** Provider-namespaced options to pass to generateText, or undefined. */
  providerOptions?: Record<string, Record<string, JsonValue>>;
};

// Accept both gateway strings ("anthropic/claude-opus-4-8") and bare ids ("claude-…").
function anthropicModel(modelId: string): string | null {
  const id = modelId.trim().toLowerCase();
  if (id.startsWith('anthropic/')) return id.slice('anthropic/'.length);
  if (id.startsWith('claude')) return id;
  return null;
}

// The 5-era / 4.7+ family rejects a non-default temperature (and top_p/top_k) with a 400.
// Opus 4.6, Sonnet 4.6, Haiku 4.5 and older still accept sampling params.
const REJECTS_SAMPLING = /^claude-(opus-4-[78]|sonnet-5|fable-5|mythos-5)\b/;

// `effort` is supported on Opus 4.5+, Sonnet 4.6, Sonnet 5, Fable 5 — and ERRORS on
// Haiku 4.5 and Sonnet 4.5. Send it only where it's accepted.
const SUPPORTS_EFFORT = /^claude-(opus-4-[5678]|sonnet-4-6|sonnet-5|fable-5|mythos-5)\b/;

/**
 * Decide the provider knobs for one model + optional effort. Pure and deterministic:
 * the same (model, effort) always yields the same plan, so the UI can recompute it
 * for display without a round-trip.
 */
export function planForModel(modelId: string, opts?: { effort?: EffortLevel }): RouterPlan {
  const anth = anthropicModel(modelId);

  // Non-Anthropic (direct OpenAI or any other gateway provider): preserve today's behavior.
  if (!anth) {
    return {
      provider: modelId.includes('/') ? 'gateway-other' : 'openai',
      sendTemperature: true,
      supportsEffort: false,
      cachePrefix: false, // OpenAI/other: no explicit breakpoint needed (OpenAI auto-caches)
    };
  }

  const supportsEffort = SUPPORTS_EFFORT.test(anth);
  const effort = supportsEffort ? opts?.effort : undefined;

  const anthropicOpts: Record<string, JsonValue> = {};
  if (effort) {
    anthropicOpts.effort = effort;
  }
  const providerOptions =
    Object.keys(anthropicOpts).length > 0 ? { anthropic: anthropicOpts } : undefined;

  return {
    provider: 'anthropic',
    sendTemperature: !REJECTS_SAMPLING.test(anth),
    supportsEffort,
    effort,
    cachePrefix: true, // cache tools+system+docs via a message-part breakpoint (see agent.ts)
    providerOptions,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Auto-routing — "Sina picks the model". Selecting the AUTO_MODEL_ID pseudo-model
// means: don't pin a model — read the question and route to the right tier. This is
// a deterministic, transparent heuristic (no extra LLM call), so the provenance panel
// can always explain WHY a model was chosen. Tune the keyword sets below to taste;
// swap in an LLM classifier later if you want fuzzier judgement.
// ─────────────────────────────────────────────────────────────────────────────

/** The pseudo-model that means "let Sina route". AGENT_NAME is 'Sina'. */
export const AUTO_MODEL_ID = 'sina-auto';

export type TaskTier = 'quick' | 'balanced' | 'reasoning' | 'deep';

export type AutoRoute = {
  /** The concrete gateway model id Sina picked. */
  model: string;
  /** Effort Sina suggests for that model (undefined = model default / unsupported). */
  effort?: EffortLevel;
  tier: TaskTier;
  /** One-line human reason, shown in the provenance panel. */
  reason: string;
};

// Each tier → an Anthropic tier + a sensible effort. Mirrors the tax-workload advice:
// quick reads → Haiku, everyday Q&A → Sonnet, cross-references → Sonnet+high, tax logic → Opus.
const TIER_MODEL: Record<TaskTier, { model: string; effort?: EffortLevel }> = {
  quick: { model: 'anthropic/claude-haiku-4-5' }, // Haiku: fast/cheap, no effort dial
  balanced: { model: 'anthropic/claude-sonnet-5' }, // model default effort
  reasoning: { model: 'anthropic/claude-sonnet-5', effort: 'high' },
  deep: { model: 'anthropic/claude-opus-4-8', effort: 'high' },
};

// Task-shape signals. Precedence: deep(calc) → reasoning → quick(short lookup) → deep(statute) → balanced.
const CALC = /\b(calculat|comput|reconcil|elect(ed|ion)?|deduct|withhold|estimat|amortiz|how much|arm'?s.?length|capital gain|small.?business|tax owing|net amount|amount of)/i;
const REASON = /\b(compare|comparison|differ|relationship|relate|\bbetween\b|versus|\bvs\.?\b|analy|implicat|consisten|contradic|conflict|\bwhy\b|justif|connect|\blink\b|depend|impact|affect|trade.?off)/i;
const LOOKUP = /\b(extract|find|list|look ?up|search|what is|what'?s the|how many|when (is|was|did|does)|which|who is|where|name of|value of|date of|show me)/i;
const STATUTE = /\b(section|subsection|paragraph|t2057|t1134|t106|eifel|part\s?xiii|treaty|deem(ing)?|foreign accrual|\bfapi\b|rollover|roulement|surplus|\bpbr\b|\bfmv\b|\bjvm\b)/i;

/** Read a question + light context and choose a model + effort + reason. */
export function routeAuto(text: string, ctx?: { hasDocs?: boolean }): AutoRoute {
  const t = (text || '').trim();
  const short = t.length < 220;

  let tier: TaskTier;
  let reason: string;
  if (CALC.test(t)) {
    tier = 'deep';
    reason = 'tax calculation / figure work';
  } else if (REASON.test(t)) {
    tier = 'reasoning';
    reason = 'compare / find the logic between elements';
  } else if (LOOKUP.test(t) && short) {
    tier = 'quick';
    reason = ctx?.hasDocs ? 'short lookup over attached docs' : 'short factual lookup';
  } else if (STATUTE.test(t)) {
    tier = 'deep';
    reason = 'statutory / tax-law reasoning';
  } else {
    tier = 'balanced';
    reason = 'general question';
  }

  const pick = TIER_MODEL[tier];
  return { model: pick.model, effort: pick.effort, tier, reason };
}
