

// ─────────────────────────────────────────────────────────────────────────────
// WorksheetCopilot — generic, headless per-worksheet instrumentation.
//
// Mount this inside ANY template-driven worksheet (pass its TemplateConfig + live
// rows/inputs) and the assistant can answer questions about it — values, formulas,
// operand breakdowns, provenance, and derivation traces — WITHOUT the sheet being
// pasted into context. Renders nothing.
//
//   • Publishes ONE ambient readable: the live computed snapshot (Layer 1).
//   • Registers a live `WorksheetIntel` in the shared registry so the assistant's
//     global explainWorksheetLine / whyWorksheetValue / searchWorksheet actions
//     (in use-assistant) can dispatch to it. Action NAMES stay unique + support
//     any number of worksheets open at once; the readable tells the model the id.
//
// Backed by createTemplateIntel → the SAME runTemplateCore the sheet renders, so
// the numbers the assistant reports always match the UI. Replaces the FAPI-only
// FapiWorksheetCopilot; works for FAPI, Roulement, and any future TemplateConfig
// with zero per-worksheet code. See audit/UI.md · audit/FEATURES.md.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useMemo } from 'react';
import { useSetAtom } from 'jotai';
import { useCopilotReadable } from '@copilotkit/react-core';
import type { TemplateConfig, SourceRow } from '@/shared/workflow-engine/runtime/workflow-runs';
import {
  createTemplateIntel,
  registerWorksheetIntelAtom,
  unregisterWorksheetIntelAtom,
} from '@/features/worksheets/intel';

export function WorksheetCopilot({ config, rows, inputs, overrides }: { config: TemplateConfig; rows: SourceRow[]; inputs: Record<string, number>; overrides?: Record<string, string> }) {
  const register = useSetAtom(registerWorksheetIntelAtom);
  const unregister = useSetAtom(unregisterWorksheetIntelAtom);

  // Rebuild (and recompute the run once) whenever the sheet's rows/inputs/overrides change.
  const intel = useMemo(
    () => createTemplateIntel(config, { rows, inputs, overrides, live: true }),
    [config, rows, inputs, overrides],
  );
  const snapshot = useMemo(() => intel.describe(), [intel]);

  useEffect(() => {
    register(intel);
    return () => unregister(intel.id);
  }, [intel, register, unregister]);

  useCopilotReadable({
    description:
      `The "${config.name}" worksheet the user is looking at, fully computed from the live engine (worksheet id "${config.id}"): every line (code, label, current value), the results summary (with a CAD column where the sheet converts), the FX rate, whether the source is an uploaded file or the sample, how many source rows were classified vs left unmatched, and the classification buckets. These ARE the on-screen numbers — answer questions about current values from this. For the exact formula, the operand values behind a line, or the source rows mapped into it, call explainWorksheetLine / whyWorksheetValue with worksheet="${config.id}".`,
    value: snapshot,
  });

  return null;
}
