const detectLanguage = (text: string): "ar" | "en" => {
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(text) ? "ar" : "en";
};

const cleanTextForSpeech = (text: string): string => {
  // Remove emojis
  const withoutEmojis = text.replace(/[\u{1F600}-\u{1F6FF}]/gu, "");

  // Remove non-alphabetic and non-numeric characters except spaces and punctuation
  const withoutSpecialChars = withoutEmojis.replace(
    /[^\p{L}\p{N}\s.,!?]/gu,
    ""
  );

  // Remove code snippets (anything within backticks ``)
  const withoutCode = withoutSpecialChars.replace(/`[^`]*`/g, "");

  // Remove URLs (http/https/ftp patterns)
  const withoutUrls = withoutCode.replace(/https?:\/\/[^\s]+/g, "");

  // Remove mathematical symbols and any other technical symbols
  const cleanedText = withoutUrls.replace(/[\p{S}]+/gu, "");

  return cleanedText.trim();
};

const splitTextByLanguage = (
  text: string
): { text: string; lang: "ar" | "en" }[] => {
  const segments: { text: string; lang: "ar" | "en" }[] = [];
  let currentSegment = "";
  let currentLang: "ar" | "en" | null = null;

  for (const char of text) {
    const charLang = detectLanguage(char);

    if (charLang !== currentLang && currentSegment) {
      segments.push({ text: currentSegment, lang: currentLang as "ar" | "en" });
      currentSegment = "";
    }

    currentLang = charLang;
    currentSegment += char;
  }

  if (currentSegment) {
    segments.push({ text: currentSegment, lang: currentLang as "ar" | "en" });
  }

  return segments;
};

export const speakMessage = (text: string) => {
  const cleanedText = cleanTextForSpeech(text);

  if (cleanedText.length === 0) return;

  const segments = splitTextByLanguage(cleanedText);

  segments.forEach((segment) => {
    const speech = new SpeechSynthesisUtterance(segment.text);
    speech.lang = segment.lang;
    speech.pitch = 1;
    speech.rate = 0.9;
    window.speechSynthesis.speak(speech);
  });
};
