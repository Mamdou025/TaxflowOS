import {
  executeWorkflowCommand,
  type TemplateCommandRuntime,
} from '../../lib/workflow-core/src/application/template-command';
import { DOCUMENT_CALCULATOR_CONFIG } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/runtime/workflow-runs/document-calculator';
import { EXPENSE_CONFIG } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/runtime/workflow-runs/expense';
import { executeWorkflowDefinition } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/workflow/execute';
import { createPortfolioWorkflow } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/workflow/templates/portfolio';
import { workpaperDefinition } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/templates/portfolio/executable-workpapers';
import { WORKPAPER_SPECS } from '../../lib/workflow-executors/src/portfolio-workpapers';
import type { TemplateConfig } from '../../lib/workflow-core/src/application/templates';

export const RETIRED_WORKPAPER_IDS = [
  'scope-service',
  'tax-position-summary',
  'data-readiness',
  'platform-sequence',
  'ownership-graph',
  'attribute-ledgers',
  'portfolio-ops',
] as const;

// Reconstruct the formerly public configurations from their retained graph definitions.
// These fixtures never enter the application's resolver or new-work catalogue.
const retiredWorkpapers = RETIRED_WORKPAPER_IDS.map((id): TemplateConfig => {
  const spec = WORKPAPER_SPECS.find((candidate) => candidate.id === id);
  if (!spec) throw new Error(`Missing historical workpaper definition: ${id}`);
  const prefix = `pf-${id}--`;
  return {
    id,
    name: spec.name,
    documentLabel: `${spec.name} records`,
    structuredRecords: true,
    purpose: spec.purpose,
    requiredColumns: spec.fields,
    buildSnapshot: () => createPortfolioWorkflow(workpaperDefinition(spec)),
    sampleRows: spec.sample.map((row, i) => ({
      ...row,
      rowId: `sample-${i + 1}`,
      label: String(row.entity ?? row.owner ?? `Record ${i + 1}`),
      amount: Number(row.amount ?? 0),
    })),
    sourceBlockId: `${prefix}source`,
    mapperBlockId: `${prefix}workpaper`,
    rollupBlockId: `${prefix}workpaper`,
    linesBlockId: `${prefix}workpaper`,
    summaryBlockId: `${prefix}workpaper`,
    steps: [
      { label: 'Supply records', sub: spec.fields.join(', ') },
      { label: 'Validate records', sub: 'Required values and evidence' },
      { label: 'Prepare workpaper', sub: spec.purpose },
      { label: 'Review results', sub: 'Resolve findings and approve' },
    ],
    linesRules: [],
    summaryRules: [
      { resultKey: 'RECORDS', label: 'Workpaper records', description: 'Number of output records' },
      {
        resultKey: 'REVIEW_FINDINGS',
        label: 'Review findings',
        description: 'Outstanding review findings',
      },
    ],
    bucketKeys: [],
    lineKeys: [],
    categoryOptions: [],
    headlineKey: 'RECORDS',
    currency: 'records',
  };
});

// Historical definitions remain useful fixtures without re-entering the public catalogue.
export const resolveLegacyTemplate: TemplateCommandRuntime['resolveTemplate'] = (id) =>
  [DOCUMENT_CALCULATOR_CONFIG, EXPENSE_CONFIG, ...retiredWorkpapers].find(
    (config) => config.id === id,
  ) ?? null;

export function executeLegacyTemplateCommand(
  args: Parameters<typeof executeWorkflowCommand>[0],
  cachedRows?: Parameters<typeof executeWorkflowCommand>[1],
) {
  return executeWorkflowCommand(args, cachedRows, {
    resolveTemplate: resolveLegacyTemplate,
    execute: executeWorkflowDefinition,
    createWorkflowId: () => 'custom:legacy-template-fixture',
  });
}
