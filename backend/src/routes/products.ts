import { Router } from "express";

import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from "../controllers/productController";
import { authenticate } from "../middlewares/authenticate";
import { requireRole } from "../middlewares/requireRole";

export const productRouter = Router();

productRouter.get("/products", listProducts);
productRouter.get("/products/:slug", getProduct);
productRouter.post("/products", authenticate, requireRole("admin"), createProduct);
productRouter.put("/products/:id", authenticate, requireRole("admin"), updateProduct);
productRouter.delete("/products/:id", authenticate, requireRole("admin"), deleteProduct);
