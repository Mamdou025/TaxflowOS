// ─────────────────────────────────────────────────────────────────────────────
// Agent Lab — CLIENT-SAFE catalog (no secrets, no server imports).
//
// This file is imported by BOTH the builder page (browser) and the server, so it
// must contain ONLY plain data + types. The actual tool code lives in tools.ts;
// the run loop lives in agent.ts. Keep the TOOL_CATALOG ids in sync with tools.ts.
// ─────────────────────────────────────────────────────────────────────────────

export const AGENT_NAME = 'Sina';

export const DEFAULT_SYSTEM_PROMPT =
  `You are ${AGENT_NAME}, a helpful, precise agent used to evaluate how agents work. ` +
  `You have tools available — call a tool whenever it helps you answer accurately ` +
  `instead of guessing. When you use a tool, briefly say what you did and what you ` +
  `found. Be concise and honest about uncertainty.`;

// How the model id is resolved on the server (see resolveModel in agent.ts):
//   • a bare id ("gpt-4o")            → direct OpenAI provider  (OPENAI_API_KEY)
//   • a "provider/model" string       → Vercel AI Gateway       (AI_GATEWAY_API_KEY)
// The gateway path is how you switch to non-OpenAI models with NO new dependency.
export type ModelVia = 'openai' | 'gateway' | 'auto';

// `blurb` = a one-line "particularity" (what it's good at). Rough guidance only —
// exact context window + pricing live on each model's page at vercel.com/ai-gateway/models.
export const MODEL_OPTIONS: { id: string; label: string; via: ModelVia; blurb: string }[] = [
  // Sina (auto): don't pin a model — Sina reads the question and routes to the right tier.
  { id: AUTO_MODEL_ID, label: 'Sina (auto — picks the model per question)', via: 'auto', blurb: 'Sina reads each question and routes it: Haiku 4.5 (quick reads/lookups), Sonnet 5 (Q&A/analysis), Opus 4.8 (tax logic & calculations). Uses the gateway (AI_GATEWAY_API_KEY).' },
  // Direct OpenAI (uses OPENAI_API_KEY — no gateway needed)
  { id: 'gpt-4o', label: 'gpt-4o — direct OpenAI', via: 'openai', blurb: 'Fast, capable multimodal — a reliable general default.' },
  { id: 'gpt-4o-mini', label: 'gpt-4o-mini — direct OpenAI', via: 'openai', blurb: 'Cheapest OpenAI — good for simple, high-volume tasks.' },
  { id: 'gpt-5', label: 'gpt-5 — direct OpenAI', via: 'openai', blurb: "OpenAI's frontier — strongest general reasoning." },
  // Via the Vercel AI Gateway (uses AI_GATEWAY_API_KEY). One key → any model at
  // vercel.com/ai-gateway/models — paste any "provider/model" id in the custom box.
  { id: 'openai/gpt-5.6-sol', label: 'openai/gpt-5.6-sol — Gateway', via: 'gateway', blurb: 'OpenAI frontier tier, via the gateway.' },
  { id: 'anthropic/claude-haiku-4-5', label: 'anthropic/claude-haiku-4-5 — Gateway', via: 'gateway', blurb: 'Anthropic — fastest & cheapest. Quick reads / extraction / high volume (200K context).' },
  { id: 'anthropic/claude-sonnet-5', label: 'anthropic/claude-sonnet-5 — Gateway', via: 'gateway', blurb: 'Anthropic — near-Opus quality at Sonnet cost. Everyday default (1M context).' },
  { id: 'anthropic/claude-opus-4-8', label: 'anthropic/claude-opus-4-8 — Gateway', via: 'gateway', blurb: 'Anthropic — flagship reasoning. Tax logic & subtle cross-references (1M context).' },
  { id: 'anthropic/claude-fable-5', label: 'anthropic/claude-fable-5 — Gateway', via: 'gateway', blurb: 'Anthropic — most capable overall (premium). Reserve for the very hardest reasoning.' },
  { id: 'google/gemini-3.6-flash', label: 'google/gemini-3.6-flash — Gateway', via: 'gateway', blurb: 'Google — very fast & cheap, huge context window.' },
  { id: 'xai/grok-4.5', label: 'xai/grok-4.5 — Gateway', via: 'gateway', blurb: 'xAI — strong reasoning with fresh knowledge.' },
  { id: 'moonshotai/kimi-k3', label: 'moonshotai/kimi-k3 — Gateway', via: 'gateway', blurb: 'Moonshot — very long context, strong at coding.' },
  { id: 'zai/glm-5.2', label: 'zai/glm-5.2 — Gateway', via: 'gateway', blurb: 'Zhipu — capable general model, cost-effective.' },
];

// The three tool categories you asked to see, so you can tell "what is what".
export type ToolCategory = 'template' | 'real' | 'retrieval' | 'workflow-template' | 'workflow-action';

export const CATEGORY_LABEL: Record<ToolCategory, string> = {
  template: 'Template / demo tools',
  real: 'Your real capabilities',
  retrieval: 'Document retrieval (RAG)',
  'workflow-template': 'Template workflows',
  'workflow-action': 'Workflow-builder actions',
};

