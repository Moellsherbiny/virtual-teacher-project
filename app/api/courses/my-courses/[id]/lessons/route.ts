import { query } from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json({ error: "no course id found" }, { status: 400 });
  }

  const lessons = await query(`SELECT * FROM "Lesson" WHERE course_id = $1`, [
    params.id,
  ]);
  return NextResponse.json({ lessons: lessons.rows });
}
