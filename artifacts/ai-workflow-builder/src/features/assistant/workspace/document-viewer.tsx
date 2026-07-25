

// ─────────────────────────────────────────────────────────────────────────────
// Document Viewer — a first-class platform page (registered in resource-registry
// as `viewer`, routed at /viewer, and openable as an in-chat tab) for opening and
// reading PDF · Excel · Word files without leaving the platform.
//
//   • Multi-file: each opened file is a closable tab (kept in memory).
//   • Renderers: PDF (native browser viewer via blob URL), Excel (sheet-tabbed
//     grid via `xlsx`), Word (.docx → HTML via `mammoth`), plain-text (<pre>).
//   • Auto-context for Scope: opening a doc here automatically extracts its text
//     (PDF/Word/text via /api/assistant/extract, Excel via client CSV) and pushes it to
//     `attachedDocsAtom` — the same readable the chat assistant answers from — so the
//     chat sitting next to the viewer can answer about it with no extra click. Closing
//     a tab removes it from Scope's context again. Excel also has "Load as workflow
//     source" → the shared `uploadedRowsAtom` the run/builder read.
//
// Local files only (upload + drag-and-drop). No persistence — this is a working
// surface; blob URLs are revoked on close/unmount.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useCallback, useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { toast } from 'sonner';
import {
  Upload, X, Download, MessageSquarePlus, Table2, Loader2, Check,
  FileText, FileSpreadsheet, FileType2, File as FileIcon,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { attachedDocsAtom, uploadedRowsAtom, type AttachedDoc } from '@/shared/stores/workspace-store';
import { assistantOpenAtom } from '@/shared/stores/chat-store';
import { parseUploadToRows } from '@/shared/workflow-engine/runtime/workflow-runs/parse-upload';

// ── Types ──────────────────────────────────────────────────────────────────────
type DocKind = 'pdf' | 'excel' | 'word' | 'text' | 'unsupported';
type OpenDoc = { id: string; name: string; size: number; kind: DocKind; file: File; url?: string };
/** Where a doc is in its Scope-attach lifecycle (drives the action-bar status chip). */
type AttachStatus = 'attaching' | 'attached' | 'error';

const ACCEPT =
  '.pdf,.xlsx,.xls,.csv,.docx,.txt,.md,.markdown,.json,.log,.yml,.yaml,.xml,.html,.htm,.rtf,.tsv';
const MAX_DISCUSS_CHARS = 120_000;

function kindOf(name: string, type: string): DocKind {
  if (/\.pdf$/i.test(name) || type === 'application/pdf') return 'pdf';
  if (/\.(xlsx|xls|csv|tsv)$/i.test(name)) return 'excel';
  if (/\.docx$/i.test(name)) return 'word';
  if (/\.(txt|md|markdown|json|log|ya?ml|xml|html?|rtf)$/i.test(name) || type.startsWith('text/')) return 'text';
  return 'unsupported';
}

function iconFor(kind: DocKind, size = 15) {
  switch (kind) {
    case 'pdf': return <FileText size={size} />;
    case 'excel': return <FileSpreadsheet size={size} />;
    case 'word': return <FileType2 size={size} />;
    case 'text': return <FileText size={size} />;
    default: return <FileIcon size={size} />;
  }
}

const KIND_LABEL: Record<DocKind, string> = {
  pdf: 'PDF', excel: 'Spreadsheet', word: 'Word', text: 'Text', unsupported: 'File',
};

function prettySize(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function DocumentViewer() {
  const [docs, setDocs] = useState<OpenDoc[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const setAttachedDocs = useSetAtom(attachedDocsAtom);
  const setUploadedRows = useSetAtom(uploadedRowsAtom);
  const setAssistantOpen = useSetAtom(assistantOpenAtom);

  // Revoke every blob URL we created when the page unmounts.
  const docsRef = useRef<OpenDoc[]>([]);
  docsRef.current = docs;
  useEffect(() => () => { docsRef.current.forEach((d) => d.url && URL.revokeObjectURL(d.url)); }, []);

  // Per-doc Scope-attach lifecycle. A ref mirrors the map so the auto-attach effect
  // can guard synchronously (one attempt per doc, never re-fires on failure) while the
  // state copy drives the status chip in the action bar.
  const [attachStatus, setAttachStatus] = useState<Record<string, AttachStatus>>({});
  const attachStatusRef = useRef<Record<string, AttachStatus>>({});
  const setStatus = useCallback((id: string, s: AttachStatus | null) => {
    if (s === null) delete attachStatusRef.current[id];
    else attachStatusRef.current[id] = s;
    setAttachStatus((prev) => {
      if (s === null) { const n = { ...prev }; delete n[id]; return n; }
      return { ...prev, [id]: s };
    });
  }, []);

  const addFiles = useCallback((list: FileList | File[] | null) => {
    const incoming = list ? Array.from(list) : [];
    if (!incoming.length) return;
    setDocs((prev) => {
      const next = [...prev];
      let firstAdded: string | null = null;
      for (const file of incoming) {
        const id = `${file.name}-${file.size}`;
        if (next.some((d) => d.id === id)) { firstAdded ??= id; continue; } // already open → just focus
        const kind = kindOf(file.name, file.type);
        const url = kind === 'pdf' ? URL.createObjectURL(file) : undefined;
        next.push({ id, name: file.name, size: file.size, kind, file, url });
        firstAdded ??= id;
      }
      if (firstAdded) setActiveId(firstAdded);
      return next;
    });
  }, []);

  const closeDoc = useCallback((id: string) => {
    setDocs((prev) => {
      const doc = prev.find((d) => d.id === id);
      if (doc?.url) URL.revokeObjectURL(doc.url);
      const next = prev.filter((d) => d.id !== id);
      setActiveId((cur) => (cur === id ? (next[next.length - 1]?.id ?? null) : cur));
      return next;
    });
    // Closing the tab pulls it back out of Scope's context; forgetting its status lets
    // a later re-open extract it fresh.
    setAttachedDocs((prev) => prev.filter((d) => d.id !== id));
    setStatus(id, null);
  }, [setAttachedDocs, setStatus]);

  // Extract a document's text and publish it as Scope's readable context
  // (attachedDocsAtom — the same store the chat answers from). Runs automatically when a
  // doc is opened (see the effect below); `manual` is the explicit retry from the status
  // chip, which additionally surfaces the assistant and a toast.
  const attachDoc = useCallback(async (doc: OpenDoc, opts?: { manual?: boolean }) => {
    if (doc.kind === 'unsupported') return;
    setStatus(doc.id, 'attaching');
    try {
      let payload: Omit<AttachedDoc, 'at'>;
      if (doc.kind === 'excel') {
        // Client-side: flatten every sheet to CSV so the model can read the grid.
        const wb = XLSX.read(await doc.file.arrayBuffer(), { type: 'array' });
        const parts = wb.SheetNames.map((n) => `# Sheet: ${n}\n${XLSX.utils.sheet_to_csv(wb.Sheets[n])}`);
        let text = parts.join('\n\n');
        const truncated = text.length > MAX_DISCUSS_CHARS;
        if (truncated) text = text.slice(0, MAX_DISCUSS_CHARS);
        payload = { id: doc.id, fileName: doc.name, kind: 'excel', text, chars: text.length, truncated };
      } else {
        // PDF / Word / text → the server extraction route (unpdf / mammoth / utf-8).
        const body = new FormData();
        body.append('file', doc.file);
        const res = await fetch('/api/assistant/extract', { method: 'POST', body });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? res.statusText);
        payload = {
          id: doc.id, fileName: data.fileName ?? doc.name, kind: data.kind,
          text: data.text, chars: data.chars, pages: data.pages, truncated: !!data.truncated,
        };
      }
      // The tab may have been closed while we were extracting — don't resurrect it.
      if (!docsRef.current.some((d) => d.id === doc.id)) return;
      setAttachedDocs((prev) => [...prev.filter((d) => d.id !== payload.id), { ...payload, at: Date.now() }]);
      setStatus(doc.id, 'attached');
      if (opts?.manual) {
        setAssistantOpen(true);
        toast.success(`Added ${payload.fileName} to Scope`, { description: 'Ask about it in the chat — Scope can now read its contents.' });
      }
    } catch (err) {
      if (!docsRef.current.some((d) => d.id === doc.id)) return;
      setStatus(doc.id, 'error');
      if (opts?.manual) toast.error(`Couldn't hand ${doc.name} to Scope: ${err instanceof Error ? err.message : 'extraction failed'}`);
    }
  }, [setAttachedDocs, setAssistantOpen, setStatus]);

  // Auto-attach: whenever the open set changes, make sure every readable doc is in
  // Scope's context. Ref-guarded to one attempt per doc so a failed extraction (or a
  // StrictMode double-invoke) never re-fires; the status chip offers a manual retry.
  useEffect(() => {
    for (const d of docs) {
      if (d.kind === 'unsupported') continue;
      if (attachStatusRef.current[d.id]) continue;
      attachStatusRef.current[d.id] = 'attaching'; // synchronous guard vs. double-fire
      void attachDoc(d);
    }
  }, [docs, attachDoc]);

  // Excel → the shared workflow source rows (same rows the run/builder use).
  const loadAsSource = useCallback(async (doc: OpenDoc) => {
    setBusy(doc.id);
    try {
      const { rows, fileName } = await parseUploadToRows(doc.file);
      setUploadedRows((prev) => ({ ...prev, fapi: { fileName, rows, at: Date.now() } }));
      toast.success(`Loaded ${fileName} as FAPI source`, { description: `${rows.length} rows — the FAPI run and builder now use this file.` });
    } catch {
      toast.error(`Couldn't parse ${doc.name} as a workbook.`);
    } finally {
      setBusy(null);
    }
  }, [setUploadedRows]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const active = docs.find((d) => d.id === activeId) ?? null;
  const isBusy = busy !== null;

  return (
    <div
      className="flex flex-col h-full min-h-[560px]"
      // No background here: the empty-state region stays transparent so the host
      // panel's own ground (the dark portal grid in Scope's chat, the neumorphic
      // surface on /viewer) shows through. Chrome (header/tabs/action bar) and the
      // document renderers paint their own backgrounds, so only the empty area is
      // affected.
      onDragOver={(e) => { e.preventDefault(); if (!dragOver) setDragOver(true); }}
      onDragLeave={(e) => { if (e.currentTarget === e.target) setDragOver(false); }}
      onDrop={onDrop}
    >
      <input ref={inputRef} type="file" accept={ACCEPT} multiple style={{ display: 'none' }}
        onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />

      {/* Header */}
      <div className="flex items-center gap-3 shrink-0" style={{ padding: '14px 18px', borderBottom: '1px solid rgba(0,0,0,0.07)', background: '#fff' }}>
        <div className="flex items-center gap-2 min-w-0">
          <FileText size={18} style={{ color: '#6B21A8' }} />
          <span style={{ fontSize: 15, fontWeight: 650, color: '#1F2937' }}>Documents</span>
          <span style={{ fontSize: 12, color: '#9CA3AF' }}>· PDF, Excel &amp; Word</span>
        </div>
        <div className="flex-1" />
        <button onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 transition-colors"
          style={{ padding: '7px 13px', borderRadius: 9, border: 'none', background: '#6B21A8', color: '#fff', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
          <Upload size={14} /> Open files
        </button>
      </div>

      {/* Tab strip */}
      {docs.length > 0 && (
        <div className="flex items-stretch gap-1 shrink-0 overflow-x-auto" style={{ padding: '8px 12px 0', background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          {docs.map((d) => {
            const on = d.id === activeId;
            return (
              <div key={d.id} onClick={() => setActiveId(d.id)}
                className="group inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
                style={{
                  padding: '8px 10px 9px', borderRadius: '9px 9px 0 0', maxWidth: 240,
                  background: on ? '#f4f5f8' : 'transparent',
                  borderBottom: on ? '2px solid #6B21A8' : '2px solid transparent',
                  color: on ? '#1F2937' : '#6B7280',
                }}>
                <span style={{ color: on ? '#6B21A8' : '#9CA3AF', display: 'flex' }}>{iconFor(d.kind, 14)}</span>
                <span style={{ fontSize: 12.5, fontWeight: on ? 600 : 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</span>
                <button onClick={(e) => { e.stopPropagation(); closeDoc(d.id); }} aria-label={`Close ${d.name}`}
                  className="opacity-40 hover:opacity-100 transition-opacity"
                  style={{ display: 'flex', border: 'none', background: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>
                  <X size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Action bar for the active doc */}
      {active && (
        <div className="flex items-center gap-2 shrink-0" style={{ padding: '8px 14px', background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: '#9CA3AF' }}>{KIND_LABEL[active.kind]}</span>
          <span style={{ fontSize: 11.5, color: '#9CA3AF' }}>· {prettySize(active.size)}</span>
          <div className="flex-1" />
          {active.kind === 'unsupported' ? (
            <span style={{ fontSize: 11.5, color: '#9CA3AF' }}>Not readable by Scope</span>
          ) : (
            <ScopeStatus status={attachStatus[active.id]} onRetry={() => attachDoc(active, { manual: true })} />
          )}
          {active.kind === 'excel' && !/\.(csv|tsv)$/i.test(active.name) && (
            <button onClick={() => loadAsSource(active)} disabled={isBusy}
              className="inline-flex items-center gap-1.5 transition-colors hover:bg-black/5"
              style={{ padding: '6px 11px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)', background: '#fff', color: '#374151', fontSize: 12, fontWeight: 600, cursor: isBusy ? 'default' : 'pointer', opacity: isBusy ? 0.6 : 1 }}>
              <Table2 size={13} /> Load as workflow source
            </button>
          )}
          <a href={active.url ?? URL.createObjectURL(active.file)} download={active.name}
            className="inline-flex items-center gap-1.5 transition-colors hover:bg-black/5"
            style={{ padding: '6px 11px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)', background: '#fff', color: '#374151', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
            <Download size={13} /> Download
          </a>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 min-h-0 relative">
        {active ? (
          <ActiveRender doc={active} />
        ) : (
          <EmptyState onPick={() => inputRef.current?.click()} />
        )}

        {/* Drag overlay */}
        {dragOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ background: 'rgba(107,33,168,0.06)', border: '2px dashed #6B21A8', zIndex: 5 }}>
            <div style={{ padding: '12px 18px', borderRadius: 12, background: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', fontSize: 13.5, fontWeight: 600, color: '#6B21A8' }}>
              Drop to open
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Scope-context status chip ────────────────────────────────────────────────────
// Replaces the old "Discuss with Scope" button: the open doc is attached to the chat
// automatically, so this just reports state — and only becomes an action (manual retry)
// when extraction failed.
function ScopeStatus({ status, onRetry }: { status?: AttachStatus; onRetry: () => void }) {
  if (status === 'attached') {
    return (
      <span className="inline-flex items-center gap-1.5" title="Scope can read this document — just ask about it in the chat."
        style={{ fontSize: 12, fontWeight: 600, color: '#15803D' }}>
        <Check size={13} /> In Scope&apos;s context
      </span>
    );
  }
  if (status === 'error') {
    return (
      <button onClick={onRetry} title="Couldn't read this document for Scope — click to retry."
        className="inline-flex items-center gap-1.5 transition-colors hover:bg-black/5"
        style={{ padding: '6px 11px', borderRadius: 8, border: '1px solid rgba(107,33,168,0.25)', background: '#faf5ff', color: '#6B21A8', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
        <MessageSquarePlus size={13} /> Add to Scope
      </button>
    );
  }
  // undefined (just opened) or 'attaching'
  return (
    <span className="inline-flex items-center gap-1.5" style={{ fontSize: 12, fontWeight: 500, color: '#9CA3AF' }}>
      <Loader2 size={13} className="animate-spin" /> Adding to Scope…
    </span>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────
function EmptyState({ onPick }: { onPick: () => void }) {
  return (
    <div className="h-full flex items-center justify-center" style={{ padding: 24 }}>
      <button onClick={onPick}
        className="flex flex-col items-center justify-center transition-colors hover:border-purple-400"
        style={{ width: 'min(560px, 90%)', minHeight: 300, borderRadius: 18, border: '2px dashed rgba(0,0,0,0.14)', background: '#fff', cursor: 'pointer', gap: 14, padding: 32 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#faf5ff', display: 'grid', placeItems: 'center', color: '#6B21A8' }}>
          <Upload size={26} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 650, color: '#1F2937' }}>Open a document</div>
        <div style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 1.6, maxWidth: 360 }}>
          Drag &amp; drop or click to open <strong>PDF</strong>, <strong>Excel</strong>, <strong>Word</strong> and text files. View them here, hand them to Scope, or load a spreadsheet as a workflow source.
        </div>
      </button>
    </div>
  );
}

// ── Renderer switch ─────────────────────────────────────────────────────────────
function ActiveRender({ doc }: { doc: OpenDoc }) {
  // Keyed by id so switching tabs remounts the right renderer.
  switch (doc.kind) {
    case 'pdf': return <PdfRender key={doc.id} url={doc.url!} />;
    case 'excel': return <ExcelRender key={doc.id} file={doc.file} />;
    case 'word': return <WordRender key={doc.id} file={doc.file} />;
    case 'text': return <TextRender key={doc.id} file={doc.file} />;
    default: return <UnsupportedRender doc={doc} />;
  }
}

function PdfRender({ url }: { url: string }) {
  return <iframe title="PDF document" src={url} style={{ width: '100%', height: '100%', border: 'none', background: '#525659' }} />;
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="h-full flex items-center justify-center" style={{ fontSize: 13, color: '#6B7280' }}>{children}</div>;
}

function ExcelRender({ file }: { file: File }) {
  const [state, setState] = useState<{ names: string[]; sheets: Record<string, string> } | null>(null);
  const [active, setActive] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
        const sheets: Record<string, string> = {};
        for (const n of wb.SheetNames) sheets[n] = XLSX.utils.sheet_to_html(wb.Sheets[n], { id: 'x', editable: false });
        if (!cancelled) setState({ names: wb.SheetNames, sheets });
      } catch (e) { if (!cancelled) setError(e instanceof Error ? e.message : 'Could not read the workbook.'); }
    })();
    return () => { cancelled = true; };
  }, [file]);

  if (error) return <Centered>Couldn&apos;t read this spreadsheet: {error}</Centered>;
  if (!state) return <Centered><Loader2 size={16} className="animate-spin" style={{ marginRight: 8 }} /> Reading spreadsheet…</Centered>;
  const name = state.names[active];

  return (
    // Keeps the light ground the sheet sits on (the root no longer paints it), so
    // the grid padding doesn't fall through to the host background.
    <div className="h-full flex flex-col" style={{ background: '#f4f5f8' }}>
      <style>{`
        .xls-grid table { border-collapse: collapse; font-size: 12.5px; color: #1F2937; background: #fff; }
        .xls-grid td { border: 1px solid #E5E7EB; padding: 4px 9px; white-space: nowrap; }
        .xls-grid tr:first-child td { background: #f9fafb; font-weight: 600; position: sticky; top: 0; }
      `}</style>
      {state.names.length > 1 && (
        <div className="flex items-center gap-1 shrink-0 overflow-x-auto" style={{ padding: '6px 10px', background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          {state.names.map((n, i) => (
            <button key={n} onClick={() => setActive(i)}
              style={{ padding: '4px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: i === active ? 650 : 500, background: i === active ? '#faf5ff' : 'transparent', color: i === active ? '#6B21A8' : '#6B7280', whiteSpace: 'nowrap' }}>
              {n}
            </button>
          ))}
        </div>
      )}
      <div className="xls-grid flex-1 min-h-0 overflow-auto" style={{ padding: 12 }} dangerouslySetInnerHTML={{ __html: state.sheets[name] }} />
    </div>
  );
}

function WordRender({ file }: { file: File }) {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mammoth: any = await import('mammoth');
        const convert = mammoth.convertToHtml ?? mammoth.default?.convertToHtml;
        const { value } = await convert({ arrayBuffer: await file.arrayBuffer() });
        if (!cancelled) setHtml(value || '<p style="color:#9CA3AF">(empty document)</p>');
      } catch (e) { if (!cancelled) setError(e instanceof Error ? e.message : 'Could not read the document.'); }
    })();
    return () => { cancelled = true; };
  }, [file]);

  if (error) return <Centered>Couldn&apos;t read this Word file: {error}</Centered>;
  if (html === null) return <Centered><Loader2 size={16} className="animate-spin" style={{ marginRight: 8 }} /> Reading document…</Centered>;

  return (
    <div className="h-full overflow-auto" style={{ padding: '28px 20px', background: '#f4f5f8' }}>
      <style>{`
        .doc-prose { background: #fff; max-width: 820px; margin: 0 auto; padding: 56px 64px; border-radius: 6px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); color: #1F2937; font-size: 15px; line-height: 1.7; }
        .doc-prose h1 { font-size: 24px; font-weight: 700; margin: 0 0 16px; }
        .doc-prose h2 { font-size: 19px; font-weight: 650; margin: 24px 0 10px; }
        .doc-prose h3 { font-size: 16px; font-weight: 650; margin: 20px 0 8px; }
        .doc-prose p { margin: 0 0 12px; }
        .doc-prose ul, .doc-prose ol { margin: 0 0 12px; padding-left: 24px; }
        .doc-prose table { border-collapse: collapse; margin: 12px 0; }
        .doc-prose td, .doc-prose th { border: 1px solid #E5E7EB; padding: 6px 10px; }
        .doc-prose img { max-width: 100%; }
      `}</style>
      <div className="doc-prose" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

function TextRender({ file }: { file: File }) {
  const [text, setText] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    file.text().then((t) => { if (!cancelled) setText(t); });
    return () => { cancelled = true; };
  }, [file]);
  if (text === null) return <Centered><Loader2 size={16} className="animate-spin" style={{ marginRight: 8 }} /> Loading…</Centered>;
  return (
    <div className="h-full overflow-auto" style={{ padding: 20, background: '#fff' }}>
      <pre style={{ margin: 0, fontFamily: 'var(--font-mono, monospace)', fontSize: 12.5, lineHeight: 1.6, color: '#1F2937', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{text}</pre>
    </div>
  );
}

function UnsupportedRender({ doc }: { doc: OpenDoc }) {
  return (
    // Light ground (the root no longer paints it) keeps this dark-text message
    // readable when the host panel behind is the dark portal grid.
    <div className="h-full flex items-center justify-center" style={{ padding: 24, background: '#f4f5f8' }}>
      <div style={{ textAlign: 'center', maxWidth: 380 }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#f3f4f6', display: 'grid', placeItems: 'center', color: '#9CA3AF', margin: '0 auto 14px' }}>
          <FileIcon size={24} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#1F2937', marginBottom: 6 }}>Can&apos;t preview {doc.name}</div>
        <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>
          This file type isn&apos;t previewable in the viewer (supported: PDF, Excel, Word .docx, and text). You can still download it.
        </div>
        <a href={doc.url ?? URL.createObjectURL(doc.file)} download={doc.name}
          className="inline-flex items-center gap-1.5" style={{ marginTop: 16, padding: '8px 14px', borderRadius: 9, background: '#6B21A8', color: '#fff', fontSize: 12.5, fontWeight: 600, textDecoration: 'none' }}>
          <Download size={14} /> Download
        </a>
      </div>
    </div>
  );
}
