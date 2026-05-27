import { orderRepository } from "../repositories/orderRepository";
import { productRepository } from "../repositories/productRepository";
import { ApiError } from "../utils/apiError";

export const orderService = {
  createOrder: async (
    userId: string,
    items: Array<{ product: string; quantity: number; variantId?: string }>,
    currency = "USD",
  ) => {
    if (!items || items.length === 0) {
      throw new ApiError(400, "Order must contain at least one item");
    }

    // Basic price calculation and product existence check.
    let total = 0;
    const orderItems: Array<{
      product: string;
      quantity: number;
      price: number;
      variantId?: string;
    }> = [];
    for (const it of items) {
      const prod = await productRepository.findById(it.product);
      if (!prod) throw new ApiError(404, `Product ${it.product} not found`);
      const price = prod.price ?? 0;
      const qty = it.quantity ?? 1;

      const updated = await productRepository.decrementInventory(it.product, qty, it.variantId);
      if (!updated) {
        throw new ApiError(409, `Insufficient stock for product ${it.product}`);
      }

      total += price * qty;
      orderItems.push({
        product: it.product,
        quantity: qty,
        price,
        variantId: it.variantId,
      });
    }

    const order = await orderRepository.create({
      user: userId,
      items: orderItems,
      totalAmount: total,
      currency,
    });
    return order;
  },
  getOrder: async (id: string, userId: string) => {
    const order = await orderRepository.findById(id);
    if (!order || order.user.toString() !== userId) {
      throw new ApiError(404, "Order not found");
    }
    return order;
  },
  listOrdersForUser: (userId: string, opts?: { page?: number; limit?: number }) =>
    orderRepository.listByUser(userId, opts),
};
