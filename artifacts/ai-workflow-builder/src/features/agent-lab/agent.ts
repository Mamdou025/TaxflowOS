// ─────────────────────────────────────────────────────────────────────────────
// Agent Lab — THE AGENT LOOP (server only).
//
// This is the whole "agent": give the model tools + a stop condition, and it will
// call tools and re-think until it can answer. Everything the builder page can
// configure (model, system prompt, temperature, step cap, enabled tools, attached
// documents) is just an argument here.
// ─────────────────────────────────────────────────────────────────────────────

import { generateText, stepCountIs, type LanguageModel, type ModelMessage, type ToolSet } from 'ai';
import { openai } from '@ai-sdk/openai';
import {
  DEFAULT_SYSTEM_PROMPT,
  type AgentLabDoc,
  type AgentLabDocContext,
  type AgentLabResponse,
  type DocMode,
} from './catalog';
import { AUTO_MODEL_ID, planForModel, routeAuto, type EffortLevel } from './model-router';
import { TOOLS, createSearchDocumentsTool } from './tools';

// The current turn's question — the last user message's text (used by Sina auto-routing).
function lastUserText(messages: ModelMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role !== 'user') {
      continue;
    }
    if (typeof m.content === 'string') {
      return m.content;
    }
    if (Array.isArray(m.content)) {
      return m.content
        .map((p) => (p && typeof p === 'object' && 'text' in p && typeof (p as { text?: unknown }).text === 'string' ? (p as { text: string }).text : ''))
        .join(' ')
        .trim();
    }
  }
  return '';
}

// Turn a model id into a model the AI SDK understands.
//   • "openai/gpt-5.1-instant" → Vercel AI Gateway string (AI_GATEWAY_API_KEY)
//   • "gpt-4o" + gateway key   → normalized to "openai/gpt-4o" → still the Gateway
//   • "gpt-4o" + no gateway    → direct OpenAI provider        (OPENAI_API_KEY)
// The "/" marks an explicit gateway "provider/model" id. When AI_GATEWAY_API_KEY
// is set we route bare OpenAI ids through the gateway too, so OPENAI_API_KEY is
// OPTIONAL — one key (the gateway) reaches OpenAI and every other provider. We
// only fall back to the direct OpenAI provider when no gateway key is present.
export function resolveModel(modelId: string): LanguageModel {
  if (modelId.includes('/')) {
    return modelId; // already a gateway "provider/model" string
  }
  if (process.env.AI_GATEWAY_API_KEY) {
    return `openai/${modelId}`; // bare OpenAI id → gateway (no direct key needed)
  }
  return openai(modelId); // no gateway key → direct OpenAI (OPENAI_API_KEY)
}

// Cap how much attached-document text we inject. The whole thing is sent on EVERY
// turn, so an unbounded set would balloon cost/latency (this is context management).
const MAX_DOC_CONTEXT_CHARS = 90_000;

// Build the "knowledge" block from the attached documents + report what actually
// fit within the cap, so the UI can show the truth.
function buildKnowledge(documents: AgentLabDoc[]): { block: string; context: AgentLabDocContext } {
  if (documents.length === 0) {
    return { block: '', context: { count: 0, chars: 0, names: [] } };
  }
  let budget = MAX_DOC_CONTEXT_CHARS;
  const parts: string[] = [];
  const names: string[] = [];
  for (const doc of documents) {
    if (budget <= 0) {
      break;
    }
    const slice = doc.text.slice(0, budget);
    budget -= slice.length;
    parts.push(`### ${doc.name}\n${slice}`);
    names.push(doc.name);
  }
  const block =
    '\n\n## Attached documents (knowledge the user gave you)\n' +
    'Use these to answer when relevant and cite the document name. ' +
    "If the answer is not in them, say so — don't invent it.\n\n" +
    parts.join('\n\n');
  const chars = parts.reduce((sum, p) => sum + p.length, 0);
  return { block, context: { count: names.length, chars, names } };
}

// Prepend the documents block as a cacheable text part on the FIRST user message, so
// Anthropic caches the stable prefix (tools + system + docs). We merge into the existing
// user message (rather than adding a new one) to keep user/assistant roles alternating, and
// place the docs FIRST so the cached prefix is identical on every turn → a cache hit on
// turns 2+. The `cacheControl` marker is Anthropic-namespaced; the AI SDK ignores it for
// other providers, so callers gate this to Anthropic anyway (see `cacheDocs`).
function prependDocPart(messages: ModelMessage[], docBlock: string): ModelMessage[] {
  const docPart = {
    type: 'text' as const,
    text: docBlock,
    providerOptions: { anthropic: { cacheControl: { type: 'ephemeral' as const } } },
  };
  const idx = messages.findIndex((m) => m.role === 'user');
  // No user message yet (shouldn't happen — a turn always has one): send the docs alone.
  if (idx === -1) {
    return [{ role: 'user', content: [docPart] }, ...messages];
  }
  const target = messages[idx];
  const existing =
    typeof target.content === 'string'
      ? [{ type: 'text' as const, text: target.content }]
      : target.content;
  const merged = { ...target, content: [docPart, ...existing] } as ModelMessage;
  return [...messages.slice(0, idx), merged, ...messages.slice(idx + 1)];
}

