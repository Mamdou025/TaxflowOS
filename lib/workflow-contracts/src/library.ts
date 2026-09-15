import { WorkflowLibrarySchema } from './generated-schemas';
import type { WorkflowLibrary } from './library-types';
import type { WorkflowDefinition } from './domain/workflow-types';

export const WORKFLOW_BACKUP_FORMAT = 'taxflow-workflow-backup-v1';

function uniqueIds(values: { id: string }[], label: string) {
  if (
    values.some((value) => !value.id) ||
    new Set(values.map((value) => value.id)).size !== values.length
  ) {
    throw new Error(`The backup contains missing or duplicate ${label} IDs.`);
  }
}

function validateDefinition(definition: WorkflowDefinition) {
  uniqueIds(definition.blocks, 'block');
  uniqueIds(definition.edges, 'edge');
  // Drafts may intentionally contain disconnected or incomplete graphs. Graph
  // readiness is checked by execution, not silently repaired during restore.
}

/** v0 was a bare library; v1 adds a portable backup envelope without rewriting data. */
export function migrateWorkflowBackup(value: unknown): unknown {
  if (value && typeof value === 'object' && 'format' in value) {
    if (value.format !== WORKFLOW_BACKUP_FORMAT || !('library' in value)) {
      throw new Error('Unsupported workflow backup format. Nothing was imported.');
    }
    return value.library;
  }
  return value;
}

export function validateWorkflowLibrary(input: unknown): WorkflowLibrary {
  const parsed = WorkflowLibrarySchema.safeParse(migrateWorkflowBackup(input));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    throw new Error(
      `Invalid workflow backup at ${issue.path.join('.') || 'library'}: ${issue.message}. Nothing was imported.`,
    );
  }
  const library = parsed.data;
  for (const [id, item] of Object.entries(library)) {
    if (!id.startsWith('custom:') || item.id !== id || item.draft.id !== id) {
      throw new Error('The backup contains inconsistent workflow IDs. Nothing was imported.');
    }
    validateDefinition(item.draft);
    const versions = new Set<number>();
    for (const version of item.versions) {
      if (
        !Number.isSafeInteger(version.number) ||
        version.number < 1 ||
        versions.has(version.number)
      ) {
        throw new Error('The backup contains invalid or duplicate version numbers.');
      }
      versions.add(version.number);
      validateDefinition(version.definition);
      if (version.definition.id !== id)
        throw new Error('A saved version belongs to a different workflow.');
    }
    for (const run of item.runs) {
      if (!versions.has(run.version))
        throw new Error('A saved run references a missing workflow version.');
      // An imported copy retains the original execution's workflow ID as
      // provenance. Only the saved-version reference belongs to this library.
    }
  }
  return library;
}

export function workflowBackup(library: WorkflowLibrary) {
  return { format: WORKFLOW_BACKUP_FORMAT, library };
}
