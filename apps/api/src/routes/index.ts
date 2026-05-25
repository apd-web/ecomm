import { Router } from "express";

import { authRouter } from "./auth";
import { healthRouter } from "./health";
import { oauthRouter } from "./oauth";

export const apiV1Router = Router();

apiV1Router.use(healthRouter);
apiV1Router.use(authRouter);
apiV1Router.use(oauthRouter);
