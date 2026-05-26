import type { ApiResponse } from "./apiClient";

import { apiClient } from "./apiClient";

export type ProductImage = {
  url: string;
  alt?: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  ratingAvg: number;
  ratingCount: number;
  images: ProductImage[];
  brand?: { id: string; name: string; slug: string };
  categories: Array<{ id: string; name: string; slug: string }>;
};

export type ProductListResponse = {
  items: Product[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
};

export const productApi = {
  list: async (params: {
    q?: string;
    brand?: string;
    category?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get<ApiResponse<{ items: Product[] }>>("/products", {
      params,
    });
    return {
      items: response.data.data.items,
      meta: response.data.meta,
    } as ProductListResponse;
  },
  getBySlug: async (slug: string) => {
    const response = await apiClient.get<ApiResponse<{ product: Product }>>(`/products/${slug}`);
    return response.data.data.product;
  },
};
