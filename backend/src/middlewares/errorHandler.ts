import type { ErrorRequestHandler } from "express";

import { ApiError } from "../utils/apiError";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const status = err instanceof ApiError ? err.statusCode : 500;
  const message = err instanceof ApiError ? err.message : "Unexpected error";
  const requestId = req.headers["x-request-id"]?.toString();

  if (!(err instanceof ApiError)) {
    // Log the stack for unexpected errors in non-production development.
    // The dev server will pick this up and print to the running terminal.
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({
    error: {
      message,
      status,
      requestId,
    },
  });
};
