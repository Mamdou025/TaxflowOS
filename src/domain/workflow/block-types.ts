export const PUBLIC_BLOCK_FAMILIES = [
  "Trigger",
  "Source",
  "Logic",
  "Review / Validation",
  "Field",
  "Output",
  "AI / Agent",
] as const;

export type BlockFamily = (typeof PUBLIC_BLOCK_FAMILIES)[number];

export type WorkflowDefinitionStatus = "draft" | "published";

export type FiscalStage =
  | "trigger"
  | "source"
  | "logic"
  | "validation"
  | "field"
  | "output"
  | "ai-agent";

export type BlockSubtype =
  | "Manual / On Demand"
  | "Schedule / Cron"
  | "Webhook / API Event"
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
  | "Category Rollup Aggregator"
  | "Calculation Engine"
  | "Hierarchy Aggregator"
  | "Classification / Mapping"
  | "Field Block"
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
