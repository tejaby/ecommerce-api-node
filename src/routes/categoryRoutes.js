import { Router } from "express";

import {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = Router();

router.get("/categories", listCategories);

router.get("/categories/:id", getCategory);

router.post("/categories", createCategory);

router.put("/categories/:id", updateCategory);

router.delete("/categories/:id", deleteCategory);

export default router;