export async function runAgent(opts: {
  model: string;
  system: string;
  temperature: number;
  maxSteps: number;
  enabledTools: string[];
  messages: ModelMessage[];
  documents: AgentLabDoc[];
  docMode: DocMode;
  effort?: EffortLevel;
}): Promise<AgentLabResponse> {
  // Hand the model only the tools that are checked in the builder. searchDocuments
  // is document-aware, so it's built per request with the current documents.
  const activeTools: ToolSet = {};
  for (const id of opts.enabledTools) {
    if (id === 'searchDocuments') {
      activeTools[id] = createSearchDocumentsTool(opts.documents);
    } else if (TOOLS[id]) {
      activeTools[id] = TOOLS[id];
    }
  }

  // Build the system prompt + the "full"-mode documents block. In "full" mode the whole
  // documents are loaded; in "retrieval" mode they are NOT (that's the point) — we just tell
  // the model they exist and to call searchDocuments to read only the relevant passages.
  // The documents block is kept SEPARATE from `system` (not concatenated) so it can be placed
  // as a cacheable message part for Anthropic below — see the placement note near generateText.
  let system = opts.system || DEFAULT_SYSTEM_PROMPT;
  let docContext: AgentLabDocContext;
  let docBlock = ''; // the "full"-mode documents block ('' when retrieval mode or no docs)
  if (opts.docMode === 'retrieval' && opts.documents.length > 0) {
    const names = opts.documents.map((d) => d.name);
    system +=
      '\n\n## Attached documents (NOT loaded here)\n' +
      `The user attached ${names.length} document(s): ${names.join(', ')}. ` +
      'Their full text is NOT in your context. To answer questions about them, call the ' +
      '`searchDocuments` tool with a focused query, then answer from the passages it returns. ' +
      'If nothing relevant comes back, say so.';
    docContext = { count: names.length, chars: 0, names };
  } else {
    const knowledge = buildKnowledge(opts.documents);
    docBlock = knowledge.block;
    docContext = knowledge.context;
  }

  // Sina (auto): if the user picked the auto pseudo-model, read the question and route it
  // to the right tier (Haiku/Sonnet/Opus) instead of pinning one. A concrete pick is used
  // literally. A manually chosen effort still overrides the router's suggested effort.
  const selected = opts.model || 'gpt-4o';
  const auto = selected === AUTO_MODEL_ID ? routeAuto(lastUserText(opts.messages), { hasDocs: opts.documents.length > 0 }) : null;
  const effectiveModel = auto ? auto.model : selected;
  const effectiveEffort = opts.effort ?? auto?.effort;

  // Model router: decide the provider knobs for the EFFECTIVE model (features/agent-lab/model-router.ts).
  //   • sendTemperature=false → omit it (the Opus 4.7/4.8 · Sonnet 5 · Fable 5 family 400s on it)
  //   • providerOptions       → Anthropic `effort` (thinking depth), when the model supports it
  const plan = planForModel(effectiveModel, { effort: effectiveEffort });

  // Place the "full"-mode documents block + apply Anthropic prompt caching.
  //
  // AI SDK v6+ forbids a system-role MESSAGE inside `messages` (AI_InvalidPromptError:
  // "System messages are not allowed…"), which is the ONLY place a cache breakpoint could be
  // attached to the system — so we can no longer cache via the system prompt. Instead the
  // cache breakpoint goes on a MESSAGE PART:
  //   • Anthropic → move the documents into a CACHED text part on the first user message.
  //     Anthropic caches the whole stable prefix BEFORE the breakpoint (tools + system + docs),
  //     so repeat turns over the same documents read that block at ~10% input price. Only a
  //     block ≥1024 tokens is cached (Haiku ≥2048); a smaller "rules" doc is silently uncached
  //     (no error, no marker effect).
  //   • Everyone else → append the documents to the top-level `system` string (OpenAI
  //     auto-caches long prefixes with no marker; other providers just receive them as context).
  // This restores the caching the model-router intends without an illegal system message.
  const cacheDocs = plan.cachePrefix && docBlock.length > 0;
  const finalSystem = docBlock && !cacheDocs ? system + docBlock : system;
  const messages: ModelMessage[] = cacheDocs ? prependDocPart(opts.messages, docBlock) : opts.messages;

  const result = await generateText({
    model: resolveModel(effectiveModel),
    system: finalSystem,
    ...(plan.sendTemperature ? { temperature: opts.temperature } : {}),
    ...(plan.providerOptions ? { providerOptions: plan.providerOptions } : {}),
    tools: activeTools,
    stopWhen: stepCountIs(opts.maxSteps || 6), // the loop cap
    messages,
  });

  // Flatten the steps so the page can SHOW exactly what the agent did each step.
  const steps = result.steps.map((s, i) => ({
    step: i + 1,
    text: s.text ?? '',
    toolCalls: s.toolCalls.map((tc) => ({ tool: tc.toolName, input: tc.input })),
    toolResults: s.toolResults.map((tr) => ({ tool: tr.toolName, output: tr.output })),
  }));

  return {
    text: result.text,
    steps,
    docContext,
    usage: {
      inputTokens: result.usage.inputTokens,
      outputTokens: result.usage.outputTokens,
      totalTokens: result.usage.totalTokens,
      // Cache-read tokens surface differently by route: the direct providers set
      // `usage.cachedInputTokens`, but the Vercel AI Gateway reports them under
      // `usage.inputTokenDetails.cacheReadTokens` (and leaves cachedInputTokens undefined).
      // Read both so the UI's "cache: hit (N tok)" indicator is correct either way.
      cachedInputTokens:
        result.usage.cachedInputTokens ??
        (result.usage as { inputTokenDetails?: { cacheReadTokens?: number } }).inputTokenDetails
          ?.cacheReadTokens,
    },
    applied: {
      model: effectiveModel,
      auto: auto !== null,
      tier: auto?.tier,
      reason: auto?.reason,
      provider: plan.provider,
      effort: plan.effort,
      cache: cacheDocs,
      temperatureSent: plan.sendTemperature,
    },
  };
}
