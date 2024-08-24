import { Router } from "express";

import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
} from "../controllers/userController.js";

const router = Router();

router.get("/users", listUsers);

router.get("/users/:id", getUser);

router.post("/users", createUser);

router.put("/users/:id", updateUser);

router.put("/users/:id/password", changePassword);

router.delete("/users/:id", deleteUser);

export default router;
