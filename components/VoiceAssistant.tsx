'use client';

import { useState, useEffect, useRef } from 'react';
import AssistantIcon from './VoiceAssistantButton'
import AssistantDialog from './AssistantDialog';
import { Message } from './types';

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = "مرحباً، أنا مساعدك الصوتي. كيف يمكنني مساعدتك اليوم؟";
      setMessages([{role: 'assistant', content: greeting}]);
      speak(greeting);
    }
  }, [isOpen]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    setIsListening(true);
    
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'ar-SA';
    recognition.interimResults = false;
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessages(prev => [...prev, {role: 'user', content: transcript}]);
      processQuery(transcript);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Recognition error:', event.error);
      setIsListening(false);
    };
    
    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const processQuery = async (query: string) => {
    // Call your API here
    const response = `هذا رد على سؤالك: "${query}"`;
    setMessages(prev => [...prev, {role: 'assistant', content: response}]);
    speak(response);
  };

  const toggleAssistant = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    
    if (newState) {
      setTimeout(() => {
        window.speechSynthesis.cancel();
        startListening();
      }, 500);
    } else {
      stopListening();
    }
  };

  return (
    <>
      <AssistantIcon 
        isOpen={isOpen}
        isListening={isListening}
        toggleAssistant={toggleAssistant}
      />
      <AssistantDialog 
        isOpen={isOpen}
        isListening={isListening}
        messages={messages}
        stopListening={stopListening}
      />
    </>
  );
}