import { useState } from 'react';

export function CalculationSettings({ config, disabled, onChange }: { config: Record<string, unknown>; disabled: boolean; onChange: (key: string, value: unknown) => void }) {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const defaults = (config.inputDefaults ?? {}) as Record<string, number>;
  return <details className="border-b p-2 text-xs">
    <summary>Calculation settings · missing values stop calculation</summary>
    <p className="my-2">Intermediate results keep their precision. Round only the terms you choose. A default is used only when that input is missing; a real zero remains zero.</p>
    <fieldset disabled={disabled} className="space-y-2">
      {Object.entries(defaults).map(([key, number]) => <div key={key}>{key}: {number} <button onClick={() => { const next = { ...defaults }; delete next[key]; onChange('inputDefaults', next); }}>Remove default for {key}</button></div>)}
      <input aria-label="Default input name" placeholder="Missing input name" value={name} onChange={event => setName(event.target.value)} className="rounded border p-1" />
      <input aria-label="Default input value" type="number" step="any" value={value} onChange={event => setValue(event.target.value)} className="rounded border p-1" />
      <button disabled={!name.trim() || !value.trim() || !Number.isFinite(Number(value))} onClick={() => { onChange('inputDefaults', { ...defaults, [name.trim()]: Number(value) }); setName(''); setValue(''); }}>Add explicit default</button>
    </fieldset>
  </details>;
}
