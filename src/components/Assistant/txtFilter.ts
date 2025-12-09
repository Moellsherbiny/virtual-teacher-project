

export interface TTSFilterOptions {
  removeMarkdown?: boolean;
  removeUrls?: boolean;
  removeEmails?: boolean;
  removePhoneNumbers?: boolean;
  removeSpecialChars?: boolean;
  normalizeSpaces?: boolean;
  maxLength?: number;
}

/**
 * Default TTS filter options
 */
const defaultOptions: TTSFilterOptions = {
  removeMarkdown: true,
  removeUrls: true,
  removeEmails: true,
  removePhoneNumbers: true,
  removeSpecialChars: true,
  normalizeSpaces: true,
  maxLength: 5000
};

/**
 * Filters text for TTS by removing unwanted characters and formatting
 */
export function filterTextForTTS(text: string, options: TTSFilterOptions = {}): string {
  const config = { ...defaultOptions, ...options };
  let filteredText = text;

  // Remove markdown syntax
  if (config.removeMarkdown) {
    filteredText = filteredText
      .replace(/#{1,6}\s?/g, '') // Headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
      .replace(/\*(.*?)\*/g, '$1') // Italic
      .replace(/~~(.*?)~~/g, '$1') // Strikethrough
      .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // Inline code and code blocks
      .replace(/!\[(.*?)\]\(.*?\)/g, '$1') // Images
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
      .replace(/^>\s?/gm, '') // Blockquotes
      .replace(/^-{3,}/g, '') // Horizontal rules
      .replace(/\|?(?:\|?[:-]+\|?)+\|?/g, '') // Table separators
      .replace(/\|/g, ' '); // Table pipes
  }

  // Remove URLs
  if (config.removeUrls) {
    filteredText = filteredText.replace(/https?:\/\/[^\s]+/g, '');
  }

  // Remove email addresses
  if (config.removeEmails) {
    filteredText = filteredText.replace(/\S+@\S+\.\S+/g, '');
  }

  // Remove phone numbers
  if (config.removePhoneNumbers) {
    filteredText = filteredText.replace(/[\+]?[(]?[\d\s\-\(\)]{10,}/g, '');
  }

  // Remove special characters that don't sound good in TTS
  if (config.removeSpecialChars) {
    filteredText = filteredText
      .replace(/[*&%$#@^~`\\/]/g, '') // Remove problematic symbols
      .replace(/[{}[\]()<>]/g, ' ') // Replace brackets with spaces
      .replace(/[+=]/g, ' and ') // Replace + and = with "and"
      .replace(/[_]/g, ' ') // Replace underscores with spaces
      .replace(/[|]/g, ' or ') // Replace pipe with "or"
      .replace(/[®™©]/g, '') // Remove trademark symbols
      .replace(/[~]/g, ' approximately ') // Replace ~ with "approximately"
      .replace(/[°]/g, ' degrees ') // Replace degree symbol
      .replace(/[¥£€]/g, ' currency ') // Replace currency symbols
      .replace(/[¶§]/g, ' ') // Remove paragraph/section symbols
      .replace(/[†‡]/g, ' ') // Remove dagger symbols
  }

  // Normalize spaces and clean up
  if (config.normalizeSpaces) {
    filteredText = filteredText
      .replace(/\s+/g, ' ') // Multiple spaces to single space
      .replace(/\n+/g, '. ') // Multiple newlines to period + space
      .trim();
  }

  // Limit length if specified
  if (config.maxLength && filteredText.length > config.maxLength) {
    filteredText = filteredText.substring(0, config.maxLength - 3) + '...';
  }

  return filteredText;
}

/**
 * Enhanced TTS filter that also handles code blocks and technical content
 */
export function filterTechnicalTextForTTS(text: string): string {
  let filteredText = text;

  // Remove code blocks but keep the content as natural language
  filteredText = filteredText.replace(/```[\s\S]*?```/g, (match) => {
    // Extract code content and describe it
    const codeContent = match.replace(/```\w*\n?/g, '').replace(/```/g, '').trim();
    return `Code: ${codeContent.substring(0, 200)}`;
  });

  // Remove inline code markers
  filteredText = filteredText.replace(/`([^`]+)`/g, '$1');

  // Handle common programming terms more naturally
  const programmingTerms: { [key: string]: string } = {
    'console.log': 'console log',
    'function': 'function',
    'const': 'constant',
    'let': 'let',
    'var': 'var',
    'return': 'return',
    'if': 'if',
    'else': 'else',
    'for': 'for',
    'while': 'while',
    'switch': 'switch',
    'case': 'case',
    'default': 'default',
    'break': 'break',
    'continue': 'continue',
    'class': 'class',
    'interface': 'interface',
    'type': 'type',
    'import': 'import',
    'export': 'export',
    'from': 'from',
    'require': 'require',
    'module': 'module',
    'exports': 'exports'
  };

  Object.entries(programmingTerms).forEach(([term, replacement]) => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    filteredText = filteredText.replace(regex, replacement);
  });

  // Apply standard filtering
  return filterTextForTTS(filteredText);
}