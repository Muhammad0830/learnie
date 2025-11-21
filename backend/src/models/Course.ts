import { queryGlobal, queryUniversity } from "../utils/helper";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function getCoursesList({
  schemaName,
  page,
  limit,
  search,
}: {
  schemaName: string;
  page: number;
  limit: number;
  search: string;
}) {
  try {
    const searchCondition = search ? `(c.name LIKE :search)` : "1=1";

    const sql = `
        SELECT
            c.*,
            COUNT(DISTINCT t.id) AS topics_count,
            COUNT(DISTINCT l.id) AS lectures_count,
            COUNT(DISTINCT a.id) AS assignments_count,
            COUNT(DISTINCT p.id) AS presentations_count
          FROM courses c
            LEFT JOIN course_topics t ON c.id = t.course_id
            LEFT JOIN lectures l ON c.id = l.course_id
            LEFT JOIN assignments a ON c.id = a.course_id
            LEFT JOIN presentations p ON c.id = p.course_id
            WHERE ${searchCondition} 
            GROUP BY c.id, c.name, c.description, c.has_topics
            ORDER BY c.created_at DESC LIMIT ${limit} 
            OFFSET ${(page - 1) * limit}`;

    const rows = await queryUniversity<RowDataPacket[]>(schemaName, sql, {
      search: `%${search}%`,
    });

    if (rows.length === 0) {
      throw new Error("No courses found");
    }

    const totalResult = await queryUniversity<any>(
      schemaName,
      `SELECT COUNT(*) as count FROM courses where ${searchCondition}`,
      { search: `%${search}%` }
    );
    const totalCourses = totalResult[0].count;
    const totalPages = Math.ceil(totalCourses / limit);

    return { courses: rows, page, limit, totalCourses, totalPages };
  } catch (error: any) {
    throw new Error(error.message || "Error fetching courses:");
  }
}

export async function getEachCourse({
  courseId: id,
  schemaName,
}: {
  courseId: string;
  schemaName: string;
}) {
  try {
    const rows = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT * FROM courses
        WHERE id = :id`,
      { id }
    );

    if (rows.length === 0) {
      throw new Error("Course not found");
    }

    const teachers = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT u.id, u.name FROM users as u
        LEFT JOIN users_courses uc ON u.id = uc.user_id
        WHERE uc.course_id = :id and u.role = 'teacher'`,
      { id }
    );

    const students = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT u.id, u.name FROM users as u
        LEFT JOIN users_courses uc ON u.id = uc.user_id
        WHERE uc.course_id = :id and u.role = 'student'`,
      { id }
    );

    return { course: rows[0], teachers: teachers, students: students };
  } catch (err: any) {
    throw new Error(err.message || "Error fetching course:");
  }
}

export async function createCourse({
  schemaName,
  name,
  description,
}: {
  schemaName: string;
  name: string;
  description: string;
}) {
  try {
    const rows = await queryUniversity<ResultSetHeader>(
      schemaName,
      `INSERT INTO courses (name, description) 
        VALUES (:name, :description)`,
      { name, description }
    );

    return {
      id: rows.insertId,
      name,
      description,
    };
  } catch (err: any) {
    throw new Error(err.message || "Error inserting course:");
  }
}

export async function updateCourse({
  schemaName,
  courseId: id,
  name,
  description,
}: {
  schemaName: string;
  courseId: string;
  name: string;
  description: string;
}) {
  try {
    const rows = await queryUniversity<ResultSetHeader>(
      schemaName,
      `UPDATE courses 
       SET name = :name, description = :description
       WHERE id = :id`,
      { name, description, id }
    );

    return {
      id,
      name,
      description,
    };
  } catch (err: any) {
    throw new Error(err.message || "Error updating course:");
  }
}

export async function deleteCourse({
  schemaName,
  courseId: id,
}: {
  schemaName: string;
  courseId: string;
}) {
  try {
    const course = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT * FROM courses WHERE id = :id`,
      { id }
    );

    if (course.length === 0) {
      throw new Error("Course not found");
    }

    const rows = await queryUniversity<ResultSetHeader>(
      schemaName,
      `DELETE FROM courses WHERE id = :id`,
      { id }
    );

    return {
      id,
    };
  } catch (err: any) {
    throw new Error(err.message || "Error deleting course:");
  }
}

