'use client';

// ─────────────────────────────────────────────────────────────────────────────
// Tool provenance — the per-answer "receipt" that makes Sina verifiable. When the
// AI uses a tool, the AG-UI thread records the call (name + args) and its result;
// `ToolsUsed` renders that record as a compact "Tools used" bar under every reply,
// each chip expanding to the call's inputs + result — so a fiscalist can SEE which
// tools ran, with what inputs and what came back, instead of trusting the prose.
//
// `buildToolCallInfo` threads results back onto their calls; `ToolCallDetail` is the
// shared expand body. See ui/thread-messages.tsx for the per-turn wiring.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, type ReactNode } from 'react';
import { Wrench, ChevronRight, ChevronDown, FileText, AlertTriangle } from 'lucide-react';
import { LC } from '@/lib/librechat-theme';
import { toolLabel } from '@/features/assistant/ui/tool-labels';

export type ToolCallInfo = { name: string; args: unknown; result?: unknown };

/**
 * Build callId → { name, args, result } from the AG-UI messages. Assistant messages
 * carry the tool CALLS (name + args); the later tool-role message carries only a
 * toolCallId + its result content — so we thread the result back onto its call
 * (mirrors the persistence codec's nameByCallId). Both feed the "Tools used" bar.
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
    } else if (m?.role === 'tool' && m.toolCallId) {
      // The call always precedes its result in a valid thread, so the entry exists.
      const existing = map.get(m.toolCallId);
      if (existing) existing.result = m.content;
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

/** The expandable Inputs + Result body — shared by the receipt chip and the
 *  per-answer "Tools used" bar. No outer container; the caller wraps it. */
export function ToolCallDetail({ args, result }: { args: unknown; result: unknown }) {
  const obj = asObject(result);
  const errorText = obj && typeof obj.error === 'string' ? obj.error : null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const passages = obj && Array.isArray((obj as any).passages) ? ((obj as any).passages as any[]) : null;
  const hasArgs = args != null && typeof args === 'object' && Object.keys(args as object).length > 0;
  return (
    <>
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
    </>
  );
}

// ── ToolsUsed — the per-answer receipt the user sees under every reply ──────────
// A compact "Tools used" bar naming every tool that ran to produce this answer.
// Each chip expands to that call's inputs + result — so the fiscalist can verify
// the reply against what actually executed, not the prose. Empty turns render null.
export type ToolUsage = { id: string; name: string; args: unknown; result: unknown };

export function ToolsUsed({ calls }: { calls: ToolUsage[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  if (!calls.length) return null;
  const openCall = openId ? calls.find((c) => c.id === openId) : null;

  return (
    <div data-testid="tools-used" style={{ maxWidth: 760, margin: '2px 0 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: LC.faint, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <Wrench size={12} /> Tools used
        </span>
        {calls.map((c) => {
          const active = openId === c.id;
          const obj = asObject(c.result);
          const isError = !!(obj && typeof obj.error === 'string');
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setOpenId(active ? null : c.id)}
              aria-expanded={active}
              title="Show inputs & result"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px',
                fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
                color: isError ? '#c2410c' : active ? LC.text : LC.body,
                background: active ? LC.surfaceHover : LC.surface,
                border: `1px solid ${active ? LC.border : LC.borderSubtle}`, borderRadius: 999,
              }}
            >
              <Wrench size={11} style={{ color: isError ? '#c2410c' : LC.accent }} />
              {toolLabel(c.name)}
              {active ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </button>
          );
        })}
      </div>
      {openCall && (
        <div style={{ marginTop: 7, border: `1px solid ${LC.borderSubtle}`, borderRadius: 9, padding: '9px 10px', background: LC.surface }}>
          <ToolCallDetail args={openCall.args} result={openCall.result} />
        </div>
      )}
    </div>
  );
}
