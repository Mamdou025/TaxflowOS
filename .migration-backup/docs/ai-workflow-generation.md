# AI Workflow Generation

## What Is It?

A conversational interface where you describe a calculation in plain English and the app generates a workflow graph for you to review and run. Think of it as a "co-pilot" for building workflows — you state the intent, the AI drafts the structure, you verify and confirm.

**Example prompt:**
> "Take total sales by product, apply a 12% discount for items over $500, then roll up by region and fiscal quarter."

**What you get back:** a fully-wired workflow on the canvas — blocks connected in the right order, with the right field mappings — ready to inspect before running.

---

## How It Would Work

### 1. User Input
A chat input panel (sidebar or modal) where you type what you want to calculate. No special syntax — just plain language.

### 2. Prompt Construction
The app builds a prompt for Claude that includes:
- Your natural language request
- The full block catalog (block types, inputs, outputs, accepted field types)
- The connection rules from `workflow-rules.ts`
- Optionally: the current workflow state, so Claude can extend rather than replace

This gives Claude a strict "grammar" to work within — it can only generate blocks that actually exist in your app.

### 3. Claude API Call
Claude receives the prompt and returns a structured JSON object representing the workflow:

```json
{
  "nodes": [
    { "id": "n1", "type": "field-source", "config": { "field": "sales_total" } },
    { "id": "n2", "type": "keyword-mapper", "config": { "threshold": 500, "discount": 0.12 } },
    { "id": "n3", "type": "category-rollup", "config": { "groupBy": ["region", "fiscal_quarter"] } }
  ],
  "edges": [
    { "source": "n1", "target": "n2" },
    { "source": "n2", "target": "n3" }
  ]
}
```

### 4. Render & Verify
The generated workflow is loaded into the canvas in a **draft state** — visually distinct (e.g. dashed borders) so it's clear it hasn't been confirmed yet. You can:
- Inspect each block's configuration in the block inspector
- Edit, remove, or reorder nodes before accepting
- Reject and re-prompt with a refinement ("add a filter for Q1 only")

### 5. Confirm & Run
Once satisfied, you confirm the draft — it becomes a normal workflow and runs through the existing execution engine unchanged.

---

## Why This Is a Good Idea

### Removes the Blank Canvas Problem
Building a workflow from scratch requires knowing which blocks exist, how they connect, and in what order. For complex calculations this takes time. AI generation gives you a starting point in seconds.

### Keeps You in Control
The verify step means you never blindly trust the output. You remain the decision-maker — the AI is a fast drafter, not an autonomous actor. This is especially important for financial calculations where correctness matters.

### Works With Your Existing Architecture
- The **block catalog** (`block-catalog.ts`) already defines every block type — this becomes Claude's vocabulary
- The **workflow store** (`workflow-store.ts`) already manages nodes and edges — injecting a generated graph is a store operation, not a redesign
- The **block inspector** (`block-inspector.tsx`) already lets you review and edit block config — no new UI needed for verification

### Lowers the Learning Curve
New users don't need to understand the block system before using the app. They can generate a workflow, see how it's structured, and learn by example.

### Iterative Refinement
Because you can re-prompt ("now add a year-over-year comparison"), the interface supports an iterative back-and-forth that's faster than manual drag-and-drop editing.

---

## Key Implementation Considerations

| Concern | Mitigation |
|---|---|
| Claude generates invalid blocks | Feed the full block catalog in the prompt; validate the JSON against known block types before rendering |
| Hallucinated field names | Include a sample of available data fields in the prompt context |
| Complex workflows exceed token limits | Paginate large catalogs; summarize less-used blocks |
| User doesn't understand the output | Highlight each generated block with a plain-language tooltip explaining what it does |

---

## Rough Effort Estimate

| Task | Effort |
|---|---|
| Claude API integration + prompt engineering | ~2 days |
| Draft workflow rendering (visual distinction) | ~1 day |
| Confirm/reject/re-prompt UI | ~1 day |
| Validation layer (generated JSON → valid workflow) | ~1 day |
| **Total** | **~5 days** |
