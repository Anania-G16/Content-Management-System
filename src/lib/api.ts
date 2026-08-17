import axios from "axios";

const api = axios.create({
  // baseURL: "https://cms-api-p2mz.onrender.com",
  baseURL: "http://192.168.0.139:3000/",

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