import type { RequestHandler } from "express";
import crypto from "node:crypto";

import { orderRepository } from "../repositories/orderRepository";
import { ok } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";

export const createPaymentIntent: RequestHandler = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const orderId = String(req.body?.orderId ?? "");
  if (!orderId) {
    throw new ApiError(400, "orderId is required");
  }

  const order = await orderRepository.findById(orderId);
  if (!order || order.user.toString() !== req.user.sub) {
    throw new ApiError(404, "Order not found");
  }

  const paymentIntentId = `pi_${crypto.randomBytes(12).toString("hex")}`;
  await orderRepository.attachPaymentIntent(order.id, paymentIntentId);

  // This is a placeholder intent contract for future Stripe integration.
  res.json(
    ok({
      orderId: order.id,
      paymentIntentId,
      clientSecret: `${paymentIntentId}_secret_mock`,
      amount: order.totalAmount,
      currency: order.currency,
    }),
  );
});

export const paymentWebhook: RequestHandler = asyncHandler(async (req, res) => {
  const event = req.body ?? {};
  const eventType = String(event.type ?? "");
  const paymentIntentId = String(event.data?.paymentIntentId ?? "");

  if (!eventType || !paymentIntentId) {
    throw new ApiError(400, "Invalid webhook payload");
  }

  const order = await orderRepository.findByPaymentIntent(paymentIntentId);
  if (!order) {
    throw new ApiError(404, "Order not found for payment intent");
  }

  if (eventType === "payment.succeeded") {
    await orderRepository.updateStatus(order.id, "paid");
  }

  if (eventType === "payment.failed") {
    await orderRepository.updateStatus(order.id, "payment_failed");
  }

  res.json(ok({ received: true }));
});
