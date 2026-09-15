import { logger } from './logger';
import { executeDurableWorkflow } from './workflow-runs/executor';
import {
  claimNextWorkflowRun,
  completeWorkflowRun,
  failWorkflowRun,
  reapStalledWorkflowRuns,
  requeueWorkflowRun,
  type ClaimedWorkflowRun,
} from './workflow-runs/queue';

function positiveEnv(name: string, fallback: number): number {
  const parsed = Number(process.env[name]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const CONCURRENCY = positiveEnv('WORKFLOW_RUN_CONCURRENCY', 1);
const POLL_MS = positiveEnv('WORKFLOW_RUN_POLL_MS', 500);
const STALL_MS = positiveEnv('WORKFLOW_RUN_STALL_MS', 10 * 60_000);
let started = false;
let inFlight = 0;
let lastReap = 0;

export function startWorkflowRunWorker(): void {
  if (started) return;
  if (process.env.WORKFLOW_RUN_WORKER === '0') {
    logger.info('Workflow run worker disabled (WORKFLOW_RUN_WORKER=0)');
    return;
  }
  started = true;
  const timer = setInterval(() => void tick(), POLL_MS);
  timer.unref?.();
  logger.info({ concurrency: CONCURRENCY, pollMs: POLL_MS }, 'Workflow run worker started');
  void tick();
}

async function tick(): Promise<void> {
  try {
    if (Date.now() - lastReap > 60_000) {
      lastReap = Date.now();
      const recovered = await reapStalledWorkflowRuns(STALL_MS);
      if (recovered) logger.warn({ recovered }, 'Recovered stalled workflow runs');
    }
    while (inFlight < CONCURRENCY) {
      const job = await claimNextWorkflowRun();
      if (!job) break;
      inFlight++;
      void run(job).finally(() => inFlight--);
    }
  } catch (err) {
    logger.error({ err }, 'Workflow run worker tick failed');
  }
}

async function run(job: ClaimedWorkflowRun): Promise<void> {
  const runLog = logger.child({
    operation: 'workflow.execute',
    workflowRunId: job.id,
    workspaceId: job.workspaceId,
    attempt: job.attempts,
  });
  try {
    const result = executeDurableWorkflow(job.definition, job.id);
    await completeWorkflowRun(job.id, result);
    runLog.info({ status: result.result.status }, 'Durable workflow run completed');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown workflow execution error';
    if (job.attempts < job.maxAttempts) {
      await requeueWorkflowRun(job.id, job.attempts, message);
      runLog.error({ err }, 'Workflow run threw; retry scheduled');
    } else {
      await failWorkflowRun(job.id, message);
      runLog.error({ err }, 'Workflow run threw; retries exhausted');
    }
  }
}