export async function getCourseTopicsList({
  courseId,
  schemaName,
}: {
  courseId: string;
  schemaName: string;
}) {
  try {
    const rows = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT * FROM course_topics
        WHERE course_id = :courseId`,
      { courseId }
    );

    if (rows.length === 0) {
      throw new Error("Course topics not found");
    }

    return rows;
  } catch (err: any) {
    throw new Error(err.message || "Error fetching course topics:");
  }
}

export async function createCourseTopic({
  schemaName,
  courseId,
  title,
  description,
}: {
  schemaName: string;
  courseId: string;
  title: string;
  description: string;
}) {
  try {
    const rows = await queryUniversity<ResultSetHeader>(
      schemaName,
      `INSERT INTO course_topics (course_id, title, description) 
        VALUES (:courseId, :title, :description)`,
      { courseId, title, description }
    );

    const updateCourse = await queryUniversity<ResultSetHeader>(
      schemaName,
      `UPDATE courses 
        SET has_topics = 1
        WHERE id = :courseId`,
      { courseId }
    );

    return {
      id: rows.insertId,
      title,
      description,
    };
  } catch (err: any) {
    throw new Error(err.message || "Error inserting course topic:");
  }
}

export async function createBothCourseAndTopic({
  schemaName,
  title,
  description,
  topicTitle,
  topicDescription,
}: {
  schemaName: string;
  title: string;
  description: string;
  topicTitle: string;
  topicDescription: string;
}) {
  try {
    const result = await createCourse({
      schemaName,
      name: title,
      description: description,
    });

    if (!result.id) {
      throw new Error("Error creating course");
    }

    const courseId = result.id;

    const rows = await queryUniversity<ResultSetHeader>(
      schemaName,
      `INSERT INTO course_topics (course_id, title, description) 
        VALUES (:courseId, :title, :description)`,
      { courseId, title: topicTitle, description: topicDescription }
    );

    const updateCourse = await queryUniversity<ResultSetHeader>(
      schemaName,
      `UPDATE courses 
        SET has_topics = 1
        WHERE id = :courseId`,
      { courseId }
    );

    return {
      courseId: courseId,
      topicId: rows.insertId,
      courseTitle: title,
      courseDescription: description,
      topicTitle: topicTitle,
      topicDescription: topicDescription,
    };
  } catch (err: any) {
    throw new Error(err.message || "Error inserting course topic:");
  }
}

export async function getCourseTopic({
  courseId,
  schemaName,
  topicId,
}: {
  courseId: string;
  schemaName: string;
  topicId: string;
}) {
  try {
    const couserTopics = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT ct.* FROM course_topics as ct
        WHERE course_id = :courseId AND id = :topicId`,
      { courseId, topicId }
    );

    const assignments = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT * FROM assignments
        WHERE course_id = :courseId AND topic_id = :topicId`,
      { courseId, topicId }
    );

    const lectures = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT * FROM lectures
        WHERE course_id = :courseId AND topic_id = :topicId`,
      { courseId, topicId }
    );

    const presentations = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT * FROM presentations
        WHERE course_id = :courseId AND topic_id = :topicId`,
      { courseId, topicId }
    );

    if (couserTopics.length === 0) {
      throw new Error("Course topic not found");
    }

    return {
      course_topics: couserTopics[0],
      assignments: assignments,
      lectures: lectures,
      presentations: presentations,
    };
  } catch (err: any) {
    throw new Error(err.message || "Error fetching course topic:");
  }
}

export async function getEachLecture({
  schemaName,
  lectureId,
}: {
  schemaName: string;
  lectureId: string;
}) {
  try {
    const rows = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT * FROM lectures
        WHERE id = :lectureId`,
      { lectureId }
    );

    if (rows.length === 0) {
      throw new Error("Lecture not found");
    }

    return rows;
  } catch (err: any) {
    throw new Error(err.message || "Error fetching lecture:");
  }
}

