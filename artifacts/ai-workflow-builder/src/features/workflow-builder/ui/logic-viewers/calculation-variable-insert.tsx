import { useState } from 'react';

export function CalculationVariableInsert({
  disabled,
  onInsert,
}: {
  disabled: boolean;
  onInsert: (name: string) => void;
}) {
  const [name, setName] = useState('');
  const valid = /^[A-Za-z_][A-Za-z0-9_]*$/.test(name.trim());
  const insert = () => {
    if (disabled || !valid) return;
    onInsert(name.trim());
    setName('');
  };
  return (
    <div className="space-y-2 rounded border p-2">
      <label className="block text-xs font-medium">
        Add a variable
        <input
          aria-label="Variable name"
          className="mt-1 w-full rounded border bg-background p-1 font-mono text-xs"
          disabled={disabled}
          value={name}
          placeholder="For example: amount or exchangeRate"
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              insert();
            }
          }}
        />
      </label>
      <p className="text-[11px] text-muted-foreground">
        Use letters, numbers and underscores. Start with a letter or underscore.
      </p>
      <button
        type="button"
        className="rounded border px-2 py-1 text-xs disabled:opacity-40"
        disabled={disabled || !valid}
        onClick={insert}
      >
        Add variable to formula
      </button>
    </div>
  );
}
