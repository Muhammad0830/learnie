import studentsRouter from "./routes/students";
import unknownEndpoint from "./middlewares/middleware";
import cors from "cors";

import express from "express";
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/students", studentsRouter);

app.use(unknownEndpoint);

export default app;
