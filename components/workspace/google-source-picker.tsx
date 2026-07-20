'use client';

// ─────────────────────────────────────────────────────────────────────────────
// GoogleSourcePicker — pull a workflow's source workbook from Google Drive or a
// Gmail attachment, instead of a local-disk upload. It fetches RAW bytes from
// our /api/google/* routes, wraps them in a File, and runs the SAME parser as a
// local upload (parseUploadToRows), so the rows — and therefore every computed
// number — are identical regardless of where the workbook came from.
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useRef, useState } from 'react';
import { HardDrive, Mail, Search, Loader2, FileSpreadsheet, Paperclip, X } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { parseUploadToRows } from '@/lib/workflow-runs/parse-upload';
import type { SourceRow } from '@/lib/workflow-runs';
import type { GoogleStatusResponse } from '@/app/api/google/status/route';
import type { DriveFilesResponse } from '@/app/api/google/drive/files/route';
import type { GmailMessagesResponse } from '@/app/api/google/gmail/messages/route';
import type { DriveFile, GmailMessage } from '@/lib/google/client';

const INK = '#18181b', MUTED = '#71717a', FAINT = '#a1a1aa', LINE = 'rgba(24,24,27,0.10)';

export type PickedSource = { fileName: string; rows: SourceRow[]; origin: 'drive' | 'gmail' };

