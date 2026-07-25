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
//   • "gpt-4o"                 → direct OpenAI provider  (OPENAI_API_KEY)
//   • "openai/gpt-5.1-instant" → Vercel AI Gateway string (AI_GATEWAY_API_KEY)
// The "/" is the signal: gateway model strings are "provider/model".
export function resolveModel(modelId: string): LanguageModel {
  if (modelId.includes('/')) {
    return modelId; // a bare string routes through the AI Gateway
  }
  return openai(modelId);
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

  // Build the system prompt. In "full" mode the whole documents are injected; in
  // "retrieval" mode they are NOT (that's the point) — we tell the model they exist
  // and to call searchDocuments to read only the relevant passages.
  let system = opts.system || DEFAULT_SYSTEM_PROMPT;
  let docContext: AgentLabDocContext;
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
    system += knowledge.block;
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
  //   • cacheSystem           → cache the big system/doc block so re-runs read it at ~10% price
  const plan = planForModel(effectiveModel, { effort: effectiveEffort });

  // Prompt caching attaches to a message part, so when caching we move the system prompt
  // (which carries the attached documents in "full" mode) into a cached system MESSAGE and
  // drop the top-level `system` string. Non-cached models keep the plain `system` param.
  const messages: ModelMessage[] = plan.cacheSystem
    ? [
        { role: 'system', content: system, providerOptions: { anthropic: { cacheControl: { type: 'ephemeral' } } } },
        ...opts.messages,
      ]
    : opts.messages;

  const result = await generateText({
    model: resolveModel(effectiveModel),
    ...(plan.cacheSystem ? {} : { system }),
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
      cachedInputTokens: result.usage.cachedInputTokens,
    },
    applied: {
      model: effectiveModel,
      auto: auto !== null,
      tier: auto?.tier,
      reason: auto?.reason,
      provider: plan.provider,
      effort: plan.effort,
      cache: plan.cacheSystem,
      temperatureSent: plan.sendTemperature,
    },
  };
}
