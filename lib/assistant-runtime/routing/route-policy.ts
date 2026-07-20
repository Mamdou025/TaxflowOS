// ─────────────────────────────────────────────────────────────────────────────
// Route policy — deterministic safety thresholds applied AFTER classification.
//
// The classifier is already conservative; this is the final guard that makes
// "ambiguity fails safe" (principle #5) a property of the CODE, not the prompt.
// It can only ever make a route SAFER (execute → propose/ask), never escalate.
//
// Thresholds live here (not scattered) so they can be tuned with the eval set.
// ─────────────────────────────────────────────────────────────────────────────

import type { AssistantRoute } from './route-schema';

/** Minimum confidence for a natural-language EXECUTE to survive (slash commands exempt). */
export const EXECUTE_CONFIDENCE_THRESHOLD = 0.85;

export type PolicyContext = {
  /** True when the turn came from an explicit clicked control, not language. */
  explicitUiAction?: boolean;
};

/**
 * Apply safety downgrades. Returns the same route object when nothing changed, or a
 * new route (source: 'downgraded') describing why it was made safer.
 */
export function applyRoutePolicy(route: AssistantRoute, ctx: PolicyContext = {}): AssistantRoute {
  if (route.mode !== 'execute') return route;

  // An explicit clicked UI control is trusted regardless of language confidence.
  if (ctx.explicitUiAction) return route;

  const reasons: string[] = [];

  // Negation must never co-exist with execute.
  if (route.detectedNegation) reasons.push('negation');

  // A workflow-lifecycle execute needs a resolved, unambiguous target.
  const needsTarget =
    route.intent === 'start_workflow' ||
    route.intent === 'pause_workflow' ||
    route.intent === 'cancel_workflow';
  if (needsTarget && route.target.kind === 'workflow' && !route.target.id && !route.referencesPendingAction) {
    reasons.push('missing_or_ambiguous_target');
  }

  // Low-confidence natural-language execute (explicit slash commands are ~0.98).
  if (route.explicitness !== 'explicit_action' && route.confidence < EXECUTE_CONFIDENCE_THRESHOLD) {
    reasons.push('low_confidence');
  }

  if (reasons.length === 0) return route;

  const missing = route.missingContext.slice();
  if (reasons.includes('missing_or_ambiguous_target') && !missing.includes('workflow_target')) {
    missing.push('workflow_target');
  }

  return {
    ...route,
    // Negation drops all the way to ask; other doubts drop to propose.
    mode: reasons.includes('negation') ? 'ask' : 'propose',
    missingContext: missing,
    allowedToolGroups: route.allowedToolGroups.filter((g) => g !== 'execute' && g !== 'builder_mutate'),
    source: 'downgraded',
    auditSummary: `downgraded (${reasons.join(', ')}): ${route.auditSummary}`.slice(0, 400),
  };
}
