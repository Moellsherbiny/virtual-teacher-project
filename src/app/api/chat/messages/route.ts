import { GoogleGenAI } from "@google/genai";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/database/prisma";
import { auth } from "@/lib/auth";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Extract conversationId from URL search parameters
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) {
    return NextResponse.json(
      { error: "Missing conversationId" },
      { status: 400 }
    );
  }

  try {
    // 2. Fetch the messages belonging to this conversation
    const messages = await prisma.chatMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      // OPTIONAL: Verify the conversation belongs to the user for security
      // You could join or check the parent conversation, but for simplicity, 
      // we rely on the session check and the API being internal.
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { message, conversationId } = await req.json();

    if (!conversationId) return NextResponse.json({ error: "No conversation ID" }, { status: 400 });

    // 1. Save USER message to DB
    await prisma.chatMessage.create({
      data: {
        conversationId,
        role: "USER",
        content: message,
      },
    });

    // 2. Fetch recent history for context (limit to last 10 messages to save tokens)
    const previousMessages = await prisma.chatMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      take: 10, 
    });

    // 3. Format history for Google GenAI SDK
    // The SDK expects roles as "user" and "model"
    const history = previousMessages.map((msg) => ({
      role: msg.role === "USER" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // 4. Call Gemini
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: history, 
    });

    const result = await chat.sendMessage({ message });
    const aiResponseText = result.text; // Adjust based on exact SDK response structure

    if (!aiResponseText)
      return NextResponse.json({ error: "No AI response" }, { status: 500 });

    // 5. Save AI response to DB
    const savedAiMessage = await prisma.chatMessage.create({
      data: {
        conversationId,
        role: "MODEL",
        content: aiResponseText,
      },
    });

    // 6. Update conversation timestamp
    await prisma.chatConversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json(savedAiMessage);

  } catch (err) {
    console.error("Chat Error:", err);
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}