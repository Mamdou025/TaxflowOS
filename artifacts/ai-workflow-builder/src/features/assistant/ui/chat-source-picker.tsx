import { useEffect, useState } from 'react';
import { useStore } from 'jotai';
import { attachSavedChatSource } from '../runtime/chat/chat-context-sources';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/shared/ui/dialog';
import { apiFetch } from '@/platform/auth/api-fetch';
import { useWorkbookImport } from '@/features/documents/workbook-import-dialog';
import { type WorkflowSourceDocument } from '@/features/documents/workflow-source-client';

/** Explicit workflow input selection, independent of semantic document retrieval. */
export function ChatSourcePicker({
  disabled = false,
  open,
  onOpenChange,
}: {
  disabled?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const store = useStore();
  const { selectWorkbook, importDialog } = useWorkbookImport();
  const [documents, setDocuments] = useState<WorkflowSourceDocument[]>([]);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const refresh = async () => {
    setBusy(true);
    setError('');
    try {
      const response = await apiFetch('/api/documents', { signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error('Sources are unavailable. Please retry.');
      const data = (await response.json()) as { documents: WorkflowSourceDocument[] };
      setDocuments(
        data.documents.filter(
          (document) => document.lifecycleStatus === 'active' && document.status !== 'uploading',
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
      if (!document) throw new Error('Choose an available source.');
      await attachSavedChatSource(store, document, selectWorkbook);
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read this source.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="relative mb-2 space-y-2 text-xs">
      {importDialog}
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
                    disabled={disabled}
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
