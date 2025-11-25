import axios from "axios";

let accessToken: string | null = null;
let universitySchema: string | null = null;
let isLoggingOut = false;

export const setAccessToken = (at: string) => {
  accessToken = at;
};

export const setUniversitySchema = (schema: string) => {
  console.log("Setting university schema to:", schema);
  universitySchema = schema;
};

export const clearAccessToken = () => {
  accessToken = null;
  universitySchema = null;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000",
  withCredentials: true,
});

// attach token to every request
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  if (universitySchema && !config.headers["x-university-schema"]) {
    config.headers["x-university-schema"] = universitySchema;
  }
  return config;
});

// handle token refresh
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        const newUniversitySchema = res.data.universitySchema;
        setAccessToken(newAccessToken);
        setUniversitySchema(newUniversitySchema);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers["x-university-schema"] = newUniversitySchema;
        return api(originalRequest);
      } catch (err) {
        console.error("refresh token error", err);
        if (!isLoggingOut) {
          isLoggingOut = true;
          if (window.location.pathname.includes("auth")) return;
          window.location.href = "/auth?mode=signin";
        }
      }
    }

    return Promise.reject(error);
  }
);
export default api;
export function getUniversitySchema() {
  return universitySchema;
}
