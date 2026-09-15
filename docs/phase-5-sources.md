# Phase 5 — Sources, retrieval and provenance

Phase 5 implements the confirmed context and retention policies in D-03 and D-05.
Agent write grants were deferred to Phase 6 and are now implemented. The final
Sources and Connections navigation remains Phase 7 work.

## Ownership and contracts

The source core package owns portable source identity, lifecycle transitions,
retrieval policy and evidence. It has no React, Express, database, storage,
connector or model dependency. The API adapts Postgres rows and provider results
to these contracts; the chat UI renders the resulting evidence.

Every retrieved passage identifies:

- source ID, kind, label, revision, optional content fingerprint and client scope;
- the document chunk locator and similarity;
- whether it came from an explicit selection or relevant authorized discovery;
- retrieval time and a stable citation ID.

The default policy is selected-and-authorized. Explicit selections rank first.
Selected-only is available for narrow work. Both policies enforce workspace,
client and active-lifecycle scope. An unavailable embedding provider or failed
query returns an explicit unavailable result instead of an empty success.

## Lifecycle and retention

Active sources can be archived or moved to recovery by Owners and Editors.
Restoration and permanent purge require an Owner. Retrieval accepts active
sources only. Restored sources return outside the general Library until a user
explicitly adds them back.

Permanent purge deletes content pointers, extracted details, chunks and queued
ingestion only after object deletion succeeds. If storage deletion fails, the
source remains recoverable and the API reports failure. A purged tombstone keeps
the source ID, label, revision, content hash and lifecycle timestamps so older
citations remain interpretable without retaining source content.

Migration 0002_source_lifecycle.sql adds lifecycle, revision, hash and retention
fields. Applied migrations remain immutable and startup uses the managed migrator.

## Connector behavior

HTTP JSON source reads retry bounded transient GET failures and record the attempt
count. Invalid JSON, oversized responses and ordinary client errors fail without
retry. POST requests are not retried automatically because the remote operation
may not be idempotent. Route responses include a secret-free operation receipt
with operation ID, status, attempts, observation time and retryability.

## Verification

`pnpm run verify` passes on the final tree: contract and architecture checks,
formatting, all TypeScript projects, 32 unit cases and 8 workflow-core cases.
The focused unit coverage includes selection ordering, selected-only behavior,
workspace/client/lifecycle filtering, role transitions, stable citations,
transient retries and invalid-response handling.

The isolated Postgres/API suite passed all 31 cases, followed by a 16-case focused
access rerun after the final lifecycle changes. It covers migration integrity,
Viewer denial, Editor archive/delete access, Owner restore/purge access,
cross-workspace denial, recoverable deletion, provenance tombstones, connector
receipts and explicit retrieval unavailability. Two isolated browser cases verify
the Owner recovery controls and visible repository failure. Production API and web
builds pass, and the local database reports all three migrations applied.
