import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createWorkflow, saveVersion } from '../lib/workflow-core/src/application/commands';
import { projectFieldWorksheet } from '../lib/workflow-core/src/application/field-worksheet';
import { FieldWorksheetEditor } from '../artifacts/ai-workflow-builder/src/features/workflow-builder/ui/logic-viewers/field-worksheet-editor';
import { FieldWorksheetView } from '../artifacts/ai-workflow-builder/src/features/workflow-builder/ui/logic-viewers/field-worksheet-view';
import { DOCUMENT_CALCULATOR_CONFIG } from '../artifacts/ai-workflow-builder/src/shared/workflow-engine/runtime/workflow-runs/document-calculator';
import { createWorkflowBlockFromCatalog } from '../artifacts/ai-workflow-builder/src/shared/workflow-engine/workflow/block-factory';

/** Isolated editor changes are saved through the real version command before previewing. */
export function installWorksheetEditor() {
  const definition = DOCUMENT_CALCULATOR_CONFIG.buildSnapshot();
  const calculation = definition.blocks.find(
    (block) => block.config.toolId === 'logic.calculation_engine',
  );
  calculation.config = {
    toolId: 'logic.calculation_engine',
    mode: 'inline',
    formulas: [
      {
        resultKey: 'amount',
        label: 'Amount',
        formulaExpression: 'value',
        operation: 'sum',
        operands: [],
      },
    ],
  };
  const field = createWorkflowBlockFromCatalog('field:field-block', {
    id: 'result-field',
    label: 'Result preview',
    position: { x: 900, y: 100 },
    config: {
      worksheetLines: [
        {
          id: 'amount-line',
          label: 'Amount',
          calculationBlockId: calculation.id,
          resultKey: 'amount',
        },
      ],
    },
  });
  definition.blocks = [calculation, field];
  definition.edges = [
    {
      ...definition.edges[0],
      id: 'calculation-to-field',
      sourceBlockId: calculation.id,
      targetBlockId: field.id,
      status: 'active',
      relationshipType: 'provides_data_to',
      sourceOutputRole: 'calculated_results',
      targetInputRole: 'computed_values',
    },
  ];
  definition.structure = {
    ...definition.structure,
    entryBlockId: calculation.id,
    blockOrder: [calculation.id, field.id],
  };
  function Harness() {
    const [config, setConfig] = useState(field.config);
    const [saved, setSaved] = useState<ReturnType<typeof saveVersion>>();
    window.readWorksheetEditor = () => ({
      config: structuredClone(config),
      saved: structuredClone(saved),
    });
    return React.createElement(
      'div',
      null,
      React.createElement(FieldWorksheetEditor, {
        block: { ...field, config },
        definition,
        onConfigPatch: (patch) => setConfig((current) => ({ ...current, ...patch })),
      }),
      React.createElement(
        'button',
        {
          onClick: () => {
            setSaved(
              saveVersion(
                createWorkflow('custom:result-editor', 'blank', {
                  ...definition,
                  blocks: [calculation, { ...field, config }],
                }),
              ),
            );
          },
        },
        'Save preview version',
      ),
      saved &&
        React.createElement(FieldWorksheetView, {
          label: field.label,
          projection: projectFieldWorksheet({
            definition: saved.versions[0].definition,
            block: saved.versions[0].definition.blocks.find((block) => block.id === field.id),
          }),
        }),
    );
  }
  const root = document.createElement('div');
  document.body.replaceChildren(root);
  createRoot(root).render(React.createElement(Harness));
}
