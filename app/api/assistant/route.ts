import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(request: Request) {
  const { prompt } = await request.json();
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  const chatSession = model.startChat({
    history: [],
  })
  const response = await chatSession.sendMessage(prompt)
  
  return NextResponse.json({result:response.response.text()})
}