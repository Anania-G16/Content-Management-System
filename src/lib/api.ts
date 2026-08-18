import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const publicEndpoints = [
  "/api/auth/register",
  "/api/auth/login",
  "/api/auth/verify-email",
];

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  const isPublicEndpoint = publicEndpoints.includes(config.url ?? "");

  if (token && !isPublicEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;