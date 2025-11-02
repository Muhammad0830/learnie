import studentsRouter from "./routes/students";
import unknownEndpoint from "./middlewares/middleware";
import cors from "cors";

import express from "express";
import coursesRouter from "./routes/courses";
import teachersRouter from "./routes/teachers";
import universityRouter from "./routes/university";
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
app.use("/courses", coursesRouter);
app.use("/teachers", teachersRouter);
app.use("/university", universityRouter);

app.use(unknownEndpoint);

export default app;
