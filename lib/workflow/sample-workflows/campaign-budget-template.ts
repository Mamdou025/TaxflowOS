// ─────────────────────────────────────────────────────────────────────────────
// Marketing Campaign Budget Allocation — a NON-fiscal demo workflow with a
// human ELECTION step (like the fiscal rollover, but for a marketing budget).
//
// Purpose: take a list of channel spend requests, classify each into a marketing
// channel, total the ask per channel, then let a human ELECT the approved budget
// somewhere between the already-committed floor and the budget ceiling. The
// approved amount is allocated across channels by requested share and the
// projected return is computed.
//
// Deliberately DIFFERENT from the Expense workflow: fewer sources (no worksheet),
// an interactive election intervention, and a headline that depends on the human
// choice. The domain math lives in CAMPAIGN_CONFIG's computeExtra (see
// lib/workflow-runs/campaign.ts).
// ─────────────────────────────────────────────────────────────────────────────

// ── Classification rules — sort each request into a marketing channel ─────────

export const CAMPAIGN_CLASSIFICATION_RULES = [
  {
    categoryId: "paidSearch",
    categoryLabel: "Paid search",
    confidence: 0.93,
    description: "Search engine marketing — PPC, brand and non-brand search ads.",
    keywords: ["paid search", "search ads", "google ads", "adwords", "sem", "ppc", "bing ads"],
    matchMode: "contains",
    priority: 10,
    ruleId: "rule-paid-search",
  },
  {
    categoryId: "socialMedia",
    categoryLabel: "Paid social",
    confidence: 0.92,
    description: "Paid social media — Meta, LinkedIn, TikTok, performance ads.",
    keywords: ["paid social", "social media", "facebook", "instagram", "linkedin", "tiktok", "social ads"],
    matchMode: "contains",
    priority: 10,
    ruleId: "rule-social",
  },
  {
    categoryId: "contentSeo",
    categoryLabel: "Content & SEO",
    confidence: 0.89,
    description: "Content marketing, editorial, blog and organic SEO programs.",
    keywords: ["content", "blog", "seo", "editorial", "copywriting", "organic"],
    matchMode: "contains",
    priority: 9,
    ruleId: "rule-content",
  },
  {
    categoryId: "events",
    categoryLabel: "Events & sponsorship",
    confidence: 0.9,
    description: "Conferences, trade shows, booths, sponsorships and webinars.",
    keywords: ["event", "conference", "sponsorship", "booth", "trade show", "tradeshow", "webinar", "summit"],
    matchMode: "contains",
    priority: 9,
    ruleId: "rule-events",
  },
  {
    categoryId: "influencer",
    categoryLabel: "Influencer & creator",
    confidence: 0.87,
    description: "Influencer partnerships, creator campaigns and UGC.",
    keywords: ["influencer", "creator", "ambassador", "ugc", "partnership"],
    matchMode: "contains",
    priority: 8,
    ruleId: "rule-influencer",
  },
  {
    categoryId: "other",
    categoryLabel: "Other / contingency",
    confidence: 0.8,
    description: "Tooling, contingency and everything not otherwise classified.",
    keywords: ["contingency", "tooling", "tools", "misc", "other", "reserve"],
    matchMode: "contains",
    priority: 5,
    ruleId: "rule-other",
  },
];

// ── Rollup rules — total the ask per channel + a grand requested total ────────

export const CAMPAIGN_ROLLUP_RULES = [
  { description: "Total requested for paid search.", includeCategoryIds: ["paidSearch"], label: "Paid search requested", operation: "sum", rollupId: "paidsearch_total" },
  { description: "Total requested for paid social.", includeCategoryIds: ["socialMedia"], label: "Paid social requested", operation: "sum", rollupId: "social_total" },
  { description: "Total requested for content & SEO.", includeCategoryIds: ["contentSeo"], label: "Content & SEO requested", operation: "sum", rollupId: "content_total" },
  { description: "Total requested for events & sponsorship.", includeCategoryIds: ["events"], label: "Events requested", operation: "sum", rollupId: "events_total" },
  { description: "Total requested for influencer & creator.", includeCategoryIds: ["influencer"], label: "Influencer requested", operation: "sum", rollupId: "influencer_total" },
  { description: "Total requested for other / contingency.", includeCategoryIds: ["other"], label: "Other requested", operation: "sum", rollupId: "other_total" },
  {
    description: "Grand total requested across every channel.",
    includeCategoryIds: ["paidSearch", "socialMedia", "contentSeo", "events", "influencer", "other"],
    label: "Total requested",
    operation: "sum",
    rollupId: "requested_total",
  },
];

