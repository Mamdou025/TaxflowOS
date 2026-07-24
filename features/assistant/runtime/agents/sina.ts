// ─────────────────────────────────────────────────────────────────────────────
// Sina — the ONE unified assistant.
//
// Previously the workspace fielded four separate specialist personas (Sofi/Théo/
// Mira/Nova), swapped in per turn. Sina replaces them: a single agent that carries
// ALL of their domain expertise. There are no separate agents — Sina handles FAPI,
// the s.85 rollover, expense reimbursement, and campaign budgets alike.
//
// The per-turn injection no longer swaps identity — it surfaces the relevant DOMAIN
// FOCUS (the domain's expertise text) while Sina stays Sina. The domain expertise is
// still sourced from agents/specialists.ts (kept as the domain-knowledge registry).
// ─────────────────────────────────────────────────────────────────────────────

import type { AssistantRoute } from '../routing/route-schema';
import { selectDomain } from './specialists';

export const SINA_NAME = 'Sina';

/**
 * Sina's per-turn domain focus. When the route targets a workflow, return a note that
 * surfaces that domain's expertise (Sina applies it, without becoming a different agent).
 * General / navigation turns get null — Sina's base instructions already cover them.
 */
export function sinaTurnDirective(route: AssistantRoute): string | null {
  const domain = selectDomain(route);
  if (!domain) {
    return null;
  }
  return (
    `DOMAIN FOCUS FOR THIS TURN — You are ${SINA_NAME}, the workspace's tax specialist, and this turn is about ${domain.role.toLowerCase()}. ` +
    `Apply this domain expertise: ${domain.expertise} ` +
    `Answer with that expertise. Never fabricate figures — ground them in the provided context and use the deterministic workflow/calculation tools for official numbers. ` +
    `If the user shifts to another area, apply that domain's expertise or return to general assistance.`
  );
}
