import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/database/db";
import { generateLessonFromLLM } from "@/lib/generations/content";

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

  const existing_content = await query(
    `SELECT * FROM "Ai_lesson_content" WHERE lesson_id = $1`,
    [lessonId]
  );
  if (existing_content.rows.length > 0) {
    const { rows } = existing_content;
    const content = JSON.parse(rows[0].content);
    return NextResponse.json(
      { message: content },
      { status: 200 }
    );
  }

  const content = await generateLessonFromLLM(lesson.rows[0].title);
  await query(
    `INSERT INTO "Ai_lesson_content" (lesson_id, content) VALUES ($1, $2)`,
    [lessonId, content]
  );
  return NextResponse.json({ message: content }, { status: 201 });
}
