import { Router } from "express";

import {
  createOrderWithDetails,
  updateOrderHeader,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = Router();

router.post("/orders", createOrderWithDetails);

router.put("/orders/:id", updateOrderHeader);

router.put("/orders/:id/cancel", updateOrderStatus);


export default router;