export async function getEachPresentation({
  schemaName,
  presentationId,
}: {
  schemaName: string;
  presentationId: string;
}) {
  try {
    const rows = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT * FROM presentations
        WHERE id = :presentationId`,
      { presentationId }
    );

    if (rows.length === 0) {
      throw new Error("Presentation not found");
    }

    return rows;
  } catch (err: any) {
    throw new Error(err.message || "Error fetching presentation:");
  }
}

export async function getEachAssignment({
  schemaName,
  assignmentId,
}: {
  schemaName: string;
  assignmentId: string;
}) {
  try {
    const rows = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT * FROM assignments
        WHERE id = :assignmentId`,
      { assignmentId }
    );

    if (rows.length === 0) {
      throw new Error("Assignment not found");
    }

    return rows;
  } catch (err: any) {
    throw new Error(err.message || "Error fetching assignment:");
  }
}

export async function createCourseTopicAssignment({
  courseId,
  topicId,
  schemaName,
  title,
  description,
  images,
  due_date,
}: {
  courseId: string;
  topicId: string;
  schemaName: string;
  title: string;
  description: string;
  images: string;
  due_date: string;
}) {
  try {
    const imagesJson = JSON.stringify(images);

    const result = await queryUniversity<ResultSetHeader>(
      schemaName,
      `INSERT INTO assignments (course_id, topic_id, title, description, images, due_date) 
        VALUES (:courseId, :topicId, :title, :description, :images, :due_date)`,
      { courseId, topicId, title, description, images: imagesJson, due_date }
    );

    return {
      id: result.insertId,
      title: title,
      description: description,
      due_date: due_date,
    };
  } catch (err: any) {
    throw new Error(err.message || "Error fetching course topic assignments:");
  }
}

export async function createCourseTopicLectures({
  courseId,
  topicId,
  schemaName,
  title,
  content,
  video,
  image,
}: {
  courseId: string;
  topicId: string;
  schemaName: string;
  title: string;
  content: string;
  video: string;
  image: string;
}) {
  try {
    const result = await queryUniversity<ResultSetHeader>(
      schemaName,
      `INSERT INTO lectures (course_id, topic_id, title, content, image_url, video_url) 
        VALUES (:courseId, :topicId, :title, :content, :image, :video)`,
      { courseId, topicId, title, content, image, video }
    );

    return {
      id: result.insertId,
      title: title,
      description: content,
    };
  } catch (err: any) {
    throw new Error(err.message || "Error fetching course topic assignments:");
  }
}

export async function createCourseTopicPresentations({
  courseId,
  topicId,
  schemaName,
  title,
  file_url,
}: {
  courseId: string;
  topicId: string;
  schemaName: string;
  title: string;
  file_url: string;
}) {
  try {
    const result = await queryUniversity<ResultSetHeader>(
      schemaName,
      `INSERT INTO presentations (course_id, topic_id, title, file_url) 
        VALUES (:courseId, :topicId, :title, :file_url)`,
      { courseId, topicId, title, file_url }
    );

    return {
      id: result.insertId,
      title: title,
    };
  } catch (err: any) {
    throw new Error(err.message || "Error fetching course topic assignments:");
  }
}

export async function deleteCourseTopic({
  courseId,
  topicId,
  schemaName,
}: {
  courseId: string;
  topicId: string;
  schemaName: string;
}) {
  try {
    const result = await queryUniversity<ResultSetHeader>(
      schemaName,
      `DELETE FROM course_topics WHERE course_id = :courseId AND id = :topicId`,
      { courseId, topicId }
    );

    const course = await queryUniversity<RowDataPacket[]>(
      schemaName,
      `SELECT Count(*) as count FROM course_topics WHERE course_id = :courseId`,
      { courseId }
    );

    if (course[0].count === 0) {
      await queryUniversity<ResultSetHeader>(
        schemaName,
        `UPDATE courses 
          SET has_topics = 0
          WHERE id = :courseId`,
        { courseId }
      );
    }

    return {
      id: topicId,
    };
  } catch (err: any) {
    throw new Error(err.message || "Error deleting course topic:");
  }
}

