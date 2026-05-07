import { getItemCount, getPreviewText } from "./data-preview-utils";

export function getDataPreviewSummary({
  contextData,
  outputType,
  value,
}: {
  contextData?: Record<string, unknown>;
  outputType?: string;
  value: unknown;
}) {
  return {
    count: getItemCount(value, contextData),
    preview: getPreviewText({ contextData, outputType, value }),
  };
}
