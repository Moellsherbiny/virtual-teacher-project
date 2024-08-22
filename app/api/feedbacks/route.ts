import { query } from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  // if (userId?.length === 0) {
  //   return NextResponse.json({ error: "no user found" }, { status: 403 });
  // }

  const feedbacks = await query(`SELECT * FROM feedbacks WHERE "userId" = $1`, [
    userId,
  ]);

  return NextResponse.json({ feedbacks: feedbacks.rows });
}
