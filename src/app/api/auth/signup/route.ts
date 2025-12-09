import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/database/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendOTP } from "@/lib/mail";

export async function POST(request: NextRequest) {
  try {
    // ✅ Parse request body safely
    const body = await request.json();
    const { name, email, password } = body;

    // ✅ Validate required fields
    if (!name || !email || !password ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Normalize email
    const userEmail = email.toLowerCase().trim();

    // ✅ Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password with strong salt
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate secure OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // OTP expiration (10 minutes)
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    // Create user (inactive by default)
    const user = await prisma.user.create({
      data: {
        name,
        email: userEmail,
        password: hashedPassword,
        otpCode: otp,
        otpExpiresAt: expires,
        isVerified: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isVerified: true,
        createdAt: true,
      }, // ✅ Never return password
    });

    // Dev-only logging (remove in production)
    if (process.env.NODE_ENV === "development") {
      console.log("OTP:", otp);
      console.log("Expires:", expires);
    }

    await sendOTP(user.email, otp);
    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully. Please verify OTP.",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
