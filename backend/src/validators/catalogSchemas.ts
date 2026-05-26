import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  logoUrl: z.string().url().optional(),
  website: z.string().url().optional(),
  isActive: z.boolean().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(2).optional(),
  imageUrl: z.string().url().optional(),
  parent: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(2).optional(),
  price: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().optional(),
  currency: z.string().min(3).max(3).optional(),
  status: z.enum(["active", "draft", "archived"]).optional(),
  tags: z.array(z.string().min(1)).optional(),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        alt: z.string().optional(),
      }),
    )
    .optional(),
  brand: z.string().optional(),
  categories: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  inventory: z
    .object({
      sku: z.string().optional(),
      quantity: z.number().int().nonnegative().optional(),
      lowStockThreshold: z.number().int().nonnegative().optional(),
      track: z.boolean().optional(),
    })
    .optional(),
});

export const productQuerySchema = z.object({
  q: z.string().min(1).optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  status: z.enum(["active", "draft", "archived"]).optional(),
  sort: z.enum(["newest", "price-asc", "price-desc", "rating"]).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});
