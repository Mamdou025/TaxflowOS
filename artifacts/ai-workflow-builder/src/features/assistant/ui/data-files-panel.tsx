


// ─────────────────────────────────────────────────────────────────────────────
// DataFilesPanel — "what is Sina looking into?" A right slide-over with two tabs:
//
//  • This chat — every document + web source Sina actually pulled in THIS
//    conversation, derived from the live tool trace (the same recorded tool
//    results the receipts read). So the grounding behind the answers is visible in
//    one place, and you can open each source and check it yourself.
//  • Library — all your uploaded documents (GET /api/documents), with processing
//    status, and a "Used here" badge on the ones this chat drew from.
//
// This is the transparency counterpart to the ToolsMenu (what it CAN do) and the
// receipts (what it DID): this is WHAT it looked at. Light-neumorphic (LC.*).
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useCopilotChatInternal } from '@copilotkit/react-core';
import { FileText, Globe, Database, X, ExternalLink, Layers, Paperclip } from 'lucide-react';
import { LC } from '@/lib/librechat-theme';
import { attachedDocsAtom } from '@/shared/stores/workspace-store';
import { buildToolCallInfo } from '../workspace/tool-receipt';

type DocRow = {
  id: string;
  fileName: string;
  mimeType: string | null;
  sizeBytes: number | null;
  status: 'uploading' | 'processing' | 'ready' | 'failed';
  extractedChars: number | null;
  error: string | null;
  createdAt: string;
};

const STATUS_STYLE: Record<DocRow['status'], { label: string; color: string; bg: string }> = {
  uploading: { label: 'Uploading', color: '#7c6f00', bg: 'rgba(234,179,8,0.15)' },
  processing: { label: 'Processing', color: '#6d28d9', bg: 'rgba(139,92,246,0.15)' },
  ready: { label: 'Ready', color: '#047857', bg: 'rgba(16,185,129,0.15)' },
  failed: { label: 'Failed', color: '#b91c1c', bg: 'rgba(239,68,68,0.15)' },
};

type ChatDoc = { key: string; fileName: string; documentId?: string; passages: number; bestSim: number };
type ChatWeb = { url: string; title: string; scope: string };
type ChatTrace = { docs: ChatDoc[]; web: ChatWeb[] };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseResult(result: unknown): any | null {
  if (result == null) return null;
  if (typeof result === 'object') return result;
  if (typeof result === 'string') {
    const t = result.trim();
    if (!t) return null;
    try {
      return JSON.parse(t);
    } catch {
      return null;
    }
  }
  return null;
}

function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function formatSize(bytes: number | null): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Derive the documents + web sources this conversation actually pulled, from the
 *  recorded tool results (same trace the per-answer receipts read). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deriveChatTrace(messages: any[], toolCallInfo: Map<string, { name: string; args: unknown }>): ChatTrace {
  const docMap = new Map<string, ChatDoc>();
  const webMap = new Map<string, ChatWeb>();
  for (const m of messages ?? []) {
    if (m?.role !== 'tool' || !m.toolCallId) continue;
    const call = toolCallInfo.get(m.toolCallId);
    if (!call) continue;
    const obj = parseResult(m.content);
    if (!obj) continue;

    if (call.name === 'searchCompanyDocuments' && Array.isArray(obj.passages)) {
      for (const p of obj.passages) {
        const fileName = String(p?.source ?? p?.fileName ?? 'document');
        const documentId = typeof p?.documentId === 'string' ? p.documentId : undefined;
        const key = documentId ?? fileName;
        const sim = typeof p?.similarity === 'number' ? p.similarity : 0;
        const existing = docMap.get(key);
        if (existing) {
          existing.passages += 1;
          existing.bestSim = Math.max(existing.bestSim, sim);
        } else {
          docMap.set(key, { key, fileName, documentId, passages: 1, bestSim: sim });
        }
      }
    } else if ((call.name === 'searchWeb' || call.name === 'searchCanadianTax') && Array.isArray(obj.results)) {
      for (const r of obj.results) {
        if (!r || typeof r.url !== 'string' || webMap.has(r.url)) continue;
        webMap.set(r.url, { url: r.url, title: String(r.title ?? r.url), scope: call.name === 'searchCanadianTax' ? 'CA tax' : 'Web' });
      }
    } else if (call.name === 'fetchWebPage') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const argUrl = call.args && typeof (call.args as any).url === 'string' ? (call.args as any).url : null;
      const url = typeof obj.url === 'string' ? obj.url : argUrl;
      if (url && !webMap.has(url)) webMap.set(url, { url, title: url, scope: 'Read' });
    }
  }
  return { docs: [...docMap.values()], web: [...webMap.values()] };
}

