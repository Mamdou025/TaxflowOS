import type { BlockCatalogItem as DomainBlockCatalogItem } from "../src/domain/workflow/block-catalog";
import {
  BLOCK_FAMILY_STAGE as DOMAIN_BLOCK_FAMILY_STAGE,
  FISCAL_STAGE_OPTIONS as DOMAIN_FISCAL_STAGE_OPTIONS,
} from "../src/domain/workflow/block-catalog";
import type {
  BlockFamily as DomainBlockFamily,
  BlockRunStatus as DomainBlockRunStatus,
  BlockStatus as DomainBlockStatus,
  BlockSubtype as DomainBlockSubtype,
  FiscalStage as DomainFiscalStage,
  WorkflowDefinitionStatus as DomainWorkflowDefinitionStatus,
} from "../src/domain/workflow/block-types";
import type {
  EdgeBindingStatus as DomainEdgeBindingStatus,
  EdgeStatus as DomainEdgeStatus,
  WorkflowEdgeHistoryEntry as DomainWorkflowEdgeHistoryEntry,
  WorkflowRelationshipType as DomainWorkflowRelationshipType,
} from "../src/domain/workflow/edge-types";
import {
  CANDIDATE_OUTPUT_RELATIONSHIP_TYPES as DOMAIN_CANDIDATE_OUTPUT_RELATIONSHIP_TYPES,
  EDGE_BINDING_STATUS_VALUES as DOMAIN_EDGE_BINDING_STATUS_VALUES,
  EDGE_STATUS_VALUES as DOMAIN_EDGE_STATUS_VALUES,
  GOVERNED_OUTPUT_RELATIONSHIP_TYPES as DOMAIN_GOVERNED_OUTPUT_RELATIONSHIP_TYPES,
  OUTPUT_MAPPING_RELATIONSHIP_TYPES as DOMAIN_OUTPUT_MAPPING_RELATIONSHIP_TYPES,
  WORKFLOW_RELATIONSHIP_LABELS as DOMAIN_WORKFLOW_RELATIONSHIP_LABELS,
  WORKFLOW_RELATIONSHIP_TYPES as DOMAIN_WORKFLOW_RELATIONSHIP_TYPES,
  isCandidateOutputRelationshipType as domainIsCandidateOutputRelationshipType,
  isGovernedOutputRelationshipType as domainIsGovernedOutputRelationshipType,
  isOutputMappingRelationshipType as domainIsOutputMappingRelationshipType,
} from "../src/domain/workflow/edge-types";
import { getProtectedKindForSubtype } from "../src/domain/workflow/protected-rules";
import {
  LOGIC_OUTPUT_GOVERNANCE_WARNING as DOMAIN_LOGIC_OUTPUT_GOVERNANCE_WARNING,
  getAllowedRelationshipTypesForFamilies,
} from "../src/domain/workflow/workflow-rules";
import type {
  AiProposal as DomainAiProposal,
  AiProposalHistoryEntry as DomainAiProposalHistoryEntry,
  AiProposalStatus as DomainAiProposalStatus,
  BlockRun as DomainBlockRun,
  GovernanceMetadata as DomainGovernanceMetadata,
  LocalExecutionLog as DomainLocalExecutionLog,
  LocalRunRecord as DomainLocalRunRecord,
  LocalWorkflowExecution as DomainLocalWorkflowExecution,
  LocalWorkflowSnapshot as DomainLocalWorkflowSnapshot,
  OutputMappingPreview as DomainOutputMappingPreview,
  OutputMappingPreviewItem as DomainOutputMappingPreviewItem,
  PendingWorkflowConnection as DomainPendingWorkflowConnection,
  RuntimeUiConfig as DomainRuntimeUiConfig,
  RuntimeUiRow as DomainRuntimeUiRow,
  RuntimeUiSection as DomainRuntimeUiSection,
  RuntimeVisibility as DomainRuntimeVisibility,
  SourceMetadata as DomainSourceMetadata,
  WorkflowBlock as DomainWorkflowBlock,
  WorkflowCodeField as DomainWorkflowCodeField,
  WorkflowDefinition as DomainWorkflowDefinition,
  WorkflowDraft as DomainWorkflowDraft,
  WorkflowEdge as DomainWorkflowEdge,
  WorkflowEvent as DomainWorkflowEvent,
  WorkflowEventType as DomainWorkflowEventType,
  WorkflowFormulaField as DomainWorkflowFormulaField,
  WorkflowPosition as DomainWorkflowPosition,
  WorkflowStructure as DomainWorkflowStructure,
  WorkflowVersionSnapshot as DomainWorkflowVersionSnapshot,
} from "../src/domain/workflow/workflow-types";
import {
  AI_PROPOSAL_STATUS_VALUES as DOMAIN_AI_PROPOSAL_STATUS_VALUES,
  WORKFLOW_EVENT_TYPES as DOMAIN_WORKFLOW_EVENT_TYPES,
  WORKFLOW_SCHEMA_VERSION as DOMAIN_WORKFLOW_SCHEMA_VERSION,
} from "../src/domain/workflow/workflow-types";
import {
  EXPANDED_MAPPING_PIPELINE_BLOCK_SPECS,
  EXPANDED_MAPPING_PIPELINE_EDGE_SPECS,
} from "./workflow/sample-workflows/expanded-mapping-pipeline-demo";
import {
  WORKING_SOURCE_DEMO_BLOCK_SPECS,
  WORKING_SOURCE_DEMO_EDGE_SPECS,
} from "./workflow/sample-workflows/working-source-rules-demo";
import {
  FAPI_TEMPLATE_BLOCK_SPECS,
  FAPI_TEMPLATE_EDGE_SPECS,
} from "./workflow/sample-workflows/fapi-template";
import {
  ROULEMENT_FISCAL_BLOCK_SPECS,
  ROULEMENT_FISCAL_EDGE_SPECS,
} from "./workflow/sample-workflows/roulement-fiscal-template";
import type {
  WorkflowEdge as CanvasWorkflowEdge,
  WorkflowNode,
  WorkflowNodeType,
} from "./workflow-store";

export type BlockCatalogItem = DomainBlockCatalogItem;
export type BlockFamily = DomainBlockFamily;
export type BlockRunStatus = DomainBlockRunStatus;
export type BlockStatus = DomainBlockStatus;
export type BlockSubtype = DomainBlockSubtype;
export type FiscalStage = DomainFiscalStage;
export type WorkflowDefinitionStatus = DomainWorkflowDefinitionStatus;
export type EdgeBindingStatus = DomainEdgeBindingStatus;
export type EdgeStatus = DomainEdgeStatus;
export type WorkflowEdgeHistoryEntry = DomainWorkflowEdgeHistoryEntry;
export type WorkflowRelationshipType = DomainWorkflowRelationshipType;
export type AiProposal = DomainAiProposal;
export type AiProposalHistoryEntry = DomainAiProposalHistoryEntry;
export type AiProposalStatus = DomainAiProposalStatus;
export type BlockRun = DomainBlockRun;
export type GovernanceMetadata = DomainGovernanceMetadata;
export type LocalExecutionLog = DomainLocalExecutionLog;
export type LocalRunRecord = DomainLocalRunRecord;
export type LocalWorkflowExecution = DomainLocalWorkflowExecution;
export type LocalWorkflowSnapshot = DomainLocalWorkflowSnapshot;
export type OutputMappingPreview = DomainOutputMappingPreview;
export type OutputMappingPreviewItem = DomainOutputMappingPreviewItem;
export type PendingWorkflowConnection = DomainPendingWorkflowConnection;
export type RuntimeUiConfig = DomainRuntimeUiConfig;
export type RuntimeUiRow = DomainRuntimeUiRow;
export type RuntimeUiSection = DomainRuntimeUiSection;
export type RuntimeVisibility = DomainRuntimeVisibility;
export type SourceMetadata = DomainSourceMetadata;
export type WorkflowBlock = DomainWorkflowBlock;
export type WorkflowCodeField = DomainWorkflowCodeField;
export type WorkflowDefinition = DomainWorkflowDefinition;
export type WorkflowDraft = DomainWorkflowDraft;
export type WorkflowEdge = DomainWorkflowEdge;
export type WorkflowEvent = DomainWorkflowEvent;
export type WorkflowEventType = DomainWorkflowEventType;
export type WorkflowFormulaField = DomainWorkflowFormulaField;
export type WorkflowPosition = DomainWorkflowPosition;
export type WorkflowStructure = DomainWorkflowStructure;
export type WorkflowVersionSnapshot = DomainWorkflowVersionSnapshot;

export const BLOCK_FAMILY_STAGE = DOMAIN_BLOCK_FAMILY_STAGE;
export const FISCAL_STAGE_OPTIONS = DOMAIN_FISCAL_STAGE_OPTIONS;
export const CANDIDATE_OUTPUT_RELATIONSHIP_TYPES =
  DOMAIN_CANDIDATE_OUTPUT_RELATIONSHIP_TYPES;
export const EDGE_BINDING_STATUS_VALUES = DOMAIN_EDGE_BINDING_STATUS_VALUES;
export const EDGE_STATUS_VALUES = DOMAIN_EDGE_STATUS_VALUES;
export const GOVERNED_OUTPUT_RELATIONSHIP_TYPES =
  DOMAIN_GOVERNED_OUTPUT_RELATIONSHIP_TYPES;
export const OUTPUT_MAPPING_RELATIONSHIP_TYPES =
  DOMAIN_OUTPUT_MAPPING_RELATIONSHIP_TYPES;
export const WORKFLOW_RELATIONSHIP_LABELS = DOMAIN_WORKFLOW_RELATIONSHIP_LABELS;
export const WORKFLOW_RELATIONSHIP_TYPES = DOMAIN_WORKFLOW_RELATIONSHIP_TYPES;
export const isCandidateOutputRelationshipType =
  domainIsCandidateOutputRelationshipType;
export const isGovernedOutputRelationshipType =
  domainIsGovernedOutputRelationshipType;
export const isOutputMappingRelationshipType =
  domainIsOutputMappingRelationshipType;
export const LOGIC_OUTPUT_GOVERNANCE_WARNING =
  DOMAIN_LOGIC_OUTPUT_GOVERNANCE_WARNING;

const AI_PROPOSAL_STATUS_VALUES = DOMAIN_AI_PROPOSAL_STATUS_VALUES;
const WORKFLOW_EVENT_TYPES = DOMAIN_WORKFLOW_EVENT_TYPES;

export const LOCAL_WORKFLOW_ID = "local-fiscal-studio";
export const LOCAL_WORKFLOW_STORAGE_KEY = "workflow-studio.local-workflow";
export const LOCAL_RUNS_STORAGE_KEY = "workflow-studio.local-runs";
export const LOCAL_WORKFLOW_SCHEMA_VERSION = DOMAIN_WORKFLOW_SCHEMA_VERSION;

const SYSTEM_USER = "workflow-studio";
const SAMPLE_CREATED_AT = "2026-04-28T12:00:00.000Z";

