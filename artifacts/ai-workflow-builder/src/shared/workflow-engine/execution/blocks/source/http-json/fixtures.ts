import type { ManualTableRow } from "../manual-table/schema";

// Offline fallback so the block (and any workflow built on it) still runs when no
// live fetch has been pinned into config — e.g. in tests, or on a machine with no
// network. Deliberately generic label/amount/account rows: the block warns loudly
// that it fell back to the sample, so these only ever stand in for shape.
export const SAMPLE_HTTP_JSON_ROWS: ManualTableRow[] = [
  {
    account: "Centers for Medicare and Medicaid Services",
    amount: 24_500_000_000,
    currency: "USD",
    description: "MEDICARE ADMINISTRATIVE CONTRACTOR SERVICES — CLAIMS PROCESSING",
    label: "Claims processing services",
    rowId: "sample-award-1",
  },
  {
    account: "National Institutes of Health",
    amount: 3_180_000_000,
    currency: "USD",
    description: "CLINICAL RESEARCH SUPPORT AND LABORATORY SERVICES",
    label: "Clinical research support",
    rowId: "sample-award-2",
  },
  {
    account: "Office of Assistant Secretary for Preparedness and Response",
    amount: 1_420_000_000,
    currency: "USD",
    description: "VACCINE AND THERAPEUTIC STOCKPILE LOGISTICS AND STORAGE",
    label: "Stockpile logistics",
    rowId: "sample-award-3",
  },
  {
    account: "Centers for Disease Control and Prevention",
    amount: 612_000_000,
    currency: "USD",
    description: "IT MODERNIZATION — DATA PLATFORM AND CLOUD HOSTING SERVICES",
    label: "Data platform modernization",
    rowId: "sample-award-4",
  },
  {
    account: "Administration for Children and Families",
    amount: 388_500_000,
    currency: "USD",
    description: "PROFESSIONAL ADVISORY AND PROGRAM EVALUATION SERVICES",
    label: "Program evaluation services",
    rowId: "sample-award-5",
  },
  {
    account: "Food and Drug Administration",
    amount: 204_000_000,
    currency: "USD",
    description: "LABORATORY EQUIPMENT AND MEDICAL DEVICE TESTING SUPPLIES",
    label: "Laboratory equipment",
    rowId: "sample-award-6",
  },
  {
    account: "Centers for Medicare and Medicaid Services",
    amount: 156_700_000,
    currency: "USD",
    description: "FACILITIES MAINTENANCE, BUILDING OPERATIONS AND SECURITY",
    label: "Facilities operations",
    rowId: "sample-award-7",
  },
  {
    account: "National Institutes of Health",
    amount: 98_300_000,
    currency: "USD",
    description: "SOFTWARE LICENSES AND CLOUD COMPUTING SUBSCRIPTION SERVICES",
    label: "Software and cloud licences",
    rowId: "sample-award-8",
  },
];
