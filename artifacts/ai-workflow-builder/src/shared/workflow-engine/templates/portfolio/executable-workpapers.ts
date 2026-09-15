import type { PortfolioWorkflowDef } from "./portfolio-workflows";
import {
  WORKPAPER_SPECS,
  type WorkpaperSpec,
} from "../../portfolio-workpapers";

export function workpaperDefinition(spec: WorkpaperSpec): PortfolioWorkflowDef {
  return {
    id: `pf-${spec.id}`,
    name: spec.name,
    group: ['scope-service', 'tax-position-summary', 'data-readiness', 'platform-sequence'].includes(spec.id) ? 'platform' : ['t1134', 'surplus', 't106', 'eifel', 't2-suite', 'tax-provision', 'part-xiii'].includes(spec.id) ? 'tier1' : 'foundation',
    sub: "Executable workpaper · supplied evidence → validation → results",
    description: spec.purpose,
    blocks: [
      {
        catalogId: "source:excel-workbook",
        id: "source",
        label: "Workpaper records",
        description: `Required columns: ${spec.fields.join(", ")}.`,
        stage: 0,
        row: 0,
        config: {
          toolId: "source.manual_table",
          sourceKind: "manual_table",
          rows: [],
          requireUpload: true,
          columns: spec.fields,
        },
      },
      {
        catalogId: "logic:calculation-engine",
        id: "workpaper",
        label: spec.name,
        description: spec.purpose,
        stage: 1,
        row: 0,
        config: {
          toolId: "logic.portfolio_workpaper",
          workpaperId: spec.id,
          formulas: [],
          calculationRules: [],
          inputs: "rows",
          outputs: "mapped_rows, calculated_results",
        },
      },
      {
        catalogId: "output:excel-export",
        id: "export",
        label: "Workpaper export",
        description: "Validated workpaper rows, metrics and review findings.",
        stage: 2,
        row: 0,
        config: {
          toolId: "output.excel_export",
          inputs: "mapped_rows",
          outputs: "workbook_file",
        },
      },
    ],
    edges: [
      {
        from: "source",
        to: "workpaper",
        label: "Supplied records",
        reason: "Validate supplied evidence",
        fromRole: "rows",
        toRole: "rows",
      },
      {
        from: "workpaper",
        to: "export",
        label: "Workpaper results",
        reason: "Export validated business records",
        fromRole: "mapped_rows",
        toRole: "mapped_rows",
        rel: "included_in_handoff",
      },
    ],
  };
}
export const EXECUTABLE_WORKPAPERS = WORKPAPER_SPECS.map(workpaperDefinition);
