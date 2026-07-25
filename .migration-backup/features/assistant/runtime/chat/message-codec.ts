"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Chat message codec — projects CopilotKit's live GraphQL messages to the
// serializable shape we persist, and reconstructs them on restore.
//
// Why a projection and not the raw objects: a generative-UI assistant message
// carries a non-serializable `render` CLOSURE (structuredClone throws — see
// app/api/copilotkit/route.ts). We store only plain data — text + tool
// name/args/result — and on restore CopilotKit re-associates each tool call's
// render by matching its `name` against the live useCopilotAction registry.
// ─────────────────────────────────────────────────────────────────────────────

import {
  ActionExecutionMessage,
  type Message,
  ResultMessage,
  Role,
  TextMessage,
} from "@copilotkit/runtime-client-gql";

export type ChatMsgRole = "user" | "assistant" | "tool" | "system";

export type ProjectedMessage = {
  id: string;
  role: ChatMsgRole;
  seq: number;
  content: {
    text?: string;
    toolCall?: {
      name: string;
      args?: unknown;
      result?: unknown;
      callId?: string;
    };
  };
};

function roleToString(role: unknown): ChatMsgRole {
  const r = String(role).toLowerCase();
  if (r === "user") return "user";
  if (r === "system" || r === "developer") return "system";
  if (r === "tool") return "tool";
  return "assistant";
}

function stringToRole(role: ChatMsgRole) {
  switch (role) {
    case "user":
      return Role.User;
    case "system":
      return Role.System;
    default:
      // Restored tool/assistant text renders as an assistant turn.
      return Role.Assistant;
  }
}

/**
 * Project a CopilotKit message array into serializable rows. AgentState/Image
 * messages and empty text turns are dropped; `seq` is re-numbered densely so the
 * stored order matches the visible order.
 */
export function projectMessages(messages: Message[]): ProjectedMessage[] {
  const out: ProjectedMessage[] = [];
  let seq = 0;
  for (const m of messages) {
    if (m.isTextMessage()) {
      const text = m.content ?? "";
      if (!text.trim()) continue; // skip empty streamed placeholders
      out.push({
        id: m.id,
        role: roleToString(m.role),
        seq: seq++,
        content: { text },
      });
    } else if (m.isActionExecutionMessage()) {
      out.push({
        id: m.id,
        role: "assistant",
        seq: seq++,
        content: {
          toolCall: { name: m.name, args: m.arguments ?? {}, callId: m.id },
        },
      });
    } else if (m.isResultMessage()) {
      out.push({
        id: m.id,
        role: "tool",
        seq: seq++,
        content: {
          toolCall: {
            name: m.actionName,
            result: m.result,
            callId: m.actionExecutionId,
          },
        },
      });
    }
    // AgentStateMessage / ImageMessage are intentionally not persisted.
  }
  return out;
}

/**
 * Rebuild CopilotKit message instances from stored rows (ordered by seq). The
 * client feeds these to setMessages() to restore a conversation; renders are
 * re-attached by CopilotKit from the live action registry via the tool `name`.
 */
export function reconstructMessages(rows: ProjectedMessage[]): Message[] {
  const ordered = [...rows].sort((a, b) => a.seq - b.seq);
  const out: Message[] = [];
  for (const row of ordered) {
    const tc = row.content.toolCall;
    if (tc && tc.result !== undefined) {
      out.push(
        new ResultMessage({
          id: row.id,
          actionExecutionId: tc.callId ?? row.id,
          actionName: tc.name,
          result:
            typeof tc.result === "string"
              ? tc.result
              : ResultMessage.encodeResult(tc.result),
        })
      );
    } else if (tc) {
      out.push(
        new ActionExecutionMessage({
          id: tc.callId ?? row.id,
          name: tc.name,
          arguments: (tc.args ?? {}) as Record<string, unknown>,
        })
      );
    } else if (row.content.text !== undefined) {
      out.push(
        new TextMessage({
          id: row.id,
          role: stringToRole(row.role),
          content: row.content.text,
        })
      );
    }
  }
  return out;
}

/** A stable signature of the message set — cheap change detection for autosave. */
export function messagesSignature(messages: Message[]): string {
  return messages
    .map((m) => {
      if (m.isTextMessage()) return `t:${m.id}:${m.content?.length ?? 0}`;
      if (m.isActionExecutionMessage()) return `a:${m.id}`;
      if (m.isResultMessage()) return `r:${m.id}`;
      return `x:${m.id}`;
    })
    .join("|");
}
