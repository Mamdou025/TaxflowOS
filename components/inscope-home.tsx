'use client';

// ─────────────────────────────────────────────────────────────────────────────
// InScopeHome — Manus-style neumorphic home. Replaces the orbital-stage home.
// The collapsed InScopeSidebar is the main menu; the centre is a greeting + a
// composer that opens the assistant. (Full in-place thread morph is a later step.)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import { useCopilotChat } from '@copilotkit/react-core';
import { TextMessage, Role } from '@copilotkit/runtime-client-gql';
import { InScopeSidebar, SIDEBAR_RESERVED_W } from '@/components/inscope-sidebar';

const BG = '#F4F5F8';
const SURFACE = '#F8F9FB';
const SURFACE2 = '#EDEEF2';
const TEXT_PRIMARY = '#202735';
const TEXT_SECONDARY = '#7C8493';
const TEXT_TERTIARY = '#A8AEBA';
const BORDER = 'rgba(0,0,0,0.07)';
const SHADOW_OUT = '8px 8px 18px rgba(158,158,178,0.36), -8px -8px 18px rgba(255,255,255,0.82)';
const SHADOW_IN = 'inset 5px 5px 12px rgba(158,158,178,0.32), inset -5px -5px 12px rgba(255,255,255,0.80)';
const SHADOW_SM = '4px 4px 10px rgba(158,158,178,0.28), -4px -4px 10px rgba(255,255,255,0.76)';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

const SUGGESTIONS = ['Calculate 2025 FAPI for Northstar', 'Open T1134 for Cascade', 'Review FAPI exceptions'];

export function InScopeHome() {
  const router = useRouter();
  const { appendMessage } = useCopilotChat();
  const [input, setInput] = useState('');
  const [hello, setHello] = useState('Good day');
  const ref = useRef<HTMLInputElement>(null);

  // set greeting on client to avoid SSR mismatch, focus the composer
  useEffect(() => { setHello(greeting()); ref.current?.focus(); }, []);

  // Carry what was typed here into the assistant thread (the CopilotKit provider
  // lives above the router, so the message survives the navigation), then open
  // the full-page chat so it continues the conversation instead of a blank chat.
  const send = (text: string) => {
    const t = text.trim();
    if (t) appendMessage(new TextMessage({ content: t, role: Role.User }));
    setInput('');
    router.push('/chat');
  };
  const submit = () => send(input);

  return (
    <div
      style={{
        height: '100%', position: 'relative', overflow: 'hidden',
        fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
        // EXACT workflow-builder canvas background: dark #18181c with the white
        // Lines grid (rgba(255,255,255,0.055), gap 28). Matches persistent-canvas.tsx.
        backgroundColor: '#18181c',
        backgroundImage:
          'linear-gradient(to right, rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.055) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      <InScopeSidebar />

      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingLeft: SIDEBAR_RESERVED_W }}>
        {/* logo */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '26px 32px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, userSelect: 'none' }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#ededf0', letterSpacing: '-0.01em' }}>Sinaxe</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', verticalAlign: 'super' }}>™</span>
            <span style={{ fontSize: 20, fontWeight: 400, color: 'rgba(255,255,255,0.55)', marginLeft: 4, letterSpacing: '-0.01em' }}>InScope</span>
          </div>
        </div>

        {/* greeting + composer, centred */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 40px', gap: 18, minHeight: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ margin: 0, fontSize: 'clamp(28px, 3.4vw, 40px)', fontWeight: 700, color: '#f4f4f6', letterSpacing: '-0.03em', lineHeight: 1.15 }}>{hello}, Sophia</h1>
            <p style={{ margin: '6px 0 0', fontSize: 'clamp(13px, 1.3vw, 16px)', color: 'rgba(255,255,255,0.55)', fontWeight: 400 }}>How can I help you drive impact today?</p>
          </div>

          <div style={{ width: '100%', maxWidth: 760 }}>
            <style>{`.ish-composer::placeholder { color: rgba(255,255,255,0.35); }`}</style>
            {/* Dark glassy composer — blends into the grid canvas, no neumorphic shadow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.045)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderRadius: 999, border: '1px solid rgba(255,255,255,0.09)', padding: '15px 15px 15px 26px' }}>
              <input
                ref={ref}
                className="ish-composer"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
                placeholder="e.g. Calculate 2025 FAPI for Northstar Inc…"
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 16, color: '#ededf0', fontFamily: 'inherit' }}
              />
              <button
                onMouseDown={(e) => { e.preventDefault(); submit(); }}
                aria-label="Open assistant"
                style={{ width: 42, height: 42, borderRadius: 15, flexShrink: 0, background: input.trim() ? '#6B21A8' : 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', color: input.trim() ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'all 160ms cubic-bezier(0.23,1,0.32,1)' }}
              >
                <Send size={15} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 14 }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '6px 14px', fontSize: 12, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: 'all 140ms ease-out', whiteSpace: 'nowrap' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ededf0'; e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                >{s}</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ height: 40, flexShrink: 0 }} />
      </div>
    </div>
  );
}
