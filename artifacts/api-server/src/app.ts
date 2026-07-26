import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth middleware: populate req.userId for every request.
// Currently all traffic is treated as the anonymous user.
// When a real auth layer is added, replace this with session/JWT validation.
app.use((req, _res, next) => {
  req.userId = "anonymous";
  next();
});

app.use("/api", router);

export default app;
