import { Order } from "../models/Order";

export const orderRepository = {
  create: (data: {
    user: string;
    items: Array<{ product: string; quantity: number; price: number; variantId?: string }>;
    totalAmount: number;
    currency: string;
  }) => Order.create(data),
  findById: (id: string) => Order.findById(id).exec(),
  listByUser: (userId: string, opts: { page?: number; limit?: number } = {}) =>
    Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(((opts.page ?? 1) - 1) * (opts.limit ?? 20))
      .limit(opts.limit ?? 20)
      .exec(),
  updateStatus: (id: string, status: string) => Order.findByIdAndUpdate(id, { status }).exec(),
  attachPaymentIntent: (id: string, paymentIntentId: string) =>
    Order.findByIdAndUpdate(
      id,
      { paymentIntentId, status: "payment_pending" },
      { new: true },
    ).exec(),
  findByPaymentIntent: (paymentIntentId: string) => Order.findOne({ paymentIntentId }).exec(),
};
