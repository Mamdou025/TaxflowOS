import type { Page, TestInfo } from '@playwright/test';
import { expect } from '../../e2e/workflow-audit-isolation';
import type { WorkflowLibrary } from '../../lib/workflow-contracts/src/library-types';

type Observation = {
  revision: number;
  paused: boolean;
  observedAt: number;
  resumeVisible: boolean;
  reviewed: string[];
  approvedAt?: string;
  results: Record<
    string,
    {
      status: string;
      errors: string[];
      warnings: string[];
      output: {
        unmatchedRows?: unknown[];
        mappedRows?: Array<{ account: string; categoryId: string; amount: number }>;
        excludedRowCount?: number;
        calculatedResults?: Record<string, number>;
        computedValues?: Record<string, number>;
      };
    }
  >;
};
declare global {
  interface Window {
    fapiVerification: {
      readLibrary(): WorkflowLibrary;
      readSession(entryId: string, progressOnly: boolean): Observation;
    };
  }
}

/** Load once before Resume; polling must not await Vite module requests. */
export async function preloadFapiObserver(page: Page) {
  await page.evaluate(async () => {
    const { rawWorkflowBackup } = await import('/src/features/workflows-hub/workflow-library.ts');
    const { parseSharedJSON } = await import('/src/shared/workflow-engine/shared-json.ts');
    const readLibrary = () => {
      const raw = rawWorkflowBackup();
      if (!raw) throw new Error('The test workflow has no stored library.');
      return parseSharedJSON(raw) as WorkflowLibrary;
    };
    window.fapiVerification = {
      readLibrary,
      readSession(entryId, progressOnly) {
        const session = readLibrary()[entryId].sessions.at(-1)!;
        return {
          revision: session.revision,
          paused: session.paused,
          observedAt: Date.now(),
          resumeVisible: [...document.querySelectorAll('button')].some(
            (button) => button.textContent?.trim() === 'Resume workflow',
          ),
          reviewed: progressOnly ? [] : session.reviewed,
          approvedAt: progressOnly ? undefined : session.approvedAt,
          results: progressOnly
            ? {}
            : Object.fromEntries(
                Object.entries(session.results).map(([id, result]) => [
                  id,
                  {
                    status: result.status,
                    errors: result.errors,
                    warnings: result.warnings,
                    output: {
                      unmatchedRows: result.output.unmatchedRows,
                      mappedRows: Array.isArray(result.output.mappedRows)
                        ? result.output.mappedRows.map((row) => ({
                            account: row.account,
                            categoryId: row.categoryId,
                            amount: row.amount,
                          }))
                        : undefined,
                      excludedRowCount: Array.isArray(result.output.excludedRows)
                        ? result.output.excludedRows.length
                        : undefined,
                      calculatedResults: result.output.calculatedResults,
                      computedValues: result.output.computedValues,
                    },
                  },
                ]),
              ),
        } as Observation;
      },
    };
  });
}

export const readFapiSession = (page: Page, entryId: string, progressOnly = false) =>
  page.evaluate(
    ({ entryId, progressOnly }) => window.fapiVerification.readSession(entryId, progressOnly),
    { entryId, progressOnly },
  );

/** Independent synchronous DOM probe makes an unresponsive app fail visibly. */
export async function waitForFapiPause(
  page: Page,
  info: TestInfo,
  entryId: string,
  priorRevision: number,
  label: string,
) {
  const observations: Array<Record<string, unknown>> = [];
  try {
    await expect
      .poll(
        async () => {
          const started = Date.now();
          const observation: Record<string, unknown> = { requestedAt: started };
          observations.push(observation);
          const dom = await page.evaluate(() => ({
            title: document.title,
            observedAt: Date.now(),
          }));
          Object.assign(observation, { dom, domElapsedMs: Date.now() - started });
          const current = await readFapiSession(page, entryId, true);
          Object.assign(observation, current, { elapsedMs: Date.now() - started });
          return current.revision > priorRevision && current.paused;
        },
        { timeout: 30000 },
      )
      .toBe(true);
  } finally {
    await info.attach(`session-progress-${label}`, {
      body: JSON.stringify(observations),
      contentType: 'application/json',
    });
  }
}
