'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceAssistant } from './VoiceAssistantProvider';

export default function VoiceAssistantDialog() {
  const { 
    isOpen, 
    isListening, 
    isProcessing, 
    isSpeaking, 
    countdown,
    error,
    retry 
  } = useVoiceAssistant();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 flex items-center justify-center z-40 p-4"
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            {error ? (
              <div className="text-center">
                <div className="text-red-500 text-5xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold mb-2">حدث خطأ</h3>
                <p className="mb-4">{error}</p>
                <button
                  onClick={retry}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  المحاولة مرة أخرى
                </button>
              </div>
            ) : isProcessing ? (
              <div className="text-center">
                <div className="animate-pulse text-5xl mb-4">🤔</div>
                <h3 className="text-xl font-bold mb-2">جاري المعالجة</h3>
                <p>يرجى الانتظار...</p>
              </div>
            ) : countdown > 0 ? (
              <div className="text-center">
                <div className="text-5xl mb-4 animate-bounce">⏱️</div>
                <h3 className="text-xl font-bold mb-2">جاري الإعداد</h3>
                <p>سيبدأ الاستماع خلال {countdown} ثانية</p>
              </div>
            ) : (
              <div className="text-center">
                <motion.div
                  animate={{ 
                    scale: isListening ? [1, 1.2, 1] : 1,
                    rotate: isListening ? [0, 5, -5, 0] : 0
                  }}
                  transition={{
                    duration: 1,
                    repeat: isListening ? Infinity : 0
                  }}
                  className="text-5xl mb-4"
                >
                  {isListening ? '🎤' : isSpeaking ? '🗣️' : '👂'}
                </motion.div>
                <h3 className="text-xl font-bold mb-2">
                  {isListening ? 'جاري الاستماع...' : isSpeaking ? 'جاري الرد...' : 'جاهز للاستماع'}
                </h3>
                <p className="text-gray-600">
                  {isListening ? 'تحدث الآن' : isSpeaking ? 'يرجى الانتظار' : 'اضغط للتحدث'}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}