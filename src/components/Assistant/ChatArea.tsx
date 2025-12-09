"use client";

import { useRef, useEffect, useState } from "react";
import { Send, Bot, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import RobotHead from "../RobotHead";

// Define the shape of a message based on your Prisma schema/API
interface Message {
  id: string;
  role: "USER" | "MODEL";
  content: string;
}

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onSend: (message: string) => void;
}

export function ChatArea({ messages, isLoading, onSend }: ChatAreaProps) {
  const t = useTranslations("chatbot");
  const [inputValue, setInputValue] = useState("");
  const scrollEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollEndRef.current) {
      scrollEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSend(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-gray-950 relative">
      
      {/* 1. MESSAGES LIST AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Empty State */}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4 animate-in fade-in zoom-in duration-500">
            <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-full">
                <RobotHead />

            </div>
            <p className="text-sm font-medium">{t("startConversation")}</p>
          </div>
        )}

        {/* Message Bubbles */}
        {messages.map((msg) => {
          const isUser = msg.role === "USER";
          return (
            <div
              key={msg.id}
              className={cn(
                "flex w-full",
                isUser ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "flex max-w-[85%] md:max-w-[75%] gap-2",
                isUser ? "flex-row-reverse" : "flex-row"
              )}>
                
                {/* Avatar */}
                <div className={cn(
                  "shrink-0 w-8 h-8 rounded-full flex items-center justify-center border shadow-sm",
                  isUser 
                    ? "bg-orange-100 border-orange-200 text-orange-600" 
                    : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                )}>
                  {isUser ? <User size={14} /> : <Bot size={14} />}
                </div>

                {/* Bubble */}
                <div
                  className={cn(
                    "px-4 py-2.5 shadow-sm text-sm leading-relaxed break-words",
                    isUser
                      ? "bg-orange-600 text-white rounded-2xl rounded-tr-none" // User Style
                      : "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-2xl rounded-tl-none border border-gray-200 dark:border-gray-800" // Bot Style
                  )}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex w-full justify-start">
            <div className="flex items-center gap-2 max-w-[75%]">
               <div className="shrink-0 w-8 h-8 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center shadow-sm">
                  <Bot size={14} />
               </div>
               <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl rounded-tl-none px-4 py-3 border border-gray-200 dark:border-gray-800">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
               </div>
            </div>
          </div>
        )}

        {/* Invisible div to scroll to */}
        <div ref={scrollEndRef} />
      </div>

      {/* 2. INPUT AREA (Sticky Bottom) */}
      <div className="p-4 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 shrink-0 z-10">
        <div className="relative flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={t("placeholder")} // "Type a message..."
            className="pr-12 py-6 rounded-full border-gray-200 dark:border-gray-800 focus-visible:ring-orange-500 bg-gray-50 dark:bg-gray-900/50 shadow-sm"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className={cn(
               "absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full transition-all",
               "bg-orange-600 hover:bg-orange-500 text-white shadow-md",
               (isLoading || !inputValue.trim()) && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ms-0.5 mt-0.5" />}
          </Button>
        </div>
        <div className="text-[10px] text-center text-gray-400 mt-2">
          {t("disclaimer")} {/* "AI can make mistakes." */}
        </div>
      </div>
    </div>
  );
}