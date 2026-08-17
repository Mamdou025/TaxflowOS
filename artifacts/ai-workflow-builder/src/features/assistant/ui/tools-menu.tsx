


// ─────────────────────────────────────────────────────────────────────────────
// ToolsMenu — a header dropdown that shows EVERYTHING Sina can actually do.
//
// The whole point is honesty: the list is read LIVE from CopilotKit's registered
// tool registry — the exact same tools handed to the model each turn — so it can't
// drift from reality and a user can't be fooled by the prose. If a capability isn't
// in this list, the agent literally cannot do it.
//
// SOURCE OF TRUTH — the v2 core, NOT the legacy actions map. In @copilotkit/react-
// core ≥1.63 `useCopilotAction` registers tools into the v2 CopilotKitCore (via
// copilotkit.addTool) — it NO LONGER populates the legacy `useCopilotContext().actions`
// record, which stays permanently empty. Reading that record is why this menu showed
// "No tools are registered yet" even though Sina had a full toolbelt. We read the
// live registry through `useCopilotKit().copilotkit.tools` instead (the same object
// the agent runs against). The legacy <CopilotKit> provider mounts this v2 core, so
// the hook resolves the same singleton every useCopilotAction writes to.
//
// Read-only for now (a capability catalogue). Running a tool by hand from here is a
// later phase; this first cut is pure transparency. Tools are grouped by category
// for readability; anything we haven't labelled still shows (under "Other") so the
// catalogue stays complete. Light-neumorphic language (LC.*) to match WorkMenu.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useMemo, useReducer, useState } from 'react';
import { useCopilotKit } from '@copilotkit/react-core/v2';
import { Wrench, ChevronDown, Search, Calculator, Play, MessageSquare, Sparkles, Loader2 } from 'lucide-react';
import { LC } from '@/lib/librechat-theme';
import { runnableTool, type RunnableTool } from './runnable-tools';

/** A direct (Run ▸) tool invocation to pin into the chat as a result card. */
export type ToolRunResult = { toolName: string; args: Record<string, unknown>; result: unknown };
/** A search tool "armed" onto the composer — the next message routes to it. */
export type ArmedTool = { name: string; label: string };

type Category = 'search' | 'data' | 'other';

const CATEGORY_ORDER: Category[] = ['search', 'data', 'other'];

const CATEGORY_LABEL: Record<Category, string> = {
  search: 'Search & documents',
  data: 'Live data & calculators',
  other: 'Other',
};

const CATEGORY_ICON: Record<Category, typeof Wrench> = {
  search: Search,
  data: Calculator,
  other: Wrench,
};

// Friendly label + grouping per tool the user can run directly. Only tools listed
// here (and in the runnable-tools manifest) are shown — background/workspace actions
// the agent drives on its own (openPage, editField, runWorkflow, generateUI, …) are
// deliberately hidden, since you can't usefully invoke them by hand from here.
const TOOL_META: Record<string, { label: string; category: Category }> = {
  searchWeb: { label: 'Web search', category: 'search' },
  searchCanadianTax: { label: 'Canadian tax search', category: 'search' },
  searchCompanyDocuments: { label: 'Document search', category: 'search' },
  fetchWebPage: { label: 'Read web page', category: 'search' },
  getFxRate: { label: 'Exchange rate · Bank of Canada', category: 'data' },
  estimateForeignIncomeTax: { label: 'Foreign-income tax estimate', category: 'data' },
  calculate: { label: 'Calculator', category: 'data' },
  getCurrentDateTime: { label: 'Current date & time', category: 'data' },
};

type ToolEntry = { name: string; label: string; category: Category; description: string; params: string[] };

