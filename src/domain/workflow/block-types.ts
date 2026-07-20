export const PUBLIC_BLOCK_FAMILIES = [
  "Trigger",
  "Source",
  "Logic",
  "Review / Validation",
  "Field",
  "Output",
  "AI / Agent",
] as const;

// "Protected" is not a user-addable palette family — it is an internal governed-value
// family carried on blocks/tools. It stays a legal `BlockFamily` value (aligning the
// type with what the runtime already assigns) until the kernel node-model step migrates
// protected-ness onto governance metadata (kernel-migration-spec §2.2). Keep the public
// palette (`PUBLIC_BLOCK_FAMILIES`) at seven so the builder UI is unchanged.
export const BLOCK_FAMILIES = [
  ...PUBLIC_BLOCK_FAMILIES,
  "Protected",
] as const;

export type BlockFamily = (typeof BLOCK_FAMILIES)[number];

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
  | "AI Workflow Proposal"
  // Source extraction subtypes (used by the tool registry; reconciled from usage)
  | "Excel Table Reader"
  | "PDF Text Parser"
  | "PDF Table Parser"
  | "OCR Extractor"
  | "API Response Parser"
  // Logic code-mode subtypes
  | "Formula"
  | "Script"
  | "Condition"
  | "Aggregation"
  | "Transformation"
  // Review / Validation gate subtypes
  | "Approval Gate"
  | "Required Input Check"
  | "Missing Source Check"
  | "Unmatched Rows Check"
  | "Low Confidence Warning"
  | "Formula Consistency Check"
  | "Manual Override Review"
  | "Output Readiness Check"
  // Protected (governed value) subtypes
  | "Protected Input"
  | "Protected Result"
  | "Official Line"
  | "Locked Rate"
  | "Final Reviewed Amount";

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
