'use client';

// ─────────────────────────────────────────────────────────────────────────────
// Agent Lab — the builder page (browser).
//
// Left  = config: a Models reference, the sectioned system prompt, a MEMORY panel
//         (attach files/docs → context), tools, an ACCESS panel (what the agent can
//         see + a live context-size meter), and a NOTES pad.
// Right = one OR MORE chat columns ("lanes"), each running the SAME agent config on
//         a DIFFERENT model. One shared composer sends your message to every column
//         at once, so you can compare models side by side. Under each answer a
//         PROVENANCE panel shows where it came from (tools / documents / model).
//
// Standalone: rendered without the global nav (see components/app-shell.tsx),
// calls POST /api/agent-lab, and does NOT use or affect the main CopilotKit chat.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  AGENT_NAME,
  CATEGORY_HINT,
  CATEGORY_LABEL,
  MODEL_OPTIONS,
  TOOL_CATALOG,
  type AgentLabApplied,
  type AgentLabDocContext,
  type AgentLabResponse,
  type AgentLabStep,
  type AgentLabUsage,
  type DocMode,
  type ToolCategory,
} from '@/features/agent-lab/catalog';
import { AUTO_MODEL_ID, EFFORT_LEVELS, planForModel, type EffortLevel } from '@/features/agent-lab/model-router';
import { selectContext } from '@/features/agent-lab/context-router';
import {
  CURRENCIES,
  DEFAULT_FISCAL_CONTEXT,
  ENTITY_TYPES,
  PROVINCES,
  RESIDENCY,
  fiscalPreamble,
  fiscalSummary,
  type FiscalContext,
} from '@/features/agent-lab/fiscal';

type TurnContext = {
  model: string;
  system: string;
  enabledTools: string[];
  messageCount: number;
  documents: string[];
  effort: EffortLevel | 'auto';
  // Context scope — what was actually sent this turn vs. what was available.
  scope: 'full' | 'auto';
  selection?: { reason: string; sentSections: number; totalSections: number; sentTools: number; totalTools: number };
  // Fiscal-mode stamp (year · jurisdiction · entity · residency · currency), when on.
  fiscal?: string;
};

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  steps?: AgentLabStep[];
  usage?: AgentLabUsage;
  docContext?: AgentLabDocContext;
  applied?: AgentLabApplied;
  context?: TurnContext;
};

// A "lane" = one chat column bound to one model. Multiple lanes = side-by-side compare.
type Lane = { id: string; model: string; customModel: string; messages: ChatMessage[]; loading: boolean };

type LabDoc = { name: string; text: string; chars: number; truncated: boolean; enabled: boolean };

const CATEGORY_ORDER: ToolCategory[] = ['template', 'real', 'retrieval', 'workflow-template', 'workflow-action'];
const ACCEPT =
  '.pdf,.docx,.xlsx,.xls,.txt,.md,.markdown,.csv,.tsv,.json,.log,.yml,.yaml,.xml,.html,.htm,.rtf';
const MAX_DOC_CHARS = 120_000;
const MAX_LANES = 3;

// Extract one attached file to plain text. Excel is parsed in the BROWSER (every
// sheet → CSV, matching the Document Viewer; `xlsx` is lazy-loaded only when an
// Excel file is dropped). Everything else goes through the shared extraction route.
type ExtractResult = { name: string; text: string; chars: number; truncated: boolean } | { error: string };

async function extractFile(file: File): Promise<ExtractResult> {
  const isExcel =
    /\.(xlsx|xls)$/i.test(file.name) ||
    file.type.includes('spreadsheetml') ||
    file.type === 'application/vnd.ms-excel';

  if (isExcel) {
    try {
      const XLSX = await import('xlsx');
      const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
      const parts = wb.SheetNames.map((n) => `# Sheet: ${n}\n${XLSX.utils.sheet_to_csv(wb.Sheets[n])}`);
      let text = parts.join('\n\n');
      if (!text.trim()) {
        return { error: 'the workbook has no readable cells' };
      }
      const truncated = text.length > MAX_DOC_CHARS;
      if (truncated) {
        text = text.slice(0, MAX_DOC_CHARS);
      }
      return { name: file.name, text, chars: text.length, truncated };
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'could not read the workbook' };
    }
  }

  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/assistant/extract', { method: 'POST', body: fd });
  const data = (await res.json()) as { fileName?: string; chars?: number; truncated?: boolean; text?: string; error?: string };
  const text = data.text;
  if (data.error || !text) {
    return { error: data.error ?? 'no readable text found' };
  }
  return { name: data.fileName ?? file.name, text, chars: data.chars ?? text.length, truncated: !!data.truncated };
}

// The system prompt is authored as SECTIONS ("folders") for ONE agent. The final
// prompt is every ENABLED section, in order, joined together.
type PromptSection = { id: string; name: string; content: string; enabled: boolean };

const DEFAULT_SECTIONS: PromptSection[] = [
  { id: 'role', name: 'Role', enabled: true, content: 'You are Sina, a helpful, precise agent used to evaluate how agents work.' },
  {
    id: 'tools',
    name: 'Tool use',
    enabled: true,
    content:
      'You have tools available — call a tool whenever it helps you answer accurately instead of guessing. When you use a tool, briefly say what you did and what you found.',
  },
  { id: 'style', name: 'Style', enabled: true, content: 'Be concise and honest about uncertainty.' },
];

