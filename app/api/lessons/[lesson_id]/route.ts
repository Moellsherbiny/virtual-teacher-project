import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { lesson_id: number } }
) {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM "Lesson" WHERE course_id = $1',
      [params.lesson_id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Lesson not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching lesson content:", error);
    return NextResponse.error();
  }
}
