
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/database/db";

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: "No token provided" }, { status: 400 });

  
    const user = await query(`SELECT * FROM users WHERE activation_token = $1`, [token]);

  if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 400 });

  await query(`UPDATE users SET is_active = true, activation_token = null WHERE id = $1`, [user.rows[0].id]);

  // await prisma.user.update({
  //   where: { id: user.id },
  //   data: { is_active: true, activation_token: null },
  // });

  return NextResponse.json({ success: true });
}
