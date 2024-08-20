import { query } from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; lessonId: string } }
) {
  if (!params.id || !params.lessonId)
    return NextResponse.json(
      { error: "Params ids not found" },
      { status: 400 }
    );

  const lesson = await query(
    `SELECT * FROM "Lesson" WHERE lesson_id = $1 AND course_id=$2`,
    [params.lessonId, params.id]
  );
  return NextResponse.json({ lesson:lesson.rows });
}
