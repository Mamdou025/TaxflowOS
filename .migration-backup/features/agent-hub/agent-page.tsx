'use client';

// AgentPage — the "Agent" surface: see EVERYTHING about the one live agent (Sina) and
// configure it. Mirrors the Workflows surface: the tabs (Overview · Build) are published
// into the panel header via usePageMenu; the body is just the active tab's content.
//   • Overview — what Sina knows, what it can do (tools), what it sees (context), its
//     models/routing, and its active fiscal guardrails + prompt layers. Read-only truth.
//   • Build — the live-agent config (fiscal mode + context · extra instructions · model ·
//     effort). Writes agentConfigAtom, which the live chat reads. Reset restores defaults.

import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Bot, FileText, Wrench, Eye, Cpu, ShieldCheck, RotateCcw } from 'lucide-react';
import { NEU } from '@/components/neumorphic-sidebar';
import { usePageMenu, type PageMenuItem } from '@/shared/stores/page-menu-store';
import { agentTabAtom, type AgentTab } from '@/features/agent-hub/agent-hub-store';
import { agentConfigAtom, DEFAULT_LIVE_AGENT_CONFIG } from '@/features/assistant/runtime/agent-config';
import {
  CURRENCIES,
  ENTITY_TYPES,
  PROVINCES,
  RESIDENCY,
  fiscalPreamble,
  fiscalSummary,
} from '@/features/agent-lab/fiscal';
import { EFFORT_LEVELS, type EffortLevel } from '@/features/agent-lab/model-router';
import AgentLabPage from '@/features/agent-lab/agent-lab-page';

const TAB_LABELS: { id: AgentTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'build', label: 'Build' },
  { id: 'lab', label: 'Lab' },
];

// ── Curated introspection data (kept in sync with the live wiring) ───────────────
// The domains Sina absorbed (was Sofi/Théo/Mira/Nova), from agents/specialists.ts.
const DOMAINS = [
  'FAPI — foreign accrual property income (classify the trial balance, the FAPI line build, FX → CAD, reviewed net FAPI)',
  'Section 85 rollover (roulement, art. 85) — elected-amount bounds PBR↔FMV, deferred gain, T2057',
  'Employee expense reimbursement — per-diem caps, policy, net payable',
  'Marketing campaign budgets — channel classification, elect the approved budget',
];

// The system-prompt sections Sina always carries (from INSTRUCTIONS() in assistant-thread.tsx).
const PROMPT_SECTIONS = [
  'Identity — "You are Sina, the assistant inside InScope"',
  'Style — acknowledge first, then act; concise, professional',
  'Intent — ask vs. do (a workflow NAME is not a command; never act on a guess)',
  'Tool routing — runWorkflow / openPage / focusAnchor / editField / generateUI',
  'Grounding — never invent a value; read from the provided contexts',
  'Memory — use remembered facts; save only when asked',
  'Expertise — the four domains above (per-turn "domain focus")',
  'Registered pages + editable fields (only reference ids that exist)',
];

// Actions the live agent can call (client-executed useCopilotAction, from use-assistant.tsx + friends).
const TOOLS = [
  ['runWorkflow', 'Propose / start a workflow run in the chat (FAPI · rollover · expense · campaign)'],
  ['editField', 'Bring an editable worksheet field into the chat (e.g. the FX rate)'],
  ['openPage', 'Open a registered worksheet / page beside the chat'],
  ['focusAnchor', 'Scroll to + highlight a figure or section on a page'],
  ['generateUI', 'Generate a one-off view — dashboard, chart, table, or form (OpenUI)'],
  ['explainWorksheetLine · whyWorksheetValue', 'Explain a computed line / the operands behind a value'],
  ['searchWorksheet', 'Search the open worksheet'],
  ['commandPage · bringIntoChat', 'Drive a page from the chat / pull a page surface in'],
  ['showWorkflowElement', 'Pin a workflow source or output into the thread'],
  ['rememberFact · forgetFact', 'Durable, per-client memory (Postgres)'],
  ['focusBlock · addBlock · editBlockConfig · connectBlocks', 'Builder actions (only on the workflow builder)'],
];

