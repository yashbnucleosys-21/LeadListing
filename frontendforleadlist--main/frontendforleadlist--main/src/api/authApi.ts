import axios from 'axios';

// ✅ Use Vite environment variable for deployed backend, fallback to localhost for dev
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5432/api";

// Interface for login payload
export interface LoginPayload {
  email: string;
  password: string;
}

// Interface for successful login response
export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

// Shared Axios client
const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // if you use cookies/auth tokens
});

/**
 * Sends a login request to the backend.
 * @param credentials - The user's email and password.
 * @returns The login response from the server.
 */
export const login = async (credentials: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Login failed. Please check your credentials or server.'
    );
  }
};
