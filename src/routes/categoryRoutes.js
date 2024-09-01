import { Router } from "express";

import {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  updateCategoryState,
} from "../controllers/categoryController.js";

import { authMiddleware } from "../middlewares/auth.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = Router();

router.get("/categories", authMiddleware, listCategories);

router.get("/categories/:id", authMiddleware, getCategory);

router.post("/categories", authMiddleware, adminMiddleware, createCategory);

router.put("/categories/:id", authMiddleware, adminMiddleware, updateCategory);

router.put(
  "/categories/:id/state",
  authMiddleware,
  adminMiddleware,
  updateCategoryState
);

export default router;
