import { ArrowUp, Database, MessageSquare, Paperclip, PlugZap, Workflow } from 'lucide-react';
import { InScopeNeuMark } from '@/components/inscope-neu-mark';
import { LC } from '@/lib/librechat-theme';

const navigation = [
  { label: 'Chat', Icon: MessageSquare },
  { label: 'Workflows', Icon: Workflow },
  { label: 'Sources', Icon: Database },
  { label: 'Connections', Icon: PlugZap },
];

/** Public first paint only. Never read workspace caches or mount agent/data hooks here. */
export function WorkspaceStartup() {
  return (
    <div
      role="region"
      aria-label="Workspace startup"
      className="flex h-dvh gap-2 overflow-hidden p-2 sm:gap-3 sm:p-2.5"
      style={{ background: LC.bg, color: LC.text }}
    >
      <aside
        className="flex w-14 shrink-0 flex-col items-center rounded-xl px-2 py-4 sm:w-[258px] sm:items-stretch sm:px-4"
        style={{ background: LC.bg, boxShadow: LC.shadowOut }}
      >
        <span className="sm:hidden">
          <InScopeNeuMark size={30} />
        </span>
        <span className="isneu-wordmark hidden px-2 text-xl sm:block">InScope</span>
        <nav aria-label="Workspace" className="mt-6 flex flex-col gap-2">
          {navigation.map(({ label, Icon }) => (
            <button
              key={label}
              type="button"
              disabled
              aria-label={label}
              title={`${label} — available when connected`}
              className="flex items-center gap-3 rounded-xl p-2.5 text-left text-sm"
              style={{ color: LC.muted }}
            >
              <Icon size={17} aria-hidden="true" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto rounded-xl p-4 sm:p-6">
        <div className="flex shrink-0 items-center justify-center gap-2 pt-3">
          <span className="isneu-wordmark text-3xl sm:text-[38px]">InScope</span>
          <InScopeNeuMark size={90} />
        </div>
        <div className="mx-auto my-auto w-full max-w-[720px] py-8">
          <h1 className="mb-6 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            What would you like to work on?
          </h1>
          <div
            className="rounded-2xl p-4"
            style={{ background: LC.surface, boxShadow: LC.shadowOut }}
          >
            <textarea
              aria-label="Message"
              aria-describedby="workspace-startup-status"
              disabled
              placeholder="Message Scope…"
              rows={2}
              className="block w-full resize-none bg-transparent text-sm outline-none"
            />
            <div className="mt-3 flex flex-wrap items-center gap-3" style={{ color: LC.muted }}>
              <button type="button" disabled aria-label="Attach files">
                <Paperclip size={17} aria-hidden="true" />
              </button>
              <button type="button" disabled className="text-xs">
                Scope
              </button>
              <button type="button" disabled className="text-xs">
                Agent
              </button>
              <button type="button" disabled className="text-xs">
                Computer
              </button>
              <button
                type="button"
                disabled
                aria-label="Send message"
                className="ml-auto rounded-full p-2"
                style={{ boxShadow: LC.shadowSm }}
              >
                <ArrowUp size={17} aria-hidden="true" />
              </button>
            </div>
          </div>
          <p
            id="workspace-startup-status"
            role="status"
            className="mt-4 text-center text-xs"
            style={{ color: LC.muted }}
          >
            Connecting to your workspace…
          </p>
        </div>
      </main>
    </div>
  );
}
