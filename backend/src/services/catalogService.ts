import { brandRepository } from "../repositories/brandRepository";
import { categoryRepository } from "../repositories/categoryRepository";

export const catalogService = {
  listBrands: (includeInactive = false) =>
    includeInactive ? brandRepository.listAll() : brandRepository.list(),
  listCategories: (includeInactive = false) =>
    includeInactive ? categoryRepository.listAll() : categoryRepository.list(),
  createBrand: (data: Record<string, unknown>) => brandRepository.create(data),
  updateBrand: (id: string, data: Record<string, unknown>) => brandRepository.update(id, data),
  removeBrand: (id: string) => brandRepository.remove(id),
  createCategory: (data: Record<string, unknown>) => categoryRepository.create(data),
  updateCategory: (id: string, data: Record<string, unknown>) =>
    categoryRepository.update(id, data),
  removeCategory: (id: string) => categoryRepository.remove(id),
};
