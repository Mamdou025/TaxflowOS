

import { Button } from "@/shared/ui/button";

type SourceVersionNoticeProps = {
  disabled?: boolean;
  onCreateSourceVersion: () => void;
  sourceLocked: boolean;
  sourceRole?: "evidence" | "rulebook";
  sourceVersion: number;
};

export function SourceVersionNotice({
  disabled,
  onCreateSourceVersion,
  sourceLocked,
  sourceRole = "evidence",
  sourceVersion,
}: SourceVersionNoticeProps) {
  let title = "Draft source evidence";
  if (sourceRole === "rulebook") {
    title = "Draft rulebook source";
  } else if (sourceLocked) {
    title = "Immutable source evidence";
  }
  const unlockedCopy =
    sourceRole === "rulebook"
      ? "Draft Rule / Knowledge Sources stay editable while you prepare and test calculations. Publish or create a new version when you want to freeze a reference set."
      : "Draft Source setup can be edited until evidence is captured and used in a local run, locked, or published.";
  const lockedCopy =
    sourceRole === "rulebook"
      ? "Published rulebooks should be changed through a new draft version."
      : "Source evidence is immutable after use. Create a new version to change this reference data.";
  const buttonLabel =
    sourceRole === "rulebook"
      ? "Create new rulebook version"
      : "Create new source version";

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div className="font-medium text-sky-700 text-sm dark:text-sky-300">
          {title}
        </div>
        <span className="rounded-full border bg-background/60 px-2 py-0.5 text-[10px] uppercase">
          v{sourceVersion}
        </span>
      </div>
      <p className="text-muted-foreground text-xs">
        {sourceLocked ? lockedCopy : unlockedCopy}
      </p>
      {sourceLocked && (
        <Button
          disabled={disabled}
          onClick={onCreateSourceVersion}
          size="sm"
          type="button"
          variant="secondary"
        >
          {buttonLabel}
        </Button>
      )}
    </>
  );
}
