import { query } from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const courses = await query(`SELECT * FROM "Course"`);

    return NextResponse.json({ courses: courses.rows });
  } catch (error) {
    throw new Error(`Something wrong when get all courses with error ${error}`);
  }
}
