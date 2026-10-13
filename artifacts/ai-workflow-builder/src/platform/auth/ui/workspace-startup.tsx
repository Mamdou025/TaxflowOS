import { Database, MessageSquare, PlugZap, Workflow } from 'lucide-react';
import { InScopeNeuMark } from '@/components/inscope-neu-mark';
import { LC } from '@/lib/librechat-theme';
import { Skeleton } from '@/shared/ui/skeleton';

const navigation = [
  { label: 'Chat', Icon: MessageSquare },
  { label: 'Workflows', Icon: Workflow },
  { label: 'Sources', Icon: Database },
  { label: 'Connections', Icon: PlugZap },
];

// A pulsing placeholder, not a disabled copy of the real composer/nav text —
// the previous version rendered the exact final labels and placeholder copy
// in a disabled shell, which read as "the app loaded but is broken" rather
// than "the app is loading" (reported directly against a screenshot).
// Everything below the brand mark is now honestly a skeleton.

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
            <span
              key={label}
              aria-hidden="true"
              className="flex items-center gap-3 rounded-xl p-2.5 text-left text-sm opacity-60"
              style={{ color: LC.muted }}
            >
              <Icon size={17} aria-hidden="true" />
              <Skeleton className="hidden h-3.5 w-20 sm:block" />
            </span>
          ))}
        </nav>
      </aside>
      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto rounded-xl p-4 sm:p-6">
        <div className="flex shrink-0 items-center justify-center gap-2 pt-3">
          <span className="isneu-wordmark text-3xl sm:text-[38px]">InScope</span>
          {/* The brand mark's own built-in loading motion — orbiting dot spirals —
              is the page's one real "this is alive" signal, so nothing nearby fakes it. */}
          <InScopeNeuMark animate size={90} />
        </div>
        <div className="mx-auto my-auto w-full max-w-[720px] py-8">
          <Skeleton className="mx-auto mb-6 h-8 w-72 max-w-full" />
          <div
            className="rounded-2xl p-4"
            style={{ background: LC.surface, boxShadow: LC.shadowOut }}
          >
            <Skeleton className="h-4 w-48" />
            <Skeleton className="mt-2.5 h-4 w-32" />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Skeleton className="size-5 rounded-full" />
              <Skeleton className="h-3.5 w-12" />
              <Skeleton className="h-3.5 w-12" />
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="ml-auto size-8 rounded-full" />
            </div>
          </div>
          <p
            role="status"
            className="mt-4 text-center text-xs motion-safe:animate-pulse"
            style={{ color: LC.muted }}
          >
            Connecting to your workspace…
          </p>
        </div>
      </main>
    </div>
  );
}
