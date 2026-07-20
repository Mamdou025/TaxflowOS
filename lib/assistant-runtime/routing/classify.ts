// ─────────────────────────────────────────────────────────────────────────────
// Deterministic classifier — turns one user turn into an AssistantRoute.
//
// This is the ENFORCED routing layer (the LLM router in intent-router.ts is an
// optional escalation, not in the hot path). It is pure, synchronous, and fully
// unit-testable offline (see evals/). Precedence, per principle #2 and §13.4:
//
//   slash-command > negation > information-question > hypothetical >
//   pronoun-run("run it") > explicit-action-verb > mention-only > general
//
// A workflow NAME only ever sets the target; it never, by itself, produces an
// execute route.
// ─────────────────────────────────────────────────────────────────────────────

import {
  AssistantRouteSchema,
  type AssistantIntent,
  type AssistantMode,
  type AssistantRoute,
  type Explicitness,
  type RouteTarget,
} from './route-schema';
import {
  detectExplicitAction,
  detectNegation,
  detectPronounRun,
  isHypothetical,
  isInformationQuestion,
  isPoliteRequest,
  neutralizeNounRun,
  parseSlashCommand,
  stripQuotedAndReported,
  type ActionGroup,
} from './command-parser';
import { resolveWorkflowTarget, type WorkflowTargetResolution } from './workflow-targets';
import { MODE_DENIED_GROUPS, type ToolRiskGroup } from './tool-groups';

export type ClassifyContext = {
  text: string;
  /** True if the thread already has a live/active workflow run. */
  hasActiveRun?: boolean;
  /** True if there is exactly one pending proposal awaiting a yes/no. */
  hasPendingProposal?: boolean;
};

const ALL_GROUPS: ToolRiskGroup[] = ['read_nav', 'field_edit', 'generate_ui', 'page_command', 'execute', 'builder_mutate'];

function allowedGroupsFor(mode: AssistantMode): string[] {
  const denied = new Set(MODE_DENIED_GROUPS[mode]);
  return ALL_GROUPS.filter((g) => !denied.has(g));
}

function workflowTargetFrom(res: WorkflowTargetResolution): RouteTarget {
  return {
    kind: 'workflow',
    id: res.id,
    name: res.name,
    confidence: res.confidence,
  };
}

const NO_TARGET: RouteTarget = { kind: 'none', id: null, name: null, confidence: 0 };

function build(
  mode: AssistantMode,
  intent: AssistantIntent,
  explicitness: Explicitness,
  target: RouteTarget,
  opts: {
    negation?: boolean;
    pending?: boolean;
    missing?: string[];
    requiresApproval?: boolean;
    confidence: number;
    audit: string;
  }
): AssistantRoute {
  return AssistantRouteSchema.parse({
    mode,
    intent,
    explicitness,
    target,
    detectedNegation: opts.negation ?? false,
    referencesPendingAction: opts.pending ?? false,
    missingContext: opts.missing ?? [],
    allowedToolGroups: allowedGroupsFor(mode),
    requiresApproval: opts.requiresApproval ?? false,
    confidence: opts.confidence,
    auditSummary: opts.audit,
    source: 'deterministic',
  });
}

const LIFECYCLE_INTENT: Record<'start' | 'continue' | 'pause' | 'cancel', AssistantIntent> = {
  start: 'start_workflow',
  continue: 'continue_workflow',
  pause: 'pause_workflow',
  cancel: 'cancel_workflow',
};

function looksLikeCalcInspection(text: string): boolean {
  return /\b(calcul|calculation|math|number|figure|result|total|amount|montant|chiffre|résultat)\b/i.test(text);
}

/** Map a slash command to a route. A typed command is treated as an explicit action. */
function classifySlash(command: string, args: string, target: WorkflowTargetResolution): AssistantRoute {
  const t = workflowTargetFrom(target);
  switch (command) {
    case 'run':
    case 'start':
    case 'launch':
    case 'execute':
      if (target.ambiguous) {
        return build('propose', 'start_workflow', 'explicit_action', NO_TARGET, {
          missing: ['workflow_target'],
          confidence: 0.6,
          audit: `slash /${command} but multiple workflows matched`,
        });
      }
      if (!target.id) {
        return build('propose', 'start_workflow', 'explicit_action', NO_TARGET, {
          missing: ['workflow_target'],
          confidence: 0.6,
          audit: `slash /${command} without a resolvable workflow`,
        });
      }
      return build('execute', 'start_workflow', 'explicit_action', t, {
        confidence: 0.98,
        audit: `slash /${command} → start ${target.id}`,
      });
    case 'explain':
    case 'help':
    case 'what':
      return build('ask', target.id ? 'explain_workflow' : 'answer_question', 'explicit_action', t, {
        confidence: 0.95,
        audit: `slash /${command} → explain`,
      });
    case 'open':
    case 'show':
      return build('ask', 'open_page', 'explicit_action', t, {
        confidence: 0.9,
        audit: `slash /${command} → open`,
      });
    default:
      // Unknown slash command → don't restrict; let the model handle it.
      return build('ask', 'unknown', 'ambiguous', t, {
        confidence: 0.3,
        audit: `unknown slash /${command}`,
      });
  }
}

