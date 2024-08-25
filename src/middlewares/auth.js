import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../config.js";

export const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ error: "no se encontró token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role_id) {
      req.user = decoded;
      next();
    }
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
