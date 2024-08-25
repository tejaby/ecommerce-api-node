import { Router } from "express";

import {
  login,
  register,
  logout,
  refreshToken,
} from "../controllers/authController.js";

import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.post("/auth/login", login);

router.post("/auth/register", register);

router.post("/auth/logout", authMiddleware, logout);

router.post("/auth/refresh", authMiddleware, refreshToken);

export default router;
