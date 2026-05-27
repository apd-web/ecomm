import type { Request, RequestHandler, Response } from "express";

import { ApiError } from "../utils/apiError";
import { ok } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { sessionService } from "../services/sessionService";

export const listSessions: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const sessions = await sessionService.listForUser(req.user.sub);
  res.json(ok({ sessions }));
});

export const revokeSession: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const sessionId = req.params.sessionId;
  if (!sessionId) {
    throw new ApiError(400, "Session id is required");
  }

  await sessionService.revoke(sessionId, req.user.sub);
  res.json(ok({ success: true }));
});

export const revokeAllSessions: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    await sessionService.revokeAll(req.user.sub);
    res.json(ok({ success: true }));
  },
);
