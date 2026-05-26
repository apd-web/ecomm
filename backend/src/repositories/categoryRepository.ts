import { Category } from "../models/Category";

export const categoryRepository = {
  list: () => Category.find({ isActive: true }).sort({ name: 1 }).exec(),
  listAll: () => Category.find().sort({ name: 1 }).exec(),
  findById: (id: string) => Category.findById(id).exec(),
  findBySlug: (slug: string) => Category.findOne({ slug }).exec(),
  create: (data: Record<string, unknown>) => Category.create(data),
  update: (id: string, data: Record<string, unknown>) =>
    Category.findByIdAndUpdate(id, data, { new: true }).exec(),
  remove: (id: string) => Category.findByIdAndDelete(id).exec(),
};
