import { Product } from "../models/Product";

export const productRepository = {
  list: (
    filter: Record<string, unknown>,
    sort: Record<string, 1 | -1>,
    skip: number,
    limit: number,
  ) =>
    Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("brand")
      .populate("categories")
      .exec(),
  count: (filter: Record<string, unknown>) => Product.countDocuments(filter).exec(),
  findBySlug: (slug: string) =>
    Product.findOne({ slug }).populate("brand").populate("categories").exec(),
  findById: (id: string) => Product.findById(id).exec(),
  create: (data: Record<string, unknown>) => Product.create(data),
  update: (id: string, data: Record<string, unknown>) =>
    Product.findByIdAndUpdate(id, data, { new: true }).exec(),
  remove: (id: string) => Product.findByIdAndDelete(id).exec(),
};
