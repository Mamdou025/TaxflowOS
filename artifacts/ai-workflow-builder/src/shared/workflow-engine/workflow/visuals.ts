import { BLOCK_CATALOG } from '../block-catalog-data';
import { getProtectedKindForSubtype } from '@/shared/workflow-engine/domain/workflow/protected-rules';
import {
  type BlockSubtype,
  LOCAL_WORKFLOW_ID,
  type BlockCatalogItem,
  type BlockFamily,
  type FiscalStage,
  FISCAL_STAGE_OPTIONS,
  type GovernanceMetadata,
} from './contracts';

export type FiscalVisualPreset = {
  label: string;
  description: string;
  visualLevel: 'L1' | 'L2' | 'L3';
  visualRole: 'source' | 'logic' | 'review' | 'validation' | 'protected' | 'output';
  config: Record<string, string>;
};

const FISCAL_PRESETS: Record<string, FiscalVisualPreset> = {
  'preset:source': {
    label: 'Source: Reference Evidence',
    description: 'Immutable reference set for a fiscal workflow',
    visualLevel: 'L3',
    visualRole: 'source',
    config: {
      fiscalStage: 'source',
      blockFamily: 'Source',
      blockSubtype: 'Excel / Workbook',
      catalogId: 'source:excel-workbook',
      owner: 'Tax Operations',
      rulebookRef: 'Source records are read-only reference truth.',
      inputs: 'source package',
      outputs: 'sourceEvidence',
    },
  },
  'preset:logic': {
    label: 'Logic: Transform Values',
    description: 'Classify, transform, calculate, or derive values',
    visualLevel: 'L2',
    visualRole: 'logic',
    config: {
      fiscalStage: 'logic',
      blockFamily: 'Logic',
      blockSubtype: 'Transformation',
      catalogId: 'logic:transformation',
      owner: 'Fiscal Systems',
      rulebookRef: 'Logic transforms and derives values from source records.',
      inputs: 'sourceEvidence',
      outputs: 'derivedValues',
    },
  },
  'preset:review-validation': {
    label: 'Review / Validation: Trust Checks',
    description: 'Check completeness, thresholds, and review evidence',
    visualLevel: 'L2',
    visualRole: 'validation',
    config: {
      fiscalStage: 'validation',
      blockFamily: 'Review / Validation',
      blockSubtype: 'Output Readiness Check',
      catalogId: 'review:output-readiness-check',
      owner: 'Tax Review',
      rulebookRef: 'Validation gates decide whether results are trustworthy.',
      inputs: 'derivedValues',
      outputs: 'reviewFindings',
    },
  },
  'preset:protected': {
    label: 'Protected: Governed Value',
    description: 'Hold governed inputs, official lines, or result sets',
    visualLevel: 'L2',
    visualRole: 'protected',
    config: {
      fiscalStage: 'protected',
      blockFamily: 'Field',
      blockSubtype: 'Protected Result',
      catalogId: 'protected:protected-result',
      owner: 'Data Steward',
      rulebookRef: 'Protected blocks contain governed inputs or results.',
      inputs: 'reviewFindings',
      outputs: 'protectedValue',
    },
  },
  'preset:output': {
    label: 'Output: Review Artifact',
    description: 'Create handoff artifacts for downstream teams',
    visualLevel: 'L2',
    visualRole: 'output',
    config: {
      fiscalStage: 'output',
      blockFamily: 'Output',
      blockSubtype: 'Evidence Pack',
      catalogId: 'output:evidence-pack',
      owner: 'Tax Delivery',
      rulebookRef: 'Outputs generate handoff or export artifacts.',
      inputs: 'approvedProtectedPacket',
      outputs: 'reviewPacket',
    },
  },
};

const BLOCK_SUBTYPE_SET = new Set<BlockSubtype>(BLOCK_CATALOG.map((item) => item.subtype));

export function isLocalWorkflowId(workflowId?: string | null): boolean {
  return workflowId === LOCAL_WORKFLOW_ID;
}

export function getFiscalPreset(presetId: string): FiscalVisualPreset | undefined {
  return FISCAL_PRESETS[presetId];
}

export function getBlockCatalogItem(catalogId: string): BlockCatalogItem | undefined {
  return BLOCK_CATALOG.find((item) => item.id === catalogId);
}

export function getBlockCatalogItemBySubtype(
  subtype: string | undefined,
): BlockCatalogItem | undefined {
  if (!subtype) {
    return;
  }
  return BLOCK_CATALOG.find((item) => item.subtype === subtype);
}

export function getFiscalVisualForFamily(family: BlockFamily): {
  visualLevel: 'L1' | 'L2' | 'L3';
  visualRole: 'source' | 'logic' | 'review' | 'validation' | 'field' | 'output';
} {
  if (family === 'Source') {
    return { visualLevel: 'L3', visualRole: 'source' };
  }
  if (family === 'Review / Validation') {
    return { visualLevel: 'L2', visualRole: 'validation' };
  }
  if (family === 'Field') {
    return { visualLevel: 'L2', visualRole: 'field' };
  }
  if (family === 'Output') {
    return { visualLevel: 'L2', visualRole: 'output' };
  }
  return { visualLevel: 'L2', visualRole: 'logic' };
}

export function getFiscalVisualForStage(stage: FiscalStage): {
  visualLevel: 'L1' | 'L2' | 'L3';
  visualRole: 'source' | 'logic' | 'review' | 'validation' | 'field' | 'output';
} {
  const option = FISCAL_STAGE_OPTIONS.find((item) => item.stage === stage);
  return getFiscalVisualForFamily(option?.family || 'Logic');
}

export function getFiscalStageLabel(stage: string | undefined): string {
  if (stage === 'review') {
    return 'Review / Validation';
  }
  const option = FISCAL_STAGE_OPTIONS.find((item) => item.stage === stage);
  return option?.label || 'Fiscal Block';
}

export function getFamilyForStage(stage: string | undefined): BlockFamily {
  const option = FISCAL_STAGE_OPTIONS.find((item) => item.stage === stage);
  return option?.family || 'Logic';
}

function isBlockSubtype(value: string | undefined): value is BlockSubtype {
  return Boolean(value && BLOCK_SUBTYPE_SET.has(value as BlockSubtype));
}

export function getSubtypeFromValue(
  value: string | undefined,
  fallback: BlockSubtype,
): BlockSubtype {
  return isBlockSubtype(value) ? value : fallback;
}

export function getDefaultCatalogItemForFamily(family: BlockFamily): BlockCatalogItem {
  return BLOCK_CATALOG.find((item) => item.family === family) || BLOCK_CATALOG[0];
}

function getProtectedKind(subtype: BlockSubtype): NonNullable<GovernanceMetadata['protectedKind']> {
  return getProtectedKindForSubtype(subtype);
}
