import { Router } from "express";

import {
  createBrand,
  createCategory,
  deleteBrand,
  deleteCategory,
  listBrands,
  listCategories,
  updateBrand,
  updateCategory,
} from "../controllers/catalogController";
import { authenticate } from "../middlewares/authenticate";
import { requireRole } from "../middlewares/requireRole";

export const catalogRouter = Router();

catalogRouter.get("/catalog/brands", listBrands);
catalogRouter.post("/catalog/brands", authenticate, requireRole("admin"), createBrand);
catalogRouter.put("/catalog/brands/:id", authenticate, requireRole("admin"), updateBrand);
catalogRouter.delete("/catalog/brands/:id", authenticate, requireRole("admin"), deleteBrand);

catalogRouter.get("/catalog/categories", listCategories);
catalogRouter.post("/catalog/categories", authenticate, requireRole("admin"), createCategory);
catalogRouter.put("/catalog/categories/:id", authenticate, requireRole("admin"), updateCategory);
catalogRouter.delete("/catalog/categories/:id", authenticate, requireRole("admin"), deleteCategory);
