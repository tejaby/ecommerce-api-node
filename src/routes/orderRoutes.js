import { Router } from "express";

import {
  listOrders,
  listOrdersUser,
  listdetailOrders,
  listdetailOrdersUser,
  createOrderWithDetails,
  updateOrderHeader,
  updateOrderStatus,
} from "../controllers/orderController.js";

import { authMiddleware } from "../middlewares/auth.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = Router();

router.get("/orders", authMiddleware, adminMiddleware, listOrders);

router.get("/orders/user", authMiddleware, listOrdersUser);

router.get(
  "/orders/:id/details",
  authMiddleware,
  adminMiddleware,
  listdetailOrders
);

router.get("/orders/:id/details/user", authMiddleware, listdetailOrdersUser);

router.post("/orders", authMiddleware, createOrderWithDetails);

router.put("/orders/:id", authMiddleware, updateOrderHeader);

router.put("/orders/:id/state", authMiddleware, updateOrderStatus);

export default router;
