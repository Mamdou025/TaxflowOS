import { createPortfolioWorkflow } from "@/shared/workflow-engine/workflow/templates/portfolio";
import { DOCUMENT_CALCULATOR } from "../../templates/portfolio/document-calculator";
import type { TemplateConfig } from "./engine";
export const DOCUMENT_CALCULATOR_CONFIG: TemplateConfig = {
  id: "document-calculator",
  name: "Document Calculator",
  documentLabel: "document records",
  buildSnapshot: () => createPortfolioWorkflow(DOCUMENT_CALCULATOR),
  sampleRows: [
    { rowId: "item-1", label: "Item one", amount: 120 },
    { rowId: "item-2", label: "Item two", amount: 80 },
  ],
  sourceBlockId: "pf-document-calculator--document",
  mapperBlockId: "pf-document-calculator--rules",
  rollupBlockId: "pf-document-calculator--groups",
  linesBlockId: "pf-document-calculator--calculate",
  summaryBlockId: "pf-document-calculator--calculate",
  steps: [
    { label: "Supply records", sub: "Document amounts" },
    { label: "Classify", sub: "Match Item records" },
    { label: "Calculate", sub: "Sum matched amounts and multiply by two" },
    { label: "Review", sub: "Review the calculated result" },
  ],
  linesRules: [],
  summaryRules: [
    {
      resultKey: "RESULT",
      label: "Adjusted total",
      description: "item_total × 2",
    },
  ],
  bucketKeys: ["item_total"],
  lineKeys: [],
  categoryOptions: [
    { id: "items", label: "Items" },
    { id: "__skip__", label: "Exclude with review" },
  ],
  headlineKey: "RESULT",
  currency: "units",
};
