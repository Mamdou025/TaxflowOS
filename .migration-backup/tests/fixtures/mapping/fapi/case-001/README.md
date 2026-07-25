# FAPI Case 001 Evaluation Baseline

## Purpose

This folder is the first reproducible evaluation case for the FAPI source-mapping agent. The **trial balances are primary source evidence**. The historical FAPI workpaper is benchmark and logic-support evidence only and must not be used as a substitute for missing primary source values.

## Affiliate scope

| Affiliate | Primary source | Expected handling |
| --- | --- | --- |
| FA_1 SAS | `fa-01_trial_balance.xlsx` | Map and classify source facts in EUR, preserving exact sheet and cell citations. |
| FA_2 Corp | `fa-02_trial_balance.xlsx` | Map and classify source facts; do not infer currency when it is not explicit. |
| FA_3 GmbH | No standalone source supplied | Include benchmark-only historical insights and flag missing primary support. Do not invent or borrow facts. |

## Baseline files

| File | Role |
| --- | --- |
| `expected_mapping.csv` | Machine-readable expected output with one atomic expectation per row. |
| `case_manifest.json` | Case scope, controlled values, scoring rules, and hard-fail conditions. |
| `correction_round_01.md` to `correction_round_03.md` | Reviewer-feedback lineage. Round 3 is the accepted baseline. |
| `reference_fapi_workpaper.xlsx` | Historical benchmark and treatment evidence only. |
| Trial-balance workbooks | Primary source evidence. |

## Normalization

Eval 3 reviewed **38 rows**. The machine baseline contains **44 atomic expectations** because grouped meals and amortization outputs were split into individual source facts. The baseline also represents missing legal-name confirmation rows and the FA_3 benchmark-only coverage requirement explicitly.

## Pass requirements

A future mapping run must identify the affiliate, source fact, treatment, target engine field when applicable, review requirement, and exact evidence citation. It must run post-mapping validation and must satisfy every hard-fail condition in `case_manifest.json`.

## Update policy

Do not overwrite accepted expectations silently. Changes should cite the reviewer feedback that supports them, update the manifest counts, and be committed as a new reviewed baseline version.
