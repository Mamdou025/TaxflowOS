export type DataDisplayView = "json" | "schema" | "table" | "trace";
export type DataStatus = "error" | "missing" | "ready" | "warning";

export type DataConsumer = {
  blockLabel: string;
  sourceOutputRole?: string;
  targetInputRole?: string;
};
