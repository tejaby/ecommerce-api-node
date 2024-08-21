import { Router } from "express";

import {
  login,
  register,
  logout,
  refreshToken,
} from "../controllers/authController.js";

const router = Router();

router.post("/auth/login", login);

router.post("/auth/register", register);

router.post("/auth/logout", logout);

router.post("/auth/refresh", refreshToken);

export default router;
