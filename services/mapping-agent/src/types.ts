import { z } from "zod";

export const treatmentSchema = z.enum([
  "benchmark_only",
  "client_question",
  "context_only",
  "deductible_expense_candidate",
  "do_not_map",
  "manual_input_required",
  "manual_review_required",
  "map_to_engine",
  "overhead_allocation_candidate",
  "schedule_1_adjustment_candidate",
]);

export const reviewRequirementSchema = z.enum([
  "not_required",
  "candidate_review",
  "question_required",
]);

export const sourceRoleSchema = z.enum(["primary", "benchmark"]);
export const rowTypeSchema = z.enum(["identity", "mapping", "coverage"]);

export const evidenceSchema = z.object({
  fileName: z.string().min(1),
  labelCell: z.string().optional(),
  sheetName: z.string().min(1),
  valueCell: z.string().optional(),
});

export const extractedFactSchema = z.object({
  affiliateAlias: z.string().min(1),
  formula: z.string().optional(),
  label: z.string().min(1),
  labelCell: z.string().min(1),
  rowNumber: z.number().int().positive(),
  sheetName: z.string().min(1),
  sourceFile: z.string().min(1),
  value: z.union([z.number(), z.string(), z.boolean()]).nullable(),
  valueCell: z.string().optional(),
});

export const mappingDecisionSchema = z.object({
  affiliateAlias: z.string().min(1),
  confidence: z.number().min(0).max(1),
  decisionId: z.string().min(1),
  discrepancyExpected: z.boolean().default(false),
  engineField: z.string().optional(),
  evidence: evidenceSchema,
  rationale: z.string().min(1),
  reviewRequirement: reviewRequirementSchema,
  rowType: rowTypeSchema,
  ruleId: z.string().min(1),
  sourceFactLabel: z.string().min(1),
  sourceFormula: z.string().optional(),
  sourceRequired: z.boolean(),
  sourceRole: sourceRoleSchema,
  sourceValue: z.union([z.number(), z.string(), z.boolean()]).nullable(),
  treatment: treatmentSchema,
  workflow: z.string().min(1),
});

export const validationIssueSchema = z.object({
  code: z.string().min(1),
  decisionId: z.string().optional(),
  message: z.string().min(1),
  severity: z.enum(["error", "warning"]),
});

export const mappingRunSchema = z.object({
  completedAt: z.string().datetime(),
  mappings: z.array(mappingDecisionSchema),
  provider: z.string().min(1),
  rulePackVersion: z.string().min(1),
  runId: z.string().min(1),
  startedAt: z.string().datetime(),
  status: z.enum(["completed", "needs_review", "failed_validation"]),
  validation: z.object({
    errors: z.number().int().nonnegative(),
    issues: z.array(validationIssueSchema),
    passed: z.boolean(),
    warnings: z.number().int().nonnegative(),
  }),
  workflow: z.string().min(1),
});

export type Evidence = z.infer<typeof evidenceSchema>;
export type ExtractedFact = z.infer<typeof extractedFactSchema>;
export type MappingDecision = z.infer<typeof mappingDecisionSchema>;
export type MappingRun = z.infer<typeof mappingRunSchema>;
export type ReviewRequirement = z.infer<typeof reviewRequirementSchema>;
export type RowType = z.infer<typeof rowTypeSchema>;
export type SourceRole = z.infer<typeof sourceRoleSchema>;
export type Treatment = z.infer<typeof treatmentSchema>;
export type ValidationIssue = z.infer<typeof validationIssueSchema>;

export type TrialBalanceInput = {
  affiliateAlias?: string;
  buffer: Buffer;
  fileName: string;
};

export type ReferenceDocumentInput = {
  buffer: Buffer;
  fileName: string;
};

export type MappingRequest = {
  includeBenchmarkCoverage?: boolean;
  referenceDocuments?: ReferenceDocumentInput[];
  trialBalances: TrialBalanceInput[];
  workflow: string;
};
