import type { ApiResponse } from "./apiClient";

import { apiClient } from "./apiClient";

export type Brand = {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  parent?: string;
};

export const catalogApi = {
  listBrands: async () => {
    const response = await apiClient.get<ApiResponse<{ brands: Brand[] }>>("/catalog/brands");
    return response.data.data.brands;
  },
  listCategories: async () => {
    const response =
      await apiClient.get<ApiResponse<{ categories: Category[] }>>("/catalog/categories");
    return response.data.data.categories;
  },
};
