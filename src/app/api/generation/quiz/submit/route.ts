import { NextRequest, NextResponse } from "next/server";
import { submitHandler, generateFeedback } from "@/lib/quiz/submitHandler";
import { query } from "@/lib/database/db";

export async function POST(req: NextRequest) {
  const { userId, generatedQuiz, quizTitle, selectedAnswers } = await req.json();

  if (!userId || !selectedAnswers) {
    return NextResponse.json({ message: "Invalid inputs" },);
  }

  const score = submitHandler(generatedQuiz, selectedAnswers);
  const feedback = generateFeedback(score, selectedAnswers.length);
  console.log(feedback);

  await query(
    `INSERT INTO feedbacks ("userId", result, score, quiz) VALUES($1,$2,$3,$4)`,
    [userId, feedback, score, quizTitle]
  );
  return NextResponse.json({ generatedQuiz });
}
