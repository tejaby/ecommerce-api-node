import { Router } from "express";

import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  updateUserState,
  changePassword,
} from "../controllers/userController.js";

import { authMiddleware } from "../middlewares/auth.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = Router();

router.get("/users", authMiddleware, adminMiddleware, listUsers);

router.get("/users/:id", authMiddleware, adminMiddleware, getUser);

// router.post("/users", createUser);

router.put("/users", authMiddleware, updateUser);

router.put("/users/password", authMiddleware, changePassword);

router.put("/users/state", authMiddleware, updateUserState);

export default router;
