import { Router } from "express";

import {
  createOrderWithDetails,
  updateOrderHeader,
  updateOrderStatus,
} from "../controllers/orderController.js";

import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.post("/orders", authMiddleware, createOrderWithDetails);

router.put("/orders/:id", authMiddleware, updateOrderHeader);

router.put("/orders/:id/cancel", authMiddleware, updateOrderStatus);

export default router;
