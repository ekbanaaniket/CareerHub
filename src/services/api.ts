// ============= Base API Service with Axios =============
import axios from "axios";

const MOCK_DELAY = 300;

// Create axios instance — when real backend is ready, just update baseURL
export const apiClient = axios.create({
  baseURL: "/api/v1",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — add auth token when available
apiClient.interceptors.request.use((config) => {
  // TODO: Add real auth token from backend
  // const token = localStorage.getItem("token");
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.warn("Unauthorized — redirect to login");
    }
    return Promise.reject(error);
  }
);

// Mock API helper — simulates backend delay
export async function mockApiCall<T>(data: T, delay = MOCK_DELAY): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}

export async function mockApiError(message: string, delay = MOCK_DELAY): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), delay);
  });
}

export const API_BASE_URL = "/api/v1";

export function buildQueryString(params: Record<string, string | number | undefined>): string {
  const filtered = Object.entries(params).filter(([, v]) => v !== undefined && v !== "");
  if (filtered.length === 0) return "";
  return "?" + filtered.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&");
}
