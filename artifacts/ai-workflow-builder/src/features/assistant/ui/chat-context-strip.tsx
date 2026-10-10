import { Building2, Database, FileText, Plus, Trash2, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAtomValue, useStore } from 'jotai';
import { SourceTextForm } from '@/features/documents/source-text-form';
import { useWorkbookImport } from '@/features/documents/workbook-import-dialog';
import { attachChatFile, restoreChatSource } from '../runtime/chat/chat-context-sources';
import {
  chatContextAtom,
  chatContextEpochAtom,
  chatContextLockedAtom,
  loadedChatSourcesAtom,
  removeChatContextSource,
} from '../runtime/chat/chat-context-store';

/** Current selections only. The enclosing Scope dialog owns presentation/navigation. */
export function ChatScopeContent({ onBrowseSources }: { onBrowseSources: () => void }) {
  const store = useStore();
  const context = useAtomValue(chatContextAtom);
  const loaded = useAtomValue(loadedChatSourcesAtom);
  const locked = useAtomValue(chatContextLockedAtom);
  const epoch = useAtomValue(chatContextEpochAtom);
  const [name, setName] = useState(context.companyName);
  const [period, setPeriod] = useState(context.year?.toString() ?? '');
  const [labelsSaved, setLabelsSaved] = useState(false);
  const [addingText, setAddingText] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const mounted = useRef(true);
  const { selectWorkbook, importDialog } = useWorkbookImport();
  useEffect(() => {
    setName(context.companyName);
    setPeriod(context.year?.toString() ?? '');
  }, [context.companyName, context.year]);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    setUploading(false);
    setUploadError('');
    setAddingText(false);
    setLabelsSaved(false);
  }, [epoch]);
  const sources = [...new Map(context.sources.map((source) => [source.id, source])).values()];
  const disabled = locked || uploading;
  const upload = async (files: File[]) => {
    const startEpoch = store.get(chatContextEpochAtom);
    if (store.get(chatContextLockedAtom)) return;
    setUploading(true);
    setUploadError('');
    try {
      for (const file of files) {
        if (store.get(chatContextEpochAtom) !== startEpoch) return;
        await attachChatFile(store, file, selectWorkbook);
      }
    } catch (error) {
      if (mounted.current && store.get(chatContextEpochAtom) === startEpoch)
        setUploadError(error instanceof Error ? error.message : 'Could not add this source.');
    } finally {
      if (mounted.current && store.get(chatContextEpochAtom) === startEpoch) setUploading(false);
    }
  };
  return (
    <>
      {importDialog}
      <section className="chat-scope-section" aria-label="Company and year">
        <h3>
          <Building2 size={15} /> Company and year
        </h3>
        <p className="chat-scope-note">
          Optional labels for this chat. They do not load company data.
        </p>
        <form
          className="chat-scope-label-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (store.get(chatContextLockedAtom)) return;
            store.set(chatContextAtom, (previous) => ({
              ...previous,
              companyName: name.trim(),
              year: period ? Number(period) : null,
            }));
            setLabelsSaved(true);
          }}
        >
          <label>
            Company name
            <input
              aria-label="Company name"
              placeholder="Optional company name"
              maxLength={200}
              value={name}
              disabled={disabled}
              onChange={(event) => {
                setName(event.target.value);
                setLabelsSaved(false);
              }}
            />
          </label>
          <label>
            Reporting year
            <input
              aria-label="Reporting year"
              placeholder="Optional"
              type="number"
              min={1900}
              max={3000}
              step={1}
              value={period}
              disabled={disabled}
              onChange={(event) => {
                setPeriod(event.target.value);
                setLabelsSaved(false);
              }}
            />
          </label>
          <div className="chat-scope-actions chat-scope-label-actions">
            <button type="submit" disabled={disabled}>
              Apply to this chat
            </button>
            {labelsSaved && (
              <span role="status" className="chat-scope-note">
                Applied
              </span>
            )}
          </div>
        </form>
      </section>
      <section className="chat-scope-section" aria-label="Sources selected for this chat">
        <h3>
          <FileText size={15} /> Sources <span className="chat-scope-count">{sources.length}</span>
        </h3>
        <p className="chat-scope-note">
          Only the sources you select are included. Opening a page does not add it.
        </p>
        <div className="chat-scope-actions">
          <button type="button" disabled={disabled} onClick={() => fileInput.current?.click()}>
            <Upload size={14} /> Upload file
          </button>
          <button
            type="button"
            disabled={disabled}
            aria-expanded={addingText}
            onClick={() => setAddingText((value) => !value)}
          >
            <Plus size={14} /> Add text
          </button>
          <button type="button" onClick={onBrowseSources}>
            <Database size={14} /> Browse Sources
          </button>
        </div>
        <input
          ref={fileInput}
          type="file"
          hidden
          multiple
          aria-label="Upload sources for this chat"
          accept=".pdf,.docx,.doc,.txt,.md,.csv,.xlsx,.xls,.json"
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            event.target.value = '';
            if (files.length) void upload(files);
          }}
        />
        {uploading && (
          <p role="status" className="chat-scope-note">
            Adding source…
          </p>
        )}
        {uploadError && (
          <p role="alert" className="chat-scope-error">
            {uploadError}
          </p>
        )}
        {addingText && (
          <fieldset disabled={disabled}>
            <SourceTextForm
              key={epoch}
              buttonLabel="Use text in this chat"
              onSave={async (file) => {
                await attachChatFile(store, file);
              }}
            />
          </fieldset>
        )}
        {!sources.length && (
          <p className="chat-scope-empty">
            No sources selected. You can keep this a general conversation.
          </p>
        )}
        <div className="chat-scope-source-list">
          {sources.map((reference) => {
            const value = loaded[reference.id];
            const status = value?.status ?? 'loading';
            return (
              <div
                key={reference.id}
                role="status"
                className="chat-scope-source"
                data-context-source={reference.id}
              >
                <FileText size={17} className="chat-scope-source-icon" />
                <div className="chat-scope-source-info">
                  <strong>{reference.fileName}</strong>
                  <span className="chat-scope-note">
                    {reference.sourceId
                      ? `Saved source · revision ${reference.sourceRevision}`
                      : 'Local attachment'}
                    {value?.source ? ` · ${value.source.rows.length} records` : ''}
                    {context.workflowSourceId === reference.id ? ' · workflow input' : ''}
                  </span>
                  <span className="chat-scope-badge" data-status={status}>
                    {status === 'ready'
                      ? 'Ready'
                      : status === 'unavailable'
                        ? 'Unavailable'
                        : 'Loading'}
                    {value?.text?.truncated ? ' · text truncated' : ''}
                  </span>
                </div>
                <button
                  type="button"
                  disabled={disabled}
                  aria-label={`Remove ${reference.fileName} from this chat`}
                  className="chat-scope-icon-button"
                  onClick={() => removeChatContextSource(store, reference.id)}
                >
                  <Trash2 size={15} />
                </button>
                {status === 'unavailable' && (
                  <button
                    className="chat-scope-retry"
                    type="button"
                    disabled={disabled}
                    onClick={() =>
                      void restoreChatSource(store, reference, store.get(chatContextEpochAtom))
                    }
                  >
                    Retry {reference.fileName}
                  </button>
                )}
                {(value?.error || reference.notice) && (
                  <p
                    role={value?.error ? 'alert' : undefined}
                    className={value?.error ? 'chat-scope-error' : 'chat-scope-note'}
                  >
                    {value?.error ?? reference.notice}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
