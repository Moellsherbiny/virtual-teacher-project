import { NextResponse } from "next/server";
import { pool } from "@/lib/database/db";

export async function GET(
  request: Request,
  { params }: { params: { course_id: string } }
) {
  const { course_id } = params;

  const course = await pool.query(
    'SELECT * FROM "Course" WHERE course_id = $1',
    [course_id]
  );
  return NextResponse.json({ course: course.rows });
}
