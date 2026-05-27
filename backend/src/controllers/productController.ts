import type { RequestHandler } from "express";

import { ok } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { productService } from "../services/productService";
import { productQuerySchema, productSchema } from "../validators/catalogSchemas";

export const listProducts: RequestHandler = asyncHandler(async (req, res) => {
  const query = productQuerySchema.parse(req.query);
  const result = await productService.list(query);
  res.json(
    ok({ items: result.items }, { page: result.page, limit: result.limit, total: result.total }),
  );
});

export const getProduct: RequestHandler = asyncHandler(async (req, res) => {
  const slug = req.params.slug;
  if (!slug) {
    throw new ApiError(400, "Product slug is required");
  }

  const product = await productService.getBySlug(slug);
  res.json(ok({ product }));
});

export const createProduct: RequestHandler = asyncHandler(async (req, res) => {
  const payload = productSchema.parse(req.body);
  const product = await productService.create(payload);
  res.status(201).json(ok({ product }));
});

export const updateProduct: RequestHandler = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    throw new ApiError(400, "Product id is required");
  }

  const payload = productSchema.partial().parse(req.body);
  const product = await productService.update(id, payload);
  res.json(ok({ product }));
});

export const deleteProduct: RequestHandler = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    throw new ApiError(400, "Product id is required");
  }

  await productService.remove(id);
  res.json(ok({ success: true }));
});
