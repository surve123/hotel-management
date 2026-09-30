import axios from 'axios';

// Get API base URL from environment variable or default to local Spring Boot backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const TOKEN_KEY = 'arnavee_access_token';
export const REFRESH_TOKEN_KEY = 'arnavee_refresh_token';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Bearer token to all outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Format error responses and handle 401/403 Unauthorized
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If backend returns a structured message, attach it
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (error.code === 'ERR_NETWORK'
        ? 'Cannot connect to backend server. Ensure Spring Boot is running on port 8080.'
        : error.message || 'An unexpected error occurred');

    if (error.response?.status === 401) {
      console.warn('Session expired or invalid token. Redirecting to login...');
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem('arnavee_auth_session_v2');

      // Only redirect if not already on the login page
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(new Error(errorMsg));
  }
);

export default api;
