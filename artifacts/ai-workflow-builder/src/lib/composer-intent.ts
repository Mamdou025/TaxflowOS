// ─────────────────────────────────────────────────────────────────────────────
// Composer intent — a deterministic, client-side PREVIEW of what Scope will do
// with the message you're typing. It labels the send button and names the
// specialist BEFORE you send, so an action never comes as a surprise.
//
// Advisory only. The assistant + its proposal card stay authoritative: a run
// still renders a proposal you Start, page/field ops still go through the tools.
// This never executes anything — it only mirrors the assistant's routing so the
// UI can preview it. It deliberately honours the ask-vs-act gate: a workflow
// *mention* is NOT a command — only an imperative ("run/calculate/…") is — so we
// don't promise a run when the user is only asking about FAPI.
// ─────────────────────────────────────────────────────────────────────────────

import { AGENTS } from './agents';

export type ComposerAction = 'run' | 'open' | 'generate' | 'answer';

export type ComposerIntent = {
  action: ComposerAction;
  /** Ribbon label, e.g. "Run workflow". */
  verb: string;
  /** Send-button label, e.g. "Run" / "Open" / "Build" / "Send". */
  sendLabel: string;
  /** For `run`: the workflow id + owning specialist. */
  workflowId?: string;
  agentId?: string;
  /** Human phrase for the handoff copy, e.g. "FAPI". */
  target?: string;
};

// Hypotheticals, negations and explicit holds are NEVER an action — answer instead.
const HOLD = /\b(don'?t|do not|not yet|only explain|just explain|sans lancer|ne lance pas|pas encore|what ?if|hypothetical|might|maybe|could we|would it)\b/i;
const RUN_VERB = /\b(run|start|launch|calculate|calc|compute|execute|kick off|d[ée]marre[rz]?|lance[rz]?|calcule[rz]?|ex[ée]cute[rz]?)\b/i;
const OPEN_VERB = /\b(open|show|view|display|go to|take me to|pull up|ouvre|ouvrir|montre|affiche|voir)\b/i;
const GEN_VERB = /\b(generate|create|make|build|mock|draw|plot|chart|graph|visuali[sz]e)\b/i;

// Workflow keyword → id + copy target. Mirrors the assistant's valid ids
// (fapi · roulement · expense · campaign).
const WF_KEYWORD: { re: RegExp; id: string; target: string }[] = [
  { re: /\bfapi\b/i, id: 'fapi', target: 'FAPI' },
  { re: /roulement|rollover|art\.?\s*85|section\s*85|\bs\.?\s*85\b/i, id: 'roulement', target: 'the art. 85 rollover' },
  { re: /\bexpenses?\b|d[ée]penses?|reimburs|per[- ]?diem/i, id: 'expense', target: 'expenses' },
  { re: /\bcampaign\b|marketing budget|budget allocation|channel spend/i, id: 'campaign', target: 'campaign budgets' },
];

const PAGE_NOUN = /\b(dashboard|worksheet|worksheets|t1134|surplus|viewer|documents?)\b/i;
const VIEW_NOUN = /\b(chart|graph|dashboard|table|kpi|tiles?|view|report|form|breakdown)\b/i;

/** Preview the assistant's likely action for the in-progress message (null when empty). */
export function detectComposerIntent(text: string): ComposerIntent | null {
  const t = text.trim();
  if (!t) return null;

  // A hold / hypothetical / negation always resolves to an answer.
  if (HOLD.test(t)) return { action: 'answer', verb: 'Answer', sendLabel: 'Send' };

  const wf = WF_KEYWORD.find((w) => w.re.test(t));

  // Run: an imperative + a known workflow → that workflow's specialist proposes it.
  if (wf && RUN_VERB.test(t)) {
    const agent = AGENTS.find((a) => a.workflow === wf.id && a.live);
    return { action: 'run', verb: 'Run workflow', sendLabel: 'Run', workflowId: wf.id, agentId: agent?.id, target: wf.target };
  }

  // Generate a one-off view (chart / table / KPIs / dashboard-of).
  if (GEN_VERB.test(t) && VIEW_NOUN.test(t)) {
    return { action: 'generate', verb: 'Generate a view', sendLabel: 'Build' };
  }

  // Open a registered page.
  if (OPEN_VERB.test(t) || PAGE_NOUN.test(t)) {
    return { action: 'open', verb: 'Open', sendLabel: 'Open' };
  }

  // A bare imperative "run the workflow" without a recognised name.
  if (RUN_VERB.test(t) && /\bworkflow\b/i.test(t)) {
    return { action: 'run', verb: 'Run workflow', sendLabel: 'Run' };
  }

  // Everything else — including a bare workflow mention or a question — is answered.
  return { action: 'answer', verb: 'Answer', sendLabel: 'Send' };
}
