import { atomWithStorage } from "jotai/utils";
import { sharedJSONStorage } from '@/shared/workflow-engine/shared-json';
import type { WorkflowDefinition } from "@/shared/workflow-engine/local-fiscal-workflow";
import type { LocalToolRunnerResult } from "@/shared/workflow-engine/local-tool-runner";

export type PersonalWorkflow = {
  id: string;
  templateId: string;
  draft: WorkflowDefinition;
  versions: {
    number: number;
    savedAt: string;
    definition: WorkflowDefinition;
  }[];
  runs: { version: number; at: string; result: LocalToolRunnerResult }[];
};
export const workflowLibraryAtom = atomWithStorage<
  Record<string, PersonalWorkflow>
>("taxflow:workflow-library:v1", {}, sharedJSONStorage<Record<string, PersonalWorkflow>>(), { getOnInit: true });
export function readWorkflowLibrary() {
  return sharedJSONStorage<Record<string, PersonalWorkflow>>().getItem('taxflow:workflow-library:v1', {});
}
export function definitionFingerprint(definition: WorkflowDefinition) {
  return JSON.stringify({
    name: definition.name,
    blocks: definition.blocks.map(({ config, id, label, subtype, family }) => ({
      config,
      id,
      label,
      subtype,
      family,
    })),
    edges: definition.edges.map(
      ({
        id,
        sourceBlockId,
        targetBlockId,
        relationshipType,
        sourceOutputRole,
        targetInputRole,
        bindingStatus,
        status,
      }) => ({
        id,
        sourceBlockId,
        targetBlockId,
        relationshipType,
        sourceOutputRole,
        targetInputRole,
        bindingStatus,
        status,
      }),
    ),
  });
}
export function saveVersion(entry: PersonalWorkflow): PersonalWorkflow {
  const previous = entry.versions.at(-1);
  if (
    previous &&
    definitionFingerprint(previous.definition) ===
      definitionFingerprint(entry.draft)
  )
    return entry;
  return {
    ...entry,
    versions: [
      ...entry.versions,
      {
        number: (previous?.number ?? 0) + 1,
        savedAt: new Date().toISOString(),
        definition: structuredClone(entry.draft),
      },
    ],
  };
}
