import studentsRouter from "./routes/students";
import unknownEndpoint from "./middlewares/middleware";

import express from "express";
const app = express();

app.use(express.json());

const notes = [
  {
    id: 1,
    title: "Note 1",
    content: "This is the first note.",
  },
  {
    id: 2,
    title: "Note 2",
    content: "This is the second note.",
  },
];

app.use("/students", studentsRouter);

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/notes", (request, response) => {
  response.json(notes);
});

app.use(unknownEndpoint);

export default app;
