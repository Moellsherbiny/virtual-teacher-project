import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/database/db";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

interface MessageHistory {
  role?: string;
  parts?: { text?: string }[];
}

// Check if the API key is set
if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in the environment variables");
  process.exit(1);
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, userId } = await request.json();
    if (!prompt || !userId) {
      return NextResponse.json(
        { error: "No userId or prompt found!" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const generationConfig = {
      temperature: 0.9,
      topK: 65,
      topP: 0.95,
      maxOutputTokens: 1000,
    };
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig,
      safetySettings,
    });

    let messagesResult;
    try {
      messagesResult = await query(
        `SELECT content, sender FROM messages WHERE user_id = $1 ORDER BY id DESC LIMIT 10`,
        [userId]
      );
    } catch (dbError) {
      console.error("Database error:", dbError);
    }

    const chatSession = model.startChat({
      history: [],
    });

    let response;
    try {
      response = await chatSession.sendMessage(prompt);
    } catch (apiError) {
      console.error("Gemini API error:", apiError);
      return NextResponse.json(
        { error: "Error communicating with Gemini API" },
        { status: 500 }
      );
    }

    if (!response.response) {
      return NextResponse.json(
        { error: "No response from Gemini API" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: response.response.text() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error in POST function:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
