"use client";
import { Mic, MicOff } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

type Props = {
  isListening: boolean;
  onToggleListening: () => void;
  isSpeaking: boolean;
};

export function VoiceControls({ isListening, onToggleListening }: Props) {

  const handleSpeech = async () => {
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "مرحبا بك في منصتنا، كيف أستطيع مساعدتك؟",
        }),
      });

      if (!res.ok) {
        console.error("API error");
        return;
      }

      const blob = await res.blob();
      const audioURL = URL.createObjectURL(blob);

      const audio = new Audio(audioURL);
      audio.play();
    } catch (err) {
      console.error("TTS error", err);
    }
  };

  return (
    <>
      <Button onClick={handleSpeech}>
        Speech
      </Button>

      <button
        onClick={onToggleListening}
        className={`p-2 rounded-full transition-all flex-shrink-0 ${
          isListening
            ? "bg-red-500 text-white animate-pulse"
            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
        aria-label={isListening ? "Stop listening" : "Start voice input"}
      >
        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </button>
    </>
  );
}
