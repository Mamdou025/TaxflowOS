import type { WorkflowBlock } from "@/shared/workflow-engine/local-fiscal-workflow";
import type {
  WorkflowEdge,
  WorkflowNode,
} from "@/shared/workflow-engine/state/workflow-store";

// A term exists when it is defined, even if no document has supplied its value.
export function availableCalculationValues(
  block: WorkflowBlock,
  edges: WorkflowEdge[],
  nodes: WorkflowNode[],
  outputs: Record<string, unknown> = {},
) {
  const values = new Map<
    string,
    { key: string; label: string; value: number | null }
  >();
  const visited = new Set<string>([block.id]);
  const add = (key: unknown, value: unknown = null, label: unknown = key) => {
    if (typeof key !== "string" || !key) return;
    const number =
      typeof value === "number" && Number.isFinite(value) ? value : null;
    const existing = values.get(key);
    values.set(key, {
      key,
      label: String(label ?? key),
      value: number ?? existing?.value ?? null,
    });
  };
  const visit = (id: string) => {
    for (const edge of edges.filter(
      (edge) =>
        edge.target === id && edge.data?.workflowEdge?.status !== "disabled",
    )) {
      if (visited.has(edge.source)) continue;
      visited.add(edge.source);
      const source = nodes.find((node) => node.id === edge.source)?.data.block;
      if (!source) continue;
      const config = source.config;
      // Explicitly configured input values remain available before execution too.
      if (config.sourceKind === "fapi_inputs") {
        for (const [key, value] of Object.entries(config)) {
          if (typeof value === "number" && !["sourceVersion", "fapiYear"].includes(key)) add(key, value);
        }
      }
      if (typeof config.value === "number" && source.runtime.outputKey) {
        add(source.runtime.outputKey, config.value, source.label);
      }
      for (const groupKey of [
        "aggregationRules",
        "rollupRules",
        "formulas",
        "calculationRules",
        "inlineFormulas",
      ]) {
        const rules = config[groupKey];
        if (Array.isArray(rules))
          for (const rule of rules) {
            if (!rule || typeof rule !== "object") continue;
            add(
              rule.resultName ||
                rule.resultKey ||
                rule.nodeId ||
                rule.rollupId ||
                rule.calculationId,
              null,
              rule.label,
            );
            if (rule.nodeId) add(rule.nodeId, null, rule.label);
          }
      }
      const output = outputs[source.id];
      for (const data of [config, output]) {
        if (!data || typeof data !== "object") continue;
        for (const groupKey of [
          "namedValues",
          "named_values",
          "categoryTotals",
          "rollupTotals",
          "fapiInputs",
          "calculatedResults",
        ]) {
          const group = (data as Record<string, unknown>)[groupKey];
          if (group && typeof group === "object" && !Array.isArray(group))
            for (const [key, value] of Object.entries(group)) add(key, value);
        }
      }
      visit(source.id);
    }
  };
  visit(block.id);
  return [...values.values()];
}
