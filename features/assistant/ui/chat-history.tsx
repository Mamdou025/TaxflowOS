"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ChatHistory — the sidebar list of REAL saved conversations (Postgres-backed).
// Lists the signed-in user's threads (most-recent first), lets you reopen, rename
// (double-click) and delete one. Distinct from the mock "Clients & Chats" folder
// tree (ClientFolders), which is a local scaffold. FAIL-SOFT: no session / no DB →
// the list is empty and this simply doesn't render.
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useState } from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import { NEU } from "@/components/neumorphic-sidebar";

type Thread = {
  id: string;
  title: string | null;
  updatedAt: string;
};

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const s = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (s < 60) return "now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return `${Math.floor(d / 7)}w`;
}

export function ChatHistory({
  activeThreadId,
  onOpen,
}: {
  activeThreadId: string | null;
  onOpen: (id: string) => void;
}) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/threads");
      if (!res.ok) return;
      const data = (await res.json()) as { threads?: Thread[] };
      setThreads(data.threads ?? []);
    } catch {
      // fail-soft: leave the list as-is
    }
  }, []);

  // Refresh on mount and whenever the active thread changes (a new save appears,
  // a restore highlights the right row).
  useEffect(() => {
    void refresh();
  }, [refresh, activeThreadId]);

  const remove = useCallback(
    async (id: string) => {
      try {
        await fetch(`/api/chat/threads/${id}`, { method: "DELETE" });
      } catch {
        // ignore — refresh reflects the real state
      }
      void refresh();
    },
    [refresh]
  );

  const commitRename = useCallback(
    async (id: string, title: string) => {
      setEditingId(null);
      const next = title.trim();
      if (!next) return;
      try {
        await fetch(`/api/chat/threads/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: next }),
        });
      } catch {
        // ignore
      }
      void refresh();
    },
    [refresh]
  );

  if (threads.length === 0) {
    return (
      <div style={{ padding: "6px 10px", fontSize: 11.5, color: NEU.faint }}>
        No saved chats yet.
      </div>
    );
  }

  return (
    <div>
      <style>{`
        .ch-row:hover { background: rgba(158,158,178,0.14) !important; }
        .ch-actions { opacity: 0; transition: opacity 120ms ease; }
        .ch-row:hover .ch-actions { opacity: 1; }
        .ch-act:hover { background: rgba(158,158,178,0.30); color: ${NEU.text} !important; }
      `}</style>
      {threads.map((t) => {
        const active = t.id === activeThreadId;
        return (
          <div
            key={t.id}
            className="ch-row"
            onClick={() => onOpen(t.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              borderRadius: 8,
              padding: "0 5px 0 8px",
              minHeight: 30,
              cursor: "pointer",
              background: active ? "rgba(139,92,246,0.10)" : "transparent",
            }}
          >
            <span style={{ display: "flex", color: NEU.faint, flexShrink: 0 }}>
              <MessageSquare size={14} />
            </span>

            {editingId === t.id ? (
              <input
                autoFocus
                defaultValue={t.title ?? ""}
                onClick={(e) => e.stopPropagation()}
                onBlur={(e) => commitRename(t.id, e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitRename(t.id, e.currentTarget.value);
                  else if (e.key === "Escape") setEditingId(null);
                }}
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontSize: 12.5,
                  color: NEU.text,
                  background: NEU.surface,
                  border: "1px solid #8B5CF6",
                  borderRadius: 6,
                  padding: "2px 6px",
                  outline: "none",
                }}
              />
            ) : (
              <span
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setEditingId(t.id);
                }}
                title={t.title ?? "Untitled chat"}
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontSize: 12.5,
                  fontWeight: 500,
                  color: NEU.muted,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {t.title ?? "Untitled chat"}
                <span
                  style={{
                    color: NEU.faint,
                    fontWeight: 400,
                    marginLeft: 6,
                    fontSize: 10.5,
                  }}
                >
                  {relativeTime(t.updatedAt)}
                </span>
              </span>
            )}

            {editingId !== t.id && (
              <span
                className="ch-actions"
                style={{ display: "inline-flex", flexShrink: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  title="Delete chat"
                  className="ch-act"
                  onClick={() => remove(t.id)}
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: 21,
                    height: 21,
                    borderRadius: 6,
                    border: "none",
                    background: "transparent",
                    color: NEU.faint,
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={12.5} />
                </button>
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
