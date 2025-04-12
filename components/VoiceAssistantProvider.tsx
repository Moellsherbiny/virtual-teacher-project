'use client';

import axiosInstance from '@/lib/apiHandler';
import { createContext, useContext, useState, useEffect, useRef } from 'react';

type AssistantState = {
  isOpen: boolean;
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  countdown: number;
  error: string | null;
};

type AssistantContextType = AssistantState & {
  toggleAssistant: () => void;
  retry: () => void;
};

const AssistantContext = createContext<AssistantContextType | null>(null);

export function VoiceAssistantProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AssistantState>({
    isOpen: false,
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    countdown: 0,
    error: null,
  });

  const recognitionRef = useRef<any>(null);
  const countdownRef = useRef<NodeJS.Timeout>();
  const silenceTimerRef = useRef<NodeJS.Timeout>();

  const startCountdown = () => {
    setState(s => ({ ...s, countdown: 2 }));
    
    countdownRef.current = setInterval(() => {
      setState(s => {
        if (s.countdown <= 0) {
          clearInterval(countdownRef.current);
          startListening();
          return { ...s, countdown: 0 };
        }
        return { ...s, countdown: s.countdown - 1 };
      });
    }, 1000);
  };

  const startListening = () => {
    try {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'ar-SA';
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        setState(s => ({ ...s, isListening: false }));
        await processQuery(transcript);
      };

      recognition.onerror = (event) => {
        console.error('حدث خطأ:', event.error);
        setState(s => ({ ...s, error: 'حدث خطأ في التعرف على الصوت', isListening: false }));
      };

      recognition.onend = () => {
        if (state.isListening) {
          recognition.start();
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      setState(s => ({ ...s, isListening: true, error: null }));

      // بدء مؤقت الصمت
      silenceTimerRef.current = setTimeout(() => {
        if (state.isListening) {
          recognition.stop();
          setState(s => ({ ...s, isListening: false }));
        }
      }, 5000); // 5 ثواني من الصمت

    } catch (err) {
      console.error('خطأ في تشغيل الميكروفون:', err);
      setState(s => ({ ...s, error: 'تعذر الوصول إلى الميكروفون', isListening: false }));
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    setState(s => ({ ...s, isListening: false }));
  };

  const processQuery = async (query: string) => {
    setState(s => ({ ...s, isProcessing: true }));
    
    try {
      // استبدل هذا بالاتصال الفعلي بـ LLM
      const response = await axiosInstance.post("/assistant", {
        prompt: query,
      });
      
      const { data } = await response;
      speakResponse(data.result);
    } catch (err) {
      console.error('خطأ في المعالجة:', err);
      setState(s => ({ ...s, error: 'حدث خطأ في المعالجة', isProcessing: false }));
    }
  };

  const speakResponse = (text: string) => {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.6;
    
    utterance.onstart = () => {
      setState(s => ({ ...s, isSpeaking: true, isProcessing: false }));
    };
    
    utterance.onend = () => {
      setState(s => ({ ...s, isSpeaking: false }));
      if (state.isOpen) {
        startListening(); // العودة للاستماع بعد الانتهاء من الكلام
      }
      startListening(); // العودة للاستماع بعد الانتهاء من الكلام

    };
    
    window.speechSynthesis.speak(utterance);
  };

  const toggleAssistant = () => {
    const newState = !state.isOpen;
    setState(s => ({ ...s, isOpen: newState }));
    
    if (newState) {
      startCountdown();
    } else {
      stopListening();
      window.speechSynthesis.cancel();
      clearInterval(countdownRef.current);
      setState(s => ({ ...s, countdown: 0 }));
    }
  };

  const retry = () => {
    setState(s => ({ ...s, error: null }));
    if (state.isOpen) {
      startCountdown();
    }
  };

  useEffect(() => {
    return () => {
      stopListening();
      window.speechSynthesis.cancel();
      clearInterval(countdownRef.current);
      clearTimeout(silenceTimerRef.current);
    };
  }, []);

  return (
    <AssistantContext.Provider value={{ ...state, toggleAssistant, retry }}>
      {children}
    </AssistantContext.Provider>
  );
}

export function useVoiceAssistant() {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error('useVoiceAssistant must be used within a VoiceAssistantProvider');
  }
  return context;
}