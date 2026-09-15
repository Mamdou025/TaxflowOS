import { workflowBackup } from '@workspace/workflow-contracts/library';
import { useState, useSyncExternalStore } from 'react';
import { useAtom } from 'jotai';
import { toast } from 'sonner';
import { workflowLibraryAtom, rawWorkflowBackup } from './workflow-library';
import { openWorkflowWorkspace, subscribeWorkflowSync, syncWorkflowLibrary, validateWorkflowLibrary, workflowSyncStatus } from './workflow-sync';
import { workspaceContext } from '@/platform/auth/workspace-context';
import { apiJSON } from '@/platform/auth/api-fetch';
import { parseSharedJSON } from '@/shared/workflow-engine/shared-json';

export function WorkflowStoragePanel() {
  const [library, setLibrary] = useAtom(workflowLibraryAtom);
  const status = useSyncExternalStore(subscribeWorkflowSync, workflowSyncStatus, () => 'Checking server save…');
  const [recovery, setRecovery] = useState('');
  const editable = workspaceContext?.workspace.role !== 'viewer';
  const [busy, setBusy] = useState(false);
  const exportBackup = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(workflowBackup(library), null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'workflow-backup.json'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <details className="m-1 rounded border p-2 text-xs">
    <summary aria-label="Workflow storage status">{!editable && status === 'Ready to save to server' ? 'Read-only workspace' : status}</summary>
    <div className="mt-2 space-y-3">
      <p>{workspaceContext?.isDemo ? 'Demo workflows, saved versions and run history are saved to this demo workspace. Export a backup before exiting or clearing browser cookies; another browser cannot reopen this session.' : 'Workflows, saved versions, and run history belong to your signed-in workspace. Sign in and select the same workspace in another browser to restore them.'}</p>
      <button disabled={!editable} onClick={() => void syncWorkflowLibrary()}>Retry server save</button>
      <button className="block" onClick={exportBackup}>Export workflow backup</button>
      <button className="block" onClick={async()=>{try{await openWorkflowWorkspace(workspaceContext?.workspace.id??'');}catch(error){toast.error(String(error));}}}>Reload server copy</button>
      <p>Export any unsaved local changes before reloading the server copy.</p>
      <button className="block" onClick={()=>{
        const raw=localStorage.getItem('taxflow:workflow-library:v1');
        if(raw===null){toast.error('No legacy browser backup was found.');return;}
        const url=URL.createObjectURL(new Blob([raw],{type:'text/plain'}));
        const anchor=document.createElement('a');anchor.href=url;anchor.download='legacy-workflow-backup.txt';anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
      }}>Download legacy browser backup</button>
      {status.includes('raw backup') && <button className="block" onClick={() => {
        const raw = rawWorkflowBackup();
        if (raw === null) return;
        const url = URL.createObjectURL(new Blob([raw], { type: 'text/plain' }));
        const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'workflow-recovery-backup.txt'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      }}>Download raw backup</button>}
      <label className="block">Import backup as new workflows<input disabled={!editable} aria-label="Import workflow backup" type="file" accept=".json,.txt" onChange={async event => {
        const file = event.target.files?.[0]; event.target.value = ''; if (!file) return;
        try {
          const parsed = parseSharedJSON(await file.text());
          const imported = validateWorkflowLibrary(parsed);
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
      {!workspaceContext?.isDemo && <><label className="block">Claim an old anonymous library<input aria-label="Legacy workspace recovery code" value={recovery} onChange={event => setRecovery(event.target.value)} className="w-full rounded border p-1" /></label>
      <p>A legacy recovery code can be claimed once into a new empty workspace. Existing local work must be exported first.</p>
      <button disabled={!editable || busy || !recovery.trim() || Object.keys(library).length>0} onClick={async () => {
        setBusy(true); try {
          await apiJSON('/api/workflow-library/claim',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({recoveryCode:recovery.trim()})});
          await openWorkflowWorkspace(workspaceContext?.workspace.id??'');toast.success('Legacy library claimed.');setRecovery('');
        } catch (error) { toast.error(String(error)); } finally { setBusy(false); }
      }}>Claim legacy library</button></>}
    </div>
  </details>;
}
