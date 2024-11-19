import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/database/db";
import { generateQuizFromLLM } from "@/lib/generations/quiz";

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { error: "Missing 'id' in the request body." },
        { status: 400 }
      );
    }

    // Query the database for the course title
    const courseResult = await query(
      `SELECT title FROM "Course" WHERE course_id = $1`,
      [id]
    );

    // Ensure a valid course title is found
    if (!courseResult.rows || courseResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Course not found for the provided ID." },
        { status: 404 }
      );
    }

    const courseTitle = courseResult.rows[0].title;

    // Generate the quiz using the LLM
    const quiz = await generateQuizFromLLM(courseTitle);

    // Return the quiz and course title
    return NextResponse.json(
      { quiz, quizTitle: courseTitle },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/quiz:", error);

    // Return a 500 error with details
    return NextResponse.json(
      {
        error: "An unexpected error occurred.",
        details: "Unknown error.",
      },
      { status: 500 }
    );
  }
}


  
      // Save the quiz to the database
      // const result = await query(
      //   'INSERT INTO quizzes (questions, user_id, created_at) VALUES ($1, $2, NOW()) RETURNING id',
      //   [JSON.stringify(quiz), userId]
      // );