// Context the live agent is given each turn (useCopilotReadable).
const CONTEXT = [
  'Current route / open pages & windows',
  'The active workflow run + its LIVE figures (categories, computed lines, summary)',
  'Attached documents — full extracted text (PDF / Word / Excel / text)',
  'Every editable field + its current value (FX rate, inclusion rate, …)',
  'Live snapshots of all workflows (engine-computed on-screen numbers)',
  'The Sinaxe portfolio blueprints (15 workflows)',
  'Remembered facts & preferences (durable memory, scoped to the current client)',
];

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: NEU.surface, borderRadius: 16, boxShadow: NEU.shadowSm, padding: '18px 20px', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ display: 'grid', placeItems: 'center', width: 26, height: 26, borderRadius: 8, background: NEU.bg, boxShadow: NEU.shadowSm, color: NEU.accent }}>{icon}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: NEU.text }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function Bullets({ items }: { items: (string | string[])[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {items.map((it, i) => {
        const [head, tail] = Array.isArray(it) ? it : [null, it];
        return (
          <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12.5, lineHeight: 1.5, color: NEU.muted }}>
            <span style={{ color: NEU.accent, flexShrink: 0 }}>•</span>
            <span>
              {head && <b style={{ color: NEU.text, fontWeight: 600 }}>{head}</b>}
              {head && ' — '}
              {tail}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Overview tab ─────────────────────────────────────────────────────────────
function AgentOverview() {
  const config = useAtomValue(agentConfigAtom);
  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 28px 56px' }}>
        <Section icon={<Bot size={15} />} title="Identity — one unified agent">
          <div style={{ fontSize: 13, lineHeight: 1.6, color: NEU.muted, marginBottom: 10 }}>
            <b style={{ color: NEU.text }}>Sina</b> is the single assistant in the workspace. It absorbed the former specialists
            (Sofi / Théo / Mira / Nova) — there are no separate agents. Each turn it applies the relevant <b style={{ color: NEU.text }}>domain focus</b>:
          </div>
          <Bullets items={DOMAINS} />
        </Section>

        <Section icon={<FileText size={15} />} title="What it's told — system-prompt layers">
          <div style={{ fontSize: 12.5, color: NEU.muted, marginBottom: 8 }}>Every turn the live prompt = base instructions {config.fiscalMode ? '+ fiscal guardrails ' : ''}{config.extraInstructions.trim() ? '+ operator additions' : ''}. Base sections:</div>
          <Bullets items={PROMPT_SECTIONS} />
          <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Pill on={config.fiscalMode} label={config.fiscalMode ? `Fiscal guardrails: ON · ${fiscalSummary(config.fiscal)}` : 'Fiscal guardrails: off'} />
            <Pill on={!!config.extraInstructions.trim()} label={config.extraInstructions.trim() ? 'Operator additions: set' : 'Operator additions: none'} />
          </div>
        </Section>

        <Section icon={<Wrench size={15} />} title="What it can do — tools">
          <Bullets items={TOOLS} />
        </Section>

        <Section icon={<Eye size={15} />} title="What it sees — context each turn">
          <Bullets items={CONTEXT} />
        </Section>

        <Section icon={<Cpu size={15} />} title="Models & routing">
          <Bullets
            items={[
              ['Live model', 'the app default (env OPENAI_CHAT_MODEL, e.g. gpt-4o), via the Vercel AI Gateway when AI_GATEWAY_API_KEY is set'],
              ['Tiering', 'model-policy can pick fast (navigation) / standard / deep (tax reasoning) per turn — off until ASSISTANT_MODEL_FAST/DEEP are set'],
              ['Config override', config.modelSpec ? `${config.modelSpec} · effort ${config.effort}  (stored; not yet driving the live model)` : 'none set (uses the app default)'],
            ]}
          />
        </Section>

        <Section icon={<ShieldCheck size={15} />} title="Fiscal guardrails (the non-negotiables)">
          {config.fiscalMode ? (
            <>
              <div style={{ fontSize: 12.5, color: NEU.muted, marginBottom: 8 }}>Active, pinned to <b style={{ color: NEU.text }}>{fiscalSummary(config.fiscal)}</b>. The live prompt carries:</div>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: 11.5, lineHeight: 1.55, color: NEU.muted, background: NEU.bg, boxShadow: NEU.shadowSm, borderRadius: 10, padding: '12px 14px', margin: 0, maxHeight: 260, overflowY: 'auto' }}>{fiscalPreamble(config.fiscal)}</pre>
            </>
          ) : (
            <div style={{ fontSize: 12.5, color: NEU.muted }}>Off. Turn it on in <b style={{ color: NEU.text }}>Build</b> to make Sina cite its authority, never self-compute figures, pin every answer to a tax year/jurisdiction, and defer on elections.</div>
          )}
        </Section>
      </div>
    </div>
  );
}

function Pill({ on, label }: { on: boolean; label: string }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 999, background: on ? 'var(--sx-accent-soft)' : NEU.bg, boxShadow: NEU.shadowSm, color: on ? NEU.accent : NEU.faint }}>{label}</span>
  );
}

// ── Build tab — writes the live-agent config ─────────────────────────────────
const inputStyle: React.CSSProperties = { width: '100%', background: NEU.bg, boxShadow: NEU.shadowIn, border: 'none', borderRadius: 10, padding: '9px 11px', fontSize: 13, color: NEU.text, outline: 'none' };
const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: NEU.muted, display: 'block', marginBottom: 5 };

