// Mock chat history data
export const MOCK_CHAT_HISTORY = [
  { id: '1', title: 'Getting Started with React', date: '2025-11-15', preview: 'How do I start learning React?' },
  { id: '2', title: 'Python Basics', date: '2025-11-14', preview: 'Can you explain Python functions?' },
  { id: '3', title: 'Data Structures', date: '2025-11-13', preview: 'What are arrays and linked lists?' },
  { id: '4', title: 'Web Development', date: '2025-11-12', preview: 'Best practices for HTML5?' },
];

// Mock responses
export const MOCK_RESPONSES = [
  "I'd be happy to help you with that! Let me explain step by step.",
  "That's a great question! Here's what you need to know...",
  "Let me break this down for you in a simple way.",
  "I understand your question. Here's a comprehensive answer...",
];

// Types
export interface Message {
  content: string;
  role: 'user' | 'model';

}

export interface ChatSession {
  id: string;
  title: string;
  date: string;
  preview: string;
  messages: Message[];
}

export interface ChatbotConfig {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  children?: React.ReactNode;
}