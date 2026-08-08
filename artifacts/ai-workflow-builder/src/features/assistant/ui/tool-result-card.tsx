// ─────────────────────────────────────────────────────────────────────────────
// ToolResultCard — renders the RESULT of a tool run-by-hand (from the Tools menu),
// pinned inline in the chat. This is the "value retrieved" the fiscalist asked for:
// the raw tool output, shown directly — no LLM in the middle to paraphrase or fool.
//
// Search tools reuse the existing WebSearchCard (reads the same results atom the tool
// handler wrote + the recorded result). FX / calculate / documents get purpose-built
// cards; anything else falls back to a clean key/value render so a new runnable tool
// still shows something legible without extra code. Light-neumorphic (LC.*).
// ─────────────────────────────────────────────────────────────────────────────

import { AlertTriangle, ArrowRightLeft, Calculator, Clock, FileText, Wrench } from 'lucide-react';
import { LC } from '@/lib/librechat-theme';
import { WebSearchCard } from '@/features/assistant/workspace/web-search-card';
import { RUNNABLE_TOOLS } from './runnable-tools';

export type ToolResult = {
  id: string;
  toolName: string;
  args: Record<string, unknown>;
  result: unknown;
  at: number;
};

/** Tool results are plain objects; tolerate a JSON string just in case. */
function asObject(result: unknown): Record<string, unknown> | null {
  if (result && typeof result === 'object') return result as Record<string, unknown>;
  if (typeof result === 'string') {
    try {
      const o = JSON.parse(result);
      return o && typeof o === 'object' ? (o as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  }
  return null;
}

function errorOf(obj: Record<string, unknown> | null): string | null {
  if (!obj) return null;
  if (typeof obj.error === 'string') return obj.error;
  if (obj.unavailable && typeof obj.note === 'string') return obj.note;
  return null;
}

function prettify(name: string): string {
  const s = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const CARD: React.CSSProperties = {
  maxWidth: 560,
  background: LC.surface,
  border: `1px solid ${LC.borderSubtle}`,
  borderRadius: 12,
  boxShadow: LC.shadowSm,
  overflow: 'hidden',
};

function Shell({ icon, title, subtitle, children }: { icon: React.ReactNode; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={CARD}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 13px', borderBottom: `1px solid ${LC.borderSubtle}` }}>
        <span style={{ display: 'inline-flex', color: LC.accent }}>{icon}</span>
        <span style={{ fontSize: 12.5, fontWeight: 650, color: LC.text }}>{title}</span>
        {subtitle && (
          <span style={{ fontSize: 12, color: LC.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, flex: 1, textAlign: 'right' }}>
            {subtitle}
          </span>
        )}
      </div>
      <div style={{ padding: '12px 13px' }}>{children}</div>
    </div>
  );
}

function ErrorCard({ title, message }: { title: string; message: string }) {
  return (
    <Shell icon={<AlertTriangle size={14} />} title={title}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12.5, color: LC.muted, lineHeight: 1.5 }}>
        <AlertTriangle size={14} style={{ color: '#b45309', flexShrink: 0, marginTop: 1 }} />
        <span>{message}</span>
      </div>
    </Shell>
  );
}

// ── FX ────────────────────────────────────────────────────────────────────────
function FxCard({ obj }: { obj: Record<string, unknown> }) {
  const from = String(obj.from ?? '');
  const to = String(obj.to ?? 'CAD');
  const year = obj.year != null ? String(obj.year) : '';
  const rate = typeof obj.rate === 'number' ? obj.rate : Number(obj.rate);
  const source = typeof obj.rateSource === 'string' ? obj.rateSource : 'Bank of Canada';
  return (
    <Shell icon={<ArrowRightLeft size={14} />} title="Exchange rate" subtitle={year ? `${from} → ${to} · ${year}` : `${from} → ${to}`}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 26, fontWeight: 700, color: LC.text, letterSpacing: '-0.01em' }}>
          {Number.isFinite(rate) ? rate.toFixed(4) : String(obj.rate ?? '—')}
        </span>
        <span style={{ fontSize: 12.5, color: LC.muted }}>{to} per 1 {from}</span>
      </div>
      <div style={{ fontSize: 11.5, color: LC.faint, marginTop: 6 }}>Source · {source}</div>
    </Shell>
  );
}

