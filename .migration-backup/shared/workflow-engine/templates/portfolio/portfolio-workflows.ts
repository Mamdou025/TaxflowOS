// ─────────────────────────────────────────────────────────────────────────────
// Sinaxe — Canadian Corporate Tax Workflow Portfolio (declarative specs)
//
// Faithful builder-native node graphs for the Tier-1 / Foundation workflows in
// the "Sinaxe Canadian Corporate Tax Workflow Portfolio" (§2.1–2.11), plus the
// four shared "Platform Services" from the Platform Services Addendum merged in
// (Universal Execution Sequence, Scope, Tax Position Summary, Data Readiness).
//
// Each workflow's numbered recommended steps + reusable building blocks +
// manager-level outputs are mapped onto the existing BLOCK_CATALOG families:
//   Trigger → Sources (inputs, reusable ledgers/graph, prior-year, FX, docs)
//           → AI/Agent (fuzzy extraction/classification, proposal-only)
//           → Logic (normalize / classify / aggregate / calculate / reconcile)
//           → professional-judgment checkpoints (Manual-Entry sources — locked
//             as evidence, feeding the Logic that needs the decision)
//           → Field (manager-level display views)
//           → Output (manager deliverables + write-back to shared ledgers).
//
// These are DECLARATIVE data only — `createPortfolioWorkflow` (in
// local-fiscal-workflow.ts) turns any def below into a LocalWorkflowSnapshot the
// builder can load, edit and save. Block ids are short + local; the builder
// prefixes them with the workflow id so every block/edge id is globally unique.
// Positions are derived from `stage` (column) and `row`.
// ─────────────────────────────────────────────────────────────────────────────

export type PortfolioBlockSpec = {
  /** A BLOCK_CATALOG id, e.g. "source:excel-workbook". */
  catalogId: string;
  /** Short id, unique within the workflow (prefixed with the workflow id). */
  id: string;
  label: string;
  description: string;
  /** Column in the left→right pipeline layout. */
  stage: number;
  /** Row within the column. */
  row: number;
  config?: Record<string, unknown>;
};

export type PortfolioEdgeSpec = {
  from: string;
  to: string;
  label: string;
  reason: string;
  /** WorkflowRelationshipType; defaults to "provides_data_to". */
  rel?: string;
  fromRole?: string;
  toRole?: string;
};

export type PortfolioWorkflowGroup = "foundation" | "tier1" | "platform";

export type PortfolioWorkflowDef = {
  id: string;
  name: string;
  description: string;
  group: PortfolioWorkflowGroup;
  /** Short tagline for the builder's template menu + switcher. */
  sub: string;
  blocks: PortfolioBlockSpec[];
  edges: PortfolioEdgeSpec[];
};

// Compact constructors so the graphs below stay readable.
const b = (
  catalogId: string,
  id: string,
  label: string,
  description: string,
  stage: number,
  row = 0,
  config?: Record<string, unknown>
): PortfolioBlockSpec => ({ catalogId, id, label, description, stage, row, config });

const e = (
  from: string,
  to: string,
  label: string,
  reason: string,
  rel = "provides_data_to",
  fromRole?: string,
  toRole?: string
): PortfolioEdgeSpec => ({ from, to, label, reason, rel, fromRole, toRole });

// Relationship-type shorthands (validated set lives in domain/workflow/edge-types.ts).
const INITIATES = "initiates";
const TO_AI = "provides_context_to_ai";
const AI_MAP = "suggests_mapping";
const AI_PROPOSE = "proposes";
const AGGREGATES = "aggregates_into";
const TO_PREVIEW = "included_in_output_preview";
const TO_HANDOFF = "included_in_handoff";

