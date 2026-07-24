import type {
  GenerateBlockCodePreviewOptions,
  InputBindingPreview,
} from "./types";

export const DEFAULT_MATCH_FIELDS = ["account", "label", "description"];
export const DEFAULT_AMOUNT_FIELD = "amount";

export function asString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function asNumber(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

export function asBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

export function asStringArray(value: unknown, fallback: string[] = []) {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return fallback;
}

export function pretty(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export function lines(...items: string[]) {
  return items.join("\n");
}

export function inputSummary(inputBindings: InputBindingPreview[]) {
  if (inputBindings.length === 0) {
    return { inputs: "No upstream input binding" };
  }

  return inputBindings.reduce<Record<string, unknown>>((summary, row) => {
    summary[row.label] = row.value;
    return summary;
  }, {});
}

export function getToolId({
  block,
  config,
  tool,
}: GenerateBlockCodePreviewOptions) {
  return asString(config.toolId, tool?.toolId || block.subtype);
}
