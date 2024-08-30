import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/database/db";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

interface MessageHistory {
  role: string;
  parts: { text: string }[];
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
// const safetySettings = [
//   {
//     category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//     threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
//   },
//   {
//     category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
//     threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
//   },
// ];

const generationConfig = {
  temperature: 1,
  maxOutPutTokens: 100,
  response_mime_type: "text/plain",
};
export async function POST(request: NextRequest) {
  const { prompt, userId } = await request.json();
  if (!prompt)
    return NextResponse.json(
      { error: "No userId Or prompt found!" },
      { status: 500 }
    );

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 1,
      maxOutputTokens: 100,
      responseMimeType: "text/plain",
    },
  });

  const messagesResult = await query(
    `SELECT content, sender FROM messages WHERE user_id = $1 ORDER BY id ASC`,
    [userId]
  );

  const msgHistory: MessageHistory[] = messagesResult.rows.map((message) => ({
    role: message.sender === "student" ? "user" : "model",
    parts: [{ text: message.content }],
  }));
  const chatSession = model.startChat({
    history: msgHistory,
  });

  const { response } = await chatSession.sendMessage(prompt);

  return NextResponse.json({ message: response.text() }, { status: 201 });
}
