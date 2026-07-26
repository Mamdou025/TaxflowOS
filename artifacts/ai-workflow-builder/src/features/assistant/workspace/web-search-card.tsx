'use client';

// ─────────────────────────────────────────────────────────────────────────────
// WebSearchCard — the inline result card for Sina's `searchWeb` tool. Reads the
// results the tool handler wrote to webSearchResultsAtom (keyed by query) and shows
// them in the chat: a header, then a list of sources (domain · title · snippet),
// each a link that opens in a new tab. Light-neumorphic to match the chat surface
// (LC theme). Shows a searching state while the fetch is in flight, and a plain note
// when the search is unconfigured / empty / failed.
// ─────────────────────────────────────────────────────────────────────────────

import { useAtomValue } from 'jotai';
import { Globe, ExternalLink, Search, Landmark } from 'lucide-react';
import { LC } from '@/lib/librechat-theme';
import { webSearchResultsAtom, webSearchKey, type WebSearchScope } from '@/shared/stores/web-search-store';

function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

const SCOPE_LABEL: Record<WebSearchScope, string> = {
  web: 'Web results',
  'ca-tax': 'Official Canadian tax sources',
};

export function WebSearchCard({ query, scope = 'web' }: { query: string; scope?: WebSearchScope }) {
  const map = useAtomValue(webSearchResultsAtom);
  const state = map[webSearchKey(scope, query)];
  const status = state?.status ?? 'searching';
  const results = state?.results ?? [];
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
          {state?.note ?? 'No web results found.'}
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