function assembleSystemPrompt(sections: PromptSection[]): string {
  return sections
    .filter((s) => s.enabled && s.content.trim())
    .map((s) => (s.name.trim() ? `## ${s.name.trim()}\n${s.content.trim()}` : s.content.trim()))
    .join('\n\n');
}

// A saved, named set of sections — a reusable "prompt" you can load back later.
type SavedPrompt = { id: string; name: string; sections: PromptSection[] };

export default function AgentLabPage({ embedded = false }: { embedded?: boolean } = {}) {
  const [temperature, setTemperature] = useState(0.7);
  const [maxSteps, setMaxSteps] = useState(6);
  // Effort = Anthropic thinking-depth dial. 'auto' → don't send it (model default).
  // Ignored for non-Anthropic models and for Haiku 4.5 / Sonnet 4.5 (see model-router).
  const [effort, setEffort] = useState<EffortLevel | 'auto'>('auto');
  // Context scope. 'full' = send all folders + tools every turn; 'auto' = a per-turn
  // intent step (context-router) picks only the relevant folders + tools for the question.
  const [scope, setScope] = useState<'full' | 'auto'>('full');
  // Fiscal mode = the tax/fiscalist non-negotiables (features/agent-lab/fiscal.ts). When on,
  // the pinned fiscal context + policy is prepended (un-prunable) to the system prompt.
  const [fiscalMode, setFiscalMode] = useState(false);
  const [fiscal, setFiscal] = useState<FiscalContext>(DEFAULT_FISCAL_CONTEXT);
  const [fiscalLoaded, setFiscalLoaded] = useState(false);
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(TOOL_CATALOG.map((t) => [t.id, true]))
  );

  // Chat columns. One lane by default; add up to MAX_LANES for side-by-side compare.
  const [lanes, setLanes] = useState<Lane[]>([
    { id: 'lane-1', model: 'gpt-4o', customModel: '', messages: [], loading: false },
  ]);

  // The system prompt, authored as toggleable SECTIONS ("folders") for one agent.
  const [sections, setSections] = useState<PromptSection[]>(DEFAULT_SECTIONS);
  const [sectionsLoaded, setSectionsLoaded] = useState(false);
  const system = assembleSystemPrompt(sections);

  // A library of named prompt sets (separate from the auto-persisted current set).
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [savedLoaded, setSavedLoaded] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [selectedSaved, setSelectedSaved] = useState('');

  const [docs, setDocs] = useState<LabDoc[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [docMode, setDocMode] = useState<DocMode>('full');
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load/save your notes locally so they survive a refresh.
  useEffect(() => {
    const saved = localStorage.getItem('agent-lab-notes');
    if (saved) {
      setNotes(saved);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('agent-lab-notes', notes);
  }, [notes]);

  // Load saved sections once; then persist any change.
  useEffect(() => {
    try {
      const raw = localStorage.getItem('agent-lab-sections');
      if (raw) {
        const parsed = JSON.parse(raw) as PromptSection[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSections(parsed);
        }
      }
    } catch {
      // ignore malformed storage
    }
    setSectionsLoaded(true);
  }, []);
  useEffect(() => {
    if (!sectionsLoaded) {
      return;
    }
    localStorage.setItem('agent-lab-sections', JSON.stringify(sections));
  }, [sections, sectionsLoaded]);

  // Fiscal mode + context — load once, then persist any change.
  useEffect(() => {
    try {
      const raw = localStorage.getItem('agent-lab-fiscal');
      if (raw) {
        const parsed = JSON.parse(raw) as { mode?: boolean; ctx?: Partial<FiscalContext> };
        if (typeof parsed.mode === 'boolean') {
          setFiscalMode(parsed.mode);
        }
        if (parsed.ctx) {
          setFiscal({ ...DEFAULT_FISCAL_CONTEXT, ...parsed.ctx });
        }
      }
    } catch {
      // ignore malformed storage
    }
    setFiscalLoaded(true);
  }, []);
  useEffect(() => {
    if (!fiscalLoaded) {
      return;
    }
    localStorage.setItem('agent-lab-fiscal', JSON.stringify({ mode: fiscalMode, ctx: fiscal }));
  }, [fiscalMode, fiscal, fiscalLoaded]);

  // The saved-prompt library — load once, then persist any change.
  useEffect(() => {
    try {
      const raw = localStorage.getItem('agent-lab-saved-prompts');
      if (raw) {
        const parsed = JSON.parse(raw) as SavedPrompt[];
        if (Array.isArray(parsed)) {
          setSavedPrompts(parsed);
        }
      }
    } catch {
      // ignore malformed storage
    }
    setSavedLoaded(true);
  }, []);
  useEffect(() => {
    if (!savedLoaded) {
      return;
    }
    localStorage.setItem('agent-lab-saved-prompts', JSON.stringify(savedPrompts));
  }, [savedPrompts, savedLoaded]);

  const enabledTools = Object.keys(enabled).filter((k) => enabled[k]);
  const activeDocs = docs.filter((d) => d.enabled);
  const anyLoading = lanes.some((l) => l.loading);
  const allEmpty = lanes.every((l) => l.messages.length === 0);

  // Live estimate of the context sent this turn (system + docs + longest conversation).
  const docChars = docMode === 'full' ? activeDocs.reduce((sum, d) => sum + d.text.length, 0) : 0;
  const convoChars = Math.max(0, ...lanes.map((l) => l.messages.reduce((s, m) => s + m.content.length, 0)));
  const convoCount = Math.max(0, ...lanes.map((l) => l.messages.length));
  const contextChars = system.length + docChars + convoChars;
  const estTokens = Math.round(contextChars / 4);

  // ── section helpers ──────────────────────────────────────────────
  function updateSection(id: string, patch: Partial<PromptSection>) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }
  function addSection() {
    setSections((prev) => [...prev, { id: crypto.randomUUID(), name: 'New section', content: '', enabled: true }]);
  }
  function removeSection(id: string) {
    setSections((prev) => prev.filter((s) => s.id !== id));
  }
  function moveSection(id: string, dir: -1 | 1) {
    setSections((prev) => {
      const i = prev.findIndex((s) => s.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) {
        return prev;
      }
      const next = [...prev];
      const [item] = next.splice(i, 1);
      next.splice(j, 0, item);
      return next;
    });
  }

  // ── saved prompt library ─────────────────────────────────────────
  function saveCurrentPrompt() {
    const name = saveName.trim();
    if (!name) {
      return;
    }
    // Overwrite a same-named entry; otherwise add a new one.
    setSavedPrompts((prev) => {
      const existing = prev.find((p) => p.name === name);
      const entry: SavedPrompt = { id: existing?.id ?? crypto.randomUUID(), name, sections };
      return existing ? prev.map((p) => (p.name === name ? entry : p)) : [...prev, entry];
    });
    setSaveName('');
  }
  function loadSavedPrompt(id: string) {
    const found = savedPrompts.find((p) => p.id === id);
    if (found) {
      setSections(found.sections.map((s) => ({ ...s })));
    }
  }
  function deleteSavedPrompt(id: string) {
    setSavedPrompts((prev) => prev.filter((p) => p.id !== id));
    setSelectedSaved('');
  }

  // ── lane helpers ─────────────────────────────────────────────────
  function updateLane(id: string, patch: Partial<Lane>) {
    setLanes((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }
  function addLane() {
    setLanes((prev) => {
      if (prev.length >= MAX_LANES) {
        return prev;
      }
      const nextModel = MODEL_OPTIONS[prev.length % MODEL_OPTIONS.length].id;
      return [...prev, { id: crypto.randomUUID(), model: nextModel, customModel: '', messages: [], loading: false }];
    });
  }
  function removeLane(id: string) {
    setLanes((prev) => (prev.length <= 1 ? prev : prev.filter((l) => l.id !== id)));
  }
  function clearAll() {
    setLanes((prev) => prev.map((l) => ({ ...l, messages: [] })));
  }

  // ── documents ────────────────────────────────────────────────────
  async function addFiles(files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }
    setExtracting(true);
    setError('');
    for (const file of Array.from(files)) {
      try {
        const result = await extractFile(file);
        if ('error' in result) {
          setError(`${file.name}: ${result.error}`);
          continue;
        }
        setDocs((prev) => [...prev, { ...result, enabled: true }]);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    }
    setExtracting(false);
  }
  function toggleDoc(index: number) {
    setDocs((prev) => prev.map((d, i) => (i === index ? { ...d, enabled: !d.enabled } : d)));
  }
  function removeDoc(index: number) {
    setDocs((prev) => prev.filter((_, i) => i !== index));
  }

  // ── send the same message to every lane, each on its own model ──
  function send() {
    const text = inputText.trim();
    if (!text || anyLoading) {
      return;
    }
    setError('');
    setInputText('');

    const turnDocs = activeDocs.map((d) => ({ name: d.name, text: d.text }));
    const docNames = activeDocs.map((d) => d.name);
    const snapshot = lanes;
    const userMsg: ChatMessage = { role: 'user', content: text };

    // Context scope: in 'auto', a per-turn intent step picks only the folders + tools
    // relevant to THIS question (shared across lanes — same prompt/tools, only model differs).
    const enabledSections = sections.filter((s) => s.enabled && s.content.trim());
    let sentSystem = system;
    let sentTools = enabledTools;
    let selection: TurnContext['selection'];
    if (scope === 'auto') {
      const sel = selectContext(
        text,
        enabledSections.map((s) => ({ id: s.id, name: s.name, content: s.content })),
        enabledTools.map((id) => {
          const c = TOOL_CATALOG.find((t) => t.id === id);
          return { id, label: c?.label ?? id, desc: c?.desc ?? '' };
        })
      );
      sentSystem = assembleSystemPrompt(sections.filter((s) => sel.sectionIds.includes(s.id)));
      sentTools = enabledTools.filter((id) => sel.toolIds.includes(id));
      selection = { reason: sel.reason, sentSections: sel.sectionIds.length, totalSections: enabledSections.length, sentTools: sentTools.length, totalTools: enabledTools.length };
    }

    // Fiscal mode: prepend the non-negotiables preamble AFTER scoping, so it is always
    // present (never pruned) and sits first in the system prompt.
    const fiscalStamp = fiscalMode ? fiscalSummary(fiscal) : undefined;
    if (fiscalMode) {
      sentSystem = `${fiscalPreamble(fiscal)}\n\n${sentSystem}`;
    }

    // Optimistic: show the user message + spinner in every column.
    setLanes((prev) => prev.map((l) => ({ ...l, messages: [...l.messages, userMsg], loading: true })));

    for (const lane of snapshot) {
      const laneModel = lane.customModel.trim() || lane.model;
      const nextMessages = [...lane.messages, userMsg];
      const turnContext: TurnContext = { model: laneModel, system: sentSystem, enabledTools: sentTools, messageCount: nextMessages.length, documents: docNames, effort, scope, selection, fiscal: fiscalStamp };
      void (async () => {
        try {
          const res = await fetch('/api/agent-lab', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: laneModel,
              system: sentSystem,
              temperature,
              maxSteps,
              enabledTools: sentTools,
              messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
              documents: turnDocs,
              docMode,
              effort: effort === 'auto' ? undefined : effort,
            }),
          });
          const data = (await res.json()) as AgentLabResponse;
          const assistantMsg: ChatMessage = data.error
            ? { role: 'assistant', content: `⚠️ ${data.error}` }
            : { role: 'assistant', content: data.text, steps: data.steps, usage: data.usage, docContext: data.docContext, applied: data.applied, context: turnContext };
          setLanes((prev) => prev.map((l) => (l.id === lane.id ? { ...l, loading: false, messages: [...l.messages, assistantMsg] } : l)));
        } catch (e) {
          const msg: ChatMessage = { role: 'assistant', content: `⚠️ ${e instanceof Error ? e.message : String(e)}` };
          setLanes((prev) => prev.map((l) => (l.id === lane.id ? { ...l, loading: false, messages: [...l.messages, msg] } : l)));
        }
      })();
    }
  }

  return (
    <div className={`${embedded ? 'w-full' : 'mx-auto max-w-7xl'} px-4 pb-16 text-neutral-900 dark:text-neutral-100`}>
      <input ref={fileInputRef} type="file" multiple accept={ACCEPT} className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />

      {/* ── Sticky header with BACK button — only for the standalone /agent-lab route.
          When embedded as the Agent page's "Lab" tab, the platform chrome (tabs) owns
          the header, so we drop the back-link + title. ─────────────────────────── */}
      {!embedded && (
        <header className="sticky top-0 z-10 -mx-4 mb-4 flex items-center gap-3 border-b border-neutral-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
          <Link href="/" className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800">
            ← Back to main
          </Link>
          <div>
            <h1 className="text-base font-semibold">🤖 {AGENT_NAME} — Agent Lab</h1>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Configure the agent once, then compare it across models side by side.
            </p>
          </div>
        </header>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[400px_1fr]">
        {/* ── LEFT: CONFIG ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <Section title="Models — pick one per column">
            <p className="mb-2 text-[11px] text-neutral-500 dark:text-neutral-400">
              Rough guidance — exact context window & pricing are on{' '}
              <a href="https://vercel.com/ai-gateway/models" target="_blank" rel="noreferrer" className="underline">
                the gateway catalog ↗
              </a>
              . Gateway models need <code>AI_GATEWAY_API_KEY</code>; type any <code>provider/model</code> id in a column's custom box.
            </p>
            <div className="space-y-1.5">
              {MODEL_OPTIONS.map((m) => (
                <div key={m.id} className="text-[12px]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[11px]">{m.id}</span>
                    <span
                      className={`rounded px-1 text-[10px] ${m.via === 'auto' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : m.via === 'gateway' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'}`}
                    >
                      {m.via === 'auto' ? 'Auto' : m.via === 'gateway' ? 'Gateway' : 'Direct'}
                    </span>
                  </div>
                  <div className="text-neutral-500 dark:text-neutral-400">{m.blurb}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="System prompt — sections (folders)">
            <div className="mb-2 flex flex-col gap-1.5 border-b border-neutral-200 pb-2 dark:border-neutral-800">
              <div className="flex gap-1.5">
                <select className={`${fieldClass} flex-1`} value={selectedSaved} onChange={(e) => setSelectedSaved(e.target.value)}>
                  <option value="">— load a saved prompt —</option>
                  {savedPrompts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedSaved) {
                      loadSavedPrompt(selectedSaved);
                    }
                  }}
                  disabled={!selectedSaved}
                  className={smallBtn}
                >
                  Load
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedSaved) {
                      deleteSavedPrompt(selectedSaved);
                    }
                  }}
                  disabled={!selectedSaved}
                  className={smallBtn}
                >
                  Delete
                </button>
              </div>
              <div className="flex gap-1.5">
                <input className={`${fieldClass} flex-1`} placeholder="Name to save these sections…" value={saveName} onChange={(e) => setSaveName(e.target.value)} />
                <button type="button" onClick={saveCurrentPrompt} disabled={!saveName.trim()} className={smallBtn}>
                  💾 Save
                </button>
              </div>
            </div>
            {sections.map((s, i) => (
              <div key={s.id} className="mb-2 rounded-lg border border-neutral-200 p-2 dark:border-neutral-800">
                <div className="flex items-center gap-1.5">
                  <input type="checkbox" checked={s.enabled} onChange={(e) => updateSection(s.id, { enabled: e.target.checked })} title="include this section in the prompt" />
                  <input
                    className="flex-1 bg-transparent text-[12px] font-semibold outline-none"
                    value={s.name}
                    onChange={(e) => updateSection(s.id, { name: e.target.value })}
                    placeholder="Section name"
                  />
                  <button type="button" onClick={() => moveSection(s.id, -1)} disabled={i === 0} className={tinyBtn} title="move up">
                    ↑
                  </button>
                  <button type="button" onClick={() => moveSection(s.id, 1)} disabled={i === sections.length - 1} className={tinyBtn} title="move down">
                    ↓
                  </button>
                  <button type="button" onClick={() => removeSection(s.id)} className={tinyBtn} title="remove section">
                    ×
                  </button>
                </div>
                <textarea
                  className={`${fieldClass} mt-1.5 min-h-[70px] resize-y ${s.enabled ? '' : 'opacity-50'}`}
                  value={s.content}
                  onChange={(e) => updateSection(s.id, { content: e.target.value })}
                  placeholder="Instructions for this section…"
                />
              </div>
            ))}
            <button type="button" onClick={addSection} className="rounded-lg border border-neutral-300 px-3 py-1.5 text-[13px] hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800">
              + Add section
            </button>
            <p className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400">
              Combined (in order) into ONE system prompt, shared by every model column. Your current sections
              auto-save and survive a refresh; use <b>💾 Save</b> above to keep multiple named versions.
            </p>
          </Section>

          {/* ── MEMORY / KNOWLEDGE ───────────────────────────────────── */}
          <Section title="Memory / knowledge (files & documents)">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-lg border border-neutral-300 px-3 py-1.5 text-[13px] hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800">
              + Add files
            </button>
            {extracting && <p className="mt-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">Reading file(s)…</p>}
            {docs.length === 0 && (
              <p className="mt-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                No documents yet. Add PDF / Word / Excel / text files — their text becomes context every column reads.
              </p>
            )}
            {docs.map((d, i) => (
              <div key={i} className="mt-1.5 flex items-center gap-2 text-[12px]">
                <input type="checkbox" checked={d.enabled} onChange={() => toggleDoc(i)} />
                <span className="flex-1 truncate" title={d.name}>
                  {d.name}
                </span>
                <span className="text-neutral-400">
                  {d.chars.toLocaleString()} ch{d.truncated ? ' (cut)' : ''}
                </span>
                <button type="button" onClick={() => removeDoc(i)} className="text-neutral-400 hover:text-red-500" title="remove">
                  ×
                </button>
              </div>
            ))}
            <p className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400">
              Reads PDF, Word, Excel (.xlsx/.xls) and text. Excel sheets are flattened to CSV. Large files are capped so context stays affordable.
            </p>

            <div className="mt-3 border-t border-neutral-200 pt-2 dark:border-neutral-800">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-300">How the agent uses documents</div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setDocMode('full')}
                  className={`flex-1 rounded-lg border px-2 py-1.5 text-[12px] ${docMode === 'full' ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'border-neutral-300 dark:border-neutral-700'}`}
                >
                  📄 Full text in context
                </button>
                <button
                  type="button"
                  onClick={() => setDocMode('retrieval')}
                  className={`flex-1 rounded-lg border px-2 py-1.5 text-[12px] ${docMode === 'retrieval' ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'border-neutral-300 dark:border-neutral-700'}`}
                >
                  🔍 Retrieve on demand
                </button>
              </div>
              <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                {docMode === 'full'
                  ? 'The whole file is loaded into context every turn — simple, but limited by size and cost.'
                  : 'The file is NOT loaded. The agent calls the “Search documents” tool to pull only relevant passages — this handles big files.'}
              </p>
              {docMode === 'retrieval' && !enabled.searchDocuments && (
                <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400">⚠ Enable the “Search documents” tool below for retrieval mode to work.</p>
              )}
            </div>
          </Section>

          <Section title="Tools the agent may use">
            {CATEGORY_ORDER.map((cat) => (
              <div key={cat} className="mb-3 last:mb-0">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-300">{CATEGORY_LABEL[cat]}</div>
                <div className="mb-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">{CATEGORY_HINT[cat]}</div>
                {TOOL_CATALOG.filter((t) => t.category === cat).map((t) => (
                  <label key={t.id} className="mb-1 flex cursor-pointer items-start gap-2 text-[13px]" title={t.desc}>
                    <input type="checkbox" className="mt-0.5" checked={!!enabled[t.id]} onChange={(e) => setEnabled({ ...enabled, [t.id]: e.target.checked })} />
                    <span>
                      {t.label}
                      {!t.real && <span className="text-amber-600 dark:text-amber-400"> (demo)</span>}
                    </span>
                  </label>
                ))}
              </div>
            ))}
          </Section>

          <Section title="Fiscal mode (tax guardrails)">
            <label className="flex items-start gap-2 text-[12px]">
              <input type="checkbox" className="mt-0.5" checked={fiscalMode} onChange={(e) => setFiscalMode(e.target.checked)} />
              <span>Enforce the fiscalist non-negotiables — cite the authority · never self-compute figures · pin tax year / jurisdiction / entity · defer on elections &amp; positions · flag uncertainty.</span>
            </label>
            {fiscalMode && (
              <>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <label className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Tax year
                    <input className={`${fieldClass} mt-1`} type="number" min={2000} max={2100} value={fiscal.taxYear} onChange={(e) => setFiscal((f) => ({ ...f, taxYear: Number(e.target.value) }))} />
                  </label>
                  <label className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Province / jurisdiction
                    <select className={`${fieldClass} mt-1`} value={fiscal.province} onChange={(e) => setFiscal((f) => ({ ...f, province: e.target.value }))}>
                      {PROVINCES.map((p) => (
                        <option key={p.code} value={p.code}>{p.label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Entity type
                    <select className={`${fieldClass} mt-1`} value={fiscal.entityType} onChange={(e) => setFiscal((f) => ({ ...f, entityType: e.target.value }))}>
                      {ENTITY_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Residency
                    <select className={`${fieldClass} mt-1`} value={fiscal.residency} onChange={(e) => setFiscal((f) => ({ ...f, residency: e.target.value }))}>
                      {RESIDENCY.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Reporting currency
                    <select className={`${fieldClass} mt-1`} value={fiscal.currency} onChange={(e) => setFiscal((f) => ({ ...f, currency: e.target.value }))}>
                      {CURRENCIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="mt-2 rounded-lg bg-emerald-50 px-2 py-1.5 text-[11px] text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Prepended (un-prunable) to the top of the system prompt: the pinned context + 5 non-negotiable rules. This turn's stamp: <b>{fiscalSummary(fiscal)}</b>. Testable guardrails here — graduate them into the live assistant runtime once tuned.
                </div>
              </>
            )}
          </Section>

          <Section title="Advanced (technical)">
            <div className="flex gap-3">
              <label className="flex-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                Temperature
                <input className={`${fieldClass} mt-1`} type="number" step={0.1} min={0} max={2} value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} />
              </label>
              <label className="flex-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                Max steps (loop cap)
                <input className={`${fieldClass} mt-1`} type="number" min={1} max={20} value={maxSteps} onChange={(e) => setMaxSteps(Number(e.target.value))} />
              </label>
              <label className="flex-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                Effort (Anthropic)
                <select className={`${fieldClass} mt-1`} value={effort} onChange={(e) => setEffort(e.target.value as EffortLevel | 'auto')}>
                  <option value="auto">auto (model default)</option>
                  {EFFORT_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-2 rounded-lg bg-neutral-100 px-2 py-1.5 text-[11px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              <b>Effort</b> is the thinking-depth dial (low → max): low for quick reads/extraction, high/xhigh for tax logic. Applies to Anthropic models only (Opus 4.6+/Sonnet 4.6+/Fable) — ignored by Haiku 4.5, Sonnet 4.5, and non-Anthropic models. Temperature is auto-dropped for models that reject it (Opus 4.7/4.8, Sonnet 5, Fable 5), and the attached-document block is prompt-cached on Anthropic so repeated runs read it cheaply.
            </div>

            <div className="mt-3">
              <div className="mb-1 text-[11px] font-medium text-neutral-600 dark:text-neutral-300">Context scope</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setScope('full')}
                  className={`flex-1 rounded-lg border px-2 py-1.5 text-[12px] ${scope === 'full' ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'border-neutral-300 dark:border-neutral-700'}`}
                >
                  Send all
                </button>
                <button
                  type="button"
                  onClick={() => setScope('auto')}
                  className={`flex-1 rounded-lg border px-2 py-1.5 text-[12px] ${scope === 'auto' ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'border-neutral-300 dark:border-neutral-700'}`}
                >
                  Auto (relevant only)
                </button>
              </div>
              <div className="mt-2 rounded-lg bg-neutral-100 px-2 py-1.5 text-[11px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                <b>Send all</b> gives the model every enabled folder + tool each turn (best prompt-cache reuse). <b>Auto</b> runs a per-turn intent step that keeps only the folders/tools whose keywords match the question — smaller, sharper context, but it can miss a relevant one (keyword match, same blind spot as the doc search) and it lowers cache reuse since the prefix changes per question. Compare tokens + answers in the provenance panel. Works best with domain-specific folders.
              </div>
            </div>
          </Section>

          {/* ── ACCESS PANEL ─────────────────────────────────────────── */}
          <Section title="What this agent can access right now">
            <ul className="space-y-1 text-[12px]">
              <li>✅ Its system prompt (the sections above)</li>
              <li>✅ This conversation ({convoCount} message{convoCount === 1 ? '' : 's'})</li>
              <li>
                ✅ {enabledTools.length} enabled tool{enabledTools.length === 1 ? '' : 's'}
                {enabledTools.length > 0 && <span className="text-neutral-500 dark:text-neutral-400">: {enabledTools.join(', ')}</span>}
              </li>
              <li>
                {activeDocs.length > 0 ? '✅' : '❌'} {activeDocs.length} attached document{activeDocs.length === 1 ? '' : 's'}
                {activeDocs.length > 0 && (
                  <span className="text-neutral-500 dark:text-neutral-400">
                    : {activeDocs.map((d) => d.name).join(', ')}
                    {docMode === 'retrieval' ? ' — retrieval mode (searched on demand)' : ' — loaded fully into context'}
                  </span>
                )}
              </li>
            </ul>
            <div className="mt-2 rounded-lg bg-neutral-100 px-2 py-1.5 text-[11px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              Estimated context this turn: <b>~{contextChars.toLocaleString()}</b> chars (~{estTokens.toLocaleString()} tokens). Shared across all model columns.
            </div>
          </Section>

          <Section title="Your notes (saved on this device)">
            <textarea className={`${fieldClass} min-h-[90px] resize-y`} placeholder="Jot what you notice about the agent as you test…" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Section>

          <button type="button" onClick={clearAll} className="rounded-lg border border-neutral-300 px-3 py-2 text-[13px] text-neutral-500 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800">
            Clear all conversations
          </button>
        </div>

        {/* ── RIGHT: SIDE-BY-SIDE CHAT COLUMNS ─────────────────────── */}
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {lanes.map((lane) => {
              const laneModel = lane.customModel.trim() || lane.model;
              return (
                <div key={lane.id} className="flex min-w-[340px] flex-1 flex-col gap-2">
                  <div className="flex items-center gap-1.5">
                    <select className={`${fieldClass} flex-1`} value={lane.model} onChange={(e) => updateLane(lane.id, { model: e.target.value })}>
                      {MODEL_OPTIONS.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.id}
                        </option>
                      ))}
                    </select>
                    {lanes.length > 1 && (
                      <button type="button" onClick={() => removeLane(lane.id)} className={tinyBtn} title="remove column">
                        ×
                      </button>
                    )}
                  </div>
                  <input
                    className={`${fieldClass} text-[12px]`}
                    placeholder="…or a custom model id"
                    value={lane.customModel}
                    onChange={(e) => updateLane(lane.id, { customModel: e.target.value })}
                  />
                  <div className="text-[10px] text-neutral-400">{laneModel === AUTO_MODEL_ID ? 'Auto — Sina picks the model per question (needs AI_GATEWAY_API_KEY)' : laneModel.includes('/') ? 'Gateway (AI_GATEWAY_API_KEY)' : 'Direct OpenAI (OPENAI_API_KEY)'}</div>

                  <div className="max-h-[60vh] min-h-[300px] flex-1 space-y-3 overflow-y-auto rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900">
                    {lane.messages.length === 0 && (
                      <p className="text-[12px] text-neutral-500 dark:text-neutral-400">
                        {lanes.length > 1 ? 'One message goes to every column — compare the answers.' : `Ask ${AGENT_NAME} anything, or 📎 attach a document.`}
                      </p>
                    )}
                    {lane.messages.map((m, i) => (
                      <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex flex-col items-start'}>
                        <div
                          className={
                            m.role === 'user'
                              ? 'max-w-[85%] rounded-lg bg-blue-600 px-3 py-2 text-sm whitespace-pre-wrap text-white'
                              : 'max-w-[95%] rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm whitespace-pre-wrap dark:border-neutral-700 dark:bg-neutral-800'
                          }
                        >
                          {m.content}
                        </div>
                        {m.role === 'assistant' && m.context && <Provenance msg={m} />}
                      </div>
                    ))}
                    {lane.loading && <p className="text-sm text-neutral-500 dark:text-neutral-400">{AGENT_NAME} is thinking…</p>}
                  </div>
                </div>
              );
            })}
            {lanes.length < MAX_LANES && (
              <button
                type="button"
                onClick={addLane}
                className="h-10 shrink-0 self-start rounded-lg border border-dashed border-neutral-300 px-3 text-[13px] text-neutral-500 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                title="Add a model column"
              >
                + Model
              </button>
            )}
          </div>

          {error && <p className="text-[13px] text-red-500">{error}</p>}

          {allEmpty && (
            <button
              type="button"
              onClick={() => setInputText('Estimate the Canadian corporate tax on 250,000 USD of income for tax year 2024.')}
              className="self-start rounded-lg border border-neutral-300 px-3 py-1.5 text-[12px] text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              ▶ Try: estimate tax on 250,000 USD (2024)
            </button>
          )}

          {activeDocs.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-neutral-400">In context:</span>
              {docs.map((d, i) =>
                d.enabled ? (
                  <span key={i} className="flex items-center gap-1 rounded-full border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-[11px] dark:border-neutral-700 dark:bg-neutral-800">
                    📄 {d.name}
                    <button type="button" onClick={() => removeDoc(i)} className="text-neutral-400 hover:text-red-500" title="remove">
                      ×
                    </button>
                  </span>
                ) : null
              )}
            </div>
          )}

          <div className="flex gap-2">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-lg border border-neutral-300 px-3 text-lg hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800" title="Attach a document to memory">
              📎
            </button>
            <input
              className={`${fieldClass} flex-1`}
              placeholder={lanes.length > 1 ? 'Message all models…' : `Message ${AGENT_NAME}…`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  send();
                }
              }}
            />
            <button type="button" onClick={send} disabled={anyLoading} className="rounded-lg bg-blue-600 px-5 text-sm text-white disabled:opacity-60">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Provenance panel: "where did this answer come from?" ─────────────────────
function Provenance({ msg }: { msg: ChatMessage }) {
  const ctx = msg.context;
  if (!ctx) {
    return null;
  }
  const toolCalls = (msg.steps ?? []).flatMap((s) => s.toolCalls.map((tc, j) => ({ tool: tc.tool, input: tc.input, output: s.toolResults[j]?.output })));
  const usedTools = toolCalls.length > 0;
  const docCount = msg.docContext?.count ?? ctx.documents.length;
  const docNames = msg.docContext?.names ?? ctx.documents;
  const cachedTokens = msg.usage?.cachedInputTokens ?? 0;
  // Prefer the server's applied plan (authoritative — it knows Sina's auto pick); fall
  // back to a client recompute for older messages that predate the router.
  const applied: AgentLabApplied =
    msg.applied ??
    (() => {
      const p = planForModel(ctx.model, { effort: ctx.effort === 'auto' ? undefined : ctx.effort });
      return { model: ctx.model, auto: false, provider: p.provider, effort: p.effort, cache: p.cacheSystem, temperatureSent: p.sendTemperature };
    })();

  return (
    <div className="mt-1.5 w-full max-w-[95%] rounded-lg border border-neutral-200 bg-white p-2 text-[11px] dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mb-1 font-semibold text-neutral-600 dark:text-neutral-300">Where this came from</div>

      {usedTools ? (
        <div className="mb-1 text-emerald-700 dark:text-emerald-400">
          Grounded in {toolCalls.length} tool call{toolCalls.length === 1 ? '' : 's'}: {toolCalls.map((t) => t.tool).join(', ')}
        </div>
      ) : (
        <div className="mb-1 text-amber-700 dark:text-amber-400">
          No tools used — the model’s own knowledge{docCount > 0 ? ' and/or your attached documents' : ' (not memory, documents, or files)'}.
        </div>
      )}

      {docCount > 0 && (
        <div className="mb-1 text-blue-700 dark:text-blue-400">
          📄 {docCount} document{docCount === 1 ? '' : 's'} in context: {docNames.join(', ')}
        </div>
      )}

      {toolCalls.map((t, j) => (
        <div key={j} className="mb-1 rounded border border-neutral-200 p-1.5 dark:border-neutral-800">
          <span className="font-mono text-blue-600 dark:text-blue-400">🔧 {t.tool}</span>
          <pre className="mt-0.5 overflow-x-auto whitespace-pre-wrap text-neutral-500 dark:text-neutral-400">in: {JSON.stringify(t.input)}</pre>
          <pre className="overflow-x-auto whitespace-pre-wrap text-neutral-500 dark:text-neutral-400">out: {JSON.stringify(t.output)}</pre>
        </div>
      ))}

      <details className="mt-1">
        <summary className="cursor-pointer text-neutral-500 dark:text-neutral-400">
          What the model received this turn{msg.usage?.totalTokens ? ` · ${msg.usage.totalTokens} tokens` : ''}
          {cachedTokens > 0 ? ` · ${cachedTokens.toLocaleString()} cached` : ''}
        </summary>
        <div className="mt-1 space-y-1 text-neutral-500 dark:text-neutral-400">
          <div>
            <b>Model:</b> {applied.model}
            {applied.auto ? <span className="text-blue-600 dark:text-blue-400"> · Sina auto → {applied.tier} ({applied.reason})</span> : ''}
          </div>
          {ctx.fiscal && (
            <div>
              <b>Fiscal mode:</b> <span className="text-emerald-700 dark:text-emerald-400">on</span> · {ctx.fiscal}
              <span className="text-neutral-400"> — non-negotiables enforced (cite · no self-computed figures · pinned · defer)</span>
            </div>
          )}
          <div>
            <b>Model router:</b> {applied.provider}
            {' · '}effort: {applied.effort ?? 'model default'}
            {' · '}cache: {applied.cache ? (cachedTokens > 0 ? `hit (${cachedTokens.toLocaleString()} tok)` : 'on (no hit yet)') : 'off'}
            {' · '}temperature: {applied.temperatureSent ? 'sent' : 'dropped (model rejects it)'}
          </div>
          <div>
            <b>Context scope:</b>{' '}
            {ctx.scope === 'auto' && ctx.selection ? (
              <span className="text-blue-600 dark:text-blue-400">
                auto → folders {ctx.selection.sentSections}/{ctx.selection.totalSections}, tools {ctx.selection.sentTools}/{ctx.selection.totalTools} ({ctx.selection.reason})
              </span>
            ) : (
              'send all (every enabled folder + tool)'
            )}
          </div>
          <div>
            <b>Tools available:</b> {ctx.enabledTools.length ? ctx.enabledTools.join(', ') : 'none'}
          </div>
          <div>
            <b>Documents in context:</b> {docCount ? docNames.join(', ') : 'none'}
          </div>
          <div>
            <b>Conversation:</b> {ctx.messageCount} message{ctx.messageCount === 1 ? '' : 's'}
          </div>
          <div>
            <b>System prompt:</b>
            <pre className="mt-0.5 overflow-x-auto whitespace-pre-wrap">{ctx.system}</pre>
          </div>
        </div>
      </details>
    </div>
  );
}

const fieldClass =
  'w-full rounded-lg border border-neutral-300 bg-white px-2.5 py-2 text-sm text-neutral-900 outline-none focus:border-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100';

const tinyBtn =
  'rounded border border-neutral-300 px-1.5 text-[11px] text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 dark:border-neutral-700 dark:hover:bg-neutral-800';

const smallBtn =
  'rounded-lg border border-neutral-300 px-2.5 py-2 text-[12px] hover:bg-neutral-100 disabled:opacity-40 dark:border-neutral-700 dark:hover:bg-neutral-800';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{title}</div>
      {children}
    </div>
  );
}
