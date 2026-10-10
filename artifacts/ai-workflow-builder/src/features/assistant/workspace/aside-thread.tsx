// Shared chat/workflow presentation tokens. Composer behavior lives in assistant-ui.
import { LC } from '@/lib/librechat-theme';
export { AsideComposerContext } from './composer-context';
export type { ComposerSuggestion, ArmedComposerTool } from './composer-context';
export function AsideThreadStyles() {
  return (
    <style>{`
      /* Light-theme the in-chat run-flow (workflow-run-flow reads these --cwp-*
         vars; unset → its dark fallbacks). Mirrors that file's LIGHT_VARS. */
      .aside-thread {
        --lc-composer-shadow: ${LC.shadowOut};
        --cwp-ink:#18181b; --cwp-muted:#71717a; --cwp-faint:#a1a1aa; --cwp-dim:#c4c4cc;
        --cwp-line:rgba(24,24,27,0.10); --cwp-hairline:rgba(24,24,27,0.07);
        --cwp-surface:#ffffff; --cwp-card:#ffffff; --cwp-ground:#F4F5F8;
        --cwp-primary-bg:#18181b; --cwp-primary-fg:#ffffff; --cwp-live:#0369a1;
        --cwp-amber:#b45309; --cwp-amber-text:#92400e; --cwp-amber-soft:rgba(217,119,6,0.08); --cwp-amber-line:rgba(217,119,6,0.30);
        --cwp-danger:#b91c1c; --cwp-spine-done:rgba(24,24,27,0.18); --cwp-spine-ahead:rgba(24,24,27,0.09);
        --cwp-hover:rgba(24,24,27,0.03);
      }
      /* Dark theme — the run-flow's --cwp-* palette flips with the .dark class. */
      .dark .aside-thread {
        --cwp-ink:#ececec; --cwp-muted:#9a9a9a; --cwp-faint:#6f6f6f; --cwp-dim:#55555c;
        --cwp-line:rgba(255,255,255,0.10); --cwp-hairline:rgba(255,255,255,0.07);
        --cwp-surface:rgba(255,255,255,0.04); --cwp-card:#1c1c24; --cwp-ground:#17171c;
        --cwp-primary-bg:#ececec; --cwp-primary-fg:#18181b; --cwp-live:#38bdf8;
        --cwp-amber:#f59e0b; --cwp-amber-text:#fbbf24; --cwp-amber-soft:rgba(245,158,11,0.12); --cwp-amber-line:rgba(245,158,11,0.35);
        --cwp-danger:#f87171; --cwp-spine-done:rgba(255,255,255,0.20); --cwp-spine-ahead:rgba(255,255,255,0.09);
        --cwp-hover:rgba(255,255,255,0.05);
      }
      /* The run flow blends INTO the dark thread — no light card, no border. It
         reads as part of what the assistant is saying: a vertical timeline on the
         chat's own ground, connected by its internal step spine. Kept narrower
         than generated UI so the timeline stays readable. */
      .aside-thread [data-run-flow] {
        width: 100%; max-width: 860px;
        background: transparent; border: none;
        border-radius: 0; padding: 2px 0;
      }
      .aside-thread [data-genui] { width: 100%; }
      .lc-console {
        box-shadow: var(--lc-composer-shadow);
        transition: box-shadow 200ms cubic-bezier(0.23,1,0.32,1);
      }
      .lc-console:focus-within { box-shadow: var(--lc-composer-shadow), 0 0 0 2px rgba(124,110,174,0.28); }
      .lc-ribbon { animation: lc-rise 240ms cubic-bezier(0.23,1,0.32,1) both; }
      @keyframes lc-rise { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
      .lc-textarea::placeholder { color: ${LC.muted}; }

      /* A message row: [avatar | content] — fills the column (no per-row centering). */
      .aside-thread .lc-row {
        display: flex; gap: 14px; align-items: flex-start;
        width: 100%; margin: 0 0 22px;
        animation: lc-in 260ms cubic-bezier(0.23,1,0.32,1) both;
      }
      @keyframes lc-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      /* Positioning marker only — the coworker avatar (CoworkerAvatar) paints itself. */
      .aside-thread .lc-avatar { flex-shrink: 0; margin-top: 2px; display: inline-flex; }
      .aside-thread .lc-typing {
        width: 7px; height: 7px; border-radius: 50%; background: ${LC.muted};
        display: inline-block; animation: lc-typing 1.2s infinite;
      }
      @keyframes lc-typing { 0%,60%,100% { transform: translateY(0);} 30% { transform: translateY(-5px);} }
      @media (prefers-reduced-motion: reduce) { .lc-ribbon, .aside-thread .lc-row, .aside-thread .lc-typing { animation: none; } }
    `}</style>
  );
}
