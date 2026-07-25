import { inferSchemaRows } from "./data-preview-utils";
import { EmptyState, SimpleTable } from "./table-view";

export function SchemaView({
  fill,
  outputType,
  value,
}: {
  fill?: boolean;
  outputType?: string;
  value: unknown;
}) {
  const schemaRows = inferSchemaRows(value);

  if (schemaRows.length === 0) {
    return (
      <EmptyState>
        {outputType
          ? `No schema inferred. Output type: ${outputType}`
          : "No schema available."}
      </EmptyState>
    );
  }

  return (
    <SimpleTable
      expanded={false}
      fill={fill}
      keys={["field", "type"]}
      rows={schemaRows.map((row) => ({ field: row.field, type: row.type }))}
    />
  );
}
