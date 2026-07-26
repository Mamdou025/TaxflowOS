# Backend-Style Tool Modules

This folder holds local, backend-style block modules for Workflow Studio. It is not a server integration yet.

The contract is intentionally small:

- A block is the visual workflow object.
- A tool is the executable behavior behind a block.
- A run is the auditable result produced by executing a tool.

The first modules are local deterministic mocks for manual table Sources, keyword rule Sources, and Keyword Mapper Logic. Source modules emit immutable evidence/reference outputs. Logic modules transform or classify those outputs while preserving lineage back to the Source evidence.

The frontend runner still owns graph execution for now. The local registry adapts these backend-style modules into the existing UI-facing tool registry so canvas, inspector, runs, import/export, and runtime preview behavior remain unchanged.
