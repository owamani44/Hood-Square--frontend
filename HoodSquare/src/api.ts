import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || "http://localhost:8080";

export const myAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach token
myAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle auth errors
myAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token expired or invalid — clear session and redirect
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    if (status === 403) {
      // Authenticated but not authorized
      window.location.href = "/forbidden";
    }

    return Promise.reject(error);
  }
);