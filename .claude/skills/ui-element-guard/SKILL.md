---
name: ui-element-guard
description: Check-before-you-change discipline for TaxflowOS's chat-hub UI and workflow-block elements. Use this BEFORE editing any file that is (or might be) a documented chat-surface component, workflow-session surface, block executor, or CopilotKit/assistant-ui frontend-tool renderer in artifacts/ai-workflow-builder or lib/workflow-executors — even for requests that sound like a small styling tweak, a bugfix, or "just add a button here." TaxflowOS is actively developed by two different AI agents (Codex and Claude) plus the user, and small UI edits have repeatedly drifted from the agreed chat-is-the-hub design without anyone noticing until later. Also trigger on requests like "change how X looks/behaves in chat", "add a new block", "update the workflow panel", "make the composer do Y" — even when the user doesn't say "registry" or "contract" by name.
---

# UI element guard

TaxflowOS's whole reason for adopting assistant-ui was to fix chat UI/UX
problems and make Chat the hub where a user can do everything — without the
chat ever feeling like a dashboard bolted into a conversation. That's an
easy thing to erode one small change at a time, especially with two AIs
working on the same repo across different sessions. This skill exists to
catch drift before it ships, not to slow down every edit.

## When this applies

Any change touching:
- `artifacts/ai-workflow-builder/src/features/assistant/**` (chat runtime, composer, Scope bar, Mkoro UI)
- `artifacts/ai-workflow-builder/src/features/workflows-hub/**` (workflow session panel, step timelines, FAPI worksheet)
- `artifacts/ai-workflow-builder/src/features/genui/**` (generative UI)
- `lib/workflow-executors/**` (block executors — these define what a workflow block *does*, which is part of its contract even though it's not UI)
- Any frontend-tool renderer registered in `use-assistant.tsx` (result cards, receipts, choice lists)

It does not apply to backend-only changes (routes, migrations, queue/worker
internals) unless they change what a documented block or UI element
promises to do.

## Procedure

1. **Identify the element.** Which file(s) are you about to change, and does
   one of them appear in [`docs/chat-hub-registry.md`](../../../docs/chat-hub-registry.md)?

2. **If it's listed**, read its Contract column. Then use judgment, not a
   blanket stop:
   - If the requested change clearly stays inside the contract (e.g. a copy
     tweak, a color, a bugfix that restores documented behavior), say in one
     line what the contract is and that the change respects it, then proceed.
   - If the change would alter the contract (e.g. making `SurfaceEmbed` mount
     a new full page, widening Scope context beyond company/year/sources/workflow,
     forking `WorkflowSessionPanel` into a separate chat-only copy, changing
     what a block executor computes), stop and ask the user explicitly whether
     that's the intent — don't assume a request to "fix" something licenses
     changing what it's supposed to do. This is exactly the kind of decision
     `docs/product/decisions.md` exists to record; if the user confirms, note
     that a decision may need recording there too.

3. **If it's not listed**, proceed with the task — don't block on missing
   documentation — but once you understand what the element does, add a row
   to the registry (file path, one-line purpose, contract) and mention you
   did so. Draft the contract yourself from the diff/intent and let the user
   correct it rather than leaving it undocumented.

4. **After the change**, if a contract was deliberately changed, update that
   row in the registry in the same turn. A stale registry is worse than none
   — don't let this become a second source of truth that nobody maintains.

## Why ask instead of just proceeding

The cost of asking is one extra message. The cost of not asking is a chat
surface that quietly grows a new full-page panel, or a Scope bar that starts
silently loading company-wide data, discovered three sessions later by
someone (possibly Codex, possibly the user) who now has to figure out
whether it was intentional. Given how this repo is actually being worked on
— two agents, overlapping sessions, fast iteration — that discovery cost is
real and has already happened once (see the registry's "Known smells"
section, several of which exist because a compact UI was never built).

## What this skill is not

It's not a gate on every single edit — fixing a typo, adjusting spacing, or
implementing something the user just described in detail doesn't need a
round-trip if the contract clearly isn't in play. The point is catching the
cases where a change *looks* small but actually moves what an element is
supposed to do or own.
