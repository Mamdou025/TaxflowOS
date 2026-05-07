import type { ToolRunLog } from "./types";

function makeToolLog({
  details,
  level,
  message,
}: {
  level: ToolRunLog["level"];
  message: string;
  details?: Record<string, unknown>;
}): ToolRunLog {
  return {
    at: new Date().toISOString(),
    details,
    id: `tool-log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    level,
    message,
  };
}

export function info(
  message: string,
  details?: Record<string, unknown>
): ToolRunLog {
  return makeToolLog({ details, level: "info", message });
}

export function warning(
  message: string,
  details?: Record<string, unknown>
): ToolRunLog {
  return makeToolLog({ details, level: "warning", message });
}

export function error(
  message: string,
  details?: Record<string, unknown>
): ToolRunLog {
  return makeToolLog({ details, level: "error", message });
}