// ── Calculation rules — election bounds (stage 1) ─────────────────────────────
// Mirrors the fiscal rollover: BORNE_MIN/MAX frame the choice, MONTANT_ELU is the
// elected amount. The real allocation + projection is done in computeExtra; these
// give the calc block a runnable shape (params resolve to 0 here, as in Roulement).

export const CAMPAIGN_ELECTION_CALC_RULES = [
  { calculationId: "REQUESTED_TOTAL", description: "Requested total = sum of every channel ask", label: "Total requested", operands: ["requested_total"], operation: "pass_through", resultKey: "REQUESTED_TOTAL" },
  { calculationId: "BORNE_MIN", description: "Floor = already-committed spend", label: "Budget floor (committed)", operands: ["committed_spend"], operation: "pass_through", resultKey: "BORNE_MIN" },
  { calculationId: "BORNE_MAX", description: "Ceiling = min(budget cap, requested total)", label: "Budget ceiling", operands: ["budget_cap", "requested_total"], operation: "min", resultKey: "BORNE_MAX" },
  { calculationId: "MONTANT_ELU", description: "Approved budget (elected between the floor and ceiling)", label: "Approved budget", operands: ["montant_elu"], operation: "pass_through", resultKey: "MONTANT_ELU" },
  { calculationId: "APPROVED_BUDGET", description: "Approved budget = elected amount", label: "Approved budget", operands: ["MONTANT_ELU"], operation: "pass_through", resultKey: "APPROVED_BUDGET" },
];

// ── Calculation rules — projection summary (stage 2) ──────────────────────────

export const CAMPAIGN_SUMMARY_CALC_RULES = [
  { calculationId: "PROJECTED_REVENUE", description: "Projected revenue = approved budget × target ROAS", label: "Projected revenue", operands: ["APPROVED_BUDGET", "target_roas"], operation: "multiply", resultKey: "PROJECTED_REVENUE" },
  { calculationId: "BUDGET_REMAINING", description: "Budget remaining = budget cap − approved budget", label: "Budget remaining", operands: ["budget_cap", "APPROVED_BUDGET"], operation: "subtract", resultKey: "BUDGET_REMAINING" },
  { calculationId: "UNFUNDED_REQUESTS", description: "Unfunded requests = max(requested − approved, 0)", label: "Unfunded requests", operands: ["requested_total", "APPROVED_BUDGET"], operation: "max_subtract_zero", resultKey: "UNFUNDED_REQUESTS" },
];

// ── Block specs ───────────────────────────────────────────────────────────────

