

// Setup panel for the Manual Entry source — the scalar value a builder or reviewer
// types in by hand.
//
// Until this existed, Manual Entry fell through SourceSetupPanel's "no panel is
// registered for this subtype yet" fallback, so the one field that gives the block
// meaning was unreachable: `source.manual_value` reads `config.value`, and nothing
// in the builder ever wrote it. An unconfigured block still ran — the tool guesses a
// number from the block's label (1.35 for "fx", 0.5 for "rate", 2025 for "year",
// else 1) — which is a figure nobody entered flowing into a computed result. The
// "no value set" notice below makes that guess visible instead of silent.

import { useEffect, useState } from "react";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import type { WorkflowBlock } from "@/shared/workflow-engine/local-fiscal-workflow";

type ManualValueSourcePanelProps = {
  block: WorkflowBlock;
  config: Record<string, unknown>;
  disabled?: boolean;
  onConfigPatch: (patch: Record<string, unknown>) => void;
  sourceLocked: boolean;
  sourceVersion: number;
};

/** The keys `source.manual_value` reads, in the order it prefers them. */
const VALUE_KEYS = [
  "value",
  "manualValue",
  "scalarValue",
  "valuePreview",
] as const;

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function configuredValue(config: Record<string, unknown>) {
  for (const key of VALUE_KEYS) {
    const raw = config[key];
    const parsed = typeof raw === "string" ? Number(raw) : raw;
    if (typeof parsed === "number" && Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
}

function Field({
  children,
  hint,
  label,
}: {
  children: React.ReactNode;
  hint?: string;
  label: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-muted-foreground text-xs">{label}</Label>
      {children}
      {hint ? (
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function ManualValueSourcePanel({
  block,
  config,
  disabled,
  onConfigPatch,
  sourceLocked,
  sourceVersion,
}: ManualValueSourcePanelProps) {
  const readOnly = Boolean(disabled) || sourceLocked;
  const committed = configuredValue(config);
  // The value field keeps its own draft so a half-typed number ("-", "1.") isn't
  // normalized out from under the cursor; the config is patched on every valid edit.
  const [draft, setDraft] = useState(committed === null ? "" : String(committed));
  useEffect(() => {
    setDraft(committed === null ? "" : String(committed));
    // Re-sync only when the stored value itself changes (e.g. another surface edits
    // it), never on each keystroke — `draft` is deliberately not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [committed]);

  const commitValue = (next: string) => {
    setDraft(next);
    if (next.trim() === "") {
      onConfigPatch({ value: undefined });
      return;
    }
    const parsed = Number(next);
    if (Number.isFinite(parsed)) {
      onConfigPatch({ value: parsed });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-foreground text-sm">Manual Entry</h3>
        <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
          A value entered by hand and treated as source evidence. Set it while the
          block is a draft — once it is published or used in a run it freezes, and
          corrections belong downstream in Logic.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Value">
          <Input
            disabled={readOnly}
            inputMode="decimal"
            onChange={(event) => commitValue(event.target.value)}
            placeholder="e.g. 1.3978"
            value={draft}
          />
        </Field>
        <Field label="Unit / currency" hint="Optional — e.g. CAD, %, years.">
          <Input
            disabled={readOnly}
            onChange={(event) => onConfigPatch({ unit: event.target.value })}
            placeholder="none"
            value={stringValue(config.unit, stringValue(config.currency))}
          />
        </Field>
      </div>

      <Field
        hint="What the emitted value is called downstream. Defaults to the block label."
        label="Value label"
      >
        <Input
          disabled={readOnly}
          onChange={(event) => onConfigPatch({ valueLabel: event.target.value })}
          placeholder={block.label}
          value={stringValue(config.valueLabel)}
        />
      </Field>

      {committed === null ? (
        <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-amber-700 text-xs leading-relaxed dark:text-amber-400">
          No value set. The block still runs — it infers one from its label — so the
          result would rest on a figure nobody entered. Type the value above.
        </div>
      ) : null}

      <div className="rounded-md bg-muted/40 p-3 text-muted-foreground text-xs">
        <div>Source version: v{sourceVersion}</div>
        <div>Locator: {stringValue(config.sourceLocator, "not set")}</div>
        <div>Status: {sourceLocked ? "locked evidence" : "draft"}</div>
      </div>
    </div>
  );
}
