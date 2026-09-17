---
name: Post-merge dependency synchronization
description: Why managed artifact workflows need a generous post-merge setup timeout.
---

Keep the post-merge setup timeout large enough for a full frozen workspace install plus database synchronization before workflow reconciliation restarts services.

**Why:** A short timeout can kill dependency installation after manifests and the lockfile have merged. Reconciliation then starts the frontend successfully while the API build exits on unresolved newly added packages, making chat appear silently unavailable. A long-running validation workflow can also retain the API port after a repo change, causing the managed API restart to fail with `EADDRINUSE` while the frontend remains on its startup loader.

**How to apply:** When post-merge setup performs both dependency installation and schema synchronization, retain a multi-minute timeout and verify managed artifact readiness only after reconciliation finishes. If the managed API fails with `EADDRINUSE`, stop any validation workflow that launched its own web server before restarting the artifact-owned API.