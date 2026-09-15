# Modular Browser Tool Executors

This folder owns the modular browser executors used by Workflow Studio previews. It
does not provide durable server execution.

The contract is intentionally small:

- A block is the visual workflow object.
- A tool is the executable behavior behind a block.
- A run is the auditable result produced by executing a tool.

Source modules emit immutable evidence/reference outputs. Logic modules transform
or classify those outputs while preserving lineage back to the Source evidence.

The frontend runner owns browser-preview graph execution. The UI adapter maps each
module into the existing viewer result shape so canvas, inspector, import/export and
saved-preview behavior remain compatible. A tool ID has one implementation owner;
registry composition rejects duplicate modular and legacy definitions.
