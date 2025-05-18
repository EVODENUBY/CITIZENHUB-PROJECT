export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface Announcement {
  id: number;
  title: string;
  message: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  addAnnouncement: (announcement: Announcement) => void;
  getAnnouncements: () => Announcement[];
  updateUser: (data: Partial<User>) => Promise<void>;
} 