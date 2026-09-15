import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import type { Plugin } from "vite";

/**
 * The upstream reporter forwards only ErrorEvent.error. Browser-generated
 * ResizeObserver notifications carry their message on the event and error=null,
 * which the reporter incorrectly turns into a blocking "unknown runtime error".
 * Adapt only that reporter, retaining its source maps and normal error overlay.
 * No window events, observers, or production error monitoring are suppressed.
 */
export function developmentRuntimeErrorOverlay(): Plugin {
  const plugin = runtimeErrorOverlay();
  const transform = plugin.transformIndexHtml;
  if (typeof transform !== "function") {
    throw new Error(
      "Runtime error overlay HTML hook changed; review the reporter adapter.",
    );
  }
  plugin.transformIndexHtml = async function (html, context) {
    const result = await transform.call(this, html, context);
    if (!Array.isArray(result)) {
      throw new Error(
        "Runtime error overlay script format changed; review the reporter adapter.",
      );
    }
    let adapted = false;
    const tags = result.map((tag) => {
      if (
        tag.tag !== "script" ||
        typeof tag.children !== "string" ||
        !tag.children.includes("sendError(evt.error);")
      )
        return tag;
      adapted = true;
      return {
        ...tag,
        children: tag.children.replace(
          "sendError(evt.error);",
          `
  // A transient browser layout notification has no associated exception.
  // An actual thrown Error with the same text must still be reported.
  if (evt.error == null && (
    evt.message === "ResizeObserver loop completed with undelivered notifications." ||
    evt.message === "ResizeObserver loop limit exceeded"
  )) return;
  sendError(evt.error instanceof Error ? evt.error : new Error(
    evt.message || "Window error event without exception details"
  ));`,
        ),
      };
    });
    if (!adapted)
      throw new Error(
        "Runtime error overlay listener changed; review the reporter adapter.",
      );
    return tags;
  };
  return plugin;
}
