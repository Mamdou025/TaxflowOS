'use client';

// ─────────────────────────────────────────────────────────────────────────────
// ToolReceipt — the per-answer "receipt" that makes Sina verifiable. When the AI
// uses a data/research tool, the AG-UI thread already records the call (name +
// args) and its result; this renders that record inline under the answer so a
// fiscalist can SEE which tool ran, with what inputs, and what came back — instead
// of trusting the prose. Collapsed by default (a subtle chip); expand for the full
// inputs + result, with document sources / match scores where the tool returns them.
//
// Only tools in TOOL_RECEIPT_LABELS get a receipt. Tools that already render their
// own rich card (searchWeb / searchCanadianTax → WebSearchCard, runWorkflow,
// generateUI) are intentionally excluded — the card IS their receipt, and a second
// one would just duplicate. Add a tool here when it fetches or derives data the
// user must be able to check. See ui/thread-messages.tsx for the wiring.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, type ReactNode } from 'react';
import { Wrench, ChevronRight, ChevronDown, FileText, AlertTriangle } from 'lucide-react';
import { LC } from '@/lib/librechat-theme';

/** Data/research tools worth an audit receipt → their human label. */
export const TOOL_RECEIPT_LABELS: Record<string, string> = {
  fetchWebPage: 'Read web page',
  getFxRate: 'Exchange rate · Bank of Canada',
  estimateForeignIncomeTax: 'Foreign-income tax estimate',
  searchCompanyDocuments: 'Document search',
  calculate: 'Calculator',
  explainWorksheetLine: 'Explain worksheet line',
  whyWorksheetValue: 'Worksheet value trace',
  searchWorksheet: 'Worksheet search',
  getCurrentDateTime: 'Current date & time',
};

/** The label for a tool name, or null if that tool doesn't get a receipt. */
export function receiptLabelFor(name: string | undefined | null): string | null {
  if (!name) return null;
  return TOOL_RECEIPT_LABELS[name] ?? null;
}

type ToolCallInfo = { name: string; args: unknown };

