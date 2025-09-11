import axios from 'axios';

// 1. Define the interface for a single Role
export interface Role {
  id: number;
  name: string;
}

// 2. Define the payload for creating a new role
export type NewRolePayload = Omit<Role, 'id'>;

// 3. Define the base URL for your backend API
// const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// 4. Create a configured instance of axios for API calls
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * ✅ Fetches all roles from the backend.
 * @returns A promise that resolves to an array of Role objects.
 */
export const getRoles = async (): Promise<Role[]> => {
  try {
    const response = await apiClient.get<Role[]>('/roles');
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw new Error('Failed to fetch roles from the server.');
  }
};

/**
 * ✅ Sends new role data to be created in the backend.
 * @param roleData The data for the new role (e.g., { name: 'New Role' }).
 * @returns A promise that resolves to the newly created Role object.
 */
export const addRole = async (roleData: NewRolePayload): Promise<Role> => {
  try {
    const response = await apiClient.post<Role>('/roles', roleData);
    return response.data;
  } catch (error) {
    console.error('Error adding role:', error);
    throw new Error('Failed to add the role on the server.');
  }
};

/**
 * ✅ Sends updated role data to the backend.
 * @param id The ID of the role to update.
 * @param data The fields to update (e.g., { name: 'Updated Role Name' }).
 * @returns A promise that resolves to the updated Role object.
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
 * ✅ Sends a request to delete a role by its ID.
 * @param id The ID of the role to delete.
 * @returns A promise that resolves when the deletion is successful.
 */
export const deleteRole = async (id: number): Promise<void> => {
  try {
    // A successful DELETE request with axios will resolve, and we return nothing.
    await apiClient.delete(`/roles/${id}`);
  } catch (error: any) {
    console.error(`Error deleting role ${id}:`, error.response?.data || error.message);
    throw new Error('Failed to delete the role on the server.');
  }
};