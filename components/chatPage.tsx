"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { AvatarImage } from "@radix-ui/react-avatar";
import Loader from "@/components/common/Loader";
import axiosInstance from "@/lib/apiHandler";
import { renderMessageContent } from "@/components/ai-message-format/messageFormater";
import { speakMessage } from "@/lib/generations/text-to-speech";
import { Volume2, VolumeX } from "lucide-react"; // Import icons for voice buttons

interface MessageHistory {
  role: string;
  parts: { text: string }[];
}

type Message = {
  id: number;
  content: string;
  sender: "student" | "ai";
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<MessageHistory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadMsg, setIsLoadMsg] = useState<boolean>(true);
  const [inputMessage, setInputMessage] = useState("");
  const [playingMessageId, setPlayingMessageId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const session = useSession();
  const userId = session.data?.user.id as string;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (session.status === "authenticated" && userId) fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status, userId]);

  const fetchMessages = async () => {
    if (userId) {
      try {
        console.log(session.status);
        const response = await axiosInstance.get(
          `/chat/messages?userId=${userId}`
        );
        setMessages(response.data.messages);
        setIsLoadMsg(false);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        content: inputMessage,
        sender: "student",
      };
      setMessages([...messages, newMessage]);
      setInputMessage("");
      setIsLoading(true);

      try {
        // Get AI response
        const ai = await axiosInstance.post("/chat", {
          prompt: newMessage.content,
          userId,
          history,
        });
        // Store user message
        await axiosInstance.post("/chat/messages", {
          content: newMessage.content,
          sender: "student",
          userId,
        });

        const aiResponse: Message = {
          id: Date.now() + 1,
          content: ai.data.message,
          sender: "ai",
        };

        // Store AI message
        await axiosInstance.post("/chat/messages", {
          content: aiResponse.content,
          sender: "ai",
          userId,
        });

        setMessages((prev) => [...prev, aiResponse]);
      } catch (error) {
        console.error("Error fetching AI response:", error);
        // Handle error (e.g., show error message to user)
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVoiceToggle = (messageId: number, content: string) => {
    if (playingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setPlayingMessageId(null);
    } else {
      window.speechSynthesis.cancel();
      speakMessage(content);
      setPlayingMessageId(messageId);
    }
  };

  if (isLoadMsg) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col bg-gray-200 dark:bg-gray-950 h-[calc(100vh-100px)]">
      <div className="flex-grow p-4 bg-gray-100 dark:bg-gray-800 overflow-y-auto chat-container rounded-xl">
        <AnimatePresence>
          {messages &&
            messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center ${
                  message.sender === "student" ? "justify-start" : "justify-end"
                } mb-4`}
              >
                <div
                  className={`flex items-center ${
                    message.sender === "student"
                      ? "flex-row"
                      : "flex-row-reverse"
                  }`}
                >
                  <Avatar>
                    <AvatarImage
                      src={
                        message.sender === "student"
                          ? (session.data?.user.image as string)
                          : "/images/robot-icon-smile.png"
                      }
                      alt="avatar"
                    />
                    <AvatarFallback>
                      {message.sender === "student" ? "أنت" : "Ai"}
                    </AvatarFallback>
                  </Avatar>

                  <div
                    dir="auto"
                    className={`mx-2 p-3 text-sm rounded-lg ${
                      message.sender === "student"
                        ? "bg-blue-500 text-white"
                        : "bg-white dark:bg-gray-700"
                    }`}
                  >
                    {renderMessageContent(message.content)}
                    {message.sender === "ai" && (
                      <Button
                        onClick={() =>
                          handleVoiceToggle(message.id, message.content)
                        }
                        className="ml-2 p-1"
                        variant="ghost"
                      >
                        {playingMessageId === message.id ? (
                          <VolumeX size={16} />
                        ) : (
                          <Volume2 size={16} />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex justify-end mb-4"
            >
              <Loader />
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-2 p-4 border-t">
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="اكتب رسالتك هنا..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-grow ml-2"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="mr-2"
          >
            إرسال
          </Button>
        </div>
      </div>
    </div>
  );
}
