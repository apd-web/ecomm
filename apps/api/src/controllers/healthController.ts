import type { RequestHandler } from "express";

import { ok } from "../utils/apiResponse";
import { healthService } from "../services/healthService";

export const getHealth: RequestHandler = (_req, res) => {
  res.json(ok(healthService.getHealth()));
};
