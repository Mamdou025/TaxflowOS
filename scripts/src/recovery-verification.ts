import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  WORKFLOW_BACKUP_FORMAT,
  validateWorkflowLibrary,
  workflowBackup,
} from '@workspace/workflow-contracts/library';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const fixtureDirectory = path.join(root, 'tests/fixtures/backups');
const outputDirectory = path.join(root, 'test-results/recovery');

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

async function defaultInputs(): Promise<string[]> {
  return (await fs.readdir(fixtureDirectory))
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => path.join(fixtureDirectory, name));
}

async function verify(inputPath: string) {
  const bytes = await fs.readFile(inputPath, 'utf8');
  const parsed: unknown = JSON.parse(bytes);
  const sourceFormat =
    parsed && typeof parsed === 'object' && 'format' in parsed
      ? String(parsed.format)
      : 'legacy-bare-library';
  const library = validateWorkflowLibrary(parsed);
  const normalized = JSON.stringify(workflowBackup(library), null, 2);
  const restored = validateWorkflowLibrary(JSON.parse(normalized));
  assert.deepEqual(restored, library);
  const workflows = Object.values(library);

  return {
    input: path.relative(root, inputPath).replaceAll('\\', '/'),
    sourceFormat,
    restoredFormat: WORKFLOW_BACKUP_FORMAT,
    inputSha256: sha256(bytes),
    restoredSha256: sha256(normalized),
    workflowCount: workflows.length,
    versionCount: workflows.reduce((total, item) => total + item.versions.length, 0),
    runCount: workflows.reduce((total, item) => total + item.runs.length, 0),
  };
}

const supplied = process.argv.slice(2);
const inputs = supplied.length
  ? supplied.map((input) => path.resolve(process.cwd(), input))
  : await defaultInputs();

if (!inputs.length) throw new Error('No workflow backup fixtures were found.');

const backups = [];
for (const input of inputs) backups.push(await verify(input));

const report = {
  format: 'taxflow-recovery-verification-v1',
  verifiedAt: new Date().toISOString(),
  backups,
};
await fs.mkdir(outputDirectory, { recursive: true });
const reportPath = path.join(outputDirectory, 'workflow-backups.json');
await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(
  `Verified ${backups.length} workflow backup${backups.length === 1 ? '' : 's'}; report: ${path.relative(root, reportPath)}`,
);
