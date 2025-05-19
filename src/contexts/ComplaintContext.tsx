import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useWebSocket } from './WebSocketContext';
import { Complaint } from '../types/complaint';

type ComplaintContextType = {
  complaints: Complaint[];
  addComplaint: (complaintData: Omit<Complaint, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt' | 'adminNotes'>) => Promise<Complaint>;
  updateComplaintStatus: (complaintId: string, status: 'Pending' | 'In Progress' | 'Resolved', adminNotes?: string) => Promise<void>;
  deleteComplaint: (complaintId: string) => Promise<void>;
  getUserComplaints: () => Complaint[];
  getAllComplaints: () => Complaint[];
  refreshComplaints: () => void;
  getComplaintById: (complaintId: string) => Complaint | undefined;
};

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

const STORAGE_KEY = 'complaints';

export const ComplaintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { sendMessage } = useWebSocket();
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading complaints:', error);
      return [];
    }
  });

  // Save complaints to localStorage
  const saveComplaints = useCallback((updatedComplaints: Complaint[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedComplaints));
    } catch (error) {
      console.error('Error saving complaints:', error);
    }
  }, []);


  useEffect(() => {
    const handleWebSocketUpdate = (event: CustomEvent) => {
      const { type, payload } = event.detail;
      
      switch (type) {
        case 'COMPLAINT_ADDED':
          setComplaints(prev => {
            const updated = [payload, ...prev];
            saveComplaints(updated);
            return updated;
          });
          break;
        
        case 'COMPLAINT_UPDATED':
          setComplaints(prev => {
            const updated = prev.map(c => 
              c.id === payload.id ? { ...c, ...payload } : c
            );
            saveComplaints(updated);
            return updated;
          });
          break;
        
        case 'COMPLAINT_DELETED':
          setComplaints(prev => {
            const updated = prev.filter(c => c.id !== payload.id);
            saveComplaints(updated);
            return updated;
          });
          break;
      }
    };

    window.addEventListener('websocket-complaint-update', handleWebSocketUpdate as EventListener);
    return () => {
      window.removeEventListener('websocket-complaint-update', handleWebSocketUpdate as EventListener);
    };
  }, [saveComplaints]);

  const addComplaint = useCallback(async (complaintData: Omit<Complaint, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt' | 'adminNotes'>) => {
    if (!user) throw new Error('User not authenticated');

    const newComplaint: Complaint = {
      id: `complaint-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userEmail: user.email,
      userName: `${user.firstName} ${user.lastName}`,
      ...complaintData,
    };

    // UPDATE LOCAL STORAGE IF COMPLAINTS ADDED
    setComplaints(prev => {
      const updated = [newComplaint, ...prev];
      saveComplaints(updated);
      return updated;
    });

    sendMessage({
      type: 'COMPLAINT_ADDED',
      payload: newComplaint
    });

    return newComplaint;
  }, [user, sendMessage, saveComplaints]);

  const updateComplaintStatus = useCallback(
    async (complaintId: string, status: 'Pending' | 'In Progress' | 'Resolved', adminNotes?: string) => {
      setComplaints(prev => {
        const updated = prev.map(c =>
          c.id === complaintId
            ? { ...c, status, adminNotes: adminNotes ?? c.adminNotes, updatedAt: new Date().toISOString() }
            : c
        );
        saveComplaints(updated);
        return updated;
      });
      sendMessage({
        type: 'COMPLAINT_UPDATED',
        payload: { id: complaintId, status, adminNotes }
      });
    },
    [sendMessage, saveComplaints]
  );

  const deleteComplaint = useCallback(async (complaintId: string) => {
    // Update local state
    setComplaints(prev => {
      const updated = prev.filter(c => c.id !== complaintId);
      saveComplaints(updated);
      return updated;
    });

    // Send WebSocket message
    sendMessage({
      type: 'COMPLAINT_DELETED',
      payload: { id: complaintId }
    });
  }, [sendMessage, saveComplaints]);

  const getUserComplaints = useCallback(() => {
    if (!user) return [];
    return complaints.filter(c => c.userId === user.id);
  }, [complaints, user]);

  const getAllComplaints = useCallback(() => {
    return complaints;
  }, [complaints]);

  const refreshComplaints = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setComplaints(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error refreshing complaints:', error);
    }
  }, []);

  const getComplaintById = useCallback((complaintId: string) => {
    return complaints.find(c => c.id === complaintId);
  }, [complaints]);

  return (
    <ComplaintContext.Provider value={{
      complaints,
      addComplaint,
      updateComplaintStatus,
      deleteComplaint,
      getUserComplaints,
      getAllComplaints,
      refreshComplaints,
      getComplaintById
    }}>
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (context === undefined) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};