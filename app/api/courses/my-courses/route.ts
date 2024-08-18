import { query } from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const userId = params.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "no user id found" }, { status: 400 });
  }

  const courses = await query(
    `
SELECT 
    "Enrollment"."userId" AS student_ID,
    "Enrollment"."course_id" AS enrollment_course_ID,
    "Course"."course_id",
    "Course"."title",
    "Course"."course_image",
    "Course"."description"
FROM 
    "Enrollment"
JOIN 
    "users" ON "Enrollment"."userId" = "users".id
JOIN 
    "Course" ON "Enrollment"."course_id" = "Course"."course_id"
WHERE 
    "Enrollment"."userId" = $1;
`,
    [userId]
  );
  return NextResponse.json({ courses: courses.rows });
}
