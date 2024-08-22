import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/database/db";
import { generateQuizFromLLM } from "@/lib/generations/quiz";

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

    return NextResponse.json({ quiz , quizTitle:courseTitle.rows[0].title});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate quiz", details: error },
      { status: 500 }
    );
  }
}
