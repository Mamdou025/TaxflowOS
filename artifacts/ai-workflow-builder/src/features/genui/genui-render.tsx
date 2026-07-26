

// ─────────────────────────────────────────────────────────────────────────────
// GenUIRender — OpenUI generation mounted INSIDE the chat.
//
// This is the "renderUI bridge" (step 2): the CopilotKit `generateUI` action's
// render mounts this, so free-form "prompt → live UI" happens in the conversation
// instead of the standalone /genui-lab. On mount it POSTs the prompt to
// /api/genui (same endpoint as the lab — gpt-4.1 + prose-retry), streams the
// OpenUI Lang, and feeds it to <Renderer library={genuiLibrary}> which mounts
// real components as tokens arrive.
//
// Imported (statically) only from use-assistant, which is a 'use client' module,
// so @openuidev/react-lang's import-time React.createContext runs in the normal
// client/SSR React build — never the RSC react-server build that lacks it (that
// constraint only bites route handlers / server components, e.g. /api/genui).
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react';
import { Renderer } from '@openuidev/react-lang';
import { ThemeProvider } from '@openuidev/react-ui';
import { genuiLibrary } from '@/features/genui/library';
import '@openuidev/react-ui/index.css';
import '@openuidev/react-ui/components.css';

// Belt-and-suspenders: strip any markdown fences the model adds, so the Renderer
// only ever sees raw OpenUI Lang (mirrors the lab + the route's own guard).
function stripFences(s: string): string {
  return s.replace(/^\s*```[a-zA-Z]*\n?/, '').replace(/\n?```\s*$/, '');
}

// Light card so the generated UI reads as one consistent "artifact surface" on
// the dark chat — same treatment the run-flow gets via `.aside-thread
// [data-run-flow]`. OpenUI itself is forced to light (ThemeProvider mode="light")
// below so its cards blend in instead of rendering dark. overflowX lets a layout
// wider than the column scroll inside the card rather than break the page.
const CARD: React.CSSProperties = {
  background: '#f7f7f8',
  border: '1px solid rgba(0,0,0,0.07)',
  borderRadius: 14,
  padding: '14px 16px',
  width: '100%',
  maxWidth: '100%',
  overflowX: 'auto',
};

export function GenUIRender({ prompt }: { prompt: string }) {
  const [response, setResponse] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedFor = useRef<string | null>(null);

  // The prompt arrives token-by-token as the tool args stream, so debounce: wait
  // ~300ms for it to settle, then fetch ONCE for the final prompt (guarded by
  // fetchedFor so a re-render with the same prompt doesn't re-fetch).
  useEffect(() => {
    const text = prompt?.trim();
    if (!text) return;
    const timer = setTimeout(() => {
      if (fetchedFor.current === text) return;
      fetchedFor.current = text;
      setError(null);
      setResponse('');
      setStreaming(true);
      (async () => {
        try {
          const res = await fetch('/api/genui', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: [{ role: 'user', content: text }] }),
          });
          if (!res.ok || !res.body) {
            const detail = await res.text().catch(() => '');
            setError(`Request failed (${res.status})${detail ? ` — ${detail.slice(0, 200)}` : ''}`);
            setStreaming(false);
            return;
          }
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let acc = '';
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            acc += decoder.decode(value, { stream: true });
            setResponse(acc);
          }
        } catch (e) {
          setError(String(e));
        } finally {
          setStreaming(false);
        }
      })();
    }, 300);
    return () => clearTimeout(timer);
  }, [prompt]);

  if (error) {
    return <div style={{ ...CARD, fontSize: 12.5, color: '#b91c1c' }}>Couldn’t generate that view — {error}</div>;
  }
  if (!response) {
    return <div style={{ ...CARD, fontSize: 12.5, color: '#71717a' }}>Composing the view…</div>;
  }
  return (
    <div data-genui style={CARD}>
      <ThemeProvider mode="light">
        <Renderer
          library={genuiLibrary}
          response={stripFences(response)}
          isStreaming={streaming}
          onError={(errs) => { if (errs?.length) console.error('[GenUI Renderer]', errs); }}
        />
      </ThemeProvider>
    </div>
  );
}
