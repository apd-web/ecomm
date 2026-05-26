import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { createOrder, getOrder, listMyOrders } from "../controllers/orderController";

export const ordersRouter = Router();

ordersRouter.post("/orders", authenticate, createOrder);
ordersRouter.get("/orders", authenticate, listMyOrders);
ordersRouter.get("/orders/:orderId", authenticate, getOrder);