/**
 * Classify a single user turn deterministically. Never throws — any internal error
 * surfaces to callers as a low-confidence ask route via the try/catch in the gate;
 * here we keep it total by construction.
 */
export function classifyDeterministic(ctx: ClassifyContext): AssistantRoute {
  const text = (ctx.text ?? '').trim();
  if (!text) {
    return build('ask', 'general_conversation', 'ambiguous', NO_TARGET, {
      confidence: 0.4,
      audit: 'empty message',
    });
  }

  const target = resolveWorkflowTarget(text);
  const targetRoute = workflowTargetFrom(target);
  const mentionsWorkflow = target.matchedIds.length > 0;

  // 1. Slash command — a typed command has the highest authority.
  const slash = parseSlashCommand(text);
  if (slash) return classifySlash(slash.command, slash.args, target);

  const negation = detectNegation(text);
  const question = isInformationQuestion(text);
  const hypo = isHypothetical(text);
  // Action + pronoun-run are detected on the DE-QUOTED text so an imperative that
  // only appears inside quoted/reported content cannot be read as a command; and
  // with noun-"run" neutralized so "the FAPI run" is not read as "run".
  const actionText = neutralizeNounRun(stripQuotedAndReported(text));
  const pronounRun = detectPronounRun(actionText);
  const action = detectExplicitAction(actionText);

  // 2. Negation — blocks execution outright (§13.4). Answer/explain instead.
  if (negation) {
    const intent: AssistantIntent = ctx.hasPendingProposal
      ? 'cancel_pending_action'
      : mentionsWorkflow
        ? 'explain_workflow'
        : 'answer_question';
    return build('ask', intent, 'mention_only', mentionsWorkflow ? targetRoute : NO_TARGET, {
      negation: true,
      pending: ctx.hasPendingProposal,
      confidence: 0.9,
      audit: `negation present → ask (${intent})`,
    });
  }

  // 3. Information question — explain/inspect/answer. Never execute.
  if (question) {
    const intent: AssistantIntent = mentionsWorkflow
      ? 'explain_workflow'
      : looksLikeCalcInspection(text)
        ? 'inspect_calculation'
        : 'answer_question';
    return build('ask', intent, 'mention_only', mentionsWorkflow ? targetRoute : NO_TARGET, {
      confidence: 0.9,
      audit: `information question → ask (${intent})`,
    });
  }

  // 4. Hypothetical — "what if…", "roughly…". Ask/propose, clearly non-official.
  if (hypo) {
    const isCalc = action?.group === 'calculate' || looksLikeCalcInspection(text);
    return build(isCalc ? 'propose' : 'ask', isCalc ? 'run_calculation' : mentionsWorkflow ? 'explain_workflow' : 'answer_question', 'hypothetical', mentionsWorkflow ? targetRoute : NO_TARGET, {
      confidence: 0.85,
      audit: `hypothetical → ${isCalc ? 'propose non-official calc' : 'ask'}`,
    });
  }

  // 5. "Run it" / "go ahead" — only executes against a single unambiguous pending
  //    action or an active run; otherwise it is a safe proposal (ask which).
  if (pronounRun) {
    if (ctx.hasPendingProposal || ctx.hasActiveRun) {
      const intent: AssistantIntent = ctx.hasActiveRun && !ctx.hasPendingProposal ? 'continue_workflow' : 'start_workflow';
      return build('execute', intent, 'explicit_action', NO_TARGET, {
        pending: true,
        confidence: 0.85,
        audit: `pronoun-run resolved against pending/active`,
      });
    }
    return build('propose', 'start_workflow', 'ambiguous', NO_TARGET, {
      missing: ['pending_action'],
      confidence: 0.6,
      audit: `pronoun-run with nothing pending → propose`,
    });
  }

  // 6. Explicit action verb.
  if (action) {
    return classifyAction(action.group, text, target, targetRoute, mentionsWorkflow, ctx);
  }

  // 7. Workflow mentioned, no action → explain (mention ≠ command).
  if (mentionsWorkflow) {
    const first = target.matchedIds[0];
    const name = target.name ?? first;
    return build('ask', 'explain_workflow', 'mention_only', { kind: 'workflow', id: target.ambiguous ? null : first, name, confidence: 0.7 }, {
      confidence: 0.75,
      audit: `workflow mentioned, no action verb → ask/explain`,
    });
  }

  // 8. Nothing actionable → general conversation.
  return build('ask', 'general_conversation', 'ambiguous', NO_TARGET, {
    confidence: 0.5,
    audit: `no action/target signals → general`,
  });
}

