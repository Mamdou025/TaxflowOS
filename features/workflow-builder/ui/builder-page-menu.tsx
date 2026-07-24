'use client';

// BuilderPageMenu — headless. Publishes the Workflow Builder's chrome into the
// shared panel header (page-menu contract) instead of the floating rail: Edit
// (undo/redo), View (fit), the right-panel toggles (Workflows/Pages/Settings → a
// slide-over via RightPanelShell), Save and Run. Actions come from
// builderBridgeAtom (published by WorkflowToolbar) + the right-panel atoms.
//
// Inspector + Preview panels were removed here — the chat now inspects/edits and
// previews blocks directly (BuilderCopilot exposes the canvas + block actions).

import { useAtomValue, useSetAtom } from 'jotai';
import { Workflow, FileText, Settings, Save, Play } from 'lucide-react';
import { usePageMenu } from '@/shared/stores/page-menu-store';
import { builderBridgeAtom } from '@/lib/builder-bridge';
import { activeRightPanelAtom, triggerFitViewAtom, type ActiveRightPanel } from '@/shared/workflow-engine/state/workflow-store';

export function BuilderPageMenu() {
  const bridge = useAtomValue(builderBridgeAtom);
  const activePanel = useAtomValue(activeRightPanelAtom);
  const setPanel = useSetAtom(activeRightPanelAtom);
  const setFit = useSetAtom(triggerFitViewAtom);

  const canUndo = !!bridge?.canUndo;
  const canRedo = !!bridge?.canRedo;
  const isExecuting = !!bridge?.isExecuting;
  const isSaving = !!bridge?.isSaving;

  const toggle = (k: NonNullable<ActiveRightPanel>) => setPanel(activePanel === k ? null : k);
  const panelBtn = (k: NonNullable<ActiveRightPanel>, label: string, icon: React.ReactNode) => ({
    kind: 'button' as const, id: k, label, icon, title: label, active: activePanel === k, onClick: () => toggle(k),
  });

  usePageMenu(
    'workflow-builder',
    {
      left: [
        { kind: 'dropdown', id: 'edit', label: 'Edit', items: [
          { id: 'undo', label: 'Undo', onClick: () => bridge?.undo(), disabled: !canUndo },
          { id: 'redo', label: 'Redo', onClick: () => bridge?.redo(), disabled: !canRedo },
        ] },
        { kind: 'dropdown', id: 'view', label: 'View', items: [
          { id: 'fit', label: 'Fit to screen', onClick: () => setFit(true) },
        ] },
      ],
      right: [
        panelBtn('workflows', 'Workflows', <Workflow size={14} />),
        panelBtn('pages', 'Pages', <FileText size={14} />),
        panelBtn('settings', 'Settings', <Settings size={14} />),
        { kind: 'separator', id: 'sep' },
        { kind: 'button', id: 'save', label: 'Save', icon: <Save size={14} />, onClick: () => bridge?.save(), disabled: !bridge || isSaving, title: isSaving ? 'Saving…' : 'Save' },
        { kind: 'button', id: 'run', label: isExecuting ? 'Running…' : 'Run', icon: <Play size={14} />, primary: true, onClick: () => bridge?.run(), disabled: !bridge || isExecuting },
      ],
    },
    [bridge, canUndo, canRedo, isExecuting, isSaving, activePanel],
  );

  return null;
}
