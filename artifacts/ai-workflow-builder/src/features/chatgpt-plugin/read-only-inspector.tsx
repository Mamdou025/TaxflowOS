import { useAtomValue } from 'jotai';
import { useRecordedInspection } from '@/features/workflow-builder/ui/workspace/recorded-inspection-context';
import { useOverlay } from '@/shared/ui/overlays/overlay-provider';
import {
  edgesAtom,
  nodesAtom,
  selectedEdgeAtom,
  selectedNodeAtom,
} from '@/shared/workflow-engine/state/workflow-store';

/** Build-scoped inspector: no authoring forms, execution tools, or persistence subscriptions. */
export function ConfigurationOverlay({ overlayId }: { overlayId: string }) {
  const inspection = useRecordedInspection();
  const nodes = useAtomValue(nodesAtom);
  const edges = useAtomValue(edgesAtom);
  const selectedNode = useAtomValue(selectedNodeAtom);
  const selectedEdge = useAtomValue(selectedEdgeAtom);
  const { closeAll } = useOverlay();
  const block = nodes.find((node) => node.id === selectedNode)?.data.block;
  const edge = edges.find((item) => item.id === selectedEdge);
  const title = block?.label ?? (edge ? 'Saved connection' : 'Saved workflow selection');
  return (
    <section
      role="dialog"
      aria-labelledby={`${overlayId}-title`}
      className="max-h-[85dvh] overflow-auto"
    >
      <div className="flex items-center justify-between gap-3 border-b p-4">
        <h2 id={`${overlayId}-title`} className="font-semibold">
          {title}
        </h2>
        <button type="button" className="rounded border px-3 py-1 text-sm" onClick={closeAll}>
          Close inspector
        </button>
      </div>
      {inspection?.header}
      <div className="space-y-3 p-4 text-sm">
        <p className="text-xs text-muted-foreground">
          {block ? `${block.family} · ${block.id}` : edge?.id}
        </p>
        <h3 className="font-semibold">
          {block ? 'Saved configuration' : 'Saved connection details'}
        </h3>
        <pre
          aria-label="Saved configuration"
          className="max-h-80 overflow-auto whitespace-pre-wrap break-words rounded bg-muted p-3 text-xs"
        >
          {JSON.stringify(block?.config ?? edge?.data ?? {}, null, 2)}
        </pre>
      </div>
      {inspection?.evidence}
    </section>
  );
}
