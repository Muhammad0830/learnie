export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  phoneNumber: string;
  created_at: string;
  updated_at: string;
  age: string | null;
  studentId?: string | null;
}

export interface LoginFormData {
  email: string;
  password: string;
  role: string;
  universitySchema: string;
}

export interface LoginResponse {
  accessToken: string;
  universitySchema: string;
}

export interface University {
  id: string;
  name: string;
  schema_name: string;
  created_at: string;
  updated_at: string | null;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  created_at: string;
  updated_at: string | null;
  phoneNumber: string;
  age: string | null;
}

export interface StudentListResponse {
  users: Student[];
  page: number;
  limit: number;
  totalUsers: number;
  totalPages: number;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string | null;
  phoneNumber: string;
  age: string | null;
}

export interface TeacherListResponse {
  users: Teacher[];
  page: number;
  limit: number;
  totalUsers: number;
  totalPages: number;
}

export interface CoursesListResponse {
  courses: Course[];
  page: number;
  limit: number;
  totalCourses: number;
  totalPages: number;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  has_topics: boolean;
  created_at: string;
  updated_at: string | null;
  topics_count: number;
  lectures_count: number;
  assignments_count: number;
  presentations_count: number;
}

export interface Topic {
  id: number;
  course_id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string | null;
}

export interface Lecture {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  video_url: string | null;
  created_at: string;
  updated_at: string | null;
}

interface AssignmentImage {
  url: string;
  title: string;
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  due_date: string;
  images: AssignmentImage[];
  created_at: string;
  updated_at: string | null;
}

export interface Presentation {
  id: number;
  title: string;
  file_url: string;
  created_at: string;
  updated_at: string | null;
}

export interface EachTopicResponseData {
  course_topic: Topic;
  assignments: Assignment[];
  lectures: Lecture[];
  presentations: Presentation[];
}

export interface EachCourseResponseData {
  course: Course;
  topics: EachTopicResponseData[];
  teachers: Teacher[];
  students: Student[];
}

export interface defaultLectureType {
  courseId: string;
  topicId: string;
  title: string;
  content: string;
  image_url: string;
  video_url: string;
}
export interface defaultAssignmentType {
  courseId: string;
  topicId: string;
  title: string;
  description: string;
  due_date: string;
  images: string[];
}
export interface defaultPresentationType {
  courseId: string;
  topicId: string;
  title: string;
  file_url: string;
}
