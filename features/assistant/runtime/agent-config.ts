// ─────────────────────────────────────────────────────────────────────────────
// Live-agent config seam — the configurable bits of the ONE live agent (Sina).
//
// This is what the Agent page's "Build" tab edits (Phase 4) and what the live chat
// reads. Persisted client-side (localStorage via jotai). Two levers take effect
// immediately, client-side, with ZERO server risk:
//   • fiscalMode + fiscal → prepend the fiscalist non-negotiables to the system prompt
//     (graduates the Agent Lab's guardrails into the live Sina)
//   • extraInstructions   → operator additions appended to the system prompt
//
// modelSpec + effort are stored + surfaced (Overview/Build) but NOT yet wired to drive
// the live model — that needs a verified CopilotKit client→forwardedProps path (the
// route's BuiltInAgent already accepts `forwardedProps.model`/`providerOptions`); doing
// it wrong risks the production model resolution, so it's a deliberate follow-up.
// ─────────────────────────────────────────────────────────────────────────────

import { atomWithStorage } from 'jotai/utils';
import { DEFAULT_FISCAL_CONTEXT, fiscalPreamble, type FiscalContext } from '@/features/agent-lab/fiscal';
import type { EffortLevel } from '@/features/agent-lab/model-router';

export type LiveAgentConfig = {
  /** Enforce the fiscalist non-negotiables (cite · no self-computed figures · pin · defer). */
  fiscalMode: boolean;
  fiscal: FiscalContext;
  /** Operator additions appended to the system prompt. */
  extraInstructions: string;
  /** Provider-prefixed model spec, or '' to use the app default (OPENAI_CHAT_MODEL). Stored; not yet driving the live model. */
  modelSpec: string;
  /** Anthropic thinking-depth dial, or 'auto'. Stored; applies only once model override lands. */
  effort: EffortLevel | 'auto';
};

export const DEFAULT_LIVE_AGENT_CONFIG: LiveAgentConfig = {
  fiscalMode: false,
  fiscal: DEFAULT_FISCAL_CONTEXT,
  extraInstructions: '',
  modelSpec: '',
  effort: 'auto',
};

/** Persisted live-agent config. The Build tab writes it; the live chat reads it. */
export const agentConfigAtom = atomWithStorage<LiveAgentConfig>('sina-agent-config', DEFAULT_LIVE_AGENT_CONFIG);

/**
 * Layer the config over the base system prompt: base identity first, then the fiscal
 * guardrails (when on), then operator additions. Pure — safe to call every render.
 */
export function applyLiveConfig(baseInstructions: string, config: LiveAgentConfig): string {
  const extra = config.extraInstructions.trim();
  return [
    baseInstructions,
    config.fiscalMode ? fiscalPreamble(config.fiscal) : '',
    extra ? `## Additional operator instructions\n${extra}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');
}
