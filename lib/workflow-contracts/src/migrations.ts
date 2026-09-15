/** Historical portfolio templates used this alias before their specs were typed. */
export function migrateWorkflowRelationship(value: unknown): unknown {
  if (value === 'triggers') return 'initiates';
  if (value === 'data_flow') return 'provides_data_to';
  return value;
}
