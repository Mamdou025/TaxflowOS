import { useState } from 'react';
import { LazyDetails } from '@/features/workflow-builder/ui/workspace/lazy-details';
import { TriggerReadinessPanel } from '@/features/workflow-builder/ui/config/trigger-readiness-panel';
import { presentToolOutput } from "@/shared/workflow-engine/present-tool-output";
import { useAtom } from "jotai";
import { toast } from "sonner";
import {
  createPortfolioWorkflowById,
  workflowDefinitionToCanvas,
  type WorkflowDefinition,
} from "@/shared/workflow-engine/local-fiscal-workflow";
import { getWorkflowConfig } from "@/shared/workflow-engine/runtime/workflow-runs";
import { runLocalWorkflowTools } from "@/shared/workflow-engine/local-tool-runner";
import {
  workflowLibraryAtom,
  saveVersion,
  definitionFingerprint,
} from "./workflow-library";
import { selectedWorkflowIdAtom } from "./workflows-store";
import { WorkflowTestData } from "./workflow-test-data";
import { ReadableData } from "@/features/workflow-builder/ui/workspace/readable-data";

export function templateDefinition(id: string): WorkflowDefinition | null {
  return (
    (getWorkflowConfig(id.replace(/^pf-/, ""))?.buildSnapshot() as
      WorkflowDefinition | undefined) ??
    createPortfolioWorkflowById(id) ??
    null
  );
}
export function SavedWorkflowRun({
  id,
  resultsOnly = false,
}: {
  id: string;
  resultsOnly?: boolean;
}) {
  const [library, setLibrary] = useAtom(workflowLibraryAtom);
  const [, setSelected] = useAtom(selectedWorkflowIdAtom);
  const entry = library[id];
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const definition = entry?.draft ?? templateDefinition(id);
  if (!definition)
    return <p>Add blocks in Build to start testing your workflow.</p>;
  const update = (draft: WorkflowDefinition) => {
    const nextId = entry?.id ?? `custom:${crypto.randomUUID()}`;
    setLibrary((previous) => ({
      ...previous,
      [nextId]: {
        ...(entry ?? { id: nextId, templateId: id, versions: [], runs: [] }),
        draft: {
          ...draft,
          id: nextId,
          name: entry ? draft.name : `${draft.name} — My workflow`,
        },
      },
    }));
    setSelected(nextId);
  };
  const run = (saveDraft = true) => {
    try {
      const nextId = entry?.id ?? `custom:${crypto.randomUUID()}`;
      const base = entry ?? {
          id: nextId,
          templateId: id,
          draft: {
            ...definition,
            id: nextId,
            name: `${definition.name} — My workflow`,
          },
          versions: [],
          runs: [],
        };
      const saved = saveDraft ? saveVersion(base) : base;
      const version = saveDraft ? saved.versions.at(-1)! : saved.versions.find(version => version.number === selectedVersion) ?? saved.versions.at(-1);
      if (!version) return;
      setSelectedVersion(version.number);
      const canvas = workflowDefinitionToCanvas(version.definition);
      const result = runLocalWorkflowTools({
        ...canvas,
        workflowName: version.definition.name,
        workflowId: saved.id,
      });
      setLibrary((previous) => ({
        ...previous,
        [nextId]: {
          ...saved,
          runs: [
            ...saved.runs,
            { version: version.number, at: new Date().toISOString(), result },
          ],
        },
      }));
      setSelected(nextId);
      toast.success(
        `Version ${version.number} executed. Review block results below.`,
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Run failed");
    }
  };
  const latestSaved = entry?.versions.at(-1);
  const chosen = entry?.versions.find(version => version.number === selectedVersion) ?? latestSaved;
  const unsaved = !latestSaved || definitionFingerprint(latestSaved.definition) !== definitionFingerprint(definition);
  const latest = entry?.runs.at(-1);
  const latestVersion = entry?.versions.find(
    (version) => version.number === latest?.version,
  );
  const stale =
    latestVersion &&
    definitionFingerprint(latestVersion.definition) !==
      definitionFingerprint(definition);
  return (
    <div className="space-y-5 text-foreground">
      <div>
        {entry && !resultsOnly ? (
          <label className="block text-xs text-muted-foreground">
            Workflow name
            <input
              aria-label="Workflow name"
              className="mt-1 block w-full rounded border bg-background px-2 py-1 text-lg font-semibold text-foreground"
              defaultValue={definition.name}
              key={id}
              onBlur={(event) => {
                const name = event.target.value.trim();
                if (name && name !== definition.name)
                  update({ ...definition, name });
              }}
            />
          </label>
        ) : (
          <h2 className="text-lg font-semibold">{definition.name}</h2>
        )}
        <p className="text-sm text-muted-foreground">
          {entry
            ? `Personal workflow · ${entry.versions.length ? `Saved version ${entry.versions.at(-1)!.number}` : "Draft"}`
            : "Template · running or editing creates your own workflow"}
        </p>
      </div>
      {!resultsOnly && (
        <>
          <WorkflowTestData definition={definition} onChange={update} />
          <TriggerReadinessPanel config={(definition.blocks.find(block => block.config.canvasNodeType === 'trigger') ?? definition.blocks.find(block => block.id === definition.structure.entryBlockId))?.config ?? {}} blocks={definition.blocks} outputs={Object.fromEntries((entry?.runs.at(-1)?.result.result.results ?? []).filter(result => result.configSignature === JSON.stringify(definition.blocks.find(block => block.id === result.blockId)?.config)).map(result => [result.blockId, result.output]))} />
          <div className="space-y-2 rounded border p-3">
            <p className="text-sm font-medium">{unsaved ? 'Unsaved changes in Build' : `Build and Run share saved version ${latestSaved?.number}`}</p>
            {chosen && <><label className="block text-xs">Saved workflow version<select aria-label="Saved workflow version" className="ml-2 rounded border bg-background p-1" value={chosen.number} onChange={event => setSelectedVersion(Number(event.target.value))}>{entry?.versions.map(version => <option key={version.number} value={version.number}>{version.definition.name} - Version {version.number}</option>)}</select></label><button type="button" className="rounded border px-3 py-2 text-sm" onClick={() => run(false)}>Run saved version {chosen.number}</button></>}
          </div>
          <button
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
            onClick={() => run(true)}
          >
            Save changes and run
          </button>
          <p className="text-xs text-muted-foreground">
            Runs the graph and rules shown in Build using its configured source
            data. Blocks without an executable tool are reported in the results.
          </p>
        </>
      )}
      {stale && (
        <p className="rounded border border-amber-500 p-3 text-sm">
          The draft has changed since this run. These results belong to version{" "}
          {latest?.version}; run again to test your changes.
        </p>
      )}
      {!latest ? (
        <p className="text-sm text-muted-foreground">
          No results yet. Run the workflow to see what each block receives and
          produces.
        </p>
      ) : (
        <div className="space-y-3">
          <h3 className="font-semibold">
            Version {latest.version} · {new Date(latest.at).toLocaleString()} ·{" "}
            {latest.result.result.status}
          </h3>
          {latest.result.result.results.map((result) => (
            <LazyDetails
              className="rounded-lg border bg-background p-3"
              key={result.blockId}
              defaultOpen={result.status === "error"}
              summary={<>
                {latestVersion?.definition.blocks.find(
                  (block) => block.id === result.blockId,
                )?.label ?? result.blockId}{" "}
                · {result.status.replaceAll("_", " ")}
              </>}
            >
              <div className="mt-3 space-y-3">
                {[...result.errors, ...result.warnings].map(
                  (message, index) => (
                    <p className="text-sm text-amber-700" key={index}>
                      {message}
                    </p>
                  ),
                )}
                <h4 className="font-medium">Input</h4>
                <ReadableData value={result.input ?? {}} />
                <h4 className="font-medium">Output</h4>
                <ReadableData
                  value={presentToolOutput(
                    result,
                    latestVersion?.definition.blocks.find(
                      (block) => block.id === result.blockId,
                    ),
                  )}
                />
              </div>
            </LazyDetails>
          ))}
          {entry && entry.runs.length > 1 && (
            <LazyDetails summary={<>Previous runs ({entry.runs.length - 1})</>}>
              {entry.runs
                .slice(0, -1)
                .reverse()
                .map((record, index) => (
                  <LazyDetails className="mt-2 rounded border p-3" key={index} summary={<>
                      Version {record.version} ·{" "}
                      {new Date(record.at).toLocaleString()} ·{" "}
                      {record.result.result.status}
                    </>}>
                    <ReadableData
                      value={record.result.result.results.map((result) => ({
                        block: result.blockId,
                        status: result.status,
                        output: result.output,
                      }))}
                    />
                  </LazyDetails>
                ))}
            </LazyDetails>
          )}
        </div>
      )}
    </div>
  );
}
