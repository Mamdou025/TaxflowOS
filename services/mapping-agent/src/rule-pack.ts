import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { reviewRequirementSchema, treatmentSchema } from "./types";

const mappingRuleSchema = z.object({
  affiliatePattern: z.string().optional(),
  confidence: z.number().min(0).max(1).default(0.95),
  discrepancyExpected: z.boolean().default(false),
  engineField: z.string().optional(),
  id: z.string().min(1),
  labelPattern: z.string().min(1),
  rationale: z.string().min(1),
  reviewRequirement: reviewRequirementSchema,
  sheetPattern: z.string().optional(),
  treatment: treatmentSchema,
});

export const workflowRulePackSchema = z.object({
  affiliateAliases: z.array(
    z.object({
      alias: z.string().min(1),
      sourceNamePattern: z.string().min(1),
    })
  ),
  allowedEngineFields: z.array(z.string().min(1)),
  benchmarkExpectations: z
    .array(
      z.object({
        affiliateAlias: z.string().min(1),
        engineField: z.string().optional(),
        label: z.string().min(1),
        rationale: z.string().min(1),
        reviewRequirement: reviewRequirementSchema,
        rowType: z.enum(["mapping", "coverage"]),
        ruleId: z.string().min(1),
        sheetName: z.string().min(1),
        sourceFile: z.string().min(1),
        treatment: treatmentSchema,
      })
    )
    .default([]),
  identity: z.object({
    confidence: z.number().min(0).max(1),
    preferredSheetPattern: z.string().min(1),
    rationale: z.string().min(1),
  }),
  mappingRules: z.array(mappingRuleSchema),
  ruleSource: z.string().min(1),
  version: z.string().min(1),
  workflow: z.string().min(1),
});

export type MappingRule = z.infer<typeof mappingRuleSchema>;
export type WorkflowRulePack = z.infer<typeof workflowRulePackSchema>;

export function repositoryRoot() {
  return path.resolve(process.cwd());
}

export function rulePackPath(workflow: string) {
  return path.join(
    repositoryRoot(),
    "services",
    "mapping-agent",
    "rule-packs",
    workflow,
    "rule-pack.json"
  );
}

export async function loadRulePack(workflow: string) {
  const raw = await readFile(rulePackPath(workflow), "utf8");
  const rulePack = workflowRulePackSchema.parse(JSON.parse(raw));
  if (rulePack.workflow !== workflow) {
    throw new Error(
      `Rule pack workflow mismatch: requested ${workflow}, loaded ${rulePack.workflow}`
    );
  }
  return rulePack;
}
