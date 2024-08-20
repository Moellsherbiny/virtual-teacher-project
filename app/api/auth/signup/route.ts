import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/database/db";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password)
      return NextResponse.json(
        { error: "parameters not found" },
        { status: 500 }
      );

    const userEmail = email.toLowerCase()
    const isExists = await query(`SELECT * FROM users WHERE email = $1`, [
      userEmail,
    ]);

    if (isExists.rows.length > 0) {
      return NextResponse.json(
        { error: "User Already Exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const response = await query(
      `INSERT INTO users (name, email, hashed_password) VALUES ($1, $2, $3)`,
      [name, email, hashedPassword]
    );

    console.log({ email, password });
    return NextResponse.json({ response }, { status: 201 });
  } catch (error) {
    console.log("something wrong ", error);
  }
}
