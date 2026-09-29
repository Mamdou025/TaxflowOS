import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { companionCapabilities, delegatedPrompt } from './delegation.mjs';

function payload() {
  return {
    message: 'Find the workbook.',
    conversationId: randomUUID(),
    threadId: 'sina-thread-1',
    platformOrigin: 'https://inscope.example',
    delegation: {
      taskType: 'external_file',
      target: 'https://drive.google.com/drive/my-drive',
      objective: 'Find the workbook.',
      expectedOutput: 'The exact file location and source details.',
      reasonNoPlatformTool: 'The file is accessible only through the signed-in computer.',
    },
  };
}

test('the bridge advertises versioned delegation and only supported desktop capture', () => {
  assert.ok(companionCapabilities('win32').includes('sina-delegation-v1'));
  assert.ok(companionCapabilities('win32').includes('desktop-screenshots-v1'));
  assert.equal(companionCapabilities('linux').includes('desktop-screenshots-v1'), false);
});

test('delegated external tasks receive the Sina-owned boundaries and exact task data', () => {
  const input = payload();
  const prompt = delegatedPrompt(input, 'https://worker.example');
  assert.match(prompt, /Sina owns user conversation/);
  assert.match(prompt, /Do not open Inscope/);
  assert.match(prompt, /A local file path is not an uploaded Source/);
  assert.match(prompt, /https:\/\/worker\.example/);
  assert.match(prompt, /https:\/\/inscope\.example/);
  assert.ok(prompt.endsWith(JSON.stringify(input.delegation, null, 2)));
});

test('untyped tasks, mismatching objectives and either platform origin are rejected', () => {
  for (const modify of [
    (value) => delete value.delegation,
    (value) => delete value.threadId,
    (value) => delete value.platformOrigin,
    (value) => (value.message = 'A different request'),
    (value) => (value.delegation.taskType = 'workflow'),
    (value) => (value.delegation.target = 'https://inscope.example/workflows'),
    (value) => (value.delegation.target = 'https://worker.example/api/workflows'),
    (value) => (value.delegation.target = '/api/workflow-runs'),
  ]) {
    const input = payload();
    modify(input);
    assert.throws(() => delegatedPrompt(input, 'https://worker.example'));
  }
});
