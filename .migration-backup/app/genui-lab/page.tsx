'use client';

// ─────────────────────────────────────────────────────────────────────────────
// GenUI Lab — the spike proving free-form "prompt → live UI" on this stack.
//
// Type anything ("a dashboard with 3 KPI tiles and a bar chart of dividends by
// year", "a table of my foreign affiliates", "a form to enter an FX rate"). The
// prompt hits /api/genui, the model streams OpenUI Lang, and <Renderer> mounts
// real components from genuiLibrary as the tokens arrive — nothing prebuilt per
// request. Delete this page (and /api/genui) if we fold GenUI into the assistant.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { Renderer } from '@openuidev/react-lang';
import { genuiLibrary } from '@/features/genui/library';
import '@openuidev/react-ui/index.css';
import '@openuidev/react-ui/components.css';

// Belt-and-suspenders: strip any markdown code fences the model adds despite the
// system instruction, so the Renderer only ever sees raw OpenUI Lang.
function stripFences(s: string): string {
  return s.replace(/^\s*```[a-zA-Z]*\n?/, '').replace(/\n?```\s*$/, '');
}

const EXAMPLES = [
  'A dashboard: 3 KPI tiles (FAPI $1.24M +12%, Surplus $860k, Tax payable $310k) above a bar chart of dividends by year 2021–2025.',
  'A table of 4 foreign affiliates with columns Name, Jurisdiction, Ownership %, Surplus balance.',
  'A short form to enter an FX rate and a dividend amount, with a submit button.',
  'A pie chart breaking down income by category, and a callout summarizing the largest slice.',
];

export default function GenUILab() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(text: string) {
    if (!text.trim() || streaming) return;
    setResponse('');
    setError(null);
    setStreaming(true);
    try {
      const res = await fetch('/api/genui', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: text }] }),
      });
      if (!res.ok || !res.body) {
        setError(`Request failed (${res.status}): ${await res.text()}`);
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
  }

  // Preset entry: a "@ Generate…" command from the assistant lands here with the
  // prompt in ?p=… — prefill it and run once so the tag produces UI immediately.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('p');
    if (p) { setPrompt(p); run(p); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>GenUI Lab</h1>
      <p style={{ color: '#71717a', fontSize: 14, marginTop: 4 }}>
        Prompt → live UI. The model composes real components from the registered library — nothing is prebuilt per request.
      </p>

      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') run(prompt); }}
          placeholder="Describe the UI you want…"
          style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #e4e4e7', fontSize: 14 }}
        />
        <button
          onClick={() => run(prompt)}
          disabled={streaming}
          style={{ padding: '10px 18px', borderRadius: 8, border: 'none', background: '#18181b', color: '#fff', fontSize: 14, fontWeight: 600, cursor: streaming ? 'default' : 'pointer', opacity: streaming ? 0.6 : 1 }}
        >
          {streaming ? 'Generating…' : 'Generate'}
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => { setPrompt(ex); run(ex); }}
            style={{ fontSize: 12, color: '#3f3f46', background: '#f4f4f5', border: '1px solid #e4e4e7', borderRadius: 999, padding: '4px 10px', cursor: 'pointer' }}
          >
            {ex.length > 48 ? ex.slice(0, 46) + '…' : ex}
          </button>
        ))}
      </div>

      {error ? (
        <pre style={{ marginTop: 20, color: '#dc2626', fontSize: 13, whiteSpace: 'pre-wrap' }}>{error}</pre>
      ) : null}

      <div style={{ marginTop: 24, border: '1px solid #f0f0f0', borderRadius: 12, padding: 16, minHeight: 120 }}>
        {response ? (
          <Renderer
            library={genuiLibrary}
            response={stripFences(response)}
            isStreaming={streaming}
            onError={(errs) => { if (errs?.length) console.error('[GenUI Renderer]', errs); }}
          />
        ) : (
          <div style={{ color: '#a1a1aa', fontSize: 14 }}>Generated UI will appear here.</div>
        )}
      </div>

      {response ? (
        <details style={{ marginTop: 16 }}>
          <summary style={{ fontSize: 12, color: '#71717a', cursor: 'pointer' }}>Raw OpenUI Lang</summary>
          <pre style={{ fontSize: 11, background: '#fafafa', padding: 12, borderRadius: 8, overflowX: 'auto', whiteSpace: 'pre-wrap' }}>{response}</pre>
        </details>
      ) : null}
    </div>
  );
}
