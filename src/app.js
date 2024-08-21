import express from "express";
import morgan from "morgan";

import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";

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

app.use((req, res) => {
  res.status(404).send("Not Found");
});

export default app;