async function openDocument(id?: string) {
  if (!id) return;
  try {
    const res = await fetch(`/api/documents/${id}`);
    if (!res.ok) return;
    const data = (await res.json()) as { downloadUrl?: string | null };
    if (data.downloadUrl) window.open(data.downloadUrl, '_blank', 'noopener');
  } catch {
    // ignore
  }
}

export function DataFilesPanel({ compact = false }: { compact?: boolean }) {
  const internal = useCopilotChatInternal() as unknown as { messages?: unknown[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages = (internal.messages ?? []) as any[];
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'chat' | 'library'>('chat');

  // Files the user attached IN the chat — the same atom the model reads from, so
  // if a file is listed here it is provably in this conversation's context.
  const attached = useAtomValue(attachedDocsAtom);

  const trace = useMemo(() => deriveChatTrace(messages, buildToolCallInfo(messages)), [messages]);
  const traceCount = trace.docs.length + trace.web.length + attached.length;

  const [libDocs, setLibDocs] = useState<DocRow[]>([]);
  const [libLoaded, setLibLoaded] = useState(false);

  useEffect(() => {
    if (!open || libLoaded) return;
    (async () => {
      try {
        const res = await fetch('/api/documents');
        if (res.ok) {
          const data = (await res.json()) as { documents?: DocRow[] };
          setLibDocs(data.documents ?? []);
        }
      } catch {
        // fail-soft
      }
      setLibLoaded(true);
    })();
  }, [open, libLoaded]);

  const usedIds = useMemo(() => new Set(trace.docs.map((d) => d.documentId).filter(Boolean) as string[]), [trace]);
  const usedNames = useMemo(() => new Set(trace.docs.map((d) => d.fileName)), [trace]);
  const height = compact ? 32 : 38;

  return (
    <div style={{ flexShrink: 0 }}>
      <button
        data-testid="data-panel-button"
        onClick={() => setOpen(true)}
        className="hover:bg-black/5"
        title="Data & files — what Sina is looking into"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 7, height, padding: '0 12px',
          borderRadius: 999, border: `1px solid ${LC.borderSubtle}`, background: 'transparent',
          color: LC.body, cursor: 'pointer', fontSize: 12.5, fontWeight: 550,
        }}
      >
        <Database size={14} style={{ color: LC.muted }} />
        Data
        {traceCount > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: LC.faint }}>{traceCount}</span>}
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(24,24,27,0.18)', zIndex: 49 }} />
          <div
            data-testid="data-panel"
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(400px, 94vw)', zIndex: 50,
              background: LC.surface, borderLeft: `1px solid ${LC.border}`, boxShadow: LC.shadowOut,
              display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{ padding: '14px 16px 10px', borderBottom: `1px solid ${LC.borderSubtle}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Layers size={16} style={{ color: LC.accent }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: LC.text }}>Data &amp; files</span>
                <button
                  onClick={() => setOpen(false)}
                  title="Close"
                  style={{ marginLeft: 'auto', display: 'grid', placeItems: 'center', width: 28, height: 28, borderRadius: 8, border: 'none', background: 'transparent', color: LC.muted, cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>
              <div style={{ fontSize: 11.5, color: LC.muted, lineHeight: 1.45, marginTop: 3 }}>
                What Sina is looking into — open any source and verify it yourself.
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
                <TabButton active={tab === 'chat'} onClick={() => setTab('chat')} label="This chat" count={traceCount} />
                <TabButton active={tab === 'library'} onClick={() => setTab('library')} label="Library" count={libLoaded ? libDocs.length : undefined} />
              </div>
            </div>

            {/* Body */}
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '10px 12px 16px' }}>
              {tab === 'chat' ? (
                traceCount === 0 ? (
                  <EmptyNote text="Nothing yet in this conversation. Attach a file in the composer, or ask Sina to search your documents or the web, and everything it looks at will show here." />
                ) : (
                  <>
                    {attached.length > 0 && (
                      <Section title="Attached to this chat">
                        {attached.map((d) => (
                          <SourceRow
                            key={d.id}
                            icon={<Paperclip size={14} style={{ color: LC.faint, flexShrink: 0 }} />}
                            title={d.fileName}
                            subtitle={`${d.kind.toUpperCase()} · ${d.pages ? `${d.pages} page${d.pages > 1 ? 's' : ''}` : `${d.chars.toLocaleString()} chars`}${d.truncated ? ' · truncated' : ''}`}
                            badge={
                              <span
                                style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase', color: '#047857', background: 'rgba(16,185,129,0.14)', borderRadius: 5, padding: '1px 6px', flexShrink: 0 }}
                                title="Its extracted text is in the chat's context — Sina can read it"
                              >
                                In context
                              </span>
                            }
                          />
                        ))}
                      </Section>
                    )}
                    {trace.docs.length > 0 && (
                      <Section title="Documents">
                        {trace.docs.map((d) => (
                          <SourceRow
                            key={d.key}
                            icon={<FileText size={14} style={{ color: LC.faint, flexShrink: 0 }} />}
                            title={d.fileName}
                            subtitle={`${d.passages} passage${d.passages > 1 ? 's' : ''}${d.bestSim ? ` · ${Math.round(Math.max(0, Math.min(1, d.bestSim)) * 100)}% match` : ''}`}
                            onOpen={d.documentId ? () => void openDocument(d.documentId) : undefined}
                          />
                        ))}
                      </Section>
                    )}
                    {trace.web.length > 0 && (
                      <Section title="Web sources">
                        {trace.web.map((w) => (
                          <SourceRow
                            key={w.url}
                            icon={<Globe size={14} style={{ color: LC.faint, flexShrink: 0 }} />}
                            title={w.title}
                            subtitle={`${domainOf(w.url)} · ${w.scope}`}
                            external
                            onOpen={() => window.open(w.url, '_blank', 'noopener')}
                          />
                        ))}
                      </Section>
                    )}
                  </>
                )
              ) : !libLoaded ? (
                <EmptyNote text="Loading your documents…" />
              ) : libDocs.length === 0 ? (
                <EmptyNote text="No documents uploaded yet. Upload company files on the Documents page and Sina can search them." />
              ) : (
                <Section title={`Your documents · ${libDocs.length}`}>
                  {libDocs.map((d) => {
                    const s = STATUS_STYLE[d.status];
                    const used = usedIds.has(d.id) || usedNames.has(d.fileName);
                    return (
                      <SourceRow
                        key={d.id}
                        icon={<FileText size={14} style={{ color: LC.faint, flexShrink: 0 }} />}
                        title={d.fileName}
                        subtitle={`${formatSize(d.sizeBytes)}${d.extractedChars ? ` · ${(d.extractedChars / 1000).toFixed(0)}k chars` : ''}`}
                        onOpen={() => void openDocument(d.id)}
                        badge={
                          <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center', flexShrink: 0 }}>
                            {used && (
                              <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase', color: LC.accent, background: 'rgba(167,139,250,0.12)', borderRadius: 5, padding: '1px 5px' }}>Used here</span>
                            )}
                            <span style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 8px', borderRadius: 999, color: s.color, background: s.bg }} title={d.error ?? undefined}>{s.label}</span>
                          </span>
                        }
                      />
                    );
                  })}
                </Section>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function TabButton({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count?: number }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 8,
        border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 600,
        background: active ? LC.surfaceHover : 'transparent',
        color: active ? LC.text : LC.muted,
      }}
    >
      {label}
      {typeof count === 'number' && count > 0 && <span style={{ fontSize: 10.5, fontWeight: 700, color: LC.faint }}>{count}</span>}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: LC.faint, padding: '2px 6px 6px' }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{children}</div>
    </div>
  );
}

function SourceRow({
  icon, title, subtitle, onOpen, external = false, badge,
}: {
  icon: React.ReactNode; title: string; subtitle: string; onOpen?: () => void; external?: boolean; badge?: React.ReactNode;
}) {
  const clickable = !!onOpen;
  return (
    <div
      className={clickable ? 'lc-sourcerow' : undefined}
      onClick={onOpen}
      style={{
        display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', borderRadius: 10,
        cursor: clickable ? 'pointer' : 'default',
      }}
    >
      {icon}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 13, fontWeight: 550, color: LC.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
          {external && clickable && <ExternalLink size={11} style={{ color: LC.faint, flexShrink: 0 }} />}
        </div>
        <div style={{ fontSize: 11, color: LC.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subtitle}</div>
      </div>
      {badge}
    </div>
  );
}

function EmptyNote({ text }: { text: string }) {
  return <div style={{ padding: '18px 10px', fontSize: 12.5, color: LC.muted, lineHeight: 1.55 }}>{text}</div>;
}

export function DataFilesPanelStyles() {
  return <style>{`.lc-sourcerow:hover { background: ${LC.surfaceHover}; }`}</style>;
}
