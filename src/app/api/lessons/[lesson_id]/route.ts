import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ lesson_id: string }> }
) {
  const { lesson_id } = await context.params;

  try {
    const { rows } = await pool.query(
      'SELECT * FROM "Lesson" WHERE lesson_id = $1',
      [lesson_id]
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
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
