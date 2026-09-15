export function buildSingleItemPipelineTrace() {
  return [
    'row-001',
    'matched by rule-001',
    'mapped to income_interest',
    'aggregated into subtotal 100',
    'confidence check passed',
    'approved',
    'protected as Z',
    'output generated',
  ];
}

export const Z_SOURCE_TRACE = [
  'Excel Template Row Source.row-001',
  'Mapping Rules Source.rule-001',
  'Keyword Mapper.mapped_rows',
  'Section Aggregator.subtotal',
  'Confidence Check.validation_result',
  'Approval Gate.approval_status',
  'Protected Result Z.protected_result',
];

export const EXPANDED_MAPPING_PIPELINE_NAME = 'Expanded Mapping Pipeline Demo';

export const WORKING_SOURCE_RULES_DEMO_NAME = 'Working Excel Source + Rulebooks Demo';

export const EXPANDED_MAPPING_TRACE_COMMON = [
  'Expanded Excel Rows',
  'Expanded Mapping Rules',
  'Keyword Mapper',
  'Mapping Quality Check',
  'Unmatched Rows Check',
];

export const WORKING_SOURCE_RULES_TRACE_COMMON = [
  'Uploaded Workbook',
  'Keyword Rulebook',
  'Keyword Mapper',
  'Aggregation Rulebook',
  'Rollup & Calculation Engine',
  'Mapping Quality Check',
  'Unmatched Rows Check',
];

export function isDualResultMappingWorkflow(workflowName: string) {
  return (
    workflowName === EXPANDED_MAPPING_PIPELINE_NAME ||
    workflowName === WORKING_SOURCE_RULES_DEMO_NAME
  );
}

export function getDualResultTraceCommon(workflowName: string) {
  return workflowName === WORKING_SOURCE_RULES_DEMO_NAME
    ? WORKING_SOURCE_RULES_TRACE_COMMON
    : EXPANDED_MAPPING_TRACE_COMMON;
}

export function getDualResultPipelineTrace(workflowName: string, resultName?: string) {
  const common = getDualResultTraceCommon(workflowName);
  const workingDemo = workflowName === WORKING_SOURCE_RULES_DEMO_NAME;
  let aggregateStep = workingDemo ? 'Final total Z' : 'Aggregate Z Sections';
  if (resultName === 'W') {
    aggregateStep = workingDemo ? 'Final total W' : 'Aggregate W Sections';
  }
  const approvalStep = resultName === 'W' ? 'Approval Gate W' : 'Approval Gate Z';
  const protectedStep = resultName === 'W' ? 'Protected Result W' : 'Protected Result Z';

  return [
    ...common.slice(0, workingDemo ? 5 : 3),
    aggregateStep,
    ...common.slice(workingDemo ? 5 : 3),
    approvalStep,
    protectedStep,
  ];
}
