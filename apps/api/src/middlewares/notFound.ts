import type { RequestHandler } from "express";

import { ApiError } from "../utils/apiError";

export const notFound: RequestHandler = (_req, _res, next) => {
  next(new ApiError(404, "Route not found"));
};
