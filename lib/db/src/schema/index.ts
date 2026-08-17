import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  vector,
} from "drizzle-orm/pg-core";



import { customAlphabet } from 'nanoid';
const generateId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 21);
export type IntegrationType = string;
// Better Auth tables
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  // Anonymous user tracking
  isAnonymous: boolean("is_anonymous").default(false),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// Workflow visibility type
export type WorkflowVisibility = "private" | "public";

// Workflows table with user association
export const workflows = pgTable("workflows", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  name: text("name").notNull(),
  description: text("description"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  // biome-ignore lint/suspicious/noExplicitAny: JSONB type - structure validated at application level
  nodes: jsonb("nodes").notNull().$type<any[]>(),
  // biome-ignore lint/suspicious/noExplicitAny: JSONB type - structure validated at application level
  edges: jsonb("edges").notNull().$type<any[]>(),
  visibility: text("visibility")
    .notNull()
    .default("private")
    .$type<WorkflowVisibility>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Integrations table for storing user credentials
export const integrations = pgTable("integrations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  type: text("type").notNull().$type<IntegrationType>(),
  // biome-ignore lint/suspicious/noExplicitAny: JSONB type - encrypted credentials stored as JSON
  config: jsonb("config").notNull().$type<any>(),
  // Whether this integration was created via OAuth (managed by app) vs manual entry
  isManaged: boolean("is_managed").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Workflow executions table to track workflow runs
export const workflowExecutions = pgTable("workflow_executions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  workflowId: text("workflow_id")
    .notNull()
    .references(() => workflows.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  status: text("status")
    .notNull()
    .$type<"pending" | "running" | "success" | "error" | "cancelled">(),
  // biome-ignore lint/suspicious/noExplicitAny: JSONB type - structure validated at application level
  input: jsonb("input").$type<Record<string, any>>(),
  // biome-ignore lint/suspicious/noExplicitAny: JSONB type - structure validated at application level
  output: jsonb("output").$type<any>(),
  error: text("error"),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  duration: text("duration"), // Duration in milliseconds
});

// Workflow execution logs to track individual node executions
export const workflowExecutionLogs = pgTable("workflow_execution_logs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  executionId: text("execution_id")
    .notNull()
    .references(() => workflowExecutions.id),
  nodeId: text("node_id").notNull(),
  nodeName: text("node_name").notNull(),
  nodeType: text("node_type").notNull(),
  status: text("status")
    .notNull()
    .$type<"pending" | "running" | "success" | "error">(),
  // biome-ignore lint/suspicious/noExplicitAny: JSONB type - structure validated at application level
  input: jsonb("input").$type<any>(),
  // biome-ignore lint/suspicious/noExplicitAny: JSONB type - structure validated at application level
  output: jsonb("output").$type<any>(),
  error: text("error"),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  duration: text("duration"), // Duration in milliseconds
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// API Keys table for webhook authentication
export const apiKeys = pgTable("api_keys", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name"), // Optional label for the API key
  keyHash: text("key_hash").notNull(), // Store hashed version of the key
  keyPrefix: text("key_prefix").notNull(), // Store first few chars for display (e.g., "wf_abc...")
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastUsedAt: timestamp("last_used_at"),
});

// Assistant memory — durable facts/preferences the AI chat is told to remember.
// Tenant boundary is user_id (enforced server-side). client_id / fiscal_year /
// workflow_id are optional SCOPE filters (null = applies globally for the user).
export type AssistantMemoryKind = "preference" | "fact" | "scope";
export type AssistantMemorySource = "user" | "assistant";

export const assistantMemories = pgTable("assistant_memories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  clientId: text("client_id"), // scope filter (null = global to the user)
  fiscalYear: integer("fiscal_year"), // scope filter (null = any year)
  workflowId: text("workflow_id"), // scope filter (null = any workflow)
  kind: text("kind").notNull().default("fact").$type<AssistantMemoryKind>(),
  subject: text("subject"), // short label, e.g. "FX rate", "reporting currency"
  content: text("content").notNull(), // the remembered fact/preference
  source: text("source").notNull().default("user").$type<AssistantMemorySource>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Chat persistence — saved Sina conversations (per-user, full-fidelity transcript).
// A thread is one conversation; a message row is the PROJECTED, serializable
// CopilotKit log entry (text + tool name/args/result) — NOT the raw message object,
// which carries a non-serializable generative-UI `render` closure. On reload the
// client re-associates each tool call's render from the live useCopilotAction
// registry, so only the serializable args need to be stored.
// ─────────────────────────────────────────────────────────────────────────────
export type ChatMessageRole = "user" | "assistant" | "tool" | "system";

/** One tool call within a message (generative-UI action, workflow run, etc.). */
export type ChatToolCall = {
  name: string;
  // biome-ignore lint/suspicious/noExplicitAny: JSONB payload - plain JSON args/result
  args?: any;
  // biome-ignore lint/suspicious/noExplicitAny: JSONB payload - plain JSON args/result
  result?: any;
  // Links an action-execution message to its result message on restore (the
  // ResultMessage.actionExecutionId / ActionExecutionMessage.id pairing).
  callId?: string;
};

/** The serializable projection of a CopilotKit message we persist. */
export type ChatMessageContent = {
  text?: string;
  toolCall?: ChatToolCall;
};

export const chatThreads = pgTable(
  "chat_threads",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    clientId: text("client_id"), // optional scope: the active client (null = unscoped)
    title: text("title"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    archivedAt: timestamp("archived_at"),
  },
  (t) => [
    // List a user's threads, most-recently-updated first.
    index("chat_threads_user_updated_idx").on(t.userId, t.updatedAt),
  ]
);

export const chatMessages = pgTable(
  "chat_messages",
  {
    // The CopilotKit message id (stable across turns) — upsert key, not app-generated.
    id: text("id").primaryKey(),
    threadId: text("thread_id")
      .notNull()
      .references(() => chatThreads.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id), // denormalized tenancy filter
    role: text("role").notNull().$type<ChatMessageRole>(),
    seq: integer("seq").notNull(), // ordering within the thread
    content: jsonb("content").notNull().$type<ChatMessageContent>(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    // Fetch a thread's messages in order.
    index("chat_messages_thread_seq_idx").on(t.threadId, t.seq),
  ]
);

// ─────────────────────────────────────────────────────────────────────────────
// Company documents — large files stored in Supabase Storage (bytes), with their
// metadata + processing status here. `storageKey` points at the object in
// `storageBucket`; the raw bytes never live in Postgres. Chunks + embeddings for
// retrieval live in `document_chunks` (added in the RAG phase).
// ─────────────────────────────────────────────────────────────────────────────
export type DocumentStatus = "uploading" | "processing" | "ready" | "failed";

export const documents = pgTable(
  "documents",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    clientId: text("client_id"), // optional scope: the owning client/company
    fileName: text("file_name").notNull(),
    mimeType: text("mime_type"),
    sizeBytes: integer("size_bytes"),
    storageBucket: text("storage_bucket").notNull(),
    storageKey: text("storage_key").notNull(),
    status: text("status").notNull().default("uploading").$type<DocumentStatus>(),
    // Whether this document is in Sina's active "Library" (searchable context). The
    // Documents page is the full repository; a doc is only retrieved by the RAG tool
    // when in_library is true, so the big dormant reference files can sit in storage
    // without polluting results until they're switched on. Defaults on for new uploads.
    inLibrary: boolean("in_library").notNull().default(true),
    extractedChars: integer("extracted_chars"),
    pageCount: integer("page_count"),
    error: text("error"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    // List a user's documents, newest first.
    index("documents_user_created_idx").on(t.userId, t.createdAt),
  ]
);

// ─────────────────────────────────────────────────────────────────────────────
// Document chunks — the RAG index. Each row is a slice of a document's text plus
// its embedding (pgvector). Retrieval embeds the query and finds the nearest
// chunks (cosine distance) scoped to the user/client. Cascade-deleted with the
// parent document. Embeddings are OpenAI text-embedding-3-small → 1536 dims.
// ─────────────────────────────────────────────────────────────────────────────
export const EMBEDDING_DIMENSIONS = 1536;

export const documentChunks = pgTable(
  "document_chunks",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    documentId: text("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id), // denormalized tenancy filter
    clientId: text("client_id"),
    chunkIndex: integer("chunk_index").notNull(),
    content: text("content").notNull(),
    tokens: integer("tokens"),
    embedding: vector("embedding", { dimensions: EMBEDDING_DIMENSIONS }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("document_chunks_document_idx").on(t.documentId),
    // Approximate-nearest-neighbour index for cosine similarity search.
    index("document_chunks_embedding_idx").using(
      "hnsw",
      t.embedding.op("vector_cosine_ops")
    ),
  ]
);

// ─────────────────────────────────────────────────────────────────────────────
// Ingest jobs — the DURABLE work queue for RAG document processing. Replaces the
// old fire-and-forget ingest, which was lost whenever the api-server restarted or
// redeployed mid-processing (the document was then stuck in `processing` forever).
// One row per queued/in-flight ingestion of a `documents` row. A worker claims the
// next runnable job with `FOR UPDATE SKIP LOCKED`; on a transient failure (a
// rate-limited embedding call, a network blip) it reschedules the job with
// exponential backoff via `runAfter` instead of failing the document. A crash
// mid-processing leaves the row `active` — the worker's reaper requeues rows whose
// `claimedAt` has gone stale, so no document is silently abandoned. Cascade-deleted
// with its parent document.
// ─────────────────────────────────────────────────────────────────────────────
export type IngestJobStatus = "queued" | "active" | "done" | "failed";

export const ingestJobs = pgTable(
  "ingest_jobs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    documentId: text("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    status: text("status").notNull().default("queued").$type<IngestJobStatus>(),
    attempts: integer("attempts").notNull().default(0),
    maxAttempts: integer("max_attempts").notNull().default(5),
    // When the job becomes eligible to run. Bumped forward for backoff on retry.
    runAfter: timestamp("run_after").notNull().defaultNow(),
    // Set when a worker claims the job; used by the reaper to detect stalls.
    claimedAt: timestamp("claimed_at"),
    lastError: text("last_error"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    // The worker's claim query scans by (status, runAfter) for the next job.
    index("ingest_jobs_claim_idx").on(t.status, t.runAfter),
    index("ingest_jobs_document_idx").on(t.documentId),
  ]
);

// Relations
export const workflowExecutionsRelations = relations(
  workflowExecutions,
  ({ one }) => ({
    workflow: one(workflows, {
      fields: [workflowExecutions.workflowId],
      references: [workflows.id],
    }),
  })
);

export const documentsRelations = relations(documents, ({ many }) => ({
  chunks: many(documentChunks),
}));

export const documentChunksRelations = relations(documentChunks, ({ one }) => ({
  document: one(documents, {
    fields: [documentChunks.documentId],
    references: [documents.id],
  }),
}));

export const chatThreadsRelations = relations(chatThreads, ({ many }) => ({
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  thread: one(chatThreads, {
    fields: [chatMessages.threadId],
    references: [chatThreads.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Workflow = typeof workflows.$inferSelect;
export type NewWorkflow = typeof workflows.$inferInsert;
export type Integration = typeof integrations.$inferSelect;
export type NewIntegration = typeof integrations.$inferInsert;
export type WorkflowExecution = typeof workflowExecutions.$inferSelect;
export type NewWorkflowExecution = typeof workflowExecutions.$inferInsert;
export type WorkflowExecutionLog = typeof workflowExecutionLogs.$inferSelect;
export type NewWorkflowExecutionLog = typeof workflowExecutionLogs.$inferInsert;
export type ApiKey = typeof apiKeys.$inferSelect;
export type NewApiKey = typeof apiKeys.$inferInsert;
export type AssistantMemory = typeof assistantMemories.$inferSelect;
export type NewAssistantMemory = typeof assistantMemories.$inferInsert;
export type ChatThread = typeof chatThreads.$inferSelect;
export type NewChatThread = typeof chatThreads.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;
export type DocumentRow = typeof documents.$inferSelect;
export type NewDocumentRow = typeof documents.$inferInsert;
export type DocumentChunk = typeof documentChunks.$inferSelect;
export type NewDocumentChunk = typeof documentChunks.$inferInsert;
export type IngestJob = typeof ingestJobs.$inferSelect;
export type NewIngestJob = typeof ingestJobs.$inferInsert;
