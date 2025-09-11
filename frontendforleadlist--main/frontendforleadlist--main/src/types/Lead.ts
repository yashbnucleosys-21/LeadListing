
export interface Lead {
  toLowerCase(): unknown;
  service: string;
  id: number;
  leadName: string;
  companyName: string;
  email: string;
  contactPerson: string;
  phone: string;
  assignee: string;
  priority: string;
  status: string;
  notes?: string;
  leadSource?: string;
  nextFollowUpDate?: string; // ISO date string (YYYY-MM-DD)
  followUpTime?: string;     // Time string (HH:mm)
  location ?: string; // New field for location
}



export const statuses = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
export const priorities = ['low', 'medium', 'high'];
export const users = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Singh'];
