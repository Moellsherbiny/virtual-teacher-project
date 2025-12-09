import { GoogleGenAI } from "@google/genai";

let instance: GoogleGenAI | null = null;

export function getAIClient() {
  if (!instance) {
    instance = new GoogleGenAI({});
  }
  return instance;
}
