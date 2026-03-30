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
    console.log("Interceptor firing, token:", token ? "present" : "null"); 
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
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    

    return Promise.reject(error);
  }
);