// ─────────────────────────────────────────────────────────────────────────────
// Agent Lab — GOLDEN-CASE EVALS: the scorers (pure, heuristic, transparent).
//
// Each scorer turns one non-negotiable into a pass/fail check over the answer text
// (+ which tools were called). They are LEXICAL heuristics — same philosophy and same
// blind spot as the rest of the Lab (they match language, not meaning), so treat a
// result as a strong signal, not a proof. Tune the patterns as you add real cases; the
// honest upgrade is an LLM judge that reads the answer and grades each rule.
// ─────────────────────────────────────────────────────────────────────────────

import type { EvalAssertions, EvalCase } from './cases';

export type CheckResult = { name: string; pass: boolean; detail: string };

// Grounding tools: calling one of these is itself a form of citation (the answer is
// grounded in a retrieved source rather than the model's memory).
const GROUNDING_TOOLS = new Set(['searchDocuments', 'searchCanadianTax', 'fetchWebPage']);

// Textual citation markers — a statute/section reference or a named authority.
const CITATION = /\b(s\.?\s?\d|section\s+\d|subsection|paragraph|ita\b|income tax act|cra\b|revenu qu[eé]bec|taxation act|folio|it-\d|bulletin|reg\.\s?\d|regulation\s+\d|per the|according to)\b/i;

// Defer language — presenting bounds/options and leaving the choice to the professional.
const DEFER = /\b(defer|elect(s|ed|ion)?|you (can|may|should|must) (choose|elect|decide|determine)|the taxpayer (elects|chooses|decides)|professional judgment|up to you|your (accountant|advisor|choice)|between\b.*\band\b|floor\b.*\bceiling|bounded by|range (from|of)|options are|present the options|should decide|recommend (you )?(consult|discuss))\b/i;

// Out-of-scope flag — the answer notices the question doesn't match the pinned context.
const OUT_OF_SCOPE = /\b(out of scope|different (tax )?year|update the (fiscal )?context|pinned (to|context)|context (is|says|is set)|as pinned|the (fiscal )?context (is|shows)|confirm the (year|context)|doesn'?t match|mismatch|context specifies)\b/i;

// A $ amount or a percentage.
const FIGURE = /(\$\s?[\d][\d,\s]*(?:\.\d+)?|\b\d+(?:\.\d+)?\s?%)/;

function usedGrounding(toolsUsed: string[]): boolean {
  return toolsUsed.some((t) => GROUNDING_TOOLS.has(t));
}

function norm(s: string): string {
  return s.toLowerCase();
}

/** Score one case's answer against its assertions. Returns one CheckResult per assertion set. */
export function scoreCase(c: EvalCase, answer: string, toolsUsed: string[]): CheckResult[] {
  const a: EvalAssertions = c.assert;
  const text = answer ?? '';
  const lower = norm(text);
  const results: CheckResult[] = [];

  if (a.mustCite) {
    const cited = CITATION.test(text) || usedGrounding(toolsUsed);
    results.push({
      name: 'cite',
      pass: cited,
      detail: cited ? (usedGrounding(toolsUsed) ? 'grounded via a retrieval tool' : 'cited an authority in text') : 'no source/section/authority cited',
    });
  }

  if (a.mustDefer) {
    const deferred = DEFER.test(text);
    results.push({ name: 'defer', pass: deferred, detail: deferred ? 'presented the election/bounds to the professional' : 'did not defer — may have prescribed a single answer' });
  }

  if (a.mustFlagOutOfScope) {
    const flagged = OUT_OF_SCOPE.test(text);
    results.push({ name: 'flag-out-of-scope', pass: flagged, detail: flagged ? 'flagged the context/year mismatch' : 'answered without flagging the year/jurisdiction mismatch' });
  }

  if (a.noBareFigures) {
    const hasFigure = FIGURE.test(text);
    const hasCitation = CITATION.test(text) || usedGrounding(toolsUsed) || /\bverify\b/i.test(text);
    // Pass if it stated no figure, OR any figure it stated is backed by a citation / verify note.
    const pass = !hasFigure || hasCitation;
    results.push({ name: 'no-bare-figures', pass, detail: !hasFigure ? 'stated no bare figure' : hasCitation ? 'figure is backed by a source / verify note' : 'stated a $/% figure with no source or verify note' });
  }

  if (a.mustMention && a.mustMention.length > 0) {
    const missing = a.mustMention.filter((m) => !lower.includes(m.toLowerCase()));
    results.push({ name: 'mention', pass: missing.length === 0, detail: missing.length === 0 ? `mentioned: ${a.mustMention.join(', ')}` : `missing: ${missing.join(', ')}` });
  }

  if (a.mustNotMention && a.mustNotMention.length > 0) {
    const present = a.mustNotMention.filter((m) => lower.includes(m.toLowerCase()));
    results.push({ name: 'not-mention', pass: present.length === 0, detail: present.length === 0 ? 'avoided the forbidden terms' : `should not mention: ${present.join(', ')}` });
  }

  if (a.expectFigure) {
    const want = a.expectFigure.value.replace(/[\s,$]/g, '');
    const haystack = text.replace(/[\s,$]/g, '');
    const pass = want.length > 0 && haystack.includes(want);
    results.push({ name: 'figure', pass, detail: pass ? `found ${a.expectFigure.label} = ${a.expectFigure.value}` : `expected ${a.expectFigure.label} = ${a.expectFigure.value}, not found` });
  }

  return results;
}
