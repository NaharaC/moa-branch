import axios from "axios";
import { env } from "@/config/env";

export const api = axios.create({
  baseURL: env.API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("moa.accessToken");
  if (token) {
    token.replace(/^"+|"+$/g, "");
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
