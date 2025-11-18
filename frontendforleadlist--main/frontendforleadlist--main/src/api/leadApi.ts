import axios from 'axios';
import { Lead} from '@/types/Lead'; // Shared types

// const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
// Create a shared Axios client instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a new lead
export const addLead = async (leadData: Omit<Lead, 'id'>): Promise<Lead> => {
  try {
    const response = await apiClient.post<Lead>('/leads', leadData);
    return response.data;
  } catch (error: any) {
    console.error('Error adding lead:', error);
    const message = error?.response?.data?.message || 'Failed to add lead.';
    throw new Error(message);
  }
};

// Get all leads
export const getAllLeads = async (): Promise<Lead[]> => {
  try {
    const response = await apiClient.get<Lead[]>('/leads');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    throw new Error('Failed to fetch leads');
  }
};

// Update a lead
export const updateLead = async (lead: Lead): Promise<Lead> => {
  try {
    const response = await apiClient.put<Lead>(`/leads/${lead.id}`, lead);
    return response.data;
  } catch (error: any) {
    console.error('Error updating lead:', error);
    const message = error?.response?.data?.message || 'Failed to update lead';
    throw new Error(message);
  }
};

// Delete a lead
export const deleteLead = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/leads/${id}`);
  } catch (error: any) {
    console.error('Error deleting lead:', error);
    const message = error?.response?.data?.message || 'Failed to delete lead';
    throw new Error(message);
  }
};
