# Virtual worker run — Click everything — find buttons that go nowhere

- **Persona:** `deadclick`
- **Base URL:** http://localhost:5173
- **Model:** anthropic/claude-opus-4-8 (effort: medium)
- **Steps used:** 70/70
- **Started:** 2026-07-30T19:29:25.181Z
- **Finished:** 2026-07-30T19:34:02.353Z
- **Findings:** 9  ·  **Captured errors:** 14

## Agent summary

Also the "Assistant" button is disabled on this page. Let me test the FAPI action buttons: Import, Builder, Sources, Export.

## Findings

### 🟠 HIGH (1)

- **[#5] Workflows hub "New workflow" button does nothing**  _(dead-button)_
  - On the Workflows hub (/workflows-hub, sidebar), clicking "New workflow" twice produced no navigation, dialog, or content change. This is a primary creation action.
  - _Expected:_ It should open the builder with a new/blank workflow or a template picker.
  - _Actual:_ No visible change on either click.
  - _Screenshot:_ `finding-5.png`

### 🟡 MEDIUM (7)

- **[#1] "Open the dashboard" quick action creates a chat instead of opening the dashboard**  _(ux)_
  - On the home page, clicking the "Open the dashboard" suggestion button created a new chat titled "Open the dashboard" instead of navigating to the dashboard page.
  - _Expected:_ Clicking "Open the dashboard" should navigate to /dashboard.
  - _Actual:_ A chat entry "Open the dashboard now" appeared in Recent chats; no navigation occurred.
  - _Screenshot:_ `finding-1.png`
- **[#2] Dashboard "Ask the assistant" button does nothing**  _(dead-button)_
  - On the Practitioner Dashboard for Northstar Inc., clicking "Ask the assistant" (top-right of the client header) twice produced no navigation, dialog, or content change.
  - _Expected:_ It should open/focus the Sina chat, ideally pre-scoped to the client.
  - _Actual:_ No visible change on either click.
  - _Screenshot:_ `finding-2.png`
- **[#3] Dashboard "Ask for a full review →" button does nothing**  _(dead-button)_
  - On the Practitioner Dashboard "At a glance" panel, clicking "Ask for a full review →" twice produced no navigation, dialog, or content change.
  - _Expected:_ It should trigger a chat/review request for the client's at-risk deliverables.
  - _Actual:_ No visible change on either click.
  - _Screenshot:_ `finding-3.png`
- **[#4] Builder "Ask Scope on this page" button does nothing**  _(dead-button)_
  - On /builder, clicking "Ask Scope on this page" twice produced no navigation, dialog, or content change.
  - _Expected:_ It should open the Scope chat panel scoped to the builder page.
  - _Actual:_ No visible change on either click.
  - _Screenshot:_ `finding-4.png`
- **[#6] T1134 "Generate Client Link" button does nothing**  _(dead-button)_
  - In the T1134 Client Portal View, clicking "Generate Client Link" twice produced no visible change. A shareable link is already shown statically above it, but the generate button gives no feedback (e.g. copy confirmation or new token).
  - _Expected:_ It should generate/regenerate or copy the secure client link and show a confirmation.
  - _Actual:_ No visible change on either click.
  - _Screenshot:_ `finding-6.png`
- **[#7] T1134 client confirmation "Confirmed" buttons do nothing**  _(dead-button)_
  - In the T1134 Client Portal View, the "Confirmed" button under "Questions awaiting client confirmation" produces no visible change on repeated clicks — no state change, checkmark, or item removal.
  - _Expected:_ Clicking "Confirmed" should mark that confirmation question as answered/resolved.
  - _Actual:_ No visible change on either click.
  - _Screenshot:_ `finding-7.png`
- **[#9] FAPI worksheet FAT input field does not accept edits / does not recalc**  _(ux)_
  - On /fapi, I typed 1000.00 into the "Foreign accrual tax paid" (FAT) textbox and pressed Enter. The field reverted to 100.00 and the Results summary (FAT deduction 190, Net FAPI 24,810) did not change.
  - _Expected:_ Editing the FAT input should update the field and recompute the FAT deduction and Net FAPI.
  - _Actual:_ Value reverted to 100.00; no recalculation occurred.
  - _Screenshot:_ `finding-9.png`

### ❓ QUESTION (1)

- **[#8] FAPI worksheet FAT deduction uses a relevant tax factor of 1.9 (FAT 100 → deduction 190)**  _(ai-accuracy)_
  - On /fapi, with Foreign accrual tax paid (FAT) = 100.00 USD, the "FAT deduction" line shows 190.00 USD (256.50 CAD @ 1.35). This implies a relevant tax factor (RTF) of 1.9 under s.91(4). The RTF for a corporation is 1 divided by its general corporate income tax rate; since 2016 that is 1/0.3867 ≈ 2.585, and historically it has been values like 4, 3, 2.2 — but not 1.9. Net FAPI (24,810 = 25,000 − 190) is internally consistent, but the 1.9 multiplier should be verified against the intended tax year/jurisdiction, as an incorrect RTF over- or under-states the s.91(4) deduction.
  - _Expected:_ FAT deduction = FAT × relevant tax factor, using the correct RTF for the tax year (≈2.585 for a corporation post-2016).
  - _Actual:_ FAT deduction = 100 × 1.9 = 190, implying RTF = 1.9.
  - _Screenshot:_ `finding-8.png`

## Captured browser errors

- `[network]` 500 POST http://localhost:5173/api/chat/threads/k1jgiwx584s5joud53jqp/messages
- `[console]` Failed to load resource: the server responded with a status of 500 (Internal Server Error)
- `[network]` FAILED POST http://localhost:5173/api/copilotkit (net::ERR_ABORTED)
- `[network]` FAILED POST http://localhost:5173/api/copilotkit (net::ERR_ABORTED)
- `[network]` 404 GET http://localhost:5173/api/auth/get-session
- `[console]` Failed to load resource: the server responded with a status of 404 (Not Found)
- `[network]` 404 GET http://localhost:5173/api/auth/get-session
- `[console]` Failed to load resource: the server responded with a status of 404 (Not Found)
- `[network]` FAILED POST http://localhost:5173/api/copilotkit (net::ERR_ABORTED)
- `[network]` FAILED POST http://localhost:5173/api/copilotkit (net::ERR_ABORTED)
- `[network]` 404 GET http://localhost:5173/api/auth/get-session
- `[console]` Failed to load resource: the server responded with a status of 404 (Not Found)
- `[network]` 404 GET http://localhost:5173/api/auth/get-session
- `[console]` Failed to load resource: the server responded with a status of 404 (Not Found)
