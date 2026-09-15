import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/shared/ui/dialog';
import { apiFetch } from '@/platform/auth/api-fetch';
import { uploadedRowsAtom } from '@/shared/stores/workspace-store';
import {
  isWorkflowSource,
  loadWorkflowSource,
  type WorkflowSourceDocument,
} from '@/features/documents/workflow-source-client';

/** Explicit workflow input selection, independent of semantic document retrieval. */
export function ChatSourcePicker({
  disabled = false,
  open,
  onOpenChange,
  onDocumentSelect,
}: {
  disabled?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDocumentSelect: (document: WorkflowSourceDocument) => void;
}) {
  const [sources, setSources] = useAtom(uploadedRowsAtom);
  const [documents, setDocuments] = useState<WorkflowSourceDocument[]>([]);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const selected = sources.__unassigned__;
  const refresh = async () => {
    setBusy(true);
    setError('');
    try {
      const response = await apiFetch('/api/documents', { signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error('Sources are unavailable. Please retry.');
      const data = (await response.json()) as { documents: WorkflowSourceDocument[] };
      setDocuments(
        data.documents.filter(
          (document) =>
            document.lifecycleStatus === 'active' &&
            (isWorkflowSource(document) || document.status === 'ready'),
        ),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load Sources.');
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => {
    if (open) void refresh();
  }, [open]);
  const select = async (id: string) => {
    setBusy(true);
    setError('');
    try {
      const document = documents.find((item) => item.id === id);
      if (document && !isWorkflowSource(document)) {
        onDocumentSelect(document);
        onOpenChange(false);
        return;
      }
      const source = await loadWorkflowSource(id);
      setSources((previous) => ({ ...previous, __unassigned__: source }));
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read this source.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="relative mb-2 space-y-2 text-xs">
      {selected && (
        <div role="status" className="flex items-center gap-2 rounded border p-2">
          <span className="min-w-0 flex-1 break-words">
            Source: {selected.fileName} · {selected.rows.length} records
            {selected.sourceId ? ' · Saved in Sources' : ' · Local attachment'}
          </span>
          <button
            type="button"
            aria-label="Remove selected workflow source"
            disabled={disabled || busy}
            onClick={() =>
              setSources((previous) => {
                const next = { ...previous };
                delete next.__unassigned__;
                return next;
              })
            }
          >
            <X size={14} />
          </button>
        </div>
      )}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>Choose from Sources</DialogTitle>
          <DialogDescription>Select a saved document or dataset for this chat.</DialogDescription>
          <input
            className="w-full rounded border bg-transparent p-2"
            placeholder="Search saved sources…"
            aria-label="Search saved sources"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {busy ? (
            <p role="status">Loading source…</p>
          ) : (
            <div className="max-h-60 overflow-auto">
              {documents
                .filter((doc) => doc.fileName.toLowerCase().includes(query.toLowerCase()))
                .map((doc) => (
                  <button
                    type="button"
                    key={doc.id}
                    className="block w-full rounded p-2 text-left hover:bg-muted"
                    onClick={() => void select(doc.id)}
                  >
                    {doc.fileName}
                  </button>
                ))}
              {!documents.length && <p>No available sources yet. Upload one in Sources.</p>}
            </div>
          )}
          {error && <p role="alert">{error}</p>}
        </DialogContent>
      </Dialog>
    </div>
  );
}
