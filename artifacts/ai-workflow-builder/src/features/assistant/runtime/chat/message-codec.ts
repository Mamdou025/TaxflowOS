

// ─────────────────────────────────────────────────────────────────────────────
// Chat message codec — projects the live chat's messages to the serializable shape
// we persist, and reconstructs them on restore.
//
// CopilotKit 1.63 moved the message store onto the AG-UI agent: the messages
// exposed by `useCopilotChatInternal().messages` are plain AG-UI objects
// (`{ id, role, content, toolCalls?, toolCallId? }`) — NOT the old GraphQL
// `Message` class instances with `.isTextMessage()`. This codec speaks AG-UI in
// both directions. The persisted `ProjectedMessage` shape is unchanged, so the
// server contract (chat_messages.content) is untouched.
//
// On restore we hand the reconstructed AG-UI messages to
// `useCopilotChatInternal().setMessages`, which writes them straight onto the
// agent (it only runs the gql→AG-UI conversion when the input is gql instances).
// ─────────────────────────────────────────────────────────────────────────────

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

// Minimal view of an AG-UI message (see @ag-ui/core Message schemas).
export type AguiMessage = {
  id?: string;
  role: string; // "user" | "assistant" | "system" | "developer" | "tool"
  content?: unknown; // string, or (user) an array of content parts
  toolCalls?: Array<{
    id?: string;
    type?: string;
    function?: { name?: string; arguments?: string };
  }>;
  toolCallId?: string;
};

/** AG-UI content may be a plain string or (multimodal user turns) an array of parts. */
function extractText(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((p) => (typeof p === "string" ? p : (p as { text?: string })?.text ?? ""))
      .join("");
  }
  return "";
}

/** AG-UI role → the persisted role vocabulary (developer folds into system). */
function normRole(r: string): ChatMsgRole {
  if (r === "user") return "user";
  if (r === "tool") return "tool";
  if (r === "system" || r === "developer") return "system";
  return "assistant";
}

/** Persisted role → AG-UI role. */
function aguiRole(r: ChatMsgRole): string {
  return r; // user/assistant/system/tool are all valid AG-UI roles
}

function safeParseArgs(args: unknown): unknown {
  if (typeof args !== "string") return args ?? {};
  try {
    return JSON.parse(args);
  } catch {
    return args;
  }
}

/**
 * Project the live AG-UI message array into serializable rows. Empty text turns
 * are dropped; `seq` is re-numbered densely so stored order matches visible order.
 * An assistant turn may contribute BOTH a text row and one row per tool call.
 */
export function projectMessages(messages: AguiMessage[]): ProjectedMessage[] {
  const list = messages ?? [];

  // Tool RESULT messages carry only a toolCallId, not the tool name — recover the
  // name from the matching assistant tool call so restore can re-attach its render.
  const nameByCallId = new Map<string, string>();
  for (const m of list) {
    if (m?.role === "assistant" && Array.isArray(m.toolCalls)) {
      for (const tc of m.toolCalls) {
        if (tc?.id && tc.function?.name) nameByCallId.set(tc.id, tc.function.name);
      }
    }
  }

  const out: ProjectedMessage[] = [];
  let seq = 0;
  for (const m of list) {
    if (!m || !m.role) continue;
    const role = m.role;

    if (role === "user" || role === "assistant" || role === "system" || role === "developer") {
      const text = extractText(m.content);
      if (text.trim()) {
        out.push({ id: m.id ?? `m${seq}`, role: normRole(role), seq: seq++, content: { text } });
      }
      if (role === "assistant" && Array.isArray(m.toolCalls)) {
        for (const tc of m.toolCalls) {
          const name = tc?.function?.name;
          if (!name) continue;
          out.push({
            id: tc.id ?? `m${seq}`,
            role: "assistant",
            seq: seq++,
            content: { toolCall: { name, args: safeParseArgs(tc.function?.arguments), callId: tc.id } },
          });
        }
      }
    } else if (role === "tool") {
      out.push({
        id: m.id ?? `m${seq}`,
        role: "tool",
        seq: seq++,
        content: {
          toolCall: {
            name: (m.toolCallId && nameByCallId.get(m.toolCallId)) || "",
            result: extractText(m.content),
            callId: m.toolCallId,
          },
        },
      });
    }
  }
  return out;
}

/**
 * Rebuild AG-UI message objects from stored rows (ordered by seq), ready to hand to
 * `useCopilotChatInternal().setMessages`. Tool renders re-attach by the tool `name`
 * via the live action registry, as before.
 */
export function reconstructMessages(rows: ProjectedMessage[]): AguiMessage[] {
  const ordered = [...rows].sort((a, b) => a.seq - b.seq);
  const out: AguiMessage[] = [];
  for (const row of ordered) {
    const tc = row.content.toolCall;
    if (tc && tc.result !== undefined) {
      out.push({
        id: row.id,
        role: "tool",
        content: typeof tc.result === "string" ? tc.result : JSON.stringify(tc.result),
        toolCallId: tc.callId ?? row.id,
      });
    } else if (tc) {
      const callId = tc.callId ?? row.id;
      out.push({
        id: callId,
        role: "assistant",
        toolCalls: [
          {
            id: callId,
            type: "function",
            function: {
              name: tc.name,
              arguments: typeof tc.args === "string" ? tc.args : JSON.stringify(tc.args ?? {}),
            },
          },
        ],
      });
    } else if (row.content.text !== undefined) {
      out.push({ id: row.id, role: aguiRole(row.role), content: row.content.text });
    }
  }
  return out;
}

/** A stable signature of the message set — cheap change detection for autosave. */
export function messagesSignature(messages: AguiMessage[]): string {
  return (messages ?? [])
    .map((m) => {
      const textLen = extractText(m.content).length;
      const tcs = Array.isArray(m.toolCalls) ? m.toolCalls.length : 0;
      return `${m.role}:${m.id ?? ""}:${textLen}:${tcs}${m.role === "tool" ? ":r" : ""}`;
    })
    .join("|");
}