export const BLOCK_CATALOG: BlockCatalogItem[] = [
  {
    id: "trigger:manual",
    family: "Trigger",
    subtype: "Manual / On Demand",
    label: "Manual Trigger",
    description: "Start the workflow manually on demand",
    defaultConfig: {
      fiscalStage: "trigger",
      blockFamily: "Trigger",
      outputs: "triggerPayload",
    },
  },
  {
    id: "trigger:schedule",
    family: "Trigger",
    subtype: "Schedule / Cron",
    label: "Schedule Trigger",
    description: "Fire the workflow on a recurring schedule or cron expression",
    defaultConfig: {
      fiscalStage: "trigger",
      blockFamily: "Trigger",
      schedule: "0 9 * * 1",
      outputs: "triggerPayload",
    },
  },
  {
    id: "trigger:webhook",
    family: "Trigger",
    subtype: "Webhook / API Event",
    label: "Webhook Trigger",
    description: "Fire the workflow when an inbound HTTP event is received",
    defaultConfig: {
      fiscalStage: "trigger",
      blockFamily: "Trigger",
      outputs: "triggerPayload",
    },
  },
  {
    id: "source:manual-entry",
    family: "Source",
    subtype: "Manual Entry",
    label: "Manual Entry",
    description: "Evidence value entered by a builder or reviewer",
    defaultConfig: {
      owner: "Builder",
      inputs: "manual value",
      outputs: "manualEntry",
      rulebookRef: "Manual source values are locked as evidence.",
      sourceLocator: "manual-entry",
      toolId: "source.manual_value",
    },
  },
  {
    id: "source:excel-workbook",
    family: "Source",
    subtype: "Excel / Workbook",
    label: "Excel / Workbook",
    description: "Workbook, worksheet, named range, or tabular evidence",
    defaultConfig: {
      owner: "Tax Operations",
      inputs: "workbook",
      outputs: "workbookRows",
      rulebookRef: "Workbook rows are immutable source evidence.",
      sourceLocator: "workbook://sheet/range",
      toolId: "source.manual_table",
    },
  },
  {
    id: "source:pdf-document",
    family: "Source",
    subtype: "PDF / Document",
    label: "PDF / Document",
    description: "Document, statement, note, schedule, or support package",
    defaultConfig: {
      owner: "Tax Operations",
      inputs: "document",
      outputs: "documentEvidence",
      rulebookRef: "Document facts are referenced, not overwritten.",
      sourceLocator: "document://page/section",
      toolId: "source.manual_value",
    },
  },
  {
    id: "source:api-http-request",
    family: "Source",
    subtype: "API / HTTP Request",
    label: "API / HTTP Request",
    description: "Reference value fetched from an external API",
    defaultConfig: {
      owner: "Tax Operations",
      inputs: "request",
      outputs: "apiReference",
      rulebookRef: "API responses are stored as reference evidence.",
      sourceLocator: "https://api.example.test/reference",
      toolId: "source.manual_value",
    },
  },
  {
    id: "source:currency-rate",
    family: "Source",
    subtype: "Currency Rate",
    label: "Bank of Canada FX Rate",
    description: "External FX rate reference for local calculation",
    defaultConfig: {
      documentCurrency: "USD",
      fapiYear: 2025,
      inputs: "Bank of Canada rate lookup",
      outputs: "exchange_rate, rate_metadata",
      overrideRate: 1.35,
      rateProvider: "bank_of_canada",
      rateType: "annual_average",
      reportingCurrency: "CAD",
      rulebookRef:
        "FX rates are captured as source references, then reviewed/protected downstream.",
      sourceKind: "currency_rate",
      sourceLocator: "bank-of-canada://annual-average/USD-CAD",
      toolId: "source.currency_rate",
    },
  },
  {
    id: "source:database-query",
    family: "Source",
    subtype: "Database Query",
    label: "Database Query",
    description: "Read-only query result used as workflow evidence",
    defaultConfig: {
      owner: "Data Operations",
      inputs: "read-only query",
      outputs: "queryRows",
      rulebookRef: "Database source rows are immutable in the builder.",
      sourceLocator: "database://connection/query",
      toolId: "source.manual_table",
    },
  },
  {
    id: "source:web-url",
    family: "Source",
    subtype: "Web / URL",
    label: "Web / URL",
    description: "Reference page or URL captured as evidence",
    defaultConfig: {
      owner: "Research",
      inputs: "url",
      outputs: "webReference",
      rulebookRef: "Web references are captured as source evidence.",
      sourceLocator: "https://example.test/source",
      toolId: "source.manual_value",
    },
  },
  {
    id: "source:ai-search-result",
    family: "Source",
    subtype: "AI Search Result",
    label: "AI Search Result",
    description: "Search result proposed by an AI or agent, then reviewed",
    defaultConfig: {
      owner: "Review",
      inputs: "reviewed search result",
      outputs: "aiSearchEvidence",
      rulebookRef: "AI search results require downstream review.",
      sourceLocator: "proposal://ai-search-result",
      toolId: "source.manual_value",
    },
  },
  {
    id: "source:keyword-rules",
    family: "Source",
    subtype: "Keyword Rules",
    label: "Keyword Rulebook",
    description: "Editable keyword-to-category rulebook for mapping review",
    defaultConfig: {
      keywordRules: [
        {
          categoryId: "interest_income",
          categoryLabel: "Interest Income",
          confidence: 0.9,
          keywords: ["interest income", "interest earned", "bank interest"],
          ruleId: "keyword-rule-interest-income",
          suggestedLine: "A",
        },
        {
          categoryId: "rental_income",
          categoryLabel: "Rental Income",
          confidence: 0.9,
          keywords: ["rental income", "rent income", "lease income"],
          ruleId: "keyword-rule-rents",
          suggestedLine: "A",
        },
        {
          categoryId: "bank_fees",
          categoryLabel: "Bank Fees",
          confidence: 0.8,
          keywords: ["bank charges", "office expenses", "general expenses"],
          ruleId: "keyword-rule-general-expenses",
          suggestedLine: "EXPENSES",
        },
        {
          categoryId: "professional_fees",
          categoryLabel: "Professional Fees",
          confidence: 0.8,
          keywords: ["professional fees", "accounting fees", "audit fees"],
          ruleId: "keyword-rule-accounting-expenses",
          suggestedLine: "EXPENSES",
        },
        {
          categoryId: "other_income",
          categoryLabel: "Other Income",
          confidence: 0.7,
          keywords: ["other revenue", "miscellaneous income", "sundry income"],
          ruleId: "keyword-rule-other-fapi-income",
          suggestedLine: "A",
        },
      ],
      owner: "Fiscal Systems",
      inputs: "draft keyword rulebook",
      outputs: "keyword_rules, rule_metadata, rule_version",
      rulebookRef:
        "Keyword rulebooks are editable in draft and versioned after use.",
      sourceKind: "keyword_rules",
      sourceLocator: "manual-source://keyword-rules",
      toolId: "source.keyword_rules",
    },
  },
  {
    id: "source:aggregation-rules",
    family: "Source",
    subtype: "Aggregation Rules",
    label: "Aggregation Rulebook",
    description: "Editable rollup and formula rulebook for calculation review",
    defaultConfig: {
      aggregationRules: [
        {
          children: [],
          description: "Base income rollup from mapped atomic categories.",
          includeCategoryIds: [
            "interest_income",
            "rental_income",
            "service_income",
            "other_income",
          ],
          label: "Income Base",
          nodeId: "income_base",
          nodeType: "group",
          operation: "sum",
          order: 10,
        },
        {
          children: [],
          description: "Base expense rollup from mapped atomic categories.",
          includeCategoryIds: [
            "bank_fees",
            "professional_fees",
            "interest_expense",
          ],
          label: "Expense Base",
          nodeId: "expense_base",
          nodeType: "group",
          operation: "sum",
          order: 20,
        },
        {
          children: [],
          description: "Demonstrates subtracting one rollup from another.",
          label: "Income After Expenses",
          nodeId: "income_after_expenses",
          nodeType: "group",
          operands: [
            { label: "Income Base", refId: "income_base", refType: "node" },
            { label: "Expense Base", refId: "expense_base", refType: "node" },
          ],
          operation: "subtract",
          order: 30,
        },
        {
          children: [],
          description: "Draft adjustment factor used by Result Z.",
          label: "Z Adjustment Factor",
          nodeId: "z_adjustment_factor",
          nodeType: "constant",
          operation: "pass_through",
          order: 40,
          value: 1,
        },
        {
          children: [],
          label: "Result Z",
          nodeId: "Z",
          nodeType: "final_result",
          operands: [
            { label: "Income Base", refId: "income_base", refType: "node" },
            {
              label: "Z Adjustment Factor",
              refId: "z_adjustment_factor",
              refType: "node",
            },
          ],
          operation: "multiply",
          order: 50,
          resultName: "Z",
        },
        {
          children: [],
          label: "Result W",
          nodeId: "W",
          nodeType: "final_result",
          operands: [
            { label: "Expense Base", refId: "expense_base", refType: "node" },
          ],
          operation: "sum",
          order: 60,
          resultName: "W",
        },
        {
          children: [],
          description: "Demonstrates addition of two rollups.",
          label: "Optional Check Total",
          nodeId: "optional_check_total",
          nodeType: "formula",
          operands: [
            { label: "Income Base", refId: "income_base", refType: "node" },
            { label: "Expense Base", refId: "expense_base", refType: "node" },
          ],
          operation: "add",
          order: 70,
        },
      ],
      owner: "Fiscal Systems",
      inputs: "draft aggregation rulebook",
      outputs:
        "aggregation_rules, aggregation_tree, rule_metadata, rule_version",
      rulebookRef:
        "Aggregation rulebooks are editable in draft and versioned after use.",
      sourceKind: "aggregation_rules",
      sourceLocator: "manual-source://aggregation-rules",
      toolId: "source.aggregation_rules",
    },
  },
  {
    id: "source:rollup-rules",
    family: "Source",
    subtype: "Rollup Rules",
    label: "Rollup Rules Source",
    description: "Editable rulebook for grouping mapped categories into totals",
    defaultConfig: {
      owner: "Fiscal Systems",
      inputs: "draft rollup rulebook",
      outputs: "rollup_rules, rule_metadata, rule_version",
      rollupRules: [
        {
          description: "Adds income mapped categories.",
          includeCategoryIds: [
            "interestIncome",
            "rents",
            "royalties",
            "dividends",
            "otherFapiIncome",
          ],
          label: "Income Bucket",
          operation: "sum",
          rollupId: "income_bucket",
        },
        {
          description: "Adds expenses using absolute values.",
          includeCategoryIds: [
            "generalExpenses",
            "legalExpenses",
            "accountingExpenses",
          ],
          label: "Expense Bucket",
          operation: "sum_abs",
          rollupId: "expense_bucket",
        },
      ],
      rulebookRef:
        "Rollup rulebooks group mapped categories without owning final formulas.",
      sourceKind: "rollup_rules",
      sourceLocator: "manual-source://rollup-rules",
      toolId: "source.rollup_rules",
    },
  },
  {
    id: "source:calculation-rules",
    family: "Source",
    subtype: "Calculation Rules",
    label: "Calculation Rules Source",
    description:
      "Editable formula rules over named rollup and protected inputs",
    defaultConfig: {
      calculationRules: [
        {
          calculationId: "A",
          description: "A = max(income_bucket - expense_bucket, 0)",
          label: "A",
          operands: ["income_bucket", "expense_bucket"],
          operation: "max_subtract_zero",
          resultKey: "A",
        },
        {
          calculationId: "GROSS",
          description: "Gross = A + A1 + A2 + B + C",
          label: "Gross",
          operands: ["A", "A1", "A2", "B", "C"],
          operation: "add",
          resultKey: "GROSS",
        },
        {
          calculationId: "DEDUCTIONS",
          description: "Deductions = D + E + F + F1 + G + H",
          label: "Deductions",
          operands: ["D", "E", "F", "F1", "G", "H"],
          operation: "add",
          resultKey: "DEDUCTIONS",
        },
        {
          calculationId: "FAPI_BRUT",
          description: "FAPI Brut = max(GROSS - DEDUCTIONS, 0)",
          label: "FAPI Brut",
          operands: ["GROSS", "DEDUCTIONS"],
          operation: "max_subtract_zero",
          resultKey: "FAPI_BRUT",
        },
        {
          calculationId: "FAT_DEDUCTION",
          description: "FAT Deduction = min(max(FAT_PAID, 0) * RTF, FAPI_BRUT)",
          label: "FAT Deduction",
          operands: ["FAT_PAID", "RTF", "FAPI_BRUT"],
          operation: "min_multiply_cap",
          resultKey: "FAT_DEDUCTION",
        },
        {
          calculationId: "NET_FAPI",
          description: "Net FAPI = max(FAPI_BRUT - FAT_DEDUCTION, 0)",
          label: "Net FAPI",
          operands: ["FAPI_BRUT", "FAT_DEDUCTION"],
          operation: "max_subtract_zero",
          resultKey: "NET_FAPI",
        },
        {
          calculationId: "NET_FAPI_CAD",
          description: "Net FAPI CAD = NET_FAPI * FX_RATE",
          label: "Net FAPI CAD",
          operands: ["NET_FAPI", "FX_RATE"],
          operation: "multiply",
          resultKey: "NET_FAPI_CAD",
        },
      ],
      owner: "Fiscal Systems",
      inputs: "draft calculation rulebook",
      outputs: "calculation_rules, rule_metadata, rule_version",
      rulebookRef:
        "Calculation rulebooks define formulas over named values without changing Sources.",
      sourceKind: "calculation_rules",
      sourceLocator: "manual-source://calculation-rules",
      toolId: "source.calculation_rules",
    },
  },
  {
    id: "logic:hierarchy-aggregator",
    family: "Logic",
    subtype: "Hierarchy Aggregator",
    label: "Rollup & Calculation Engine",
    description:
      "Roll up mapped categories and calculate formula/final result nodes",
    defaultConfig: {
      owner: "Fiscal Systems",
      inputs: "mapped_rows, aggregation_rules",
      operation: "sum",
      outputs:
        "category_totals, node_totals, group_totals, final_totals, aggregation_tree, formula_trace",
      rulebookRef:
        "Rollup & Calculation Engine applies Source aggregation rules without mutating source rows.",
      toolGroup: "calculation",
      toolId: "logic.hierarchy_aggregator",
    },
  },
  {
    id: "logic:category-rollup-aggregator",
    family: "Logic",
    subtype: "Category Rollup Aggregator",
    label: "Category Rollup Aggregator",
    description: "Group mapped rows into category and rollup totals",
    defaultConfig: {
      owner: "Fiscal Systems",
      inputs: "mapped_rows, rollup_rules",
      outputs:
        "category_totals, rollup_totals, named_values, included_rows_by_category, included_rows_by_rollup, excluded_rows, rollup_formula_trace, rollup_summary",
      rulebookRef:
        "Category Rollup Aggregator only groups and sums mapped rows.",
      toolGroup: "calculation",
      toolId: "logic.category_rollup_aggregator",
    },
  },
  {
    id: "logic:calculation-engine",
    family: "Logic",
    subtype: "Calculation Engine",
    label: "Calculation Engine",
    description: "Apply formula rules to named values and protected inputs",
    defaultConfig: {
      owner: "Fiscal Systems",
      inputs: "named_values, protected_inputs",
      outputs:
        "calculated_results, formula_trace, calculation_summary, named_values",
      rulebookRef:
        "Calculation Engine evaluates formulas without grouping source rows.",
      toolGroup: "calculation",
      toolId: "logic.calculation_engine",
      mode: "auto",
      outputCurrency: "USD",
      rounding: { moneyDecimals: 2 },
      formulas: [
        {
          calculationId: "A",
          label: "A",
          operation: "max_subtract_zero",
          operands: ["income_bucket", "expense_bucket"],
          resultKey: "A",
          description: "A = max(income_bucket - expense_bucket, 0)",
        },
        {
          calculationId: "A1",
          label: "A1",
          operation: "multiply",
          operands: ["debtForgiveness", 2],
          resultKey: "A1",
          description: "A1 = debtForgiveness * 2",
        },
        {
          calculationId: "A2",
          label: "A2",
          operation: "pass_through",
          operands: ["priorYearG"],
          resultKey: "A2",
          description: "A2 = priorYearG",
        },
        {
          calculationId: "B",
          label: "B",
          operation: "multiply",
          operands: ["capGains", "inclusionRate"],
          resultKey: "B",
          description: "B = capGains * inclusionRate",
        },
        {
          calculationId: "C",
          label: "C",
          operation: "pass_through",
          operands: ["cfaIncome"],
          resultKey: "C",
          description: "C = cfaIncome",
        },
        {
          calculationId: "D",
          label: "D",
          operation: "pass_through",
          operands: ["businessLosses"],
          resultKey: "D",
          description: "D = businessLosses",
        },
        {
          calculationId: "E",
          label: "E",
          operation: "pass_through",
          operands: ["faclCarryforward"],
          resultKey: "E",
          description: "E = faclCarryforward",
        },
        {
          calculationId: "F",
          label: "F",
          operation: "pass_through",
          operands: ["prescribedAmount"],
          resultKey: "F",
          description: "F = prescribedAmount",
        },
        {
          calculationId: "F1",
          label: "F1",
          operation: "pass_through",
          operands: ["prescribedAmountF1"],
          resultKey: "F1",
          description: "F1 = prescribedAmountF1",
        },
        {
          calculationId: "G",
          label: "G",
          operation: "pass_through",
          operands: ["dividendDeductions"],
          resultKey: "G",
          description: "G = dividendDeductions",
        },
        {
          calculationId: "H",
          label: "H",
          operation: "pass_through",
          operands: ["partnershipDividends"],
          resultKey: "H",
          description: "H = partnershipDividends",
        },
        {
          calculationId: "FAT_PAID",
          label: "FAT Paid",
          operation: "pass_through",
          operands: ["fatPaid"],
          resultKey: "FAT_PAID",
          description: "FAT_PAID = fatPaid",
        },
        {
          calculationId: "RTF",
          label: "RTF",
          operation: "pass_through",
          operands: ["rtf"],
          resultKey: "RTF",
          description: "RTF = rtf",
        },
        {
          calculationId: "FX_RATE",
          label: "FX Rate",
          operation: "pass_through",
          operands: ["fxRate"],
          resultKey: "FX_RATE",
          description: "FX_RATE = fxRate",
        },
        {
          calculationId: "GROSS",
          label: "Gross",
          operation: "add",
          operands: ["A", "A1", "A2", "B", "C"],
          resultKey: "GROSS",
          description: "Gross = A + A1 + A2 + B + C",
        },
        {
          calculationId: "DEDUCTIONS",
          label: "Deductions",
          operation: "add",
          operands: ["D", "E", "F", "F1", "G", "H"],
          resultKey: "DEDUCTIONS",
          description: "Deductions = D + E + F + F1 + G + H",
        },
        {
          calculationId: "FAPI_BRUT",
          label: "FAPI Brut",
          operation: "max_subtract_zero",
          operands: ["GROSS", "DEDUCTIONS"],
          resultKey: "FAPI_BRUT",
          description: "FAPI Brut = max(GROSS - DEDUCTIONS, 0)",
        },
        {
          calculationId: "FAT_DEDUCTION",
          label: "FAT Deduction",
          operation: "min_multiply_cap",
          operands: ["FAT_PAID", "RTF", "FAPI_BRUT"],
          resultKey: "FAT_DEDUCTION",
          description: "FAT Deduction = min(max(FAT_PAID, 0) * RTF, FAPI_BRUT)",
        },
        {
          calculationId: "NET_FAPI",
          label: "Net FAPI",
          operation: "max_subtract_zero",
          operands: ["FAPI_BRUT", "FAT_DEDUCTION"],
          resultKey: "NET_FAPI",
          description: "Net FAPI = max(FAPI_BRUT - FAT_DEDUCTION, 0)",
        },
        {
          calculationId: "NET_FAPI_CAD",
          label: "Net FAPI CAD",
          operation: "multiply",
          operands: ["NET_FAPI", "FX_RATE"],
          resultKey: "NET_FAPI_CAD",
          description: "Net FAPI CAD = NET_FAPI * FX_RATE",
        },
      ],
    },
  },
  {
    id: "logic:classification-mapping",
    family: "Logic",
    subtype: "Classification / Mapping",
    label: "Classification / Mapping",
    description: "Classify rows or map source values to canonical fields",
    defaultConfig: {
      owner: "Fiscal Systems",
      inputs: "source rows",
      outputs: "mappedRows",
      rulebookRef: "Mappings are downstream annotations, not source edits.",
      toolGroup: "mapping",
      toolId: "logic.keyword_mapper",
    },
  },
  {
    id: "field:field-block",
    family: "Field",
    subtype: "Field Block",
    label: "Field Block",
    description: "Display named results and their category breakdowns in the user-facing UI",
    defaultConfig: {
      fields: [],
      toolId: "field.field_block",
    },
  },
  {
    id: "output:csv-export",
    family: "Output",
    subtype: "CSV Export",
    label: "CSV Export",
    description: "Delimited export for downstream review",
    defaultConfig: {
      owner: "Tax Delivery",
      inputs: "approved values",
      outputs: "csvExport",
      rulebookRef: "CSV output is generated from approved data.",
      toolId: "output.evidence_pack_preview",
    },
  },
  {
    id: "output:excel-export",
    family: "Output",
    subtype: "Excel Export",
    label: "Excel Export",
    description: "Workbook output for review or handoff",
    defaultConfig: {
      owner: "Tax Delivery",
      inputs: "approved values",
      outputs: "excelExport",
      rulebookRef: "Excel output is generated from approved data.",
      toolId: "output.evidence_pack_preview",
    },
  },
  {
    id: "output:pdf-report",
    family: "Output",
    subtype: "PDF Report",
    label: "PDF Report",
    description: "Review-ready PDF package",
    defaultConfig: {
      owner: "Tax Delivery",
      inputs: "approved values",
      outputs: "pdfReport",
      rulebookRef: "PDF reports are generated from approved values.",
      toolId: "output.evidence_pack_preview",
    },
  },
  {
    id: "output:evidence-pack",
    family: "Output",
    subtype: "Evidence Pack",
    label: "Evidence Pack",
    description: "Source references, validations, and approvals bundle",
    defaultConfig: {
      owner: "Tax Delivery",
      inputs: "sources and approvals",
      outputs: "evidencePack",
      rulebookRef: "Evidence packs preserve source support.",
      toolId: "output.evidence_pack_preview",
    },
  },
  {
    id: "output:canonical-json",
    family: "Output",
    subtype: "Canonical JSON",
    label: "Canonical JSON",
    description: "Canonical machine-readable workflow output",
    defaultConfig: {
      owner: "Tax Delivery",
      inputs: "approved graph state",
      outputs: "canonicalJson",
      rulebookRef: "Canonical JSON is a local v1 export artifact.",
      toolId: "output.canonical_json",
    },
  },
  {
    id: "output:taxprep-handoff",
    family: "Output",
    subtype: "Taxprep Handoff",
    label: "Taxprep Handoff",
    description: "Placeholder handoff artifact for Taxprep",
    defaultConfig: {
      owner: "Tax Delivery",
      inputs: "approved values",
      outputs: "taxprepHandoff",
      rulebookRef: "V1 exports a placeholder, not a live integration.",
      toolId: "output.evidence_pack_preview",
    },
  },
  {
    id: "output:onesource-handoff",
    family: "Output",
    subtype: "ONESOURCE Handoff",
    label: "ONESOURCE Handoff",
    description: "Placeholder handoff artifact for ONESOURCE",
    defaultConfig: {
      owner: "Tax Delivery",
      inputs: "approved values",
      outputs: "onesourceHandoff",
      rulebookRef: "V1 exports a placeholder, not a live integration.",
      toolId: "output.evidence_pack_preview",
    },
  },
  {
    id: "ai:ai-search",
    family: "AI / Agent",
    subtype: "AI Search",
    label: "AI Search",
    description: "Proposal-only AI search block",
    defaultConfig: {
      owner: "Builder",
      inputs: "search prompt",
      outputs: "aiSearchProposal",
      rulebookRef: "AI proposals require approval before changing workflow.",
    },
  },
  {
    id: "ai:ai-mapping-suggestion",
    family: "AI / Agent",
    subtype: "AI Mapping Suggestion",
    label: "AI Mapping Suggestion",
    description: "Proposal-only mapping suggestion",
    defaultConfig: {
      owner: "Builder",
      inputs: "source rows",
      outputs: "aiMappingProposal",
      rulebookRef: "AI mapping suggestions do not mutate the workflow.",
    },
  },
  {
    id: "ai:ai-formula-proposal",
    family: "AI / Agent",
    subtype: "AI Formula Proposal",
    label: "AI Formula Proposal",
    description: "Proposal-only formula candidate",
    defaultConfig: {
      owner: "Builder",
      inputs: "calculation prompt",
      outputs: "aiFormulaProposal",
      rulebookRef: "AI formula proposals require approval.",
    },
  },
  {
    id: "ai:ai-workflow-proposal",
    family: "AI / Agent",
    subtype: "AI Workflow Proposal",
    label: "AI Workflow Proposal",
    description: "Proposal-only workflow change package",
    defaultConfig: {
      owner: "Builder",
      inputs: "workflow prompt",
      outputs: "aiWorkflowProposal",
      rulebookRef: "AI workflow proposals stay separate until approved.",
    },
  },
];

export const LOCAL_SAMPLE_DATASET = {
  period: "FY2025 Q4",
  entity: "FAPI Sample Entity",
  sourceDocuments: [
    "trial-balance.xlsx",
    "financial-statements.pdf",
    "notes-to-financial-statements.pdf",
    "fx-rate-source.json",
    "review-overrides.json",
  ],
  rows: [
    {
      jurisdiction: "Canada",
      revenue: 1_280_000,
      deductibleExpenses: 740_000,
      protectedInput: false,
      taxAttribute: "foreign accrual property income",
    },
    {
      jurisdiction: "United States",
      revenue: 840_000,
      deductibleExpenses: 510_000,
      protectedInput: false,
      taxAttribute: "interest allocation",
    },
    {
      jurisdiction: "United Kingdom",
      revenue: 610_000,
      deductibleExpenses: 455_000,
      protectedInput: true,
      taxAttribute: "withholding reserve",
    },
  ],
};

export type FiscalVisualPreset = {
  label: string;
  description: string;
  visualLevel: "L1" | "L2" | "L3";
  visualRole:
    | "source"
    | "logic"
    | "review"
    | "validation"
    | "protected"
    | "output";
  config: Record<string, string>;
};

const FISCAL_PRESETS: Record<string, FiscalVisualPreset> = {
  "preset:source": {
    label: "Source: Reference Evidence",
    description: "Immutable reference set for a fiscal workflow",
    visualLevel: "L3",
    visualRole: "source",
    config: {
      fiscalStage: "source",
      blockFamily: "Source",
      blockSubtype: "Excel / Workbook",
      catalogId: "source:excel-workbook",
      owner: "Tax Operations",
      rulebookRef: "Source records are read-only reference truth.",
      inputs: "source package",
      outputs: "sourceEvidence",
    },
  },
  "preset:logic": {
    label: "Logic: Transform Values",
    description: "Classify, transform, calculate, or derive values",
    visualLevel: "L2",
    visualRole: "logic",
    config: {
      fiscalStage: "logic",
      blockFamily: "Logic",
      blockSubtype: "Transformation",
      catalogId: "logic:transformation",
      owner: "Fiscal Systems",
      rulebookRef: "Logic transforms and derives values from source records.",
      inputs: "sourceEvidence",
      outputs: "derivedValues",
    },
  },
  "preset:review-validation": {
    label: "Review / Validation: Trust Checks",
    description: "Check completeness, thresholds, and review evidence",
    visualLevel: "L2",
    visualRole: "validation",
    config: {
      fiscalStage: "validation",
      blockFamily: "Review / Validation",
      blockSubtype: "Output Readiness Check",
      catalogId: "review:output-readiness-check",
      owner: "Tax Review",
      rulebookRef: "Validation gates decide whether results are trustworthy.",
      inputs: "derivedValues",
      outputs: "reviewFindings",
    },
  },
  "preset:protected": {
    label: "Protected: Governed Value",
    description: "Hold governed inputs, official lines, or result sets",
    visualLevel: "L2",
    visualRole: "protected",
    config: {
      fiscalStage: "protected",
      blockFamily: "Field",
      blockSubtype: "Protected Result",
      catalogId: "protected:protected-result",
      owner: "Data Steward",
      rulebookRef: "Protected blocks contain governed inputs or results.",
      inputs: "reviewFindings",
      outputs: "protectedValue",
    },
  },
  "preset:output": {
    label: "Output: Review Artifact",
    description: "Create handoff artifacts for downstream teams",
    visualLevel: "L2",
    visualRole: "output",
    config: {
      fiscalStage: "output",
      blockFamily: "Output",
      blockSubtype: "Evidence Pack",
      catalogId: "output:evidence-pack",
      owner: "Tax Delivery",
      rulebookRef: "Outputs generate handoff or export artifacts.",
      inputs: "approvedProtectedPacket",
      outputs: "reviewPacket",
    },
  },
};

const BLOCK_SUBTYPE_SET = new Set<BlockSubtype>(
  BLOCK_CATALOG.map((item) => item.subtype)
);

export function isLocalWorkflowId(workflowId?: string | null): boolean {
  return workflowId === LOCAL_WORKFLOW_ID;
}

export function getFiscalPreset(
  presetId: string
): FiscalVisualPreset | undefined {
  return FISCAL_PRESETS[presetId];
}

export function getBlockCatalogItem(
  catalogId: string
): BlockCatalogItem | undefined {
  return BLOCK_CATALOG.find((item) => item.id === catalogId);
}

export function getBlockCatalogItemBySubtype(
  subtype: string | undefined
): BlockCatalogItem | undefined {
  if (!subtype) {
    return;
  }
  return BLOCK_CATALOG.find((item) => item.subtype === subtype);
}

export function getFiscalVisualForFamily(family: BlockFamily): {
  visualLevel: "L1" | "L2" | "L3";
  visualRole:
    | "source"
    | "logic"
    | "review"
    | "validation"
    | "field"
    | "output";
} {
  if (family === "Source") {
    return { visualLevel: "L3", visualRole: "source" };
  }
  if (family === "Review / Validation") {
    return { visualLevel: "L2", visualRole: "validation" };
  }
  if (family === "Field") {
    return { visualLevel: "L2", visualRole: "field" };
  }
  if (family === "Output") {
    return { visualLevel: "L2", visualRole: "output" };
  }
  return { visualLevel: "L2", visualRole: "logic" };
}

export function getFiscalVisualForStage(stage: FiscalStage): {
  visualLevel: "L1" | "L2" | "L3";
  visualRole:
    | "source"
    | "logic"
    | "review"
    | "validation"
    | "field"
    | "output";
} {
  const option = FISCAL_STAGE_OPTIONS.find((item) => item.stage === stage);
  return getFiscalVisualForFamily(option?.family || "Logic");
}

export function getFiscalStageLabel(stage: string | undefined): string {
  if (stage === "review") {
    return "Review / Validation";
  }
  const option = FISCAL_STAGE_OPTIONS.find((item) => item.stage === stage);
  return option?.label || "Fiscal Block";
}

export function getFamilyForStage(stage: string | undefined): BlockFamily {
  const option = FISCAL_STAGE_OPTIONS.find((item) => item.stage === stage);
  return option?.family || "Logic";
}

function isBlockSubtype(value: string | undefined): value is BlockSubtype {
  return Boolean(value && BLOCK_SUBTYPE_SET.has(value as BlockSubtype));
}

function getSubtypeFromValue(
  value: string | undefined,
  fallback: BlockSubtype
): BlockSubtype {
  return isBlockSubtype(value) ? value : fallback;
}

function getDefaultCatalogItemForFamily(family: BlockFamily): BlockCatalogItem {
  return (
    BLOCK_CATALOG.find((item) => item.family === family) || BLOCK_CATALOG[0]
  );
}

function getProtectedKind(
  subtype: BlockSubtype
): NonNullable<GovernanceMetadata["protectedKind"]> {
  return getProtectedKindForSubtype(subtype);
}

function getRuntimeDefaults(
  family: BlockFamily,
  outputKey: string
): RuntimeVisibility {
  return {
    visible: true,
    editableInRuntime: false,
    generatedUiLocked: family === "Source",
    masked: false,
    showInRuns: true,
    outputKey,
  };
}

function getSourceMetadata(
  item: BlockCatalogItem,
  config: Record<string, unknown>
): SourceMetadata | undefined {
  if (item.family !== "Source") {
    return;
  }

  return {
    sourceType: item.subtype as SourceMetadata["sourceType"],
    locator: String(config.sourceLocator || item.defaultConfig.sourceLocator),
    valuePreview:
      typeof config.valuePreview === "string" ? config.valuePreview : undefined,
    immutable: true,
    treatedAsEvidence: true,
    labelLocked: true,
    locatorLocked: true,
    valuesLocked: true,
  };
}

function getGovernanceMetadata(
  _item: BlockCatalogItem,
  _config: Record<string, unknown>
): GovernanceMetadata | undefined {
  return undefined;
}

function getFormulaForSubtype(
  subtype: BlockSubtype,
  config: Record<string, unknown>
): WorkflowFormulaField | undefined {
  if (subtype !== "Formula") {
    return;
  }

  return {
    expression: String(config.formula || "upstreamValue"),
    outputKey: String(config.outputs || "formulaResult"),
    inputs: String(config.inputs || "upstreamValue")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  };
}

