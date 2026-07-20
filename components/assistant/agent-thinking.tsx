'use client';

// ─────────────────────────────────────────────────────────────────────────────
// AgentThinking — the scripted "thinking" narration that plays in place of the
// plain typing dots while an addressed agent's reply streams. It reads the
// thinkingCoworkerAtom (set the instant you send an instruction to an agent) and
// reveals that agent's narration lines ONE AT A TIME with human timing, so a
// handoff reads as the agent working THROUGH steps — not an instant proposal card.
//
// Rendered as a full message row (avatar + narration) at two call sites: the
// CopilotKit activity fallback (before the assistant message object exists) and
// the AsideAssistantMessage loading branch (once it does). Only one is mounted at
// a time, and both read the same atom, so the narration is seamless across the two
// phases. The atom is cleared by AsideAssistantMessage once real content arrives.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { thinkingCoworkerAtom } from '@/lib/workspace-store';
import { LC } from '@/lib/librechat-theme';
import { CoworkerAvatar } from './coworker-avatar';

const STEP_MS = 1200; // cadence between narration lines — paced to feel deliberate

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/** Progressive reveal: `visible` climbs from 1 → total on a timer (all at once if
 *  reduced motion). Stops at the last line and holds — the real reply unmounts us. */
function useTimedReveal(total: number): number {
  const [visible, setVisible] = useState(() => (prefersReducedMotion() ? total : 1));
  useEffect(() => {
    if (prefersReducedMotion() || total <= 1) { setVisible(total); return; }
    setVisible(1);
    const id = setInterval(() => {
      setVisible((n) => {
        if (n >= total) { clearInterval(id); return n; }
        return n + 1;
      });
    }, STEP_MS);
    return () => clearInterval(id);
  }, [total]);
  return visible;
}

/** Reads the atom itself; renders nothing if no agent is currently "thinking". */
export function AgentThinking() {
  const thinking = useAtomValue(thinkingCoworkerAtom);
  if (!thinking) return null;
  return <AgentThinkingRow lines={thinking.lines} coworker={thinking.coworker} />;
}

function AgentThinkingRow({ lines, coworker }: { lines: string[]; coworker: Parameters<typeof CoworkerAvatar>[0]['coworker'] }) {
  const steps = lines.length ? lines : ['Thinking…'];
  const visible = useTimedReveal(steps.length);
  return (
    <div className="lc-row" data-agent-thinking>
      <style>{`
        @keyframes at-rise { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
        .at-line { animation: at-rise 320ms cubic-bezier(0.23,1,0.32,1) both; }
        @keyframes at-pulse { 0%,100% { opacity: .5; } 50% { opacity: 1; } }
        .at-cursor { animation: at-pulse 1.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .at-line { animation: none; } .at-cursor { animation: none; } }
      `}</style>
      <div className="lc-avatar"><CoworkerAvatar coworker={coworker} size={26} /></div>
      <div style={{ minWidth: 0, flex: 1, paddingTop: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {steps.slice(0, visible).map((line, i) => {
          const isLast = i === visible - 1;
          return (
            <div
              key={i}
              className="at-line"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 14, lineHeight: 1.5, color: isLast ? LC.body : LC.muted, transition: 'color 300ms' }}
            >
              <span>{line}</span>
              {isLast && (
                <span className="at-cursor" style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }} aria-hidden>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: LC.muted }} />
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: LC.muted }} />
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: LC.muted }} />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