async function bytesToRows(url: string, fallbackName: string, origin: 'drive' | 'gmail'): Promise<PickedSource> {
  const res = await fetch(url);
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? `Download failed (${res.status}).`);
  }
  const headerName = res.headers.get('X-Filename');
  const fileName = headerName ? decodeURIComponent(headerName) : fallbackName;
  const blob = await res.blob();
  const file = new File([blob], fileName, {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const { rows, fileName: parsedName } = await parseUploadToRows(file);
  if (!rows.length) throw new Error('No usable rows found in that workbook.');
  return { fileName: parsedName, rows, origin };
}

export function GoogleSourcePicker({ onPicked, onClose }: {
  onPicked: (result: PickedSource) => void;
  onClose?: () => void;
}) {
  const [status, setStatus] = useState<GoogleStatusResponse | null>(null);
  const [tab, setTab] = useState<'drive' | 'gmail'>('drive');
  const [query, setQuery] = useState('');
  const [driveFiles, setDriveFiles] = useState<DriveFile[] | null>(null);
  const [gmailMessages, setGmailMessages] = useState<GmailMessage[] | null>(null);
  const [listing, setListing] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const connecting = useRef(false);

  // Connection status.
  useEffect(() => {
    let alive = true;
    fetch('/api/google/status')
      .then((r) => r.json())
      .then((s: GoogleStatusResponse) => { if (alive) setStatus(s); })
      .catch(() => { if (alive) setStatus({ connected: false, missingScopes: [], requiredScopes: [], configured: false }); });
    return () => { alive = false; };
  }, []);

  const load = useCallback(async (activeTab: 'drive' | 'gmail', q: string) => {
    setListing(true); setError(null);
    try {
      if (activeTab === 'drive') {
        const res = await fetch(`/api/google/drive/files?q=${encodeURIComponent(q)}`);
        const data = (await res.json()) as DriveFilesResponse & { error?: string };
        if (!res.ok) throw new Error(data.error ?? 'Could not list Drive files.');
        setDriveFiles(data.files ?? []);
      } else {
        const res = await fetch(`/api/google/gmail/messages?q=${encodeURIComponent(q)}`);
        const data = (await res.json()) as GmailMessagesResponse & { error?: string };
        if (!res.ok) throw new Error(data.error ?? 'Could not search Gmail.');
        setGmailMessages(data.messages ?? []);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setListing(false);
    }
  }, []);

  // Initial + debounced search per tab, once connected.
  useEffect(() => {
    if (!status?.connected) return;
    const t = setTimeout(() => { load(tab, query); }, query ? 350 : 0);
    return () => clearTimeout(t);
  }, [status?.connected, tab, query, load]);

  const connect = async () => {
    if (connecting.current) return;
    connecting.current = true;
    try {
      await authClient.linkSocial({
        provider: 'google',
        scopes: status?.requiredScopes?.length ? status.requiredScopes : [
          'https://www.googleapis.com/auth/drive.readonly',
          'https://www.googleapis.com/auth/gmail.readonly',
        ],
        callbackURL: typeof window !== 'undefined' ? window.location.href : '/',
      });
      // linkSocial redirects to Google; on return the status effect re-runs.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not start Google connection.');
      connecting.current = false;
    }
  };

  const pickDrive = async (f: DriveFile) => {
    setBusyId(f.id); setError(null);
    try {
      onPicked(await bytesToRows(`/api/google/drive/files/${encodeURIComponent(f.id)}/content`, f.name, 'drive'));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not import that file.');
    } finally {
      setBusyId(null);
    }
  };

  const pickAttachment = async (m: GmailMessage, attId: string, filename: string) => {
    setBusyId(attId); setError(null);
    try {
      const url = `/api/google/gmail/messages/${encodeURIComponent(m.messageId)}/attachments/${encodeURIComponent(attId)}?filename=${encodeURIComponent(filename)}`;
      onPicked(await bytesToRows(url, filename, 'gmail'));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not import that attachment.');
    } finally {
      setBusyId(null);
    }
  };

  const shell = (children: React.ReactNode) => (
    <div style={{ marginTop: 10, border: `1px solid ${LINE}`, borderRadius: 11, background: '#fff', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 11px', borderBottom: `1px solid ${LINE}`, background: '#fafafa' }}>
        <span style={{ fontSize: 11, fontWeight: 650, letterSpacing: '0.03em', textTransform: 'uppercase', color: FAINT }}>Import from Google</span>
        {onClose && <button onClick={onClose} title="Close" style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: MUTED, display: 'inline-flex' }}><X size={14} /></button>}
      </div>
      <div style={{ padding: '11px 12px' }}>{children}</div>
    </div>
  );

  if (!status) {
    return shell(<div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: MUTED }}><Loader2 size={13} className="cwp-spin" /> Checking Google connection…</div>);
  }

  if (!status.configured) {
    return shell(<div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.5 }}>Google isn’t configured on this server yet. Add <code style={{ fontSize: 11 }}>GOOGLE_CLIENT_ID</code> / <code style={{ fontSize: 11 }}>GOOGLE_CLIENT_SECRET</code> (with Drive + Gmail scopes) to enable Drive/Gmail import. You can still upload a workbook from your device.</div>);
  }

  if (!status.connected) {
    return shell(
      <div>
        <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.5, marginBottom: 10 }}>Connect Google to pull the trial balance straight from your Drive or an email attachment. Read-only access to Drive and Gmail.</div>
        <button onClick={connect} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5, fontWeight: 600, padding: '8px 14px', borderRadius: 8, background: INK, color: '#fff', border: 'none', cursor: 'pointer' }}>
          <GoogleG /> Connect Google
        </button>
        {error && <div style={{ fontSize: 11, color: '#b91c1c', marginTop: 9 }}>{error}</div>}
      </div>
    );
  }

  const tabBtn = (id: 'drive' | 'gmail', icon: React.ReactNode, label: string) => (
    <button onClick={() => setTab(id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, padding: '6px 11px', borderRadius: 8, cursor: 'pointer', color: tab === id ? '#fff' : INK, background: tab === id ? INK : '#fff', border: `1px solid ${tab === id ? INK : LINE}` }}>{icon} {label}</button>
  );

  return shell(
    <>
      <div style={{ display: 'flex', gap: 7, marginBottom: 10 }}>
        {tabBtn('drive', <HardDrive size={13} />, 'Drive')}
        {tabBtn('gmail', <Mail size={13} />, 'Gmail')}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 10px', border: `1px solid ${LINE}`, borderRadius: 8, marginBottom: 10 }}>
        <Search size={13} style={{ color: FAINT, flexShrink: 0 }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tab === 'drive' ? 'Search Drive spreadsheets…' : 'Search emails with attachments…'}
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: 12.5, color: INK, background: 'transparent' }}
        />
        {listing && <Loader2 size={13} className="cwp-spin" style={{ color: FAINT }} />}
      </div>

      {error && <div style={{ fontSize: 11.5, color: '#b91c1c', marginBottom: 9 }}>{error}</div>}

      <div style={{ maxHeight: 240, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {tab === 'drive' && (
          driveFiles == null ? null
          : driveFiles.length === 0 ? <Empty text={listing ? 'Searching…' : 'No spreadsheets found.'} />
          : driveFiles.map((f) => (
            <RowButton key={f.id} busy={busyId === f.id} onClick={() => pickDrive(f)}
              icon={<FileSpreadsheet size={14} style={{ color: '#15803d' }} />}
              title={f.name}
              sub={`${f.isGoogleSheet ? 'Google Sheet' : 'Excel'}${f.modifiedTime ? ` · ${new Date(f.modifiedTime).toLocaleDateString()}` : ''}`}
            />
          ))
        )}

        {tab === 'gmail' && (
          gmailMessages == null ? null
          : gmailMessages.length === 0 ? <Empty text={listing ? 'Searching…' : 'No emails with .xlsx attachments found.'} />
          : gmailMessages.map((m) => (
            <div key={m.messageId} style={{ padding: '7px 2px', borderTop: `1px solid ${LINE}` }}>
              <div style={{ fontSize: 12.5, color: INK, fontWeight: 550, lineHeight: 1.3 }}>{m.subject}</div>
              <div style={{ fontSize: 10.5, color: FAINT, marginBottom: 5 }}>{cleanFrom(m.from)}{m.date ? ` · ${new Date(m.date).toLocaleDateString()}` : ''}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {m.attachments.map((a) => (
                  <RowButton key={a.attachmentId} busy={busyId === a.attachmentId} onClick={() => pickAttachment(m, a.attachmentId, a.filename)}
                    icon={<Paperclip size={13} style={{ color: MUTED }} />}
                    title={a.filename}
                    sub={a.size ? `${(a.size / 1024).toFixed(0)} KB` : 'attachment'}
                    compact
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

function RowButton({ icon, title, sub, busy, onClick, compact }: { icon: React.ReactNode; title: string; sub?: string; busy?: boolean; onClick: () => void; compact?: boolean }) {
  return (
    <button onClick={onClick} disabled={busy} style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', textAlign: 'left', padding: compact ? '5px 8px' : '7px 8px', borderRadius: 8, background: '#fff', border: `1px solid ${compact ? 'transparent' : LINE}`, cursor: busy ? 'default' : 'pointer' }}
      onMouseEnter={(e) => { if (!busy) e.currentTarget.style.background = '#f6f6f7'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
    >
      <span style={{ flexShrink: 0, display: 'inline-flex' }}>{icon}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 12.5, color: INK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
        {sub && <span style={{ display: 'block', fontSize: 10.5, color: FAINT }}>{sub}</span>}
      </span>
      {busy ? <Loader2 size={13} className="cwp-spin" style={{ color: MUTED, flexShrink: 0 }} /> : <span style={{ fontSize: 11, fontWeight: 600, color: MUTED, flexShrink: 0 }}>Use</span>}
    </button>
  );
}

function Empty({ text }: { text: string }) {
  return <div style={{ fontSize: 12, color: FAINT, padding: '10px 4px', display: 'flex', alignItems: 'center', gap: 6 }}>{text}</div>;
}

function cleanFrom(from: string) {
  const m = from.match(/^\s*"?([^"<]+?)"?\s*<.*>/);
  return (m ? m[1] : from).trim();
}

// A minimal Google "G" mark (inline SVG, no external asset).
function GoogleG() {
  return (
    <svg width="14" height="14" viewBox="0 0 48 48" aria-hidden style={{ background: '#fff', borderRadius: 3, padding: 1 }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
