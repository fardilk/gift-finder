import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Prefer VITE_API_URL, fallback to VITE_API_BASE_URL, then localhost
const { VITE_API_URL, VITE_API_BASE_URL } = import.meta.env as unknown as {
  VITE_API_URL?: string;
  VITE_API_BASE_URL?: string;
};

const API_BASE = VITE_API_URL || VITE_API_BASE_URL || 'http://localhost:3000';
const TOKEN_KEY = 'auth_token';

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
  return config;
});

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  (err: unknown) => {
    const axiosErr = err as AxiosError;
    if (axiosErr?.response?.status === 401) {
      // clear invalid token; the guard will redirect
      localStorage.removeItem(TOKEN_KEY);
    }
    return Promise.reject(axiosErr);
  }
);

export default api;
