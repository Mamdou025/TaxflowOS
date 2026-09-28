---
name: Post-merge dependency synchronization
description: Why managed artifact workflows need a generous post-merge setup timeout.
---

Keep the post-merge setup timeout large enough for a full frozen workspace install plus database synchronization before workflow reconciliation restarts services.

**Why:** A short timeout can kill dependency installation after manifests and the lockfile have merged. Reconciliation then starts the frontend successfully while the API build exits on unresolved newly added packages, making chat appear silently unavailable. Exact Node/pnpm patch pins imported from another environment can also block every Replit-managed workflow before its package script starts.

**How to apply:** When post-merge setup performs both dependency installation and schema synchronization, retain a multi-minute timeout and verify managed artifact readiness only after reconciliation finishes. On Replit, constrain engines to the supported major line rather than an unavailable patch version, while keeping stricter Docker/CI checks separate.