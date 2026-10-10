export { inferCalculationInputs, type CalculationInputRule } from './calculation-input-inference';
export * from './calculation-input-resolution';
export * from './calculation-input-sources';
export {
  calculationValueKey,
  numericOutputFields,
  collectNamedValuesFromBackendInput,
} from './calculation-input-values';
export { effectiveCalculationInputRules } from './calculation-input-rules';
export type {
  CalculationInputChoice,
  CalculationInputChoices,
  CalculationInputRequirement,
} from '@workspace/workflow-contracts/domain/calculation-inputs';
