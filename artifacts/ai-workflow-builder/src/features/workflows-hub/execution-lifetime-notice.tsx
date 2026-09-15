import { Clock3 } from 'lucide-react';

export function ExecutionLifetimeNotice() {
  return (
    <aside
      aria-label="Workflow execution lifetime"
      className="flex items-start gap-2 rounded-lg border border-amber-400/60 bg-amber-50/60 px-3 py-2 text-xs text-amber-950 dark:bg-amber-950/20 dark:text-amber-100"
    >
      <Clock3 aria-hidden="true" className="mt-0.5 shrink-0" size={14} />
      <span>
        Durable runs use an immutable saved version and continue on the server if this tab closes.
        All installed workflow tools are supported. Runs use the inputs and source responses saved
        in that version. Browser previews require this tab to stay open.
      </span>
    </aside>
  );
}
