import type { RequestHandler } from "express";
import { ok } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { orderService } from "../services/orderService";

export const createOrder: RequestHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.sub as string | undefined;
  const items = req.body?.items as any[] | undefined;
  const order = await orderService.createOrder(userId ?? "", items ?? []);
  res.json(ok(order));
});

export const getOrder: RequestHandler = asyncHandler(async (req, res) => {
  const order = await orderService.getOrder(req.params.orderId);
  res.json(ok(order));
});

export const listMyOrders: RequestHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.sub as string | undefined;
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const orders = await orderService.listOrdersForUser(userId ?? "", { page, limit });
  res.json(ok({ items: orders }));
});