function AgentBuild() {
  const [config, setConfig] = useAtom(agentConfigAtom);
  const set = <K extends keyof typeof config>(k: K, v: (typeof config)[K]) => setConfig((c) => ({ ...c, [k]: v }) as typeof config);
  const setFiscal = <K extends keyof typeof config.fiscal>(k: K, v: (typeof config.fiscal)[K]) => setConfig((c) => ({ ...c, fiscal: { ...c.fiscal, [k]: v } as typeof config.fiscal }));

  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 28px 56px' }}>
        <div style={{ fontSize: 12.5, color: NEU.muted, marginBottom: 16 }}>These settings configure the <b style={{ color: NEU.text }}>live</b> Sina — they persist and take effect in the chat immediately (fiscal + instructions). Model & effort are stored but do not yet drive the live model.</div>

        <Section icon={<ShieldCheck size={15} />} title="Fiscal guardrails">
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, color: NEU.text }}>
            <input type="checkbox" style={{ marginTop: 2 }} checked={config.fiscalMode} onChange={(e) => set('fiscalMode', e.target.checked)} />
            <span>Enforce the fiscalist non-negotiables — cite the authority · never self-compute figures · pin tax year / jurisdiction / entity · defer on elections · flag uncertainty.</span>
          </label>
          {config.fiscalMode && (
            <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div><span style={labelStyle}>Tax year</span><input style={inputStyle} type="number" min={2000} max={2100} value={config.fiscal.taxYear} onChange={(e) => setFiscal('taxYear', Number(e.target.value))} /></div>
              <div><span style={labelStyle}>Province / jurisdiction</span><select style={inputStyle} value={config.fiscal.province} onChange={(e) => setFiscal('province', e.target.value)}>{PROVINCES.map((p) => <option key={p.code} value={p.code}>{p.label}</option>)}</select></div>
              <div><span style={labelStyle}>Entity type</span><select style={inputStyle} value={config.fiscal.entityType} onChange={(e) => setFiscal('entityType', e.target.value)}>{ENTITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
              <div><span style={labelStyle}>Residency</span><select style={inputStyle} value={config.fiscal.residency} onChange={(e) => setFiscal('residency', e.target.value)}>{RESIDENCY.map((r) => <option key={r} value={r}>{r}</option>)}</select></div>
              <div><span style={labelStyle}>Reporting currency</span><select style={inputStyle} value={config.fiscal.currency} onChange={(e) => setFiscal('currency', e.target.value)}>{CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
            </div>
          )}
        </Section>

        <Section icon={<FileText size={15} />} title="Operator instructions">
          <span style={labelStyle}>Appended to Sina's system prompt for every turn.</span>
          <textarea style={{ ...inputStyle, minHeight: 96, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }} value={config.extraInstructions} onChange={(e) => set('extraInstructions', e.target.value)} placeholder="e.g. Always answer in French. Prefer Revenu Québec sources for provincial questions." />
        </Section>

        <Section icon={<Cpu size={15} />} title="Model & effort">
          <div style={{ fontSize: 11.5, color: NEU.faint, marginBottom: 10 }}>Stored + shown in Overview. Not yet driving the live model (a verified CopilotKit client→forwardedProps path is a follow-up).</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div><span style={labelStyle}>Model spec</span><input style={inputStyle} value={config.modelSpec} onChange={(e) => set('modelSpec', e.target.value)} placeholder="app default (e.g. anthropic/claude-opus-4-8)" /></div>
            <div><span style={labelStyle}>Effort (Anthropic)</span><select style={inputStyle} value={config.effort} onChange={(e) => set('effort', e.target.value as EffortLevel | 'auto')}><option value="auto">auto</option>{EFFORT_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}</select></div>
          </div>
        </Section>

        <button onClick={() => setConfig(DEFAULT_LIVE_AGENT_CONFIG)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: 'none', cursor: 'pointer', background: NEU.bg, boxShadow: NEU.shadowSm, color: NEU.muted, fontSize: 12.5, fontWeight: 600, borderRadius: 11, padding: '9px 15px' }}>
          <RotateCcw size={14} /> Reset to defaults
        </button>
      </div>
    </div>
  );
}

// ── The surface ──────────────────────────────────────────────────────────────
export function AgentPage() {
  const [tab, setTab] = useAtom(agentTabAtom);

  const left: PageMenuItem[] = [
    { kind: 'label', id: 'agent-name', text: 'Sina', strong: true, width: 120 },
    { kind: 'separator', id: 'sep' },
    ...TAB_LABELS.map((t): PageMenuItem => ({ kind: 'button', id: `tab-${t.id}`, label: t.label, active: tab === t.id, onClick: () => setTab(t.id) })),
  ];
  usePageMenu('agent', { left }, [tab]);

  return (
    <div style={{ position: 'relative', height: '100%', background: NEU.bg, fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      {tab === 'build' ? (
        <AgentBuild />
      ) : tab === 'lab' ? (
        // The Agent Lab, embedded (standalone header dropped). It runs on its OWN
        // isolated runtime (/api/agent-lab) — independent from the live Sina — so it's
        // a safe sandbox to configure + compare models without touching the real chat.
        <div style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
          <AgentLabPage embedded />
        </div>
      ) : (
        <AgentOverview />
      )}
    </div>
  );
}
