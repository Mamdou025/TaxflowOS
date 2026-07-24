'use client';

// ─────────────────────────────────────────────────────────────────────────────
// ClientFolders — the sidebar's folder tree for companies/clients + chat history.
// Client folders (top level) nest subfolders and chats. Expand/collapse, create
// (folder · subfolder · chat), rename (double-click), delete. Clicking a top-level
// folder also makes it the active client (drives the composer's client context).
// ─────────────────────────────────────────────────────────────────────────────

import { useState, type CSSProperties, type ReactNode } from 'react';
import { useAtom } from 'jotai';
import { ChevronRight, Folder, FolderOpen, FolderPlus, MessageSquare, MessageSquarePlus, Trash2 } from 'lucide-react';
import { NEU } from '@/components/neumorphic-sidebar';
import { selectedClientAtom } from '@/shared/stores/nav-store';
import { folderTreeAtom, expandedFoldersAtom, selectedChatAtom, addChild, removeNode, renameNode, uid, type TreeNode } from '@/lib/folder-tree';

const ACCENT = '#8B5CF6';

export function ClientFolders() {
  const [tree, setTree] = useAtom(folderTreeAtom);
  const [expanded, setExpanded] = useAtom(expandedFoldersAtom);
  const [selectedChat, setSelectedChat] = useAtom(selectedChatAtom);
  const [client, setClient] = useAtom(selectedClientAtom);
  const [editingId, setEditingId] = useState<string | null>(null);

  const toggle = (id: string) => setExpanded((e) => ({ ...e, [id]: !e[id] }));
  const expand = (id: string) => setExpanded((e) => ({ ...e, [id]: true }));

  const addFolder = (parentId: string | null) => {
    const node: TreeNode = { id: uid('f'), name: 'New folder', kind: 'folder', children: [] };
    setTree((t) => addChild(t, parentId, node));
    if (parentId) expand(parentId);
    setEditingId(node.id);
  };
  const addChat = (parentId: string) => {
    const node: TreeNode = { id: uid('ch'), name: 'New chat', kind: 'chat', updated: 'now' };
    setTree((t) => addChild(t, parentId, node));
    expand(parentId);
    setEditingId(node.id);
  };
  const commitRename = (id: string, name: string) => {
    setTree((t) => renameNode(t, id, name.trim() || 'Untitled'));
    setEditingId(null);
  };
  const remove = (id: string) => setTree((t) => removeNode(t, id));

  const iconBtn: CSSProperties = { display: 'grid', placeItems: 'center', width: 21, height: 21, borderRadius: 6, border: 'none', background: 'transparent', color: NEU.faint, cursor: 'pointer', flexShrink: 0 };

  const renderNode = (node: TreeNode, depth: number): ReactNode => {
    const isFolder = node.kind === 'folder';
    const open = !!expanded[node.id];
    const isTop = depth === 0;
    const isActiveClient = isTop && isFolder && node.name === client;
    const isSelectedChat = node.kind === 'chat' && selectedChat === node.id;

    const onRowClick = () => {
      if (isFolder) { toggle(node.id); if (isTop) setClient(node.name); }
      else setSelectedChat(node.id);
    };

    return (
      <div key={node.id}>
        <div
          className="cf-row"
          onClick={onRowClick}
          style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 8, paddingRight: 5, paddingLeft: 8 + depth * 13, minHeight: 30, cursor: 'pointer', background: isSelectedChat || isActiveClient ? 'rgba(139,92,246,0.10)' : 'transparent' }}
        >
          {isFolder ? (
            <span style={{ display: 'grid', placeItems: 'center', width: 15, height: 15, color: NEU.faint, flexShrink: 0, transition: 'transform 150ms', transform: open ? 'rotate(90deg)' : 'none' }}><ChevronRight size={13} /></span>
          ) : (
            <span style={{ width: 15, flexShrink: 0 }} />
          )}

          <span style={{ display: 'flex', color: isActiveClient ? ACCENT : NEU.faint, flexShrink: 0 }}>
            {isFolder ? (open ? <FolderOpen size={15} /> : <Folder size={15} />) : <MessageSquare size={14} />}
          </span>

          {editingId === node.id ? (
            <input
              autoFocus
              defaultValue={node.name}
              onClick={(e) => e.stopPropagation()}
              onBlur={(e) => commitRename(node.id, e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitRename(node.id, e.currentTarget.value);
                else if (e.key === 'Escape') setEditingId(null);
              }}
              style={{ flex: 1, minWidth: 0, fontSize: 12.5, fontWeight: isFolder ? 600 : 500, color: NEU.text, background: NEU.surface, border: `1px solid ${ACCENT}`, borderRadius: 6, padding: '2px 6px', outline: 'none' }}
            />
          ) : (
            <span
              onDoubleClick={(e) => { e.stopPropagation(); setEditingId(node.id); }}
              title={node.name}
              style={{ flex: 1, minWidth: 0, fontSize: 12.5, fontWeight: isFolder ? 600 : 500, color: isFolder ? NEU.text : NEU.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {node.name}
              {node.kind === 'chat' && node.updated && (
                <span style={{ color: NEU.faint, fontWeight: 400, marginLeft: 6, fontSize: 10.5 }}>{node.updated}</span>
              )}
            </span>
          )}

          {editingId !== node.id && (
            <span className="cf-actions" style={{ display: 'inline-flex', gap: 0, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
              {isFolder && <button title="New subfolder" style={iconBtn} className="cf-act" onClick={() => addFolder(node.id)}><FolderPlus size={13} /></button>}
              {isFolder && <button title="New chat" style={iconBtn} className="cf-act" onClick={() => addChat(node.id)}><MessageSquarePlus size={13} /></button>}
              <button title={isFolder ? 'Delete folder' : 'Delete chat'} style={iconBtn} className="cf-act" onClick={() => remove(node.id)}><Trash2 size={12.5} /></button>
            </span>
          )}
        </div>

        {isFolder && open && node.children?.map((c) => renderNode(c, depth + 1))}
      </div>
    );
  };

  return (
    <div>
      <style>{`
        .cf-row:hover { background: rgba(158,158,178,0.14) !important; }
        .cf-actions { opacity: 0; transition: opacity 120ms ease; }
        .cf-row:hover .cf-actions { opacity: 1; }
        .cf-act:hover { background: rgba(158,158,178,0.30); color: ${NEU.text} !important; }
      `}</style>
      {tree.map((n) => renderNode(n, 0))}
      <button
        onClick={() => addFolder(null)}
        className="cf-row"
        style={{ display: 'flex', alignItems: 'center', gap: 7, width: '100%', padding: '7px 9px', borderRadius: 8, border: 'none', background: 'transparent', color: NEU.muted, cursor: 'pointer', fontSize: 12, fontWeight: 600, marginTop: 2 }}
      >
        <FolderPlus size={14} /> New client folder
      </button>
    </div>
  );
}
