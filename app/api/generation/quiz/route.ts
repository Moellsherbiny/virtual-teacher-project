import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/database/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateQuizFromLLM(courseTitle: string) {
  let model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  });

  let prompt = `
Create a JSON quiz with 5 multiple-choice for this course ${courseTitle} questions in Arabic. Each question should have four options and a clear correct answer. Use English for object notation and Arabic for question and options. Follow this structure:
  {
    "questions": [
      {
        "text": "Question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "Correct option"
      }
    ]
  }`;

  let result = await model.generateContent(prompt);
  console.log(result.response.text());
  return JSON.parse(result.response.text());
}

export async function POST(request: NextRequest) {
  const { id } = await request.json();

  try {
    const courseTitle = await query(
      `SELECT title FROM "Course" WHERE course_id =$1`,
      [id]
    );
    const quiz = await generateQuizFromLLM(courseTitle.rows[0].title);

    // Save the quiz to the database
    // const result = await query(
    //   'INSERT INTO quizzes (questions, user_id, created_at) VALUES ($1, $2, NOW()) RETURNING id',
    //   [JSON.stringify(quiz), userId]
    // );

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate quiz", details: error },
      { status: 500 }
    );
  }
}
