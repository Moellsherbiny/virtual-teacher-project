'use client';

import { motion } from 'framer-motion';
import { useVoiceAssistant } from './VoiceAssistantProvider';

export function VoiceAssistantButton() {
  const { isListening, isSpeaking, toggleAssistant } = useVoiceAssistant();
  
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={{
        scale: isListening || isSpeaking ? [1, 1.1, 1] : 1,
        boxShadow: isListening || isSpeaking 
          ? '0 0 10px 5px rgba(59, 130, 246, 0.5)' 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
      transition={{
        duration: 1,
        repeat: isListening || isSpeaking ? Infinity : 0,
      }}
      onClick={toggleAssistant}
      className="fixed bottom-6 right-6 z-50 p-4 bg-blue-500 text-white rounded-full shadow-lg"
    >
      {isListening ? '🎤' : isSpeaking ? '🗣️' : '👨‍💻'}
    </motion.button>
  );
}