import type { ManualTableRow } from "./schema";

export const SAMPLE_MANUAL_TABLE_ROWS: ManualTableRow[] = [
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
];
