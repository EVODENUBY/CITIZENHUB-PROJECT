import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

// WebSocket events type
type WebSocketEvent = {
  type: 'COMPLAINT_ADDED' | 'COMPLAINT_UPDATED' | 'COMPLAINT_DELETED';
  payload: any;
};

type WebSocketContextType = {
  sendMessage: (event: WebSocketEvent) => void;
  isConnected: boolean;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

// WebSocket connection URL - replace with your actual WebSocket server URL
const WS_URL = 'ws://localhost:8080';

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  // Initialize WebSocket connection
  useEffect(() => {
    if (!user) return;

    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      
      // Send authentication message
      socket.send(JSON.stringify({
        type: 'AUTH',
        payload: {
          userId: user.id,
          isAdmin: user.isAdmin
        }
      }));
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (user) {
          console.log('Attempting to reconnect...');
          setWs(new WebSocket(WS_URL));
        }
      }, 5000);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Handle different types of messages
        switch (data.type) {
          case 'COMPLAINT_ADDED':
          case 'COMPLAINT_UPDATED':
          case 'COMPLAINT_DELETED':
            window.dispatchEvent(new CustomEvent('websocket-complaint-update', { detail: data }));
            break;
          default:
            console.log('Unhandled message type:', data.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    setWs(socket);

    // Cleanup on unmount
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [user]);

  // Send message through WebSocket
  const sendMessage = useCallback((event: WebSocketEvent) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(event));
    } else {
      console.error('WebSocket is not connected');
    }
  }, [ws]);

  return (
    <WebSocketContext.Provider value={{ sendMessage, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}; 