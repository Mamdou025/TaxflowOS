import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import {
  selectedClientAtom,
  scopeYearAtom,
  showClientSwitcherAtom,
} from '@/shared/stores/nav-store';
import { chatContextLockedAtom } from '@/features/assistant/runtime/chat/chat-context-store';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog';

export function GlobalClientSwitcher() {
  const [open, setOpen] = useAtom(showClientSwitcherAtom);
  const [client, setClient] = useAtom(selectedClientAtom);
  const [year, setYear] = useAtom(scopeYearAtom);
  const locked = useAtomValue(chatContextLockedAtom);
  const [name, setName] = useState(client);
  const [period, setPeriod] = useState(year?.toString() ?? '');
  useEffect(() => {
    if (open) {
      setName(client);
      setPeriod(year?.toString() ?? '');
    }
  }, [open, client, year]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>Company and year for this chat</DialogTitle>
        <DialogDescription>
          These labels do not load a company dataset. Add documents or text to provide the
          information you want to use.
        </DialogDescription>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (locked) return;
            setClient(name.trim());
            setYear(period ? Number(period) : null);
            setOpen(false);
          }}
        >
          <label className="block text-sm">
            Company name
            <input
              className="mt-1 block w-full rounded border bg-transparent p-2"
              aria-label="Company name"
              maxLength={200}
              value={name}
              disabled={locked}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label className="block text-sm">
            Reporting year
            <input
              className="mt-1 block w-full rounded border bg-transparent p-2"
              aria-label="Reporting year"
              type="number"
              min={1900}
              max={3000}
              step={1}
              value={period}
              disabled={locked}
              onChange={(event) => setPeriod(event.target.value)}
            />
          </label>
          <button type="submit" className="rounded border px-3 py-2" disabled={locked}>
            Apply to this chat
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
