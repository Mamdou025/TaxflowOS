# Virtual worker run — Move blocks around + test each block’s output

- **Persona:** `builder`
- **Base URL:** http://localhost:5173
- **Model:** anthropic/claude-opus-4-8 (effort: medium)
- **Steps used:** 40/40
- **Started:** 2026-07-30T19:38:02.294Z
- **Finished:** 2026-07-30T19:40:53.895Z
- **Findings:** 1  ·  **Captured errors:** 8

## Agent summary

_(no explicit summary — the run ended on the step budget)_

## Findings

### ⚪ LOW (1)

- **[#1] Nested-button hydration error when opening the "Compute FAPI" block config overlay**  _(crash)_
  - On /workflows-hub → FAPI Calculation (portfolio) → Build, clicking the "Compute FAPI" node opens the ConfigurationOverlay (CalculationEngineWorkspace). The console logs a React DOM validation error: "In HTML, <button> cannot be a descendant of <button>. This will cause a hydration error." originating in the CalculationEngineWorkspace inside ConfigurationOverlay.
  - _Expected:_ A block's configuration overlay should render without invalid nested-button DOM / hydration errors.
  - _Screenshot:_ `finding-1.png`

## Captured browser errors

- `[network]` 404 GET http://localhost:5173/api/auth/get-session
- `[console]` Failed to load resource: the server responded with a status of 404 (Not Found)
- `[network]` 404 GET http://localhost:5173/api/auth/get-session
- `[console]` Failed to load resource: the server responded with a status of 404 (Not Found)
- `[network]` 404 GET http://localhost:5173/api/auth/get-session
- `[console]` Failed to load resource: the server responded with a status of 404 (Not Found)
- `[console]` In HTML, %s cannot be a descendant of <%s>.
This will cause a hydration error.%s <button> button 

  ...
    <ConfigurationOverlay overlayId="overlay-17...">
      <div className="flex h-[85...">
        <SmartOverlayHeader>
        <div className="flex min-h...">
          <CalculationEngineWorkspace block={{id:"pf-fap...", ...}} createTermRequest={0} disabled={false} edges={[...]} ...>
         … [truncated 1827 chars]
- `[console]` <%s> cannot contain a nested %s.
See this log for the ancestor stack trace. button <button>
