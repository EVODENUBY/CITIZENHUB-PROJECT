import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { ComplaintProvider } from './contexts/ComplaintContext';
import { AnnouncementProvider } from './contexts/AnnouncementContext';
import { ChatbotProvider } from './contexts/ChatbotContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import theme from './theme';
import AppRoutes from './routes';
import Layout from './components/Layout';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <WebSocketProvider>
          <ComplaintProvider>
            <AnnouncementProvider>
              <ChatbotProvider>
                <Layout>
                  <AppRoutes />
                </Layout>
              </ChatbotProvider>
            </AnnouncementProvider>
          </ComplaintProvider>
        </WebSocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 