import { Router, type IRouter } from "express";
import healthRouter from "./health";
import workflowsRouter from "./workflows";
import chatRouter from "./chat";
import memoryRouter from "./memory";
import assistantToolsRouter from "./assistant-tools";
import assistantExtractRouter from "./assistant-extract";
import copilotKitRouter from "./copilotkit";
import agentLabRouter from "./agent-lab";
import genuiRouter from "./genui";
import documentsRouter from "./documents";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/workflows", workflowsRouter);
router.use("/chat", chatRouter);
// Both mounted at /assistant: memoryRouter owns /memory, assistantToolsRouter owns
// /tools, assistantExtractRouter owns /extract (chat-attachment text extraction).
router.use("/assistant", memoryRouter);
router.use("/assistant", assistantToolsRouter);
router.use("/assistant", assistantExtractRouter);
router.use("/copilotkit", copilotKitRouter);
router.use("/agent-lab", agentLabRouter);
router.use("/genui", genuiRouter);
// Company documents: upload (signed direct-to-Storage), list, download, delete, and
// RAG search (backs Sina's searchCompanyDocuments tool).
router.use("/documents", documentsRouter);

export default router;