/**
 * Build callId → { name, args } from the AG-UI assistant messages. A tool RESULT
 * message carries only a toolCallId, so we recover what was called from the
 * matching assistant tool call (mirrors the persistence codec's nameByCallId).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildToolCallInfo(messages: any[]): Map<string, ToolCallInfo> {
  const map = new Map<string, ToolCallInfo>();
  for (const m of messages ?? []) {
    if (m?.role === 'assistant' && Array.isArray(m.toolCalls)) {
      for (const tc of m.toolCalls) {
        const name = tc?.function?.name;
        if (tc?.id && name) map.set(tc.id, { name, args: safeParse(tc.function?.arguments) });
      }
    }
  }
  return map;
}

function safeParse(v: unknown): unknown {
  if (typeof v !== 'string') return v ?? {};
  try {
    return JSON.parse(v);
  } catch {
    return v;
  }
}

/** Coerce a recorded tool result (string or object) into an inspectable object. */
function asObject(result: unknown): Record<string, unknown> | null {
  if (result == null) return null;
  if (typeof result === 'string') {
    const t = result.trim();
    if (!t) return null;
    try {
      const o = JSON.parse(t);
      return o && typeof o === 'object' ? (o as Record<string, unknown>) : { value: o };
    } catch {
      return { text: result };
    }
  }
  if (typeof result === 'object') return result as Record<string, unknown>;
  return { value: result };
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n).trimEnd()}…` : s;
}

/** A one-line summary of the call args for the collapsed chip. */
function argSummary(args: unknown): string {
  if (!args || typeof args !== 'object') return '';
  const a = args as Record<string, unknown>;
  if (typeof a.query === 'string') return `"${truncate(a.query, 80)}"`;
  if (typeof a.url === 'string') return truncate(a.url, 80);
  if (typeof a.from === 'string' && typeof a.to === 'string') return `${a.from} → ${a.to}${a.year ? ` · ${a.year}` : ''}`;
  if (typeof a.expression === 'string') return truncate(a.expression, 80);
  return Object.entries(a)
    .filter(([, v]) => v != null)
    .slice(0, 2)
    .map(([k, v]) => `${k}: ${truncate(String(v), 40)}`)
    .join(' · ');
}

function formatValue(v: unknown): string {
  if (v == null) return '—';
  if (typeof v === 'string') return truncate(v, 300);
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  try {
    return truncate(JSON.stringify(v), 300);
  } catch {
    return String(v);
  }
}

function ReceiptSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', color: LC.faint, marginBottom: 3 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function KeyVal({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, fontSize: 12, lineHeight: 1.5 }}>
      <span style={{ color: LC.faint, flexShrink: 0, minWidth: 84 }}>{label}</span>
      <span style={{ color: LC.text, wordBreak: 'break-word', minWidth: 0 }}>{value}</span>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PassagesView({ passages, note }: { passages: any[]; note?: string }) {
  if (!passages.length) return <span style={{ fontSize: 12, color: LC.muted }}>{note ?? 'No passages.'}</span>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {passages.map((p, i) => {
        const sim = typeof p?.similarity === 'number' ? Math.round(Math.max(0, Math.min(1, p.similarity)) * 100) : null;
        return (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5 }}>
              <FileText size={12} style={{ color: LC.faint, flexShrink: 0 }} />
              <span style={{ fontWeight: 650, color: LC.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
                {p?.source ?? 'document'}
              </span>
              {sim != null && <span style={{ color: LC.faint, flexShrink: 0 }}>{sim}% match</span>}
              {typeof p?.chunkIndex === 'number' && <span style={{ color: LC.faint, flexShrink: 0 }}>· passage {p.chunkIndex}</span>}
            </div>
            {p?.excerpt && (
              <div
                style={{
                  fontSize: 12, color: LC.muted, lineHeight: 1.5,
                  display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}
              >
                {p.excerpt}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ToolReceipt({ label, args, result }: { label: string; args: unknown; result: unknown }) {
  const [open, setOpen] = useState(false);
  const obj = asObject(result);
  const summary = argSummary(args);
  const errorText = obj && typeof obj.error === 'string' ? obj.error : null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const passages = obj && Array.isArray((obj as any).passages) ? ((obj as any).passages as any[]) : null;
  const hasArgs = args != null && typeof args === 'object' && Object.keys(args as object).length > 0;

  return (
    <div style={{ maxWidth: 660, margin: '2px 0 8px' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          display: 'flex', alignItems: 'center', gap: 7, width: '100%',
          padding: '6px 10px', background: LC.surface,
          border: `1px solid ${LC.borderSubtle}`,
          borderRadius: open ? '9px 9px 0 0' : 9,
          cursor: 'pointer', textAlign: 'left', color: LC.muted, fontSize: 12,
        }}
      >
        <Wrench size={12} style={{ color: errorText ? '#c2410c' : LC.accent, flexShrink: 0 }} />
        <span style={{ fontWeight: 650, color: LC.text, flexShrink: 0 }}>{label}</span>
        {summary && (
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>{summary}</span>
        )}
        <span style={{ marginLeft: 'auto', display: 'inline-flex', flexShrink: 0 }}>
          {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </span>
      </button>

      {open && (
        <div
          style={{
            border: `1px solid ${LC.borderSubtle}`, borderTop: 'none',
            borderRadius: '0 0 9px 9px', padding: '9px 10px', background: LC.surface,
          }}
        >
          {hasArgs && (
            <ReceiptSection title="Inputs">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {Object.entries(args as Record<string, unknown>).map(([k, v]) => (
                  <KeyVal key={k} label={k} value={formatValue(v)} />
                ))}
              </div>
            </ReceiptSection>
          )}

          <ReceiptSection title="Result">
            {errorText ? (
              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', color: '#c2410c', fontSize: 12 }}>
                <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{errorText}</span>
              </div>
            ) : passages ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              <PassagesView passages={passages} note={(obj as any)?.note as string | undefined} />
            ) : obj ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {Object.entries(obj)
                  .filter(([k]) => k !== 'instruction')
                  .map(([k, v]) => (
                    <KeyVal key={k} label={k} value={formatValue(v)} />
                  ))}
              </div>
            ) : (
              <span style={{ fontSize: 12, color: LC.muted }}>No result recorded.</span>
            )}
          </ReceiptSection>
        </div>
      )}
    </div>
  );
}
