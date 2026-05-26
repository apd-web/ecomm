import type { RequestHandler } from "express";

import { ok } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
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
  const product = await productService.getBySlug(req.params.slug);
  res.json(ok({ product }));
});

export const createProduct: RequestHandler = asyncHandler(async (req, res) => {
  const payload = productSchema.parse(req.body);
  const product = await productService.create(payload);
  res.status(201).json(ok({ product }));
});

export const updateProduct: RequestHandler = asyncHandler(async (req, res) => {
  const payload = productSchema.partial().parse(req.body);
  const product = await productService.update(req.params.id, payload);
  res.json(ok({ product }));
});

export const deleteProduct: RequestHandler = asyncHandler(async (req, res) => {
  await productService.remove(req.params.id);
  res.json(ok({ success: true }));
});
