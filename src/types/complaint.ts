export interface Complaint {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  contactInfo: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
  priority: 'High' | 'Medium' | 'Low';
  userEmail?: string;
  userName?: string;
} 