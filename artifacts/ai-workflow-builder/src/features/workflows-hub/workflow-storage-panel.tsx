import { useState, useSyncExternalStore } from 'react';
import { useAtom } from 'jotai';
import { toast } from 'sonner';
import { workflowLibraryAtom } from './workflow-library';
import { openWorkflowWorkspace, subscribeWorkflowSync, syncWorkflowLibrary, validateWorkflowLibrary, workflowSyncStatus, workspaceRecoveryCode } from './workflow-sync';

export function WorkflowStoragePanel() {
  const [library, setLibrary] = useAtom(workflowLibraryAtom);
  const status = useSyncExternalStore(subscribeWorkflowSync, workflowSyncStatus, () => 'Checking server save…');
  const [recovery, setRecovery] = useState('');
  const [visibleCode, setVisibleCode] = useState('');
  const [busy, setBusy] = useState(false);
  const exportBackup = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ format: 'taxflow-workflow-backup-v1', library }, null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'workflow-backup.json'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <details className="m-1 rounded border p-2 text-xs">
    <summary aria-label="Workflow storage status">{status}</summary>
    <div className="mt-2 space-y-3">
      <p>Workflows, saved versions, and run history are backed up to this server. Keep a recovery code to open this workspace in another browser.</p>
      <button onClick={() => void syncWorkflowLibrary()}>Retry server save</button>
      <button className="block" onClick={exportBackup}>Export workflow backup</button>
      <label className="block">Import backup as new workflows<input aria-label="Import workflow backup" type="file" accept=".json" onChange={async event => {
        const file = event.target.files?.[0]; event.target.value = ''; if (!file) return;
        try {
          const parsed = JSON.parse(await file.text());
          const imported = validateWorkflowLibrary(parsed.format === 'taxflow-workflow-backup-v1' ? parsed.library : parsed);
          setLibrary(previous => {
            const next = { ...previous };
            for (const entry of Object.values(imported)) {
              const id = `custom:${crypto.randomUUID()}`;
              next[id] = { ...entry, id, draft: { ...entry.draft, id, name: `${entry.draft.name} — Imported` }, versions: entry.versions.map(version => ({ ...version, definition: { ...version.definition, id } })) };
            }
            return next;
          });
          toast.success('Backup imported as new workflows.');
        } catch (error) { toast.error(error instanceof Error ? error.message : 'Import failed.'); }
      }} /></label>
      <button className="block" onClick={() => setVisibleCode(workspaceRecoveryCode())}>Show recovery code</button>
      {visibleCode && <div><p>Keep this private: anyone with this code can open and edit this workspace.</p><textarea aria-label="Workspace recovery code" readOnly value={visibleCode} className="w-full break-all rounded border p-1" /></div>}
      <label className="block">Open another saved workspace<input aria-label="Open workspace recovery code" value={recovery} onChange={event => setRecovery(event.target.value)} className="w-full rounded border p-1" /></label>
      <p>Opening a workspace replaces the current view. Export any unsaved local changes first.</p>
      <button disabled={busy || !recovery.trim()} onClick={async () => { setBusy(true); try { await openWorkflowWorkspace(recovery); toast.success('Saved workspace opened.'); } catch (error) { toast.error(String(error)); } finally { setBusy(false); } }}>Open saved workspace</button>
    </div>
  </details>;
}
