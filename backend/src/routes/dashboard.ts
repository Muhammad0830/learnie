import express from "express";
import { validateUniversitySchema } from "../middlewares/validateUniversitySchema";
import * as Dashboard from "../models/Dashboard";

const dashboardRouter = express.Router();

dashboardRouter.get("/", validateUniversitySchema, async (req, res) => {
  try {
    const schemaName = (req as any).universitySchema;

    const result = await Dashboard.getDashboardData({ schemaName });
    console.log("Dashboard data fetched:", result);

    res.json(result);
  } catch (error: any) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

export default dashboardRouter;
