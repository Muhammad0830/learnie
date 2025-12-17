import unknownEndpoint from "./middlewares/middleware";
import cors from "cors";

import express from "express";
import usersRouter from "./routes/users";
import coursesRouter from "./routes/courses";
import universityRouter from "./routes/university";
import userRouter from "./routes/user";
import authRouter from "./routes/auth";
import cookieParser from "cookie-parser";
import dashboardRouter from "./routes/dashboard";
import { requireAuth } from "./middlewares/auth";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/users", requireAuth, usersRouter);
app.use("/courses", requireAuth, coursesRouter);
app.use("/university", universityRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/dashboard", requireAuth, dashboardRouter);

app.use(unknownEndpoint);

export default app;
