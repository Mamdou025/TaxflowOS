export const PUBLIC_BLOCK_FAMILIES = [
  "Source",
  "Logic",
  "Review / Validation",
  "Protected",
  "Output",
  "AI / Agent",
] as const;

export type BlockFamily = (typeof PUBLIC_BLOCK_FAMILIES)[number];

export type WorkflowDefinitionStatus = "draft" | "published";

export type FiscalStage =
  | "source"
  | "logic"
  | "validation"
  | "protected"
  | "output"
  | "ai-agent";

export type BlockSubtype =
  | "Manual Entry"
  | "Excel / Workbook"
  | "PDF / Document"
  | "API / HTTP Request"
  | "Database Query"
  | "Web / URL"
  | "AI Search Result"
  | "Currency Rate"
  | "Keyword Rules"
  | "Aggregation Rules"
  | "Rollup Rules"
  | "Calculation Rules"
  | "Formula"
  | "Aggregation"
  | "Category Rollup Aggregator"
  | "Calculation Engine"
  | "Hierarchy Aggregator"
  | "Transformation"
  | "Condition"
  | "Script"
  | "Classification / Mapping"
  | "Excel Table Reader"
  | "PDF Text Parser"
  | "PDF Table Parser"
  | "OCR Extractor"
  | "API Response Parser"
  | "Required Input Check"
  | "Missing Source Check"
  | "Unmatched Rows Check"
  | "Low Confidence Warning"
  | "Manual Override Review"
  | "Approval Gate"
  | "Output Readiness Check"
  | "Formula Consistency Check"
  | "Protected Input"
  | "Protected Result"
  | "Official Line"
  | "Locked Rate"
  | "Final Reviewed Amount"
  | "CSV Export"
  | "Excel Export"
  | "PDF Report"
  | "Evidence Pack"
  | "Canonical JSON"
  | "Taxprep Handoff"
  | "ONESOURCE Handoff"
  | "AI Search"
  | "AI Mapping Suggestion"
  | "AI Formula Proposal"
  | "AI Workflow Proposal";

export type BlockStatus =
  | "draft"
  | "configured"
  | "needs-review"
  | "approved"
  | "locked"
  | "running"
  | "success"
  | "error";

export type BlockRunStatus =
  | "pending"
  | "running"
  | "success"
  | "warning"
  | "error"
  | "skipped";

export function isPublicBlockFamily(value: unknown): value is BlockFamily {
  return (
    typeof value === "string" &&
    (PUBLIC_BLOCK_FAMILIES as readonly string[]).includes(value)
  );
}
