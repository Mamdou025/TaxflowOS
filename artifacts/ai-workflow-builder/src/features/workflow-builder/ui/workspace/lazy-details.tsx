import { useState, type ReactNode } from 'react';

// Native closed details still mount their entire React subtree. Run snapshots
// can be large; only render them when the user asks to inspect them.
export function LazyDetails({ summary, children, className, defaultOpen = false }: {
  summary: ReactNode; children: ReactNode; className?: string; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return <details className={className} open={open} onToggle={event => setOpen(event.currentTarget.open)}>
    <summary className="cursor-pointer font-medium">{summary}</summary>
    {open && children}
  </details>;
}