function classifyAction(
  group: ActionGroup,
  text: string,
  target: WorkflowTargetResolution,
  targetRoute: RouteTarget,
  mentionsWorkflow: boolean,
  ctx: ClassifyContext
): AssistantRoute {
  const explicitness: Explicitness = isPoliteRequest(text) ? 'implicit_request' : 'explicit_action';

  // Read/open → ASK read. Opening/showing is never an execute.
  if (group === 'open') {
    return build('ask', mentionsWorkflow ? 'open_artifact' : 'open_page', explicitness, mentionsWorkflow ? targetRoute : NO_TARGET, {
      confidence: 0.85,
      audit: `open/show → ask read`,
    });
  }

  // Field edit → PROPOSE (reversible inline change, not a run).
  if (group === 'edit') {
    return build('propose', 'edit_field', explicitness, mentionsWorkflow ? targetRoute : NO_TARGET, {
      confidence: 0.8,
      audit: `edit/set value → propose edit_field`,
    });
  }

  // Finalize / lock / apply / publish → PROPOSE + approval (protected change).
  if (group === 'finalize') {
    return build('propose', 'modify_protected_value', explicitness, mentionsWorkflow ? targetRoute : NO_TARGET, {
      requiresApproval: true,
      confidence: 0.8,
      audit: `finalize/protected change → propose + approval`,
    });
  }

  // Approve / reject → only meaningful against a pending action.
  if (group === 'approve' || group === 'reject') {
    const intent: AssistantIntent = group === 'approve' ? 'approve_action' : 'reject_action';
    if (ctx.hasPendingProposal || ctx.hasActiveRun) {
      return build('execute', intent, explicitness, NO_TARGET, {
        pending: true,
        confidence: 0.85,
        audit: `${group} against pending/active`,
      });
    }
    return build('ask', intent, 'mention_only', NO_TARGET, {
      missing: ['pending_action'],
      confidence: 0.6,
      audit: `${group} but nothing pending → ask`,
    });
  }

  // Calculate — in this app the runnable unit IS the workflow, so a calculate verb
  // with a resolved workflow behaves like start. Without a workflow it's a
  // (rare) standalone calc request; still explicit, still execute-mode.
  if (group === 'calculate') {
    if (target.ambiguous) {
      return build('propose', 'run_calculation', explicitness, NO_TARGET, {
        missing: ['workflow_target'],
        confidence: 0.6,
        audit: `calculate but multiple workflows matched → propose`,
      });
    }
    return build('execute', 'run_calculation', explicitness, mentionsWorkflow ? targetRoute : NO_TARGET, {
      confidence: 0.9,
      audit: `calculate → execute (workflow ${target.id ?? 'n/a'})`,
    });
  }

  // Lifecycle verbs: start / continue / pause / cancel.
  const intent = LIFECYCLE_INTENT[group as 'start' | 'continue' | 'pause' | 'cancel'];
  if (target.ambiguous) {
    return build('propose', intent, explicitness, NO_TARGET, {
      missing: ['workflow_target'],
      confidence: 0.6,
      audit: `${group} but multiple workflows matched → propose (ask which)`,
    });
  }
  if (!target.id) {
    // Execution verb, no named workflow. Continue can resolve against an active run.
    if (group === 'continue' && ctx.hasActiveRun) {
      return build('execute', 'continue_workflow', explicitness, NO_TARGET, {
        pending: true,
        confidence: 0.8,
        audit: `continue against active run`,
      });
    }
    return build('propose', intent, explicitness, NO_TARGET, {
      missing: ['workflow_target'],
      confidence: 0.6,
      audit: `${group} without a resolvable workflow → propose`,
    });
  }
  return build('execute', intent, explicitness, targetRoute, {
    confidence: 0.95,
    audit: `${group} ${target.id} → execute`,
  });
}
