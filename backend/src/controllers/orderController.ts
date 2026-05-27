import type { RequestHandler } from "express";
import { ok } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { orderService } from "../services/orderService";
import { ApiError } from "../utils/apiError";
import { createOrderSchema } from "../validators/orderSchemas";

export const createOrder: RequestHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.sub as string | undefined;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const payload = createOrderSchema.parse(req.body);
  const order = await orderService.createOrder(userId, payload.items, payload.currency);
  res.json(ok(order));
});

export const getOrder: RequestHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.sub as string | undefined;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const orderId = req.params.orderId;
  if (!orderId) {
    throw new ApiError(400, "Order id is required");
  }

  const order = await orderService.getOrder(orderId, userId);
  res.json(ok(order));
});

export const listMyOrders: RequestHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.sub as string | undefined;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const orders = await orderService.listOrdersForUser(userId, { page, limit });
  res.json(ok({ items: orders }));
});
