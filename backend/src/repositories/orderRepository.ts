import { Order } from "../models/Order";

export const orderRepository = {
  create: (data: any) => Order.create(data),
  findById: (id: string) => Order.findById(id).exec(),
  listByUser: (userId: string, opts: { page?: number; limit?: number } = {}) =>
    Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(((opts.page ?? 1) - 1) * (opts.limit ?? 20))
      .limit(opts.limit ?? 20)
      .exec(),
  updateStatus: (id: string, status: string) => Order.findByIdAndUpdate(id, { status }).exec(),
};
