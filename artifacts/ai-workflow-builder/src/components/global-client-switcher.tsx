

import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CLIENTS, selectedClientAtom, showClientSwitcherAtom } from '@/shared/stores/nav-store';

export function GlobalClientSwitcher() {
  const [open, setOpen] = useAtom(showClientSwitcherAtom);
  const [client, setClient] = useAtom(selectedClientAtom);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  const filtered = CLIENTS.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backdropFilter: 'blur(14px)', background: 'var(--sx-scrim)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div
        className="rounded-2xl w-80 overflow-hidden"
        style={{
          background: 'var(--sx-card)',
          boxShadow: 'var(--sx-drop-panel)',
          border: '1px solid var(--sx-hairline)',
          animation: 'fadeScaleIn 0.16s cubic-bezier(0.23,1,0.32,1)',
        }}
      >
        <style>{`@keyframes fadeScaleIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }`}</style>
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 dark:border-white/10">
          <Search size={13} className="text-gray-400 dark:text-gray-500 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients…"
            className="flex-1 text-[13px] outline-none bg-transparent text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
          />
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <X size={13} />
          </button>
        </div>
        <div className="max-h-64 overflow-y-auto py-1">
          {filtered.map((c) => (
            <button
              key={c}
              onClick={() => {
                setClient(c);
                setOpen(false);
              }}
              className={cn(
                'w-full text-left px-4 py-2.5 text-[12.5px] flex items-center gap-2 transition-colors hover:bg-gray-50 dark:hover:bg-white/5',
                c === client ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300',
              )}
            >
              <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 text-[10px] font-semibold shrink-0">
                {c.charAt(0)}
              </span>
              {c}
              {c === client && (
                <span className="ml-auto text-[10px] text-gray-400 dark:text-gray-500">active</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