function getCodeForSubtype(
  subtype: BlockSubtype,
  config: Record<string, unknown>
): WorkflowCodeField | undefined {
  if (subtype !== "Script" && subtype !== "Condition") {
    return;
  }

  return {
    language: "typescript",
    body: String(
      config.code ||
        (subtype === "Condition"
          ? "return Boolean(input.ready);"
          : "return input;")
    ),
    entrypoint: subtype === "Condition" ? "evaluateCondition" : "runScript",
  };
}

export function createWorkflowBlockFromCatalog(
  catalogId: string,
  options: {
    id?: string;
    label?: string;
    description?: string;
    position?: WorkflowPosition;
    config?: Record<string, unknown>;
    status?: BlockStatus;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
    sample?: boolean;
  } = {}
): WorkflowBlock {
  const item =
    getBlockCatalogItem(catalogId) || getDefaultCatalogItemForFamily("Logic");
  const stage = BLOCK_FAMILY_STAGE[item.family];
  const config: Record<string, unknown> = {
    ...item.defaultConfig,
    ...options.config,
    fiscalStage: stage,
    blockFamily: item.family,
    blockSubtype: item.subtype,
    catalogId: item.id,
  };
  const outputKey = String(config.outputs || item.defaultConfig.outputs);

  return {
    id: options.id || item.id.replace(":", "-"),
    family: item.family,
    subtype: item.subtype,
    label: options.label || item.label,
    description: options.description || item.description,
    status: options.status || "configured",
    position: options.position || { x: 0, y: 0 },
    config,
    code: getCodeForSubtype(item.subtype, config),
    formula: getFormulaForSubtype(item.subtype, config),
    source: getSourceMetadata(item, config),
    governance: getGovernanceMetadata(item, config),
    runtime: getRuntimeDefaults(item.family, outputKey),
    catalogId: item.id,
    sample: options.sample,
    createdBy: options.createdBy || SYSTEM_USER,
    createdAt: options.createdAt || new Date().toISOString(),
    updatedBy: options.updatedBy || options.createdBy || SYSTEM_USER,
    updatedAt: options.updatedAt || new Date().toISOString(),
  };
}

export function createWorkflowNodeFromBlock(
  block: WorkflowBlock,
  options: { selected?: boolean; type?: WorkflowNodeType } = {}
): WorkflowNode {
  const visual = getFiscalVisualForFamily(block.family);
  const nodeType =
    options.type ||
    ((block.config.canvasNodeType as WorkflowNodeType | undefined) ?? "action");

  return {
    id: block.id,
    type: nodeType,
    position: block.position,
    selected: options.selected,
    data: {
      label: block.label,
      description: block.description,
      type: nodeType,
      visualLevel: visual.visualLevel,
      visualRole: visual.visualRole,
      config: block.config,
      status: block.status === "running" ? "running" : "idle",
      block,
    },
  };
}

export function createDefaultWorkflowBlockCandidate({
  id,
  pendingConnection,
  position,
}: {
  id: string;
  pendingConnection?: PendingWorkflowConnection;
  position: WorkflowPosition;
}): WorkflowNode {
  return {
    id,
    type: "action",
    position,
    data: {
      label: "New Block",
      description: "Choose a typed block from the catalog",
      type: "action",
      config: {
        blockCandidate: true,
        pendingConnection,
      },
      status: "idle",
    },
    selected: true,
  };
}

export function createPendingWorkflowConnection({
  sourceBlockId,
  sourceHandle,
  targetBlockId,
  targetHandle,
}: Omit<PendingWorkflowConnection, "createdAt">): PendingWorkflowConnection {
  return {
    sourceBlockId,
    targetBlockId,
    sourceHandle,
    targetHandle,
    createdAt: new Date().toISOString(),
  };
}

export function getPendingWorkflowConnection(
  value: unknown
): PendingWorkflowConnection | null {
  if (!(typeof value === "object" && value !== null)) {
    return null;
  }

  const pending = value as Partial<PendingWorkflowConnection>;
  if (
    typeof pending.sourceBlockId !== "string" ||
    typeof pending.targetBlockId !== "string" ||
    typeof pending.createdAt !== "string"
  ) {
    return null;
  }

  return {
    sourceBlockId: pending.sourceBlockId,
    targetBlockId: pending.targetBlockId,
    sourceHandle:
      typeof pending.sourceHandle === "string" ? pending.sourceHandle : null,
    targetHandle:
      typeof pending.targetHandle === "string" ? pending.targetHandle : null,
    createdAt: pending.createdAt,
  };
}

function isWorkflowRelationshipType(
  value: unknown
): value is WorkflowRelationshipType {
  return (
    typeof value === "string" &&
    WORKFLOW_RELATIONSHIP_TYPES.includes(value as WorkflowRelationshipType)
  );
}

function getEdgeStatusFromValue(value: unknown): EdgeStatus {
  return EDGE_STATUS_VALUES.includes(value as EdgeStatus)
    ? (value as EdgeStatus)
    : "active";
}

function getEdgeBindingStatusFromValue(value: unknown): EdgeBindingStatus {
  return EDGE_BINDING_STATUS_VALUES.includes(value as EdgeBindingStatus)
    ? (value as EdgeBindingStatus)
    : "missing";
}

function getAiProposalStatusFromValue(value: unknown): AiProposalStatus {
  return AI_PROPOSAL_STATUS_VALUES.includes(value as AiProposalStatus)
    ? (value as AiProposalStatus)
    : "proposed";
}

export function getAllowedWorkflowRelationshipTypes(
  sourceFamily: BlockFamily,
  targetFamily: BlockFamily
): WorkflowRelationshipType[] {
  return getAllowedRelationshipTypesForFamilies(sourceFamily, targetFamily);
}

function getDefaultLogicRelationshipType(
  targetBlock: WorkflowBlock
): WorkflowRelationshipType | null {
  if (targetBlock.family === "Logic") {
    if (
      targetBlock.subtype === "Aggregation" ||
      targetBlock.subtype === "Hierarchy Aggregator"
    ) {
      return "aggregates_into";
    }
    if (targetBlock.subtype === "Condition") {
      return "branches_to";
    }
    return "transforms_into";
  }

  if (targetBlock.family === "Field") {
    return "provides_data_to";
  }

  return targetBlock.family === "Output" ? "feeds_output_input" : null;
}

export function getDefaultWorkflowRelationshipType({
  sourceBlock,
  targetBlock,
}: {
  sourceBlock: WorkflowBlock;
  targetBlock: WorkflowBlock;
}): WorkflowRelationshipType | null {
  if (sourceBlock.family === "AI / Agent") {
    return "proposes";
  }

  if (targetBlock.family === "AI / Agent") {
    return sourceBlock.family === "Logic"
      ? "feeds_ai_context"
      : "provides_context_to_ai";
  }

  if (sourceBlock.family === "Logic") {
    return (
      getDefaultLogicRelationshipType(targetBlock) ||
      getAllowedWorkflowRelationshipTypes(
        sourceBlock.family,
        targetBlock.family
      )[0] ||
      null
    );
  }

  return (
    getAllowedWorkflowRelationshipTypes(
      sourceBlock.family,
      targetBlock.family
    )[0] || null
  );
}

export function getWorkflowRelationshipForValue({
  sourceBlock,
  targetBlock,
  value,
}: {
  sourceBlock?: WorkflowBlock;
  targetBlock?: WorkflowBlock;
  value: unknown;
}): WorkflowRelationshipType {
  if (isWorkflowRelationshipType(value)) {
    return value;
  }

  const defaultType =
    sourceBlock && targetBlock
      ? getDefaultWorkflowRelationshipType({ sourceBlock, targetBlock })
      : null;

  if (defaultType) {
    return defaultType;
  }

  switch (value) {
    case "feeds":
      return "provides_data_to";
    case "supports":
      return "referenced_by";
    case "validates":
      return "checked_by";
    case "routes":
      return "branches_to";
    case "protects":
      return "approves_for";
    case "summarizes":
      return "depends_on";
    case "feeds_output":
    case "output_preview":
      return "feeds_output_input";
    case "ai_context":
      return "feeds_ai_context";
    case "exports":
      return "maps_to_output";
    case "proposes":
      return "proposes";
    default:
      return "provides_data_to";
  }
}

