import { ApiError } from "../utils/apiError";
import { productRepository } from "../repositories/productRepository";

const DEFAULT_LIMIT = 24;

export const productService = {
  list: async (query: {
    q?: string;
    brand?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: "active" | "draft" | "archived";
    sort?: "newest" | "price-asc" | "price-desc" | "rating";
    page?: number;
    limit?: number;
  }) => {
    const page = query.page ?? 1;
    const limit = query.limit ?? DEFAULT_LIMIT;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (query.status) {
      filter.status = query.status;
    } else {
      filter.status = "active";
    }

    if (query.brand) {
      filter.brand = query.brand;
    }

    if (query.category) {
      filter.categories = query.category;
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter.price = {
        ...(query.minPrice !== undefined ? { $gte: query.minPrice } : {}),
        ...(query.maxPrice !== undefined ? { $lte: query.maxPrice } : {}),
      };
    }

    if (query.q) {
      filter.$text = { $search: query.q };
    }

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      rating: { ratingAvg: -1, ratingCount: -1 },
    };

    const sort = query.sort ? sortMap[query.sort] : sortMap.newest;

    const [items, total] = await Promise.all([
      productRepository.list(filter, sort, skip, limit),
      productRepository.count(filter),
    ]);

    return {
      items,
      page,
      limit,
      total,
    };
  },
  getBySlug: async (slug: string) => {
    const product = await productRepository.findBySlug(slug);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }
    return product;
  },
  create: (data: Record<string, unknown>) => productRepository.create(data),
  update: async (id: string, data: Record<string, unknown>) => {
    const updated = await productRepository.update(id, data);
    if (!updated) {
      throw new ApiError(404, "Product not found");
    }
    return updated;
  },
  remove: async (id: string) => {
    const deleted = await productRepository.remove(id);
    if (!deleted) {
      throw new ApiError(404, "Product not found");
    }
  },
};
