import type { ErrorRequestHandler } from "express";

import { ApiError } from "../utils/apiError";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const status = err instanceof ApiError ? err.statusCode : 500;
  const message = err instanceof ApiError ? err.message : "Unexpected error";
  const requestId = req.headers["x-request-id"]?.toString();

  res.status(status).json({
    error: {
      message,
      status,
      requestId,
    },
  });
};
