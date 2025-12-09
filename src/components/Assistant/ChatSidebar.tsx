import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Plus, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
// import { format } from "date-fns";

interface ChatSidebarProps {
  isOpen: boolean;
  activeId: string | null;
  conversations: any[]; // Type properly based on Prisma
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onClose: () => void;
}

export function ChatSidebar({ 
  isOpen, 
  activeId, 
  conversations, 
  onSelectChat, 
  onNewChat 
}: ChatSidebarProps) {
  const t = useTranslations("chatbot");

  return (
    <div
      className={cn(
        "h-full bg-gray-50 dark:bg-gray-900 border-e border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out overflow-hidden flex flex-col",
        isOpen ? "w-64 opacity-100 translate-x-0" : "w-0 opacity-0 -translate-x-4"
      )}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <Button onClick={onNewChat} className="w-full gap-2 bg-orange-600 hover:bg-orange-500 text-white">
          <Plus className="h-4 w-4" /> {t("newChat")}
        </Button>
      </div>

      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {conversations.length === 0 && (
             <div className="text-center text-xs text-gray-400 mt-4">{t("noHistory")}</div>
          )}
          {conversations.map((chat) => (
            <Button
              key={chat.id}
              variant={activeId === chat.id ? "secondary" : "ghost"}
              onClick={() => onSelectChat(chat.id)}
              className="w-full justify-start text-xs h-auto py-3 px-2"
            >
              <MessageSquare className="w-4 h-4 me-2 shrink-0 opacity-70" />
              <div className="flex flex-col items-start overflow-hidden">
                <span className="truncate w-full font-medium">
                  {chat.messages?.[0]?.content.substring(0, 20) || t("chat")}...
                </span>
                <span className="text-[10px] text-gray-400">
                  {new Date(chat.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}