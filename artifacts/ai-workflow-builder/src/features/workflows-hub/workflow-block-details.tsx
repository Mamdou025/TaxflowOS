import type { WorkflowDefinition } from '@workspace/workflow-contracts/domain/workflow-types';
import type { WorkflowSession } from '@workspace/workflow-contracts/library-types';
import { ReadableData } from '@/features/workflow-builder/ui/workspace/readable-data';
import { DocumentExtractionEvidence } from '@/features/documents/document-extraction-evidence';
import { presentToolOutput } from '@/shared/workflow-engine/present-tool-output';
import { projectWorkflowBlockDetail } from './workflow-block-detail-model';

export function WorkflowBlockDetails({
  definition,
  blockId,
  session,
}: {
  definition: WorkflowDefinition;
  blockId: string;
  session?: WorkflowSession;
}) {
  const detail = projectWorkflowBlockDetail(definition, blockId, session);
  if (!detail) return null;
  const { block, result } = detail;
  return (
    <div className="workflow-block-details space-y-3 text-sm" data-block-details={block.id}>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">
          {block.family} · {block.subtype}
        </p>
        {block.description && <p>{block.description}</p>}
        <p className="text-xs text-muted-foreground">
          {detail.dependencies.length ? 'Connected inputs:' : 'No preceding steps'}
        </p>
        {detail.dependencies.length > 0 && (
          <ul className="space-y-1 text-xs">
            {detail.dependencies.map((dependency) => (
              <li key={dependency.id}>
                {dependency.label}
                {dependency.sourceRole ? ` · ${dependency.sourceRole}` : ''}
                {dependency.targetRole ? ` → ${dependency.targetRole}` : ''}
              </li>
            ))}
          </ul>
        )}
      </div>
      {detail.formulas.length > 0 && (
        <section aria-label="Saved formulas" className="space-y-2">
          <h6 className="font-medium">Saved formulas</h6>
          <p className="text-xs text-muted-foreground">
            {session
              ? "Definitions from this run's workflow version"
              : 'Definitions from this workflow'}
            {detail.mode ? ` · configured mode: ${detail.mode}` : ''}. Recorded execution is shown
            separately below.
          </p>
          {detail.formulas.map((formula, index) => (
            <div key={index} className="space-y-1 rounded-lg border bg-muted/20 p-3">
              {(formula.label || formula.resultKey) && (
                <p className="font-medium">
                  {formula.label ?? formula.resultKey}
                  {formula.label && formula.resultKey && formula.label !== formula.resultKey
                    ? ` · ${formula.resultKey}`
                    : ''}
                  {formula.unit ? ` (${formula.unit})` : ''}
                </p>
              )}
              {formula.expression ? (
                <pre className="whitespace-pre-wrap break-words text-xs">{formula.expression}</pre>
              ) : (
                <>
                  {formula.operation && (
                    <p className="text-xs">
                      Operation: <code>{formula.operation}</code>
                    </p>
                  )}
                  {formula.operands !== undefined && (
                    <div className="text-xs">
                      Operands: <ReadableData value={formula.operands} />
                    </div>
                  )}
                </>
              )}
              {formula.description && (
                <p className="text-xs text-muted-foreground">{formula.description}</p>
              )}
            </div>
          ))}
        </section>
      )}
      {detail.sections.map((section) => (
        <section key={section.key} aria-label={section.label} className="space-y-2">
          <h6 className="font-medium">{section.label}</h6>
          <ReadableData value={section.value} />
        </section>
      ))}
      {block.code?.body && (
        <section aria-label="Saved block code" className="space-y-2">
          <h6 className="font-medium">Saved block code</h6>
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded border p-3 text-xs">
            {block.code.body}
          </pre>
        </section>
      )}
      <section
        aria-label="Recorded execution"
        className="space-y-2 border-t pt-3"
        data-result-state={detail.state}
      >
        <h6 className="font-medium">Recorded execution</h6>
        {detail.state === 'missing' && (
          <p className="text-xs text-muted-foreground">
            No recorded result yet. Run this block when its inputs are ready.
          </p>
        )}
        {detail.state === 'unavailable' && (
          <p role="status">The stored result does not match this block and cannot be displayed.</p>
        )}
        {detail.state === 'previous' && (
          <p role="status" className="text-amber-700">
            Previous result — rerun before using it. Its inputs, result and evidence below belong to
            the previous calculation.
          </p>
        )}
        {detail.state === 'failed' && (
          <p role="status" className="text-amber-700">
            This attempt {result?.status === 'skipped' ? 'was skipped' : 'failed'}. Any recorded
            output below is diagnostic information.
          </p>
        )}
        {result && (
          <>
            <p className="break-words text-xs text-muted-foreground">
              Recorded status: {result.status.replaceAll('_', ' ')} · {result.completedAt}
            </p>
            {[...result.errors, ...result.warnings].map((message, index) => (
              <p key={index} className="text-amber-700">
                {message}
              </p>
            ))}
            <h6 className="font-medium">Recorded input</h6>
            {result.input !== undefined ? (
              <ReadableData value={result.input} />
            ) : (
              <p className="text-xs text-muted-foreground">
                Input was not recorded for this attempt.
              </p>
            )}
            <h6 className="font-medium">Recorded result</h6>
            <DocumentExtractionEvidence value={result.output.extractions} />
            <ReadableData value={presentToolOutput(result, block)} />
            {detail.trace !== undefined && (
              <>
                <h6 className="font-medium">Recorded calculation trace</h6>
                <ReadableData value={detail.trace} />
              </>
            )}
            {!!result.inputTransfers?.length && (
              <>
                <h6 className="font-medium">Recorded input transfers</h6>
                <ReadableData value={result.inputTransfers} />
              </>
            )}
            {(result.evidenceRefs.length > 0 || result.sourceTrace.length > 0) && (
              <>
                <h6 className="font-medium">Recorded source evidence</h6>
                {result.evidenceRefs.length > 0 && <ReadableData value={result.evidenceRefs} />}
                {result.sourceTrace.length > 0 && <ReadableData value={result.sourceTrace} />}
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}
