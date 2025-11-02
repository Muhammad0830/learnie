import {
  createUniversity,
  getUniversity,
  getUniversitySchemaList,
  updateUniversity,
} from "../models/University";
import express from "express";

const universityRouter = express.Router();

universityRouter.get("/", async (req, res) => {
  try {
    const result = await getUniversitySchemaList();

    if (result?.length === 0) {
      res.status(404).json({ error: "No university schemas found" });
      return;
    }

    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error fetching university schemas:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

universityRouter.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Missing name" });
    }

    const result = await createUniversity(name);
    console.log("result", result);

    res.status(201).json({
      data: result,
    });
  } catch (err: any) {
    console.error("Error inserting university:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

universityRouter.get("/:universityId", async (req, res) => {
  try {
    const universityId = req.params.universityId;
    if (!universityId) {
      return res.status(400).json({ error: "Missing universityId" });
    }

    const result = await getUniversity(universityId);

    if (result.length === 0) {
      res.status(404).json({ error: "University not found" });
      return;
    }

    res.json(result);
  } catch (err: any) {
    console.error("Error fetching university:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

universityRouter.put("/:universityId", async (req, res) => {
  try {
    const universityId = req.params.universityId;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Missing name" });
    } else if (!universityId) {
      return res.status(400).json({ error: "Missing universityId" });
    }

    const result = await updateUniversity(universityId, name);

    res.json({
      message: "University updated successfully",
      data: result,
    });
  } catch (err: any) {
    console.error("Error updating university:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

export default universityRouter;
