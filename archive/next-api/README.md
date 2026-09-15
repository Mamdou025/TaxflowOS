# Historical Next.js API handlers

These handlers were under `artifacts/ai-workflow-builder/src/app/api` before the
Vite/Express maintainability refactor. The active frontend has no imports of these
handlers, and the Express server mounts its own routes. They are retained as
historical reference, outside the active source tree and TypeScript projects.

For fixes, use `artifacts/api-server/src/routes`. Importing this archive from active
code is prohibited. A familiar endpoint name here does not mean it exists on the
live Express server. Relative imports and Next.js conventions in these files are
historical and are not a supported application entry point.
