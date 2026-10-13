

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
import { useAtomValue, useStore } from 'jotai';
import { ExternalLink } from 'lucide-react';
import { pageChatSurfacesAtom } from '@/lib/page-chat-store';
import { getPage } from '@/shared/stores/resource-registry';
import { openWorkspaceWindowAtom } from '@/shared/stores/workspace-store';
import { chatPanelModeAtom } from '@/shared/stores/chat-store';
import { useRouter } from '@/lib/router';

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
  const store = useStore();
  const router = useRouter();
  const surface = surfaces[pageKey];
  const page = getPage(pageKey);
  const title = surface?.title ?? page?.title ?? pageKey;
  // Most registered pages have no compact Embed authored yet (see branch 2 below),
  // so this is the one way out of the bounded 440px scroll box when a page wasn't
  // designed to fit there — open it properly, docked beside the still-mounted chat.
  const openFullPage = () => {
    store.set(chatPanelModeAtom, 'split');
    store.set(openWorkspaceWindowAtom, { pageKey, title });
    router.push('/');
  };

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
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 10px 9px 14px',
              borderBottom: '1px solid rgba(0,0,0,0.07)',
              fontSize: 12.5,
              fontWeight: 600,
              color: '#3f3f46',
            }}
          >
            <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {page.title}
              <span style={{ marginLeft: 8, fontWeight: 400, color: '#9ca3af' }}>{page.subtitle}</span>
            </span>
            <button
              type="button"
              onClick={openFullPage}
              title={`Open ${page.title} as its own page, docked beside this chat`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                marginLeft: 'auto',
                flexShrink: 0,
                fontSize: 11.5,
                fontWeight: 550,
                color: '#3f3f46',
                background: '#fff',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: 7,
                padding: '4px 9px',
                cursor: 'pointer',
              }}
            >
              <ExternalLink size={11} /> Open page
            </button>
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
