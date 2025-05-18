import React, { createContext, useContext, useState, useCallback } from 'react';
import OpenAI from 'openai';

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

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // Use environment variable
  dangerouslyAllowBrowser: true
});

export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      if (!process.env.REACT_APP_OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured');
      }

      // Get response from OpenAI
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant for a citizen complaints and engagement system. Help users with their queries about submitting complaints, tracking status, and understanding the system. Be concise, professional, and helpful.'
          },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          { role: 'user', content }
        ],
        model: 'gpt-3.5-turbo',
      });

      const response = completion.choices[0]?.message?.content;

      if (response) {
        // Add assistant message
        const assistantMessage: Message = {
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('No response received from OpenAI');
      }
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      // Use fallback response system
      const fallbackResponse = getFallbackResponse(content);
      const errorMessage: Message = {
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
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