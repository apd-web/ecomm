import { orderRepository } from "../repositories/orderRepository";
import { productRepository } from "../repositories/productRepository";
import { ApiError } from "../utils/apiError";

export const orderService = {
  createOrder: async (userId: string, items: any[], currency = "USD") => {
    if (!items || items.length === 0) {
      throw new ApiError(400, "Order must contain at least one item");
    }

    // Basic price calculation and product existence check.
    let total = 0;
    for (const it of items) {
      const prod = await productRepository.findById(it.product);
      if (!prod) throw new ApiError(404, `Product ${it.product} not found`);
      const price = prod.price ?? 0;
      total += price * (it.quantity ?? 1);
      it.price = price;
    }

    const order = await orderRepository.create({
      user: userId,
      items,
      totalAmount: total,
      currency,
    });
    return order;
  },
  getOrder: (id: string) => orderRepository.findById(id),
  listOrdersForUser: (userId: string, opts?: { page?: number; limit?: number }) =>
    orderRepository.listByUser(userId, opts),
};
