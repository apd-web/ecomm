import { Router } from "express";

import {
  forgotPassword,
  changePassword,
  login,
  logout,
  me,
  refresh,
  register,
  resendVerification,
  resetPassword,
  verifyEmail,
} from "../controllers/authController";
import { listSessions, revokeAllSessions, revokeSession } from "../controllers/sessionController";
import { authenticate } from "../middlewares/authenticate";
import { requireRole } from "../middlewares/requireRole";

export const authRouter = Router();

authRouter.post("/auth/register", register);
authRouter.post("/auth/login", login);
authRouter.post("/auth/refresh", refresh);
authRouter.post("/auth/logout", logout);
authRouter.get("/auth/me", authenticate, me);
authRouter.get("/auth/sessions", authenticate, listSessions);
authRouter.delete("/auth/sessions", authenticate, revokeAllSessions);
authRouter.delete("/auth/sessions/:sessionId", authenticate, revokeSession);
authRouter.post("/auth/verify-email", verifyEmail);
authRouter.post("/auth/resend-verification", resendVerification);
authRouter.post("/auth/forgot-password", forgotPassword);
authRouter.post("/auth/reset-password", resetPassword);
authRouter.post("/auth/change-password", authenticate, changePassword);
authRouter.get("/auth/admin-probe", authenticate, requireRole("admin"), (_req, res) => {
  res.json({ data: { ok: true } });
});