export const CAMPAIGN_TEMPLATE_BLOCK_SPECS = [
  // ── Sources ────────────────────────────────────────────────────────────────
  {
    catalogId: "source:excel-workbook",
    config: {
      columns: ["rowId", "account", "label", "description", "amount", "currency"],
      columnMapping: { account: "account", amount: "amount", currency: "currency", description: "description", label: "label" },
      outputs: "selected_rows",
      requireUpload: true,
      rows: [],
      selectedRange: "",
      selectedRowsCount: 0,
      selectedSheet: "",
      sheets: [],
      sourceKind: "excel_workbook",
      sourceLocator: "local-excel://awaiting-upload",
      sourceStatus: "draft",
      sourceVersion: 1,
      toolId: "source.manual_table",
      workbookName: "Upload the channel spend requests",
    },
    description: "Upload the channel spend requests — one row per campaign line (channel, description, requested amount).",
    id: "campaign-source-requests",
    label: "Spend Requests",
    position: { x: -220, y: 80 },
  },
  {
    catalogId: "source:manual-entry",
    config: {
      documentCurrency: "USD",
      reportingCurrency: "USD",
      // Budget parameters — the run/worksheet expose these as editable inputs; the
      // election math consumes them at compute time.
      budget_cap: 300000,
      committed_spend: 150000,
      target_roas: 3.5,
      montant_elu: 225000,
      outputs: "budget_params, input_metadata",
      sourceKind: "fapi_inputs",
      sourceLocator: "manual-source://campaign-budget-params",
      sourceStatus: "draft",
      sourceVersion: 1,
      toolId: "source.fapi_inputs",
    },
    description: "Budget parameters: the total budget cap, already-committed spend (floor), and the target return on ad spend.",
    id: "campaign-source-params",
    label: "Budget Parameters",
    position: { x: -220, y: 360 },
  },

  // ── Logic ──────────────────────────────────────────────────────────────────
  {
    catalogId: "logic:classification-mapping",
    config: {
      conflictStrategy: "highest_confidence",
      inputs: "data_rows, keyword_rules",
      keywordRules: CAMPAIGN_CLASSIFICATION_RULES,
      lowConfidenceThreshold: 0.75,
      matchFields: ["label", "description", "account"],
      matchMode: "contains",
      outputs: "mapped_rows, unmatched_rows, low_confidence_rows, mapping_summary",
      toolId: "logic.keyword_mapper",
      unmatchedStrategy: "send_to_review",
    },
    description: "Classifies each spend request into a marketing channel (paid search, paid social, content, events, influencer, other).",
    id: "campaign-logic-classifier",
    label: "Channel Classifier",
    position: { x: 340, y: 80 },
  },
  {
    catalogId: "logic:category-rollup-aggregator",
    config: {
      inputs: "mapped_rows, rollup_rules",
      operation: "sum",
      outputs: "category_totals, rollup_totals, named_values, rollup_summary",
      rollupRules: CAMPAIGN_ROLLUP_RULES,
      toolId: "logic.category_rollup_aggregator",
    },
    description: "Totals the requested amount per channel and produces the grand requested total.",
    id: "campaign-logic-rollup",
    label: "Channel Totals",
    position: { x: 800, y: 80 },
  },
  {
    catalogId: "logic:calculation-engine",
    config: {
      formulas: CAMPAIGN_ELECTION_CALC_RULES,
      inputs: "named_values, protected_inputs",
      mode: "auto",
      outputs: "calculated_results, formula_trace, calculation_summary, named_values",
      toolId: "logic.calculation_engine",
    },
    description: "Frames the election: the committed floor, the budget ceiling, and the elected approved budget.",
    id: "campaign-logic-election",
    label: "Budget Election",
    position: { x: 1260, y: 80 },
  },
  {
    catalogId: "logic:calculation-engine",
    config: {
      formulas: CAMPAIGN_SUMMARY_CALC_RULES,
      inputs: "named_values",
      mode: "auto",
      outputs: "calculated_results, formula_trace, calculation_summary, named_values",
      toolId: "logic.calculation_engine",
    },
    description: "Projects revenue from the approved budget and reports unfunded requests and remaining budget.",
    id: "campaign-logic-summary",
    label: "Allocation Summary",
    position: { x: 1720, y: 80 },
  },

  // ── Field blocks ───────────────────────────────────────────────────────────
  {
    catalogId: "field:field-block",
    config: { toolId: "field.field_block" },
    description: "Displays the requested amount per marketing channel.",
    id: "campaign-field-channels",
    label: "Channel Breakdown",
    position: { x: 800, y: 480 },
  },
  {
    catalogId: "field:field-block",
    config: { toolId: "field.field_block" },
    description: "Displays the allocated budget per channel after the election.",
    id: "campaign-field-allocation",
    label: "Allocation by Channel",
    position: { x: 1260, y: 480 },
  },
  {
    catalogId: "field:field-block",
    config: { toolId: "field.field_block" },
    description: "Displays the allocation summary: approved budget, projected revenue, unfunded, remaining.",
    id: "campaign-field-summary",
    label: "Projection Summary",
    position: { x: 1720, y: 480 },
  },

  // ── Outputs ────────────────────────────────────────────────────────────────
  {
    catalogId: "output:pdf-report",
    config: {
      inputs: "mapped_rows, review_findings, source_trace",
      outputs: "report",
      toolId: "output.pdf_report",
    },
    description: "One-page budget approval memo: channels, elected budget, allocation, and projected return.",
    id: "campaign-output-memo",
    label: "Approval Memo",
    position: { x: 2180, y: 80 },
  },
  {
    catalogId: "output:canonical-json",
    config: {
      inputs: "mapped_rows, review_findings, source_trace",
      outputs: "canonical_json",
      toolId: "output.canonical_json",
    },
    description: "Structured JSON of the allocation for the finance / planning system.",
    id: "campaign-output-json",
    label: "Allocation JSON",
    position: { x: 2180, y: 380 },
  },
];