/** camelCase → "Camel case" for tools we haven't given a friendly label. */
function prettifyName(name: string): string {
  const spaced = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/**
 * Best-effort read of a tool's parameter names for the chips. A v2 FrontendTool
 * carries its parameters as a StandardSchema (a Zod object at runtime), not the
 * legacy `[{ name }]` array — so we pull the keys off the schema shape and fail
 * soft to no chips if the shape isn't there.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function paramNames(schema: any): string[] {
  try {
    const shape = schema?.shape ?? schema?._def?.shape?.() ?? schema?._def?.shape;
    return shape && typeof shape === 'object' ? Object.keys(shape) : [];
  } catch {
    return [];
  }
}

export function ToolsMenu({
  compact = false,
  onRunResult,
  onAsk,
  onArm,
}: {
  compact?: boolean;
  /** Run ▸ finished — pin the raw result into the chat. */
  onRunResult?: (r: ToolRunResult) => void;
  /** Ask Sina 💬 / a form's conversational path — send this message to the chat. */
  onAsk?: (message: string) => void;
  /** Use-in-chat — arm a search tool onto the composer. */
  onArm?: (tool: ArmedTool) => void;
}) {
  // The live tool registry (v2 core). This is the exact set of tools the model is
  // handed each turn — see the header note on why the legacy actions map is empty.
  const { copilotkit } = useCopilotKit();
  const [open, setOpen] = useState(false);

  // Tools register in an effect (on mount) and change as pages come and go. The core
  // fires onRenderToolCallsChanged whenever a tool with a renderer is added/removed
  // (every Sina tool has one), so re-render the catalogue when the registry shifts.
  const [, bump] = useReducer((n) => n + 1, 0);
  useEffect(() => {
    const sub = copilotkit.subscribe({ onRenderToolCallsChanged: () => bump() });
    return () => sub.unsubscribe();
  }, [copilotkit]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tools = (copilotkit.tools ?? []) as any[];

  // Run a tool by hand: invoke the EXACT handler the model would call (from the live
  // registry), so a manual run and an agent run are the same code path. The stored
  // handler takes just the args object; the app handlers proxy to /api/assistant/tools
  // or run locally. Errors are captured so the result card can show them.
  const runTool = async (name: string, args: Record<string, unknown>): Promise<unknown> => {
    const t = tools.find((x) => x?.name === name);
    const handler = t?.handler as ((a: Record<string, unknown>) => Promise<unknown>) | undefined;
    if (!handler) return { error: 'This tool is not available right now.' };
    try {
      return await handler(args);
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Tool run failed.' };
    }
  };

  // Project the live registry into a grouped, display-ready catalogue. Keyed on the
  // set of registered tool names so it recomputes as tools mount/unmount.
  const toolKey = tools.map((t) => String(t?.name ?? '')).sort().join('|');
  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on the registered tool names
  const groups = useMemo(() => {
    const entries: ToolEntry[] = tools
      // `available` is a boolean on a v2 tool (false = registered but hidden from the model).
      // Show ONLY tools you can run by hand (in the runnable manifest); the agent's
      // background/workspace actions are registered too but aren't useful to invoke here.
      .filter((a) => a && typeof a.name === 'string' && a.available !== false && !!runnableTool(a.name))
      .map((a) => {
        const meta = TOOL_META[a.name as string];
        return {
          name: a.name as string,
          label: meta?.label ?? prettifyName(a.name as string),
          category: meta?.category ?? 'other',
          description: typeof a.description === 'string' ? a.description : '',
          params: paramNames(a.parameters),
        };
      })
      // De-dupe by name — a tool can be registered from more than one mounted surface.
      .filter((e, i, arr) => arr.findIndex((x) => x.name === e.name) === i)
      .sort((x, y) => x.label.localeCompare(y.label));

    return CATEGORY_ORDER
      .map((cat) => ({ cat, items: entries.filter((e) => e.category === cat) }))
      .filter((g) => g.items.length > 0);
  }, [toolKey]);

  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const height = compact ? 32 : 38;

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button
        data-testid="tools-menu"
        onClick={() => setOpen((o) => !o)}
        className="hover:bg-black/5"
        title="Tools — everything Sina can actually do"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 7, height, padding: '0 12px',
          borderRadius: 999, border: `1px solid ${open ? LC.border : LC.borderSubtle}`,
          background: open ? LC.surface : 'transparent', color: LC.body, cursor: 'pointer',
          fontSize: 12.5, fontWeight: 550,
        }}
      >
        <Wrench size={14} style={{ color: LC.muted }} />
        Tools
        {total > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: LC.faint }}>{total}</span>}
        <ChevronDown size={13} style={{ color: LC.muted, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 160ms' }} />
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <div
            data-testid="tools-menu-panel"
            style={{
              position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 41, width: 448, maxHeight: 588,
              overflowY: 'auto', background: LC.surface, border: `1px solid ${LC.border}`, borderRadius: 14,
              boxShadow: LC.shadowOut,
            }}
          >
            <div style={{ padding: '11px 14px 8px', borderBottom: `1px solid ${LC.borderSubtle}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 650, letterSpacing: '0.05em', textTransform: 'uppercase', color: LC.muted }}>
                  Tools
                </span>
                {total > 0 && <span style={{ fontSize: 11, color: LC.faint }}>· {total}</span>}
              </div>
              <div style={{ fontSize: 11.5, color: LC.muted, lineHeight: 1.45, marginTop: 3 }}>
                Tools you can run yourself — open one, fill in the inputs, then <b style={{ color: LC.body, fontWeight: 650 }}>Run</b> it for the value, or hand it to Sina.
              </div>
            </div>

            {total === 0 ? (
              <div style={{ padding: '18px 14px 22px', fontSize: 12.5, color: LC.muted, lineHeight: 1.5 }}>
                No tools are registered yet. They appear here once the assistant is active.
              </div>
            ) : (
              <div style={{ padding: '6px 6px 8px' }}>
                {groups.map((g) => {
                  const Icon = CATEGORY_ICON[g.cat];
                  return (
                    <div key={g.cat} style={{ marginBottom: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 8px 4px' }}>
                        <Icon size={12} style={{ color: LC.faint }} />
                        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: LC.faint }}>
                          {CATEGORY_LABEL[g.cat]}
                        </span>
                      </div>
                      {g.items.map((t) => (
                        <ToolRow
                          key={t.name}
                          tool={t}
                          runnable={runnableTool(t.name)}
                          runTool={runTool}
                          onRunResult={onRunResult}
                          onAsk={onAsk}
                          onArm={onArm}
                          onClose={() => setOpen(false)}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', minWidth: 0, boxSizing: 'border-box',
  fontSize: 12.5, color: LC.text, background: LC.bg,
  border: `1px solid ${LC.borderSubtle}`, borderRadius: 8, padding: '6px 9px',
  outline: 'none', fontFamily: 'inherit',
};

function ToolRow({
  tool, runnable, runTool, onRunResult, onAsk, onArm, onClose,
}: {
  tool: ToolEntry;
  runnable?: RunnableTool;
  runTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  onRunResult?: (r: ToolRunResult) => void;
  onAsk?: (message: string) => void;
  onArm?: (tool: ArmedTool) => void;
  onClose: () => void;
}) {
  const interactive = !!runnable;
  const fields = runnable?.fields ?? [];
  const [expanded, setExpanded] = useState(false);
  const [vals, setVals] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, f.default ?? '']))
  );
  const [busy, setBusy] = useState(false);

  const ready = fields.filter((f) => f.required).every((f) => (vals[f.name] ?? '').trim().length > 0);

  const buildArgs = (): Record<string, unknown> => {
    const args: Record<string, unknown> = {};
    for (const f of fields) {
      const raw = (vals[f.name] ?? '').trim();
      if (!raw) continue;
      args[f.name] = f.kind === 'number' ? Number(raw) : raw;
    }
    return args;
  };

  const doRun = async () => {
    if (busy || !ready) return;
    setBusy(true);
    const args = buildArgs();
    const result = await runTool(tool.name, args);
    setBusy(false);
    onRunResult?.({ toolName: tool.name, args, result });
    onClose();
  };
  const doAsk = () => {
    if (!ready || !runnable) return;
    onAsk?.(runnable.askMessage(vals));
    onClose();
  };
  const doArm = () => {
    onArm?.({ name: tool.name, label: tool.label });
    onClose();
  };

  const chip: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 5, height: 28, padding: '0 11px',
    borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none',
  };

  return (
    <div className="lc-toolrow" data-testid="tool-row" style={{ borderRadius: 10 }}>
      <div
        role={interactive ? 'button' : undefined}
        onClick={interactive ? () => setExpanded((o) => !o) : undefined}
        style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '7px 9px', cursor: interactive ? 'pointer' : 'default' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: LC.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {tool.label}
          </span>
          <code style={{ fontSize: 10.5, color: LC.faint, fontFamily: 'ui-monospace, monospace', flexShrink: 0 }}>{tool.name}</code>
          <span style={{ flex: 1 }} />
          {interactive && (
            <ChevronDown size={13} style={{ color: LC.faint, flexShrink: 0, transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 160ms' }} />
          )}
        </div>
        {tool.description && (
          <div
            style={{
              fontSize: 12, color: LC.muted, lineHeight: 1.45,
              ...(expanded ? {} : { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }),
            }}
          >
            {tool.description}
          </div>
        )}
        {!interactive && tool.params.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 1 }}>
            {tool.params.map((p) => (
              <span
                key={p}
                style={{ fontSize: 10, color: LC.muted, background: LC.surfaceHover, borderRadius: 5, padding: '1px 6px', fontFamily: 'ui-monospace, monospace' }}
              >
                {p}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Interactive panel: fields + Run ▸ / Ask Sina / (Use in chat). stopPropagation
          so typing/clicking here never bubbles up to collapse the row. */}
      {interactive && expanded && runnable && (
        <div onClick={(e) => e.stopPropagation()} style={{ padding: '2px 9px 11px', display: 'flex', flexDirection: 'column', gap: 9 }}>
          {fields.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {fields.map((f) => (
                <label key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: f.width === 'half' ? '1 1 40%' : '1 1 100%', minWidth: 0 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: LC.faint }}>
                    {f.label}{f.required && <span style={{ color: '#b45309' }}> *</span>}
                  </span>
                  <input
                    value={vals[f.name] ?? ''}
                    onChange={(e) => setVals((v) => ({ ...v, [f.name]: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); doRun(); } }}
                    placeholder={f.placeholder}
                    inputMode={f.kind === 'number' ? 'decimal' : undefined}
                    style={inputStyle}
                  />
                </label>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
            <button
              onClick={doRun}
              disabled={!ready || busy}
              title="Run this tool now and show the value in the chat"
              style={{
                ...chip,
                background: ready && !busy ? LC.text : LC.surfaceHover,
                color: ready && !busy ? '#fff' : LC.faint,
                cursor: ready && !busy ? 'pointer' : 'default',
              }}
            >
              {busy ? <Loader2 size={13} className="lc-spin" /> : <Play size={13} />} {runnable.runLabel}
            </button>
            <button
              onClick={doAsk}
              disabled={!ready}
              title="Send it to Sina to answer conversationally"
              style={{ ...chip, background: LC.surface, color: ready ? LC.body : LC.faint, border: `1px solid ${LC.borderSubtle}`, cursor: ready ? 'pointer' : 'default' }}
            >
              <MessageSquare size={13} /> Ask Sina
            </button>
            {runnable.mode === 'search' && (
              <button
                onClick={doArm}
                title="Arm this tool — a chip appears on the composer and your next message runs it"
                style={{ ...chip, background: LC.surface, color: LC.body, border: `1px solid ${LC.borderSubtle}` }}
              >
                <Sparkles size={13} /> Use in chat
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function ToolsMenuStyles() {
  return (
    <style>{`
      .lc-toolrow:hover { background: ${LC.surfaceHover}; }
      .lc-spin { animation: lc-tools-spin 0.7s linear infinite; }
      @keyframes lc-tools-spin { to { transform: rotate(360deg); } }
      @media (prefers-reduced-motion: reduce) { .lc-spin { animation: none; } }
    `}</style>
  );
}
