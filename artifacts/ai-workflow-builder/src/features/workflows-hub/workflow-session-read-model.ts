import type {
  PersonalWorkflow,
  WorkflowSession,
} from '@workspace/workflow-contracts/library-types';
import { definitionFingerprint } from '@workspace/workflow-core/commands';
import { projectFieldWorksheet } from '@workspace/workflow-core/field-worksheet';
import {
  calculationInputHistory,
  sessionContext,
  sessionDefinition,
} from '@workspace/workflow-core/sessions';
import {
  sessionInputSourceIdentity,
  workflowRequiredInputs,
} from './workflow-required-inputs-model';

/** Read-only UI data for one immutable library session snapshot. Commands retain their own clones. */
export function projectWorkflowSessionRead(entry: PersonalWorkflow, session: WorkflowSession) {
  const definition = sessionDefinition(entry, session);
  const groups = workflowRequiredInputs(definition, session);
  const history = calculationInputHistory(session);
  const saved = entry.versions.find((version) => version.number === session.version)!;
  return {
    workflowId: entry.id,
    session,
    definition,
    context: sessionContext(entry, session),
    groups,
    draftChanged: definitionFingerprint(entry.draft) !== definitionFingerprint(saved.definition),
    sourceIdentities: new Map(
      definition.blocks.map((block) => [
        block.id,
        sessionInputSourceIdentity(
          block.id,
          groups
            .find((group) => group.blockId === block.id)
            ?.sources.map((source) => source.block.id) ?? [],
          session,
        ),
      ]),
    ),
    worksheets: definition.blocks
      .filter(
        (block) =>
          block.family === 'Field' &&
          block.runtime.visible !== false &&
          block.config.worksheetLines !== undefined,
      )
      .map((block) => ({
        block,
        projection: projectFieldWorksheet({
          block,
          definition,
          results: session.results,
          stale: session.stale,
          history,
        }),
      })),
  };
}

export type WorkflowSessionReadModel = ReturnType<typeof projectWorkflowSessionRead>;

/** One reader belongs to one mounted panel; no data is cached across panels, accounts or workspaces. */
export function createWorkflowSessionReader() {
  let previous:
    | {
        entry: PersonalWorkflow;
        session: WorkflowSession;
        revision: number;
        value: WorkflowSessionReadModel;
      }
    | undefined;
  return (entry: PersonalWorkflow, session: WorkflowSession) => {
    if (
      previous?.entry === entry &&
      previous.session === session &&
      previous.revision === session.revision
    )
      return previous.value;
    const value = projectWorkflowSessionRead(entry, session);
    previous = { entry, session, revision: session.revision, value };
    return value;
  };
}
