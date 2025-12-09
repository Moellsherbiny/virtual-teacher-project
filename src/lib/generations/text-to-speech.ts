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
  const words = text.split(/\s+/);
  let currentSegment = "";
  let currentLang: "ar" | "en" | null = null;

  words.forEach((word, index) => {
    const wordLang = detectLanguage(word);

    if (wordLang !== currentLang && currentSegment) {
      segments.push({
        text: currentSegment.trim(),
        lang: currentLang as "ar" | "en",
      });
      currentSegment = "";
    }

    currentLang = wordLang;
    currentSegment += word + " ";

    // If it's the last word, add the remaining segment
    if (index === words.length - 1 && currentSegment) {
      segments.push({
        text: currentSegment.trim(),
        lang: currentLang as "ar" | "en",
      });
    }
  });

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
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  });
};
