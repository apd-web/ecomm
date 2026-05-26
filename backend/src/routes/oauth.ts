import { Router } from "express";

import { oauthCallback, oauthStart } from "../controllers/oauthController";

export const oauthRouter = Router();

oauthRouter.get("/auth/oauth/:provider/start", oauthStart);
oauthRouter.get("/auth/oauth/:provider/callback", oauthCallback);
