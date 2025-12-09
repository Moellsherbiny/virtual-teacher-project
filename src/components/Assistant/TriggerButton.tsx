import { MessageSquare } from "lucide-react";
import { Button } from "../ui/button";

export const FloatingTrigger: React.FC<{  position: string }> = ({ position }) => {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2'
  };

  return (
    <Button
      
      className={`fixed ${positionClasses[position as keyof typeof positionClasses]} z-[9997] w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group`}
      aria-label="Open chatbot"
    >
      <MessageSquare className="w-7 h-7 group-hover:scale-110 transition-transform" />
    </Button>
  );
};