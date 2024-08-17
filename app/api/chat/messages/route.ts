import { query } from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { content, sender, userId } = await request.json();
  if (!content || !sender || !userId)
    return NextResponse.json(
      { error: "No content or sender or userId Found" },
      { status: 500 }
    );

  await query(
    `INSERT INTO messages(user_id, content, sender) VALUES($1, $2, $3)`,
    [userId, content, sender]
  );

  return NextResponse.json({message:""})
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId query parameter is required" },
        { status: 400 }
      );
    }

    const messages = await query(`SELECT * FROM messages WHERE user_id = $1`, [
      userId,
    ]);

    if (!messages || !messages.rows) {
      return NextResponse.json(
        { error: "Failed to retrieve messages" },
        { status: 500 }
      );
    }

    return NextResponse.json({ messages: messages.rows });
  } catch (error) {
    console.error("Error in GET /api/messages:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
