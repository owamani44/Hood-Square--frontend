import axios from "axios";

// Use an environment variable for the API Gateway URL
const BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || "http://localhost:8080";

export const myAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

myAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
})