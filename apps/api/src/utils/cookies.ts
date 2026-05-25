import type { Response } from "express";

import { env } from "../config/env";
import { toMs } from "./time";

export const setRefreshCookie = (res: Response, token: string) => {
  res.cookie(env.refreshCookieName, token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    maxAge: toMs(env.jwtRefreshTtl, env.refreshCookieMaxAgeMs),
  });
};

export const clearRefreshCookie = (res: Response) => {
  res.clearCookie(env.refreshCookieName, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
  });
};