export async function deleteCourseTopicAssignment({
  assignmentId,
  schemaName,
}: {
  assignmentId: string;
  schemaName: string;
}) {
  try {
    const result = await queryUniversity<ResultSetHeader>(
      schemaName,
      `DELETE FROM assignments WHERE id = :assignmentId`,
      { assignmentId }
    );

    return {
      id: assignmentId,
    };
  } catch (err: any) {
    throw new Error(err.message || "Error deleting course topic assignment:");
  }
}

export async function deleteCourseTopicLecture({
  lectureId,
  schemaName,
}: {
  lectureId: string;
  schemaName: string;
}) {
  try {
    const result = await queryUniversity<ResultSetHeader>(
      schemaName,
      `DELETE FROM lectures WHERE id = :lectureId`,
      { lectureId }
    );

    return {
      id: lectureId,
    };
  } catch (err: any) {
    throw new Error(err.message || "Error deleting course topic lecture:");
  }
}
export async function deleteCourseTopicPresentation({
  presentationId,
  schemaName,
}: {
  presentationId: string;
  schemaName: string;
}) {
  try {
    const result = await queryUniversity<ResultSetHeader>(
      schemaName,
      `DELETE FROM presentations WHERE id = :presentationId`,
      { presentationId }
    );

    return {
      id: presentationId,
    };
  } catch (err: any) {
    throw new Error(err.message || "Error deleting course topic presentation:");
  }
}

export async function updateCourseTopicAssignment({
  assignmentId,
  schemaName,
  title,
  description,
  images,
  due_date,
}: {
  assignmentId: string;
  schemaName: string;
  title: string;
  description: string;
  images: string;
  due_date: string;
}) {
  try {
    const imagesJson = JSON.stringify(images);

    // check if assignment exists
    await getEachAssignment({ schemaName, assignmentId });

    const result = await queryUniversity<ResultSetHeader>(
      schemaName,
      `UPDATE assignments 
        SET title = :title, description = :description, images = :images, due_date = :due_date
        WHERE id = :assignmentId`,
      { title, description, images: imagesJson, due_date, assignmentId }
    );

    return {
      id: assignmentId,
      title: title,
      description: description,
      due_date: due_date,
    };
  } catch (err: any) {
    throw new Error(err.message || "Error updating course topic assignment:");
  }
}

export async function updateCourseTopicLecture({
  lectureId,
  schemaName,
  title,
  content,
  image,
  video,
}: {
  lectureId: string;
  schemaName: string;
  title: string;
  content: string;
  image: string;
  video: string;
}) {
  try {
    // check if lecture exists
    await getEachLecture({ schemaName, lectureId });

    const result = await queryUniversity<ResultSetHeader>(
      schemaName,
      `UPDATE lectures 
        SET title = :title, content = :content, image_url = :image, video_url = :video
        WHERE id = :lectureId`,
      { title, content, image, video, lectureId }
    );

    return {
      message: "Lecture updated successfully",
      id: lectureId,
    };
  } catch (err: any) {
    throw new Error(err.message || "Error updating course topic assignment:");
  }
}

export async function updateCourseTopicPresentation({
  presentationId,
  schemaName,
  title,
  file_url,
}: {
  presentationId: string;
  schemaName: string;
  title: string;
  file_url: string;
}) {
  try {
    // check if presentation exists
    await getEachPresentation({ schemaName, presentationId });

    const result = await queryUniversity<ResultSetHeader>(
      schemaName,
      `UPDATE presentations 
        SET title = :title, file_url = :file_url
        WHERE id = :presentationId`,
      { title, file_url, presentationId }
    );

    return {
      message: "Presentation updated successfully",
      id: presentationId,
    };
  } catch (err: any) {
    throw new Error(err.message || "Error updating course topic assignment:");
  }
}
