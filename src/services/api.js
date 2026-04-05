import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
});

// --- REQUEST INTERCEPTOR (The Bearer Token & Logger) ---
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token; // Get token from Zustand
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Custom Logger: Request
    console.log(`%c [API Request] ${config.method.toUpperCase()} -> ${config.url}`, "color: #007bff; font-weight: bold", config.data || "");
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- RESPONSE INTERCEPTOR (The Global Error Handler & Logger) ---
api.interceptors.response.use(
  (response) => {
    // Custom Logger: Response
    console.log(`%c [API Response] ${response.status} <- ${response.config.url}`, "color: #28a745; font-weight: bold", response.data);
    return response;
  },
  (error) => {
    // If the backend says the token is expired (401), we can auto-logout
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/"; // Send them back to login
    }

    console.error(`%c [API Error] ${error.response?.status} !! ${error.config?.url}`, "color: #dc3545; font-weight: bold", error.response?.data);
    
    return Promise.reject(error);
  }
);

export default api;