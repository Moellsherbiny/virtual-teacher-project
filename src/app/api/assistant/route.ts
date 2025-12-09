import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Define a local type for structure, as importing ChatContent was causing issues
type ChatContent = {
  role: "user" | "model";
  parts: { text: string }[];
};

// Initialize the client once outside the handler
const apiKey = process.env.GEMINI_API_KEY2;
const ai = new GoogleGenAI({ apiKey: apiKey as string });
const model = "gemini-2.5-flash";

export async function POST(request: NextRequest) {
  try {
    // 1. Safely parse the request body and apply a default empty array to history
    const { prompt, history = [] } = (await request.json()) as { 
      prompt?: string; 
      history?: ChatContent[]; // history is now safely typed as optional
    };

    // Input Validation
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return NextResponse.json(
        { error: "Invalid or missing 'prompt' in request body." },
        { status: 400 } // Bad Request
      );
    }

    // 2. Define the new user message
    const newUserMessage: ChatContent = {
      role: "user",
      parts: [{ text: prompt }],
    };

    // 3. Create the full content array by spreading the existing history and adding the new message
    // This array provides the model with the complete context.
    const fullContent: ChatContent[] = [...history, newUserMessage];

    // 4. Call the Gemini API using the stateless method with the full history
    const response = await ai.models.generateContent({
      model: model,
      contents: fullContent
    });

    // 5. Define the model's response message
    const newModelMessage: ChatContent = {
      role: "model",
      parts: [{ text: response.text! }],
    };

    // 6. Create the updated history to send back to the client
    const updatedHistory: ChatContent[] = [
      ...fullContent,
      newModelMessage
    ];

    const generateContent = await response.text
    return NextResponse.json({ 
      result: generateContent, 
      // history: updatedHistory 
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    
    return NextResponse.json(
      { error: "Failed to communicate with the AI service. Check server logs." },
      { status: 500 } // Internal Server Error
    );
  }
}