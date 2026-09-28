import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import './mkoro.css';

const MkoroPanel = lazy(() =>
  import('./mkoro-panel').then((module) => ({ default: module.MkoroPanel })),
);

export function ChatAgents({
  agent,
  onSelect,
  newChatKey,
  children,
}: {
  agent: 'sina' | 'mkoro';
  onSelect: (agent: 'sina' | 'mkoro') => void;
  newChatKey: number;
  children: ReactNode;
}) {
  const [openedMkoro, setOpenedMkoro] = useState(agent === 'mkoro');
  useEffect(() => {
    if (agent === 'mkoro') setOpenedMkoro(true);
  }, [agent]);
  return (
    <div className="mkoro-chat-agents">
      <div
        role="tablist"
        aria-label="Chat assistant"
        className="mkoro-agent-tabs"
        onKeyDown={(event) => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          const next =
            event.key === 'Home'
              ? 'sina'
              : event.key === 'End'
                ? 'mkoro'
                : agent === 'sina'
                  ? 'mkoro'
                  : 'sina';
          onSelect(next);
          document.getElementById(`${next}-agent-tab`)?.focus();
        }}
      >
        <button
          id="sina-agent-tab"
          type="button"
          role="tab"
          aria-selected={agent === 'sina'}
          tabIndex={agent === 'sina' ? 0 : -1}
          aria-controls="sina-agent-panel"
          onClick={() => onSelect('sina')}
        >
          <Sparkles size={15} aria-hidden /> Sina
        </button>
        <button
          id="mkoro-agent-tab"
          type="button"
          role="tab"
          aria-selected={agent === 'mkoro'}
          tabIndex={agent === 'mkoro' ? 0 : -1}
          aria-controls="mkoro-agent-panel"
          onClick={() => onSelect('mkoro')}
        >
          <Bot size={16} aria-hidden /> Mkoro
        </button>
      </div>
      <div
        id="sina-agent-panel"
        role="tabpanel"
        aria-labelledby="sina-agent-tab"
        className="mkoro-agent-panel"
        hidden={agent !== 'sina'}
      >
        {children}
      </div>
      <div
        id="mkoro-agent-panel"
        role="tabpanel"
        aria-labelledby="mkoro-agent-tab"
        className="mkoro-agent-panel"
        hidden={agent !== 'mkoro'}
      >
        {(openedMkoro || agent === 'mkoro') && (
          <Suspense fallback={<p className="mkoro-notice">Loading Mkoro…</p>}>
            <MkoroPanel newChatKey={newChatKey} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
