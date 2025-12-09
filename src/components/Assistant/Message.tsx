"use client"
import { Avatar } from "./avatar";
import { Message } from "./Mock";
import {Volume2} from "lucide-react"

import ReactMarkdown from "react-markdown";

export const ChatMessage: React.FC<{ message: Message; onSpeak: (text: string) => void }> = ({ message, onSpeak }) => {
  const isBot = message.role === 'model';
  
  return (
    <div className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'} mb-4`}>
      <Avatar type={isBot ? 'bot' : 'user'} />
      <div className={`flex-1 ${isBot ? '' : 'flex justify-end'}`}>
        <div className={`inline-block max-w-[85%] px-4 py-2 rounded-2xl ${
          isBot 
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' 
            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
        }`}>
          <ReactMarkdown>
            {message.content}
          </ReactMarkdown>
        </div>
        {isBot && (
          <button
            onClick={() => onSpeak(message.content)}
            className="ml-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Speak message"
          >
            <Volume2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
};