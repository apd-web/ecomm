import type { RequestHandler } from "express";

import { ApiError } from "../utils/apiError";
import type { UserRole } from "../models/User";

export const requireRole = (...roles: UserRole[]): RequestHandler => {
  return (req, _res, next) => {
    const user = req.user;
    if (!user) {
      return next(new ApiError(401, "Unauthorized"));
    }

    const allowed = roles.some((role) => user.roles.includes(role));
    if (!allowed) {
      return next(new ApiError(403, "Forbidden"));
    }

    return next();
  };
};
