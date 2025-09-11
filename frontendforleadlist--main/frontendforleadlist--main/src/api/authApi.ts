import axios from 'axios';

// Use Vite environment variable, fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Interface for the login payload
export interface LoginPayload {
  email: string;
  password: string;
}

// Interface for the successful login response
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

/**
 * Sends a login request to the backend.
 * @param credentials - The user's email and password.
 * @returns The login response from the server.
 */
export const login = async (credentials: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'An unknown error occurred.');
    }
    throw new Error('Login failed. Please check your connection and try again.');
  }
};
