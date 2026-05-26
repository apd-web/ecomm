import type { RequestHandler } from "express";

import { ok } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { catalogService } from "../services/catalogService";
import { brandSchema, categorySchema } from "../validators/catalogSchemas";

export const listBrands: RequestHandler = asyncHandler(async (_req, res) => {
  const brands = await catalogService.listBrands();
  res.json(ok({ brands }));
});

export const listCategories: RequestHandler = asyncHandler(async (_req, res) => {
  const categories = await catalogService.listCategories();
  res.json(ok({ categories }));
});

export const createBrand: RequestHandler = asyncHandler(async (req, res) => {
  const payload = brandSchema.parse(req.body);
  const brand = await catalogService.createBrand(payload);
  res.status(201).json(ok({ brand }));
});

export const updateBrand: RequestHandler = asyncHandler(async (req, res) => {
  const payload = brandSchema.partial().parse(req.body);
  const brand = await catalogService.updateBrand(req.params.id, payload);
  if (!brand) {
    throw new ApiError(404, "Brand not found");
  }
  res.json(ok({ brand }));
});

export const deleteBrand: RequestHandler = asyncHandler(async (req, res) => {
  const result = await catalogService.removeBrand(req.params.id);
  if (!result) {
    throw new ApiError(404, "Brand not found");
  }
  res.json(ok({ success: true }));
});

export const createCategory: RequestHandler = asyncHandler(async (req, res) => {
  const payload = categorySchema.parse(req.body);
  const category = await catalogService.createCategory(payload);
  res.status(201).json(ok({ category }));
});

export const updateCategory: RequestHandler = asyncHandler(async (req, res) => {
  const payload = categorySchema.partial().parse(req.body);
  const category = await catalogService.updateCategory(req.params.id, payload);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  res.json(ok({ category }));
});

export const deleteCategory: RequestHandler = asyncHandler(async (req, res) => {
  const result = await catalogService.removeCategory(req.params.id);
  if (!result) {
    throw new ApiError(404, "Category not found");
  }
  res.json(ok({ success: true }));
});
