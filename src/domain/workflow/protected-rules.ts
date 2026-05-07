import type { BlockSubtype } from "./block-types";

export type ProtectedKind =
  | "input"
  | "result"
  | "official-line"
  | "locked-rate"
  | "final-reviewed-amount"
  | "summary-result";

export function getProtectedKindForSubtype(
  subtype: BlockSubtype
): ProtectedKind {
  if (subtype === "Protected Input") {
    return "input";
  }
  if (subtype === "Official Line") {
    return "official-line";
  }
  if (subtype === "Locked Rate") {
    return "locked-rate";
  }
  if (subtype === "Final Reviewed Amount") {
    return "final-reviewed-amount";
  }
  return "result";
}
