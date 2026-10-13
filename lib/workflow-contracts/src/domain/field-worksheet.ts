import type { CalculationInputBinding, CalculationInputRequirement } from './calculation-inputs';
import type { EvidenceRef, SourceTraceRef } from '../tool-types';

/** Display declarations only; the referenced calculator owns all arithmetic. */
export type WorksheetLine = {
  id: string;
  label: string;
  calculationBlockId: string;
  resultKey: string;
  unit?: string;
  /** Optional display hierarchy; does not change calculation or review requirements. */
  presentation?: 'primary' | 'summary' | 'detail';
  group?: string;
  description?: string;
  /** Display precision only, from 0 to 6; the recorded value remains unchanged. */
  decimalPlaces?: number;
  /** Shown, clearly labeled as a default (status 'default'), only when the
   *  calculation hasn't yet produced this result — e.g. a line that's
   *  legitimately zero when not applicable (debt forgiveness, prior-year G).
   *  Never substitutes for a genuinely required value: an 'invalid' or
   *  'stale' result is never overridden, only a 'missing' one. */
  defaultValue?: number;
};

export type FieldWorksheetValueStatus = 'current' | 'missing' | 'invalid' | 'stale' | 'default';

export type FieldWorksheetDependency = {
  key: string;
  label: string;
  kind: 'input' | 'calculation';
  calculationBlockId?: string;
  calculationLabel?: string;
  status: FieldWorksheetValueStatus;
  /** Only a current, finite value is exposed here. */
  value?: number;
  unit?: string;
  formula?: string;
  origin?: CalculationInputRequirement['origin'];
  binding?: CalculationInputBinding;
  message?: string;
  dependencies: FieldWorksheetDependency[];
  evidenceRefs: EvidenceRef[];
  sourceTrace: SourceTraceRef[];
};

export type FieldWorksheetLineProjection = WorksheetLine & {
  calculationLabel?: string;
  status: FieldWorksheetValueStatus;
  value?: number;
  formula?: string;
  message?: string;
  dependencies: FieldWorksheetDependency[];
  evidenceRefs: EvidenceRef[];
  sourceTrace: SourceTraceRef[];
};

export type FieldWorksheetProjection = {
  declared: boolean;
  lines: FieldWorksheetLineProjection[];
  errors: string[];
};
