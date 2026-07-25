---
name: CopilotKit Fast Refresh cascade
description: Rule for keeping React.lazy-loaded component trees free of non-component exports to prevent Vite HMR cascade spinners.
---

# CopilotKit Fast Refresh cascade

## The rule
Any file loaded via `React.lazy()` — or imported by such a file — must export ONLY React components. Non-component named exports (plain objects, constants, CSSProperties, etc.) cause Vite's Fast Refresh to mark the file "incompatible", which makes every HMR update propagate as a full module invalidation instead of an in-place component swap. This resets `React.lazy`'s cache and re-suspends the lazy boundary on every edit.

**Why:** Vite's Fast Refresh requires that every export from a component file is itself a component. When a non-component export exists in the file (or transitively in a file the lazy-loaded module imports), Vite marks the entire file incompatible and invalidates it on every change — even unrelated edits. The lazy boundary then re-suspends.

**How to apply:** Before adding a named export to any `.tsx` file that is (a) itself loaded by `React.lazy`, or (b) imported by a file loaded by `React.lazy`, check whether the export is a React component. If not, move it to a plain `.ts` file with no JSX. In this project: `chat-theme.ts` holds the `CHAT_THEME` constant so `assistant-thread.tsx` stays component-only.

**Detection signals:**
- Vite console: `"Could not Fast Refresh ('X' export is incompatible)"`
- PageLoader spinner persists across HMR updates but clears after workflow restart
- API server logs show routes being called (proving the component mounts on cold load) but the spinner re-appears on the next save
