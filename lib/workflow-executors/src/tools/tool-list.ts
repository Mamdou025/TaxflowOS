import { type ToolDefinition } from './types';
import { sourceManualValueTool } from './definitions/source-manual-value';
import { logicAggregationTool } from './definitions/logic-aggregation';
import { logicFormulaTool } from './definitions/logic-formula';
import { logicTransformationTool } from './definitions/logic-transformation';
import { logicExcelTableReaderTool } from './definitions/logic-excel-table-reader';
import { logicPdfTextParserTool } from './definitions/logic-pdf-text-parser';
import { logicPdfTableParserTool } from './definitions/logic-pdf-table-parser';
import { logicOcrExtractTool } from './definitions/logic-ocr-extract';
import { logicApiResponseParserTool } from './definitions/logic-api-response-parser';
import { reviewRequiredInputCheckTool } from './definitions/review-required-input-check';
import { reviewUnmatchedRowsCheckTool } from './definitions/review-unmatched-rows-check';
import { reviewLowConfidenceWarningTool } from './definitions/review-low-confidence-warning';
import { reviewConfidenceCheckTool } from './definitions/review-confidence-check';
import { reviewFormulaConsistencyCheckTool } from './definitions/review-formula-consistency-check';
import { reviewFxRateReviewTool } from './definitions/review-fx-rate-review';
import { reviewApprovalGateTool } from './definitions/review-approval-gate';
import { reviewOutputReadinessCheckTool } from './definitions/review-output-readiness-check';
import { protectedProtectedInputTool } from './definitions/protected-protected-input';
import { protectedProtectedResultTool } from './definitions/protected-protected-result';
import { outputCanonicalJsonTool } from './definitions/output-canonical-json';
import { outputCsvExportTool } from './definitions/output-csv-export';
import { outputExcelExportTool } from './definitions/output-excel-export';
import { outputEvidencePackPreviewTool } from './definitions/output-evidence-pack-preview';
import { fieldFieldBlockTool } from './definitions/field-field-block';

export const localTools: ToolDefinition[] = [
  sourceManualValueTool,
  logicAggregationTool,
  logicFormulaTool,
  logicTransformationTool,
  logicExcelTableReaderTool,
  logicPdfTextParserTool,
  logicPdfTableParserTool,
  logicOcrExtractTool,
  logicApiResponseParserTool,
  reviewRequiredInputCheckTool,
  reviewUnmatchedRowsCheckTool,
  reviewLowConfidenceWarningTool,
  reviewConfidenceCheckTool,
  reviewFormulaConsistencyCheckTool,
  reviewFxRateReviewTool,
  reviewApprovalGateTool,
  reviewOutputReadinessCheckTool,
  protectedProtectedInputTool,
  protectedProtectedResultTool,
  outputCanonicalJsonTool,
  outputCsvExportTool,
  outputExcelExportTool,
  outputEvidencePackPreviewTool,
  fieldFieldBlockTool,
];
