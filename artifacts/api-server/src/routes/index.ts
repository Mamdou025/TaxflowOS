import { Router, type IRouter } from "express";
import healthRouter from "./health";
import workflowsRouter from "./workflows";
import chatRouter from "./chat";
import memoryRouter from "./memory";
import copilotKitRouter from "./copilotkit";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/workflows", workflowsRouter);
router.use("/chat", chatRouter);
router.use("/assistant", memoryRouter);
router.use("/copilotkit", copilotKitRouter);

export default router;
