// ─────────────────────────────────────────────────────────────────────────────
// AssistantRoute — the shared, runtime-validated classification of one user turn.
//
// This is the contract BOTH the deterministic classifier (classify.ts) and the
// optional structured LLM router (intent-router.ts) produce, so the enforcement
// layer (gate.ts + route-policy.ts) never has to care which produced it.
//
// The core distinction is principle #2: a workflow keyword identifies a TARGET,
// it is never on its own an EXECUTE command. `mode` (ask/propose/execute) and
// `target` are separate fields for exactly that reason.
// ─────────────────────────────────────────────────────────────────────────────

import { z } from 'zod';

export const ROUTE_SCHEMA_VERSION = 'route.v1';

/** Ask = answer/explain/read; Propose = show what would happen; Execute = act. */
export const AssistantModeSchema = z.enum(['ask', 'propose', 'execute']);
export type AssistantMode = z.infer<typeof AssistantModeSchema>;

export const AssistantIntentSchema = z.enum([
  'general_conversation',
  'answer_question',
  'explain_workflow',
  'find_workflow',
  'start_workflow',
  'continue_workflow',
  'pause_workflow',
  'cancel_workflow',
  'get_workflow_status',
  'run_calculation',
  'inspect_calculation',
  'search_evidence',
  'open_page',
  'open_artifact',
  'edit_field',
  'modify_protected_value',
  'create_ui_view',
  'approve_action',
  'reject_action',
  'cancel_pending_action',
  'unknown',
]);
export type AssistantIntent = z.infer<typeof AssistantIntentSchema>;

/** How the intent was expressed — the strongest signal for the safety threshold. */
export const ExplicitnessSchema = z.enum([
  'explicit_action', // imperative command / slash command / clicked control
  'implicit_request', // "I'd like to…", clearly wants an action but softly
  'hypothetical', // "what if…", "could we…", "roughly…"
  'mention_only', // a workflow is merely named, no action
  'ambiguous',
]);
export type Explicitness = z.infer<typeof ExplicitnessSchema>;

export const RouteTargetKindSchema = z.enum([
  'workflow',
  'workflow_run',
  'calculation',
  'artifact',
  'page',
  'field',
  'evidence',
  'pending_action',
  'none',
]);

export const RouteTargetSchema = z.object({
  kind: RouteTargetKindSchema,
  id: z.string().nullable(),
  name: z.string().nullable(),
  confidence: z.number().min(0).max(1),
});
export type RouteTarget = z.infer<typeof RouteTargetSchema>;

export const AssistantRouteSchema = z.object({
  mode: AssistantModeSchema,
  intent: AssistantIntentSchema,
  explicitness: ExplicitnessSchema,
  target: RouteTargetSchema,
  detectedNegation: z.boolean(),
  referencesPendingAction: z.boolean(),
  /** Named facts the turn is missing before an action could safely run. */
  missingContext: z.array(z.string()).max(10),
  /** Tool RISK groups the conductor may use this turn (see tool-groups.ts). */
  allowedToolGroups: z.array(z.string()).max(12),
  requiresApproval: z.boolean(),
  confidence: z.number().min(0).max(1),
  /** Short, log-safe classification rationale. Never chain-of-thought. */
  auditSummary: z.string().max(400),
  /** Which layer produced this route, for observability. */
  source: z.enum(['deterministic', 'llm', 'downgraded', 'fallback']),
});
export type AssistantRoute = z.infer<typeof AssistantRouteSchema>;

/** A never-restrict fallback route used whenever classification cannot be trusted. */
export function fallbackRoute(reason: string): AssistantRoute {
  return {
    mode: 'ask',
    intent: 'unknown',
    explicitness: 'ambiguous',
    target: { kind: 'none', id: null, name: null, confidence: 0 },
    detectedNegation: false,
    referencesPendingAction: false,
    missingContext: [],
    allowedToolGroups: [],
    requiresApproval: false,
    confidence: 0,
    auditSummary: `fallback: ${reason}`.slice(0, 400),
    source: 'fallback',
  };
}
