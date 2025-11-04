import unknownEndpoint from "./middlewares/middleware";
import cors from "cors";

import express from "express";
import usersRouter from "./routes/users";
import coursesRouter from "./routes/courses";
import universityRouter from "./routes/university";
import userRouter from "./routes/user";
import authRouter from "./routes/auth";
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/users", usersRouter);
app.use("/courses", coursesRouter);
app.use("/university", universityRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);

app.use(unknownEndpoint);

export default app;
