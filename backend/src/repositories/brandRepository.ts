import { Brand } from "../models/Brand";

export const brandRepository = {
  list: () => Brand.find({ isActive: true }).sort({ name: 1 }).exec(),
  listAll: () => Brand.find().sort({ name: 1 }).exec(),
  findById: (id: string) => Brand.findById(id).exec(),
  findBySlug: (slug: string) => Brand.findOne({ slug }).exec(),
  create: (data: Record<string, unknown>) => Brand.create(data),
  update: (id: string, data: Record<string, unknown>) =>
    Brand.findByIdAndUpdate(id, data, { new: true }).exec(),
  remove: (id: string) => Brand.findByIdAndDelete(id).exec(),
};
