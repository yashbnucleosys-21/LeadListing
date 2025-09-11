import axios from 'axios';

// 1. Interface for a single Role
export interface Role {
  id: number;
  name: string;
}

// 2. Payload for creating/updating a role
export type NewRolePayload = Omit<Role, 'id'>;

// 3. API base URL (Vite environment variable for production)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// 4. Shared Axios client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // If your backend uses cookies/auth
});

/**
 * Fetch all roles
 */
export const getRoles = async (): Promise<Role[]> => {
  try {
    const response = await apiClient.get<Role[]>('/roles');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching roles:', error.response?.data || error.message);
    throw new Error('Failed to fetch roles from the server.');
  }
};

/**
 * Add a new role
 */
export const addRole = async (roleData: NewRolePayload): Promise<Role> => {
  try {
    const response = await apiClient.post<Role>('/roles', roleData);
    return response.data;
  } catch (error: any) {
    console.error('Error adding role:', error.response?.data || error.message);
    throw new Error('Failed to add the role on the server.');
  }
};

/**
 * Update an existing role
 */
export const updateRole = async (id: number, data: Partial<NewRolePayload>): Promise<Role> => {
  try {
    const response = await apiClient.put<Role>(`/roles/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error(`Error updating role ${id}:`, error.response?.data || error.message);
    throw new Error('Failed to update role on the server.');
  }
};

/**
 * Delete a role by ID
 */
export const deleteRole = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/roles/${id}`);
  } catch (error: any) {
    console.error(`Error deleting role ${id}:`, error.response?.data || error.message);
    throw new Error('Failed to delete the role on the server.');
  }
};
