import api, { setAccessToken, clearAccessToken } from "@/lib/api";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await api.post("/auth/signup", data);
  setAccessToken(res.data.accessToken);
  return res.data;
}

export async function loginUser(data: { email: string; password: string }) {
  try {
    const res = await api.post("/auth/login", data);
    setAccessToken(res.data.accessToken);
    return res.data;
    // eslint-disable-next-line
  } catch (err: any) {
    const message = err.message;
    console.error("login failed", message);
  }
}

export async function logoutUser() {
  clearAccessToken();
  await api.post("/auth/logout");
}

export async function getProfile() {
  const res = await api.get("/user/me");
  console.log("res.data", res.data);
  return res.data;
}
