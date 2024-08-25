import { Router } from "express";

import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
} from "../controllers/userController.js";

import { authMiddleware } from "../middlewares/auth.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = Router();

router.get("/users", authMiddleware, adminMiddleware, listUsers);

router.get("/users/:id", authMiddleware, getUser);

// router.post("/users", createUser);

router.put("/users/:id", authMiddleware, updateUser);

router.put("/users/:id/password", authMiddleware, changePassword);

router.put("/users/:id/deactivate", authMiddleware, deleteUser);

export default router;
