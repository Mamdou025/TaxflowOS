---
name: app-state-snapshot
description: Refresh understanding of TaxflowOS's current architecture, recently shipped initiatives, open product decisions, and known debt — without redoing a full from-scratch repo audit. Use this at the start of a TaxflowOS session if noticeable time has passed since the last one, whenever the user asks "what's changed", "what's the current state", "catch me up", "what has Codex been doing", or before giving architectural advice or making changes that depend on knowing what shipped recently. Also use it mid-session if you notice uncommitted changes or doc timestamps suggesting Codex has been working on the repo concurrently.
---

# App state snapshot

Codex (a separate AI, working under `AGENTS.md`) ships changes to this repo
between Claude sessions, sometimes heavily. Re-running a full audit every
time (reading dozens of docs, spawning several research agents) is wasteful
and slow; assuming memory from a prior session is still accurate is risky —
on 2026-10-10 a gap of ~2.5 months turned out to mean 1,560 files changed.
This skill is the lightweight middle path.

## Procedure

1. **Find the last checkpoint.** Check memory for the most recent
   `taxflowos-*` project memory (e.g. `taxflowos-architecture-2026-10`) and
   its date. That date is your baseline.

2. **Measure the gap, don't assume its size.**
   ```
   git log --since="<baseline date>" --oneline | wc -l
   git diff --shortstat <commit at or before baseline date> HEAD
   ```
   A handful of commits and a few dozen files changed means a light refresh
   is enough. Dozens of commits or four-digit file counts means treat it like
   the original deep audit (see `taxflowos-architecture-2026-10` memory for
   how that was structured) — don't shortcut a change of that size.

3. **For a light refresh**, read directly rather than spawning agents:
   - `docs/ARCHITECTURE.md` and `docs/FUNCTIONALITY.md` in full — Codex keeps
     both current as of its most recent work, so diff them mentally against
     what memory says.
   - `docs/product/decisions.md` — skim for anything newly confirmed or newly
     added to the deferred/pending sections since the baseline.
   - `git log --since=<baseline> --oneline` — skim commit subjects and any
     new `docs/*.md` filenames for named initiatives memory doesn't know about
     yet.

4. **Check `git status`.** Uncommitted files with recent timestamps are a
   signal Codex's session is live or just ended — see the
   `codex-concurrent-sessions` memory for how to handle that (don't touch,
   don't run heavy `pnpm run verify`/build commands that could race it).

5. **Update memory, don't fork it.** Edit the existing `taxflowos-architecture-2026-10`,
   `taxflowos-known-debt-2026-10`, and `taxflowos-open-decisions-2026-10`
   files in place — update facts that changed, bump the "verified against"
   date — rather than creating a new dated file each time this skill runs.
   Memory should accumulate the current truth, not a pile of similarly-named
   snapshots from different weeks. Rename a file only if its scope genuinely
   outgrows its name.

6. **Report briefly.** Tell the user what changed since the last check and
   anything that needs their attention (new open decisions, new debt, a
   security flag) — not a full report, unless the gap was large enough to
   warrant one per step 2.

## Why this exists

The full audit (research agents reading dozens of docs, mapping git history
in detail) is the right tool for a large, unknown gap. It is the wrong tool
for "it's been a day and Codex landed three commits" — using it every time
would waste the user's time and tokens on work this lighter procedure
already covers.
