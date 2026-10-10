import { useState } from 'react';

export type ConnectedFieldOption = { value: string; label: string };
const PAGE_SIZE = 50;

/** Large source lists remain fully searchable without mounting every choice for every input. */
export function SessionConnectedFieldPicker({
  name,
  options,
  disabled,
  onChoose,
  onClose,
}: {
  name: string;
  options: readonly ConnectedFieldOption[];
  disabled: boolean;
  onChoose: (value: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const search = query.trim().toLocaleLowerCase();
  const matches = search
    ? options.filter((option) => option.label.toLocaleLowerCase().includes(search))
    : options;
  const currentPage = Math.min(page, Math.max(0, Math.ceil(matches.length / PAGE_SIZE) - 1));
  const start = currentPage * PAGE_SIZE;
  return (
    <section
      aria-label={`Connected fields for ${name}`}
      className="space-y-2 rounded border bg-muted/20 p-3"
    >
      <label className="block space-y-1">
        <span>Find a connected field</span>
        <input
          aria-label={`Find a connected field for ${name}`}
          type="search"
          className="w-full rounded border bg-background p-2"
          disabled={disabled}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(0);
          }}
        />
      </label>
      <p role="status" className="text-xs text-muted-foreground">
        {matches.length
          ? `Fields ${start + 1}–${Math.min(start + PAGE_SIZE, matches.length)} of ${matches.length}`
          : 'No connected fields match this search.'}
      </p>
      <ul className="max-h-72 space-y-1 overflow-auto">
        {matches.slice(start, start + PAGE_SIZE).map((option) => (
          <li key={option.value}>
            <button
              type="button"
              data-connected-field
              className="w-full break-all rounded border bg-background p-2 text-left text-xs hover:bg-muted disabled:opacity-50"
              disabled={disabled}
              onClick={() => onChoose(option.value)}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-3 text-xs">
        <button
          type="button"
          disabled={disabled || currentPage === 0}
          className="underline disabled:opacity-50"
          onClick={() => setPage(currentPage - 1)}
        >
          Previous fields
        </button>
        <button
          type="button"
          disabled={disabled || start + PAGE_SIZE >= matches.length}
          className="underline disabled:opacity-50"
          onClick={() => setPage(currentPage + 1)}
        >
          Next fields
        </button>
        <button type="button" className="underline" onClick={onClose}>
          Close field picker
        </button>
      </div>
    </section>
  );
}
