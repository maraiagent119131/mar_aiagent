import axios from "axios";
import { getToken, removeToken } from "../auth/token";

// 🔥 HARD-CODED BACKEND (FORCE OVERRIDE)
const BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: BASE_URL,
});

// ======================================================
// ATTACH JWT TO EVERY REQUEST
// ======================================================
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ======================================================
// HANDLE AUTH ERROR
// ======================================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;