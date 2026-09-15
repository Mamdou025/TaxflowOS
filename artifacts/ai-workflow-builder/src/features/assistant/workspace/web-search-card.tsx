'use client';

// ─────────────────────────────────────────────────────────────────────────────
// WebSearchCard — the inline result card for Sina's `searchWeb` tool. Reads the
// results the tool handler wrote to webSearchResultsAtom (keyed by query) and shows
// them in the chat: a header, then a list of sources (domain · title · snippet),
// each a link that opens in a new tab. Light-neumorphic to match the chat surface
// (LC theme). Shows a searching state while the fetch is in flight, and a plain note
// when the search is unconfigured / empty / failed.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { Globe, ExternalLink, Search, Landmark } from 'lucide-react';
import { LC } from '@/lib/librechat-theme';
import {
  webSearchResultsAtom,
  webSearchKey,
  type WebSearchScope,
  type WebSearchResult,
  type WebSearchStatus,
} from '@/shared/stores/web-search-store';

function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

// Derive card state from the tool's RECORDED result (persisted with the message),
// so a reloaded thread still shows its sources. Live searches drive the card via
// the in-memory atom; this is the durable fallback when the atom is empty.
function normalizeRecordedResult(
  result: unknown,
): { status: WebSearchStatus; results: WebSearchResult[]; note?: string } | null {
  if (result == null) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let obj: any = result;
  if (typeof result === 'string') {
    const t = result.trim();
    if (!t) return null;
    try {
      obj = JSON.parse(t);
    } catch {
      return null;
    }
  }
  if (!obj || typeof obj !== 'object') return null;
  const results: WebSearchResult[] = Array.isArray(obj.results)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? obj.results
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((r: any) => r && typeof r.url === 'string')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((r: any) => ({ title: String(r.title ?? r.url), url: String(r.url), snippet: String(r.snippet ?? '') }))
    : [];
  const note = typeof obj.error === 'string' ? obj.error : typeof obj.note === 'string' ? obj.note : undefined;
  const status: WebSearchStatus = results.length ? 'done' : note ? 'error' : 'empty';
  return { status, results, note };
}

const SCOPE_LABEL: Record<WebSearchScope, string> = {
  web: 'Web results',
  'ca-tax': 'Official Canadian tax sources',
};

export function WebSearchCard({ query, scope = 'web', result }: { query: string; scope?: WebSearchScope; result?: unknown }) {
  const map = useAtomValue(webSearchResultsAtom);
  const live = map[webSearchKey(scope, query)];
  // Live atom wins while fresh; the recorded result is the fallback on reload.
  const recorded = useMemo(() => normalizeRecordedResult(result), [result]);
  const status = live?.status ?? recorded?.status ?? 'searching';
  const results = (live?.results?.length ? live.results : recorded?.results) ?? [];
  const note = live?.note ?? recorded?.note;
  const HeaderIcon = scope === 'ca-tax' ? Landmark : Search;

  return (
    <div
      style={{
        maxWidth: 660,
        background: LC.surface,
        border: `1px solid ${LC.borderSubtle}`,
        borderRadius: 12,
        boxShadow: LC.shadowSm,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 13px', borderBottom: `1px solid ${LC.borderSubtle}` }}>
        <span style={{ display: 'inline-flex', color: LC.accent }}><HeaderIcon size={14} /></span>
        <span style={{ fontSize: 12.5, fontWeight: 650, color: LC.text }}>{SCOPE_LABEL[scope]}</span>
        <span style={{ fontSize: 12, color: LC.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, flex: 1 }}>
          {query.trim()}
        </span>
        {status === 'done' && results.length > 0 && (
          <span style={{ fontSize: 11, fontWeight: 600, color: LC.muted, flexShrink: 0 }}>{results.length}</span>
        )}
      </div>

      {/* Body */}
      {status === 'searching' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 13px', fontSize: 12.5, color: LC.muted }}>
          <Globe size={13} className="cwp-spin" />
          <span>Searching the web…</span>
          <style>{`
            .cwp-spin { animation: cwp-spin 1.1s linear infinite; }
            @keyframes cwp-spin { to { transform: rotate(360deg); } }
            @media (prefers-reduced-motion: reduce) { .cwp-spin { animation: none; } }
          `}</style>
        </div>
      ) : results.length === 0 ? (
        <div style={{ padding: '14px 13px', fontSize: 12.5, color: LC.muted }}>
          {note ?? 'No web results found.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {results.map((r, i) => (
            <a
              key={`${r.url}-${i}`}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="cwp-web-hit"
              style={{
                display: 'block',
                padding: '10px 13px',
                borderTop: i === 0 ? 'none' : `1px solid ${LC.borderSubtle}`,
                textDecoration: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <Globe size={11} style={{ color: LC.faint, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: LC.faint, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>{domainOf(r.url)}</span>
                <ExternalLink size={10} style={{ color: LC.faint, flexShrink: 0, marginLeft: 'auto' }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: LC.accent, lineHeight: 1.35, marginBottom: 3 }}>{r.title}</div>
              {r.snippet && (
                <div
                  style={{
                    fontSize: 12, color: LC.muted, lineHeight: 1.5,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}
                >
                  {r.snippet}
                </div>
              )}
            </a>
          ))}
          <style>{`.cwp-web-hit:hover { background: ${LC.surfaceHover}; }`}</style>
        </div>
      )}
    </div>
  );
}
