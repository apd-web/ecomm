import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

import { env } from "../config/env";
import type { UserRole } from "../models/User";

export type JwtPayload = {
  sub: string;
  roles: UserRole[];
};

export const signAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessTtl as SignOptions["expiresIn"],
  });
};

export const signRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshTtl as SignOptions["expiresIn"],
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.jwtAccessSecret) as JwtPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.jwtRefreshSecret) as JwtPayload;
};

export const getTokenExpiry = (token: string) => {
  const decoded = jwt.decode(token);
  if (!decoded || typeof decoded !== "object" || typeof decoded.exp !== "number") {
    return null;
  }
  return new Date(decoded.exp * 1000);
};