// ─────────────────────────────────────────────────────────────────────────────
// 2.1 Foreign Affiliate Ownership & Entity Graph (Foundation)
// ─────────────────────────────────────────────────────────────────────────────
const OWNERSHIP_GRAPH: PortfolioWorkflowDef = {
  id: "pf-ownership-graph",
  name: "Foreign Affiliate Ownership & Entity Graph",
  group: "foundation",
  sub: "Foundation · shared entity graph for T1134 / FAPI / surplus / CbCR / Pillar Two",
  description:
    "Foundation workflow: import the legal-entity structure, normalize identifiers, compute direct/indirect ownership and participating percentages, determine FA/CFA status, detect ownership changes, confirm control judgment calls, and publish an approved entity graph for every international workflow.",
  blocks: [
    b("trigger:manual", "start", "Start · Ownership graph", "Manual start of the ownership-graph engine", 0, 0),
    b("source:excel-workbook", "src-structure", "Legal entity structure", "Entities, tax residence, incorporation details and ownership records", 0, 1),
    b("source:database-query", "src-prior", "Prior-year entity graph", "Roll forward stable entity facts and mappings from the prior year", 0, 2),
    b("source:pdf-document", "src-docs", "Ownership & incorporation docs", "Share registers, org charts, agreements and reorganization documents", 0, 3),
    b("ai:ai-search", "ai-extract", "Extract ownership facts", "AI extraction of ownership, control and effective-date facts from documents (proposal-only)", 1, 3),
    b("source:manual-entry", "chk-control", "Judgment · control determination", "Professional confirmation of ambiguous control or de facto control", 1, 2),
    b("logic:classification-mapping", "lg-normalize", "Normalize names & identifiers", "Reconcile entity names/IDs across legal, consolidation and tax systems", 1, 0),
    b("logic:calculation-engine", "lg-ownership", "Direct & indirect ownership %", "Compute ownership percentages by effective date", 2, 0),
    b("logic:calculation-engine", "lg-status", "FA / CFA status", "Determine foreign-affiliate and controlled-foreign-affiliate status", 2, 1),
    b("logic:calculation-engine", "lg-participating", "Equity & participating %", "Compute equity and participating percentages where required", 2, 2),
    b("logic:classification-mapping", "lg-changes", "Detect ownership changes", "Acquisitions, dispositions, liquidations, amalgamations and ownership changes", 3, 1),
    b("field:field-block", "fld-register", "Ownership register", "Manager view of the approved entity & ownership register", 4, 0),
    b("field:field-block", "fld-changes", "Ownership changes", "Manager view of year-over-year ownership changes", 4, 1),
    b("output:evidence-pack", "out-register", "Approved entity & ownership register", "Approved register with source evidence", 5, 0),
    b("output:pdf-report", "out-determination", "FA / CFA determination schedule", "Foreign-affiliate / CFA determination schedule", 5, 1),
    b("output:excel-export", "out-participating", "Participating percentage schedule", "Participating-percentage schedule", 5, 2),
    b("output:pdf-report", "out-exception", "Manager exception summary", "Manager-level exceptions requiring judgment", 5, 3),
    b("output:canonical-json", "out-publish", "Publish approved entity graph", "Write the approved entity graph back to the shared graph for downstream workflows", 6, 1),
  ],
  edges: [
    e("start", "src-structure", "Start", "Manual start of the workflow", INITIATES),
    e("src-structure", "lg-normalize", "Entity records", "Normalize the imported entity structure"),
    e("src-prior", "lg-normalize", "Prior-year facts", "Roll forward stable entity facts & mappings"),
    e("src-docs", "ai-extract", "Ownership documents", "Extract ownership facts from documents", TO_AI),
    e("ai-extract", "lg-normalize", "Extracted facts", "AI-proposed ownership facts feed normalization", AI_MAP),
    e("lg-normalize", "lg-ownership", "Normalized entities", "Compute ownership percentages"),
    e("lg-ownership", "lg-status", "Ownership %", "Determine FA / CFA status"),
    e("chk-control", "lg-status", "Control determination", "Professional control determination feeds status"),
    e("lg-ownership", "lg-participating", "Ownership %", "Compute equity & participating percentages"),
    e("lg-status", "lg-changes", "FA/CFA status", "Detect ownership changes against prior year"),
    e("lg-status", "fld-register", "Approved status", "Show the ownership register"),
    e("lg-changes", "fld-changes", "Detected changes", "Show ownership changes"),
    e("lg-normalize", "out-register", "Entity register", "Include the entity register in the evidence pack", TO_PREVIEW),
    e("lg-status", "out-determination", "FA/CFA determination", "Produce the determination schedule", TO_PREVIEW),
    e("lg-participating", "out-participating", "Participating %", "Produce the participating-percentage schedule", TO_PREVIEW),
    e("lg-changes", "out-exception", "Exceptions", "Produce the manager exception summary", TO_PREVIEW),
    e("lg-status", "out-publish", "Approved graph", "Publish the approved entity graph", TO_HANDOFF),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 2.2 T1134 Foreign Affiliate Reporting (Tier 1)
// ─────────────────────────────────────────────────────────────────────────────
const T1134: PortfolioWorkflowDef = {
  id: "pf-t1134",
  name: "T1134 Foreign Affiliate Reporting",
  group: "tier1",
  sub: "Tier 1 · foreign-affiliate information reporting & review",
  description:
    "Flagship annual information-reporting workflow: determine filing entities from the approved ownership graph, roll forward affiliate records, collect and reconcile affiliate financial data, populate the summary and supplements, run cross-affiliate validations, surface only exceptions, and write approved facts back to the entity graph.",
  blocks: [
    b("trigger:manual", "start", "Start · T1134", "Manual start of the T1134 workflow", 0, 0),
    b("source:database-query", "src-graph", "Approved ownership graph", "Filing entities & reporting obligations from the approved ownership graph", 0, 1),
    b("source:database-query", "src-prior", "Prior-year affiliate records", "Roll forward prior-year affiliate records, supplements & persistent facts", 0, 2),
    b("source:excel-workbook", "src-financials", "Affiliate financial data", "Financial, operational and ownership data by affiliate", 0, 3),
    b("source:pdf-document", "src-statements", "Source statements & consolidation", "Consolidation records and source financial statements", 0, 4),
    b("source:currency-rate", "src-fx", "FX rates", "Prescribed / annual-average FX for affiliate figures", 1, 4),
    b("ai:ai-search", "ai-collect", "Extract affiliate information", "AI extraction of affiliate facts from statements & filings (proposal-only)", 1, 3),
    b("logic:classification-mapping", "lg-classify", "Identify affiliate changes", "New, disposed, dormant or reorganized affiliates", 1, 1),
    b("logic:calculation-engine", "lg-reconcile", "Reconcile to consolidation", "Reconcile affiliate financial data to consolidation records & source statements", 2, 2),
    b("logic:hierarchy-aggregator", "lg-populate", "Populate summary & supplements", "Populate the T1134 summary and affiliate-level supplements", 3, 1),
    b("logic:calculation-engine", "lg-validate", "Cross-affiliate validations", "Validate across affiliates, ownership %, financial data & related workflows", 4, 1),
    b("source:manual-entry", "chk-judgment", "Judgment · anomalies & items", "Professional decisions on year-over-year anomalies and judgment items", 4, 2),
    b("field:field-block", "fld-summary", "T1134 summary", "Manager view of the completed summary & supplements", 5, 0),
    b("field:field-block", "fld-variance", "Prior-year variance", "Manager view of year-over-year variance", 5, 1),
    b("output:pdf-report", "out-package", "T1134 package", "Completed T1134 summary & supplements", 6, 0),
    b("output:excel-export", "out-supplements", "Affiliate support schedules", "Affiliate-level support schedules", 6, 1),
    b("output:csv-export", "out-requests", "Information request list", "Missing-information request list", 6, 2),
    b("output:pdf-report", "out-variance", "Prior-year variance report", "Prior-year variance report", 6, 3),
    b("output:evidence-pack", "out-review", "Manager exception & sign-off package", "Manager-level exception & sign-off package", 6, 4),
    b("output:canonical-json", "out-writeback", "Write back affiliate facts", "Write approved affiliate facts to the entity graph & tax data layer", 7, 2),
  ],
  edges: [
    e("start", "src-graph", "Start", "Manual start of the workflow", INITIATES),
    e("src-graph", "lg-classify", "Filing entities", "Identify affiliate changes vs the ownership graph"),
    e("src-prior", "lg-classify", "Prior-year affiliates", "Roll forward prior-year affiliate records"),
    e("src-financials", "lg-reconcile", "Affiliate financials", "Reconcile financial data"),
    e("src-statements", "ai-collect", "Source statements", "Extract affiliate information from statements", TO_AI),
    e("ai-collect", "lg-reconcile", "Extracted facts", "AI-proposed affiliate facts feed reconciliation", AI_MAP),
    e("src-fx", "lg-reconcile", "FX rates", "Translate affiliate figures"),
    e("lg-classify", "lg-populate", "Affiliate changes", "Populate summary & supplements"),
    e("lg-reconcile", "lg-populate", "Reconciled data", "Populate summary & supplements"),
    e("lg-populate", "lg-validate", "Populated forms", "Run cross-affiliate validations"),
    e("chk-judgment", "lg-validate", "Judgment items", "Professional decisions resolve anomalies"),
    e("lg-validate", "fld-summary", "Validated forms", "Show the T1134 summary"),
    e("lg-validate", "fld-variance", "Variances", "Show prior-year variance"),
    e("lg-populate", "out-package", "T1134 forms", "Produce the T1134 package", TO_PREVIEW),
    e("lg-populate", "out-supplements", "Supplements", "Produce affiliate support schedules", TO_PREVIEW),
    e("lg-classify", "out-requests", "Missing info", "Produce the information request list", TO_PREVIEW),
    e("lg-validate", "out-variance", "Variances", "Produce the prior-year variance report", TO_PREVIEW),
    e("lg-validate", "out-review", "Exceptions", "Produce the manager exception & sign-off package", TO_PREVIEW),
    e("lg-validate", "out-writeback", "Approved facts", "Write approved affiliate facts back", TO_HANDOFF),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 2.3 FAPI Calculation (Tier 1) — manager-level portfolio blueprint
// ─────────────────────────────────────────────────────────────────────────────
const FAPI: PortfolioWorkflowDef = {
  id: "pf-fapi",
  name: "FAPI Calculation (portfolio)",
  group: "tier1",
  sub: "Tier 1 · deterministic international tax calculation (manager workflow)",
  description:
    "Manager-level FAPI blueprint: scope CFAs from the ownership graph, import affiliate trial balances, map accounts to FAPI concepts, classify income types, analyze related-party transactions, capture professional decisions, compute gross/net FAPI and FAT, apply participating percentages, reconcile to T1134/surplus/T2, and feed the T2 Schedule 1 adjustment.",
  blocks: [
    b("trigger:manual", "start", "Start · FAPI", "Manual start of the FAPI workflow", 0, 0),
    b("source:database-query", "src-graph", "CFA scope (ownership graph)", "Controlled foreign affiliates requiring analysis", 0, 1),
    b("source:excel-workbook", "src-tb", "Affiliate trial balances", "Affiliate trial balances, financial statements & supporting schedules", 0, 2),
    b("source:pdf-document", "src-docs", "Supporting schedules", "Supporting schedules & agreements", 0, 3),
    b("source:currency-rate", "src-fx", "FX rates", "FX service — prescribed / annual-average rates", 0, 4),
    b("source:manual-entry", "src-assump", "FAPI assumptions", "Inclusion rate, participating %, elections & thresholds", 1, 4),
    b("ai:ai-mapping-suggestion", "ai-map", "Map accounts to FAPI concepts", "AI-assisted mapping of income/expense to FAPI concepts (proposal-only)", 1, 3),
    b("logic:classification-mapping", "lg-normalize", "Classify income types", "Property income, active business income, other-than-ABI & exclusions", 1, 1),
    b("logic:classification-mapping", "lg-related", "Analyze related-party transactions", "Inter-affiliate and Canadian related-party transactions", 2, 1),
    b("source:manual-entry", "chk-classify", "Judgment · uncertain classifications", "Evidence & professional decisions for uncertain classifications", 2, 2),
    b("logic:category-rollup-aggregator", "lg-rollup", "Aggregate FAPI buckets", "Roll up classified income & expense buckets", 3, 1),
    b("logic:calculation-engine", "lg-calc", "Compute FAPI", "Gross FAPI, deductions, foreign accrual tax and net FAPI", 4, 1),
    b("logic:calculation-engine", "lg-inclusion", "Participating % & Canadian inclusion", "Apply participating percentages and compute the Canadian inclusion", 5, 1),
    b("logic:calculation-engine", "lg-reconcile", "Reconcile to T1134 / surplus / T2", "Reconcile to T1134, surplus and the T2 Schedule 1 adjustment", 6, 1),
    b("field:field-block", "fld-calc", "FAPI calculation", "Affiliate-level FAPI calculation", 5, 0),
    b("field:field-block", "fld-inclusion", "Consolidated inclusion", "Consolidated inclusion schedule", 6, 0),
    b("output:pdf-report", "out-workpaper", "FAPI workpaper", "Full workpaper, calculation explanation & evidence index", 7, 0),
    b("output:excel-export", "out-inclusion", "Consolidated inclusion schedule", "Consolidated inclusion schedule", 7, 1),
    b("output:pdf-report", "out-exception", "Classification exception report", "Classification exception report", 7, 2),
    b("output:excel-export", "out-fat", "Foreign accrual tax schedule", "Foreign accrual tax schedule", 7, 3),
    b("output:evidence-pack", "out-review", "Manager review package", "Manager review package", 7, 4),
    b("output:canonical-json", "out-t2feed", "T2 adjustment feed", "T2 Schedule 1 adjustment feed (write-back)", 8, 2),
  ],
  edges: [
    e("start", "src-graph", "Start", "Manual start of the workflow", INITIATES),
    e("src-graph", "lg-normalize", "CFA scope", "Classify affiliate income types"),
    e("src-tb", "lg-normalize", "Trial balances", "Classify affiliate income types"),
    e("src-docs", "ai-map", "Supporting schedules", "Map accounts to FAPI concepts", TO_AI),
    e("ai-map", "lg-normalize", "Proposed mapping", "AI-proposed mapping feeds classification", AI_MAP),
    e("lg-normalize", "lg-related", "Classified income", "Analyze related-party transactions"),
    e("lg-related", "lg-rollup", "Classified transactions", "Aggregate FAPI buckets"),
    e("chk-classify", "lg-rollup", "Judgment decisions", "Professional classifications feed the rollup"),
    e("lg-rollup", "lg-calc", "FAPI buckets", "Compute FAPI"),
    e("src-assump", "lg-calc", "FAPI assumptions", "Feed inclusion rate / thresholds"),
    e("lg-calc", "lg-inclusion", "Net FAPI", "Apply participating % & inclusion"),
    e("src-fx", "lg-inclusion", "FX rate", "Convert the Canadian inclusion"),
    e("lg-inclusion", "lg-reconcile", "Canadian inclusion", "Reconcile to T1134 / surplus / T2"),
    e("lg-inclusion", "fld-calc", "FAPI result", "Show the FAPI calculation"),
    e("lg-reconcile", "fld-inclusion", "Reconciled inclusion", "Show the consolidated inclusion"),
    e("lg-calc", "out-workpaper", "FAPI computation", "Produce the FAPI workpaper", TO_PREVIEW),
    e("lg-inclusion", "out-inclusion", "Inclusion", "Produce the consolidated inclusion schedule", TO_PREVIEW),
    e("lg-normalize", "out-exception", "Classifications", "Produce the classification exception report", TO_PREVIEW),
    e("lg-calc", "out-fat", "Foreign accrual tax", "Produce the foreign accrual tax schedule", TO_PREVIEW),
    e("lg-reconcile", "out-review", "Reconciliation", "Produce the manager review package", TO_PREVIEW),
    e("lg-reconcile", "out-t2feed", "T2 adjustment", "Feed the T2 Schedule 1 adjustment", TO_HANDOFF),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 2.4 Foreign Affiliate Surplus (Tier 1)
// ─────────────────────────────────────────────────────────────────────────────
const SURPLUS: PortfolioWorkflowDef = {
  id: "pf-surplus",
  name: "Foreign Affiliate Surplus",
  group: "tier1",
  sub: "Tier 1 · persistent longitudinal surplus ledger",
  description:
    "Persistent surplus ledger: establish opening surplus balances by affiliate, validate prior-year continuity, characterize current-year earnings, process dividends and underlying foreign tax with ordering, process reorganizations, reconcile to FAPI/FS/T1134, and publish approved closing balances plus dividend-capacity planning.",
  blocks: [
    b("trigger:manual", "start", "Start · Surplus", "Manual start of the surplus workflow", 0, 0),
    b("source:database-query", "src-opening", "Opening surplus balances", "Opening exempt, taxable, hybrid & pre-acquisition surplus by affiliate", 0, 1),
    b("source:database-query", "src-graph", "Ownership graph", "Historical ownership changes & continuity", 0, 2),
    b("source:excel-workbook", "src-current", "Current-year activity", "Earnings, losses, taxes, dividends & relevant transactions", 0, 3),
    b("source:currency-rate", "src-fx", "FX rates", "FX service for surplus movements", 0, 4),
    b("source:database-query", "src-fapi", "FAPI & T1134 results", "Cross-workflow reconciliation inputs", 1, 4),
    b("logic:calculation-engine", "lg-continuity", "Validate continuity", "Prior-year continuity & historical ownership changes", 1, 1),
    b("logic:classification-mapping", "lg-characterize", "Characterize earnings", "Characterize current-year earnings under applicable surplus rules", 2, 1),
    b("logic:calculation-engine", "lg-dividends", "Process dividends & UFT", "Dividends, underlying foreign tax & ordering consequences", 3, 1),
    b("logic:classification-mapping", "lg-reorg", "Process reorganizations", "Acquisitions, dispositions, amalgamations, liquidations & reorganizations", 4, 1),
    b("logic:calculation-engine", "lg-reconcile", "Reconcile surplus movements", "Reconcile to FAPI, financial statements & T1134", 5, 1),
    b("source:manual-entry", "chk-gaps", "Judgment · characterization gaps", "Unresolved characterization & historical-data gaps", 5, 2),
    b("field:field-block", "fld-continuity", "Surplus continuity", "Affiliate surplus continuity view", 6, 0),
    b("field:field-block", "fld-dividend", "Dividend capacity", "Planning-ready dividend capacity", 6, 1),
    b("output:excel-export", "out-continuity", "Affiliate surplus continuity", "Annual continuity schedules", 7, 0),
    b("output:excel-export", "out-dividend", "Dividend & underlying tax schedule", "Dividend & underlying-tax schedule", 7, 1),
    b("output:pdf-report", "out-history", "Historical adjustment log", "Historical adjustment log", 7, 2),
    b("output:pdf-report", "out-planning", "Planning summary", "Dividend-capacity planning summary", 7, 3),
    b("output:evidence-pack", "out-review", "Manager exception & sign-off package", "Manager exception & sign-off package", 7, 4),
    b("output:canonical-json", "out-publish", "Publish closing balances", "Publish approved closing balances to the persistent surplus ledger", 8, 1),
  ],
  edges: [
    e("start", "src-opening", "Start", "Manual start of the workflow", INITIATES),
    e("src-opening", "lg-continuity", "Opening balances", "Validate continuity"),
    e("src-graph", "lg-continuity", "Ownership history", "Validate historical ownership changes"),
    e("lg-continuity", "lg-characterize", "Continuity", "Characterize current-year earnings"),
    e("src-current", "lg-characterize", "Current-year activity", "Characterize current-year earnings"),
    e("lg-characterize", "lg-dividends", "Characterized earnings", "Process dividends & underlying tax"),
    e("src-fx", "lg-dividends", "FX rates", "Translate surplus movements"),
    e("lg-dividends", "lg-reorg", "Dividend flows", "Process reorganizations"),
    e("lg-reorg", "lg-reconcile", "Reorg effects", "Reconcile surplus movements"),
    e("src-fapi", "lg-reconcile", "FAPI / T1134", "Reconcile to FAPI & T1134"),
    e("chk-gaps", "lg-reconcile", "Judgment gaps", "Professional decisions resolve gaps"),
    e("lg-reconcile", "fld-continuity", "Reconciled surplus", "Show surplus continuity"),
    e("lg-dividends", "fld-dividend", "Dividend capacity", "Show dividend capacity"),
    e("lg-reconcile", "out-continuity", "Closing balances", "Produce the continuity schedules", TO_PREVIEW),
    e("lg-dividends", "out-dividend", "Dividends & UFT", "Produce the dividend & underlying-tax schedule", TO_PREVIEW),
    e("lg-reorg", "out-history", "Adjustments", "Produce the historical adjustment log", TO_PREVIEW),
    e("lg-dividends", "out-planning", "Dividend capacity", "Produce the planning summary", TO_PREVIEW),
    e("lg-reconcile", "out-review", "Exceptions", "Produce the manager exception & sign-off package", TO_PREVIEW),
    e("lg-reconcile", "out-publish", "Approved balances", "Publish approved closing balances", TO_HANDOFF),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 2.5 T106 Related-Party Transaction Reporting (Tier 1)
// ─────────────────────────────────────────────────────────────────────────────
const T106: PortfolioWorkflowDef = {
  id: "pf-t106",
  name: "T106 Related-Party Transaction Reporting",
  group: "tier1",
  sub: "Tier 1 · related-party transaction reporting & reconciliation",
  description:
    "Repeatable reconciliation workflow: extract intercompany transactions from ledgers, match counterparties to the entity graph, classify into T106 categories with AI-assisted residual mapping, reconcile to FS / intercompany / transfer-pricing schedules, apply materiality, compare to prior year, and store approved counterparty mappings for reuse.",
  blocks: [
    b("trigger:manual", "start", "Start · T106", "Manual start of the T106 workflow", 0, 0),
    b("source:database-query", "src-graph", "Entity & counterparty graph", "Canadian reporting entities & non-resident related parties", 0, 1),
    b("source:excel-workbook", "src-ledger", "Trial balances & ledgers", "Intercompany transactions & balances", 0, 2),
    b("source:pdf-document", "src-tp", "Transfer-pricing schedules", "Transfer-pricing schedules & intercompany agreements", 0, 3),
    b("source:database-query", "src-prior", "Prior-year disclosures", "Prior-year T106 disclosures & counterparty mappings", 0, 4),
    b("ai:ai-mapping-suggestion", "ai-match", "Match counterparties", "AI-assisted counterparty matching & residual category mapping (proposal-only)", 1, 3),
    b("logic:classification-mapping", "lg-normalize", "Normalize transactions", "Match counterparties to the graph & normalize descriptions", 1, 1),
    b("logic:classification-mapping", "lg-classify", "Classify into T106 categories", "Loans, interest, royalties, management fees, goods, services & other", 2, 1),
    b("logic:calculation-engine", "lg-reconcile", "Reconcile transaction totals", "Reconcile to FS, intercompany systems & transfer-pricing schedules", 3, 1),
    b("logic:calculation-engine", "lg-materiality", "Apply filing & materiality", "Filing & materiality thresholds; flag incomplete counterparty info", 4, 1),
    b("logic:calculation-engine", "lg-variance", "Prior-year comparison", "Compare with prior-year disclosures & investigate material changes", 5, 1),
    b("source:manual-entry", "chk-judgment", "Judgment · material changes", "Professional review of material changes & incomplete info", 5, 2),
    b("field:field-block", "fld-summary", "T106 summary", "Manager view of T106 summary & slips", 6, 0),
    b("field:field-block", "fld-recon", "Transaction reconciliation", "Reconciliation view", 6, 1),
    b("output:pdf-report", "out-summary", "T106 summary & slips", "T106 summary & slips", 7, 0),
    b("output:excel-export", "out-recon", "Transaction reconciliation", "Transaction reconciliation workpaper", 7, 1),
    b("output:pdf-report", "out-variance", "Variance & missing-information report", "Variance & missing-information report", 7, 2),
    b("output:evidence-pack", "out-review", "Manager review package", "Manager review package", 7, 3),
    b("output:canonical-json", "out-mapping", "Counterparty mapping register", "Store approved counterparty mappings for reuse across clients & years", 8, 1),
  ],
  edges: [
    e("start", "src-graph", "Start", "Manual start of the workflow", INITIATES),
    e("src-ledger", "lg-normalize", "Ledger transactions", "Normalize transactions"),
    e("src-graph", "lg-normalize", "Counterparties", "Match counterparties to the graph"),
    e("src-graph", "ai-match", "Entity graph", "Match counterparties", TO_AI),
    e("ai-match", "lg-normalize", "Proposed matches", "AI-proposed matches feed normalization", AI_MAP),
    e("lg-normalize", "lg-classify", "Normalized transactions", "Classify into T106 categories"),
    e("lg-classify", "lg-reconcile", "Classified transactions", "Reconcile transaction totals"),
    e("src-tp", "lg-reconcile", "TP schedules", "Reconcile to transfer-pricing schedules"),
    e("lg-reconcile", "lg-materiality", "Reconciled totals", "Apply filing & materiality"),
    e("lg-materiality", "lg-variance", "Material items", "Compare with prior year"),
    e("src-prior", "lg-variance", "Prior-year disclosures", "Compare with prior year"),
    e("chk-judgment", "lg-variance", "Judgment", "Professional review of material changes"),
    e("lg-variance", "fld-summary", "Reviewed T106", "Show the T106 summary"),
    e("lg-reconcile", "fld-recon", "Reconciliation", "Show the reconciliation"),
    e("lg-classify", "out-summary", "Classified transactions", "Produce the T106 summary & slips", TO_PREVIEW),
    e("lg-reconcile", "out-recon", "Reconciliation", "Produce the reconciliation workpaper", TO_PREVIEW),
    e("lg-variance", "out-variance", "Variances", "Produce the variance & missing-information report", TO_PREVIEW),
    e("lg-variance", "out-review", "Exceptions", "Produce the manager review package", TO_PREVIEW),
    e("lg-normalize", "out-mapping", "Counterparty mappings", "Store approved counterparty mappings", TO_HANDOFF),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 2.6 EIFEL (Tier 1)
// ─────────────────────────────────────────────────────────────────────────────
const EIFEL: PortfolioWorkflowDef = {
  id: "pf-eifel",
  name: "EIFEL",
  group: "tier1",
  sub: "Tier 1 · group-wide interest limitation & allocation",
  description:
    "Group-wide interest-limitation workflow: scope eligible group entities, extract financing expenses/revenues, apply inclusions/exclusions/ordering, compute adjusted taxable income and fixed-ratio capacity, calculate denied and restricted interest, evaluate carryforwards and elections, model group-ratio/allocation scenarios, reconcile across entities, and produce Schedule 130 inputs.",
  blocks: [
    b("trigger:manual", "start", "Start · EIFEL", "Manual start of the EIFEL workflow", 0, 0),
    b("source:database-query", "src-graph", "Group entities", "Entities subject to the rules & eligible group entities", 0, 1),
    b("source:excel-workbook", "src-data", "Entity-level financing data", "Interest & financing expenses and revenues from source data", 0, 2),
    b("source:database-query", "src-ledger", "Restricted-interest ledger", "Prior restricted interest & financing expense balances", 0, 3),
    b("source:manual-entry", "src-elections", "Elections & scenarios", "Relevant elections, transferred capacity & scenario inputs", 1, 3),
    b("logic:classification-mapping", "lg-extract", "Apply inclusions / exclusions", "Inclusions, exclusions and ordering rules", 1, 1),
    b("logic:calculation-engine", "lg-ati", "ATI & fixed-ratio capacity", "Adjusted taxable income and fixed-ratio capacity", 2, 1),
    b("logic:calculation-engine", "lg-denied", "Denied & restricted interest", "Denied amounts and restricted interest & financing expense balances", 3, 1),
    b("logic:calculation-engine", "lg-carryforward", "Carryforwards & capacity", "Carryforwards, carrybacks, transferred capacity & elections", 4, 1),
    b("logic:hierarchy-aggregator", "lg-scenario", "Group-ratio / allocation", "Model group-ratio or allocation scenarios", 5, 1),
    b("logic:calculation-engine", "lg-reconcile", "Group-wide reconciliation", "Cross-entity consistency & coordination with thin cap / losses / T2", 6, 1),
    b("source:manual-entry", "chk-judgment", "Judgment · elections & allocation", "Professional decisions on elections & allocation", 5, 2),
    b("field:field-block", "fld-calc", "Entity-level EIFEL", "Entity-level EIFEL calculations", 6, 0),
    b("field:field-block", "fld-scenario", "Scenario comparison", "Scenario comparison view", 7, 0),
    b("output:excel-export", "out-calc", "Entity-level EIFEL calculations", "Entity-level EIFEL calculations", 7, 1),
    b("output:excel-export", "out-allocation", "Group allocation schedule", "Group allocation schedule", 7, 2),
    b("output:excel-export", "out-continuity", "Restricted-interest continuity", "Restricted-interest continuity", 7, 3),
    b("output:pdf-report", "out-scenario", "Scenario comparison", "Scenario comparison", 7, 4),
    b("output:evidence-pack", "out-review", "Manager exception report", "Manager exception report", 7, 5),
    b("output:canonical-json", "out-sch130", "Schedule 130 data package", "Schedule 130 inputs & election support (write-back)", 8, 2),
  ],
  edges: [
    e("start", "src-graph", "Start", "Manual start of the workflow", INITIATES),
    e("src-graph", "lg-extract", "Group entities", "Apply inclusions & exclusions"),
    e("src-data", "lg-extract", "Financing data", "Apply inclusions & exclusions"),
    e("lg-extract", "lg-ati", "Included amounts", "Compute ATI & fixed-ratio capacity"),
    e("lg-ati", "lg-denied", "Capacity", "Compute denied & restricted interest"),
    e("src-ledger", "lg-denied", "Restricted-interest ledger", "Carry prior restricted balances"),
    e("lg-denied", "lg-carryforward", "Denied amounts", "Evaluate carryforwards & capacity"),
    e("src-elections", "lg-carryforward", "Elections", "Apply elections & transferred capacity"),
    e("lg-carryforward", "lg-scenario", "Restricted balances", "Model group-ratio / allocation scenarios"),
    e("chk-judgment", "lg-scenario", "Judgment", "Professional decisions on allocation"),
    e("lg-scenario", "lg-reconcile", "Scenario", "Group-wide reconciliation"),
    e("lg-reconcile", "fld-calc", "Reconciled EIFEL", "Show entity-level EIFEL"),
    e("lg-scenario", "fld-scenario", "Scenarios", "Show the scenario comparison"),
    e("lg-denied", "out-calc", "EIFEL amounts", "Produce entity-level EIFEL calculations", TO_PREVIEW),
    e("lg-scenario", "out-allocation", "Allocation", "Produce the group allocation schedule", TO_PREVIEW),
    e("lg-denied", "out-continuity", "Restricted interest", "Produce the restricted-interest continuity", TO_PREVIEW),
    e("lg-scenario", "out-scenario", "Scenarios", "Produce the scenario comparison", TO_PREVIEW),
    e("lg-reconcile", "out-review", "Exceptions", "Produce the manager exception report", TO_PREVIEW),
    e("lg-reconcile", "out-sch130", "Schedule 130 inputs", "Produce the Schedule 130 data package", TO_HANDOFF),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 2.7 T2 Corporate Income Tax Compliance Suite (Tier 1)
// ─────────────────────────────────────────────────────────────────────────────
const T2_SUITE: PortfolioWorkflowDef = {
  id: "pf-t2-suite",
  name: "T2 Corporate Income Tax Compliance Suite",
  group: "tier1",
  sub: "Tier 1 · core corporate tax compliance operating system",
  description:
    "The broadest recurring corporate-tax workflow: normalize the trial balance, prepare Schedule 1 book-to-tax adjustments and Schedule 8 CCA, roll forward losses/dividends/credits and provincial allocation, integrate international outputs, compute federal/provincial tax and instalments, assemble the return with diagnostics, and reconcile the notice of assessment.",
  blocks: [
    b("trigger:manual", "start", "Start · T2", "Manual start of the T2 workflow", 0, 0),
    b("source:excel-workbook", "src-tb", "Trial balance", "Import & normalize the trial balance", 0, 1),
    b("source:database-query", "src-prior", "Prior-year mappings & attributes", "Roll forward account mappings & tax attributes", 0, 2),
    b("source:database-query", "src-intl", "International tax outputs", "FAPI, surplus dividends, EIFEL and foreign tax credits", 0, 3),
    b("source:manual-entry", "src-schedule", "Filing obligations", "Required federal & provincial schedules", 0, 4),
    b("ai:ai-mapping-suggestion", "ai-map", "Map accounts", "AI-assisted chart-of-accounts mapping (proposal-only)", 1, 2),
    b("logic:classification-mapping", "lg-normalize", "Normalize & map accounts", "Chart-of-accounts normalization vs prior-year mappings", 1, 1),
    b("logic:calculation-engine", "lg-sch1", "Book-to-tax & Schedule 1", "Book-to-tax adjustments and Schedule 1", 2, 1),
    b("logic:calculation-engine", "lg-sch8", "Schedule 8 CCA", "Fixed-asset rollforward, CCA, recapture and terminal losses", 3, 1),
    b("logic:hierarchy-aggregator", "lg-schedules", "Losses / dividends / credits / provincial", "Loss continuity, capital transactions, dividends, credits & provincial allocation", 4, 1),
    b("logic:calculation-engine", "lg-tax", "Federal & provincial tax", "Tax, instalments, refundable balances & tax payable", 5, 1),
    b("logic:calculation-engine", "lg-assemble", "Assemble & diagnostics", "Return assembly & cross-schedule / source-data diagnostics", 6, 1),
    b("source:manual-entry", "chk-judgment", "Judgment · adjustments & positions", "Professional decisions on adjustments & positions", 5, 2),
    b("field:field-block", "fld-return", "T2 & schedules", "Manager view of the completed T2 & schedules", 6, 0),
    b("field:field-block", "fld-payable", "Tax payable", "Tax payable & payment view", 7, 0),
    b("output:taxprep-handoff", "out-return", "Completed T2 & schedules", "Taxprep handoff of the completed return", 7, 1),
    b("output:pdf-report", "out-workpaper", "Standardized tax workpaper", "Standardized tax workpaper", 7, 2),
    b("output:excel-export", "out-payment", "Tax payable & payment instructions", "Tax payable & payment instructions", 7, 3),
    b("output:evidence-pack", "out-filing", "Filing authorization package", "Filing authorization package", 7, 4),
    b("output:pdf-report", "out-exception", "Manager exception summary", "Manager exception summary", 7, 5),
    b("output:canonical-json", "out-noa", "Assessment reconciliation", "Reconcile the notice of assessment & update persistent tax attributes (write-back)", 8, 2),
  ],
  edges: [
    e("start", "src-tb", "Start", "Manual start of the workflow", INITIATES),
    e("src-tb", "lg-normalize", "Trial balance", "Normalize & map accounts"),
    e("src-prior", "lg-normalize", "Prior-year mappings", "Roll forward account mappings"),
    e("src-tb", "ai-map", "Accounts", "Map the chart of accounts", TO_AI),
    e("ai-map", "lg-normalize", "Proposed mapping", "AI-proposed mapping feeds normalization", AI_MAP),
    e("lg-normalize", "lg-sch1", "Mapped accounts", "Prepare book-to-tax adjustments"),
    e("lg-sch1", "lg-sch8", "Schedule 1", "Roll forward CCA (Schedule 8)"),
    e("lg-sch8", "lg-schedules", "Schedule 8", "Prepare losses / dividends / credits / provincial"),
    e("src-intl", "lg-schedules", "International outputs", "Integrate FAPI / surplus / EIFEL / FTC"),
    e("lg-schedules", "lg-tax", "Schedules", "Compute federal & provincial tax"),
    e("chk-judgment", "lg-tax", "Judgment", "Professional decisions on adjustments"),
    e("lg-tax", "lg-assemble", "Tax payable", "Assemble the return & run diagnostics"),
    e("src-schedule", "lg-assemble", "Filing obligations", "Determine required schedules"),
    e("lg-assemble", "fld-return", "Assembled return", "Show the T2 & schedules"),
    e("lg-tax", "fld-payable", "Tax payable", "Show tax payable"),
    e("lg-assemble", "out-return", "Completed return", "Hand off the completed T2", TO_HANDOFF),
    e("lg-assemble", "out-workpaper", "Return", "Produce the standardized workpaper", TO_PREVIEW),
    e("lg-tax", "out-payment", "Tax payable", "Produce tax payable & payment instructions", TO_PREVIEW),
    e("lg-assemble", "out-filing", "Return", "Produce the filing authorization package", TO_PREVIEW),
    e("lg-assemble", "out-exception", "Diagnostics", "Produce the manager exception summary", TO_PREVIEW),
    e("lg-assemble", "out-noa", "Assessment", "Reconcile the NOA & update attributes", TO_HANDOFF),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 2.8 Corporate Tax Provision (Tier 1)
// ─────────────────────────────────────────────────────────────────────────────
const TAX_PROVISION: PortfolioWorkflowDef = {
  id: "pf-tax-provision",
  name: "Corporate Tax Provision",
  group: "tier1",
  sub: "Tier 1 · quarterly & annual current tax execution",
  description:
    "Quarterly/annual provision workflow: import forecast or year-end data, roll forward differences and attributes, compute current tax by jurisdiction, integrate complex adjustments, compute deferred tax and rate effects, build the ETR reconciliation and journal entries, compare to comparatives, and produce provision workpapers with a sign-off package.",
  blocks: [
    b("trigger:manual", "start", "Start · Provision", "Manual start of the provision workflow", 0, 0),
    b("source:excel-workbook", "src-financials", "Entity financial data", "Forecast or year-end entity financial data", 0, 1),
    b("source:database-query", "src-attributes", "Tax attribute ledgers", "Permanent/temporary differences & tax attributes rollforward", 0, 2),
    b("source:database-query", "src-intl", "Complex tax adjustments", "FAPI, EIFEL, credits, losses & other adjustments", 0, 3),
    b("source:database-query", "src-prior", "Prior quarter / budget / return", "Comparatives for variance analysis", 0, 4),
    b("logic:calculation-engine", "lg-current", "Current taxable income & tax", "Current taxable income and current tax by jurisdiction", 1, 1),
    b("logic:calculation-engine", "lg-deferred", "Deferred tax & rate effects", "Deferred tax balances and rate effects where in scope", 2, 1),
    b("logic:calculation-engine", "lg-etr", "ETR reconciliation", "Statutory-to-effective tax rate reconciliation", 3, 1),
    b("logic:calculation-engine", "lg-je", "Journal entries & cash tax", "Tax account journal entries & cash-tax forecasts", 4, 1),
    b("logic:calculation-engine", "lg-variance", "Variance vs comparatives", "Compare with prior quarter, budget & prior-year return", 5, 1),
    b("source:manual-entry", "chk-judgment", "Judgment · assumptions", "Material movements, unsupported assumptions & required judgments", 5, 2),
    b("field:field-block", "fld-provision", "Current tax provision", "Manager view of the current provision", 6, 0),
    b("field:field-block", "fld-etr", "ETR reconciliation", "ETR view", 6, 1),
    b("output:excel-export", "out-provision", "Current tax provision", "Current tax provision", 7, 0),
    b("output:excel-export", "out-deferred", "Deferred tax schedules", "Deferred tax schedules", 7, 1),
    b("output:pdf-report", "out-etr", "ETR reconciliation", "ETR reconciliation", 7, 2),
    b("output:csv-export", "out-je", "Journal entries", "Tax account journal entries", 7, 3),
    b("output:pdf-report", "out-cashtax", "Cash-tax forecast", "Cash-tax forecast", 7, 4),
    b("output:evidence-pack", "out-review", "Variance & manager review report", "Variance & manager review report", 7, 5),
  ],
  edges: [
    e("start", "src-financials", "Start", "Manual start of the workflow", INITIATES),
    e("src-financials", "lg-current", "Financial data", "Compute current taxable income & tax"),
    e("src-attributes", "lg-current", "Attributes", "Roll forward differences & attributes"),
    e("src-intl", "lg-current", "Complex adjustments", "Integrate FAPI / EIFEL / credits / losses"),
    e("lg-current", "lg-deferred", "Current tax", "Compute deferred tax & rate effects"),
    e("lg-deferred", "lg-etr", "Deferred tax", "Build the ETR reconciliation"),
    e("lg-etr", "lg-je", "ETR", "Compute journal entries & cash tax"),
    e("lg-je", "lg-variance", "Journal entries", "Compare with comparatives"),
    e("src-prior", "lg-variance", "Comparatives", "Compare with prior quarter / budget / return"),
    e("chk-judgment", "lg-variance", "Judgment", "Professional decisions on assumptions"),
    e("lg-current", "fld-provision", "Current provision", "Show the current provision"),
    e("lg-etr", "fld-etr", "ETR", "Show the ETR reconciliation"),
    e("lg-current", "out-provision", "Current tax", "Produce the current tax provision", TO_PREVIEW),
    e("lg-deferred", "out-deferred", "Deferred tax", "Produce the deferred tax schedules", TO_PREVIEW),
    e("lg-etr", "out-etr", "ETR", "Produce the ETR reconciliation", TO_PREVIEW),
    e("lg-je", "out-je", "Journal entries", "Produce the journal entries", TO_PREVIEW),
    e("lg-je", "out-cashtax", "Cash tax", "Produce the cash-tax forecast", TO_PREVIEW),
    e("lg-variance", "out-review", "Variances", "Produce the variance & manager review report", TO_PREVIEW),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 2.9 Tax Attribute & Continuity Ledgers (Foundation)
// ─────────────────────────────────────────────────────────────────────────────
const ATTRIBUTE_LEDGERS: PortfolioWorkflowDef = {
  id: "pf-attribute-ledgers",
  name: "Tax Attribute & Continuity Ledgers",
  group: "foundation",
  sub: "Foundation · persistent reusable tax data layer",
  description:
    "Shared longitudinal ledger: create opening balances from prior returns and assessments, normalize each attribute by entity/jurisdiction/year/class/expiry, post approved movements, apply utilization and expiry rules, reconcile to returns and financial reporting, flag discontinuities, and lock approved year-end balances with evidence.",
  blocks: [
    b("trigger:manual", "start", "Start · Ledgers", "Manual start of the attribute-ledger workflow", 0, 0),
    b("source:pdf-document", "src-prior", "Prior returns & assessments", "Prior returns, workpapers, assessments & transaction records", 0, 1),
    b("source:database-query", "src-workflows", "Approved workflow movements", "Approved movements posted from tax workflows & transactions", 0, 2),
    b("source:excel-workbook", "src-financials", "Financial reporting", "Financial-reporting balances for reconciliation", 0, 3),
    b("ai:ai-search", "ai-extract", "Extract opening balances", "AI extraction of opening balances from prior documents (proposal-only)", 1, 1),
    b("logic:classification-mapping", "lg-normalize", "Normalize attributes", "By entity, jurisdiction, taxation year, class & expiry date", 2, 1),
    b("logic:category-rollup-aggregator", "lg-post", "Post movements", "Post approved movements & maintain balances", 3, 1),
    b("logic:calculation-engine", "lg-rules", "Apply utilization & expiry", "Utilization, expiry, limitation & succession rules", 4, 1),
    b("logic:calculation-engine", "lg-reconcile", "Reconcile balances", "Reconcile to returns, assessments & financial reporting", 5, 1),
    b("logic:classification-mapping", "lg-flag", "Flag discontinuities", "Unsupported balances, discontinuities & inconsistent carryforwards", 6, 2),
    b("source:manual-entry", "chk-lock", "Judgment · lock year-end", "Lock approved year-end balances with evidence & sign-offs", 5, 2),
    b("field:field-block", "fld-continuity", "Continuity views", "Available-balance & planning views", 6, 0),
    b("output:excel-export", "out-loss", "Loss continuity", "Loss continuity", 7, 0),
    b("output:excel-export", "out-cca", "CCA / UCC continuity", "CCA / UCC continuity", 7, 1),
    b("output:excel-export", "out-acbpuc", "ACB & PUC schedules", "ACB & PUC schedules", 7, 2),
    b("output:excel-export", "out-foreign", "Foreign tax & surplus balances", "Foreign tax & surplus balances", 7, 3),
    b("output:excel-export", "out-restricted", "Restricted interest continuity", "Restricted interest continuity", 7, 4),
    b("output:canonical-json", "out-ledger", "Locked ledger balances", "Lock approved balances to the shared tax ledger (write-back)", 8, 1),
  ],
  edges: [
    e("start", "src-prior", "Start", "Manual start of the workflow", INITIATES),
    e("src-prior", "ai-extract", "Prior documents", "Extract opening balances", TO_AI),
    e("ai-extract", "lg-normalize", "Extracted balances", "AI-proposed opening balances feed normalization", AI_MAP),
    e("src-prior", "lg-normalize", "Prior returns", "Create & normalize opening balances"),
    e("src-workflows", "lg-post", "Approved movements", "Post movements"),
    e("lg-normalize", "lg-post", "Normalized attributes", "Post movements"),
    e("lg-post", "lg-rules", "Balances", "Apply utilization & expiry rules"),
    e("lg-rules", "lg-reconcile", "Adjusted balances", "Reconcile balances"),
    e("src-financials", "lg-reconcile", "Financial reporting", "Reconcile to financial reporting"),
    e("lg-reconcile", "lg-flag", "Reconciled balances", "Flag discontinuities"),
    e("chk-lock", "lg-reconcile", "Lock decision", "Lock approved year-end balances"),
    e("lg-reconcile", "fld-continuity", "Balances", "Show the continuity views"),
    e("lg-rules", "out-loss", "Losses", "Produce loss continuity", TO_PREVIEW),
    e("lg-rules", "out-cca", "CCA / UCC", "Produce CCA / UCC continuity", TO_PREVIEW),
    e("lg-rules", "out-acbpuc", "ACB & PUC", "Produce ACB & PUC schedules", TO_PREVIEW),
    e("lg-rules", "out-foreign", "Foreign tax & surplus", "Produce foreign tax & surplus balances", TO_PREVIEW),
    e("lg-rules", "out-restricted", "Restricted interest", "Produce restricted interest continuity", TO_PREVIEW),
    e("lg-reconcile", "out-ledger", "Locked balances", "Lock balances to the shared ledger", TO_HANDOFF),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 2.10 Part XIII Withholding Tax (Tier 1)
// ─────────────────────────────────────────────────────────────────────────────
const PART_XIII: PortfolioWorkflowDef = {
  id: "pf-part-xiii",
  name: "Part XIII Withholding Tax",
  group: "tier1",
  sub: "Tier 1 · recurring cross-border payment compliance",
  description:
    "High-volume withholding workflow: extract payments to non-residents, match recipients to the counterparty master, classify payments and determine treaty rates, validate residence and beneficial ownership, calculate withholding and remittances, reconcile to source payments, prepare NR4 slips, and flag documentation and remittance exposure.",
  blocks: [
    b("trigger:manual", "start", "Start · Part XIII", "Manual start of the Part XIII workflow", 0, 0),
    b("source:excel-workbook", "src-payments", "Payments to non-residents", "Payments & accruals from AP, treasury & ledger systems", 0, 1),
    b("source:database-query", "src-graph", "Counterparty & entity master", "Recipient / counterparty master", 0, 2),
    b("source:pdf-document", "src-treaty", "Treaty documentation", "Residence, beneficial ownership & treaty documentation", 0, 3),
    b("source:manual-entry", "src-rules", "Treaty & rate rules", "Domestic withholding & treaty-rate rules", 0, 4),
    b("ai:ai-mapping-suggestion", "ai-classify", "Classify payments", "AI-assisted payment classification (proposal-only)", 1, 2),
    b("logic:classification-mapping", "lg-match", "Match recipients", "Match recipients to the entity & counterparty master", 1, 1),
    b("logic:classification-mapping", "lg-classify", "Classify & rate", "Dividends, interest, royalties, rents, services & treaty rates", 2, 1),
    b("logic:calculation-engine", "lg-validate", "Validate documentation", "Residence, beneficial ownership & required treaty documentation", 3, 1),
    b("logic:calculation-engine", "lg-calc", "Withholding & remittances", "Withholding, due dates & remittances", 4, 1),
    b("logic:calculation-engine", "lg-reconcile", "Reconcile remittances", "Reconcile to source payments & year-end reporting", 5, 1),
    b("source:manual-entry", "chk-judgment", "Judgment · treaty eligibility", "Professional decisions on treaty eligibility & exposure", 4, 2),
    b("field:field-block", "fld-withholding", "Withholding calculation", "Manager view of withholding", 6, 0),
    b("field:field-block", "fld-exposure", "Exposure", "Under-withholding & late-remittance exposure", 6, 1),
    b("output:excel-export", "out-calc", "Withholding calculation", "Withholding calculation", 7, 0),
    b("output:pdf-report", "out-calendar", "Remittance calendar", "Remittance calendar", 7, 1),
    b("output:taxprep-handoff", "out-nr4", "NR4 package", "NR4 slips & summaries", 7, 2),
    b("output:evidence-pack", "out-treaty", "Treaty support register", "Treaty support register", 7, 3),
    b("output:pdf-report", "out-exposure", "Exposure report", "Exposure report", 7, 4),
    b("output:evidence-pack", "out-review", "Manager review package", "Manager review package", 7, 5),
  ],
  edges: [
    e("start", "src-payments", "Start", "Manual start of the workflow", INITIATES),
    e("src-payments", "lg-match", "Payments", "Match recipients"),
    e("src-graph", "lg-match", "Counterparty master", "Match recipients"),
    e("src-payments", "ai-classify", "Payments", "Classify payments", TO_AI),
    e("ai-classify", "lg-classify", "Proposed categories", "AI-proposed categories feed classification", AI_MAP),
    e("lg-match", "lg-classify", "Matched recipients", "Classify & rate payments"),
    e("src-rules", "lg-classify", "Treaty rules", "Determine treaty rates"),
    e("lg-classify", "lg-validate", "Classified payments", "Validate documentation"),
    e("src-treaty", "lg-validate", "Treaty docs", "Validate residence & beneficial ownership"),
    e("lg-validate", "lg-calc", "Validated payments", "Calculate withholding & remittances"),
    e("chk-judgment", "lg-calc", "Judgment", "Professional decisions on treaty eligibility"),
    e("lg-calc", "lg-reconcile", "Withholding", "Reconcile remittances"),
    e("lg-calc", "fld-withholding", "Withholding", "Show the withholding calculation"),
    e("lg-reconcile", "fld-exposure", "Exposure", "Show exposure"),
    e("lg-calc", "out-calc", "Withholding", "Produce the withholding calculation", TO_PREVIEW),
    e("lg-calc", "out-calendar", "Due dates", "Produce the remittance calendar", TO_PREVIEW),
    e("lg-calc", "out-nr4", "NR4 data", "Produce the NR4 package", TO_HANDOFF),
    e("lg-validate", "out-treaty", "Treaty support", "Produce the treaty support register", TO_PREVIEW),
    e("lg-reconcile", "out-exposure", "Exposure", "Produce the exposure report", TO_PREVIEW),
    e("lg-reconcile", "out-review", "Reconciliation", "Produce the manager review package", TO_PREVIEW),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 2.11 Portfolio Tax Calendar, Client Requests & Review (Foundation)
// ─────────────────────────────────────────────────────────────────────────────
const PORTFOLIO_OPS: PortfolioWorkflowDef = {
  id: "pf-portfolio-ops",
  name: "Portfolio Tax Calendar, Client Requests & Review",
  group: "foundation",
  sub: "Foundation · portfolio-wide execution & exception management",
  description:
    "The operational layer: determine obligations and deadlines across every entity, create and assign workflow instances, generate tailored information requests, route client responses, monitor progress and review status, apply materiality/risk scoring, and preserve a complete audit trail feeding reusable facts forward.",
  blocks: [
    b("trigger:schedule", "start", "Schedule · Portfolio sweep", "Recurring sweep across the client & entity portfolio", 0, 0),
    b("source:database-query", "src-portfolio", "Client & entity portfolio", "All entities, obligations & applicable workflows", 0, 1),
    b("source:manual-entry", "src-deadlines", "Deadline rules", "Filing-obligation & deadline rules", 0, 2),
    b("source:pdf-document", "src-responses", "Client responses", "Client responses & supporting evidence", 0, 3),
    b("ai:ai-search", "ai-route", "Route evidence", "AI-assisted routing of responses to the right entity / issue / workpaper (proposal-only)", 1, 3),
    b("logic:calculation-engine", "lg-applicability", "Determine applicability & deadlines", "Applicable obligations & deadlines per entity & workflow", 1, 1),
    b("logic:classification-mapping", "lg-assign", "Create instances & assign", "Workflow instances; assign preparers / reviewers / managers", 2, 1),
    b("logic:classification-mapping", "lg-requests", "Generate information requests", "Tailored requests from missing workflow inputs", 3, 1),
    b("logic:hierarchy-aggregator", "lg-monitor", "Monitor progress", "Progress, blockers, overdue requests & review status", 4, 1),
    b("logic:calculation-engine", "lg-risk", "Materiality & risk scoring", "Prioritize professional attention", 5, 1),
    b("source:manual-entry", "chk-review", "Manager review queue", "Sign-offs, filing status, payment status & assessments", 5, 2),
    b("field:field-block", "fld-workplan", "Portfolio workplan", "Cross-client workplan view", 6, 0),
    b("field:field-block", "fld-queue", "Manager review queue", "Review queue & risk alerts", 6, 1),
    b("output:pdf-report", "out-workplan", "Portfolio workplan", "Portfolio workplan", 7, 0),
    b("output:excel-export", "out-outstanding", "Outstanding-information dashboard", "Outstanding-information dashboard", 7, 1),
    b("output:pdf-report", "out-queue", "Manager review queue", "Manager review queue", 7, 2),
    b("output:pdf-report", "out-alerts", "Deadline & risk alerts", "Deadline & risk alerts", 7, 3),
    b("output:pdf-report", "out-status", "Engagement status summaries", "Engagement status summaries", 7, 4),
    b("output:canonical-json", "out-audit", "Workflow audit trail", "Complete audit trail & reusable facts (write-back)", 8, 1),
  ],
  edges: [
    e("start", "src-portfolio", "Sweep", "Recurring portfolio sweep", INITIATES),
    e("src-portfolio", "lg-applicability", "Portfolio", "Determine applicability & deadlines"),
    e("src-deadlines", "lg-applicability", "Deadline rules", "Apply deadline rules"),
    e("lg-applicability", "lg-assign", "Obligations", "Create instances & assign"),
    e("lg-assign", "lg-requests", "Instances", "Generate information requests"),
    e("src-responses", "ai-route", "Client responses", "Route evidence", TO_AI),
    e("ai-route", "lg-monitor", "Routed evidence", "AI-routed responses feed monitoring", AI_MAP),
    e("lg-requests", "lg-monitor", "Requests", "Monitor progress"),
    e("lg-monitor", "lg-risk", "Progress", "Apply materiality & risk scoring"),
    e("chk-review", "lg-risk", "Sign-offs", "Track sign-offs & status"),
    e("lg-risk", "fld-workplan", "Prioritized work", "Show the portfolio workplan"),
    e("lg-risk", "fld-queue", "Review queue", "Show the review queue"),
    e("lg-assign", "out-workplan", "Assignments", "Produce the portfolio workplan", TO_PREVIEW),
    e("lg-requests", "out-outstanding", "Requests", "Produce the outstanding-information dashboard", TO_PREVIEW),
    e("lg-risk", "out-queue", "Prioritized items", "Produce the manager review queue", TO_PREVIEW),
    e("lg-applicability", "out-alerts", "Deadlines", "Produce deadline & risk alerts", TO_PREVIEW),
    e("lg-monitor", "out-status", "Status", "Produce engagement status summaries", TO_PREVIEW),
    e("lg-monitor", "out-audit", "Audit trail", "Preserve the audit trail & reusable facts", TO_HANDOFF),
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// Platform Services Addendum — shared services reused by every workflow.
// ═════════════════════════════════════════════════════════════════════════════

// Universal Execution Sequence (§1 reference execution pattern / addendum 8 phases)
const PLATFORM_SEQUENCE: PortfolioWorkflowDef = {
  id: "pf-platform-sequence",
  name: "Platform Services · Universal Execution Sequence",
  group: "platform",
  sub: "Platform · the reference execution pattern every workflow runs through",
  description:
    "The shared execution spine every standardized workflow follows: Scope → Tax Position Summary → Data Readiness → AI + Human Planning → Deterministic Execution → Review → Deliverables → Persist Knowledge. Each phase is a reusable platform service, not a workflow-specific feature.",
  blocks: [
    b("trigger:manual", "start", "Scope · start", "Determine applicability across the client & entity portfolio", 0, 0),
    b("source:database-query", "src-scope", "Scope Service", "Clients, entities, jurisdictions, foreign affiliates & taxation years", 0, 1),
    b("source:excel-workbook", "src-collect", "Data collection", "Collect structured data & retrieve supporting documents from connected systems", 1, 0),
    b("source:database-query", "src-rollforward", "Prior-year rollforward", "Open or roll forward instances using prior-year facts, mappings & positions", 1, 1),
    b("ai:ai-search", "ai-taxpos", "Tax Position Summary Service", "Manager-level briefing from prior returns, workpapers, memos & evidence (proposal-only)", 2, 2),
    b("logic:calculation-engine", "lg-readiness", "Data Readiness Service", "Normalize, reconcile & validate source data before tax processing begins", 2, 0),
    b("logic:classification-mapping", "lg-plan", "AI + Human Planning", "Plan the run; use AI only for fuzzy classification, extraction & drafting", 2, 1),
    b("logic:hierarchy-aggregator", "lg-execute", "Deterministic Workflow Execution", "Execute the deterministic rules & calculations authoritatively", 3, 0),
    b("source:manual-entry", "chk-judgment", "Professional judgment checkpoint", "Stop for focused professional decisions", 3, 1),
    b("logic:calculation-engine", "lg-review", "Review", "Run manager-level diagnostics; summarize only material exceptions & unsupported positions", 4, 0),
    b("field:field-block", "fld-summary", "Manager workpaper", "Manager-reviewable workpaper for the entity", 4, 1),
    b("output:evidence-pack", "out-deliverables", "Deliverables", "Standardized workpapers, forms, explanations & client requests", 5, 0),
    b("output:pdf-report", "out-signoff", "Sign-offs & lineage", "Record sign-offs, evidence lineage & final conclusions", 5, 1),
    b("output:canonical-json", "out-persist", "Persist Knowledge", "Write approved outputs back to shared tax ledgers & downstream workflows", 6, 0),
  ],
  edges: [
    e("start", "src-scope", "Scope", "Determine applicability", INITIATES),
    e("src-scope", "lg-readiness", "Scope object", "Assess data readiness"),
    e("src-collect", "lg-readiness", "Collected data", "Normalize, reconcile & validate"),
    e("src-rollforward", "lg-readiness", "Prior-year facts", "Roll forward facts & mappings"),
    e("src-collect", "ai-taxpos", "Documents", "Prepare the tax position summary", TO_AI),
    e("ai-taxpos", "lg-plan", "Briefing", "The tax position summary informs planning", AI_PROPOSE),
    e("lg-readiness", "lg-plan", "Validated data", "Plan the run"),
    e("lg-plan", "lg-execute", "Plan", "Execute deterministic rules & calculations"),
    e("chk-judgment", "lg-execute", "Judgment", "Professional decisions gate execution"),
    e("lg-execute", "lg-review", "Results", "Run manager review & diagnostics"),
    e("lg-review", "fld-summary", "Reviewed results", "Show the manager workpaper"),
    e("lg-review", "out-deliverables", "Approved results", "Generate the deliverables", TO_PREVIEW),
    e("lg-review", "out-signoff", "Sign-offs", "Record sign-offs & lineage", TO_PREVIEW),
    e("lg-review", "out-persist", "Approved outputs", "Persist knowledge to shared ledgers", TO_HANDOFF),
  ],
};

// Scope Service (addendum §1)
const SCOPE_SERVICE: PortfolioWorkflowDef = {
  id: "pf-scope-service",
  name: "Platform Services · Scope Service",
  group: "platform",
  sub: "Platform · dynamic scope selection → validated Scope object",
  description:
    "Every workflow starts by declaring the parameters it requires; the Scope Service dynamically resolves clients, taxation years, entities/jurisdictions/foreign affiliates and full- vs partial-group execution into a validated Scope object returned to the workflow.",
  blocks: [
    b("trigger:manual", "start", "Open scope", "Declare the parameters the workflow requires", 0, 0),
    b("source:database-query", "src-clients", "Clients", "Select one or many clients", 0, 1),
    b("source:manual-entry", "src-years", "Taxation years", "Select one or many taxation years", 0, 2),
    b("source:database-query", "src-entities", "Entities & foreign affiliates", "Entities, jurisdictions & foreign affiliates", 1, 1),
    b("source:manual-entry", "src-params", "Workflow parameters", "Parameters the workflow declares — full-group or partial-group execution", 1, 2),
    b("logic:classification-mapping", "lg-resolve", "Resolve scope", "Resolve clients → affiliates → years into a scope set", 2, 0),
    b("logic:calculation-engine", "lg-validate", "Validate scope", "Validate the selection (full-group or partial-group execution)", 3, 0),
    b("field:field-block", "fld-scope", "Scope preview", "Preview of the resolved scope", 3, 1),
    b("output:canonical-json", "out-scope", "Validated Scope object", "Return a validated Scope object to the workflow", 4, 0),
  ],
  edges: [
    e("start", "src-clients", "Open scope", "Declare parameters", INITIATES),
    e("src-clients", "lg-resolve", "Clients", "Resolve scope"),
    e("src-years", "lg-resolve", "Taxation years", "Resolve scope"),
    e("src-entities", "lg-resolve", "Entities & affiliates", "Resolve scope"),
    e("lg-resolve", "lg-validate", "Resolved scope", "Validate scope"),
    e("src-params", "lg-validate", "Parameters", "Apply full/partial-group rules"),
    e("lg-validate", "fld-scope", "Validated scope", "Show the scope preview"),
    e("lg-validate", "out-scope", "Scope object", "Return the validated Scope object", TO_HANDOFF),
  ],
};

// Tax Position Summary Service (addendum §2)
const TAX_POSITION_SUMMARY: PortfolioWorkflowDef = {
  id: "pf-tax-position-summary",
  name: "Platform Services · Tax Position Summary Service",
  group: "platform",
  sub: "Platform · manager-level briefing from prior-year evidence",
  description:
    "After scope selection, an agent prepares a manager-level briefing from prior-year returns, workpapers, memos, review notes and evidence — surfacing client facts, historical tax positions, continuing assumptions, outstanding risks, prior deliverables, and evidence cited back to source documents.",
  blocks: [
    b("trigger:manual", "start", "Prepare briefing", "Prepare a manager-level briefing after scope selection", 0, 0),
    b("source:pdf-document", "src-returns", "Prior-year returns", "Prior-year tax returns & workpapers", 0, 1),
    b("source:pdf-document", "src-memos", "Memos & review notes", "Memos, review notes & supporting evidence", 0, 2),
    b("source:database-query", "src-scope", "Scope & client facts", "Client structure, jurisdictions, ownership, business & currencies", 0, 3),
    b("ai:ai-search", "ai-brief", "Draft briefing", "AI drafts the manager briefing with citations to source documents (proposal-only)", 1, 1),
    b("logic:classification-mapping", "lg-positions", "Historical tax positions", "e.g. 95(2)(b), surplus methodology, transfer pricing, EIFEL elections", 2, 0),
    b("logic:classification-mapping", "lg-assumptions", "Assumptions & open issues", "Continuing assumptions, outstanding risks & open issues", 3, 0),
    b("source:manual-entry", "chk-review", "Judgment · confirm positions", "Manager confirms carried-forward positions & assumptions", 3, 1),
    b("field:field-block", "fld-brief", "Manager briefing", "The manager-level briefing view", 4, 0),
    b("output:pdf-report", "out-brief", "Tax position summary", "Manager-level briefing with evidence citations", 5, 0),
    b("output:evidence-pack", "out-evidence", "Evidence index", "Evidence with citations back to source documents", 5, 1),
  ],
  edges: [
    e("start", "src-returns", "Prepare briefing", "Prepare the briefing", INITIATES),
    e("src-returns", "ai-brief", "Prior returns", "Draft the briefing", TO_AI),
    e("src-memos", "ai-brief", "Memos & notes", "Draft the briefing", TO_AI),
    e("ai-brief", "lg-positions", "Draft briefing", "Structure the historical positions", AI_PROPOSE),
    e("src-scope", "lg-positions", "Client facts", "Ground positions in client facts"),
    e("lg-positions", "lg-assumptions", "Positions", "Carry forward assumptions & open issues"),
    e("chk-review", "lg-assumptions", "Confirmation", "Manager confirms carried-forward positions"),
    e("lg-assumptions", "fld-brief", "Briefing", "Show the manager briefing"),
    e("lg-assumptions", "out-brief", "Briefing", "Produce the tax position summary", TO_PREVIEW),
    e("lg-positions", "out-evidence", "Evidence", "Produce the evidence index", TO_HANDOFF),
  ],
};

// Data Readiness Service (addendum §3)
const DATA_READINESS: PortfolioWorkflowDef = {
  id: "pf-data-readiness",
  name: "Platform Services · Data Readiness Service",
  group: "platform",
  sub: "Platform · engagement readiness score before execution",
  description:
    "Before execution, the platform determines whether the engagement is ready — trial balances received/missing, financial statements received, OCR requirements, FX rates loaded, missing transfer-pricing reports, outstanding client responses — and computes an overall readiness score.",
  blocks: [
    b("trigger:manual", "start", "Assess readiness", "Determine whether the engagement is ready before execution", 0, 0),
    b("source:excel-workbook", "src-tb", "Trial balances", "Trial balances received / missing", 0, 1),
    b("source:pdf-document", "src-fs", "Financial statements", "Financial statements received", 0, 2),
    b("source:currency-rate", "src-fx", "FX rates", "FX rates loaded", 0, 3),
    b("source:pdf-document", "src-tp", "Transfer-pricing reports", "Transfer-pricing reports received / missing", 1, 2),
    b("source:database-query", "src-responses", "Client responses", "Outstanding client responses", 1, 3),
    b("ai:ai-search", "ai-ocr", "OCR / extraction check", "OCR requirements & extraction from received documents (proposal-only)", 1, 1),
    b("logic:classification-mapping", "lg-check", "Check received vs required", "Reconcile received vs required inputs across the engagement", 2, 0),
    b("logic:calculation-engine", "lg-score", "Readiness score", "Compute an overall readiness score", 3, 0),
    b("source:manual-entry", "chk-review", "Judgment · proceed / hold", "Professional decision to proceed or hold pending inputs", 3, 1),
    b("field:field-block", "fld-readiness", "Readiness dashboard", "Received / missing status & readiness score", 4, 0),
    b("output:pdf-report", "out-readiness", "Data readiness assessment", "Readiness report with a missing-item list", 4, 1),
    b("output:csv-export", "out-requests", "Outstanding-information request", "Requests for the missing items", 4, 2),
  ],
  edges: [
    e("start", "src-tb", "Assess readiness", "Assess readiness", INITIATES),
    e("src-tb", "lg-check", "Trial balances", "Check received vs required"),
    e("src-fs", "lg-check", "Financial statements", "Check received vs required"),
    e("src-fx", "lg-check", "FX rates", "Check received vs required"),
    e("src-tp", "lg-check", "TP reports", "Check received vs required"),
    e("src-responses", "lg-check", "Client responses", "Check received vs required"),
    e("src-fs", "ai-ocr", "Documents", "Check OCR / extraction", TO_AI),
    e("ai-ocr", "lg-check", "Extraction status", "OCR status feeds the readiness check", AI_PROPOSE),
    e("lg-check", "lg-score", "Received vs required", "Compute the readiness score"),
    e("chk-review", "lg-score", "Proceed / hold", "Professional proceed / hold decision"),
    e("lg-score", "fld-readiness", "Readiness", "Show the readiness dashboard"),
    e("lg-score", "out-readiness", "Readiness score", "Produce the data readiness assessment", TO_PREVIEW),
    e("lg-check", "out-requests", "Missing items", "Produce the outstanding-information request", TO_PREVIEW),
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Registry — ordered for the builder's template menu (platform first, then
// foundation, then Tier 1).
// ─────────────────────────────────────────────────────────────────────────────
export const PORTFOLIO_WORKFLOWS: PortfolioWorkflowDef[] = [
  PLATFORM_SEQUENCE,
  SCOPE_SERVICE,
  TAX_POSITION_SUMMARY,
  DATA_READINESS,
  OWNERSHIP_GRAPH,
  ATTRIBUTE_LEDGERS,
  PORTFOLIO_OPS,
  T1134,
  FAPI,
  SURPLUS,
  T106,
  EIFEL,
  T2_SUITE,
  TAX_PROVISION,
  PART_XIII,
];

export function getPortfolioWorkflowDef(id: string): PortfolioWorkflowDef | null {
  return PORTFOLIO_WORKFLOWS.find((w) => w.id === id) ?? null;
}
