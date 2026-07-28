import { Router, type IRouter } from "express";
import healthRouter from "./health";
import workflowsRouter from "./workflows";
import chatRouter from "./chat";
import memoryRouter from "./memory";
import copilotKitRouter from "./copilotkit";
import agentLabRouter from "./agent-lab";
import genuiRouter from "./genui";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/workflows", workflowsRouter);
router.use("/chat", chatRouter);
router.use("/assistant", memoryRouter);
router.use("/copilotkit", copilotKitRouter);
router.use("/agent-lab", agentLabRouter);
router.use("/genui", genuiRouter);

export default router;
