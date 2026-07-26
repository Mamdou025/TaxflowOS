(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/shared/workflow-engine/templates/sample-workflows/expanded-mapping-pipeline-demo.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EXPANDED_MAPPING_PIPELINE_BLOCK_SPECS",
    ()=>EXPANDED_MAPPING_PIPELINE_BLOCK_SPECS,
    "EXPANDED_MAPPING_PIPELINE_EDGE_SPECS",
    ()=>EXPANDED_MAPPING_PIPELINE_EDGE_SPECS,
    "EXPANDED_MAPPING_PIPELINE_ROWS",
    ()=>EXPANDED_MAPPING_PIPELINE_ROWS,
    "EXPANDED_MAPPING_PIPELINE_RULES",
    ()=>EXPANDED_MAPPING_PIPELINE_RULES
]);
const EXPANDED_MAPPING_PIPELINE_ROWS = [
    {
        account: "4000",
        amount: 100,
        currency: "USD",
        description: "Interest earned on bank deposit",
        label: "Interest income",
        rowId: "row-001"
    },
    {
        account: "4010",
        amount: 60,
        currency: "USD",
        description: "Interest earned from short-term deposits",
        label: "Bank interest revenue",
        rowId: "row-002"
    },
    {
        account: "4100",
        amount: 220,
        currency: "USD",
        description: "Rent received from warehouse lease",
        label: "Rental income",
        rowId: "row-003"
    },
    {
        account: "4110",
        amount: 140,
        currency: "USD",
        description: "Lease receipts from equipment rental",
        label: "Lease income",
        rowId: "row-004"
    },
    {
        account: "4200",
        amount: 310,
        currency: "USD",
        description: "Management service fee revenue",
        label: "Service income",
        rowId: "row-005"
    },
    {
        account: "4210",
        amount: 180,
        currency: "USD",
        description: "Consulting service revenue",
        label: "Consulting revenue",
        rowId: "row-006"
    },
    {
        account: "5000",
        amount: -25,
        currency: "USD",
        description: "Monthly bank fees",
        label: "Bank charges",
        rowId: "row-007"
    },
    {
        account: "5100",
        amount: -90,
        currency: "USD",
        description: "Accounting and legal advisory fees",
        label: "Professional fees",
        rowId: "row-008"
    },
    {
        account: "5200",
        amount: -45,
        currency: "USD",
        description: "General office supplies",
        label: "Office expenses",
        rowId: "row-009"
    },
    {
        account: "5300",
        amount: -70,
        currency: "USD",
        description: "Travel and lodging expenses",
        label: "Travel costs",
        rowId: "row-010"
    },
    {
        account: "6000",
        amount: 75,
        currency: "USD",
        description: "Miscellaneous operating revenue",
        label: "Other revenue",
        rowId: "row-011"
    },
    {
        account: "6100",
        amount: 50,
        currency: "USD",
        description: "Uncategorized miscellaneous income",
        label: "Misc income",
        rowId: "row-012"
    },
    {
        account: "7000",
        amount: 33,
        currency: "USD",
        description: "Manual year-end adjustment",
        label: "Unknown adjustment",
        rowId: "row-013"
    },
    {
        account: "7100",
        amount: -40,
        currency: "USD",
        description: "Interest paid on loan",
        label: "Interest expense",
        rowId: "row-014"
    },
    {
        account: "7200",
        amount: 25,
        currency: "USD",
        description: "FX gain from revaluation",
        label: "Foreign exchange gain",
        rowId: "row-015"
    }
];
const EXPANDED_MAPPING_PIPELINE_RULES = [
    {
        confidence: 0.95,
        description: "Maps interest revenue rows to Z / interest.",
        keywords: [
            "interest income",
            "bank interest revenue",
            "interest earned"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-001",
        sectionId: "Z",
        subsectionId: "interest",
        target: "interest_income"
    },
    {
        confidence: 0.92,
        description: "Maps rental and lease income rows to Z / rental.",
        keywords: [
            "rental income",
            "rent received",
            "lease income",
            "lease receipts"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-002",
        sectionId: "Z",
        subsectionId: "rental",
        target: "rental_income"
    },
    {
        confidence: 0.9,
        description: "Maps service and consulting revenue rows to Z / services.",
        keywords: [
            "service income",
            "service fee",
            "management service",
            "consulting revenue"
        ],
        matchMode: "contains",
        priority: 9,
        ruleId: "rule-003",
        sectionId: "Z",
        subsectionId: "services",
        target: "service_income"
    },
    {
        confidence: 0.72,
        description: "Maps other income rows to Z / other income with lower confidence.",
        keywords: [
            "other revenue",
            "misc income",
            "miscellaneous income"
        ],
        matchMode: "contains",
        priority: 5,
        ruleId: "rule-004",
        sectionId: "Z",
        subsectionId: "other_income",
        target: "other_income"
    },
    {
        confidence: 0.83,
        description: "Maps foreign exchange gains to Z / FX.",
        keywords: [
            "foreign exchange gain",
            "fx gain"
        ],
        matchMode: "contains",
        priority: 8,
        ruleId: "rule-005",
        sectionId: "Z",
        subsectionId: "fx",
        target: "fx_gain"
    },
    {
        confidence: 0.9,
        description: "Maps bank fees to W / bank fees.",
        keywords: [
            "bank charges",
            "bank fees",
            "monthly bank fees"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-006",
        sectionId: "W",
        subsectionId: "bank_fees",
        target: "bank_fees"
    },
    {
        confidence: 0.9,
        description: "Maps professional fees to W / professional fees.",
        keywords: [
            "professional fees",
            "accounting fees",
            "legal advisory",
            "legal fees"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-007",
        sectionId: "W",
        subsectionId: "professional_fees",
        target: "professional_fees"
    },
    {
        confidence: 0.86,
        description: "Maps office expenses to W / office.",
        keywords: [
            "office expenses",
            "office supplies",
            "general office"
        ],
        matchMode: "contains",
        priority: 8,
        ruleId: "rule-008",
        sectionId: "W",
        subsectionId: "office",
        target: "office_expenses"
    },
    {
        confidence: 0.85,
        description: "Maps travel costs to W / travel.",
        keywords: [
            "travel costs",
            "travel and lodging",
            "lodging expenses"
        ],
        matchMode: "contains",
        priority: 8,
        ruleId: "rule-009",
        sectionId: "W",
        subsectionId: "travel",
        target: "travel_expenses"
    },
    {
        confidence: 0.88,
        description: "Maps interest expense to W / interest expense.",
        keywords: [
            "interest expense",
            "interest paid"
        ],
        matchMode: "contains",
        priority: 9,
        ruleId: "rule-010",
        sectionId: "W",
        subsectionId: "interest_expense",
        target: "interest_expense"
    }
];
const EXPANDED_MAPPING_PIPELINE_BLOCK_SPECS = [
    {
        catalogId: "source:excel-workbook",
        config: {
            outputs: "rows",
            rows: EXPANDED_MAPPING_PIPELINE_ROWS,
            sourceKind: "excel_template_mock",
            sourceLocator: "excel-template-mock://expanded-mapping/rows",
            toolId: "source.manual_table"
        },
        description: "Immutable Excel-like Source rows for the expanded generic mapping demo.",
        id: "expanded-source-excel-rows",
        label: "Expanded Excel Rows",
        position: {
            x: -100,
            y: 90
        }
    },
    {
        catalogId: "source:keyword-rules",
        config: {
            keywordRules: EXPANDED_MAPPING_PIPELINE_RULES,
            outputs: "keyword_rules",
            sourceKind: "keyword_rules",
            sourceLocator: "manual-source://expanded-mapping-rules",
            toolId: "source.keyword_rules"
        },
        description: "Immutable Rule / Knowledge Source for the expanded generic mapping demo.",
        id: "expanded-source-mapping-rules",
        label: "Expanded Mapping Rules",
        position: {
            x: -100,
            y: 360
        }
    },
    {
        catalogId: "logic:classification-mapping",
        config: {
            conflictStrategy: "highest_confidence",
            inputs: "data_rows, keyword_rules",
            lowConfidenceThreshold: 0.75,
            matchFields: [
                "label",
                "description"
            ],
            matchMode: "contains",
            outputs: "mapped_rows, unmatched_rows, low_confidence_rows, conflicts, mapping_summary",
            toolId: "logic.keyword_mapper",
            unmatchedStrategy: "send_to_review"
        },
        description: "Reusable Logic tool that classifies source rows using connected mapping rules.",
        id: "expanded-logic-keyword-mapper",
        label: "Keyword Mapper",
        position: {
            x: 260,
            y: 220
        }
    },
    {
        catalogId: "logic:aggregation",
        config: {
            aggregationMethod: "sum",
            amountField: "amount",
            includeSectionIds: [
                "Z"
            ],
            inputs: "mapped_rows",
            outputs: "subtotal, included_rows, excluded_rows, aggregation_summary",
            toolId: "logic.aggregation"
        },
        description: "Aggregates mapped Z section rows into the protected Z candidate.",
        id: "expanded-logic-aggregate-z",
        label: "Aggregate Z Sections",
        position: {
            x: 620,
            y: 80
        }
    },
    {
        catalogId: "logic:aggregation",
        config: {
            aggregationMethod: "sum",
            amountField: "amount",
            includeSectionIds: [
                "W"
            ],
            inputs: "mapped_rows",
            outputs: "subtotal, included_rows, excluded_rows, aggregation_summary",
            toolId: "logic.aggregation"
        },
        description: "Aggregates mapped W section rows into the protected W candidate.",
        id: "expanded-logic-aggregate-w",
        label: "Aggregate W Sections",
        position: {
            x: 620,
            y: 360
        }
    },
    {
        catalogId: "review:low-confidence-warning",
        config: {
            blocking: false,
            inputs: "checked_items",
            outputs: "validation_result, low_confidence_rows",
            threshold: 0.75,
            toolId: "review.confidence_check"
        },
        description: "Review / Validation check that warns when mapped rows fall below confidence threshold.",
        id: "expanded-review-mapping-quality",
        label: "Mapping Quality Check",
        position: {
            x: 620,
            y: 630
        }
    },
    {
        catalogId: "review:unmatched-rows-check",
        config: {
            inputs: "checked_items",
            outputs: "review_status, unmatched_rows",
            toolId: "review.unmatched_rows_check"
        },
        description: "Review / Validation check that flags rows not matched by any rule.",
        id: "expanded-review-unmatched-rows",
        label: "Unmatched Rows Check",
        position: {
            x: 620,
            y: 830
        }
    },
    {
        catalogId: "review:approval-gate",
        config: {
            approved: true,
            inputs: "value_to_approve, validation_result, review_findings",
            notes: "Approved Z for expanded demo despite review warnings.",
            outputs: "approval_status",
            reviewer: "demo-reviewer",
            toolId: "review.approval_gate"
        },
        description: "Local mock approval that permits the Z subtotal to become governed.",
        id: "expanded-review-approval-z",
        label: "Approval Gate Z",
        position: {
            x: 980,
            y: 150
        }
    },
    {
        catalogId: "review:approval-gate",
        config: {
            approved: true,
            inputs: "value_to_approve, validation_result, review_findings",
            notes: "Approved W for expanded demo despite review warnings.",
            outputs: "approval_status",
            reviewer: "demo-reviewer",
            toolId: "review.approval_gate"
        },
        description: "Local mock approval that permits the W subtotal to become governed.",
        id: "expanded-review-approval-w",
        label: "Approval Gate W",
        position: {
            x: 980,
            y: 430
        }
    },
    {
        catalogId: "protected:protected-result",
        config: {
            inputs: "candidate_value, approval_status",
            outputs: "protected_result",
            resultName: "Z",
            runtimeLocked: true,
            toolId: "protected.protected_result"
        },
        description: "Governed final Z result for the expanded mapping demo.",
        id: "expanded-protected-result-z",
        label: "Protected Result Z",
        position: {
            x: 1340,
            y: 150
        }
    },
    {
        catalogId: "protected:protected-result",
        config: {
            inputs: "candidate_value, approval_status",
            outputs: "protected_result",
            resultName: "W",
            runtimeLocked: true,
            toolId: "protected.protected_result"
        },
        description: "Governed final W result for the expanded mapping demo.",
        id: "expanded-protected-result-w",
        label: "Protected Result W",
        position: {
            x: 1340,
            y: 430
        }
    },
    {
        catalogId: "output:evidence-pack",
        config: {
            inputs: "protected_result, mapped_rows, unmatched_rows, low_confidence_rows, validation_result",
            outputs: "preview",
            toolId: "output.evidence_pack_preview"
        },
        description: "Human-readable evidence preview showing Z, W, mappings, warnings, and trace.",
        id: "expanded-output-evidence-preview",
        label: "Z/W Evidence Preview",
        position: {
            x: 1700,
            y: 220
        }
    },
    {
        catalogId: "output:canonical-json",
        config: {
            inputs: "protected_result, mapped_rows, unmatched_rows, low_confidence_rows, validation_result",
            outputs: "canonical_json",
            toolId: "output.canonical_json"
        },
        description: "Structured local JSON package for protected Z/W results and trace.",
        id: "expanded-output-canonical-json",
        label: "Z/W Canonical JSON",
        position: {
            x: 1700,
            y: 500
        }
    }
];
const EXPANDED_MAPPING_PIPELINE_EDGE_SPECS = [
    {
        bindingLabel: "Rows to classify",
        reason: "Keyword Mapper needs expanded Excel rows.",
        relationshipType: "provides_data_to",
        sourceBlockId: "expanded-source-excel-rows",
        sourceOutputRole: "rows",
        targetBlockId: "expanded-logic-keyword-mapper",
        targetInputRole: "data_rows"
    },
    {
        bindingLabel: "Rules used for classification",
        reason: "Keyword Mapper applies immutable mapping rules.",
        relationshipType: "referenced_by",
        sourceBlockId: "expanded-source-mapping-rules",
        sourceOutputRole: "keyword_rules",
        targetBlockId: "expanded-logic-keyword-mapper",
        targetInputRole: "keyword_rules"
    },
    {
        bindingLabel: "Mapped rows to aggregate for Z",
        reason: "Aggregate Z Sections sums mapped rows with section Z.",
        relationshipType: "transforms_into",
        sourceBlockId: "expanded-logic-keyword-mapper",
        sourceOutputRole: "mapped_rows",
        targetBlockId: "expanded-logic-aggregate-z",
        targetInputRole: "mapped_rows"
    },
    {
        bindingLabel: "Mapped rows to aggregate for W",
        reason: "Aggregate W Sections sums mapped rows with section W.",
        relationshipType: "transforms_into",
        sourceBlockId: "expanded-logic-keyword-mapper",
        sourceOutputRole: "mapped_rows",
        targetBlockId: "expanded-logic-aggregate-w",
        targetInputRole: "mapped_rows"
    },
    {
        bindingLabel: "Mapped rows to validate",
        reason: "Mapping Quality Check reviews row confidence.",
        relationshipType: "triggers_validation",
        sourceBlockId: "expanded-logic-keyword-mapper",
        sourceOutputRole: "mapped_rows",
        targetBlockId: "expanded-review-mapping-quality",
        targetInputRole: "checked_items"
    },
    {
        bindingLabel: "Unmatched rows to review",
        reason: "Unmatched Rows Check reviews rows that could not be classified.",
        relationshipType: "triggers_validation",
        sourceBlockId: "expanded-logic-keyword-mapper",
        sourceOutputRole: "unmatched_rows",
        targetBlockId: "expanded-review-unmatched-rows",
        targetInputRole: "checked_items"
    },
    {
        bindingLabel: "Candidate Z subtotal",
        reason: "Approval Gate Z reviews the candidate Z value.",
        relationshipType: "triggers_validation",
        sourceBlockId: "expanded-logic-aggregate-z",
        sourceOutputRole: "subtotal",
        targetBlockId: "expanded-review-approval-z",
        targetInputRole: "value_to_approve"
    },
    {
        bindingLabel: "Candidate W subtotal",
        reason: "Approval Gate W reviews the candidate W value.",
        relationshipType: "triggers_validation",
        sourceBlockId: "expanded-logic-aggregate-w",
        sourceOutputRole: "subtotal",
        targetBlockId: "expanded-review-approval-w",
        targetInputRole: "value_to_approve"
    },
    {
        bindingLabel: "Confidence warnings for Z approval",
        reason: "Approval Gate Z records mapping quality context.",
        relationshipType: "depends_on",
        sourceBlockId: "expanded-review-mapping-quality",
        sourceOutputRole: "validation_result",
        targetBlockId: "expanded-review-approval-z",
        targetInputRole: "validation_result"
    },
    {
        bindingLabel: "Unmatched row findings for Z approval",
        reason: "Approval Gate Z records unmatched row context.",
        relationshipType: "depends_on",
        sourceBlockId: "expanded-review-unmatched-rows",
        sourceOutputRole: "unmatched_rows",
        targetBlockId: "expanded-review-approval-z",
        targetInputRole: "review_findings"
    },
    {
        bindingLabel: "Confidence warnings for W approval",
        reason: "Approval Gate W records mapping quality context.",
        relationshipType: "depends_on",
        sourceBlockId: "expanded-review-mapping-quality",
        sourceOutputRole: "validation_result",
        targetBlockId: "expanded-review-approval-w",
        targetInputRole: "validation_result"
    },
    {
        bindingLabel: "Unmatched row findings for W approval",
        reason: "Approval Gate W records unmatched row context.",
        relationshipType: "depends_on",
        sourceBlockId: "expanded-review-unmatched-rows",
        sourceOutputRole: "unmatched_rows",
        targetBlockId: "expanded-review-approval-w",
        targetInputRole: "review_findings"
    },
    {
        bindingLabel: "Candidate Z value",
        reason: "Z subtotal becomes the candidate value for Protected Result Z.",
        relationshipType: "feeds_protected_result",
        sourceBlockId: "expanded-logic-aggregate-z",
        sourceOutputRole: "subtotal",
        targetBlockId: "expanded-protected-result-z",
        targetInputRole: "candidate_value"
    },
    {
        bindingLabel: "Approval for Z",
        reason: "Approval Gate Z determines whether Z can lock.",
        relationshipType: "approves_for",
        sourceBlockId: "expanded-review-approval-z",
        sourceOutputRole: "approval_status",
        targetBlockId: "expanded-protected-result-z",
        targetInputRole: "approval_status"
    },
    {
        bindingLabel: "Candidate W value",
        reason: "W subtotal becomes the candidate value for Protected Result W.",
        relationshipType: "feeds_protected_result",
        sourceBlockId: "expanded-logic-aggregate-w",
        sourceOutputRole: "subtotal",
        targetBlockId: "expanded-protected-result-w",
        targetInputRole: "candidate_value"
    },
    {
        bindingLabel: "Approval for W",
        reason: "Approval Gate W determines whether W can lock.",
        relationshipType: "approves_for",
        sourceBlockId: "expanded-review-approval-w",
        sourceOutputRole: "approval_status",
        targetBlockId: "expanded-protected-result-w",
        targetInputRole: "approval_status"
    },
    {
        bindingLabel: "Final Z result",
        reason: "Evidence Preview displays Protected Result Z.",
        relationshipType: "maps_to_output",
        sourceBlockId: "expanded-protected-result-z",
        sourceOutputRole: "protected_result",
        targetBlockId: "expanded-output-evidence-preview",
        targetInputRole: "protected_result"
    },
    {
        bindingLabel: "Final W result",
        reason: "Evidence Preview displays Protected Result W.",
        relationshipType: "maps_to_output",
        sourceBlockId: "expanded-protected-result-w",
        sourceOutputRole: "protected_result",
        targetBlockId: "expanded-output-evidence-preview",
        targetInputRole: "protected_result"
    },
    {
        bindingLabel: "Mapped row details",
        reason: "Evidence Preview lists classified rows.",
        relationshipType: "included_in_output_preview",
        sourceBlockId: "expanded-logic-keyword-mapper",
        sourceOutputRole: "mapped_rows",
        targetBlockId: "expanded-output-evidence-preview",
        targetInputRole: "mapped_rows"
    },
    {
        bindingLabel: "Mapping warnings",
        reason: "Evidence Preview includes low-confidence rows.",
        relationshipType: "included_in_output_preview",
        sourceBlockId: "expanded-review-mapping-quality",
        sourceOutputRole: "low_confidence_rows",
        targetBlockId: "expanded-output-evidence-preview",
        targetInputRole: "review_findings"
    },
    {
        bindingLabel: "Unmatched row warning",
        reason: "Evidence Preview includes unmatched rows.",
        relationshipType: "included_in_output_preview",
        sourceBlockId: "expanded-review-unmatched-rows",
        sourceOutputRole: "unmatched_rows",
        targetBlockId: "expanded-output-evidence-preview",
        targetInputRole: "review_findings"
    },
    {
        bindingLabel: "Final Z JSON",
        reason: "Canonical JSON includes Protected Result Z.",
        relationshipType: "maps_to_output",
        sourceBlockId: "expanded-protected-result-z",
        sourceOutputRole: "protected_result",
        targetBlockId: "expanded-output-canonical-json",
        targetInputRole: "protected_result"
    },
    {
        bindingLabel: "Final W JSON",
        reason: "Canonical JSON includes Protected Result W.",
        relationshipType: "maps_to_output",
        sourceBlockId: "expanded-protected-result-w",
        sourceOutputRole: "protected_result",
        targetBlockId: "expanded-output-canonical-json",
        targetInputRole: "protected_result"
    },
    {
        bindingLabel: "Mapped rows JSON",
        reason: "Canonical JSON includes mapping summary and mapped rows.",
        relationshipType: "included_in_handoff",
        sourceBlockId: "expanded-logic-keyword-mapper",
        sourceOutputRole: "mapped_rows",
        targetBlockId: "expanded-output-canonical-json",
        targetInputRole: "mapped_rows"
    },
    {
        bindingLabel: "Confidence warnings JSON",
        reason: "Canonical JSON includes mapping quality warnings.",
        relationshipType: "included_in_handoff",
        sourceBlockId: "expanded-review-mapping-quality",
        sourceOutputRole: "low_confidence_rows",
        targetBlockId: "expanded-output-canonical-json",
        targetInputRole: "review_findings"
    },
    {
        bindingLabel: "Unmatched warnings JSON",
        reason: "Canonical JSON includes unmatched row warnings.",
        relationshipType: "included_in_handoff",
        sourceBlockId: "expanded-review-unmatched-rows",
        sourceOutputRole: "unmatched_rows",
        targetBlockId: "expanded-output-canonical-json",
        targetInputRole: "review_findings"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/templates/sample-workflows/working-source-rules-demo.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WORKING_SOURCE_DEMO_AGGREGATION_RULES",
    ()=>WORKING_SOURCE_DEMO_AGGREGATION_RULES,
    "WORKING_SOURCE_DEMO_BLOCK_SPECS",
    ()=>WORKING_SOURCE_DEMO_BLOCK_SPECS,
    "WORKING_SOURCE_DEMO_CALCULATION_RULES",
    ()=>WORKING_SOURCE_DEMO_CALCULATION_RULES,
    "WORKING_SOURCE_DEMO_EDGE_SPECS",
    ()=>WORKING_SOURCE_DEMO_EDGE_SPECS,
    "WORKING_SOURCE_DEMO_EXPECTED_RESULTS",
    ()=>WORKING_SOURCE_DEMO_EXPECTED_RESULTS,
    "WORKING_SOURCE_DEMO_FAPI_INPUTS",
    ()=>WORKING_SOURCE_DEMO_FAPI_INPUTS,
    "WORKING_SOURCE_DEMO_FX_RATE",
    ()=>WORKING_SOURCE_DEMO_FX_RATE,
    "WORKING_SOURCE_DEMO_ROLLUP_RULES",
    ()=>WORKING_SOURCE_DEMO_ROLLUP_RULES,
    "WORKING_SOURCE_DEMO_RULES",
    ()=>WORKING_SOURCE_DEMO_RULES
]);
const WORKING_SOURCE_DEMO_HEADERS = [
    "rowId",
    "account",
    "label",
    "description",
    "amount",
    "currency"
];
const WORKING_SOURCE_DEMO_RULES = [
    {
        categoryId: "interestIncome",
        categoryLabel: "Interest Income",
        confidence: 0.95,
        description: "Interest income style row.",
        keywords: [
            "interest income",
            "interest earned",
            "bank interest"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-interest-income"
    },
    {
        categoryId: "rents",
        categoryLabel: "Rents",
        confidence: 0.92,
        description: "Rental or lease income style row.",
        keywords: [
            "rental income",
            "rent received",
            "lease income"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-rents"
    },
    {
        categoryId: "royalties",
        categoryLabel: "Royalties",
        confidence: 0.9,
        description: "Royalty income style row.",
        keywords: [
            "royalty income",
            "royalties",
            "patent royalty"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-royalties"
    },
    {
        categoryId: "dividends",
        categoryLabel: "Dividends",
        confidence: 0.9,
        description: "Dividend income style row.",
        keywords: [
            "dividend income",
            "portfolio shares"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-dividends"
    },
    {
        categoryId: "otherFapiIncome",
        categoryLabel: "Other FAPI Income",
        confidence: 0.72,
        description: "Other FAPI income style row with lower confidence.",
        keywords: [
            "other fapi income",
            "miscellaneous fapi revenue"
        ],
        matchMode: "contains",
        priority: 5,
        ruleId: "rule-other-fapi-income"
    },
    {
        categoryId: "generalExpenses",
        categoryLabel: "General Expenses",
        confidence: 0.9,
        description: "General expense row.",
        keywords: [
            "general expenses",
            "operating expenses"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-general-expenses"
    },
    {
        categoryId: "legalExpenses",
        categoryLabel: "Legal Expenses",
        confidence: 0.9,
        description: "Legal expense row.",
        keywords: [
            "legal expenses",
            "legal advisory"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-legal-expenses"
    },
    {
        categoryId: "accountingExpenses",
        categoryLabel: "Accounting Expenses",
        confidence: 0.9,
        description: "Accounting expense row.",
        keywords: [
            "accounting expenses",
            "accounting service"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-accounting-expenses"
    },
    {
        categoryId: "debtForgiveness",
        categoryLabel: "Debt Forgiveness",
        confidence: 0.9,
        description: "Debt forgiveness amount.",
        keywords: [
            "debt forgiveness"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-debt-forgiveness"
    },
    {
        categoryId: "priorYearG",
        categoryLabel: "Prior Year G",
        confidence: 0.9,
        description: "Prior year amount G.",
        keywords: [
            "prior year g"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-prior-year-g"
    },
    {
        categoryId: "capGains",
        categoryLabel: "Capital Gains",
        confidence: 0.9,
        description: "Capital gains amount.",
        keywords: [
            "capital gains",
            "cap gains"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-cap-gains"
    },
    {
        categoryId: "cfaIncome",
        categoryLabel: "CFA Income",
        confidence: 0.9,
        description: "CFA income amount.",
        keywords: [
            "cfa income"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-cfa-income"
    },
    {
        categoryId: "businessLosses",
        categoryLabel: "Business Losses",
        confidence: 0.9,
        description: "Business losses amount.",
        keywords: [
            "business losses"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-business-losses"
    },
    {
        categoryId: "faclCarryforward",
        categoryLabel: "FACL Carryforward",
        confidence: 0.9,
        description: "FACL carryforward amount.",
        keywords: [
            "facl carryforward"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-facl-carryforward"
    },
    {
        categoryId: "prescribedAmount",
        categoryLabel: "Prescribed Amount",
        confidence: 0.9,
        description: "Prescribed amount.",
        excludeKeywords: [
            "f1"
        ],
        keywords: [
            "prescribed amount"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-prescribed-amount"
    },
    {
        categoryId: "prescribedAmountF1",
        categoryLabel: "Prescribed Amount F1",
        confidence: 0.9,
        description: "Prescribed amount F1.",
        keywords: [
            "prescribed amount f1"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-prescribed-amount-f1"
    },
    {
        categoryId: "dividendDeductions",
        categoryLabel: "Dividend Deductions",
        confidence: 0.9,
        description: "Dividend deductions amount.",
        keywords: [
            "dividend deductions"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-dividend-deductions"
    },
    {
        categoryId: "partnershipDividends",
        categoryLabel: "Partnership Dividends",
        confidence: 0.9,
        description: "Partnership dividends amount.",
        keywords: [
            "partnership dividends"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-partnership-dividends"
    }
];
const WORKING_SOURCE_DEMO_EXPECTED_RESULTS = {
    A: 4950,
    A1: 100,
    A2: 75,
    B: 400,
    C: 125,
    D: 200,
    Deductions: 400,
    E: 90,
    F: 40,
    F1: 10,
    "FAPI Brut": 5250,
    "FAT Deduction": 190,
    G: 35,
    Gross: 5650,
    H: 25,
    "Net FAPI": 5060,
    "Net FAPI CAD": 6831
};
const WORKING_SOURCE_DEMO_FAPI_INPUTS = {
    documentCurrency: "USD",
    expectedResults: WORKING_SOURCE_DEMO_EXPECTED_RESULTS,
    fatPaid: 100,
    fapiYear: 2025,
    inclusionRate: 0.5,
    reportingCurrency: "CAD",
    rtf: 1.9
};
const WORKING_SOURCE_DEMO_FX_RATE = {
    documentCurrency: "USD",
    fapiYear: 2025,
    overrideRate: 1.35,
    overrideReason: "Workbook-provided local draft override.",
    rateProvider: "bank_of_canada",
    rateType: "annual_average",
    reportingCurrency: "CAD"
};
const WORKING_SOURCE_DEMO_AGGREGATION_RULES = [
    {
        children: [],
        description: "Income bucket sourced from mapped atomic categories.",
        includeCategoryIds: [
            "interestIncome",
            "rents",
            "royalties",
            "dividends",
            "otherFapiIncome"
        ],
        label: "Income Bucket",
        nodeId: "income_bucket",
        nodeType: "group",
        operation: "sum",
        order: 10
    },
    {
        children: [],
        description: "Expense bucket uses absolute values for deduction style rows.",
        includeCategoryIds: [
            "generalExpenses",
            "legalExpenses",
            "accountingExpenses"
        ],
        label: "Expense Bucket",
        nodeId: "expense_bucket",
        nodeType: "group",
        operation: "sum_abs",
        order: 20
    },
    {
        children: [],
        description: "A = income bucket minus expense bucket, floored at zero.",
        label: "A",
        nodeId: "A",
        nodeType: "final_result",
        operands: [
            {
                label: "Income Bucket",
                refId: "income_bucket",
                refType: "node"
            },
            {
                label: "Expense Bucket",
                refId: "expense_bucket",
                refType: "node"
            }
        ],
        operation: "max_subtract_zero",
        order: 30,
        outputRole: "official_line",
        resultName: "A"
    },
    {
        children: [],
        label: "A1",
        nodeId: "A1",
        nodeType: "final_result",
        operands: [
            {
                refId: "debtForgiveness",
                refType: "category"
            },
            {
                refType: "constant",
                value: 2
            }
        ],
        operation: "multiply",
        order: 40,
        outputRole: "official_line",
        resultName: "A1"
    },
    {
        children: [],
        label: "A2",
        nodeId: "A2",
        nodeType: "final_result",
        operands: [
            {
                refId: "priorYearG",
                refType: "category"
            }
        ],
        operation: "pass_through",
        order: 50,
        outputRole: "official_line",
        resultName: "A2"
    },
    {
        children: [],
        label: "B",
        nodeId: "B",
        nodeType: "final_result",
        operands: [
            {
                refId: "capGains",
                refType: "category"
            },
            {
                label: "Inclusion Rate",
                refId: "inclusionRate",
                refType: "input"
            }
        ],
        operation: "multiply",
        order: 60,
        outputRole: "official_line",
        resultName: "B"
    },
    ...[
        [
            "C",
            "cfaIncome"
        ],
        [
            "D",
            "businessLosses"
        ],
        [
            "E",
            "faclCarryforward"
        ],
        [
            "F",
            "prescribedAmount"
        ],
        [
            "F1",
            "prescribedAmountF1"
        ],
        [
            "G",
            "dividendDeductions"
        ],
        [
            "H",
            "partnershipDividends"
        ]
    ].map(([nodeId, categoryId], index)=>({
            children: [],
            label: nodeId,
            nodeId,
            nodeType: "final_result",
            operands: [
                {
                    refId: categoryId,
                    refType: "category"
                }
            ],
            operation: "pass_through",
            order: 70 + index * 10,
            outputRole: "official_line",
            resultName: nodeId
        })),
    {
        children: [],
        label: "FAT Paid",
        nodeId: "FAT_PAID",
        nodeType: "final_result",
        operands: [
            {
                label: "FAT Paid",
                refId: "fatPaid",
                refType: "input"
            }
        ],
        operation: "pass_through",
        order: 140,
        outputRole: "official_line",
        resultName: "FAT_PAID"
    },
    {
        children: [],
        label: "RTF",
        nodeId: "RTF",
        nodeType: "final_result",
        operands: [
            {
                label: "RTF",
                refId: "rtf",
                refType: "input"
            }
        ],
        operation: "pass_through",
        order: 150,
        outputRole: "official_line",
        resultName: "RTF"
    },
    {
        children: [],
        label: "FX Rate",
        nodeId: "FX_RATE",
        nodeType: "final_result",
        operands: [
            {
                label: "FX Rate",
                refId: "fxRate",
                refType: "input"
            }
        ],
        operation: "pass_through",
        order: 160,
        outputRole: "official_line",
        resultName: "FX_RATE"
    },
    {
        children: [],
        label: "Gross",
        nodeId: "GROSS",
        nodeType: "final_result",
        operands: [
            "A",
            "A1",
            "A2",
            "B",
            "C"
        ].map((refId)=>({
                refId,
                refType: "node"
            })),
        operation: "add",
        order: 170,
        resultName: "Gross"
    },
    {
        children: [],
        label: "Deductions",
        nodeId: "DEDUCTIONS",
        nodeType: "final_result",
        operands: [
            "D",
            "E",
            "F",
            "F1",
            "G",
            "H"
        ].map((refId)=>({
                refId,
                refType: "node"
            })),
        operation: "add",
        order: 180,
        resultName: "Deductions"
    },
    {
        children: [],
        label: "FAPI Brut",
        nodeId: "FAPI_BRUT",
        nodeType: "final_result",
        operands: [
            {
                refId: "GROSS",
                refType: "node"
            },
            {
                refId: "DEDUCTIONS",
                refType: "node"
            }
        ],
        operation: "max_subtract_zero",
        order: 190,
        resultName: "FAPI Brut"
    },
    {
        children: [],
        label: "FAT Deduction",
        nodeId: "FAT_DEDUCTION",
        nodeType: "final_result",
        operands: [
            {
                label: "FAT Paid",
                refId: "fatPaid",
                refType: "input"
            },
            {
                label: "RTF",
                refId: "rtf",
                refType: "input"
            },
            {
                label: "FAPI Brut",
                refId: "FAPI_BRUT",
                refType: "node"
            }
        ],
        operation: "min_multiply_cap",
        order: 200,
        resultName: "FAT Deduction"
    },
    {
        children: [],
        label: "Net FAPI",
        nodeId: "NET_FAPI",
        nodeType: "final_result",
        operands: [
            {
                refId: "FAPI_BRUT",
                refType: "node"
            },
            {
                refId: "FAT_DEDUCTION",
                refType: "node"
            }
        ],
        operation: "max_subtract_zero",
        order: 210,
        resultName: "Net FAPI"
    },
    {
        children: [],
        formulaExpression: "node:NET_FAPI * input:fxRate",
        label: "Net FAPI CAD",
        nodeId: "NET_FAPI_CAD",
        nodeType: "final_result",
        operands: [],
        operation: "multiply",
        order: 220,
        resultName: "Net FAPI CAD"
    }
];
const WORKING_SOURCE_DEMO_ROLLUP_RULES = [
    {
        description: "Adds income mapped categories.",
        includeCategoryIds: [
            "interestIncome",
            "rents",
            "royalties",
            "dividends",
            "otherFapiIncome"
        ],
        label: "Income Bucket",
        operation: "sum",
        rollupId: "income_bucket"
    },
    {
        description: "Adds expenses using absolute values.",
        includeCategoryIds: [
            "generalExpenses",
            "legalExpenses",
            "accountingExpenses"
        ],
        label: "Expense Bucket",
        operation: "sum_abs",
        rollupId: "expense_bucket"
    }
];
const WORKING_SOURCE_DEMO_CALCULATION_RULES = [
    {
        calculationId: "A",
        description: "A = max(income_bucket - expense_bucket, 0)",
        label: "A",
        operands: [
            "income_bucket",
            "expense_bucket"
        ],
        operation: "max_subtract_zero",
        resultKey: "A"
    },
    {
        calculationId: "A1",
        description: "A1 = debtForgiveness * 2",
        label: "A1",
        operands: [
            "debtForgiveness",
            2
        ],
        operation: "multiply",
        resultKey: "A1"
    },
    {
        calculationId: "A2",
        description: "A2 = priorYearG",
        label: "A2",
        operands: [
            "priorYearG"
        ],
        operation: "pass_through",
        resultKey: "A2"
    },
    {
        calculationId: "B",
        description: "B = capGains * inclusionRate",
        label: "B",
        operands: [
            "capGains",
            "inclusionRate"
        ],
        operation: "multiply",
        resultKey: "B"
    },
    ...[
        [
            "C",
            "cfaIncome"
        ],
        [
            "D",
            "businessLosses"
        ],
        [
            "E",
            "faclCarryforward"
        ],
        [
            "F",
            "prescribedAmount"
        ],
        [
            "F1",
            "prescribedAmountF1"
        ],
        [
            "G",
            "dividendDeductions"
        ],
        [
            "H",
            "partnershipDividends"
        ]
    ].map(([calculationId, sourceKey])=>({
            calculationId,
            description: `${calculationId} = ${sourceKey}`,
            label: calculationId,
            operands: [
                sourceKey
            ],
            operation: "pass_through",
            resultKey: calculationId
        })),
    {
        calculationId: "FAT_PAID",
        description: "FAT_PAID = fatPaid",
        label: "FAT Paid",
        operands: [
            "fatPaid"
        ],
        operation: "pass_through",
        resultKey: "FAT_PAID"
    },
    {
        calculationId: "RTF",
        description: "RTF = rtf",
        label: "RTF",
        operands: [
            "rtf"
        ],
        operation: "pass_through",
        resultKey: "RTF"
    },
    {
        calculationId: "FX_RATE",
        description: "FX_RATE = fxRate",
        label: "FX Rate",
        operands: [
            "fxRate"
        ],
        operation: "pass_through",
        resultKey: "FX_RATE"
    },
    {
        calculationId: "GROSS",
        description: "Gross = A + A1 + A2 + B + C",
        label: "Gross",
        operands: [
            "A",
            "A1",
            "A2",
            "B",
            "C"
        ],
        operation: "add",
        resultKey: "GROSS"
    },
    {
        calculationId: "DEDUCTIONS",
        description: "Deductions = D + E + F + F1 + G + H",
        label: "Deductions",
        operands: [
            "D",
            "E",
            "F",
            "F1",
            "G",
            "H"
        ],
        operation: "add",
        resultKey: "DEDUCTIONS"
    },
    {
        calculationId: "FAPI_BRUT",
        description: "FAPI Brut = max(GROSS - DEDUCTIONS, 0)",
        label: "FAPI Brut",
        operands: [
            "GROSS",
            "DEDUCTIONS"
        ],
        operation: "max_subtract_zero",
        resultKey: "FAPI_BRUT"
    },
    {
        calculationId: "FAT_DEDUCTION",
        description: "FAT Deduction = min(max(FAT_PAID, 0) * RTF, FAPI_BRUT)",
        label: "FAT Deduction",
        operands: [
            "FAT_PAID",
            "RTF",
            "FAPI_BRUT"
        ],
        operation: "min_multiply_cap",
        resultKey: "FAT_DEDUCTION"
    },
    {
        calculationId: "NET_FAPI",
        description: "Net FAPI = max(FAPI_BRUT - FAT_DEDUCTION, 0)",
        label: "Net FAPI",
        operands: [
            "FAPI_BRUT",
            "FAT_DEDUCTION"
        ],
        operation: "max_subtract_zero",
        resultKey: "NET_FAPI"
    },
    {
        calculationId: "NET_FAPI_CAD",
        description: "Net FAPI CAD = NET_FAPI * FX_RATE",
        label: "Net FAPI CAD",
        operands: [
            "NET_FAPI",
            "FX_RATE"
        ],
        operation: "multiply",
        resultKey: "NET_FAPI_CAD"
    }
];
const PROTECTED_RESULT_NAMES = [
    "A",
    "A1",
    "A2",
    "B",
    "C",
    "D",
    "E",
    "F",
    "F1",
    "G",
    "H",
    "FAT_PAID",
    "RTF",
    "Gross",
    "Deductions",
    "FAPI Brut",
    "FAT Deduction",
    "Net FAPI",
    "Net FAPI CAD"
];
const REQUIRED_INPUT_KEYS = [
    "trial_balance_rows",
    "keyword_rules",
    "rollup_rules",
    "fatPaid",
    "rtf",
    "fxRate",
    "inclusionRate",
    "expectedResults"
];
const REQUIRED_PROTECTED_SUMMARY_RESULTS = [
    "Gross",
    "Deductions",
    "FAPI Brut",
    "FAT Deduction",
    "Net FAPI",
    "Net FAPI CAD"
];
function slug(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
const PROTECTED_RESULT_SPECS = PROTECTED_RESULT_NAMES.map(_c = (resultName, index)=>({
        catalogId: "protected:protected-result",
        config: {
            inputs: "candidate_value, approval_status",
            outputs: "protected_result",
            resultName,
            runtimeLocked: true,
            toolId: "protected.protected_result"
        },
        description: `Governed protected result ${resultName}.`,
        id: `working-protected-${slug(resultName)}`,
        label: `Protected ${resultName}`,
        position: {
            x: 1320,
            y: 80 + index * 120
        }
    }));
_c1 = PROTECTED_RESULT_SPECS;
const WORKING_SOURCE_DEMO_BLOCK_SPECS = [
    {
        catalogId: "source:excel-workbook",
        config: {
            columns: WORKING_SOURCE_DEMO_HEADERS,
            columnMapping: {
                account: "account",
                amount: "amount",
                currency: "currency",
                description: "description",
                label: "label"
            },
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
            workbookName: "Upload workflow_studio_fapi_sample_source.xlsx"
        },
        description: "Draft local Excel Source where the FAPI-style workbook can be uploaded.",
        id: "working-source-uploaded-rows",
        label: "Uploaded Workbook",
        position: {
            x: -180,
            y: 100
        }
    },
    {
        catalogId: "source:keyword-rules",
        config: {
            keywordRules: WORKING_SOURCE_DEMO_RULES,
            outputs: "keyword_rules",
            ruleVersion: "v1",
            sourceKind: "keyword_rules",
            sourceLocator: "manual-source://keyword-rulebook-awaiting-import",
            sourceStatus: "draft",
            sourceVersion: 1,
            toolId: "source.keyword_rules"
        },
        description: "Editable draft Keyword Rulebook imported from the workbook rules sheet.",
        id: "working-source-editable-rules",
        label: "Keyword Rulebook",
        position: {
            x: -180,
            y: 370
        }
    },
    {
        catalogId: "source:rollup-rules",
        config: {
            outputs: "rollup_rules",
            rollupRules: WORKING_SOURCE_DEMO_ROLLUP_RULES,
            ruleVersion: "v1",
            sourceKind: "rollup_rules",
            sourceLocator: "manual-source://rollup-rulebook-awaiting-import",
            sourceStatus: "draft",
            sourceVersion: 1,
            toolId: "source.rollup_rules"
        },
        description: "Editable draft Rollup Rulebook defining category grouping only.",
        id: "working-source-rollup-rules",
        label: "Rollup Rulebook",
        position: {
            x: -180,
            y: 640
        }
    },
    {
        catalogId: "source:manual-entry",
        config: {
            ...WORKING_SOURCE_DEMO_FAPI_INPUTS,
            outputs: "fapi_inputs, input_metadata",
            sourceKind: "fapi_inputs",
            sourceLocator: "manual-source://fapi-inputs-awaiting-import",
            sourceStatus: "draft",
            sourceVersion: 1,
            toolId: "source.fapi_inputs"
        },
        description: "Workbook calculation inputs such as inclusion rate, RTF, FAT paid, and expected results.",
        id: "working-source-fapi-inputs",
        label: "FAPI Inputs",
        position: {
            x: -180,
            y: 910
        }
    },
    {
        catalogId: "source:currency-rate",
        config: {
            ...WORKING_SOURCE_DEMO_FX_RATE,
            outputs: "exchange_rate, rate_metadata",
            sourceKind: "currency_rate",
            sourceLocator: "bank-of-canada://annual-average/USD-CAD/2025",
            sourceStatus: "draft",
            sourceVersion: 1,
            toolId: "source.currency_rate"
        },
        description: "External Bank of Canada-style FX rate reference. Overrides are reviewed downstream.",
        id: "working-source-bank-of-canada-fx",
        label: "Bank of Canada FX Rate",
        position: {
            x: -180,
            y: 1180
        }
    },
    {
        catalogId: "review:manual-override-review",
        config: {
            approved: true,
            inputs: "exchange_rate",
            outputs: "reviewed_exchange_rate, fapi_inputs, approval_status",
            overrideRate: undefined,
            overrideReason: "",
            reviewer: "fx-reviewer",
            toolId: "review.fx_rate_review",
            useOverride: false
        },
        description: "Reviews the Bank of Canada FX source and can emit a downstream override without mutating the source.",
        id: "working-review-fx-rate",
        label: "FX Rate Review",
        position: {
            x: 260,
            y: 1080
        }
    },
    {
        catalogId: "protected:protected-input",
        config: {
            fapiInputKey: "fxRate",
            inputs: "approved_value",
            outputs: "governed_value",
            resultName: "FX_RATE",
            runtimeLocked: true,
            toolId: "protected.protected_input",
            valueLabel: "FX Rate"
        },
        description: "Reviewed FX rate locked for the calculator.",
        id: "working-protected-fx-rate",
        label: "Protected FX Rate",
        position: {
            x: 660,
            y: 1080
        }
    },
    {
        catalogId: "review:required-input-check",
        config: {
            blocking: true,
            inputs: "review_findings",
            outputs: "required_input_result, validation_result",
            requiredKeys: REQUIRED_INPUT_KEYS,
            toolId: "review.required_input_check"
        },
        description: "Blocking check that required workbook rows, rules, inputs, expected results, and reviewed FX are present.",
        id: "working-review-required-inputs",
        label: "Required Input Check",
        position: {
            x: 660,
            y: 1260
        }
    },
    {
        catalogId: "logic:classification-mapping",
        config: {
            conflictStrategy: "highest_confidence",
            inputs: "data_rows, keyword_rules",
            lowConfidenceThreshold: 0.75,
            matchFields: [
                "account",
                "label",
                "description"
            ],
            matchMode: "contains",
            outputs: "mapped_rows, unmatched_rows, low_confidence_rows, conflicts, mapping_summary",
            toolId: "logic.keyword_mapper",
            unmatchedStrategy: "send_to_review"
        },
        description: "Reusable Logic tool that maps uploaded source rows with connected rules.",
        id: "working-logic-keyword-mapper",
        label: "Keyword Mapper",
        position: {
            x: 260,
            y: 260
        }
    },
    {
        catalogId: "logic:category-rollup-aggregator",
        config: {
            inputs: "mapped_rows, rollup_rules",
            operation: "sum",
            outputs: "category_totals, rollup_totals, named_values, included_rows_by_category, included_rows_by_rollup, excluded_rows, rollup_formula_trace, rollup_summary",
            toolId: "logic.category_rollup_aggregator"
        },
        description: "Groups mapped categories into category and rollup totals.",
        id: "working-logic-category-rollup",
        label: "Category Rollup Aggregator",
        position: {
            x: 660,
            y: 260
        }
    },
    {
        catalogId: "logic:calculation-engine",
        config: {
            inputs: "named_values, protected_inputs",
            mode: "auto",
            outputs: "calculated_results, formula_trace, calculation_summary, named_values",
            toolId: "logic.calculation_engine",
            formulas: WORKING_SOURCE_DEMO_CALCULATION_RULES
        },
        description: "Applies FAPI-style arithmetic, constants, min/max caps, and FX formulas using inline formula config.",
        id: "working-logic-calculation-engine",
        label: "Calculation Engine",
        position: {
            x: 1040,
            y: 260
        }
    },
    {
        catalogId: "review:low-confidence-warning",
        config: {
            blocking: false,
            inputs: "checked_items",
            outputs: "validation_result, low_confidence_rows",
            threshold: 0.75,
            toolId: "review.confidence_check"
        },
        description: "Warns when mapped rows fall below the local confidence threshold.",
        id: "working-review-mapping-quality",
        label: "Mapping Quality Check",
        position: {
            x: 660,
            y: 620
        }
    },
    {
        catalogId: "review:unmatched-rows-check",
        config: {
            blocking: true,
            inputs: "checked_items",
            outputs: "review_status, unmatched_rows",
            overrideUnmatchedRows: false,
            toolId: "review.unmatched_rows_check"
        },
        description: "Flags uploaded rows that did not match any mapping rule.",
        id: "working-review-unmatched-rows",
        label: "Unmatched Rows Check",
        position: {
            x: 660,
            y: 820
        }
    },
    {
        catalogId: "review:formula-consistency-check",
        config: {
            inputs: "checked_items",
            outputs: "validation_result",
            tolerance: 0.01,
            toolId: "review.formula_consistency_check"
        },
        description: "Compares calculator output to the workbook Expected Results sheet.",
        id: "working-review-formula-consistency",
        label: "Formula Consistency Check",
        position: {
            x: 1040,
            y: 700
        }
    },
    {
        catalogId: "review:approval-gate",
        config: {
            approved: true,
            approvedWithWarnings: false,
            inputs: "value_to_approve, validation_result, review_findings",
            notes: "Approved local FAPI-style workflow preparation run.",
            overrideUnmatchedRows: false,
            outputs: "approval_status",
            reviewer: "demo-reviewer",
            toolId: "review.approval_gate"
        },
        description: "Local mock approval gate for protected FAPI results.",
        id: "working-review-approval",
        label: "Approval Gate",
        position: {
            x: 1040,
            y: 500
        }
    },
    ...PROTECTED_RESULT_SPECS,
    {
        catalogId: "review:output-readiness-check",
        config: {
            blocking: true,
            inputs: "protected_values, validation_result, review_findings",
            outputs: "output_readiness_result, validation_result",
            requiredProtectedResults: REQUIRED_PROTECTED_SUMMARY_RESULTS,
            toolId: "review.output_readiness_check"
        },
        description: "Blocking handoff check that required validations passed and protected summary results exist.",
        id: "working-review-output-readiness",
        label: "Output Readiness Check",
        position: {
            x: 1580,
            y: 80
        }
    },
    {
        catalogId: "output:evidence-pack",
        config: {
            inputs: "protected_result, mapped_rows, unmatched_rows, low_confidence_rows, validation_result",
            outputs: "preview",
            toolId: "output.evidence_pack_preview"
        },
        description: "Human-readable local preview with workbook, rules, formulas, warnings, and protected results.",
        id: "working-output-evidence-preview",
        label: "Evidence Pack Preview",
        position: {
            x: 1740,
            y: 260
        }
    },
    {
        catalogId: "output:canonical-json",
        config: {
            inputs: "protected_result, mapped_rows, unmatched_rows, low_confidence_rows, validation_result",
            outputs: "canonical_json",
            toolId: "output.canonical_json"
        },
        description: "Structured local JSON package for mapped rows, formula trace, warnings, and protected results.",
        id: "working-output-canonical-json",
        label: "Canonical JSON",
        position: {
            x: 1740,
            y: 540
        }
    }
];
const PROTECTED_EDGES = PROTECTED_RESULT_NAMES.flatMap(_c2 = (resultName)=>{
    const protectedId = `working-protected-${slug(resultName)}`;
    return [
        {
            bindingLabel: `${resultName} candidate value`,
            reason: `${resultName} is calculated by the Calculation Engine.`,
            relationshipType: "feeds_protected_result",
            sourceBlockId: "working-logic-calculation-engine",
            sourceOutputRole: "calculated_results",
            targetBlockId: protectedId,
            targetInputRole: "candidate_value"
        },
        {
            bindingLabel: `${resultName} approval`,
            reason: "Approval Gate determines whether the protected value can lock.",
            relationshipType: "approves_for",
            sourceBlockId: "working-review-approval",
            sourceOutputRole: "approval_status",
            targetBlockId: protectedId,
            targetInputRole: "approval_status"
        },
        {
            bindingLabel: `${resultName} required inputs`,
            reason: "Protected finality requires workbook rows, rules, assumptions, expected values, and reviewed FX.",
            relationshipType: "depends_on",
            sourceBlockId: "working-review-required-inputs",
            sourceOutputRole: "validation_result",
            targetBlockId: protectedId,
            targetInputRole: "validation_result"
        },
        {
            bindingLabel: `${resultName} formula consistency`,
            reason: "Protected finality requires formulas to match expected values.",
            relationshipType: "depends_on",
            sourceBlockId: "working-review-formula-consistency",
            sourceOutputRole: "validation_result",
            targetBlockId: protectedId,
            targetInputRole: "validation_result"
        },
        {
            bindingLabel: `${resultName} unmatched rows review`,
            reason: "Unmatched rows block clean finality unless a reviewer override is configured.",
            relationshipType: "depends_on",
            sourceBlockId: "working-review-unmatched-rows",
            sourceOutputRole: "review_status",
            targetBlockId: protectedId,
            targetInputRole: "validation_result"
        },
        {
            bindingLabel: `${resultName} evidence preview`,
            reason: "Evidence Pack includes protected FAPI values.",
            relationshipType: "maps_to_output",
            sourceBlockId: protectedId,
            sourceOutputRole: "protected_result",
            targetBlockId: "working-output-evidence-preview",
            targetInputRole: "protected_result"
        },
        {
            bindingLabel: `${resultName} canonical JSON`,
            reason: "Canonical JSON includes protected FAPI values.",
            relationshipType: "maps_to_output",
            sourceBlockId: protectedId,
            sourceOutputRole: "protected_result",
            targetBlockId: "working-output-canonical-json",
            targetInputRole: "protected_result"
        }
    ];
});
_c3 = PROTECTED_EDGES;
const WORKING_SOURCE_DEMO_EDGE_SPECS = [
    {
        bindingLabel: "Trial Balance rows to classify",
        reason: "Keyword Mapper needs selected Trial Balance rows.",
        relationshipType: "provides_data_to",
        sourceBlockId: "working-source-uploaded-rows",
        sourceOutputRole: "selected_rows",
        targetBlockId: "working-logic-keyword-mapper",
        targetInputRole: "data_rows"
    },
    {
        bindingLabel: "Keyword rules for mapping",
        reason: "Keyword Mapper applies the connected Keyword Rulebook.",
        relationshipType: "referenced_by",
        sourceBlockId: "working-source-editable-rules",
        sourceOutputRole: "keyword_rules",
        targetBlockId: "working-logic-keyword-mapper",
        targetInputRole: "keyword_rules"
    },
    {
        bindingLabel: "Mapped categories to aggregate",
        reason: "Category Rollup Aggregator groups mapped atomic categories.",
        relationshipType: "aggregates_into",
        sourceBlockId: "working-logic-keyword-mapper",
        sourceOutputRole: "mapped_rows",
        targetBlockId: "working-logic-category-rollup",
        targetInputRole: "mapped_rows"
    },
    {
        bindingLabel: "Rollup rulebook",
        reason: "Category Rollup Aggregator applies grouping-only rollup rules.",
        relationshipType: "referenced_by",
        sourceBlockId: "working-source-rollup-rules",
        sourceOutputRole: "rollup_rules",
        targetBlockId: "working-logic-category-rollup",
        targetInputRole: "rollup_rules"
    },
    {
        bindingLabel: "Rollup named values",
        reason: "Calculation Engine consumes category and rollup totals as named values.",
        relationshipType: "provides_data_to",
        sourceBlockId: "working-logic-category-rollup",
        sourceOutputRole: "named_values",
        targetBlockId: "working-logic-calculation-engine",
        targetInputRole: "named_values"
    },
    {
        bindingLabel: "FAPI workbook inputs",
        reason: "Calculation Engine needs workbook assumptions such as inclusion rate, RTF, and FAT paid.",
        relationshipType: "provides_data_to",
        sourceBlockId: "working-source-fapi-inputs",
        sourceOutputRole: "fapi_inputs",
        targetBlockId: "working-logic-calculation-engine",
        targetInputRole: "protected_inputs"
    },
    {
        bindingLabel: "Bank of Canada FX source for review",
        reason: "FX Rate Review judges the source rate before it is protected.",
        relationshipType: "triggers_validation",
        sourceBlockId: "working-source-bank-of-canada-fx",
        sourceOutputRole: "exchange_rate",
        targetBlockId: "working-review-fx-rate",
        targetInputRole: "value_to_approve"
    },
    {
        bindingLabel: "Reviewed FX rate to protect",
        reason: "Protected FX Rate locks the reviewed rate for calculator use.",
        relationshipType: "approves_for",
        sourceBlockId: "working-review-fx-rate",
        sourceOutputRole: "reviewed_exchange_rate",
        targetBlockId: "working-protected-fx-rate",
        targetInputRole: "approved_value"
    },
    {
        bindingLabel: "Protected FX rate for calculator",
        reason: "Calculation Engine uses the reviewed protected FX rate, not a silently edited source value.",
        relationshipType: "provides_data_to",
        sourceBlockId: "working-protected-fx-rate",
        sourceOutputRole: "governed_value",
        targetBlockId: "working-logic-calculation-engine",
        targetInputRole: "protected_inputs"
    },
    {
        bindingLabel: "Trial Balance rows required",
        reason: "Required Input Check confirms uploaded workbook rows exist.",
        relationshipType: "triggers_validation",
        sourceBlockId: "working-source-uploaded-rows",
        sourceOutputRole: "selected_rows",
        targetBlockId: "working-review-required-inputs",
        targetInputRole: "review_findings"
    },
    {
        bindingLabel: "Keyword rules required",
        reason: "Required Input Check confirms Keyword Rules Source exists.",
        relationshipType: "triggers_validation",
        sourceBlockId: "working-source-editable-rules",
        sourceOutputRole: "keyword_rules",
        targetBlockId: "working-review-required-inputs",
        targetInputRole: "review_findings"
    },
    {
        bindingLabel: "Rollup rules required",
        reason: "Required Input Check confirms Rollup Rules Source exists.",
        relationshipType: "triggers_validation",
        sourceBlockId: "working-source-rollup-rules",
        sourceOutputRole: "rollup_rules",
        targetBlockId: "working-review-required-inputs",
        targetInputRole: "review_findings"
    },
    {
        bindingLabel: "FAPI inputs required",
        reason: "Required Input Check confirms FAT paid, RTF, inclusion rate, and expected results.",
        relationshipType: "triggers_validation",
        sourceBlockId: "working-source-fapi-inputs",
        sourceOutputRole: "fapi_inputs",
        targetBlockId: "working-review-required-inputs",
        targetInputRole: "review_findings"
    },
    {
        bindingLabel: "Reviewed FX required",
        reason: "Required Input Check confirms reviewed protected FX rate exists.",
        relationshipType: "triggers_validation",
        sourceBlockId: "working-protected-fx-rate",
        sourceOutputRole: "governed_value",
        targetBlockId: "working-review-required-inputs",
        targetInputRole: "review_findings"
    },
    {
        bindingLabel: "Mapped rows to check confidence",
        reason: "Mapping Quality Check reviews mapping confidence.",
        relationshipType: "triggers_validation",
        sourceBlockId: "working-logic-keyword-mapper",
        sourceOutputRole: "mapped_rows",
        targetBlockId: "working-review-mapping-quality",
        targetInputRole: "checked_items"
    },
    {
        bindingLabel: "Unmatched rows to review",
        reason: "Unmatched Rows Check reviews rows with no rule match.",
        relationshipType: "triggers_validation",
        sourceBlockId: "working-logic-keyword-mapper",
        sourceOutputRole: "unmatched_rows",
        targetBlockId: "working-review-unmatched-rows",
        targetInputRole: "checked_items"
    },
    {
        bindingLabel: "Calculated results for comparison",
        reason: "Formula Consistency Check compares actual and expected results.",
        relationshipType: "triggers_validation",
        sourceBlockId: "working-logic-calculation-engine",
        sourceOutputRole: "calculated_results",
        targetBlockId: "working-review-formula-consistency",
        targetInputRole: "checked_items"
    },
    {
        bindingLabel: "Expected workbook results for comparison",
        reason: "Formula Consistency Check reads expected values from FAPI Inputs.",
        relationshipType: "triggers_validation",
        sourceBlockId: "working-source-fapi-inputs",
        sourceOutputRole: "fapi_inputs",
        targetBlockId: "working-review-formula-consistency",
        targetInputRole: "checked_items"
    },
    {
        bindingLabel: "Candidate FAPI values for approval",
        reason: "Approval Gate reviews calculated values.",
        relationshipType: "triggers_validation",
        sourceBlockId: "working-logic-calculation-engine",
        sourceOutputRole: "calculated_results",
        targetBlockId: "working-review-approval",
        targetInputRole: "value_to_approve"
    },
    {
        bindingLabel: "Formula consistency for approval",
        reason: "Approval Gate includes formula consistency context.",
        relationshipType: "depends_on",
        sourceBlockId: "working-review-formula-consistency",
        sourceOutputRole: "validation_result",
        targetBlockId: "working-review-approval",
        targetInputRole: "validation_result"
    },
    {
        bindingLabel: "Required inputs for approval",
        reason: "Approval Gate records required-input readiness context.",
        relationshipType: "depends_on",
        sourceBlockId: "working-review-required-inputs",
        sourceOutputRole: "validation_result",
        targetBlockId: "working-review-approval",
        targetInputRole: "validation_result"
    },
    {
        bindingLabel: "Unmatched row review for approval",
        reason: "Approval Gate records unresolved unmatched-row context.",
        relationshipType: "depends_on",
        sourceBlockId: "working-review-unmatched-rows",
        sourceOutputRole: "review_status",
        targetBlockId: "working-review-approval",
        targetInputRole: "review_findings"
    },
    ...PROTECTED_EDGES,
    ...PROTECTED_RESULT_NAMES.map((resultName)=>({
            bindingLabel: `${resultName} readiness input`,
            reason: "Output Readiness Check verifies required protected result availability.",
            relationshipType: "triggers_validation",
            sourceBlockId: `working-protected-${slug(resultName)}`,
            sourceOutputRole: "protected_result",
            targetBlockId: "working-review-output-readiness",
            targetInputRole: "protected_values"
        })),
    {
        bindingLabel: "Required input readiness",
        reason: "Output Readiness Check includes required input status.",
        relationshipType: "depends_on",
        sourceBlockId: "working-review-required-inputs",
        sourceOutputRole: "validation_result",
        targetBlockId: "working-review-output-readiness",
        targetInputRole: "validation_result"
    },
    {
        bindingLabel: "Formula consistency readiness",
        reason: "Output Readiness Check includes expected-result comparison.",
        relationshipType: "depends_on",
        sourceBlockId: "working-review-formula-consistency",
        sourceOutputRole: "validation_result",
        targetBlockId: "working-review-output-readiness",
        targetInputRole: "validation_result"
    },
    {
        bindingLabel: "Unmatched row readiness",
        reason: "Output Readiness Check treats unmatched rows as blocking unless overridden.",
        relationshipType: "depends_on",
        sourceBlockId: "working-review-unmatched-rows",
        sourceOutputRole: "review_status",
        targetBlockId: "working-review-output-readiness",
        targetInputRole: "validation_result"
    },
    {
        bindingLabel: "Mapping quality readiness",
        reason: "Output Readiness Check carries non-blocking low-confidence warnings.",
        relationshipType: "depends_on",
        sourceBlockId: "working-review-mapping-quality",
        sourceOutputRole: "validation_result",
        targetBlockId: "working-review-output-readiness",
        targetInputRole: "review_findings"
    },
    {
        bindingLabel: "Protected FX rate evidence preview",
        reason: "Evidence Pack includes the reviewed protected FX rate.",
        relationshipType: "maps_to_output",
        sourceBlockId: "working-protected-fx-rate",
        sourceOutputRole: "governed_value",
        targetBlockId: "working-output-evidence-preview",
        targetInputRole: "protected_result"
    },
    {
        bindingLabel: "Protected FX rate canonical JSON",
        reason: "Canonical JSON includes the reviewed protected FX rate.",
        relationshipType: "maps_to_output",
        sourceBlockId: "working-protected-fx-rate",
        sourceOutputRole: "governed_value",
        targetBlockId: "working-output-canonical-json",
        targetInputRole: "protected_result"
    },
    {
        bindingLabel: "Mapped row evidence",
        reason: "Evidence Preview lists mapped rows and source trace.",
        relationshipType: "included_in_output_preview",
        sourceBlockId: "working-logic-keyword-mapper",
        sourceOutputRole: "mapped_rows",
        targetBlockId: "working-output-evidence-preview",
        targetInputRole: "mapped_rows"
    },
    {
        bindingLabel: "Rollup summary preview",
        reason: "Evidence Preview includes category and rollup totals.",
        relationshipType: "included_in_output_preview",
        sourceBlockId: "working-logic-category-rollup",
        sourceOutputRole: "rollup_summary",
        targetBlockId: "working-output-evidence-preview",
        targetInputRole: "review_findings"
    },
    {
        bindingLabel: "Rollup trace preview",
        reason: "Evidence Preview includes rollup trace rows.",
        relationshipType: "included_in_output_preview",
        sourceBlockId: "working-logic-category-rollup",
        sourceOutputRole: "rollup_formula_trace",
        targetBlockId: "working-output-evidence-preview",
        targetInputRole: "source_trace"
    },
    {
        bindingLabel: "Calculation summary preview",
        reason: "Evidence Preview includes calculated result values.",
        relationshipType: "included_in_output_preview",
        sourceBlockId: "working-logic-calculation-engine",
        sourceOutputRole: "calculation_summary",
        targetBlockId: "working-output-evidence-preview",
        targetInputRole: "review_findings"
    },
    {
        bindingLabel: "Formula trace preview",
        reason: "Evidence Preview includes readable calculation formula traces.",
        relationshipType: "included_in_output_preview",
        sourceBlockId: "working-logic-calculation-engine",
        sourceOutputRole: "formula_trace",
        targetBlockId: "working-output-evidence-preview",
        targetInputRole: "source_trace"
    },
    {
        bindingLabel: "Formula consistency warning context",
        reason: "Evidence Preview includes expected-result comparison.",
        relationshipType: "included_in_output_preview",
        sourceBlockId: "working-review-formula-consistency",
        sourceOutputRole: "validation_result",
        targetBlockId: "working-output-evidence-preview",
        targetInputRole: "validation_result"
    },
    {
        bindingLabel: "Output readiness preview context",
        reason: "Evidence Preview labels the package as final or review-ready.",
        relationshipType: "included_in_output_preview",
        sourceBlockId: "working-review-output-readiness",
        sourceOutputRole: "validation_result",
        targetBlockId: "working-output-evidence-preview",
        targetInputRole: "validation_result"
    },
    {
        bindingLabel: "Mapping warning context",
        reason: "Evidence Preview includes low-confidence rows.",
        relationshipType: "included_in_output_preview",
        sourceBlockId: "working-review-mapping-quality",
        sourceOutputRole: "low_confidence_rows",
        targetBlockId: "working-output-evidence-preview",
        targetInputRole: "review_findings"
    },
    {
        bindingLabel: "Unmatched warning context",
        reason: "Evidence Preview includes unmatched rows.",
        relationshipType: "included_in_output_preview",
        sourceBlockId: "working-review-unmatched-rows",
        sourceOutputRole: "unmatched_rows",
        targetBlockId: "working-output-evidence-preview",
        targetInputRole: "review_findings"
    },
    {
        bindingLabel: "Mapped row JSON",
        reason: "Canonical JSON includes mapped rows and summary.",
        relationshipType: "included_in_handoff",
        sourceBlockId: "working-logic-keyword-mapper",
        sourceOutputRole: "mapped_rows",
        targetBlockId: "working-output-canonical-json",
        targetInputRole: "mapped_rows"
    },
    {
        bindingLabel: "Rollup JSON",
        reason: "Canonical JSON includes category and rollup totals.",
        relationshipType: "included_in_handoff",
        sourceBlockId: "working-logic-category-rollup",
        sourceOutputRole: "rollup_summary",
        targetBlockId: "working-output-canonical-json",
        targetInputRole: "review_findings"
    },
    {
        bindingLabel: "Rollup trace JSON",
        reason: "Canonical JSON includes rollup formula traces.",
        relationshipType: "included_in_handoff",
        sourceBlockId: "working-logic-category-rollup",
        sourceOutputRole: "rollup_formula_trace",
        targetBlockId: "working-output-canonical-json",
        targetInputRole: "source_trace"
    },
    {
        bindingLabel: "Calculation JSON",
        reason: "Canonical JSON includes calculated results.",
        relationshipType: "included_in_handoff",
        sourceBlockId: "working-logic-calculation-engine",
        sourceOutputRole: "calculation_summary",
        targetBlockId: "working-output-canonical-json",
        targetInputRole: "review_findings"
    },
    {
        bindingLabel: "Formula trace JSON",
        reason: "Canonical JSON includes readable calculation formula traces.",
        relationshipType: "included_in_handoff",
        sourceBlockId: "working-logic-calculation-engine",
        sourceOutputRole: "formula_trace",
        targetBlockId: "working-output-canonical-json",
        targetInputRole: "source_trace"
    },
    {
        bindingLabel: "Formula consistency JSON",
        reason: "Canonical JSON includes expected-result comparison.",
        relationshipType: "included_in_handoff",
        sourceBlockId: "working-review-formula-consistency",
        sourceOutputRole: "validation_result",
        targetBlockId: "working-output-canonical-json",
        targetInputRole: "validation_result"
    },
    {
        bindingLabel: "Output readiness JSON",
        reason: "Canonical JSON labels the package as final or review-ready.",
        relationshipType: "included_in_handoff",
        sourceBlockId: "working-review-output-readiness",
        sourceOutputRole: "validation_result",
        targetBlockId: "working-output-canonical-json",
        targetInputRole: "validation_result"
    }
];
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "PROTECTED_RESULT_SPECS$PROTECTED_RESULT_NAMES.map");
__turbopack_context__.k.register(_c1, "PROTECTED_RESULT_SPECS");
__turbopack_context__.k.register(_c2, "PROTECTED_EDGES$PROTECTED_RESULT_NAMES.flatMap");
__turbopack_context__.k.register(_c3, "PROTECTED_EDGES");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/templates/sample-workflows/fapi-template.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FAPI_LINES_CALC_RULES",
    ()=>FAPI_LINES_CALC_RULES,
    "FAPI_ROLLUP_RULES",
    ()=>FAPI_ROLLUP_RULES,
    "FAPI_SUMMARY_CALC_RULES",
    ()=>FAPI_SUMMARY_CALC_RULES,
    "FAPI_TEMPLATE_BLOCK_SPECS",
    ()=>FAPI_TEMPLATE_BLOCK_SPECS,
    "FAPI_TEMPLATE_EDGE_SPECS",
    ()=>FAPI_TEMPLATE_EDGE_SPECS
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$working$2d$source$2d$rules$2d$demo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/workflow-engine/templates/sample-workflows/working-source-rules-demo.ts [app-client] (ecmascript)");
;
const FAPI_LINES_CALC_RULES = [
    {
        calculationId: "A",
        description: "A = P × (income_bucket − expense_bucket) + 95(2)",
        formulaExpression: "pCoefficient * (income_bucket - expense_bucket) + canadianRules95_4",
        label: "A",
        operands: [
            "income_bucket",
            "expense_bucket"
        ],
        operation: "max_subtract_zero",
        resultKey: "A"
    },
    {
        calculationId: "EXPENSES",
        description: "Expenses = P × expense_bucket",
        formulaExpression: "pCoefficient * expense_bucket",
        label: "Expenses",
        operands: [
            "expense_bucket"
        ],
        operation: "pass_through",
        resultKey: "EXPENSES"
    },
    {
        calculationId: "COMPUTATION_95_4",
        description: "95(2) = Canadian 95(2) rules amount (flows into A)",
        label: "95(2)",
        operands: [
            "canadianRules95_4"
        ],
        operation: "pass_through",
        resultKey: "COMPUTATION_95_4"
    },
    {
        calculationId: "A1",
        description: "A1 = debtForgiveness * 2",
        label: "A1",
        operands: [
            "debtForgiveness",
            2
        ],
        operation: "multiply",
        resultKey: "A1"
    },
    {
        calculationId: "A2",
        description: "A2 = priorYearG",
        label: "A2",
        operands: [
            "priorYearG"
        ],
        operation: "pass_through",
        resultKey: "A2"
    },
    {
        calculationId: "B",
        description: "B = capGains * inclusionRate",
        label: "B",
        operands: [
            "capGains",
            "inclusionRate"
        ],
        operation: "multiply",
        resultKey: "B"
    },
    ...[
        "C",
        "D",
        "E",
        "F",
        "F1",
        "G",
        "H"
    ].map((id, i)=>{
        const sourceKeys = {
            C: "cfaIncome",
            D: "businessLosses",
            E: "faclCarryforward",
            F: "prescribedAmount",
            F1: "prescribedAmountF1",
            G: "dividendDeductions",
            H: "partnershipDividends"
        };
        return {
            calculationId: id,
            description: `${id} = ${sourceKeys[id]}`,
            label: id,
            operands: [
                sourceKeys[id]
            ],
            operation: "pass_through",
            resultKey: id
        };
    }),
    {
        calculationId: "FAT_PAID",
        description: "FAT_PAID = fatPaid",
        label: "FAT Paid",
        operands: [
            "fatPaid"
        ],
        operation: "pass_through",
        resultKey: "FAT_PAID"
    },
    {
        calculationId: "RTF",
        description: "RTF = rtf",
        label: "RTF",
        operands: [
            "rtf"
        ],
        operation: "pass_through",
        resultKey: "RTF"
    }
];
const FAPI_SUMMARY_CALC_RULES = [
    {
        calculationId: "GROSS",
        description: "Gross = A + A1 + A2 + B + C",
        label: "Gross",
        operands: [
            "A",
            "A1",
            "A2",
            "B",
            "C"
        ],
        operation: "add",
        resultKey: "GROSS"
    },
    {
        calculationId: "DEDUCTIONS",
        description: "Deductions = D + E + F + F1 + G + H",
        label: "Deductions",
        operands: [
            "D",
            "E",
            "F",
            "F1",
            "G",
            "H"
        ],
        operation: "add",
        resultKey: "DEDUCTIONS"
    },
    {
        calculationId: "FAPI_BRUT",
        description: "FAPI Brut = max(Gross - Deductions, 0)",
        label: "FAPI Brut",
        operands: [
            "GROSS",
            "DEDUCTIONS"
        ],
        operation: "max_subtract_zero",
        resultKey: "FAPI_BRUT"
    },
    {
        calculationId: "FAT_DEDUCTION",
        description: "FAT Deduction = min(FAT_PAID × RTF, FAPI_BRUT)",
        label: "FAT Deduction",
        operands: [
            "FAT_PAID",
            "RTF",
            "FAPI_BRUT"
        ],
        operation: "min_multiply_cap",
        resultKey: "FAT_DEDUCTION"
    },
    {
        calculationId: "NET_FAPI",
        description: "Net FAPI = max(FAPI_BRUT - FAT_DEDUCTION, 0)",
        label: "Net FAPI",
        operands: [
            "FAPI_BRUT",
            "FAT_DEDUCTION"
        ],
        operation: "max_subtract_zero",
        resultKey: "NET_FAPI"
    },
    {
        calculationId: "FX_RATE",
        description: "FX_RATE = fxRate (from Bank of Canada source)",
        label: "FX Rate",
        operands: [
            "fxRate"
        ],
        operation: "pass_through",
        resultKey: "FX_RATE"
    },
    // CAD column — every result line scaled by the annual-average FX rate. Because
    // the FAPI formulas are linear, scaling each line equals recomputing in CAD
    // (matches Platform's convertMoneyLinesToCad + recompute). The parcours shows
    // all five result lines in both source currency and CAD.
    {
        calculationId: "GROSS_CAD",
        description: "Gross CAD = GROSS × FX_RATE",
        label: "Gross CAD",
        operands: [
            "GROSS",
            "FX_RATE"
        ],
        operation: "multiply",
        resultKey: "GROSS_CAD"
    },
    {
        calculationId: "DEDUCTIONS_CAD",
        description: "Deductions CAD = DEDUCTIONS × FX_RATE",
        label: "Deductions CAD",
        operands: [
            "DEDUCTIONS",
            "FX_RATE"
        ],
        operation: "multiply",
        resultKey: "DEDUCTIONS_CAD"
    },
    {
        calculationId: "FAPI_BRUT_CAD",
        description: "FAPI Brut CAD = FAPI_BRUT × FX_RATE",
        label: "FAPI Brut CAD",
        operands: [
            "FAPI_BRUT",
            "FX_RATE"
        ],
        operation: "multiply",
        resultKey: "FAPI_BRUT_CAD"
    },
    {
        calculationId: "FAT_DEDUCTION_CAD",
        description: "FAT Deduction CAD = FAT_DEDUCTION × FX_RATE",
        label: "FAT Deduction CAD",
        operands: [
            "FAT_DEDUCTION",
            "FX_RATE"
        ],
        operation: "multiply",
        resultKey: "FAT_DEDUCTION_CAD"
    },
    {
        calculationId: "NET_FAPI_CAD",
        description: "Net FAPI CAD = NET_FAPI × FX_RATE",
        label: "Net FAPI CAD",
        operands: [
            "NET_FAPI",
            "FX_RATE"
        ],
        operation: "multiply",
        resultKey: "NET_FAPI_CAD"
    }
];
const FAPI_ROLLUP_RULES = [
    {
        description: "Adds income mapped categories (line A property income).",
        includeCategoryIds: [
            "interestIncome",
            "rents",
            "royalties",
            "dividends",
            "otherFapiIncome"
        ],
        label: "Income Bucket",
        operation: "sum",
        rollupId: "income_bucket"
    },
    {
        description: "Adds FAPI-allowable expenses using absolute values (subtracted in line A).",
        includeCategoryIds: [
            "generalExpenses",
            "legalExpenses",
            "accountingExpenses"
        ],
        label: "Expense Bucket",
        operation: "sum_abs",
        rollupId: "expense_bucket"
    },
    {
        description: "Line C — controlled foreign affiliate income (classified rows).",
        includeCategoryIds: [
            "cfaIncome"
        ],
        label: "CFA Income (C)",
        operation: "sum",
        rollupId: "cfaIncome"
    },
    {
        description: "Line A1 driver — debt forgiveness income (A1 = 2 × this).",
        includeCategoryIds: [
            "debtForgiveness"
        ],
        label: "Debt Forgiveness (A1)",
        operation: "sum",
        rollupId: "debtForgiveness"
    },
    {
        description: "Line D — business investment losses as a positive deduction.",
        includeCategoryIds: [
            "businessLosses"
        ],
        label: "Business Losses (D)",
        operation: "sum_abs",
        rollupId: "businessLosses"
    },
    {
        description: "Line E — foreign accrual capital losses as a positive deduction.",
        includeCategoryIds: [
            "faclCarryforward"
        ],
        label: "FACL Carryforward (E)",
        operation: "sum_abs",
        rollupId: "faclCarryforward"
    }
];
const FAPI_TEMPLATE_BLOCK_SPECS = [
    // ── Sources ──────────────────────────────────────────────────────────────
    {
        catalogId: "source:excel-workbook",
        config: {
            columns: [
                "rowId",
                "account",
                "label",
                "description",
                "amount",
                "currency"
            ],
            columnMapping: {
                account: "account",
                amount: "amount",
                currency: "currency",
                description: "description",
                label: "label"
            },
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
            workbookName: "Upload FAPI trial balance workbook"
        },
        description: "Upload the Excel trial balance with FAPI income and expense rows.",
        id: "fapi-source-trial-balance",
        label: "Trial Balance",
        position: {
            x: -220,
            y: 80
        }
    },
    {
        catalogId: "source:manual-entry",
        config: {
            documentCurrency: "USD",
            fatPaid: 100,
            fapiYear: 2025,
            inclusionRate: 0.5,
            outputs: "fapi_inputs, input_metadata",
            reportingCurrency: "CAD",
            rtf: 1.9,
            // Line-driving workbook assumptions (feed A2/F–H and the 95(2) line).
            // NOTE: cfaIncome (C), debtForgiveness (A1), businessLosses (D) and
            // faclCarryforward (E) are intentionally NOT defaulted here — they come from
            // classifying trial-balance rows (the rollup produces them as named values).
            // Defaulting them to 0 here would clobber the classified value (fapi_inputs
            // wins over rollup in the calc engine). A user can still override via the
            // run's editable inputs.
            pCoefficient: 1,
            canadianRules95_4: 0,
            priorYearG: 0,
            prescribedAmount: 0,
            prescribedAmountF1: 0,
            dividendDeductions: 0,
            partnershipDividends: 0,
            sourceKind: "fapi_inputs",
            sourceLocator: "manual-source://fapi-inputs",
            sourceStatus: "draft",
            sourceVersion: 1,
            toolId: "source.fapi_inputs"
        },
        description: "Inclusion rate, RTF, FAT paid, P-coefficient, 95(2) amount, and the A1/A2/C–H line assumptions.",
        id: "fapi-source-inputs",
        label: "FAPI Inputs",
        position: {
            x: -220,
            y: 360
        }
    },
    {
        catalogId: "source:currency-rate",
        config: {
            documentCurrency: "USD",
            fapiYear: 2025,
            overrideRate: 1.35,
            overrideReason: "Workbook-provided draft FX rate.",
            outputs: "exchange_rate, rate_metadata",
            rateProvider: "bank_of_canada",
            rateType: "annual_average",
            reportingCurrency: "CAD",
            sourceKind: "currency_rate",
            sourceLocator: "bank-of-canada://annual-average/USD-CAD/2025",
            sourceStatus: "draft",
            sourceVersion: 1,
            toolId: "source.currency_rate"
        },
        description: "Bank of Canada annual average USD→CAD FX rate for the FAPI year. Consumes the live Valet API rate when available, otherwise the workbook override.",
        id: "fapi-source-fx-rate",
        label: "Bank of Canada FX Rate",
        position: {
            x: -220,
            y: 640
        }
    },
    {
        catalogId: "source:api-http-request",
        config: {
            apiName: "Bank of Canada Valet",
            documentCurrency: "USD",
            endpoint: "https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json",
            fapiYear: 2025,
            inputs: "HTTP GET request",
            outputs: "apiReference, exchange_rate",
            rateProvider: "bank_of_canada",
            rateType: "annual_average",
            reportingCurrency: "CAD",
            seriesName: "FXUSDCAD",
            sourceKind: "api_reference",
            sourceLocator: "https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json?start_date=2025-01-01&end_date=2025-12-31",
            sourceStatus: "draft",
            sourceVersion: 1,
            toolId: "source.manual_value"
        },
        description: "Live Bank of Canada Valet API — annual-average USD→CAD observations for the FAPI year. This is the real source of the FX rate.",
        id: "fapi-api-boc-fx",
        label: "Bank of Canada Valet API",
        position: {
            x: -520,
            y: 640
        }
    },
    // ── Logic ─────────────────────────────────────────────────────────────────
    {
        catalogId: "logic:classification-mapping",
        config: {
            conflictStrategy: "highest_confidence",
            inputs: "data_rows, keyword_rules",
            keywordRules: __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$workflow$2d$engine$2f$templates$2f$sample$2d$workflows$2f$working$2d$source$2d$rules$2d$demo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORKING_SOURCE_DEMO_RULES"],
            lowConfidenceThreshold: 0.75,
            matchFields: [
                "account",
                "label",
                "description"
            ],
            matchMode: "contains",
            outputs: "mapped_rows, unmatched_rows, low_confidence_rows, mapping_summary",
            toolId: "logic.keyword_mapper",
            unmatchedStrategy: "send_to_review"
        },
        description: "Classifies trial balance rows into FAPI income and expense categories using built-in keyword rules.",
        id: "fapi-logic-keyword-mapper",
        label: "Keyword Mapper",
        position: {
            x: 340,
            y: 80
        }
    },
    {
        catalogId: "logic:category-rollup-aggregator",
        config: {
            inputs: "mapped_rows, rollup_rules",
            operation: "sum",
            outputs: "category_totals, rollup_totals, named_values, rollup_summary",
            rollupRules: FAPI_ROLLUP_RULES,
            toolId: "logic.category_rollup_aggregator"
        },
        description: "Groups mapped categories into Income Bucket and Expense Bucket totals using built-in rollup rules.",
        id: "fapi-logic-category-rollup",
        label: "Category Rollup",
        position: {
            x: 800,
            y: 80
        }
    },
    {
        catalogId: "logic:calculation-engine",
        config: {
            formulas: FAPI_LINES_CALC_RULES,
            inputs: "named_values, protected_inputs",
            mode: "auto",
            outputs: "calculated_results, formula_trace, calculation_summary, named_values",
            toolId: "logic.calculation_engine"
        },
        description: "Computes individual FAPI lines A through H from category totals and workbook inputs.",
        id: "fapi-logic-lines-engine",
        label: "FAPI Lines Engine",
        position: {
            x: 1260,
            y: 80
        }
    },
    {
        catalogId: "logic:calculation-engine",
        config: {
            formulas: FAPI_SUMMARY_CALC_RULES,
            inputs: "named_values",
            mode: "auto",
            outputs: "calculated_results, formula_trace, calculation_summary, named_values",
            toolId: "logic.calculation_engine"
        },
        description: "Aggregates lines A-H into Gross, Deductions, FAPI Brut, Net FAPI, and Net FAPI CAD.",
        id: "fapi-logic-summary-engine",
        label: "FAPI Summary Engine",
        position: {
            x: 1720,
            y: 80
        }
    },
    // ── Field blocks ──────────────────────────────────────────────────────────
    {
        catalogId: "field:field-block",
        config: {
            toolId: "field.field_block"
        },
        description: "Displays income and expense category breakdown from the rollup.",
        id: "fapi-field-income",
        label: "Income & Expense",
        position: {
            x: 800,
            y: 480
        }
    },
    {
        catalogId: "field:field-block",
        config: {
            toolId: "field.field_block"
        },
        description: "Displays computed FAPI lines A through H with formula breakdown.",
        id: "fapi-field-lines",
        label: "FAPI Lines A–H",
        position: {
            x: 1260,
            y: 480
        }
    },
    {
        catalogId: "field:field-block",
        config: {
            toolId: "field.field_block"
        },
        description: "Displays FAPI summary: Gross, Deductions, FAPI Brut, Net FAPI, and Net FAPI CAD.",
        id: "fapi-field-summary",
        label: "FAPI Summary",
        position: {
            x: 1720,
            y: 480
        }
    },
    // ── Outputs ───────────────────────────────────────────────────────────────
    {
        catalogId: "output:evidence-pack",
        config: {
            inputs: "mapped_rows, review_findings, source_trace",
            outputs: "preview",
            toolId: "output.evidence_pack_preview"
        },
        description: "Human-readable preview with mapped rows, rollup totals, and calculated results.",
        id: "fapi-output-evidence",
        label: "Evidence Pack",
        position: {
            x: 2180,
            y: 80
        }
    },
    {
        catalogId: "output:canonical-json",
        config: {
            inputs: "mapped_rows, review_findings, source_trace",
            outputs: "canonical_json",
            toolId: "output.canonical_json"
        },
        description: "Structured JSON package with mapped rows and all FAPI computed results.",
        id: "fapi-output-json",
        label: "Canonical JSON",
        position: {
            x: 2180,
            y: 380
        }
    }
];
const FAPI_TEMPLATE_EDGE_SPECS = [
    // Sources → Logic
    {
        bindingLabel: "Trial balance rows to classify",
        reason: "Keyword Mapper classifies uploaded trial balance rows into FAPI categories.",
        relationshipType: "provides_data_to",
        sourceBlockId: "fapi-source-trial-balance",
        sourceOutputRole: "selected_rows",
        targetBlockId: "fapi-logic-keyword-mapper",
        targetInputRole: "data_rows"
    },
    {
        bindingLabel: "Mapped categories to aggregate",
        reason: "Category Rollup groups mapped rows into income and expense buckets.",
        relationshipType: "aggregates_into",
        sourceBlockId: "fapi-logic-keyword-mapper",
        sourceOutputRole: "mapped_rows",
        targetBlockId: "fapi-logic-category-rollup",
        targetInputRole: "mapped_rows"
    },
    {
        bindingLabel: "Category totals for FAPI lines",
        reason: "Lines Engine uses category and rollup totals as named values for A-H formulas.",
        relationshipType: "provides_data_to",
        sourceBlockId: "fapi-logic-category-rollup",
        sourceOutputRole: "named_values",
        targetBlockId: "fapi-logic-lines-engine",
        targetInputRole: "named_values"
    },
    {
        bindingLabel: "FAPI workbook inputs",
        reason: "Lines Engine needs inclusion rate, RTF, and FAT paid from the workbook.",
        relationshipType: "provides_data_to",
        sourceBlockId: "fapi-source-inputs",
        sourceOutputRole: "fapi_inputs",
        targetBlockId: "fapi-logic-lines-engine",
        targetInputRole: "protected_inputs"
    },
    {
        bindingLabel: "FAPI lines A–H for summary",
        reason: "Summary Engine reads computed lines A-H and FAT/RTF as named values.",
        relationshipType: "provides_data_to",
        sourceBlockId: "fapi-logic-lines-engine",
        sourceOutputRole: "calculated_results",
        targetBlockId: "fapi-logic-summary-engine",
        targetInputRole: "named_values"
    },
    {
        bindingLabel: "Live FX observations feed the rate",
        reason: "Currency Rate block consumes the Bank of Canada Valet API's annual-average USD→CAD rate, falling back to the workbook override if the API is unavailable.",
        relationshipType: "provides_data_to",
        sourceBlockId: "fapi-api-boc-fx",
        sourceOutputRole: "apiReference",
        targetBlockId: "fapi-source-fx-rate",
        targetInputRole: "request"
    },
    {
        bindingLabel: "FX rate for CAD conversion",
        reason: "Summary Engine uses the Bank of Canada FX rate to convert Net FAPI to CAD.",
        relationshipType: "provides_data_to",
        sourceBlockId: "fapi-source-fx-rate",
        sourceOutputRole: "exchange_rate",
        targetBlockId: "fapi-logic-summary-engine",
        targetInputRole: "named_values"
    },
    // Logic → Field blocks
    {
        bindingLabel: "Income & expense breakdown",
        reason: "Income & Expense field displays rollup totals with category detail.",
        relationshipType: "provides_data_to",
        sourceBlockId: "fapi-logic-category-rollup",
        sourceOutputRole: "rollup_totals",
        targetBlockId: "fapi-field-income",
        targetInputRole: "computed_values"
    },
    {
        bindingLabel: "FAPI computation lines",
        reason: "FAPI Lines field displays A through H with formula trace.",
        relationshipType: "provides_data_to",
        sourceBlockId: "fapi-logic-lines-engine",
        sourceOutputRole: "calculated_results",
        targetBlockId: "fapi-field-lines",
        targetInputRole: "computed_values"
    },
    {
        bindingLabel: "FAPI summary results",
        reason: "FAPI Summary field displays Gross, Net FAPI, and Net FAPI CAD.",
        relationshipType: "provides_data_to",
        sourceBlockId: "fapi-logic-summary-engine",
        sourceOutputRole: "calculated_results",
        targetBlockId: "fapi-field-summary",
        targetInputRole: "computed_values"
    },
    // Logic → Outputs
    {
        bindingLabel: "Mapped rows evidence",
        reason: "Evidence Pack lists mapped trial balance rows with source trace.",
        relationshipType: "included_in_output_preview",
        sourceBlockId: "fapi-logic-keyword-mapper",
        sourceOutputRole: "mapped_rows",
        targetBlockId: "fapi-output-evidence",
        targetInputRole: "mapped_rows"
    },
    {
        bindingLabel: "Rollup summary evidence",
        reason: "Evidence Pack includes category and rollup totals.",
        relationshipType: "included_in_output_preview",
        sourceBlockId: "fapi-logic-category-rollup",
        sourceOutputRole: "rollup_summary",
        targetBlockId: "fapi-output-evidence",
        targetInputRole: "review_findings"
    },
    {
        bindingLabel: "FAPI calculation summary",
        reason: "Evidence Pack includes all computed FAPI results.",
        relationshipType: "included_in_output_preview",
        sourceBlockId: "fapi-logic-summary-engine",
        sourceOutputRole: "calculation_summary",
        targetBlockId: "fapi-output-evidence",
        targetInputRole: "review_findings"
    },
    {
        bindingLabel: "Mapped rows JSON",
        reason: "Canonical JSON includes mapped rows and source trace.",
        relationshipType: "included_in_handoff",
        sourceBlockId: "fapi-logic-keyword-mapper",
        sourceOutputRole: "mapped_rows",
        targetBlockId: "fapi-output-json",
        targetInputRole: "mapped_rows"
    },
    {
        bindingLabel: "FAPI results JSON",
        reason: "Canonical JSON includes all computed FAPI results.",
        relationshipType: "included_in_handoff",
        sourceBlockId: "fapi-logic-summary-engine",
        sourceOutputRole: "calculation_summary",
        targetBlockId: "fapi-output-json",
        targetInputRole: "review_findings"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/templates/sample-workflows/roulement-fiscal-template.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ── Keyword rules — classifies each property row by type ─────────────────────
__turbopack_context__.s([
    "ROULEMENT_CLASSIFICATION_RULES",
    ()=>ROULEMENT_CLASSIFICATION_RULES,
    "ROULEMENT_ELECTION_CALC_RULES",
    ()=>ROULEMENT_ELECTION_CALC_RULES,
    "ROULEMENT_FISCAL_BLOCK_SPECS",
    ()=>ROULEMENT_FISCAL_BLOCK_SPECS,
    "ROULEMENT_FISCAL_EDGE_SPECS",
    ()=>ROULEMENT_FISCAL_EDGE_SPECS,
    "ROULEMENT_ROLLUP_RULES",
    ()=>ROULEMENT_ROLLUP_RULES,
    "ROULEMENT_SUMMARY_CALC_RULES",
    ()=>ROULEMENT_SUMMARY_CALC_RULES
]);
const ROULEMENT_CLASSIFICATION_RULES = [
    {
        categoryId: "immobilisationAmortissable",
        categoryLabel: "Immobilisation amortissable",
        confidence: 0.93,
        description: "Dépreciable / amortissable — classes CII 8, 10, 43, etc.",
        keywords: [
            "immobilisation",
            "amortissable",
            "dépreciable",
            "depreciable",
            "équipement",
            "equipment",
            "machinerie",
            "machinery",
            "classe 8",
            "classe 10",
            "classe 43",
            "véhicule",
            "vehicle"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-immo-amortissable"
    },
    {
        categoryId: "bienEnCapitalNonAmortissable",
        categoryLabel: "Bien en capital non amortissable",
        confidence: 0.91,
        description: "Terrain, fonds de terre, immeuble non amortissable.",
        keywords: [
            "terrain",
            "fonds de terre",
            "land",
            "immeuble",
            "building",
            "real property",
            "propriété réelle",
            "non amortissable"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-bien-capital-non-amortissable"
    },
    {
        categoryId: "actions",
        categoryLabel: "Actions / Titres",
        confidence: 0.94,
        description: "Actions ordinaires, privilégiées ou titres de participation.",
        keywords: [
            "actions",
            "shares",
            "titres",
            "participation",
            "ordinaires",
            "privilégiées",
            "preferred shares",
            "common shares"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-actions"
    },
    {
        categoryId: "biensInventaire",
        categoryLabel: "Biens en inventaire",
        confidence: 0.89,
        description: "Stock, marchandise, inventaire transféré.",
        keywords: [
            "inventaire",
            "inventory",
            "stock",
            "marchandise",
            "merchandise",
            "goods",
            "produits"
        ],
        matchMode: "contains",
        priority: 8,
        ruleId: "rule-biens-inventaire"
    },
    {
        categoryId: "immobilisationIncorporelle",
        categoryLabel: "Immobilisation incorporelle / Achalandage",
        confidence: 0.87,
        description: "Achalandage, marques, brevets, propriété intellectuelle.",
        keywords: [
            "achalandage",
            "goodwill",
            "marque",
            "trademark",
            "brevet",
            "patent",
            "propriété intellectuelle",
            "intellectual property",
            "licence",
            "license",
            "incorporel"
        ],
        matchMode: "contains",
        priority: 9,
        ruleId: "rule-immo-incorporelle"
    },
    {
        categoryId: "creancesEtBillets",
        categoryLabel: "Créances et billets",
        confidence: 0.88,
        description: "Comptes débiteurs, billets à recevoir, prêts inter-compagnies.",
        keywords: [
            "créance",
            "receivable",
            "billet",
            "note receivable",
            "prêt",
            "loan",
            "inter-compagnie",
            "intercompany",
            "débiteur"
        ],
        matchMode: "contains",
        priority: 8,
        ruleId: "rule-creances-billets"
    }
];
const ROULEMENT_ROLLUP_RULES = [
    {
        description: "Somme du PBR de toutes les immobilisations amortissables.",
        includeCategoryIds: [
            "immobilisationAmortissable"
        ],
        label: "PBR — Immobilisations amortissables",
        operation: "sum",
        rollupId: "pbr_immo_amortissable"
    },
    {
        description: "Somme du PBR des biens en capital non amortissables.",
        includeCategoryIds: [
            "bienEnCapitalNonAmortissable"
        ],
        label: "PBR — Biens en capital non amortissables",
        operation: "sum",
        rollupId: "pbr_bien_capital"
    },
    {
        description: "Somme du PBR des actions et titres transférés.",
        includeCategoryIds: [
            "actions"
        ],
        label: "PBR — Actions et titres",
        operation: "sum",
        rollupId: "pbr_actions"
    },
    {
        description: "Somme du PBR des biens en inventaire.",
        includeCategoryIds: [
            "biensInventaire"
        ],
        label: "PBR — Inventaire",
        operation: "sum",
        rollupId: "pbr_inventaire"
    },
    {
        description: "Somme du PBR des immobilisations incorporelles.",
        includeCategoryIds: [
            "immobilisationIncorporelle"
        ],
        label: "PBR — Incorporels / Achalandage",
        operation: "sum",
        rollupId: "pbr_incorporel"
    },
    {
        description: "Somme du PBR total de tous les biens — toutes catégories confondues.",
        includeCategoryIds: [
            "immobilisationAmortissable",
            "bienEnCapitalNonAmortissable",
            "actions",
            "biensInventaire",
            "immobilisationIncorporelle",
            "creancesEtBillets"
        ],
        label: "PBR Total — Tous les biens",
        operation: "sum",
        rollupId: "pbr_total"
    }
];
const ROULEMENT_ELECTION_CALC_RULES = [
    {
        calculationId: "BORNE_MIN",
        description: "Borne min = max(PBR total, contrepartie autre)",
        label: "Borne minimale",
        operands: [
            "pbr_total",
            "contrepartie_autre"
        ],
        operation: "max",
        resultKey: "BORNE_MIN"
    },
    {
        calculationId: "BORNE_MAX",
        description: "Borne max = JVM totale des biens transférés",
        label: "Borne maximale (JVM)",
        operands: [
            "jvm_total"
        ],
        operation: "pass_through",
        resultKey: "BORNE_MAX"
    },
    {
        calculationId: "MONTANT_ELU",
        description: "Montant élu (entré manuellement, entre BORNE_MIN et BORNE_MAX)",
        label: "Montant élu",
        operands: [
            "montant_elu"
        ],
        operation: "pass_through",
        resultKey: "MONTANT_ELU"
    },
    {
        calculationId: "PRODUIT_ALIENATION",
        description: "Produit d'aliénation = montant élu (art. 85(1)a))",
        label: "Produit d'aliénation",
        operands: [
            "MONTANT_ELU"
        ],
        operation: "pass_through",
        resultKey: "PRODUIT_ALIENATION"
    },
    {
        calculationId: "GAIN_CAPITAL_BRUT",
        description: "Gain en capital brut = max(montant_elu - pbr_total, 0)",
        label: "Gain en capital brut",
        operands: [
            "MONTANT_ELU",
            "pbr_total"
        ],
        operation: "max_subtract_zero",
        resultKey: "GAIN_CAPITAL_BRUT"
    },
    {
        calculationId: "GAIN_IMPOSABLE",
        description: "Gain imposable = gain_brut × taux_inclusion",
        label: "Gain en capital imposable",
        operands: [
            "GAIN_CAPITAL_BRUT",
            "taux_inclusion"
        ],
        operation: "multiply",
        resultKey: "GAIN_IMPOSABLE"
    },
    {
        calculationId: "COUT_ACTIONS_RECUES",
        description: "Coût des actions reçues = montant_elu − contrepartie_autre",
        label: "Coût des actions reçues",
        operands: [
            "MONTANT_ELU",
            "contrepartie_autre"
        ],
        operation: "subtract",
        resultKey: "COUT_ACTIONS_RECUES"
    }
];
const ROULEMENT_SUMMARY_CALC_RULES = [
    {
        calculationId: "GAIN_DIFFERE",
        description: "Gain différé = JVM totale − montant élu (plus-value non reconnue)",
        label: "Gain différé (non reconnu)",
        operands: [
            "jvm_total",
            "MONTANT_ELU"
        ],
        operation: "subtract",
        resultKey: "GAIN_DIFFERE"
    },
    {
        calculationId: "IMPOT_ESTIME_DIFFERE",
        description: "Impôt estimé sur gain différé ≈ gain_differe × 0.265 (taux corp. estimé)",
        label: "Impôt estimé sur gain différé",
        operands: [
            "GAIN_DIFFERE",
            0.265
        ],
        operation: "multiply",
        resultKey: "IMPOT_ESTIME_DIFFERE"
    },
    {
        calculationId: "FX_RATE",
        description: "Taux de change (Banque du Canada, moyen annuel)",
        label: "Taux de change USD→CAD",
        operands: [
            "fxRate"
        ],
        operation: "pass_through",
        resultKey: "FX_RATE"
    },
    {
        calculationId: "JVM_TOTAL_CAD",
        description: "JVM totale en CAD = jvm_total × taux de change",
        label: "JVM totale (CAD)",
        operands: [
            "jvm_total",
            "FX_RATE"
        ],
        operation: "multiply",
        resultKey: "JVM_TOTAL_CAD"
    },
    {
        calculationId: "GAIN_REALISE_CAD",
        description: "Gain réalisé converti en CAD = gain_capital_brut × taux de change",
        label: "Gain réalisé (CAD)",
        operands: [
            "GAIN_CAPITAL_BRUT",
            "FX_RATE"
        ],
        operation: "multiply",
        resultKey: "GAIN_REALISE_CAD"
    }
];
const ROULEMENT_FISCAL_BLOCK_SPECS = [
    // ── Sources ──────────────────────────────────────────────────────────────
    {
        catalogId: "source:excel-workbook",
        config: {
            columns: [
                "rowId",
                "nom_bien",
                "categorie",
                "pbr",
                "jvm",
                "devise"
            ],
            columnMapping: {
                account: "categorie",
                amount: "pbr",
                currency: "devise",
                description: "nom_bien",
                label: "categorie"
            },
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
            workbookName: "Téléverser le tableau des biens à transférer"
        },
        description: "Téléverser le tableau des biens à transférer : nom, catégorie, PBR et JVM par bien.",
        id: "roulement-source-biens",
        label: "Biens transférés",
        position: {
            x: -220,
            y: 80
        }
    },
    {
        catalogId: "source:manual-entry",
        config: {
            contrepartie_autre: 0,
            documentCurrency: "USD",
            jvm_total: 500000,
            montant_elu: 350000,
            outputs: "roulement_params, input_metadata",
            reportingCurrency: "CAD",
            sourceKind: "fapi_inputs",
            sourceLocator: "manual-source://roulement-params",
            sourceStatus: "draft",
            sourceVersion: 1,
            taux_inclusion: 0.5,
            toolId: "source.fapi_inputs"
        },
        description: "Paramètres du roulement : JVM totale, montant élu, contrepartie autre (billets/argent), taux d'inclusion.",
        id: "roulement-source-params",
        label: "Paramètres 85",
        position: {
            x: -220,
            y: 360
        }
    },
    {
        catalogId: "source:currency-rate",
        config: {
            documentCurrency: "USD",
            fapiYear: 2025,
            overrideRate: 1.35,
            overrideReason: "Taux de change provisoire fourni par le gestionnaire.",
            outputs: "exchange_rate, rate_metadata",
            rateProvider: "bank_of_canada",
            rateType: "annual_average",
            reportingCurrency: "CAD",
            sourceKind: "currency_rate",
            sourceLocator: "bank-of-canada://annual-average/USD-CAD/2025",
            sourceStatus: "draft",
            sourceVersion: 1,
            toolId: "source.currency_rate"
        },
        description: "Taux de change moyen annuel USD→CAD (Banque du Canada) pour la conversion en monnaie de rapport.",
        id: "roulement-source-fx",
        label: "Taux de change",
        position: {
            x: -220,
            y: 640
        }
    },
    // ── Logic ─────────────────────────────────────────────────────────────────
    {
        catalogId: "logic:classification-mapping",
        config: {
            conflictStrategy: "highest_confidence",
            inputs: "data_rows, keyword_rules",
            keywordRules: ROULEMENT_CLASSIFICATION_RULES,
            lowConfidenceThreshold: 0.75,
            matchFields: [
                "nom_bien",
                "categorie",
                "description"
            ],
            matchMode: "contains",
            outputs: "mapped_rows, unmatched_rows, low_confidence_rows, mapping_summary",
            toolId: "logic.keyword_mapper",
            unmatchedStrategy: "send_to_review"
        },
        description: "Classifie chaque bien par type (immobilisation amortissable, bien en capital, actions, inventaire, incorporel) en vue du calcul de l'élection.",
        id: "roulement-logic-classification",
        label: "Classification des biens",
        position: {
            x: 340,
            y: 80
        }
    },
    {
        catalogId: "logic:category-rollup-aggregator",
        config: {
            inputs: "mapped_rows, rollup_rules",
            operation: "sum",
            outputs: "category_totals, rollup_totals, named_values, rollup_summary",
            rollupRules: ROULEMENT_ROLLUP_RULES,
            toolId: "logic.category_rollup_aggregator"
        },
        description: "Agrège le PBR par catégorie de bien et produit le PBR total pour alimenter les calculs de l'élection.",
        id: "roulement-logic-rollup",
        label: "Agrégation PBR",
        position: {
            x: 800,
            y: 80
        }
    },
    {
        catalogId: "logic:calculation-engine",
        config: {
            formulas: ROULEMENT_ELECTION_CALC_RULES,
            inputs: "named_values, protected_inputs",
            mode: "auto",
            outputs: "calculated_results, formula_trace, calculation_summary, named_values",
            toolId: "logic.calculation_engine"
        },
        description: "Calcule les bornes min/max de l'élection art. 85, le produit d'aliénation, le gain en capital brut et imposable, et le coût des actions reçues.",
        id: "roulement-logic-election",
        label: "Calcul élection art. 85",
        position: {
            x: 1260,
            y: 80
        }
    },
    {
        catalogId: "logic:calculation-engine",
        config: {
            formulas: ROULEMENT_SUMMARY_CALC_RULES,
            inputs: "named_values",
            mode: "auto",
            outputs: "calculated_results, formula_trace, calculation_summary, named_values",
            toolId: "logic.calculation_engine"
        },
        description: "Consolide le gain différé total, l'impôt estimé reporté, et convertit les montants en CAD via le taux de change.",
        id: "roulement-logic-sommaire",
        label: "Sommaire du roulement",
        position: {
            x: 1720,
            y: 80
        }
    },
    // ── Field blocks ──────────────────────────────────────────────────────────
    {
        catalogId: "field:field-block",
        config: {
            toolId: "field.field_block"
        },
        description: "Affiche le PBR par catégorie de bien suite à l'agrégation.",
        id: "roulement-field-pbr",
        label: "PBR par catégorie",
        position: {
            x: 800,
            y: 480
        }
    },
    {
        catalogId: "field:field-block",
        config: {
            toolId: "field.field_block"
        },
        description: "Affiche les résultats de l'élection : bornes, montant élu, gain brut, gain imposable, coût des actions.",
        id: "roulement-field-election",
        label: "Résultats élection 85",
        position: {
            x: 1260,
            y: 480
        }
    },
    {
        catalogId: "field:field-block",
        config: {
            toolId: "field.field_block"
        },
        description: "Affiche le sommaire consolidé : gain différé, impôt estimé reporté, JVM et gain en CAD.",
        id: "roulement-field-sommaire",
        label: "Sommaire consolidé",
        position: {
            x: 1720,
            y: 480
        }
    },
    // ── Outputs ───────────────────────────────────────────────────────────────
    {
        catalogId: "output:evidence-pack",
        config: {
            inputs: "mapped_rows, review_findings, source_trace",
            outputs: "preview",
            toolId: "output.evidence_pack_preview"
        },
        description: "Données T2057 lisibles : biens classifiés, PBR agrégé, montant élu, gain calculé — prêt pour révision et dépôt.",
        id: "roulement-output-t2057",
        label: "Données T2057",
        position: {
            x: 2180,
            y: 80
        }
    },
    {
        catalogId: "output:canonical-json",
        config: {
            inputs: "mapped_rows, review_findings, source_trace",
            outputs: "canonical_json",
            toolId: "output.canonical_json"
        },
        description: "Remise structurée JSON : biens classifiés, PBR par catégorie, résultats de l'élection, sommaire et taux de change.",
        id: "roulement-output-json",
        label: "Remise JSON",
        position: {
            x: 2180,
            y: 380
        }
    }
];
const ROULEMENT_FISCAL_EDGE_SPECS = [
    // Sources → Logic
    {
        bindingLabel: "Tableau des biens à classifier",
        reason: "Le classificateur de mots-clés catégorise chaque bien par type (immobilisation, actions, inventaire…).",
        relationshipType: "provides_data_to",
        sourceBlockId: "roulement-source-biens",
        sourceOutputRole: "selected_rows",
        targetBlockId: "roulement-logic-classification",
        targetInputRole: "data_rows"
    },
    {
        bindingLabel: "Biens classifiés vers l'agrégation PBR",
        reason: "L'agrégateur regroupe les lignes classifiées pour produire le PBR total par catégorie.",
        relationshipType: "aggregates_into",
        sourceBlockId: "roulement-logic-classification",
        sourceOutputRole: "mapped_rows",
        targetBlockId: "roulement-logic-rollup",
        targetInputRole: "mapped_rows"
    },
    {
        bindingLabel: "PBR total pour le calcul de l'élection",
        reason: "Le moteur de calcul utilise le PBR total agrégé pour établir la borne minimale et le gain en capital.",
        relationshipType: "provides_data_to",
        sourceBlockId: "roulement-logic-rollup",
        sourceOutputRole: "named_values",
        targetBlockId: "roulement-logic-election",
        targetInputRole: "named_values"
    },
    {
        bindingLabel: "Paramètres de l'élection (JVM, montant élu, contrepartie)",
        reason: "Le calcul art. 85 requiert la JVM totale, le montant élu et la contrepartie autre de la saisie manuelle.",
        relationshipType: "provides_data_to",
        sourceBlockId: "roulement-source-params",
        sourceOutputRole: "roulement_params",
        targetBlockId: "roulement-logic-election",
        targetInputRole: "protected_inputs"
    },
    {
        bindingLabel: "Résultats de l'élection vers le sommaire",
        reason: "Le sommaire lit les résultats de l'élection (gain brut, coût des actions) pour calculer les montants consolidés.",
        relationshipType: "provides_data_to",
        sourceBlockId: "roulement-logic-election",
        sourceOutputRole: "calculated_results",
        targetBlockId: "roulement-logic-sommaire",
        targetInputRole: "named_values"
    },
    {
        bindingLabel: "Taux de change pour la conversion CAD",
        reason: "Le sommaire utilise le taux de la Banque du Canada pour convertir la JVM et le gain en dollars canadiens.",
        relationshipType: "provides_data_to",
        sourceBlockId: "roulement-source-fx",
        sourceOutputRole: "exchange_rate",
        targetBlockId: "roulement-logic-sommaire",
        targetInputRole: "named_values"
    },
    // Logic → Field blocks
    {
        bindingLabel: "PBR par catégorie de bien",
        reason: "Le champ PBR affiche la répartition du prix de base rajusté par type de bien.",
        relationshipType: "provides_data_to",
        sourceBlockId: "roulement-logic-rollup",
        sourceOutputRole: "rollup_totals",
        targetBlockId: "roulement-field-pbr",
        targetInputRole: "computed_values"
    },
    {
        bindingLabel: "Résultats du calcul de l'élection",
        reason: "Le champ Élection 85 affiche les bornes, le montant élu, le gain imposable et le coût des actions.",
        relationshipType: "provides_data_to",
        sourceBlockId: "roulement-logic-election",
        sourceOutputRole: "calculated_results",
        targetBlockId: "roulement-field-election",
        targetInputRole: "computed_values"
    },
    {
        bindingLabel: "Sommaire du roulement",
        reason: "Le champ Sommaire affiche le gain différé, l'impôt estimé reporté, JVM et gain en CAD.",
        relationshipType: "provides_data_to",
        sourceBlockId: "roulement-logic-sommaire",
        sourceOutputRole: "calculated_results",
        targetBlockId: "roulement-field-sommaire",
        targetInputRole: "computed_values"
    },
    // Logic → Outputs
    {
        bindingLabel: "Biens classifiés — preuve T2057",
        reason: "Les données T2057 incluent chaque bien classifié avec sa catégorie fiscale.",
        relationshipType: "included_in_output_preview",
        sourceBlockId: "roulement-logic-classification",
        sourceOutputRole: "mapped_rows",
        targetBlockId: "roulement-output-t2057",
        targetInputRole: "mapped_rows"
    },
    {
        bindingLabel: "Résumé de l'agrégation PBR",
        reason: "Les données T2057 incluent le PBR total par catégorie pour valider les montants élus.",
        relationshipType: "included_in_output_preview",
        sourceBlockId: "roulement-logic-rollup",
        sourceOutputRole: "rollup_summary",
        targetBlockId: "roulement-output-t2057",
        targetInputRole: "review_findings"
    },
    {
        bindingLabel: "Résultats de l'élection art. 85",
        reason: "Les données T2057 incluent les résultats calculés du roulement pour révision et dépôt.",
        relationshipType: "included_in_output_preview",
        sourceBlockId: "roulement-logic-sommaire",
        sourceOutputRole: "calculation_summary",
        targetBlockId: "roulement-output-t2057",
        targetInputRole: "review_findings"
    },
    {
        bindingLabel: "Biens classifiés — remise JSON",
        reason: "La remise JSON inclut les biens classifiés avec leur trace source.",
        relationshipType: "included_in_handoff",
        sourceBlockId: "roulement-logic-classification",
        sourceOutputRole: "mapped_rows",
        targetBlockId: "roulement-output-json",
        targetInputRole: "mapped_rows"
    },
    {
        bindingLabel: "Sommaire du roulement — remise JSON",
        reason: "La remise JSON inclut le sommaire consolidé : gain différé, impôt estimé, JVM CAD.",
        relationshipType: "included_in_handoff",
        sourceBlockId: "roulement-logic-sommaire",
        sourceOutputRole: "calculation_summary",
        targetBlockId: "roulement-output-json",
        targetInputRole: "review_findings"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/templates/sample-workflows/expense-reimbursement-template.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Employee Expense Reimbursement — a NON-fiscal demo workflow.
//
// Purpose: take an uploaded expense report, classify each receipt into a policy
// category, roll up per category, apply per-category caps/policy, and compute the
// net amount payable to the employee (with a CAD conversion column).
//
// Shows the builder handling a business-operations pipeline that is NOT tax:
// four source types (Excel · Manual policy · Currency rate · live API feed),
// keyword classification, rollup, a two-stage calculation, field displays, and
// two output deliverables. The real domain math lives in EXPENSE_CONFIG's
// computeExtra (see lib/workflow-runs/expense.ts) — the calc-engine blocks here
// give the canvas a faithful, runnable shape.
// ─────────────────────────────────────────────────────────────────────────────
// ── Classification rules — sort each receipt into a policy category ───────────
__turbopack_context__.s([
    "EXPENSE_CLASSIFICATION_RULES",
    ()=>EXPENSE_CLASSIFICATION_RULES,
    "EXPENSE_LINES_CALC_RULES",
    ()=>EXPENSE_LINES_CALC_RULES,
    "EXPENSE_ROLLUP_RULES",
    ()=>EXPENSE_ROLLUP_RULES,
    "EXPENSE_SUMMARY_CALC_RULES",
    ()=>EXPENSE_SUMMARY_CALC_RULES,
    "EXPENSE_TEMPLATE_BLOCK_SPECS",
    ()=>EXPENSE_TEMPLATE_BLOCK_SPECS,
    "EXPENSE_TEMPLATE_EDGE_SPECS",
    ()=>EXPENSE_TEMPLATE_EDGE_SPECS
]);
const EXPENSE_CLASSIFICATION_RULES = [
    {
        categoryId: "travel",
        categoryLabel: "Travel",
        confidence: 0.93,
        description: "Air, rail, taxi and ground transport to and from client sites.",
        keywords: [
            "flight",
            "airfare",
            "air travel",
            "airline",
            "taxi",
            "uber",
            "lyft",
            "train",
            "rail",
            "transport",
            "car rental",
            "parking",
            "toll"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-travel"
    },
    {
        categoryId: "lodging",
        categoryLabel: "Lodging",
        confidence: 0.92,
        description: "Hotels, motels and short-term accommodation.",
        keywords: [
            "hotel",
            "lodging",
            "accommodation",
            "motel",
            "airbnb",
            "resort",
            "nights"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-lodging"
    },
    {
        categoryId: "meals",
        categoryLabel: "Meals & entertainment",
        confidence: 0.9,
        description: "Business meals, restaurants and coffee meetings (per-diem capped).",
        keywords: [
            "meal",
            "restaurant",
            "dinner",
            "lunch",
            "breakfast",
            "coffee",
            "catering",
            "food"
        ],
        matchMode: "contains",
        priority: 9,
        ruleId: "rule-meals"
    },
    {
        categoryId: "supplies",
        categoryLabel: "Supplies & software",
        confidence: 0.88,
        description: "Equipment, hardware, stationery and software subscriptions.",
        keywords: [
            "supplies",
            "supply",
            "equipment",
            "hardware",
            "software",
            "subscription",
            "license",
            "stationery",
            "docking",
            "computer"
        ],
        matchMode: "contains",
        priority: 8,
        ruleId: "rule-supplies"
    },
    {
        categoryId: "mileage",
        categoryLabel: "Personal vehicle mileage",
        confidence: 0.9,
        description: "Personal-vehicle mileage reimbursed at the corporate rate.",
        keywords: [
            "mileage",
            "kilometre",
            "kilometer",
            "km",
            "personal vehicle",
            "car allowance",
            "odometer"
        ],
        matchMode: "contains",
        priority: 9,
        ruleId: "rule-mileage"
    },
    {
        categoryId: "nonReimbursable",
        categoryLabel: "Non-reimbursable (policy)",
        confidence: 0.86,
        description: "Alcohol, gifts, fines and personal items disallowed by policy.",
        keywords: [
            "alcohol",
            "wine",
            "beer",
            "liquor",
            "gift",
            "fine",
            "penalty",
            "personal",
            "entertainment"
        ],
        matchMode: "contains",
        priority: 7,
        ruleId: "rule-non-reimbursable"
    }
];
const EXPENSE_ROLLUP_RULES = [
    {
        description: "Total travel receipts.",
        includeCategoryIds: [
            "travel"
        ],
        label: "Travel total",
        operation: "sum",
        rollupId: "travel_total"
    },
    {
        description: "Total lodging receipts.",
        includeCategoryIds: [
            "lodging"
        ],
        label: "Lodging total",
        operation: "sum",
        rollupId: "lodging_total"
    },
    {
        description: "Total meal receipts (before per-diem cap).",
        includeCategoryIds: [
            "meals"
        ],
        label: "Meals total",
        operation: "sum",
        rollupId: "meals_total"
    },
    {
        description: "Total supplies & software receipts.",
        includeCategoryIds: [
            "supplies"
        ],
        label: "Supplies total",
        operation: "sum",
        rollupId: "supplies_total"
    },
    {
        description: "Total personal-vehicle mileage claimed.",
        includeCategoryIds: [
            "mileage"
        ],
        label: "Mileage total",
        operation: "sum",
        rollupId: "mileage_total"
    },
    {
        description: "Total non-reimbursable (policy-disallowed) items.",
        includeCategoryIds: [
            "nonReimbursable"
        ],
        label: "Non-reimbursable total",
        operation: "sum",
        rollupId: "nonreimbursable_total"
    },
    {
        description: "All submitted receipts across every category.",
        includeCategoryIds: [
            "travel",
            "lodging",
            "meals",
            "supplies",
            "mileage",
            "nonReimbursable"
        ],
        label: "Submitted grand total",
        operation: "sum",
        rollupId: "submitted_total"
    }
];
const EXPENSE_LINES_CALC_RULES = [
    {
        calculationId: "TRAVEL_REIMBURSABLE",
        description: "Travel = travel_total (100% policy)",
        label: "Travel (reimbursable)",
        operands: [
            "travel_total"
        ],
        operation: "pass_through",
        resultKey: "TRAVEL_REIMBURSABLE"
    },
    {
        calculationId: "LODGING_REIMBURSABLE",
        description: "Lodging = lodging_total (100% policy)",
        label: "Lodging (reimbursable)",
        operands: [
            "lodging_total"
        ],
        operation: "pass_through",
        resultKey: "LODGING_REIMBURSABLE"
    },
    {
        calculationId: "MEALS_REIMBURSABLE",
        description: "Meals = min(meals_total, per-diem cap)",
        label: "Meals (capped)",
        operands: [
            "meals_total",
            250
        ],
        operation: "min",
        resultKey: "MEALS_REIMBURSABLE"
    },
    {
        calculationId: "SUPPLIES_REIMBURSABLE",
        description: "Supplies = supplies_total (100% policy)",
        label: "Supplies (reimbursable)",
        operands: [
            "supplies_total"
        ],
        operation: "pass_through",
        resultKey: "SUPPLIES_REIMBURSABLE"
    },
    {
        calculationId: "MILEAGE_REIMBURSABLE",
        description: "Mileage = mileage_total (corporate rate)",
        label: "Mileage (reimbursable)",
        operands: [
            "mileage_total"
        ],
        operation: "pass_through",
        resultKey: "MILEAGE_REIMBURSABLE"
    },
    {
        calculationId: "MEALS_OVER_CAP",
        description: "Meals over cap = max(meals_total − per-diem cap, 0)",
        label: "Meals over cap (disallowed)",
        operands: [
            "meals_total",
            250
        ],
        operation: "max_subtract_zero",
        resultKey: "MEALS_OVER_CAP"
    }
];
const EXPENSE_SUMMARY_CALC_RULES = [
    {
        calculationId: "SUBMITTED_TOTAL",
        description: "Submitted total = every receipt across all categories",
        label: "Submitted total",
        operands: [
            "submitted_total"
        ],
        operation: "pass_through",
        resultKey: "SUBMITTED_TOTAL"
    },
    {
        calculationId: "TOTAL_REIMBURSABLE",
        description: "Total reimbursable = sum of the five reimbursable category lines",
        label: "Total reimbursable",
        operands: [
            "TRAVEL_REIMBURSABLE",
            "LODGING_REIMBURSABLE",
            "MEALS_REIMBURSABLE",
            "SUPPLIES_REIMBURSABLE",
            "MILEAGE_REIMBURSABLE"
        ],
        operation: "add",
        resultKey: "TOTAL_REIMBURSABLE"
    },
    {
        calculationId: "POLICY_DISALLOWED",
        description: "Disallowed = non-reimbursable items + meals over cap",
        label: "Policy-disallowed",
        operands: [
            "nonreimbursable_total",
            "MEALS_OVER_CAP"
        ],
        operation: "add",
        resultKey: "POLICY_DISALLOWED"
    },
    {
        calculationId: "NET_PAYABLE",
        description: "Net payable to employee = total reimbursable",
        label: "Net payable to employee",
        operands: [
            "TOTAL_REIMBURSABLE"
        ],
        operation: "pass_through",
        resultKey: "NET_PAYABLE"
    },
    {
        calculationId: "FX_RATE",
        description: "Annual-average USD→CAD rate (Bank of Canada)",
        label: "FX rate (USD → CAD)",
        operands: [
            "fxRate"
        ],
        operation: "pass_through",
        resultKey: "FX_RATE"
    },
    {
        calculationId: "NET_PAYABLE_CAD",
        description: "Net payable (CAD) = net payable × FX rate",
        label: "Net payable (CAD)",
        operands: [
            "NET_PAYABLE",
            "FX_RATE"
        ],
        operation: "multiply",
        resultKey: "NET_PAYABLE_CAD"
    }
];
const EXPENSE_TEMPLATE_BLOCK_SPECS = [
    // ── Sources ────────────────────────────────────────────────────────────────
    {
        catalogId: "source:excel-workbook",
        config: {
            columns: [
                "rowId",
                "account",
                "label",
                "description",
                "amount",
                "currency"
            ],
            columnMapping: {
                account: "account",
                amount: "amount",
                currency: "currency",
                description: "description",
                label: "label"
            },
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
            workbookName: "Upload the employee expense report"
        },
        description: "Upload the expense report — one row per receipt (merchant, description, amount, currency).",
        id: "expense-source-receipts",
        label: "Expense Report",
        position: {
            x: -220,
            y: 80
        }
    },
    {
        catalogId: "source:manual-entry",
        config: {
            documentCurrency: "USD",
            reportingCurrency: "CAD",
            // Policy parameters (shown in the inspector; the run/worksheet expose these
            // as editable inputs, injected into the reimbursement math at compute time).
            mealPerDiemCap: 250,
            reimbursementRate: 1,
            mileageRate: 0.68,
            outputs: "reimbursement_policy, input_metadata",
            sourceKind: "fapi_inputs",
            sourceLocator: "manual-source://reimbursement-policy",
            sourceStatus: "draft",
            sourceVersion: 1,
            toolId: "source.fapi_inputs"
        },
        description: "Reimbursement policy: meal per-diem cap, mileage rate, and the reimbursement rate for capped categories.",
        id: "expense-source-policy",
        label: "Reimbursement Policy",
        position: {
            x: -220,
            y: 360
        }
    },
    {
        catalogId: "source:currency-rate",
        config: {
            documentCurrency: "USD",
            fapiYear: 2025,
            overrideRate: 1.35,
            overrideReason: "Draft USD→CAD rate for expense conversion.",
            outputs: "exchange_rate, rate_metadata",
            rateProvider: "bank_of_canada",
            rateType: "annual_average",
            reportingCurrency: "CAD",
            sourceKind: "currency_rate",
            sourceLocator: "bank-of-canada://annual-average/USD-CAD/2025",
            sourceStatus: "draft",
            sourceVersion: 1,
            toolId: "source.currency_rate"
        },
        description: "Bank of Canada annual-average USD→CAD rate used to pay a USD expense report in Canadian dollars.",
        id: "expense-source-fx",
        label: "USD → CAD Rate",
        position: {
            x: -220,
            y: 640
        }
    },
    {
        catalogId: "source:api-http-request",
        config: {
            apiName: "Bank of Canada Valet",
            documentCurrency: "USD",
            endpoint: "https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json",
            inputs: "HTTP GET request",
            outputs: "apiReference, exchange_rate",
            rateProvider: "bank_of_canada",
            rateType: "annual_average",
            reportingCurrency: "CAD",
            seriesName: "FXUSDCAD",
            sourceKind: "api_reference",
            sourceLocator: "https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json?start_date=2025-01-01&end_date=2025-12-31",
            sourceStatus: "draft",
            sourceVersion: 1,
            toolId: "source.manual_value"
        },
        description: "Live Bank of Canada Valet API — the real origin of the USD→CAD conversion rate.",
        id: "expense-api-boc-fx",
        label: "Bank of Canada Valet API",
        position: {
            x: -520,
            y: 640
        }
    },
    // ── Logic ──────────────────────────────────────────────────────────────────
    {
        catalogId: "logic:classification-mapping",
        config: {
            conflictStrategy: "highest_confidence",
            inputs: "data_rows, keyword_rules",
            keywordRules: EXPENSE_CLASSIFICATION_RULES,
            lowConfidenceThreshold: 0.75,
            matchFields: [
                "label",
                "description",
                "account"
            ],
            matchMode: "contains",
            outputs: "mapped_rows, unmatched_rows, low_confidence_rows, mapping_summary",
            toolId: "logic.keyword_mapper",
            unmatchedStrategy: "send_to_review"
        },
        description: "Classifies each receipt into a policy category (travel, lodging, meals, supplies, mileage, non-reimbursable).",
        id: "expense-logic-classifier",
        label: "Expense Classifier",
        position: {
            x: 340,
            y: 80
        }
    },
    {
        catalogId: "logic:category-rollup-aggregator",
        config: {
            inputs: "mapped_rows, rollup_rules",
            operation: "sum",
            outputs: "category_totals, rollup_totals, named_values, rollup_summary",
            rollupRules: EXPENSE_ROLLUP_RULES,
            toolId: "logic.category_rollup_aggregator"
        },
        description: "Totals receipts per policy category and produces the submitted grand total.",
        id: "expense-logic-rollup",
        label: "Category Totals",
        position: {
            x: 800,
            y: 80
        }
    },
    {
        catalogId: "logic:calculation-engine",
        config: {
            formulas: EXPENSE_LINES_CALC_RULES,
            inputs: "named_values, protected_inputs",
            mode: "auto",
            outputs: "calculated_results, formula_trace, calculation_summary, named_values",
            toolId: "logic.calculation_engine"
        },
        description: "Applies the per-category policy: meal per-diem cap, and the reimbursable amount per category.",
        id: "expense-logic-lines",
        label: "Policy Engine",
        position: {
            x: 1260,
            y: 80
        }
    },
    {
        catalogId: "logic:calculation-engine",
        config: {
            formulas: EXPENSE_SUMMARY_CALC_RULES,
            inputs: "named_values",
            mode: "auto",
            outputs: "calculated_results, formula_trace, calculation_summary, named_values",
            toolId: "logic.calculation_engine"
        },
        description: "Sums the reimbursable lines into the net payable and converts it to CAD.",
        id: "expense-logic-summary",
        label: "Reimbursement Summary",
        position: {
            x: 1720,
            y: 80
        }
    },
    // ── Field blocks ───────────────────────────────────────────────────────────
    {
        catalogId: "field:field-block",
        config: {
            toolId: "field.field_block"
        },
        description: "Displays the total claimed per policy category.",
        id: "expense-field-categories",
        label: "Category Breakdown",
        position: {
            x: 800,
            y: 480
        }
    },
    {
        catalogId: "field:field-block",
        config: {
            toolId: "field.field_block"
        },
        description: "Displays the reimbursable amount per category after policy caps.",
        id: "expense-field-lines",
        label: "Reimbursable Lines",
        position: {
            x: 1260,
            y: 480
        }
    },
    {
        catalogId: "field:field-block",
        config: {
            toolId: "field.field_block"
        },
        description: "Displays the reimbursement summary: submitted, reimbursable, disallowed, net payable, CAD.",
        id: "expense-field-summary",
        label: "Reimbursement Summary",
        position: {
            x: 1720,
            y: 480
        }
    },
    // ── Outputs ────────────────────────────────────────────────────────────────
    {
        catalogId: "output:evidence-pack",
        config: {
            inputs: "mapped_rows, review_findings, source_trace",
            outputs: "preview",
            toolId: "output.evidence_pack_preview"
        },
        description: "Reviewable pack: each receipt with its category, the policy applied, and the net payable.",
        id: "expense-output-evidence",
        label: "Approval Pack",
        position: {
            x: 2180,
            y: 80
        }
    },
    {
        catalogId: "output:excel-export",
        config: {
            inputs: "mapped_rows, calculation_summary",
            outputs: "workbook",
            toolId: "output.excel_export"
        },
        description: "Excel export of the reimbursement schedule for payroll upload.",
        id: "expense-output-excel",
        label: "Payroll Export",
        position: {
            x: 2180,
            y: 380
        }
    }
];
const EXPENSE_TEMPLATE_EDGE_SPECS = [
    // Sources → Logic
    {
        bindingLabel: "Receipts to classify",
        reason: "The Expense Classifier sorts each uploaded receipt into a policy category.",
        relationshipType: "provides_data_to",
        sourceBlockId: "expense-source-receipts",
        sourceOutputRole: "selected_rows",
        targetBlockId: "expense-logic-classifier",
        targetInputRole: "data_rows"
    },
    {
        bindingLabel: "Classified receipts to total",
        reason: "Category Totals groups classified receipts into per-category buckets.",
        relationshipType: "aggregates_into",
        sourceBlockId: "expense-logic-classifier",
        sourceOutputRole: "mapped_rows",
        targetBlockId: "expense-logic-rollup",
        targetInputRole: "mapped_rows"
    },
    {
        bindingLabel: "Category totals for the policy engine",
        reason: "The Policy Engine reads the per-category totals to apply caps and rates.",
        relationshipType: "provides_data_to",
        sourceBlockId: "expense-logic-rollup",
        sourceOutputRole: "named_values",
        targetBlockId: "expense-logic-lines",
        targetInputRole: "named_values"
    },
    {
        bindingLabel: "Reimbursement policy parameters",
        reason: "The Policy Engine needs the meal per-diem cap and reimbursement rate from policy.",
        relationshipType: "provides_data_to",
        sourceBlockId: "expense-source-policy",
        sourceOutputRole: "reimbursement_policy",
        targetBlockId: "expense-logic-lines",
        targetInputRole: "protected_inputs"
    },
    {
        bindingLabel: "Reimbursable lines to summarize",
        reason: "The Reimbursement Summary totals the reimbursable category lines.",
        relationshipType: "provides_data_to",
        sourceBlockId: "expense-logic-lines",
        sourceOutputRole: "calculated_results",
        targetBlockId: "expense-logic-summary",
        targetInputRole: "named_values"
    },
    {
        bindingLabel: "Live FX observations feed the rate",
        reason: "The USD→CAD rate consumes the Bank of Canada Valet API annual-average observations.",
        relationshipType: "provides_data_to",
        sourceBlockId: "expense-api-boc-fx",
        sourceOutputRole: "apiReference",
        targetBlockId: "expense-source-fx",
        targetInputRole: "request"
    },
    {
        bindingLabel: "FX rate for CAD conversion",
        reason: "The Reimbursement Summary uses the USD→CAD rate to pay the report in Canadian dollars.",
        relationshipType: "provides_data_to",
        sourceBlockId: "expense-source-fx",
        sourceOutputRole: "exchange_rate",
        targetBlockId: "expense-logic-summary",
        targetInputRole: "named_values"
    },
    // Logic → Field blocks
    {
        bindingLabel: "Per-category breakdown",
        reason: "The Category Breakdown field shows the total claimed per policy category.",
        relationshipType: "provides_data_to",
        sourceBlockId: "expense-logic-rollup",
        sourceOutputRole: "rollup_totals",
        targetBlockId: "expense-field-categories",
        targetInputRole: "computed_values"
    },
    {
        bindingLabel: "Reimbursable lines",
        reason: "The Reimbursable Lines field shows the reimbursable amount per category after caps.",
        relationshipType: "provides_data_to",
        sourceBlockId: "expense-logic-lines",
        sourceOutputRole: "calculated_results",
        targetBlockId: "expense-field-lines",
        targetInputRole: "computed_values"
    },
    {
        bindingLabel: "Reimbursement summary",
        reason: "The Reimbursement Summary field shows net payable and the CAD conversion.",
        relationshipType: "provides_data_to",
        sourceBlockId: "expense-logic-summary",
        sourceOutputRole: "calculated_results",
        targetBlockId: "expense-field-summary",
        targetInputRole: "computed_values"
    },
    // Logic → Outputs
    {
        bindingLabel: "Classified receipts evidence",
        reason: "The Approval Pack lists each classified receipt with the policy applied.",
        relationshipType: "included_in_output_preview",
        sourceBlockId: "expense-logic-classifier",
        sourceOutputRole: "mapped_rows",
        targetBlockId: "expense-output-evidence",
        targetInputRole: "mapped_rows"
    },
    {
        bindingLabel: "Reimbursement summary evidence",
        reason: "The Approval Pack includes the computed reimbursement totals.",
        relationshipType: "included_in_output_preview",
        sourceBlockId: "expense-logic-summary",
        sourceOutputRole: "calculation_summary",
        targetBlockId: "expense-output-evidence",
        targetInputRole: "review_findings"
    },
    {
        bindingLabel: "Reimbursement schedule to Excel",
        reason: "The Payroll Export writes the reimbursement schedule to a workbook.",
        relationshipType: "included_in_handoff",
        sourceBlockId: "expense-logic-summary",
        sourceOutputRole: "calculation_summary",
        targetBlockId: "expense-output-excel",
        targetInputRole: "calculation_summary"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/templates/sample-workflows/campaign-budget-template.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
__turbopack_context__.s([
    "CAMPAIGN_CLASSIFICATION_RULES",
    ()=>CAMPAIGN_CLASSIFICATION_RULES,
    "CAMPAIGN_ELECTION_CALC_RULES",
    ()=>CAMPAIGN_ELECTION_CALC_RULES,
    "CAMPAIGN_ROLLUP_RULES",
    ()=>CAMPAIGN_ROLLUP_RULES,
    "CAMPAIGN_SUMMARY_CALC_RULES",
    ()=>CAMPAIGN_SUMMARY_CALC_RULES,
    "CAMPAIGN_TEMPLATE_BLOCK_SPECS",
    ()=>CAMPAIGN_TEMPLATE_BLOCK_SPECS,
    "CAMPAIGN_TEMPLATE_EDGE_SPECS",
    ()=>CAMPAIGN_TEMPLATE_EDGE_SPECS
]);
const CAMPAIGN_CLASSIFICATION_RULES = [
    {
        categoryId: "paidSearch",
        categoryLabel: "Paid search",
        confidence: 0.93,
        description: "Search engine marketing — PPC, brand and non-brand search ads.",
        keywords: [
            "paid search",
            "search ads",
            "google ads",
            "adwords",
            "sem",
            "ppc",
            "bing ads"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-paid-search"
    },
    {
        categoryId: "socialMedia",
        categoryLabel: "Paid social",
        confidence: 0.92,
        description: "Paid social media — Meta, LinkedIn, TikTok, performance ads.",
        keywords: [
            "paid social",
            "social media",
            "facebook",
            "instagram",
            "linkedin",
            "tiktok",
            "social ads"
        ],
        matchMode: "contains",
        priority: 10,
        ruleId: "rule-social"
    },
    {
        categoryId: "contentSeo",
        categoryLabel: "Content & SEO",
        confidence: 0.89,
        description: "Content marketing, editorial, blog and organic SEO programs.",
        keywords: [
            "content",
            "blog",
            "seo",
            "editorial",
            "copywriting",
            "organic"
        ],
        matchMode: "contains",
        priority: 9,
        ruleId: "rule-content"
    },
    {
        categoryId: "events",
        categoryLabel: "Events & sponsorship",
        confidence: 0.9,
        description: "Conferences, trade shows, booths, sponsorships and webinars.",
        keywords: [
            "event",
            "conference",
            "sponsorship",
            "booth",
            "trade show",
            "tradeshow",
            "webinar",
            "summit"
        ],
        matchMode: "contains",
        priority: 9,
        ruleId: "rule-events"
    },
    {
        categoryId: "influencer",
        categoryLabel: "Influencer & creator",
        confidence: 0.87,
        description: "Influencer partnerships, creator campaigns and UGC.",
        keywords: [
            "influencer",
            "creator",
            "ambassador",
            "ugc",
            "partnership"
        ],
        matchMode: "contains",
        priority: 8,
        ruleId: "rule-influencer"
    },
    {
        categoryId: "other",
        categoryLabel: "Other / contingency",
        confidence: 0.8,
        description: "Tooling, contingency and everything not otherwise classified.",
        keywords: [
            "contingency",
            "tooling",
            "tools",
            "misc",
            "other",
            "reserve"
        ],
        matchMode: "contains",
        priority: 5,
        ruleId: "rule-other"
    }
];
const CAMPAIGN_ROLLUP_RULES = [
    {
        description: "Total requested for paid search.",
        includeCategoryIds: [
            "paidSearch"
        ],
        label: "Paid search requested",
        operation: "sum",
        rollupId: "paidsearch_total"
    },
    {
        description: "Total requested for paid social.",
        includeCategoryIds: [
            "socialMedia"
        ],
        label: "Paid social requested",
        operation: "sum",
        rollupId: "social_total"
    },
    {
        description: "Total requested for content & SEO.",
        includeCategoryIds: [
            "contentSeo"
        ],
        label: "Content & SEO requested",
        operation: "sum",
        rollupId: "content_total"
    },
    {
        description: "Total requested for events & sponsorship.",
        includeCategoryIds: [
            "events"
        ],
        label: "Events requested",
        operation: "sum",
        rollupId: "events_total"
    },
    {
        description: "Total requested for influencer & creator.",
        includeCategoryIds: [
            "influencer"
        ],
        label: "Influencer requested",
        operation: "sum",
        rollupId: "influencer_total"
    },
    {
        description: "Total requested for other / contingency.",
        includeCategoryIds: [
            "other"
        ],
        label: "Other requested",
        operation: "sum",
        rollupId: "other_total"
    },
    {
        description: "Grand total requested across every channel.",
        includeCategoryIds: [
            "paidSearch",
            "socialMedia",
            "contentSeo",
            "events",
            "influencer",
            "other"
        ],
        label: "Total requested",
        operation: "sum",
        rollupId: "requested_total"
    }
];
const CAMPAIGN_ELECTION_CALC_RULES = [
    {
        calculationId: "REQUESTED_TOTAL",
        description: "Requested total = sum of every channel ask",
        label: "Total requested",
        operands: [
            "requested_total"
        ],
        operation: "pass_through",
        resultKey: "REQUESTED_TOTAL"
    },
    {
        calculationId: "BORNE_MIN",
        description: "Floor = already-committed spend",
        label: "Budget floor (committed)",
        operands: [
            "committed_spend"
        ],
        operation: "pass_through",
        resultKey: "BORNE_MIN"
    },
    {
        calculationId: "BORNE_MAX",
        description: "Ceiling = min(budget cap, requested total)",
        label: "Budget ceiling",
        operands: [
            "budget_cap",
            "requested_total"
        ],
        operation: "min",
        resultKey: "BORNE_MAX"
    },
    {
        calculationId: "MONTANT_ELU",
        description: "Approved budget (elected between the floor and ceiling)",
        label: "Approved budget",
        operands: [
            "montant_elu"
        ],
        operation: "pass_through",
        resultKey: "MONTANT_ELU"
    },
    {
        calculationId: "APPROVED_BUDGET",
        description: "Approved budget = elected amount",
        label: "Approved budget",
        operands: [
            "MONTANT_ELU"
        ],
        operation: "pass_through",
        resultKey: "APPROVED_BUDGET"
    }
];
const CAMPAIGN_SUMMARY_CALC_RULES = [
    {
        calculationId: "PROJECTED_REVENUE",
        description: "Projected revenue = approved budget × target ROAS",
        label: "Projected revenue",
        operands: [
            "APPROVED_BUDGET",
            "target_roas"
        ],
        operation: "multiply",
        resultKey: "PROJECTED_REVENUE"
    },
    {
        calculationId: "BUDGET_REMAINING",
        description: "Budget remaining = budget cap − approved budget",
        label: "Budget remaining",
        operands: [
            "budget_cap",
            "APPROVED_BUDGET"
        ],
        operation: "subtract",
        resultKey: "BUDGET_REMAINING"
    },
    {
        calculationId: "UNFUNDED_REQUESTS",
        description: "Unfunded requests = max(requested − approved, 0)",
        label: "Unfunded requests",
        operands: [
            "requested_total",
            "APPROVED_BUDGET"
        ],
        operation: "max_subtract_zero",
        resultKey: "UNFUNDED_REQUESTS"
    }
];
const CAMPAIGN_TEMPLATE_BLOCK_SPECS = [
    // ── Sources ────────────────────────────────────────────────────────────────
    {
        catalogId: "source:excel-workbook",
        config: {
            columns: [
                "rowId",
                "account",
                "label",
                "description",
                "amount",
                "currency"
            ],
            columnMapping: {
                account: "account",
                amount: "amount",
                currency: "currency",
                description: "description",
                label: "label"
            },
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
            workbookName: "Upload the channel spend requests"
        },
        description: "Upload the channel spend requests — one row per campaign line (channel, description, requested amount).",
        id: "campaign-source-requests",
        label: "Spend Requests",
        position: {
            x: -220,
            y: 80
        }
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
            toolId: "source.fapi_inputs"
        },
        description: "Budget parameters: the total budget cap, already-committed spend (floor), and the target return on ad spend.",
        id: "campaign-source-params",
        label: "Budget Parameters",
        position: {
            x: -220,
            y: 360
        }
    },
    // ── Logic ──────────────────────────────────────────────────────────────────
    {
        catalogId: "logic:classification-mapping",
        config: {
            conflictStrategy: "highest_confidence",
            inputs: "data_rows, keyword_rules",
            keywordRules: CAMPAIGN_CLASSIFICATION_RULES,
            lowConfidenceThreshold: 0.75,
            matchFields: [
                "label",
                "description",
                "account"
            ],
            matchMode: "contains",
            outputs: "mapped_rows, unmatched_rows, low_confidence_rows, mapping_summary",
            toolId: "logic.keyword_mapper",
            unmatchedStrategy: "send_to_review"
        },
        description: "Classifies each spend request into a marketing channel (paid search, paid social, content, events, influencer, other).",
        id: "campaign-logic-classifier",
        label: "Channel Classifier",
        position: {
            x: 340,
            y: 80
        }
    },
    {
        catalogId: "logic:category-rollup-aggregator",
        config: {
            inputs: "mapped_rows, rollup_rules",
            operation: "sum",
            outputs: "category_totals, rollup_totals, named_values, rollup_summary",
            rollupRules: CAMPAIGN_ROLLUP_RULES,
            toolId: "logic.category_rollup_aggregator"
        },
        description: "Totals the requested amount per channel and produces the grand requested total.",
        id: "campaign-logic-rollup",
        label: "Channel Totals",
        position: {
            x: 800,
            y: 80
        }
    },
    {
        catalogId: "logic:calculation-engine",
        config: {
            formulas: CAMPAIGN_ELECTION_CALC_RULES,
            inputs: "named_values, protected_inputs",
            mode: "auto",
            outputs: "calculated_results, formula_trace, calculation_summary, named_values",
            toolId: "logic.calculation_engine"
        },
        description: "Frames the election: the committed floor, the budget ceiling, and the elected approved budget.",
        id: "campaign-logic-election",
        label: "Budget Election",
        position: {
            x: 1260,
            y: 80
        }
    },
    {
        catalogId: "logic:calculation-engine",
        config: {
            formulas: CAMPAIGN_SUMMARY_CALC_RULES,
            inputs: "named_values",
            mode: "auto",
            outputs: "calculated_results, formula_trace, calculation_summary, named_values",
            toolId: "logic.calculation_engine"
        },
        description: "Projects revenue from the approved budget and reports unfunded requests and remaining budget.",
        id: "campaign-logic-summary",
        label: "Allocation Summary",
        position: {
            x: 1720,
            y: 80
        }
    },
    // ── Field blocks ───────────────────────────────────────────────────────────
    {
        catalogId: "field:field-block",
        config: {
            toolId: "field.field_block"
        },
        description: "Displays the requested amount per marketing channel.",
        id: "campaign-field-channels",
        label: "Channel Breakdown",
        position: {
            x: 800,
            y: 480
        }
    },
    {
        catalogId: "field:field-block",
        config: {
            toolId: "field.field_block"
        },
        description: "Displays the allocated budget per channel after the election.",
        id: "campaign-field-allocation",
        label: "Allocation by Channel",
        position: {
            x: 1260,
            y: 480
        }
    },
    {
        catalogId: "field:field-block",
        config: {
            toolId: "field.field_block"
        },
        description: "Displays the allocation summary: approved budget, projected revenue, unfunded, remaining.",
        id: "campaign-field-summary",
        label: "Projection Summary",
        position: {
            x: 1720,
            y: 480
        }
    },
    // ── Outputs ────────────────────────────────────────────────────────────────
    {
        catalogId: "output:pdf-report",
        config: {
            inputs: "mapped_rows, review_findings, source_trace",
            outputs: "report",
            toolId: "output.pdf_report"
        },
        description: "One-page budget approval memo: channels, elected budget, allocation, and projected return.",
        id: "campaign-output-memo",
        label: "Approval Memo",
        position: {
            x: 2180,
            y: 80
        }
    },
    {
        catalogId: "output:canonical-json",
        config: {
            inputs: "mapped_rows, review_findings, source_trace",
            outputs: "canonical_json",
            toolId: "output.canonical_json"
        },
        description: "Structured JSON of the allocation for the finance / planning system.",
        id: "campaign-output-json",
        label: "Allocation JSON",
        position: {
            x: 2180,
            y: 380
        }
    }
];
const CAMPAIGN_TEMPLATE_EDGE_SPECS = [
    // Sources → Logic
    {
        bindingLabel: "Requests to classify",
        reason: "The Channel Classifier sorts each spend request into a marketing channel.",
        relationshipType: "provides_data_to",
        sourceBlockId: "campaign-source-requests",
        sourceOutputRole: "selected_rows",
        targetBlockId: "campaign-logic-classifier",
        targetInputRole: "data_rows"
    },
    {
        bindingLabel: "Classified requests to total",
        reason: "Channel Totals groups classified requests into per-channel buckets.",
        relationshipType: "aggregates_into",
        sourceBlockId: "campaign-logic-classifier",
        sourceOutputRole: "mapped_rows",
        targetBlockId: "campaign-logic-rollup",
        targetInputRole: "mapped_rows"
    },
    {
        bindingLabel: "Channel totals for the election",
        reason: "The Budget Election reads the requested total to set the ceiling.",
        relationshipType: "provides_data_to",
        sourceBlockId: "campaign-logic-rollup",
        sourceOutputRole: "named_values",
        targetBlockId: "campaign-logic-election",
        targetInputRole: "named_values"
    },
    {
        bindingLabel: "Budget parameters for the election",
        reason: "The Budget Election needs the budget cap, committed floor, and target ROAS.",
        relationshipType: "provides_data_to",
        sourceBlockId: "campaign-source-params",
        sourceOutputRole: "budget_params",
        targetBlockId: "campaign-logic-election",
        targetInputRole: "protected_inputs"
    },
    {
        bindingLabel: "Election result to the projection",
        reason: "The Allocation Summary projects revenue from the elected approved budget.",
        relationshipType: "provides_data_to",
        sourceBlockId: "campaign-logic-election",
        sourceOutputRole: "calculated_results",
        targetBlockId: "campaign-logic-summary",
        targetInputRole: "named_values"
    },
    // Logic → Field blocks
    {
        bindingLabel: "Per-channel breakdown",
        reason: "The Channel Breakdown field shows the requested amount per channel.",
        relationshipType: "provides_data_to",
        sourceBlockId: "campaign-logic-rollup",
        sourceOutputRole: "rollup_totals",
        targetBlockId: "campaign-field-channels",
        targetInputRole: "computed_values"
    },
    {
        bindingLabel: "Allocation by channel",
        reason: "The Allocation field shows the elected budget spread across channels.",
        relationshipType: "provides_data_to",
        sourceBlockId: "campaign-logic-election",
        sourceOutputRole: "calculated_results",
        targetBlockId: "campaign-field-allocation",
        targetInputRole: "computed_values"
    },
    {
        bindingLabel: "Projection summary",
        reason: "The Projection Summary field shows approved budget, projected revenue, and remaining.",
        relationshipType: "provides_data_to",
        sourceBlockId: "campaign-logic-summary",
        sourceOutputRole: "calculated_results",
        targetBlockId: "campaign-field-summary",
        targetInputRole: "computed_values"
    },
    // Logic → Outputs
    {
        bindingLabel: "Classified requests — approval memo",
        reason: "The Approval Memo lists each classified request with its channel.",
        relationshipType: "included_in_output_preview",
        sourceBlockId: "campaign-logic-classifier",
        sourceOutputRole: "mapped_rows",
        targetBlockId: "campaign-output-memo",
        targetInputRole: "mapped_rows"
    },
    {
        bindingLabel: "Allocation summary — approval memo",
        reason: "The Approval Memo includes the elected budget and projected return.",
        relationshipType: "included_in_output_preview",
        sourceBlockId: "campaign-logic-summary",
        sourceOutputRole: "calculation_summary",
        targetBlockId: "campaign-output-memo",
        targetInputRole: "review_findings"
    },
    {
        bindingLabel: "Allocation — JSON handoff",
        reason: "The Allocation JSON includes the per-channel allocation and projection.",
        relationshipType: "included_in_handoff",
        sourceBlockId: "campaign-logic-summary",
        sourceOutputRole: "calculation_summary",
        targetBlockId: "campaign-output-json",
        targetInputRole: "review_findings"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/workflow-engine/templates/portfolio/portfolio-workflows.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
__turbopack_context__.s([
    "PORTFOLIO_WORKFLOWS",
    ()=>PORTFOLIO_WORKFLOWS,
    "getPortfolioWorkflowDef",
    ()=>getPortfolioWorkflowDef
]);
// Compact constructors so the graphs below stay readable.
const b = (catalogId, id, label, description, stage, row = 0, config)=>({
        catalogId,
        id,
        label,
        description,
        stage,
        row,
        config
    });
const e = (from, to, label, reason, rel = "provides_data_to", fromRole, toRole)=>({
        from,
        to,
        label,
        reason,
        rel,
        fromRole,
        toRole
    });
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
const OWNERSHIP_GRAPH = {
    id: "pf-ownership-graph",
    name: "Foreign Affiliate Ownership & Entity Graph",
    group: "foundation",
    sub: "Foundation · shared entity graph for T1134 / FAPI / surplus / CbCR / Pillar Two",
    description: "Foundation workflow: import the legal-entity structure, normalize identifiers, compute direct/indirect ownership and participating percentages, determine FA/CFA status, detect ownership changes, confirm control judgment calls, and publish an approved entity graph for every international workflow.",
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
        b("output:canonical-json", "out-publish", "Publish approved entity graph", "Write the approved entity graph back to the shared graph for downstream workflows", 6, 1)
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
        e("lg-status", "out-publish", "Approved graph", "Publish the approved entity graph", TO_HANDOFF)
    ]
};
// ─────────────────────────────────────────────────────────────────────────────
// 2.2 T1134 Foreign Affiliate Reporting (Tier 1)
// ─────────────────────────────────────────────────────────────────────────────
const T1134 = {
    id: "pf-t1134",
    name: "T1134 Foreign Affiliate Reporting",
    group: "tier1",
    sub: "Tier 1 · foreign-affiliate information reporting & review",
    description: "Flagship annual information-reporting workflow: determine filing entities from the approved ownership graph, roll forward affiliate records, collect and reconcile affiliate financial data, populate the summary and supplements, run cross-affiliate validations, surface only exceptions, and write approved facts back to the entity graph.",
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
        b("output:canonical-json", "out-writeback", "Write back affiliate facts", "Write approved affiliate facts to the entity graph & tax data layer", 7, 2)
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
        e("lg-validate", "out-writeback", "Approved facts", "Write approved affiliate facts back", TO_HANDOFF)
    ]
};
// ─────────────────────────────────────────────────────────────────────────────
// 2.3 FAPI Calculation (Tier 1) — manager-level portfolio blueprint
// ─────────────────────────────────────────────────────────────────────────────
const FAPI = {
    id: "pf-fapi",
    name: "FAPI Calculation (portfolio)",
    group: "tier1",
    sub: "Tier 1 · deterministic international tax calculation (manager workflow)",
    description: "Manager-level FAPI blueprint: scope CFAs from the ownership graph, import affiliate trial balances, map accounts to FAPI concepts, classify income types, analyze related-party transactions, capture professional decisions, compute gross/net FAPI and FAT, apply participating percentages, reconcile to T1134/surplus/T2, and feed the T2 Schedule 1 adjustment.",
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
        b("output:canonical-json", "out-t2feed", "T2 adjustment feed", "T2 Schedule 1 adjustment feed (write-back)", 8, 2)
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
        e("lg-reconcile", "out-t2feed", "T2 adjustment", "Feed the T2 Schedule 1 adjustment", TO_HANDOFF)
    ]
};
// ─────────────────────────────────────────────────────────────────────────────
// 2.4 Foreign Affiliate Surplus (Tier 1)
// ─────────────────────────────────────────────────────────────────────────────
const SURPLUS = {
    id: "pf-surplus",
    name: "Foreign Affiliate Surplus",
    group: "tier1",
    sub: "Tier 1 · persistent longitudinal surplus ledger",
    description: "Persistent surplus ledger: establish opening surplus balances by affiliate, validate prior-year continuity, characterize current-year earnings, process dividends and underlying foreign tax with ordering, process reorganizations, reconcile to FAPI/FS/T1134, and publish approved closing balances plus dividend-capacity planning.",
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
        b("output:canonical-json", "out-publish", "Publish closing balances", "Publish approved closing balances to the persistent surplus ledger", 8, 1)
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
        e("lg-reconcile", "out-publish", "Approved balances", "Publish approved closing balances", TO_HANDOFF)
    ]
};
// ─────────────────────────────────────────────────────────────────────────────
// 2.5 T106 Related-Party Transaction Reporting (Tier 1)
// ─────────────────────────────────────────────────────────────────────────────
const T106 = {
    id: "pf-t106",
    name: "T106 Related-Party Transaction Reporting",
    group: "tier1",
    sub: "Tier 1 · related-party transaction reporting & reconciliation",
    description: "Repeatable reconciliation workflow: extract intercompany transactions from ledgers, match counterparties to the entity graph, classify into T106 categories with AI-assisted residual mapping, reconcile to FS / intercompany / transfer-pricing schedules, apply materiality, compare to prior year, and store approved counterparty mappings for reuse.",
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
        b("output:canonical-json", "out-mapping", "Counterparty mapping register", "Store approved counterparty mappings for reuse across clients & years", 8, 1)
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
        e("lg-normalize", "out-mapping", "Counterparty mappings", "Store approved counterparty mappings", TO_HANDOFF)
    ]
};
// ─────────────────────────────────────────────────────────────────────────────
// 2.6 EIFEL (Tier 1)
// ─────────────────────────────────────────────────────────────────────────────
const EIFEL = {
    id: "pf-eifel",
    name: "EIFEL",
    group: "tier1",
    sub: "Tier 1 · group-wide interest limitation & allocation",
    description: "Group-wide interest-limitation workflow: scope eligible group entities, extract financing expenses/revenues, apply inclusions/exclusions/ordering, compute adjusted taxable income and fixed-ratio capacity, calculate denied and restricted interest, evaluate carryforwards and elections, model group-ratio/allocation scenarios, reconcile across entities, and produce Schedule 130 inputs.",
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
        b("output:canonical-json", "out-sch130", "Schedule 130 data package", "Schedule 130 inputs & election support (write-back)", 8, 2)
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
        e("lg-reconcile", "out-sch130", "Schedule 130 inputs", "Produce the Schedule 130 data package", TO_HANDOFF)
    ]
};
// ─────────────────────────────────────────────────────────────────────────────
// 2.7 T2 Corporate Income Tax Compliance Suite (Tier 1)
// ─────────────────────────────────────────────────────────────────────────────
const T2_SUITE = {
    id: "pf-t2-suite",
    name: "T2 Corporate Income Tax Compliance Suite",
    group: "tier1",
    sub: "Tier 1 · core corporate tax compliance operating system",
    description: "The broadest recurring corporate-tax workflow: normalize the trial balance, prepare Schedule 1 book-to-tax adjustments and Schedule 8 CCA, roll forward losses/dividends/credits and provincial allocation, integrate international outputs, compute federal/provincial tax and instalments, assemble the return with diagnostics, and reconcile the notice of assessment.",
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
        b("output:canonical-json", "out-noa", "Assessment reconciliation", "Reconcile the notice of assessment & update persistent tax attributes (write-back)", 8, 2)
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
        e("lg-assemble", "out-noa", "Assessment", "Reconcile the NOA & update attributes", TO_HANDOFF)
    ]
};
// ─────────────────────────────────────────────────────────────────────────────
// 2.8 Corporate Tax Provision (Tier 1)
// ─────────────────────────────────────────────────────────────────────────────
const TAX_PROVISION = {
    id: "pf-tax-provision",
    name: "Corporate Tax Provision",
    group: "tier1",
    sub: "Tier 1 · quarterly & annual current tax execution",
    description: "Quarterly/annual provision workflow: import forecast or year-end data, roll forward differences and attributes, compute current tax by jurisdiction, integrate complex adjustments, compute deferred tax and rate effects, build the ETR reconciliation and journal entries, compare to comparatives, and produce provision workpapers with a sign-off package.",
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
        b("output:evidence-pack", "out-review", "Variance & manager review report", "Variance & manager review report", 7, 5)
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
        e("lg-variance", "out-review", "Variances", "Produce the variance & manager review report", TO_PREVIEW)
    ]
};
// ─────────────────────────────────────────────────────────────────────────────
// 2.9 Tax Attribute & Continuity Ledgers (Foundation)
// ─────────────────────────────────────────────────────────────────────────────
const ATTRIBUTE_LEDGERS = {
    id: "pf-attribute-ledgers",
    name: "Tax Attribute & Continuity Ledgers",
    group: "foundation",
    sub: "Foundation · persistent reusable tax data layer",
    description: "Shared longitudinal ledger: create opening balances from prior returns and assessments, normalize each attribute by entity/jurisdiction/year/class/expiry, post approved movements, apply utilization and expiry rules, reconcile to returns and financial reporting, flag discontinuities, and lock approved year-end balances with evidence.",
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
        b("output:canonical-json", "out-ledger", "Locked ledger balances", "Lock approved balances to the shared tax ledger (write-back)", 8, 1)
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
        e("lg-reconcile", "out-ledger", "Locked balances", "Lock balances to the shared ledger", TO_HANDOFF)
    ]
};
// ─────────────────────────────────────────────────────────────────────────────
// 2.10 Part XIII Withholding Tax (Tier 1)
// ─────────────────────────────────────────────────────────────────────────────
const PART_XIII = {
    id: "pf-part-xiii",
    name: "Part XIII Withholding Tax",
    group: "tier1",
    sub: "Tier 1 · recurring cross-border payment compliance",
    description: "High-volume withholding workflow: extract payments to non-residents, match recipients to the counterparty master, classify payments and determine treaty rates, validate residence and beneficial ownership, calculate withholding and remittances, reconcile to source payments, prepare NR4 slips, and flag documentation and remittance exposure.",
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
        b("output:evidence-pack", "out-review", "Manager review package", "Manager review package", 7, 5)
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
        e("lg-reconcile", "out-review", "Reconciliation", "Produce the manager review package", TO_PREVIEW)
    ]
};
// ─────────────────────────────────────────────────────────────────────────────
// 2.11 Portfolio Tax Calendar, Client Requests & Review (Foundation)
// ─────────────────────────────────────────────────────────────────────────────
const PORTFOLIO_OPS = {
    id: "pf-portfolio-ops",
    name: "Portfolio Tax Calendar, Client Requests & Review",
    group: "foundation",
    sub: "Foundation · portfolio-wide execution & exception management",
    description: "The operational layer: determine obligations and deadlines across every entity, create and assign workflow instances, generate tailored information requests, route client responses, monitor progress and review status, apply materiality/risk scoring, and preserve a complete audit trail feeding reusable facts forward.",
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
        b("output:canonical-json", "out-audit", "Workflow audit trail", "Complete audit trail & reusable facts (write-back)", 8, 1)
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
        e("lg-monitor", "out-audit", "Audit trail", "Preserve the audit trail & reusable facts", TO_HANDOFF)
    ]
};
// ═════════════════════════════════════════════════════════════════════════════
// Platform Services Addendum — shared services reused by every workflow.
// ═════════════════════════════════════════════════════════════════════════════
// Universal Execution Sequence (§1 reference execution pattern / addendum 8 phases)
const PLATFORM_SEQUENCE = {
    id: "pf-platform-sequence",
    name: "Platform Services · Universal Execution Sequence",
    group: "platform",
    sub: "Platform · the reference execution pattern every workflow runs through",
    description: "The shared execution spine every standardized workflow follows: Scope → Tax Position Summary → Data Readiness → AI + Human Planning → Deterministic Execution → Review → Deliverables → Persist Knowledge. Each phase is a reusable platform service, not a workflow-specific feature.",
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
        b("output:canonical-json", "out-persist", "Persist Knowledge", "Write approved outputs back to shared tax ledgers & downstream workflows", 6, 0)
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
        e("lg-review", "out-persist", "Approved outputs", "Persist knowledge to shared ledgers", TO_HANDOFF)
    ]
};
// Scope Service (addendum §1)
const SCOPE_SERVICE = {
    id: "pf-scope-service",
    name: "Platform Services · Scope Service",
    group: "platform",
    sub: "Platform · dynamic scope selection → validated Scope object",
    description: "Every workflow starts by declaring the parameters it requires; the Scope Service dynamically resolves clients, taxation years, entities/jurisdictions/foreign affiliates and full- vs partial-group execution into a validated Scope object returned to the workflow.",
    blocks: [
        b("trigger:manual", "start", "Open scope", "Declare the parameters the workflow requires", 0, 0),
        b("source:database-query", "src-clients", "Clients", "Select one or many clients", 0, 1),
        b("source:manual-entry", "src-years", "Taxation years", "Select one or many taxation years", 0, 2),
        b("source:database-query", "src-entities", "Entities & foreign affiliates", "Entities, jurisdictions & foreign affiliates", 1, 1),
        b("source:manual-entry", "src-params", "Workflow parameters", "Parameters the workflow declares — full-group or partial-group execution", 1, 2),
        b("logic:classification-mapping", "lg-resolve", "Resolve scope", "Resolve clients → affiliates → years into a scope set", 2, 0),
        b("logic:calculation-engine", "lg-validate", "Validate scope", "Validate the selection (full-group or partial-group execution)", 3, 0),
        b("field:field-block", "fld-scope", "Scope preview", "Preview of the resolved scope", 3, 1),
        b("output:canonical-json", "out-scope", "Validated Scope object", "Return a validated Scope object to the workflow", 4, 0)
    ],
    edges: [
        e("start", "src-clients", "Open scope", "Declare parameters", INITIATES),
        e("src-clients", "lg-resolve", "Clients", "Resolve scope"),
        e("src-years", "lg-resolve", "Taxation years", "Resolve scope"),
        e("src-entities", "lg-resolve", "Entities & affiliates", "Resolve scope"),
        e("lg-resolve", "lg-validate", "Resolved scope", "Validate scope"),
        e("src-params", "lg-validate", "Parameters", "Apply full/partial-group rules"),
        e("lg-validate", "fld-scope", "Validated scope", "Show the scope preview"),
        e("lg-validate", "out-scope", "Scope object", "Return the validated Scope object", TO_HANDOFF)
    ]
};
// Tax Position Summary Service (addendum §2)
const TAX_POSITION_SUMMARY = {
    id: "pf-tax-position-summary",
    name: "Platform Services · Tax Position Summary Service",
    group: "platform",
    sub: "Platform · manager-level briefing from prior-year evidence",
    description: "After scope selection, an agent prepares a manager-level briefing from prior-year returns, workpapers, memos, review notes and evidence — surfacing client facts, historical tax positions, continuing assumptions, outstanding risks, prior deliverables, and evidence cited back to source documents.",
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
        b("output:evidence-pack", "out-evidence", "Evidence index", "Evidence with citations back to source documents", 5, 1)
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
        e("lg-positions", "out-evidence", "Evidence", "Produce the evidence index", TO_HANDOFF)
    ]
};
// Data Readiness Service (addendum §3)
const DATA_READINESS = {
    id: "pf-data-readiness",
    name: "Platform Services · Data Readiness Service",
    group: "platform",
    sub: "Platform · engagement readiness score before execution",
    description: "Before execution, the platform determines whether the engagement is ready — trial balances received/missing, financial statements received, OCR requirements, FX rates loaded, missing transfer-pricing reports, outstanding client responses — and computes an overall readiness score.",
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
        b("output:csv-export", "out-requests", "Outstanding-information request", "Requests for the missing items", 4, 2)
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
        e("lg-check", "out-requests", "Missing items", "Produce the outstanding-information request", TO_PREVIEW)
    ]
};
const PORTFOLIO_WORKFLOWS = [
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
    PART_XIII
];
function getPortfolioWorkflowDef(id) {
    return PORTFOLIO_WORKFLOWS.find((w)=>w.id === id) ?? null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=shared_workflow-engine_templates_e42416ce._.js.map