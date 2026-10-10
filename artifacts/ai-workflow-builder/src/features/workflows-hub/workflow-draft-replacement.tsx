import { useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { validateWorkflowLibrary } from '@workspace/workflow-contracts/library';
import {
  definitionFingerprint,
  replaceWorkflowFromBackup,
} from '@workspace/workflow-core/commands';
import { workspaceContext } from '@/platform/auth/workspace-context';
import { parseSharedJSON } from '@/shared/workflow-engine/shared-json';
import { workflowLibraryAtom } from './workflow-library';
import { selectedWorkflowIdAtom } from './workflows-store';

export function WorkflowDraftReplacement() {
  const selectedId = useAtomValue(selectedWorkflowIdAtom);
  const [library, setLibrary] = useAtom(workflowLibraryAtom);
  const entry = selectedId ? library[selectedId] : undefined;
  const [pending, setPending] = useState<{
    targetId: string;
    workspaceId: string;
    fingerprint: string;
    backup: unknown;
    name: string;
    count: number;
  } | null>(null);
  const [message, setMessage] = useState('');
  const editable = workspaceContext?.workspace.role !== 'viewer';
  if (!entry) return null;
  const ready = pending?.targetId === entry.id ? pending : null;
  return (
    <section aria-label="Replace selected workflow" className="space-y-2 border-t pt-2">
      <p>
        Update <strong>{entry.draft.name}</strong> from a single-workflow backup. Existing versions
        and runs are kept; unsaved work is preserved as a version.
      </p>
      <label className="block">
        Replacement workflow backup
        <input
          aria-label="Replacement workflow backup"
          type="file"
          accept=".json,.txt"
          disabled={!editable}
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (!file) return;
            setPending(null);
            setMessage('');
            const targetId = entry.id;
            const fingerprint = definitionFingerprint(entry.draft);
            const workspaceId = workspaceContext?.workspace.id ?? '';
            try {
              const backup = parseSharedJSON(await file.text());
              const entries = Object.values(validateWorkflowLibrary(backup));
              if (entries.length !== 1)
                throw new Error('Choose a backup containing exactly one workflow.');
              setPending({
                targetId,
                workspaceId,
                fingerprint,
                backup,
                name: entries[0].draft.name,
                count: entries[0].draft.blocks.length,
              });
            } catch (error) {
              setMessage(
                error instanceof Error ? error.message : 'Could not read the replacement.',
              );
            }
          }}
        />
      </label>
      {ready && (
        <>
          <p>
            Replacement: {ready.name} · {ready.count} blocks.
          </p>
          <button
            disabled={!editable}
            onClick={() => {
              try {
                if (workspaceContext?.workspace.id !== ready.workspaceId)
                  throw new Error('The workspace changed. Open the replacement again.');
                setLibrary((previous) => {
                  const target = previous[ready.targetId];
                  if (!target) throw new Error('The selected workflow is no longer available.');
                  return {
                    ...previous,
                    [target.id]: replaceWorkflowFromBackup(target, ready.backup, ready.fingerprint),
                  };
                });
                setPending(null);
                setMessage(
                  'Replacement version created. Check the workflow storage status for server saving.',
                );
              } catch (error) {
                setMessage(
                  error instanceof Error ? error.message : 'Could not replace the workflow.',
                );
              }
            }}
          >
            Replace workflow &amp; save version
          </button>
          <button className="ml-2" onClick={() => setPending(null)}>
            Cancel replacement
          </button>
        </>
      )}
      {message && <p role="status">{message}</p>}
    </section>
  );
}
