import { WORKPAPER_SPECS } from '../portfolio-workpapers';

// New built-in workflows are an explicit product selection. Keep the executor's
// full registry intact so saved definitions can still run their original rules.
export const ACTIVE_WORKPAPER_IDS = [
  't1134',
  'surplus',
  't106',
  'eifel',
  't2-suite',
  'tax-provision',
  'part-xiii',
] as const;

const activeWorkpaperIds = new Set<string>(ACTIVE_WORKPAPER_IDS);

export const AVAILABLE_WORKPAPER_SPECS = WORKPAPER_SPECS.filter((spec) =>
  activeWorkpaperIds.has(spec.id),
);

// Recognition only: retired names must not resolve to an unrelated active
// workflow when the user mentions more than one procedure in the same request.
export const RETIRED_WORKPAPER_SPECS = WORKPAPER_SPECS.filter(
  (spec) => !activeWorkpaperIds.has(spec.id),
);
