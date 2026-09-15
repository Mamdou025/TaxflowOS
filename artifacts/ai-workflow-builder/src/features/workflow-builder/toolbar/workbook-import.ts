import { type WorkflowNode } from '@/shared/workflow-engine/state/workflow-store';
import { buildFapiWorkbookImportPatch } from '@/shared/workflow-engine/parsing/excel-utils';

export function isExcelSourceNode(node: WorkflowNode) {
  const block = node.data.block;
  const sourceKind = String(block?.config.sourceKind || '').toLowerCase();
  return (
    block?.family === 'Source' &&
    (block.subtype === 'Excel / Workbook' ||
      sourceKind.includes('excel') ||
      sourceKind.includes('workbook') ||
      block.catalogId === 'source:excel-workbook')
  );
}

function isWorkflowNodeCatalog(node: WorkflowNode, catalogId: string) {
  return node.data.block?.catalogId === catalogId;
}

function isFapiInputsSourceNode(node: WorkflowNode) {
  return node.data.block?.config.sourceKind === 'fapi_inputs';
}

function getFapiInputsPatchForWorkbookImport(fapiInputs: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(fapiInputs).filter(
      ([key]) => !['exchangeRate', 'fxRate', 'overrideRate'].includes(key),
    ),
  );
}

function getFxRatePatchForWorkbookImport(fapiInputs: Record<string, unknown>) {
  const overrideRate = fapiInputs.overrideRate || fapiInputs.fxRate || fapiInputs.exchangeRate;
  return {
    documentCurrency: fapiInputs.documentCurrency,
    fapiYear: fapiInputs.fapiYear,
    overrideRate,
    reportingCurrency: fapiInputs.reportingCurrency,
  };
}

function applyWorkbookImportPatchToFapiNode({
  node,
  workbook,
  workbookImport,
}: {
  node: WorkflowNode;
  workbook: { fileName: string; workbookId: string };
  workbookImport: ReturnType<typeof buildFapiWorkbookImportPatch>;
}): WorkflowNode | null {
  if (
    isFapiInputsSourceNode(node) &&
    (workbookImport.importedSheets.fapiInputs ||
      Object.keys(workbookImport.expectedResults).length > 0)
  ) {
    return {
      ...applyConfigPatchToNode(node, {
        ...getFapiInputsPatchForWorkbookImport(workbookImport.fapiInputs),
        importedFromWorkbook: workbook.fileName,
        sourceLocator: `local-excel://${workbook.workbookId}/${encodeURIComponent(
          workbookImport.importedSheets.fapiInputs || 'FAPI Inputs',
        )}`,
        sourceStatus: 'draft',
      }),
      selected: false,
    };
  }

  if (
    isWorkflowNodeCatalog(node, 'source:currency-rate') &&
    workbookImport.importedSheets.fapiInputs
  ) {
    return {
      ...applyConfigPatchToNode(node, {
        ...getFxRatePatchForWorkbookImport(workbookImport.fapiInputs),
        importedFromWorkbook: workbook.fileName,
        sourceLocator: `bank-of-canada://annual-average/${String(
          workbookImport.fapiInputs.documentCurrency || 'USD',
        )}-${String(workbookImport.fapiInputs.reportingCurrency || 'CAD')}/${String(
          workbookImport.fapiInputs.fapiYear || 'current',
        )}`,
        sourceStatus: 'draft',
      }),
      selected: false,
    };
  }

  return null;
}

function applyConfigPatchToNode(node: WorkflowNode, patch: Record<string, unknown>): WorkflowNode {
  const block = node.data.block;
  if (!block) {
    return node;
  }
  const nextConfig = { ...block.config, ...patch };
  const nextBlock = {
    ...block,
    config: nextConfig,
    label: typeof patch.workbookName === 'string' ? 'Uploaded Workbook' : block.label,
    runtime: {
      ...block.runtime,
      outputKey: 'selected_rows',
    },
    source: block.source
      ? {
          ...block.source,
          locator: String(nextConfig.sourceLocator || block.source.locator),
          valuePreview: `${String(nextConfig.selectedRowsCount || 0)} selected rows`,
        }
      : block.source,
    updatedAt: new Date().toISOString(),
    updatedBy: 'workflow-studio',
  };

  return {
    ...node,
    data: {
      ...node.data,
      block: nextBlock,
      config: nextConfig,
      label: nextBlock.label,
    },
  };
}

export function applyWorkbookImportPatchToNode({
  excelPatch,
  node,
  targetNodeId,
  workbook,
  workbookImport,
}: {
  excelPatch: Record<string, unknown>;
  node: WorkflowNode;
  targetNodeId: string;
  workbook: { fileName: string; workbookId: string };
  workbookImport: ReturnType<typeof buildFapiWorkbookImportPatch>;
}): WorkflowNode {
  if (node.id === targetNodeId) {
    return { ...applyConfigPatchToNode(node, excelPatch), selected: true };
  }

  if (
    isWorkflowNodeCatalog(node, 'source:keyword-rules') &&
    workbookImport.keywordRules.length > 0
  ) {
    return {
      ...applyConfigPatchToNode(node, {
        importedFromWorkbook: workbook.fileName,
        keywordRules: workbookImport.keywordRules,
        sourceLocator: `local-excel://${workbook.workbookId}/${encodeURIComponent(
          workbookImport.importedSheets.keywordRules || 'Keyword Rules',
        )}`,
        sourceStatus: 'draft',
      }),
      selected: false,
    };
  }

  if (
    isWorkflowNodeCatalog(node, 'source:aggregation-rules') &&
    workbookImport.aggregationRules.length > 0
  ) {
    return {
      ...applyConfigPatchToNode(node, {
        aggregationRules: workbookImport.aggregationRules,
        importedFromWorkbook: workbook.fileName,
        sourceLocator: `local-excel://${workbook.workbookId}/${encodeURIComponent(
          workbookImport.importedSheets.aggregationRules || 'Aggregation Rules',
        )}`,
        sourceStatus: 'draft',
      }),
      selected: false,
    };
  }

  const fapiPatchedNode = applyWorkbookImportPatchToFapiNode({
    node,
    workbook,
    workbookImport,
  });
  if (fapiPatchedNode) {
    return fapiPatchedNode;
  }

  return { ...node, selected: false };
}
