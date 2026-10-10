import { useState } from 'react';

/** Pasted text uses the same named-file upload path as every other source. */
export function SourceTextForm({
  onSave,
  buttonLabel = 'Save text in Sources',
}: {
  onSave: (file: File) => Promise<void>;
  buttonLabel?: string;
}) {
  const [name, setName] = useState('Notes');
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  return (
    <form
      className="space-y-2 rounded border p-3 text-sm"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setNotice('');
        try {
          await onSave(
            new File([text], `${name.trim().replace(/\.txt$/i, '')}.txt`, { type: 'text/plain' }),
          );
          setText('');
          setNotice('Text added.');
        } catch (error) {
          setNotice(error instanceof Error ? error.message : 'Could not add text.');
        } finally {
          setBusy(false);
        }
      }}
    >
      <label className="block">
        Text name
        <input
          className="block w-full rounded border bg-transparent p-2"
          aria-label="Text name"
          value={name}
          maxLength={200}
          required
          disabled={busy}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <label className="block">
        Source text
        <textarea
          className="block min-h-24 w-full rounded border bg-transparent p-2"
          aria-label="Source text"
          value={text}
          maxLength={120000}
          required
          disabled={busy}
          onChange={(event) => setText(event.target.value)}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border px-2 py-1"
          disabled={busy}
          onClick={() => {
            setName('Example company notes');
            setText(
              'SAMPLE DATA — for testing only.\nCompany: Example Company\nReporting year: 2025\nThese notes demonstrate explicit chat context. They do not supply workflow calculations, exchange rates or tax decisions.',
            );
          }}
        >
          Add example text
        </button>
        <button
          type="submit"
          className="rounded border px-2 py-1"
          disabled={busy || !name.trim() || !text.trim()}
        >
          {busy ? 'Adding text…' : buttonLabel}
        </button>
      </div>
      {notice && <p role="status">{notice}</p>}
    </form>
  );
}
