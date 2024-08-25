import { Router } from "express";

import {
  listProducts,
  getProduct,
  createproduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { authMiddleware } from "../middlewares/auth.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = Router();

router.get("/products", listProducts);

router.get("/products/:id", getProduct);

router.post("/products", authMiddleware, adminMiddleware, createproduct);

router.put("/products/:id", authMiddleware, adminMiddleware, updateProduct);

router.put(
  "/products/:id/deactivate",
  authMiddleware,
  adminMiddleware,
  deleteProduct
);

export default router;
