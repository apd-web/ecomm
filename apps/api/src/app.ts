import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFound";
import { requestId } from "./middlewares/requestId";
import { apiV1Router } from "./routes";

export const app = express();

app.use(helmet());
app.use(requestId);
app.use(cookieParser());
app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.use("/api/v1", apiV1Router);

app.use(notFound);
app.use(errorHandler);
