import type { Request, RequestHandler, Response } from "express";

import { authService } from "../services/authService";
import { tokenService } from "../services/tokenService";
import { ok } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { clearRefreshCookie, setRefreshCookie } from "../utils/cookies";
import { ApiError } from "../utils/apiError";
import { env } from "../config/env";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  logoutSchema,
  refreshSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../validators/authSchemas";
import { hashPassword } from "../utils/password";

export const register: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const payload = registerSchema.parse(req.body);
  const result = await authService.register(payload.name, payload.email, payload.password, {
    userAgent: req.get("user-agent") ?? undefined,
    ip: req.ip,
  });
  setRefreshCookie(res, result.refreshToken);
  res.json(ok(result));
});

export const login: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const payload = loginSchema.parse(req.body);
  const result = await authService.login(payload.email, payload.password, {
    userAgent: req.get("user-agent") ?? undefined,
    ip: req.ip,
  });
  setRefreshCookie(res, result.refreshToken);
  res.json(ok(result));
});

export const refresh: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const cookieToken = req.cookies?.[env.refreshCookieName] as string | undefined;
  const bodyToken = req.body?.refreshToken as string | undefined;
  const token = bodyToken ?? cookieToken;
  if (!token) {
    throw new ApiError(401, "Missing refresh token");
  }

  const payload = refreshSchema.parse({ refreshToken: token });
  const result = await authService.refresh(payload.refreshToken, {
    userAgent: req.get("user-agent") ?? undefined,
    ip: req.ip,
  });
  setRefreshCookie(res, result.refreshToken);
  res.json(ok(result));
});

export const logout: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const cookieToken = req.cookies?.[env.refreshCookieName] as string | undefined;
  const bodyToken = req.body?.refreshToken as string | undefined;
  const token = bodyToken ?? cookieToken;
  if (!token) {
    throw new ApiError(400, "Missing refresh token");
  }

  const payload = logoutSchema.parse({ refreshToken: token });
  await authService.logout(payload.refreshToken);
  clearRefreshCookie(res);
  res.json(ok({ success: true }));
});

export const me: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  res.json(ok({ user: req.user, roles: req.user.roles }));
});

export const verifyEmail: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const payload = verifyEmailSchema.parse(req.body);
  await tokenService.verifyEmailToken(payload.token);
  res.json(ok({ success: true }));
});

export const resendVerification: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const payload = loginSchema.pick({ email: true }).parse(req.body);
    const user = await authService.findUserByEmail(payload.email);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    if (user.emailVerified) {
      return res.json(ok({ success: true }));
    }
    await tokenService.issueEmailVerification(user.id, user.email);
    res.json(ok({ success: true }));
  },
);

export const forgotPassword: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const payload = forgotPasswordSchema.parse(req.body);
  await tokenService.issuePasswordReset(payload.email);
  res.json(ok({ success: true }));
});

export const resetPassword: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const payload = resetPasswordSchema.parse(req.body);
  const passwordHash = await hashPassword(payload.password);
  await tokenService.resetPassword(payload.token, passwordHash);
  res.json(ok({ success: true }));
});

export const changePassword: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const payload = changePasswordSchema.parse(req.body);
  await authService.changePassword(req.user.sub, payload.currentPassword, payload.newPassword);
  res.json(ok({ success: true }));
});
