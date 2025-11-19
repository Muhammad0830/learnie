export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
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
