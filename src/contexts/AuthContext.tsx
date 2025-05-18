import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, LoginCredentials, RegisterData, AuthContextType } from '../types/auth';

// Mock admin user for demonstration
const ADMIN_EMAIL ="evode.citizenhub@gmail.com";
const ADMIN_PASSWORD = 'evode';

const mockUsers: User[] = [
  {
    id: 'admin-001',
    email: ADMIN_EMAIL,
    firstName: 'Evode',
    lastName: 'Nuby',
    isAdmin: true,
    createdAt: new Date().toISOString(),
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    const sessionExpiry = localStorage.getItem('sessionExpiry');
    
    if (savedUser && sessionExpiry) {
      if (new Date().getTime() < parseInt(sessionExpiry)) {
        return JSON.parse(savedUser);
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('sessionExpiry');
      }
    }
    return null;
  });

  const [users, setUsers] = useState<User[]>(mockUsers);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  // Check session expiry periodically
  useEffect(() => {
    const checkSession = () => {
      const sessionExpiry = localStorage.getItem('sessionExpiry');
      if (sessionExpiry && new Date().getTime() >= parseInt(sessionExpiry)) {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('sessionExpiry');
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundUser = users.find(u => u.email === credentials.email);

    if (!foundUser) {
      throw new Error('User not found in the system');
    }

    // Check if it's admin login
    if (credentials.email === ADMIN_EMAIL) {
      if (credentials.password !== ADMIN_PASSWORD) {
        throw new Error('Invalid admin password');
      }
    } else {
      // For regular users, you would typically hash and compare passwords
      if (credentials.password !== credentials.password) {
        throw new Error('Invalid password');
      }
    }

    // Set session expiry to 24 hours from now
    const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
    localStorage.setItem('sessionExpiry', expiryTime.toString());
    localStorage.setItem('user', JSON.stringify(foundUser));
    setUser(foundUser);

    // Return isAdmin flag for redirect purposes
    return foundUser.isAdmin;
  }, [users]);

  const register = useCallback(async (data: RegisterData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    if (users.some(u => u.email === data.email)) {
      throw new Error('Email already registered');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      isAdmin: false,
      createdAt: new Date().toISOString(),
    };

    setUsers(prev => [...prev, newUser]);
    
    // Set session expiry to 24 hours from now
    const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
    localStorage.setItem('sessionExpiry', expiryTime.toString());
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);

    return false; // New users are never admin
  }, [users]);

  const addAnnouncement = useCallback((announcement: any) => {
    setAnnouncements(prev => [announcement, ...prev]);
    // Store announcements in localStorage
    localStorage.setItem('announcements', JSON.stringify([announcement, ...announcements]));
  }, [announcements]);

  const getAnnouncements = useCallback(() => {
    const stored = localStorage.getItem('announcements');
    return stored ? JSON.parse(stored) : [];
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('sessionExpiry');
  }, []);

  const updateUser = useCallback(async (data: Partial<User>) => {
    if (!user) throw new Error('No user logged in');

    const updatedUser = {
      ...user,
      ...data,
    };

    // Update in users array
    setUsers(prev => prev.map(u => 
      u.id === user.id ? updatedUser : u
    ));

    // Update current user
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, [user]);

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    addAnnouncement,
    getAnnouncements,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 