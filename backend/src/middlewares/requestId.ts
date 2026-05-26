import type { RequestHandler } from "express";
import crypto from "node:crypto";

export const requestId: RequestHandler = (req, res, next) => {
  const id = req.headers["x-request-id"]?.toString() ?? crypto.randomUUID();
  req.headers["x-request-id"] = id;
  res.setHeader("x-request-id", id);
  next();
};
