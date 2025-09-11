import axios from 'axios';

// The User interface remains the same. It correctly matches your backend data.
export interface User {
  id: number;
  name: string;
  email: string;
  password:string;
  phone: string;
  role: string;
  department: string;
  status: string;
  joinDate: string;
  leadsAssigned: number;
  leadsConverted: number;
}

// The payload for creating a new user also remains the same.
export type NewUserPayload = Omit<User, 'id' | 'joinDate' | 'leadsAssigned' | 'leadsConverted'>;

// Use your actual backend URL
// const API_BASE_URL = 'http://localhost:5000';
// const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';


// Create a configured instance of axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetches all users from your backend.
 * (No changes needed here)
 * @returns A promise that resolves to an array of User objects.
 */
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users from the server.');
  }
};

/**
 * Sends a new user's data to be created in the backend.
 * (No changes needed here)
 * @param userData The data for the new user.
 * @returns A promise that resolves to the newly created User object from the backend.
 */
export const addUser = async (userData: NewUserPayload): Promise<User> => {
  try {
    const response = await apiClient.post<User>('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    throw new Error('Failed to add the user on the server.');
  }
};

/**
 * NEW: Sends updated user data to the backend.
 * This will be used for an "Edit User" feature.
 * @param userId The ID of the user to update.
 * @param userData The fields to update. Partial<User> means we can send only the changed fields.
 * @returns A promise that resolves to the updated User object from the backend.
 */
export const updateUser = async (id: number, data: Partial<User>): Promise<User> => {
  try {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error(`Error updating user ${id}:`, error.response?.data || error.message);
    throw new Error('Failed to update user on the server.');
  }
};

// userApi.ts
export const deleteUser = async (id: number): Promise<void> => {
  const res = await fetch(`http://localhost:5000/api/users/${id}`, {
    method: 'DELETE'
  });

  if (!res.ok) {
    throw new Error('Failed to delete user');
  }
};
