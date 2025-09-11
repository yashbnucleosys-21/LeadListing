import axios from 'axios';

// 1️⃣ User interface
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  department: string;
  status: string;
  joinDate: string;
  leadsAssigned: number;
  leadsConverted: number;
}

// 2️⃣ Payload for creating a new user
export type NewUserPayload = Omit<User, 'id' | 'joinDate' | 'leadsAssigned' | 'leadsConverted'>;

// 3️⃣ API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL;

// 4️⃣ Shared Axios client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // If backend uses cookies/auth
});

/**
 * Fetch all users
 */
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching users:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch users.');
  }
};

/**
 * Add a new user
 */
export const addUser = async (userData: NewUserPayload): Promise<User> => {
  try {
    const response = await apiClient.post<User>('/users', userData);
    return response.data;
  } catch (error: any) {
    console.error('Error adding user:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to add user.');
  }
};

/**
 * Update an existing user
 */
export const updateUser = async (id: number, data: Partial<User>): Promise<User> => {
  try {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error(`Error updating user ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update user.');
  }
};

/**
 * Delete a user
 */
export const deleteUser = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/users/${id}`);
  } catch (error: any) {
    console.error(`Error deleting user ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to delete user.');
  }
};
