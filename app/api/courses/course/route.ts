import { query } from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const courseId = searchParams.get("courseId");

  if (!courseId)
    return NextResponse.json({ error: "no course id found!" }, { status: 500 });

  const course = await query(`SELECT * FROM "Course" WHERE course_id = $1`, [
    courseId,
  ]);

  return NextResponse.json({ course: course.rows }, { status: 200 });
}
