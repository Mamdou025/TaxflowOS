import type { BlockFamily } from "./block-types";

export const INSPECTOR_TABS = ["properties", "code", "runs"] as const;

export type InspectorTab = (typeof INSPECTOR_TABS)[number];

export const LOGIC_CODE_MODES = [
  "Formula",
  "Script",
  "Condition",
  "Aggregation",
  "Transformation",
  "AI-assisted logic",
  "Classification / Mapping",
] as const;

export type LogicCodeMode = (typeof LOGIC_CODE_MODES)[number];

export function isInspectorTab(value: unknown): value is InspectorTab {
  return (
    typeof value === "string" &&
    (INSPECTOR_TABS as readonly string[]).includes(value)
  );
}

export function getDefaultInspectorTabForFamily(
  family?: BlockFamily | null
): InspectorTab {
  return family === "Logic" ? "code" : "properties";
}

export function getDefaultInspectorTabForSelection({
  family,
  selectionKind,
}: {
  family?: BlockFamily | null;
  selectionKind: "block" | "edge" | null;
}): InspectorTab {
  if (selectionKind === "edge") {
    return "properties";
  }

  return getDefaultInspectorTabForFamily(family);
}
