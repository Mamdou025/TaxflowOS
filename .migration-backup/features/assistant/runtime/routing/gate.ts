// ─────────────────────────────────────────────────────────────────────────────
// The intent gate — the enforced layer wired into the CopilotKit runtime.
//
// Split into two pure functions so the analysis is decoupled from the ag-ui types
// and easy to test:
//   • computeGateDecision(input, opts) — reads the turn (messages/tools/context),
//     classifies it, and returns PRIMITIVES: which tool names to withhold and an
//     optional routing directive (+ the message index to append it to).
//   • applyGateDecision(messages, tools, decision) — applies those primitives while
//     preserving the caller's concrete element types.
//
// Both are SYNCHRONOUS (the middleware must return an Observable synchronously) and
// the decision is FAIL-OPEN: any doubt or error → withhold nothing, inject nothing,
// so the chat is never worse than before this feature.
// ─────────────────────────────────────────────────────────────────────────────

import { classifyDeterministic } from './classify';
import { applyRoutePolicy } from './route-policy';
import { deniedToolNames } from './tool-groups';
import type { AssistantRoute } from './route-schema';
import { fallbackRoute } from './route-schema';
import type { IntentGateMode } from '../config';

/** Only the fields the gate reads — structural, so it never couples to ag-ui types. */
export type GateTool = { name?: unknown };
export type GateMessage = { role?: unknown; content?: unknown };
export type GateContextItem = { value?: unknown; description?: unknown };
export type GateInput = {
  messages?: readonly GateMessage[] | null;
  tools?: readonly GateTool[] | null;
  context?: readonly GateContextItem[] | null;
};

export type GateDecision = {
  route: AssistantRoute;
  mode: IntentGateMode;
  /** Tool names to withhold this turn (empty when none). */
  withheldToolNames: string[];
  /** Routing directive to append to the current user turn, or null. */
  directive: string | null;
  /** Index into messages of the user turn to append the directive to, or null. */
  directiveIndex: number | null;
};

/** Below this confidence the gate never restricts — it fails open to current behavior. */
const RESTRICT_MIN_CONFIDENCE = 0.7;

const DIRECTIVE_TAG = '[assistant-routing]';

function toStr(v: unknown): string | null {
  return typeof v === 'string' ? v : null;
}

/** The current user turn = the last message, only if it's a user message with text. */
function currentUserText(messages: readonly GateMessage[]): { index: number; text: string } | null {
  if (messages.length === 0) return null;
  const last = messages[messages.length - 1];
  if (last?.role !== 'user') return null; // mid tool-loop or assistant turn → don't gate
  const text = toStr(last.content);
  if (!text || !text.trim()) return null;
  return { index: messages.length - 1, text };
}

/** Best-effort read of whether a live run exists, from the readable context. */
function contextSignals(context: readonly GateContextItem[] | null | undefined): {
  hasActiveRun: boolean;
  hasPendingProposal: boolean;
} {
  let hasActiveRun = false;
  if (context) {
    for (const c of context) {
      const desc = toStr(c.description)?.toLowerCase() ?? '';
      const val = toStr(c.value);
      if (desc.includes('active') && desc.includes('run') && val && val !== 'null' && val !== '{}' && val.length > 4) {
        hasActiveRun = true;
      }
    }
  }
  // Pending-proposal detection needs client proposal state; conservatively false
  // (so "run it" fails safe to a proposal rather than executing on nothing).
  return { hasActiveRun, hasPendingProposal: false };
}

function verbForIntent(route: AssistantRoute): string {
  switch (route.intent) {
    case 'continue_workflow':
      return 'continue';
    case 'pause_workflow':
      return 'pause';
    case 'cancel_workflow':
      return 'cancel';
    case 'run_calculation':
      return 'run the calculation for';
    default:
      return 'start';
  }
}

function executeDirective(route: AssistantRoute): string | null {
  if (route.target.kind === 'workflow' && route.target.id) {
    return `${DIRECTIVE_TAG} The user is explicitly asking to ${verbForIntent(route)} the "${route.target.id}"${route.target.name ? ` (${route.target.name})` : ''} workflow. Call runWorkflow with workflowId "${route.target.id}" — do not merely describe it.`;
  }
  return null;
}

