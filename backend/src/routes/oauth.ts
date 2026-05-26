import { Router } from "express";

import {
  oauthCallback,
  oauthLinkStart,
  oauthStart,
  oauthUnlink,
} from "../controllers/oauthController";
import { authenticate } from "../middlewares/authenticate";

export const oauthRouter = Router();

oauthRouter.get("/auth/oauth/:provider/start", oauthStart);
oauthRouter.get("/auth/oauth/:provider/link/start", authenticate, oauthLinkStart);
oauthRouter.get("/auth/oauth/:provider/callback", oauthCallback);
oauthRouter.delete("/auth/oauth/:provider/unlink", authenticate, oauthUnlink);