// ── calculate ───────────────────────────────────────────────────────────────
function CalcCard({ obj }: { obj: Record<string, unknown> }) {
  const expr = String(obj.expression ?? '');
  const result = obj.result;
  return (
    <Shell icon={<Calculator size={14} />} title="Calculation">
      <div style={{ fontSize: 15, color: LC.text, fontFamily: 'ui-monospace, monospace' }}>
        <span style={{ color: LC.muted }}>{expr}</span>
        <span style={{ color: LC.faint, margin: '0 8px' }}>=</span>
        <span style={{ fontWeight: 700 }}>{String(result ?? '—')}</span>
      </div>
    </Shell>
  );
}

// ── current date/time ─────────────────────────────────────────────────────────
function DateTimeCard({ obj }: { obj: Record<string, unknown> }) {
  const readable = String(obj.readable ?? obj.iso ?? '—');
  return (
    <Shell icon={<Clock size={14} />} title="Current date & time">
      <div style={{ fontSize: 14, color: LC.text }}>{readable}</div>
    </Shell>
  );
}

// ── searchCompanyDocuments ────────────────────────────────────────────────────
function DocPassagesCard({ obj, query }: { obj: Record<string, unknown>; query: string }) {
  const passages = Array.isArray(obj.passages) ? (obj.passages as Record<string, unknown>[]) : [];
  const note = typeof obj.note === 'string' ? obj.note : undefined;
  return (
    <Shell icon={<FileText size={14} />} title="Document search" subtitle={query}>
      {passages.length === 0 ? (
        <div style={{ fontSize: 12.5, color: LC.muted }}>{note ?? 'No relevant passages found.'}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {passages.map((p, i) => {
            const sim = typeof p.similarity === 'number' ? p.similarity : undefined;
            return (
              <div key={i} style={{ borderLeft: `2px solid ${LC.borderSubtle}`, paddingLeft: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: LC.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>{String(p.source ?? 'document')}</span>
                  {sim != null && <span style={{ fontSize: 10.5, color: LC.faint, flexShrink: 0 }}>{Math.round(sim * 100)}% match</span>}
                </div>
                <div style={{ fontSize: 12, color: LC.muted, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {String(p.excerpt ?? '')}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Shell>
  );
}

// ── generic fallback (fetchWebPage, estimateForeignIncomeTax, new tools) ──────
const HIDE_KEYS = new Set(['instruction', 'note', 'unavailable', 'text']);

function GenericResultCard({ toolName, obj }: { toolName: string; obj: Record<string, unknown> }) {
  const entries = Object.entries(obj).filter(([k, v]) => !HIDE_KEYS.has(k) && v != null && typeof v !== 'function');
  const note = typeof obj.note === 'string' ? obj.note : undefined;
  return (
    <Shell icon={<Wrench size={14} />} title={prettify(toolName)}>
      {entries.length === 0 ? (
        <div style={{ fontSize: 12.5, color: LC.muted }}>{note ?? 'Done — no value returned.'}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {entries.map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: 10, fontSize: 12.5, alignItems: 'baseline' }}>
              <span style={{ color: LC.faint, minWidth: 108, flexShrink: 0 }}>{prettify(k)}</span>
              <span style={{ color: LC.text, wordBreak: 'break-word', minWidth: 0 }}>
                {typeof v === 'object' ? JSON.stringify(v) : String(v)}
              </span>
            </div>
          ))}
          {note && <div style={{ fontSize: 11.5, color: LC.muted, marginTop: 4 }}>{note}</div>}
        </div>
      )}
    </Shell>
  );
}

export function ToolResultCard({ toolName, args, result }: { toolName: string; args: Record<string, unknown>; result: unknown }) {
  const scope = RUNNABLE_TOOLS[toolName]?.searchScope;
  // Search tools → the existing results card (reads the atom + recorded result).
  if (scope) return <WebSearchCard query={String(args.query ?? '')} scope={scope} result={result} />;

  const obj = asObject(result);
  const err = errorOf(obj);
  if (err) return <ErrorCard title={prettify(toolName)} message={err} />;
  if (!obj) return <ErrorCard title={prettify(toolName)} message="The tool returned no readable result." />;

  switch (toolName) {
    case 'getFxRate':
      return <FxCard obj={obj} />;
    case 'calculate':
      return <CalcCard obj={obj} />;
    case 'getCurrentDateTime':
      return <DateTimeCard obj={obj} />;
    case 'searchCompanyDocuments':
      return <DocPassagesCard obj={obj} query={String(args.query ?? '')} />;
    default:
      return <GenericResultCard toolName={toolName} obj={obj} />;
  }
}
