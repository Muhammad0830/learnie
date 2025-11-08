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
