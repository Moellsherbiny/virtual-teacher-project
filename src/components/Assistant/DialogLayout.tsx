"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Minimize2,
  Maximize2,
  X,
  Mic,
  Type,
  Bot,
  PanelLeft,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import { ChatSidebar } from "./ChatSidebar"; // Import your new component
import { useChat } from "@/hooks/useChat";
import { useSession } from "next-auth/react";
interface LayoutProps {
  children: ReactNode;
  mode: "chat" | "voice";
  setMode: (mode: "chat" | "voice") => void;
  conversations: any[]; // Use the actual Conversation type from useChat if possible
  activeId: string | null;
  loadChat: (id: string) => void;
  startNewChat: () => void;
}

export default function VirtualRobotLayout({
  children,
  mode,
  setMode,
  conversations,
  activeId,
  loadChat,
  startNewChat,
}: LayoutProps) {
  const t = useTranslations("chatbot");
  const session = useSession();
  const [isMaximized, setIsMaximized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Dialog>
      {
        session.data?.user &&
        <DialogTrigger asChild>
          <Button className="fixed bottom-5 right-5 z-40 w-16 h-16 rounded-full shadow-2xl bg-orange-600 hover:bg-orange-500 text-white animate-in zoom-in duration-300">
            <Bot size={32} />
          </Button>
        </DialogTrigger>
      }

      <DialogContent
        // IMPORTANT: [&>button]:hidden removes the default Shadcn 'X' close button 
        // so we can use our custom header close button.
        className={`
          flex flex-col gap-0 p-0 outline-none
          bg-background text-foreground
          [&>button]:hidden 
          transition-all duration-300
          ${isMaximized
            ? "w-[100vw] h-[100vh] max-w-none rounded-none border-0"
            : "w-[90vw] h-[85vh] sm:max-w-5xl sm:rounded-xl"
          }
        `}
      >
        <div className="flex flex-col h-full w-full overflow-hidden">
          {/* HEADER */}
          <DialogHeader className="shrink-0 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-4 py-3 shadow-sm flex-row items-center justify-between space-y-0">

            {/* Left Side: Toggle & Title */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                title={t("toggleSidebar")}
              >
                <PanelLeft className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-3 border-s border-gray-200 dark:border-gray-800 ps-3">
                <div className="bg-orange-100 dark:bg-orange-900/20 p-2 rounded-full">
                  <Bot size={24} className="text-orange-600 dark:text-orange-500" />
                </div>
                <div className="flex flex-col">
                  <DialogTitle className="text-sm font-bold text-start">
                    {t("headerTitle")}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-gray-500 text-start">
                    {t("headerSubtitle")}
                  </DialogDescription>
                </div>
              </div>
            </div>

            {/* Right Side: Controls */}
            <div className="flex items-center gap-2">
              {/* Mode Switcher - Desktop */}
              <div className="hidden md:flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
                <Button
                  size="sm"
                  onClick={() => setMode("chat")}
                  variant={mode === "chat" ? "default" : "ghost"}
                  className={`h-7 px-3 text-xs ${mode === "chat" ? "bg-white text-black shadow-sm dark:bg-gray-700 dark:text-white" : ""}`}
                >
                  <Type className="w-3 h-3 me-1.5" /> {t("modeChat")}
                </Button>

                <Button
                  size="sm"
                  onClick={() => setMode("voice")}
                  variant={mode === "voice" ? "default" : "ghost"}
                  className={`h-7 px-3 text-xs ${mode === "voice" ? "bg-white text-black shadow-sm dark:bg-gray-700 dark:text-white" : ""}`}
                >
                  <Mic className="w-3 h-3 me-1.5" /> {t("modeVoice")}
                </Button>
              </div>

              <div className="flex items-center gap-1 border-s border-gray-200 dark:border-gray-800 ps-2 ms-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsMaximized(!isMaximized)}
                >
                  {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>

                <DialogClose asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30">
                    <X className="w-4 h-4" />
                  </Button>
                </DialogClose>
              </div>
            </div>
          </DialogHeader>

          {/* Mode Switcher - Mobile Only */}
          <div className="md:hidden flex p-2 gap-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shrink-0">
            <Button
              size="sm"
              onClick={() => setMode("chat")}
              variant={mode === "chat" ? "default" : "outline"}
              className="flex-1 text-xs"
            >
              <Type className="w-3 h-3 me-2" /> {t("modeChat")}
            </Button>
            <Button
              size="sm"
              onClick={() => setMode("voice")}
              variant={mode === "voice" ? "default" : "outline"}
              className="flex-1 text-xs"
            >
              <Mic className="w-3 h-3 me-2" /> {t("modeVoice")}
            </Button>
          </div>

          {/* CONTENT AREA (Sidebar + Main) */}
          <div className="flex flex-1 overflow-hidden relative">

            {/* Sidebar Component */}
            <ChatSidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              conversations={conversations}
              activeId={activeId}
              onSelectChat={loadChat}
              onNewChat={startNewChat}
            />

            {/* Chat/Voice Render Area */}
            <div className="flex-1 flex flex-col bg-gray-50/50 dark:bg-gray-950/50 relative overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
                {children}
              </div>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}