import { useSetAtom } from 'jotai';
import { Plus, PlugZap } from 'lucide-react';
import { NEU } from '@/components/neumorphic-sidebar';
import { integrationsVersionAtom } from '@/lib/integrations-store';
import { workspaceContext } from '@/platform/auth/workspace-context';
import { AddConnectionOverlay } from '@/platform/settings/add-connection-overlay';
import { IntegrationsManager } from '@/platform/settings/integrations-manager';
import { usePageMenu } from '@/shared/stores/page-menu-store';
import { useOverlay } from '@/shared/ui/overlays/overlay-provider';

export default function ConnectionsPage() {
  const { push } = useOverlay();
  const bumpVersion = useSetAtom(integrationsVersionAtom);
  const editable = workspaceContext?.workspace.role !== 'viewer';
  const changed = () => bumpVersion((version) => version + 1);
  const addConnection = () => push(AddConnectionOverlay, { onSuccess: changed });

  usePageMenu(
    'connections',
    {
      left: [{ kind: 'label', id: 'connections-title', text: 'Connections', strong: true }],
      right: [
        {
          kind: 'button',
          id: 'add-connection',
          label: 'Add connection',
          icon: <Plus size={14} />,
          primary: true,
          disabled: !editable,
          onClick: addConnection,
          title: editable ? 'Configure a connection' : 'Viewer access is read-only',
        },
      ],
    },
    [editable],
  );

  return (
    <div className="h-full overflow-auto p-6" style={{ background: NEU.bg }}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-5 flex items-start gap-3">
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
            style={{ background: NEU.surface, boxShadow: NEU.shadowSm, color: NEU.accent }}
          >
            <PlugZap size={18} />
          </span>
          <div>
            <h1 className="m-0 text-lg font-bold" style={{ color: NEU.text }}>
              Connections
            </h1>
            <p className="mt-1 text-sm" style={{ color: NEU.muted }}>
              Configure the authorized provider accounts that workflow blocks can use.
            </p>
          </div>
        </div>
        {!editable && (
          <p className="mb-4 rounded-lg border p-3 text-sm" role="status">
            Viewer access can inspect connections but cannot configure, test or remove them.
          </p>
        )}
        <section
          aria-label="Configured connections"
          className="rounded-2xl p-4"
          style={{ background: NEU.surface, boxShadow: NEU.shadowSm }}
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold" style={{ color: NEU.text }}>
                Configured connections
              </h2>
              <p className="text-xs" style={{ color: NEU.muted }}>
                Credentials stay behind the server connection boundary.
              </p>
            </div>
            {editable && (
              <button
                type="button"
                onClick={addConnection}
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold"
              >
                <Plus size={13} /> Add connection
              </button>
            )}
          </div>
          <IntegrationsManager editable={editable} onIntegrationChange={changed} />
        </section>
      </div>
    </div>
  );
}