// ── Edge specs ──────────────────────────────────────────────────────────────

export const CAMPAIGN_TEMPLATE_EDGE_SPECS = [
  // Sources → Logic
  {
    bindingLabel: "Requests to classify",
    reason: "The Channel Classifier sorts each spend request into a marketing channel.",
    relationshipType: "provides_data_to",
    sourceBlockId: "campaign-source-requests",
    sourceOutputRole: "selected_rows",
    targetBlockId: "campaign-logic-classifier",
    targetInputRole: "data_rows",
  },
  {
    bindingLabel: "Classified requests to total",
    reason: "Channel Totals groups classified requests into per-channel buckets.",
    relationshipType: "aggregates_into",
    sourceBlockId: "campaign-logic-classifier",
    sourceOutputRole: "mapped_rows",
    targetBlockId: "campaign-logic-rollup",
    targetInputRole: "mapped_rows",
  },
  {
    bindingLabel: "Channel totals for the election",
    reason: "The Budget Election reads the requested total to set the ceiling.",
    relationshipType: "provides_data_to",
    sourceBlockId: "campaign-logic-rollup",
    sourceOutputRole: "named_values",
    targetBlockId: "campaign-logic-election",
    targetInputRole: "named_values",
  },
  {
    bindingLabel: "Budget parameters for the election",
    reason: "The Budget Election needs the budget cap, committed floor, and target ROAS.",
    relationshipType: "provides_data_to",
    sourceBlockId: "campaign-source-params",
    sourceOutputRole: "budget_params",
    targetBlockId: "campaign-logic-election",
    targetInputRole: "protected_inputs",
  },
  {
    bindingLabel: "Election result to the projection",
    reason: "The Allocation Summary projects revenue from the elected approved budget.",
    relationshipType: "provides_data_to",
    sourceBlockId: "campaign-logic-election",
    sourceOutputRole: "calculated_results",
    targetBlockId: "campaign-logic-summary",
    targetInputRole: "named_values",
  },

  // Logic → Field blocks
  {
    bindingLabel: "Per-channel breakdown",
    reason: "The Channel Breakdown field shows the requested amount per channel.",
    relationshipType: "provides_data_to",
    sourceBlockId: "campaign-logic-rollup",
    sourceOutputRole: "rollup_totals",
    targetBlockId: "campaign-field-channels",
    targetInputRole: "computed_values",
  },
  {
    bindingLabel: "Allocation by channel",
    reason: "The Allocation field shows the elected budget spread across channels.",
    relationshipType: "provides_data_to",
    sourceBlockId: "campaign-logic-election",
    sourceOutputRole: "calculated_results",
    targetBlockId: "campaign-field-allocation",
    targetInputRole: "computed_values",
  },
  {
    bindingLabel: "Projection summary",
    reason: "The Projection Summary field shows approved budget, projected revenue, and remaining.",
    relationshipType: "provides_data_to",
    sourceBlockId: "campaign-logic-summary",
    sourceOutputRole: "calculated_results",
    targetBlockId: "campaign-field-summary",
    targetInputRole: "computed_values",
  },

  // Logic → Outputs
  {
    bindingLabel: "Classified requests — approval memo",
    reason: "The Approval Memo lists each classified request with its channel.",
    relationshipType: "included_in_output_preview",
    sourceBlockId: "campaign-logic-classifier",
    sourceOutputRole: "mapped_rows",
    targetBlockId: "campaign-output-memo",
    targetInputRole: "mapped_rows",
  },
  {
    bindingLabel: "Allocation summary — approval memo",
    reason: "The Approval Memo includes the elected budget and projected return.",
    relationshipType: "included_in_output_preview",
    sourceBlockId: "campaign-logic-summary",
    sourceOutputRole: "calculation_summary",
    targetBlockId: "campaign-output-memo",
    targetInputRole: "review_findings",
  },
  {
    bindingLabel: "Allocation — JSON handoff",
    reason: "The Allocation JSON includes the per-channel allocation and projection.",
    relationshipType: "included_in_handoff",
    sourceBlockId: "campaign-logic-summary",
    sourceOutputRole: "calculation_summary",
    targetBlockId: "campaign-output-json",
    targetInputRole: "review_findings",
  },
];
