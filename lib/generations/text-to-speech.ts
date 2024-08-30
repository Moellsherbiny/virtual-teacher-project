const detectLanguage = (text: string) => {
  // Simple detection based on the presence of Arabic characters
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(text) ? 'ar' : 'en';
};
const cleanTextForSpeech = (text: string): string => {
  // Remove emojis
  const withoutEmojis = text.replace(/[\u{1F600}-\u{1F6FF}]/gu, '');

  // Remove non-alphabetic and non-numeric characters except spaces
  const withoutSpecialChars = withoutEmojis.replace(/[^\p{L}\p{N}\s]/gu, '');

  // Remove code snippets (anything within backticks ``, could extend to other code indicators)
  const withoutCode = withoutSpecialChars.replace(/`[^`]*`/g, '');

  // Remove URLs (http/https/ftp patterns)
  const withoutUrls = withoutCode.replace(/https?:\/\/[^\s]+/g, '');

  // Remove mathematical symbols and any other technical symbols
  const cleanedText = withoutUrls.replace(/[\p{S}]+/gu, '');

  return cleanedText.trim();
};

export const speakMessage = (text: string) => {
  const cleanedText = cleanTextForSpeech(text); 
  if (cleanedText.length === 0) return;

  const language = detectLanguage(cleanedText);
  const speech = new SpeechSynthesisUtterance(cleanedText); 
  speech.lang = language; 
  speech.pitch = 1; 
  speech.rate = .7; 
  window.speechSynthesis.speak(speech);
};