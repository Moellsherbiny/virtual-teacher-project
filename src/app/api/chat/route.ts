import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/database/db";
import { GoogleGenAI } from "@google/genai";

// تأكد من وجود المفتاح
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

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // أدوات مساعدة (مثلاً Google Search API - لو مفعلة عندك)
    // const tools = [
    //   {
    //     googleSearch: {},
    //   },
    // ];

    // إعدادات التكوين
    const config = {
      thinkingConfig: {
        thinkingBudget: -1,
      },
      responseMimeType: "text/plain",
    };

    // استدعاء محتوى المستخدم
    const contents = [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ];

    // نموذج Gemini الذي تريد استخدامه
    const model = "gemini-2.5-pro";

    const stream = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    // استلام النتيجة كسلسلة نصوص
    let responseText = "";
    for await (const chunk of stream) {
      responseText += chunk.text;
    }

    // يمكن تخزين الرسالة في قاعدة البيانات إن أردت
    // await query(`INSERT INTO messages (user_id, content, sender) VALUES ($1, $2, $3)`, [userId, responseText, 'ai']);

    return NextResponse.json({ message: responseText }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error in POST function:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
