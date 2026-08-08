

// ─────────────────────────────────────────────────────────────────────────────
// DocumentsLibrary — a self-contained surface to store & manage large company
// documents. Upload (file picker + drag-drop) sends bytes straight to Supabase
// Storage; the list shows each doc's processing status; Open fetches a short-lived
// signed URL; Delete removes the row + object. Once RAG is on (Phase 3), a "ready"
// document is retrievable by Sina. FAIL-SOFT: no session / no storage → empty list
// and a clear message on upload.
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useRef, useState } from "react";
import { FileText, Trash2, UploadCloud, Check, Plus } from "lucide-react";
import { uploadDocument } from "./upload-client";

type DocRow = {
  id: string;
  fileName: string;
  mimeType: string | null;
  sizeBytes: number | null;
  status: "uploading" | "processing" | "ready" | "failed";
  extractedChars: number | null;
  error: string | null;
  inLibrary: boolean;
  createdAt: string;
};

const STATUS_STYLE: Record<DocRow["status"], { label: string; color: string; bg: string }> = {
  uploading: { label: "Uploading", color: "#7c6f00", bg: "rgba(234,179,8,0.15)" },
  processing: { label: "Processing", color: "#6d28d9", bg: "rgba(139,92,246,0.15)" },
  ready: { label: "Ready", color: "#047857", bg: "rgba(16,185,129,0.15)" },
  failed: { label: "Failed", color: "#b91c1c", bg: "rgba(239,68,68,0.15)" },
};

function formatSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentsLibrary() {
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/documents");
      if (!res.ok) return;
      const data = (await res.json()) as { documents?: DocRow[] };
      setDocs(data.documents ?? []);
    } catch {
      // fail-soft
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Poll while anything is still uploading/processing so status settles on its own.
  useEffect(() => {
    const pending = docs.some(
      (d) => d.status === "processing" || d.status === "uploading"
    );
    if (!pending) return;
    const t = setInterval(() => void refresh(), 3000);
    return () => clearInterval(t);
  }, [docs, refresh]);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      for (const file of list) {
        setBusy(`Uploading ${file.name}…`);
        const result = await uploadDocument(file);
        if (result.error) {
          setNotice(result.error);
          break;
        }
        await refresh();
      }
      setBusy(null);
      if (inputRef.current) inputRef.current.value = "";
    },
    [refresh]
  );

  const open = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/documents/${id}`);
      if (!res.ok) return;
      const data = (await res.json()) as { downloadUrl?: string | null };
      if (data.downloadUrl) window.open(data.downloadUrl, "_blank", "noopener");
    } catch {
      // ignore
    }
  }, []);

  const remove = useCallback(
    async (id: string) => {
      try {
        await fetch(`/api/documents/${id}`, { method: "DELETE" });
      } catch {
        // ignore
      }
      void refresh();
    },
    [refresh]
  );

  // Toggle whether a document is in Sina's Library (the searchable active context).
  // Optimistic — flip locally, then persist; on failure re-sync from the server.
  const setInLibrary = useCallback(
    async (id: string, next: boolean) => {
      setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, inLibrary: next } : d)));
      try {
        const res = await fetch(`/api/documents/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inLibrary: next }),
        });
        if (!res.ok) void refresh();
      } catch {
        void refresh();
      }
    },
    [refresh]
  );

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 20px" }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--sx-text, #1a1a1a)", margin: "0 0 4px" }}>
        Company documents
      </h1>
      <p style={{ fontSize: 13, color: "var(--sx-muted, #6b7280)", margin: "0 0 18px" }}>
        Your full document repository. Everything is stored here; use{" "}
        <b style={{ color: "var(--sx-text, #1a1a1a)", fontWeight: 600 }}>In&nbsp;Library</b> to choose
        which ones Sina can actually search — the rest stay stored but out of context.
      </p>

      {/* Dropzone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) void handleFiles(e.dataTransfer.files);
        }}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          padding: "28px 16px",
          borderRadius: 14,
          border: `1.5px dashed ${dragOver ? "#8B5CF6" : "var(--sx-divider, #d4d4d8)"}`,
          background: dragOver ? "rgba(139,92,246,0.06)" : "var(--sx-surface, #fafafa)",
          color: "var(--sx-muted, #6b7280)",
          cursor: "pointer",
          transition: "all 150ms",
        }}
      >
        <UploadCloud size={26} />
        <span style={{ fontSize: 13.5, fontWeight: 500 }}>
          {busy ?? "Drop files here or click to upload"}
        </span>
        <span style={{ fontSize: 11.5 }}>PDF, Word, Excel, text — large files welcome</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) void handleFiles(e.target.files);
        }}
      />

      {notice && (
        <div
          style={{
            marginTop: 12,
            padding: "8px 12px",
            borderRadius: 8,
            fontSize: 12.5,
            background: "rgba(239,68,68,0.12)",
            color: "#b91c1c",
          }}
        >
          {notice}
        </div>
      )}

      {/* List */}
      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
        {docs.length === 0 ? (
          <div style={{ fontSize: 13, color: "var(--sx-muted, #6b7280)", padding: "8px 2px" }}>
            No documents yet.
          </div>
        ) : (
          docs.map((d) => {
            const s = STATUS_STYLE[d.status];
            return (
              <div
                key={d.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: "var(--sx-surface, #fafafa)",
                  border: "1px solid var(--sx-divider, #ececf0)",
                }}
              >
                <FileText size={18} style={{ color: "var(--sx-muted, #6b7280)", flexShrink: 0 }} />
                <button
                  type="button"
                  onClick={() => open(d.id)}
                  title="Open"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    textAlign: "left",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 500,
                      color: "var(--sx-text, #1a1a1a)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {d.fileName}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--sx-muted, #9ca3af)" }}>
                    {formatSize(d.sizeBytes)}
                    {d.extractedChars ? ` · ${(d.extractedChars / 1000).toFixed(0)}k chars` : ""}
                  </div>
                </button>
                {/* In-Library toggle — is this doc in Sina's searchable context? */}
                {(() => {
                  const inLib = d.inLibrary !== false;
                  return (
                    <button
                      type="button"
                      onClick={() => setInLibrary(d.id, !inLib)}
                      title={
                        inLib
                          ? "In Sina's Library — click to remove from its searchable context"
                          : "Add to Sina's Library so it can search this document"
                      }
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "4px 10px",
                        borderRadius: 999,
                        cursor: "pointer",
                        flexShrink: 0,
                        color: inLib ? "#6d28d9" : "var(--sx-muted, #9ca3af)",
                        background: inLib ? "rgba(139,92,246,0.14)" : "transparent",
                        border: `1px solid ${inLib ? "transparent" : "var(--sx-divider, #d4d4d8)"}`,
                      }}
                    >
                      {inLib ? <Check size={13} /> : <Plus size={13} />}
                      {inLib ? "In Library" : "Add"}
                    </button>
                  );
                })()}
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "3px 9px",
                    borderRadius: 999,
                    color: s.color,
                    background: s.bg,
                    flexShrink: 0,
                  }}
                  title={d.error ?? undefined}
                >
                  {s.label}
                </span>
                <button
                  type="button"
                  onClick={() => remove(d.id)}
                  title="Delete"
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    border: "none",
                    background: "transparent",
                    color: "var(--sx-muted, #9ca3af)",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
