"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Mic, User, Bot, Loader2, Volume2, StopCircle, Plane, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { filterTextForTTS } from "./txtFilter";
import ReactMarkdown from "react-markdown";
import RobotHead from "../RobotHead";

// Types
interface Message {
  id: string;
  role: "USER" | "MODEL";
  content: string;
}

interface VoiceChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onSend: (message: string) => void;
}

export function VoiceChatArea({
  messages,
  isLoading,
  onSend,
}: VoiceChatAreaProps) {
  const t = useTranslations("chatbot");

  // --- STATE & REFS ---
  const [isSTTSupported, setIsSTTSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const lastSpokenMessageId = useRef<string | null>(null);
  const hasMountedRef = useRef(false);
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const finalTranscriptRef = useRef("");
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // --- 1. INIT (STT SUPPORT CHECK) ---
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const BrowserSpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    const supported = !!BrowserSpeechRecognition;
    setIsSTTSupported(supported);

    if (!supported) {
      toast.error(t("sttNotSupported"));
    }

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [t]);

  // --- 2. STOP SPEECH ---
  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentlySpeakingId(null);
      speechSynthesisRef.current = null;
    }
  }, []);

  // --- 3. TEXT TO SPEECH ---
  const speakResponse = useCallback(
    (text: string, messageId: string) => {
      if (typeof window === 'undefined' || typeof window.speechSynthesis === "undefined") {
        toast.error(t("ttsNotSupported"));
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const langCode = document.documentElement.lang === "ar" ? "ar-SA" : "en-US";
      const utterance = new SpeechSynthesisUtterance(filterTextForTTS(text));
      utterance.lang = langCode;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Try to select appropriate voice
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find((v) => v.lang.startsWith(langCode.split('-')[0]));
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentlySpeakingId(messageId);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentlySpeakingId(null);
        speechSynthesisRef.current = null;
      };


      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [t]
  );

  // --- 4. STOP LISTENING ---
  const stopListening = useCallback(
    (manualStop: boolean = false) => {
      if (!isListening) return;

      setIsListening(false);
      
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error("Error stopping recognition:", error);
        }
      }

      const trimmed = finalTranscriptRef.current.trim();

      // Send text if available
      if (trimmed.length > 0) {
        onSend(trimmed);
      } else if (manualStop) {
        // Only show warning if user manually stopped with no text
        toast.warning(t("noSpeechDetected"));
      }
      
      // Always clear the transcript after sending
      finalTranscriptRef.current = "";
      setLiveTranscript("");
    },
    [isListening, onSend, t]
  );

  // --- 5. START LISTENING ---
  const startListening = useCallback(() => {
    if (!isSTTSupported || isListening || typeof window === 'undefined') return;

    const BrowserSpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!BrowserSpeechRecognition) return;

    // Stop any ongoing speech before listening
    stopSpeech();

    const recognition = new BrowserSpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = document.documentElement.lang === "ar" ? "ar-SA" : "en-US";

    finalTranscriptRef.current = "";
    setLiveTranscript("");
    setIsListening(true);

    recognition.onstart = () => {
      console.log("Speech recognition started");
    };

    recognition.onresult = (event: any) => {
      let interim = "";
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcript + " ";
        } else {
          interim += transcript;
        }
      }

      if (finalText) {
        finalTranscriptRef.current += finalText;
      }

      setLiveTranscript(finalTranscriptRef.current + interim);
    };


    recognition.onend = () => {
      if (isListening) {
        stopListening(false);
      }
    };

    try {
      recognition.start();
    } catch (error) {
      console.error("Error starting recognition:", error);
      setIsListening(false);
      toast.error(t("sttFailed"));
    }
  }, [isSTTSupported, isListening, stopListening, stopSpeech, t]);

  // --- 6. AUTO-SPEAK NEW AI MESSAGES ---
  useEffect(() => {
    if (!messages.length || !hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const lastMessage = messages[messages.length - 1];

    // Only speak if: it's a MODEL message, it's new, and we're not listening
    if (
      lastMessage.role === "MODEL" &&
      lastMessage.id !== lastSpokenMessageId.current &&
      !isListening &&
      !isLoading
    ) {
      lastSpokenMessageId.current = lastMessage.id;
      speakResponse(lastMessage.content, lastMessage.id);
    }
  }, [messages, speakResponse, isListening, isLoading]);

  // --- 7. AUTO SCROLL ---
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, liveTranscript]);

  // --- 8. CLEANUP ON UNMOUNT ---
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.error("Cleanup error:", e);
        }
      }
      stopSpeech();
    };
  }, [stopSpeech]);

  const buttonText = isListening ? t("listening") : t("speakNow");

  // --- 9. RENDER ---
  return (
    <div className="flex flex-col h-full w-full bg-gray-50 dark:bg-gray-900 relative">
      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
           <RobotHead />
            <p className="text-sm font-medium">
              {t("startVoiceConversation")}
            </p>
            <p className="text-xs text-center max-w-xs">
              {t("clickMicToStart")}
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === "USER";
          const isCurrentlySpeaking = currentlySpeakingId === msg.id;

          return (
            <div
              key={msg.id}
              className={cn(
                "flex w-full",
                isUser ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "flex max-w-[85%] md:max-w-[75%] gap-2",
                  isUser ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={cn(
                    "shrink-0 w-8 h-8 rounded-full flex items-center justify-center border shadow-sm",
                    isUser
                      ? "bg-orange-100 border-orange-200 text-orange-600"
                      : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
                  )}
                >
                  {isUser ? <User size={14} /> : <Bot size={14} />}
                </div>

                <div
                  className={cn(
                    "px-4 py-2.5 shadow-sm text-sm break-words",
                    isUser
                      ? "bg-orange-600 text-white rounded-2xl rounded-tr-none"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-2xl rounded-tl-none border border-gray-200 dark:border-gray-800"
                  )}
                >
                  <ReactMarkdown>

                  {msg.content}
                  </ReactMarkdown>

                  {msg.role === "MODEL" && isCurrentlySpeaking && (
                    <Volume2 className="w-3 h-3 inline ms-2 animate-pulse text-orange-600" />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* LIVE TRANSCRIPTION - Always show when listening */}
        {isListening && (
          <div className="flex w-full justify-end">
            <div className="flex max-w-[85%] md:max-w-[75%] flex-row-reverse gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 border-orange-200 border flex items-center justify-center">
                <User size={14} className="text-orange-600" />
              </div>
              <div className="px-4 py-2 bg-orange-200 text-orange-800 rounded-2xl rounded-tr-none shadow-sm min-h-[40px] flex items-center">
                {liveTranscript || (
                  <span className="text-orange-600 italic">
                    {t("listening")}
                  </span>
                )}
                {liveTranscript && <span className="animate-pulse">...</span>}
              </div>
            </div>
          </div>
        )}

        {/* LOADING */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 flex justify-center items-center shadow-sm">
                <Bot size={14} />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800">
                <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
              </div>
            </div>
          </div>
        )}

        <div ref={scrollEndRef} />
      </div>

      {/* MIC CONTROLS */}
      <div className="p-4 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-4">
            {/* Main Mic Button */}
            <Button
             
              onClick={isListening ? () => stopListening(true) : startListening}
              disabled={!isSTTSupported || isLoading}
              className={cn("rounded-full shadow-xl transition-all",
                isListening
                  ? "bg-red-600 hover:bg-red-500 scale-110"
                  : "bg-orange-600 hover:bg-orange-500"
              )}
              aria-label={isListening ? "Stop listening" : "Start listening"}
            >
              {isListening? 
              < Send size={18} />
              :<Mic size={18} />}
            </Button>

            {/* Stop Speech Button */}
            {isSpeaking && (
              <Button
                
                onClick={stopSpeech}
                variant="outline"
                className="rounded-full shadow-lg"
                aria-label="Stop speech"
              >
                <StopCircle size={18} className="text-red-600" />
              </Button>
            )}
          </div>

          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {buttonText}
          </p>

          {!isSTTSupported && (
            <p className="text-xs text-red-600">
              {t("sttNotSupported")}
            </p>
          )}
        </div>

        <div className="text-[10px] text-center opacity-50 mt-3">
          {t("disclaimer")}
        </div>
      </div>
    </div>
  );
}