type WorkflowEdgeDefaults = {
  reason: string;
  relationshipType: WorkflowRelationshipType;
  sourceOutputRole?: string;
  targetInputRole?: string;
  bindingLabel?: string;
  bindingStatus?: EdgeBindingStatus;
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Binding defaults mirror the compact v1 workflow rulebook.
function getDefaultBindingRoles({
  sourceBlock,
  targetBlock,
}: {
  sourceBlock: WorkflowBlock;
  targetBlock: WorkflowBlock;
}): Pick<
  WorkflowEdgeDefaults,
  "bindingLabel" | "bindingStatus" | "sourceOutputRole" | "targetInputRole"
> {
  if (
    targetBlock.config.toolId === "logic.keyword_mapper" ||
    targetBlock.subtype === "Classification / Mapping"
  ) {
    if (sourceBlock.config.sourceKind === "keyword_rules") {
      return {
        bindingLabel: "Keyword rules",
        bindingStatus: "valid",
        sourceOutputRole: "keyword_rules",
        targetInputRole: "keyword_rules",
      };
    }

    return {
      bindingLabel: "Data rows",
      bindingStatus: "valid",
      sourceOutputRole:
        sourceBlock.family === "Logic" ? "mapped_rows" : "selected_rows",
      targetInputRole: "data_rows",
    };
  }

  if (targetBlock.subtype === "Aggregation") {
    return {
      bindingLabel: "Mapped rows",
      bindingStatus: "valid",
      sourceOutputRole: "mapped_rows",
      targetInputRole: "mapped_rows",
    };
  }

  if (
    targetBlock.subtype === "Hierarchy Aggregator" ||
    targetBlock.config.toolId === "logic.hierarchy_aggregator"
  ) {
    if (sourceBlock.config.sourceKind === "aggregation_rules") {
      return {
        bindingLabel: "Aggregation rules",
        bindingStatus: "valid",
        sourceOutputRole: "aggregation_rules",
        targetInputRole: "aggregation_rules",
      };
    }

    return {
      bindingLabel: "Mapped rows",
      bindingStatus: "valid",
      sourceOutputRole: "mapped_rows",
      targetInputRole: "mapped_rows",
    };
  }

  if (
    targetBlock.subtype === "Category Rollup Aggregator" ||
    targetBlock.config.toolId === "logic.category_rollup_aggregator"
  ) {
    if (sourceBlock.config.sourceKind === "rollup_rules") {
      return {
        bindingLabel: "Rollup rules",
        bindingStatus: "valid",
        sourceOutputRole: "rollup_rules",
        targetInputRole: "rollup_rules",
      };
    }

    return {
      bindingLabel: "Mapped rows",
      bindingStatus: "valid",
      sourceOutputRole: "mapped_rows",
      targetInputRole: "mapped_rows",
    };
  }

  if (
    targetBlock.subtype === "Calculation Engine" ||
    targetBlock.config.toolId === "logic.calculation_engine"
  ) {
    if (sourceBlock.config.sourceKind === "calculation_rules") {
      return {
        bindingLabel: "Calculation rules",
        bindingStatus: "valid",
        sourceOutputRole: "calculation_rules",
        targetInputRole: "calculation_rules",
      };
    }

    return {
      bindingLabel: "Named values",
      bindingStatus: "valid",
      sourceOutputRole: "named_values",
      targetInputRole: "named_values",
    };
  }

  if (targetBlock.subtype === "Unmatched Rows Check") {
    return {
      bindingLabel: "Unmatched rows",
      bindingStatus: "valid",
      sourceOutputRole: "unmatched_rows",
      targetInputRole: "checked_items",
    };
  }

  if (targetBlock.subtype === "Low Confidence Warning") {
    return {
      bindingLabel: "Low-confidence rows",
      bindingStatus: "valid",
      sourceOutputRole: "low_confidence_rows",
      targetInputRole: "checked_items",
    };
  }

  if (targetBlock.family === "Field") {
    let sourceOutputRole = "named_values";
    if (sourceBlock.subtype === "Calculation Engine") {
      sourceOutputRole = "calculated_results";
    } else if (sourceBlock.subtype === "Hierarchy Aggregator") {
      sourceOutputRole = "final_totals";
    } else if (sourceBlock.subtype === "Category Rollup Aggregator") {
      sourceOutputRole = "rollup_totals";
    }

    return {
      bindingLabel: "Computed values",
      bindingStatus: "valid",
      sourceOutputRole,
      targetInputRole: "computed_values",
    };
  }

  if (targetBlock.family === "Output") {
    let sourceOutputRole = "mapped_rows";
    if (sourceBlock.family === "Field") {
      sourceOutputRole = "computed_values";
    } else if (sourceBlock.subtype === "Hierarchy Aggregator") {
      sourceOutputRole = "aggregation_summary";
    }

    return {
      bindingLabel: "Field values",
      bindingStatus: "valid",
      sourceOutputRole,
      targetInputRole: "field_values",
    };
  }

  if (targetBlock.family === "Review / Validation") {
    return {
      bindingLabel: "Checked items",
      bindingStatus: "warning",
      targetInputRole: "checked_items",
    };
  }

  return { bindingStatus: "missing" };
}

export function getWorkflowEdgeDefaults({
  sourceBlock,
  targetBlock,
}: {
  sourceBlock: WorkflowBlock;
  targetBlock: WorkflowBlock;
}): WorkflowEdgeDefaults | null {
  const relationshipType = getDefaultWorkflowRelationshipType({
    sourceBlock,
    targetBlock,
  });

  if (!relationshipType) {
    return null;
  }

  return {
    ...getDefaultBindingRoles({ sourceBlock, targetBlock }),
    relationshipType,
    reason: `${sourceBlock.label} ${WORKFLOW_RELATIONSHIP_LABELS[
      relationshipType
    ].toLowerCase()} ${targetBlock.label}.`,
  };
}

export function getUnsupportedWorkflowRelationshipMessage({
  sourceBlock,
  targetBlock,
}: {
  sourceBlock?: WorkflowBlock;
  targetBlock?: WorkflowBlock;
}): string {
  if (!(sourceBlock && targetBlock)) {
    return "Both blocks need typed workflow metadata before a relationship can be created.";
  }

  if (sourceBlock.family === "Source" && targetBlock.family !== "Logic") {
    return "Source evidence is immutable. Create downstream Logic to correct, reinterpret, or map it before connecting it to this block.";
  }

  if (targetBlock.family === "Source") {
    return "Source blocks are immutable evidence. Preserve lineage with Source to Logic relationships instead of writing relationships back into a Source.";
  }

  return `${sourceBlock.family} blocks cannot directly connect to ${targetBlock.family} blocks in the typed workflow model. Add a compatible downstream block first.`;
}

export function createWorkflowEdgeRecord({
  bindingLabel,
  bindingStatus = "valid",
  confidence = 1,
  createdAt = new Date().toISOString(),
  createdBy = SYSTEM_USER,
  id,
  history,
  notes = "",
  reason,
  relationshipType = "provides_data_to",
  sourceOutputRole,
  sourceBlockId,
  status = "active",
  targetInputRole,
  targetBlockId,
}: {
  id?: string;
  sourceBlockId: string;
  targetBlockId: string;
  relationshipType?: WorkflowRelationshipType;
  reason: string;
  sourceOutputRole?: string;
  targetInputRole?: string;
  bindingLabel?: string;
  bindingStatus?: EdgeBindingStatus;
  status?: EdgeStatus;
  createdBy?: string;
  createdAt?: string;
  confidence?: number;
  history?: WorkflowEdgeHistoryEntry[];
  notes?: string;
}): WorkflowEdge {
  const edgeId = id || `edge-${sourceBlockId}-${targetBlockId}`;
  return {
    id: edgeId,
    sourceBlockId,
    targetBlockId,
    relationshipType,
    reason,
    ...(sourceOutputRole ? { sourceOutputRole } : {}),
    ...(targetInputRole ? { targetInputRole } : {}),
    ...(bindingLabel ? { bindingLabel } : {}),
    bindingStatus,
    status,
    createdBy,
    createdAt,
    confidence,
    notes,
    history:
      history && history.length > 0
        ? history
        : [
            {
              id: `${edgeId}-created`,
              action: "created",
              by: createdBy,
              at: createdAt,
              notes: reason,
            },
          ],
  };
}

export function updateWorkflowEdgeRecord(
  edge: WorkflowEdge,
  updates: Partial<
    Pick<
      WorkflowEdge,
      | "bindingLabel"
      | "bindingStatus"
      | "confidence"
      | "notes"
      | "reason"
      | "relationshipType"
      | "sourceOutputRole"
      | "status"
      | "targetInputRole"
    >
  >,
  historyNote = "Relationship metadata updated."
): WorkflowEdge {
  const now = new Date().toISOString();
  const nextStatus = updates.status || edge.status;
  let historyAction: WorkflowEdgeHistoryEntry["action"] = "updated";
  if (nextStatus === "rejected") {
    historyAction = "rejected";
  } else if (nextStatus === "disabled") {
    historyAction = "disabled";
  }

  return {
    ...edge,
    ...updates,
    history: [
      ...edge.history,
      {
        id: `${edge.id}-history-${Date.now()}`,
        action: historyAction,
        by: SYSTEM_USER,
        at: now,
        notes: historyNote,
      },
    ],
  };
}

export function createSplitWorkflowEdgeRecords({
  insertedBlock,
  originalEdge,
}: {
  insertedBlock: WorkflowBlock;
  originalEdge: WorkflowEdge;
}): [WorkflowEdge, WorkflowEdge] {
  const now = new Date().toISOString();
  const splitHistory: WorkflowEdgeHistoryEntry = {
    id: `${originalEdge.id}-split-${Date.now()}`,
    action: "split",
    by: SYSTEM_USER,
    at: now,
    notes: `Split by inserting ${insertedBlock.label}. Original relationship: ${originalEdge.reason}`,
  };
  const sourceToInserted = createWorkflowEdgeRecord({
    id: `${originalEdge.id}-to-${insertedBlock.id}`,
    sourceBlockId: originalEdge.sourceBlockId,
    targetBlockId: insertedBlock.id,
    relationshipType: originalEdge.relationshipType,
    reason: originalEdge.reason,
    sourceOutputRole: originalEdge.sourceOutputRole,
    bindingLabel: originalEdge.bindingLabel,
    bindingStatus: originalEdge.bindingStatus,
    status: originalEdge.status,
    confidence: originalEdge.confidence,
    notes: originalEdge.notes,
    createdAt: now,
    history: [...originalEdge.history, splitHistory],
  });
  const insertedToTarget = createWorkflowEdgeRecord({
    id: `${insertedBlock.id}-to-${originalEdge.targetBlockId}`,
    sourceBlockId: insertedBlock.id,
    targetBlockId: originalEdge.targetBlockId,
    relationshipType: "transforms_into",
    reason: `${insertedBlock.label} continues the split relationship into the original target.`,
    targetInputRole: originalEdge.targetInputRole,
    bindingLabel: originalEdge.bindingLabel,
    bindingStatus: originalEdge.bindingStatus,
    status: originalEdge.status,
    confidence: originalEdge.confidence,
    notes: originalEdge.notes,
    createdAt: now,
    history: [...originalEdge.history, splitHistory],
  });

  return [sourceToInserted, insertedToTarget];
}

export function createCanvasEdgeFromWorkflowEdge(
  edge: WorkflowEdge
): CanvasWorkflowEdge {
  return {
    id: edge.id,
    source: edge.sourceBlockId,
    target: edge.targetBlockId,
    type: "animated",
    data: {
      workflowEdge: edge,
      relationshipType: edge.relationshipType,
      status: edge.status,
      confidence: edge.confidence,
      sourceOutputRole: edge.sourceOutputRole,
      targetInputRole: edge.targetInputRole,
      bindingLabel: edge.bindingLabel,
      bindingStatus: edge.bindingStatus,
      label: WORKFLOW_RELATIONSHIP_LABELS[edge.relationshipType],
    },
  };
}

export function workflowDefinitionToCanvas(definition: WorkflowDefinition): {
  nodes: WorkflowNode[];
  edges: CanvasWorkflowEdge[];
} {
  const entryBlockId =
    definition.structure.entryBlockId || definition.blocks[0]?.id;

  return {
    nodes: definition.blocks.map((block, index) =>
      createWorkflowNodeFromBlock(block, {
        selected: index === 0,
        type:
          block.id === entryBlockId || block.config.canvasNodeType === "trigger"
            ? "trigger"
            : "action",
      })
    ),
    edges: definition.edges.map(createCanvasEdgeFromWorkflowEdge),
  };
}

function getWorkflowStructure(blocks: WorkflowBlock[]): WorkflowStructure {
  const columns = FISCAL_STAGE_OPTIONS.map((option) => ({
    id: option.stage,
    family: option.family,
    label: option.label,
    blockIds: blocks
      .filter((block) => block.family === option.family)
      .map((block) => block.id),
  })).filter((column) => column.blockIds.length > 0);

  return {
    layout: "canvas-columns",
    entryBlockId: blocks[0]?.id,
    blockOrder: blocks.map((block) => block.id),
    columns,
  };
}

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function createWorkflowEvent({
  createdAt = new Date().toISOString(),
  createdBy = SYSTEM_USER,
  details,
  message,
  type,
}: Omit<WorkflowEvent, "createdAt" | "createdBy" | "id"> &
  Partial<Pick<WorkflowEvent, "createdAt" | "createdBy">>): WorkflowEvent {
  return {
    id: `event-${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    message,
    createdAt,
    createdBy,
    details,
  };
}

function appendWorkflowEvent(
  definition: WorkflowDefinition,
  event?: WorkflowEvent
): WorkflowEvent[] {
  if (!event) {
    return definition.events || [];
  }
  return [event, ...(definition.events || [])].slice(0, 50);
}

function getRuntimeAudience(block: WorkflowBlock) {
  return String(block.config.runtimeAudience || block.config.visibility || "");
}

function getAllowedRuntimeActions(block: WorkflowBlock): string[] {
  if (block.family === "Source") {
    return ["view_source_trace", "create_downstream_logic"];
  }
  if (block.family === "Field") {
    return ["view_result", "view_trace"];
  }
  if (block.family === "Output") {
    return ["preview_output", "mock_download"];
  }
  if (block.family === "Review / Validation") {
    return ["view_check_result", "mock_sign_off"];
  }
  if (block.family === "AI / Agent") {
    return ["view_proposal"];
  }
  return ["view_result"];
}

function createRuntimeUiRow(block: WorkflowBlock): RuntimeUiRow {
  const audience = getRuntimeAudience(block);
  const sourceReadOnly = block.family === "Source";

  return {
    id: `runtime-row-${block.id}`,
    blockId: block.id,
    label: block.label,
    family: block.family,
    subtype: block.subtype,
    visible: block.runtime.visible,
    readOnly: sourceReadOnly || !block.runtime.editableInRuntime || block.family === "Logic",
    locked: block.runtime.generatedUiLocked,
    reviewerOnly: audience === "reviewer-only",
    advancedOnly: audience === "advanced-only",
    sourceReadOnly,
    protectedLocked: false,
    outputKey: block.runtime.outputKey,
    allowedActions: getAllowedRuntimeActions(block),
  };
}

function generateRuntimeUiConfigFromParts({
  blocks,
  generatedAt = new Date().toISOString(),
  sourceSnapshotId,
  sourceWorkflowId,
  structure,
}: {
  blocks: WorkflowBlock[];
  generatedAt?: string;
  sourceSnapshotId?: string;
  sourceWorkflowId: string;
  structure: WorkflowStructure;
}): RuntimeUiConfig {
  const blockMap = new Map(blocks.map((block) => [block.id, block]));
  const sections = structure.columns.map((column) => ({
    id: `runtime-section-${column.id}`,
    label: column.label,
    family: column.family,
    rows: column.blockIds
      .map((blockId) => blockMap.get(blockId))
      .filter((block): block is WorkflowBlock => Boolean(block))
      .map(createRuntimeUiRow),
  }));
  const rows = sections.flatMap((section) => section.rows);

  return {
    runtimeConfigId: `runtime-config-${sourceSnapshotId || sourceWorkflowId}`,
    sourceWorkflowId,
    sourceSnapshotId,
    generatedAt,
    sections,
    visibleRows: rows.filter((row) => row.visible).map((row) => row.blockId),
    hiddenRows: rows.filter((row) => !row.visible).map((row) => row.blockId),
    reviewerOnlyRows: rows
      .filter((row) => row.reviewerOnly)
      .map((row) => row.blockId),
    advancedRows: rows
      .filter((row) => row.advancedOnly)
      .map((row) => row.blockId),
    allowedActions: [
      "view_read_only_sources",
      "view_locked_protected_fields",
      "preview_outputs",
      "run_mock_only",
    ],
  };
}

export function generateRuntimeUiConfig(
  definition: WorkflowDefinition,
  sourceSnapshotId?: string
): RuntimeUiConfig {
  return generateRuntimeUiConfigFromParts({
    blocks: definition.blocks,
    sourceSnapshotId,
    sourceWorkflowId: definition.id,
    structure: definition.structure,
  });
}

function getActiveGovernedOutputMappings(
  outputEdges: WorkflowEdge[],
  blockMap: Map<string, WorkflowBlock>
): OutputMappingPreviewItem["mappedProtectedValues"] {
  return outputEdges
    .filter((edge) => edge.status === "active")
    .map((edge) => {
      const protectedBlock = blockMap.get(edge.sourceBlockId);
      if (
        protectedBlock?.family !== "Field" ||
        !isGovernedOutputRelationshipType(edge.relationshipType)
      ) {
        return null;
      }

      return {
        edgeId: edge.id,
        protectedBlockId: protectedBlock.id,
        protectedLabel: protectedBlock.label,
        relationshipType: edge.relationshipType,
      };
    })
    .filter(
      (
        item
      ): item is OutputMappingPreviewItem["mappedProtectedValues"][number] =>
        Boolean(item)
    );
}

function getActiveCandidateOutputMappings(
  outputEdges: WorkflowEdge[],
  blockMap: Map<string, WorkflowBlock>
): OutputMappingPreviewItem["candidateLogicMappings"] {
  return outputEdges
    .filter((edge) => edge.status === "active")
    .map((edge) => {
      const logicBlock = blockMap.get(edge.sourceBlockId);
      if (
        logicBlock?.family !== "Logic" ||
        !isCandidateOutputRelationshipType(edge.relationshipType)
      ) {
        return null;
      }

      return {
        edgeId: edge.id,
        logicBlockId: logicBlock.id,
        logicLabel: logicBlock.label,
        relationshipType: edge.relationshipType,
      };
    })
    .filter(
      (
        item
      ): item is OutputMappingPreviewItem["candidateLogicMappings"][number] =>
        Boolean(item)
    );
}

function getOutputReadinessStatus({
  candidateMappingCount,
  governedMappingCount,
  ignoredRelationshipCount,
}: {
  governedMappingCount: number;
  candidateMappingCount: number;
  ignoredRelationshipCount: number;
}): OutputMappingPreviewItem["readinessStatus"] {
  if (governedMappingCount > 0 && candidateMappingCount === 0) {
    return ignoredRelationshipCount === 0 ? "ready" : "warning";
  }

  if (governedMappingCount > 0 || candidateMappingCount > 0) {
    return "warning";
  }

  return ignoredRelationshipCount > 0 ? "warning" : "missing";
}

function generateOutputMappingPreviewFromParts({
  blocks,
  edges,
  generatedAt = new Date().toISOString(),
  sourceSnapshotId,
  sourceWorkflowId,
}: {
  blocks: WorkflowBlock[];
  edges: WorkflowEdge[];
  generatedAt?: string;
  sourceSnapshotId?: string;
  sourceWorkflowId: string;
}): OutputMappingPreview {
  const blockMap = new Map(blocks.map((block) => [block.id, block]));
  const outputBlocks = blocks.filter((block) => block.family === "Output");
  const outputs = outputBlocks.map((outputBlock) => {
    const outputEdges = edges.filter(
      (edge) =>
        edge.targetBlockId === outputBlock.id &&
        isOutputMappingRelationshipType(edge.relationshipType)
    );
    const activeGovernedMappings = getActiveGovernedOutputMappings(
      outputEdges,
      blockMap
    );
    const activeCandidateMappings = getActiveCandidateOutputMappings(
      outputEdges,
      blockMap
    );

    const ignoredRelationshipCount =
      outputEdges.length -
      activeGovernedMappings.length -
      activeCandidateMappings.length;
    const governanceWarnings =
      activeCandidateMappings.length > 0
        ? [LOGIC_OUTPUT_GOVERNANCE_WARNING]
        : [];
    const missingRequirements = [
      outputEdges.length === 0 ? "No output mapping relationship" : "",
      activeGovernedMappings.length === 0
        ? "No active Protected value mapping"
        : "",
      activeGovernedMappings.length === 0 &&
      activeCandidateMappings.length === 0
        ? "No active output input mapping"
        : "",
    ].filter(Boolean);
    const readinessStatus = getOutputReadinessStatus({
      candidateMappingCount: activeCandidateMappings.length,
      governedMappingCount: activeGovernedMappings.length,
      ignoredRelationshipCount,
    });

    return {
      outputBlockId: outputBlock.id,
      outputLabel: outputBlock.label,
      outputSubtype: outputBlock.subtype,
      readinessStatus,
      mappedProtectedValues: activeGovernedMappings,
      candidateLogicMappings: activeCandidateMappings,
      governanceWarnings,
      ignoredRelationshipCount,
      missingRequirements,
      includedSourceTraceSetting: String(
        outputBlock.config.sourceTraceSetting || "include summary"
      ),
      mockPayloadPreview: {
        mockOnly: true,
        outputSubtype: outputBlock.subtype,
        mappedValues: activeGovernedMappings.map(
          (mapping) => mapping.protectedLabel
        ),
        candidateLogicInputs: activeCandidateMappings.map(
          (mapping) => mapping.logicLabel
        ),
        noLiveExport: true,
      },
    };
  });

  return {
    id: `output-mapping-${sourceSnapshotId || sourceWorkflowId}`,
    sourceWorkflowId,
    sourceSnapshotId,
    generatedAt,
    outputs,
  };
}

export function generateOutputMappingPreview(
  definition: WorkflowDefinition,
  sourceSnapshotId?: string
): OutputMappingPreview {
  return generateOutputMappingPreviewFromParts({
    blocks: definition.blocks,
    edges: definition.edges,
    sourceSnapshotId,
    sourceWorkflowId: definition.id,
  });
}

function resolveCatalogItemForNode(node: WorkflowNode): BlockCatalogItem {
  const config = node.data.config || {};
  const existingCatalogId =
    (node.data.block?.catalogId as string | undefined) ||
    (config.catalogId as string | undefined);
  const existingCatalogItem = existingCatalogId
    ? getBlockCatalogItem(existingCatalogId)
    : undefined;
  if (existingCatalogItem) {
    return existingCatalogItem;
  }

  const family =
    node.data.block?.family ||
    ((config.blockFamily as BlockFamily | undefined) ??
      getFamilyForStage(config.fiscalStage as string | undefined));
  const subtype = getSubtypeFromValue(
    config.blockSubtype as string | undefined,
    getDefaultCatalogItemForFamily(family).subtype
  );
  return (
    getBlockCatalogItemBySubtype(subtype) ||
    getDefaultCatalogItemForFamily(family)
  );
}

function canvasNodeToWorkflowBlock(
  node: WorkflowNode,
  index: number
): WorkflowBlock {
  const item = resolveCatalogItemForNode(node);
  const existingBlock = node.data.block;
  const label = node.data.label || existingBlock?.label || item.label;
  const config: Record<string, unknown> = {
    ...item.defaultConfig,
    ...existingBlock?.config,
    ...node.data.config,
    fiscalStage: BLOCK_FAMILY_STAGE[item.family],
    blockFamily: item.family,
    blockSubtype: item.subtype,
    catalogId: item.id,
    canvasNodeType: node.data.type,
  };

  const block = createWorkflowBlockFromCatalog(item.id, {
    id: node.id,
    label,
    description:
      node.data.description || existingBlock?.description || item.description,
    position: node.position,
    config,
    status: existingBlock?.status || (index === 0 ? "configured" : "draft"),
    createdAt: existingBlock?.createdAt,
    updatedAt: new Date().toISOString(),
    createdBy: existingBlock?.createdBy,
    updatedBy: SYSTEM_USER,
    sample: existingBlock?.sample,
  });

  return {
    ...block,
    source: existingBlock?.source || block.source,
    governance: existingBlock?.governance
      ? {
          ...existingBlock.governance,
          editIntent:
            typeof config.protectedEditIntent === "string"
              ? config.protectedEditIntent
              : existingBlock.governance.editIntent,
        }
      : block.governance,
    runtime: { ...block.runtime, ...existingBlock?.runtime },
  };
}

function normalizeWorkflowEdgeRecord({
  edge,
  sourceBlock,
  targetBlock,
}: {
  edge: WorkflowEdge;
  sourceBlock?: WorkflowBlock;
  targetBlock?: WorkflowBlock;
}): WorkflowEdge {
  return {
    ...edge,
    relationshipType: getWorkflowRelationshipForValue({
      sourceBlock,
      targetBlock,
      value: edge.relationshipType,
    }),
    status: getEdgeStatusFromValue(edge.status),
    bindingStatus: getEdgeBindingStatusFromValue(edge.bindingStatus),
    confidence: typeof edge.confidence === "number" ? edge.confidence : 1,
    notes: edge.notes || "",
    history: Array.isArray(edge.history) ? edge.history : [],
  };
}

function canvasEdgeToWorkflowEdge(
  edge: CanvasWorkflowEdge,
  blockMap: Map<string, WorkflowBlock>
): WorkflowEdge {
  const sourceBlock = blockMap.get(edge.source);
  const targetBlock = blockMap.get(edge.target);
  const existing = edge.data?.workflowEdge;
  if (existing) {
    return normalizeWorkflowEdgeRecord({
      edge: {
        ...existing,
        id: edge.id,
        sourceBlockId: edge.source,
        targetBlockId: edge.target,
      },
      sourceBlock,
      targetBlock,
    });
  }

  const defaults =
    sourceBlock && targetBlock
      ? getWorkflowEdgeDefaults({ sourceBlock, targetBlock })
      : null;

  return createWorkflowEdgeRecord({
    id: edge.id,
    sourceBlockId: edge.source,
    targetBlockId: edge.target,
    relationshipType: defaults?.relationshipType || "provides_data_to",
    reason: defaults?.reason || "Canvas connection created by builder",
    sourceOutputRole: defaults?.sourceOutputRole,
    targetInputRole: defaults?.targetInputRole,
    bindingLabel: defaults?.bindingLabel,
    bindingStatus: defaults?.bindingStatus || "missing",
    confidence: 1,
  });
}

export function createWorkflowDefinitionFromCanvas({
  description,
  edges,
  existing,
  name,
  nodes,
  status,
}: {
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: CanvasWorkflowEdge[];
  status?: WorkflowDefinitionStatus;
  existing?: WorkflowDefinition | null;
}): WorkflowDefinition {
  const now = new Date().toISOString();
  const blocks = nodes
    .filter(
      (node) =>
        node.type !== "add" &&
        Boolean(node.data.block) &&
        !node.data.config?.blockCandidate
    )
    .map(canvasNodeToWorkflowBlock);
  const blockMap = new Map(blocks.map((block) => [block.id, block]));
  const workflowEdges = edges
    .filter((edge) => blockMap.has(edge.source) && blockMap.has(edge.target))
    .map((edge) => canvasEdgeToWorkflowEdge(edge, blockMap));
  const structure = getWorkflowStructure(blocks);
  const runtimeUiConfig = generateRuntimeUiConfigFromParts({
    blocks,
    sourceWorkflowId: LOCAL_WORKFLOW_ID,
    structure,
  });
  const outputMappingPreview = generateOutputMappingPreviewFromParts({
    blocks,
    edges: workflowEdges,
    sourceWorkflowId: LOCAL_WORKFLOW_ID,
  });

  return {
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    id: LOCAL_WORKFLOW_ID,
    name: name || existing?.name || "Fiscal Workflow Studio",
    description:
      description ||
      existing?.description ||
      "Local prototype workflow stored in this browser.",
    status: status || existing?.status || "draft",
    metadata: {
      kind: "generic-fiscal-workflow",
      sampleWorkflow: existing?.metadata.sampleWorkflow,
      tags: existing?.metadata.tags || ["local", "prototype"],
      createdBy: existing?.metadata.createdBy || SYSTEM_USER,
      createdAt: existing?.metadata.createdAt || now,
      updatedBy: SYSTEM_USER,
      updatedAt: now,
      notes: existing?.metadata.notes,
    },
    blocks,
    edges: workflowEdges,
    structure,
    runtimeUiConfig,
    outputMappingPreview,
    mockRuns: existing?.mockRuns || [],
    versionSnapshots: existing?.versionSnapshots || [],
    latestPublishedVersionId: existing?.latestPublishedVersionId,
    publishedVersion: existing?.publishedVersion,
    aiProposals: existing?.aiProposals || [],
    events: existing?.events || [],
  };
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Import migration normalizes old and current edge shapes in one place.
function getTypedEdgeFromUnknown(
  value: unknown,
  blockMap?: Map<string, WorkflowBlock>
): WorkflowEdge | null {
  if (!(typeof value === "object" && value !== null)) {
    return null;
  }
  const edge = value as Partial<WorkflowEdge>;
  if (!(edge.sourceBlockId && edge.targetBlockId)) {
    return null;
  }

  const sourceBlock = blockMap?.get(edge.sourceBlockId);
  const targetBlock = blockMap?.get(edge.targetBlockId);
  const migratedMetadata = !(
    edge.relationshipType &&
    edge.status &&
    edge.createdAt &&
    edge.createdBy &&
    Array.isArray(edge.history) &&
    edge.history.length > 0
  );
  const edgeId = edge.id || `edge-${edge.sourceBlockId}-${edge.targetBlockId}`;
  const createdAt = edge.createdAt || new Date().toISOString();
  return normalizeWorkflowEdgeRecord({
    edge: {
      id: edgeId,
      sourceBlockId: edge.sourceBlockId,
      targetBlockId: edge.targetBlockId,
      relationshipType: getWorkflowRelationshipForValue({
        sourceBlock,
        targetBlock,
        value: edge.relationshipType,
      }),
      reason: edge.reason || "Imported relationship",
      ...(typeof edge.sourceOutputRole === "string"
        ? { sourceOutputRole: edge.sourceOutputRole }
        : {}),
      ...(typeof edge.targetInputRole === "string"
        ? { targetInputRole: edge.targetInputRole }
        : {}),
      ...(typeof edge.bindingLabel === "string"
        ? { bindingLabel: edge.bindingLabel }
        : {}),
      bindingStatus: getEdgeBindingStatusFromValue(edge.bindingStatus),
      status: getEdgeStatusFromValue(edge.status),
      createdBy: edge.createdBy || SYSTEM_USER,
      createdAt,
      confidence: typeof edge.confidence === "number" ? edge.confidence : 1,
      notes: edge.notes || "",
      history:
        Array.isArray(edge.history) && edge.history.length > 0
          ? edge.history
          : [
              {
                id: `${edgeId}-metadata-migrated`,
                action: "migrated",
                by: SYSTEM_USER,
                at: createdAt,
                notes: migratedMetadata
                  ? "Imported edge metadata was completed with local defaults."
                  : "Imported edge normalized for local Workflow Studio.",
              },
            ],
    },
    sourceBlock,
    targetBlock,
  });
}

function normalizeAiGeneratedBlock(
  value: unknown,
  index: number
): WorkflowBlock | null {
  if (!(typeof value === "object" && value !== null)) {
    return null;
  }

  const block = value as Partial<WorkflowBlock>;
  const family = block.family || "Logic";
  const item =
    (block.catalogId ? getBlockCatalogItem(block.catalogId) : undefined) ||
    getBlockCatalogItemBySubtype(block.subtype) ||
    getDefaultCatalogItemForFamily(family);
  const createdBlock = createWorkflowBlockFromCatalog(item.id, {
    id: block.id || `ai-proposed-block-${index + 1}`,
    label: block.label || item.label,
    description: block.description || item.description,
    position: block.position || { x: index * 260, y: 0 },
    config: block.config,
    status: block.status,
    createdAt: block.createdAt,
    updatedAt: block.updatedAt,
    createdBy: block.createdBy,
    updatedBy: block.updatedBy,
    sample: block.sample,
  });

  return {
    ...createdBlock,
    ...block,
    config: { ...createdBlock.config, ...block.config },
    runtime: { ...createdBlock.runtime, ...block.runtime },
    source: block.source || createdBlock.source,
    governance: block.governance || createdBlock.governance,
  };
}

function normalizeAiProposalHistory(
  proposalId: string,
  value: unknown,
  createdAt: string,
  createdBy: string
): AiProposalHistoryEntry[] {
  if (Array.isArray(value)) {
    const entries = value
      .map((entry): AiProposalHistoryEntry | null => {
        if (!(typeof entry === "object" && entry !== null)) {
          return null;
        }
        const item = entry as Partial<AiProposalHistoryEntry>;
        if (
          !(
            item.action &&
            ["created", "revised", "approved", "rejected"].includes(item.action)
          )
        ) {
          return null;
        }

        return {
          id: item.id || `${proposalId}-history-${Date.now()}`,
          action: item.action,
          by: item.by || createdBy,
          at: item.at || createdAt,
          notes: item.notes,
        };
      })
      .filter((entry): entry is AiProposalHistoryEntry => entry !== null);

    if (entries.length > 0) {
      return entries;
    }
  }

  return [
    {
      id: `${proposalId}-created`,
      action: "created",
      by: createdBy,
      at: createdAt,
      notes: "Imported AI proposal history was completed locally.",
    },
  ];
}

function normalizeGeneratedCodeOrFormulas(
  value: unknown
): AiProposal["generatedCodeOrFormulas"] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!(typeof item === "object" && item !== null)) {
        return null;
      }
      const generated = item as Partial<
        AiProposal["generatedCodeOrFormulas"][number]
      >;
      if (
        !(
          generated.blockId &&
          generated.value &&
          (generated.kind === "code" || generated.kind === "formula")
        )
      ) {
        return null;
      }

      return {
        blockId: generated.blockId,
        kind: generated.kind,
        value: generated.value,
      };
    })
    .filter(
      (item): item is AiProposal["generatedCodeOrFormulas"][number] =>
        item !== null
    );
}

function normalizeAiProposal(
  value: unknown,
  index: number,
  blockMap?: Map<string, WorkflowBlock>
): AiProposal | null {
  if (!(typeof value === "object" && value !== null)) {
    return null;
  }

  const proposal = value as Partial<AiProposal>;
  const createdAt = proposal.createdAt || new Date().toISOString();
  const createdBy = proposal.createdBy || SYSTEM_USER;
  const id = proposal.id || `ai-proposal-imported-${index + 1}-${Date.now()}`;
  const generatedBlocks = Array.isArray(proposal.generatedBlocks)
    ? proposal.generatedBlocks
        .map((block, blockIndex) =>
          normalizeAiGeneratedBlock(block, blockIndex)
        )
        .filter((block): block is WorkflowBlock => Boolean(block))
    : [];
  const proposalBlockMap = new Map(blockMap);
  for (const block of generatedBlocks) {
    proposalBlockMap.set(block.id, block);
  }
  const generatedEdges = Array.isArray(proposal.generatedEdges)
    ? proposal.generatedEdges
        .map((edge) => getTypedEdgeFromUnknown(edge, proposalBlockMap))
        .filter((edge): edge is WorkflowEdge => Boolean(edge))
    : [];

  return {
    id,
    title: proposal.title || `AI proposal ${index + 1}`,
    originalPrompt: proposal.originalPrompt || "Imported local AI proposal.",
    interpretedPlan:
      proposal.interpretedPlan ||
      "Review imported proposal details before approval.",
    selectedTools: Array.isArray(proposal.selectedTools)
      ? proposal.selectedTools.filter(
          (tool): tool is string => typeof tool === "string"
        )
      : ["local mock assistant"],
    generatedBlocks,
    generatedEdges,
    generatedCodeOrFormulas: normalizeGeneratedCodeOrFormulas(
      proposal.generatedCodeOrFormulas
    ),
    status: getAiProposalStatusFromValue(proposal.status),
    approvalResult: proposal.approvalResult,
    rejectionResult: proposal.rejectionResult,
    createdAt,
    createdBy,
    relatedSelectedBlockId: proposal.relatedSelectedBlockId,
    relatedSelectedEdgeId: proposal.relatedSelectedEdgeId,
    confidence:
      typeof proposal.confidence === "number" ? proposal.confidence : undefined,
    notes: proposal.notes,
    history: normalizeAiProposalHistory(
      id,
      proposal.history,
      createdAt,
      createdBy
    ),
  };
}

function normalizeWorkflowEvent(value: unknown): WorkflowEvent | null {
  if (!(typeof value === "object" && value !== null)) {
    return null;
  }

  const event = value as Partial<WorkflowEvent>;
  if (
    !(
      event.type &&
      WORKFLOW_EVENT_TYPES.includes(event.type as WorkflowEventType) &&
      event.message
    )
  ) {
    return null;
  }

  return {
    id: event.id || `event-imported-${Date.now()}`,
    type: event.type as WorkflowEventType,
    message: event.message,
    createdAt: event.createdAt || new Date().toISOString(),
    createdBy: event.createdBy || SYSTEM_USER,
    details: event.details,
  };
}

function getPublishedVersionReference(
  snapshots: WorkflowVersionSnapshot[]
): WorkflowDefinition["publishedVersion"] {
  const latest = snapshots
    .filter((snapshot) => snapshot.status === "published")
    .sort((a, b) => b.versionNumber - a.versionNumber)[0];

  if (!latest) {
    return;
  }

  return {
    id: latest.id,
    versionNumber: latest.versionNumber,
    createdAt: latest.createdAt,
  };
}

function normalizeVersionSnapshots({
  aiProposals,
  blocks,
  edges,
  mockRuns,
  snapshots,
  structure,
  workflowId,
  workflowName,
}: {
  aiProposals: AiProposal[];
  blocks: WorkflowBlock[];
  edges: WorkflowEdge[];
  mockRuns: BlockRun[];
  snapshots: Partial<WorkflowVersionSnapshot>[] | undefined;
  structure: WorkflowStructure;
  workflowId: string;
  workflowName: string;
}): WorkflowVersionSnapshot[] {
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Snapshot migration fills many optional v1 fields from older local exports.
  return (snapshots || []).map((snapshot, index) => {
    const versionNumber = snapshot.versionNumber || index + 1;
    const snapshotId =
      snapshot.id || `snapshot-imported-v${versionNumber}-${Date.now()}`;
    const snapshotBlocks = snapshot.blocks || blocks;
    const snapshotEdges = snapshot.edges || edges;
    const snapshotStructure = snapshot.structure || structure;
    const runtimeUiConfig =
      snapshot.runtimeUiConfig ||
      generateRuntimeUiConfigFromParts({
        blocks: snapshotBlocks,
        sourceSnapshotId: snapshotId,
        sourceWorkflowId: workflowId,
        structure: snapshotStructure,
      });
    const outputMappingPreview = generateOutputMappingPreviewFromParts({
      blocks: snapshotBlocks,
      edges: snapshotEdges,
      generatedAt:
        snapshot.outputMappingPreview?.generatedAt ||
        snapshot.createdAt ||
        new Date().toISOString(),
      sourceSnapshotId: snapshotId,
      sourceWorkflowId: workflowId,
    });
    const snapshotBlockMap = new Map<string, WorkflowBlock>(
      snapshotBlocks.map((block) => [block.id, block])
    );
    const snapshotAiProposals = (
      (snapshot.aiProposals as unknown[] | undefined) || aiProposals
    )
      .map((proposal, proposalIndex) =>
        normalizeAiProposal(proposal, proposalIndex, snapshotBlockMap)
      )
      .filter((proposal): proposal is AiProposal => Boolean(proposal));

    return {
      id: snapshotId,
      schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
      workflowId: snapshot.workflowId || workflowId,
      workflowName: snapshot.workflowName || workflowName,
      versionNumber,
      label: snapshot.label || `Imported version ${versionNumber}`,
      status: snapshot.status || "draft",
      createdBy: snapshot.createdBy || SYSTEM_USER,
      createdAt: snapshot.createdAt || new Date().toISOString(),
      changeSummary: snapshot.changeSummary || "Imported version snapshot.",
      blockCount: snapshot.blockCount || snapshotBlocks.length,
      edgeCount: snapshot.edgeCount || snapshotEdges.length,
      blockIds: snapshot.blockIds || snapshotBlocks.map((block) => block.id),
      edgeIds: snapshot.edgeIds || snapshotEdges.map((edge) => edge.id),
      blocks: cloneJson(snapshotBlocks),
      edges: cloneJson(snapshotEdges),
      structure: cloneJson(snapshotStructure),
      runtimeUiConfig: cloneJson(runtimeUiConfig),
      outputMappingPreview: cloneJson(outputMappingPreview),
      aiProposals: cloneJson(snapshotAiProposals),
      mockRuns: cloneJson(snapshot.mockRuns || mockRuns),
      notes: snapshot.notes,
      validationWarnings: snapshot.validationWarnings || [],
    };
  });
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Local import migration intentionally handles typed and older partial schemas together.
function normalizeWorkflowDefinition(
  parsed: Partial<WorkflowDefinition>
): WorkflowDefinition {
  const now = new Date().toISOString();
  const blocks = (parsed.blocks || []).map((block, index) => {
    const family = block.family || "Logic";
    const item =
      (block.catalogId ? getBlockCatalogItem(block.catalogId) : undefined) ||
      getBlockCatalogItemBySubtype(block.subtype) ||
      getDefaultCatalogItemForFamily(family);
    const createdBlock = createWorkflowBlockFromCatalog(item.id, {
      id: block.id || `block-${index + 1}`,
      label: block.label || item.label,
      description: block.description || item.description,
      position: block.position || { x: index * 260, y: 0 },
      config: block.config,
      status: block.status,
      createdAt: block.createdAt,
      updatedAt: block.updatedAt || now,
      createdBy: block.createdBy,
      updatedBy: block.updatedBy,
      sample: block.sample,
    });

    return {
      ...createdBlock,
      ...block,
      config: { ...createdBlock.config, ...block.config },
      runtime: { ...createdBlock.runtime, ...block.runtime },
      source: block.source || createdBlock.source,
      governance: block.governance || createdBlock.governance,
    };
  });
  const blockMap = new Map(blocks.map((block) => [block.id, block]));
  const edges = (parsed.edges || [])
    .map((edge) => getTypedEdgeFromUnknown(edge, blockMap))
    .filter((edge): edge is WorkflowEdge => Boolean(edge));
  const structure = parsed.structure || getWorkflowStructure(blocks);
  const runtimeUiConfig =
    parsed.runtimeUiConfig ||
    generateRuntimeUiConfigFromParts({
      blocks,
      sourceWorkflowId: LOCAL_WORKFLOW_ID,
      structure,
    });
  const outputMappingPreview = generateOutputMappingPreviewFromParts({
    blocks,
    edges,
    generatedAt: parsed.outputMappingPreview?.generatedAt,
    sourceWorkflowId: LOCAL_WORKFLOW_ID,
  });
  const aiProposals = ((parsed.aiProposals as unknown[] | undefined) || [])
    .map((proposal, index) => normalizeAiProposal(proposal, index, blockMap))
    .filter((proposal): proposal is AiProposal => Boolean(proposal));
  const mockRuns = parsed.mockRuns || [];
  const versionSnapshots = normalizeVersionSnapshots({
    aiProposals,
    blocks,
    edges,
    mockRuns,
    snapshots: parsed.versionSnapshots,
    structure,
    workflowId: LOCAL_WORKFLOW_ID,
    workflowName: parsed.name || "Imported Fiscal Workflow",
  });
  const publishedVersion =
    parsed.publishedVersion || getPublishedVersionReference(versionSnapshots);

  return {
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    id: LOCAL_WORKFLOW_ID,
    name: parsed.name || "Imported Fiscal Workflow",
    description: parsed.description || "Imported local workflow.",
    status: parsed.status || "draft",
    metadata: {
      kind: "generic-fiscal-workflow",
      sampleWorkflow: parsed.metadata?.sampleWorkflow,
      tags: parsed.metadata?.tags || ["imported", "local"],
      createdBy: parsed.metadata?.createdBy || SYSTEM_USER,
      createdAt: parsed.metadata?.createdAt || now,
      updatedBy: SYSTEM_USER,
      updatedAt: now,
      notes: parsed.metadata?.notes,
    },
    blocks,
    edges,
    structure,
    runtimeUiConfig,
    outputMappingPreview,
    mockRuns,
    versionSnapshots,
    latestPublishedVersionId:
      parsed.latestPublishedVersionId || publishedVersion?.id,
    publishedVersion,
    aiProposals,
    events: [
      ...((parsed.events || [])
        .map(normalizeWorkflowEvent)
        .filter((event): event is WorkflowEvent => Boolean(event)) || []),
      ...(parsed.schemaVersion !== LOCAL_WORKFLOW_SCHEMA_VERSION
        ? [
            createWorkflowEvent({
              type: "migration",
              message: "Imported workflow was migrated to the local v1 schema.",
            }),
          ]
        : []),
    ],
  };
}

export type LocalWorkflowLoadResult = {
  snapshot: LocalWorkflowSnapshot | null;
  warning?: string;
};

function readStoredWorkflowDefinitionResult(): LocalWorkflowLoadResult {
  if (typeof window === "undefined") {
    return { snapshot: null };
  }

  const stored = window.localStorage.getItem(LOCAL_WORKFLOW_STORAGE_KEY);
  if (!stored) {
    return { snapshot: null };
  }

  try {
    return { snapshot: parseLocalWorkflowJson(stored) };
  } catch (error) {
    return {
      snapshot: null,
      warning:
        error instanceof Error
          ? error.message
          : "Saved local workflow could not be loaded.",
    };
  }
}

function readStoredWorkflowDefinition(): WorkflowDefinition | null {
  return readStoredWorkflowDefinitionResult().snapshot;
}

const SINGLE_ITEM_PIPELINE_ROWS = [
  {
    account: "4000",
    amount: 100,
    currency: "USD",
    description: "Interest earned on deposit account",
    label: "Interest income",
    rowId: "row-001",
  },
];

const SINGLE_ITEM_PIPELINE_RULES = [
  {
    confidence: 0.95,
    description: "Classifies interest-related income rows.",
    keywords: ["interest income", "interest earned", "deposit interest"],
    matchMode: "contains",
    priority: 10,
    ruleId: "rule-001",
    sectionId: "income",
    subsectionId: "interest",
    target: "income_interest",
  },
];

function createSingleItemPipelineBlocks() {
  const specs = [
    {
      catalogId: "source:excel-workbook",
      config: {
        outputs: "rows",
        rows: SINGLE_ITEM_PIPELINE_ROWS,
        sourceKind: "manual_table",
        sourceLocator: "excel-template-mock://single-item/row-001",
        toolId: "source.manual_table",
      },
      description:
        "Immutable Excel-like source row. The demo follows row-001 end to end.",
      id: "single-source-excel-row",
      label: "Excel Template Row Source",
      position: { x: 80, y: 140 },
    },
    {
      catalogId: "source:keyword-rules",
      config: {
        keywordRules: SINGLE_ITEM_PIPELINE_RULES,
        outputs: "keyword_rules",
        sourceKind: "keyword_rules",
        sourceLocator: "manual-source://single-item-mapping-rules",
        toolId: "source.keyword_rules",
      },
      description:
        "Editable Keyword Rulebook used by the mapper. Rules are not hardcoded in Logic.",
      id: "single-source-mapping-rules",
      label: "Keyword Rulebook",
      position: { x: 80, y: 380 },
    },
    {
      catalogId: "logic:classification-mapping",
      config: {
        conflictStrategy: "highest_confidence",
        inputs: "data_rows, keyword_rules",
        lowConfidenceThreshold: 0.75,
        matchFields: ["label", "description"],
        matchMode: "contains",
        outputs: "mapped_rows",
        toolId: "logic.keyword_mapper",
        unmatchedStrategy: "send_to_review",
      },
      description:
        "Reusable no-code Logic tool that maps source rows with connected keyword rules.",
      id: "single-logic-keyword-mapper",
      label: "Keyword Mapper",
      position: { x: 380, y: 250 },
    },
    {
      catalogId: "logic:aggregation",
      config: {
        aggregationMethod: "sum",
        amountField: "amount",
        includeSectionIds: ["income"],
        includeSubsectionIds: ["interest"],
        includeTargets: ["income_interest"],
        inputs: "mapped_rows",
        outputs: "subtotal",
        toolId: "logic.aggregation",
      },
      description:
        "Aggregates the mapped single item into the income / interest subtotal.",
      id: "single-logic-section-aggregator",
      label: "Section Aggregator",
      position: { x: 700, y: 250 },
    },
    {
      catalogId: "review:low-confidence-warning",
      config: {
        blocking: true,
        inputs: "mapped_rows",
        outputs: "validation_result",
        threshold: 0.75,
        toolId: "review.confidence_check",
      },
      description:
        "Review / Validation checkpoint that decides whether the mapping is trustworthy.",
      id: "single-review-confidence-check",
      label: "Confidence Check",
      position: { x: 700, y: 470 },
    },
    {
      catalogId: "review:approval-gate",
      config: {
        approved: true,
        inputs: "value_to_approve, validation_result",
        notes: "Approved for single item pipeline demo.",
        outputs: "approval_status",
        reviewer: "demo-reviewer",
        toolId: "review.approval_gate",
      },
      description:
        "Local mock approval gate that lets the candidate subtotal become governed.",
      id: "single-review-approval-gate",
      label: "Approval Gate",
      position: { x: 1020, y: 360 },
    },
    {
      catalogId: "protected:protected-result",
      config: {
        inputs: "candidate_value, approval_status",
        outputs: "protected_result",
        resultName: "Z",
        runtimeLocked: true,
        toolId: "protected.protected_result",
      },
      description:
        "Governed final result. If approval is removed, Z becomes draft and needs review.",
      id: "single-protected-result-z",
      label: "Protected Result Z",
      position: { x: 1340, y: 250 },
    },
    {
      catalogId: "output:evidence-pack",
      config: {
        inputs:
          "protected_result, mapped_rows, validation_result, approval_status",
        outputs: "preview",
        toolId: "output.evidence_pack_preview",
      },
      description:
        "Human-readable local evidence preview for the final Z result.",
      id: "single-output-z-evidence-preview",
      label: "Z Evidence Preview",
      position: { x: 1660, y: 160 },
    },
    {
      catalogId: "output:canonical-json",
      config: {
        inputs: "protected_result, source_trace",
        outputs: "canonical_json",
        toolId: "output.canonical_json",
      },
      description:
        "Structured local JSON package for the final Z result and trace.",
      id: "single-output-z-canonical-json",
      label: "Z Canonical JSON",
      position: { x: 1660, y: 380 },
    },
  ];

  return specs.map((spec) =>
    createWorkflowBlockFromCatalog(spec.catalogId, {
      config: spec.config,
      createdAt: SAMPLE_CREATED_AT,
      description: spec.description,
      id: spec.id,
      label: spec.label,
      position: spec.position,
      sample: true,
      status: "configured",
      updatedAt: SAMPLE_CREATED_AT,
    })
  );
}

function getSingleItemPipelineDemoEdges(): WorkflowEdge[] {
  // biome-ignore lint/nursery/useMaxParams: Compact demo-edge DSL keeps the single-item path readable.
  const edge = (
    sourceBlockId: string,
    targetBlockId: string,
    relationshipType: WorkflowRelationshipType,
    reason: string,
    binding: Pick<
      WorkflowEdge,
      "bindingLabel" | "bindingStatus" | "sourceOutputRole" | "targetInputRole"
    >
  ) =>
    createWorkflowEdgeRecord({
      id: `single-edge-${sourceBlockId}-${targetBlockId}-${binding.sourceOutputRole || "out"}-${binding.targetInputRole || "in"}`,
      sourceBlockId,
      targetBlockId,
      relationshipType,
      reason,
      confidence: 1,
      ...binding,
      createdAt: SAMPLE_CREATED_AT,
    });

  return [
    edge(
      "single-source-excel-row",
      "single-logic-keyword-mapper",
      "provides_data_to",
      "Keyword Mapper needs data rows.",
      {
        bindingLabel: "Rows to classify",
        bindingStatus: "valid",
        sourceOutputRole: "rows",
        targetInputRole: "data_rows",
      }
    ),
    edge(
      "single-source-mapping-rules",
      "single-logic-keyword-mapper",
      "referenced_by",
      "Keyword Mapper applies this versioned rulebook.",
      {
        bindingLabel: "Rules used for classification",
        bindingStatus: "valid",
        sourceOutputRole: "keyword_rules",
        targetInputRole: "keyword_rules",
      }
    ),
    edge(
      "single-logic-keyword-mapper",
      "single-logic-section-aggregator",
      "transforms_into",
      "Aggregator sums mapped rows by section/subsection.",
      {
        bindingLabel: "Mapped rows to aggregate",
        bindingStatus: "valid",
        sourceOutputRole: "mapped_rows",
        targetInputRole: "mapped_rows",
      }
    ),
    edge(
      "single-logic-keyword-mapper",
      "single-review-confidence-check",
      "triggers_validation",
      "Confidence Check reviews the mapped row confidence.",
      {
        bindingLabel: "Mapped rows to validate",
        bindingStatus: "valid",
        sourceOutputRole: "mapped_rows",
        targetInputRole: "checked_items",
      }
    ),
    edge(
      "single-logic-section-aggregator",
      "single-review-approval-gate",
      "triggers_validation",
      "Approval Gate reviews the candidate subtotal for Z.",
      {
        bindingLabel: "Candidate subtotal",
        bindingStatus: "valid",
        sourceOutputRole: "subtotal",
        targetInputRole: "value_to_approve",
      }
    ),
    edge(
      "single-review-confidence-check",
      "single-review-approval-gate",
      "depends_on",
      "Approval Gate considers the validation result.",
      {
        bindingLabel: "Confidence validation",
        bindingStatus: "valid",
        sourceOutputRole: "validation_result",
        targetInputRole: "validation_result",
      }
    ),
    edge(
      "single-logic-section-aggregator",
      "single-protected-result-z",
      "feeds_protected_result",
      "Subtotal becomes the candidate value for Z.",
      {
        bindingLabel: "Candidate Z value",
        bindingStatus: "valid",
        sourceOutputRole: "subtotal",
        targetInputRole: "candidate_value",
      }
    ),
    edge(
      "single-review-approval-gate",
      "single-protected-result-z",
      "approves_for",
      "Approval Gate determines whether Z can become final.",
      {
        bindingLabel: "Approval for Z",
        bindingStatus: "valid",
        sourceOutputRole: "approval_status",
        targetInputRole: "approval_status",
      }
    ),
    edge(
      "single-protected-result-z",
      "single-output-z-evidence-preview",
      "maps_to_output",
      "Evidence preview displays the final protected result.",
      {
        bindingLabel: "Final Z output",
        bindingStatus: "valid",
        sourceOutputRole: "protected_result",
        targetInputRole: "protected_result",
      }
    ),
    edge(
      "single-logic-keyword-mapper",
      "single-output-z-evidence-preview",
      "included_in_output_preview",
      "Evidence preview lists the mapped row and rule.",
      {
        bindingLabel: "Mapped row trace",
        bindingStatus: "valid",
        sourceOutputRole: "mapped_rows",
        targetInputRole: "mapped_rows",
      }
    ),
    edge(
      "single-review-confidence-check",
      "single-output-z-evidence-preview",
      "included_in_output_preview",
      "Evidence preview includes validation status.",
      {
        bindingLabel: "Validation result",
        bindingStatus: "valid",
        sourceOutputRole: "validation_result",
        targetInputRole: "validation_result",
      }
    ),
    edge(
      "single-review-approval-gate",
      "single-output-z-evidence-preview",
      "included_in_output_preview",
      "Evidence preview includes approval status.",
      {
        bindingLabel: "Approval status",
        bindingStatus: "valid",
        sourceOutputRole: "approval_status",
        targetInputRole: "approval_status",
      }
    ),
    edge(
      "single-protected-result-z",
      "single-output-z-canonical-json",
      "maps_to_output",
      "Canonical JSON includes the final protected Z result.",
      {
        bindingLabel: "Final Z JSON",
        bindingStatus: "valid",
        sourceOutputRole: "protected_result",
        targetInputRole: "protected_result",
      }
    ),
    edge(
      "single-protected-result-z",
      "single-output-z-canonical-json",
      "maps_to_output",
      "Canonical JSON includes the trace carried by Z.",
      {
        bindingLabel: "Z source trace",
        bindingStatus: "valid",
        sourceOutputRole: "protected_result",
        targetInputRole: "source_trace",
      }
    ),
  ];
}

export function createSingleItemPipelineDemoWorkflow(): LocalWorkflowSnapshot {
  const blocks = createSingleItemPipelineBlocks();
  const edges = getSingleItemPipelineDemoEdges();
  const structure = getWorkflowStructure(blocks);
  const runtimeUiConfig = generateRuntimeUiConfigFromParts({
    blocks,
    generatedAt: SAMPLE_CREATED_AT,
    sourceWorkflowId: LOCAL_WORKFLOW_ID,
    structure,
  });
  const outputMappingPreview = generateOutputMappingPreviewFromParts({
    blocks,
    edges,
    generatedAt: SAMPLE_CREATED_AT,
    sourceWorkflowId: LOCAL_WORKFLOW_ID,
  });
  const mockRuns = getSampleBlockRuns(blocks);
  const initialSnapshot: WorkflowVersionSnapshot = {
    id: "version-single-item-pipeline-demo-v1",
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    workflowId: LOCAL_WORKFLOW_ID,
    workflowName: "Single Item Pipeline Demo",
    versionNumber: 1,
    label: "Initial Single Item Pipeline Demo",
    status: "draft",
    createdBy: SYSTEM_USER,
    createdAt: SAMPLE_CREATED_AT,
    changeSummary:
      "Tiny executable local demo that carries row-001 through Source, Logic, Review, Protected, and Output.",
    blockCount: blocks.length,
    edgeCount: edges.length,
    blockIds: blocks.map((block) => block.id),
    edgeIds: edges.map((edge) => edge.id),
    blocks: cloneJson(blocks),
    edges: cloneJson(edges),
    structure: cloneJson(structure),
    runtimeUiConfig: cloneJson(runtimeUiConfig),
    outputMappingPreview: cloneJson(outputMappingPreview),
    aiProposals: [],
    mockRuns: cloneJson(mockRuns),
    notes: "Local deterministic single item demo. No external integrations.",
    validationWarnings: [],
  };

  return {
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    id: LOCAL_WORKFLOW_ID,
    name: "Single Item Pipeline Demo",
    description:
      "Generic local proof that one Source item can flow through reusable Logic, Review / Validation, Protected governance, and Output artifacts.",
    status: "draft",
    metadata: {
      kind: "generic-fiscal-workflow",
      sampleWorkflow: {
        id: "single-item-pipeline-demo",
        label: "Single Item Pipeline Demo",
        description:
          "Generic executable demo. The final protected result is Z.",
      },
      tags: ["local", "prototype", "single-item-demo"],
      createdBy: SYSTEM_USER,
      createdAt: SAMPLE_CREATED_AT,
      updatedBy: SYSTEM_USER,
      updatedAt: new Date().toISOString(),
      notes:
        "No live OCR, AI, Taxprep, ONESOURCE, Excel parser, PDF parser, or backend integration is included.",
    },
    blocks,
    edges,
    structure,
    runtimeUiConfig,
    outputMappingPreview,
    mockRuns,
    versionSnapshots: [initialSnapshot],
    aiProposals: [],
    events: [
      createWorkflowEvent({
        type: "reset_sample",
        message: "Single Item Pipeline Demo initialized locally.",
        createdAt: SAMPLE_CREATED_AT,
      }),
    ],
  };
}

function createExpandedMappingPipelineBlocks() {
  return EXPANDED_MAPPING_PIPELINE_BLOCK_SPECS.map((spec) =>
    createWorkflowBlockFromCatalog(spec.catalogId, {
      config: cloneJson(spec.config) as Record<string, unknown>,
      createdAt: SAMPLE_CREATED_AT,
      description: spec.description,
      id: spec.id,
      label: spec.label,
      position: spec.position,
      sample: true,
      status: "configured",
      updatedAt: SAMPLE_CREATED_AT,
    })
  );
}

function getExpandedMappingPipelineDemoEdges(): WorkflowEdge[] {
  return EXPANDED_MAPPING_PIPELINE_EDGE_SPECS.map((spec) =>
    createWorkflowEdgeRecord({
      bindingLabel: spec.bindingLabel,
      bindingStatus: "valid",
      confidence: 1,
      createdAt: SAMPLE_CREATED_AT,
      id: `expanded-edge-${spec.sourceBlockId}-${spec.targetBlockId}-${spec.sourceOutputRole}-${spec.targetInputRole}`,
      reason: spec.reason,
      relationshipType: spec.relationshipType as WorkflowRelationshipType,
      sourceBlockId: spec.sourceBlockId,
      sourceOutputRole: spec.sourceOutputRole,
      targetBlockId: spec.targetBlockId,
      targetInputRole: spec.targetInputRole,
    })
  );
}

export function createExpandedMappingPipelineDemoWorkflow(): LocalWorkflowSnapshot {
  const blocks = createExpandedMappingPipelineBlocks();
  const edges = getExpandedMappingPipelineDemoEdges();
  const structure = getWorkflowStructure(blocks);
  const runtimeUiConfig = generateRuntimeUiConfigFromParts({
    blocks,
    generatedAt: SAMPLE_CREATED_AT,
    sourceWorkflowId: LOCAL_WORKFLOW_ID,
    structure,
  });
  const outputMappingPreview = generateOutputMappingPreviewFromParts({
    blocks,
    edges,
    generatedAt: SAMPLE_CREATED_AT,
    sourceWorkflowId: LOCAL_WORKFLOW_ID,
  });
  const mockRuns = getSampleBlockRuns(blocks);
  const initialSnapshot: WorkflowVersionSnapshot = {
    aiProposals: [],
    blockCount: blocks.length,
    blockIds: blocks.map((block) => block.id),
    blocks: cloneJson(blocks),
    changeSummary:
      "Expanded generic local demo that maps 15 rows, aggregates Z and W, validates warnings, and produces protected outputs.",
    createdAt: SAMPLE_CREATED_AT,
    createdBy: SYSTEM_USER,
    edgeCount: edges.length,
    edgeIds: edges.map((edge) => edge.id),
    edges: cloneJson(edges),
    id: "version-expanded-mapping-pipeline-demo-v1",
    label: "Initial Expanded Mapping Pipeline Demo",
    mockRuns: cloneJson(mockRuns),
    notes:
      "Local deterministic expanded mapping demo. No external integrations.",
    outputMappingPreview: cloneJson(outputMappingPreview),
    runtimeUiConfig: cloneJson(runtimeUiConfig),
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    status: "draft",
    structure: cloneJson(structure),
    validationWarnings: [],
    versionNumber: 1,
    workflowId: LOCAL_WORKFLOW_ID,
    workflowName: "Expanded Mapping Pipeline Demo",
  };

  return {
    aiProposals: [],
    blocks,
    description:
      "Generic local stress-test that maps many Excel-like rows with Source rules, aggregates section results into protected Z and W, and produces local output previews.",
    edges,
    events: [
      createWorkflowEvent({
        createdAt: SAMPLE_CREATED_AT,
        message: "Expanded Mapping Pipeline Demo initialized locally.",
        type: "reset_sample",
      }),
    ],
    id: LOCAL_WORKFLOW_ID,
    metadata: {
      createdAt: SAMPLE_CREATED_AT,
      createdBy: SYSTEM_USER,
      kind: "generic-fiscal-workflow",
      notes:
        "No live OCR, AI, Taxprep, ONESOURCE, Excel parser, PDF parser, or backend integration is included.",
      sampleWorkflow: {
        description:
          "Generic executable stress-test demo. The final protected results are Z and W.",
        id: "expanded-mapping-pipeline-demo",
        label: "Expanded Mapping Pipeline Demo",
      },
      tags: ["local", "prototype", "expanded-mapping-demo"],
      updatedAt: new Date().toISOString(),
      updatedBy: SYSTEM_USER,
    },
    mockRuns,
    name: "Expanded Mapping Pipeline Demo",
    outputMappingPreview,
    runtimeUiConfig,
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    status: "draft",
    structure,
    versionSnapshots: [initialSnapshot],
  };
}

function createWorkingSourceRulesDemoBlocks() {
  return WORKING_SOURCE_DEMO_BLOCK_SPECS.map((spec) =>
    createWorkflowBlockFromCatalog(spec.catalogId, {
      config: cloneJson(spec.config) as Record<string, unknown>,
      createdAt: SAMPLE_CREATED_AT,
      description: spec.description,
      id: spec.id,
      label: spec.label,
      position: spec.position,
      sample: true,
      status: "configured",
      updatedAt: SAMPLE_CREATED_AT,
    })
  );
}

function getWorkingSourceRulesDemoEdges(): WorkflowEdge[] {
  return WORKING_SOURCE_DEMO_EDGE_SPECS.map((spec) =>
    createWorkflowEdgeRecord({
      bindingLabel: spec.bindingLabel,
      bindingStatus: "valid",
      confidence: 1,
      createdAt: SAMPLE_CREATED_AT,
      id: `working-edge-${spec.sourceBlockId}-${spec.targetBlockId}-${spec.sourceOutputRole}-${spec.targetInputRole}`,
      reason: spec.reason,
      relationshipType: spec.relationshipType as WorkflowRelationshipType,
      sourceBlockId: spec.sourceBlockId,
      sourceOutputRole: spec.sourceOutputRole,
      targetBlockId: spec.targetBlockId,
      targetInputRole: spec.targetInputRole,
    })
  );
}

export function createWorkingSourceRulesDemoWorkflow(): LocalWorkflowSnapshot {
  const blocks = createWorkingSourceRulesDemoBlocks();
  const edges = getWorkingSourceRulesDemoEdges();
  const structure = getWorkflowStructure(blocks);
  const runtimeUiConfig = generateRuntimeUiConfigFromParts({
    blocks,
    generatedAt: SAMPLE_CREATED_AT,
    sourceWorkflowId: LOCAL_WORKFLOW_ID,
    structure,
  });
  const outputMappingPreview = generateOutputMappingPreviewFromParts({
    blocks,
    edges,
    generatedAt: SAMPLE_CREATED_AT,
    sourceWorkflowId: LOCAL_WORKFLOW_ID,
  });
  const mockRuns = getSampleBlockRuns(blocks);
  const initialSnapshot: WorkflowVersionSnapshot = {
    aiProposals: [],
    blockCount: blocks.length,
    blockIds: blocks.map((block) => block.id),
    blocks: cloneJson(blocks),
    changeSummary:
      "Working local FAPI-style preparation demo with Excel Source rows, imported rulebooks, calculator validation, and protected outputs.",
    createdAt: SAMPLE_CREATED_AT,
    createdBy: SYSTEM_USER,
    edgeCount: edges.length,
    edgeIds: edges.map((edge) => edge.id),
    edges: cloneJson(edges),
    id: "version-working-source-rules-demo-v1",
    label: "Initial Working FAPI Workbook Preparation Demo",
    mockRuns: cloneJson(mockRuns),
    notes:
      "Local deterministic working demo. Uploaded Excel rows and draft mapping rules stay local.",
    outputMappingPreview: cloneJson(outputMappingPreview),
    runtimeUiConfig: cloneJson(runtimeUiConfig),
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    status: "draft",
    structure: cloneJson(structure),
    validationWarnings: [],
    versionNumber: 1,
    workflowId: LOCAL_WORKFLOW_ID,
    workflowName: "Working FAPI Workbook Preparation Demo",
  };

  return {
    aiProposals: [],
    blocks,
    description:
      "Practical generic local demo for preparing a FAPI-style workflow from an uploaded Excel workbook with editable rulebooks and protected outputs.",
    edges,
    events: [
      createWorkflowEvent({
        createdAt: SAMPLE_CREATED_AT,
        message: "Working Excel Source + Rulebooks Demo initialized locally.",
        type: "reset_sample",
      }),
    ],
    id: LOCAL_WORKFLOW_ID,
    metadata: {
      createdAt: SAMPLE_CREATED_AT,
      createdBy: SYSTEM_USER,
      kind: "generic-fiscal-workflow",
      notes:
        "No live OCR, AI, Taxprep, ONESOURCE, PDF parser, or backend integration is included.",
      sampleWorkflow: {
        description:
          "Generic practical local demo for Excel source rows, editable rulebooks, FAPI-style calculations, and output previews.",
        id: "working-source-rules-demo",
        label: "Working FAPI Workbook Preparation Demo",
      },
      tags: ["local", "prototype", "working-source-rules-demo"],
      updatedAt: new Date().toISOString(),
      updatedBy: SYSTEM_USER,
    },
    mockRuns,
    name: "Working FAPI Workbook Preparation Demo",
    outputMappingPreview,
    runtimeUiConfig,
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    status: "draft",
    structure,
    versionSnapshots: [initialSnapshot],
  };
}

export function createFapiTemplateWorkflow(): LocalWorkflowSnapshot {
  const blocks = FAPI_TEMPLATE_BLOCK_SPECS.map((spec) =>
    createWorkflowBlockFromCatalog(spec.catalogId, {
      config: cloneJson(spec.config) as Record<string, unknown>,
      createdAt: SAMPLE_CREATED_AT,
      description: spec.description,
      id: spec.id,
      label: spec.label,
      position: spec.position,
      sample: true,
      status: "configured",
      updatedAt: SAMPLE_CREATED_AT,
    })
  );
  const edges = FAPI_TEMPLATE_EDGE_SPECS.map((spec) =>
    createWorkflowEdgeRecord({
      bindingLabel: spec.bindingLabel,
      bindingStatus: "valid",
      confidence: 1,
      createdAt: SAMPLE_CREATED_AT,
      id: `fapi-edge-${spec.sourceBlockId}-${spec.targetBlockId}-${spec.sourceOutputRole}`,
      reason: spec.reason,
      relationshipType: spec.relationshipType as WorkflowRelationshipType,
      sourceBlockId: spec.sourceBlockId,
      sourceOutputRole: spec.sourceOutputRole,
      targetBlockId: spec.targetBlockId,
      targetInputRole: spec.targetInputRole,
    })
  );
  const structure = getWorkflowStructure(blocks);
  const runtimeUiConfig = generateRuntimeUiConfigFromParts({
    blocks,
    generatedAt: SAMPLE_CREATED_AT,
    sourceWorkflowId: LOCAL_WORKFLOW_ID,
    structure,
  });
  const outputMappingPreview = generateOutputMappingPreviewFromParts({
    blocks,
    edges,
    generatedAt: SAMPLE_CREATED_AT,
    sourceWorkflowId: LOCAL_WORKFLOW_ID,
  });
  const mockRuns = getSampleBlockRuns(blocks);
  const initialSnapshot: WorkflowVersionSnapshot = {
    aiProposals: [],
    blockCount: blocks.length,
    blockIds: blocks.map((b) => b.id),
    blocks: cloneJson(blocks),
    changeSummary:
      "FAPI template: Excel source → keyword mapping → rollup → two-stage calculation → Field displays → output.",
    createdAt: SAMPLE_CREATED_AT,
    createdBy: SYSTEM_USER,
    edgeCount: edges.length,
    edgeIds: edges.map((e) => e.id),
    edges: cloneJson(edges),
    id: "version-fapi-template-v1",
    label: "FAPI Template v1",
    mockRuns: cloneJson(mockRuns),
    notes:
      "No validation or rulebook blocks — core pipeline only. Add Review/Validation and Rulebook blocks once the base numbers are confirmed.",
    outputMappingPreview: cloneJson(outputMappingPreview),
    runtimeUiConfig: cloneJson(runtimeUiConfig),
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    status: "draft",
    structure: cloneJson(structure),
    validationWarnings: [],
    versionNumber: 1,
    workflowId: LOCAL_WORKFLOW_ID,
    workflowName: "FAPI Calculation Template",
  };

  return {
    aiProposals: [],
    blocks,
    description:
      "Core FAPI pipeline: upload a trial balance, classify rows, roll up categories, compute lines A–H then summary totals, and display results in Field blocks.",
    edges,
    events: [
      createWorkflowEvent({
        createdAt: SAMPLE_CREATED_AT,
        message: "FAPI Calculation Template initialized.",
        type: "reset_sample",
      }),
    ],
    id: LOCAL_WORKFLOW_ID,
    metadata: {
      createdAt: SAMPLE_CREATED_AT,
      createdBy: SYSTEM_USER,
      kind: "generic-fiscal-workflow",
      notes:
        "Rulebook and validation blocks intentionally excluded from v1 — add them once base FAPI numbers are confirmed.",
      sampleWorkflow: {
        description:
          "Core FAPI pipeline: trial balance → keyword mapping → rollup → calculation → Field display → output.",
        id: "fapi-calculation-template",
        label: "FAPI Calculation Template",
      },
      tags: ["local", "fapi", "fapi-calculation-template"],
      updatedAt: new Date().toISOString(),
      updatedBy: SYSTEM_USER,
    },
    mockRuns,
    name: "FAPI Calculation Template",
    outputMappingPreview,
    runtimeUiConfig,
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    status: "draft",
    structure,
    versionSnapshots: [initialSnapshot],
  };
}

export function createRoullementFiscalWorkflow(): LocalWorkflowSnapshot {
  const blocks = ROULEMENT_FISCAL_BLOCK_SPECS.map((spec) =>
    createWorkflowBlockFromCatalog(spec.catalogId, {
      config: cloneJson(spec.config) as Record<string, unknown>,
      createdAt: SAMPLE_CREATED_AT,
      description: spec.description,
      id: spec.id,
      label: spec.label,
      position: spec.position,
      sample: true,
      status: "configured",
      updatedAt: SAMPLE_CREATED_AT,
    })
  );
  const edges = ROULEMENT_FISCAL_EDGE_SPECS.map((spec) =>
    createWorkflowEdgeRecord({
      bindingLabel: spec.bindingLabel,
      bindingStatus: "valid",
      confidence: 1,
      createdAt: SAMPLE_CREATED_AT,
      id: `roulement-edge-${spec.sourceBlockId}-${spec.targetBlockId}-${spec.sourceOutputRole}`,
      reason: spec.reason,
      relationshipType: spec.relationshipType as WorkflowRelationshipType,
      sourceBlockId: spec.sourceBlockId,
      sourceOutputRole: spec.sourceOutputRole,
      targetBlockId: spec.targetBlockId,
      targetInputRole: spec.targetInputRole,
    })
  );
  const structure = getWorkflowStructure(blocks);
  const runtimeUiConfig = generateRuntimeUiConfigFromParts({
    blocks,
    generatedAt: SAMPLE_CREATED_AT,
    sourceWorkflowId: LOCAL_WORKFLOW_ID,
    structure,
  });
  const outputMappingPreview = generateOutputMappingPreviewFromParts({
    blocks,
    edges,
    generatedAt: SAMPLE_CREATED_AT,
    sourceWorkflowId: LOCAL_WORKFLOW_ID,
  });
  const mockRuns = getSampleBlockRuns(blocks);
  const initialSnapshot: WorkflowVersionSnapshot = {
    aiProposals: [],
    blockCount: blocks.length,
    blockIds: blocks.map((b) => b.id),
    blocks: cloneJson(blocks),
    changeSummary:
      "Roulement fiscal art. 85 : tableau des biens → classification → agrégation PBR → calcul de l'élection → sommaire → remise T2057.",
    createdAt: SAMPLE_CREATED_AT,
    createdBy: SYSTEM_USER,
    edgeCount: edges.length,
    edgeIds: edges.map((e) => e.id),
    edges: cloneJson(edges),
    id: "version-roulement-fiscal-v1",
    label: "Roulement fiscal v1",
    mockRuns: cloneJson(mockRuns),
    notes:
      "Gabarit de base — aucun bloc de validation ou d'examen inclus. Ajouter des blocs Révision/Validation une fois les montants élus confirmés.",
    outputMappingPreview: cloneJson(outputMappingPreview),
    runtimeUiConfig: cloneJson(runtimeUiConfig),
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    status: "draft",
    structure: cloneJson(structure),
    validationWarnings: [],
    versionNumber: 1,
    workflowId: LOCAL_WORKFLOW_ID,
    workflowName: "Roulement fiscal — art. 85 LIR",
  };

  return {
    aiProposals: [],
    blocks,
    description:
      "Gabarit de roulement fiscal (art. 85 LIR) : téléverser le tableau des biens, classifier par type, agréger le PBR, calculer les bornes et le gain de l'élection, et produire les données T2057.",
    edges,
    events: [
      createWorkflowEvent({
        createdAt: SAMPLE_CREATED_AT,
        message: "Gabarit Roulement fiscal art. 85 initialisé.",
        type: "reset_sample",
      }),
    ],
    id: LOCAL_WORKFLOW_ID,
    metadata: {
      createdAt: SAMPLE_CREATED_AT,
      createdBy: SYSTEM_USER,
      kind: "generic-fiscal-workflow",
      notes:
        "Blocs de validation et de révision exclus du v1 — à ajouter une fois le montant élu confirmé.",
      sampleWorkflow: {
        description:
          "Roulement fiscal art. 85 : biens → classification → PBR → élection → sommaire → T2057.",
        id: "roulement-fiscal-template",
        label: "Roulement fiscal — art. 85 LIR",
      },
      tags: ["local", "roulement", "art-85", "roulement-fiscal-template"],
      updatedAt: new Date().toISOString(),
      updatedBy: SYSTEM_USER,
    },
    mockRuns,
    name: "Roulement fiscal — art. 85 LIR",
    outputMappingPreview,
    runtimeUiConfig,
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    status: "draft",
    structure,
    versionSnapshots: [initialSnapshot],
  };
}

export function createFapiSampleWorkflow(): LocalWorkflowSnapshot {
  const blockSpecs = getFapiSampleBlockSpecs();
  const blocks = blockSpecs.map((spec) =>
    createWorkflowBlockFromCatalog(spec.catalogId, {
      id: spec.id,
      label: spec.label,
      description: spec.description,
      position: spec.position,
      config: spec.config,
      status: spec.status || "configured",
      createdAt: SAMPLE_CREATED_AT,
      updatedAt: SAMPLE_CREATED_AT,
      sample: true,
    })
  );
  const edges = getFapiSampleEdges();
  const proposalBlock = createWorkflowBlockFromCatalog(
    "ai:ai-workflow-proposal",
    {
      id: "proposal-ai-review-pack-improvements",
      label: "AI Proposal: Evidence Pack Improvements",
      description:
        "Proposal object only. Approval would be required before mutating the graph.",
      position: { x: 1420, y: 740 },
      createdAt: SAMPLE_CREATED_AT,
      updatedAt: SAMPLE_CREATED_AT,
      sample: true,
    }
  );
  const proposalEdge = createWorkflowEdgeRecord({
    id: "proposal-edge-mapping-suggestion",
    sourceBlockId: proposalBlock.id,
    targetBlockId: "logic-classify-source-rows",
    relationshipType: "suggests_mapping",
    reason: "AI proposal suggests a mapping refinement for classified rows.",
    status: "proposed",
    confidence: 0.72,
    createdAt: SAMPLE_CREATED_AT,
  });
  const structure = getWorkflowStructure(blocks);
  const runtimeUiConfig = generateRuntimeUiConfigFromParts({
    blocks,
    generatedAt: SAMPLE_CREATED_AT,
    sourceWorkflowId: LOCAL_WORKFLOW_ID,
    structure,
  });
  const outputMappingPreview = generateOutputMappingPreviewFromParts({
    blocks,
    edges,
    generatedAt: SAMPLE_CREATED_AT,
    sourceWorkflowId: LOCAL_WORKFLOW_ID,
  });
  const mockRuns = getSampleBlockRuns(blocks);
  const aiProposals: AiProposal[] = [
    {
      id: "ai-proposal-fapi-review-pack",
      title: "Evidence pack refinement",
      originalPrompt:
        "Suggest a stronger review pack for the FAPI sample workflow.",
      interpretedPlan:
        "Add a proposal-only evidence pack refinement after output readiness.",
      selectedTools: ["local block catalog", "mock proposal writer"],
      generatedBlocks: [proposalBlock],
      generatedEdges: [proposalEdge],
      generatedCodeOrFormulas: [
        {
          blockId: proposalBlock.id,
          kind: "code",
          value:
            "return { success: true, data: { proposedArtifact: 'enhancedEvidencePack' } };",
        },
      ],
      status: "proposed",
      createdAt: SAMPLE_CREATED_AT,
      createdBy: "mock-ai-panel",
      confidence: 0.72,
      notes:
        "Sample proposal object only. Approval is required before graph changes.",
      history: [
        {
          id: "ai-proposal-fapi-review-pack-created",
          action: "created",
          by: "mock-ai-panel",
          at: SAMPLE_CREATED_AT,
          notes: "Seeded sample proposal.",
        },
      ],
    },
  ];
  const initialSnapshot: WorkflowVersionSnapshot = {
    id: "version-fapi-sample-v1",
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    workflowId: LOCAL_WORKFLOW_ID,
    workflowName: "Executable Mapping Demo - FAPI-inspired sample",
    versionNumber: 1,
    label: "Initial FAPI-inspired sample",
    status: "draft",
    createdBy: SYSTEM_USER,
    createdAt: SAMPLE_CREATED_AT,
    changeSummary:
      "Initial schema-driven sample with source, logic, validation, protected, output, and AI proposal objects.",
    blockCount: blocks.length,
    edgeCount: edges.length,
    blockIds: blocks.map((block) => block.id),
    edgeIds: edges.map((edge) => edge.id),
    blocks: cloneJson(blocks),
    edges: cloneJson(edges),
    structure: cloneJson(structure),
    runtimeUiConfig: cloneJson(runtimeUiConfig),
    outputMappingPreview: cloneJson(outputMappingPreview),
    aiProposals: cloneJson(aiProposals),
    mockRuns: cloneJson(mockRuns),
    notes: "Original local sample workflow.",
    validationWarnings: [],
  };

  return {
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    id: LOCAL_WORKFLOW_ID,
    name: "Executable Mapping Demo - FAPI-inspired sample",
    description:
      "Schema-driven local prototype sample for a generic fiscal workflow studio.",
    status: "draft",
    metadata: {
      kind: "generic-fiscal-workflow",
      sampleWorkflow: {
        id: "fapi-inspired-sample",
        label: "FAPI-inspired sample",
        description:
          "First sample workflow only. The studio model remains generic.",
      },
      tags: ["local", "prototype", "sample", "fapi-inspired"],
      createdBy: SYSTEM_USER,
      createdAt: SAMPLE_CREATED_AT,
      updatedBy: SYSTEM_USER,
      updatedAt: new Date().toISOString(),
      notes:
        "No live OCR, AI, Taxprep, ONESOURCE, or backend integration is included.",
    },
    blocks,
    edges,
    structure,
    runtimeUiConfig,
    outputMappingPreview,
    mockRuns,
    versionSnapshots: [initialSnapshot],
    aiProposals,
    events: [
      createWorkflowEvent({
        type: "reset_sample",
        message: "FAPI-inspired sample workflow initialized locally.",
        createdAt: SAMPLE_CREATED_AT,
      }),
    ],
  };
}

export function loadLocalWorkflowSnapshot(): LocalWorkflowSnapshot | null {
  return readStoredWorkflowDefinition();
}

export function loadLocalWorkflowSnapshotResult(): LocalWorkflowLoadResult {
  return readStoredWorkflowDefinitionResult();
}

export function saveLocalWorkflowSnapshot({
  description,
  edges,
  event,
  name,
  nodes,
  status,
}: {
  description?: string;
  edges: CanvasWorkflowEdge[];
  event?: WorkflowEvent;
  name: string;
  nodes: WorkflowNode[];
  status?: WorkflowDefinitionStatus;
}): LocalWorkflowSnapshot {
  const existing = readStoredWorkflowDefinition();
  const snapshot = createWorkflowDefinitionFromCanvas({
    description,
    edges,
    existing,
    name,
    nodes,
    status: status || existing?.status || "draft",
  });
  snapshot.events = appendWorkflowEvent(snapshot, event);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      LOCAL_WORKFLOW_STORAGE_KEY,
      JSON.stringify(snapshot, null, 2)
    );
  }

  return snapshot;
}

export function saveWorkflowDefinitionSnapshot(
  snapshot: WorkflowDefinition
): WorkflowDefinition {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      LOCAL_WORKFLOW_STORAGE_KEY,
      JSON.stringify(snapshot, null, 2)
    );
  }

  return snapshot;
}

function lockProtectedBlocksForRuntime(
  blocks: WorkflowBlock[]
): WorkflowBlock[] {
  return blocks;
}

function validateLocalPublish({
  definition,
  outputMappingPreview,
}: {
  definition: WorkflowDefinition;
  outputMappingPreview: OutputMappingPreview;
}): string[] {
  const warnings: string[] = [];
  if (definition.blocks.length === 0) {
    warnings.push("Workflow has no typed blocks.");
  }

  const outputBlocks = definition.blocks.filter(
    (block) => block.family === "Output"
  );
  if (outputBlocks.length === 0) {
    warnings.push("No Output blocks are represented in the workflow.");
  }

  const blockIds = new Set(definition.blocks.map((block) => block.id));
  const invalidEdges = definition.edges.filter(
    (edge) =>
      !(blockIds.has(edge.sourceBlockId) && blockIds.has(edge.targetBlockId))
  );
  if (invalidEdges.length > 0) {
    warnings.push(
      `${invalidEdges.length} relationship(s) reference missing blocks.`
    );
  }

  const proposedOutputEdges = definition.edges.filter(
    (edge) =>
      edge.status !== "active" &&
      isOutputMappingRelationshipType(edge.relationshipType)
  );
  if (proposedOutputEdges.length > 0) {
    warnings.push(
      "Proposed, rejected, or disabled output mapping relationships were excluded from readiness."
    );
  }

  const candidateLogicOutputEdges = definition.edges.filter(
    (edge) =>
      edge.status === "active" &&
      isCandidateOutputRelationshipType(edge.relationshipType)
  );
  if (candidateLogicOutputEdges.length > 0) {
    warnings.push(LOGIC_OUTPUT_GOVERNANCE_WARNING);
  }

  for (const output of outputMappingPreview.outputs) {
    if (output.readinessStatus !== "ready") {
      warnings.push(
        `${output.outputLabel} is ${output.readinessStatus}: ${output.missingRequirements.join(", ")}`
      );
    }
  }

  return warnings;
}

export function publishWorkflowDefinition(
  definition: WorkflowDefinition,
  options: { notes?: string } = {}
): {
  snapshot: WorkflowVersionSnapshot;
  workflow: WorkflowDefinition;
  warnings: string[];
} {
  const now = new Date().toISOString();
  const lockedBlocks = lockProtectedBlocksForRuntime(definition.blocks);
  const structure = getWorkflowStructure(lockedBlocks);
  const nextVersionNumber =
    Math.max(
      0,
      ...definition.versionSnapshots.map((item) => item.versionNumber)
    ) + 1;
  const snapshotId = `version-${definition.id}-v${nextVersionNumber}-${Date.now()}`;
  const runtimeUiConfig = generateRuntimeUiConfigFromParts({
    blocks: lockedBlocks,
    generatedAt: now,
    sourceSnapshotId: snapshotId,
    sourceWorkflowId: definition.id,
    structure,
  });
  const outputMappingPreview = generateOutputMappingPreviewFromParts({
    blocks: lockedBlocks,
    edges: definition.edges,
    generatedAt: now,
    sourceSnapshotId: snapshotId,
    sourceWorkflowId: definition.id,
  });
  const workflowForValidation: WorkflowDefinition = {
    ...definition,
    blocks: lockedBlocks,
    outputMappingPreview,
    runtimeUiConfig,
    status: "published",
    structure,
  };
  const warnings = validateLocalPublish({
    definition: workflowForValidation,
    outputMappingPreview,
  });
  const snapshot: WorkflowVersionSnapshot = {
    id: snapshotId,
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    workflowId: definition.id,
    workflowName: definition.name,
    versionNumber: nextVersionNumber,
    label: `Published v${nextVersionNumber}`,
    status: "published",
    createdBy: SYSTEM_USER,
    createdAt: now,
    changeSummary:
      options.notes ||
      `Local publish frozen with ${lockedBlocks.length} blocks and ${definition.edges.length} relationships.`,
    blockCount: lockedBlocks.length,
    edgeCount: definition.edges.length,
    blockIds: lockedBlocks.map((block) => block.id),
    edgeIds: definition.edges.map((edge) => edge.id),
    blocks: cloneJson(lockedBlocks),
    edges: cloneJson(definition.edges),
    structure: cloneJson(structure),
    runtimeUiConfig: cloneJson(runtimeUiConfig),
    outputMappingPreview: cloneJson(outputMappingPreview),
    aiProposals: cloneJson(definition.aiProposals),
    mockRuns: cloneJson(definition.mockRuns),
    notes: options.notes,
    validationWarnings: warnings,
  };
  const workflow: WorkflowDefinition = {
    ...workflowForValidation,
    metadata: {
      ...definition.metadata,
      updatedBy: SYSTEM_USER,
      updatedAt: now,
    },
    versionSnapshots: [...definition.versionSnapshots, snapshot],
    latestPublishedVersionId: snapshot.id,
    publishedVersion: {
      id: snapshot.id,
      versionNumber: snapshot.versionNumber,
      createdAt: snapshot.createdAt,
    },
    events: appendWorkflowEvent(
      definition,
      createWorkflowEvent({
        type: "publish_snapshot",
        message: `Published local version ${snapshot.versionNumber}.`,
        createdAt: now,
        details: {
          outputPreviewCount: outputMappingPreview.outputs.length,
          runtimeSectionCount: runtimeUiConfig.sections.length,
          validationWarnings: warnings,
        },
      })
    ),
  };

  return { snapshot, workflow, warnings };
}

export function publishLocalWorkflowSnapshot({
  description,
  edges,
  name,
  nodes,
  notes,
}: {
  description?: string;
  edges: CanvasWorkflowEdge[];
  name: string;
  nodes: WorkflowNode[];
  notes?: string;
}): {
  snapshot: WorkflowVersionSnapshot;
  workflow: WorkflowDefinition;
  warnings: string[];
} {
  const draft = createWorkflowDefinitionFromCanvas({
    description,
    edges,
    existing: readStoredWorkflowDefinition(),
    name,
    nodes,
    status: "published",
  });
  const result = publishWorkflowDefinition(draft, { notes });
  saveWorkflowDefinitionSnapshot(result.workflow);
  return result;
}

export function parseLocalWorkflowJson(text: string): LocalWorkflowSnapshot {
  const parsed = JSON.parse(text) as Partial<
    LocalWorkflowSnapshot & {
      nodes?: WorkflowNode[];
      edges?: Array<CanvasWorkflowEdge | WorkflowEdge>;
      sampleDataset?: typeof LOCAL_SAMPLE_DATASET;
      version?: number;
    }
  >;

  if (Array.isArray(parsed.blocks)) {
    return normalizeWorkflowDefinition(parsed);
  }

  if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
    const canvasEdges = (parsed.edges as CanvasWorkflowEdge[]).map((edge) => ({
      ...edge,
      type: edge.type || "animated",
    }));
    return createWorkflowDefinitionFromCanvas({
      name: parsed.name || "Imported Fiscal Workflow",
      description: parsed.description || "Imported local workflow.",
      nodes: parsed.nodes,
      edges: canvasEdges,
      status: parsed.status || "draft",
    });
  }

  throw new Error("Imported JSON must include typed blocks or legacy nodes.");
}

export function loadLocalRunRecords(): LocalRunRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(LOCAL_RUNS_STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const records = JSON.parse(stored) as LocalRunRecord[];
    return records.map((record) => ({
      execution: {
        ...record.execution,
        startedAt: new Date(record.execution.startedAt),
        completedAt: record.execution.completedAt
          ? new Date(record.execution.completedAt)
          : null,
      },
      logs: record.logs.map((log) => ({
        ...log,
        startedAt: new Date(log.startedAt),
        completedAt: log.completedAt ? new Date(log.completedAt) : null,
      })),
    }));
  } catch {
    return [];
  }
}

const RUN_RECORD_ARRAY_PREVIEW_LIMIT = 120;
const RUN_RECORD_OBJECT_KEY_LIMIT = 80;
const RUN_RECORD_MAX_DEPTH = 7;

export function isLocalRunExecutionId(executionId?: string | null) {
  return Boolean(
    executionId?.startsWith("local-tool-") ||
      executionId?.startsWith("local-run-")
  );
}

function compactRunRecordValue(value: unknown, depth = 0): unknown {
  if (
    value === null ||
    value === undefined ||
    typeof value === "boolean" ||
    typeof value === "number" ||
    typeof value === "string"
  ) {
    return value;
  }

  if (depth >= RUN_RECORD_MAX_DEPTH) {
    return "[truncated depth]";
  }

  if (Array.isArray(value)) {
    const preview = value
      .slice(0, RUN_RECORD_ARRAY_PREVIEW_LIMIT)
      .map((item) => compactRunRecordValue(item, depth + 1));
    return value.length > RUN_RECORD_ARRAY_PREVIEW_LIMIT
      ? [
          ...preview,
          {
            omittedCount: value.length - RUN_RECORD_ARRAY_PREVIEW_LIMIT,
            truncated: true,
          },
        ]
      : preview;
  }

  if (typeof value !== "object") {
    return String(value);
  }

  const entries = Object.entries(value as Record<string, unknown>);
  const compacted = Object.fromEntries(
    entries
      .slice(0, RUN_RECORD_OBJECT_KEY_LIMIT)
      .map(([key, item]) => [key, compactRunRecordValue(item, depth + 1)])
  );

  return entries.length > RUN_RECORD_OBJECT_KEY_LIMIT
    ? {
        ...compacted,
        omittedKeyCount: entries.length - RUN_RECORD_OBJECT_KEY_LIMIT,
        truncated: true,
      }
    : compacted;
}

function compactLocalRunRecord(record: LocalRunRecord): LocalRunRecord {
  return {
    execution: record.execution,
    logs: record.logs.map((log) => ({
      ...log,
      input: compactRunRecordValue(log.input),
      output: compactRunRecordValue(log.output),
    })),
  };
}

function minimalLocalRunRecord(record: LocalRunRecord): LocalRunRecord {
  return {
    execution: record.execution,
    logs: record.logs.map((log) => ({
      ...log,
      input: undefined,
      output: {
        compacted: true,
        message:
          "Detailed local run payload was too large for browser storage. Re-run the workflow to inspect current results.",
        status: log.status,
      },
    })),
  };
}

function persistLocalRunRecords(records: LocalRunRecord[]) {
  if (typeof window === "undefined") {
    return true;
  }

  try {
    window.localStorage.setItem(
      LOCAL_RUNS_STORAGE_KEY,
      JSON.stringify(records, null, 2)
    );
    return true;
  } catch (error) {
    console.warn("Local run history was too large to store.", error);
    return false;
  }
}

export function saveLocalRunRecord(record: LocalRunRecord): LocalRunRecord[] {
  const records = [record, ...loadLocalRunRecords()].slice(0, 12);
  if (persistLocalRunRecords(records)) {
    return records;
  }

  if (persistLocalRunRecords([record])) {
    return [record];
  }

  const compactRecords = records.map(compactLocalRunRecord).slice(0, 4);
  if (persistLocalRunRecords(compactRecords)) {
    return compactRecords;
  }

  const compactCurrentRecord = compactLocalRunRecord(record);
  if (persistLocalRunRecords([compactCurrentRecord])) {
    return [compactCurrentRecord];
  }

  const minimalRecords = [minimalLocalRunRecord(record)];
  persistLocalRunRecords(minimalRecords);
  return minimalRecords;
}

export function clearLocalRunRecords() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(LOCAL_RUNS_STORAGE_KEY);
  }
}

function getFiscalOutputForStage(
  stage: string | undefined,
  nodeLabel: string,
  block?: WorkflowBlock
): Record<string, unknown> {
  if (block?.source) {
    return {
      block: block.label,
      family: block.family,
      subtype: block.subtype,
      immutable: block.source.immutable,
      treatedAsEvidence: block.source.treatedAsEvidence,
      locator: block.source.locator,
      valuesLocked: block.source.valuesLocked,
    };
  }

  if (block?.governance) {
    return {
      block: block.label,
      family: block.family,
      protectedKind: block.governance.protectedKind,
      lockedInRuntime: block.governance.lockedInRuntime,
      requiresUnlockToEdit: block.governance.requiresUnlockToEdit,
      outputKey: block.runtime.outputKey,
    };
  }

  switch (stage) {
    case "source":
      return {
        dataset: LOCAL_SAMPLE_DATASET.entity,
        period: LOCAL_SAMPLE_DATASET.period,
        immutable: true,
        sourceDocuments: LOCAL_SAMPLE_DATASET.sourceDocuments,
        rowCount: LOCAL_SAMPLE_DATASET.rows.length,
      };
    case "logic":
      return {
        derivedFields: [
          "jurisdictionClassification",
          "provisionalTaxBase",
          "protectedInputFlag",
        ],
        provisionalTaxBase: LOCAL_SAMPLE_DATASET.rows.reduce(
          (total, row) => total + row.revenue - row.deductibleExpenses,
          0
        ),
        method: "local mock calculation",
      };
    case "review":
    case "validation":
      return {
        checksPassed: 5,
        checksWarned: 1,
        warnings: ["UK withholding reserve requires reviewer signoff"],
        trustworthy: true,
      };
    case "output":
      return {
        artifacts: ["review_packet.json", "taxprep_bridge.csv"],
        handoffReady: true,
        destination: "download/export only",
      };
    case "ai-agent":
      return {
        proposalOnly: true,
        directMutation: false,
        status: "proposal retained for approval",
      };
    default:
      return {
        block: nodeLabel,
        status: "completed by local mock runner",
      };
  }
}

export function createLocalRunRecord(
  nodes: WorkflowNode[],
  edges: CanvasWorkflowEdge[]
): LocalRunRecord {
  const startedAt = new Date();
  const completedAt = new Date(startedAt.getTime() + 640);
  const executionId = `local-run-${startedAt.getTime()}`;
  const orderedNodes = nodes.filter((node) => node.type !== "add");

  const logs = orderedNodes.map((node, index) => {
    const block = node.data.block;
    const stage =
      (node.data.config?.fiscalStage as string | undefined) ||
      (block ? BLOCK_FAMILY_STAGE[block.family] : undefined) ||
      node.data.visualRole ||
      node.data.type;
    const stepStartedAt = new Date(startedAt.getTime() + index * 110);
    const stepCompletedAt = new Date(stepStartedAt.getTime() + 95);
    const nodeLabel = node.data.label || getFiscalStageLabel(stage);

    return {
      id: `${executionId}-${node.id}`,
      executionId,
      nodeId: node.id,
      nodeName: nodeLabel,
      nodeType: block
        ? `${block.family} / ${block.subtype}`
        : getFiscalStageLabel(stage),
      status: "success" as const,
      startedAt: stepStartedAt,
      completedAt: stepCompletedAt,
      duration: "95",
      input: {
        upstreamEdges: edges.filter((edge) => edge.target === node.id).length,
        stage,
      },
      output: getFiscalOutputForStage(stage, nodeLabel, block),
      error: null,
    };
  });

  return {
    execution: {
      id: executionId,
      workflowId: LOCAL_WORKFLOW_ID,
      status: "success",
      startedAt,
      completedAt,
      duration: String(completedAt.getTime() - startedAt.getTime()),
      error: null,
    },
    logs,
  };
}

function getSampleBlockRuns(blocks: WorkflowBlock[]): BlockRun[] {
  return blocks.slice(0, 8).map((block, index) => ({
    id: `sample-run-${block.id}`,
    blockId: block.id,
    blockLabel: block.label,
    status: index === 2 ? "warning" : "success",
    startedAt: SAMPLE_CREATED_AT,
    completedAt: SAMPLE_CREATED_AT,
    durationMs: 95,
    input: { mock: true },
    output: { outputKey: block.runtime.outputKey, mockOnly: true },
  }));
}

function getFapiSampleBlockSpecs(): Array<{
  catalogId: string;
  id: string;
  label: string;
  description: string;
  position: WorkflowPosition;
  config?: Record<string, unknown>;
  status?: BlockStatus;
}> {
  const x = {
    source: -980,
    logic: -620,
    review: -260,
    protectedInput: 100,
    official: 460,
    summary: 820,
    output: 1180,
  };
  const y = (row: number) => -520 + row * 150;

  return [
    {
      catalogId: "source:excel-workbook",
      id: "source-trial-balance",
      label: "Trial Balance Rows",
      description: "Manual table source for the first sample fiscal workflow",
      position: { x: x.source, y: y(1) },
      config: {
        manualRows: [
          {
            account: "4000",
            amount: 12_000,
            label: "Interest income",
            rowId: "tb-row-interest-income",
          },
          {
            account: "4100",
            amount: 8000,
            label: "Rental income",
            rowId: "tb-row-rental-income",
          },
          {
            account: "5000",
            amount: -600,
            label: "Bank charges",
            rowId: "tb-row-bank-charges",
          },
          {
            account: "5200",
            amount: -1200,
            label: "Professional fees",
            rowId: "tb-row-professional-fees",
          },
          {
            account: "6000",
            amount: 3000,
            label: "Other revenue",
            rowId: "tb-row-other-revenue",
          },
        ],
        outputs: "trialBalanceRows",
        sourceKind: "manual_table",
        sourceLocator: "trial-balance.xlsx#TB!A:K",
        canvasNodeType: "trigger",
        toolId: "source.manual_table",
      },
    },
    {
      catalogId: "source:keyword-rules",
      id: "source-keyword-rules",
      label: "Keyword Rulebook",
      description: "Editable keyword rulebook for local keyword mapping",
      position: { x: x.source, y: y(0) },
      config: {
        keywordRules: [
          {
            confidence: 0.9,
            keywords: ["interest income", "interest earned", "bank interest"],
            lineId: "A",
            ruleId: "keyword-rule-interest-income",
            subsectionId: "interest_income",
            target: "interestIncome",
          },
          {
            confidence: 0.9,
            keywords: ["rental income", "rent income", "lease income"],
            lineId: "A",
            ruleId: "keyword-rule-rents",
            subsectionId: "rental_income",
            target: "rents",
          },
          {
            confidence: 0.8,
            keywords: ["bank charges", "office expenses", "general expenses"],
            lineId: "EXPENSES",
            ruleId: "keyword-rule-general-expenses",
            subsectionId: "general_expenses",
            target: "generalExpenses",
          },
          {
            confidence: 0.8,
            keywords: ["professional fees", "accounting fees", "audit fees"],
            lineId: "EXPENSES",
            ruleId: "keyword-rule-accounting-expenses",
            subsectionId: "extra_expenses",
            target: "accountingExpenses",
          },
          {
            confidence: 0.7,
            keywords: [
              "other revenue",
              "miscellaneous income",
              "sundry income",
            ],
            lineId: "A",
            ruleId: "keyword-rule-other-fapi-income",
            subsectionId: "other_fapi_income",
            target: "otherFapiIncome",
          },
        ],
        outputs: "keywordRules",
        sourceKind: "keyword_rules",
        sourceLocator: "manual-source://keyword-rules",
        toolId: "source.keyword_rules",
      },
    },
    {
      catalogId: "source:pdf-document",
      id: "source-financial-statements-notes",
      label: "Financial statements and notes",
      description: "PDF / Document support for statements and notes",
      position: { x: x.source, y: y(2) },
      config: {
        outputs: "financialStatementEvidence",
        sourceLocator: "financial-statements.pdf#notes",
      },
    },
    {
      catalogId: "source:manual-entry",
      id: "source-fx-rate-override",
      label: "FX Rate",
      description: "Manual value source for the sample FX rate",
      position: { x: x.source, y: y(3) },
      config: {
        toolId: "source.manual_value",
        unit: "CAD/USD",
        value: 1.35,
        valueLabel: "FX Rate",
        outputs: "fxRateOverride",
        sourceLocator: "manual-entry://fx-rate-override",
        valuePreview: "1.3500 CAD/USD",
      },
    },
    {
      catalogId: "source:manual-entry",
      id: "source-inclusion-rate-constant",
      label: "Inclusion rate constant",
      description: "Manual Entry source for inclusion rate or constant",
      position: { x: x.source, y: y(4) },
      config: {
        toolId: "source.manual_value",
        value: 0.5,
        valueLabel: "Inclusion Rate",
        outputs: "inclusionRateConstant",
        sourceLocator: "manual-entry://inclusion-rate",
        valuePreview: "50%",
      },
    },
    {
      catalogId: "source:api-http-request",
      id: "source-fx-rate-api",
      label: "FX rate API source",
      description: "Mock source value for FX rates; no API call is made",
      position: { x: x.source, y: y(5) },
      config: {
        toolId: "source.manual_value",
        unit: "CAD/USD",
        value: 1.34,
        valueLabel: "Reference FX Rate",
        outputs: "fxRateApiResponse",
        sourceLocator: "https://rates.example.test/fx/CAD/USD",
      },
    },
    {
      catalogId: "logic:classification-mapping",
      id: "logic-classify-source-rows",
      label: "Keyword Mapper",
      description: "Map trial balance rows using connected keyword Sources",
      position: { x: x.logic, y: y(0) },
      config: {
        inputs: "trialBalanceRows, keywordRules",
        lowConfidenceThreshold: 0.75,
        outputs: "classifiedRows",
        toolId: "logic.keyword_mapper",
      },
    },
    {
      catalogId: "logic:aggregation",
      id: "logic-property-income",
      label: "Property income aggregation",
      description: "Aggregation of mapped income rows",
      position: { x: x.logic, y: y(1) },
      config: {
        aggregationMethod: "sum",
        amountField: "amount",
        includeTargets: ["interestIncome", "rents", "otherFapiIncome"],
        inputs: "classifiedRows",
        outputs: "propertyIncome",
        toolId: "logic.aggregation",
      },
    },
    {
      catalogId: "logic:aggregation",
      id: "logic-capital-gains-losses",
      label: "Capital gains / losses aggregation",
      description: "Aggregation of capital gains and losses",
      position: { x: x.logic, y: y(2) },
      config: {
        aggregationMethod: "sum",
        includeTargets: ["capital_gain"],
        inputs: "classifiedRows",
        outputs: "capitalGainsLosses",
        toolId: "logic.aggregation",
      },
    },
    {
      catalogId: "logic:aggregation",
      id: "logic-expenses-deductions",
      label: "Expenses and deductions aggregation",
      description: "Aggregation of expense and deduction rows",
      position: { x: x.logic, y: y(3) },
      config: {
        aggregationMethod: "sum",
        includeTargets: ["generalExpenses", "accountingExpenses"],
        inputs: "classifiedRows",
        outputs: "expensesDeductions",
        toolId: "logic.aggregation",
      },
    },
    {
      catalogId: "logic:formula",
      id: "logic-taxable-capital-gains",
      label: "Apply FX Rate Formula",
      description: "Safe local formula applying FX rate to mapped income",
      position: { x: x.logic, y: y(4) },
      config: {
        formula: "propertyIncome * fxRateOverride",
        inputs: "propertyIncome, fxRateOverride",
        operands: [
          "logic-property-income.subtotal",
          "source-fx-rate-override.value",
        ],
        operation: "multiply",
        outputs: "sampleFiscalResult",
        toolId: "logic.formula",
      },
    },
    {
      catalogId: "logic:formula",
      id: "logic-fat-deduction",
      label: "FAT deduction calculation",
      description: "Formula for foreign accrual tax deduction",
      position: { x: x.logic, y: y(5) },
      config: {
        formula: "fatPaid * rtf",
        inputs: "fatPaid, relevantTaxFactor",
        outputs: "fatDeduction",
      },
    },
    {
      catalogId: "logic:transformation",
      id: "logic-fx-conversion",
      label: "FX conversion and normalization",
      description: "Transformation for FX conversion or normalization",
      position: { x: x.logic, y: y(6) },
      config: {
        inputs: "fxRateApiResponse, fxRateOverride, documentCurrency",
        outputs: "normalizedAmounts",
      },
    },
    {
      catalogId: "logic:condition",
      id: "logic-missing-source-routing",
      label: "Missing source review routing",
      description: "Condition for missing source or review path routing",
      position: { x: x.logic, y: y(7) },
      config: {
        inputs: "sourceSupportFinding, confidenceWarning",
        outputs: "reviewRoute",
      },
    },
    {
      catalogId: "review:required-input-check",
      id: "review-required-fx-rate",
      label: "FX rate exists",
      description: "Required Input Check for FX rate existence",
      position: { x: x.review, y: y(1) },
      config: {
        inputs: "fxRateApiResponse, fxRateOverride",
        requiredKeys: ["fxRateOverride"],
        toolId: "review.required_input_check",
      },
    },
    {
      catalogId: "review:missing-source-check",
      id: "review-protected-support",
      label: "Protected values have support",
      description: "Missing Source Check for protected values",
      position: { x: x.review, y: y(2) },
    },
    {
      catalogId: "review:low-confidence-warning",
      id: "review-low-confidence",
      label: "Low confidence warning",
      description: "Warning for low-confidence classifications",
      position: { x: x.review, y: y(3) },
      config: {
        threshold: 0.8,
        toolId: "review.low_confidence_warning",
      },
    },
    {
      catalogId: "review:unmatched-rows-check",
      id: "review-unmatched-rows",
      label: "Unmatched rows check",
      description: "Review check for rows not mapped by keyword rules",
      position: { x: x.review, y: y(4) },
      config: {
        toolId: "review.unmatched_rows_check",
      },
    },
    {
      catalogId: "review:manual-override-review",
      id: "review-manual-override",
      label: "Manual override review",
      description: "Review manual override values",
      position: { x: x.review, y: y(5) },
    },
    {
      catalogId: "review:approval-gate",
      id: "review-approval-gate",
      label: "Approval gate",
      description: "Approval Gate before governed outputs",
      position: { x: x.review, y: y(6) },
      config: {
        approved: true,
        notes: "Local sample approval for protected result.",
        reviewer: "Sample Reviewer",
        toolId: "review.approval_gate",
      },
    },
    {
      catalogId: "review:output-readiness-check",
      id: "review-output-readiness",
      label: "Output readiness check",
      description: "Output Readiness Check for handoff artifacts",
      position: { x: x.review, y: y(7) },
      config: {
        toolId: "review.output_readiness_check",
      },
    },
    ...[
      ["protected-input-fx-rate", "Locked Rate", "FX Rate", "fxRate"],
      [
        "protected-input-reporting-currency",
        "Protected Input",
        "Reporting Currency",
        "reportingCurrency",
      ],
      [
        "protected-input-document-currency",
        "Protected Input",
        "Document Currency",
        "documentCurrency",
      ],
      [
        "protected-input-fapi-year",
        "Protected Input",
        "FAPI Year / Fiscal Period",
        "fapiFiscalPeriod",
      ],
      [
        "protected-input-inclusion-rate",
        "Locked Rate",
        "Inclusion Rate",
        "inclusionRate",
      ],
      [
        "protected-input-rtf",
        "Locked Rate",
        "RTF / relevant tax factor",
        "relevantTaxFactor",
      ],
      [
        "protected-input-fat-paid",
        "Protected Input",
        "FAT Paid / Foreign Accrual Tax input",
        "fatPaid",
      ],
    ].map(([id, subtype, label, output], index) => ({
      catalogId:
        subtype === "Locked Rate"
          ? "protected:locked-rate"
          : "protected:protected-input",
      id,
      label,
      description: `Protected Input: ${label}`,
      position: { x: x.protectedInput, y: y(index) },
      config: { outputs: output },
    })),
    ...["A", "A.1", "A.2", "B", "C", "D", "E", "F", "F.1", "G", "H"].map(
      (line, index) => ({
        catalogId: "protected:official-line",
        id: `protected-line-${line.toLowerCase().replace(".", "-")}`,
        label:
          line === "A"
            ? "Sample Official Fiscal Line A"
            : `Official Line ${line}`,
        description: `Protected official line ${line}`,
        position: { x: x.official, y: y(index - 1) },
        config: { outputs: `officialLine${line.replace(".", "_")}` },
      })
    ),
    ...[
      ["protected-summary-gross", "Gross", "gross"],
      ["protected-summary-deductions", "Deductions", "deductions"],
      ["protected-summary-fapi-brut", "FAPI Brut", "fapiBrut"],
      ["protected-summary-fat-deduction", "FAT Deduction", "fatDeduction"],
      [
        "protected-summary-net-fapi",
        "Sample Protected Result",
        "sampleProtectedResult",
      ],
      ["protected-summary-fapl-loss", "FAPL / loss result", "faplLossResult"],
    ].map(([id, label, output], index) => ({
      catalogId: "protected:final-reviewed-amount",
      id,
      label,
      description: `Protected summary result: ${label}`,
      position: { x: x.summary, y: y(index + 1) },
      config: { outputs: output, toolId: "protected.protected_result" },
    })),
    ...[
      ["output-csv-export", "output:csv-export", "CSV Export"],
      ["output-excel-export", "output:excel-export", "Excel Export"],
      ["output-pdf-review-pack", "output:pdf-report", "PDF Review Pack"],
      ["output-evidence-pack", "output:evidence-pack", "Evidence Pack"],
      ["output-canonical-json", "output:canonical-json", "Canonical JSON"],
      ["output-taxprep-handoff", "output:taxprep-handoff", "Taxprep Handoff"],
      [
        "output-onesource-handoff",
        "output:onesource-handoff",
        "ONESOURCE Handoff",
      ],
    ].map(([id, catalogId, label], index) => ({
      catalogId,
      id,
      label,
      description: `${label} output artifact`,
      position: { x: x.output, y: y(index) },
      config: {
        inputs: "approvedProtectedPacket",
        toolId:
          catalogId === "output:canonical-json"
            ? "output.canonical_json"
            : "output.evidence_pack_preview",
      },
    })),
  ];
}

function getFapiSampleEdges(): WorkflowEdge[] {
  // biome-ignore lint/nursery/useMaxParams: Compact sample-edge DSL keeps the graph readable.
  const edge = (
    sourceBlockId: string,
    targetBlockId: string,
    relationshipType: WorkflowRelationshipType,
    reason: string,
    confidence = 1,
    binding?: Pick<
      WorkflowEdge,
      "bindingLabel" | "bindingStatus" | "sourceOutputRole" | "targetInputRole"
    >
  ) =>
    createWorkflowEdgeRecord({
      id: `edge-${sourceBlockId}-${targetBlockId}`,
      sourceBlockId,
      targetBlockId,
      relationshipType,
      reason,
      confidence,
      ...binding,
      createdAt: SAMPLE_CREATED_AT,
    });

  const edges: WorkflowEdge[] = [
    edge(
      "source-trial-balance",
      "logic-classify-source-rows",
      "extracted_into",
      "Trial balance rows are extracted into classification logic.",
      1,
      {
        bindingLabel: "Data rows",
        bindingStatus: "valid",
        sourceOutputRole: "rows",
        targetInputRole: "data_rows",
      }
    ),
    edge(
      "source-keyword-rules",
      "logic-classify-source-rows",
      "referenced_by",
      "Keyword rule Source is referenced by the Keyword Mapper.",
      1,
      {
        bindingLabel: "Keyword rules",
        bindingStatus: "valid",
        sourceOutputRole: "keyword_rules",
        targetInputRole: "keyword_rules",
      }
    ),
    edge(
      "source-financial-statements-notes",
      "logic-classify-source-rows",
      "referenced_by",
      "Statements and notes are referenced by source row classification."
    ),
    edge(
      "source-inclusion-rate-constant",
      "logic-taxable-capital-gains",
      "provides_data_to",
      "Inclusion rate provides data to taxable capital gains formula."
    ),
    edge(
      "source-fx-rate-override",
      "logic-taxable-capital-gains",
      "provides_data_to",
      "FX rate source provides the rate for the sample formula."
    ),
    edge(
      "logic-classify-source-rows",
      "logic-property-income",
      "aggregates_into",
      "Classified rows aggregate into property income.",
      1,
      {
        bindingLabel: "Mapped rows",
        bindingStatus: "valid",
        sourceOutputRole: "mapped_rows",
        targetInputRole: "mapped_rows",
      }
    ),
    edge(
      "logic-property-income",
      "logic-taxable-capital-gains",
      "transforms_into",
      "Mapped income aggregation feeds the sample formula."
    ),
    edge(
      "logic-classify-source-rows",
      "logic-capital-gains-losses",
      "aggregates_into",
      "Classified rows aggregate into capital gains and losses.",
      1,
      {
        bindingLabel: "Mapped rows",
        bindingStatus: "valid",
        sourceOutputRole: "mapped_rows",
        targetInputRole: "mapped_rows",
      }
    ),
    edge(
      "logic-classify-source-rows",
      "logic-expenses-deductions",
      "aggregates_into",
      "Classified rows aggregate into expenses and deductions.",
      1,
      {
        bindingLabel: "Mapped rows",
        bindingStatus: "valid",
        sourceOutputRole: "mapped_rows",
        targetInputRole: "mapped_rows",
      }
    ),
    edge(
      "logic-capital-gains-losses",
      "logic-taxable-capital-gains",
      "transforms_into",
      "Capital gains aggregation transforms into taxable capital gains."
    ),
    edge(
      "logic-expenses-deductions",
      "logic-fat-deduction",
      "transforms_into",
      "Deduction aggregation transforms into FAT deduction calculation."
    ),
    edge(
      "source-fx-rate-api",
      "logic-fx-conversion",
      "provides_data_to",
      "API FX source provides data to conversion logic."
    ),
    edge(
      "source-fx-rate-override",
      "logic-fx-conversion",
      "referenced_by",
      "Manual FX override is referenced by conversion logic."
    ),
    edge(
      "logic-fx-conversion",
      "review-required-fx-rate",
      "checked_by",
      "FX conversion is checked for required rate availability."
    ),
    edge(
      "logic-classify-source-rows",
      "review-low-confidence",
      "triggers_validation",
      "Classification confidence requires low-confidence review.",
      1,
      {
        bindingLabel: "Low-confidence rows",
        bindingStatus: "valid",
        sourceOutputRole: "low_confidence_rows",
        targetInputRole: "checked_items",
      }
    ),
    edge(
      "logic-classify-source-rows",
      "review-unmatched-rows",
      "triggers_validation",
      "Unmatched mapped rows require review before governed output.",
      1,
      {
        bindingLabel: "Unmatched rows",
        bindingStatus: "valid",
        sourceOutputRole: "unmatched_rows",
        targetInputRole: "checked_items",
      }
    ),
    edge(
      "logic-missing-source-routing",
      "review-protected-support",
      "triggers_validation",
      "Missing source routing triggers source support validation."
    ),
    edge(
      "logic-missing-source-routing",
      "review-manual-override",
      "requires_review_by",
      "Routing logic requires manual override review when needed."
    ),
    edge(
      "logic-missing-source-routing",
      "review-approval-gate",
      "triggers_validation",
      "Routing logic triggers approval gate validation."
    ),
    edge(
      "logic-missing-source-routing",
      "review-output-readiness",
      "triggers_validation",
      "Routing logic triggers output readiness validation."
    ),
    edge(
      "review-required-fx-rate",
      "protected-input-fx-rate",
      "certifies",
      "Required FX rate check certifies the protected FX Rate input."
    ),
    edge(
      "review-protected-support",
      "protected-summary-gross",
      "certifies",
      "Source support check certifies the protected gross summary."
    ),
    edge(
      "review-manual-override",
      "protected-input-fx-rate",
      "approves_for",
      "Manual override review approves the protected FX Rate input."
    ),
    edge(
      "review-output-readiness",
      "protected-summary-net-fapi",
      "certifies",
      "Output readiness certifies the protected Net FAPI summary."
    ),
  ];

  for (const [source, target] of [
    ["logic-fx-conversion", "protected-input-fx-rate"],
    ["logic-fx-conversion", "protected-input-reporting-currency"],
    ["logic-fx-conversion", "protected-input-document-currency"],
    ["logic-taxable-capital-gains", "protected-input-inclusion-rate"],
    ["logic-fat-deduction", "protected-input-rtf"],
    ["logic-fat-deduction", "protected-input-fat-paid"],
  ]) {
    edges.push(
      edge(
        source,
        target,
        "feeds_protected_input",
        "Logic feeds a governed protected input."
      )
    );
  }

  edges.push(
    edge(
      "logic-taxable-capital-gains",
      "protected-input-fapi-year",
      "feeds_protected_input",
      "Taxable capital gains calculation references the governed fiscal period."
    )
  );

  for (const target of [
    "protected-input-fx-rate",
    "protected-input-reporting-currency",
    "protected-input-document-currency",
    "protected-input-fapi-year",
    "protected-input-inclusion-rate",
    "protected-input-rtf",
    "protected-input-fat-paid",
  ]) {
    edges.push(
      edge(
        "review-approval-gate",
        target,
        "approves_for",
        "Approval gate approves the governed input."
      )
    );
  }

  for (const target of [
    "protected-line-a",
    "protected-line-a-1",
    "protected-line-a-2",
    "protected-line-b",
    "protected-line-c",
    "protected-line-d",
    "protected-line-e",
    "protected-line-f",
    "protected-line-f-1",
    "protected-line-g",
    "protected-line-h",
  ]) {
    edges.push(
      edge(
        "review-approval-gate",
        target,
        "approves_for",
        "Approval gate approves the official line."
      )
    );
  }

  for (const [source, target] of [
    ["logic-property-income", "protected-line-a"],
    ["logic-capital-gains-losses", "protected-line-a-1"],
    ["logic-taxable-capital-gains", "protected-line-a-2"],
    ["logic-expenses-deductions", "protected-line-b"],
    ["logic-fat-deduction", "protected-line-c"],
    ["logic-fx-conversion", "protected-line-d"],
    ["logic-fat-deduction", "protected-line-e"],
    ["logic-taxable-capital-gains", "protected-line-f"],
    ["logic-fx-conversion", "protected-line-f-1"],
    ["logic-capital-gains-losses", "protected-line-g"],
    ["logic-expenses-deductions", "protected-line-h"],
    ["logic-property-income", "protected-summary-gross"],
    ["logic-expenses-deductions", "protected-summary-deductions"],
    ["logic-taxable-capital-gains", "protected-summary-fapi-brut"],
    ["logic-fat-deduction", "protected-summary-fat-deduction"],
    ["logic-taxable-capital-gains", "protected-summary-net-fapi"],
    ["logic-capital-gains-losses", "protected-summary-fapl-loss"],
  ]) {
    edges.push(
      edge(
        source,
        target,
        "feeds_protected_result",
        "Logic feeds a governed protected result."
      )
    );
  }

  for (const [source, target] of [
    ["protected-summary-gross", "output-csv-export"],
    ["protected-summary-deductions", "output-excel-export"],
    ["protected-summary-fapi-brut", "output-pdf-review-pack"],
    ["protected-summary-fat-deduction", "output-evidence-pack"],
    ["protected-summary-net-fapi", "output-canonical-json"],
    ["protected-summary-net-fapi", "output-evidence-pack"],
    ["protected-summary-net-fapi", "output-taxprep-handoff"],
    ["protected-summary-fapl-loss", "output-onesource-handoff"],
  ]) {
    edges.push(
      edge(
        source,
        target,
        target.includes("handoff") ? "included_in_handoff" : "maps_to_output",
        "Protected summary maps to the local output preview."
      )
    );
  }

  return edges;
}
