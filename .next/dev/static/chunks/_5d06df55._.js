(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/builder-bridge.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "builderBridgeAtom",
    ()=>builderBridgeAtom,
    "builderEmbeddedAtom",
    ()=>builderEmbeddedAtom
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/vanilla.mjs [app-client] (ecmascript)");
;
const builderBridgeAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null);
const builderEmbeddedAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(false);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/monaco-theme.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Monaco editor theme configuration for Vercel-like dark mode
__turbopack_context__.s([
    "vercelDarkTheme",
    ()=>vercelDarkTheme
]);
const vercelDarkTheme = {
    base: "vs-dark",
    inherit: true,
    rules: [
        // Default foreground
        {
            token: "",
            foreground: "ededed"
        },
        // Comments
        {
            token: "comment",
            foreground: "a1a1a1",
            fontStyle: "italic"
        },
        // Keywords (pink)
        {
            token: "keyword",
            foreground: "ff4d8d"
        },
        {
            token: "keyword.operator",
            foreground: "ff4d8d"
        },
        // Strings (green)
        {
            token: "string",
            foreground: "00ca50"
        },
        {
            token: "string.escape",
            foreground: "00ca50"
        },
        // Numbers (white)
        {
            token: "number",
            foreground: "ffffff"
        },
        // Types (blue)
        {
            token: "type",
            foreground: "47a8ff"
        },
        {
            token: "type.identifier",
            foreground: "47a8ff"
        },
        // Identifiers and parameters (light gray - default)
        {
            token: "identifier",
            foreground: "ededed"
        },
        {
            token: "parameter",
            foreground: "ededed"
        },
        {
            token: "variable",
            foreground: "ededed"
        },
        {
            token: "variable.parameter",
            foreground: "ededed"
        },
        // Functions (purple)
        {
            token: "function",
            foreground: "c472fb"
        },
        {
            token: "identifier.function",
            foreground: "c472fb"
        },
        {
            token: "member.function",
            foreground: "c472fb"
        },
        // Built-in constants like true/false/null (blue)
        {
            token: "constant.language",
            foreground: "47a8ff"
        },
        {
            token: "keyword.json",
            foreground: "47a8ff"
        },
        // Built-in objects like console (light gray)
        {
            token: "variable.predefined",
            foreground: "ededed"
        },
        {
            token: "support.variable",
            foreground: "ededed"
        },
        {
            token: "support.constant",
            foreground: "ededed"
        },
        // Delimiters and punctuation (light gray)
        {
            token: "delimiter",
            foreground: "ededed"
        },
        {
            token: "delimiter.bracket",
            foreground: "ededed"
        },
        {
            token: "delimiter.parenthesis",
            foreground: "ededed"
        },
        {
            token: "delimiter.curly",
            foreground: "ededed"
        },
        {
            token: "delimiter.array",
            foreground: "ededed"
        },
        {
            token: "punctuation",
            foreground: "ededed"
        },
        // Operators (light gray)
        {
            token: "operator",
            foreground: "ededed"
        },
        // JSON-specific tokens
        {
            token: "string.key.json",
            foreground: "47a8ff"
        },
        {
            token: "string.value.json",
            foreground: "00ca50"
        },
        {
            token: "number.json",
            foreground: "ffffff"
        },
        {
            token: "keyword.json",
            foreground: "47a8ff"
        }
    ],
    colors: {
        "editor.background": "#000000",
        "editor.foreground": "#ededed",
        "editorLineNumber.foreground": "#444444",
        "editorLineNumber.activeForeground": "#888888",
        "editor.lineHighlightBackground": "#0A0A0A",
        "editor.selectionBackground": "#264F78",
        "editor.inactiveSelectionBackground": "#1A1A1A",
        "editorCursor.foreground": "#FFFFFF",
        "editorWhitespace.foreground": "#333333",
        "editorIndentGuide.background": "#1A1A1A",
        "editorIndentGuide.activeBackground": "#333333",
        "editorBracketMatch.background": "#0A0A0A",
        "editorBracketMatch.border": "#444444"
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/keyword-rulebook-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getRulebookEntries",
    ()=>getRulebookEntries,
    "removeFromRulebook",
    ()=>removeFromRulebook,
    "saveToRulebook",
    ()=>saveToRulebook
]);
const STORAGE_KEY = "workflow-keyword-rulebook-v1";
function parseStorage() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch  {
        return [];
    }
}
function writeStorage(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
function toStringArray(value) {
    if (Array.isArray(value)) return value.map(String).filter(Boolean);
    if (typeof value === "string") return value.split(/[,;\n|]/).map((s)=>s.trim()).filter(Boolean);
    return [];
}
function getRulebookEntries() {
    return parseStorage();
}
function saveToRulebook(rule) {
    const entries = parseStorage();
    const entry = {
        id: `rb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: String(rule.categoryLabel || rule.categoryId || "Unnamed Rule"),
        savedAt: new Date().toISOString(),
        categoryId: String(rule.categoryId || ""),
        categoryLabel: String(rule.categoryLabel || ""),
        confidence: Number(rule.confidence ?? 0.9),
        priority: Number(rule.priority ?? 1),
        scope: String(rule.scope || "company"),
        description: String(rule.description || ""),
        exactKeywords: toStringArray(rule.exactKeywords),
        containsKeywords: toStringArray(rule.containsKeywords),
        excludeKeywords: toStringArray(rule.excludeKeywords),
        ruleVersion: String(rule.ruleVersion || "v1")
    };
    writeStorage([
        ...entries,
        entry
    ]);
    return entry;
}
function removeFromRulebook(id) {
    writeStorage(parseStorage().filter((e)=>e.id !== id));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/integrations-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "integrationIdsAtom",
    ()=>integrationIdsAtom,
    "integrationsAtom",
    ()=>integrationsAtom,
    "integrationsLoadedAtom",
    ()=>integrationsLoadedAtom,
    "integrationsVersionAtom",
    ()=>integrationsVersionAtom,
    "selectedIntegrationAtom",
    ()=>selectedIntegrationAtom
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/vanilla.mjs [app-client] (ecmascript)");
;
const integrationsAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])([]);
const integrationsLoadedAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(false);
const selectedIntegrationAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(null);
const integrationsVersionAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])(0);
const integrationIdsAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atom"])((get)=>{
    const integrations = get(integrationsAtom);
    return new Set(integrations.map((i)=>i.id));
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/codegen-registry.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Codegen Registry (Auto-Generated)
 *
 * This file is automatically generated by scripts/discover-plugins.ts
 * DO NOT EDIT MANUALLY - your changes will be overwritten!
 *
 * Contains auto-generated codegen templates for steps with stepHandler.
 * These templates are used when exporting workflows to standalone projects.
 *
 * Generated templates: 36
 */ /**
 * Auto-generated codegen templates
 * Maps action IDs to their generated export code templates
 */ __turbopack_context__.s([
    "AUTO_GENERATED_TEMPLATES",
    ()=>AUTO_GENERATED_TEMPLATES,
    "getAutoGeneratedTemplate",
    ()=>getAutoGeneratedTemplate
]);
const AUTO_GENERATED_TEMPLATES = {
    "ai-gateway/generate-text": `import { createGateway, generateObject, generateText } from "ai";
import { z } from "zod";
import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type GenerateTextResult =
  | { success: true; text: string }
  | { success: true; object: Record<string, unknown> }
  | { success: false; error: string };

export type GenerateTextCoreInput = {
  aiModel?: string;
  aiPrompt?: string;
  aiFormat?: string;
  aiSchema?: string;
};

export async function generateTextStep(
  input: GenerateTextCoreInput,
): Promise<GenerateTextResult> {
  "use step";
  const credentials = await fetchCredentials("ai-gateway");
  const apiKey = credentials.AI_GATEWAY_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error:
        "AI_GATEWAY_API_KEY is not configured. Please add it in Project Integrations.",
    };
  }

  const modelId = input.aiModel || "meta/llama-4-scout";
  const promptText = input.aiPrompt || "";

  if (!promptText || promptText.trim() === "") {
    return {
      success: false,
      error: "Prompt is required for text generation",
    };
  }

  const modelString = getModelString(modelId);

  try {
    const gateway = createGateway({
      apiKey,
    });

    if (input.aiFormat === "object" && input.aiSchema) {
      const schema = JSON.parse(input.aiSchema) as SchemaField[];
      const zodSchema = buildZodSchema(schema);

      const { object } = await generateObject({
        model: gateway(modelString),
        prompt: promptText,
        schema: zodSchema,
      });

      return { success: true, object };
    }

    const { text } = await generateText({
      model: gateway(modelString),
      prompt: promptText,
    });

    return { success: true, text };
  } catch (error) {
    const message = await getErrorMessageAsync(error);
    return {
      success: false,
      error: \`Text generation failed: \${message}\`,
    };
  }
}
`,
    "ai-gateway/generate-image": `import { createGateway, experimental_generateImage as generateImage } from "ai";
import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type GenerateImageResult =
  | { success: true; base64: string }
  | { success: false; error: string };

export type GenerateImageCoreInput = {
  imageModel?: string;
  imagePrompt?: string;
};

export async function generateImageStep(
  input: GenerateImageCoreInput,
): Promise<GenerateImageResult> {
  "use step";
  const credentials = await fetchCredentials("ai-gateway");
  const apiKey = credentials.AI_GATEWAY_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error:
        "AI_GATEWAY_API_KEY is not configured. Please add it in Project Integrations.",
    };
  }

  const modelId = input.imageModel || "google/imagen-4.0-generate-001";
  const promptText = input.imagePrompt || "";

  if (!promptText || promptText.trim() === "") {
    return {
      success: false,
      error: "Prompt is required for image generation",
    };
  }

  try {
    const gateway = createGateway({
      apiKey,
    });
    const result = await generateImage({
      // biome-ignore lint/suspicious/noExplicitAny: AI gateway model ID is dynamic
      model: gateway.imageModel(modelId as any),
      prompt: promptText,
      size: "1024x1024",
    });

    if (!result.image) {
      return {
        success: false,
        error: "Failed to generate image: No image returned",
      };
    }

    const base64 = result.image.base64;

    return { success: true, base64 };
  } catch (error) {
    const message = await getErrorMessageAsync(error);
    return {
      success: false,
      error: \`Image generation failed: \${message}\`,
    };
  }
}
`,
    "blob/put": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type PutBlobResult =
  | { success: true; url: string; downloadUrl: string; pathname: string }
  | { success: false; error: string };

export type PutBlobCoreInput = {
  pathname: string;
  body: string;
  contentType?: string;
  access?: string;
  addRandomSuffix?: string;
};

export async function putBlobStep(
  input: PutBlobCoreInput,
): Promise<PutBlobResult> {
  "use step";
  const credentials = await fetchCredentials("blob");
  const token = credentials.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    return {
      success: false,
      error:
        "BLOB_READ_WRITE_TOKEN is not configured. Please add it in Project Integrations.",
    };
  }

  if (!input.pathname) {
    return {
      success: false,
      error: "Pathname is required",
    };
  }

  if (!input.body) {
    return {
      success: false,
      error: "Content body is required",
    };
  }

  try {
    const url = new URL(\`/\${input.pathname}\`, BLOB_API_URL);

    // Add query parameters
    const addRandomSuffix = input.addRandomSuffix !== "false";
    if (!addRandomSuffix) {
      url.searchParams.set("addRandomSuffix", "false");
    }

    const headers: Record<string, string> = {
      Authorization: \`Bearer \${token}\`,
      "x-api-version": "7",
    };

    if (input.contentType) {
      headers["x-content-type"] = input.contentType;
    }

    const response = await fetch(url.toString(), {
      method: "PUT",
      headers,
      body: input.body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage: string;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorText;
      } catch {
        errorMessage = errorText || \`HTTP \${response.status}\`;
      }
      return {
        success: false,
        error: errorMessage,
      };
    }

    const data = (await response.json()) as PutBlobResponse;
    return {
      success: true,
      url: data.url,
      downloadUrl: data.downloadUrl,
      pathname: data.pathname,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: \`Failed to upload blob: \${message}\`,
    };
  }
}
`,
    "blob/list": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type ListBlobsResult =
  | {
      success: true;
      blobs: BlobItem[];
      cursor?: string;
      hasMore: boolean;
    }
  | { success: false; error: string };

export type ListBlobsCoreInput = {
  prefix?: string;
  limit?: number;
  cursor?: string;
};

export async function listBlobsStep(
  input: ListBlobsCoreInput,
): Promise<ListBlobsResult> {
  "use step";
  const credentials = await fetchCredentials("blob");
  const token = credentials.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    return {
      success: false,
      error:
        "BLOB_READ_WRITE_TOKEN is not configured. Please add it in Project Integrations.",
    };
  }

  try {
    const url = new URL(BLOB_API_URL);

    if (input.prefix) {
      url.searchParams.set("prefix", input.prefix);
    }

    if (input.limit) {
      url.searchParams.set("limit", String(input.limit));
    }

    if (input.cursor) {
      url.searchParams.set("cursor", input.cursor);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: \`Bearer \${token}\`,
        "x-api-version": "7",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage: string;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorText;
      } catch {
        errorMessage = errorText || \`HTTP \${response.status}\`;
      }
      return {
        success: false,
        error: errorMessage,
      };
    }

    const data = (await response.json()) as ListBlobsResponse;
    return {
      success: true,
      blobs: data.blobs,
      cursor: data.cursor,
      hasMore: data.hasMore,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: \`Failed to list blobs: \${message}\`,
    };
  }
}
`,
    "clerk/get-user": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export type ClerkGetUserCoreInput = {
  userId: string;
};

export async function clerkGetUserStep(
  input: ClerkGetUserCoreInput,
): Promise<ClerkUserResult> {
  "use step";
  const credentials = await fetchCredentials("clerk");
  const secretKey = credentials.CLERK_SECRET_KEY;

  if (!secretKey) {
    return {
      success: false,
      error: {
        message:
          "CLERK_SECRET_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  if (!input.userId) {
    return {
      success: false,
      error: { message: "User ID is required." },
    };
  }

  try {
    const response = await fetch(
      \`https://api.clerk.com/v1/users/\${encodeURIComponent(input.userId)}\`,
      {
        headers: {
          Authorization: \`Bearer \${secretKey}\`,
          "Content-Type": "application/json",
          "User-Agent": "workflow-builder.dev",
        },
      },
    );

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return {
        success: false,
        error: {
          message:
            errorBody.errors?.[0]?.message ||
            \`Failed to get user: \${response.status}\`,
        },
      };
    }

    const apiUser = await response.json();
    return { success: true, data: toClerkUserData(apiUser) };
  } catch (err) {
    return {
      success: false,
      error: { message: \`Failed to get user: \${getErrorMessage(err)}\` },
    };
  }
}
`,
    "clerk/create-user": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export type ClerkCreateUserCoreInput = {
  emailAddress: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  publicMetadata?: string;
  privateMetadata?: string;
};

export async function clerkCreateUserStep(
  input: ClerkCreateUserCoreInput,
): Promise<ClerkUserResult> {
  "use step";
  const credentials = await fetchCredentials("clerk");
  const secretKey = credentials.CLERK_SECRET_KEY;

  if (!secretKey) {
    return {
      success: false,
      error: {
        message:
          "CLERK_SECRET_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  if (!input.emailAddress) {
    return {
      success: false,
      error: { message: "Email address is required." },
    };
  }

  try {
    // Build the request body
    const body: Record<string, unknown> = {
      email_address: [input.emailAddress],
    };

    if (input.firstName) {
      body.first_name = input.firstName;
    }
    if (input.lastName) {
      body.last_name = input.lastName;
    }
    if (input.password) {
      body.password = input.password;
    }
    if (input.publicMetadata) {
      try {
        body.public_metadata = JSON.parse(input.publicMetadata);
      } catch {
        return {
          success: false,
          error: { message: "Invalid JSON format for publicMetadata" },
        };
      }
    }
    if (input.privateMetadata) {
      try {
        body.private_metadata = JSON.parse(input.privateMetadata);
      } catch {
        return {
          success: false,
          error: { message: "Invalid JSON format for privateMetadata" },
        };
      }
    }

    const response = await fetch("https://api.clerk.com/v1/users", {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${secretKey}\`,
        "Content-Type": "application/json",
        "User-Agent": "workflow-builder.dev",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return {
        success: false,
        error: {
          message:
            errorBody.errors?.[0]?.message ||
            \`Failed to create user: \${response.status}\`,
        },
      };
    }

    const apiUser = await response.json();
    return { success: true, data: toClerkUserData(apiUser) };
  } catch (err) {
    return {
      success: false,
      error: { message: \`Failed to create user: \${getErrorMessage(err)}\` },
    };
  }
}
`,
    "clerk/update-user": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export type ClerkUpdateUserCoreInput = {
  userId: string;
  firstName?: string;
  lastName?: string;
  publicMetadata?: string;
  privateMetadata?: string;
};

export async function clerkUpdateUserStep(
  input: ClerkUpdateUserCoreInput,
): Promise<ClerkUserResult> {
  "use step";
  const credentials = await fetchCredentials("clerk");
  const secretKey = credentials.CLERK_SECRET_KEY;

  if (!secretKey) {
    return {
      success: false,
      error: {
        message:
          "CLERK_SECRET_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  if (!input.userId) {
    return {
      success: false,
      error: { message: "User ID is required." },
    };
  }

  try {
    // Build the request body
    const body: Record<string, unknown> = {};

    if (input.firstName !== undefined) {
      body.first_name = input.firstName;
    }
    if (input.lastName !== undefined) {
      body.last_name = input.lastName;
    }
    if (input.publicMetadata) {
      try {
        body.public_metadata = JSON.parse(input.publicMetadata);
      } catch {
        return {
          success: false,
          error: { message: "Invalid JSON format for publicMetadata" },
        };
      }
    }
    if (input.privateMetadata) {
      try {
        body.private_metadata = JSON.parse(input.privateMetadata);
      } catch {
        return {
          success: false,
          error: { message: "Invalid JSON format for privateMetadata" },
        };
      }
    }

    const response = await fetch(
      \`https://api.clerk.com/v1/users/\${encodeURIComponent(input.userId)}\`,
      {
        method: "PATCH",
        headers: {
          Authorization: \`Bearer \${secretKey}\`,
          "Content-Type": "application/json",
          "User-Agent": "workflow-builder.dev",
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return {
        success: false,
        error: {
          message:
            errorBody.errors?.[0]?.message ||
            \`Failed to update user: \${response.status}\`,
        },
      };
    }

    const apiUser = await response.json();
    return { success: true, data: toClerkUserData(apiUser) };
  } catch (err) {
    return {
      success: false,
      error: { message: \`Failed to update user: \${getErrorMessage(err)}\` },
    };
  }
}
`,
    "clerk/delete-user": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type DeleteUserResult =
  | { success: true; data: { deleted: true } }
  | { success: false; error: { message: string } };

export type ClerkDeleteUserCoreInput = {
  userId: string;
};

export async function clerkDeleteUserStep(
  input: ClerkDeleteUserCoreInput,
): Promise<DeleteUserResult> {
  "use step";
  const credentials = await fetchCredentials("clerk");
  const secretKey = credentials.CLERK_SECRET_KEY;

  if (!secretKey) {
    return {
      success: false,
      error: {
        message:
          "CLERK_SECRET_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  if (!input.userId) {
    return {
      success: false,
      error: { message: "User ID is required." },
    };
  }

  try {
    const response = await fetch(
      \`https://api.clerk.com/v1/users/\${encodeURIComponent(input.userId)}\`,
      {
        method: "DELETE",
        headers: {
          Authorization: \`Bearer \${secretKey}\`,
          "Content-Type": "application/json",
          "User-Agent": "workflow-builder.dev",
        },
      },
    );

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return {
        success: false,
        error: {
          message:
            errorBody.errors?.[0]?.message ||
            \`Failed to delete user: \${response.status}\`,
        },
      };
    }

    return { success: true, data: { deleted: true } };
  } catch (err) {
    return {
      success: false,
      error: { message: \`Failed to delete user: \${getErrorMessage(err)}\` },
    };
  }
}
`,
    "fal/generate-image": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type GenerateImageResult =
  | {
      success: true;
      data: { imageUrl: string; width?: number; height?: number };
    }
  | { success: false; error: { message: string } };

export type FalGenerateImageCoreInput = {
  model: string;
  prompt: string;
  imageSize?: string;
  numImages?: number;
};

export async function falGenerateImageStep(
  input: FalGenerateImageCoreInput,
): Promise<GenerateImageResult> {
  "use step";
  const credentials = await fetchCredentials("fal");
  const apiKey = credentials.FAL_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: {
        message:
          "FAL_API_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  try {
    const model = input.model || "fal-ai/flux/schnell";
    const response = await fetch(\`\${FAL_API_URL}/\${model}\`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Key \${apiKey}\`,
      },
      body: JSON.stringify({
        prompt: input.prompt,
        image_size: input.imageSize || "landscape_16_9",
        num_images: input.numImages || 1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: { message: \`HTTP \${response.status}: \${errorText}\` },
      };
    }

    const queueResponse = (await response.json()) as FalQueueResponse;

    // If the response is queued, poll for the result
    let result: FalImageResponse;
    if (
      queueResponse.status === "IN_QUEUE" ||
      queueResponse.status === "IN_PROGRESS"
    ) {
      result = await pollForResult(
        queueResponse.status_url,
        queueResponse.response_url,
        apiKey,
      );
    } else {
      // Immediate response (shouldn't happen with queue endpoint, but handle it)
      result = queueResponse as unknown as FalImageResponse;
    }

    if (result.error) {
      return { success: false, error: { message: result.error } };
    }

    if (!result.images || result.images.length === 0) {
      return {
        success: false,
        error: { message: "No images returned from fal.ai" },
      };
    }

    const image = result.images[0];
    return {
      success: true,
      data: { imageUrl: image.url, width: image.width, height: image.height },
    };
  } catch (error) {
    return {
      success: false,
      error: { message: \`Failed to generate image: \${getErrorMessage(error)}\` },
    };
  }
}
`,
    "fal/generate-video": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type GenerateVideoResult =
  | { success: true; data: { videoUrl: string } }
  | { success: false; error: { message: string } };

export type FalGenerateVideoCoreInput = {
  model: string;
  prompt: string;
  imageUrl?: string;
};

export async function falGenerateVideoStep(
  input: FalGenerateVideoCoreInput,
): Promise<GenerateVideoResult> {
  "use step";
  const credentials = await fetchCredentials("fal");
  const apiKey = credentials.FAL_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: {
        message:
          "FAL_API_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  try {
    const model = input.model || "fal-ai/minimax-video";

    const requestBody: Record<string, unknown> = {
      prompt: input.prompt,
    };

    if (input.imageUrl) {
      requestBody.image_url = input.imageUrl;
    }

    const response = await fetch(\`\${FAL_API_URL}/\${model}\`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Key \${apiKey}\`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: { message: \`HTTP \${response.status}: \${errorText}\` },
      };
    }

    const queueResponse = (await response.json()) as FalQueueResponse;

    let result: FalVideoResponse;
    if (
      queueResponse.status === "IN_QUEUE" ||
      queueResponse.status === "IN_PROGRESS"
    ) {
      result = await pollForResult(
        queueResponse.status_url,
        queueResponse.response_url,
        apiKey,
      );
    } else {
      result = queueResponse as unknown as FalVideoResponse;
    }

    if (result.error) {
      return { success: false, error: { message: result.error } };
    }

    if (!result.video?.url) {
      return {
        success: false,
        error: { message: "No video returned from fal.ai" },
      };
    }

    return { success: true, data: { videoUrl: result.video.url } };
  } catch (error) {
    return {
      success: false,
      error: { message: \`Failed to generate video: \${getErrorMessage(error)}\` },
    };
  }
}
`,
    "fal/upscale-image": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type UpscaleImageResult =
  | {
      success: true;
      data: { imageUrl: string; width?: number; height?: number };
    }
  | { success: false; error: { message: string } };

export type FalUpscaleImageCoreInput = {
  model: string;
  imageUrl: string;
  scale?: string;
};

export async function falUpscaleImageStep(
  input: FalUpscaleImageCoreInput,
): Promise<UpscaleImageResult> {
  "use step";
  const credentials = await fetchCredentials("fal");
  const apiKey = credentials.FAL_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: {
        message:
          "FAL_API_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  try {
    const model = input.model || "fal-ai/creative-upscaler";
    const scale = Number.parseInt(input.scale || "2", 10);

    const response = await fetch(\`\${FAL_API_URL}/\${model}\`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Key \${apiKey}\`,
      },
      body: JSON.stringify({
        image_url: input.imageUrl,
        scale,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: { message: \`HTTP \${response.status}: \${errorText}\` },
      };
    }

    const queueResponse = (await response.json()) as FalQueueResponse;

    let result: FalUpscaleResponse;
    if (
      queueResponse.status === "IN_QUEUE" ||
      queueResponse.status === "IN_PROGRESS"
    ) {
      result = await pollForResult(
        queueResponse.status_url,
        queueResponse.response_url,
        apiKey,
      );
    } else {
      result = queueResponse as unknown as FalUpscaleResponse;
    }

    if (result.error) {
      return { success: false, error: { message: result.error } };
    }

    if (!result.image?.url) {
      return {
        success: false,
        error: { message: "No image returned from fal.ai" },
      };
    }

    return {
      success: true,
      data: {
        imageUrl: result.image.url,
        width: result.image.width,
        height: result.image.height,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: { message: \`Failed to upscale image: \${getErrorMessage(error)}\` },
    };
  }
}
`,
    "fal/remove-background": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type RemoveBackgroundResult =
  | { success: true; data: { imageUrl: string } }
  | { success: false; error: { message: string } };

export type FalRemoveBackgroundCoreInput = {
  imageUrl: string;
};

export async function falRemoveBackgroundStep(
  input: FalRemoveBackgroundCoreInput,
): Promise<RemoveBackgroundResult> {
  "use step";
  const credentials = await fetchCredentials("fal");
  const apiKey = credentials.FAL_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: {
        message:
          "FAL_API_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  try {
    const response = await fetch(\`\${FAL_API_URL}/fal-ai/birefnet\`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Key \${apiKey}\`,
      },
      body: JSON.stringify({
        image_url: input.imageUrl,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: { message: \`HTTP \${response.status}: \${errorText}\` },
      };
    }

    const queueResponse = (await response.json()) as FalQueueResponse;

    let result: FalRemoveBackgroundResponse;
    if (
      queueResponse.status === "IN_QUEUE" ||
      queueResponse.status === "IN_PROGRESS"
    ) {
      result = await pollForResult(
        queueResponse.status_url,
        queueResponse.response_url,
        apiKey,
      );
    } else {
      result = queueResponse as unknown as FalRemoveBackgroundResponse;
    }

    if (result.error) {
      return { success: false, error: { message: result.error } };
    }

    if (!result.image?.url) {
      return {
        success: false,
        error: { message: "No image returned from fal.ai" },
      };
    }

    return { success: true, data: { imageUrl: result.image.url } };
  } catch (error) {
    return {
      success: false,
      error: {
        message: \`Failed to remove background: \${getErrorMessage(error)}\`,
      },
    };
  }
}
`,
    "fal/image-to-image": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type ImageToImageResult =
  | {
      success: true;
      data: { imageUrl: string; width?: number; height?: number };
    }
  | { success: false; error: { message: string } };

export type FalImageToImageCoreInput = {
  model: string;
  imageUrl: string;
  prompt: string;
  strength?: string;
};

export async function falImageToImageStep(
  input: FalImageToImageCoreInput,
): Promise<ImageToImageResult> {
  "use step";
  const credentials = await fetchCredentials("fal");
  const apiKey = credentials.FAL_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: {
        message:
          "FAL_API_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  try {
    const model = input.model || "fal-ai/flux/dev/image-to-image";
    const strength = Number.parseFloat(input.strength || "0.75");

    const response = await fetch(\`\${FAL_API_URL}/\${model}\`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Key \${apiKey}\`,
      },
      body: JSON.stringify({
        image_url: input.imageUrl,
        prompt: input.prompt,
        strength,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: { message: \`HTTP \${response.status}: \${errorText}\` },
      };
    }

    const queueResponse = (await response.json()) as FalQueueResponse;

    let result: FalImageToImageResponse;
    if (
      queueResponse.status === "IN_QUEUE" ||
      queueResponse.status === "IN_PROGRESS"
    ) {
      result = await pollForResult(
        queueResponse.status_url,
        queueResponse.response_url,
        apiKey,
      );
    } else {
      result = queueResponse as unknown as FalImageToImageResponse;
    }

    if (result.error) {
      return { success: false, error: { message: result.error } };
    }

    // Handle both array format (images) and single image format
    const image = result.images?.[0] || result.image;
    if (!image?.url) {
      return {
        success: false,
        error: { message: "No image returned from fal.ai" },
      };
    }

    return {
      success: true,
      data: { imageUrl: image.url, width: image.width, height: image.height },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: \`Failed to transform image: \${getErrorMessage(error)}\`,
      },
    };
  }
}
`,
    "firecrawl/scrape": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type ScrapeResult = {
  markdown?: string;
  metadata?: Record<string, unknown>;
};

export type FirecrawlScrapeCoreInput = {
  url: string;
  formats?: ("markdown" | "html" | "rawHtml" | "links" | "screenshot")[];
};

export async function firecrawlScrapeStep(
  input: FirecrawlScrapeCoreInput,
): Promise<ScrapeResult> {
  "use step";
  const credentials = await fetchCredentials("firecrawl");
  const apiKey = credentials.FIRECRAWL_API_KEY;

  if (!apiKey) {
    throw new Error("Firecrawl API Key is not configured.");
  }

  try {
    const response = await fetch(\`\${FIRECRAWL_API_URL}/scrape\`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Bearer \${apiKey}\`,
      },
      body: JSON.stringify({
        url: input.url,
        formats: input.formats || ["markdown"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(\`HTTP \${response.status}: \${errorText}\`);
    }

    const result = (await response.json()) as FirecrawlScrapeResponse;

    if (!result.success) {
      throw new Error(result.error || "Scrape failed");
    }

    return {
      markdown: result.data?.markdown,
      metadata: result.data?.metadata,
    };
  } catch (error) {
    throw new Error(\`Failed to scrape: \${getErrorMessage(error)}\`);
  }
}
`,
    "firecrawl/search": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type SearchResult = {
  data?: unknown[];
};

export type FirecrawlSearchCoreInput = {
  query: string;
  limit?: number;
  scrapeOptions?: {
    formats?: ("markdown" | "html" | "rawHtml" | "links" | "screenshot")[];
  };
};

export async function firecrawlSearchStep(
  input: FirecrawlSearchCoreInput,
): Promise<SearchResult> {
  "use step";
  const credentials = await fetchCredentials("firecrawl");
  const apiKey = credentials.FIRECRAWL_API_KEY;

  if (!apiKey) {
    throw new Error("Firecrawl API Key is not configured.");
  }

  try {
    const response = await fetch(\`\${FIRECRAWL_API_URL}/search\`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Bearer \${apiKey}\`,
      },
      body: JSON.stringify({
        query: input.query,
        limit: input.limit ? Number(input.limit) : undefined,
        scrapeOptions: input.scrapeOptions,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(\`HTTP \${response.status}: \${errorText}\`);
    }

    const result = (await response.json()) as FirecrawlSearchResponse;

    if (!result.success) {
      throw new Error(result.error || "Search failed");
    }

    return {
      data: result.data,
    };
  } catch (error) {
    throw new Error(\`Failed to search: \${getErrorMessage(error)}\`);
  }
}
`,
    "github/create-issue": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type CreateIssueResult =
  | {
      success: true;
      id: number;
      number: number;
      title: string;
      url: string;
      state: string;
    }
  | { success: false; error: string };

export type CreateIssueCoreInput = {
  owner: string;
  repo: string;
  title: string;
  body?: string;
  labels?: string;
  assignees?: string;
};

export async function createIssueStep(
  input: CreateIssueCoreInput,
): Promise<CreateIssueResult> {
  "use step";
  const credentials = await fetchCredentials("github");
  const token = credentials.GITHUB_TOKEN;

  if (!token) {
    return {
      success: false,
      error:
        "GITHUB_TOKEN is not configured. Please add it in Project Integrations.",
    };
  }

  try {
    const body: Record<string, unknown> = {
      title: input.title,
    };

    if (input.body) {
      body.body = input.body;
    }

    const labels = parseCommaSeparated(input.labels);
    if (labels.length > 0) {
      body.labels = labels;
    }

    const assignees = parseCommaSeparated(input.assignees);
    if (assignees.length > 0) {
      body.assignees = assignees;
    }

    const response = await fetch(
      \`\${GITHUB_API_URL}/repos/\${input.owner}/\${input.repo}/issues\`,
      {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: \`Bearer \${token}\`,
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      const errorData = (await response.json()) as { message?: string };
      return {
        success: false,
        error: errorData.message || \`HTTP \${response.status}\`,
      };
    }

    const issue = (await response.json()) as GitHubIssue;

    return {
      success: true,
      id: issue.id,
      number: issue.number,
      title: issue.title,
      url: issue.html_url,
      state: issue.state,
    };
  } catch (error) {
    return {
      success: false,
      error: \`Failed to create issue: \${getErrorMessage(error)}\`,
    };
  }
}
`,
    "github/list-issues": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type ListIssuesResult =
  | {
      success: true;
      issues: Array<{
        id: number;
        number: number;
        title: string;
        url: string;
        state: string;
        body?: string;
        labels: string[];
        assignees: string[];
        createdAt: string;
        updatedAt: string;
      }>;
      count: number;
    }
  | { success: false; error: string };

export type ListIssuesCoreInput = {
  owner: string;
  repo: string;
  state?: string;
  labels?: string;
  assignee?: string;
  perPage?: number;
};

export async function listIssuesStep(
  input: ListIssuesCoreInput,
): Promise<ListIssuesResult> {
  "use step";
  const credentials = await fetchCredentials("github");
  const token = credentials.GITHUB_TOKEN;

  if (!token) {
    return {
      success: false,
      error:
        "GITHUB_TOKEN is not configured. Please add it in Project Integrations.",
    };
  }

  try {
    const params = new URLSearchParams();

    if (input.state && input.state !== "open") {
      params.set("state", input.state);
    }

    if (input.labels) {
      params.set("labels", input.labels);
    }

    if (input.assignee) {
      params.set("assignee", input.assignee);
    }

    if (input.perPage) {
      params.set("per_page", String(input.perPage));
    }

    const url = \`\${GITHUB_API_URL}/repos/\${input.owner}/\${input.repo}/issues\${
      params.toString() ? \`?\${params.toString()}\` : ""
    }\`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: \`Bearer \${token}\`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!response.ok) {
      const errorData = (await response.json()) as { message?: string };
      return {
        success: false,
        error: errorData.message || \`HTTP \${response.status}\`,
      };
    }

    const rawIssues = (await response.json()) as GitHubIssue[];

    const issues = rawIssues.map((issue) => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      url: issue.html_url,
      state: issue.state,
      body: issue.body,
      labels: issue.labels.map((l) => l.name),
      assignees: issue.assignees.map((a) => a.login),
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
    }));

    return {
      success: true,
      issues,
      count: issues.length,
    };
  } catch (error) {
    return {
      success: false,
      error: \`Failed to list issues: \${getErrorMessage(error)}\`,
    };
  }
}
`,
    "github/get-issue": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type GetIssueResult =
  | {
      success: true;
      id: number;
      number: number;
      title: string;
      url: string;
      state: string;
      body?: string;
      labels: string[];
      assignees: string[];
      author: string;
      createdAt: string;
      updatedAt: string;
      closedAt?: string;
      commentsCount: number;
    }
  | { success: false; error: string };

export type GetIssueCoreInput = {
  owner: string;
  repo: string;
  issueNumber: string;
};

export async function getIssueStep(
  input: GetIssueCoreInput,
): Promise<GetIssueResult> {
  "use step";
  const credentials = await fetchCredentials("github");
  const token = credentials.GITHUB_TOKEN;

  if (!token) {
    return {
      success: false,
      error:
        "GITHUB_TOKEN is not configured. Please add it in Project Integrations.",
    };
  }

  try {
    const issueNum = Number.parseInt(input.issueNumber, 10);
    if (Number.isNaN(issueNum)) {
      return {
        success: false,
        error: "Invalid issue number",
      };
    }

    const response = await fetch(
      \`\${GITHUB_API_URL}/repos/\${input.owner}/\${input.repo}/issues/\${issueNum}\`,
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: \`Bearer \${token}\`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );

    if (!response.ok) {
      const errorData = (await response.json()) as { message?: string };
      return {
        success: false,
        error: errorData.message || \`HTTP \${response.status}\`,
      };
    }

    const issue = (await response.json()) as GitHubIssue;

    return {
      success: true,
      id: issue.id,
      number: issue.number,
      title: issue.title,
      url: issue.html_url,
      state: issue.state,
      body: issue.body,
      labels: issue.labels.map((l) => l.name),
      assignees: issue.assignees.map((a) => a.login),
      author: issue.user.login,
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
      closedAt: issue.closed_at,
      commentsCount: issue.comments,
    };
  } catch (error) {
    return {
      success: false,
      error: \`Failed to get issue: \${getErrorMessage(error)}\`,
    };
  }
}
`,
    "github/update-issue": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type UpdateIssueResult =
  | {
      success: true;
      id: number;
      number: number;
      title: string;
      url: string;
      state: string;
    }
  | { success: false; error: string };

export type UpdateIssueCoreInput = {
  owner: string;
  repo: string;
  issueNumber: string;
  title?: string;
  body?: string;
  state?: string;
  labels?: string;
  assignees?: string;
};

export async function updateIssueStep(
  input: UpdateIssueCoreInput,
): Promise<UpdateIssueResult> {
  "use step";
  const credentials = await fetchCredentials("github");
  const token = credentials.GITHUB_TOKEN;

  if (!token) {
    return {
      success: false,
      error:
        "GITHUB_TOKEN is not configured. Please add it in Project Integrations.",
    };
  }

  try {
    const issueNum = Number.parseInt(input.issueNumber, 10);
    if (Number.isNaN(issueNum)) {
      return {
        success: false,
        error: "Invalid issue number",
      };
    }

    const body: Record<string, unknown> = {};

    if (input.title) {
      body.title = input.title;
    }

    if (input.body) {
      body.body = input.body;
    }

    if (input.state && input.state !== "") {
      body.state = input.state;
    }

    if (input.labels !== undefined) {
      const labels = parseCommaSeparated(input.labels);
      body.labels = labels;
    }

    if (input.assignees !== undefined) {
      const assignees = parseCommaSeparated(input.assignees);
      body.assignees = assignees;
    }

    if (Object.keys(body).length === 0) {
      return {
        success: false,
        error: "No fields to update. Please provide at least one field.",
      };
    }

    const response = await fetch(
      \`\${GITHUB_API_URL}/repos/\${input.owner}/\${input.repo}/issues/\${issueNum}\`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: \`Bearer \${token}\`,
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      const errorData = (await response.json()) as { message?: string };
      return {
        success: false,
        error: errorData.message || \`HTTP \${response.status}\`,
      };
    }

    const issue = (await response.json()) as GitHubIssue;

    return {
      success: true,
      id: issue.id,
      number: issue.number,
      title: issue.title,
      url: issue.html_url,
      state: issue.state,
    };
  } catch (error) {
    return {
      success: false,
      error: \`Failed to update issue: \${getErrorMessage(error)}\`,
    };
  }
}
`,
    "linear/create-ticket": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type CreateTicketResult =
  | { success: true; data: { id: string; url: string; title: string } }
  | { success: false; error: { message: string } };

export type CreateTicketCoreInput = {
  ticketTitle: string;
  ticketDescription: string;
};

export async function createTicketStep(
  input: CreateTicketCoreInput,
): Promise<CreateTicketResult> {
  "use step";
  const credentials = await fetchCredentials("linear");
  const apiKey = credentials.LINEAR_API_KEY;
  const teamId = credentials.LINEAR_TEAM_ID;

  if (!apiKey) {
    return {
      success: false,
      error: {
        message:
          "LINEAR_API_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  try {
    let targetTeamId = teamId;

    if (!targetTeamId) {
      const teamsResult = await linearQuery<TeamsQueryResponse>(
        apiKey,
        \`query { teams { nodes { id name } } }\`,
      );

      if (teamsResult.errors?.length) {
        return {
          success: false,
          error: { message: teamsResult.errors[0].message },
        };
      }

      const firstTeam = teamsResult.data?.teams.nodes[0];
      if (!firstTeam) {
        return {
          success: false,
          error: { message: "No teams found in Linear workspace" },
        };
      }
      targetTeamId = firstTeam.id;
    }

    const createResult = await linearQuery<CreateIssueMutationResponse>(
      apiKey,
      \`mutation CreateIssue($title: String!, $description: String, $teamId: String!) {
        issueCreate(input: { title: $title, description: $description, teamId: $teamId }) {
          success
          issue {
            id
            title
            url
          }
        }
      }\`,
      {
        title: input.ticketTitle,
        description: input.ticketDescription,
        teamId: targetTeamId,
      },
    );

    if (createResult.errors?.length) {
      return {
        success: false,
        error: { message: createResult.errors[0].message },
      };
    }

    const issue = createResult.data?.issueCreate.issue;
    if (!issue) {
      return {
        success: false,
        error: { message: "Failed to create issue" },
      };
    }

    return {
      success: true,
      data: {
        id: issue.id,
        url: issue.url,
        title: issue.title,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: { message: \`Failed to create ticket: \${getErrorMessage(error)}\` },
    };
  }
}
`,
    "linear/find-issues": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type FindIssuesResult =
  | { success: true; data: { issues: LinearIssue[]; count: number } }
  | { success: false; error: { message: string } };

export type FindIssuesCoreInput = {
  linearAssigneeId?: string;
  linearTeamId?: string;
  linearStatus?: string;
  linearLabel?: string;
};

export async function findIssuesStep(
  input: FindIssuesCoreInput,
): Promise<FindIssuesResult> {
  "use step";
  const credentials = await fetchCredentials("linear");
  const apiKey = credentials.LINEAR_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: {
        message:
          "LINEAR_API_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  try {
    // Build filter object for Linear's GraphQL API
    const filter: Record<string, unknown> = {};

    if (input.linearAssigneeId) {
      filter.assignee = { id: { eq: input.linearAssigneeId } };
    }

    if (input.linearTeamId) {
      filter.team = { id: { eq: input.linearTeamId } };
    }

    if (input.linearStatus && input.linearStatus !== "any") {
      filter.state = { name: { eqIgnoreCase: input.linearStatus } };
    }

    if (input.linearLabel) {
      filter.labels = { name: { eqIgnoreCase: input.linearLabel } };
    }

    const result = await linearQuery<IssuesQueryResponse>(
      apiKey,
      \`query FindIssues($filter: IssueFilter) {
        issues(filter: $filter) {
          nodes {
            id
            title
            url
            priority
            assignee {
              id
            }
            state {
              name
            }
          }
        }
      }\`,
      { filter: Object.keys(filter).length > 0 ? filter : undefined },
    );

    if (result.errors?.length) {
      return {
        success: false,
        error: { message: result.errors[0].message },
      };
    }

    const mappedIssues: LinearIssue[] = (result.data?.issues.nodes || []).map(
      (issue) => ({
        id: issue.id,
        title: issue.title,
        url: issue.url,
        state: issue.state?.name || "Unknown",
        priority: issue.priority,
        assigneeId: issue.assignee?.id || undefined,
      }),
    );

    return {
      success: true,
      data: {
        issues: mappedIssues,
        count: mappedIssues.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: { message: \`Failed to find issues: \${getErrorMessage(error)}\` },
    };
  }
}
`,
    "perplexity/search": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type SearchResult =
  | {
      success: true;
      data: { answer: string; citations: string[]; model: string };
    }
  | { success: false; error: { message: string } };

export type PerplexitySearchCoreInput = {
  query: string;
  searchFocus?: "internet" | "academic" | "news" | "youtube" | "reddit";
};

export async function perplexitySearchStep(
  input: PerplexitySearchCoreInput,
): Promise<SearchResult> {
  "use step";
  const credentials = await fetchCredentials("perplexity");
  const apiKey = credentials.PERPLEXITY_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: { message: "Perplexity API Key is not configured." },
    };
  }

  try {
    const response = await fetch(PERPLEXITY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Bearer \${apiKey}\`,
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful search assistant. Provide concise, accurate answers with relevant sources.",
          },
          {
            role: "user",
            content: input.query,
          },
        ],
        search_domain_filter: getSearchDomains(input.searchFocus),
        return_citations: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: { message: \`HTTP \${response.status}: \${errorText}\` },
      };
    }

    const result = (await response.json()) as PerplexityResponse;

    const answer = result.choices[0]?.message?.content || "";
    const citations = (result.citations || []).map((c) =>
      typeof c === "string" ? c : c.url,
    );

    return {
      success: true,
      data: { answer, citations, model: result.model },
    };
  } catch (error) {
    return {
      success: false,
      error: { message: \`Failed to search: \${getErrorMessage(error)}\` },
    };
  }
}
`,
    "perplexity/ask": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type AskResult =
  | {
      success: true;
      data: { answer: string; citations: string[]; model: string };
    }
  | { success: false; error: { message: string } };

export type PerplexityAskCoreInput = {
  question: string;
  systemPrompt?: string;
  model?: string;
};

export async function perplexityAskStep(
  input: PerplexityAskCoreInput,
): Promise<AskResult> {
  "use step";
  const credentials = await fetchCredentials("perplexity");
  const apiKey = credentials.PERPLEXITY_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: { message: "Perplexity API Key is not configured." },
    };
  }

  try {
    const messages: PerplexityMessage[] = [];

    if (input.systemPrompt) {
      messages.push({
        role: "system",
        content: input.systemPrompt,
      });
    } else {
      messages.push({
        role: "system",
        content:
          "You are a helpful AI assistant. Provide accurate, well-researched answers with citations when available.",
      });
    }

    messages.push({
      role: "user",
      content: input.question,
    });

    const response = await fetch(PERPLEXITY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Bearer \${apiKey}\`,
      },
      body: JSON.stringify({
        model: input.model || "sonar",
        messages,
        return_citations: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: { message: \`HTTP \${response.status}: \${errorText}\` },
      };
    }

    const result = (await response.json()) as PerplexityResponse;

    const answer = result.choices[0]?.message?.content || "";
    const citations = (result.citations || []).map((c) =>
      typeof c === "string" ? c : c.url,
    );

    return {
      success: true,
      data: { answer, citations, model: result.model },
    };
  } catch (error) {
    return {
      success: false,
      error: { message: \`Failed to ask: \${getErrorMessage(error)}\` },
    };
  }
}
`,
    "perplexity/research": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type ResearchResult =
  | {
      success: true;
      data: { report: string; citations: string[]; model: string };
    }
  | { success: false; error: { message: string } };

export type PerplexityResearchCoreInput = {
  topic: string;
  depth?: "brief" | "detailed" | "comprehensive";
};

export async function perplexityResearchStep(
  input: PerplexityResearchCoreInput,
): Promise<ResearchResult> {
  "use step";
  const credentials = await fetchCredentials("perplexity");
  const apiKey = credentials.PERPLEXITY_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: { message: "Perplexity API Key is not configured." },
    };
  }

  const depthInstructions = getDepthInstructions(input.depth);

  try {
    const response = await fetch(PERPLEXITY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Bearer \${apiKey}\`,
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [
          {
            role: "system",
            content: \`You are an expert research analyst. Your task is to provide \${depthInstructions} research on the given topic. Structure your response with clear sections, include relevant data and statistics when available, and cite your sources. Focus on accuracy, comprehensiveness, and actionable insights.\`,
          },
          {
            role: "user",
            content: \`Research the following topic thoroughly: \${input.topic}\`,
          },
        ],
        return_citations: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: { message: \`HTTP \${response.status}: \${errorText}\` },
      };
    }

    const result = (await response.json()) as PerplexityResponse;

    const report = result.choices[0]?.message?.content || "";
    const citations = (result.citations || []).map((c) =>
      typeof c === "string" ? c : c.url,
    );

    return {
      success: true,
      data: { report, citations, model: result.model },
    };
  } catch (error) {
    return {
      success: false,
      error: { message: \`Failed to research: \${getErrorMessage(error)}\` },
    };
  }
}
`,
    "resend/send-email": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type SendEmailResult =
  | { success: true; data: { id: string } }
  | { success: false; error: { message: string } };

export type SendEmailCoreInput = {
  emailFrom?: string;
  emailTo: string;
  emailSubject: string;
  emailBody: string;
  emailCc?: string;
  emailBcc?: string;
  emailReplyTo?: string;
  emailScheduledAt?: string;
  emailTopicId?: string;
  idempotencyKey?: string;
};

export async function sendEmailStep(
  input: SendEmailCoreInput,
): Promise<SendEmailResult> {
  "use step";
  const credentials = await fetchCredentials("resend");
  const apiKey = credentials.RESEND_API_KEY;
  const fromEmail = credentials.RESEND_FROM_EMAIL;

  if (!apiKey) {
    return {
      success: false,
      error: {
        message:
          "RESEND_API_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  const senderEmail = input.emailFrom || fromEmail;

  if (!senderEmail) {
    return {
      success: false,
      error: {
        message:
          "No sender is configured. Please add it in the action or in Project Integrations.",
      },
    };
  }

  try {
    const headers: Record<string, string> = {
      Authorization: \`Bearer \${apiKey}\`,
      "Content-Type": "application/json",
    };

    if (input.idempotencyKey) {
      headers["Idempotency-Key"] = input.idempotencyKey;
    }

    const response = await fetch(\`\${RESEND_API_URL}/emails\`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        from: senderEmail,
        to: input.emailTo,
        subject: input.emailSubject,
        text: input.emailBody,
        ...(input.emailCc && { cc: input.emailCc }),
        ...(input.emailBcc && { bcc: input.emailBcc }),
        ...(input.emailReplyTo && { reply_to: input.emailReplyTo }),
        ...(input.emailScheduledAt && { scheduled_at: input.emailScheduledAt }),
      }),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as ResendErrorResponse;
      return {
        success: false,
        error: {
          message:
            errorData.message ||
            \`HTTP \${response.status}: Failed to send email\`,
        },
      };
    }

    const data = (await response.json()) as ResendEmailResponse;
    return { success: true, data: { id: data.id } };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: { message: \`Failed to send email: \${errorMessage}\` },
    };
  }
}
`,
    "slack/send-message": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type SendSlackMessageResult =
  | { success: true; ts: string; channel: string }
  | { success: false; error: string };

export type SendSlackMessageCoreInput = {
  slackChannel: string;
  slackMessage: string;
};

export async function sendSlackMessageStep(
  input: SendSlackMessageCoreInput,
): Promise<SendSlackMessageResult> {
  "use step";
  const credentials = await fetchCredentials("slack");
  const apiKey = credentials.SLACK_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error:
        "SLACK_API_KEY is not configured. Please add it in Project Integrations.",
    };
  }

  try {
    const response = await fetch(\`\${SLACK_API_URL}/chat.postMessage\`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Bearer \${apiKey}\`,
      },
      body: JSON.stringify({
        channel: input.slackChannel,
        text: input.slackMessage,
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: \`HTTP \${response.status}: Failed to send Slack message\`,
      };
    }

    const result = (await response.json()) as SlackPostMessageResponse;

    if (!result.ok) {
      return {
        success: false,
        error: result.error || "Failed to send Slack message",
      };
    }

    return {
      success: true,
      ts: result.ts || "",
      channel: result.channel || "",
    };
  } catch (error) {
    return {
      success: false,
      error: \`Failed to send Slack message: \${getErrorMessage(error)}\`,
    };
  }
}
`,
    "stripe/create-customer": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type CreateCustomerResult =
  | { success: true; id: string; email: string }
  | { success: false; error: string };

export type CreateCustomerCoreInput = {
  email: string;
  name?: string;
  phone?: string;
  description?: string;
  metadata?: string;
};

export async function createCustomerStep(
  input: CreateCustomerCoreInput,
): Promise<CreateCustomerResult> {
  "use step";
  const credentials = await fetchCredentials("stripe");
  const apiKey = credentials.STRIPE_SECRET_KEY;

  if (!apiKey) {
    return {
      success: false,
      error:
        "STRIPE_SECRET_KEY is not configured. Please add it in Project Integrations.",
    };
  }

  try {
    const params = new URLSearchParams();
    params.append("email", input.email);

    if (input.name) {
      params.append("name", input.name);
    }
    if (input.phone) {
      params.append("phone", input.phone);
    }
    if (input.description) {
      params.append("description", input.description);
    }
    if (input.metadata) {
      try {
        const metadataObj = JSON.parse(input.metadata) as Record<
          string,
          string
        >;
        for (const [key, value] of Object.entries(metadataObj)) {
          params.append(\`metadata[\${key}]\`, String(value));
        }
      } catch {
        return {
          success: false,
          error: "Invalid metadata JSON format",
        };
      }
    }

    const response = await fetch(\`\${STRIPE_API_URL}/customers\`, {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${apiKey}\`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as StripeErrorResponse;
      return {
        success: false,
        error:
          errorData.error?.message ||
          \`HTTP \${response.status}: Failed to create customer\`,
      };
    }

    const data = (await response.json()) as StripeCustomerResponse;
    return { success: true, id: data.id, email: data.email };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: \`Failed to create customer: \${message}\`,
    };
  }
}
`,
    "stripe/get-customer": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type GetCustomerResult =
  | {
      success: true;
      id: string;
      email: string;
      name: string | null;
      created: number;
    }
  | { success: false; error: string };

export type GetCustomerCoreInput = {
  customerId?: string;
  email?: string;
};

export async function getCustomerStep(
  input: GetCustomerCoreInput,
): Promise<GetCustomerResult> {
  "use step";
  const credentials = await fetchCredentials("stripe");
  const apiKey = credentials.STRIPE_SECRET_KEY;

  if (!apiKey) {
    return {
      success: false,
      error:
        "STRIPE_SECRET_KEY is not configured. Please add it in Project Integrations.",
    };
  }

  if (!input.customerId && !input.email) {
    return {
      success: false,
      error: "Either Customer ID or Email is required",
    };
  }

  try {
    let customer: StripeCustomerResponse | null = null;

    if (input.customerId) {
      // Direct lookup by ID
      const response = await fetch(
        \`\${STRIPE_API_URL}/customers/\${input.customerId}\`,
        {
          method: "GET",
          headers: {
            Authorization: \`Bearer \${apiKey}\`,
          },
        },
      );

      if (!response.ok) {
        const errorData = (await response.json()) as StripeErrorResponse;
        return {
          success: false,
          error:
            errorData.error?.message ||
            \`HTTP \${response.status}: Failed to get customer\`,
        };
      }

      customer = (await response.json()) as StripeCustomerResponse;
    } else if (input.email) {
      // Search by email
      const params = new URLSearchParams();
      params.append("email", input.email);
      params.append("limit", "1");

      const response = await fetch(
        \`\${STRIPE_API_URL}/customers?\${params.toString()}\`,
        {
          method: "GET",
          headers: {
            Authorization: \`Bearer \${apiKey}\`,
          },
        },
      );

      if (!response.ok) {
        const errorData = (await response.json()) as StripeErrorResponse;
        return {
          success: false,
          error:
            errorData.error?.message ||
            \`HTTP \${response.status}: Failed to search customers\`,
        };
      }

      const data = (await response.json()) as StripeCustomerListResponse;
      if (data.data.length === 0) {
        return {
          success: false,
          error: \`No customer found with email: \${input.email}\`,
        };
      }
      customer = data.data[0];
    }

    if (!customer) {
      return {
        success: false,
        error: "Customer not found",
      };
    }

    return {
      success: true,
      id: customer.id,
      email: customer.email,
      name: customer.name,
      created: customer.created,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: \`Failed to get customer: \${message}\`,
    };
  }
}
`,
    "stripe/create-invoice": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type CreateInvoiceResult =
  | {
      success: true;
      id: string;
      number: string | null;
      hostedInvoiceUrl: string | null;
      status: string;
    }
  | { success: false; error: string };

export type CreateInvoiceCoreInput = {
  customerId: string;
  description?: string;
  lineItems: string;
  daysUntilDue?: number;
  autoAdvance?: string;
  collectionMethod?: "send_invoice" | "charge_automatically";
  metadata?: string;
};

export async function createInvoiceStep(
  input: CreateInvoiceCoreInput,
): Promise<CreateInvoiceResult> {
  "use step";
  const credentials = await fetchCredentials("stripe");
  const apiKey = credentials.STRIPE_SECRET_KEY;

  if (!apiKey) {
    return {
      success: false,
      error:
        "STRIPE_SECRET_KEY is not configured. Please add it in Project Integrations.",
    };
  }

  let lineItems: LineItem[];
  try {
    lineItems = JSON.parse(input.lineItems) as LineItem[];
    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      return {
        success: false,
        error: "Line items must be a non-empty JSON array",
      };
    }
  } catch {
    return {
      success: false,
      error:
        'Invalid line items JSON format. Expected: [{"description": "Item", "amount": 1000, "quantity": 1}]',
    };
  }

  try {
    // Step 1: Create the invoice
    const invoiceParams = new URLSearchParams();
    invoiceParams.append("customer", input.customerId);
    invoiceParams.append(
      "collection_method",
      input.collectionMethod || "send_invoice",
    );
    invoiceParams.append("days_until_due", String(input.daysUntilDue || 30));
    invoiceParams.append(
      "auto_advance",
      input.autoAdvance === "false" ? "false" : "true",
    );

    if (input.description) {
      invoiceParams.append("description", input.description);
    }
    if (input.metadata) {
      try {
        const metadataObj = JSON.parse(input.metadata) as Record<
          string,
          string
        >;
        for (const [key, value] of Object.entries(metadataObj)) {
          invoiceParams.append(\`metadata[\${key}]\`, String(value));
        }
      } catch {
        return {
          success: false,
          error: "Invalid metadata JSON format",
        };
      }
    }

    const invoiceResponse = await fetch(\`\${STRIPE_API_URL}/invoices\`, {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${apiKey}\`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: invoiceParams.toString(),
    });

    if (!invoiceResponse.ok) {
      const errorData = (await invoiceResponse.json()) as StripeErrorResponse;
      return {
        success: false,
        error:
          errorData.error?.message ||
          \`HTTP \${invoiceResponse.status}: Failed to create invoice\`,
      };
    }

    const invoice = (await invoiceResponse.json()) as StripeInvoiceResponse;

    // Step 2: Add line items
    for (const item of lineItems) {
      const itemParams = new URLSearchParams();
      itemParams.append("invoice", invoice.id);
      itemParams.append("description", item.description);
      itemParams.append("quantity", String(item.quantity || 1));
      itemParams.append("unit_amount", String(item.amount));
      itemParams.append("currency", "usd");

      const itemResponse = await fetch(\`\${STRIPE_API_URL}/invoiceitems\`, {
        method: "POST",
        headers: {
          Authorization: \`Bearer \${apiKey}\`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: itemParams.toString(),
      });

      if (!itemResponse.ok) {
        const errorData = (await itemResponse.json()) as StripeErrorResponse;
        return {
          success: false,
          error:
            errorData.error?.message ||
            \`HTTP \${itemResponse.status}: Failed to add line item\`,
        };
      }
    }

    // Step 3: Finalize invoice if auto_advance is true
    let finalInvoice = invoice;
    if (input.autoAdvance !== "false") {
      const finalizeResponse = await fetch(
        \`\${STRIPE_API_URL}/invoices/\${invoice.id}/finalize\`,
        {
          method: "POST",
          headers: {
            Authorization: \`Bearer \${apiKey}\`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      if (!finalizeResponse.ok) {
        const errorData =
          (await finalizeResponse.json()) as StripeErrorResponse;
        return {
          success: false,
          error:
            errorData.error?.message ||
            \`HTTP \${finalizeResponse.status}: Failed to finalize invoice\`,
        };
      }

      finalInvoice = (await finalizeResponse.json()) as StripeInvoiceResponse;
    }

    return {
      success: true,
      id: finalInvoice.id,
      number: finalInvoice.number,
      hostedInvoiceUrl: finalInvoice.hosted_invoice_url,
      status: finalInvoice.status,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: \`Failed to create invoice: \${message}\`,
    };
  }
}
`,
    "superagent/guard": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type GuardResult = {
  classification: GuardClassification;
  violationTypes: string[];
  cweCodes: string[];
  reasoning?: string;
};

export type SuperagentGuardCoreInput = {
  text: string;
};

export async function superagentGuardStep(
  input: SuperagentGuardCoreInput,
): Promise<GuardResult> {
  "use step";
  const credentials = await fetchCredentials("superagent");
  const apiKey = credentials.SUPERAGENT_API_KEY;

  if (!apiKey) {
    throw new Error("Superagent API Key is not configured.");
  }

  try {
    const response = await fetch("https://app.superagent.sh/api/guard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Bearer \${apiKey}\`,
      },
      body: JSON.stringify({
        text: input.text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(\`Guard API error: \${error}\`);
    }

    const data = await response.json();
    const choice = data.choices?.[0];
    const content = choice?.message?.content;

    if (!content || typeof content !== "object") {
      throw new Error(
        "Invalid Guard API response: missing or invalid content structure",
      );
    }

    const classification = content.classification;
    if (
      !classification ||
      (classification !== "pass" && classification !== "block")
    ) {
      throw new Error(
        \`Invalid Guard API response: missing or invalid classification (received: \${JSON.stringify(classification)})\`,
      );
    }

    return {
      classification,
      violationTypes: content?.violation_types || [],
      cweCodes: content?.cwe_codes || [],
      reasoning: choice?.message?.reasoning,
    };
  } catch (error) {
    throw new Error(\`Failed to analyze text: \${getErrorMessage(error)}\`);
  }
}
`,
    "superagent/redact": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type RedactResult = {
  redactedText: string;
  reasoning?: string;
};

export type SuperagentRedactCoreInput = {
  text: string;
  entities?: string[] | string;
};

export async function superagentRedactStep(
  input: SuperagentRedactCoreInput,
): Promise<RedactResult> {
  "use step";
  const credentials = await fetchCredentials("superagent");
  const apiKey = credentials.SUPERAGENT_API_KEY;

  if (!apiKey) {
    throw new Error("Superagent API Key is not configured.");
  }

  try {
    const body: { text: string; entities?: string[] } = {
      text: input.text,
    };

    if (input.entities) {
      let entitiesArray: string[];

      if (typeof input.entities === "string") {
        entitiesArray = input.entities.split(",").map((e) => e.trim());
      } else if (Array.isArray(input.entities)) {
        entitiesArray = input.entities.map((e) => String(e).trim());
      } else {
        entitiesArray = [];
      }

      const validEntities = entitiesArray.filter((e) => e.length > 0);

      if (validEntities.length > 0) {
        body.entities = validEntities;
      }
    }

    const response = await fetch("https://app.superagent.sh/api/redact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Bearer \${apiKey}\`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(\`Redact API error: \${error}\`);
    }

    const data = await response.json();
    const choice = data.choices?.[0];

    return {
      redactedText: choice?.message?.content || input.text,
      reasoning: choice?.message?.reasoning,
    };
  } catch (error) {
    throw new Error(\`Failed to redact text: \${getErrorMessage(error)}\`);
  }
}
`,
    "v0/create-chat": `import { createClient, type ChatsCreateResponse } from "v0-sdk";
import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type CreateChatResult =
  | { success: true; chatId: string; url: string; demoUrl?: string }
  | { success: false; error: string };

export type CreateChatCoreInput = {
  message: string;
  system?: string;
};

export async function createChatStep(
  input: CreateChatCoreInput,
): Promise<CreateChatResult> {
  "use step";
  const credentials = await fetchCredentials("v0");
  const apiKey = credentials.V0_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error:
        "V0_API_KEY is not configured. Please add it in Project Integrations.",
    };
  }

  try {
    const client = createClient({ apiKey });

    const result = (await client.chats.create({
      message: input.message,
      system: input.system,
    })) as ChatsCreateResponse;

    return {
      success: true,
      chatId: result.id,
      url: result.webUrl,
      demoUrl: result.latestVersion?.demoUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: \`Failed to create chat: \${getErrorMessage(error)}\`,
    };
  }
}
`,
    "v0/send-message": `import { createClient, type ChatsSendMessageResponse } from "v0-sdk";
import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type SendMessageResult =
  | { success: true; chatId: string; demoUrl?: string }
  | { success: false; error: string };

export type SendMessageCoreInput = {
  chatId: string;
  message: string;
};

export async function sendMessageStep(
  input: SendMessageCoreInput,
): Promise<SendMessageResult> {
  "use step";
  const credentials = await fetchCredentials("v0");
  const apiKey = credentials.V0_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error:
        "V0_API_KEY is not configured. Please add it in Project Integrations.",
    };
  }

  try {
    const client = createClient({ apiKey });

    const result = (await client.chats.sendMessage({
      chatId: input.chatId,
      message: input.message,
    })) as ChatsSendMessageResponse;

    return {
      success: true,
      chatId: result.id,
      demoUrl: result.latestVersion?.demoUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: \`Failed to send message: \${getErrorMessage(error)}\`,
    };
  }
}
`,
    "webflow/list-sites": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type ListSitesResult =
  | { success: true; data: { sites: SiteData[]; count: number } }
  | { success: false; error: { message: string } };

export type ListSitesCoreInput = Record<string, never>;

export async function listSitesStep(
  input: ListSitesCoreInput,
): Promise<ListSitesResult> {
  "use step";
  const credentials = await fetchCredentials("webflow");
  const apiKey = credentials.WEBFLOW_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: {
        message:
          "WEBFLOW_API_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  try {
    const response = await fetch(\`\${WEBFLOW_API_URL}/sites\`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: \`Bearer \${apiKey}\`,
      },
    });

    if (!response.ok) {
      const errorData = (await response.json()) as { message?: string };
      return {
        success: false,
        error: { message: errorData.message || \`HTTP \${response.status}\` },
      };
    }

    const data = (await response.json()) as { sites: WebflowSite[] };

    const sites = data.sites.map((site) => ({
      id: site.id,
      displayName: site.displayName,
      shortName: site.shortName,
      previewUrl: site.previewUrl,
      lastPublished: site.lastPublished,
      lastUpdated: site.lastUpdated,
      customDomains: site.customDomains?.map((d) => d.url) || [],
    }));

    return {
      success: true,
      data: { sites, count: sites.length },
    };
  } catch (error) {
    return {
      success: false,
      error: { message: \`Failed to list sites: \${getErrorMessage(error)}\` },
    };
  }
}
`,
    "webflow/get-site": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type GetSiteResult =
  | { success: true; data: GetSiteData }
  | { success: false; error: { message: string } };

export type GetSiteCoreInput = {
  siteId: string;
};

export async function getSiteStep(
  input: GetSiteCoreInput,
): Promise<GetSiteResult> {
  "use step";
  const credentials = await fetchCredentials("webflow");
  const apiKey = credentials.WEBFLOW_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: {
        message:
          "WEBFLOW_API_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  if (!input.siteId) {
    return {
      success: false,
      error: { message: "Site ID is required" },
    };
  }

  try {
    const response = await fetch(
      \`\${WEBFLOW_API_URL}/sites/\${encodeURIComponent(input.siteId)}\`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: \`Bearer \${apiKey}\`,
        },
      },
    );

    if (!response.ok) {
      const errorData = (await response.json()) as { message?: string };
      return {
        success: false,
        error: { message: errorData.message || \`HTTP \${response.status}\` },
      };
    }

    const site = (await response.json()) as WebflowSiteResponse;

    return {
      success: true,
      data: {
        id: site.id,
        displayName: site.displayName,
        shortName: site.shortName,
        previewUrl: site.previewUrl,
        lastPublished: site.lastPublished,
        lastUpdated: site.lastUpdated,
        timeZone: site.timeZone,
        customDomains: site.customDomains || [],
      },
    };
  } catch (error) {
    return {
      success: false,
      error: { message: \`Failed to get site: \${getErrorMessage(error)}\` },
    };
  }
}
`,
    "webflow/publish-site": `import { fetchCredentials } from "./lib/credential-helper";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type PublishSiteResult =
  | {
      success: true;
      data: { publishedDomains: string[]; publishedToSubdomain: boolean };
    }
  | { success: false; error: { message: string } };

export type PublishSiteCoreInput = {
  siteId: string;
  publishToWebflowSubdomain?: string;
  customDomainIds?: string;
};

export async function publishSiteStep(
  input: PublishSiteCoreInput,
): Promise<PublishSiteResult> {
  "use step";
  const credentials = await fetchCredentials("webflow");
  const apiKey = credentials.WEBFLOW_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: {
        message:
          "WEBFLOW_API_KEY is not configured. Please add it in Project Integrations.",
      },
    };
  }

  if (!input.siteId) {
    return {
      success: false,
      error: { message: "Site ID is required" },
    };
  }

  try {
    const body: {
      publishToWebflowSubdomain?: boolean;
      customDomains?: string[];
    } = {};

    // Parse custom domain IDs if provided
    const customDomains = input.customDomainIds
      ? input.customDomainIds
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean)
      : [];

    if (customDomains.length > 0) {
      body.customDomains = customDomains;
    }

    // Default to publishing to subdomain if no custom domains specified
    // or if explicitly set to true
    const publishToSubdomain =
      input.publishToWebflowSubdomain === "false" ? false : true;

    if (publishToSubdomain || customDomains.length === 0) {
      body.publishToWebflowSubdomain = true;
    } else {
      body.publishToWebflowSubdomain = false;
    }

    const response = await fetch(
      \`\${WEBFLOW_API_URL}/sites/\${encodeURIComponent(input.siteId)}/publish\`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: \`Bearer \${apiKey}\`,
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      const errorData = (await response.json()) as { message?: string };
      return {
        success: false,
        error: { message: errorData.message || \`HTTP \${response.status}\` },
      };
    }

    const result = (await response.json()) as PublishResponse;

    return {
      success: true,
      data: {
        publishedDomains: result.customDomains?.map((d) => d.url) || [],
        publishedToSubdomain: result.publishToWebflowSubdomain ?? false,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: { message: \`Failed to publish site: \${getErrorMessage(error)}\` },
    };
  }
}
`
};
function getAutoGeneratedTemplate(actionId) {
    return AUTO_GENERATED_TEMPLATES[actionId];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/output-display-configs.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Output Display Configs (Auto-Generated)
 *
 * This file is automatically generated by scripts/discover-plugins.ts
 * DO NOT EDIT MANUALLY - your changes will be overwritten!
 *
 * This file is CLIENT-SAFE and can be imported in client components.
 * It maps action IDs to their output display configuration.
 *
 * Generated configs: 8
 */ __turbopack_context__.s([
    "OUTPUT_DISPLAY_CONFIGS",
    ()=>OUTPUT_DISPLAY_CONFIGS,
    "getOutputDisplayConfig",
    ()=>getOutputDisplayConfig
]);
const OUTPUT_DISPLAY_CONFIGS = {
    "ai-gateway/generate-image": {
        type: "image",
        field: "base64"
    },
    "fal/generate-image": {
        type: "image",
        field: "imageUrl"
    },
    "fal/generate-video": {
        type: "video",
        field: "videoUrl"
    },
    "fal/upscale-image": {
        type: "image",
        field: "imageUrl"
    },
    "fal/remove-background": {
        type: "image",
        field: "imageUrl"
    },
    "fal/image-to-image": {
        type: "image",
        field: "imageUrl"
    },
    "v0/create-chat": {
        type: "url",
        field: "demoUrl"
    },
    "v0/send-message": {
        type: "url",
        field: "demoUrl"
    }
};
function getOutputDisplayConfig(actionType) {
    return OUTPUT_DISPLAY_CONFIGS[actionType];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/utils/time.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getRelativeTime",
    ()=>getRelativeTime
]);
function formatTimeDifference(value, unit) {
    return `${value} ${unit}${value === 1 ? "" : "s"} ago`;
}
function getRelativeTime(date) {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    if (diffInSeconds < 60) {
        return "just now";
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return formatTimeDifference(diffInMinutes, "min");
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return formatTimeDifference(diffInHours, "hour");
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return formatTimeDifference(diffInDays, "day");
    }
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return formatTimeDifference(diffInWeeks, "week");
    }
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return formatTimeDifference(diffInMonths, "month");
    }
    const diffInYears = Math.floor(diffInDays / 365);
    return formatTimeDifference(diffInYears, "year");
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Vercel deployment configuration
__turbopack_context__.s([
    "VERCEL_DEPLOY_BUTTON_URL",
    ()=>VERCEL_DEPLOY_BUTTON_URL,
    "VERCEL_DEPLOY_URL",
    ()=>VERCEL_DEPLOY_URL
]);
const VERCEL_DEPLOY_URL = "https://vercel.new/workflow-builder";
const VERCEL_DEPLOY_BUTTON_URL = `[![Deploy with Vercel](https://vercel.com/button)](${VERCEL_DEPLOY_URL})`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/utils/format-number.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Formats a number into an abbreviated form (e.g., 1.1k, 2.5M)
 *
 * @param num - The number to format
 * @returns The formatted string
 *
 * @example
 * formatAbbreviatedNumber(1109) // "1.1k"
 * formatAbbreviatedNumber(1500) // "1.5k"
 * formatAbbreviatedNumber(1000000) // "1M"
 * formatAbbreviatedNumber(500) // "500"
 */ __turbopack_context__.s([
    "formatAbbreviatedNumber",
    ()=>formatAbbreviatedNumber
]);
function formatAbbreviatedNumber(num) {
    if (num >= 1_000_000) {
        const formatted = (num / 1_000_000).toFixed(1);
        // Remove .0 if present
        return formatted.endsWith(".0") ? `${Math.floor(num / 1_000_000)}M` : `${formatted}M`;
    }
    if (num >= 1000) {
        const formatted = (num / 1000).toFixed(1);
        // Remove .0 if present
        return formatted.endsWith(".0") ? `${Math.floor(num / 1000)}k` : `${formatted}k`;
    }
    return num.toString();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/use-touch.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useIsTouch",
    ()=>useIsTouch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useIsTouch() {
    _s();
    const [isTouch, setIsTouch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(undefined);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useIsTouch.useEffect": ()=>{
            const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0 || // @ts-expect-error - msMaxTouchPoints is IE-specific
            navigator.msMaxTouchPoints > 0;
            setIsTouch(hasTouch);
        }
    }["useIsTouch.useEffect"], []);
    return isTouch;
}
_s(useIsTouch, "SiglgD3fuA34Zw1K7YWP5A5jl70=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/theme-toggle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeToggle",
    ()=>ThemeToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom_240c807d63df3e5f63e6bf0e23d1485e$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-themes@0.4.6_react-dom_240c807d63df3e5f63e6bf0e23d1485e/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const seg = (active)=>({
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '6px 8px',
        borderRadius: 9,
        border: 'none',
        cursor: 'pointer',
        fontSize: 11.5,
        fontWeight: active ? 700 : 550,
        fontFamily: 'inherit',
        color: active ? 'var(--sx-accent)' : 'var(--sx-muted)',
        background: active ? 'var(--sx-surface)' : 'transparent',
        boxShadow: active ? 'var(--sx-shadow-in)' : 'none',
        transition: 'color 160ms ease-out'
    });
function ThemeToggle({ collapsed = false }) {
    _s();
    const { resolvedTheme, setTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom_240c807d63df3e5f63e6bf0e23d1485e$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Theme is only known on the client — render a stable placeholder until mount
    // so SSR and the first client paint match (no hydration warning).
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeToggle.useEffect": ()=>setMounted(true)
    }["ThemeToggle.useEffect"], []);
    const isDark = mounted && resolvedTheme === 'dark';
    if (collapsed) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "button",
            onClick: ()=>setTheme(isDark ? 'light' : 'dark'),
            title: isDark ? 'Switch to light theme' : 'Switch to dark theme',
            "aria-label": isDark ? 'Switch to light theme' : 'Switch to dark theme',
            style: {
                width: 40,
                height: 40,
                borderRadius: 12,
                border: 'none',
                background: 'var(--sx-raised)',
                boxShadow: 'var(--sx-shadow-sm)',
                color: 'var(--sx-muted)',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto'
            },
            children: isDark ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                size: 15
            }, void 0, false, {
                fileName: "[project]/components/theme-toggle.tsx",
                lineNumber: 70,
                columnNumber: 19
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                size: 15
            }, void 0, false, {
                fileName: "[project]/components/theme-toggle.tsx",
                lineNumber: 70,
                columnNumber: 40
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/theme-toggle.tsx",
            lineNumber: 51,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "group",
        "aria-label": "Theme",
        style: {
            display: 'flex',
            gap: 4,
            padding: 4,
            borderRadius: 12,
            background: 'var(--sx-surface)',
            boxShadow: 'var(--sx-shadow-in)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>setTheme('light'),
                style: seg(mounted && !isDark),
                "aria-pressed": mounted && !isDark,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                        size: 14
                    }, void 0, false, {
                        fileName: "[project]/components/theme-toggle.tsx",
                        lineNumber: 89,
                        columnNumber: 9
                    }, this),
                    " Light"
                ]
            }, void 0, true, {
                fileName: "[project]/components/theme-toggle.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>setTheme('dark'),
                style: seg(isDark),
                "aria-pressed": isDark,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                        size: 14
                    }, void 0, false, {
                        fileName: "[project]/components/theme-toggle.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this),
                    " Dark"
                ]
            }, void 0, true, {
                fileName: "[project]/components/theme-toggle.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/theme-toggle.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
_s(ThemeToggle, "t8+WCtmY6Q/K+YFmVfyga28+HWc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom_240c807d63df3e5f63e6bf0e23d1485e$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = ThemeToggle;
var _c;
__turbopack_context__.k.register(_c, "ThemeToggle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/neumorphic-sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NEU",
    ()=>NEU,
    "NeuButton",
    ()=>NeuButton,
    "NeuRow",
    ()=>NeuRow,
    "NeuSectionLabel",
    ()=>NeuSectionLabel,
    "NeuSidebarHeader",
    ()=>NeuSidebarHeader,
    "NeumorphicSidebar",
    ()=>NeumorphicSidebar,
    "sidebarCollapsedAtom",
    ()=>sidebarCollapsedAtom
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2f$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/vanilla/utils.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jotai@2.15.1_@babel+core@7._5b27b7b535d6519f6427fc26ba88e66f/node_modules/jotai/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/theme-toggle.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const sidebarCollapsedAtom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$vanilla$2f$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atomWithStorage"])('inscope.sidebar.collapsed', false);
const NEU = {
    bg: 'var(--sx-surface)',
    surface: 'var(--sx-raised)',
    text: 'var(--sx-ink)',
    muted: 'var(--sx-muted)',
    faint: 'var(--sx-faint)',
    accent: 'var(--sx-accent)',
    shadowOut: 'var(--sx-shadow-out)',
    shadowSm: 'var(--sx-shadow-sm)',
    shadowIn: 'var(--sx-shadow-in)'
};
const COLLAPSED_W = 60;
const toggleStyle = {
    width: 28,
    height: 28,
    borderRadius: 9,
    border: 'none',
    background: NEU.surface,
    boxShadow: NEU.shadowSm,
    color: NEU.muted,
    cursor: 'pointer',
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0
};
function NeumorphicSidebar({ header, footer, children, width = 248, floating = false, contentClassName, collapseHideLabels = false }) {
    _s();
    const [collapsed, setCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"])(sidebarCollapsedAtom);
    const w = collapsed ? COLLAPSED_W : width;
    // NB: `absolute` (floating) IS a positioning context for the absolute toggle,
    // so we don't add `relative` on top of it (that would clobber the stretch).
    const posClass = floating ? 'pointer-events-auto absolute left-3 top-16 bottom-3 z-30' : 'relative shrink-0';
    // For raw content (the Builder toolbar): force every descendant's text to 0
    // (the buttons set their own font-size, so a parent text-[0px] won't cascade),
    // which hides labels while the fixed-size SVG icons stay.
    const rawIconCls = collapsed && collapseHideLabels ? 'items-center [&_*]:!text-[0px] [&_.neu-action]:!justify-center [&_.neu-action]:!px-0 [&_.neu-action]:!gap-0' : '';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: `flex flex-col ${posClass}`,
        style: {
            width: w,
            margin: floating ? 0 : 12,
            borderRadius: 20,
            background: NEU.bg,
            boxShadow: 'none',
            overflow: 'hidden',
            transition: 'width 220ms cubic-bezier(0.23,1,0.32,1)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `.neu-row:hover { background: var(--sx-hover-tint) !important; }`
            }, void 0, false, {
                fileName: "[project]/components/neumorphic-sidebar.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            collapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-center shrink-0",
                style: {
                    padding: '12px 0 8px'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setCollapsed(false),
                    title: "Expand sidebar",
                    "aria-label": "Expand sidebar",
                    style: toggleStyle,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                        size: 15
                    }, void 0, false, {
                        fileName: "[project]/components/neumorphic-sidebar.tsx",
                        lineNumber: 61,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/neumorphic-sidebar.tsx",
                    lineNumber: 60,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/neumorphic-sidebar.tsx",
                lineNumber: 59,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            zIndex: 3
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setCollapsed(true),
                            title: "Collapse sidebar",
                            "aria-label": "Collapse sidebar",
                            style: toggleStyle,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                size: 15
                            }, void 0, false, {
                                fileName: "[project]/components/neumorphic-sidebar.tsx",
                                lineNumber: 68,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/neumorphic-sidebar.tsx",
                            lineNumber: 67,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/neumorphic-sidebar.tsx",
                        lineNumber: 66,
                        columnNumber: 11
                    }, this),
                    header && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "shrink-0",
                        style: {
                            padding: '16px 46px 10px 16px'
                        },
                        children: header
                    }, void 0, false, {
                        fileName: "[project]/components/neumorphic-sidebar.tsx",
                        lineNumber: 71,
                        columnNumber: 22
                    }, this)
                ]
            }, void 0, true),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `flex-1 overflow-y-auto flex flex-col ${rawIconCls} ${contentClassName ?? ''}`,
                style: {
                    padding: collapsed ? '2px 8px 12px' : '4px 10px 12px',
                    scrollbarWidth: 'thin'
                },
                children: children
            }, void 0, false, {
                fileName: "[project]/components/neumorphic-sidebar.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "shrink-0",
                style: {
                    padding: collapsed ? '6px 8px 10px' : '8px 12px 10px'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeToggle"], {
                    collapsed: collapsed
                }, void 0, false, {
                    fileName: "[project]/components/neumorphic-sidebar.tsx",
                    lineNumber: 79,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/neumorphic-sidebar.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this),
            !collapsed && footer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "shrink-0",
                style: {
                    padding: '0 12px 12px'
                },
                children: footer
            }, void 0, false, {
                fileName: "[project]/components/neumorphic-sidebar.tsx",
                lineNumber: 82,
                columnNumber: 32
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/neumorphic-sidebar.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_s(NeumorphicSidebar, "/vdFswE6/e2M9z1uCUeO9wS34L4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtom"]
    ];
});
_c = NeumorphicSidebar;
function NeuSidebarHeader({ title, subtitle, dotColor = NEU.accent }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            background: dotColor
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/neumorphic-sidebar.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 13,
                            fontWeight: 700,
                            color: NEU.text,
                            letterSpacing: '-0.01em'
                        },
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/components/neumorphic-sidebar.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/neumorphic-sidebar.tsx",
                lineNumber: 90,
                columnNumber: 7
            }, this),
            subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 11,
                    color: NEU.faint,
                    marginTop: 2,
                    marginLeft: 15
                },
                children: subtitle
            }, void 0, false, {
                fileName: "[project]/components/neumorphic-sidebar.tsx",
                lineNumber: 94,
                columnNumber: 20
            }, this)
        ]
    }, void 0, true);
}
_c1 = NeuSidebarHeader;
function NeuSectionLabel({ children }) {
    _s1();
    const collapsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"])(sidebarCollapsedAtom);
    if (collapsed) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            height: 1,
            background: 'var(--sx-divider)',
            margin: '7px 6px'
        }
    }, void 0, false, {
        fileName: "[project]/components/neumorphic-sidebar.tsx",
        lineNumber: 101,
        columnNumber: 25
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            fontSize: 10,
            fontWeight: 650,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: NEU.faint,
            padding: '10px 8px 5px'
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/components/neumorphic-sidebar.tsx",
        lineNumber: 102,
        columnNumber: 10
    }, this);
}
_s1(NeuSectionLabel, "vtR2c2qPeIJXqPisig/bfdk9vnA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"]
    ];
});
_c2 = NeuSectionLabel;
const iconSquare = (active)=>({
        width: 24,
        height: 24,
        borderRadius: 8,
        background: NEU.surface,
        boxShadow: NEU.shadowSm,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: active ? NEU.accent : NEU.muted
    });
const ROW = {
    padding: '8px 9px',
    borderRadius: 10,
    border: 'none',
    marginBottom: 2,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
    textAlign: 'left'
};
function NeuRow({ icon, rawIcon, label, sub, active, badge, dim, onClick }) {
    _s2();
    const collapsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"])(sidebarCollapsedAtom);
    if (collapsed) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onClick,
            disabled: dim,
            title: label,
            className: "neu-row",
            style: {
                width: 40,
                height: 40,
                borderRadius: 11,
                border: 'none',
                background: active ? 'var(--sx-accent-soft)' : 'transparent',
                display: 'grid',
                placeItems: 'center',
                margin: '2px auto',
                cursor: dim ? 'default' : 'pointer',
                opacity: dim ? 0.5 : 1
            },
            children: rawIcon ?? (icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: iconSquare(active),
                children: icon
            }, void 0, false, {
                fileName: "[project]/components/neumorphic-sidebar.tsx",
                lineNumber: 115,
                columnNumber: 30
            }, this))
        }, void 0, false, {
            fileName: "[project]/components/neumorphic-sidebar.tsx",
            lineNumber: 114,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        disabled: dim,
        className: "neu-row",
        style: {
            ...ROW,
            background: active ? 'var(--sx-accent-soft)' : 'transparent',
            opacity: dim ? 0.5 : 1,
            cursor: dim ? 'default' : 'pointer'
        },
        children: [
            rawIcon ?? (icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: iconSquare(active),
                children: icon
            }, void 0, false, {
                fileName: "[project]/components/neumorphic-sidebar.tsx",
                lineNumber: 121,
                columnNumber: 28
            }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "min-w-0 flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            display: 'block',
                            fontSize: 12.5,
                            fontWeight: active ? 650 : 600,
                            color: active ? NEU.accent : NEU.text,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        },
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/components/neumorphic-sidebar.tsx",
                        lineNumber: 123,
                        columnNumber: 9
                    }, this),
                    sub && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            display: 'block',
                            fontSize: 10.5,
                            color: NEU.muted,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        },
                        children: sub
                    }, void 0, false, {
                        fileName: "[project]/components/neumorphic-sidebar.tsx",
                        lineNumber: 124,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/neumorphic-sidebar.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this),
            badge
        ]
    }, void 0, true, {
        fileName: "[project]/components/neumorphic-sidebar.tsx",
        lineNumber: 120,
        columnNumber: 5
    }, this);
}
_s2(NeuRow, "vtR2c2qPeIJXqPisig/bfdk9vnA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"]
    ];
});
_c3 = NeuRow;
function NeuButton({ icon, label, onClick }) {
    _s3();
    const collapsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"])(sidebarCollapsedAtom);
    if (collapsed) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onClick,
            title: label,
            style: {
                width: 40,
                height: 40,
                borderRadius: 12,
                border: 'none',
                background: NEU.surface,
                boxShadow: NEU.shadowSm,
                color: NEU.text,
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 4px'
            },
            children: icon
        }, void 0, false, {
            fileName: "[project]/components/neumorphic-sidebar.tsx",
            lineNumber: 135,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        className: "w-full flex items-center gap-2",
        style: {
            padding: '9px 12px',
            borderRadius: 12,
            border: 'none',
            background: NEU.surface,
            boxShadow: NEU.shadowSm,
            color: NEU.text,
            fontSize: 12.5,
            fontWeight: 600,
            cursor: 'pointer'
        },
        children: [
            icon,
            " ",
            label
        ]
    }, void 0, true, {
        fileName: "[project]/components/neumorphic-sidebar.tsx",
        lineNumber: 141,
        columnNumber: 5
    }, this);
}
_s3(NeuButton, "vtR2c2qPeIJXqPisig/bfdk9vnA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jotai$40$2$2e$15$2e$1_$40$babel$2b$core$40$7$2e$_5b27b7b535d6519f6427fc26ba88e66f$2f$node_modules$2f$jotai$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAtomValue"]
    ];
});
_c4 = NeuButton;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "NeumorphicSidebar");
__turbopack_context__.k.register(_c1, "NeuSidebarHeader");
__turbopack_context__.k.register(_c2, "NeuSectionLabel");
__turbopack_context__.k.register(_c3, "NeuRow");
__turbopack_context__.k.register(_c4, "NeuButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/deploy-button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DeployButton",
    ()=>DeployButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.ts [app-client] (ecmascript)");
"use client";
;
;
;
function DeployButton() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
        asChild: true,
        className: "h-9 gap-1.5 border px-2 sm:px-3",
        size: "sm",
        variant: "secondary",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
            href: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VERCEL_DEPLOY_URL"],
            rel: "noopener noreferrer",
            target: "_blank",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    "aria-label": "Vercel logomark",
                    className: "size-3.5",
                    fill: "currentColor",
                    viewBox: "0 0 76 76",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                            children: "Vercel logomark"
                        }, void 0, false, {
                            fileName: "[project]/components/deploy-button.tsx",
                            lineNumber: 21,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "m38 0 38 66H0z"
                        }, void 0, false, {
                            fileName: "[project]/components/deploy-button.tsx",
                            lineNumber: 22,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/deploy-button.tsx",
                    lineNumber: 15,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-sm sm:hidden",
                    children: "Deploy"
                }, void 0, false, {
                    fileName: "[project]/components/deploy-button.tsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "hidden text-sm sm:inline",
                    children: "Deploy Your Own"
                }, void 0, false, {
                    fileName: "[project]/components/deploy-button.tsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/deploy-button.tsx",
            lineNumber: 14,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/deploy-button.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
_c = DeployButton;
var _c;
__turbopack_context__.k.register(_c, "DeployButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/icons/github-icon.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GitHubIcon",
    ()=>GitHubIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function GitHubIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        "aria-label": "GitHub",
        className: className,
        fill: "currentColor",
        role: "img",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
        }, void 0, false, {
            fileName: "[project]/components/icons/github-icon.tsx",
            lineNumber: 10,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/icons/github-icon.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
_c = GitHubIcon;
var _c;
__turbopack_context__.k.register(_c, "GitHubIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/github-stars-button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GitHubStarsButton",
    ()=>GitHubStarsButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2f$github$2d$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/icons/github-icon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2d$number$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/format-number.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$github$2d$stars$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/github-stars-provider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const GITHUB_REPO_URL = "https://github.com/vercel-labs/workflow-builder-template";
function GitHubStarsButton() {
    _s();
    const stars = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$github$2d$stars$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGitHubStars"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
        asChild: true,
        className: "h-9 gap-1.5 px-2 sm:px-3",
        size: "sm",
        variant: "ghost",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
            className: "flex items-center",
            href: GITHUB_REPO_URL,
            rel: "noopener noreferrer",
            target: "_blank",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2f$github$2d$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GitHubIcon"], {
                    className: "size-4.5"
                }, void 0, false, {
                    fileName: "[project]/components/github-stars-button.tsx",
                    lineNumber: 27,
                    columnNumber: 9
                }, this),
                stars !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "hidden text-sm sm:inline",
                    children: [
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2d$number$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatAbbreviatedNumber"])(stars),
                        " stars"
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/github-stars-button.tsx",
                    lineNumber: 29,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/github-stars-button.tsx",
            lineNumber: 21,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/github-stars-button.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_s(GitHubStarsButton, "0sk3luPSpFeP9tV1bBtKXo4NPaE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$github$2d$stars$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGitHubStars"]
    ];
});
_c = GitHubStarsButton;
var _c;
__turbopack_context__.k.register(_c, "GitHubStarsButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/workflows/user-menu.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UserMenu",
    ()=>UserMenu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Key$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/key.js [app-client] (ecmascript) <export default as Key>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plug$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plug$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/plug.js [app-client] (ecmascript) <export default as Plug>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom_240c807d63df3e5f63e6bf0e23d1485e$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-themes@0.4.6_react-dom_240c807d63df3e5f63e6bf0e23d1485e/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._bc0e796ca3d7ea4640f9d74c95225eb3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$auth$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/platform/auth/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$settings$2f$api$2d$keys$2d$overlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/platform/settings/api-keys-overlay.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$settings$2f$integrations$2d$overlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/platform/settings/integrations-overlay.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$overlays$2f$overlay$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/ui/overlays/overlay-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$settings$2f$settings$2d$overlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/platform/settings/settings-overlay.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/ui/avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/ui/dropdown-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/platform/api-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$auth$2f$auth$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/platform/auth/auth-client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
const UserMenu = ()=>{
    _s();
    const { data: session, isPending } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$auth$2f$auth$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"])();
    const { theme, setTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom_240c807d63df3e5f63e6bf0e23d1485e$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const { open: openOverlay } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$overlays$2f$overlay$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOverlay"])();
    const [providerId, setProviderId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Fetch provider info when session is available
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UserMenu.useEffect": ()=>{
            if (session?.user && !session.user.name?.startsWith("Anonymous")) {
                __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].user.get().then({
                    "UserMenu.useEffect": (user)=>setProviderId(user.providerId)
                }["UserMenu.useEffect"]).catch({
                    "UserMenu.useEffect": ()=>setProviderId(null)
                }["UserMenu.useEffect"]);
            }
        }
    }["UserMenu.useEffect"], [
        session?.user
    ]);
    const handleLogout = async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$auth$2f$auth$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])();
    };
    // OAuth users can't edit their profile
    const isOAuthUser = providerId === "vercel" || providerId === "github" || providerId === "google";
    const getUserInitials = ()=>{
        if (session?.user?.name) {
            return session.user.name.split(" ").map((n)=>n[0]).join("").toUpperCase().slice(0, 2);
        }
        if (session?.user?.email) {
            return session.user.email.slice(0, 2).toUpperCase();
        }
        return "U";
    };
    const signInInProgress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$auth$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSingleProviderSignInInitiated"])();
    // Don't render anything while session is loading to prevent flash
    // BUT if sign-in is in progress, keep showing the AuthDialog with loading state
    if (isPending && !signInInProgress) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-9 w-9"
        }, void 0, false, {
            fileName: "[project]/components/workflows/user-menu.tsx",
            lineNumber: 79,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    // Check if user is anonymous
    // Better Auth anonymous plugin creates users with name "Anonymous" and temp- email
    const isAnonymous = !session?.user || session.user.name === "Anonymous" || session.user.email?.startsWith("temp-");
    // Show Sign In button if user is anonymous or not logged in
    if (isAnonymous) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-2",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$auth$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthDialog"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    className: "h-9 disabled:opacity-100 disabled:[&>*]:text-muted-foreground",
                    size: "sm",
                    variant: "default",
                    children: "Sign In"
                }, void 0, false, {
                    fileName: "[project]/components/workflows/user-menu.tsx",
                    lineNumber: 95,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/workflows/user-menu.tsx",
                lineNumber: 94,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/components/workflows/user-menu.tsx",
            lineNumber: 93,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    className: "relative h-9 w-9 rounded-full border p-0",
                    variant: "ghost",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                        className: "h-9 w-9",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarImage"], {
                                alt: session?.user?.name || "",
                                src: session?.user?.image || ""
                            }, void 0, false, {
                                fileName: "[project]/components/workflows/user-menu.tsx",
                                lineNumber: 115,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                children: getUserInitials()
                            }, void 0, false, {
                                fileName: "[project]/components/workflows/user-menu.tsx",
                                lineNumber: 119,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workflows/user-menu.tsx",
                        lineNumber: 114,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/components/workflows/user-menu.tsx",
                    lineNumber: 110,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/workflows/user-menu.tsx",
                lineNumber: 109,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                align: "end",
                className: "w-56",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuLabel"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col space-y-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-medium text-sm leading-none",
                                    children: session?.user?.name || "User"
                                }, void 0, false, {
                                    fileName: "[project]/components/workflows/user-menu.tsx",
                                    lineNumber: 126,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-muted-foreground text-xs leading-none",
                                    children: session?.user?.email
                                }, void 0, false, {
                                    fileName: "[project]/components/workflows/user-menu.tsx",
                                    lineNumber: 129,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/workflows/user-menu.tsx",
                            lineNumber: 125,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/components/workflows/user-menu.tsx",
                        lineNumber: 124,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                        fileName: "[project]/components/workflows/user-menu.tsx",
                        lineNumber: 134,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    !isOAuthUser && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                        onClick: ()=>openOverlay(__TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$settings$2f$settings$2d$overlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsOverlay"]),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                className: "size-4"
                            }, void 0, false, {
                                fileName: "[project]/components/workflows/user-menu.tsx",
                                lineNumber: 137,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Settings"
                            }, void 0, false, {
                                fileName: "[project]/components/workflows/user-menu.tsx",
                                lineNumber: 138,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workflows/user-menu.tsx",
                        lineNumber: 136,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                        onClick: ()=>openOverlay(__TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$settings$2f$integrations$2d$overlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IntegrationsOverlay"]),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plug$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plug$3e$__["Plug"], {
                                className: "size-4"
                            }, void 0, false, {
                                fileName: "[project]/components/workflows/user-menu.tsx",
                                lineNumber: 142,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Connections"
                            }, void 0, false, {
                                fileName: "[project]/components/workflows/user-menu.tsx",
                                lineNumber: 143,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workflows/user-menu.tsx",
                        lineNumber: 141,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                        onClick: ()=>openOverlay(__TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$settings$2f$api$2d$keys$2d$overlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiKeysOverlay"]),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Key$3e$__["Key"], {
                                className: "size-4"
                            }, void 0, false, {
                                fileName: "[project]/components/workflows/user-menu.tsx",
                                lineNumber: 146,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "API Keys"
                            }, void 0, false, {
                                fileName: "[project]/components/workflows/user-menu.tsx",
                                lineNumber: 147,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workflows/user-menu.tsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSub"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSubTrigger"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                                        className: "dark:-rotate-90 size-4 rotate-0 scale-100 transition-all dark:scale-0"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workflows/user-menu.tsx",
                                        lineNumber: 151,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                                        className: "absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workflows/user-menu.tsx",
                                        lineNumber: 152,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Theme"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workflows/user-menu.tsx",
                                        lineNumber: 153,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workflows/user-menu.tsx",
                                lineNumber: 150,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSubContent"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuRadioGroup"], {
                                    onValueChange: setTheme,
                                    value: theme,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuRadioItem"], {
                                            value: "light",
                                            children: "Light"
                                        }, void 0, false, {
                                            fileName: "[project]/components/workflows/user-menu.tsx",
                                            lineNumber: 157,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuRadioItem"], {
                                            value: "dark",
                                            children: "Dark"
                                        }, void 0, false, {
                                            fileName: "[project]/components/workflows/user-menu.tsx",
                                            lineNumber: 158,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuRadioItem"], {
                                            value: "system",
                                            children: "System"
                                        }, void 0, false, {
                                            fileName: "[project]/components/workflows/user-menu.tsx",
                                            lineNumber: 159,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/workflows/user-menu.tsx",
                                    lineNumber: 156,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/components/workflows/user-menu.tsx",
                                lineNumber: 155,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workflows/user-menu.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                        fileName: "[project]/components/workflows/user-menu.tsx",
                        lineNumber: 165,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                        onClick: handleLogout,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                className: "size-4"
                            }, void 0, false, {
                                fileName: "[project]/components/workflows/user-menu.tsx",
                                lineNumber: 167,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_bc0e796ca3d7ea4640f9d74c95225eb3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Logout"
                            }, void 0, false, {
                                fileName: "[project]/components/workflows/user-menu.tsx",
                                lineNumber: 168,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workflows/user-menu.tsx",
                        lineNumber: 166,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/workflows/user-menu.tsx",
                lineNumber: 123,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/workflows/user-menu.tsx",
        lineNumber: 108,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(UserMenu, "Ji4zI55aqap+l29xPX0Rb8F4pCw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$platform$2f$auth$2f$auth$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom_240c807d63df3e5f63e6bf0e23d1485e$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"],
        __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$ui$2f$overlays$2f$overlay$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOverlay"]
    ];
});
_c = UserMenu;
var _c;
__turbopack_context__.k.register(_c, "UserMenu");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_5d06df55._.js.map