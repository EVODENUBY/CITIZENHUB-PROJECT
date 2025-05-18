import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Announcement } from '../types/Announcement';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

interface AnnouncementContextType {
  announcements: Announcement[];
  addAnnouncement: (title: string, message: string, priority: Announcement['priority']) => void;
  deleteAnnouncement: (id: string) => void;
  toggleAnnouncementStatus: (id: string) => void;
  getActiveAnnouncements: () => Announcement[];
}

const STORAGE_KEY = 'citizenhub_announcements';

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

export const useAnnouncements = () => {
  const context = useContext(AnnouncementContext);
  if (!context) {
    throw new Error('useAnnouncements must be used within an AnnouncementProvider');
  }
  return context;
};

export const AnnouncementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert string dates back to Date objects
      return parsed.map((announcement: any) => ({
        ...announcement,
        createdAt: new Date(announcement.createdAt)
      }));
    }
    return [];
  });
  
  const { user } = useAuth();

  // Persist to localStorage whenever announcements change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements));
  }, [announcements]);

  const addAnnouncement = useCallback((title: string, message: string, priority: Announcement['priority']) => {
    if (!user?.isAdmin) {
      throw new Error('Only admins can create announcements');
    }

    const newAnnouncement: Announcement = {
      id: uuidv4(),
      title,
      message,
      createdAt: new Date(),
      priority,
      isActive: true,
      createdBy: user.id,
    };

    setAnnouncements(prev => [newAnnouncement, ...prev]);
  }, [user]);

  const deleteAnnouncement = useCallback((id: string) => {
    if (!user?.isAdmin) {
      throw new Error('Only admins can delete announcements');
    }

    setAnnouncements(prev => prev.filter(announcement => announcement.id !== id));
  }, [user]);

  const toggleAnnouncementStatus = useCallback((id: string) => {
    if (!user?.isAdmin) {
      throw new Error('Only admins can update announcements');
    }

    setAnnouncements(prev =>
      prev.map(announcement =>
        announcement.id === id
          ? { ...announcement, isActive: !announcement.isActive }
          : announcement
      )
    );
  }, [user]);

  const getActiveAnnouncements = useCallback(() => {
    return announcements
      .filter(announcement => announcement.isActive)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [announcements]);

  const value = {
    announcements,
    addAnnouncement,
    deleteAnnouncement,
    toggleAnnouncementStatus,
    getActiveAnnouncements,
  };

  return (
    <AnnouncementContext.Provider value={value}>
      {children}
    </AnnouncementContext.Provider>
  );
}; 