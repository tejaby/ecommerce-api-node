import { Router } from "express";

import {
  listProducts,
  getProduct,
  createproduct,
  updateProduct,
  updateProductState,
} from "../controllers/productController.js";

import { authMiddleware } from "../middlewares/auth.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = Router();

router.get("/products", authMiddleware, listProducts);

router.get("/products/:id", authMiddleware, getProduct);

router.post("/products", authMiddleware, adminMiddleware, createproduct);

router.put("/products/:id", authMiddleware, adminMiddleware, updateProduct);

router.put(
  "/products/:id/state",
  authMiddleware,
  adminMiddleware,
  updateProductState
);

export default router;
