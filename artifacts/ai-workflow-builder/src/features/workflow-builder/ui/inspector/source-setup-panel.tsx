

import {
  CurrencyRateSourcePanel,
  FapiInputsSourcePanel,
} from "@/features/workflow-builder/ui/source-viewers/currency-rate-source-panel";
import { ExcelUploadPanel } from "@/features/workflow-builder/ui/source-viewers/excel-upload-panel";
import { HttpJsonSourcePanel } from "@/features/workflow-builder/ui/source-viewers/http-json-source-panel";
import { ManualValueSourcePanel } from "@/features/workflow-builder/ui/source-viewers/manual-value-source-panel";
import { AggregationRulebookEditor } from "@/features/workflow-builder/ui/source-viewers/aggregation-rulebook-editor";
import { RuleSourceEditor } from "@/features/workflow-builder/ui/source-viewers/rule-source-editor";
import {
  CalculationRulesSourceEditor,
  RollupRulesSourceEditor,
} from "@/features/workflow-builder/ui/source-viewers/split-rule-source-editors";
import type { WorkflowBlock } from "@/shared/workflow-engine/local-fiscal-workflow";

type SourceSetupPanelProps = {
  block: WorkflowBlock;
  config: Record<string, unknown>;
  disabled?: boolean;
  onConfigPatch: (patch: Record<string, unknown>) => void;
  onCreateSourceVersion: () => void;
  onSelectedRulebookItemChange?: (itemId: string) => void;
  selectedRulebookItemId?: string;
  showRulebookOverview?: boolean;
  sourceLocked: boolean;
  sourceUsedInRun: boolean;
  sourceVersion: number;
};

function isRuleSource(block: WorkflowBlock, config: Record<string, unknown>) {
  const sourceKind = String(config.sourceKind || "").toLowerCase();
  return (
    block.subtype === "Keyword Rules" ||
    sourceKind.includes("keyword_rules") ||
    sourceKind.includes("rule_knowledge")
  );
}

function isRollupRuleSource(
  block: WorkflowBlock,
  config: Record<string, unknown>
) {
  const sourceKind = String(config.sourceKind || "").toLowerCase();
  return (
    block.subtype === "Rollup Rules" || sourceKind.includes("rollup_rules")
  );
}

function isCalculationRuleSource(
  block: WorkflowBlock,
  config: Record<string, unknown>
) {
  const sourceKind = String(config.sourceKind || "").toLowerCase();
  return (
    block.subtype === "Calculation Rules" ||
    sourceKind.includes("calculation_rules")
  );
}

function isAggregationRuleSource(
  block: WorkflowBlock,
  config: Record<string, unknown>
) {
  const sourceKind = String(config.sourceKind || "").toLowerCase();
  return (
    block.subtype === "Aggregation Rules" ||
    sourceKind.includes("aggregation_rules")
  );
}

function isHttpJsonSource(
  block: WorkflowBlock,
  config: Record<string, unknown>
) {
  const sourceKind = String(config.sourceKind || "").toLowerCase();
  return (
    block.subtype === "API / HTTP Request" ||
    config.toolId === "source.http_json" ||
    sourceKind.includes("http_json")
  );
}

function isManualValueSource(
  block: WorkflowBlock,
  config: Record<string, unknown>
) {
  const sourceKind = String(config.sourceKind || "").toLowerCase();
  return (
    block.subtype === "Manual Entry" ||
    config.toolId === "source.manual_value" ||
    sourceKind.includes("manual_value")
  );
}

function isExcelSource(block: WorkflowBlock, config: Record<string, unknown>) {
  const sourceKind = String(config.sourceKind || "").toLowerCase();
  return (
    block.subtype === "Excel / Workbook" ||
    sourceKind.includes("manual_table") ||
    sourceKind.includes("uploaded") ||
    sourceKind.includes("excel") ||
    sourceKind.includes("workbook")
  );
}

export function SourceSetupPanel(props: SourceSetupPanelProps) {
  if (props.config.sourceKind === "currency_rate") {
    return <CurrencyRateSourcePanel {...props} />;
  }

  if (props.config.sourceKind === "fapi_inputs") {
    return <FapiInputsSourcePanel {...props} />;
  }

  if (isRollupRuleSource(props.block, props.config)) {
    return <RollupRulesSourceEditor {...props} />;
  }

  if (isCalculationRuleSource(props.block, props.config)) {
    return <CalculationRulesSourceEditor {...props} />;
  }

  if (isAggregationRuleSource(props.block, props.config)) {
    return (
      <AggregationRulebookEditor
        {...props}
        onSelectedNodeIdChange={props.onSelectedRulebookItemChange}
        selectedNodeId={props.selectedRulebookItemId}
        showRulebookOverview={props.showRulebookOverview}
      />
    );
  }

  if (isRuleSource(props.block, props.config)) {
    return (
      <RuleSourceEditor
        {...props}
        onSelectedRulebookItemChange={props.onSelectedRulebookItemChange}
        selectedRulebookItemId={props.selectedRulebookItemId}
        showRulebookOverview={props.showRulebookOverview}
      />
    );
  }

  if (isHttpJsonSource(props.block, props.config)) {
    return <HttpJsonSourcePanel {...props} />;
  }

  if (isManualValueSource(props.block, props.config)) {
    return <ManualValueSourcePanel {...props} />;
  }

  if (isExcelSource(props.block, props.config)) {
    return <ExcelUploadPanel {...props} />;
  }

  return (
    <div className="rounded-md border bg-muted/20 p-3 text-muted-foreground text-xs">
      No Source setup panel is registered for this Source subtype yet.
    </div>
  );
}
