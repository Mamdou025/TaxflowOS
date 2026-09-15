import { createPortfolioWorkflow } from "@/shared/workflow-engine/workflow/templates/portfolio";
import { WORKPAPER_SPECS } from "../../portfolio-workpapers";
import { workpaperDefinition } from "../../templates/portfolio/executable-workpapers";
import type { TemplateConfig } from "./engine";

export const BLUEPRINT_RUN_CONFIGS: Record<string, TemplateConfig> =
  Object.fromEntries(
    WORKPAPER_SPECS.map((spec) => {
      const prefix = `pf-${spec.id}--`;
      const config: TemplateConfig = {
        id: spec.id,
        name: spec.name,
        documentLabel: `${spec.name} records`,
        structuredRecords: true,
        purpose: spec.purpose,
        requiredColumns: spec.fields,
        buildSnapshot: () => createPortfolioWorkflow(workpaperDefinition(spec)),
        sampleRows: spec.sample.map((row, i) => ({
          ...row,
          rowId: `sample-${i + 1}`,
          label: String(row.entity ?? row.owner ?? `Record ${i + 1}`),
          amount: Number(row.amount ?? 0),
        })),
        sourceBlockId: `${prefix}source`,
        mapperBlockId: `${prefix}workpaper`,
        rollupBlockId: `${prefix}workpaper`,
        linesBlockId: `${prefix}workpaper`,
        summaryBlockId: `${prefix}workpaper`,
        steps: [
          { label: "Supply records", sub: spec.fields.join(", ") },
          { label: "Validate records", sub: "Required values and evidence" },
          { label: "Prepare workpaper", sub: spec.purpose },
          { label: "Review results", sub: "Resolve findings and approve" },
        ],
        linesRules: [],
        summaryRules: [
          {
            resultKey: "RECORDS",
            label: "Workpaper records",
            description: "Number of output records",
          },
          {
            resultKey: "REVIEW_FINDINGS",
            label: "Review findings",
            description: "Outstanding review findings",
          },
        ],
        bucketKeys: [],
        lineKeys: [],
        categoryOptions: [],
        headlineKey: "RECORDS",
        currency: "records",
      };
      return [spec.id, config];
    }),
  );
