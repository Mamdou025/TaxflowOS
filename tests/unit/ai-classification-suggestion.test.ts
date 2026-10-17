import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runClassificationSuggestion } from '../../lib/workflow-executors/src/execution/blocks/ai/classification-suggestion/run';
import type { ToolExecutionContext } from '../../lib/workflow-executors/src/execution/runtime/types';
import type { WorkflowBlock } from '../../lib/workflow-contracts/src/domain/workflow-types';

function makeBlock(config: Record<string, unknown>): WorkflowBlock {
  return { id: 'ai-block-1', config } as unknown as WorkflowBlock;
}

function makeContext(opts: {
  config: Record<string, unknown>;
  unmatchedRows?: unknown;
  lowConfidenceRows?: unknown;
}): ToolExecutionContext {
  const inputsByRole: Record<string, unknown[]> = {};
  if (opts.unmatchedRows !== undefined) inputsByRole.unmatched_rows = [opts.unmatchedRows];
  if (opts.lowConfidenceRows !== undefined)
    inputsByRole.low_confidence_rows = [opts.lowConfidenceRows];
  return {
    block: makeBlock(opts.config),
    config: opts.config,
    inputsByRole,
    runId: 'run-1',
    startedAt: new Date().toISOString(),
  };
}

const ROWS = [
  { rowId: 'r1', description: 'Coupon receipts on offshore bonds' },
  { rowId: 'r2', description: 'Interest expense on intercompany loan' },
];

test('neither role connected is an error, not an invented classification', () => {
  const result = runClassificationSuggestion(makeContext({ config: {} }));
  assert.equal(result.status, 'error');
  assert.deepEqual(result.outputs.suggestions.suggestions, []);
  assert.match(result.errors[0], /Unmatched rows or Low-confidence rows/);
});

test('a connected rows input that yields nothing to review is success, not an error — the mapper classified everything', () => {
  const result = runClassificationSuggestion(
    makeContext({ config: {}, unmatchedRows: { unmatchedRows: [] } }),
  );
  assert.equal(result.status, 'success');
  assert.equal(result.errors.length, 0);
  assert.equal(result.outputs.suggestions.authoritative, true);
  assert.deepEqual(result.outputs.suggestions.suggestions, []);
});

test('rows present but nothing pinned yet produces a warning, not a guess', () => {
  const result = runClassificationSuggestion(
    makeContext({ config: {}, unmatchedRows: { unmatchedRows: ROWS } }),
  );
  assert.equal(result.status, 'warning');
  assert.equal(result.outputs.suggestions.authoritative, false);
  assert.deepEqual(result.outputs.suggestions.suggestions, []);
  assert.match(result.warnings[0], /No AI suggestions are pinned/);
});

test('low-confidence rows reach the block through their own role, independent of unmatched rows', () => {
  const result = runClassificationSuggestion(
    makeContext({ config: {}, lowConfidenceRows: { lowConfidenceRows: ROWS } }),
  );
  assert.equal(result.status, 'warning');
  assert.match(result.warnings[0], /No AI suggestions are pinned/);
});

test('pinned-but-unaccepted proposal is needs_review and splits by the configured threshold', () => {
  const config = {
    confidenceThreshold: 0.8,
    proposal: {
      generatedAt: '2026-01-01T00:00:00.000Z',
      model: 'anthropic/claude-sonnet-5',
      suggestions: [
        {
          rowRef: 'r1',
          suggestedCategoryId: 'interestIncome',
          confidence: 0.9,
          rationale: 'bond coupons are interest',
          matchedSignal: 'coupon receipts',
        },
        {
          rowRef: 'r2',
          suggestedCategoryId: null,
          confidence: 0.6,
          rationale: 'expense not income',
          matchedSignal: '',
        },
      ],
    },
  };
  const result = runClassificationSuggestion(
    makeContext({ config, unmatchedRows: { unmatchedRows: ROWS } }),
  );
  assert.equal(result.status, 'needs_review');
  assert.equal(result.outputs.suggestions.authoritative, false);
  assert.equal(result.outputs.suggestions.accepted, false);
  assert.equal(result.outputs.suggestions.highConfidenceCount, 1);
  assert.equal(result.outputs.suggestions.lowConfidenceCount, 1);
  assert.equal(result.outputs.suggestions.highConfidenceSuggestions[0].rowRef, 'r1');
  assert.equal(result.outputs.suggestions.lowConfidenceSuggestions[0].rowRef, 'r2');
});

test('accepting the proposal makes it authoritative and clears the review warning', () => {
  const config = {
    confidenceThreshold: 0.8,
    proposalAccepted: true,
    proposalAcceptedAt: '2026-01-02T00:00:00.000Z',
    proposal: {
      generatedAt: '2026-01-01T00:00:00.000Z',
      model: 'anthropic/claude-sonnet-5',
      suggestions: [
        {
          rowRef: 'r1',
          suggestedCategoryId: 'interestIncome',
          confidence: 0.9,
          rationale: 'bond coupons are interest',
          matchedSignal: 'coupon receipts',
        },
        {
          rowRef: 'r2',
          suggestedCategoryId: null,
          confidence: 0.85,
          rationale: 'expense not income',
          matchedSignal: '',
        },
      ],
    },
  };
  const result = runClassificationSuggestion(
    makeContext({ config, unmatchedRows: { unmatchedRows: ROWS } }),
  );
  assert.equal(result.status, 'success');
  assert.equal(result.outputs.suggestions.authoritative, true);
  assert.equal(result.outputs.suggestions.accepted, true);
  assert.equal(result.warnings.length, 0);
});

test('an accepted proposal that references a row no longer present downgrades to warning, not silent success', () => {
  const config = {
    confidenceThreshold: 0.5,
    proposalAccepted: true,
    proposal: {
      generatedAt: '2026-01-01T00:00:00.000Z',
      model: 'anthropic/claude-sonnet-5',
      suggestions: [
        {
          rowRef: 'r1',
          suggestedCategoryId: 'interestIncome',
          confidence: 0.9,
          rationale: 'bond coupons are interest',
          matchedSignal: 'coupon receipts',
        },
        {
          rowRef: 'row-that-no-longer-exists',
          suggestedCategoryId: 'dividends',
          confidence: 0.9,
          rationale: 'stale',
          matchedSignal: '',
        },
      ],
    },
  };
  const result = runClassificationSuggestion(
    makeContext({ config, unmatchedRows: { unmatchedRows: [ROWS[0]] } }),
  );
  assert.equal(result.status, 'warning');
  assert.equal(result.outputs.suggestions.authoritative, true);
  assert.match(result.warnings.join(' '), /no longer present/);
});
