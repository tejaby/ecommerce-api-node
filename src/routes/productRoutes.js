import { Router } from "express";

import {
  listProducts,
  getProduct,
  createproduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = Router();

router.get("/products", listProducts);

router.get("/products/:id", getProduct);

router.post("/products", createproduct);

router.patch("/products/:id", updateProduct);

router.delete("/products", deleteProduct);

export default router;
