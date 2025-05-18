import React, { createContext, useContext, useState, useCallback } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatbotContextType {
  messages: Message[];
  isLoading: boolean;
  addMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

// Fallback responses for when API is unavailable
const getFallbackResponse = (query: string): string => {
  const normalizedQuery = query.toLowerCase();

  if (normalizedQuery.includes('submit') || normalizedQuery.includes('file') || normalizedQuery.includes('new complaint')) {
    return 'To submit a new complaint, click the "Submit Complaint" button on your dashboard. Fill in all required details including the complaint category, description, and your contact information.';
  }

  if (normalizedQuery.includes('track') || normalizedQuery.includes('status') || normalizedQuery.includes('check')) {
    return 'You can track your complaint status on your dashboard. Each complaint will show its current status (Pending, In Progress, or Resolved) and any updates from administrators.';
  }

  if (normalizedQuery.includes('contact') || normalizedQuery.includes('support') || normalizedQuery.includes('help')) {
    return 'For additional support, please contact our help desk:\nEmail: support@citizenhub.com\nPhone: +250 791 783 308 (Evode)\nOr use the contact form in the Support section.';
  }

  return 'I am currently operating in offline mode. For basic inquiries about submitting or tracking complaints, please check your dashboard. For urgent matters, contact our support:\nEmail: support@citizenhub.com\nPhone: +250 791 783 308 (Evode)';
};

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant for a citizen complaints and engagement system. Help users with their queries about submitting complaints, tracking status, and understanding the system. Be concise, professional, and helpful.'
            },
            ...messages.map(msg => ({ role: msg.role, content: msg.content })),
            { role: 'user', content }
          ]
        })
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply || getFallbackResponse(content),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const fallbackMessage: Message = {
        role: 'assistant',
        content: getFallbackResponse(content),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <ChatbotContext.Provider value={{ messages, isLoading, addMessage, clearMessages }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};
