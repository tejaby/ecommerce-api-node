import { Router } from "express";

import {
  listOrders,
  listdetailOrders,
  createOrderWithDetails,
  updateOrderHeader,
  updateOrderStatus,
} from "../controllers/orderController.js";

import { authMiddleware } from "../middlewares/auth.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = Router();

router.get("/orders", authMiddleware, adminMiddleware, listOrders);

router.get(
  "/orders/:id/details",
  authMiddleware,
  adminMiddleware,
  listdetailOrders
);

router.post("/orders", authMiddleware, createOrderWithDetails);

router.put("/orders/:id", authMiddleware, updateOrderHeader);

router.put("/orders/:id/state", authMiddleware, updateOrderStatus);

export default router;
