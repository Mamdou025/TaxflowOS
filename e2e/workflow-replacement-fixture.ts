import React from 'react';
import { createRoot } from 'react-dom/client';
import { createStore, Provider } from 'jotai';
import {
  createWorkflow,
  executeSavedWorkflow,
  saveVersion,
} from '../lib/workflow-core/src/application/commands';
import { startSession } from '../lib/workflow-core/src/application/sessions';
import { workflowBackup } from '../lib/workflow-contracts/src/library';
import { workflowLibraryAtom } from '../artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-library';
import { selectedWorkflowIdAtom } from '../artifacts/ai-workflow-builder/src/features/workflows-hub/workflows-store';
import {
  syncWorkflowLibrary,
  workflowSyncStatus,
} from '../artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-sync';
import { WorkflowDraftReplacement } from '../artifacts/ai-workflow-builder/src/features/workflows-hub/workflow-draft-replacement';
import { DOCUMENT_CALCULATOR_CONFIG } from '../artifacts/ai-workflow-builder/src/shared/workflow-engine/runtime/workflow-runs/document-calculator';
import { executeWorkflowDefinition } from '../artifacts/ai-workflow-builder/src/shared/workflow-engine/workflow/execute';

/** Real commands, UI and repository; the browser test isolates its server writes. */
export async function installReplacementFixture() {
  const definition = DOCUMENT_CALCULATOR_CONFIG.buildSnapshot();
  definition.name = 'Original workflow';
  const calculation = definition.blocks.find(
    (block) => block.config.toolId === 'logic.calculation_engine',
  );
  calculation.config = {
    toolId: 'logic.calculation_engine',
    mode: 'inline',
    formulas: [
      { calculationId: 'total', resultKey: 'total', formulaExpression: 'quantity * price' },
    ],
    inputChoices: { quantity: { kind: 'manual', value: 2 }, price: { kind: 'manual', value: 3 } },
  };
  definition.blocks = [calculation];
  definition.edges = [];
  definition.structure = {
    ...definition.structure,
    entryBlockId: calculation.id,
    blockOrder: [calculation.id],
  };
  let target = saveVersion(
    createWorkflow('custom:replacement-target', 'original-template', definition),
  );
  target = executeSavedWorkflow(
    target,
    { saveDraft: false, version: 1 },
    executeWorkflowDefinition,
  ).entry;
  if (target.runs[0].result.result.status !== 'success')
    throw new Error('Historical fixture calculation did not succeed.');
  target = startSession(target, 1, 'preserved-session');
  target.draft.name = 'Unsaved user changes';
  const sentinel = saveVersion(
    createWorkflow('custom:replacement-sentinel', 'sentinel-template', {
      ...definition,
      name: 'Unrelated workflow',
    }),
  );
  const incoming = saveVersion(
    createWorkflow('custom:incoming-replacement', 'incoming-template', {
      ...definition,
      name: 'Replacement worksheet',
      description: 'The incoming definition.',
    }),
  );
  const store = createStore();
  store.sub(workflowLibraryAtom, () => {});
  await syncWorkflowLibrary();
  if (!['Saved to server', 'Ready to save to server'].includes(workflowSyncStatus()))
    throw new Error('Replacement fixture repository did not initialize.');
  store.set(workflowLibraryAtom, { [target.id]: target, [sentinel.id]: sentinel });
  store.set(selectedWorkflowIdAtom, target.id);
  window.readReplacementLibrary = () => JSON.parse(JSON.stringify(store.get(workflowLibraryAtom)));
  window.editReplacementDraft = () =>
    store.set(workflowLibraryAtom, (previous) => ({
      ...previous,
      [target.id]: {
        ...previous[target.id],
        draft: { ...previous[target.id].draft, name: 'Changed while choosing replacement' },
      },
    }));
  const root = document.createElement('div');
  document.body.replaceChildren(root);
  createRoot(root).render(
    React.createElement(Provider, { store }, React.createElement(WorkflowDraftReplacement)),
  );
  return {
    targetId: target.id,
    sentinelId: sentinel.id,
    backup: JSON.stringify(workflowBackup({ [incoming.id]: incoming })),
  };
}
