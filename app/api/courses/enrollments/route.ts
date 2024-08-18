import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/database/db"; // Assuming you have a custom query function

export async function POST(request: NextRequest) {
  try {
    const { userId, courseId } = await request.json();

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: "User ID and Course ID are required!" },
        { status: 400 }
      );
    }

    const getCourse = await query(
      `SELECT 1 FROM "Enrollment" WHERE "userId" = $1 AND course_id = $2`,
      [userId, courseId]
    );

    if (getCourse.rowCount) {
      return NextResponse.json(
        { error: "انت منضم بالفعل الي هذة الدورة" },
        { status: 409 }
      );
    }

    await query(
      `INSERT INTO "Enrollment"("userId", course_id) VALUES($1, $2)`,
      [userId, courseId]
    );

    return NextResponse.json(
      { message: "تم الانضمام للدورة التعليمية بنجاح" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error enrolling user:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const courseId = searchParams.get("courseId");

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: "User ID and Course ID are required!" },
        { status: 400 }
      );
    }

    const getCourse = await query(
      `SELECT * FROM "Enrollment" WHERE "userId" = $1 AND course_id = $2`,
      [userId, courseId]
    );

    if (getCourse.rowCount) {
      return NextResponse.json(
        { enrolled: true, message: "User is enrolled in this course." },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error when fetching enrollment status:", error);
    return NextResponse.json({ error: "try again later." }, { status: 500 });
  }
}
