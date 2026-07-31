


// ─────────────────────────────────────────────────────────────────────────────
// ToolsMenu — a header dropdown that shows EVERYTHING Sina can actually do.
//
// The whole point is honesty: the list is read LIVE from CopilotKit's registered
// action registry (useCopilotContext().actions) — the exact same tools the agent
// can call — so it can't drift from reality and a user can't be fooled by the
// prose. If a capability isn't in this list, the agent literally cannot do it.
//
// Read-only for now (a capability catalogue). Running a tool by hand from here is a
// later phase; this first cut is pure transparency. Tools are grouped by category
// for readability; anything we haven't labelled still shows (under "Other") so the
// catalogue stays complete. Light-neumorphic language (LC.*) to match WorkMenu.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo, useState } from 'react';
import { useCopilotContext } from '@copilotkit/react-core';
import { Wrench, ChevronDown, Search, FileSpreadsheet, LayoutGrid } from 'lucide-react';
import { LC } from '@/lib/librechat-theme';

type Category = 'research' | 'worksheet' | 'workspace' | 'other';

const CATEGORY_ORDER: Category[] = ['research', 'worksheet', 'workspace', 'other'];

const CATEGORY_LABEL: Record<Category, string> = {
  research: 'Research & live data',
  worksheet: 'Worksheets & workflows',
  workspace: 'Workspace & navigation',
  other: 'Other',
};

const CATEGORY_ICON: Record<Category, typeof Wrench> = {
  research: Search,
  worksheet: FileSpreadsheet,
  workspace: LayoutGrid,
  other: Wrench,
};

// Friendly label + grouping per known tool. Unmapped tools fall back to a
// prettified name under "Other" — add an entry here to label/categorise a tool.
const TOOL_META: Record<string, { label: string; category: Category }> = {
  searchWeb: { label: 'Web search', category: 'research' },
  searchCanadianTax: { label: 'Canadian tax search', category: 'research' },
  fetchWebPage: { label: 'Read web page', category: 'research' },
  searchCompanyDocuments: { label: 'Document search', category: 'research' },
  getFxRate: { label: 'Exchange rate · Bank of Canada', category: 'research' },
  estimateForeignIncomeTax: { label: 'Foreign-income tax estimate', category: 'research' },
  calculate: { label: 'Calculator', category: 'research' },
  getCurrentDateTime: { label: 'Current date & time', category: 'research' },
  searchWorksheet: { label: 'Worksheet search', category: 'worksheet' },
  explainWorksheetLine: { label: 'Explain worksheet line', category: 'worksheet' },
  whyWorksheetValue: { label: 'Worksheet value trace', category: 'worksheet' },
  editField: { label: 'Edit a field', category: 'worksheet' },
  runWorkflow: { label: 'Run a workflow', category: 'worksheet' },
  showWorkflowElement: { label: 'Show a workflow element', category: 'worksheet' },
  openPage: { label: 'Open a page', category: 'workspace' },
  commandPage: { label: 'Command the current page', category: 'workspace' },
  bringIntoChat: { label: 'Bring something into chat', category: 'workspace' },
  generateUI: { label: 'Generate a custom view', category: 'workspace' },
};

type ToolEntry = { name: string; label: string; category: Category; description: string; params: string[] };

/** camelCase → "Camel case" for tools we haven't given a friendly label. */
function prettifyName(name: string): string {
  const spaced = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function ToolsMenu({ compact = false }: { compact?: boolean }) {
  const { actions } = useCopilotContext();
  const [open, setOpen] = useState(false);

  // Project the live action registry into a grouped, display-ready catalogue.
  // Keyed on the set of registered action names so it recomputes as tools mount.
  const actionKey = Object.keys(actions ?? {}).sort().join('|');
  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on the registered action names
  const groups = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values = Object.values(actions ?? {}) as any[];
    const entries: ToolEntry[] = values
      .filter((a) => a && typeof a.name === 'string' && a.available !== 'disabled' && a.disabled !== true)
      .map((a) => {
        const meta = TOOL_META[a.name as string];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params = Array.isArray(a.parameters) ? (a.parameters as any[]).map((p) => String(p?.name ?? '')).filter(Boolean) : [];
        return {
          name: a.name as string,
          label: meta?.label ?? prettifyName(a.name as string),
          category: meta?.category ?? 'other',
          description: typeof a.description === 'string' ? a.description : '',
          params,
        };
      })
      .sort((x, y) => x.label.localeCompare(y.label));

    return CATEGORY_ORDER
      .map((cat) => ({ cat, items: entries.filter((e) => e.category === cat) }))
      .filter((g) => g.items.length > 0);
  }, [actionKey]);

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
              position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 41, width: 380, maxHeight: 460,
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
                Read live from Sina's own tools — this is everything it can do. If it isn't here, Sina can't do it.
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
                        <ToolRow key={t.name} tool={t} />
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

function ToolRow({ tool }: { tool: ToolEntry }) {
  return (
    <div
      className="lc-toolrow"
      data-testid="tool-row"
      style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '7px 9px', borderRadius: 10 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: LC.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {tool.label}
        </span>
        <code style={{ fontSize: 10.5, color: LC.faint, fontFamily: 'ui-monospace, monospace', flexShrink: 0 }}>{tool.name}</code>
      </div>
      {tool.description && (
        <div
          style={{
            fontSize: 12, color: LC.muted, lineHeight: 1.45,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}
        >
          {tool.description}
        </div>
      )}
      {tool.params.length > 0 && (
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
  );
}

export function ToolsMenuStyles() {
  return <style>{`.lc-toolrow:hover { background: ${LC.surfaceHover}; }`}</style>;
}
