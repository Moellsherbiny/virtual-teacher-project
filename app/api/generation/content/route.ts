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

export async function generateLessonFromLLM(lesson: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `${lesson}
      بناءً على عنوان الدرس أعلاه، قم بإنشاء شرح شامل ومهني للدرس.
      
      استخدم تنسيق
      1. مقدمة موجزة
      2. شرح مفصل للمفاهيم الرئيسية
      3. أمثلة على الكود عند الاقتضاء
      4. ملخص أو خاتمة
      5. تمارين اختيارية أو قراءات إضافية

      تأكد من أن المحتوى جذاب وواضح ومناسب لبيئة التعلم.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;

    if (!response || !response.text) {
      throw new Error("Invalid response from Gemini API");
    }

    const text = await response.text();

    // Log the raw response text for debugging
    console.log("Raw AI response:", text);

    // Attempt to parse the text as JSON
    try {
      const parsedContent = JSON.parse(text);
      return parsedContent;
    } catch (error) {
      console.warn("Response is not valid JSON. Returning raw text.");
      return { content: text };  // Fallback to plain text
    }
  } catch (error) {
    console.error("Error generating lesson from LLM:", error);
    throw new Error("Failed to generate lesson content");
  }
}

export async function POST(request: NextRequest) {
  const { lessonId } = await request.json();
  if (!lessonId)
    return NextResponse.json({ error: "No lesson id found!" }, { status: 500 });

  const lesson = await query(`SELECT * FROM "Lesson" WHERE lesson_id = $1`, [
    lessonId,
  ]);

  if (lesson.rows.length === 0) {
    return NextResponse.json({ error: "Lesson not found!" }, { status: 404 });
  }

  const content = await generateLessonFromLLM(lesson.rows[0].title);

  return NextResponse.json({ message: content }, { status: 201 });
}
