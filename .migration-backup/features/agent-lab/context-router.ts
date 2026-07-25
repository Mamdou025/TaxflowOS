// ─────────────────────────────────────────────────────────────────────────────
// Agent Lab — CONTEXT ROUTER (client-safe: pure logic, no secrets, no server imports).
//
// "Send only what this question needs." A stateless model re-receives the FULL system
// prompt + EVERY tool schema on every turn — cheap with caching, but it dilutes the
// model's attention when most of it is irrelevant. This picks, per question, which
// prompt folders + tools to include, so you can compare "send everything" vs "send only
// the relevant slice" (tokens + answer quality) in the Lab.
//
// v1 is a deterministic keyword matcher (transparent, free, always works) — the same
// lexical approach as searchDocuments. Its blind spot is identical: it matches literal
// words, not meaning, so it works best when your folders/tools are keyword-rich and
// domain-specific. The intelligent upgrade is an LLM/embedding "intent router" (matches
// by meaning) — swap `selectContext` for that later without touching the call sites.
// ─────────────────────────────────────────────────────────────────────────────

export type SelectableSection = { id: string; name: string; content: string };
export type SelectableTool = { id: string; label: string; desc: string };

export type ContextSelection = {
  /** Folder ids to include this turn (always keeps the first/identity folder). */
  sectionIds: string[];
  /** Tool ids to include this turn. */
  toolIds: string[];
  /** One-line, human explanation for the provenance panel. */
  reason: string;
};

// Very small stoplist so matches key off meaningful words, not "the/what/how".
const STOPWORDS = new Set([
  'the', 'and', 'for', 'you', 'your', 'are', 'was', 'with', 'this', 'that', 'have', 'has',
  'can', 'will', 'what', 'when', 'where', 'which', 'who', 'how', 'why', 'from', 'into', 'about',
  'please', 'give', 'tell', 'show', 'need', 'want', 'help', 'make', 'does', 'did', 'not', 'but',
  'all', 'any', 'get', 'use', 'using', 'should', 'would', 'could', 'them', 'they', 'our',
]);

function keywords(text: string): string[] {
  const words = (text.toLowerCase().match(/[a-z0-9]{3,}/g) ?? []).filter((w) => !STOPWORDS.has(w));
  return [...new Set(words)];
}

function overlap(haystack: string, terms: string[]): number {
  const lower = haystack.toLowerCase();
  let n = 0;
  for (const t of terms) {
    if (lower.includes(t)) {
      n++;
    }
  }
  return n;
}

/**
 * Pick the folders + tools relevant to a question. Safe by construction:
 *   • the first (identity) folder is always kept, so the agent never loses its persona;
 *   • if NO domain folder matches, all folders are kept (don't starve an unclassifiable Q);
 *   • if NO tool matches, all tools are kept (never leave the agent tool-less).
 * It only trims when the match is confident — otherwise it degrades to "send everything".
 */
export function selectContext(
  question: string,
  sections: SelectableSection[], // ENABLED folders, in order
  tools: SelectableTool[], // ENABLED tools
): ContextSelection {
  const terms = keywords(question);

  // Folders: keep the identity folder (index 0) + any that share a keyword.
  let sectionIds: string[];
  if (sections.length === 0) {
    sectionIds = [];
  } else {
    const matched = sections.filter((s, i) => i === 0 || overlap(`${s.name} ${s.content}`, terms) > 0).map((s) => s.id);
    // Only the identity folder matched → we couldn't classify → keep everything.
    sectionIds = matched.length > 1 ? matched : sections.map((s) => s.id);
  }

  // Tools: keep those whose id/label/description share a keyword; none → keep all.
  const matchedTools = tools.filter((t) => overlap(`${t.id} ${t.label} ${t.desc}`, terms) > 0).map((t) => t.id);
  const toolIds = matchedTools.length > 0 ? matchedTools : tools.map((t) => t.id);

  const trimmed = sectionIds.length < sections.length || toolIds.length < tools.length;
  const reason = !terms.length
    ? 'no keywords to match — sent everything'
    : trimmed
      ? `matched on: ${terms.slice(0, 8).join(', ')}`
      : 'everything was relevant — sent all';

  return { sectionIds, toolIds, reason };
}
