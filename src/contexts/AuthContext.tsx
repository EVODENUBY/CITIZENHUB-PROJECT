import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, LoginCredentials, RegisterData, AuthContextType } from '../types/auth';

// DEFAULT ADMIN CREDENTIALS FOR TESTING
const ADMIN_EMAIL ="evode.citizenhub@gmail.com";
const ADMIN_PASSWORD = 'evode@123';

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

  // CHECK SESSION
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
    // API CALL DELAY
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundUser = users.find(u => u.email === credentials.email);

    if (!foundUser) {
      throw new Error('User not found in the system');
    }

    // CHECK ADMIN LOGIN
    if (credentials.email === ADMIN_EMAIL) {
      if (credentials.password !== ADMIN_PASSWORD) {
        throw new Error('Invalid Admin Password');
      }
    } else {
      // CHECK PASSWORDS OTHER CITIZENS
      if (credentials.password !== credentials.password) {
        throw new Error('Invalid Password, Try Again');
      }
    }

    // SET SESSION EXPIRY TO 20 MINUTES
    const expiryTime = new Date().getTime() + (20 * 60 * 1000);
    localStorage.setItem('sessionExpiry', expiryTime.toString());
    localStorage.setItem('user', JSON.stringify(foundUser));
    setUser(foundUser);

    // RETURN ADMIN STATUS
    return foundUser.isAdmin;
  }, [users]);

  const register = useCallback(async (data: RegisterData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // CHECK IF USER
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
    
    // / SET SESSION EXPIRY TO 20 MINUTES
    const expiryTime = new Date().getTime() + (20* 60 * 1000);
    localStorage.setItem('sessionExpiry', expiryTime.toString());
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);

    return false;
  }, [users]);

  const addAnnouncement = useCallback((announcement: any) => {
    setAnnouncements(prev => [announcement, ...prev]);
    // STORE ANNOUNCEMENTS
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

    // UPDATE USER IN LOCAL STORAGE
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