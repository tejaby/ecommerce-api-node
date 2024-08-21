import express from "express";
import morgan from 'morgan';

const app = express();

// middlewares
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.use((req, res) => {
  res.status(404).send("Not Found");
});

export default app;
