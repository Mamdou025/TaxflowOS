import type { BlockFamily, BlockSubtype } from "./block-types";

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

/** Minimal structural shape needed to classify a block as a governed (protected)
 *  value — works on a domain `WorkflowBlock` or a canvas node's `block` without
 *  importing either (avoids a type cycle with `workflow-types`). */
type GovernedValueProbe = {
  family?: BlockFamily | string;
  governance?: { protected?: boolean } | null;
};

/**
 * The single detection predicate for governed-value ("Protected") blocks.
 *
 * `GovernanceMetadata.protected` is the canonical signal (kernel-migration-spec
 * §2.2 routes protected-ness onto governance metadata, not a block *family*). The
 * legacy `family === "Protected"` literal is retained as a compatibility fallback
 * until `getGovernanceMetadata` populates governance on every governed block and
 * the `"Protected"` family value is retired. Centralizes what were ~20 scattered
 * `family === "Protected"` checks onto one governance-primary seam.
 *
 * Behaviour today is identical to the old family check: no workflow block sets
 * `governance.protected`, so the predicate reduces to `family === "Protected"`.
 */
export function isGovernedValueBlock(
  block: GovernedValueProbe | null | undefined
): boolean {
  if (!block) {
    return false;
  }
  return block.governance?.protected === true || block.family === "Protected";
}
