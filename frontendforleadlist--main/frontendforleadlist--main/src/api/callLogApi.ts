import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CallLog {
  id: number;
  leadId: number;
  name: string; // Contact Person Name (or Caller Name)
  email: string;
  phone: string;
  description: string; // Call notes
  createdAt: string; // ISO date string
  callType?: string; // e.g., 'inbound', 'outbound'
  duration?: string; // e.g., 'HH:mm:ss'
  outcome?: string; // e.g., 'interested', 'no-answer'
  nextAction?: string;
  nextFollowUp?: string; // ISO date string (YYYY-MM-DD)
}

export type NewCallLogPayload = Omit<CallLog, 'id' | 'createdAt'>;

// ✅ ADDED: Function to get all call logs
export const getAllCallLogs = async (): Promise<CallLog[]> => {
  try {
    const response = await apiClient.get<CallLog[]>('/call-logs');
    return response.data;
  } catch (error) {
    console.error('Error fetching call logs:', error);
    throw new Error('Failed to fetch call logs.');
  }
};

// ✅ UPDATED: addCallLog to use apiClient
export const addCallLog = async (callLogData: NewCallLogPayload): Promise<CallLog> => {
  try {
    const response = await apiClient.post<CallLog>('/call-logs', callLogData);
    return response.data;
  } catch (error: any) {
    console.error('Error adding call log:', error);
    throw new Error(error.response?.data?.message || 'Failed to add call log.');
  }
};