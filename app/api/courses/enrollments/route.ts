import { NextResponse } from "next/server";
import { pool } from "@/lib/database/db";
import { Enrollment } from "@/types/enrollment";

export async function POST(request: Request) {
  try {
    const { userId, courseId } = await request.json();
    const existing_enrollment = await pool.query(
      'SELECT * FROM "Enrollment" WHERE "userId" = $1 AND course_id = $2',
      [userId, courseId]
    );
    if (existing_enrollment.rows.length > 0) {
      return NextResponse.json(
        { error: "User already enrolled in this course" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'INSERT INTO "Enrollment" ("userId", course_id) VALUES ($1, $2) RETURNING *',
      [userId, courseId]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
