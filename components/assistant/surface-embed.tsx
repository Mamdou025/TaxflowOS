'use client';

// ─────────────────────────────────────────────────────────────────────────────
// SurfaceEmbed — renders a page/panel INSIDE the chat thread.
//
// The render half of the Page ⇄ Chat contract (`lib/page-chat-store.ts`). The
// assistant's `bringIntoChat` action mounts this with a pageKey. It prefers the
// page's registered compact `Embed`; if none, it falls back to the real registered
// page component in a bounded, scrollable card. An error boundary keeps a page
// that misbehaves when embedded from breaking the whole thread.
// ─────────────────────────────────────────────────────────────────────────────

import { Component, type ReactNode } from 'react';
import { useAtomValue } from 'jotai';
import { pageChatSurfacesAtom } from '@/lib/page-chat-store';
import { getPage } from '@/lib/resource-registry';

// Light card so the embed reads as one "artifact surface" on the dark chat — same
// treatment GenUIRender / the run-flow get.
const CARD: React.CSSProperties = {
  background: '#f7f7f8',
  border: '1px solid rgba(0,0,0,0.07)',
  borderRadius: 14,
  width: '100%',
  maxWidth: '100%',
  overflow: 'hidden',
};

class EmbedBoundary extends Component<{ label: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) {
      return (
        <div style={{ ...CARD, padding: '14px 16px', fontSize: 12.5, color: '#71717a' }}>
          {this.props.label} can’t be shown inline here — open it as a tab instead.
        </div>
      );
    }
    return this.props.children;
  }
}

export function SurfaceEmbed({ pageKey }: { pageKey: string }) {
  const surfaces = useAtomValue(pageChatSurfacesAtom);
  const surface = surfaces[pageKey];
  const page = getPage(pageKey);
  const title = surface?.title ?? page?.title ?? pageKey;

  // 1) A page-authored compact embed — the intended, lightweight representation.
  if (surface?.Embed) {
    const Embed = surface.Embed;
    return (
      <EmbedBoundary label={title}>
        <div data-surface-embed={pageKey} style={CARD}>
          <Embed />
        </div>
      </EmbedBoundary>
    );
  }

  // 2) Fallback — the real registered page, bounded + scrollable so a full document
  //    lives in the conversation without taking over the thread.
  if (page) {
    const PageComponent = page.Component;
    return (
      <EmbedBoundary label={title}>
        <div data-surface-embed={pageKey} style={CARD}>
          <div
            style={{
              padding: '9px 14px',
              borderBottom: '1px solid rgba(0,0,0,0.07)',
              fontSize: 12.5,
              fontWeight: 600,
              color: '#3f3f46',
            }}
          >
            {page.title}
            <span style={{ marginLeft: 8, fontWeight: 400, color: '#9ca3af' }}>{page.subtitle}</span>
          </div>
          <div style={{ maxHeight: 440, overflow: 'auto' }}>
            <PageComponent />
          </div>
        </div>
      </EmbedBoundary>
    );
  }

  // 3) Nothing registered under this key.
  return (
    <div style={{ ...CARD, padding: '14px 16px', fontSize: 12.5, color: '#71717a' }}>
      Nothing to show for “{pageKey}”. Open the page first, then bring it in.
    </div>
  );
}
