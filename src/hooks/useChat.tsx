"use client"
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

type Message = {
  id: string;
  role: "USER" | "MODEL";
  content: string;
  createdAt: string;
};

type Conversation = {
  id: string;
  messages: Message[]; // We fetched the first one for preview
  updatedAt: string;
};

export function useChat() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const session = useSession() 

    const fetchConversations = async () => {
        // Ensure session user exists before fetching
        if (!session.data?.user) return; 
        
        try {
            const res = await fetch("/api/chat/conversations");
            const data = await res.json();
            setConversations(data);
        } catch (e) {
            console.error(e);
        }
    };

    const loadChat = async (id: string) => {
        if (!session.data?.user) return; 

        setActiveId(id);
        setIsLoading(true);
        try {
            const res = await fetch(`/api/chat/messages?conversationId=${id}`); 
            if (!res.ok) throw new Error("Failed to load chat messages.");
            const data = await res.json();
            setMessages(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const startNewChat = async () => {
        if (!session.data?.user) return; 
        
        try {
            const res = await fetch("/api/chat/conversations", {
                method: "POST",
                body: JSON.stringify({}),
            });
            const newChat = await res.json();
            setConversations([newChat, ...conversations]);
            setActiveId(newChat.id);
            setMessages([]);
        } catch (e) {
            console.error(e);
        }
    };

    const sendMessage = async (content: string) => {
        if (!session.data?.user || !content.trim()) return;

        // Optimistic UI Update
        const tempId = Date.now().toString();
        const optimisticMsg: Message = {
            id: tempId, role: "USER", content, createdAt: new Date().toISOString()
        };
        setMessages((prev) => [...prev, optimisticMsg]);
        setIsLoading(true);

        try {
            let currentChatId = activeId;

            // If no chat selected, create one first
            if (!currentChatId) {
                const res = await fetch("/api/chat/conversations", { method: "POST", body: JSON.stringify({}) });
                const newChat = await res.json();
                currentChatId = newChat.id;
                setActiveId(newChat.id);
                // Ensure new chat is added to the conversation list immediately
                setConversations(prev => [newChat, ...prev]); 
            }

            const res = await fetch("/api/chat/messages", {
                method: "POST",
                body: JSON.stringify({ message: content, conversationId: currentChatId }),
            });

            const aiMsg = await res.json();
            setMessages((prev) => [...prev, aiMsg]);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };


    // 3. EFFECT
    useEffect(() => {
        // Only fetch conversations once the session is loaded and the user exists
        if (session.status === 'authenticated' && session.data?.user) {
            fetchConversations();
        }
    }, [session.status, session.data?.user]); // Depend on session status/user

    // 4. CONDITIONAL RETURN (Executed after all hooks are called)
    if (session.status !== 'authenticated') {
        // Return null or a default object while loading/unauthenticated
        return {
            conversations: [],
            activeId: null,
            messages: [],
            isLoading: false,
            loadChat,
            startNewChat,
            sendMessage
        };
    }

    // 5. FINAL RETURN
    return {
        conversations,
        activeId,
        messages,
        isLoading,
        loadChat,
        startNewChat,
        sendMessage
    };
}