"use client";
import { useState } from "react";
import VirtualRobotLayout from "./DialogLayout"; 
import { ChatArea } from "@/components/Assistant/ChatArea";
import {VoiceChatArea} from "./Voice"; 
import { useChat } from "@/hooks/useChat";

type RobotMode = "chat" | "voice";

export default function VirtualRobot() {
  const [mode, setMode] = useState<RobotMode>("chat");
  
  const { 
    conversations, 
    activeId, 
    messages, 
    isLoading, 
    loadChat, 
    startNewChat, 
    sendMessage 
  } = useChat();

  let content;

  if (mode === "chat") {
    content = (
      <ChatArea
        messages={messages}
        isLoading={isLoading}
        onSend={sendMessage}
      />
    );
  } else {
    content = <VoiceChatArea  
      messages={messages}
        isLoading={isLoading}
        onSend={sendMessage} />; 
  }

  return (
    <VirtualRobotLayout 
      mode={mode} 
      setMode={setMode}
      conversations={conversations}
      activeId={activeId}
      loadChat={loadChat}
      startNewChat={startNewChat}
    >

      {content}
    </VirtualRobotLayout>
  );
}