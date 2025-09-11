import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/auth'; // Adjust if your backend URL is different

const API_URL = import.meta.env.VITE_API_URL || 'https://leadlisting.onrender.com/api'||'http://localhost:5000/api'; // Use environment variable for production
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'; // Use environment variable for production
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
    // Add any other user properties you want to use in the frontend
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
      // Throw an error with the server's message if it exists
      throw new Error(error.response.data.message || 'An unknown error occurred.');
    }
    // Throw a generic error for other cases
    throw new Error('Login failed. Please check your connection and try again.');
  }
};