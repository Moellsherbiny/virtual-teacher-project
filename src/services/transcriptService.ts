import { getAIClient } from "../lib/aiClient";

export class TranscriptService {
  static async generate(text: string): Promise<string> {
    const ai = getAIClient();

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text }] }],
    });

    const transcript =
      response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!transcript) throw new Error("Failed to generate transcript");

    return transcript;
  }
}
