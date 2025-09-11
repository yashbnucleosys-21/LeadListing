import axios from 'axios';
import { Lead } from '@/types/Lead'; // Shared types

// Use Vite environment variable for deployed backend, fallback to localhost for development
// const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = import.meta.env.VITE_API_URL;
// Shared Axios client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Use if backend requires cookies/auth
});

/**
 * Add a new lead
 */
export const addLead = async (leadData: Omit<Lead, 'id'>): Promise<Lead> => {
  try {
    const response = await apiClient.post<Lead>('/leads', leadData);
    return response.data;
  } catch (error: any) {
    console.error('Error adding lead:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to add lead.');
  }
};

/**
 * Fetch all leads
 */
export const getAllLeads = async (): Promise<Lead[]> => {
  try {
    const response = await apiClient.get<Lead[]>('/leads');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching leads:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch leads.');
  }
};

/**
 * Update an existing lead
 */
export const updateLead = async (lead: Lead): Promise<Lead> => {
  try {
    const response = await apiClient.put<Lead>(`/leads/${lead.id}`, lead);
    return response.data;
  } catch (error: any) {
    console.error(`Error updating lead ${lead.id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update lead.');
  }
};
