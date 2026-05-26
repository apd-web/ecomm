import { Router } from "express";

import { authRouter } from "./auth";
import { catalogRouter } from "./catalog";
import { healthRouter } from "./health";
import { oauthRouter } from "./oauth";
import { productRouter } from "./products";
import { ordersRouter } from "./orders";

export const apiV1Router = Router();

apiV1Router.use(healthRouter);
apiV1Router.use(authRouter);
apiV1Router.use(oauthRouter);
apiV1Router.use(catalogRouter);
apiV1Router.use(productRouter);
apiV1Router.use(ordersRouter);
