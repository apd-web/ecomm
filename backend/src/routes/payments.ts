import { Router } from "express";

import { createPaymentIntent, paymentWebhook } from "../controllers/paymentController";
import { authenticate } from "../middlewares/authenticate";

export const paymentsRouter = Router();

paymentsRouter.post("/payments/create-intent", authenticate, createPaymentIntent);
paymentsRouter.post("/payments/webhook", paymentWebhook);
