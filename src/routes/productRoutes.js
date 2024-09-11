import { Router } from "express";
import fileUpload from "express-fileupload";

import {
  listProducts,
  listProductsExtended,
  getProduct,
  createproduct,
  updateProduct,
  updateProductState,
} from "../controllers/productController.js";

import { authMiddleware } from "../middlewares/auth.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = Router();

router.get("/products", authMiddleware, listProducts);

router.get(
  "/products/extended",
  authMiddleware,
  adminMiddleware,
  listProductsExtended
);

router.get("/products/:id", authMiddleware, getProduct);

router.post(
  "/products",
  authMiddleware,
  adminMiddleware,
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  createproduct
);

router.put("/products/:id", authMiddleware, adminMiddleware, updateProduct);

router.put(
  "/products/:id/state",
  authMiddleware,
  adminMiddleware,
  updateProductState
);

export default router;
