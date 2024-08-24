import express from "express";
import morgan from "morgan";

import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

// middlewares
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", authRoutes);
app.use("/api", orderRoutes);

export default app;
