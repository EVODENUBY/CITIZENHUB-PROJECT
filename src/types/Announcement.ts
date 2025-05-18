export interface Announcement {
  id: string;
  title: string;
  message: string;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
  createdBy: string;
} 