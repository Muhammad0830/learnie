import express from "express";
import {
  createCourse,
  createCourseTopic,
  createCourseTopicAssignment,
  createCourseTopicLectures,
  createCourseTopicPresentations,
  deleteCourse,
  deleteCourseTopic,
  deleteCourseTopicAssignment,
  deleteCourseTopicLecture,
  deleteCourseTopicPresentation,
  getCoursesList,
  getCourseTopic,
  getCourseTopicsList,
  getEachAssignment,
  getEachCourse,
  getEachLecture,
  getEachPresentation,
  updateCourse,
  updateCourseTopicAssignment,
  updateCourseTopicLecture,
  updateCourseTopicPresentation,
} from "../models/Course";
import { validateUniversitySchema } from "../middlewares/validateUniversitySchema";

const coursesRouter = express.Router();

coursesRouter.get("/", validateUniversitySchema, async (req, res) => {
  try {
    const schemaName = (req as any).universitySchema;
    const {
      page = "1",
      limit = "10",
      search = "",
    } = req.query as { page: string; limit: string; search: string };

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    if (isNaN(parsedPage) || isNaN(parsedLimit)) {
      return res.status(400).json({ error: "Invalid page or limit" });
    }

    const result = await getCoursesList({
      schemaName,
      page: parsedPage,
      limit: parsedLimit,
      search,
    });

    res.json(result);
  } catch (error: any) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

coursesRouter.get("/:courseId", validateUniversitySchema, async (req, res) => {
  try {
    const schemaName = (req as any).universitySchema;

    const courseId = req.params.courseId;
    if (!courseId) {
      return res.status(400).json({ error: "Missing courseId" });
    }

    const result = await getEachCourse({ courseId, schemaName });

    res.json(result);
  } catch (err: any) {
    console.error("Error fetching course:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

coursesRouter.get(
  "/:courseId/topics",
  validateUniversitySchema,
  async (req, res) => {
    try {
      const schemaName = (req as any).universitySchema;

      const courseId = req.params.courseId;
      if (!courseId) {
        return res.status(400).json({ error: "Missing courseId" });
      }

      // this checks existance of the course
      await getEachCourse({ courseId, schemaName });

      const result = await getCourseTopicsList({ courseId, schemaName });

      res.json(result);
    } catch (err: any) {
      console.error("Error fetching course topics:", err);
      res.status(500).json({ error: err.message || "Internal Server Error" });
    }
  }
);

coursesRouter.post("/", validateUniversitySchema, async (req, res) => {
  try {
    const schemaName = (req as any).universitySchema;

    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Missing name" });
    } else if (!description) {
      return res.status(400).json({ error: "Missing description" });
    }

    const result = await createCourse({
      schemaName,
      name,
      description,
    });

    res.status(201).json({
      data: result,
    });
  } catch (err: any) {
    console.error("Error inserting course:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

coursesRouter.get(
  "/:courseId/topics/:topicId",
  validateUniversitySchema,
  async (req, res) => {
    try {
      const schemaName = (req as any).universitySchema;

      const courseId = req.params.courseId;
      const topicId = req.params.topicId;
      if (!courseId) {
        return res.status(400).json({ error: "Missing courseId" });
      }

      // this checks existance of the course
      await getEachCourse({ courseId, schemaName });

      const result = await getCourseTopic({ courseId, topicId, schemaName });

      res.json(result);
    } catch (err: any) {
      console.error("Error fetching course topic:", err);
      res.status(500).json({ error: err.message || "Internal Server Error" });
    }
  }
);

coursesRouter.post(
  "/:courseId/topics",
  validateUniversitySchema,
  async (req, res) => {
    try {
      const schemaName = (req as any).universitySchema;

      const courseId = req.params.courseId;
      const { title, description } = req.body;

      if (!title) {
        return res.status(400).json({ error: "Missing topic title" });
      }

      // this checks existance of the course
      await getEachCourse({ courseId, schemaName });

      const result = await createCourseTopic({
        schemaName,
        courseId,
        title,
        description,
      });

      res.status(201).json({
        data: result,
      });
    } catch (err: any) {
      console.error("Error inserting course topic:", err);
      res.status(500).json({ error: err.message || "Internal Server Error" });
    }
  }
);

coursesRouter.get(
  "/lectures/:lectureId",
  validateUniversitySchema,
  async (req, res) => {
    try {
      const schemaName = (req as any).universitySchema;

      const lectureId = req.params.lectureId;
      if (!lectureId) {
        return res.status(400).json({ error: "Missing lectureId" });
      }

      const result = await getEachLecture({ lectureId, schemaName });

      res.json(result);
    } catch (err: any) {
      console.error("Error fetching course topic:", err);
      res.status(500).json({ error: err.message || "Internal Server Error" });
    }
  }
);

coursesRouter.get(
  "/presentations/:presentationId",
  validateUniversitySchema,
  async (req, res) => {
    try {
      const schemaName = (req as any).universitySchema;

      const presentationId = req.params.presentationId;
      if (!presentationId) {
        return res.status(400).json({ error: "Missing presentationId" });
      }

      const result = await getEachPresentation({ presentationId, schemaName });

      res.json(result);
    } catch (err: any) {
      console.error("Error fetching course topic:", err);
      res.status(500).json({ error: err.message || "Internal Server Error" });
    }
  }
);

coursesRouter.get(
  "/assignments/:assignmentId",
  validateUniversitySchema,
  async (req, res) => {
    try {
      const schemaName = (req as any).universitySchema;

      const assignmentId = req.params.assignmentId;
      if (!assignmentId) {
        return res.status(400).json({ error: "Missing assignmentId" });
      }

      const result = await getEachAssignment({ assignmentId, schemaName });

      res.json(result);
    } catch (err: any) {
      console.error("Error fetching course topic:", err);
      res.status(500).json({ error: err.message || "Internal Server Error" });
    }
  }
);

coursesRouter.post(
  "/:courseId/topics/:topicId/assignments",
  validateUniversitySchema,
  async (req, res) => {
    try {
      const schemaName = (req as any).universitySchema;
      const { title, description, due_date, images } = req.body;

      const courseId = req.params.courseId;
      const topicId = req.params.topicId;
      if (!courseId) {
        return res.status(400).json({ error: "Missing courseId" });
      } else if (!title) {
        return res.status(400).json({ error: "Missing title" });
      } else if (!due_date) {
        return res.status(400).json({ error: "Missing due_date" });
      }

      // this checks existance of the course
      await getEachCourse({ courseId, schemaName });

      const result = await createCourseTopicAssignment({
        courseId,
        topicId,
        schemaName,
        title,
        description,
        images,
        due_date,
      });

      res.json(result);
    } catch (err: any) {
      console.error("Error fetching course topic:", err);
      res.status(500).json({ error: err.message || "Internal Server Error" });
    }
  }
);

coursesRouter.post(
  "/:courseId/topics/:topicId/lectures",
  validateUniversitySchema,
  async (req, res) => {
    try {
      const schemaName = (req as any).universitySchema;
      const { title, content, image, video } = req.body;

      const courseId = req.params.courseId;
      const topicId = req.params.topicId;
      if (!courseId) {
        return res.status(400).json({ error: "Missing courseId" });
      } else if (!title) {
        return res.status(400).json({ error: "Missing title" });
      } else if (!image && !video) {
        return res.status(400).json({ error: "Missing both image and video" });
      }

      // this checks existance of the course
      await getEachCourse({ courseId, schemaName });

      const result = await createCourseTopicLectures({
        courseId,
        topicId,
        schemaName,
        title,
        content,
        video,
        image,
      });

      res.json(result);
    } catch (err: any) {
      console.error("Error fetching course topic:", err);
      res.status(500).json({ error: err.message || "Internal Server Error" });
    }
  }
);

coursesRouter.post(
  "/:courseId/topics/:topicId/presentations",
  validateUniversitySchema,
  async (req, res) => {
    try {
      const schemaName = (req as any).universitySchema;
      const { title, file_url } = req.body;

      const courseId = req.params.courseId;
      const topicId = req.params.topicId;
      if (!courseId) {
        return res.status(400).json({ error: "Missing courseId" });
      } else if (!title) {
        return res.status(400).json({ error: "Missing title" });
      } else if (!file_url) {
        return res.status(400).json({ error: "Missing file_url" });
      }

      // this checks existance of the course
      await getEachCourse({ courseId, schemaName });

      const result = await createCourseTopicPresentations({
        courseId,
        topicId,
        schemaName,
        title,
        file_url,
      });

      res.json(result);
    } catch (err: any) {
      console.error("Error fetching course topic:", err);
      res.status(500).json({ error: err.message || "Internal Server Error" });
    }
  }
);

coursesRouter.put("/:courseId", validateUniversitySchema, async (req, res) => {
  try {
    const schemaName = (req as any).universitySchema;

    const courseId = req.params.courseId;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Missing name" });
    } else if (!description) {
      return res.status(400).json({ error: "Missing description" });
    }

    const result = await updateCourse({
      schemaName,
      courseId,
      name,
      description,
    });

    res.json({
      message: "Course updated successfully",
      data: result,
    });
  } catch (err: any) {
    console.error("Error updating course:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

coursesRouter.delete(
  "/:courseId",
  validateUniversitySchema,
  async (req, res) => {
    try {
      const schemaName = (req as any).universitySchema;

      const courseId = req.params.courseId;
      if (!courseId) {
        return res.status(400).json({ error: "Missing courseId" });
      }

      const result = await deleteCourse({ schemaName, courseId });

      res.json({
        message: "Course deleted successfully",
        id: result.id,
      });
    } catch (error: any) {
      console.error("Error deleting course:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  }
);

coursesRouter.put(
  "/assignments/:assignmentId",
  validateUniversitySchema,
  async (req, res) => {
    try {
      const schemaName = (req as any).universitySchema;

      const assignmentId = req.params.assignmentId;
      const { title, description, due_date, images } = req.body;

      if (!assignmentId) {
        return res.status(400).json({ error: "Missing assignment Id" });
      } else if (!title) {
        return res.status(400).json({ error: "Missing title" });
      } else if (!due_date) {
        return res.status(400).json({ error: "Missing due_date" });
      }

      const result = await updateCourseTopicAssignment({
        assignmentId,
        schemaName,
        title,
        description,
        images,
        due_date,
      });

      return res.status(200).json({
        message: "Assignment updated successfully",
        data: result,
      });
    } catch (err: any) {
      console.error("Error upadating assignment", err.message);
    }
  }
);

coursesRouter.put(
  "/lectures/:lectureId",
  validateUniversitySchema,
  async (req, res) => {
    try {
      const schemaName = (req as any).universitySchema;

      const lectureId = req.params.lectureId;
      const { title, content, video, image } = req.body;

      if (!lectureId) {
        return res.status(400).json({ error: "Missing lecture Id" });
      } else if (!title) {
        return res.status(400).json({ error: "Missing title" });
      } else if (!image && !video) {
        return res.status(400).json({ error: "Missing both video and image" });
      }

      const result = await updateCourseTopicLecture({
        lectureId,
        schemaName,
        title,
        content,
        image,
        video,
      });

      return res.status(200).json({
        message: "Assignment updated successfully",
        data: result,
      });
    } catch (err: any) {
      console.error("Error upadating assignment", err.message);
    }
  }
);

coursesRouter.put(
  "/presentations/:presentationId",
  validateUniversitySchema,
  async (req, res) => {
    try {
      const schemaName = (req as any).universitySchema;

      const presentationId = req.params.presentationId;
      const { title, file_url } = req.body;

      if (!title) {
        return res.status(400).json({ error: "Missing title" });
      } else if (!file_url) {
        return res.status(400).json({ error: "Missing due_date" });
      }

      const result = await updateCourseTopicPresentation({
        presentationId,
        schemaName,
        title,
        file_url,
      });

      return res.status(200).json({
        message: "Presentation updated successfully",
        data: result,
      });
    } catch (err: any) {
      console.error("Error upadating presentation", err.message);
    }
  }
);

coursesRouter.delete(
  "/:courseId/topics/:topicId",
  validateUniversitySchema,
  async (req, res) => {
    try {
      const schemaName = (req as any).universitySchema;

      const courseId = req.params.courseId;
      const topicId = req.params.topicId;
      if (!courseId) {
        return res.status(400).json({ error: "Missing courseId" });
      } else if (!topicId) {
        return res.status(400).json({ error: "Missing topicId" });
      }

      // this checks existance of the course
      await getEachCourse({ courseId, schemaName });

      const result = await deleteCourseTopic({ courseId, topicId, schemaName });

      res.json({
        message: "Course topic deleted successfully",
        id: result.id,
      });
    } catch (error: any) {
      console.error("Error deleting course topic:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  }
);

coursesRouter.delete(
  "/assignments/:assignmentId",
  validateUniversitySchema,
  async (req, res) => {
    try {
      const schemaName = (req as any).universitySchema;

      const assignmentId = req.params.assignmentId;
      if (!assignmentId) {
        return res.status(400).json({ error: "Missing assignmentId" });
      }

      const result = await deleteCourseTopicAssignment({
        assignmentId,
        schemaName,
      });

      res.json({
        message: "Assignment deleted successfully",
        id: result.id,
      });
    } catch (error: any) {
      console.error("Error deleting course topic:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  }
);

coursesRouter.delete(
  "/lectures/:lectureId",
  validateUniversitySchema,
  async (req, res) => {
    try {
      const schemaName = (req as any).universitySchema;

      const lectureId = req.params.lectureId;
      if (!lectureId) {
        return res.status(400).json({ error: "Missing lectureId" });
      }

      const result = await deleteCourseTopicLecture({
        lectureId,
        schemaName,
      });

      res.json({
        message: "Lecture deleted successfully",
        id: result.id,
      });
    } catch (error: any) {
      console.error("Error deleting course topic:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  }
);

coursesRouter.delete(
  "/presentations/:presentationId",
  validateUniversitySchema,
  async (req, res) => {
    try {
      const schemaName = (req as any).universitySchema;

      const presentationId = req.params.presentationId;
      if (!presentationId) {
        return res.status(400).json({ error: "Missing presentationId" });
      }

      const result = await deleteCourseTopicPresentation({
        presentationId,
        schemaName,
      });

      res.json({
        message: "Presentation deleted successfully",
        id: result.id,
      });
    } catch (error: any) {
      console.error("Error deleting course topic:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  }
);

export default coursesRouter;