export const CATEGORY_HINT: Record<ToolCategory, string> = {
  template: 'Safe sandbox — always work, nothing to break. Best for learning how tool calls fire.',
  real: 'Hit live data / your real integrations. Real output.',
  retrieval:
    'Search big attached files by keyword and pull only the matching passages into context — instead of loading the whole file. Watch it fire in the provenance panel.',
  'workflow-template':
    'Multi-input calculations. Give the inputs by typing them or attaching a file, then ask the agent to run it.',
  'workflow-action':
    'Your builder actions (focusBlock, addBlock…). On THIS page they only echo the call — they act for real on the workflow-builder canvas.',
};

export type ToolInfo = {
  id: string;
  label: string;
  category: ToolCategory;
  real: boolean;
  desc: string;
};

export const TOOL_CATALOG: ToolInfo[] = [
  { id: 'getCurrentDateTime', label: 'Current date & time', category: 'template', real: true, desc: 'Returns the server date/time.' },
  { id: 'calculate', label: 'Calculator', category: 'template', real: true, desc: 'Evaluates basic arithmetic like 18% of 240.' },
  { id: 'getWeatherDemo', label: 'Weather (demo)', category: 'template', real: false, desc: 'Fake weather data so you can watch a tool fire.' },
  { id: 'rememberNote', label: 'Remember a note', category: 'template', real: true, desc: 'Saves a note in memory (resets when the server restarts).' },
  { id: 'recallNotes', label: 'Recall notes', category: 'template', real: true, desc: 'Lists notes saved this session.' },
  { id: 'getFxRate', label: 'FX rate (Bank of Canada)', category: 'real', real: true, desc: 'Live annual-average exchange rate — your real FAPI source.' },
  { id: 'fetchWebPage', label: 'Fetch web page', category: 'real', real: true, desc: 'Fetches a public URL and returns its readable text (up to ~15k chars).' },
  { id: 'searchCanadianTax', label: 'CRA / canada.ca tax lookup', category: 'real', real: true, desc: 'Live web search restricted to official Canadian tax sources (canada.ca, CRA). Returns titles + URLs + snippets to cite. Needs FIRECRAWL_API_KEY.' },
  { id: 'searchDocuments', label: 'Search documents (keyword RAG)', category: 'retrieval', real: true, desc: 'Keyword-search your attached files and return only the most relevant passages. Lets the agent read files too big to load whole.' },
  { id: 'estimateForeignIncomeTax', label: 'Foreign-income tax estimate (3 inputs)', category: 'workflow-template', real: true, desc: 'Give income + currency + year → converts to CAD (live FX) and estimates combined corporate tax with a $500k small-business threshold.' },
  { id: 'focusBlock', label: 'focusBlock', category: 'workflow-action', real: false, desc: 'Builder action — echoes the call here (acts for real on the canvas).' },
  { id: 'addBlock', label: 'addBlock', category: 'workflow-action', real: false, desc: 'Builder action — echoes the call so you can see the agent choose it.' },
  { id: 'editBlockConfig', label: 'editBlockConfig', category: 'workflow-action', real: false, desc: 'Builder action — echoes the call.' },
];

// ── Request / response shapes shared by the page and the route ────────────────
import { AUTO_MODEL_ID } from './model-router';
import type { EffortLevel, ModelProvider, TaskTier } from './model-router';

export type AgentLabMessage = { role: 'user' | 'assistant'; content: string };

// A document/file the user attached — extracted to plain text and injected into
// the agent's context. This is the "memory / knowledge" the agent can read.
export type AgentLabDoc = { name: string; text: string };

// How attached documents reach the agent:
//   'full'      → the whole text is loaded into the system prompt every turn
//   'retrieval' → the text is NOT loaded; the agent calls searchDocuments to pull
//                 only the relevant passages (handles files too big to load whole)
export type DocMode = 'full' | 'retrieval';

export type AgentLabRequest = {
  model: string;
  system: string;
  temperature: number;
  maxSteps: number;
  enabledTools: string[];
  messages: AgentLabMessage[];
  documents: AgentLabDoc[];
  docMode: DocMode;
  /** Anthropic thinking-depth dial. Omit (or send undefined) for the model default. */
  effort?: EffortLevel;
};

export type AgentLabStep = {
  step: number;
  text: string;
  toolCalls: { tool: string; input: unknown }[];
  toolResults: { tool: string; output: unknown }[];
};

export type AgentLabUsage = {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  /** Tokens served from the prompt cache this turn (~10% of input price). 0/undefined = no cache hit. */
  cachedInputTokens?: number;
};

// What the model router actually applied this turn (for the provenance panel).
export type AgentLabApplied = {
  /** The concrete model actually used — for Sina (auto), the model it picked. */
  model: string;
  /** True when the user chose Sina (auto) and the router selected the model. */
  auto: boolean;
  /** Auto-routing tier + one-line reason (only set when `auto`). */
  tier?: TaskTier;
  reason?: string;
  provider: ModelProvider;
  effort?: EffortLevel;
  cache: boolean;
  temperatureSent: boolean;
};

// What documents actually reached the model this turn (after the server's size
// cap), so the provenance panel can report it truthfully.
export type AgentLabDocContext = { count: number; chars: number; names: string[] };

export type AgentLabResponse = {
  text: string;
  steps: AgentLabStep[];
  usage?: AgentLabUsage;
  docContext?: AgentLabDocContext;
  applied?: AgentLabApplied;
  error?: string;
};