function restrictDirective(): string {
  return `${DIRECTIVE_TAG} This turn is a question or a mention, not a command. Answer or explain; do NOT start, run, finalize, or modify any workflow or protected value this turn.`;
}

const INERT: Omit<GateDecision, 'route' | 'mode'> = {
  withheldToolNames: [],
  directive: null,
  directiveIndex: null,
};

/**
 * Classify the current turn (turn extraction + deterministic classify + safety
 * policy). Returns null when the last message is not a fresh user turn. Exported so
 * the runtime can reuse the SAME route for both tool-gating and model selection
 * without classifying twice. Never throws.
 */
export function classifyTurn(input: GateInput): { route: AssistantRoute; userIndex: number } | null {
  try {
    const messages = input.messages ?? [];
    const turn = currentUserText(messages);
    if (!turn) return null;
    const signals = contextSignals(input.context);
    const route = applyRoutePolicy(classifyDeterministic({ text: turn.text, ...signals }));
    return { route, userIndex: turn.index };
  } catch {
    return null;
  }
}

/**
 * Given an already-classified route, decide what to withhold / append. Pure.
 */
export function decideEnforcement(
  route: AssistantRoute,
  userIndex: number,
  availableToolNames: readonly string[],
  opts: { directives: boolean }
): Pick<GateDecision, 'withheldToolNames' | 'directive' | 'directiveIndex'> {
  const shouldRestrict =
    (route.mode === 'ask' || route.mode === 'propose') &&
    route.confidence >= RESTRICT_MIN_CONFIDENCE &&
    !route.referencesPendingAction;

  let withheld: string[] = [];
  if (shouldRestrict && availableToolNames.length > 0) {
    const denied = deniedToolNames(availableToolNames, route.mode);
    // Guard: never strip the whole tool set.
    if (denied.length > 0 && denied.length < availableToolNames.length) withheld = denied;
  }

  let directive: string | null = null;
  if (opts.directives) {
    if (route.mode === 'execute') directive = executeDirective(route);
    else if (withheld.length > 0) directive = restrictDirective();
  }

  return { withheldToolNames: withheld, directive, directiveIndex: directive ? userIndex : null };
}

/**
 * Analyze the current turn and decide what (if anything) to change. Pure, sync,
 * fail-open. In 'off' mode returns an inert decision. In 'shadow' mode returns the
 * computed route with no changes. In 'enforce' mode may withhold tools / add a directive.
 */
export function computeGateDecision(input: GateInput, opts: { mode: IntentGateMode; directives: boolean }): GateDecision {
  if (opts.mode === 'off') {
    return { route: fallbackRoute('gate off'), mode: opts.mode, ...INERT };
  }

  const turn = classifyTurn(input);
  if (!turn) return { route: fallbackRoute('not a fresh user turn'), mode: opts.mode, ...INERT };

  if (opts.mode === 'shadow') {
    return { route: turn.route, mode: opts.mode, ...INERT };
  }

  const availableNames = (input.tools ?? [])
    .map((t) => toStr(t.name))
    .filter((n): n is string => !!n);
  const enf = decideEnforcement(turn.route, turn.userIndex, availableNames, { directives: opts.directives });
  return { route: turn.route, mode: opts.mode, ...enf };
}

/**
 * Apply a decision to concrete message/tool arrays, preserving their element types.
 * Reference-stable: returns the SAME arrays when the decision changes nothing.
 */
export function applyGateDecision<M extends { content?: unknown }, T extends { name?: unknown }>(
  messages: M[],
  tools: T[],
  decision: GateDecision
): { messages: M[]; tools: T[] } {
  let outTools: T[] = tools;
  if (decision.withheldToolNames.length > 0) {
    const filtered = tools.filter((t) => {
      const n = t.name;
      return typeof n !== 'string' || !decision.withheldToolNames.includes(n);
    });
    if (filtered.length > 0) outTools = filtered; // final safety net: never strip all
  }

  let outMessages: M[] = messages;
  if (decision.directive && decision.directiveIndex != null && decision.directiveIndex < messages.length) {
    const idx = decision.directiveIndex;
    const dir = decision.directive;
    outMessages = messages.map((m, i) => {
      if (i !== idx) return m;
      const base = typeof m.content === 'string' ? m.content : '';
      return { ...m, content: `${base}\n\n${dir}` } as M;
    });
  }

  return { messages: outMessages, tools: outTools };
}
